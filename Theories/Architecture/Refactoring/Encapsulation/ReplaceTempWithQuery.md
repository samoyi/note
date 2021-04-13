# Replace Temp with Query


TODO


<!-- TOC -->

- [Replace Temp with Query](#replace-temp-with-query)
    - [思想](#思想)
        - [意图与实现分离](#意图与实现分离)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
算是 Encapsulate Variable 的一种特殊情况吧

### 意图与实现分离


## Motivation
* 如果变量的计算有比较复杂的逻辑，那封装为函数可以显示出明确的边界，让它和上下的其他代码明显的区分开。其实这也是提取函数的基本好处之一。
* 如果有若干个地方会用到同样的计算逻辑，只是输入数据不同，那么封装为函数就方便多了。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
