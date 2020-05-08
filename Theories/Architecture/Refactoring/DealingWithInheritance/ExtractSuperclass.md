# Extract Superclass


<!-- TOC -->

- [Extract Superclass](#extract-superclass)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [备选方案](#备选方案)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
提取相同的部分，统一管理


## Motivation
1. If I see two classes doing similar things, I can take advantage of the basic mechanism of inheritance to pull their similarities together into a superclass. 
2. I can use *Pull Up Field* to move common data into the superclass, and *Pull Up Method* to move the common behavior.
3. Many writers on object orientation treat inheritance as something that should be carefully planned in advance, based on some kind of classification structure in the “real world.” 
4. Such classification structures can be a hint towards using inheritance — but just as often inheritance is something I realize during the evolution of a program, as I find common elements that I want to pull together.

### 备选方案
1. An alternative to *Extract Superclass* is *Extract Class*. 
2. Here you have, essentially, a choice between using inheritance or delegation as a way to unify duplicate behavior. 3. Often *Extract Superclass* is the simpler approach, so I’ll do this first knowing I can use *Replace Superclass with Delegate* should I need to later.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
