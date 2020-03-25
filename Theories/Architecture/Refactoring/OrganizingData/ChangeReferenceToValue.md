# Change Reference to Value

inverse of: Change Value to Reference


<!-- TOC -->

- [Change Reference to Value](#change-reference-to-value)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 如果你不希望其他人共同修改一份数据，那你分发对数据的引用（修改权限），就可能导致该数据被意外修改。
2. 这时你就应该分发数据的副本，供他们自己折腾，而不会影响到自己。


## Motivation
1. When I nest an object, or data structure, within another I can treat the inner object as a reference or as a value. 
2. The difference is most obviously visible in how I handle updates of the inner object’s properties. If I treat it as a reference, I’ll update the inner object’s property keeping the same inner object. If I treat it as a value, I will replace the entire inner object with a new one that has the desired property. 
3. If I treat a field as a value, I can change the class of the inner object to make it a Value Object [mf­-vo].
4. Value objects are generally easier to reason about, particularly because they are immutable. 
5. In general, immutable data structures are easier to deal with. I can pass an immutable data value out to other parts of the program and not worry that it might change without the enclosing object being aware of the change. I can replicate values around my program and not worry about maintaining memory links. 
6. Value objects are especially useful in distributed and concurrent systems. 
7. This also suggests when I shouldn’t do this refactoring. If I want to share an object between several objects so that any change to the shared object is visible to all its collaborators, then I need the shared object to be a reference.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
