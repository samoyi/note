# Divergent Change


<!-- TOC -->

- [Divergent Change](#divergent-change)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. Open–closed principle：software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification。
2. 一个设计良好的实体应该提供一个稳固的 API，用来应对外界的变化，这样外部的改变不会导致实体本身的变动。
3. 稍差一点的，实体外部的各种变化，实体内部都只需要进行一种改变。
4. 而最差的情况，就是这里所说的 Divergent Change：外部发生了变化甲，实体内部要进行 A 改变；外部发生了变化乙，实体内部要进行 B 改变；外部发生了变化丙，实体内部要进行 C 改变。实体应对外部的不同变化，内部需要进行不同种类的改变。


## 重构方法参考
* Extract Class


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
