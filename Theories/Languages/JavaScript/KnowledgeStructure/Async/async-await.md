# async-await

## Basic
1. The `async` keyword before a function has two effects:
    * Makes it always return a promise.
    * Allows to use `await` in it.

### `await`
1. 当`async`函数中出现一个`await`，表明它后面将会是一个异步操作。
2. 正常情况下，`await`命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve
的 Promise 对象。
3. 函数内部遇到`await`时，不会继续执行，而是等待异步返回结果。
4. 当然程序不会就停在这里，因为这是`async`函数，所以在等待异步返回结果的同时，函数外部
的代码会进行异步的并行执行。
```js
async function foo(){
    console.log(1)
    console.log(await 3);
    console.log(4)
}
foo();
console.log(2);
for(let i=0; i<999999999; i++){}
```
先依次输入`1`、`2`，等待循环结束后，再依次输出`3`、`4`


### 返回值
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

## References
* [Async/await](https://javascript.info/async-await)
* [JavaScript ES 2017: Learn Async/Await by Example](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
* [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)
