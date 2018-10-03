# Module


## 用途
1. 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，
store 对象就有可能变得相当臃肿。
2. 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的
state、mutation、action、getter、甚至是嵌套子模块 —— 从上至下进行同样方式的分割。


## store 模块中各属性的定义和访问
### `state`
1. `state`和其他几个属性不同，每个模块有自己独立的 state。
2. 所以在组件内，`this.$store.state`也和其他几个属性不同。其他几个属性，比如
`this.$store.getters`就直接包含了所有的 getter，可以直接访问比如
`this.$store.getters.foo`、`this.$store.getters.bar`；而 state 是分模块的，所以还
需要再分一次模块：`this.$store.state.moduleA.age`、`this.$store.state.moduleB.age`
3. 而且从上一步的描述可以看出来，不同模块可以定义同名的 state 属性，因为是分模块的；但
却不能定义同名的 getter、mutation 和 action，因为它们都是定义在同一个对象里的

```js
// store
const moduleA = {
    state: {
        name: 'Hime',
    },
};

const moduleB = {
    state: {
        name: 'Hina',
    },
};

export const store = new Vuex.Store({
    // 通过 modules 属性引用不同的模块
    modules: {
        // 自定义 store 中的模块名
        a: moduleA,
        b: moduleB,
    },
});
```
```js
// vm
computed: {
    a_name(){
        return this.$store.state.a.name; // Hime
    },
    b_name(){
        return this.$store.state.b.name; // Hina
    },
},
```

### `getters`
1. 和`state`不同，各个 store 模块以及 store root 中的 getter 是定义在同一个`getters`
对象的。在不同的 store 模块以及 store root 里不能定义同名 getter，否则会报错。  
不懂为什么不能像`state`那样独立的？
    ```js
    const moduleA = {
        getters: {
            age(state){},
        },
    };

    const moduleB = {
        getters: {
            age(state){},
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
    });
    ```
    报错：`[vuex] duplicate getter key: age`
2. 对于模块内部的 getter，接收的第一个参数是模块的局部（本模块的）state 对象；但由于
`getters`是共享的，所以第二个参数就是共享`getters`对象
    ```js
    // store
    const moduleA = {
        state: {
            name: 'Hime',
            age: 22,
        },
        getters: {
            a_nominal_age(state){
                return state.age + 1;
            },
            a_greeting(state, getters){
                return `I'm ${state.name},
                        ${getters.a_nominal_age + getters.b_nominal_age} years old`;
                // I'm Hime, 47 years old
            },
        },
    };

    const moduleB = {
        state: {
            name: 'Hina',
            age: 23,
        },
        getters: {
            b_nominal_age(state){
                return state.age + 1;
            },
            b_greeting(state, getters){
                return `I'm ${state.name},
                        ${getters.b_nominal_age + getters.a_nominal_age} years old`;
                // I'm Hina, 47 years old        
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
    });
    ```

### `mutations`
1. 虽然在各个 store 模块以及 store root 里的 mutation 也是和`getters`一样是定义在同
一个`mutations`对象的，但是在不同的 store 模块以及 store root 里定义同名 mutation 并
不会报错，而是会共存。在实例里提交该同名 mutation 的时候，所有重复定义的 mutation 回调
都会按照顺序调用，store root 如果也有同名的 mutation，那最先调用的是 store root 里的。
2. 这个倒也合理，类似于给同一个事件添加若干个事件监听。但有时也会不希望提交一个 commit
时所有模块的对应 mutation，这是就不能注册成同名 mutation 了。不过也可以通过传参指明要
修改哪个模块的 state。
3. 下面的例子中，不管是调用`aAgeUp`还是`bAgeUp`，`moduleA`和`moduleB`中的`ageUp`都会
被触发，按照先 a 后 b 的顺序，而且各自的`age`都会得到更新。
    ```js
    // store
    const moduleA = {
        state: {
            age: 22,
        },
        mutations: {
            ageUp(state){
                console.log('a');
                state.age++;
            },
        },
    };

    const moduleB = {
        state: {
            age: 23,
        },
        mutations: {
            ageUp(state){
                console.log('b');
                state.age++;
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
    });
    ```
    ```js
    // vm
    export default {
        computed: {
            a_age(){
                return this.$store.state.a.age; // Hime
            },
            b_age(){
                return this.$store.state.b.age; // Hina
            },
        },
        methods: {
            aAgeUp(){
                this.$store.commit('ageUp');
            },
            bAgeUp(){
                this.$store.commit('ageUp');
            },
        },
    }
    ```

