# Array


## JS数组区别于其他语言数组的特性
* JavaScript arrays are general-purpose objects with numeric properties and a
special `length` property.
* Array elements can be any JavaScript value.
* Arrays can grow or shrink dynamically and can be sparse.
* JavaScript implementations perform lots of optimizations so that typical uses
of JavaScript arrays are very fast. 在 JavaScript 中访问数组元素是一个 O(1) 操作，
和简单的变量查找效率一样。而访问对象上的属性是一个 O(n) 操作。
* Arrays can contain a maximum of 4,294,967,295（2^32）items。Trying to create
an array with an initial size approaching this maximum may cause a long-running
script error.


## `length`
The name of this property is easy to make people misunderstood. It actual is not
the length of an array. In the specification:
> The length property of an Array instance is a data property whose value is
always numerically greater than the name of every configurable own property
whose name is an array index.  

```js
let arr = [];
arr[3] = 333;
console.log( arr.length ); // 4   length: I have to follow the specification！

arr = [1, 2, 3];
console.log( arr.length ); // 3
delete arr[1];
console.log(arr[2]); // 3
console.log( arr.length ); // 3
```


## 创建
Arrays can be created in three basic ways.

### The first is to use the `Array` constructor
1. If you know the number of items that will be in the array, you can pass the
count into the constructor, and the length property will automatically be
created with that value.   
2. The Array constructor can also be passed items that should be included in the array.
    ```
    var colors = new Array("red","blue","green");
    ```
3. It’s possible to omit the new operator when using the Array constructor.

### The second way to create an array is by using array literal notation.
* The values in an array literal need not be constants; they may be arbitrary expressions
* 因为数组是特殊的对象，所以使用对象的写法也是正确的    
```js
arr["2"] = 666;
```  
正如对象也可以使用数组的中括号写法一样。最终这两者的中括号的中的数字都会被转换成字符
串数字的形式作为属性名。所以其实`arr['2']`才是正规的写法，而常用的`arr[2]`只是针对
数组提供的一种方便写法。数组作为对象，它的键名本来就是字符串而不是数字。
* 还可以使用扩展运算符来构建字面量数组
    1. 任何Iterator接口的对象，都可以用扩展运算符转为真正的数组。
    ```js
    function foo(){
        let args = [...arguments];
        console.log( Array.isArray(arguments) ); // false
        console.log( Array.isArray(args) ); // true
    }
    ```
    2. 对于那些没有部署Iterator接口的类似数组的对象，扩展运算符就无法将其转为真正的数
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

* As with objects, the Array constructor isn’t called when an array is created
using array literal notation

### The third way to create an array is by using ES6 `Array.of()`
针对构造函数创建数组时的不一致性，即`Array(5)`表示五项数组，而`Array(5, 6)`表示两项
数组。ES6中使用该方法进行了统一，其参数永远是数组项。



## 数组是特殊的对象

* All indexes are property names, but only property names that are integers between 0 and 2^32 –1 are indexes. All arrays are objects, and you can create properties of any name on them. If you use properties that are array indexes, however, arrays have the special behavior of updating their  length property as needed.
* Note that you can index an array using numbers that are negative or that are not inte-gers. When you do this, the number is converted to a string, and that string is used as the property name.
* The fact that array indexes are simply a special type of object property name means that JavaScript arrays have no notion of an “out of bounds” error. When you try to query a nonexistent property of any object, you don’t get an error, you simply get undefined . This is just as true for arrays as it is for objects.
* Since arrays are objects, they can inherit elements from their prototype. In ECMAScript 5, they can even have array elements defined by getter and setter methods. If an array does inherit elements or use getters and setters for elements, you should expect it to use a nonoptimized code path: the time to access an element of such an array would be similar to regular object property lookup times.
    ```js
    let arr = [];
    Object.defineProperty(arr, 0,{
        get: function()
        {
            return 2233;
        },
        set: function(newValue)
        {
            arr[1] = 666;
        }
    });

    console.log( arr ); //[]
    console.log( arr[0] ); // 2233
    arr[0] = 123;
    console.log( arr ); // [1: 666]
    ```


## Sparse Arrays
```js
console.log(arr1); // ["a", empty, "c"]
console.log(arr2); // ["a", undefined, "c"]
console.log( arr1.length ); // 3  length 属性并不是根据数组项的个数来决定的
console.log( arr2.length ); // 3
console.log(arr1[1] === arr2[1]); // true
console.log('1' in arr1); // false
console.log('1' in arr2); // true
```

