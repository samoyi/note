# Number


## Number in JS
1. 与其他编程语言不通，JS 不区分整数值和浮点数值。JS 中的所有数字均由浮点数值表示。
2. JS 采用 IEEE 754 标准定义的 64 位浮点数格式表示数字，这意味着它能表示的最大值是
`±1.7976931348623157 × 10^308`，最小值是`±5 × 10^−324`。
3. 按照 JavaScript 中的数字格式，能够表示的整数范围是从`−9007199254740992 (−2^53)`到
`9007199254740992 (2^53)`，包含边界值。如果使用了超过此范围的整数，则无法保证低位数字
的精度。
4. 然而需要注意的是，JavaScript 中实际的操作（比如数组索引，以及位操作符）则是基于32位
整数。
5. 支持 Scientific notation
    ```js
    console.log(3.14e6); // 3140000
    ```


## 进制
1. 二进制使用前缀`0b`或`0B`
2. 八进制使用前缀`0o`或`0O`
4. 十六进制使用前缀`0x`或`0X`，字母A~F可以大写也可以小写
5. 在进行算术计算时，其他进制表示的数值最终都将被转换为十进制数值


## 数值范围
### 安全范围
1. JS 中的数字使用 IEEE-754 的双精度浮点数格式，数值范围是(`-(2^53 - 1)`,`2^53 - 1`)，
可以通过常量`Number.MIN_VALUE`和`Number.MAX_VALUE`来使用这个范围。
2. `Number.isSafeInteger()`可以判断一个整数是否在上述范围内。
3. 不应该只判断计算的结果是否安全，计算中的每一步用到的数值都应该判断。


### Underflow
1. Underflow occurs when the result of a numeric operation is closer to zero
than the smallest representable number. In this case, JavaScript returns `0`.
2. If underflow occurs from a negative number, JavaScript returns a special
value known as "negative zero". This value is almost completely
indistinguishable from regular zero and JavaScript programmers rarely need to
detect it.

### Infinity
1. 在 JS 中，除以 0 并不会导致错误。除了`0/0`返回`NaN`以外，其他数除以 0 都会返回相应
的`-Infinity`或`Infinity`。
2. 如果一个计算的结果超出了返回，也会被转换为相应的`-Infinity`或`Infinity`。
3. `-Infinity`和`Infinity`也会保存在常量`Number.NEGATIVE_INFINITY`和
`Number.POSITIVE_INFINITY`中。
4. `Number.isFinite()`会判断一个是否是有穷。如果参数不是数字，`isFinite()`会试图将其
转换为数字，但`Number.isFinite()`不会转型。
    ```js
    console.log( Number.isFinite(Infinity) );  // false
    console.log( Number.isFinite(NaN) );       // false
    console.log( Number.isFinite(-Infinity) ); // false

    console.log( Number.isFinite(0) );         // true
    console.log( Number.isFinite(2e64) );      // true

    console.log( Number.isFinite('0') );       // false
    console.log( isFinite('0') );              // true
    console.log( Number.isFinite(null) );      // false
    console.log( isFinite(null) );             // true
    ```


## Integers
### `Number.isInteger()`
判断一个值是否为整数。需要注意的是，在 JavaScript 内部，整数和浮点数是同样的储存方法，
所以`3`和`3.0`被视为同一个值，都会返回`true`
```js
Number.isInteger()
```

### 32-bit (Signed) Integers
1. 虽然整数安全范围是`-(2^53 - 1)` and `2^53 - 1`，包括用`Number.isSafeInteger()`
测试一个整数是否安全时也是基于该范围。但某些数字操作（例如位操作符）是基于 32-bit 数字
的，所以在这种情况下的实际安全范围会小得多。即`Math.pow(-2, 31)`到
`Math.pow(2, 31)-1`.
2. Certain special values such as `NaN` and `Infinity` are not "32-bit safe," in
that those values when passed to a bitwise operator will pass through the
abstract operation `ToInt32` and become simply the `+0` value for the purpose of
 that bitwise operation.


## Floating point
1. 在一个`.`既有可能被被解释为小数点又有可能被解释为属性访问符时，这属于茴自写法问题，不
要分析原理
    ```js
    3.toString(); // SyntaxError: Invalid or unexpected token

    3..toString() // '3'  

    0.3.toString() // '0.3'  

    3 .toString(); // 3

    obj..3 = 333; // SyntaxError: Unexpected number
    ```
