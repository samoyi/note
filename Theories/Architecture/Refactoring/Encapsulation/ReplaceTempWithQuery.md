# Replace Temp with Query


TODO


<!-- TOC -->

- [Replace Temp with Query](#replace-temp-with-query)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [使用函数和使用变量的异同](#使用函数和使用变量的异同)
        - [在 class 中使用这个重构更合适——封装为函数会增加作用域，增加传参，class 中可以避免这一点。](#在-class-中使用这个重构更合适封装为函数会增加作用域增加传参class-中可以避免这一点)
        - [不适合被替换的变量](#不适合被替换的变量)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 算是 Encapsulate Variable 的一种特殊情况吧
2. 查询函数相比于临时变量的优势，还是明确的边界和通过改变参数来复用计算逻辑吧。


## Motivation
### 使用函数和使用变量的异同
1. One use of temporary variables is to capture the value of some code in order to refer to it later in a function. 这一点函数也可以达到相同的效果。
2. Using a temp allows me to refer to the value while explaining its meaning and avoiding repeating the code that calculates it. 函数名同样可以表明意义，但使用函数如果想避免重复计算，必须使用缓存。
3. 书上这样说：“If I’m working on breaking up a large function, turning variables into their own functions makes it easier to extract parts of the function, since I no longer need to pass in variables into the extracted functions.” 不需要传参变量，但我还是要引用函数啊。
4. Putting this logic into functions often also sets up a stronger boundary between the extracted logic and the original function, which helps me spot and avoid awkward dependencies and side effects. 函数确实是有了明确的独立边界，在调试的时候更方便。
5. 如果是在多个地方都有同样的计算逻辑只不过输入数据不同，那使用函数可以方便的复用。

### 在 class 中使用这个重构更合适——封装为函数会增加作用域，增加传参，class 中可以避免这一点。
1. This refactoring works best if I’m inside a class, since the class provides a shared context for the methods I’m extracting. 
2. Outside of a class, I’m liable to have too many parameters in a top-­level function which negates much of the benefit of using a function. 
3. Nested functions can avoid this, but they limit my ability to share the logic between related functions.

### 不适合被替换的变量
1. Only some temporary variables are suitable for *Replace Temp with Query*. The variable needs to be calculated once and then only be read afterwards. 不懂，如果之后只读不再重新计算，为什么要用函数呢？每次调用函数都要在运行一次计算啊。难道不是需要重复计算的才适合被提取为函数吗？就像 vue 中的计算属性
2. In the simplest case, this means the variable is assigned to once, but it’s also possible to have several assignments in a more complicated lump of code—all of which has to be extracted into the query. 
3. Furthermore, the logic used to calculate the variable must yield the same result when the variable is used later—which rules out variables used as snapshots with names like `oldAddress`.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
