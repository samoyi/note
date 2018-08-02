# Set


## Description
```js
new Set([iterable]);
```
* The `Set` object lets you store unique values of any type, whether primitive
values or object references.
* Set objects are collections of values. You can iterate through the elements of
 a set **in insertion order**.
* A value in the Set may only occur once. 只出现一次的相等判断算法，是
Same-value-zero equality
    ```js
    const set = new Set([-0, 0, NaN, NaN]);
    console.log(set); // {0, NaN}
    ```


## Instance Properties
### `size`
Returns the number of values in the Set object.
```js
let set = new Set([1, 2, 3, 1]);
console.log(set.size); // 3
```


## Instance Methods
### `add(value)`
* Returns the Set object.

### `delete(value)`
* removes the specified element from a Set object.
* `true` if an element in the Set object has been removed successfully;
otherwise `false`.

### `has(value)`

### `clear()`
* Removes all elements from the Set object.
* return `undefined`

### 与 Map 不同，没有`get`方法
也不能通过数字索引查询项。只能通过遍历方法获得。

```js
let set = new Set();
set = set.add(1).add(2).add(3);
console.log(set); // Set(3) {1, 2, 3}
console.log(set.has(2)); // true
console.log(set.delete(2)); // true
console.log(set.has(2)); // false
console.log(set); // Set(2) {1, 3}
console.log(set.clear()); // undefined;
console.log(set); // Set(0) {}
```

### `forEach()`
```js
mySet.forEach(function callback(value, value, set) {
    //your iterator
}[, thisArg])
```
* There are no keys in Set objects. However, the first two arguments are both
values contained in the Set
* Each value is visited once, except in the case when it was deleted and
re-added before `forEach()` has finished. `callback` is not invoked for values
deleted before being visited. New values added before `forEach()` has finished
will be visited.

```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key, value));
// 1 1
// 4 4
// 9 9
```

### `keys()` 、`values()`、 `entries()`
Returns a new Iterator object that contains the values for each element in the
`Set` object in insertion order.

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
    console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
    console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
    console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```


## WeakSet
### The main differences to the `Set` object are:
#### 成员只能是对象
WeakSet 的成员只能是引用，而不能是其他类型的值。基础类型的值并不能实现弱引用。

#### 弱引用
1. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，
如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象
还存在于 WeakSet 之中。
2. 这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这
块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。
WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时
存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用
就会自动消失，不会存在内存泄露的问题。
3. 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于
WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样
的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

### Properties and Methods
和上面 Set 中的相比，只有 `add`、`delete` 和 `has`


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