2. Because storing floating-point values uses twice as much memory as storing
integer values, ECMAScript always looks for ways to convert values into integers
    ```js
    var floatNum1 = 1.; // missing digit after decimal - interpreted as integer 1
    var floatNum2 = 10.0; // whole number - interpreted as integer 10
    ```


## 二进制浮点数和四舍五入错误
1. 实数有无数个，但 JavaScript 通过浮点数的形式只能表示其中有限的个数（确切地说是
18 437736 874 454 810 627个）。也就是说，当在 JavaScript 中使用实数的时候，常常只是
真实值的一个近似表示。
2. JavaScript 采用了 IEEE-754 浮点数表示法（几乎所有现代编程语言所采用），这是一种二进
制表示法，可以精确地表示分数，比如 1/2、1/8 和 1/1024。遗憾的是，我们常用的分数（特别是
在金融计算方面）都是十进制分数 1/10、1/100 等。二进制浮点数表示法并不能精确表示类似 0.1
这样简单的数字。
    ```js
    let x = 0.3 - 0.2;
    let y = 0.2 - 0.1;
    console.log(x === y); // false
    console.log(x);       // 0.09999999999999998
    console.log(y);       // 0.1
    ```
3. 因为舍入误差，0.3 和 0.2 之间的近似值实际上并不等于 0.2 和 0.1 之间的近似差值。这个
问题并不只在 JavaScript 中才会出现，在任何使用二进制浮点数的编程语言中都会有这个问题。

### 解决方法
#### 使用整数
在需要精密计算的场景下，只使用整数来计算。例如在金融计算时，要使用整数“分”而不要使用小数
“元”进行基于货币单位的运算。

#### 使用`Number.EPSILON`
1. 在这种误差存在的前提下，当两个值的差距小到一定程度的时候，就可以认定它俩是同一个数。
2. 这个临界值一般被成为 "machine epsilon"，它的值为`2^-52 (2.220446049250313e-16)`。
可以通过常量`Number.EPSILON`来引用这个值。
3. 所以在判断两个数是否相等时，可以使用下面的方法

```js
function numbersCloseEnoughToEqual(n1, n2) {
	return Math.abs( n1 - n2 ) < Number.EPSILON;
}

let x = 0.3 - 0.2;
let y = 0.2 - 0.1;
console.log( x === y );    // false
console.log( numbersCloseEnoughToEqual(x, y) );  // true
```


## 类型转换
`Number()` `Number.parseInt()` `Number.parseFloat()`
1. 第一个函数，即转型函数可以用于任何数据类型。另外两个函数则专门用于把字符串转换成数值。
实测后两个也可以转换首项是数字或数字字符串的数组，但不能转换布尔值。
2. 这三个函数对于同样的输入会有返回不同的结果。
3. 转换极大或极小的整数时会返回个位数，因为使用了e底数的计数法。
4. 一元加操作符的操作与`Number()`函数相同

### `Number()`
* 如果参数是布尔值，`true`转换为`1`，`false`转换为`0`。
    ```js
    console.log(Number(true));  // 1
    console.log(Number(false)); // 0
    ```
* 如果参数是数字，返回其十进制格式
    ```js
    console.log(Number(12));     // 12
    console.log(Number(0b1100)); // 12
    console.log(Number(0o14));   // 12
    console.log(Number(0xC));    // 12
    ```
* `null`返回 0，`undefined`返回`NaN`。感觉上`undefined`比`null`要更“空”一些
    ```js
    console.log(Number(null));      // 0
    console.log(Number(undefined)); // NaN
    ```
* 如果参数是字符串，则细分为以下的规则：
    * 如果字符串是标准二进制、八进制或十六进制数，则转换为相应的十进制数值。如果在该二
    进制、八进制或十六进制前面还带符号或者前导0，则转为`NaN`
        ```js
        console.log(Number('0b10'));  // 2
        console.log(Number('0o10'));  // 8
        console.log(Number('0x10'));  // 16
        console.log(Number('+0x10')); // NaN
        console.log(Number('00x10')); // NaN
        ```
    * 如果字符串是十进制数，前导0会被忽略，而且最前面可以带符号，会被正确识别
        ```js
        console.log(Number('0010'));    // 10
        console.log(Number('+0010'));   // 10
        console.log(Number('-0010'));   // -10
        console.log(Number('003.14'));  // 3.14
        console.log(Number('+003.14')); // 3.14
        console.log(Number('-003.14')); // -3.14
        ```
    * 空字符串和空白字符串都会被转为0
        ```js
        console.log(Number(''));  // 0
        console.log(Number(' ')); // 0
        ```
    * 几个特殊的字符串转换结果如下
        ```js
        console.log(Number('\n'));  // 0
        console.log(Number('\t'));  // 0
        console.log(Number('\b'));  // NaN  \b 会有实际字符输出，
        console.log(Number('\r'));  // 0
        console.log(Number('\f'));  // 0
        ```
    * 其他形式的字符串，都会返回`NaN`.
