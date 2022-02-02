# Don't Repeat Yourself


<!-- TOC -->

- [Don't Repeat Yourself](#dont-repeat-yourself)
    - [思想](#思想)
    - [针对意图而非形式](#针对意图而非形式)
    - [重复的类型](#重复的类型)
        - [无意义的注释](#无意义的注释)
    - [涉及的 bad code](#涉及的-bad-code)
    - [涉及的重构方法](#涉及的重构方法)
    - [涉及的设计模式](#涉及的设计模式)
    - [References](#references)

<!-- /TOC -->



## 思想
1. 顶层设计原则：$ETC_h$。
2. 每次修改都要修改多个地方，而且还必须要确保这些地方都同步、同样的修改。


## 针对意图而非形式
1. 如果两个函数，一个是校验商品数量，一个是校验商品价格，两者的内部代码都一样，都要检查参数是否为正整数。
2. 这两个函数虽然形式上完全一样，但是它们的意图不同。也就是说，虽然它们的行为一样，但是意图是不一样的，所以不能算作重复。
3. 之后需求发生变动，要求修改校验商品价格的逻辑时，显然不能同步的修改校验商品数量的逻辑。


## 重复的类型
### 无意义的注释
1. 如果代码已经足够明确，那再加注释就是重复。
2. 之后如果修改这块代码，还需要同时修改注释，否则就可能在之后引起误解。
3. 根据上面说的针对意图而非形式，如果代码本身已经明确的表明了意图，那再添加注释显然就是重复的表示意图了。


## 涉及的 bad code


## 涉及的重构方法
* Change Value to Reference：如果一个数据结构能被好几个共享且能被修改，那就不应该给好几个地方各自分发副本，而是分发引用。


## 涉及的设计模式


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
* [The Pragmatic Programmer: From Journeyman to Master 第2版](https://book.douban.com/subject/35006892/)
