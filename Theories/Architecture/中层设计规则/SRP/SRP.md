# SRP

<!-- TOC -->

- [SRP](#srp)
    - [思想](#思想)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [涉及的重构](#涉及的重构)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 顶层设计原则：ETU 和 $ETC_h$。


## 涉及的 bad codes
* Divergent Change
* Large Class and Large Record
* Long Function and Long Module
* Speculative Generality


## 涉及的重构
* Extract Class
* Extract Function
* Remove Flag Argument：flag 的每种状态应该提取为独立函数。
* Replace Type Code with Subclasses：和 Remove Flag Argument 同理。
* Separate Query from Modifier：不要用同一个接口同时用来查询和修改。
* Split Loop：一个循环里不要同时做多个事情。
* Split Phase：如果一个函数里是做一件事的好几个步骤，可以考虑把每个提取为独立的函数。


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
