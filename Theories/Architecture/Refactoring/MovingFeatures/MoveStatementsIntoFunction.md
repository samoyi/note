# Move Statements into Function

inverse of: *Move Statements to Callers*


<!-- TOC -->

- [Move Statements into Function](#move-statements-into-function)
    - [思想](#思想)
        - [高内聚](#高内聚)
        - [意图与实现的区分](#意图与实现的区分)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 高内聚

### 意图与实现的区分
1. 下面 Motivation 的描述可以看到，如果一个语句的意图是属于一个函数的，那就应该把它放进那个函数。
2. 但如果只是在实现上一个语句会紧随一个函数调用，则不应该把它放进这个函数里，而应该用一个新的表示意图的函数包裹当前的函数和语句。


## Motivation
1. 如果语句总是伴随着某个函数执行，那就可以考虑直接把它移进那个函数。
2. 但是如果只是伴随执行，但从逻辑上它不属于那个函数，就不应该移进去——要考虑语义化。这种情况下可以把语句和函数封装为一个新的函数。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
