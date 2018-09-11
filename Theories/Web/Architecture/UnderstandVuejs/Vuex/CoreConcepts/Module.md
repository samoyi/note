# Module


## 用途
1. 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，
store 对象就有可能变得相当臃肿。
2. 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的
state、mutation、action、getter、甚至是嵌套子模块 —— 从上至下进行同样方式的分割。


## store 模块中各属性的定义和访问
### `state`
1. 每个 store 模块可以有自己的`state`
2. 组件内的`this.$store.state`包含所有 store 模块的 state

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
2. 对于模块内部的 getter，接收的第一个参数是模块的局部（本模块的）状态对象；但由于
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
一个`getters`对象的，但是在不同的 store 模块以及 store root 里定义同名 mutation 并不
会报错，而是会共存。在实例里提交该同名 mutation 的时候，所有重复定义的 mutation 回调都
会按照顺序调用，store root 如果也有同名的 mutation，那最先调用的是 store root 里的。
2. 下面的例子中，不管是调用`aAgeUp`还是`bAgeUp`，`moduleA`和`moduleB`中的`ageUp`都会
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
例里提交该同名 action 的时候，所以重复定义的 action 回调都会按照顺序调用，store root
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
还包含所有子模块中的 state。所以应该说是 globalState。

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
