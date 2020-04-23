# Move Statements into Function

inverse of: Move Statements to Callers


<!-- TOC -->

- [Move Statements into Function](#move-statements-into-function)
    - [思想](#思想)
        - [意图与实现的区分](#意图与实现的区分)
    - [Motivation](#motivation)
        - [如果语句总是伴随着某个函数执行，那就可以考虑直接把它移进那个函数](#如果语句总是伴随着某个函数执行那就可以考虑直接把它移进那个函数)
        - [总是伴随执行，也不一定要移进去——要考虑语义化](#总是伴随执行也不一定要移进去要考虑语义化)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 意图与实现的区分
下面 Motivation 的描述可以看到，如果一个语句的意图是属于一个函数的，那就应该把它放进那个函数。但如果只是在实现上一个语句会紧随一个函数调用，则不应该把它放进这个函数里，而应该用一个新的表示意图的函数包裹当前的函数和语句。


## Motivation
### 如果语句总是伴随着某个函数执行，那就可以考虑直接把它移进那个函数
1. Removing duplication is one of the best rules of thumb of healthy code. 
2. If I see the same code executed every time I call a particular function, I look to combine that repeating code into the function itself. 
3. That way, any future modifications to the repeating code can be done in one place and used by all the callers. 
3. Should the code vary in the future, I can easily move it (or some of it) out again with *Move Statements to Callers*.

### 总是伴随执行，也不一定要移进去——要考虑语义化
1. 上面说了可以考虑，因为一个语句应不应该放在一个函数里，除了是否同步执行，还要从语义上考虑，它是否属于这个函数。
2. I move statements into a function when I can best understand these statements as part of the called function. 
3. If they don’t make sense as part of the called function, but still should be called with it, I’ll simply use *Extract Function* on the statements and the called function. 把语句和函数封装为一个新的函数。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
