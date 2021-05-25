# Vuex


<!-- TOC -->

- [Vuex](#vuex)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [环境](#环境)
    - [安装](#安装)
    - [构造函数](#构造函数)
    - [数据的响应式化——resetStoreVM](#数据的响应式化resetstorevm)
    - [commit](#commit)
    - [dispatch](#dispatch)
        - [注册 action](#注册-action)
    - [watch](#watch)
    - [registerModule](#registermodule)
    - [unregisterModule](#unregistermodule)
    - [resetStore](#resetstore)
    - [严格模式](#严格模式)
    - [devtool 插件](#devtool-插件)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 本质


## 环境
key | value
--|--
源码版本 | v3.5.1


## 安装
1. Vue.js 提供了一个 `Vue.use` 的方法来安装插件，内部会调用插件提供的 `install` 方法。Vuex 作为插件，需要提供一个 `install` 方法来安装
    ```js
    // /src/store.js

    import applyMixin from './mixin'

    // ...

    export function install (_Vue) {
        // 避免重复安装
        if (Vue && _Vue === Vue) {
            if (__DEV__) {
            console.error(
                '[vuex] already installed. Vue.use(Vuex) should be called only once.'
            )
            }
            return
        }
        Vue = _Vue
        applyMixin(Vue)
    }
    ```
2. 可以看到，安装时的具体工作是在 `applyMixin` 中进行的，该方法所在模块代码如下
    ```js
    // /src/mixin.js

    export default function (Vue) {
        const version = Number(Vue.version.split('.')[0]);

        // Vue 2.x 版本之前的 beforeCreate 钩子名为 init
        // https://vuejs.org/v2/guide/migration.html#init-renamed
        if (version >= 2) {
            Vue.mixin({ beforeCreate: vuexInit });
        } 
        else {
            // 按照 mixin 的顺序重写 init 方法
            // override init and inject vuex init procedure
            // for 1.x backwards compatibility.
            const _init = Vue.prototype._init;
            Vue.prototype._init = function (options = {}) {
                options.init = options.init 
                                ? [vuexInit].concat(options.init) 
                                : vuexInit;
                _init.call(this, options);
            };
        }

        // 把 store 实例注册到 vm 实例的 $store 属性上
        /**
        * Vuex init hook, injected into each instances init hooks list.
        */
        function vuexInit() {
            const options = this.$options;
            // store injection
            if (options.store) {
            this.$store = typeof options.store === 'function' 
                            ? options.store() 
                            : options.store;
            } 
            else if (options.parent && options.parent.$store) {
                this.$store = options.parent.$store;
            }
        }
    }
    ```
3. 我们知道，在实例化根 Vue 实例的时候，会传入 store 实例
    ```js
    new Vue({
        el: '#app',
        store
    });
    ```
4. 所以如果 `vuexInit` 在根 Vue 的 `beforeCreate` 钩子被调用时，上面的 `options.store` 就能引用到 store 实例，再进一步通过 `$store` 属性引用到 store 实例。
6. 如果不是根 Vue 实例，则可以通过层层的 `options.parent.$store` 引用到 store 实例。


## 构造函数
1. 源码
    ```js
    // /src/store.js

    
    // 从上面 install 的实现可以看到，install 之后 Vue 才会被设置值
    let Vue // bind on install

    export class Store {

        constructor(options = {}) {
            // Auto install if it is not done yet and `window` has `Vue`.
            // To allow users to avoid auto-installation in some cases,
            // this code should be placed here. See #731
            if (!Vue && typeof window !== "undefined" && window.Vue) {
                install(window.Vue);
            }

            if (__DEV__) {
                assert(
                    Vue,
                    `must call Vue.use(Vuex) before creating a store instance.`
                );
                assert(
                    typeof Promise !== "undefined",
                    `vuex requires a Promise polyfill in this browser.`
                );
                assert(
                    this instanceof Store,
                    `store must be called with the new operator.`
                );
            }

            const { 
                // plugins 包含应用在 store 上的插件方法。
                // 这些插件直接接收 store 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）
                // 或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）
                // 文档 https://vuex.vuejs.org/zh/guide/plugins.html
                plugins = [], 
                
                // 默认为非严格模式
                strict = false 
            } = options;

            // store internal state
            this._committing = false; // 用来判断严格模式下是否是用 mutation 修改 state 的
            this._actions = Object.create(null); // 存放 action
            this._actionSubscribers = [];
            this._mutations = Object.create(null); // 存放 mutation
            this._wrappedGetters = Object.create(null); // 存放 getter
            this._modules = new ModuleCollection(options);
            this._modulesNamespaceMap = Object.create(null); // 根据 namespace 存放 module
            this._subscribers = [];
            this._watcherVM = new Vue(); // 用以实现 Watch 的 Vue 实例
            this._makeLocalGettersCache = Object.create(null);

            // bind commit and dispatch to self
            // 看起来是为了在 action 中直接使用 dispatch 和 commit 调用时也能保证 this 指向 store 实例。例如
            // actions: {
            //     async actionB ({ dispatch }) {
            //         await dispatch('actionA');
            //     }
            // }
            const store = this;
            const { dispatch, commit } = this;
            this.dispatch = function boundDispatch(type, payload) {
                return dispatch.call(store, type, payload);
            };
            this.commit = function boundCommit(type, payload, options) {
                return commit.call(store, type, payload, options);
            };

            // strict mode
            this.strict = strict;

            const state = this._modules.root.state;

            // init root module.
            // this also recursively registers all sub-modules
            // and collects all module getters inside this._wrappedGetters
            // this._modules.root 代表根 module 才独有保存的 Module 对象
            installModule(this, state, [], this._modules.root);

            // initialize the store vm, which is responsible for the reactivity
            // (also registers _wrappedGetters as computed properties)
            resetStoreVM(this, state);

            // apply plugins
            plugins.forEach(plugin => plugin(this));

            const useDevtools =
                options.devtools !== undefined
                    ? options.devtools
                    : Vue.config.devtools;
            if (useDevtools) {
                devtoolPlugin(this);
            }
        }

        // ...
    }
    ```
2. 满足 `!Vue && typeof window !== "undefined" && window.Vue` 时会自动 install Vuex，也就是说不能再调用 `Vue.use(Vuex)`，否则会报错 `[vuex] already installed. Vue.use(Vuex) should be called only once.`。
3. `installModule` 的作用主要是为 module 加上 namespace （如果有）后，注册 mutation、action 以及 getter，同时递归安装所有子module
    ```js
    // /src/store.js

    function installModule(store, rootState, path, module, hot) {
        const isRoot = !path.length;
        const namespace = store._modules.getNamespace(path);

        // register in namespace map
        if (module.namespaced) {
            if (store._modulesNamespaceMap[namespace] && __DEV__) {
                console.error(
                    `[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join(
                        "/"
                    )}`
                );
            }
            store._modulesNamespaceMap[namespace] = module;
        }

        // set state
        if (!isRoot && !hot) {
            const parentState = getNestedState(rootState, path.slice(0, -1));
            const moduleName = path[path.length - 1];
            store._withCommit(() => {
                if (__DEV__) {
                    if (moduleName in parentState) {
                        console.warn(
                            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join(
                                "."
                            )}"`
                        );
                    }
                }
                Vue.set(parentState, moduleName, module.state);
            });
        }

        const local = (module.context = makeLocalContext(store, namespace, path));

        module.forEachMutation((mutation, key) => {
            const namespacedType = namespace + key;
            registerMutation(store, namespacedType, mutation, local);
        });

        module.forEachAction((action, key) => {
            const type = action.root ? key : namespace + key;
            const handler = action.handler || action;
            registerAction(store, type, handler, local);
        });

        module.forEachGetter((getter, key) => {
            const namespacedType = namespace + key;
            registerGetter(store, namespacedType, getter, local);
        });

        module.forEachChild((child, key) => {
            installModule(store, rootState, path.concat(key), child, hot);
        });
    }
    ```
4. `resetStoreVM`


## 数据的响应式化——resetStoreVM
```js
// /src/store.js

function resetStoreVM(store, state, hot) {
    const oldVm = store._vm;

    // bind store public getters
    store.getters = {};
    // reset local getters cache
    store._makeLocalGettersCache = Object.create(null);
    const wrappedGetters = store._wrappedGetters;
    const computed = {};
    // 通过 Object.defineProperty 为每一个 getter 方法设置 get 方法，
    // 比如获取 this.$store.getters.test 的时候获取的是 store._vm.test，也就是 Vue 对象的 computed 属性
    forEachValue(wrappedGetters, (fn, key) => {
        // use computed to leverage its lazy-caching mechanism
        // direct inline function use will lead to closure preserving oldVm.
        // using partial to return function with only arguments preserved in closure environment.
        computed[key] = partial(fn, store);
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key],
            enumerable: true // for local getters
        });
    });

    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    const silent = Vue.config.silent;
    Vue.config.silent = true;
    // 运用 Vue 内部的响应式机制对 state 进行响应式化
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    });
    Vue.config.silent = silent;

    // enable strict mode for new vm
    if (store.strict) {
        enableStrictMode(store);
    }

    // 解除旧 vm 的 state 的引用，以及销毁旧的 Vue 对象
    if (oldVm) {
        if (hot) {
            // dispatch changes in all subscribed watchers
            // to force getter re-evaluation for hot reloading.
            store._withCommit(() => {
                oldVm._data.$$state = null;
            });
        }
        Vue.nextTick(() => oldVm.$destroy());
    }
}
```


## commit
1. 源码
    ```js
    // /src/store.js

    commit(_type, _payload, _options) {
        // check object-style commit
        const { type, payload, options } = unifyObjectStyle(
            _type,
            _payload,
            _options
        );

        const mutation = { type, payload };
        const entry = this._mutations[type]; // 取出 type 对应的 mutation 的方法
        if (!entry) {
            if (__DEV__) {
                console.error(`[vuex] unknown mutation type: ${type}`);
            }
            return;
        }

        // 执行 mutation 中的所有方法
        // 之所以有多个方法，是因为当没有 namespace 的时候，commit 方法会触发所有 module 中的 mutation 方法。
        this._withCommit(() => {
            entry.forEach(function commitIterator(handler) {
                handler(payload);
            });
        });

        // 通知所有订阅者
        this._subscribers
            .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
            .forEach(sub => sub(mutation, this.state));

        if (__DEV__ && options && options.silent) {
            console.warn(
                `[vuex] mutation type: ${type}. Silent option has been removed. ` +
                    "Use the filter functionality in the vue-devtools"
            );
        }
    },
    ```
2. Store 给外部提供了一个 `subscribe` 方法，用以注册一个订阅函数，会 push 到 Store 实例的 `_subscribers` 中，同时返回一个从 `_subscribers` 中注销该订阅者的方法
    ```js
    // /src/store.js
    
    subscribe (fn, options) {
        return genericSubscribe(fn, this._subscribers, options)
    }

    // ... 

    function genericSubscribe(fn, subs, options) {
        if (subs.indexOf(fn) < 0) {
            options && options.prepend ? subs.unshift(fn) : subs.push(fn);
        }
        return () => {
            const i = subs.indexOf(fn);
            if (i > -1) {
                subs.splice(i, 1);
            }
        };
    }
    ```
3. 在 commit 结束以后则会调用这些 `_subscribers` 中的订阅者，这个订阅者模式提供给外部一个监视 state 变化的可能。state 通过 mutation 改变时，可以有效捕获这些变化。


## dispatch
1. 源码
    ```js
    // /src/store.js

    dispatch (_type, _payload) {
        // check object-style dispatch
        const {
            type,
            payload
        } = unifyObjectStyle(_type, _payload)

        const action = { type, payload }
        const entry = this._actions[type] // actions 中取出 type 对应的 action
        if (!entry) {
            if (__DEV__) {
                console.error(`[vuex] unknown action type: ${type}`)
            }
            return
        }

        try {
            this._actionSubscribers
                .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
                .filter(sub => sub.before)
                .forEach(sub => sub.before(action, this.state))
        } 
        catch (e) {
            if (__DEV__) {
                console.warn(`[vuex] error in before action subscribers: `)
                console.error(e)
            }
        }
        // 如果是多个 action 则包装为一个整体的 promise 调用，否则就是单独的 promise 调用
        const result = entry.length > 1
            ? Promise.all(entry.map(handler => handler(payload)))
            : entry[0](payload)

        return new Promise((resolve, reject) => {
            result.then(res => {
                try {
                    this._actionSubscribers
                        .filter(sub => sub.after)
                        .forEach(sub => sub.after(action, this.state))
                } 
                catch (e) {
                    if (__DEV__) {
                        console.warn(`[vuex] error in after action subscribers: `)
                        console.error(e)
                    }
                }
                resolve(res)
            }, error => {
                try {
                    this._actionSubscribers
                        .filter(sub => sub.error)
                        .forEach(sub => sub.error(action, this.state, error))
                } 
                catch (e) {
                    if (__DEV__) {
                        console.warn(`[vuex] error in error action subscribers: `)
                        console.error(e)
                    }
                }
                reject(error)
            })
        })
    },
    ```

### 注册 action
1. 源码
    ```js
    // /src/store.js
    
    function registerAction(store, type, handler, local) {
        // 取出 type 对应的 action
        const entry = store._actions[type] || (store._actions[type] = []);
        entry.push(function wrappedActionHandler(payload) {
            let res = handler.call(
                store,
                {
                    dispatch: local.dispatch,
                    commit: local.commit,
                    getters: local.getters,
                    state: local.state,
                    rootGetters: store.getters,
                    rootState: store.state
                },
                payload
            );
            if (!isPromise(res)) {
                // 不是 Promise 对象的时候转化称 Promise 对象
                res = Promise.resolve(res);
            }
            if (store._devtoolHook) {
                // 存在 devtool 插件的时候触发 vuex 的 error 给 devtool
                return res.catch(err => {
                    store._devtoolHook.emit("vuex:error", err);
                    throw err;
                });
            } else {
                return res;
            }
        });
    }
    ```
2. TODO


## watch
watch 一个 `getter` 方法
```js
// /src/store.js

watch (getter, cb, options) {
    if (__DEV__) {
        assert(typeof getter === 'function', `store.watch only accepts a function.`)
    }
    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
}
```


## registerModule
注册一个动态 module，当业务进行异步加载的时候，可以通过该接口进行注册动态 module
```js
// /src/store.js

registerModule (path, rawModule, options = {}) {
    if (typeof path === 'string') path = [path]

    if (__DEV__) {
        assert(Array.isArray(path), `module path must be a string or an Array.`)
        assert(path.length > 0, 'cannot register the root module by using registerModule.')
    }

    this._modules.register(path, rawModule)
    installModule(this, this.state, path, this._modules.get(path), options.preserveState)
    // reset store to update getters...
    // 通过 vm 重设 store，新建 Vue 对象使用 Vue 内部的响应式实现注册 state 以及 computed
    resetStoreVM(this, this.state)
}
```

## unregisterModule
与 `registerModule` 对应的方法，动态注销模块。实现方法是先从 state 中删除模块，然后用 `resetStore` 来重制 store。
```js
// /src/store.js

unregisterModule (path) {
    if (typeof path === 'string') path = [path]

    if (__DEV__) {
        assert(Array.isArray(path), `module path must be a string or an Array.`)
    }

    this._modules.unregister(path)
    this._withCommit(() => {
        // 获取父级的 state
        const parentState = getNestedState(this.state, path.slice(0, -1))
        // 从父级中删除
        Vue.delete(parentState, path[path.length - 1])
    })
    resetStore(this)
}
```


## resetStore
这里的 `resetStore` 其实也就是将 store 中的 `_actions` 等进行初始化以后，重新执行 `installModule` 与 `resetStoreVM` 来初始化 module 以及用 Vue 特性使其 “响应式化”，这跟构造函数中的是一致的。
```js
// /src/store.js

function resetStore (store, hot) {
    store._actions = Object.create(null)
    store._mutations = Object.create(null)
    store._wrappedGetters = Object.create(null)
    store._modulesNamespaceMap = Object.create(null)
    const state = store.state
    // init all modules
    installModule(store, state, [], store._modules.root, true)
    // reset vm
    resetStoreVM(store, state, hot)
}
```


## 严格模式
1. 设置严格模式
    ```js
    // /src/store.js

    function enableStrictMode (store) {
    store._vm.$watch(function () { return this._data.$$state }, () => {
        if (__DEV__) {
            assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
        }
    }, { deep: true, sync: true })
    }
    ```
2. 首先，在严格模式下，Vuex 会利用 vm 的 `$watch` 方法来观察 `$$state`，也就是 Store 的 state，在它被修改的时候进入回调。我们发现，回调中只有一句话，用 `assert` 断言来检测 `store._committing`，当 `store._committing` 为 `false` 的时候会触发断言，抛出异常。
3. Store 的 `commit` 方法中，执行 mutation 的语句是这样的
    ```js
    // /src/store.js
    
    this._withCommit(() => {
        entry.forEach(function commitIterator (handler) {
            handler(payload)
        })
    })
    ```
4. `_withCommit` 的实现
    ```js
    // /src/store.js

    _withCommit (fn) {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
    }
    ```
5. 通过 `commit`（mutation）修改 state 数据的时候，会在调用 `mutation` 方法之前将 `committing` 置为 `true`，接下来再通过mutation 函数修改 state 中的数据，这时候触发 `$watch` 中的回调断言 `committing` 是不会抛出异常的。而当我们直接修改 state 的数据时，触发 `$watch` 的回调执行断言，这时 `committing` 为 `false`，则会抛出异常。


## devtool 插件
```js
// /src/plugins/devtool.js

// 如果已经安装了该插件，则会在全局对象上暴露一个__VUE_DEVTOOLS_GLOBAL_HOOK__
// 从全局对象的 __VUE_DEVTOOLS_GLOBAL_HOOK__ 中获取 devtool 插件
const target = typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
        ? global
        : {}
const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
    if (!devtoolHook) return

    // devtoll 插件实例存储在 store 的 _devtoolHook 上
    store._devtoolHook = devtoolHook

    // 触发 vuex 的初始化事件，并将 store 的引用地址传给 deltool 插件，使插件获取 store 的实例
    devtoolHook.emit('vuex:init', store)

    // 监听 travel-to-state 事件
    devtoolHook.on('vuex:travel-to-state', targetState => {
        // 重制 state
        store.replaceState(targetState)
    })

    store.subscribe((mutation, state) => {
        devtoolHook.emit('vuex:mutation', mutation, state)
    }, { prepend: true })

    // 订阅 store 的变化
    store.subscribeAction((action, state) => {
        devtoolHook.emit('vuex:action', action, state)
    }, { prepend: true })
}
```


## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)
* [Vuex源码解析](https://github.com/answershuto/learnVue/blob/master/docs/Vuex源码解析.MarkDown)