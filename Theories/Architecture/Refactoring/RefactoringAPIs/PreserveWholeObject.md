# Preserve Whole Object

<!-- TOC -->

- [Preserve Whole Object](#preserve-whole-object)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：语义化、方便使用者。
2. 方便与的耦合权衡：这个重构方法增加了耦合度但也使得调用更方便。


## Motivation
1. 和 Introduce Parameter Object 一个意思，但形式上有所区别。
2. Introduce Parameter Object 的意思是把几个数据组成一个对象。例如
    ```js
    let name = "33";
    let age = 22;

    function sayHi (name, age) {}
    ```
    重构为
    ```js
    class Person {} // 实现省略

    let p = new Person("33", 22); 

    function sayHi (person) {}
    ```
3. 而 Preserve Whole Object 的意思是如果参数是一个对象的几个属性，那就不要把这几个属性作为独立参数，而应该把对象整体作为参数。例如
    ```js
    let p = new Person("33", 22, "male"); 

    function sayHi (name, age) {}
    ```
    重构为
    ```js
    function sayHi (person) {}
    ```
4. 这样的好处是调用更方便，而且之后 `sayHi` 还想使用性别的话，就不用修改参数列表。
5. 但缺点就是增加了耦合性：`sayHi` 本来只是需要另个基础的字符串和整数类型，现在耦合了一个自定义的 `Person` 类型，也就是连接点数据类型发生了强耦合。
6. 当然如果只在当前环境中使用没有问题，但如果还要再其他环境使用，那么那个环境也必须有 `Person` 类型才行。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
