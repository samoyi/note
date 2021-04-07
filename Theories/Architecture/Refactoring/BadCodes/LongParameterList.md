# Long Parameter List


<!-- TOC -->

- [Long Parameter List](#long-parameter-list)
    - [思想](#思想)
        - [黑箱](#黑箱)
        - [SRP](#srp)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 黑箱
1. 函数可以自己查询到某个参数，并且确实应该自己查询，或者说自己查询或者使用者传递都行，那就不要让使用者传递，使用者对函数内部了解的越少越好。
2. 一方面这样可以方便使用者，另一方面也可以防止不同的使用者传参错误。

### SRP
不要用参数去让函数实现若干个功能，而是分成几个 SRP 的函数。


## 重构方法参考
* Introduce Parameter Object：如果几个参数是一个对象的大部分属性
* Combine Functions into Class：共享作用域，不用传参
* Preserve Whole Objec
* Replace Parameter with Query：函数可以自己查询到参数那就不用传
* Remove Flag Argument：不要用参数去让函数实现若干个功能，分成几个函数


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
