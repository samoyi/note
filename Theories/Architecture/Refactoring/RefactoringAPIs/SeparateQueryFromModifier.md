# Separate Query from Modifier

<!-- TOC -->

- [Separate Query from Modifier](#separate-query-from-modifier)
    - [思想](#思想)
        - [Command-Query Separation](#command-query-separation)
    - [Motivation —— Command-Query Separation](#motivation--command-query-separation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### Command-Query Separation
1. 纯函数很好，尽量使用纯函数。
2. 如果一个函数不是纯函数，那就不要让它看起来像纯函数。
3. 能纯化的部分就单独提取出来作为纯函数，不要把它混在不纯的操作里面。


## Motivation —— Command-Query Separation
1. When I have a function that gives me a value and has no observable side effects, I have a very valuable thing. 
2. I can call this function as often as I like. I can move the call to other places in a calling function. It’s easier to test. In short, I have a lot less to worry about.
3. It is a good idea to clearly signal the difference between functions with side effects and those without. A good rule to follow is that any function that returns a value should not have observable side effects — the **Command-Query Separation** [mf­cqs]. 
4. If I come across a method that returns a value but also has side effects, I always try to separate the query from the modifier.
5. Note that I use the phrase observable side effects. A common optimization is to cache the value of a query in a field so that repeated calls go quicker. Although this changes the state of the object with the cache, the change is not observable. Any sequence of queries will always return the same results for each query.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