### `actions`
和`mutations`一样，在不同的 store 模块以及 store root 里定义同名 action 会共存。在实
例里提交该同名 action 的时候，所有重复定义的 action 回调都会按照顺序调用，store root
如果也有同名的 action，那最先调用的是 store root 里的。


## root
除了每个子模块里自己的 state、getter、mutation 和 action，root 上仍然可以保留 root
级别的 state、getter、mutation 和 action。

### state
1. 子模块中，getter 的第三个参数以及 action context 参数的`rootState`属性都可以引用
root state。
2. 但是 mutation 没有可以引用 root state 的参数，应该是为了不让子模块修改根状态。
3. 而且，虽然好像没什么必要，但 root 中 getter 的第三个参数以及 action context 参数的
`rootState`属性也可以引用 root state。
4. `rootState`及`context.rootState`名字有些不太准确，因为它不仅包含 root 中的 state，
还包含所有子模块中的 state。

```js
const moduleA = {
    state: {
        age: 21,
    },
    getters: {
        a_root_age(state, getters, rootState){
            console.log(rootState.b.age); // 23  包含所有的 state，而不仅仅是 root 里的
            return rootState.age; // 22
        },
    },
    actions: {
        ageUp({rootState}){
            console.log(rootState.age); // 22
        },
    },
};

const moduleB = {
    state: {
        age: 23,
    },
    getters: {
        b_root_age(state, getters, rootState){
            console.log(rootState.a.age); // 21  包含所有的 state，而不仅仅是 root 里的
            return rootState.age; // 22
        },
    },
    actions: {
        ageUp({rootState}){
            console.log(rootState.age); // 22
        },
    },
};


export const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB,
    },
    state: {
        age: 22,
    },
    getters: {
        // root 中也可以使用 rootState 参数
        root_age(state, getters, rootState){
            console.log(rootState.a.age); // 21
            console.log(rootState.b.age); // 23
            return `${state.age}, ${rootState.age}`; // "22, 22"
        },
    },
    actions: {
        // root 中也可以使用 rootState 属性
        ageUp({state, rootState}){
            console.log(state.age); // 22
            console.log(rootState.age); // 22
        },
    },
});
```

4. 实例里访问 root state 的方法还和原来的一样
    ```js
    computed: {
        root_age(){
            return this.$store.state.age; // 22
        },
    }
    ```

### getter
1. 如之前说到的，store root 里也不能定义和子模块中同名的 getter。
2. mutation 和 action 可以同名共存是因为一个提交可以让 root 和不同的模块有各自的处理
逻辑，而 getter 如果同名会导致读取一个数据的时候发生结果冲突。但还不是不懂为什么
getter 不能设计成 state 那样独立的呢？

### mutation 和 action
1. 如之前说的，store root 中和子模块中出现同名的 mutation 和 action，先调用 root 中的，
再依次调用子模块中的
    ```js
    const moduleA = {
        mutations: {
            ageUp(state){
                console.log('a mutation');
            },
        },
        actions: {
            ageUp({rootState}){
                console.log('a action');
            },
        },
    };

    const moduleB = {

        mutations: {
            ageUp(state){
                console.log('b mutation');
            },
        },
        actions: {
            ageUp({rootState}){
                console.log('b action');
            },
        },
    };


    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
        mutations: {
            ageUp(state){
                console.log('root mutation');
            },
        },
        actions: {
            ageUp({state, rootState}){
                console.log('root action');
            },
        },
    });
    ```
2. `commit('ageUp')`时，输出为
    ```
    root mutation
    a mutation
    b mutation
    ```
3. `dispatch('ageUp')`时，输出为
    ```
    root action
    a action
    b action
    ```


## Namespacing
1. 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
2. 如果希望你的模块具有更高的封装度和复用性，你可以通过添加`namespaced: true`的方式使
其成为带命名空间的模块。
3. 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整
命名。

```js
const moduleA = {
    getters: {
        isAdmin () { // -> getters['b/isAdmin']
            return 'a_isAdmin';
        },
    },
};

const moduleB = {
    namespaced: true,

    state: {}, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
    getters: {
        // 和 moduleA 的同名，但因为有命名空间所以不会冲突
        isAdmin () { // -> getters['b/isAdmin']
            return 'b_isAdmin';
        },
    },
    actions: {
        login () {}, // -> dispatch('b/login')
    },
    mutations: {
        login () {}, // -> commit('b/login')
    },

    // 嵌套模块
    modules: {
        // 继承父模块的命名空间
        myPage: {
            state: {},
            getters: {
                profile () {}, // -> getters['b/profile']
                // isAdmin () {}, // 这里不能重复定义
            },
        },

        // 进一步嵌套命名空间
        posts: {
            namespaced: true,

            state: {},
            getters: {
                popular () {}, // -> getters['b/posts/popular']
                isAdmin () {}, // 这里可以再定义同名的，因为又有了嵌套命名空间
            },
            mutations: {
                remove () { // -> commit('b/posts/login')
                    console.log('remove');
                },
            },
        },
    },
};

export const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB,
    },
});
```

