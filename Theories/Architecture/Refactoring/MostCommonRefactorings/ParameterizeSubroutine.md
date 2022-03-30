# Parameterize Subroutine


<!-- TOC -->

- [Parameterize Subroutine](#parameterize-subroutine)
    - [思想](#思想)
        - [DRY 与 OCP 的关系](#dry-与-ocp-的关系)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
* 中层设计规则：DRY 与 OCP
* Pure Subroutine 的必要条件

### DRY 与 OCP 的关系
1. 下面的例子中，把两个函数内部的数据提取位参数后，就实现了复用。
2. 但是从另一个角度来说，这也是把数据和逻辑进行了分离。
3. 大部分的 DRY 复用都要进行一些参数提取，而参数提取的意义就是把可能的外部数据和内部逻辑分离。


## Motivation
不管是函数，还是更大的模块。


## References
