# nextTick


<!-- TOC -->

- [nextTick](#nexttick)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [环境](#环境)
    - [安装](#安装)
    - [Store](#store)
        - [数据的响应式化](#数据的响应式化)
        - [commit](#commit)
        - [dispatch](#dispatch)
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
    // src/store.js

    import applyMixin from './mixin'

    // ...

    export function install (_Vue) {
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
    // src/mixin.js

    export default function (Vue) {
    const version = Number(Vue.version.split('.')[0])

    if (version >= 2) {
        Vue.mixin({ beforeCreate: vuexInit })
    } else {
        // override init and inject vuex init procedure
        // for 1.x backwards compatibility.
        const _init = Vue.prototype._init
        Vue.prototype._init = function (options = {}) {
        options.init = options.init
            ? [vuexInit].concat(options.init)
            : vuexInit
        _init.call(this, options)
        }
    }

    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function vuexInit () {
        const options = this.$options
        // store injection
        if (options.store) {
        this.$store = typeof options.store === 'function'
            ? options.store()
            : options.store
        } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
        }
    }
    }
    ```
3. `Vue.mixin({ beforeCreate: vuexInit })` 这一步的逻辑，通过全局混入，为每个组件的 `beforeCreate` 钩子方法都加入了 `vuexInit` 逻辑，设置了 vuex 的初始化逻辑。
4. 我们知道，在实例化根 Vue 实例的时候，会传入 store 实例
    ```js
    new Vue({
        el: '#app',
        store
    });
    ```
5. 所以如果 `vuexInit` 在根 Vue 的 `beforeCreate` 钩子被调用时，这里的 `options.store` 就能引用到 store 实例，在进一步通过组件的 `$store` 属性引用到 store 实例。
6. 如果不是根 Vue 实例，则可以通过层层的 `options.parent.$store` 引用到 store 实例。


## Store
### 数据的响应式化
1. 首先我们需要在 `Store` 的构造函数中对 `state` 进行「响应式化」
    ```js    
    // src/store.js
    
    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    const silent = Vue.config.silent
    Vue.config.silent = true
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })
    Vue.config.silent = silent
    ```

### commit
```js
// src/store.js

commit(_type, _payload, _options) {
    // check object-style commit
    const { type, payload, options } = unifyObjectStyle(
        _type,
        _payload,
        _options
    );

    const mutation = { type, payload };
    const entry = this._mutations[type];
    if (!entry) {
        if (__DEV__) {
            console.error(`[vuex] unknown mutation type: ${type}`);
        }
        return;
    }
    this._withCommit(() => {
        entry.forEach(function commitIterator(handler) {
            handler(payload);
        });
    });

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

### dispatch
```js
// src/store.js

dispatch (_type, _payload) {
    // check object-style dispatch
    const {
        type,
        payload
    } = unifyObjectStyle(_type, _payload)

    const action = { type, payload }
    const entry = this._actions[type]
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


## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)