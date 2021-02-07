# Recursion stack overflow and Tail Call Optimization


<!-- TOC -->

- [Recursion stack overflow and Tail Call Optimization](#recursion-stack-overflow-and-tail-call-optimization)
    - [Recursion stack overflow](#recursion-stack-overflow)
    - [Tail call and tail recursive](#tail-call-and-tail-recursive)
    - [Trampoline 解决递归导致的栈溢出](#trampoline-解决递归导致的栈溢出)
    - [模拟 TCO](#模拟-tco)
    - [JS 中使用 `setTimeout` 防止递归栈溢出](#js-中使用-settimeout-防止递归栈溢出)
    - [References](#references)

<!-- /TOC -->


## Recursion stack overflow
1. 执行一个函数时，该函数所使用的的局部变量需要占用一定的栈内存。
2. 在函数执行完毕后才会释放其所占用的栈内存。
3. 在没有尾调用优化机制的情况下，一个函数还没有执行完就再一次调用了一遍自身，这就导致每一次的栈内存都无法释放，从而产生大量内存占用甚至栈溢出。


## Tail call and tail recursive
1. In computer science, a **tail call** is a subroutine call performed as the final action of a procedure. 
2. If a tail call might lead to the same subroutine being called again later in the call chain, the subroutine is said to be **tail recursive**, which is a special case of recursion.
3. The tail call doesn't have to appear lexically after all other statements in the source code; it is only important that the calling function return immediately after the tail call, returning the tail call's result if any, since the calling function will never get a chance to do anything after the call if the optimization is performed.
4. 尾调用的规则必须是：函数 **执行** 的最后一步是 **返回** 一个 **函数调用**。
5. 以下三种情况，都不属于尾调用：
    ```js
    function f(x){
        let y = g(x);
        return y;
    }
    function f(x){
        return g(x) + 1;
    }
    function f(x){
        g(x);
    }
    ```
6. 下面的函数中的 `m` 虽然 lexically 不是在函数最后一行，但在函数执行上则是最后一步，所以属于尾调用
    ```js
    function f(x) {
        if (x > 0) {
            return m(x)
        }
        return n(x);
    }
    ```
7. 尾递归实现阶乘
    1. 下面这个不是尾递归：
        ```js
        function factorial(n){
            if (n>1){
                return n * factorial(n-1);
            }
            else {
                return 1;
            }
        }
        ```
    2. 如果实现支持尾递归，可以改成下面的写法：
        ```js
        function factorial(n, accumulator = 1){
            if (n>1){
                return factorial(n - 1, n * accumulator);
            }
            else {
                return accumulator;
            }
        }
        ```
        通过参数 `accumulator` 来计算阶乘。
8. 尾递归实现求 Fibonacci 数
    1. Fibonacci 数列使用 `0 0 1...` 的模式
    2. 下面这个不是尾递归：
        ```js
        function Fibonacci (n) {
            if (n <= 1) {return n};
            return Fibonacci(n - 1) + Fibonacci(n - 2);
        }
        ```
    3. 如果实现支持尾递归，可以改成下面的写法：
        ```js
        // ac1 是序号为 n-2 的值，ac2 是序号为 n-1 的值。序号最小为 0
        function Fibonacci(n , ac1 = 0 , ac2 = 1){
            if (n > 1){
                // 计算顺序是从左到右，但序号是相反的递减顺序
                // 本次的 ac2 会作为下一次的 ac1，本次相加的结果会作为下一次的 ac2
                return Fibonacci(n - 1, ac2, ac1 + ac2);
            }
            else if (n === 1){
                return ac2;
            }
            else if (n === 0){
                return 0;
            }
        }
        ```
    4. 同样是通过参数来计算。
9. 因为并不是所有语言及其实现都支持 TCO，例如虽然 ES6 的规范要求实现在严格模式下支持 TCO，但至少截至 Chrome66.0.3359.139 及 Node 8.1.2，并没有支持 TCO。


## Trampoline 解决递归导致的栈溢出
1. 在不支持尾递归的环境下，可以使用 Trampoline 将递归调用变为循环调用。如果函数 `fn` 的最后一步不是直接执行尾递归的调用，而是返回需要递归调用的函数，那就结束当前调用栈，可以用循环代替递归
    ```js
    // 参数 fn 是要循环调用的函数
    // 执行 fn 后如果返回值为函数，则继续执行；否则返回该非函数返回值
    // 可以看出来，fn 需要循环的返回一个函数，直到循环结束时，返回一个非函数
    function trampoline(fn){
        while (fn && fn instanceof Function) {
            fn = fn();
        }
        return fn;
    }
    ```
2. 根据上述对 `fn` 的要求，对尾递归的 Fibonacci 函数进行改写，把尾递归调用改为返回递归函数
    ```js
    function Fibonacci(n , ac1 = 0 , ac2 = 1){
        if (n>1){
            return Fibonacci.bind(null, n - 1, ac2, ac1 + ac2);
        }
        else if (n === 1){
            return ac2;
        }
        else if (n === 0){
            return 0;
        }
    }
    ```
    现在就可以使用 `trampoline` 来包装执行。


## 模拟 TCO
如果需要使用尾递归的写法但是环境暂不支持，可以用如下方法，将一个尾递归函数进行 “TCO化”：
```js
function TCO(fn) {
    let value;
    let active = false;
    let accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                // 这里执行函数fn，但是返回值不是fn的尾调用，而是sum的尾调用
                // 调用sum后，因为active当前是true，所以会返回undefined
                value = fn.apply(this, accumulated.shift());
            }
            // 只要还有参数，active就一直是true，accumulator函数就一直返回undefined
            active = false;
            return value;
        }
    };
}

const Fibonacci = TCO(function(n , ac1 = 0 , ac2 = 1) {
    if (n > 1){
        // 计算顺序是从左到右，但序号是相反的递减顺序
        // 本次的ac2会作为下一次的ac1，本次相加的结果会作为下一次的ac2
        return Fibonacci(n - 1, ac2, ac1 + ac2);
    }
    else if (n === 1){
        return ac2;
    }
    else if (n === 0){
        return 0;
    }
});

Fibonacci(100);
```
思路如下：
1. `TCO`函数的参数是需要进行“TCO化”的函数，`TCO`函数会返回“TCO化”之后的函数，即其内部
的`accumulator`函数。
2. 现在执行`Fibonacci`函数，也就是执行`accumulator`函数。参数为`[100, 0, 1]`。
3. 执行到`fn.apply(this, accumulated.shift())`时，会开始调用真正的尾递归函数，即
`TCO`函数的参数`fn`。参数为`[100, 0, 1]`。这是一步嵌套调用，因为`accumulator`函数到
这里并没有返回，因此调用栈又多了一层。这一会也会让`accumulated`变为空数组。
4. 现在的执行环境是`fn`，因为`n`大于1，所以会再次调用`Fibonacci`函数。参数为
`[99, 1, 1]`。这又是一步嵌套调用，调用栈现在有三层了。
5. 现在执行`Fibonacci`函数，也就是执行`accumulator`函数。
6. 首先是`accumulated.push(arguments)`，之后因为`active`为`true`，因此会直接返回
`undefined`。调用栈变为两层。
7. 之后是`fn`也返回`undefined`。也就是这一行：
`return Fibonacci(n - 1, ac2, ac1 + ac2);`。调用栈变为一层。
8. 因此`value`获得赋值`undefined`。
9. 因为第6步给已经空了的`accumulated`又添加了新的参数`[99, 1, 1]`，因此`while`循环得
以继续。
10. `fn`被不断调用，参数不断累加，`n`不断减小。调用栈层数一直在两层和三层之间切换。
11. 当`n`等于`1`时，`fn`不再返回函数调用，当前调用栈层数不会变成三层。`fn`返回累加结果
`ac2`给`value`。调用栈变为一层。
12. 因为`fn`内部的`Fibonacci`没有执行，`accumulated`不会被push新值，因而保持空数组。
`while`循环结束。返回`value`中保存的最终累加值。`accumulator`调用结束。


## JS 中使用 `setTimeout` 防止递归栈溢出
1. 假设下面一段程序
    ```js
    let list = readHugeList(); // 一个很大的数组
    function nextListItem() {
        let item = list.pop();
        if (item) {
            // process the list item...
            nextListItem();
        }
    }
    ```
    如果 `list` 足够大，上述递归将导致栈溢出。
2. 只需要把 `nextListItem` 如下修改就可以避免
    ```js
    function nextListItem() {
        let item = list.pop();
        if (item) {
            setTimeout(nextListItem, 0);
        }
    };
    ```
这样 `nextListItem` 就可以直接返回 `undefined` 从而释放栈内存。下一次的 `nextListItem` 会在下一个事件循环中重新开始。


## References
* [阮一峰 ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/function#%E5%B0%BE%E8%B0%83%E7%94%A8%E4%BC%98%E5%8C%96)
* [Wiki Tail call](https://en.wikipedia.org/wiki/Tail_call)
* [37 Essential JavaScript Interview Questions *](https://www.toptal.com/javascript/interview-questions)
