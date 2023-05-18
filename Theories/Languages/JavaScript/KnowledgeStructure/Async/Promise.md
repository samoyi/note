# Promise


<!-- TOC -->

- [Promise](#promise)
    - [Basic](#basic)
        - [给你一个承诺（promise）：](#给你一个承诺promise)
        - [基本用法](#基本用法)
    - [对结果不可变的承诺](#对结果不可变的承诺)
    - [Promise 对象](#promise-对象)
        - [构造函数直接返回的 promise 状态会同步改变](#构造函数直接返回的-promise-状态会同步改变)
    - [`Promise.prototype.then()`](#promiseprototypethen)
        - [回调调用机制](#回调调用机制)
        - [返回值——使用微任务取代嵌套调用栈](#返回值使用微任务取代嵌套调用栈)
        - [详细的返回值规则](#详细的返回值规则)
            - [如果之后回调返回一个 promise 实例](#如果之后回调返回一个-promise-实例)
            - [如果之后回调返回的不是 promise](#如果之后回调返回的不是-promise)
            - [如果回调抛出错误](#如果回调抛出错误)
        - [返回的 promise 的状态改变时间](#返回的-promise-的状态改变时间)
            - [如果 `then` 的回调明确返回了 promise 实例](#如果-then-的回调明确返回了-promise-实例)
            - [如果 `then` 的回调返回了其他值](#如果-then-的回调返回了其他值)
        - [链式调用](#链式调用)
    - [`Promise.prototype.catch()`](#promiseprototypecatch)
        - [Error propagation](#error-propagation)
    - [Promise rejection events](#promise-rejection-events)
        - [示例](#示例)
    - [`Promise.prototype.finally()`](#promiseprototypefinally)
    - [Nested promise](#nested-promise)
        - [如果嵌套实例提前 resolve 了](#如果嵌套实例提前-resolve-了)
        - [如果嵌套实例提前 reject 了](#如果嵌套实例提前-reject-了)
        - [如果被嵌套实例提前 resolve 了](#如果被嵌套实例提前-resolve-了)
        - [如果被嵌套实例提前 reject 了](#如果被嵌套实例提前-reject-了)
    - [捕获错误](#捕获错误)
    - [Promise 的执行顺序](#promise-的执行顺序)
        - [结合 async-await 函数的例子分析](#结合-async-await-函数的例子分析)
    - [`Promise.all(iterable)`](#promisealliterable)
    - [`Promise.race()`](#promiserace)
    - [`Promise.resolve()` & `Promise.reject()`](#promiseresolve--promisereject)
        - [`Promise.resolve()` 返回类型](#promiseresolve-返回类型)
            - [如果参数是 promise 实例](#如果参数是-promise-实例)
            - [如果参数是一个 thenable 对象](#如果参数是一个-thenable-对象)
            - [其他参数](#其他参数)
        - [`Promise.reject()` 返回类型](#promisereject-返回类型)
    - [其他一些自定义的有用的方法](#其他一些自定义的有用的方法)
    - [自己实现加深理解](#自己实现加深理解)
        - [基本的 promise](#基本的-promise)
            - [接口](#接口)
        - [逻辑](#逻辑)
            - [实现功能](#实现功能)
            - [then 逻辑](#then-逻辑)
        - [边界条件](#边界条件)
        - [实现](#实现)
    - [其他](#其他)
        - [并行数量限制的 promise](#并行数量限制的-promise)
    - [References](#references)

<!-- /TOC -->


## Basic
### 给你一个承诺（promise）：
1. 你不用管，我帮你做这个事情：异步操作。
2. 到时候不管成功或失败，都会告诉你情况：异步操作成功时调用 `resolve`，结果作为参数；异步操作失败时调用 `reject`，错误作为参数。
3. 你记住我这个承诺，等待我的消息：获得 Promise 实例，通过 `then` 和 `catch` 监听成功或失败。

### 基本用法
1. 作为构造函数的参数是一个函数，记为 `executor`。`executor` 是负责异步操作的对象；
2. 调用构造函数返回一个 Promise 实例，记为 `promise`。使用该实例的是接受承诺并使用该异步操作的用户。
3. `executor` 内部会进行异步操作。
4. `executor` 有两个参数，两个参数都是函数。记为 `resolve` 和 `reject`。成功或失败时 `executor` 会分别调用这两个函数通知使用 promise 实例的用户。
5. `executor` 内部会用 `resolve` 和 `reject` 发出通知，而用户也需要监听和接受通知。为了监听异步操作的结果，实例需要调用 `then` 方法和 `catch` 方法。
6. 当然用户是在拿到实例后直接调用这两个方法的，所以这两个方法本身并不会直接得到异步的结果，这两个方法是用来接收成功和失败的回调函数的。而回调函数的参数就是成功的值和失败的错误信息。
7. 传递给 `then` 方法的函数记为 `onFulfilled`，同时还可以传一个可选的参数 `onRejected`；传递给 `catch` 方法的函数记为 `onRejected`。从命名就可以说明是成功或失败的处理函数。
8. 如果 `executor` 内部的异步操作成功，需要调用 `resolve` 通知 `promise` 实例。`resolve` 的参数应当设为异步操作的结果。当该方法被调用时，用户传递的成功处理函数 `onFulfilled` 会被自动调用，参数和 `resolve` 的参数相同。
9. 也就是说 `executor` 内部使用 `resolve` 发出成功通知，这是 `promise` 执行人内部的行为；而使用 `promise` 的用户通过 `onFulfilled` 方法接收成功通知和结果。
10. 如果 `executor` 内部的异步操作失败，需要调用 `reject` 通知 `promise`。`reject` 的参数应当设为失败信息。当该方法被调用时，`onRejected` 会被自动调用，参数和 `reject` 的参数相同。
11. 另外，异步操作中，如果在调用 `resolve` 或 `reject` 之前抛出了错误，则 `onRejected` 也会被自动调用，参数为抛出的错误实例。
12. 因为异步操作结果会被永久保存，所以之后依然可以从实例中读取结果。

```js
let promise = new Promise((resolve, reject)=>{
    // 这里模拟一个耗时两秒的异步数据请求
    setTimeout(()=>{
        let n = Math.random();
        if(n > 0.5){ // 模拟请求成功
            resolve('200 ' + n);
        }
        else{ // 模拟请求失败
            reject('404 ' + n);
        }
    }, 2000);
});

// 这里会在异步完成之后立刻获得结果
promise
.then(res=>{
    console.log('异步操作刚结束时读取异步操作结果 success: ' + res);
}, err=>{
    // then 一般不需要添加这个第二个参数，直接交给最后的 catch 就行了
    console.log('异步操作刚结束时读取异步操作结果 fail: ' + err);
})
.catch(err=>{
    // 如果 then 没有第二个参数，这个函数会被调用
    console.log('异步操作刚结束时读取异步操作结果 fail: ' + err);
});

// 这里会在异步完成两秒之后再通过实例读取异步操作结果，仍然可以读取成功
setTimeout(()=>{
    promise
    .then(res=>{
        console.log('之后再次读取异步操作结果 success: ' + res);
    })
    .catch(err=>{
        console.log('之后再次读取异步操作结果 fail: ' + err);
    });
}, 4000)
```


## 对结果不可变的承诺
1. 不管是调用 `resolve` 了还是 `reject`，后面的代码都会继续执行。但是，后面的 `resolve` 和 `reject` 都是无效的。而且如果后面有错误，错误不会被抛出到外部也不会被捕获，但是会阻止之后代码的执行
    ```js
    new Promise((resolve, reject)=>{
        resolve('resolved'); // 成功解析
        reject('rejected'); // 不会触发 catch
        console.log(22); // 可以被打印
        throw new Error('err'); // 不会抛出到外部也不会被捕获
        console.log(33); // 不会被打印
    })
    .then((res)=>{
        console.log(res); // "resolved"
    })
    .catch(err=>{
        console.log(err); // 不会捕获到 reject 或 error
    })
    ```
2. 因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。因此除了之后不能再调用 `resolve` 和 `reject`，因为抛出错误也是相当于 `reject`，所以错误也不会被抛出到外部。


## Promise 对象
1. Promise 对象代表着一个异步操作，从中可以读取到它的状态，可能是正在进行，可能是成功了，也可能是失败了；如果成功或失败了，可以得到成功的返回值和失败的原因。
2. 与普通异步操作需要在发起时就传递回调不同，使用 promise 可以在之后的任何时候调用它的实例方法获得回调的状态和结果
    ```js
    let p = new Promise((resolve, reject) => {
        // 异步操作一秒钟之后完成
        setTimeout(() => {
            resolve("success");
        }, 1000);
    });

    // 异步操作发起之后再添加回调
    // 因为是异步操作刚发起就添加的，所以一秒钟后操作异步完成后这里就能得到结果
    p.then((res) => {
        console.log(res);
    });

    // 异步操作发起两秒后再添加回调
    // 此时异步操作已经完成了，所以刚添加完就能得到结果
    setTimeout(() => {
        p.then((res) => {
            console.log(res);
        })
    }, 2000);
    ```
3. 你在异步操作结束前就添加回调，可以在刚结束时就及时得到结果；而之后再添加的话，异步操作已经完成了，所以添加完就能得到结果。（不过并不是添加完立刻得到，因为 promise 的回调要作为微任务执行）

### 构造函数直接返回的 promise 状态会同步改变
1. 下面的例子中，在调用 `resolve` 后，实例立刻变成了
    ```js
    let fn;
    let p = new Promise((resolve) => {
        fn = resolve;
    });

    console.log(p); // Promise {<pending>}
    fn();
    console.log(p); // Promise {<fulfilled>: undefined}
    debugger;
    ```
2. 这里强调了是 “构造函数直接返回的 promise”，在下面 `then` 方法返回的 promise 的情况下会有所不同。


## `Promise.prototype.then()`
### 回调调用机制
1. 这个方法是用来给 promise 所代表的的异步操作添加回调的。
2. 使用这个方法添加的回调会在 promise 的异步操作得到结果后被调用，但并不是同步调用
    ```js
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("success");
            console.log(1);
        }, 1000);
    });

    p.then((res) => {
        console.log(res);
    });
    ```
    调用 `resolve` 使异步操作完成后，并不会立刻打印 `"success"`，还是要先打印 `1`。显然回调的优先级不可能强到插入到两行同步执行的代码之间。
3. 准确地说，异步操作完成后，并不是调用回调，而是把回调加入到微任务队列里。

### 返回值——使用微任务取代嵌套调用栈
1. `then` 方法是用来给异步操作传递回调的，那为什么需要返回值呢？
2. 假设我们有一个链式的异步操作：
    1. 第一个异步操作结束后调用回调，在回调里调用第二个异步操作；
    2. 第二个异步操作结束后调用回调，在回调里调用第三个异步操作；
    3. 第三个异步操作结束后调用回调，链式异步操作结束。
3. 如果 `then` 没有返回值，使用 promise 需要如下实现
    ```js
    new Promise((resolve) => {
        setTimeout(() => {
            resolve("step 1");
        }, 1000);
    })
    .then((res) => {
        console.log(res);
        new Promise((resolve) => {
            setTimeout(() => {
                resolve("step 2");
            }, 1000);
        })
        .then((res) => {
            console.log(res);
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("step 3");
                }, 1000);
            })
            .then((res) => {
                console.log(res);
            });
        });
    });
    ```
4. 可以看到这是逐层嵌套的结构，也就是所谓的回调地狱。我们必须在上一个异步操作回调函数的内部发起下一次异步操作并添加回调，所以就会形成嵌套。
5. 不仅在形式上是嵌套的，从调用逻辑上看，外层的回调函数也一直不能返回，要等待内层所有的回调都执行完，这就导致了调用栈的累积。
6. 而 `then` 实际可以通过返回值，让我们虽然在上一个异步操作回调函数的内部发起下一次异步操作，但是这一次的回调添加可以放到外部，从而就跳出了上一个回调函数，让它可以及时返回离开调用栈。
7. 如果我们在 `then` 的回调里新发起的 promise 异步后，返回该 promise 实例，则 `then` 方法也会返回和这个实例状态相同的 promise。虽然 **不是同一个**，但是可以当做同一个使用。
8. 这样，我们就可以在和上一个 `then` 平级的环境里添加链式异步操作后续 promise 的回调
    ```js
    new Promise((resolve) => {
        setTimeout(() => {
            resolve("step 1");
        }, 1000);
    })
    .then((res) => {
        console.log(res);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("step 2");
            }, 1000);
        });
    })
    .then((res) => {
        console.log(res);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("step 3");
            }, 1000);
        });
    })
    .then((res) => {
        console.log(res);
    });
    ```
9. 平级意味着调用栈不会累积，每个回调入栈处理完之后都会先出栈，然后后面的回调再入栈。
10. 返回值的规则也适用于 `then` 的第二个函数参数
    ```js
    new Promise((resolve, reject) => {
        reject("fail");
    })
    .then((res) => {
        console.log(res);
        return 22;
        }, (err) => {
            console.error(err); // fail
            return 33;
        }
    )
    .then((res) => {
        console.log(res); // 33
    })
    ```

### 详细的返回值规则
1. 实际上，即使没有在 `then` 的回调里明确的返回 promise 对象，`then` 也会返回一个 promise 对象。但是，这个 promise 的状态仍然取决于 `then` 的回调的返回值。
2. 因为 `then` 的调用是在同步的主线程，而它的回调是作为微任务之后异步调用。所以 `then` 刚返回的 promise 对象的状态是 pendding。
3. 之后等它的回调执行时，根据回调的返回值，`then` 返回的 promise 的状态会发生相应的变化。

#### 如果之后回调返回一个 promise 实例
则 `then` 返回的 promise 实例的状态会变成和该 promise 实例相同的状态。注意只是状态相同，但并不是同一个。
```js
let p0 = Promise.resolve(22)
.then((res) => {
    console.log(res);
    return new Promise( (resolve, reject) => {
        
    });
});
console.log("Sync:", p0);
setTimeout(() => {
    console.log("Macro:", p0);
});
// 依次输出：
// Sync: Promise {<pending>}
// 22
// Macro: Promise {<pending>}
```
```js
let p1 = Promise.resolve(22)
.then((res) => {
    console.log(res);
    return new Promise( (resolve, reject) => {
        resolve(33);
    });
});
console.log("Sync:", p1);
setTimeout(() => {
    console.log("Macro:", p1);
});
// 依次输出：
// Sync: Promise {<pending>}
// 22
// Macro: Promise {<fulfilled>: 33}
```
```js
let p2 = Promise.resolve(22)
.then((res) => {
    console.log(res); // 22
    return new Promise( (resolve, reject) => {
        reject(33);
    });
});
console.log("Sync:", p2); // Sync: Promise {<pending>}
setTimeout(() => { // 下一个事件循环
    console.log("Macro:", p2); // Macro: Promise {<rejected>: 33}
    debugger;
    p2.catch(()=>{});
});

// 断点时的输出依次为：
// Sync: Promise {<pending>}
// 22
// Uncaught (in promise) 33
// Macro: Promise {<rejected>: 33}

// 结束后的输出更新为：
// Sync: Promise {<pending>}
// 22
// Macro: Promise {<rejected>: 33}

// 断点时已经进入到第二个事件循环，而上一个事件循环中的 reject 没有被捕获，所以抛出了异常；
// 之后通过 catch 捕获了 rejct，所以异常抛出消失
```

#### 如果之后回调返回的不是 promise
则 `then` 返回的 promise 的状态变为 fulfilled，resolved 的值就是回调的返回值；
```js
let p = Promise.resolve(22)
.then((res) => {
    console.log(res);
    return 33;
});
console.log("Sync:", p);
setTimeout(() => {
    console.log("Macro:", p);
});
// 依次输出：
// Sync: Promise {<pending>}
// 22
// Macro: Promise {<fulfilled>: 33}
```

#### 如果回调抛出错误
则 `then` 返回的 promise 状态变为 rejected，rejected 的错误就是抛出的错误
```js
let p = Promise.resolve(22)
.then((res) => {
    console.log(res);
    throw new Error(33);
});
console.log("Sync:", p);
setTimeout(() => {
    p.catch((err) => {
        console.log("Macro:", p); 
        console.error("Macro:", err);
    })
});
// 依次输出：
// Sync: Promise {<pending>}
// 22
// Macro: Promise {<rejected>: Error: 33
// Macro: Error: 33
```

### 返回的 promise 的状态改变时间
上面说到构造函数直接返回的 promise 状态会同步改变，但这里的情况不同，而且还很奇怪且不统一。

#### 如果 `then` 的回调明确返回了 promise 实例
1. 如下例子，`p` 是最初的 promise，`p1` 是 `then` 返回的 promise，`p2` 是 `then` 回调返回的 promise。
2. 按照上面说到的，`p1` 和 `p2` 不同但是状态相同。不过其实它们的状态最终会相同，但是并不是一开始就相同
    ```js
    let p2; 

    let p = Promise.resolve(22);
    let p1 = p.then((res) => {
        // 这个函数是第一个微任务
        console.log(res); // 22
        p2 = new Promise( (resolve, reject) => {
            resolve();  
        });

        console.log("Inner:", p1); // Inner2: Promise {<pending>}
        console.log("Inner:", p2); // Inner2: Promise {<fulfilled>: undefined}
        debugger;

        Promise.resolve().then(() => {
            // 这个函数是 resolve 调用后才建立的微任务
            console.log("Micro next:", p1); // Micro next: Promise {<pending>}
            console.log("Micro next:", p2); // Micro next: Promise {<fulfilled>: undefined}
            debugger;
        });

        return p2;
    });
    console.log("Sync:", p1); // Sync: Promise {<pending>}
    console.log("Sync:", p2); // Sync: undefined

    Promise.resolve().then(() => {
        // 这个函数是第二个微任务
        console.log("Micro:", p1); // Micro: Promise {<pending>}
        console.log("Micro:", p2); // Micro: Promise {<fulfilled>: undefined}
        debugger;
    });

    setTimeout(() => {
        console.log("Macro:", p1); // Macro: Promise {<fulfilled>: undefined}
        console.log("Macro:", p2); // Macro: Promise {<fulfilled>: undefined}
        debugger;
    });

    // 输出顺序如下
    // Sync: Promise {<pending>}
    // Sync: undefined
    // 22
    // Inner: Promise {<pending>}
    // Inner: Promise {<fulfilled>: undefined}
    // Micro: Promise {<pending>}
    // Micro: Promise {<fulfilled>: undefined}
    // Micro next: Promise {<pending>}
    // Micro next: Promise {<fulfilled>: undefined}
    // Macro: Promise {<fulfilled>: undefined}
    // Macro: Promise {<fulfilled>: undefined}
    ```
3. 同步执行完 `setTimeout` 后，已经有了两个微任务等待执行。然后在第一个微任务在调用 `resolve` 的时候，从 `Inner` 的输出可以看到：
    1. `p2` 状态已经同步改变了，这没问题，和上面所说的同步改变是一致的。
    2. 但 `p1` 作为 `p2` 的 “高仿”，并没有变。
4. 而且甚至，`p1` 的改变也不是作为微任务。因为如果是作为微任务改变，那就应该在 `Micro next` 中改变。
5. 而且状态改变也不应该并且确实不是通过宏任务，因为如果是通过宏任务，那这个宏任务就应该排在 `setTimeout` 的回调宏任务之后。但显然在 `setTimeout` 的回调里就已经更新了状态。不懂

#### 如果 `then` 的回调返回了其他值
1. 如下例子
    ```js
    let p = Promise.resolve(22);
    let p1 = p.then((res) => {
        // 这个函数是第一个微任务
        console.log(res);
        return 33;
    });
    console.log("Sync:", p1);

    Promise.resolve().then(() => {
        // 这个函数是第二个微任务
        console.log("Micro:", p1);
        debugger;
    });

    setTimeout(() => {
        console.log("Macro:", p1);
        debugger;
    });

    // 依次输出：
    // Sync: Promise {<pending>}
    // 22
    // Micro: Promise {<fulfilled>: 33}
    // Macro: Promise {<fulfilled>: 33}
    ```
2. 这里就和通过构造函数返回的 promise 实例改变状态的时间一样了，是同步改变，因为在第一个微任务里返回了数值后，第二个微任务就看到改变了。
3. 抛出错误的情况也是一样。

### 链式调用
1. 因为 `then` 方法返回的是和回调里返回的 promise 状态相同的 promise 实例，而回调是处理之前一个 promise 的，所以就可以通过链式调用 `then` 方法来处理链式的异步操作。
2. 同时，因为 `catch` 方法是 `then(null, rejection)` 方法的别名，所以后面依然可以继续链
    ```js
    let p0 = new Promise((resolve, reject)=>{
        resolve('resolved');
    });
    console.log('0');
    let p1 = p0.then(res=>{
        console.log(res); // "resolved"
        return 22;
    });
    console.log('1');
    let p2 = p1.then(res=>{
        console.log(res); // 22
        throw new Error('error!')
    });
    console.log('2');
    let p3 = p2.catch(err=>{
        console.log(err.message); // "error!"
        return 33;
    });
    console.log('3');
    let p4 = p3.then(res=>{
        console.log(res); // 33
    });
    console.log('4');

    // 依次输出
    // 0 
    // 1 
    // 2 
    // 3 
    // 4 
    // resolved 
    // 22 
    // error! 
    // 33
    ```
3. 分析
    1. `p0` 解析为 `"resolved"`；
    2. 打印 `0`；
    3. `then` 为 `p0` 添加回调，返回 `p1`；因为 `p0` 已解析，所以该回调加入微任务队列；
    4. 打印 `1`；
    5. `then` 为 `p1` 添加回调，返回 `p2`；
    6. 打印 `2`；
    7. `then` 为 `p2` 添加回调，返回 `p3`；
    8. 打印 `3`；
    9. `then` 为 `p3` 添加回调，返回 `p4`；
    10. 打印 `4`；
    11. 同步调用结束；
    12. 执行唯一的微任务：打印 `"resolved"`，`p1` 解析为 `22`；
    13. `p1` 回调加入微任务；
    14. 执行唯一的微任务：打印 `22`，`p2` reject 为 `"error!"`；
    15. `p2` 回调加入微任务；
    16. 执行唯一的微任务：打印 `"error!"`，`p3` 解析为 `33`；
    17. `p3` 回调加入微任务；
    18. 执行唯一的微任务：打印 `33`，`p4` 解析为 `undefined`；
    19. `p4` 没有回调，宏任务结束。
4. 不过更实际的使用情况是，在回调里返回就是一个异步操作
    ```js
    function resolved(ms, res){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(res);
            }, ms);
        });
    }
    function rejected(ms, err){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                reject(err);
            }, ms);
        });
    }

    new Promise((resolve, reject)=>{
        resolve('resolved');
    })
    .then(res=>{
        console.log(res); // 1. 直接加入微任务队列，很快输出 "resolved"
        return resolved(2000, 22);
    })
    .then(res=>{
        console.log(res); // 2. 两秒钟加入微任务队列，输出 22
        return rejected(2000, new Error('error!'));
    })
    .catch(err=>{
        console.log(err.message); // 3. 再两秒钟后加入微任务队列，输出 "error!"
        return resolved(2000, 33);
    })
    .then(res=>{
        console.log(res); // 再两秒钟后加入微任务队列，输出 33
    });
    ```
5. 分析
    1. 原 promise 解析为 `"resolved"`；
    2. 原 promise 通过 `then` 添加回调，该回调直接加入微任务队列；
    3. 之后链式添加了三个回调；
    4. 同步执行结束；
    5. 唯一的微任务执行，打印 `"resolved"`；返回一个 promise；
    6. 该 promise 两秒后解析为 `22`；
    7. 第二个 `then` 添加的回调加入空的微任务队列；
    8. 该回调执行，打印 `22`；返回一个 promise；
    9. 该 promise 两秒钟后解析为一个错误；
    10. `catch` 的回调加入空的微任务队列；
    11. 该回调执行，打印错误信息 `"'error!'"`；返回一个 promise；
    12. 该 promise 两秒钟后解析为 `33`；
    13. 最后一个 `then` 添加的回调加入空的微任务队列；
    14. 该回调执行，打印 `33`。
6. 另一个链式调用的执行顺序分析
    ```js
    Promise.resolve('foo')
    .then(function(string) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                string += 'bar';
                resolve(string);
            }, 1000);
        });
    })
    .then(function(string) {
        setTimeout(function() {
            string += 'baz';
            console.log(string);
        }, 1000)
        return string;
    })
    .then(function(string) {
        console.log("Last Then:  oops... didn't bother to instantiate and return " +
                    "a promise in the prior then so the sequence may be a bit " +
                    "surprising");
        console.log(string);
    });

    // 打印顺序为
    // 大约一秒钟后打印那一长串，以及 foobar
    // 再大约一秒钟后打印 foobarbaz
    ```
    1. 第一个 promise 直接出结果 `"foo"`
    2. 第一个 `then` 添加的第一个 promise 的回调直接加入微任务
    3. 第二个 `then` 添加第一个 `then` 返回的 promis 的回调
    4. 第三个 `then` 添加第二个 `then` 返回的 promis 的回调
    5. 调用栈准备清空，执行目前唯一的微任务
    6. 微任务中创建 promise，executor 中创建第一个 `setTimeout` 宏任务
    7. 大约一秒钟之后该宏任务执行，`string` 变成 `"foobar"`，然后 `resolve("foobar")` 给第二个 `then` 添加的回调
    8. 第二个 `then` 添加的回调因此被加入微任务队列，接收 `"foobar"`，这是目前唯一的微任务
    9. 该微任务执行，创建一个 `setTimeout` 宏任务，并返回 `"foobar"` 给第三个 `then` 添加的回调
    10. 第三个 `then` 添加的回调因此被加入微任务，接收 `"foobar"`，这是目前唯一的微任务
    11. 该微任务执行，【打印】那一长串，紧接着【打印】 `"foobar"`
    12. 一秒钟后执行目前唯一的宏任务，`string` 变成 `"foobarbaz"`，然后【打印】


## `Promise.prototype.catch()`
1. 异步操作中调用了 `reject` 函数，或者在调用 `resolve` 或 `reject` 函数之前有错误抛出，`Promise` 实例的状态都会变为 rejected，导致 `catch` 的回调被触发。
    ```js
    let p = new Promise((res, rej)=>{
        throw new Error('Error!');
        res(22);
    })
    .catch(err=>{
        console.log(err.message); // "Error!"
    })
    ```
2. It's possible to chain after a failure, i.e. a `catch`, which is useful to accomplish new actions even after an action failed in the chain
    ```js
    new Promise((resolve, reject) => {
        console.log('Initial');

        resolve();
    })
    .then(() => {
        throw new Error('Something failed');

        console.log('Do this');
    })
    .catch(() => {
        console.error('Do that');
    })
    .then(() => {
        console.log('Do this, no matter what happened before');
    });
    // Initial
    // Do that
    // Do this, no matter what happened before
    ```
3. 和捕获异常的时机一样，只要在当前事件循环退出前捕获 rejection 就不会抛出错误
    ```js
    let p = Promise.reject("oops");

    let n = 2; // 随意的其他代码

    Promise.resolve().then(() => {
        // 在微任务里捕获
        p.catch((err) => {
            console.warn(err);
        });
    });
    ```
4. 所以如果没有捕获，那就是在所有微任务执行完之后才抛出错误
    ```js
    new Promise((resolve, reject) => {
        reject();
    })

    new Promise((resolve, reject) => {
        resolve();  
    })
    .then(() => {
        console.log("resolved"); // 先打印这个再抛出错误
    })
    ```

### Error propagation
1. If there's an exception, the browser will look down the chain for `.catch()` handlers or `onRejected`
    ```js
    doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => doThirdThing(newResult))
    .then(finalResult => console.log(`Got the final result: ${finalResult}`))
    .catch(failureCallback);
    ```
2.  This is very much modeled after how synchronous code works:
    ```js
    try {
        const result = syncDoSomething();
        const newResult = syncDoSomethingElse(result);
        const finalResult = syncDoThirdThing(newResult);
        console.log(`Got the final result: ${finalResult}`);
    } catch(error) {
        failureCallback(error);
    }
    ```
3. This symmetry with asynchronous code culminates in the `async`/`await` syntactic sugar in ECMAScript 2017:
    ```js
    async function foo() {
        try {
            const result = await doSomething();
            const newResult = await doSomethingElse(result);
            const finalResult = await doThirdThing(newResult);
            console.log(`Got the final result: ${finalResult}`);
        } catch(error) {
            failureCallback(error);
        }
    }
    ```


## Promise rejection events
1. The `PromiseRejectionEvent` interface represents events which are sent to the global script context when JavaScript Promises are rejected. These events are particularly useful for telemetry and debugging purposes.
2. Whenever a promise is rejected, one of two events is sent to the global scope:
    * `rejectionhandled`: Fired when a promise is rejected, and after the rejection is handled by the promise's rejection handling code. 这个事件并不是看上去的那样，并不是一个 `reject` 的 promise 添加了捕获错误函数就会触发这个事件。根据 [这个回答](https://stackoverflow.com/a/57261820) 提到了规范中关于这个方法的内容，在规范里看到了 “queue a global task”，看起来是要在下一个宏任务处理了这个 rejection 后才会触发这个事件。也就是说，本轮事件循环没有捕获，但是之后的某个事件循环捕获了，那捕获的那个事件循环里才会触发这个事件。
    * `unhandledrejection`: Sent when a promise is rejected but there is no rejection handler available.
3. In both cases, the event has as members a `promise` property indicating the promise that was rejected, and a `reason` property that provides the reason given for the promise to be rejected.
4. These make it possible to offer fallback error handling for promises, as well as to help debug issues with your promise management. 
5. These handlers are global per context, so all errors will go to the same event handlers, regardless of source.
6. One case of special usefulness: when writing code for Node.js, it's common that modules you include in your project may have unhandled rejected promises, logged to the console by the Node.js runtime. You can capture them for analysis and handling by your code—or just to avoid having them cluttering up your output—by adding a handler for the Node.js unhandledRejection event. 

### 示例
1. 正常处理的 rejection 不会触发这两个事件
    ```js
    window.addEventListener("rejectionhandled", (ev) => {
        console.log("rejectionhandled ev.promise:", ev.promise);
        console.log("rejectionhandled ev.reason:", ev.reason);
    });
    window.addEventListener("unhandledrejection", (ev) => {
        console.log("unhandledrejection ev.promise:", ev.promise);
        console.log("unhandledrejection ev.reason:", ev.reason);
    });

    let p = Promise.reject("oops");
    p.catch((err) => {});
    ```
2. 完全不处理的 rejection 会触发 `unhandledrejection`
    ```js
    window.addEventListener("rejectionhandled", (ev) => {
        console.log("rejectionhandled ev.promise:", ev.promise);
        console.log("rejectionhandled ev.reason:", ev.reason);
    });
    window.addEventListener("unhandledrejection", (ev) => {
        console.log("unhandledrejection ev.promise:", ev.promise);
        console.log("unhandledrejection ev.reason:", ev.reason);
    });

    let p = Promise.reject("oops");
    // unhandledrejection ev.promise: Promise {<rejected>: 'oops'}
    // unhandledrejection ev.reason: oops
    // Uncaught (in promise) oops
    ```
3. 本轮事件循环没有捕获的 rejection 正常触发 `unhandledrejection`，之后某个事件循环又处理了这个 rejection，则在处理的那个事件循环里触发 `rejectionhandled`
    ```js
    window.addEventListener("rejectionhandled", (ev) => {
        console.log("rejectionhandled ev.promise:", ev.promise);
        console.log("rejectionhandled ev.reason:", ev.reason);
    });
    window.addEventListener("unhandledrejection", (ev) => {
        console.log("unhandledrejection ev.promise:", ev.promise);
        console.log("unhandledrejection ev.reason:", ev.reason);
    });

    let p = Promise.reject("oops");

    setTimeout(() => {
        setTimeout(() => {
            p.catch((err) => {console.log("handle rejection: " + err)});
        });
    });


    // unhandledrejection ev.promise: Promise {<rejected>: 'oops'}
    // unhandledrejection ev.reason: oops
    // handle rejection: oops
    // rejectionhandled ev.promise: Promise {<rejected>: 'oops'}
    // rejectionhandled ev.reason: oops
    ```


## `Promise.prototype.finally()`
1. `finally` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。
2. 只要想想，其实 `then` 方法只要提供了两个回调参数，也可以实现这个功能。但与 `then` 方法的实现由两点不同：
    * `finally` 方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是 fulfilled 还是 rejected。这表明，`finally` 方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。异步不管成功或失败之后的收尾工作。
    * 第二点不同是，虽然 `finally` 方法也会像 `then` 和 `catch` 那样返回一个 Promise 实例，但返回的规则却不同：如果 `finally` 回调里抛出了错误，那返回的实例是和 `then` 和 `catch` 返回的一样，即 `Promise.reject(该错误实例)`；但如果不抛出错误，则会返回一个和上一级相同的一个 Promise 实例（但不是同一个实例）。
3. 而是
    ```js
    // 因为 finally 回调里没抛出错误，所以返回的相当于 Promise.resolve(22)
    new Promise((resolve, reject)=>{
        resolve();
    })
    .then(res=>{
        return 22;
    })
    .finally(()=>{
        return 33;
    })
    .then(res=>{
        console.log(res); // 22
    })

    // 因为 finally 回调里没抛出错误，所以返回的相当于 Promise.reject(new Error('Error!'))
    new Promise((resolve, reject)=>{
        resolve();
    })
    .then(res=>{
        throw new Error('Error!');
    })
    .finally(()=>{
        return 33;
    })
    .then(res=>{
        console.log(res); // 没有输出
    })
    .catch(err=>{
        console.log(err.message); // "Error!"
    })

    // 因为 finally 回调里抛出了错误，所以返回的相当于 Promise.reject(new Error('Error2'))
    new Promise((resolve, reject)=>{
        resolve();
    })
    .then(res=>{
        throw new Error('Error1');
    })
    .finally(()=>{
        throw new Error('Error2');
        return 33;
    })
    .then(res=>{
        console.log(res); // 没有输出
    })
    .catch(err=>{
        console.log(err.message); // "Error2"
    })
    ```


## Nested promise
1. 一个 promise 实例作为另一个 promise 的结果
2. 不懂。嵌套实例的最终解析结果感觉比较混乱，没有总结出规律，先看下面各种情况的例子

### 如果嵌套实例提前 resolve 了
1. 那就要等被嵌套实例的结果。因为只有两个都 resolve 才能整体 resolve。
2. 如果被嵌套实例最终 resolve 了，则嵌套实例 resolve，表示整体 resolve
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve('success'), 3000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(p1), 1000)
    });

    p2 // 三秒钟之后 resolve
    .then(result => console.log('fulfilled: ' + result)) // fulfilled: success
    .catch(error => console.log('rejected', error));
    ```
3. 如果被嵌套实例最终 reject 了，则嵌套实例也 reject，表示整体 reject。不懂为什么最终的 error 是解析过的结果而不是未经解析的 rejected 实例
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => reject('fail'), 3000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(p1), 1000)
    });

    p2 // 三秒钟之后 reject
    .then(result => console.log('fulfilled:' + result))
    .catch(error => console.log('rejected', error)); // rejected fail
    ```

### 如果嵌套实例提前 reject 了
1. 因为已经有一个是 reject 了，不用等待被嵌套实例的结果，整体就立刻 reject。
2. 因为此时被嵌套实例尚未解析完毕，所以嵌套实例的解析结果只是未被解析的嵌套实例。
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve('success'), 3000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => reject(p1), 1000)
    });

    p2 // 一秒钟之后  reject
    .then(result => console.log('fulfilled:' + result))
    .catch(error => console.log('rejected', error)); // rejected Promise {<pending>}
    ```
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => reject('fail'), 3000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => reject(p1), 1000)
    });

    p2 // 一秒钟之后  reject
    .then(result => console.log('fulfilled:' + result))
    .catch(error => console.log('rejected', error)); // rejected Promise {<pending>}
    ```

### 如果被嵌套实例提前 resolve 了
1. 同样，需要等待嵌套实例的结果，才能确保是否整体 resolve
2. 因为最终嵌套实例也调用了 resolve 了，则整体 resolve
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve('success'), 1000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(p1), 3000)
    });

    // 三秒钟之后  resolve
    p2
    .then(result => console.log('fulfilled: ' + result)) // fulfilled: success
    .catch(error => console.log('rejected', error));
    ```
3. 如果最终嵌套实例 reject 或出错了，则整体 reject
    ```js
    let p1 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve('success'), 1000)
    });

    let p2 = new Promise(function (resolve, reject) {
        setTimeout(() => reject(p1), 3000)
    });

    // 三秒钟之后 reject
    p2
    .then(result => console.log('fulfilled:' + result))
    .catch(error => console.log('rejected:' + error));
    // rejected: Promise {<resolved>: "success"}
    ```

### 如果被嵌套实例提前 reject 了
这是居然仍然要等待被嵌套实例的结果！虽然最终整体结果总是 reject

```js
let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject('fail'), 1000)
});

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 3000)
});

p2 // 三秒钟之后 reject
.then(result => console.log('fulfilled:' + result))
.catch(error => console.log('rejected', error)); // rejected fail
```
```js
let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject('fail'), 1000)
});

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(p1), 3000)
});

p2 // 三秒钟之后 reject
.then(result => console.log('fulfilled:' + result))
.catch(error => console.log('rejected', error)); // rejected Promise {<rejected>: "fail"}
```


## 捕获错误
1. 不管是 `then` 方法的第二个参数还是 `catch` 方法，都不仅能捕获 `promise` 中 `reject` 记录的错误，还能捕获到 `resolve` 和 `reject` 调用之前发生的其他错误
    ```js
    new Promise((resolve, reject)=>{
        throw new Error('test1');
    })
    .then(
        (res)=>{console.log(res)},
        (err)=>{console.log(err.message)} // test1 // 捕获到直接抛出的错误
    )

    new Promise((resolve, reject)=>{
        throw new Error('test2');
    })
    .catch(
        (err)=>{console.log(err.message)} // test2 // 捕获到直接抛出的错误
    )

    new Promise((resolve, reject)=>{
        throw new Error('test3');
        resolve("resolve test4");
    })
    .then((res) => {
        console.log(res); // 不会调用，因为之前已经抛出了错误
    })
    .catch(
        (err)=>{console.log(err.message)} // test3
    )

    new Promise((resolve, reject)=>{
        resolve("resolve test4");
        throw new Error('test4');
    })
    .then((res) => {
        console.log(res); // resolve test4
    })
    .catch(
        // 不会调用，已经 resolve 或 reject 了，就要遵守 promise，
        // 之后的错误不会被抛出和捕获
        (err)=>{console.log(err.message)} 
    )

    new Promise((resolve, reject)=>{
        reject('rejected');
        throw new Error('test5');
    })
    .catch(
        (err)=>{console.log(err)} // rejected
    )
    .catch(
        (err)=>{console.log(err)} // 不会调用，resolve 或 reject 之后的错误不会被抛出和捕获
    )
    ```
2. 另外注意一下输出顺序
    ```
    test1
    test2
    resolve test4
    rejected
    test3
    ```
    `"test3"` 是最后输出的，因为前四个都是最初的 `new Promise()` 返回的 promise 解析的结果，而 `"test3"` 是它前面那个 `then()` 返回的 promise 解析的结果，也就是说解析 `"test3"` 的微任务是排在前面几个微任务的后面。
3. 但 `resolve` 和 `reject` 调用之后，并不是像 `return` 一样后面的代码就不执行。后面仍然会执行，只不过其中的错误既不会被捕获也不会被抛出。但是，错误仍然会导致中断执行。
    ```js
    new Promise((resolve, reject)=>{
        resolve(22); // 不管是 resolve
        // reject(33); // 还是 reject
        console.log('aa'); // 有输出
        throw new Error('test4'); // 但不会被捕获也不会被抛出
        console.log('bb'); // 没有输出，执行被错误中断
    })
    .then(res=>{console.log(res)})
    .catch(err=>{console.log(err)})
    ```
3. 但是，如果是先抛出了错误，则后面的代码不会执行
    ```js
    new Promise((resolve, reject)=>{
        throw new Error('fail');
        console.log(222); // 不会输出
    })
    .catch(err=>{
        console.log(err.message); // "fail"
    });
    ```
4. 会被捕获的错误（不管是 `reject` 里的还是，`resolve` 和 `reject` 调用之前的），会沿着 `promise` 链向后传播，直到被捕获为止
    ```js
    new Promise((resolve, reject)=>{
        reject(new Error('test'));
    })
    .then(
        (res)=>{console.log(res)},
    )
    .then(
        (res)=>{console.log(res)},
    )
    .catch(err=>{
        console.log('catch: ' + err.message);
    })
    ```
    因为这个特性，像上面的例子一样，前面的 `then` 方法不用写第二个参数，统一在最后用 `catch` 来捕获错误的写法更加和谐。
5. 在 Node v8.9.1 中虽然在 `promise` 中的能够被捕获的错误不加捕获也不会影响外部代码的继续执行，但已经给出了警告说明在未来这么做会中断程序的执行。
6. 注意在 `promise` 中 `setTimeout` 回调的错误影响到外部，因为 `setTimeout` 回调函数本身就不在 `promise` 里
    ```js
    new Promise(function (resolve, reject) {
        setTimeout(()=>{
            resolve(22);
            throw new Error(); // 会被抛出，不会被捕获
        }, 2000);
    })
    .then(res=>{
        console.log(res); // 22
    })
    .catch(err=>{
        console.log(err); // 不会被捕获
    });
    ```
    注意是先抛出错误再打印22，因为打印22属于 microTask。
7. 因为现阶段（2018.8）`promise` 中的未被捕获的错误不一定会暴露到外面（Chrome 抛出但 FF 不会）。就导致在 `Promise` 链的最后一环如果出错，这个错误可能就不会被发现：
    ```js
    new Promise((res, rej)=>{
        rej();
    })
    .catch(err=>{
        throw new Error();
        console.log('这个无法显示了');
    });
    ```
    上面的例子在 Chrome 可以抛出一个错误，但在 FF 什么也观察不到。  
8. 不过可以通过自己添加的方法来实现抛出最后一环的错误。其实就是在最后一环再加上一个 `catch`，catch 到错误后通过 `setTimeout` 抛出到 promise 外部。但是这个方法在 Mocha 的测试脚本中无效
    ```js
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.catch(function (reason) {
            // 抛出一个全局错误到 promise 外部
            setTimeout(() => { throw reason });
        });
    };

    new Promise((res, rej)=>{
        rej();
    })
    .catch(err=>{
        throw new Error();
        console.log('这个无法显示了');
    })
    .done();
    ```
 现在，在 FF 里也可以看到错误被抛出了。


## Promise 的执行顺序
1. `executor` 里的操作会立刻执行，这没问题，因为要发起异步操作；但是即使是 resove 或者 reject 之后的操作，也会同步（非异步）的执行
    ```js
    let p = new Promise ((resolve, reject) => {
        console.log("1");
        resolve("true");
        // reject("false");
        console.log("2");
    });

    p.then((res) => {
        console.log(res);
    }, (err) => {
        console.warn(err);
    });

    console.log(3);

    // resolve 时输出书序为： 1 2 3 true
    // reject  时输出书序为： 1 2 3 false
    ```
2. 再看个例子
    ```js
    let p = new Promise((res, rej)=>{
        console.log(1);
        rej('error');
        console.log(2);
    })

    console.log(p);

    console.log(p.catch(err=>{
        console.log(3);
        console.log(err);
        setTimeout(()=>{
            console.log(4);
            console.log(sth); // 这样会全局抛出一个错误
        });
    }));
    ```
    输出顺序为：
    ```
    1
    2
    Promise {<rejected>: "error"}
    Promise {<pending>}
    3
    error
    4
    ReferenceError
    ```

### 结合 async-await 函数的例子分析
1. 程序如下
    ```js
    setTimeout(function () {
        console.log("1");
    }, 0);

    async function async1() {
        console.log("2");
        const data = await async2(); // p3
        console.log("3");
        return data;
    }

    async function async2() {
        return new Promise((resolve) => { // p1
            console.log("4");
            resolve("async2的结果");
        }).then((data) => { // p2
            console.log("5");
            return data;
        });
    }

    async1()
    .then((data) => {
        console.log("6");
        console.log(data);
    });

    new Promise(function (resolve) {
        console.log("7");
        //   resolve()
    }).then(function () {
        console.log("8");
    });
    ```
2. 其实只要知道 promise 和 async-await 异步逻辑，一步一步线性的推导就行了，毕竟 JS 主线程就是线性的。
3. 调用栈推入全局执行环境：
    1. 调用 `setTimeout`，创建 【宏任务1】，该宏任务之后会打印 1；
    2. `setTimeout` 返回；
    3. 调用 `async1`：
        1. 【打印 2】；
        2. 调用 `async2`：
            1. 调用 Promise 构造函数并传入 executor；
            2. executor 执行，【打印 4】，`resolve` 该 promise 为 `"async2的结果"`;
            3. Promise 构造函数返回 promise 实例，记为 p1。该实例紧接着调用 `then` 方法，传递 p1 的回调；
            4. 因为 p1 已经 resolve 了，所以这个回调直接加入微任务队列，作为 【微任务1】；
            5. `then` 方法也创建了一个 promise 实例，记为 p2，将解析为 `data` 的值；
        3. `async2` 返回 `then` 返回的 promise 实例给 `await`，`await` 后续的代码相当于 【p2的回调】。
    4. `async1` 在 await 处就返回 promise 实例，记为 p3；
    5. p3 调用 `then` 方法并接受函数作为 【p3 的回调】；
    6. 全局环境创建 promise，调用 executor，【打印 7】；但是没有 `resolve`，之后虽然通过 `then` 传递了回调但不会执行；
4. 全局执行环境准备清空，开始调用微任务：
    1. 当前微任务队列中唯一的微任务【微任务1】回调执行， 【打印 5】并返回 `"async2的结果"`；
    2. p2 解析为 `"async2的结果"`；
    3. 【p2的回调】作为微任务加入空的微任务队列，立刻执行：
        1. data 被赋值为 `"async2的结果"`；
        2. 【打印 3】；
        3. `async1` 返回，也就相当于 p3 解析为 `"async2的结果"`；
        4. 【p3 的回调】加入空的队列并立刻执行：
            1. 【打印 6】；
            2. 【打印 "async2的结果"】；
5. 全局执行环境清空，本轮宏任务结束；
6. 下一个宏任务开始，【打印 1】
5. 打印顺序为：
    1. 2
    2. 4
    3. 7
    4. 5
    5. 3
    6. 6
    7. "async2的结果"
    8. 1


## `Promise.all(iterable)`
1. `Promise.all` 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
2. `Promise.all` 方法的参数可以不是数组，但必须具有 Iterator 接口
    ```js
    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(111);
        }, 1000);
    });
    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });

    Promise.all([p1, p2])
    .then(res=>{
        console.log(res); // 三秒钟之后输出 [111, 222]
    })

    Promise.all(new Set([p2, p1]))
    .then(res=>{
        console.log(res); // 三秒钟之后输出 [222, 111]
    })
    ```
3. 如果参数可遍历对象的的某项不是 Promise 实例，就会先调用 `Promise.resolve` 方法，将参数转为 Promise 实例，再进一步处理。    
    ```js
    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(111);
        }, 1000);
    });
    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });
    // 相当于 Promise.all([p1, p2, Promise.resolve(333)])
    Promise.all([p1, p2, 333])
    .then(res=>{
        console.log(res); // 三秒钟之后输出 [111, 222, 333]
    })
    ```
4. 如果其中一个实例 reject 了，那不用等待其他实例处理，`Promise.all` 会立刻 rejcet
    ```js
    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            reject('oops');
        }, 1000);
    });
    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });
    Promise.all([p1, p2])
    .catch(err=>{
        console.error(err); // 一秒钟之后就输出 oops
    });
    ```
4. 作为参数的 `promise` 自身如果捕获了自身的错误，那么这个错误对于 `Promise.all` 就是不存在的，而之前捕获错误函数的返回值将作为 `Promise.all` 正确 resolve 的结果之一。
    ```js
    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            reject('oops');
        }, 1000);
    })
    .catch(err=>err);

    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });

    Promise.all([p1, p2])
    .then(res=>{
        console.log(res); // 三秒钟之后输出 ["oops", 222]
    })
    .catch(err=>{
        这里不会被调用
    });
    ```
5. 自己实现
    1. 接口
        ```js
        function my_promise_all (iterable) {
            return new Promise();
        }
        ```
    2. 逻辑
        1. 设置一个结果数组 `results` 用来记录每个 promise 的结果值；
        2. 创建一个新的 promise 实例用于返回；
        3. 新的 promise 里，依次解析每个参数 promise：
            * 如果解析成功，就把结果值加入到 `results`；同时还要检查是否解析完成了所有的参数 promise
            * 如果解析失败，就直接 reject 这个新的 promise；
        4. 需要注意的是，将每个参数 promise 的解析结果加入到 `results` 时不能使用 `push` 方法，这样会导致先解析的结果就会放在前面，而 `Promis.all` 的整体解析的结果数组的顺序应该是和参数 promise 顺序一一对应的；因此在加入 `results` 数组时，需要根据当前的序号插入到对应的位置；
        5. 这也导致了，判断是否解析完全部的参数 promise 时不能使用 `result.length` 来比较，因为数组的 `length` 并不是它实际的数组项数，而是最大的序号加一；所以另外设置一个自增的 `count` 记录已经成功的 promise 的个数；
    3. 边界条件：
        * 参数不是可遍历对象，这时要报错；
        * 可遍历对象中的某项不是 promise，直接把每一项使用 `Promis.resolve()` 转换；
    4. 实现
    ```js
    function my_promise_all(iterable) {
        if (typeof iterable[Symbol.iterator] !== "function") {
            throw new TypeError("object is not iterable \
                            (cannot read property Symbol(Symbol.iterator))");
        }

        const list = [...iterable];
        const results = [];
        let count = 0;

        return new Promise((resolve, reject) => {
            for (let i = 0; i < list.length; i++) {
                Promise.resolve(list[i])
                .then((res) => {
                    results[i] = res; // 不能 push 因为保证顺序
                    // 左边不能使用 result.length 因为上面用的不是 push
                    if (++count === list.length) {
                        resolve(results);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
            }
        });
    }


    // 测试

    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(111);
        }, 1000);
    });
    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });

    my_promise_all([p1, p2, 333])
    .then(res=>{
        console.log(res); // 三秒钟之后输出 [111, 222, 333]
    })
    ```


## `Promise.race()`
1. 同样是将多个 Promise 实例，包装成一个新的 Promise 实例。而且和 `Promise.all` 的参数也是相同的。不同的是，可以从名字看出来，race 和 all，`Promise.race()` 参数的若干个 promise 实例只要有一个出结果了，该结果就会作为 `Promise.race()` 返回的总体的 promise 实例的结果。
    ```js
    let p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(111);
        }, 1000);
    });
    let p2 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(222);
        }, 3000);
    });
    Promise.race([p1, p2])
    .then(res=>{
        console.log(res); // 一秒钟之后输出 111
    })
    ```
2. 可以用来给某个异步操作设定一个时限
    ```js
    const p = Promise.race([
        fetch('/resource-that-may-take-a-while'),
        new Promise((resolve, reject)=>{
            setTimeout(() => reject(new Error('request timeout')), 5000)
        })
    ]);
    p
    .then(response => console.log(response));
    .catch(error => console.log(error));
    ```
    如果第一个异步操作 fetch 五秒之内没有反应，则第二个异步操作执行并作为总体的结果
3. 自己实现
    ```js
    function my_promise_race (iterable) {
        if (typeof iterable[Symbol.iterator] !== "function") {
            throw new TypeError("object is not iterable \
                                (cannot read property Symbol(Symbol.iterator))");
        }

        const list = [...iterable];

        return new Promise((resolve, reject) => {
            for (let i = 0; i < list.length; i++) {
                Promise.resolve(list[i])
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
            }
        });
    }
    ```


## `Promise.resolve()` & `Promise.reject()`
1. 将参数的值转换为 promise 实例并返回。
2. 这两个方法主要是用来将非 promise 的值转换为 promise，当然如果参数传 promise 实例也可以。

### `Promise.resolve()` 返回类型
#### 如果参数是 promise 实例
直接返回该实例本身。也就是说并不会对 pending 甚至 rejected 的实例进行 resolve
```js
    let p0 = new Promise(() => {});
    console.log(Promise.resolve(p0)); // Promise {<pending>}
    console.log(p0 === Promise.resolve(p0)); // true
        
    let p1 = new Promise((resolve) => {resolve(22)});
    console.log(Promise.resolve(p1)); // Promise {<fulfilled>: 22}
    console.log(p1 === Promise.resolve(p1)); // true

    let p2 = new Promise((resolve, reject) => {reject(33)});
    console.log(Promise.resolve(p2)); // Promise {<rejected>: 33}
    console.log(p2 === Promise.resolve(p2)); // true
    p2.catch((err) => {
        console.log(err); // 33
    });
