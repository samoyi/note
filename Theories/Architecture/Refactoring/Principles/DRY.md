# Don't Repeat Yourself


<!-- TOC -->

- [Don't Repeat Yourself](#dont-repeat-yourself)
    - [思想](#思想)
    - [重复的问题](#重复的问题)
    - [重复的类型](#重复的类型)
        - [无意义的注释](#无意义的注释)
    - [针对意图而非形式](#针对意图而非形式)
    - [涉及的 bad code](#涉及的-bad-code)
    - [涉及的重构方法](#涉及的重构方法)
    - [涉及的设计模式](#涉及的设计模式)
    - [References](#references)

<!-- /TOC -->



## 思想
知道的越少越安全，越好维护。


## 重复的问题
每次修改都要修改多的地方，而且还必须要确保这些地方都同步、同样的修改。


## 重复的类型

### 无意义的注释
1. 如果代码已经足够明确，那再加注释就是重复。
2. 之后如果修改这块代码，还需要同时修改注释，否则就可能在之后引起误解。


## 针对意图而非形式
1. 如果两个函数，一个是校验商品数量，一个是校验商品价格，两者的内部代码都一样，都要检查参数是否为正整数。
2. 这两个函数虽然形式上完全一样，但是它们的意图不同。也就是说，虽然它们的行为一样，但是意图是不一样的，所以不能算作重复。
3. 之后需求发生变动，要求修改校验商品价格的逻辑时，显然不能同步的修改校验商品数量的逻辑。


## 涉及的 bad code


## 涉及的重构方法


## 涉及的设计模式


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
* [The Pragmatic Programmer: From Journeyman to Master 第2版](https://book.douban.com/subject/35006892/)
