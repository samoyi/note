# Summary

1. 每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。也就是那个所谓的进行同一状态管理的第三方。
2. Vuex 和单纯的全局对象有以下两点不同：
    * Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。和 Vue 实例 `data` 中的属性必须在初始化时存在才能添加响应式一样，Vuex 中 `state` 的属性如果是之后才添加的，则不会具有响应性。所以如果发现依赖的 `state` 中的数据明明更新了，但是依赖它的地方却没有更新，那有可能就是这个原因。
    * 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交(commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。
3. 一个最简单的例子
    ```js
    const store = new Vuex.Store({
        state: { // 共享的数据
            count: 0,
        },
        mutations: { // 提供给组件的用来修改共享数据的接口
            increment (state) {
                state.count++;
            },
        },
    });

    new Vue({
        template: `<div @click="increment">{{count}}</div>`,
        computed: {
            count(){
                return store.state.count;
            },
        },
        methods: {
            increment(){
                store.commit('increment')
            },
        },
    }).$mount('#app');
    ```
4. 可以通过 `store.state` 来获取状态对象。
5. 通过 `store.commit` 方法触发状态变更。我们通过提交 mutation 的方式，而非直接改变 `store.state.count`，是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。
6. 此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。
