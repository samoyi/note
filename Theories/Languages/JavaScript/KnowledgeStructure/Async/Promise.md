# Promise

## Basic
作为构造函数的参数是一个函数，该函数是一个异步操作。例如异步请求数据。  
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

上面的构造函数会返回一个`Promise`实例，同时会立刻执行其参数中的函数。  
并且，在异步操作执行完成后，根据成功或失败，调用`resolve`或`reject`永久的记录异步
结果。
“永久”的意思，就是不仅在异步操作完成时可以捕获结果，在之后的任何时间，都可以通过该
`promise`实例反复获得异步操作的结果。  
因为这个特性，所以`then`和`catch`其实并不仅仅是`promise`异步操作的回调函数。


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

##

## References
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/promise)
