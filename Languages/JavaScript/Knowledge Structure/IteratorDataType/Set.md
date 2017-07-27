# Set


## Description
```
new Set([iterable]);
```
* The `Set` object lets you store unique values of any type, whether primitive values or object references.
* Set objects are collections of values. You can iterate through the elements of a set **in insertion order**.
* A value in the Set may only occur once. 只出现一次的相等判断算法，既不是 `===` 的 Strict Equality，也不是 `Object.is` 的 SameValue。
    ```
    const set = new Set([-0, 0, NaN, NaN]);
    console.log(set); // {0, NaN}
    // 可以看出来在 Set 中，既认为 -0 和 0 相等（Strict Equality），也认为 NaN 和 NaN 相等（SameValue）
    ```


## Instance Properties
#### `size`
Rturns the number of values in the Set object.

## Instance Methods
### `add(value)`
* Returns the Set object.

### `clear()`
* Removes all elements from the Set object.
* return `undefined`

### `delete(value)`
* removes the specified element from a Set object.
* true if an element in the Set object has been removed successfully; otherwise false.

### `entries()`
* Returns a new Iterator object that contains an array of `[value, value]` for each element in the Set object
* In insertion order
* This is kept similar to the Map object, so that each entry has the same value for its key and value here.

### `forEach()`

### `has(value)`

### `keys()` 、`values()`、 `[@@iterator]()`
Returns a new Iterator object that contains the values for each element in the Set object in insertion order.


## WeakSet

### The main differences to the Set object are:
* In contrast to Sets, WeakSets are collections of objects only and not of arbitrary values of any type.
* The WeakSet is weak: References to objects in the collection are held weakly. If there is no other reference to an object stored in the WeakSet, they can be garbage collected. That also means that there is no list of current objects stored in the collection. WeakSets are not enumerable.

### Properties and Methods
和上面Set中的相比，只有 `add`、`delete` 和 `has`





## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