```

#### 如果参数是一个 thenable 对象
1. 其实也就是该对象有 `then` 方法。那么会按照下面逻辑执行：
    1. 创建一个 promise 实例；
    2. 把 thenable 对象的 `then` 方法作为该 promise 实例的 executor 加入到微任务队列；
    3. 返回该 promise 实例。
2. 示例
    ```js
    let p1;

    let thenable = {
        then (resolve, reject) {
            resolve(42);
            console.log("resolved:", p1);
        }
    };

    p1 = Promise.resolve(thenable);

    console.log("sync:", p1);

    // 按顺序输出
    // sync: Promise {<pending>}
    // resolved: Promise {<fulfilled>: 42}
    ```
    返回的 `p1` 开始时是 pending 的状态，执行了 `then` 方法的微任务后，就变成了 resolved。

#### 其他参数
创建一个 promise 实例，并 resolve 为参数的值，然后返回该实例
```js
console.log(Promise.resolve(22)); // Promise {<fulfilled>: 22}
```

### `Promise.reject()` 返回类型
1. 不像 `Promise.resolve()` 那么复杂，不管参数是什么，`Promise.reject()` 就是直接返回一个 rejected 的 promise 实例，reject 时的错误原因就是那个参数。
2. 如果参数是引用类型，那错误原因就是那个引用类型本身；如果参数是基础类型，那错误原因就是同样的值
    ```js
    let p0 = new Promise(() => {});
    let p0_rej = Promise.reject(p0);
    console.log(p0_rej); // Promise {<rejected>: Promise}
    p0_rej.catch((err) => {
        console.log(err); // Promise {<pending>}
        console.log(err === p0);
    });
        
    let p1 = new Promise((resolve) => {resolve(22)});
    let p1_rej = Promise.reject(p1); 
    console.log(p1_rej); // Promise {<rejected>: Promise}
    p1_rej.catch((err) => {
        console.log(err); // Promise {<fulfilled>: 22}
        console.log(err === p1);
    });

    let p2 = new Promise((resolve, reject) => {reject(33)});
    let p2_rej = Promise.reject(p2);
    console.log(p2_rej); // Promise {<rejected>: Promise}
    console.log(p2 === p2_rej); // false
    p2.catch((err) => {
        console.log(err); // 33
    });
    p2_rej.catch((err) => {
        console.log(err); // Promise {<rejected>: 33}
        console.log(err === p2);
    });


    let obj = {name: "33"};
    let p3_rej = Promise.reject(obj);
    p3_rej.catch((err) => {
        console.log(err); // {name: '33'}
        console.log(err === obj); // true
    });

    let p4_rej = Promise.reject(22);
    p4_rej.catch((err) => {
        console.log(err); // 22
    });
    ```


## 其他一些自定义的有用的方法
自定义 `finally` 方法
```js
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};
Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
    .catch(function (reason) {
        setTimeout(() => { throw reason });
    });
};

