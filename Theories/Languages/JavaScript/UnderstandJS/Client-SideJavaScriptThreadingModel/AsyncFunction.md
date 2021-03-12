# Async Function

<!-- TOC -->

- [Async Function](#async-function)
    - [协程（Coroutine）和 Generator 函数](#协程coroutine和-generator-函数)
        - [Generator 函数的数据交换和错误处理](#generator-函数的数据交换和错误处理)
        - [一个实际的异步处理例子](#一个实际的异步处理例子)
    - [`async` 函数](#async-函数)
    - [References](#references)

<!-- /TOC -->


## 协程（Coroutine）和 Generator 函数
1. **协程** 是一种比线程更加轻量级的存在。你可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程。
2. 比如，当前执行的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体现在 A 协程暂停执行，B 协程恢复执行；同样，也可以从 B 协程中启动 A 协程。
3. 协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源。
4. Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。
5. 整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 `yield` 语句注明
    ```js
    function* gen(x) {
        var y = yield x + 2;
        return y;
    }

    var g = gen(1);
    g.next() // { value: 3, done: false }
    g.next() // { value: undefined, done: true }
    ```    
6. 上面代码中，调用 Generator 函数，会返回一个内部指针（即遍历器）`g`。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。
7. 调用指针 `g` 的 `next` 方法，开始执行函数中的语句知道遇到下一个`yield` 语句为止，并且会移动内部指针到当前位置。换言之，`next` 方法的作用是分阶段执行 Generator 函数。
8. 每次调用 `next` 方法，会返回一个对象，表示当前阶段的信息（`value` 属性和 `done` 属性）。`value` 属性是 `yield` 语句后面表达式的值，表示当前阶段的值；`done` 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。

### Generator 函数的数据交换和错误处理
1. Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。
2. `next` 返回值的 `value` 属性，是 Generator 函数向外输出数据；`next` 方法还可以接受参数，向 Generator 函数体内输入数据
    ```js
    function* gen(x){
        var y = yield x + 2;
        return y;
    }

    var g = gen(1);
    g.next() // { value: 3, done: false }
    g.next(2) // { value: 2, done: true }
    ```
3. Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误
    ```js
    function* gen(x){
        try {
            var y = yield x + 2;
        } catch (e){
            console.log(e);
        }
        return y;
    }

    var g = gen(1);
    g.next();
    g.throw('出错了');
    // 出错了
    ```
    上面代码的最后一行，Generator 函数体外，使用指针对象的 `throw` 方法抛出的错误，可以被函数体内的 `try...catch` 代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

### 一个实际的异步处理例子
```js
var fetch = require('node-fetch');

function* gen(){
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}


var g = gen();
var result = g.next();

result.value.then(function(data){
    return data.json();
}).then(function(data){
    g.next(data);
});
```
由于 Fetch 模块返回的是一个 Promise 对象，因此要用 `then` 方法调用下一个 `next` 方法。    


## `async` 函数
1. 其实`async` 函数技术背后的秘密就是 Promise 和生成器应用，往底层说，就是微任务和协程应用。
2. `async` 函数执行到 `await` 时会暂停，切换到 `await` 后面的协程。`await` 后面会返回一个 promise 对象，对象 resolve 或 reject 之后，再切回 `async` 函数的协程，并且获得 resolve 或 reject 的结果值。


## References
* [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/generator-async)
* [图解 Google V8](https://time.geekbang.org/column/intro/296)