* 如果参数是对象，则先会调用对象的`valueOf()`方法。包装类型经过该方法会变成基础类型，可
以运用上面的转换方法转换；其他对象仍然是对象类型，会再调用`toString()`方法转换为字符串，
然后再转数值。
    ```js
    console.log(Number(String(2)));  // 2
    console.log(Number('{}'));       // NaN   {}.toString() === '[object Object]'
    console.log(Number([]));         // 0     {n:1}.toString() === '[object Object]'
    console.log(Number('{n:2}'));    // NaN   [].toString() === ''
    console.log(Number([2]));        // 2     [1].toString() === '1'
    ```

### `Number.parseInt()`
1. `Number.parseInt(string,[ radix ])`
2. 前导 0 和前导空白字符会被忽略
    ```js
    console.log(Number.parseInt('0123'));   // 123
    console.log(Number.parseInt(' 123'));   // 123
    console.log(Number.parseInt('\n123'));  // 123
    console.log(Number.parseInt('\t123'));  // 123
    console.log(Number.parseInt('\r123'));  // 123
    console.log(Number.parseInt('\f123'));  // 123
    console.log(Number.parseInt('\b123'));  // NaN
    ```
3. 如果有上述可忽略的，在忽略完成后，如果剩下的字符串中，前面的一个或几个字符不是合理的
数字类型（包括任何进制），`Number.parseInt()`会返回`NaN`。
    ```js
    console.log(Number.parseInt(' 0123', 10));   // 123
    console.log(Number.parseInt(' +123', 10));   // 123
    console.log(Number.parseInt(' -123', 10));   // -123
    console.log(Number.parseInt(' 0x123', 16));  // 291
    // 与 Number() 不能识别带正负号的其他进制数字符串不同，这个方法可以识别
    console.log(Number.parseInt(' -0x123', 16)); // -291
    console.log(Number.parseInt(' x123', 16));   // NaN
    ```
4. 如果识别到了有效的数字字符串，则会按顺序往后识别直到识别到非整数成分或字符串结束
    ```js
    console.log(Number.parseInt('123a', 10));   // 123
    console.log(Number.parseInt('123 4', 10));  // 123
    console.log(Number.parseInt('123. 4', 10)); // 123
    console.log(Number.parseInt('123.4', 10));  // 123
    ```
* 空字符串和空白字符串返回`NaN`，这一点与`Number()`返回`0`不同
    ```js
    console.log(Number.parseInt(''));   // NaN
    // 其实空白字符串，根据前面忽略前导0的规则，最终识别是和''是一样的
    console.log(Number.parseInt(' '));  // NaN
    ```
* 能自动识别十六进制字符串，但不能自动识别其他进制的。要想识别就必须带第二个参数。建议永
远带第二个参数
    ```js
    console.log(Number.parseInt('0b11'));   // 0
    console.log(Number.parseInt('0o11'));   // 0
    console.log(Number.parseInt('0x11'));   // 17
    ```
* 如果参数是数值类型，则返回整数部分
    ```js
    console.log(Number.parseInt(123.4));   // 123
    ```

### `Number.parseFloat()`
1. `Number.parseFloat(string)`
2. 与`Number.parseInt()`不同的是，这个方法只能用于十进制数字字符串，并不能指定进制
    ```js
    console.log(Number.parseFloat('0x10')); // 0
    ```
3. Parsing accuracy is limited
    ````js
    let result = Number.parseFloat( '1.337000012397766117451156851189711');
    console.log( result ); // 1.3370000123977661
    ````

### `Number.prototype.toPrecision([precision])`
1. 将一个数字转换为字符串，使用指定数目的有效数字。根据数字的大小以及指定的有效数字位数，
可能会采用指数或浮点记数法。
2. 如果有效数字的位数少于数字整数部分的位数，则转换成指数形式。如果有效数字的位数不少于
整数部分的位数，则被截取的第一位会四舍五入
    ```js
    console.log((1234.5678).toPrecision(3));  // "1.23e+3"
    console.log((1234.5678).toPrecision(4));  // "1235"
    console.log((1234.5678).toPrecision(5));  // "1234.6"
    ```
