# Decompose Conditional

inverse of: Change Value to Reference


<!-- TOC -->

- [Decompose Conditional](#decompose-conditional)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [复杂的条件分支理解起来很复杂，而且会增加函数长度](#复杂的条件分支理解起来很复杂而且会增加函数长度)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 其实也是意图和实现分离。
2. 判断一个条件可以逻辑比较复杂，但我阅读分支流程的时候不需要关心具体是怎么判断的，我只需要知道判断的内容和结果即可。
3. 同样，一个条件分支内部的执行也是一样，我不需要看它执行的实现是什么、是怎么干的，只需要知道它干了什么就行。
4. 当我需要了解具体的判断逻辑和执行逻辑时，再去看封装的函数。


## Motivation
### 复杂的条件分支理解起来很复杂，而且会增加函数长度
1. One of the most common sources of complexity in a program is complex conditional logic. 
2. As I write code to do various things depending on various conditions, I can quickly end up with a pretty long function. 
3. Length of a function is in itself a factor that makes it harder to read, but conditions increase the difficulty. 


## Mechanics
1. As with any large block of code, I can make my intention clearer by decomposing it and replacing each chunk of code with a function call named after the intention of that chunk. 
2. With conditions, I particularly like doing this for the conditional part and each of the alternatives. 
3. This way, I highlight the condition and make it clear what I’m branching on. I also highlight the reason for the branching.
4. This is really just a particular case of applying *Extract Function* to my code, but I like to highlight this case as one where I’ve often found a remarkably good value for the exercise.
5. 如果条件判断比较复杂，就把条件判断封装为函数；如果判断后的执行很复杂，也封装为函数。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
