# Check data type


<!-- TOC -->

- [Check data type](#check-data-type)
    - [通用类型检测](#通用类型检测)
        - [使用 `typeof`](#使用-typeof)
        - [`Object.prototype.toString.call` 返回对象的字符串表示](#objectprototypetostringcall-返回对象的字符串表示)
        - [`instanceof` 检测是否是某构造函数原型的实例](#instanceof-检测是否是某构造函数原型的实例)
    - [特定类型检测](#特定类型检测)
        - [检测数组](#检测数组)
    - [检测数值类型](#检测数值类型)
        - [检测是否为数值](#检测是否为数值)
        - [检测是否为数值字符串](#检测是否为数值字符串)
        - [isNumeric](#isnumeric)
        - [`Number.isInteger()` & `Number.isSafeInteger()`](#numberisinteger--numberissafeinteger)
        - [`Number.isFinite()` & `isFinite()`](#numberisfinite--isfinite)
        - [`Number.isNaN()` & `isNaN ( number )`](#numberisnan--isnan--number-)
    - [References](#references)

<!-- /TOC -->


## 通用类型检测
### 使用 `typeof`
1. 检测结果
    Type | Result
    --|--
    `Undefined`      | `"undefined"`
    `Null`           | `"object"`
    `NaN`            | `"number"`
    `Boolean`        | `"boolean"`
    `Number`         | `"number"`
    `BigInt`         | `"bigint"`
    `String`         | `"string"`
    `Symbol`         | `"symbol"`
    `Function`       | `"function"`
    Any other object | `"object"`
2. 在 ECMAScript 2015 之前，`typeof` 总能保证对任何所给的操作数返回一个字符串。即便是没有声明的标识符，`typeof` 也能返回 `'undefined'`。因此使用 `typeof` 检测变量永远不会抛出错误
    ```js
    console.log(typeof undeclaredVariable === 'undefined'); // true
    ```    
3. 但是如果 `let`、`const` 或 `class` 声明，不会存在变量或类的提升，因此在声明之前是无法放分的，否则就会抛出一个 `ReferenceError`
    ```js
    typeof a; // ReferenceError: Cannot access 'a' before initialization
    let a;
    ```
    ```js
    typeof a; // ReferenceError: Cannot access 'a' before initialization
    const a = 1;
    ```
    ```js
    typeof O; // ReferenceError: Cannot access 'O' before initialization
    class O {};
    ```
4. 可以看出来，`typeof` 无法检测出 `Null`、`NaN` 和 plain object 和函数以外的引用类型。
    * 检测 `Null` 可以直接使用 `val === null`
    * 检测 `NaN` 要使用 `Number.isNaN()`
    * 检测其他引用类型的方法下述

### `Object.prototype.toString.call` 返回对象的字符串表示
1. MDN 对该方法的定义是：The `toString()` method returns a string representing the object。所以对于引用类型，可以返回对应的字符串表示
    ```js
    console.log(Object.prototype.toString.call([]));          // "[object Array]"
    console.log(Object.prototype.toString.call(new Date()));  // "[object Date]"
    console.log(Object.prototype.toString.call(null));        // "[object Null]"
    console.log(Object.prototype.toString.call(/a/));         // "[object RegExp]"
    ```
2. 根据规范中所说的也可以看到，这个方法会把 `this` 转换为对象，所以这个方法没办法区分基础类型和它的包装类型
    ```js
    console.log(Object.prototype.toString.call(new String("freeCodeCamp")));  // "[object String]"
    console.log(Object.prototype.toString.call("freeCodeCamp"));              // "[object String]"
    ```

### `instanceof` 检测是否是某构造函数原型的实例
1. 实例是相对于原型来说的，但是这里是使用原型的构造函数来测试的。例如 `v instanceof Obj`，它检测的是 `v` 是否是 `Obj.prototype` 的实例
    ```js
    function Obj(){}
    let v = new Obj();
    console.log( v instanceof Obj ); // true
    ```
2. 这里的实例并不一定需要是原型的直接实例，也可以是原型的子类型的实例
    ```js
    function Obj(){}
    let v = new Obj();
    console.log( v instanceof Object ); // true
    ```
3. 虽然测试时使用构造函数，但因为真正测试的是原型，所以即使一个实例是由该构造函数实例化的，但不是该构造函数原型的实例，那也会返回 `false`
    ```js
    function Obj(){}
    let v = new Obj(); // v 是由 Obj 实例化的
    Obj.prototype = {}; // 但是现在 Obj 改变了原型
    console.log( v instanceof Obj ); // false // 所以 v 的原型现在已经不是 Obj.prototype
    console.log( v instanceof Object ); // true
    ```
4. 基础类型会返回 `false`
    ```js
    console.log((22).__proto__ === (new Number(22)).__proto__) // true
    console.log((new Number(22)) instanceof Number) // true
    // 即使可以通过原型链追溯到，但因为`22`不是对象实例。所以还是返回`false`
    console.log((22) instanceof Number) // false
    ```
5. 一个特殊情况下使用 `instanceof` 会有问题，使用 frame 时，会有多个全局对象。每个全局对象都会有自己的原生构造函数，并且是不同的。例如 `top.Array` 和 `top.frames[0].Array` 是不一样的，当数组 `arr` 跨 frame 传递的情况下，如果 `arr` 不是当前全局环境创建的数组，使用 `arr instanceof Array` 就会返回 `false`。


## 特定类型检测
### 检测数组
可以检测一个值是否为数组 `Array.isArray()`。对于上面 `instanceof` 的情况，在针对数组的情况，可以使用 `Array.isArray()` 来解决。


## 检测数值类型
### 检测是否为数值
排除特例 `NaN`
```js
function isNumber(v){
    return (typeof v === 'number') && !Number.isNaN(v);
}
```

### 检测是否为数值字符串
```js
function isNumericString(v){
    // !!(v.trim()): exclude '' and '   '.
    // Number(v) == v: binary, octal, hexadecimal and exponential could be converted correctly.
    //                 
    //                 console.log(16 == '0x10'); // true
    // Number.parseFloat(v) == v   can exclude '' and '   ', but can not covert binary, octal, 
    //                             hexadecimal and exponential string correctly.
    return (typeof v === 'string') && !!(v.trim()) && (Number(v) == v);
}
```

### isNumeric
Number or numeric string

* Cover ±Infinite
```js
function isNumeric(v){
    return isNumber(v) || isNumericString(v);
}
```

* Exclude ±Infinite
```js
// From jquery 3.2.1
function isNumeric(n) {
    const type = typeof n;
    return ( type === "number" || type === "string" ) &&
        !isNaN(n - Number.parseFloat(n));
}
```
如果 `n` 是非无穷十进制数字或数字字符串，则 `!isNaN(n - Number.parseFloat(n))` 肯定为 `true`；如果是其他进制数字或数字字符串，`Number.parseFloat(n)` 会返回 `0`，经过减法也会是数字；如果是无穷，则无穷减无穷会是 `NaN`。

* test code
```js
// http://run.plnkr.co/plunks/93FPpacuIcXqqKMecLdk/
console.log( 'isNumeric("-10")', isNumeric("-10") );
console.log( 'isNumeric("0")', isNumeric("0") );
console.log( 'isNumeric("5")', isNumeric("5") );
console.log( 'isNumeric(-16)', isNumeric(-16) );
console.log( 'isNumeric(0)', isNumeric(0) );
console.log( 'isNumeric(32)', isNumeric(32) );
console.log( 'isNumeric("040")', isNumeric("040") );
console.log( 'isNumeric("0o144")', isNumeric("0o144") );
console.log( 'isNumeric(0o144)', isNumeric(0o144) );
console.log( 'isNumeric("0xFF")', isNumeric("0xFF") );
console.log( 'isNumeric(0xFFF)', isNumeric(0xFFF) );
console.log( 'isNumeric("-1.6")', isNumeric("-1.6") );
console.log( 'isNumeric("4.536")', isNumeric("4.536") );
console.log( 'isNumeric(-2.6)', isNumeric(-2.6) );
console.log( 'isNumeric(3.1415)', isNumeric(3.1415) );
console.log( 'isNumeric(8e5)', isNumeric(8e5) );
console.log( 'isNumeric("123e-2")', isNumeric("123e-2") );
console.log( 'isNumeric("")', isNumeric("") );
console.log( 'isNumeric("        ")', isNumeric("        ") );
console.log( 'isNumeric("\t\t")', isNumeric("\t\t") );
console.log( 'isNumeric("abcdefghijklm1234567890")', isNumeric("abcdefghijklm1234567890") );
console.log( 'isNumeric("xabcdefx")', isNumeric("xabcdefx") );
console.log( 'isNumeric(true)', isNumeric(true) );
console.log( 'isNumeric(false)', isNumeric(false) );
console.log( 'isNumeric("bcfed5.2")', isNumeric("bcfed5.2") );
console.log( 'isNumeric("7.2acdgs")', isNumeric("7.2acdgs") );
console.log( 'isNumeric(undefined)', isNumeric(undefined) );
console.log( 'isNumeric(null)', isNumeric(null) );
console.log( 'isNumeric(NaN)', isNumeric(NaN) );
console.log( 'isNumeric(new Date(2009, 1, 1))', isNumeric(new Date(2009, 1, 1)) );
console.log( 'isNumeric(new Object())', isNumeric(new Object()) );
console.log( 'isNumeric(function() {})', isNumeric(function() {}) );
console.log( 'isNumeric(Infinity)', isNumeric(Infinity) );
console.log( 'isNumeric(Number.POSITIVE_INFINITY)', isNumeric(Number.POSITIVE_INFINITY) );
console.log( 'isNumeric(Number.NEGATIVE_INFINITY)', isNumeric(Number.NEGATIVE_INFINITY) );
```

### `Number.isInteger()` & `Number.isSafeInteger()`
* [Spec: Number.isInteger()](https://tc39.github.io/ecma262/#sec-number.isinteger)
* [Spec: Number.isSafeInteger()](https://tc39.github.io/ecma262/#sec-number.issafeinteger)
* [MDN: Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

### `Number.isFinite()` & `isFinite()`    
* [Spec: Number.isFinite](https://tc39.github.io/ecma262/#sec-number.isfinite)  
* [Spec: isFinite()](https://tc39.github.io/ecma262/#sec-isfinite-number)

### `Number.isNaN()` & `isNaN ( number )`
* [Spec: Number.isNaN()](https://tc39.github.io/ecma262/#sec-number.isnan)
* [Spec: isNaN ( number )](https://tc39.github.io/ecma262/#sec-isnan-number)


## References
* [Spec](https://tc39.github.io/ecma262/#sec-typeof-operator)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
* [Spec](https://www.ecma-international.org/ecma-262/5.1/)
* [Spec](https://www.freecodecamp.org/news/javascript-typeof-how-to-check-the-type-of-a-variable-or-object-in-js/)
* [Spec](https://tc39.github.io/ecma262/#sec-instanceofoperator)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)