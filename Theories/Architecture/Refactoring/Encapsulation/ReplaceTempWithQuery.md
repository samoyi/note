# Replace Temp with Query


TODO


<!-- TOC -->

- [Replace Temp with Query](#replace-temp-with-query)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [使用函数和使用变量的异同](#使用函数和使用变量的异同)
        - [在 class 中使用这个重构更合适](#在-class-中使用这个重构更合适)
        - [不适合被替换的变量](#不适合被替换的变量)
    - [References](#references)

<!-- /TOC -->


## 思想
算是 Encapsulate Variable 的一种特殊情况把


## Motivation
### 使用函数和使用变量的异同
1. One use of temporary variables is to capture the value of some code in order to refer to it later in a function. 这一点函数也可以达到相同的效果。
2. Using a temp allows me to refer to the value while explaining its meaning and avoiding repeating the code that calculates it. 函数要想实现这一点，必须使用缓存。
3. 书上这样说：“If I’m working on breaking up a large function, turning variables into their own functions makes it easier to extract parts of the function, since I no longer need to pass in variables into the extracted functions.” 不需要传参变量，但我还是要引用函数啊。
4. Putting this logic into functions often also sets up a stronger boundary between the extracted logic and the original function, which helps me spot and avoid awkward dependencies and side effects. 函数确实是有了明确的独立边界，在调试的时候更方便。
5. 如果是在多个地方都有同样的计算逻辑只不过输入数据不同，那使用函数可以方便的复用。

### 在 class 中使用这个重构更合适
TODO 具体实践中再看这一点
This refactoring works best if I’m inside a class, since the class provides a shared
context for the methods I’m extracting. Outside of a class, I’m liable to have too many
parameters in a top­level function which negates much of the benefit of using a
function. Nested functions can avoid this, but they limit my ability to share the logic
between related functions.

### 不适合被替换的变量
TODO 不懂
Only some temporary variables are suitable for Replace Temp with Query. The variable needs to be calculated once and then only be read afterwards. In the simplest case, this means the variable is assigned to once, but it’s also possible to have several assignments in a more complicated lump of code—all of which has to be extracted into the query. Furthermore, the logic used to calculate the variable must yield the same result when the variable is used later—which rules out variables used as snapshots with names like oldAddress.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
