# Consolidate Conditional Expression

inverse of: *Decompose Conditional*


<!-- TOC -->

- [Consolidate Conditional Expression](#consolidate-conditional-expression)
    - [原则](#原则)
    - [场景](#场景)
        - [Vue 中使用计算属性和 getter 合并条件表达式](#vue-中使用计算属性和-getter-合并条件表达式)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则
条件表达式的意图与实现分离


## 场景
### Vue 中使用计算属性和 getter 合并条件表达式
1. 一个很常见的需要重构的点就是在 Vue 的模板中写长长的条件表达式
    ```html
    <div v-show="nameSwitch && person.name && name.length">{{person.name}}</div>
    ```
2. 模板的功能应该是只负责渲染，逻辑计算的功能应该由 JS 来完成。所以应该把条件表达式封装为计算属性
    ```html
    <div v-show="isShowName">{{person.name}}</div>
    ```
    ```js
    isShowName () {
        return this.nameSwitch && this.person.name && this.name.length;
    },
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