### Global getters
1. 在命名空间模块里，因为 getters 也变成局部的了，所以在 getter 的第三个参数以及
action 的`context.getters`也都是局部的了。
2. 如果要在命名空间模块里访问全局的 getter，这里有了和 root state 类似的 root
getters。可以通过 getter 的第四个参数以及 action 的`context.rootGetters`访问。
3. 和 root state 一样，root getters 不仅包括 root 中的 getter，也包括所有模块的
getter。
4. 下面四个`console.log`的输出都是
`["root_getter", "a_getter", "b/b_getter", "b/page_getter", "b/posts/posts_getter"]`
，顺序看起来也很合理。
    ```js
    const moduleA = {
        getters: {
            a_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
    };

    const moduleB = {
        namespaced: true,
        getters: {
            b_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
        modules: {
            myPage: {
                getters: {
                    page_getter(state, getters, rootState, rootGetters){
                        console.log(Object.keys(rootGetters));
                    },
                },
            },

            // 进一步嵌套命名空间
            posts: {
                namespaced: true,
                getters: {
                    posts_getter(state, getters, rootState, rootGetters){
                        console.log(Object.keys(rootGetters));
                    },
                },
            },
        },
    };


    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
        getters: {
            root_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
    });
    ```

### 在带命名空间的模块注册全局 action
1. 不懂，为什么要在这里注册全局 action？
2. 若需要在带命名空间的模块注册全局 action，需要把这个 action 注册为一个对象类型，该对
象可添加属性`root: true`，并用`handler`定义 action 的处理函数。
3. 虽然是定义成了全局 action，但是参数 context 仍然是模块内的
    ```js
    const moduleB = {
        namespaced: true,
        state: {
            age: 23,
        },
        actions: {
            b_action: {
                root: true,
                handler(ctx){
                    console.log('global_action');
                    console.log(ctx.state.age); // 23
                },
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            b: moduleB,
        },
        state: {
            age: 22,
        },
    });
    ```
4. 在组件实例里要通过全局的方式来 dispatch
    ```js
    this.$store.dispatch('b_action');
    ```
5. 在不带命名空间的模块里也可以这样注册 action，但没什么意义

### Binding Helpers with Namespace
1. 默认情况下，对带有命名空间的模块使用 Binding Helpers 有些复杂，在组件里的每一次引用
都要带上完整的路径
    ```js
    // store
    const moduleB = {
        namespaced: true,
        state: {
            b_age: 23,
        },
        getters: {
            b_getter(){
                return 'b_getter';
            },
        },
        mutations: {
            b_mutation(state, payload){
                console.log(payload.name); // "b_mutation"
            },
        },
        actions: {
            b_action(ctx, payload){
                console.log(payload.name); // "b_action"
            },
        },
        modules: {
            inner: {
                state: {
                    inner_age: 24,
                },
            },
            inner_ns: {
                namespaced: true,
                state: {
                    inner_ns_age: 25,
                },
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            b: moduleB,
        },
        state: {
            root_age: 22,
        },
    });
    ```
    ```html
    <!-- template -->
    <div>
        <p>
            <input type="button" value="b_mutation"
                @click="b_mutation({name: 'b_mutation'})" />
            <input type="button" value="b_action"
                @click="b_action({name: 'b_action'})" />
        </p>
        <p>

            {{root_age}}      <!-- 22 -->
            {{b_age}}         <!-- 23 -->
            {{inner_age}}     <!-- 24 -->
            {{inner_ns_age}}  <!-- 25 -->
            {{b_getter}}      <!--b_getter -->
        </p>
    </div>
    ```
    ```js
    // vm
    computed: {
        ...mapState({
            root_age: 'root_age',
            // b_age: 'b/b_age', // 不能这样
            b_age: state=>state.b.b_age,
            inner_age: state=>state.b.inner.inner_age,
            inner_ns_age: state=>state.b.inner_ns.inner_ns_age,
        }),
        ...mapGetters({
            b_getter: 'b/b_getter',
        }),
    },
    methods: {
        ...mapMutations({
            b_mutation: 'b/b_mutation',
        }),
        ...mapActions({
            b_action: 'b/b_action',
        }),
    },
    ```
