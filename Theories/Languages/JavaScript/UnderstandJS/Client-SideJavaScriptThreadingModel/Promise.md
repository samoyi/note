# Promise

<!-- TOC -->

- [Promise](#promise)
    - [回调的问题](#回调的问题)
        - [顺序不容易阅读和理解](#顺序不容易阅读和理解)
        - [信任问题](#信任问题)
        - [不完美的方法](#不完美的方法)
    - [承诺的未来值](#承诺的未来值)
    - [解决信任问题](#解决信任问题)
        - [同步调用问题](#同步调用问题)
        - [过晚回调](#过晚回调)
        - [没有调用或重复调用](#没有调用或重复调用)
    - [References](#references)

<!-- /TOC -->


## 回调的问题
### 顺序不容易阅读和理解

### 信任问题
1. 思考下面代码
    ```js
    // A
    ajax( "..", function(..){
        // C
    } );
    // B
    ```
2. `// A` 和 `// B` 发生于现在，在 JavaScript 主程序的直接控制之下。而 `// C` 会延迟到将来发生，并且是在第三方（在本例中就是函数 `ajax(..)`）的控制下。从根本上来说，这种控制的转移通常不会给程序带来很多问题。
3. 有时候 `ajax(..)` 这样的第三方不是你编写的代码，也不在你的直接控制下。我们把这称为 **控制反转**（inversion of control），也就是把自己程序一部分的执行控制交给某个第三方。
4. 第三方可能由于各种奇怪的 bug，导致你的回调没有执行（过晚回调）、同步执行（同步回调）、多次执行或者错误执行。
5. 因此，我们很可能需要在回调函数里面确认第三方是否正确的执行了回调。

### 不完美的方法
1. 为了更优雅地处理错误，有些 API 设计提供了 **分离回调**（一个用于成功通知，一个用于出错通知）：
    ```js
    function success(data) {
        console.log( data );
    }

    function failure(err) {
        console.error( err );
    }

    ajax( "http://some.url.1", success, failure );
    ```
    ES6 Promise API 使用的就是这种分离回调设计。
2. 还有一种常见的回调模式叫作 “error-first 风格”（有时候也称为“Node 风格”，因为几乎所有 Node.js API 都采用这种风格），其中回调的第一个参数保留用作错误对象（如果有的话）。如果成功的话，这个参数就会被清空/置假（后续的参数就是成功数据）。不过，如果产生了错误结果，那么第一个参数就会被置起/置真（通常就不会再传递其他结果）：
    ```js
    function response(err,data) {
        // 出错？
        if (err) {
            console.error( err );
        }
        // 否则认为成功
        else {
            console.log( data );
        }
    }

    ajax( "http://some.url.1", response );
    ```
3. 不过，这两个方法都没有解决重复调用或者完全不调用的问题。你还是需要根据结果来自己判断是否重复调用，以及设计一个超时检测的功能来检测没有调用的情况。
4. 至于解决同步回调的问题。本来我们期待回调会在之后的事件循环中执行，但也许第三方让回调函数在本轮直接同步执行了。我们不能确定回调到时是否被异步执行
    ```js
    function result(data) {
        console.log( a );
    }

    var a = 0;

    ajax( "..pre-cached-url..", result );
    a++;
    ```
    我们期待的是异步执行，所以期待打印出来的是 1；但没准第三方的 `ajax` 出了什么问题导致 `result` 被同步执行了，打印出来的是 0。
5. 解决这个方法的问题是把回调包装一下，让它在将要被同步执行的时候强制异步执行
    ```js
    function result(data) {
        console.log( a );
    }

    var a = 0;

    ajax( "..pre-cached-url..", asyncify( result ) );
    a++;

        
    function asyncify(fn) {
        // 如果包装后的函数异步执行，那么它会排到 setTimeout 的异步之后，也就是说它执行的时候 intv 已经为 null 了，
        // 所以直接调用未包装的函数。而且因为 fn 被设为了 null，所以之后 setTimeout 里的 fn 并不会执行。
        // 如果包装后的函数被同步执行，那 intv 就不是 null，fn 就会被重新设置为函数，然后在 setTimeout 的异步里面执行。
        let orig_fn = fn;
        let intv = setTimeout( function(){
                intv = null;
                fn && fn();
            }, 0 )
        ;

        fn = null;

        return function(...args) {
            if (intv) { // 被包装函数同步执行了
                fn = orig_fn.bind(this, ...args);
            }
            else { // 被包装函数异步执行
                // 调用原来的函数
                orig_fn(...args);
            }
        };
    }
    ```
6. 我们用回调函数来封装程序中的未来要做的事情，然后把回调交给第三方，接着期待其能够调用回调，实现正确的功能。但是，如果我们能够把控制反转再反转回来，会怎样呢？
7. 如果我们不把自己程序的未来要做的事情传给第三方，而是希望第三方给我们提供了解其任务何时结束的能力，然后由我们自己的代码来决定下一步做什么，那将会怎样呢？这种范式就称为 Promise。


## 承诺的未来值
1. 比如你购买电影票，系统会给你生成一个未支付订单然后查询系统帮你占座，这个订单就是对未来的一个承诺（**promise**）：如果到时候占座成功，用这个订单支付票钱就可以换票；如果到时候占座失败，你可以重下订单或者取消订单。
2. 但在现在，这个订单的结果还是不确定的，它代表了一个未来会确定的值（占座成功或失败）。等到了未来到来的时候，系统会告诉你结果，你可以根据结果来做出相应的决定。
3. 这里和回调的模式就是不一样的。回调是把你要做的事情告诉系统，系统在未来直接帮你付钱或者改签或者取消；但这里是系统给你一个承诺订单，在未来会通知你这个承诺订单的结果，然后你自己决定怎么做。


## 解决信任问题
### 同步调用问题
Promise 的实现从根本上就是异步，不存在同步的可能。不过是微任务的异步。

### 过晚回调
1. 有两种过晚回调：一种是异步事件处理完了但是没有执行回调，另一种是异步事件迟迟没有处理完。
2. 第一种过晚回调不会发生，因为这是 promise 的实现决定的。
3. 第二种情况，promise 提供了竞态机制 `Promise.race()`
    ```js
    // 用于超时一个Promise的工具
    function timeoutPromise(delay) {
        return new Promise( function(resolve,reject){
            setTimeout( function(){
                reject( "Timeout!" );
            }, delay );
        } );
    }

    // 设置foo()超时
    Promise.race( [
        foo(),                      // 试着开始foo()
        timeoutPromise( 3000 )      // 给它3秒钟
    ] )
    .then(
        function(){
            // foo(..)及时完成！
        },
        function(err){
            // 或者foo()被拒绝，或者只是没能按时完成
            // 查看err来了解是哪种情况
        }
    );
    ```

### 没有调用或重复调用
同样，实现机制决定了不会发生这样的事情。


## References
* [你不知道的JavaScript（中卷）](https://book.douban.com/subject/26854244/)
* [图解 Google V8](https://time.geekbang.org/column/intro/296)