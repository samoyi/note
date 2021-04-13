# Hide Delegate


<!-- TOC -->

- [Hide Delegate](#hide-delegate)
    - [原则](#原则)
    - [场景](#场景)
        - [Vue 中多用计算属性和 getter](#vue-中多用计算属性和-getter)
        - [当一个组件多个计算属性引用同一个 store 模块的数据时](#当一个组件多个计算属性引用同一个-store-模块的数据时)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则
* 黑箱封装：不向使用者暴露复杂的委托关系
* 对使用者透明：如果委托关系可能，而且有不止一个使用者使用该委托关系，那就应该使用一个代理统一处理该委托关系。


## 场景
### Vue 中多用计算属性和 getter

### 当一个组件多个计算属性引用同一个 store 模块的数据时
1. 比如这种情况
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
2. 定义一个计算属性隐藏委托关系
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


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)

