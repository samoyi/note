# Hide Delegate

inverse of: Remove Middle Man


<!-- TOC -->

- [Hide Delegate](#hide-delegate)
    - [思想](#思想)
    - [Bad codes](#bad-codes)
    - [Motivation](#motivation)
        - [多个客户们不要自己去委托一层层的关系，而是交给代理去统一做](#多个客户们不要自己去委托一层层的关系而是交给代理去统一做)
        - [委托关系改变时，方便统一修改](#委托关系改变时方便统一修改)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：意图与实现分离


## Bad codes
* Message Chains


## Motivation
### 多个客户们不要自己去委托一层层的关系，而是交给代理去统一做
1. 比如用户使用 `aPerson` 读取 `manager` 时，如果向下面这样直接读取，会依赖中间的 `department`
    ```js
    manager = aPerson.department.manager; // 客户代码
    ```
2. 假设 `aPerson` 的结构变了，不再是 `aPerson`-`department`-`manager`，那么这个用户也要相应的改变。
3. 而且如果好几个用户都引用 `manager`，那么所有的用户都要各自变动自己的引用结构。
4. 如果重构为下面的逻辑，`aPerson` 向用户隐藏中间的委托关系，`aPerson` 自己代理用户实现对 `department` 的委托，只返回给用户最终的 `manager`
    ```js
    manager = aPerson.manager; // 客户代码
    class Person { // 服务商代码
        get manager () {
            return this.department.manager;
        }
    }
    ```
5. 这样当中间的委托关系发生变化时，`aPerson` 只需要修改自己的代理委托函数 `get manager`，就可以重新建立新的结构，而所有的客户都是无感知的。

### 委托关系改变时，方便统一修改
1. 下面三个属性，依赖于 `state.user.baseInfo` 的委托关系
    ```js
    name () {
        this.$store.state.user.baseInfo.name;
    },
    age () {
        this.$store.state.user.baseInfo.age;
    },
    phone () {
        this.$store.state.user.baseInfo.phone;
    },
    ```
2. 如果用户的这三个信息不再在 `baseInfo` 属性下了，或者不在 `user` 模块下了，那么这三个方法都要独立修改新的委托关系。
3. 所以应该设置一个代理来代理并对使用者隐藏委托关系，比如下面的 `baseUserInfo`，这样委托关系改变时只需要代理一个人改变就行了
    ```js
    baseUserInfo () {
        this.$store.state.user.baseInfo;
    },
    name () {
        this.baseUserInfo.name;
    },
    age () {
        this.baseUserInfo.age;
    },
    phone () {
        this.baseUserInfo.phone;
    },
    ```
4. 不仅仅是复用了代码，更增加了可维护性。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
