# Primitive Obsession


<!-- TOC -->

- [Primitive Obsession](#primitive-obsession)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 现象
1. Most programming environments are built on a widely used set of primitive types: integers, floating point numbers, and strings. Libraries may add some additional small objects such as dates. 
2. We find many programmers are curiously reluctant to create their own fundamental types which are useful for their domain—such as money, coordinates, or ranges. 
3. We thus see calculations that treat monetary amounts as plain numbers, or calculations of physical quantities that ignore units (adding inches to millimeters), or lots of code doing `if (a < upper && a > lower)`.
4. Strings are particularly common petri dishes for this kind of odor: A telephone number is more than just a collection of characters. 
5. If nothing else, a proper type can often include consistent display logic for when it needs to be displayed in a user interface. 
6. Representing such types as strings is such a common stench that people call them “stringly typed” variables.
7. 对于自己系统中比较重要且常用的数据，为其创建专门的类型，来约束它们的属性和行为，是很有必要的。


## 重构方法参考
* Introduce Parameter Object
* Replace Primitive with Object


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
