# Replace Constructor with Factory Function


<!-- TOC -->

- [Replace Constructor with Factory Function](#replace-constructor-with-factory-function)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
对不好用的东西进行封装、代理


## Motivation
1. Many object­oriented languages have a special constructor function that’s called toinitialize an object. Clients typically call this constructor when they want to create a new object. 
2. But these constructors often come with awkward limitations that aren’t there for more general functions. A Java constructor must return an instance of the class it was called with, which means I can’t replace it with a subclass or proxy depending on the environment or parameters. Constructor naming is fixed, which makes it impossible for me to use a name that is clearer than the default. Constructors often require a special operator to invoke (`new` in many languages) which makes them difficult to use in contexts that expect normal functions. 
3. A factory function suffers from no such limitations. It will likely call the constructor as part of its implementation, but I can freely substitute something else.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
