# Replace Query with Parameter

inverse of: Replace Parameter with Query


<!-- TOC -->

- [Replace Query with Parameter](#replace-query-with-parameter)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [优点是解耦和，让模块更容易理解、更容易测试和更容易复用](#优点是解耦和让模块更容易理解更容易测试和更容易复用)
        - [缺点是增加了调用者的负担](#缺点是增加了调用者的负担)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
低耦合纯函数


## Motivation
### 优点是解耦和，让模块更容易理解、更容易测试和更容易复用
1. When looking through a function’s body, I sometimes see references to something in the function’s scope that I’m not happy with. This might be a reference to a global variable, or to an element in the same module that I intend to move away. 
2. To resolve this, I need to replace the internal reference with a parameter, shifting the responsibility of resolving the reference to the caller of the function.
3. Most of these cases are due to my wish to alter the dependency relationships in the code — to make the target function no longer dependent on the element I want to parameterize. 
4. There’s a tension here between converting everything to parameters, which results in long repetitive parameter lists, and sharing a lot of scope which can lead to a lot of coupling between functions. 
5. It’s easier to reason about a function that will always give the same result when called with same parameter values — this is called referential transparency. 
6. If a function accesses some element in its scope that isn’t referentially transparent, then thecontaining function also lacks referential transparency. I can fix that by moving that element to a parameter. 
7. Although such a move will shift responsibility to the caller, there is often a lot to be gained by creating clear modules with referential transparency. 
8. A common pattern is to have modules consisting of pure functions which are wrapped by logic that handles the I/O and other variable elements of a program. 
9. I can use Replace Query with Parameter to purify parts of a program, making those parts easier to test and reason about.

### 缺点是增加了调用者的负担
1. But Replace Query with Parameter isn’t just a bag of benefits. By moving a query to a parameter, I force my caller to figure out how to provide this value. 
2. This complicates life for callers of the functions, and my usual bias is to design interfaces that make life easier for their consumers. 
3. In the end, it boils down to allocation of responsibility around the program, and that’s a decision that’s neither easy nor immutable — which is why this refactoring (and its inverse) is one that I need to be very familiar with.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
