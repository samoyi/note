# Replace Derived Variable with Query

相关重构方法：Combine Functions into Transform


<!-- TOC -->

- [Replace Derived Variable with Query](#replace-derived-variable-with-query)
    - [思想](#思想)
        - [消除非必要的可变性](#消除非必要的可变性)
        - [涉及的 bad codes](#涉及的-bad-codes)
    - [Motivation](#motivation)
        - [例外情况](#例外情况)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 消除非必要的可变性
如果一个数据不应该被修改，那就让它不能被修改。


### 涉及的 bad codes
* Mutable Data


## Motivation
1. 这个重构方法与 Combine Functions into Transform 重构方法看起来比较像是相反的意图，但其实并不完全是。
2. Combine Functions into Transform 是要封装若干操作数据方法，在内部派生出若干新数据，然后返回给使用者。
3. 而这个重构要强调的并不是不要使用派生数据，而是强调如果没有必要就不要把派生出的数据保存为变量。
4. 因为变化是危险的，所以保存在变量里就可以能被不同的地方修改，而一处修改时如果考虑不周全就可能影响其他使用该变量的地方。
5. 所以这个重构方法强调的是：如果你要使用源数据的某个派生数据，就自己调用派生方法并直接使用返回值，而不使用中间变量。

### 例外情况
1. 如果源数据是不变的，那么我们就可以把派生出的数据定义为常量。
2. 这种情况下，既有了 Combine Functions into Transform 的优点，有消除了可变性。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
