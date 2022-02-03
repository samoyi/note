# Shotgun Surgery


<!-- TOC -->

- [Shotgun Surgery](#shotgun-surgery)
    - [思想](#思想)
    - [表现](#表现)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
中级设计规则：高内聚


## 表现
1. 每次你要对一个实体进行一个功能修改时，都需要修改好几个文件，而且并不是因为这几个地方代码重复。
2. 这种情况可能就说明这几个地方可能在逻辑上是属于一体的，所以就应该把它们放在一起，让这些代码符合高内聚的原则。


## 重构方法参考
* Combine Functions into Class：相关联的数据及其相关方法封装为类
* Combine Functions into Transform：把数据和相关操作都放到一起
* Inline Function：如果它们应该作为同一个行为，那就可以考虑合并为同一个函数
* Inline Class：如果修改散落在好几个 class 里面，那也许这几个 class 逻辑上应该合并为一个


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
