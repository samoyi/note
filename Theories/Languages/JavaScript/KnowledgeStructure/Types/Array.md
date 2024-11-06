# Array


<!-- TOC -->

- [Array](#array)
    - [JS 数组区别于其他语言数组的特性](#js-数组区别于其他语言数组的特性)
    - [`length`](#length)
    - [创建](#创建)
        - [`Array` constructor](#array-constructor)
        - [Array literal notation](#array-literal-notation)
        - [The third way to create an array is by using ES6 `Array.of()`](#the-third-way-to-create-an-array-is-by-using-es6-arrayof)
    - [数组是特殊的对象](#数组是特殊的对象)
    - [Sparse Arrays](#sparse-arrays)
        - [读取和设置](#读取和设置)
    - [Detecting Arrays](#detecting-arrays)
        - [`instanceof`](#instanceof)
        - [`Array.isArray()`](#arrayisarray)
    - [转换方法](#转换方法)
        - [将数组转换为其他数据类型](#将数组转换为其他数据类型)
            - [`join()`](#join)
        - [将其他数据类型转换为数组](#将其他数据类型转换为数组)
            - [`Array.from()`](#arrayfrom)
    - [Stack Methods](#stack-methods)
        - [`push()`](#push)
        - [`pop()`](#pop)
    - [Queue Methods](#queue-methods)
        - [`shift()`](#shift)
        - [`unshift()`](#unshift)
    - [Reordering Methods](#reordering-methods)
        - [`reverse()`](#reverse)
        - [`sort()`](#sort)
    - [Manipulation Methods](#manipulation-methods)
        - [concat()](#concat)
        - [`flat(depth)`](#flatdepth)
            - [自己实现扁平到底的 flat 方法](#自己实现扁平到底的-flat-方法)
        - [`slice()`](#slice)
        - [`splice()`](#splice)
            - [删除](#删除)
            - [插入](#插入)
        - [替换](#替换)
        - [返回值](#返回值)
        - [`copyWithin()`](#copywithin)
        - [`fill()`](#fill)
    - [Location and Search Methods](#location-and-search-methods)
        - [`indexOf()` and `lastIndexOf()`](#indexof-and-lastindexof)
        - [`find()` 和 `findIndex()` 查找符合条件的第一个成员或者其位置](#find-和-findindex-查找符合条件的第一个成员或者其位置)
        - [`includes()`](#includes)
    - [Iterating Arrays](#iterating-arrays)
        - [ES5 遍历方法](#es5-遍历方法)
        - [`entries()`、`keys()` 和 `values()`](#entrieskeys-和-values)
    - [Reduction Methods](#reduction-methods)
        - [`callback`](#callback)
        - [`initialValue`](#initialvalue)
        - [自己实现加深理解](#自己实现加深理解)
    - [Array-Like](#array-like)

<!-- /TOC -->


## JS 数组区别于其他语言数组的特性
* 详细解释见 `../../UnderstandJS/Array/Performance.md`。
* JavaScript arrays are general-purpose objects with numeric properties and a special `length` property.
* Array elements can be any JavaScript value.
* Arrays can grow or shrink dynamically and can be sparse.
* JavaScript implementations perform lots of optimizations so that typical uses of JavaScript arrays are very fast. 
* Arrays can contain a maximum of 4,294,967,295（2^32）items。Trying to create an array with an initial size approaching this maximum may cause a long-running script error.


## `length`
1. 需要注意的两点容易引起误会的地方。
2. 一个是，对于稀疏数组，稀疏的项也是算作 `length` 的
    ```js
    let arr = [];
    arr[3] = 333;
    console.log( arr.length ); // 4
    console.log( arr ); // [empty × 3, 333]
    ```
3. 另一个是，`delete` 用于数组时，只是清空数组项的值，而不是删除数组项（`splice` 才会删除数组项）
    ```js
    let arr = [1, 2, 3];
    console.log( arr.length ); // 3

    delete arr[1];
    console.log(arr[2]); // 3
    console.log(arr); // [1, empty, 3]
    console.log( arr.length ); // 3

    arr[1] = 2;
    console.log(arr); // [1, 2, 3]
    arr.splice(1, 1);
    console.log(arr[2]); // undefined
    console.log(arr[1]); // 3
    console.log(arr); // [1, 3]
    console.log( arr.length ); // 2
    ```


## 创建
Arrays can be created in three basic ways.

### `Array` constructor
1. The first is to use the `Array` constructor.
1. If you know the number of items that will be in the array, you can pass the count into the constructor, and the `length` property will automatically be created with that value.   
2. The Array constructor can also be passed items that should be included in the array.
    ```js
    var colors = new Array("red","blue","green");
    ```
3. It’s possible to omit the new operator when using the Array constructor.

### Array literal notation
1. The second way to create an array is by using array literal notation.
2. The values in an array literal need not be constants; they may be arbitrary expressions.
3. 因为数组是特殊的对象，所以使用对象的写法也是正确的    
    ```js
    arr["2"] = 666;
    ```  
    正如对象也可以使用数组的中括号写法一样。最终这两者的中括号的中的数字都会被转换成字符串数字的形式作为属性名。所以其实 `arr['2']` 才是正规的写法，而常用的 `arr[2]` 只是针对数组提供的一种方便写法。数组作为对象，它的键名本来就是字符串而不是数字。
4. 还可以使用扩展运算符来构建字面量数组
    1. 任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组。
    ```js
    function foo(){
        let args = [...arguments];
        console.log( Array.isArray(arguments) ); // false
        console.log( Array.isArray(args) ); // true
    }
    ```
    2. 对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数
    组，只能使用 `Array.from`：
    ```js
    let arrayLike = {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        length: 3,
    };

    console.log(Array.from(arrayLike)); // ["a", "b", "c"]
    [...arrayLike]; // Uncaught TypeError: arrayLike is not iterable
    ```
5. As with objects, the `Array` constructor isn’t called when an array is created using array literal notation. 所以还是应该优先使用字面量形式。

### The third way to create an array is by using ES6 `Array.of()`
针对构造函数创建数组时的不一致性，即 `Array(5)` 表示五项数组，而 `Array(5, 6)` 表示两项数组。ES6 中使用该方法进行了统一，其参数永远是数组项
```js
Array.of(5, 6); // [5, 6]
```


## 数组是特殊的对象
1. 原理见 `../../UnderstandJS/Array/Performance.md`。
2. All indexes are property names, but only property names that are integers between 0 and 2^32 –1 are indexes. 
3. All arrays are objects, and you can create properties of any name on them. If you use properties that are array indexes, however, arrays have the special behavior of updating their `length` property as needed.
4. Note that you can index an array using numbers that are negative or that are not integers. When you do this, the number is converted to a string, and that string is used as the property name.
5. The fact that array indexes are simply a special type of object property name means that JavaScript arrays have no notion of an “out of bounds” error. When you try to query a nonexistent property of any object, you don’t get an error, you simply get `undefined`. This is just as true for arrays as it is for objects.
6. Since arrays are objects, they can inherit elements from their prototype. In ECMAScript 5, they can even have array elements defined by getter and setter methods. 
7. If an array does inherit elements or use getters and setters for elements, you should expect it to use a nonoptimized code path: the time to access an element of such an array would be similar to regular object property lookup times
    ```js
    let arr = [];
    Object.defineProperty(arr, 0, {
        get: function(){
            return 2233;
        },
        set: function(newValue){
            arr[1] = 666;
        }
    });

    console.log(arr); // []
    console.log(arr[0]); // 2233
    arr[0] = 123;
    console.log(arr); // [1: 666]
    ```


## Sparse Arrays
1. 原理见 `../../UnderstandJS/Array/Performance.md`。
2. 测试
    ```js
    let arr1 = [];
    arr1[0] = "a";
    arr1[2] = "c";

    let arr2 = ["a", undefined, "c"]; // 这个并不是稀疏数组

    console.log(arr1); // ["a", empty, "c"]
    console.log(arr2); // ["a", undefined, "c"]

    console.log(arr1.length); // 3
    console.log(arr2.length); // 3

    console.log(arr1[1] === arr2[1]); // true

    console.log(1 in arr1); // false
    console.log(1 in arr2); // true

    delete arr2[1];
    console.log(1 in arr2); // false
    ```
3. A sparse array is one in which the elements do not have contiguous indexes starting at 0.
4. Sparse arrays can be created with the `Array()` constructor or simply by assigning to an array index larger than the current array length. You can also make an array sparse with the `delete` operator.
5. Arrays that are sufficiently sparse are typically implemented in a slower, more memory-efficient way than dense arrays are, and looking up elements in such an array will take about as much time as regular object property lookup.

### 读取和设置
1. 如果设置某个值的索引超过了数组现有项数，数组就会自动增加到该索引加 1 的长度.
2. `length` property is that it’s not read-only. By setting the `length` property, you can easily remove items from or add items to the end of the array.


## Detecting Arrays
### `instanceof`
1. When dealing with a single web page, and therefore a single global scope, the `instanceof` operator works well. The one problem with `instanceof` is that it assumes a single global execution context.
2. If you are dealing with multiple frames in a web page, you’re really dealing with two distinct global execution contexts and therefore two versions of the `Array` constructor. 
3. If you were to pass an array from one frame into a second frame, that array has a different
constructor function than an array created natively in the second frame.

### `Array.isArray()`  
The purpose of this method is to definitively determine if a given value is an array regardless of the global execution context in which it was created.


## 转换方法
### 将数组转换为其他数据类型
#### `join()`
1. 使用不同的分隔符来构建输出字符串，该方法的参数即作为分隔符的字符串。如果不给 `join()` 方法传入任何值，或者传入 `undefined`，则使用逗号作为分隔符。
2. 如果数组中的某一项的值是 `null` 或者 `undefined`，那么该值在以上方法返回的结果中以空字符串表示。

### 将其他数据类型转换为数组
#### `Array.from()`
1. 将类数组对象（array-like object）和可遍历（iterable）的对象转换为数组。
2. `Array.from` 还可以接受第二个参数，作用类似于数组的 `map` 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
    ```js
    Array.from(arrayLike, x => x * x);
    ```
3. 使用这个方法还可以创建数组
    ```js
    Array.from({ length: 10 }, a => Math.random() );
    ```
4. 对字符串使用该方法并取得返回数组的长度，可以避免 JavaScript 将大于 `\uFFFF` 的 Unicode 字符，算作两个字符的 bug。


## Stack Methods
ECMAScript arrays provide `push()` and `pop()` specifically to allow stack-like behavior.

### `push()`
The `push()` method accepts any number of arguments and adds them to the end of the array, returning the array’s new `length`.

### `pop()`
The `pop()` method, on the other hand, removes the last item in the array, decrements the array’s `length`, and returns that item.


## Queue Methods
### `shift()`
Removes the first item in the array and returns it, decrementing the `length` of the array by one.

### `unshift()`
Adds any number of items to the front of an array and returns the new array `length`.


## Reordering Methods
Both `reverse()` and `sort()` return a reference to the array on which they were applied.

### `reverse()`

### `sort()`
1. 在默认情况下，`sort()`方法按升序排列数组项。为了实现排序，`sort()` 方法会调用每个数 组项的 `toString()` 方法，然后比较得到的字符串，以确定如何排序。即使数组中的每一项都是数值，`sort()` 方法比较的也是字符串
    ```js
    let values = [0, 1, 5, 10, 15];
    values.sort();
    console.log(values); // [0, 1, 10, 15, 5]
    ```
2. 这种排序方式在很多情况下都不是最佳方案。因此 `sort()` 方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面。
3. 比较函数接收两个参数，并返回一个数字。如果返回负数，则第一个参数项会被排到第二个参数项之前；如果返回一个正数，则第一个参数项应该位于第二个之后；如果返回`0`，则两个参数项位置不变
    ```js
    let values = [0, 1, 5, 10, 15];

    values.sort((x, y)=>{
        if (x < y){ // 如果 x 比 y 小
            return -1; // x 排在 y 前面
        }
        else if (x > y){ // 如果 x 比 y 大
            return 1; // x 排在 y 后面
        }
        else { // 如果 x 和 y 相等
            return 0; // 位置不变
        }
    });

    console.log(values); // [0, 1, 5, 10, 15]
    ```
    可以简写为
    ```js
    values.sort((x, y)=>{
        return x - y;
    });
    ```
4. 因此可以自己任意定义排序规则
    ```js
    let values = ['Hime', 'Hina', 'KizunaAI', 'Yomemi', 'Mei'];

    values.sort((x, y)=>{
        return x.length - y.length; // 字符串由短到长排列
    });

    console.log(values); // ["Mei", "Hime", "Hina", "Yomemi", "KizunaAI"]
    ```

## Manipulation Methods
### concat()
```js
let a = [1, 2, 3];
console.log(a.concat(4, 5));     // [1, 2, 3, 4, 5]
console.log(a.concat([4, 5]));   // [1, 2, 3, 4, 5]
console.log(a.concat([4], [5])); // [1, 2, 3, 4, 5]
console.log(a.concat(4, [5]));   // [1, 2, 3, 4, 5]
console.log(a.concat([[4, 5]])); // [1, 2, 3, [4, 5]]
```

### `flat(depth)`
1. This method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
2. The optional depth level specifying how deep a nested array structure should be flattened. Defaults to 1.
3. 返回新数组。
4. 测试 
    ```js
    const arr1 = [0, 1, 2, [3, 4]];
    console.log(arr1.flat()); // [0, 1, 2, 3, 4]

    const arr2 = [0, 1, 2, [[[3, 4]]]];
    console.log(arr2.flat(2)); // [0, 1, 2, [3, 4]] // 扁平两次
    console.log(arr2.flat(3)); // [0, 1, 2, 3, 4] // 扁平三次


    const arr3 = [0, 1, 2, [3, [4]], [5]];
    console.log(arr3.flat(2)); // [0, 1, 2, 3, 4, 5] // 因为是递归的，所以先 4 后 5

    console.log(arr3); // [0, 1, 2, [3, [4]], [5]] // 返回新数组
    ```
5. 可以看出来有个问题，就是 depth 默认只是 1，所以如果你想要的扁平到底就要知道最深的一项到底有多少层。不过，其实可以传一个肯定足够大的值，甚至传 `Number.MAX_SAFE_INTEGER` 都可以。

#### 自己实现扁平到底的 flat 方法
1. 原型
    ```js
    function deep_flat (arr) {
        let newArr = [];

        
        return newArr;
    }
    ```
2. 逻辑流程：
    1. `deep_flat` 接受 `arr`，创建一个新数组 `newArr`；
    2. 遍历 `arr` 的数组项，将每个数组项 `arr[i]` 的 “结果” 合并到 `newArr`；
        * 如果 `arr[i]` 不是数组，那它的结果就是它本身；
        * 如果 `arr[i]` 是数组，那它的结果就是 `deep_flat(arr[i])` 返回的数组；
    3. 返回 `newArr`。
3. 边际条件：`arr` 不是数组。
4. 测试用例：
    * `[0, 1, 2, [3, 4]]` 输出 `[0, 1, 2, 3, 4]`
    * `[0, 1, 2, [[[3, 4]]]]` 输出 `[0, 1, 2, 3, 4]`
    * `[0, 1, 2, [3, [4]], [5]]` 输出 `[0, 1, 2, 3, 4, 5]`
    * `[]` 输出 `[]`
    * `arr` 不是数组，报错。
5. 实现
    ```js
    function deep_flat (arr) {
        if ( !Array.isArray(arr) ) {
            throw new TypeError("arr is not an array.");
        }

        let newArr = [];

        arr.forEach((item) => {
            Array.isArray(item) ? 
                newArr.push(...deep_flat(item)) :
                newArr.push(item);
        });

        return newArr;
    }


    console.log(deep_flat(arr1)); // [0, 1, 2, 3, 4]
    console.log(deep_flat(arr2)); // [0, 1, 2, 3, 4]
    console.log(deep_flat(arr3)); // [0, 1, 2, 3, 4, 5]
    console.log(deep_flat([])); // [0, 1, 2, 3, 4]
    console.log(arr3); // [0, 1, 2, [3, [4]], [5]]
    console.log(deep_flat({})); // TypeError
    ```
6. TODO，栈实现 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

### `slice()`
1. returns a slice, or subarray, of the specified array.
2. does not modify the array on which it is invoked.
3. If either the start or end position of `slice()` is a negative number, then the number is subtracted from the `length` of the array to determine the appropriate locations. For example, calling `slice(-2, -1)` on an array with five items is the same as calling `slice(3, 4)`. If the end position is smaller than the start, then an empty array is returned.

### `splice()`
#### 删除
1. 可以删除任意数量的项，只需指定2个参数：要删除的第一项的位置和要删除的项数。
2. 例如，`splice(0, 2)` 会删除数组中的前两项。如果只有第一个参数，则从该位置开始直到结 束的所有数组项都被删除。

#### 插入
1. 可以向指定位置插入任意数量的项，只需提供3个参数：起始位置、`0`（要删除的项数）和要插入的项。
2. 如果要插入多个项，可以再传入第四、第五，以至任意多个项。例如，`splice(2, 0, 'red', 'green')` 会从当前数组的位置2开始插入字符串 `"red"` 和 `"green"`。

### 替换
1. 可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定3个参数：起始位置、要删除的项数和要插入的任意数量的项。
2. 插入的项数不必与删除的项数相等。例如，`splice (2, 1, 'red', 'green')` 会删除当前数组位置 2 的项，然后再从位置2开始插入字符串 `"red"` 和 `"green"`。

### 返回值
`splice()` 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则返回一个空数组）。

### `copyWithin()`
1. `Array.prototype.copyWithin(target, start=0, end=this.length)`
2. 第一个参数是从第几位开始覆盖，第二个参数是选取第几位作为覆盖物的起始，第三个参数是选取第几位之前的那一位作为覆盖物的结尾
    ```js
    console.log([1, 2, 3, 4, 5].copyWithin(2)); // [1, 2, 1, 2, 3]
    console.log([1, 2, 3, 4, 5].copyWithin(2, 3)); // [1, 2, 4, 5, 5]
    console.log([1, 2, 3, 4, 5].copyWithin(1, 2, 4)); // [1, 3, 4, 4, 5]
    ```

### `fill()`  
1. `arr.fill(value[, start[, end]])`
2. 第一个参数是用来填充的值；第二个参数是填充起始位置，默认为`0`；第三个参数是填充结束位
置之后的位置，默认为 `length`。第二个参数大于数组 `length` 也不会延长数组
    ```js
    console.log([1, 2, 3, 4, 5].fill(0));       // [0, 0, 0, 0, 0]
    console.log([1, 2, 3, 4, 5].fill(0, 2));    // [1, 2, 0, 0, 0]
    console.log([1, 2, 3, 4, 5].fill(0, 2, 4)); // [1, 2, 0, 0, 5]
    ```


## Location and Search Methods
### `indexOf()` and `lastIndexOf()`
1. Each of these methods accepts two arguments: the item to look for and anoptional index from which to start looking.
2. An identity comparison is used when comparing the first argument to each item in the array, meaning that the items must be strictly equal as if compared using `===`.
3. Negative values are allowed for the second argument and are treated as an offset from the end of the array
4. 因为是进行相等判断来查找，所以无法查找 `NaN`

### `find()` 和 `findIndex()` 查找符合条件的第一个成员或者其位置
1. `arr.find(callback[, thisArg])` `arr.findIndex(callback[, thisArg])`.
2. `find()` 如果没找到，返回 `undefined`；`findIndex() `如果没找到，返回 `-1`.
3. 会反复执行回调函数直到找到或者找不到.
4. 相比于 `indexOf`，这两个方法使用回调函数，因此可以查找 `NaN`.
5. 示例
    ```js
    result = [1, 5, 10, 15].find((value, index, arr) => {
        console.log('find'); // 输出三次
        return value > 9;
    });
    console.log(result); // 10

    result = [1, 5, 10, 15].findIndex((value, index, arr) => {
        console.log('findIndex'); // 输出四次
        return value > 11;
    });
    console.log(result); // 3
    ```

### `includes()`
1. `arr.includes(searchElement, fromIndex)`.
2. 返回一个布尔值，表示某个数组是否包含给定的值。
3. 可以查找 `NaN`。
4. 示例
    ```js
    let arr = [1, 2, NaN, 4, 5];

    console.log(arr.includes(2)); // true
    console.log(arr.includes(2, 2)); // false
    console.log(arr.includes(NaN)); // true
    ```


## Iterating Arrays
### ES5 遍历方法
1. 不会遍历数组空项(`undefined` 不算空项)，但 `map` 方法有个奇怪的地方：虽然不会遍历数组空项，但返回的结果数组却会存在一个空位。
    ```js
    let arr = [ "a", , "c"],
        num = 0,
        result = [];

    function reset(sFnName){
        console.log("\n" + sFnName + "---------------------------");
        num = 0;
        result = [];
    }

    reset("forEach");
    arr.forEach(item=>{
        num++;
    });
    console.log(num); // 2

    reset("every");
    arr.every(item=>{
        num++;
        return true;
    });
    console.log(num); // 2

    reset("filter");
    result = arr.filter(item=>{
        num++;
        return true;
    });
    console.log(num); // 2
    console.log(result); // ["a", "c"]
    console.log(result.length); // 2

    reset("some");
    arr.some(item=>{
        num++;
        return false;
    });
    console.log(num); // 2

    reset("map");
    result = arr.map(item=>{
        num++;
        return item;
    });
    console.log(num); // 2
    console.log(result); // ["a", empty, "c"]
    console.log(result.length); // 3
    ```

### `Array.prototype.flatMap()`
1. The flatMap() method of Array instances returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level
    ```js
    const arr1 = ["it's Sunny in", "", "California"];

    arr1.map((x) => x.split(" "));
    // [["it's","Sunny","in"],[""],["California"]]

    arr1.flatMap((x) => x.split(" "));
    // ["it's","Sunny","in", "", "California"]
    ```
2. The `flatMap()` method is identical to `map(callbackFn, thisArg)` followed by `flat(1)` — for each element, it produces an array of new elements, and concatenates the resulting arrays together to form a new array
    ```js
    // Let's say we want to remove all the negative numbers
    // and split the odd numbers into an even number and a 1
    const a = [5, 4, -3, 20, 17, -33, -4, 18];
    //         |\  \  x   |  | \   x   x   |
    //        [4,1, 4,   20, 16, 1,       18]

    const result = a.flatMap((n) => {
    if (n < 0) {
        return [];
    }
    return n % 2 === 0 ? [n] : [n - 1, 1];
    });
    console.log(result); // [4, 1, 4, 20, 16, 1, 18]
    ```

#### Using the third argument of callbackFn
    ```js
    const stations = ["New Haven", "West Haven", "Milford (closed)", "Stratford"];
    const line = stations
    .filter((name) => !name.endsWith("(closed)"))
    .flatMap((name, idx, arr) => {
        // Without the arr argument, there's no way to easily access the
        // intermediate array without saving it to a variable.
        if (idx === arr.length - 1) return []; // last station has no next station
        return [`${name} - ${arr[idx + 1]}`];
    });
    console.log(line); // ['New Haven - West Haven', 'West Haven - Stratford']
    ```

#### Using flatMap() on sparse arrays
The callbackFn won't be called for empty slots in the source array because `map()` doesn't, while `flat()` ignores empty slots in the returned arrays.
```js
console.log([1, 2, , 4, 5].flatMap((x) => [x, x * 2])); // [1, 2, 2, 4, 4, 8, 5, 10]
console.log([1, 2, 3, 4].flatMap((x) => [, x * 2])); // [2, 4, 6, 8]
```

#### Calling flatMap() on non-array objects
1. The `flatMap()` method reads the `length` property of `this` and then accesses each property whose key is a nonnegative integer less than `length`
    ```js
    const arrayLike = {
    length: 3,
    0: 1,
    1: 2,
    2: 3,
    3: 4, // ignored by flatMap() since length is 3
    };
    console.log(Array.prototype.flatMap.call(arrayLike, (x) => [x, x * 2]));
    // [1, 2, 2, 4, 3, 6]
    ```
2.  If the return value of the callback function is not an array, it is always directly appended to the result array
    ```js
    // Array-like objects returned from the callback won't be flattened
    console.log(
    Array.prototype.flatMap.call(arrayLike, (x) => ({
        length: 1,
        0: x,
    })),
    );
    // [ { '0': 1, length: 1 }, { '0': 2, length: 1 }, { '0': 3, length: 1 } ]
    ```

### `entries()`、`keys()` 和 `values()`
1. 它们都返回一个遍历器对象，可以用 `for...of` 进行遍历。
2. 如果不使用 `for...of` 循环，可以手动调用遍历器对象的 `next()` 方法进行遍历。
    ```js
    let arr = [1, 2, 3];

    console.log(arr.keys());    // Array Iterator {}
    console.log(arr.values());  // Array Iterator {}
    console.log(arr.entries()); // Array Iterator {}
    ```


## Reduction Methods
`arr.reduce(callback[, initialValue])` and `arr.reduceRight(callback[, initialValue])`

1. 如果只使用该方法 reduce 一个值，不管是一个单项数组没有初始值或者是空数组带初始值，该方法都会直接返回该值而不调用 callback。
2. 如果是空数组且没有初始值时，`TypeError`。
3. 不改变原数组

### `callback`
* 如果没设置 `initialValue`，则在初次调用时，前三个参数分别是：数组首项，数组第二项，`1`
* 如果设置了 `initialValue`，则在初次调用时，前三个参数分别是：`initialValue`，数组首
项，`0`。
* 第四个参数引用调用 `reduce()` 的数组，可选。

### `initialValue`
作为第一次调用 callback 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。
```js
let arr = [1, 2, 3];

let result1 = arr.reduce((accumulator, currentValue, currentIndex) => {
    console.log(accumulator, currentValue, currentIndex);
    // 分别打印 1 2 1 和 3 3 2
    return accumulator + currentValue;
});
console.log(result1); // 6

let result2 = arr.reduce((accumulator, currentValue, currentIndex) => {
    console.log(accumulator, currentValue, currentIndex);
    // 分别打印 10 1 0 、11 2 1 和 13 3 2
    return accumulator + currentValue;
}, 10);
console.log(result2); // 16

console.log(arr); // [1, 2, 3]
```

### 自己实现加深理解
1. 原型
    ```js
    function my_reduce (arr, reducer, initVal) {

    }
    ```
2. 逻辑
    1. 声明一个保存累加值的变量 `accu`，如果提供了 `initVal`，`accu` 初始化为 `initVal`，否则初始化为 `arr[0]`;
    2. 如果提供了 `initVal`，从 `arr[0]` 开始已遍历 `arr`，否则从 `arr[1]` 开始遍历；
        1. 每次遍历都调用 `reducer`，并传参：
            * 第一个参数：`accu`；
            * 第二个参数：当前数组项；
            * 第三个参数：当前数组项的数组 index； 
            * 第四个参数：`arr`。
        2. `reducer` 的返回值赋值给 `accu`。
    3. 遍历结束后返回 `accu`。

3. 边界
    * 参数类型
    * 数组长度小于 2：
        * 空数组但是有 `initVal`，算法可以正常运行并返回 `initVal`；
        * 单项数组没有 `initVal`，也可以正常运行并返回该数组项。
        * 空数组且没有 `initVal`，如果继续运行会返回没有初始值 `accu`，所以不运行直接报错。
4. 实现
    ```js
    function my_reduce (arr, reducer, initVal) {
        // assertArgumentsType();
        
        if (arr.length === 0 && initVal === undefined) {
            throw new TypeError();
        }

        let accu;
        let startIdx;

        if (initVal) {
            accu = initVal;
            startIdx = 0;
        }
        else {
            accu = arr[0];
            startIdx = 1;
        }

        for (let i=startIdx; i<arr.length; i++) {
            accu = reducer(accu, arr[i], i, arr);
        }

        return accu;
    }
    ```


## Array-Like
1. 通过 `call` 等方法，也可以对类数组对象和字符串实现数组的部分方法
    ```js
    let str = "JavaScript";

    let result1 = Array.prototype.join.call(str, " ");
    console.log(result1); // "J a v a S c r i p t"

    let result2 = Array.prototype.filter.call(str, (x) => {
        return x.match(/[^aeiou]/);
    }).join("");
    console.log(result2); // "JvScrpt"
    ```
2. 请记住，字符串是不可变值，故当把它们作为数组看待时，它们是只读的。如 `push()`、`sort()`、`reverse()` 和 `splice()` 等数组方法会修改数组，它们在字符串上是无效的。
    ```js
    let str = 'JavaScript';
    Array.prototype.push.call(str, '!');
    // TypeError: Cannot assign to read only property 'length' of object '[object String]'
    ```
3. 检测是否是类数组对象
    ```js
    function isArrayLike(o){
        if (o && // o is not null, undefined, etc.
            typeof o === "object" && // o is an object
            !Array.isArray(o) && // o is not array
            Number.isFinite(o.length) && // o.length is a finite number
            o.length >= 0 && // o.length is non-negative
            o.length === Math.floor(o.length) && // o.length is an integer
            o.length < 4294967296 // o.length < 2^32
        )
        return true; // Then o is array-like
        return false; // Otherwise it is not
    }
    ```
