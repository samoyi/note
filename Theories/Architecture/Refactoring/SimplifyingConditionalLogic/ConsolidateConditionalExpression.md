# Consolidate Conditional Expression


<!-- TOC -->

- [Consolidate Conditional Expression](#consolidate-conditional-expression)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：意图和实现分离。
2. 你那好几个条件判断其实还是要合起来做一个总的判断，所以那具体的一条一条判断是总判断的实现。你应该把它们封装为一个函数，给这个函数一个合适的命名来表面你的意图。


## Motivation
1. 如果多个条件表达式实际上是一个整体意图的实现，那就把它们封装到一起。
2. 这样的封装的好处有
    * 表明它们确实是整体实现一个意图，而不是两个独立的判断
    * 通过封装为函数，可以通过函数名明确意图
    * 通过封装为函数，有利于提取函数或者复用
3. 例如下面的重构
    ```js
    if (n < 128) {
        return false;
    }
    if (n >= 256) {
        return false;
    }
    return true;
    ```
    重构为
    ```js
    function isInSecondByte(n){
        return n >= 128 && n < 256;
    }

    return isInSecondByte(n);
    ```


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
