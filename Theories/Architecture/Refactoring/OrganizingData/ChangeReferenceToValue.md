# Change Reference to Value

inverse of: Change Value to Reference


<!-- TOC -->

- [Change Reference to Value](#change-reference-to-value)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [值对象相比于引用对象的优点](#值对象相比于引用对象的优点)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 如果你不希望其他人共同修改一份数据，那你分发对数据的引用（修改权限），就可能导致该数据被意外修改。
2. 这时你就应该分发数据的副本，供他们自己折腾，而不会影响到自己。


## Motivation
### 值对象相比于引用对象的优点
1. Value objects are generally easier to reason about, particularly because they are immutable. 
2. I can pass an immutable data value out to other parts of the program and not worry that it might change without the enclosing object being aware of the change. 
3. I can replicate values around my program and not worry about maintaining memory links. 
4. Value objects are especially useful in distributed and concurrent systems. 
5. This also suggests when I shouldn’t do this refactoring. If I want to share an object between several objects so that any change to the shared object is visible to all its collaborators, then I need the shared object to be a reference.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
