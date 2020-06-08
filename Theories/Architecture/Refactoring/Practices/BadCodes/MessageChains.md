# Message Chains


## 原则
1. 不要让某个功能耦合于多层或复杂的结构。
2. 如果必须耦合，也应该由一个代理来处理耦合关系，不要让所有用到该功能地方都自己去依赖这个多层或复杂的结构。
3. 而且如果是通过代理访问，那么在代理层，除了返回结果以外，还可以根据情况做一些其他事情。


## 场景
### Vue 中的计算属性和 getter 就是 *Hide Delegate* 思想的应用
1. 如果多个地方都要访问一个好几级的 state 链，例如
    ```js
    let name = this.$store.state.common.userInfo.name;
    ```
2. 那这个 `name` 就要依赖 `userInfo` 层级结构。不如改成这样
    ```js
    userName (state) {
        return state.userInfo.name;
    },
    // ...
    let name = this.$store.getters['common/name'];
    ```
3. 而且从属性访问变成了函数访问，你还可以在 `userName` 里添加一些逻辑


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
