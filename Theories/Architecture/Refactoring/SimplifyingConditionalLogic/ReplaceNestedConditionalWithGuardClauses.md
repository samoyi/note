# Replace Nested Conditional with Guard Clauses


<!-- TOC -->

- [Replace Nested Conditional with Guard Clauses](#replace-nested-conditional-with-guard-clauses)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 这里的理念是，应该区分正常的分支流程判断和异常输入的判断。
2. guard clause 实际上就是守卫正常的流程逻辑，禁止异常输入进入。
3. 异常逻辑和正常逻辑应该是做区分的。


## Motivation
1. I often find that conditional expressions come in two styles. In the first style, both legs of the conditional are part of normal behavior, while in the second style, one leg is normal and the other indicates an unusual condition.
2. These kinds of conditionals have different intentions — and these intentions should come through in the code. 
3. If both are part of normal behavior, I use a condition with an `if` and an `else` leg. If the condition is an unusual condition, I check the condition and return if it’s true. This kind of check is often called a **guard clause**.
4. The key point of Replace Nested Conditional with Guard Clauses is emphasis. 
5. If I’m using an if-­then-­else construct, I’m giving equal weight to the `if` leg and the `else` leg. This communicates to the reader that the legs are equally likely and important.
6. Instead, the guard clause says, “This isn’t the core to this function, and if it happens, do something and get out.”


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
