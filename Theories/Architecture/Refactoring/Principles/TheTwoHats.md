# The Two Hats


<!-- TOC -->

- [The Two Hats](#the-two-hats)
    - [思想](#思想)
    - [两种开发状态](#两种开发状态)
        - [两种状态快速切换](#两种状态快速切换)
    - [References](#references)

<!-- /TOC -->


## 思想


## 两种开发状态
1. Kent Beck came up with a metaphor of the two hats. When I use refactoring to develop software, I divide my time between two distinct activities: adding functionality and refactoring. 
2. When I add functionality, I shouldn’t be changing existing code; I’m just adding new capabilities. I measure my progress by adding tests and getting the tests to work. 
3. When I refactor, I make a point of not adding functionality; I only restructure the code. I don’t add any tests (unless I find a case I missed earlier); I only change test swhen I have to accommodate a change in an interface.

### 两种状态快速切换
1. As I develop software, I find myself swapping hats frequently. 
2. I start by trying to add a new capability, then I realize this would be much easier if the code were structured differently. So I swap hats and refactor for a while.
3. Once the code is better structured, I swap hats back and add the new capability. 
4. Once I get the new capability working, I realize I coded it in a way that’s awkward to understand, so I swap hats again and refactor. 
5. All this might take only ten minutes, but during this time I’m always aware of which hat I’m wearing and the subtle difference that makes to how I program.
6. 可以看出来，这种快速的切换需要重构按照 `./DefiningRefactoring.md` 中说的方式来进行，才能在重构的同时不影响现有的功能。


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