new Promise((res, rej)=>{
    rej(new Error());
})
.finally(()=>{
    console.log('finally');
})
.done();
```


## 自己实现加深理解
### 基本的 promise
#### 接口
    ```js
    class My_Promise {
        constructor (executor) {

        }

        _resolve (msg) {

        }

        _reject (err) {

        }

        then (onFulfilled, onRejected) {

        }
    }
    ```

### 逻辑
#### 实现功能
* resolve 或者 reject 之后就不能再次 resolve 或者 reject
* 可以使用多个 then 给一个实例添加回调
* then 可以链式调用，返回的 promise 分为三种情况：
    * 回调返回 promise，则 then 返回的 promise 也是一个保持同步的 promise；
    * 回调发生错误，则 then 返回的 promise reject 错误信息；
    * 其他，则 then 返回的 promise resolve 回调返回值。

#### then 逻辑
1. 因为 then 的回调的结果决定了 then 返回的 promise 的结果，所以 then 的回调逻辑中必须要能访问到 then 返回的 promise 的 resolve 和 reject 函数。
2. 因此，then 回调必须要在 then 返回的 promise 的 executor 中执行。
3. 另外，如果 then 调用时前一个 promise 还是 pending，则先要把 then 的回调先加入列表中，等待前一个 promise 有了结果再执行回调。
4. 但是，不能直接把回调加入队列中，因为要根据回调的结果来调用 then 返回的 promise 的 resolve 和 reject 函数。
5. 所以 then 的回调需要包装到一个新函数里，内部调用 then 回调，然后根据结果调用 then 返回的 promise 的 resolve 和 reject 函数。

### 边界条件
* 没有调用 `then` 和 `catch`；
* `then` 和 `catch` 没有传函数类型的参数；
* `executor` 中抛出错误
* TODO，现在抛出错误只能在自身的 then 里捕获，不能在后续的捕获

### 实现
```js
class My_Promise {
    constructor (executor) {
        this.state = "pendding";
        this.res;
        this.err;
        // 因为可以给一个实例通过多个 then 绑定多个回调，所以要用列表保存
        this.resolvedCBList = [];
        this.rejectedCBList = [];

        // 因为调用时是普通调用，所以要绑定当前实例。
        // 这个调用要放在 this.state 声明之后，
        // 因为 executor 里面回调用 _resolve，而 _resolve 里面会判断 this.state 的值
        try {
            executor(this._resolve.bind(this), this._reject.bind(this)); 
        }
        catch(err) {
            this.err = err;
            if (this.state === "pendding") {
                // setTimeout 等待添加 then 回调
                setTimeout(()=>{
                    // 判断是否有针对 reject 的回调，如果没有就抛出错误
                    // 本来这个应该在当前事件循环，但因为现在没有微任务，只能放到下一个事件循环
                    if (this.rejectedCBList.length) {
                        this._flushRejectedCBList();
                    }
                    else {
                        throw new Error(err);    
                    }
                }, 0);
            }
        }
    }

