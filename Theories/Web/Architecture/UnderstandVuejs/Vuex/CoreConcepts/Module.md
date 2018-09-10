# Module


## 用途
1. 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，
store 对象就有可能变得相当臃肿。
2. 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的
state、mutation、action、getter、甚至是嵌套子模块 —— 从上至下进行同样方式的分割。



## `state`
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
1. 和`state`不同，各个 store 模块的 getter 是定义在同一个`getters`对象的。在不同的
store 模块里不能定义同名 getter，否则会报错。  不懂为什么不能像`state`那样独立的？
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
1. 虽然在各个 store 模块的 mutation 也是和`getters`一样是定义在同一个`getters`对象的
，但是在不同的store 模块里定义同名 mutation 并不会报错，而是会共存。在实例里提交该同名
mutation 的时候，所以重复定义的 mutation 回调都会按照顺序调用。
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
