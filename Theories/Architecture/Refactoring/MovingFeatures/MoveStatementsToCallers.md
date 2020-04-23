# Move Statements to Callers

inverse of: Move Statements into Function


<!-- TOC -->

- [Move Statements to Callers](#move-statements-to-callers)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 这里的 callers 意思应该是调用被修改函数的函数。例如 `foo` 调用 `bar`，`bar` 里面有一个要移出的语句，则 `foo` 就是 caller。
2. 和 Move Statements into Function 相反：之前一个语句在意图上是属于一个函数 `bar` 的，后来逻辑发生了变化，不属于了，所以就移出来，直接放进 `foo` 里面。


## Motivation
1. Functions are the basic building block of the abstractions we build as programmers. 
2. And, as with any abstraction, we don’t always get the boundaries right. As a code base changes its capabilities — as most useful software does — we often find our abstraction boundaries shift. 
3. For functions, that means that what might once have been a cohesive, atomic unit of behavior becomes a mix of two or more different things. 
4. One trigger for this is when common behavior used in several places needs to vary in some of its calls. 
5. Now, we need to move the varying behavior out of the function to its callers. 
6. In this case, I’ll use *Slide Statements* to get the varying behavior to the beginning or end of the function and then *Move Statements to Callers*. 
7. Once the varying code is in the caller, I can change it when necessary. 
8. *Move Statements to Callers* works well for small changes, but sometimes the boundaries between caller and callee need complete reworking. 
9. In that case, my best move is to use *Inline Function* and then slide and extract new functions to form better boundaries


## Mechanics
1. In simple circumstances, where you have only one or two callers and a simple function to call from, just cut the first line from the called function and paste (and perhaps fit) it into the callers. Test and you’re done. 
2. Otherwise, apply Extract Function to all the statements that you don’t wish to move; give it a temporary but easily searchable name. 
    * If the function is a method that is overridden by subclasses, do the extraction on all of them so that the remaining method is identical in all classes. Then remove the subclass methods. 
3. Use Inline Function on the original function. 
4. Apply Change Function Declaration on the extracted function to rename it to the original name. Or to a better name, if you can think of one.
5. TODO 为什么不把要提取的语句先提取为一个临时函数？


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
