# Speculative Generality

<!-- TOC -->

- [Speculative Generality](#speculative-generality)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 为了复用做很多钩子和判断真的是很难看而且难以理解，还不如写两个单独的部分舒服。
2. 在计算和传输速度够快、存储和流量消耗不大的情况下，复用带来的一点点性能提升，远远比不上复杂的逻辑所带来的理解成本。


## 重构方法参考
* Remove Flag Argument
* Split Loop
* Split Variable


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
