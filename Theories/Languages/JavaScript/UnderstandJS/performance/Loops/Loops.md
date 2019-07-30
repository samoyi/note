# Loops


## Types of Loops
* 属性遍历：`for-in`
* Function-Based Iteration：`forEach`等
* 基本数组遍历：`for`，`while`，`do-while`


## `for-in`的性能最差
1. Since each iteration through the loop results in a property lookup either on the instance or on a prototype, the `for-in` loop has considerably more overhead per iteration and is therefore slower than the other loops. 
2. For the same number of loop iterations, a `for-in` loop can end up as much as seven times slower than the other loop types. 
    ```js
    let arr = [];
    for (let i=0; i<9999999; i++){
        arr.push(Math.random());
    }
    ```
    ```js
    let len = arr.length;
    console.time('for loop');
    for (let i=0; i<len; i++){
        arr[i];
    }
    console.timeEnd('for loop'); // 7ms左右
    ```
    ```js
    console.time('for-in loop');
    for(let index in arr){
        arr[index]
    }
    console.timeEnd('for-in loop'); // 超过5000ms
    ```
3. For this reason, it’s recommended to avoid the `for-in` loop unless your intent is to iterate over an unknown number of object properties. 
4. 如果要在一个很多属性的对象中查找少数几个属性，则应该考虑使用其他方式来遍历。如下只根据需要的属性来遍历，如果这个对象属性很多的话，这样就可以减少很多不必要的查找：
    ```js
    var props = ["prop1", "prop2"],
        i = 0;
    // 只需要准确访问两个属性，不需要一一遍历
    while (i < props.length){
        process(object[props[i]]);
    }
    ```


## Function-Based Iteration 相比于基本数组遍历也要明显慢
1. Even though function-based iteration represents a more convenient method of iteration, it is also quite a bit slower than loop-based iteration. 
2. The slowdown can be accounted for by the overhead associated with an extra method being called on each array
item. In all cases, function-based iteration takes up to eight times as long as loop-based iteration and therefore isn’t a suitable approach when execution time is a significant concern.

```js
let arr = [];
for (let i=0; i<9999999; i++){
    arr.push(Math.random());
}
```
```js
let len = arr.length;
console.time('for loop');
for (let i=0; i<len; i++){
    arr[i];
}
console.timeEnd('for loop'); // 7ms左右
```
```js
console.time('forEach loop');
arr.forEach(item=>{
    item;
});
console.timeEnd('forEach loop'); // 117ms左右
```


## 三种基本数组遍历方法的性能优化
1. Aside from the `for-in` loop, all other loop types have equivalent performance characteristics such that it’s not useful to try to determine which is fastest. 
2. The choice of loop type should be based on your requirements rather than performance concerns.
3. If loop type doesn’t contribute to loop performance, then what does? There are actually just two factors:
    * Work done per iteration
    * Number of iterations
4. By decreasing either or both of these, you can positively impact the overall performance of the loop.
5. Decreasing the work done per iteration is most effective when the loop has a complexity of O(n). When the loop is more complex than O(n), it is advisable to focus your attention on decreasing the number of iterations.

### Decreasing the work per iteration
1. It stands to reason that if a single pass through a loop takes a long time to execute, then multiple passes through the loop will take even longer. 
2. Limiting the number of expensive operations done in the loop body is a good way to speed up the entire loop.
3. 例如仅仅是避免每次循环的`length`查询，在数组比较大的情况下，就有着显著的性能提升：
    ```js
    let arr = [];
    for (let i=0; i<9999999; i++){
        arr.push(Math.random());
    }

    let len = arr.length;
    console.time('pre-difine');
    for (let i=0; i<len; i++){              // 7ms 左右
    // for (let i=0; i<arr.length; i++){    // 80ms 左右
        arr[i]
    }
    console.timeEnd('pre-difine');
    ```
4. 虽然还提到了反向遍历来把条件检查和 index 递增合二为一来减少遍历时间，但测试中并没有发现差别。甚至在 Firefox 还会更慢一些：
    ```js
    for (let i=len; i--; ){}
    ```

### Decreasing the number of iterations
#### Duff’s Device
可能是由于引擎的优化，Duff’s Device 并没有体现出速度优势，甚至还要稍稍慢一些

```js
let times = 0;

function process() {
    times++;
}

let items = [];
for (let i = 0; i < 999999; i++) {
    items.push(Math.random());
}
```
```js
console.time('Normal for loop');
for (let i = 0, len = items.length; i < len; i++) {
    process(items[i]);
}
console.timeEnd('Normal for loop');

console.log(times);
```
```js
console.time('Duff’s Device');
let mod = items.length % 8;
let i = 0;

while (i < mod) {
    process(items[i++]);
}

let iterations = Math.floor(items.length / 8);

while (iterations--) {

    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
    process(items[i++]);
}
console.timeEnd('Duff’s Device');

console.log(times);
```


## References
* [*High Performance JavaScript* Chapter 4](https://book.douban.com/subject/4183808/)
