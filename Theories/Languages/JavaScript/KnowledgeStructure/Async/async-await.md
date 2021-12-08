# async-await


<!-- TOC -->

- [async-await](#async-await)
    - [Basic](#basic)
    - [异步逻辑](#异步逻辑)
        - [`return` 设置的返回值](#return-设置的返回值)
        - [Promise 对象的状态变化](#promise-对象的状态变化)
    - [错误处理](#错误处理)
    - [执行顺序](#执行顺序)
    - [Misc](#misc)
        - [并行`await`](#并行await)
    - [References](#references)

<!-- /TOC -->


## Basic
1. The `async` keyword before a function has two effects:
    * Makes it always return a promise.
    * Allows to use `await` in it.


## 异步逻辑
1. 当 `async` 函数中出现一个 `await`，表明它后面将会是一个异步操作。
2. 正常情况下，`await` 命令后面是一个 promise 实例。如果不是，会被转成一个立即 resolve 的 promise 实例。
3. 函数内部遇到 `await` 时，不会继续执行，而是等待异步返回结果。也就是等待后面 promise 出结果。
4. 也就是说，此时引擎创建了一个 promise 微任务。
5. 那么此时引擎本身的同步线程还会继续进行。此时，从代码上看还是还没有执行完，但实际上函数已经返回，因此会接着执行函数调用后面的代码。
    ```js
    async function foo () {
        console.log(1);
        let result = await bar();
        console.log(result);
        console.log(2);
        return "done";
    }

    function bar () {
        let p = new Promise((resolve) => {
            console.log(3)
            resolve(4);   
            console.log(5)
        });
        console.log(6);
        return p;
    }

    console.log(7);
    foo().then((res) => {console.log(res)});
    console.log(8);

    // 输出顺序为：7 1 3 5 6 8 4 2 done
    ```
6. 执行顺序是：
    1. 打印 7；
    2. 调用 `foo`，打印 1；
    3. 调用 `bar`，调用 `new Promise` 并传参 executor 函数；
    4. 执行 executor，打印 3；
    5. 调用 `resolve`，创建一个微任务1，微任务1 到时候解析为 4；
    6. 打印 5，executor 返回，创建好 promise1 实例 `p`；
    7. 打印 6，`bar` 返回；
    8. `foo` 函数实际返回，返回了另一个 promise2 实例，promise2 实例创建一个微任务2，之后会解析为 `"done"`；
    9. 调用 `then`，传递接收该 promise2 解析结果函数 onFulfilled；
    10. 打印 8；
    11. 调用栈准备清空，执行两个微任务；
    12. 首先执行微任务1，解析为 4；`result` 获得值 4，打印 4；
    13. 打印 2；
    14. 执行 `return "done"`，也就是微任务2 解析为 `"done"`，onFulfilled 得到结果打印 `"done"`。
7. JS 主线程是同步执行的，先调用 `foo`，然后打印 1，然后 `await` 之后的表达式发起一个异步请求，然后


promise 本身并不是异步操作，只是可以发起一个异步操作
promise 发起了异步操作，异步操作返回后调用 resove，但此时调用栈不是已经清空了吗，还是说没清空一直等着异步结果？


返回给 await 的 promise 创建时如果本身就调用了 then，那就相当于 await 是 then 的 then
### `return` 设置的返回值
相当于 `resolve`
`async`函数本身返回一个 promise 对象，而其中`return`设定的返回值是`onFulfilled`的参数
```js
async function foo(){
    return 22;
}

let p = foo();
console.log(p); // Promise {<resolved>: 22}

p.then(res=>{
    console.log(res); // 22
})
```

### Promise 对象的状态变化
当`async`函数 return、出现错误或`await`后面的 promise reject 时，promise 才会获得结
果，即`then`或`catch`的回调被调用
```js
async function foo(){
    console.log(1)
    // console.log(await Promise.reject(new Error(303)));
    console.log(await 3);
    console.log(4)
    // throw new Error(500);
    return 5;
}

foo()
.then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err.message);
});
console.log(2);
```
* 如果没错误依次输出`1`、`2`、`3`、`4`、`5`
* 如果有错误依次输出`1`、`2`、`3`、`4`、`"500"`
* 如果 rejected 依次输出`1`、`2`、`"303"`  


## 错误处理
1. 不管是`await`后面的 promise 被 reject，还是其他错误，都可以被`async`函数返回的
promise 的`then`或`catch`捕获。
2. 与 promise 中 reject 之后的代码仍然会执行不同，这里之后的代码不会再被执行。

```js
async function foo(){
    console.log(await Promise.reject(22));
    // throw new Error();
    console.log('不会被执行');
}

foo()
.catch(err=>{
    console.error(err);
});
```

3. 为了不影响后面的代码继续执行，可以用以下两种 catch
    ```js
    try {
        await Promise.reject('出错了');
    }
    catch(e) {
    }

    await Promise.reject('出错了')
        .catch(e => console.log(e));
    ```
3. 因为 async 函数并不总是返回一个单独 promise 并后续调用其`then`或`catch`方法，经常
也是作为其他 async 函数内部 `await` 之后的 promise，所以更通用的捕获错误的方法还是直接
在 async 函数内部`try...catch`
    ```js
    async function foo(){
        try{
            // promise rejected 或普通错误都这样捕获
            console.log(await Promise.reject(22));
            // throw new Error();
        }
        catch(err){

        }
    }
    ```


## 执行顺序
```js
let arr = [];

setTimeout(()=>{
    arr.push(6);
});

let asyncReadFile = async ()=>{
    arr.push(1);
    await 22;
    arr.push(3);
    await 33;
    arr.push(4);
};

asyncReadFile()
.then(()=>{
    arr.push(5);
});

arr.push(2);

setTimeout(()=>{
    console.log(arr); // [1, 2, 3, 4, 5, 6]
}, 500);
```
1. `setTimeout`回调因为是 macrotask，会被加入 Message Queue，下一轮才执行，因此是最后
2. `1`最先被加入没有问题
3. `await 22`，异步 microtask，加入 microtask 队列
4. `asyncReadFile` await，继续执行后面，即`arr.push(2)`
5. 最后一个`setTimeout`执行后，开始执行 microtask
6. `await 22` 回调结束后，`arr.push(3)`
7. `await 33`，异步 microtask，加入 microtask 队列
8. 但因为现在`asyncReadFile`外部已经没有其他任务了，所以立刻执行 microtask
9. `await 33` 回调结束后，`arr.push(4)`
10. async 函数`asyncReadFile`返回，执行`then`方法。同样是 microtask，加入 microtask
队列
11. 同样，`asyncReadFile`外部已经没有其他任务了，所以立刻执行 microtask，`arr.push(5)`
12. 本轮调用结束，调用栈清空，执行下一轮 macrotask，即第一个`setTimeout`的回调，
`arr.push(6)`


## Misc
### 并行`await`
1. 多个`await`时，如果后面的不依赖前面的结果，则没必要逐个进行
    ```js
    let foo = await getFoo();
    let bar = await getBar();
    ```
上面这样是`getFoo()`有结果后才会执行`getBar()`，如果没有依赖，这样很浪费时间。
2. 通过以下两个方法让它们同时进行，都在 await 就几乎同时开始了两个异步操作：
    ```js
    // 写法一
    let [foo, bar] = await Promise.all([getFoo(), getBar()]);

    // 写法二
    // 先几乎同时开始执行两个异步操作
    let fooPromise = getFoo();
    let barPromise = getBar();
    let foo = await fooPromise;
    let bar = await barPromise;
    ```
3. 在循环中，`async`函数是并行的，而不会让循环等待。但并行同时也意味着，结果不一定会按照数组中的顺序
    ```js

    function sleep(){
        return new Promise(resolve=>{
            setTimeout(()=>{
                resolve();
            }, 3000);
        })
    }

    async function foo(s){
        await sleep();
        console.log(s);
    }

    [1, 2, 3].forEach(item=>{
        foo(item);
    });

    for(let i=1; i<4; i++){
        foo(i*i);
    }

    for(let val of [1, 2, 3]){
        foo(val*val*val);
    }
    ```
    上面三种循环，都是同时在3秒之后打印结果


## References
* [Async/await](https://javascript.info/async-await)
* [JavaScript ES 2017: Learn Async/Await by Example](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
* [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)
