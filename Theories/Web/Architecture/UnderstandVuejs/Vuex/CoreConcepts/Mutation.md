# Mutation


## 用途
1. 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Mutation 作为 store 的数据
修改接口提供给组件。
2. 使用 mutation 而不是直接修改 state 的好处，正如之前说明的：第一可以限制组件对数据的
随意修改；第二 mutation 相当于 setter，让你可以控制每次数据修改。


## 基本用法
1. 每个 mutation 对应`mutations`对象下的一个属性，属性值为函数，是该 mutation 实际要
进行的修改，该函数接受 state 作为第一个参数。
    ```js
    mutations: {
        increment (state) {
            state.count++;
        },
    },
    ```
2. 组件只能进行 mutations 中已定义的修改操作，通过提交 mutation 的方式
    ```js
    methods: {
        increment(){
            this.$store.commit('increment')
        },
    },
    ```


## 通过参数提交载荷
1. 如果定义 mutation 时定义了额外的参数，那就可以向`store.commit`传入额外的参数
    ```js
    // store
    state: {
        count: 0,
    },
    mutations: {
        increment (state, n) {
            state.count += n;
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.commit('increment', 2);
        },
    },
    ```
2. 不过为了和下面说的对象风格的提交方式时的形式统一，最好接受对象形式的参数
    ```js
    // store
    state: {
        count: 0,
    },
    mutations: {
        increment (state, payload) {
            state.count += payload.n;
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.commit('increment', {n: 2});
        },
    },
    ```


## 对象风格的提交方式
1. 提交 mutation 的另一种方式是直接使用包含`type`属性的对象
    ```js
    methods: {
        increment(){
            this.$store.commit({
                type: 'increment',
                n: 2,
            });
        },
    },
    ```
2. 以这种形式提交时，整个对象都作为载荷传给 mutation 函数
    ```js
    mutations: {
        increment (state, payload) {
            state.count += payload.n;
        },
    },
    ```


## Mutation 需遵守 Vue 的响应规则
因为`state`的数据是响应式的，也就是访问器属性。所以如果在 mutation 中给`state`添加新的
数据，也必须使用 Vue 中的方法：提前定义好以后要用的属性，或者使用`Vue.set`，或者对象整
体替换 `state.obj = { ...state.obj, newProp: 123 }`


## 使用常量替代 Mutation 事件类型
使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类
的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的
mutation 一目了然
```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```
```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
    state: { ... },
    mutations: {
        [SOME_MUTATION] (state) {
        }
    }
})
```


## Mutation 必须是同步函数
1. 当一个 mutation 函数被调用时，Vuex 的内部会记录该次 mutation 行为，并捕捉到前一状
态和后一状态的快照。
2. 看下面的异步函数例子
    ```js
    mutations: {
        someMutation (state) {
            api.callAsyncMethod(() => {
                state.count++
            })
        }
    }
    ```
3. 当`someMutation`被调用时，Vuex 记录该次 mutation 行为，但此时`callAsyncMethod`的
回调并没有触发，Vuex 现在捕获的`state.count`状态仍然是旧的状态值。
4. 使用下面的代码测试
    ```js
    // store
    mutations: {
        increment (state, payload) {
            setTimeout(()=>{
                state.count += payload.n;
            }, 2000);
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){ // 点击事件触发
            this.$store.commit('increment', {n: 2});
        },
    },
    ```
5. 连续三次点击，会连续三次执行`increment` mutation，两秒钟之后，`count`会迅速连续变
成`2`、`4`、`6`。
6. 这对于单纯的应用使用上没什么问题，是符合预期的。但是看 devtool 中的 mutation 日志，
会看到三次 mutation 的记录中，`count`的值都是`0`。而如果是同步 mutation，三次的
`count`应该分别是`2`、`4`、`6`。因为在三次 mutation 之后的状态捕获时，第一次
`setTimeout`的回调都还没有执行，所以`count`还是保持初始值。
7. 现在还不知道 Vuex 是否提供了相应的接口让应用本身也会用到状态快照的功能，如果会用到话
那这里显然会导致错误。即使应用本身用不到，用 devtool 调试时，这也会造成混乱。


## `mapMutations`
1. 在组件中除了可以使用`this.$store.commit('xxx')`提交 mutation，也可以使用
`mapMutations`辅助函数将组件中的 methods 映射为`store.commit`调用
    ```js
    methods: {
        // increment(){
        //     this.$store.commit('increment', {n: 2});
        // },
        ...mapMutations(['increment']),
    },
    ```
2. 如果不传载荷的话直接这样就可以了，如果要传载荷，则要在调用`increment`方法的地方传参
    ```html
    <div @click="increment({n: 2})">
        {{count}}
    </div>
    ```
3. 如果 method 不打算和 mutation 同名的话
    ```js
    methods: {
        // increment(){
        //     this.$store.commit('increment', {n: 2});
        // },
        ...mapMutations({
            add: 'increment',
        })
    },
    ```


## 严格模式
1. 虽然规定对 state 的修改必须通过 commit，但默认情况下，直接修改也不会报错。
2. 但开启严格模式后，直接修改就会报错。这能保证所有的状态变更都能被调试工具跟踪到。
    ```js
    const store = new Vuex.Store({
        // ...
        strict: true
    });
    ```
3. 不要在发布环境下启用严格模式。严格模式会深度监测状态树来检测不合规的状态变更 —— 请确
保在发布环境下关闭严格模式，以避免性能损失。我们可以让构建工具来处理这种情况：
    ```js
    const store = new Vuex.Store({
        // ...
        strict: process.env.NODE_ENV !== 'production'
    });
    ```
