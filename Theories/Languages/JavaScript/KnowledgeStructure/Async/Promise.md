# Promise


<!-- TOC -->

- [Promise](#promise)
    - [Basic](#basic)
        - [给你一个承诺（promise）：](#给你一个承诺promise)
        - [基本用法](#基本用法)
    - [对结果不可变的承诺](#对结果不可变的承诺)
    - [基本实例方法](#基本实例方法)
        - [`Promise.prototype.then()`](#promiseprototypethen)
            - [链式调用](#链式调用)
        - [`Promise.prototype.catch()`](#promiseprototypecatch)
        - [`Promise.prototype.finally()`](#promiseprototypefinally)
    - [Nested promise](#nested-promise)
        - [如果嵌套实例提前 resolve 了](#如果嵌套实例提前-resolve-了)
        - [如果嵌套实例提前 reject 了](#如果嵌套实例提前-reject-了)
        - [如果被嵌套实例提前 resolve 了](#如果被嵌套实例提前-resolve-了)
        - [如果被嵌套实例提前 reject 了](#如果被嵌套实例提前-reject-了)
    - [捕获错误](#捕获错误)
    - [Promise 的执行顺序](#promise-的执行顺序)
    - [`Promise.all(iterable)`](#promisealliterable)
    - [`Promise.race()`](#promiserace)
    - [`Promise.resolve` & `Promise.reject`](#promiseresolve--promisereject)
    - [其他一些自定义的有用的方法](#其他一些自定义的有用的方法)
    - [References](#references)

<!-- /TOC -->


## Basic
### 给你一个承诺（promise）：
1. 你不用管，我帮你做这个事情：异步操作。
2. 到时候不管成功或失败，都会告诉你情况：异步操作成功时调用 `resolve`，结果作为参数；异步操作失败时调用 `reject`，错误作为参数。
3. 你记住我这个承诺，等待我的消息：获得 Promise 实例，通过 `then` 和 `catch` 监听成功或失败。

### 基本用法
1. 作为构造函数的参数是一个函数，记为 `executor`。`executor` 是给出承诺并负责异步操作的对象；
2. 调用构造函数返回一个 Promise 实例，记为 `promise`。使用该实例的是接受承诺并使用该异步操作的用户。
3. `executor` 内部会进行异步操作。
4. `executor` 有两个参数，两个参数都是函数。记为 `resolve` 和 `reject`。成功或失败时用 `executor` 会分别调用这两个函数通知使用 promise 实例的用户。
5. `executor` 内部会用 `resolve` 和 `reject` 发出通知，而用户也需要监听和接受通知。为了监听异步操作的结果，实例需要调用 `then` 方法和 `catch` 方法。
6. 当然用户是在拿到实例后直接调用这两个方法的，所以这两个方法本身并不会直接得到异步的结果。同样，这两个方法也是为了接受用户提供的两个函数，在异步成功或失败后，promise 会分别调动用户提供的两个函数传递异步结果。
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


## 基本实例方法
### `Promise.prototype.then()`
#### 链式调用
1. `then` 方法返回的是一个新的 `Promise` 实例（不是原来那个 `Promise` 实例）。
2. 返回的逻辑是；如果 `then` 方法的回调内部抛出了错误，则 `then` 方法返回的是 `Promise.reject(该错误实例)`；否则，返回的是 `Promise.resolve(回调返回值)`
    ```js
    let p0 = new Promise((resolve, reject)=>{
        resolve('resolved');
    });

    let p1 = p0.then(
        res=>{
            return 22;
        },
    );
    // 回调返回 22，所以 p1 是 Promise.resolve(22)
    p1.then(res=>{
        console.log(res); // 22
    })

    let p2 = p1.then(res=>{
        return new Error('error1');
    });
    // 回调返回错误实例 Error('error1') ，所以 p2 是 Promise.resolve(Error('error1'))
    // 注意，p2 仍是被 resolve 了。因为这是返回错误，而不是抛出错误。
    p2.then(res=>{
        console.log(res.message); // "error1"
    })

    let p3 = p2.then(res=>{
        throw new Error('error2');
    });
    // 回调抛出了错误，所以 p3 是 Promise.reject(Error('error2'))
    p3.catch(err=>{
        console.log(err.message); // "error2"
    })
    ```
3. 因此可以采用链式写法，即 `then` 方法后面再调用另一个 `then` 方法。同时，因为 `catch` 方法是 `then(null, rejection)` 方法的别名，所以后面依然可以继续链
    ```js
    new Promise((resolve, reject)=>{
        resolve('resolved');
    })
    .then(res=>{
            console.log(res); // "resolved"
            return 22;
    })
    .then(res=>{
        console.log(res); // 22
        throw new Error('error!')
    })
    .catch(err=>{
        console.log(err.message); // "error!"
        return 33;
    })
    .then(res=>{
        console.log(res); // 33
    });
    ```
4. 上面例子中返回的 `Promise` 实例因为都是可以立即 resolve 或 reject 的，所以不能明显的感受到异步的感觉。把它们分开写并插入一些同步代码，就可以看出来异步
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
    ```
5. 不过更实际的使用情况是，在回调里返回就是一个异步操作
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
        console.log(res); // 立刻输出 "resolved"
        return resolved(2000, 22);
    })
    .then(res=>{
        console.log(res); // 两秒钟后输出 22
        return rejected(2000, new Error('error!'));
    })
    .catch(err=>{
        console.log(err.message); // 再两秒钟后输出 "error!"
        return resolved(2000, 33);
    })
    .then(res=>{
        console.log(res); // 再两秒钟后输出 33
    });
    ```

### `Promise.prototype.catch()`
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

### `Promise.prototype.finally()`
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
1. 不管是 `then` 方法的第二个参数还是 `catch` 方法，都不仅能捕获 `promise` 中 `reject` 记录的错误，还能捕获到 `resolve` 和 `reject` 调用之前发生的其他错误。
    ```js
    new Promise((resolve, reject)=>{
        throw new Error('test1');
    })
    .then(
        (res)=>{console.log(res)},
        (err)=>{console.log(err.message)} // test1
    )

    new Promise((resolve, reject)=>{
        throw new Error('test2');
    })
    .catch(
        (err)=>{console.log(err.message)} // test2
    )

    new Promise((resolve, reject)=>{
        throw new Error('test3');
        resolve();
    })
    .catch(
        (err)=>{console.log(err.message)} // test3
    )

    new Promise((resolve, reject)=>{
        resolve();
        throw new Error('test4');
    })
    .catch(
        (err)=>{console.log(err.message)} // 没有捕获
    )

    new Promise((resolve, reject)=>{
        reject('rejected');
        throw new Error('test5');
    })
    .catch(
        (err)=>{console.log(err)} // rejected
    )
    ```
2. 但 `resolve` 和 `reject` 调用之后，并不是像 `return` 一样后面的代码就不执行。后面仍然会执行，只不过其中的错误既不会被捕获也不会被抛出。但是，仍然会中断执行。
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


## `Promise.resolve` & `Promise.reject`
将一个非 promise 值转换为 promise 实例，并立即 resolve/reject
```js
console.log(Promise.resolve(111)); // Promise {<resolved>: 111}
console.log(Promise.reject(111)); // Promise {<rejected>: 111}
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


## References
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/promise)