3. 如果被操作数已经是指数形式，只要有效数字位数不会导致其放弃指数形式，那么就直接按有效
数字位数四舍五入。但是注意，如果不传参，指数形式会被自动展开，原因见下
    ```js
    console.log((1234.5678e+5).toPrecision(3));  // "1.23e+8"
    console.log((1234.5678e+5).toPrecision(4));  // "1.235e+8"
    console.log((1234.5678e+5).toPrecision(5));  // "1.2346e+8"
    console.log((1234.5678e+5).toPrecision(9));  // "123456780"
    console.log((1234.5678e+5).toPrecision());   // "123456780"
    ```
4. 可以识别其他进制并转换为十进制
    ```js
    console.log((0b1111011).toPrecision(4)); // "123.0"
    ```
5. 参数不能为0，因为不能保留0为有效数字。但也不能默认为1，大概是默认为0感觉正常，默认为
1有些奇怪了。所以如果没有传参，和`Number.prototype.toString()`等效。这时唯一要注意的
是，指数形式会被自动展开
    ```js
    console.log((1234.5678e+5).toPrecision()); // 123456780
    ```

### `Number.prototype.toFixed([digits])`
1. 返回一个数字的字符串格式，参数为保留几位小数。同样会四舍五入。
    ```js
    console.log((123.456).toFixed(2));     // "123.46"
    console.log((0.004).toFixed(2));     // "0.00"
    ```
2. 参数默认为0
    ```js
    console.log((123.456).toFixed());     // "123"
    ```
3. 不是用指数形式。
    ```js
    console.log((1.23e+4).toFixed(2)); // "12300.00"
    ```
4. 同样可以识别其他进制并转换为十进制
    ```js
    console.log((0b11).toFixed(2));   // "3.00"
    ```

### `Number.prototype.toExponential([fractionDigits])`
1. 返回数字的指数形式字符串
2. 可选的参数指定指数形式的小数部分位数，如果不传，会根据需要自行决定
3. 同样会四舍五入

```js
console.log((123.456).toExponential(0));     // "1e+2"
console.log((123.456).toExponential(1));     // "1.2e+2"
console.log((123.456).toExponential(2));     // "1.23e+2"
console.log((123.456).toExponential(3));     // "1.235e+2"
console.log((123.456).toExponential());     // "1.23456e+2"
```

### `Number.prototype.toLocaleString()`


### `toString()`
其他进制会被转换为十进制，指数形式会被展开
```js
console.log((11).toString());     // 11
console.log((0b11).toString());   // 3
console.log((0o11).toString());   // 9
console.log((0x11).toString());   // 17
console.log((1.1e+2).toString()); // 10
```


## `NaN`
1. `NaN`, short for Not a Number, which is used to indicate when an operation
intended to return a number has failed (as opposed to throwing an error). 不懂，
为什么不抛出错误。
2. 当判断是一个值是否是`NaN`时，要使用`Number.isNaN()`。不要用`isNaN()`，因为它会对非
数值参数进行转型。
    ```js
    console.log( isNaN(undefined) );         // true   Number(undefined) returns NaN
    console.log( Number.isNaN(undefined) );  // false
    console.log( isNaN("blue") );            // true   Number("blue") returns NaN
    console.log( Number.isNaN("blue") );     // false
    ```


## `-0`
```js
console.log( -0 + -0 );  // -0
console.log( -0 - -0 );  // 0
console.log( 0 / -3 );   // -0
console.log( 0 * -3 );   // -0

console.log( 0 * -Infinity );   // NaN
console.log( -0 * -Infinity );  // NaN
console.log( 3 / -Infinity );   // -0
console.log( -3 / Infinity );   // -0

console.log( (-0).toString() );      // '0'
console.log( String(-0) );           // '0'
console.log( JSON.stringify(-0) );   // '0'

console.log( Number('-0') );              // -0
console.log( JSON.parse('-0') );          // -0
console.log( Number.parseInt('-0') );     // -0
console.log( Number.parseFloat('-0') );   // -0

console.log( 0 === -0 );          // true
console.log( 0 > -0 );            // false
console.log( Object.is(0, -0) );  // false

function isNegZero(n){
    return Object.is(n, -0);
}
```
