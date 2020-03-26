# Replace Parameter with Query

inverse of: Replace Query with Parameter


<!-- TOC -->

- [Replace Parameter with Query](#replace-parameter-with-query)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [函数参数的意义](#函数参数的意义)
        - [精简参数的权衡](#精简参数的权衡)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 我们这里讨论的是 API 设计，所以应该优先考虑为调用者减轻工作量，让它减少不必要的参数传递。
2. 当然也要做权衡，如果调用者传参的好处更明显，那就让调用者传参。
3. 纯函数就是这样的一个例子：它们不依赖于环境，因此不会主动读取环境里的值。你在不同的环境里调用纯函数时，就需要额外的参数来传递当前环境里的值。


## Motivation
### 函数参数的意义
The parameter list to a function should summarize the points of variability of that function, indicating the primary ways in which that function may behave differently. 

### 精简参数的权衡
1. As with any statement in code, it’s good to avoid any duplication, and it’s easier to understand if the parameter list is short. 
2. If a call passes in a value that the function can just as easily determine for itself, that’s a form of duplication — one that unnecessarily complicates the caller which has to determine the value of a parameter when it could be freed from that work.
3. The limit on this is suggested by the phrase “just as easily.” By removing the parameter, I’m shifting the responsibility for determining the parameter value.
4.  When the parameter is present, determining its value is the caller’s responsibility; otherwise, that responsibility shifts to the function body. 
5. My usual habit is to simplify life for callers, which implies moving responsibility to the function body — but only if that responsibility is appropriate there.
6. The most common reason to avoid Replace Parameter with Query is if removing the parameter adds an unwanted dependency to the function body — forcing it to access a program element that I’d rather it remained ignorant of. 
7.  The safest case for Replace Parameter with Query is when the value of the parameter I want to remove is determined merely by querying another parameter in the list. There’s rarely any point in passing two parameters if one can be determined from the other. 
8. One thing to watch out for is if the function I’m looking at has referential transparency — that is, if I can be sure that it will behave the same way whenever it’s called with the same parameter values. 
9. Such functions are much easier to reason about and test, and I don’t want to alter them to lose that property. So I wouldn’t replace a parameter with an access to a mutable global variable


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
