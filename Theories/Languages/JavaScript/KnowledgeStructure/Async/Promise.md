# Promise


## Basic
1. 作为构造函数的参数是一个函数，该函数是一个异步操作。例如异步请求数据。  
函数的两个参数分别为`Promise`用来记录异步操作的成功或失败的函数
```js
let promise = new Promise((resolve, reject)=>{
    // 这里模拟一个耗时两秒的异步数据请求
    setTimeout(()=>{
        let n = Math.random();
        if(n>0.5){ // 模拟请求成功
            // 如果异步操作的结果是成功的，通过resolve函数会记录下该成功，同时可以接
            // 收一个参数
            resolve('200 ' + n);
        }
        else{ // 模拟请求失败
            // 如果异步操作的结果是失败的，通过reject函数会记录下该失败，同时可以接收
            // 一个参数
            reject('404 ' + n);
        }
    }, 2000);
});

// 这里会在异步完成之后立刻获得结果
promise.then(res=>{
        console.log('异步操作刚结束时读取异步操作结果 success: ' + res);
    }, err=>{
        console.log('异步操作刚结束时读取异步操作结果 fail: ' + err);
    });

// 这里会在异步完成两秒之后再通过`promise`实例读取异步操作结果，仍然可以读取成功
setTimeout(()=>{
    promise.then(res=>{
            console.log('之后再次读取异步操作结果 success: ' + res);
        }, err=>{
            console.log('之后再次读取异步操作结果 fail: ' + err);
        });
}, 4000)
```
2. 上面的构造函数会返回一个`Promise`实例，同时会立刻执行其参数中的函数。  
并且，在异步操作执行完成后，根据成功或失败，调用`resolve`或`reject`永久的记录异步
结果。
“永久”的意思，就是不仅在异步操作完成时可以捕获结果，在之后的任何时间，都可以通过该
`promise`实例反复获得异步操作的结果。  
因为这个特性，所以`then`和`catch`其实并不仅仅是`promise`异步操作的回调函数。

3. 因为`then`的回调性质，所以注意代码的执行顺序：
```js
let arr = [];

new Promise((res, rej)=>{
    res(1);
})
.then(res=>{
    arr.push(res);
});

arr.push(2);
console.log(arr); // [ 2 ]

setTimeout(()=>{
    console.log(arr); // [ 2, 1 ]
});
```

## Nested promise
The result of a promise is another promise, the first promise will have the
asynchoronous result of the second one.

```js
let p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
});

let p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
});

p2 // After 3 secondes to get the fail
.then(result => console.log(result))
.catch(error => console.log(error));
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

2. `Promise`的错误会沿着`promise`链向后传播，直到被捕获为止
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
3. 在Node v8.9.1 中虽然在`promise`中的错误不加捕获也不会影响外部代码的继续执行，但已经
给出了警告说明在未来这么做会中断程序的执行。
4. 注意在`promise`中`setTimeout`回调的错误影响到外部，因为`setTimeout`回调函数本身就
不在`promise`。顺便看一下`Promise`的执行顺序
```js
// 第一步，调用构造函数并执行参数中的函数
// 这里直接reject，但通常都是一个异步操作，之后再resolve或reject
let p = new Promise((res, rej)=>{
    console.log(1);
    rej('error');
    // setTimeout(()=>{
    //     rej('error');
    // });
})

// 第二步，执行后续代码。
// 因为上面直接reject了，所以这里输出的是 Promise { <rejected> 'error' }
// 如果上面执行了异步操作，虽然异步操作本身是排在这里的第二步之前的，但异步操作的结果
// 一定是排在第二步之后，所以第二步的输出会是 Promise { <pending> }
console.log(p);

// 第三步，继续执行后续代码。
// 这里输出的是一个新的Promise实例，因为创建该实例中的操作并没有被resolve或reject，所
// 以输出的是 Promise { <pending> }
console.log(p.catch(err=>{

// 第四步，捕获了前面的错误
// 执行catch方法的回调函数。回调函数内一共执行了三个函数：两个console.log和一个
// setTimeout。执行完setTimeout后，回调函数返回。至此，这个Promise链就已经结束。
// 至于setTimeout的回调因为已经是在上述的返回之后了，所以已经没有不属于该promise了，
// 错误就可以被外部捕捉到。
    console.log(4);
    console.log(err);
    setTimeout(()=>{
        console.log(6);
        console.log(sth); // 这样会全局抛出一个错误
    });
}));
```
5. 因为现阶段`promise`中的错误不会暴露到外面，就导致在`Promise`链的最后一环如果出错，
这个错误就不会被发现
```js
new Promise((res, rej)=>{
    rej();
})
.catch(err=>{
    console.log('Promise内部的错误只会影响内部');
    console.log(sth); // 这里会抛出一个错误
    console.log('这个无法显示了');
});
setTimeout(()=>{
    console.log('Promise内部的错误目前(Node v8.9.1)不会影响到外部')
});
```
不过可以通过自己添加的方法来实现抛出最后一环的错误。不过这个方法在Mocha的测试脚本中无效。
```js
Promise.prototype.done = function (onFulfilled, onRejected) {
    this.then(onFulfilled, onRejected)
    .catch(function (reason) {
        // 抛出一个全局错误
        setTimeout(() => { throw reason });
    });
};

new Promise((res, rej)=>{
    rej();
})
.catch(err=>{
    console.log(sth);
})
.done();
```

## `Promise.all()`
作为参数的`promise`自身如果捕获了自身的错误，那么这个错误对于`Promise.all`就是不存在的
```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
.then(result => result)
.catch(e => e.message); // p2的错误在这里就已经被捕获了，Promise.all就不会再捕获到

Promise.all([p1, p2])
.then(result => console.log(result)) // [ 'hello', '报错了' ]
.catch(e => console.log('err in all'));
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
