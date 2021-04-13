# Split Loop



<!-- TOC -->

- [Split Loop](#split-loop)
    - [思想](#思想)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [Motivation](#motivation)
        - [先 SRP](#先-srp)
        - [整理好了，再性能考虑](#整理好了再性能考虑)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
* SRP
* **改革的阵痛**：重构一个运行中的庞杂系统确实可能会带来性能问题，但你只有在把它理清楚之后，才能做更好的改进。
* 可读性权衡：不要为了通用或者复用而明显降低可读性。


## 涉及的 bad codes 
* Speculative Generality


## Motivation
### 先 SRP
1. You often see loops that are doing two different things at once just because they can do that with one pass through a loop. 
2. But if you’re doing two different things in the same loop, then whenever you need to modify the loop you have to understand both things.
3. By splitting the loop, you ensure you only need to understand the behavior you need to modify.
4. Loops that do many things need to return structures or populate local variables. Splitting a loop can also make it easier to use. 
5. A loop that calculates a single value can just return that value. I frequently follow a sequence of Split Loop followed by *Extract Function*.

### 整理好了，再性能考虑
1. Many programmers are uncomfortable with this refactoring, as it forces you to execute the loop twice. 
2. My reminder, as usual, is to separate refactoring from optimization. Once I have my code clear, I’ll optimize it, and if the loop traversal is a bottleneck, it’s easy to slam the loops back together. 
3. 把两个分离好的函数调用放在循环里，总比在循环里混写两个逻辑要好。
4. But the actual iteration through even a large list is rarely a bottleneck, and splitting the loops often enables other, more powerful, optimizations.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
