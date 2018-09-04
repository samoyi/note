# Promise

## Basic
### 给你一个承诺（promise）：
1. 你不用管，我帮你做这个事情：异步操作
2. 到时候不管成功或失败，都会告诉你情况：异步操作成功时调用`resolve`，结果作为参数；异
步操作失败时调用`reject`，错误作为参数。
3. 你记住我这个承诺，等待我的消息：获得 Promise 实例，通过`then`和`catch`监听成
功或失败。

### 基本用法
1. 作为构造函数的参数是一个函数，记为`executor`，承诺执行的事情。
2. `executor`有两个参数，两个参数都是函数。记为`resolve`和`reject`。成功或失败时用这
两个函数通知你。
3. `executor`内部会进行异步操作。
4. 调用构造函数返回一个 Promise 实例，记为`promise`。拿上我的承诺。
5. 为了监听异步操作的结果，实例需要调用`then`方法和`catch`方法。用这两个方法接受我的成
功或失败通知。
6. `then`方法接受参数`onFulfilled`，以及一个可选的参数`onRejected`。`catch`方法
接收一个参数`onRejected`。这三个参数都是函数。成功的话你用成功的结果做你想做的，失败的
话你用失败信息进行处理。
7. 如果`executor`内部的异步操作成功，需要调用`resolve`通知`promise`。`resolve`
的参数应当设为异步操作的结果。当该方法被调用时，`onFulfilled`会被自动调用，参数和
`resolve`的参数相同。
8. 如果`executor`内部的异步操作失败，需要调用`reject`通知`promise`。`reject`
的参数应当设为错误信息。当该方法被调用时，第一个`onRejected`会被自动调用，参数和
`reject`的参数相同。
9. 因为异步操作结果会被永久保存，所以之后依然可以从实例中读取结果。

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


## Nested promise
1. The result of a promise is another promise, the first promise will have the
asynchoronous result of the second one.
```js
let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
});

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
});

p2 // After 3 secondes to get the fail
.then(result => console.log('fulfilled:' + result))
.catch(error => console.log('rejected:' + error)); // rejected:Error: fail
```
2. 最外部 promise 的结果是 fullfilled 还是 rejected，并不取决于最外部 promise 里调用
的是`resolve`还是`reject`。比如上面例子中虽然最外部 promise 的调用了`resolve`，但其结
果还是 rejected。而是，只要其中有一个是调用了`reject`，最外部 promise 的结果就是
rejected，否则就是fullfilled。而且，只要有`reject`被调用，则最外层 promise 立刻就会
rejected。例如下面的例子，`p2`在两秒后调用了`reject`了，所以`p3`立刻就 rejected。
```js
let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve('ok'), 3000)
});

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(p1), 2000)
});

let p3 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p2), 1000)
});

p3 // After 2 secondes to get the fail
.then(result => console.log('fulfilled:' + result))
.catch(error => console.log('rejected:' + error)); // rejected:[object Promise]
```


## Chaining promise
`then`返回一个新的`promise`实例，则后续可以再接一个`then`来获取新`promise`异步操作的
结果
```js
new Promise((resolve, reject)=>{
    // The first async operation
    setTimeout(()=>{
        if(Math.random()>0.5){
            resolve(200);
        }
        else{
            reject(404);
        }
    }, 3000);
})
.then(
    (res)=>{
        // If the result of the first async is resolved, returns a new promise
        console.log(res) // 200
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(Math.random()>0.5){
                    resolve(201);
                }
                else{
                    reject(500);
                }
            }, 3000);
        });
    },
    // If the result of the first async is rejected, log err
    (err)=>{
        console.log(err) // 404
    }
)
.then(
    // Get the result of the second promise async
    // If the result of the first async is rejected, both res and err here are
    // undefined
    (res)=>{res && console.log(res)}, // 201
    (err)=>{err && console.log(err)} // 500
);
```


## 捕获错误
1. 不管是`then`方法的第二个参数还是`catch`方法，都不仅能捕获`promise`中`reject`记录
的错误，还能捕获到`resolve`和`reject`调用之前发生的其他错误。
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
2. 但`resolve`和`reject`调用之后发生的错误不会被捕获，不过仍然会中断执行
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
3. 会被捕获的错误（不管是`reject`里的还是，`resolve`和`reject`调用之前的），会沿着
`promise`链向后传播，直到被捕获为止
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
因为这个特性，像上面的例子一样，前面的`then`方法不用写第二个参数，统一在最后用`catch`
来捕获错误的写法更加和谐。
4. 在 Node v8.9.1 中虽然在`promise`中的能够被捕获的错误不加捕获也不会影响外部代码的继
续执行，但已经给出了警告说明在未来这么做会中断程序的执行。
5. 注意在`promise`中`setTimeout`回调的错误影响到外部，因为`setTimeout`回调函数本身就
不在`promise`里。
    ```js
    new Promise(function (resolve, reject) {
        setTimeout(()=>{
            resolve(22);
            throw new Error(); // 会被抛出，不会被捕获
        }, 200);
    })
    .then(res=>{
        console.log(res); // 22
    })
    .catch(err=>{
        console.log(err); // 不会被捕获
    });
    ```
6. 因为现阶段（2018.8）`promise`中的未被捕获的错误不一定会暴露到外面（Chrome 抛出但
FF 不会）。就导致在`Promise`链的最后一环如果出错，这个错误可能就不会被发现：
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

不过可以通过自己添加的方法来实现抛出最后一环的错误。不过这个方法在Mocha的测试脚本中无效。
    ```js
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.then(onFulfilled, onRejected)
        .catch(function (reason) {
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

比较特殊的是，`Promise {<pending>}`在`3`之前输出，即下面这种情况：
```js
let p = new Promise((res, rej)=>{
    res();
});

console.log(p.then(res=>{
    console.log(6);
}));
```
先输出`Promise {<pending>}`后输出`6`。不懂原因  

这和一般的回调输出顺序是相反的：
```js
let obj = {
    foo(fn){
        fn();
    },
};
console.log(obj.foo(res=>{
    console.log(5)
}));
```
先是`5`才是`undefined`


## `Promise.all(iterable)`
1. `Promise.all`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
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
    ```
2. 如果参数可遍历对象的的某项不是 Promise 实例，就会先调用`Promise.resolve`方法，将参
数转为 Promise 实例，再进一步处理。    
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
3. 如果其中一个实例 reject 了，那不用等待其他 实例处理，`Promise.all`会立刻 rejcet。
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
4. 作为参数的`promise`自身如果捕获了自身的错误，那么这个错误对于`Promise.all`就是不存
在的，而之前捕获错误函数的返回值将作为`Promise.all`正确 resolve 的结果之一。
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
可以用来给某个异步操作设定一个时限
```js
const p = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
]);
p.then(response => console.log(response));
p.catch(error => console.log(error));
```
如果第一个异步操作 fetch 五秒之内没有反应，则第二个异步操作执行并作为总体的结果


## Promise.resolve & Promise.reject
<mark>没看懂有什么用处</mark>


## 其他一些自定义的有用的方法
自定义`finally`方法
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
