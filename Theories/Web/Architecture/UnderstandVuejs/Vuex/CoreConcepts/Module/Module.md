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
2. 为什么不能像`state`那样独立的？我觉得可能的原因是，因为有些需求是一个 getter 需要从
不同的模块里获取数据来返回结果。如果它被设计为独立的，但却可以获取其他模块的数据，这样虽
然也不是不可以，但感觉上却比较奇怪。
3. 对于模块内部的 getter，接收的第一个参数是模块的局部（本模块的）state 对象；但由于
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
时所有模块的对应 mutation 都被触发，这时就不能注册成同名 mutation 了。不过也可以通过传
参指明要修改哪个模块的 state。
3. 下面的例子中，`moduleA`和`moduleB`中的`ageUp`都会被触发，按照先 a 后 b 的顺序，而
且各自的`age`都会得到更新。
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

    export default new Vuex.Store({
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
                return this.$store.state.a.age;
            },
            b_age(){
                return this.$store.state.b.age;
            },
        },
        mounted: {
            this.$store.commit('ageUp');
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
逻辑，而 getter 如果同名会导致读取一个数据的时候发生结果冲突。

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
