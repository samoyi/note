# State

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
    const store = new Vuex.Store({
        // ...
    });

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
2. 但这里首先的一个问题是，你要知道定义 store 实例是的命名。例如上面的例子，如果 store
和 Vue 实例不是同一个人开发，那必须要协商好 store 实例的命名，并且要求以后不能变。这种
依赖显然是不好的。
3. 更严重的问题是，假设在一个模块化系统里，现在根实例有个子组件，内部也想用`store`，该
怎么办？因为是模块化系统，不存在跨组件的公共作用域，所以子组件无法引用到`store`。
4. 那要么通过 prop 把`store`传给子组件，不过要是还这样通过组件传值的话，那 Vuex 也就没
意义了；要么就是把`store`定义到一个模块里，在每个要用到它的组件里都`import`一下。第二种
方法仍然有些麻烦，而且在测试组件时需要模拟状态。不懂这里模拟状态的情况是什么。
    ```js
    // 子组件
    import {store} from '../store/index';
    export default {
        computed: {
            count(){
                return store.state.count;
            },
        },
    }
    ```
5. Vuex 通过`store`选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用
`Vue.use(Vuex)`）。通过在根实例中注册`store`选项，该 store 实例会注入到根组件下的所有
子组件中，且子组件能通过`this.$store`访问到。当然根实例也应该通过`this.$store`访问。
    ```js
    // 根组件
    import {store} from './store/index';

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
