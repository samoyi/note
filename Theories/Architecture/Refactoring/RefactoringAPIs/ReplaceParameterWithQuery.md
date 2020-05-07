# Replace Parameter with Query

inverse of: Replace Query with Parameter


<!-- TOC -->

- [Replace Parameter with Query](#replace-parameter-with-query)
    - [思想](#思想)
        - [API 设计要做人民公仆](#api-设计要做人民公仆)
    - [Motivation](#motivation)
        - [函数形参的意义——指明函数可能的功能变化](#函数形参的意义指明函数可能的功能变化)
        - [如果一个值是功能提供者很容易获得的，那就考虑不要把它设为参数](#如果一个值是功能提供者很容易获得的那就考虑不要把它设为参数)
        - [权衡耦合度](#权衡耦合度)
        - [保持引用透明是最好的](#保持引用透明是最好的)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### API 设计要做人民公仆
1. 我们这里讨论的是 API 设计，所以应该优先考虑为调用者减轻工作量，让它减少不必要的参数传递。
2. 一个本来的参数，明明提供者可以统一在内部获取，但如果将它定为参数，则每一个调用者都需要自己计算并传参。
3. 当然也要做权衡，如果调用者传参的好处更明显，那就让调用者传参。比如纯函数。


## Motivation
### 函数形参的意义——指明函数可能的功能变化
The parameter list to a function should summarize the points of variability of that function, indicating the primary ways in which that function may behave differently. 

### 如果一个值是功能提供者很容易获得的，那就考虑不要把它设为参数
1. As with any statement in code, it’s good to avoid any duplication, and it’s easier to understand if the parameter list is short. 
2. If a call passes in a value that the function can just as easily determine for itself, that’s a form of duplication — one that unnecessarily complicates the caller which has to determine the value of a parameter when it could be freed from that work.

### 权衡耦合度
1. The limit on this is suggested by the phrase “just as easily.” By removing the parameter, I’m shifting the responsibility for determining the parameter value.
2.  When the parameter is present, determining its value is the caller’s responsibility; otherwise, that responsibility shifts to the function body. 
3. My usual habit is to simplify life for callers, which implies moving responsibility to the function body — but only if that responsibility is appropriate there.
4. The most common reason to avoid *Replace Parameter with Query* is if removing the parameter adds an unwanted dependency to the function body — forcing it to access a program element that I’d rather it remained ignorant of. 

### 保持引用透明是最好的
1. The safest case for *Replace Parameter with Query* is when the value of the parameter I want to remove is determined merely by querying another parameter in the list. 
2. There’s rarely any point in passing two parameters if one can be determined from the other. 
3. One thing to watch out for is if the function I’m looking at has **referential transparency** — that is, if I can be sure that it will behave the same way whenever it’s called with the same parameter values. 
4. Such functions are much easier to reason about and test, and I don’t want to alter them to lose that property. So I wouldn’t replace a parameter with an access to a mutable global variable.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
