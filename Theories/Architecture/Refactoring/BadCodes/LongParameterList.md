# Long Parameter List


<!-- TOC -->

- [Long Parameter List](#long-parameter-list)
    - [思想](#思想)
    - [可能的原因](#可能的原因)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：方便使用者、SRP


## 可能的原因
* 几个参数实际上属于一个对象，那就应该传整个对象
* 参数在函数内部可以查询到，就不用使用者再传了，使用者手动传还可能传错
* 多个参数是想实现不止一个问题，那就拆分为更 SRP 的多个函数


## 重构方法参考
* Introduce Parameter Object：如果几个参数是一个对象的大部分属性
* Combine Functions into Class：共享作用域，不用传参
* Preserve Whole Objec
* Replace Parameter with Query：函数可以自己查询到参数那就不用传
* Remove Flag Argument：不要用参数去让函数实现若干个功能，分成几个函数


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
