# Consolidate Conditional Expression


<!-- TOC -->

- [Consolidate Conditional Expression](#consolidate-conditional-expression)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [如果多个条件表达式实际上是一个整体意图的实现，那就把它们合并到一起](#如果多个条件表达式实际上是一个整体意图的实现那就把它们合并到一起)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 和封装函数的意义是一样的，即意图和实现分离。
2. 你那好几个条件判断其实还是要合起来做一个总的判断，所以那具体的一条一条判断是总判断的实现。你应该把它们封装为一个函数，给这个函数一个合适的命名来表面你的意图。


## Motivation
### 如果多个条件表达式实际上是一个整体意图的实现，那就把它们合并到一起
1. Sometimes, I run into a series of conditional checks where each check is different yet the resulting action is the same. 
2. When I see this, I use `and` and `or` operators to consolidate them into a single conditional check with a single result. 
3. Consolidating the conditional code is important for two reasons. 
    * First, it makes it clearer by showing that I’m really making a single check that combines other checks. The sequence has the same effect, but it looks like I’m carrying out a sequence of separate checks that just happen to be close together. 
    * The second reason I like to do this is that it often sets me up for *Extract Function*. Extracting a condition is one of the most useful things I can do to clarify my code. It replaces a statement of what I’m doing with why I’m doing it. 
4. The reasons in favor of consolidating conditionals also point to the reasons against doing it. If I consider it to be truly independent checks that shouldn’t be thought of as a single check, I don’t do the refactoring.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
