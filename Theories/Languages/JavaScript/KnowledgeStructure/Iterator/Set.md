# Set


<!-- TOC -->

- [Set](#set)
    - [1. Description](#1-description)
    - [2. Instance Properties](#2-instance-properties)
        - [`size`](#size)
    - [3. Instance Methods](#3-instance-methods)
        - [3.1 `add(value)`](#31-addvalue)
        - [3.2 `delete(value)`](#32-deletevalue)
        - [3.3 `has(value)`](#33-hasvalue)
        - [3.4 `clear()`](#34-clear)
        - [3.5 与 Map 不同，没有 `get` 方法](#35-与-map-不同没有-get-方法)
        - [3.6 `forEach()`](#36-foreach)
        - [3.7 `keys()` 、`values()`、 `entries()`](#37-keys-values-entries)
    - [4. 应用](#4-应用)
        - [4.1 可迭代数据结构的去重](#41-可迭代数据结构的去重)
        - [4.2 集合操作](#42-集合操作)
    - [5.  WeakSet](#5--weakset)
        - [5.1 和 `Set` 的两个区别](#51-和-set-的两个区别)
            - [5.1.1 弱引用](#511-弱引用)
            - [5.1.2 成员只能是对象](#512-成员只能是对象)
        - [5.2 Properties and Methods](#52-properties-and-methods)
    - [Reference](#reference)

<!-- /TOC -->


## 1. Description
```js
new Set([iterable]);
```
1. `Set` objects are collections of values. You can iterate through the elements of a set **in insertion order**.
2. `Set` 可以接受任何具有 iterable 接口的数据结构作为参数来初始化
    ```js
    new Set([1, 2, 3, 4, 4]);
    new Set(document.querySelectorAll('div'));
    new Set('ababbc');
    ```
3. The `Set` object lets you store **unique** values of any type, whether primitive values or object references.
4. A value in the `Set` may only **occur once**. 只出现一次的相等判断算法，是 Same-value-zero equality
    ```js
    const set = new Set([-0, 0, NaN, NaN]);
    console.log(set); // {0, NaN}
    ```
5. 因此可以使用 `Set` 进行数组去重。或者说，任何实现了迭代器接口的数据结构，都可以使用 `Set` 去重
    ```js
    [...new Set(1, 2, 3, 4, 5, 5, 5, 5)];
    [...new Set('ababbc')].join('');
    ```


## 2. Instance Properties
### `size`
Returns the number of values in the `Set` object.
```js
let set = new Set([1, 2, 3, 1]);
console.log(set.size); // 3
```


## 3. Instance Methods
### 3.1 `add(value)`
Appends value to the `Set` object. Returns the `Set` object.

### 3.2 `delete(value)`
1. removes the specified element from a `Set` object.
2. `true` if an element in the `Set` object has been removed successfully; otherwise `false`.

### 3.3 `has(value)`
Returns a boolean asserting whether an element is present with the given value in the `Set` object or not.

### 3.4 `clear()`
1. Removes all elements from the Set object.
2. return `undefined`.

### 3.5 与 Map 不同，没有 `get` 方法
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

### 3.6 `forEach()`
```js
mySet.forEach(function callback(value, value, set) {
    //your iterator
}[, thisArg])
```
1. There are no keys in `Set` objects. However, the first two arguments are both values contained in the `Set`.
2. Each value is visited once, except in the case when it was deleted and re-added before `forEach()` has finished. 
3. `callback` is not invoked for values deleted before being visited. New values added before `forEach()` has finished
will be visited.
4. `thisArg` is value to use as `this` when executing `callback`.

```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key, value));
// 1 1
// 4 4
// 9 9
```

### 3.7 `keys()` 、`values()`、 `entries()`
1. Returns a new Iterator object that contains the values for each element in the `Set` object in insertion order.
2. 由于 `Set` 结构没有键名，只有键值，所以 `keys` 方法和 `values` 方法的行为完全一致。
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
3. Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 `values` 方法。
    ```js
    Set.prototype[Symbol.iterator] === Set.prototype.values
    // true
    ```
    这意味着，可以省略 `values` 方法，直接用 `for...of` 遍历 `Set`
    ```js
    let set = new Set(['red', 'green', 'blue']);

    for (let x of set) {
    console.log(x);
    }
    // red
    // green
    // blue
    ```


## 4. 应用
### 4.1 可迭代数据结构的去重

### 4.2 集合操作
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

let union = new Set([...a, ...b]);
console.log(union); // Set(4) {1, 2, 3, 4}

let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); // Set(2) {2, 3}

let difference = new Set([...a].filter(x => !b.has(x)));
console.log(difference);  // Set(1) {1}
```


## 5.  WeakSet
### 5.1 和 `Set` 的两个区别
#### 5.1.1 弱引用
1. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
2. 这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为 0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。
3. WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。
4. 因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失，不会存在内存泄露的问题。
5. 由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。
6. 另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

#### 5.1.2 成员只能是对象
WeakSet 的成员只能是引用，而不能是其他类型的值。因为基础类型的值并不存在弱引用。

### 5.2 Properties and Methods
和 `Set` 中的相比，实例方法只有 `add`、`delete` 和 `has`，没有 `size` 属性


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/set-map)
