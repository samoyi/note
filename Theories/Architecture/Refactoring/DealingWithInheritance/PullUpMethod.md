# Pull Up Method

inverse of: *Push Down Method*

<!-- TOC -->

- [Pull Up Method](#pull-up-method)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
消除不必要的重复，统一管理。


## Motivation
1. 多个子类或者子模块中有相同或者相似的方法，那就可以考虑把它们提取到公共的父级。
2. 有些情况可能并没有父级，而是类似于 Vue 那样，多个组件可以引用同一个 mixin，那就可以提取到 mixin 这样的对象中。
3. 如果这个方法在某些子类中会引用该子类特有的数据，那就可以考虑把这个数据也移到公共的父级。
4. 再复杂的一些的情况是，这些方法有着共同的执行步骤，但数据各有差别，那么可以使用模板方法设计模式，构造出相同的模板方法并提升。


## Mechanics
1. Inspect methods to ensure they are identical.
    * If they do the same thing, but are not identical, refactor them until they have identical bodies.
2. Check that all method calls and field references inside the method body refer to features that can be called from the superclass.
3. If the methods have different signatures, use Change Function Declaration to get them to the one you want to use on the superclass.
4. Create a new method in the superclass. Copy the body of one of the methods over to it.
5. Run static checks.
6. Delete one subclass method.
7. Test.
8. Keep deleting subclass methods until they are all gone.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
