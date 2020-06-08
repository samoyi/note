# Data Clumps


<!-- TOC -->

- [Data Clumps](#data-clumps)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 看起来这里说的意思是，如果几个数据同时出现在好几个地方，那么就说明这几个数据是有内在联系的，它们在逻辑上可以成为一个整体。因此就应该把它们组合成整体。


## 重构方法参考
* Introduce Parameter Object：好几个相关的参数组合为一个对象
* Extract Class
* Preserve Whole Object
* Combine Variables Into Record


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
