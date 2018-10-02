# State

`state`保存着 store 中的所有原始状态数据。之所以用“原始”，是为了和`getters`区分。


## 单一状态树
1. Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个
“唯一数据源 (SSOT)”而存在。
2. 这也意味着，每个应用将仅仅包含一个`store`实例。单一状态树让我们能够直接地定位任一特
定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
3. 单状态树和模块化并不冲突 —— 在后面的章节里我们会讨论如何将状态和状态变更事件分布到各
个子模块中。


## 在 Vue 组件中获得 Vuex 状态
1. 从 store 实例中读取状态最简单的方法就是在计算属性中直接引用 store 实例并返回某个状
态
    ```js
    // store.js
    export default new Vuex.Store({
        state: {
            total: 0,
        },
    });
    ```
    ```js
    // index.js
    import store from './store.js';
    new Vue({
        // ...
        computed: {
            count(){
                return store.state.count;
            },
        },
        // ...
    });
    ```
2. 然而，这种模式导致组件依赖全局状态单例。在模块化的构建系统中，在每个需要使用 state
的组件中都需要单独导入一遍，并且在测试组件时需要模拟状态。不懂这里模拟状态的情况是什么。
3. Vuex 通过`store`选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用
`Vue.use(Vuex)`）。通过在根实例中注册`store`选项，该 store 实例会注入到根组件下的所有
子组件中，且子组件能通过`this.$store`访问到。当然根实例也应该通过`this.$store`访问。
    ```js
    // 根组件
    import store from './store.js';

    new Vue({
        // ...
        store,
        computed: {
            count(){
                return this.$store.state.count;
            },
        },
        // ...
    });
    ```
    ```js
    // 子组件
    export default {
        computed: {
            count(){
                return this.$store.state.count;
            },
        },
        methods: {
            increment(){
                this.$store.commit('increment')
            },
        },
    }
    ```

### `mapState`辅助函数
1. 假如现在`state`中有三个值
    ```js
    state: {
        count: 0,
        name: '33',
        age: 22,
    },
    ```
2. 你现在想要在一个组件里面用这三个值，可以分别定义三个计算属性
    ```js
    computed: {
        myCount(){
            return this.$store.state.count + 1;
        },
        myName(){
            return this.$store.state.name;
        },
        myAge(){
            return this.$store.state.age - 1;
        },
    },
    ```
3. 其实也不算麻烦，不过 Vuex 还是提供了简单的写法
    ```js
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState({
                myCount: state => state.count + 1,
                myName: 'name',
                myAge(state){
                    return state.age - 1;
                },
            }),
        },
        // ...
    }
    ```
5. `mapState`函数的参数是表示一组计算属性定义选项的对象。该对象的属性名是每个计算属性的
名称，对应的属性值可以是一个函数或者是一个字符串。
    * 如果是一个函数，该函数接受一个参数，引用`this.$store.state`。返回值为计算属性的
        值。
    * 如果是一个字符串`str`，则表示直接返回`this.$store.state.str`。像下面说的一样，
      使用字符串的方法不适合模块化 store。
6. 如果你打算让计算属性和`state`中的对应属性的名值都保持相同，那么直接给`mapState`传一
个数组，把所有属性名作为字符串数组项即可，这倒是明显简便了
    ```js
    computed: {
        ...mapState(['count', 'name', `age`]),
    },
    ```
    不过在模块化 store 的情况下，这种方法并不适用。因为`state`是还要分为具体的模块，所
    以比如这里的`count`是`store.state.count`，而不能是`store.state.foo.count`。
