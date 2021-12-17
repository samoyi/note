# async-await


<!-- TOC -->

- [async-await](#async-await)
    - [异步逻辑](#异步逻辑)
        - [例子](#例子)
    - [返回值](#返回值)
        - [如果内部没有 `await`](#如果内部没有-await)
        - [有错误的情况](#有错误的情况)
    - [错误处理](#错误处理)
    - [并行 `await`](#并行-await)
    - [References](#references)

<!-- /TOC -->


## 异步逻辑
1. 当 `async` 函数中出现一个 `await`，表明它右边紧跟着的代码是一个 promise 异步操作，而函数内 `awiat` 后续的代码相当于该 promise 的 `then` 回调函数。
2. 正常情况下，`await` 命令后面是一个 promise 实例。如果不是，会被转成一个立即 resolve 的 promise 实例。
3. 函数内部遇到 `await` 时，不会继续执行，而是等待异步返回结果。
4. 但此时引擎本身的同步线程还会继续进行。所以，从静态代码上看这个 `async` 函数还没有执行完，但实际上函数已经返回，因此会接着执行函数调用后面的代码。查看调用栈时也会发现执行到 `await` 的异步操作时，这个 `aysnc` 函数的执行环境已经不在调用栈中。
5. 等到 `await` 后面的 promise 出结果后，就需要调用该 promise 的回调，也就是 `aysnc` 里 `await` 后续的逻辑。这一部分逻辑也是和普通的 `then` 回调一样，被作为一个微任务加入队列，之后执行的时候，`await` 返回的值就是 promise 的结果值。

### 例子
1. 例1
    ```js
    let p;

    function resolveLater (val, ms) {
        let ins = new Promise((resolve) => {
            setTimeout(() => {
                Promise.resolve().then(() => {
                    console.log("inner micro");
                });
                setTimeout(() => {
                    console.log("inner macro");
                });
                resolve(val);
            }, ms);
        });
        return ins;
    }

    async function foo () {
        console.log(1);
        console.log( await resolveLater(22, 2000) );
        console.log(2);
        return 33;
    }

    p = foo();
    p.then((res) => {
        console.log(res); // 33
    })
    console.log(p);
    // 先输出：
    // 1
    // Promise {<pending>}
    // 等待大约两秒钟再输出：
    // inner micro
    // 22
    // 2
    // 33
    // inner macro
    ```
    1. 执行 `foo`，正常的打印 `"1"`;
    2. 执行 `await` 后面的异步操作，异步操作中会在两秒钟后添加一个宏任务；
    3. `foo` 函数返回一个 promise 实例给 `p`:
    4. `p` 通过 `then` 添加回调。这个回调是 `foo` 返回的 promise 的回调，不是 `await` 后面 promise 的回调；
    5. 打印 `foo` 返回的 `p`，是 pendding 状态；
    6. 当前宏任务结束；
    7. 约两秒钟执行 `setTimeout` 回调，分别添加一个微任务和宏任务，然后 resolve 掉 `await` 后面的 promise；
    8. 该 promise 被 resolve 后，并不是立刻执行回调（也就是 `aysnc` 里 `await` 之后的逻辑），也是作为微任务。所以会先执行前一个微任务，也就是打印 `"inner micro"`；
    9. 之后再执行 `await` 之后的逻辑，执行时通过 `await` 的返回值接收到 promise 的结果，也就是 `22`，因此首先打印出 `22`；
    10. 之后再打印 `2`，然后 `return 33`。这个 `return 33` resolve `p` 指向的 promise，结果值为 33。
    11. `p` 指向的 promise 解析出结果，因此它的回调作为微任务调用，打印 `33`；
    12. 最后一步执行上一个宏任务，打印 `"inner macro"`。
2. 例2
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
    1. 打印 7；
    2. 调用 `foo`，打印 1；
    3. 调用 `bar`，调用 `new Promise` 并传参 executor 函数，创建 promise 实例 `p`；
    4. 执行 executor，打印 3；
    5. 调用 `resolve`，`p` 解析为 4；
    6. 打印 5，executor 返回，创建好 promise 实例 `p`；
    7. 打印 6，`bar` 返回 `p` 给 `await`；
    8. 由于 `p` 已经解析完成，因此 `await` 之后的代码被创建为一个微任务，到时 `result` 接受到的值为 4；
    9. `foo` 函数实际返回，返回了另一个 promise 实例；该实例调用 `then`，传递回调；
    10. 打印 8；
    11. 调用栈准备清空，执行微任务，`result` 获得值 4，打印 4；
    13. 打印 2；
    14. 执行 `return "done"`，也就是 `foo` 返回的 promise 解析为 `"done"`；它的回调被加入微任务队列，得到结果 `"done"` 并打印。
3. 例3
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
    1. 第一个 `setTimeout` 调用，回调加入任务队列；
    2. 调用 `asyncReadFile`：
        1. push 1；
        2. 第一个 `await` 后的 promise 立刻解析为 22，它之后的代码加入微任务队列；
    3. `asyncReadFile` 返回一个 promise，该 promise 通过 `then` 添加回调；
    4. push 2；
    5. 第二个 `setTimeout` 调用，500 毫秒后添加另一个宏任务;
    6. 本轮同步任务结束，当前微任务队列里只有一个微任务，开始执行该微任务；
        1. 解析为 22 的 promise 的回调微任务执行：
            1. push 3
            2. 第二个 `await` 后的 promise 立刻解析为 33，它之后的代码加入微任务队列，称为目前唯一的微任务；
    7. 执行刚加入的微任务：
            1. push 4
            2. `asyncReadFile` 函数内部没有 `return`，因此返回的 promise 解析为 `undefined`；
    8. 刚才通过 `then` 添加的回调加入微任务队列并立刻执行，push 5；
    9. 微任务全部执行完；
    10. 任务队列里第一个宏任务执行，push 6；
    11. 任务队列里第二个宏任务执行，打印 `[1, 2, 3, 4, 5, 6]`


## 返回值
1. A promise which will be resolved with the value returned by the async function, or rejected with an exception thrown from, or uncaught within, the async function.
2. 如果内部有 `await`，那就是在 `await` 的时候函数返回一个状态为 pendding 的 promise，然后在 `return` 的时候解析该 promise 的结果。

### 如果内部没有 `await`
1. 如果 `return` 非 promise 值，则 `async` 函数直接返回 resolved 的 promise
    ```js
    async function foo () {
        return 22;
    }

    let p = foo();
    console.log(p);  // Promise {<fulfilled>: 22}
    ```
2. 如果 `return` 的是 promise，则 `async` 函数返回一个状态为 pendding 的 promise
    ```js
    async function foo () {
        console.log(1);
        let innerP = Promise.resolve(22);
        console.log(2);
        return innerP;
    }

    let p = foo();
    p.then((res) => {
        console.log("res:", res); // res: 22
    })

    console.log(p);  // Promise {<pending>}
    console.log(3);

    // 输出顺序为：
    // 1
    // 2
    // Promise {<pending>}
    // 3
    // res: 22
    ```
    ```js
    async function foo () {
        console.log(1);
        let innerP = Promise.reject(33);
        console.log(2);
        return innerP;
    }

    let p = foo();
    p.then((res) => {
        // 不会调用
        console.log("res:", res);
    })
    .catch((err) => {
        console.error("err:", err); // err: 33
    })

    console.log(p);  // Promise {<pending>}
    console.log(3);

    // 输出顺序为：
    // 1
    // 2
    // Promise {<pending>}
    // 3
    // err: 33
    ```

### 有错误的情况
1. 如果在返回 promise 之前就发生了错误，则返回一个 rejected 的 promise
    ```js
    async function foo () {
        console.log(1);
        throw new Error("wrong");
        console.log(2);
        return 22;
    }

    let p = foo();
    p.then((res) => {
        // 不会调用
        console.log("res:", res);
    })
    .catch((err) => {
        console.error("err:", err); // err: Error: wrong
    })

    console.log(p);  // Promise {<rejected>: Error: wrong
    console.log(3);

    // 输出顺序为：
    // 1
    // Promise {<rejected>: Error: wrong
    // 3
    // err: Error: wrong
    ```
2. 如果在返回 promise 之后和 return 之前发生了错误，则先返回一个 pending 的 promise，之后再解析为 rejected
    ```js
    async function foo () {
        console.log(1);
        await 666;
        console.log(2);
        throw new Error("wrong");
        console.log(4);
        return 22;
    }

    let p = foo();
    p.then((res) => {
        // 不会调用
        console.log("res:", res);
    })
    .catch((err) => {
        console.error("err:", err); // err: Error: wrong
    })

    console.log(p);  // Promise {<pending>}
    console.log(3);

    // 输出顺序为：
    // 1
    // Promise {<pending>}
    // 3
    // 2
    // err: Error: wrong
    ```
    

## 错误处理
1. 不管是 `await` 后面的 promise 被 reject，还是其他错误，都可以被 `async` 函数返回的 promise 的 `then` 或 `catch` 捕获
    ```js
    async function foo(){
        await Promise.reject(22);
    }

    foo()
    .catch( (err) => {
        console.error(err); // 22
    });
    ```
    ```js
    async function foo(){
        throw new Error(22)
    }

    foo()
    .catch( (err) => {
        console.error(err.message); // 22
    });
    ```
2. `await` 之后如果有错误，那么 `async` 函数返回的 promise 也就无法被解析，所以 promise 的回调就不能执行
    ```js
    async function foo(){
        await Promise.resolve(22);
        throw new Error(33)
    }

    foo()
    .then((res) => {
        // 不会被调用
        console.log(res);
    })
    .catch( (err) => {
        console.error(err.message); // 33
    });
    ```
3. 与 promise 中 reject 之后的代码仍然会执行不同，这里之后的代码不会再被执行。
    ```js
    async function foo () {
        // console.log 不会被调用
        console.log( await Promise.reject(22) );
    }

    foo()
    .catch( (err) => {
        console.error(err); // 22
    });
    ```
4. 为了不影响后面的代码继续执行，可以用以下两种 catch
    ```js
    try {
        await Promise.reject('出错了');
    }
    catch(e) {
    }
    ```
    ```js
    await Promise.reject('出错了')
        .catch(e => console.log(e));
    ```
5. 因为 async 函数并不总是返回一个单独 promise 并后续调用其 `then` 或 `catch`方法，经常也是作为其他 async 函数内部 `await` 之后的 promise，所以更通用的捕获错误的方法还是直接在 async 函数内部 `try...catch`
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


## 并行 `await`
1. 多个 `await` 时，如果后面的不依赖前面的结果，则没必要逐个进行
    ```js
    let foo = await getFoo();
    let bar = await getBar();
    ```
    上面这样是 `getFoo()` 有结果后才会执行 `getBar()`，如果没有依赖，这样很浪费时间。
2. 通过以下两个方法让它们同时进行，都在 `await` 就几乎同时开始了两个异步操作：
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
3. 在循环中，`async` 函数是并行的，而不会让循环等待。但并行同时也意味着，结果不一定会按照数组中的顺序
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
    上面三种循环，都是同时在 3 秒之后打印结果


## References
* [Async/await](https://javascript.info/async-await)
* [JavaScript ES 2017: Learn Async/Await by Example](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
* [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)
