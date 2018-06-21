# Memory Management

## JavaScript 内存使用概述
### 变量在内存中的存储位置
* 基本类型的值存储在栈内存中。
* 引用类型的值存储在堆内存中，其在堆内存的中的地址（指针）存储在栈内存中，引用类型变量即
为该地址。

### Memory life cycle
Regardless of the programming language, memory life cycle is pretty much always
the same:
1. **Allocate memory** — memory is allocated by the operating system which allows
 your program to use it. In low-level languages (e.g. C) this is an explicit
 operation that you as a developer should handle. In high-level languages,
 however, this is taken care of for you.
2. **Use memory** — this is the time when your program actually makes use of the
 previously allocated memory. Read and write operations are taking place as
 you’re using the allocated variables in your code.
3. **Release memory** — now is the time to release the entire memory that you
don’t need so that it can become free and available again. As with the Allocate
memory operation, this one is explicit in low-level languages.

#### In high-level languages
1. The second part is explicit in all languages. The first and last parts are
explicit in low-level languages, but are mostly implicit in high-level languages
 like JavaScript.
2. This seemingly “automatical” nature of freeing up resources is a source of
confusion and gives JavaScript (and other high-level-language) developers the
false impression they can choose not to care about memory management. **This is
a big mistake**.


## Memory Management
### Release when the memory is not needed anymore
1. Most of memory management issues come at this phase.  
2. The hardest task here is to find when "the allocated memory is not needed any
 longer".   
3. It often requires the developer to determine where in the program such piece
of memory is not needed anymore and free it.  
4. High-level languages embed a piece of software called "garbage collector"
whose job is to track memory allocation and use in order to find when a piece of
 allocated memory is not needed any longer in which case, it will automatically
free it.  
5. This process is an approximation since the general problem of knowing whether
 some piece of memory is needed is undecidable (can't be solved by an algorithm).

### JavaScript 的垃圾回收算法： Mark-and-sweep
This algorithm reduces the definition of "an object is not needed anymore" to
"an object is unreachable".  

1. When a variable comes into context, such as when a variable is declared
inside a function, it is flagged as being in context.
2. Variables that are in context, logically, should never have their memory
freed, because they may be used as long as execution continues in that context.
3. When a variable goes out of context, it is also flagged as being out of
context.
4. Variables can be flagged in any number of ways. There may be a specific bit
that is flipped when a variable is in context, or there may be an “in-context”
variable list and an “out-of-context” variable list between which variables are
moved. The implementation of the flagging is unimportant; it’s really the theory
 that is key.
5. When the garbage collector runs, it marks all variables stored in memory
(once again, in any number of ways).
6. It then clears its mark off of variables that are in context and variables
that are referenced by in-context variables.
7. The variables that are marked after that are considered ready for deletion,
because they can’t be reached by any in-context variables.
8. The garbage collector then does a memory sweep, destroying each of the marked
 values and reclaiming the memory associated with them.


## References
* [Memory Management MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
* [ECMAScript 原始值和引用值](http://www.w3school.com.cn/js/pro_js_value.asp)
* [《Professional JavaScript for Web Developers》](https://book.douban.com/subject/7157249/)
* [How JavaScript works: memory management + how to handle 4 common memory leaks](https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec)
* [上面引用的翻译](https://juejin.im/post/5a2559ae6fb9a044fe4634ba)
