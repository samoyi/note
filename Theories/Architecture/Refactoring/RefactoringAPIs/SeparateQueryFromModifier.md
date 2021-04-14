# Separate Query from Modifier

<!-- TOC -->

- [Separate Query from Modifier](#separate-query-from-modifier)
    - [思想](#思想)
        - [Command-Query Separation](#command-query-separation)
    - [Motivation —— Command-Query Separation](#motivation--command-query-separation)
        - [“纯函数” 的好处](#纯函数-的好处)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### Command-Query Separation
1. 纯函数很好，尽量使用纯函数。
2. 如果一个函数不是纯函数，那就不要让它看起来像纯函数。
3. 能纯化的部分就单独提取出来作为纯函数，不要把它混在不纯的操作里面。


## Motivation —— Command-Query Separation
### “纯函数” 的好处
1. 变化是容易引起混乱的事情，尤其是非预期的变化。
2. 如果一个函数仅仅是返回一个结果，没有其他副作用，那就很好，你可以随意调用这个函数。
3. 如果一个函数会引发某些变化，那你调用的时候就要小心，尤其是它会修改某些你和别人共享的数据的情况下。
4. 把安全的行为和危险的行为区分开来是必要的，这样你可以放心的执行安全的行为，以及明确的执行有危险的行为。
5. 但如果你在一个看起来没有副作用的函数里混合了有副作用的逻辑，那就很容易引发混乱。
6. 一个好的实践是，对于任何返回值的函数，都不应该让它产生 “可见的副作用”。（Command-Query Separation）
7. 可见的副作用是指，你可能比如为了缓存保存了一些数据，但是类似于这样的操作对函数的使用者来说是完全无感的。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
