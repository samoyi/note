# Data Clumps


<!-- TOC -->

- [Data Clumps](#data-clumps)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：高内聚、语义化
2. 如果几个数据总是同时出现，那很有可能它们子语义上是一个整体，那就应该让它们组成一个整体。


## 重构方法参考
* Introduce Parameter Object：如果这几个数据是参数，那可以组成参数对象
* Preserve Whole Object：原理同上
* Extract Class：实现为整体的对象
* Combine Variables Into Record


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
