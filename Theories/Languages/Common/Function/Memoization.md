# Memoization

### 先看看下面两种计算`fibonacci(50)`方法的巨大差异
```js
let count = 0;

console.time('normal fibonacci');
function fibonacci(n) {
    count++;
    if (n == 0 || n == 1) {
        return n;
    } 
    else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}
fibonacci(50);
console.timeEnd('normal fibonacci');
console.log('process memory usage', process.memoryUsage());
console.log('final count', count);
// normal fibonacci: 1278799.905 ms
// process memory usage {
//     rss: 27918336,
//     heapTotal: 15450112,
//     heapUsed: 4314096,
//     external: 8680
// }
// final count 40730022147
```
```js
let count = 0;
console.time('memoization fibonacci');
let fibonacci = (function () {
    let memo = {};

    function f(n) {
        count++;
        let value;
        if (n in memo) {
            value = memo[n];
        } else {
            if (n == 0 || n == 1) {
                value = n;
            } else {
                value = f(n - 1) + f(n - 2);
            }
            memo[n] = value;
        }
    }
    return f;
})();
fibonacci(50);
console.timeEnd('memoization fibonacci');
console.log('process memory usage', process.memoryUsage());
console.log('final count', count);
// memoization fibonacci: 0.239 ms
// process memory usage {
//     rss: 19673088,
//     heapTotal: 6537216,
//     heapUsed: 3934600,
//     external: 8680
// }
// final count 99
```


## 处理多个参数
如果需要处理多个参数，那么就是多个参数结合起来决定一个计算结果
```js
let count = 0;

let fibonacci = (function() {
    let memo = {};
    function f(n, x) {
        count++;
        let value;
        memo[x] = memo[x] || {};
        if (x in memo && n in memo[x]) {
            value = memo[x][n];
        } 
        else {
            if (n == 0 || n == 1) {
                value = n;
            } 
            else {
                value = f(n - 1, x) + f(n - 2, x);
            }
            memo[x][n] = value;
        }
        return value;
    }
    return f;
})();

console.time('x fibonacci');
fibonacci(50, 'x');
console.timeEnd('x fibonacci');
console.log('x memory usage', process.memoryUsage());
console.log('x count', count);
// x fibonacci: 0.148ms
// x memory usage { rss: 21659648,
//   heapTotal: 7159808,
//   heapUsed: 4481632,
//   external: 8236 }
// x count 99
```


## 自动 memoization
```js
function memoize(fundamental, cache){
    cache = cache || {};
    var shell = function(arg){
        if (!cache.hasOwnProperty(arg)){
            cache[arg] = fundamental(arg);
        }
        return cache[arg];
    };
    return shell;
}


const len = 100;
let count = 0;

let arr = [];
for (let i=0; i<len; i++){
    arr[i] = Math.floor(Math.random() * 10);
}

function square(n){
    count++;
    return n * n;
}
let m_square = memoize(square);
for (let i=0; i<len; i++){
    // square(arr[i]); // count 是 100
    m_square(arr[i]); // count 最多是 10
}

console.log(count);
```

Generic memoization of this type is less optimal that manually updating the algorithm for a given function because the `memoize()` function caches the result of a function call with specific arguments. Recursive calls, therefore, are saved only when the shell function is called multiple times with the same arguments. For this reason, it’s better to manually implement memoization in those functions that have significant performance issues rather than apply a generic memoization solution. 不懂