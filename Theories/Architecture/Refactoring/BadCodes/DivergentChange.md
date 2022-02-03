# Divergent Change


<!-- TOC -->

- [Divergent Change](#divergent-change)
    - [思想](#思想)
    - [表现](#表现)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：SRP


## 表现
1. 一个对象实体最好的设计就是 OCP，可以应对外界的变化。不过时常还有有些变化不得不改变实体内部的逻辑。
2. 但是，如果一个实体内部的逻辑会因为不同类型的需求而变化时，那可能就说明这个实体负责了不止一种类型的功能。
3. 因为如果一个实体的设计符合 SRP，只负责一种功能，那就应该只有在这一种功能变化时才发生变化。


## 重构方法参考
* Extract Class：分成若干个 SRP 的类
* Split Phase：如果该实体负责了两个及以上的阶段的功能，那就把每个阶段都提取位单独的 SRP 的实体


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
