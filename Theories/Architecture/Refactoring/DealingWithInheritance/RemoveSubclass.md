# Remove Subclass

inverse of: Replace Type Code with Subclasses

<!-- TOC -->

- [Remove Subclass](#remove-subclass)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
和 Replace Type Code with Subclasses 相反


## Motivation
1. Subclasses are useful. They support variations in data structure and polymorphic behavior. They are a good way to program by difference. 
2. But as a software system evolves, subclasses can lose their value as the variations they support are moved to other places or removed altogether. 
3. Sometimes, subclasses are added in anticipation of features that never end up being built, or end up being built in a way that doesn’t need the subclasses. 
4. A subclass that does too little incurs a cost in understanding that is no longer worthwhile. When that time comes, it’s best to remove the subclass, replacing it with a field on its superclass.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
