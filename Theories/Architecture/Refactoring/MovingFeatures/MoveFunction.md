# Move Function

inverse of: Extract Class


<!-- TOC -->

- [Move Function](#move-function)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [模块化需要确保把函数放在合适的模块里](#模块化需要确保把函数放在合适的模块里)
        - [具体移动动机——相关的放在一起可以高内聚低耦合](#具体移动动机相关的放在一起可以高内聚低耦合)
    - [Mechanics](#mechanics)
        - [搬移一个复杂函数是要拆分清晰](#搬移一个复杂函数是要拆分清晰)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
### 模块化需要确保把函数放在合适的模块里
1. The heart of a good software design is its modularity — which is my ability to make most modifications to a program while only having to understand a small part of it. 
2. To get this modularity, I need to ensure that related software elements are grouped together and the links between them are easy to find and understand. 
3. But my understanding of how to do this isn’t static — as I better understand what I’m doing, I learn how to best group together software elements. 
4. To reflect that growing understanding, I need to move elements around.

### 具体移动动机——相关的放在一起可以高内聚低耦合
1. One of the most straightforward reasons to move a function is when it references elements in other contexts more than the one it currently resides in. 
2. Moving it together with those elements often improves encapsulation, allowing other parts of the software to be less dependent on the details of this module.
3. 总之就是要方便调用、减少对象耦合、减少结构耦合、减少频繁的跨模块调用、减少频繁重复的传参调用。


## Mechanics
### 搬移一个复杂函数是要拆分清晰
1. 有时遇到的情况是，要把一个之前写的没有良好拆分的、复杂的函数搬到一个新的环境。
2. 搬移函数到新环境很可能会导致很多问题，而如果这个函数比较复杂，那在查找和解决这些问题的时候，就会效率低下。
3. 所以应该先在当前环境把这个复杂的函数拆分清晰，然后再一起搬移到新的环境里。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
