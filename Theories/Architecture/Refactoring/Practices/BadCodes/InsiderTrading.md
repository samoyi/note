# Insider Trading


## 原则



## 场景
### 不要直接修改 Vue 组件中 `data` 中的公用数据
1. Vuex 通过 mutation 限制了对 `state` 中的数据直接修改，原因之一就是因为直接修改是是很难追踪的。
2. Vue 组件中 `data` 中的数据虽然可以直接修改，但同样面临难以追踪的问题。
3. 如果这个数据只有一个地方修改那还好，但如果是多个地方修改，就应该通过方法来封装。


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)

