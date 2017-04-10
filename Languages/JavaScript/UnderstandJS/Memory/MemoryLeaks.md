# MemoryLeaks

## JavaScript 的内存管理机制
* JavaScript is a garbage-collected language, meaning that the execution environment is responsible for managing the memory required during code execution.
* The basic idea is simple: figure out which variables aren’t going to be used and free the memory associated with them.
* This process is periodic, with the garbage collector running at specified intervals (or at predefined collection moments in code execution). Consider the normal life cycle of a local variable in a function.
    1. The variable comes into existence during the execution of the function. At that time, memory is allocated on the stack (and possibly on the heap) to provide storage space for the value.
    2. The variable is used inside the function and then the function ends. At that point this variable is no longer needed, so its memory can be reclaimed for later use.
    3.  In this situation, it’s obvious that the variable isn’t needed, but not all situations are as obvious.
    4. The garbage collector must keep track of which variables can and can’t be used so it can identify likely candidates for memory reclamation. The strategy for identifying the unused variables may differ on an implementation basis, though two strategies have traditionally been used in browsers:**Mark-and-Sweep** and **Reference Counting**. *(详细介绍参考 《Professional JavaScript for Web Developers》 Chapter 4)*
* 另一段对JS内存管理的概述：
> JavaScript is one of the so called garbage collected languages. Garbage collected languages help developers manage memory by periodically checking which previously allocated pieces of memory can still be "reached" from other parts of the application. In other words, garbage collected languages reduce the problem of managing memory from "what memory is still required?" to "what memory can still be reached from other parts of the application?". The difference is subtle, but important: while only the developer knows whether a piece of allocated memory will be required in the future, unreachable memory can be algorithmically determined and marked for return to the OS.


## Leaks in JavaScript
### Accidental global variables
* 如果不使用严格模式，函数内部不使用`var`声明的变量和`this`都会成为全局变量。
* If you must use a global variable to store data, make sure to null it.
* One common cause for increased memory consumption in connection with globals are **caches**. Caches must have an upper bound for its size. Caches that grow unbounded can result in high memory consumption because their contents cannot be collected.

### Forgotten timers or callbacks

## References
* [4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)
* [上面文章的译文](http://web.jobbole.com/88463/)
* [Manual memory management](https://en.wikipedia.org/wiki/Manual_memory_management)
