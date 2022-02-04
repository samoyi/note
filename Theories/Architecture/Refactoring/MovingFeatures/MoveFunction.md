# Move Function

inverse of: Extract Class


<!-- TOC -->

- [Move Function](#move-function)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
        - [搬移一个复杂函数是要拆分清晰](#搬移一个复杂函数是要拆分清晰)
    - [References](#references)

<!-- /TOC -->


## 思想
* 语义化
* 高内聚低耦合


## Motivation
1. 模块化需要确保把函数放在合适的模块里。
2. 把相关的函数放在一起可以实现高内聚，不把无关的函数放进来可是实现低耦合。
3. 总之就是要方便调用、减少对象耦合、减少结构耦合、减少频繁的跨模块调用、减少频繁重复的传参调用。


## Mechanics
### 搬移一个复杂函数是要拆分清晰
1. 有时遇到的情况是，要把一个之前写的没有良好拆分的、复杂的函数搬到一个新的环境。
2. 搬移函数到新环境很可能会导致很多问题，而如果这个函数比较复杂，那在查找和解决这些问题的时候，就会效率低下。
3. 所以应该先在当前环境把这个复杂的函数拆分清晰，然后再一起搬移到新的环境里。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
