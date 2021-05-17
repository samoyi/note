# Middle Man


<!-- TOC -->

- [Middle Man](#middle-man)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 和 Message Chains 相反，不使用中间代理，自己直接顺着消息链查询信息。
2. 但是使用中间代理的坏处是什么呢？目前遇到的一个坏处就是，在使用发布-订阅模式时，发布-订阅的实现机制会分割来消息发送者和接受者的关系，让两者看起来没有明确的联系。


## 重构方法参考
* Inline Function
* Remove Middle Man


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