* A sparse array is one in which the elements do not have contiguous indexes
starting at 0.
* Sparse arrays can be created with the `Array()` constructor or simply by
assigning to an array index larger than the current array length. You can also
make an array sparse with the  delete operator.
* Arrays that are sufficiently sparse are typically implemented in a slower,
more memory-efficient way than dense arrays are, and looking up elements in such
 an array will take about as much time as regular object property lookup.
* Note that when you omit value in an array literal, you are not creating a
sparse array. The omitted element exists in the array and has the value
`undefined` . This is subtly different than array elements that do not exist at
all. You can detect the difference between these two cases with the in operator.
实测都是 `false`. The difference between `a1` and `a2` is also apparent when you
use a `for`/`in` loop:  实测都不会遍历
    ```js
    var a1 = [,,,]; // This array is [undefined, undefined, undefined]
    var a2 = new Array(3); // This array has no values at all
    0 in a1 // => true: a1 has an element with index 0
    0 in a2 // => false: a2 has no element with index 0
    ```

### 读取和设置
1. 如果设置某个值的索引超过了数组现有项数，数组就会自动增加到该索引加1的长度.
2. `length` property is that it’s not read-only. By setting the `length`
property, you can easily remove items from or add items to the end of the array.


## Detecting Arrays
### `instanceof`
When dealing with a single web page, and therefore a single global scope, the
`instanceof` operator works well. The one problem with `instanceof` is that it
assumes a single global execution context. If you are dealing with multiple
frames in a web page, you’re really dealing with two distinct global execution
contexts and therefore two versions of the Array constructor. If you were to
pass an array from one frame into a second frame, that array has a different
constructor function than an array created natively in the second frame.

### `Array.isArray()`  
The purpose of this method is to definitively determine if a given value is an
array regardless of the global execution context in which it was created.


## 转换方法
### 将数组转换为其他数据类型
#### `join()`
1. 使用不同的分隔符来构建输出字符串，该方法的参数即作为分隔符的字符串。如果不给
`join()` 方法传入任何值，或者传入 `undefined`，则使用逗号作为分隔符。
2. 如果数组中的某一项的值是 `null` 或者 `undefined`，那么该值在以上方法返回的结果中以
空字符串表示

### 将其他数据类型转换为数组
#### `Array.from()`
1. 将类数组对象（array-like object）和可遍历（iterable）的对象转换为数组
2. 只要是部署了 Iterator接口的数据结构，`Array.from` 都能将其转为数组。
3. `Array.from` 还可以接受第二个参数，作用类似于数组的 `map` 方法，用来对每个元素进行
处理，将处理后的值放入返回的数组。
    ```js
    Array.from(arrayLike, x => x * x);
    ```
4. 使用这个方法还可以创建数组
    ```js
    Array.from({ length: 10 }, a => Math.random() );
    ```
5. 对字符串使用该方法并取得返回数组的长度，可以避免 JavaScript 将大于 `\uFFFF` 的
Unicode 字符，算作两个字符的 bug。


## Stack Methods
An array object can act just like a stack, which is one of a group of data
structures that restrict the insertion and removal of items. A stack is referred
 to as a last-in-fi rst-out (LIFO) structure, meaning that the most recently
added item is the fi rst one removed. The insertion (called a push) and removal
(called a pop) of items in a stack occur at only one point: the top of
the stack. ECMAScript arrays provide `push()` and `pop()` specifi cally to allow
 stack-like behavior.

### `push()`
The  `push()` method accepts any number of arguments and adds them to the end of
 the array,returning the array’s new length.

### `pop()`
The `pop()` method, on the other hand, removes the last item in the array,
decrements the array’s `length` , and returns that item.


## Queue Methods
Just as stacks restrict access in a LIFO data structure, queues restrict access
in a first-in-first-out (FIFO) data structure. A queue adds items to the end of
a list and retrieves items from the front of the list.

### `shift()`
removes the first item in the array and returns itt, decrementing the `length`
of the array by one.

### `unshift()`
adds any number of items to the front of an array and returns the new array
`length`.


## Reordering Methods
Both `reverse()` and `sort()` return a reference to the array on which they
were applied.

### `reverse()`

### `sort()`
1. By default, `the sort()` method puts the items in ascending order. To do
this, the `sort()` method calls the `String()` casting function on every item
and then compares the strings to determine the correct order. This occurs even
if all items in an array are numbers
    ```js
    var values = [0, 1, 5, 10, 15];
    values.sort();
    alert(values); //0,1,10,15,5
    ```
