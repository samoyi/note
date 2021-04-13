# Replace Derived Variable with Query



<!-- TOC -->

- [Replace Derived Variable with Query](#replace-derived-variable-with-query)
    - [思想](#思想)
        - [消除非必要的可变性](#消除非必要的可变性)
        - [涉及的 bad codes](#涉及的-bad-codes)
    - [Motivation](#motivation)
        - [用取值函数替代不应该被修改的变量](#用取值函数替代不应该被修改的变量)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 消除非必要的可变性
如果一个数据不应该被修改，那就让它不能被修改。


### 涉及的 bad codes
* Mutable Data


## Motivation
### 用取值函数替代不应该被修改的变量
1. 如果某个被计算出来的数据是不应该改变的，那你如果把计算结果保存进变量，说不定就会有什么误操作会给这个变量赋值。
2. 一个方法就是定义一个取值函数，通过该函数来计算结果并返回，这样就降低了结果被修改的可能。Vue 的计算属性就可以实现这个需求。
3. 不过这种情况，还是定义为常量更好吧。如果语言可以很方便的使用常量的话。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