    _flushResolvedCBList () {
        while (this.resolvedCBList.length) {
            this.resolvedCBList.shift()(this.res);
        }
    }

    _flushRejectedCBList () {
        while (this.rejectedCBList.length) {
            this.rejectedCBList.shift()(this.err);
        }
    }

    _resolve (res) {
        // 一旦出了结果就不能再变
        if (this.state === "fulfilled" || this.state === "rejected") {
            return;
        }
        this.state = "fulfilled";
        this.res = res;
        // 回调要异步执行
        setTimeout(()=>{
            this._flushResolvedCBList();
        }, 0);
    }
    
    _reject (err) {
        if (this.state === "fulfilled" || this.state === "rejected") {
            return;
        }
        this.state = "rejected";
        this.err = err;
        setTimeout(()=>{
            // 判断是否有针对 reject 的回调，如果没有就抛出错误
            // 本来这个应该在当前事件循环，但因为现在没有微任务，只能放到下一个事件循环
            if (this.rejectedCBList.length) {
                this._flushRejectedCBList();
            }
            else {
                throw new Error("(in promise) " + err);        
            }
        }, 0);
    }

    then (resolvedCB, rejectedCB) {
        return new My_Promise((resolve, reject)=>{
            // 对 resolvedCB 和 rejectedCB 进行包装
            function wrapCB (CB) {
                return function (resOrRrr) {
                    // resolvedCB 调用出现错误时 then 返回的 promise 要 reject 该错误
                    try {
                        let ret = CB(resOrRrr);
                        if (ret instanceof My_Promise) {
                            // 给 CB 返回的 promise 添加回调，
                            // CB 返回的 promise 解析为什么结果，
                            // 就让 then 返回的 promise 也解析为同样的结果
                            ret.then((res) => {
                                resolve(res);
                            }, (err) => {
                                reject(err);
                            });
                        }
                        else {
                            resolve(ret);
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }
            if (typeof resolvedCB === "function") {
                this.resolvedCBList.push( wrapCB(resolvedCB) );
            }
            if (typeof rejectedCB === "function") {
                this.rejectedCBList.push( wrapCB(rejectedCB) );
            }
        });
    }
}



// new My_Promise((resolve, reject) => {
//     console.log(333)
//     throw new Error("555555555");
//     resolve(22);
//     // reject(22);
// })
// .then((res)=> {
//     console.log(res)
// })
// .then(null, (err)=> {
//     console.error(err) // 这里无法捕获
// });


new My_Promise((resolve, reject) => {
    console.log(333)
    resolve(22);
    // reject(22);
})
.then((res) => {
    console.log(res);
    return new My_Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(33);
        }, 2222);
    });
}, (err) => {
    console.error("second err");
    console.error(err);
})
.then((res) => {
    console.log("last");
    console.log(res);
}, (err) => {
    console.error("last err");
    console.error(err);
});

