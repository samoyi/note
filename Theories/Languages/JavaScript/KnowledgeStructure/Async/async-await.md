# async-await

## Basic
1. The `async` keyword before a function has two effects:
    1. Makes it always return a promise.
    2. Allows to use await in it.
2. If the code has `return <non-promise>` in it, then JavaScript automatically
wraps it into a resolved promise with that value.
3. The `await` keyword before a promise makes JavaScript wait until that promise
 settles, and then:
    1. If it’s an error, the exception is generated, same as if `throw error`
    were called at that very place.
    2. Otherwise, it returns the result, so we can assign it to a value.
4. 执行顺序
```js
let arr = [];
let asyncReadFile = async ()=>{
    arr.push(1);
    await 22;
    arr.push(2);
    await 33;
    arr.push(3);
};

asyncReadFile()
.then(()=>{
    arr.push(4);
});

arr.push(2233);
setTimeout(()=>{
    console.log(arr); // [ 1, 2233, 2, 3, 4 ]
}, 2000);
```
5. 捕获`reject`的方法
```js
async function foo() {
    try {
        await Promise.reject('404');
    }
    catch(err) {
        console.log(err); // 404
    }
}
foo();
```
或者
```js
async function foo() {
    await Promise.reject('404')
            .catch((err)=>{
                console.log(err);
            });
}
foo();
```


## Misc


## References
[Async/await](https://javascript.info/async-await)
[JavaScript ES 2017: Learn Async/Await by Example](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
