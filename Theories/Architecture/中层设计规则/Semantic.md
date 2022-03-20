# Semantic

<!-- TOC -->

- [Semantic](#semantic)
    - [思想](#思想)
    - [类型](#类型)
        - [命名的语义化](#命名的语义化)
        - [数据类型的语义化](#数据类型的语义化)
        - [数据结构的语义化](#数据结构的语义化)
        - [逻辑的语义化](#逻辑的语义化)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [涉及的重构](#涉及的重构)
        - [Dealing with Inheritance](#dealing-with-inheritance)
        - [Encapsulation](#encapsulation)
        - [Most Common Refactorings](#most-common-refactorings)
        - [Moving Features](#moving-features)
        - [Organizing Data](#organizing-data)
        - [Refactoring APIs](#refactoring-apis)
        - [Simplifying Conditional Logic](#simplifying-conditional-logic)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 顶层设计原则：ETR ETU
2. 小到一段代码大到一个程序，它看起来的样子应该和它实际的含义尽量接近，它看起来的样子应该和人们直觉上理解的样子一样。


## 类型
### 命名的语义化
实现 ETR

### 数据类型的语义化
* 如果语言有布尔值类型，不要和数值 1/0 混用。
* JavaScript 中应该返回布尔值的函数不要返回其他类型
    ```js
    function isLogin () {
        return id && phone;
    }
    ```
    这个函数的返回值大多数时候可以进行布尔值判断，但实际的返回值并不是布尔值。如果是用在布尔值判断以为的情况就可能出问题

### 数据结构的语义化
1. 实现 ETU。
2. 数据结构应该尽可能准确的反映真实世界的逻辑关系，这样才能更好的模拟真实世界，也使得数据结构更容易理解。
3. 例如 Combine Functions Into Class 这条重构所反映的：如果一组数据在真实的世界里，在一般人的理解中是一个整体，那么反映它们的数据结构也应该是一个整体。
4. 又比如一个完整的电话号码，包括国家代码、地区代码和具体的号码，那么保存电话号码的数据结构也应该反应出这样的接口，而非使用简单的数字字符串。

### 逻辑的语义化
1. 逻辑要尽量符合正常人的正常思维。代码要对人友好，而不是对机器友好。
2. 对人友好的代码可能逻辑上有一点啰嗦，不够简洁，甚至性能也会有一点点差。但是大多数情况下，节省几行代码并不会带来性能上的提升，但却会增加理解的困难。


## 涉及的 bad codes
* Data Clumps：实际上是一个整体，那就包装成一个整体
* Mysterious Name
* Primitive Obsession：如果数据代表的现实就是有结构的，那就实现它的数据结构也要表现出相同的结构
* Refused Bequest：如果你不是很的要继承一个类而只是想用它的某些方法，那就不要使用语义明确的继承，而应该使用组合


## 涉及的重构
### Dealing with Inheritance
* Replace Subclass with Delegate
* Replace Superclass with Delegate
* Replace Type Code with Subclasses

### Encapsulation
* Replace Primitive with Object

### Most Common Refactorings
* 类型严格：一个数据是什么类型就用什么类型。
* 严格设置默认值
* 用常量代替基础类型值：使用一个命名明确的常量
* Change Function Declaration
* Combine Functions Into Class
* Combine Functions into Transform
* Combine Variables Into Record
* Introduce Parameter Object
* Rename Variable

### Moving Features
* Move Field
* Slide Statements

### Organizing Data
* Rename Field
* Split Variable

### Refactoring APIs
* Preserve Whole Object

### Simplifying Conditional Logic
* Introduce Assertion
* Replace Nested Conditional with Guard Clauses


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