If an array contains undefined elements, they are sorted to the end of the array.
2. Clearly, this is not an optimal solution in many cases, so the `sort()`
method allows you to pass in a *comparison function* that indicates which value
should come before which.  
3. A comparison function accepts two arguments and returns a negative number if
the first argument should come before the second, a zero if the arguments are
equal, or a positive number if the firstargument should come after the second.
    ```js
    function compare(value1, value2){
        if (value1 < value2)
        {
            return -1;
        }
        else if (value1 > value2)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }

    var values = [0, 1, 5, 10, 15];
    values.sort(compare);
    alert(values); //0,1,5,10,15
    ```


## Manipulation Methods
### concat()
1. This method begins by creating a copy of the array and then appending the
method arguments to the end and returning the newly constructed array.
2. When no arguments are passed in, `concat()` simply clones the array and
returns it.
3. If one or more arrays are passed in, `concat()` appends each item in these
arrays to the end of the result. That means, `concat()` does not recursively
flatten arrays of arrays
    ```js
    let a = [1, 2, 3];
    console.log( a.concat([4, 5]) ); // [1, 2, 3, 4, 5]
    console.log( a.concat([[4, 5]]) ); // [1, 2, 3, Array[2]]
    ```

### slice()
1. returns a slice, or subarray, of the specified array.
2. does not modify the array on which it is invoked
3. If either the start or end position of `slice()` is a negative number, then
the number is subtracted from the `length` of the array to determine the
appropriate locations. For example, calling `slice(-2, -1)` on an array with
 five items is the same as calling `slice(3, 4)`. If the end position is smaller
  than the start, then an empty array is returned.

### splice()
1. Deletion — Any number of items can be deleted from the array by specifying
just two arguments: the position of the first item to delete and the number of
items to delete. 如果只有第一个参数，则从该位置开始直到结束的所有数组项都被删除
2. Insertion — Items can be inserted into a specific position by providing three
or more arguments: the starting position, 0 (the number of items to delete),
and the item to insert. Optionally, you can specify a fourth parameter, fifth
parameter, or any number of other parameters to insert.
3. Replacement — Items can be inserted into a specific position while
simultaneously deleting items, if you specify three arguments: the starting
position, the number of items to delete, and any number of items to insert. The
number of items to insert doesn’t have to match the number of items to delete.
4. unlike `concat()`, `splice()` inserts arrays themselves, not the elements of
those arrays.
5. Unlike `slice()` and `concat()`, `splice()` modifies the array on which it is
invoked.
6. The `splice()` method always returns an array that contains any items that
were removed from the array (or an empty array if no items were removed).

##### ES6 copyWithin()
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
1. 在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回修改后的数组
    ```
    let log = Array.prototype.copyWithin.call({length: 5, 3: 1}, 0, 3);
    console.log( log );// Object {0: 1, 3: 1, length: 5}
    ```
这一例子中，把一个对象作为数组来操作，相当于数组[undefined, undefined, undefined, 1, undefined]。从第0位开始覆盖，覆盖物从第3位开始，直到结尾，即 1, undefined。覆盖之后的数组是[1, undefined, undefined, 1, undefined]。因为这个不是Array.prototype.slice，所以并不会真的转化为数组，其依然是对象，即{0: 3, 3: 1, length: 5}
2. Array.prototype.copyWithin(target, start = 0, end = this.length)
    第一个参数是从第几位开始覆盖，第二个参数是选取第几位作为覆盖物的起始，第三个参数是选取第几位之前的那一位作为覆盖物的结尾
