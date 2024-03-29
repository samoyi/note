# Replace Query with Parameter

inverse of: *Replace Parameter with Query*


<!-- TOC -->

- [Replace Query with Parameter](#replace-query-with-parameter)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：低耦合。
2. 纯函数的实现就要求这一点：函数内部不要自己直接使用外部可变的数据，而是把所有可变数据都作为参数传递。


## Motivation
1. 优点是解耦和，让模块更容易理解、更容易测试和更容易复用。
2. 缺点是增加了调用者的负担。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
