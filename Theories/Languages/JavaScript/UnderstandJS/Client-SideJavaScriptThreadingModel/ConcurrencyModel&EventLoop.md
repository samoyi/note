# Concurrency model and Event Loop


JavaScript Runtime:
<img src="./images/RuntimeConcepts.svg" width="400" style="display: block; margin: 5px 0 10px 0;" />


<!-- TOC -->

- [Concurrency model and Event Loop](#concurrency-model-and-event-loop)
    - [TODO](#todo)
        - [异步回调是否被会错误打断](#异步回调是否被会错误打断)
    - [The JavaScript Engine](#the-javascript-engine)
        - [Call stack](#call-stack)
        - [Memory Heap](#memory-heap)
    - [JS 既然是单线程，为什么可以执行异步操作？](#js-既然是单线程为什么可以执行异步操作)
        - [Basic Architecture](#basic-architecture)
    - [Event Table and Event Queue](#event-table-and-event-queue)
        - [事件表](#事件表)
        - [事件队列](#事件队列)
    - [事件循环](#事件循环)
        - [一个事件循环流程](#一个事件循环流程)
        - [`main()` 以及 `setTimeout` 的回调总是最后执行](#main-以及-settimeout-的回调总是最后执行)
    - [宏任务和微任务](#宏任务和微任务)

<!-- /TOC -->


## TODO
### 异步回调是否被会错误打断
* 在 Chrome 和 FF 上（2018.7），异步回调的执行不会被之前的同步错误打断：
    ```js
    setTimeout(()=>{
        console.log(22);
    })
    throw new Error();
    console.log(33);
    ```
    先输出错误后输出`22`。用 AJAX 测试也是不会被打断。  
* 但在 Node.js(8.1.2) 上只会输出错误


## The JavaScript Engine
JavaScript 引擎主要由两部分组成：
* Memory Heap — this is where the memory allocation happens
* Call Stack — this is where your stack frames are as your code executes

### Call stack
1. JavaScript has a single call stack in which it keeps track of what function we’re currently executing and what function is to be executed after that.
2. 每一个函数调用都会在往调用栈内 push 一个 frame
    ```js
    function foo(b) {
        var a = 10;
        return a + b + 11;
    }

    function bar(x) {
        var y = 3;
        return foo(x * y);
    }

    console.log(bar(7)); // returns 42
    ```
3. When calling `bar`, a first frame is created containing `bar`'s arguments and local variables.
4. When `bar` calls `foo`, a second frame is created and pushed on top of the first one containing `foo`'s arguments and local variables.
5. When `foo` returns, the top frame element is popped out of the stack (leaving only `bar`'s call frame).
6. When `bar` returns, the stack is empty.

### Memory Heap
Objects are allocated in a heap which is just a name to denote a large mostly unstructured region of memory.（日文：オブジェクトはヒープに割り当てられています。ヒープは、メモリの大規模で大部分は構造化されていない領域を意味する名前です。）


## JS 既然是单线程，为什么可以执行异步操作？
1. 很明显，异步操作显然是两个操作在同时执行。
2. The short answer is that JavaScript language is single-threaded and the asynchronous behaviour is not part of the JavaScript language itself, rather they are built on top of the core JavaScript language in the browser (or the
programming environment) and accessed through the browser APIs.

### Basic Architecture
<img src="./images/EventLoopBasicArchitecture.png" width="600" style="display: block; margin: 5px 0 10px;" />

1. 上图中只有 V8 JS 虚线框部分是 JS 引擎，它确实是单线程的。
2. 所谓的异步操作是在虚线框外部的执行环境（例如浏览器）还可以执行其他操作，从而形成并发异步。
3. 执行环境提供给 JS 一些异步操作 API（上图的 WebAPIs），JS 调用这些 API 并传入回调函数。
4. 执行环境帮助 JS 执行这些异步操作，执行完成后，把相应的回调函数加入到下面讲到的 EventTable，等待被 JS 执行。


## Event Table and Event Queue
1. 在没有异步操作的情况下，JS 就会按照上面 `Stack` 说明中的方式，不断的线性执行，直到程序结束。
2. 但如果程序中执行了一个异步操作，就会涉及到另外两个数据结构：**事件表**（Event Table） 和 **事件队列**（Event Queue）。
3. 看起来事件队列 **消息队列**（Message Queue）的部分。另外，结合上面的图片，看起来也可以称为 Callback Queue。
4. 并不是所有的异步操作都会被加入到消息队列中，详见下面的 【Macrotask 和 Microtask】

### 事件表
1. 这个数据结构记录了事件及其对应的回调函数。
2. 当一个事件发生时，事件表就会把该事件对应的回调函数传递给事件队列。
3. 事件表不会执行回调（这是调用栈里的工作），也不会把回调推入调用栈（这是事件队列和事件循环的工作），它只负责记录事件及其回调，以及在事件发生时把回调传递给事件队列。

### 事件队列
1. 是队列结构的数据结构，事件队列保证了若干个事件回调按照顺序依次执行。
2. 事件队列从事件表那里接收到回调函数，但还需要某种机制来把队列里面的回调函数推进调用栈。这种机制就是下面要说的 **事件循环**（Event loop）。

## 事件循环
1. 事件循环是一个持续运行的进程，它不断的检查调用栈是否被清空。
2. 一次检查周期被称为一次 **tick**，每次 tick 事件循环机制会检查调用栈是否被清空。
3. 如果清空了，事件循环机制会看看事件队列里有没有待执行的回调，如果有的话，就把排在最前面的回调推进调用栈，如果没有就什么也不做。

### 一个事件循环流程
```js
function main(){
    console.log('A');
    setTimeout(
        function display(){ console.log('B'); }
    ,0);
	console.log('C');
}
main();
```
<img src="./images/EventLoop.png" width="1200" style="display: block; margin: 5px 0 10px 0;" />
可以看 [视频演示](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

### `main()` 以及 `setTimeout` 的回调总是最后执行
1. 如下代码，`timeout` 是最后被打印出来的
    ```js
    setTimeout(function(){
        console.log('timeout');
    }, 0);

    for(let i=0; i<999; i++){
        console.log('loop');
    }

    console.log('end');
    ```
2. 上面说到，事件循环机制会一直检查调用栈，如果调用栈清空了，就把事件队列里面的函数加入到调用栈开始执行。
3. 那么你可能会这样分析上面代码：
    1. JS 调用了浏览器的 `setTimeout` 接口，告诉浏览器立刻（0 毫秒后）把 `console.log('timeout')` 加入事件队列。
    2. `setTimeout` 函数执行完后，它的执行环境就会被 pop 出调用栈。
    3. 因为在上面的代码中 `setTimeout` 并不是被其他函数嵌套调用的，所以 `setTimeout` 的执行环境看起来就是在调用栈的最底部。
    4. 既然 `setTimeout` 的执行环境已经出栈了，那调用栈就应该是空了。
    5. 因此事件表会把 `console.log('timeout')` 加入事件队列。
    6. 之前事件队列也是空的，所以紧接着事件队列把该函数推入调用栈，打印出 `'timeout'`。
4. 但显然分析结果与事实不符。`console.log('timeout')` 不但没有立刻被调用，它在漫长的 `for` 循环里也没有机会插队，甚至在 `for` 循环结束后仍然没有被推入调用栈。直到最后的 `console.log('end')` 执行完，`console.log('timeout')` 才被推入栈中执行。
5. 也就是说，直到最后的 `console.log('end')` 执行完，调用栈才彻底空了。之前栈底一直有什么函数一直没有被返回。
6. 虽然以前可能没注意，但在追踪调用栈的时候，确实是会看到这个函数的：
    ```js
    function foo(){
        console.trace()
    }
    foo();
    ```
    打印的结果是：
    ```
    console.trace
    foo @ test.html:30
    (anonymous) @ test.html:32
    ```
7. 就是最后那个匿名函数。现在不明白它的机制，大概就是类似于 C 的 `main` 函数，但它总是作为整个执行环境的最外层被调用。在 [上面那个视频](https://www.youtube.com/watch?v=8aGhZQkoFbQ) 里，这个匿名函数被写为了 `main`。可能是 “全局执行环境栈”，参考这篇：`Theories\Languages\JavaScript\UnderstandJS\ExecutionContext&VariableObject&ScopeChain.md`
8. 因为它是在整个执行环境的最外层，而不是某个函数的最外层，所以即使异步操作是在函数内部，回调也不会在函数返回后执行，而是仍然要等到其他代码执行完：
    ```js
    function foo(){
        setTimeout(function(){
            console.log('timeout'); // 仍然是在最后被打印，而不是在 out 之前
        }, 0);

        for(let i=0; i<999; i++){
            console.log('loop');
        }

        console.log('end');
    }

    foo();
    console.log('out');
    ```
9. 当然，在事件循环本次 tick 的最后，这个全局执行环境也会被弹出调用栈，否则也不会进入下一个 tick 执行事件队列里后续的事件。
10. 那也就是说说，事件循环的每次 tick，都会先入栈这个全局执行环境，最后也都会对它执行出栈。


## 宏任务和微任务
判断一下下面的输出顺序：
```js
setTimeout(function(){
    console.log(3)
});

new Promise(function(resolve){
    console.log(1);
    for(var i = 0; i < 10000; i++){
        i == 99 && resolve();
    }
 }).then(function(){
     console.log(4)
 });

 console.log(2);
 ```
 上面的输出顺序不是 1 2 3 4，而是 1 2 4 3。同样是异步操作，为什么在后面的反而比前面的更早执行。这就是 **宏任务**（Macrotask）和 **微任务**（Microtask）的区别。

### 宏任务的执行过程
1. 我们先从主线程和调用栈开始分析。我们知道，调用栈是一种数据结构，用来 **管理在主线程上执行的函数的调用关系**。
2. 接下来我们通过执行下面这段代码，来分析下调用栈是如何管理主线程上函数调用的
    ```js
    function bar() {
    }
    foo(fun){
        fun()
    }
    foo(bar)
    ```
3. 当 V8 准备执行这段代码时，会先将全局执行上下文压入到调用栈中，如下图所示
    <img src="./images/01.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
4. 然后 V8 便开始在主线程上执行 `foo` 函数，首先它会创建 `foo` 函数的执行上下文，并将其压入栈中，那么此时调用栈、主线程的关系如下图所示
    <img src="./images/02.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. 然后，`foo` 函数又调用了 `bar` 函数，那么当 V8 执行 `bar` 函数时，同样要创建 `bar` 函数的执行上下文，并将其压入栈中，最终效果如下图所示
    <img src="./images/03.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
6. 等 `bar` 函数执行结束，V8 就会从栈中弹出 `bar` 函数的执行上下文，此时的效果如下所示
    <img src="./images/04.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
7. 最后，`foo` 函数执行结束，V8 会将 `foo` 函数的执行上下文从栈中弹出，效果如下所示
    <img src="./images/05.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />

### 使用异步宏任务解决栈溢出
1. 以上就是调用栈管理主线程上函数调用的方式。不过，这种方式会带来一种问题，那就是栈溢出。比如下面这段代码
    ```js
    function foo(){
        foo()
    }
    foo()
    ```
2. 由于 `foo` 函数内部嵌套调用它自己，所以在调用 `foo` 函数的时候，它的栈会一直向上增长，最终导致栈溢出
    <img src="./images/06.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
3. 我们可以使用 `setTimeout` 来解决栈溢出的问题，`setTimeout` 的本质是将同步函数调用改成异步函数调用，这里的异步调用是将 `foo` 封装成事件，并将其添加进消息队列中，然后主线程再按照一定规则循环地从消息队列中读取下一个任务
    ```js
    function foo() {
        setTimeout(foo, 0)
    }
    foo()
    ```
4. 现在我们可以从调用栈、主线程、消息队列这三者的角度来分析这段代码的执行流程了。
5. 首先，主线程会从消息队列中取出需要执行的宏任务，假设当前取出的任务就是要执行的这段代码，这时候主线程便会进入代码的执行状态。这时关于主线程、消息队列、调用栈的关系如下图所示
    <img src="./images/07.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
6. 接下来 V8 就要执行 `foo` 函数了，执行 `foo` 函数时，同样会创建 `foo` 函数的执行上下文，并将其压入栈中，最终效果如下图所示    
    <img src="./images/08.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
7. 当 V8 执行执行 `foo` 函数中的 `setTimeout` 时，`setTimeout` 会将 `foo` 函数封装成一个新的宏任务，并将其添加到消息队列中，在 V8 执行 `setTimeout` 函数时的状态图如下所示    
    <img src="./images/09.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
8. 等 `foo` 函数执行结束，V8 就会结束当前的宏任务，调用栈也会被清空，调用栈被清空后状态如下图所示    
    <img src="./images/10.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
9. 当一个宏任务执行结束之后，忙碌的主线程依然不会闲下来，它会一直重复这个取宏任务、执行宏任务的过程。刚才通过 `setTimeout` 封装的回调宏任务，也会在某一时刻被主线取出并执行，这个执行过程，就是 `foo` 函数的调用过程。具体示意图如下所示    
    <img src="./images/11.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
10. 因为 `foo` 函数并不是在当前的父函数内部被执行的，而是封装成了宏任务，并丢进了消息队列中，然后等待主线程从消息队列中取出该任
务，再执行该回调函数 `foo`，这样就解决了栈溢出的问题。    

### 宏任务实现异步的问题


1. 向 Message Queue 加入的一个异步回调任务，称为一个 Macrotask。最初的主程序（不是异
步回调中的执行的）也可以算作一个 Macrotask。
2. 并不是所有的异步任务都会被加到 Message Queue，有些异步任务会被加入到另一个 queue，
加入这一 queue 的任务称为 Microtask。
3. 在没有 Microtask Queue 时候，JS 的事件循环机制是：
    `主程序Macrotask —— Macrotask1 —— Macrotask2 —— ……`
4. 有 Microtask Queue 时候，JS 的事件循环机制是：
    ```
    主程序Macrotask —— 主程序的Microtask —— Macrotask1 —— Macrotask的Microtask
    —— Macrotask2 —— Macrotask2的Microtask ——……
    ```  

**macrotasks 包括：**
    * `setTimeout`
    * `setInterval`
    * `setImmediate`
    * `MessageChannel`
    * `I/O`
    * `UI渲染`
**microtasks 包括：**
    * `process.nextTick`
    * `promise`
    * `Object.observe`
    * `MutationObserver`

TODO 不懂：一个异步操作依据什么被定义为 Macrotask 或 Microtask？或者说，一个任务为什么被设计为 Macrotask 或者 Microtask。

再分析上面的例子：`setTimeout` 的回调属于 Macrotask，相当于上面的 `Macrotask1`；而
`promise` 的 `then` 回调属于 Microtask，相当于上面的 `主程序的Microtask`。  
再看一个更复杂的例子：
```js
const interval = setInterval(() => {
    console.log('setInterval')
}, 0)

setTimeout(() => {
    console.log('setTimeout 1')
    Promise.resolve()
    .then(() => {
        console.log('promise 3')
    })
    .then(() => {
        console.log('promise 4')
    })
    .then(() => {
        setTimeout(() => {
            console.log('setTimeout 2')
            Promise.resolve()
            .then(() => {
                console.log('promise 5')
            })
            .then(() => {
                console.log('promise 6')
            })
            .then(() => {
                clearInterval(interval)
            })
        }, 0)
    })
}, 0)

Promise.resolve()
.then(() => {
    console.log('promise 1')
})
.then(() => {
    console.log('promise 2')
})
```
1. `setInterval`和`setTimeout` 都是 Macrotask，先后加入到 Macrotask Queue。
2. `Promise`是 Microtask，所以先打印出`promise 1`和`promise 2`。
3. 然后执行`setInterval`的 Macrotask，打印`setInterval`。
4. `setInterval`会再次加入到 Macrotask Queue，但它前面还有之前的 `setTimeout`。注意，
`setInterval`的这次推栈（以及之后的每一次推栈）都是在它回调刚执行完就进行的，而不需要等
到调用栈清空才能推栈。
5. 执行 `setTimeout`  的 Macrotask，打印 `setTimeout 1`。此时 Macrotask Queue 中
只剩下 `setInterval`。
6. 之后的 `Promise` 由于是 Microtask，所以会先执行其所有的 `then`，打印出
`promise 3` 和 `promise 4`。
7. 第三个 `then` 内部是 `setTimeout`，加入到 Macrotask Queue。
8. 调用栈清空，此时 Macrotask Queue 排在最前面的是第二个 `setInterval`，
打印 `setInterval`。
9. `setInterval` 会第三次加入到 Macrotask Queue，但它前面还有一个的 `setTimeout`。
10. 执行 `setTimeout` 回调，打印 `setTimeout 2`。
11. 之后又是 `Promise` 的 Microtask，打印出 `promise 5` 和 `promise 6`，并结束
`interval`, Macrotask Queue 中现在唯一的任务 `setInterval` 回调没有机会执行。


```shell
promise 1
promise 2
setInterval
setTimeout 1
promise 3
promise 4
setInterval
setTimeout 2
promise 5
promise 6
```


## Several runtimes communicating together
1. A web worker or a cross-origin iframe has its own stack, heap, and message
queue.
2. Two distinct runtimes can only communicate through sending messages via the
`postMessage` method.



## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
* [JavaScript Event Loop Explained](https://medium.com/front-end-hacking/javascript-event-loop-explained-4cd26af121d4)
* [Understanding JS: The Event Loop](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40)
* [Philip Roberts: What the heck is the event loop anyway? | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
* [How JavaScript works: an overview of the engine, the runtime, and the call stack](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf)
* [10分钟理解JS引擎的执行机制](https://segmentfault.com/a/1190000012806637)
* [event loop js事件循环 microtask macrotask](https://blog.csdn.net/sjn0503/article/details/76087631)