3. 会修改原数组
4. ==不懂[兼容ES5的写法](http://es6.ruanyifeng.com/?search=Int32Array&x=6&y=8#docs/array)==

##### ES6 fill()  
fills all the elements of an array from a start index to an end index with a **static** value.
1. 第一个参数是用来填充的值，第二个参数是填充起始位置，第三个参数是填充结束位置之后的位置。后两个参数都是可选的。第二个参数大于数组length也不会延长数组。
2. The fill method is a mutable method, it will change this object itself, and return it, not just return a copy of it.
3. The fill function is intentionally generic, it does not require that its this value be an Array object. 实则可以用在```arguments```上，但用在```HTMLCollection```无效，仍然返回该HTMLCollection对象。



## Location and Search Methods
##### ```indexOf()``` and ```lastIndexOf()```
1. Each of these methods accepts two arguments: the item to look for and an optional index from which to start looking.
2. An identity comparison is used when comparing the first argument to each item in the array, meaning that the items must be strictly equal as if compared using ===
3. Negative values are allowed for the second argument and are treated as an offset from the end of the array
4. 因为是进行相等判断来查找，所以无法查找NaN

二. ES6的 find()和findIndex() 查找符合条件的第一个成员或者其位置
[1, 4, -5, 10].find((n) => n < 0);
[1, 5, 10, 15].find(function(value, index, arr) {  return value > 9; });

1. find()如果没找到，返回undefined；findIndex()如果没找到，返回-1
2. 会反复执行回调函数直到找到或者找不到
3. 可以通过第二个参数来执行回调函数中的this
4. 相比于 indexOf，这两个方法使用回调函数，因此可以查找NaN


三. ES7 includes方法返回一个布尔值，表示某个数组是否包含给定的值
可以查找NaN





## Iterating Arrays
#### 一. 概述
1. ECMAScript 5 defines five iterative methods for arrays.
2. Each of the methods accepts two arguments: a function to run on each item and an optional scope object in which to run the function (affecting the value of this).
3. The function passed into one of these methods will receive
three arguments: the array item value, the position of the item in the array, and the array object
itself.
4. 不会遍历数组空项(`undefined`不算空项)，但 `map` 方法有个奇怪的地方：虽然不会遍历数
组空项，但返回的结果数组却会存在一个空位。
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
5. By mathematical convention, every() returns true and some returns false when invoked on an empty array.
6. simulate break  
For ```filter()```、```forEach()``` and ```map()```, there is not a way to ```break```(or ```continue```) the iteration, if need to break the iteration, we must throw an error with ```try-catch```
```
forEachCanBreak.break = new Error("StopIteration");
function forEachCanBreak(arr,fn,oThis)
{
	try { a.forEach(fn, oThis); }
	catch(e)
	{
		if( e === forEachCanBreak.break )
		{
			return;
		}
		else
		{
			throw e;
		}
	}
}
```

#### 二.原数组不会被以下的方法改变
1. ```every()```：Runs the given function on every item in the array and returns true if the function returns true for every item. 只要有一项是false，就返回false并终止循环。
2. ```filter()```：Runs the given function on every item in the array and returns an array of all items for which the function returns true.
3. ```forEach()```：Runs the given function on every item in the array. This method has no return value.
4. ```map()```：Runs the given function on every item in the array and returns the result of each function call in an array.
5. ```some()```：Runs the given function on every item in the array and returns true if the function returns true for any one item. 只要有一项是true，就返回true并终止循环。  



#### 三. ES6 遍历数组方法  entries()，keys()和values()
1. 它们都返回一个遍历器对象，可以用 `for...of` 循环进行遍历，唯一的区别是 `keys()` 是
对键名的遍历、`values()` 是对键值的遍历，`entries()` 是对键值对的遍历。
2. 如果不使用 `for...of` 循环，可以手动调用遍历器对象的 `next()` 方法进行遍历。




## Reduction Methods
`arr.reduce(callback[, initialValue])` and `arr.reduceRight(callback[, initialValue])`

1. 如果只使用该方法 reduce 一个值，不管是一个单项数组没有初始值或者是空数组带初始值，该
方法都会直接返回该值而不调用 callback。
2. 如果是空数组且没有初始值时，`TypeError`。

### `callback`
Function to execute on each element in the array, taking four arguments:
#### `accumulator`
* The `accumulator` accumulates the callback's return values
* 如果提供了`initialValue`，`initialValue`会作为`accumulator`的初始值，reduce 会从
数组第一项开始；如果没有提供`initialValue`，`accumulator`初始值是数组第一项，也就是说
reduce 是从数组第二项开始。
#### `currentValue`
同上，根据是否提供`initialValue`，`currentValue`初始值会是数组第二项或第一项。
#### `currentIndex`
* Optional.
* 同上，初始值会是`1`或`0`
#### `array`
* Optional
* The array `reduce()` was called upon.

### `initialValue`
* Optional
* Value to use as the first argument to the first call of the callback. If no
initial value is supplied, the first element in the array will be used.
* Calling `reduce()` on an empty array without an initial value is an error.



## Array-Like
1. 通过call等方法，也可以对类数组对象和字符串实现数组的部分方法
2. strings are immutable values, so when they are treated as arrays, they
are read-only arrays. Array methods like ```push()```, ```sort()```, ```reverse()```, and ```splice()``` modify an array in place and do not work on strings.
3. 检测是否是类数组对象
```
function isArrayLike(o)
{
	if (o && // o is not null, undefined, etc.
		typeof o === "object" && // o is an object
		!Array.isArray(o) && // o is not array
		isFinite(o.length) && // o.length is a finite number
		o.length >= 0 && // o.length is non-negative
		o.length===Math.floor(o.length) && // o.length is an integer
		o.length < 4294967296 // o.length < 2^32
	)
	return true; // Then o is array-like
	return false; // Otherwise it is not
}
```
