# Repeated Switches


<!-- TOC -->

- [Repeated Switches](#repeated-switches)
    - [思想](#思想)
        - [不要“炫耀式”的优化](#不要炫耀式的优化)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 不要“炫耀式”的优化
1. 暂时没想到合适的词，用 “炫耀式” 的优化就是想描述，比如看到其他人的代码里有 `switch` 就说：“怎么还用 `switch` 这种丑陋的语法！”。
2. 在简单的情况下，`switch` 要比多态或者 hash 模式更好理解；而且 `switch` 的性能也是更好的。
3. 只是在比较复杂的情况下，需要位置一个很复杂的 `case` 列表；尤其是要在好几个地方都做出同样的判断时， `switch` 就更显得麻烦了，你要修改或者增删一个判断，就要在好几个地方同时改变。


## 重构方法参考
* Replace Conditional with Polymorphism


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
* [Refactoring a switch statement](http://tmont.com/blargh/2011/11/refactoring-a-switch-statement)
