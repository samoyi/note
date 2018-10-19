# Concurrency model and Event Loop

![Runtime concepts](./images/RuntimeConcepts.svg)  
JavaScript Runtime


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
A popular example of a JavaScript Engine is Google’s V8 engine. The V8 engine is
used inside Chrome and Node.js for example. Here is a very simplified view of
what it looks like:  

![V8 Engine](./images/V8Engine.png)  

The Engine consists of two main components:
* Memory Heap — this is where the memory allocation happens
* Call Stack — this is where your stack frames are as your code executes

### Call stack
1. JavaScript has a single call stack in which it keeps track of what function
we’re currently executing and what function is to be executed after that. 因为只
有一个调用栈所以是单线程？
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
3. When calling `bar`, a first frame is created containing `bar`'s arguments and
local variables.
4. When `bar` calls `foo`, a second frame is created and pushed on top of the
first one containing `foo`'s arguments and local variables.
5. When `foo` returns, the top frame element is popped out of the stack (leaving
only `bar`'s call frame).
6. When `bar` returns, the stack is empty.

### Memory Heap
Objects are allocated in a heap which is just a name to denote a large mostly
unstructured region of memory.（日文：オブジェクトはヒープに割り当てられています。
ヒープは、メモリの大規模で大部分は構造化されていない領域を意味する名前です。）


## JS 既然是单线程，为什么可以执行异步操作？
之前也偶尔想过这个问题，因为很明显，异步操作显然是两个操作在同时执行。  
The short answer is that JavaScript language is single-threaded and the
asynchronous behaviour is not part of the JavaScript language itself, rather
they are built on top of the core JavaScript language in the browser (or the
programming environment) and accessed through the browser APIs.

### Basic Architecture
![Event Loop Basic Architecture](./images/EventLoopBasicArchitecture.png)
1. 上图中只有 V8 JS 虚线框部分是 JS 引擎，它是单线程的。所谓的异步操作是在虚线框外部的
执行环境（例如浏览器）还可以执行其他操作，从而形成并发异步。
2. 执行环境提供给 JS 一些异步操作 API（上图的WebAPIs），JS 调用这些 API 并传入回调函
数。
3. 执行环境帮助 JS 执行这些异步操作，执行完成后，把相应的回调函数加入到下面讲到的 Event
Table，等待被 JS 执行。


## Event Table and Event Queue
1. 在没有异步操作的情况下，JS 就会按照上面 `Stack` 说明中的方式，不断的线性执行，直到
程序结束。但如果程序中执行了一个异步操作，就会涉及到另外两个数据结构：Event Table 和
Event Queue。
2. 似乎这两者合起来统称 Message Queue。另外，结合上面的图片，看起来也可以称为
Callback Queue。
3. 并不是所有的异步操作都会被加入到 Message Queue 中，详见下面的 【Macrotask 和
Microtask】

### Event Table（事件表）
1. This is a data structure which knows that a certain function should be
triggered after a certain event.
1. 这个数据结构记录了事件及其对应的回调函数。
2. 当一个事件发生时，事件表就会把该事件对应的回调函数传递给 event queue。
3. 事件表不会执行回调（这是调用栈里的工作），也不会把回调推入调用栈（这是事件队列和事件
循环的工作），它只负责记录事件及其回调，以及在事件发生时把回调传递给事件队列。

### Event Queue（事件队列）
1. 是 queue 结构的数据结构，即新的回调排在队列后面，优先执行队列前面的回调。
2. 事件队列保证了若干个事件回调按照顺序依次执行。
3. 事件队列从事件表那里接收到回调函数，但还需要某种机制来把队列里面的回调函数推进调用栈。
这种机制就是下面要说的事件循环。

## Event loop（事件循环）
1. Event loop is a constantly running process that checks if the call stack is
empty.
1. 事件循环是一个持续运行的进程，它不断的检查调用栈是否被清空。
2. 一次检查周期被称为一次 *tick*，每次 tick 事件循环机制会检查调用栈是否被清空。
3. 如果清空了，事件循环机制会看看事件队列里有没有待执行的回调，如果有的话，就把排在最前
面的回调推进调用栈。如果没有就什么也不做。


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
![Event Loop](./images/EventLoop.png)  
可以看 [视频演示](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

### `main()` 以及 `setTimeout` 的回调总是最后执行
如下代码，`timeout` 是最后被打印出来的
```js
setTimeout(function(){
    console.log('timeout');
}, 0);

for(let i=0; i<999; i++){
    console.log('loop');
}

console.log('end');
```
1. 上面说到，event loop 机制会一直检查调用栈，如果调用栈清空了，就把 Event Queue 里面
的函数加入到调用栈开始执行。
2. 那么你可能会这样分析上面代码：
    1. JS 调用了浏览器的 `setTimeout` 接口，告诉浏览器立刻（0毫秒）把
     `console.log('timeout')` 加入 Event Table。
    2. `setTimeout` 执行完后，它就会被 pop 出调用栈，现在看起来没有函数在运行了，所以
    调用栈空了。
    3. 因此 Event Table 会把 `console.log('timeout')` 加入 Event Queue，紧接着
    Event Queue 把该函数推入调用栈，打印出 `'timeout'`。
3. 但显然分析结果与事实不符。`console.log('timeout')` 不但没有立刻被调用，它在漫长的
`for` 循环里也没有机会插队，甚至在`for` 循环结束后仍然没有被推入调用栈。直到最后的
`console.log('end')` 执行完，`console.log('timeout')` 才被推入栈中执行。
4. 也就是说，直到最后的 `console.log('end')` 执行完，调用栈才彻底空了。之前栈底一直有
什么函数一直没有被返回。
5. 虽然以前可能没注意，但在追踪调用栈的时候，确实是会看到这个函数的：
    ```js
    function foo(){
        console.trace()
    }
    foo();
    ```
    打印的结果是：
    ```shell
    console.trace
    foo @ test.html:30
    (anonymous) @ test.html:32
    ```
6. 就是最后那个匿名函数。现在不明白它的机制，但它总是作为整个执行环境的最外层被调用。在
[上面那个视频](https://www.youtube.com/watch?v=8aGhZQkoFbQ)里，这个匿名函数被写为了
`main`。可能是“全局执行环境栈”，参考这篇：`Theories\Languages\JavaScript\UnderstandJS\ExecutionContext&VariableObject&ScopeChain.md`
7. 因为它是在整个执行环境的最外层，而不是某个函数的最外层，所以即使异步操作是在函数内部，
回调也不会在函数返回后执行，而是仍然要等到其他代码执行完：
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


## Macrotask 和 Microtask
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
 上面的输出顺序不是 1 2 3 4，而是 1 2 4 3。同样是异步操作，为什么在后面的反而比前面的
 更早执行。这就是 Macrotask 和 Microtask 的区别。


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
    * `I/O`
    * `UI渲染`
**microtasks 包括：**
    * `process.nextTick`
    * `promise`
    * `Object.observe`
    * `MutationObserver`

TODO 不懂：一个异步操作依据什么被定义为 Macrotask 或 Microtask？  

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
