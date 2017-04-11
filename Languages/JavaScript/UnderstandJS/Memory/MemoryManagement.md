# Memory Management

## JavaScript 内存使用概述
### 变量在内存中的存储位置
* 基本类型的值存储在栈内存中。
* 引用类型的值存储在堆内存中，其在堆内存的中的地址（指针）存储在栈内存中，引用类型变量即为该地址。

### Memory life cycle
Regardless of the programming language, memory life cycle is pretty much always the same:
1. Allocate the memory you need
2. Use the allocated memory (read, write)
3. Release the allocated memory when it is not needed anymore

The second part is explicit in all languages. The first and last parts are explicit in low-level languages, but are mostly implicit in high-level languages like JavaScript.


## Memory Management
### Release when the memory is not needed anymore
Most of memory management issues come at this phase.  
The hardest task here is to find when "the allocated memory is not needed any longer".   
It often requires the developer to determine where in the program such piece of memory is not needed anymore and free it.  
High-level languages embed a piece of software called "garbage collector" whose job is to track memory allocation and use in order to find when a piece of allocated memory is not needed any longer in which case, it will automatically free it.  
This process is an approximation since the general problem of knowing whether some piece of memory is needed is undecidable (can't be solved by an algorithm).


### JavaScript的垃圾回收算法： Mark-and-sweep
This algorithm reduces the definition of "an object is not needed anymore" to "an object is unreachable".  
* When a variable comes into context, such as when a variable is declared inside a function, it is flagged as being in context. Variables that are in context, logically, should never have their memory freed, because they may be used as long as execution continues in that context. When a variable goes out of context, it is also flagged as being out of context.
* Variables can be flagged in any number of ways. There may be a specific bit that is flipped when a variable is in context, or there may be an “in-context” variable list and an “out-of-context” variable list between which variables are moved. The implementation of the flagging is unimportant; it’s really the theory that is key.
* When the garbage collector runs, it marks all variables stored in memory (once again, in any number of ways). It then clears its mark off of variables that are in context and variables that are referenced by in-context variables. The variables that are marked after that are considered ready for deletion, because they can’t be reached by any in-context variables. The garbage collector then does a memory sweep, destroying each of the marked values and reclaiming the memory associated with them.

### 另一个JavaScript已经不使用的垃圾回收算法：Reference-counting
This is the most naive garbage collection algorithm. This algorithm reduces the definition of "an object is not needed anymore" to "an object has no other object referencing to it". An object is considered garbage collectable if there is zero reference pointing at this object.
#### 循环引用的bug
```
function f() {
  var o = {};
  var o2 = {};
  o.a = o2; // o references o2
  o2.a = o; // o2 references o

  return 'azerty';
}

f();
```
在上面的例子里o和o2在函数执行完之后都没用了，但因为它们都被对方的属性引用了，所以该算法并不会收回其内存。IE6和IE7对BOM对象和DOM对象使用该算法。


## References
* [Memory Management MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
* [ECMAScript 原始值和引用值](http://www.w3school.com.cn/js/pro_js_value.asp)
* [《Professional JavaScript for Web Developers》](https://book.douban.com/subject/7157249/)
