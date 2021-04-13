# Move Statements to Callers

inverse of: *Move Statements into Function*


<!-- TOC -->

- [Move Statements to Callers](#move-statements-to-callers)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
1. 这里的 callers 意思应该是调用被修改函数的函数。例如 `foo` 调用 `bar`，`bar` 里面有一个要移出的语句，则 `foo` 就是 caller。
2. 和 *Move Statements into Function* 相反：之前一个语句在意图上是属于一个函数 `bar` 的，后来逻辑发生了变化，不属于了，所以就移出来，直接放进 `foo` 里面。
3. 这条重构你大概都不需要主动去进行，因为之前这个函数可以在好几个地方共用，但功能变化后你发现，不同地方再使用这个函数的时候，函数中大部分逻辑还是能共用，但有少量需要个性化。那么这部分个性化的内容就应该提取出去。


## Mechanics
1. In simple circumstances, where you have only one or two callers and a simple function to call from, just cut the first line from the called function and paste (and perhaps fit) it into the callers. Test and you’re done. 
2. Otherwise, apply Extract Function to all the statements that you don’t wish to move; give it a temporary but easily searchable name. 
    * If the function is a method that is overridden by subclasses, do the extraction on all of them so that the remaining method is identical in all classes. Then remove the subclass methods. 
3. Use Inline Function on the original function. 
4. Apply Change Function Declaration on the extracted function to rename it to the original name. Or to a better name, if you can think of one.
5. TODO 为什么不把要提取的语句先提取为一个临时函数？


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
