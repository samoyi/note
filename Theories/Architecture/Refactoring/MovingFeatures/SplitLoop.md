# Split Loop



<!-- TOC -->

- [Split Loop](#split-loop)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
SRP


## Motivation
1. You often see loops that are doing two different things at once just because they can do that with one pass through a loop. 
2. But if you’re doing two different things in the same loop, then whenever you need to modify the loop you have to understand both things.
3. By splitting the loop, you ensure you only need to understand the behavior you need to modify.
4. Splitting a loop can also make it easier to use. A loop that calculates a single value can just return that value. Loops that do many things need to return structures or populate local variables. 
5. Many programmers are uncomfortable with this refactoring, as it forces you to execute the loop twice. 
6. My reminder, as usual, is to separate refactoring from optimization. Once I have my code clear, I’ll optimize it, and if the loop traversal is a bottleneck, it’s easy to slam the loops back together. 
7. But the actual iteration through even a large list is rarely a bottleneck, and splitting the loops often enables other, more powerful, optimizations.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
