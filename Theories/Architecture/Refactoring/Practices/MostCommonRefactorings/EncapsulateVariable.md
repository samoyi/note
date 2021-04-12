# Encapsulate Variable


<!-- TOC -->

- [Encapsulate Variable](#encapsulate-variable)
    - [原则](#原则)
    - [场景](#场景)
        - [getter 和 setter](#getter-和-setter)
        - [Vuex store state 封装为 getter 和 mutation](#vuex-store-state-封装为-getter-和-mutation)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则
* **代理**：多个使用者依赖不同的路径访问 record，导致路径耦合。现在统一访问迁移成本更低的代理函数，由代理函数去访问原 record。
* **意图与实现分离**：供使用者方便使用，但不需要他们知道功能的实现。
* **黑箱封装**：黑箱内部可以对公开的功能做一些黑箱操作。
* **对使用者透明**：可以对外的表现不变化的前提下，在里面根据需求修改逻辑，使用者都是无感的。


## 场景
### getter 和 setter

### Vuex store state 封装为 getter 和 mutation


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
