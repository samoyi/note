# Pure Subroutine


<!-- TOC -->

- [Pure Subroutine](#pure-subroutine)
    - [思想](#思想)
        - [以 pure function 的定义为例](#以-pure-function-的定义为例)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：消除非必要的可变性

### 以 pure function 的定义为例
1. 需要同时满足以下两个条件：
    * The function return values are identical for identical arguments (no variation with local static variables, non-local variables, mutable reference arguments or input streams).
    *  The function application has no side effects (no mutation of local static variables, non-local variables, mutable reference arguments or input/output streams).
2. “既不变心，又不粘人”，老渣男了。



## Motivation
不管是函数，还是更大的模块。


## References
* [Wikipedia](https://en.wikipedia.org/wiki/Pure_function)