2. 把路径字符串中的**命名空间路径**作为第一个参数传给 Binding Helpers，之后的所有引用
时就都不需要带路径。
3. 注意，只能是命名空间路径，不带命名空间的子模块的模块名不能被提取出来。例如
`state.b.inner.inner_age`，只能提取出公共路径`'b'`，而不能提取出`'b/inner'`，因为
`inner`模块没有命名空间；而`state.b.inner_ns.inner_ns_age`就可以提取出`'b/inner_ns'`
    ```js
    computed: {
        ...mapState(['root_age']),
        ...mapState({
            b_age: state=>state.b.b_age,
        }),
        ...mapState('b', {
            inner_age: state=>state.inner.inner_age,
        }),
        ...mapState('b/inner_ns', {
            inner_ns_age: state=>state.inner_ns_age,
        }),
        ...mapGetters('b/', {
            b_getter: 'b_getter',
        }),
    },
    methods: {
        ...mapMutations('b/', {
            b_mutation: 'b_mutation',
        }),
        ...mapActions('b/', {
            b_action: 'b_action',
        }),
    },
    ```
4. 除了这种定义参数的方法以外，还可以在 import 这些 map 函数时就直接定义一个统一的路径
    ```js
    import { mapState } from 'vuex'
    // import { mapGetters } from 'vuex'
    // import { mapMutations } from 'vuex'
    // import { mapActions } from 'vuex'

    import { createNamespacedHelpers } from 'vuex'
    // 以下三个函数会自动设定路径，而通过常规方法 import 的 mapState 不受影响
    const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('b/');

    export default {
        computed: {
            ...mapState(['root_age']),
            ...mapState({
                b_age: state=>state.b.b_age,
            }),
            ...mapState('b', {
                inner_age: state=>state.inner.inner_age,
            }),
            ...mapState('b/inner_ns', {
                inner_ns_age: state=>state.inner_ns_age,
            }),
            ...mapGetters({
                b_getter: 'b_getter',
            }),
        },
        methods: {
            ...mapMutations({
                b_mutation: 'b_mutation',
            }),
            ...mapActions({
                b_action: 'b_action',
            }),
        },
    }
    ```

### Caveat for Plugin Developers
如果你开发的插件（Plugin）提供了模块并允许用户将其添加到 Vuex store，可能需要考虑模块
的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称
```js
// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
    return function (store) {
        // 把空间名字添加到插件模块的类型（type）中去
        const namespace = options.namespace || ''
        store.dispatch(namespace + 'pluginAction')
    }
}
```


## 模块动态注册
1. 在 store 创建之后，你可以使用`store.registerModule`方法注册模块
    ```js
    // store
    const moduleA = {
        state: {
            name: 'a',
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
        },
    });
    ```
    ```js
    // vm
    export default {
        beforeCreate(){
            // 注册模块 b
            this.$store.registerModule('b', {
                state: {
                    name: 'b',
                },
            });

            // 给模块 b 再注册一个子模块 inner
            this.$store.registerModule(['b', 'inner'], {
                state: {
                    name: 'inner',
                },
            });
        },
        computed: {
            ...mapState({
                a_name: state=>state.a.name,
                b_name: state=>state.b.name,
                inner_name: state=>state.b.inner.name,
            }),
        },
    }
    ```
2. 你也可以使用`store.unregisterModule(moduleName)`来动态卸载模块。注意，你不能使用
此方法卸载静态模块（即创建 store 时声明的模块）。不懂为什么写在子模块会报错
    ```js
    this.$store.unregisterModule('inner');
    // TypeError: Cannot read property 'runtime' of undefined

    // this.$store.unregisterModule('b.inner'); // 一样报错
    ```
3. `preserveState` 不懂。


## 模块重用
1. 有时我们可能需要创建一个模块的多个实例，例如：
    * 创建多个 store，他们公用同一个模块
    * 在一个 store 中多次注册同一个模块
2. 如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对
象被修改时 store 或模块间数据互相污染的问题。实际上这和 Vue 组件内的`data`是同样的问题
。因此解决办法也是相同的——使用一个函数来声明模块状态。
3. 下面两个模块里都有各自的`ageUp`，在实例里 commit 时，两个模块都会调用各自的`ageUp`。
如果是按照注释中的方法来定义`state`，则两个`ageUp`中引用的同一个对象，也就是会连续在一
个对象上修改两次，即`age`每次加2；现在使用函数来定义，每个`ageUp`中引用的不同的对象，只
会在自己引用的对象上加1
    ```js
    // store
    const moduleA = {
        state(){
            return {
                age: 22,
            };
        },
        // state: {
        //     age: 22,
        // },
        mutations: {
            ageUp(state){
                state.age++;
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleA,
        },
    });
    ```