// const pro = new My_Promise((resolve, reject) => {
//   setTimeout(resolve, 1000)
//   setTimeout(reject, 2000)
// })

// pro
//   .then(() => {
//     console.log('2_1')
//     const newPro = new My_Promise((resolve, reject) => {
//       console.log('2_2')
//       setTimeout(reject, 2000)
//     })
//     console.log('2_3')
//     return newPro
//   })
//   .then(
//     () => {
//       console.log('2_4')
//     },
//     () => {
//       console.log('2_5')
//     }
//   )
  
// pro
//   .then(
//     data => {
//       console.log('3_1')
//       throw new Error()
//     },
//     data => {
//       console.log('3_2')
//     }
//   )
//   .then(
//     () => {
//       console.log('3_3')
//     },
//     e => {
//       console.log('3_4')
//     }
//   )
// // 2_1
// // 2_2
// // 2_3
// // 3_1
// // 3_4
// // 2_5
```


## 其他
### 并行数量限制的 promise
1. 来自于一个题目
    ```js
    // JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个。
    // 完善下面代码的Scheduler类，使以下程序能够正常输出：
    class Scheduler {
        add(promiseCreator) { }
        // ...
    }
    
    const timeout = time => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }
    
    const scheduler = new Scheduler()
    
    const addTask = (time,order) => {
        scheduler.add(() => timeout(time).then(()=>console.log(order)))
    }

    addTask(1000, '1')
    addTask(500, '2')
    addTask(300, '3')
    addTask(400, '4')

    // output: 2 3 1 4


    // 整个的完整执行流程：

    // 起始1、2两个任务开始执行
    // 500ms时，2任务执行完毕，输出2，任务3开始执行
    // 800ms时，3任务执行完毕，输出3，任务4开始执行
    // 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
    // 1200ms时，4任务执行完毕，输出4
    ```
2. 先分析一下现有的代码，该整理的整理，该注释的注释
    ```js
    // 一个返回延时 promise 函数，time 到时后执行 promise 的 then 的回调
    const timeout = time => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        }
    })

    class Scheduler {
        add(promiseCreator) { }
        // ...
    }
    
    const scheduler = new Scheduler()
    
    // 调用 add 方法往 scheduler 中添加一个任务
    // 实际添加的是一个函数，该函数调用后返回延时 promise 并调用 then 方法
    const addTask = (time,order) => {
        scheduler.add(() => timeout(time).then(()=>console.log(order)))
    }

    addTask(1000, '1')
    addTask(500, '2')
    addTask(300, '3')
    addTask(400, '4')
    ```
3. 根据要求的执行效果可以看出，任务函数添加后并不会立即调用返回 promise，而是要等待只有一个 pending 任务的时候，才会调用任务函数，开始 promise。而每个 pending 任务 resolve 后，都要调用下一个任务函数添加新的 promise。
4. 所以每次新添加一个任务函数，都要判断当前正在 pending 的数量：
    * 如果不到两个，就直接执行任务函数返回 promise，并且要在后面追加一个 then，用来调用下一个任务函数；
    * 如果是两个，任务函数就要进入队列排队；
5. 初步实现为
    ```js
    class Scheduler {
        constructor () {
            this.queue = [];
            this.currNum = 0;
            this.maxNum = 2;
        }

        add(promiseCreator) {
            if (this.currNum < this.maxNum) {
                let p = promiseCreator();
                this.currNum++;
                p.then(()=>{
                    if (this.queue.length) {
                        let nextP = this.queue.shift()();
                        nextP.then(再从队列里读取一个任务执行)
                        this.currNum--;
                    }
                });
            }
            else {
                this.queue.push(promiseCreator);
            }
        }
    }
    ```
6. 上面的 `再从队列里读取一个任务执行` 没法再写了，其实这部分就是要递归的传递函数
    ```js
    ()=>{
        if (this.queue.length) {
            let nextP = this.queue.shift()();
            nextP.then(再从队列里读取一个任务执行)
            this.currNum--;
        }
    }
    ```
7. 因此把这部分实现为独立的方法，递归调用
    ```js
    add(promiseCreator) {
        if (this.currNum < this.maxNum) {
            let p = promiseCreator();
            this.currNum++;
            p.then(this.runNext.bind(this));
        }
        else {
            this.queue.push(promiseCreator);
        }
    }

    runNext () {
        if (this.queue.length) {
            let nextP = this.queue.shift()();
            nextP.then(this.runNext.bind(this))
            this.currNum--;
        }
    }
    ```
    注意把对象方法作为参数传递时要绑定 `this`。
8. 测试。加入了时间显示
    ```js
    const scheduler = new Scheduler()
    
    const addTask = (time, order) => {
        scheduler.add(() => timeout(time).then(()=>console.log(order, Date.now()-baseTime)))
    }

    let baseTime = Date.now();
    addTask(1000, '1')
    addTask(500, '2')
    addTask(300, '3')
    addTask(400, '4')


    // 2 517
    // 3 827
    // 1 1000
    // 4 1236
    ```
9. 还要一个解法，实现上会简单一些，但是语义上有些复杂。就是每次新添加的任务都先加到队里，然后立刻尝试从队列里取任务运行。这样，如果当前运行的任务不到两个，则队列肯定是空的，因为新加完立刻就可以运行；如果当前运行的任务是两个或以上，则尝试从队列去任务会失败，那就正常排队
    ```js
    add (promiseCreator) {
        this.queue.push(promiseCreator);
        this.runNext();
    }

    runNext () {
        if (this.queue.length && this.currNum < this.maxNum) {
            this.currNum++;
            let p = this.queue.shift()();
            p.then(() => {
                this.currNum--;
                this.runNext()
            });
        }
    }
    ```


## References
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/promise)
