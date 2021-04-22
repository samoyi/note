# Replace Type Code with Subclasses


<!-- TOC -->

- [Replace Type Code with Subclasses](#replace-type-code-with-subclasses)
    - [原则](#原则)
    - [场景](#场景)
        - [不要因为仅仅是样式相似就复用一个组件](#不要因为仅仅是样式相似就复用一个组件)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则
如果要复用一个东西，必须要保证：
* 可读性不会明显下降：不要为了兼容而写一堆复杂的兼容逻辑和接口。
* 不会明显违背语义化：如果两个功能明显就不一样，就不要用一个实体来实现了。


## 场景
### 不要因为仅仅是样式相似就复用一个组件
一开始即使可以勉强复用来兼容两个功能，不仅降低了可读性，而且之后随着需求变化就不能兼容了，到时候拆起来会很麻烦。


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
