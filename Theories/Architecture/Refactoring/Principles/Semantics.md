# Semantics

<!-- TOC -->

- [Semantics](#semantics)
    - [思想](#思想)
        - [数据结构的语义化](#数据结构的语义化)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [涉及的重构](#涉及的重构)
        - [Moving Features](#moving-features)
        - [Dealing with Inheritance](#dealing-with-inheritance)
    - [References](#references)

<!-- /TOC -->


## 思想
### 数据结构的语义化
1. 数据结构应该尽可能准确的反映真实世界的逻辑关系，这样才能更好的模拟真实世界，也使得数据结构更容易理解。
2. 例如 Combine Functions Into Class 这条重构所反映的：如果一组数据在真实的世界里，在一般人的理解中是一个整体，那么反映它们的数据结构也应该是一个整体。


## 涉及的 bad codes
* Data Clumps
* Divergent Change
* Mysterious Name
* Primitive Obsession
* Refused Bequest


## 涉及的重构
* 用常量代替基础类型值
* Change Function Declaration
* Combine Functions Into Class
* Combine Functions into Transform
* Combine Variables Into Record
* Introduce Parameter Object
* Rename Variable
* Replace Primitive with Object
* Rename Field
* Split Variable
* Introduce Assertion
* Replace Nested Conditional with Guard Clauses
* Preserve Whole Object

### Moving Features
* Move Field
* Slide Statements

### Dealing with Inheritance
* Replace Subclass with Delegate
* Replace Superclass with Delegate
* Replace Type Code with Subclasses


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
