# Number


##  Number in JS
1. Unlike many languages, JavaScript does not make a distinction between integer
 values and floating-point values. All numbers in JavaScript are represented as
 floating-point values.
2. JavaScript represents numbers using the 64-bit floating-point format defined
by the IEEE 754 standard, which means it can represent numbers as large as
`±1.7976931348623157 × 10^308` and as small as `±5 × 10^−324`.
3. The JavaScript number format allows you to exactly represent all integers
between `−9007199254740992 (−2^53)` and `9007199254740992 (2^53)`, inclusive.
However, certain operations in JavaScript (such as array indexing and the
bitwise operators) are performed with 32-bit integers.
4. `Number.isInteger()` 判断一个值是否为整数。需要注意的是，在 JavaScript 内部，整数
和浮点数是同样的储存方法，所以`3`和`3.0`被视为同一个值，都会返回`true`
5. 支持 Scientific notation
    ```js
    console.log(3.14e6); // 3140000
    ```


## 进制
1. ES6提供了二进制数字的写法，使用前缀0b或0B
2. ES6之前，八进制字面值的第一位必须是0.如果字面值中的数值超出了范围，那么前导0将被忽略，后面的数值将当做十进制数值解析。
     var octalNum=08   //无效的八进制数值——解析为8
3. ES6之前，八进制字面量在严格模式下是无效的，会导致支持的JavaScript引擎抛出错误。但ES6提供了八进制的新前缀：0o或0O
4. 十六进制字面值的前两位必须是0x或0X，字母A~F可以大写也可以小写。
5. 在进行算术计算时，所有以八进制和十六进制表示的数值最终都将被转换为十进制数值。


## Range of Values
### JS number range
Not all numbers in the world can be represented in ECMAScript, because of
memory constraints. The smallest number that can be represented in ECMAScript is stored in `Number.MIN_VALUE`, the largest number is stored in `Number.MAX_VALUE`

### Safe range
* JavaScript uses double-precision floating-point format numbers as
specified in IEEE 754 and can only safely represent numbers between
`-(2^53 - 1)` and `2^53 - 1`, not contained.
* Safe in this context refers to the ability to represent integers exactly
and to correctly compare them.
* `Number.isSafeInteger()` detects whether provided value is a integer in
safe range.
* You should not only test whether the result of calculation is within safe
range, but also test each number of calculation involved.

### Underflow
1. Underflow occurs when the result of a numeric operation is closer to zero than
the smallest representable number. In this case, JavaScript returns `0`.
2. If underflow occurs from a negative number, JavaScript returns a special
value known as "negative zero". This value is almost completely
indistinguishable from regular zero and JavaScript programmers rarely need to
detect it.

### Infinity
1. Division by zero is not an error in JavaScript: it simply returns `-Infinity`
 or `Infinity`. There is one exception: zero divided by zero does not have a well defined value, and the result of this operation is `NaN`;
2. If the result of a calculation is out of range, it will be converted to the corresponding `-Infinity` or `Infinity`
3. `-Infinity` or `Infinity` are stored in `Number.NEGATIVE_INFINITY` and `Number.POSITIVE_INFINITY`.
4. `Number.isFinite()` return `true` if the parameter is a finite number. If
parameter is not a number ,`isFinite()` will convert parameter to a number, but
`Number.isFinite()` will not.
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
```js
Number.isInteger()
Number.isSafeInteger()
```
### 32-bit (Signed) Integers
1. While integers can range up to roughly 9 quadrillion safely (53 bits), there
are some numeric operations (like the bitwise operators) that are only defined
for 32-bit numbers, so the "safe range" for numbers used in that way must be
much smaller.
2. The range then is `Math.pow(-2,31)` up to `Math.pow(2,31)-1`.
3. Certain special values such as `NaN` and `Infinity` are not "32-bit safe," in
 that those values when passed to a bitwise operator will pass through the
abstract operation `ToInt32` and become simply the `+0` value for the purpose of
 that bitwise operation.


## Floating point
1. Omission of integer part or fractional part is ok if it is zero, but it is
not recommended.
    ```js
    console.log( .5 ); // 0.5
    console.log( 5. ); // 5
    ```
2. Access priority of decimal separator is higher than that of dot for property
access.
    ```js
    3.toString(); // SyntaxError: Invalid or unexpected token
    // The dot will be interpreted a decimal separator, which will form a valid
    // number with `3`. But function name or variable name can not start with a
    // number

    3 .toString(); // 3
    // [White Space](https://tc39.github.io/ecma262/#sec-white-space)

    3..toString() // '3'  
    // `3.` will form a valid number, and the second dot will be interpreted as
    // a proerty access operator

    0.3.toString() // '0.3'  

    obj..3 = 333; // SyntaxError: Unexpected number
    // The first dot will be interpreted as a decimal separator, but `obj.` is
    // not a valid nuber
    ```
3. Because storing floating-point values uses twice as much memory as storing
integer values, ECMAScript always looks for ways to convert values into integers
    ```js
    var floatNum1 = 1.; // missing digit after decimal - interpreted as integer 1
    var floatNum2 = 10.0; // whole number - interpreted as integer 10
    ```


## Binary Floating-Point and Rounding Errors
* There are infinitely many real numbers, but only a finite number of them
(18437736874454810627, to be exact) can be represented exactly by the JavaScript
 floating-point format. This means that when you’re working with real numbers in
 JavaScript, the representation of the number will often be an approximation of
the actual number.
* The IEEE-754 floating-point representation used by JavaScript is a binary
representation, which can exactly represent fractions like `1/2`, `1/8`, and
`1/1024`. Unfortunately, the fractions we use most commonly are decimal
fractions `1/10`, `1/100`, and so on. Binary floating-point representations
cannot exactly represent numbers as simple as `0.1`.
    ```js
    let x = 0.3 - 0.2;
    let y = 0.2 - 0.1;
    console.log( x === y );    // false
    console.log( x === 0.1 );  // false
    console.log( y === 0.1 );  // true
    ```
* Because of rounding error, the difference between the approximations of `0.3`
and `0.2` is not exactly the same as the difference between the approximations
of `0.2` and `0.1`.
* The computed values are adequate for almost any purpose: the problem arises
when we attempt to compare values for equality
* A future version of JavaScript may support a decimal numeric type that avoids
these rounding issues. Until then you might want to perform critical financial
calculations using scaled integers. For example, you might manipulate monetary
values as integer cents rather than fractional dollars.
* The most commonly accepted practice is to use a tiny "rounding error" value as
 the tolerance for comparison. This tiny value is often called "machine epsilon"
  which is commonly `2^-52 (2.220446049250313e-16)` for the kind of numbers in
 JavaScript. `Number.EPSILON` is predefined with this tolerance value:
```js
let x = 0.3 - 0.2;
let y = 0.2 - 0.1;
console.log( x === y );    // false
console.log( numbersCloseEnoughToEqual(x, y) );  // true

function numbersCloseEnoughToEqual(n1, n2) {
	return Math.abs( n1 - n2 ) < Number.EPSILON;
}
```


## 数值转换
There are three functions that convert non-numeric values to numeric value:
`Number()`, `Number.parseInt()` and `Number.parseFloat()`

### `Number()`
The `Number()` function performs conversions based on these rules:
* When applied to Boolean values, `true` and `false` get converted into `1` and
`0`, respectively.
* When applied to numbers, the value is simply passed through and returned its
decimal format.
* When applied to `null`, `Number()` returns 0.
* When applied to `undefined`, `Number()` returns `NaN`;
* When applied to strings, the following rules are applied:
    * If the string contains only numbers, optionally preceded by a plus or
    minus sign, it is always converted to a decimal number, leading zeros are
    ignored.
    * If the string contains a valid fl oating-point format, such as, it is
    converted into the appropriate floating-point numeric value. Once again,
    leading zeros are ignored.
    * If the string contains a valid hexadecimal format, octal format or binary
    format, it is converted into its decimal format.
    * If the string is empty, it is converted to 0.
    * If the string contains anything other than these previous formats, it is converted into `NaN`.
* When applied to objects, the `valueOf()` method is called and the returned
value is converted based on the previously described rules. If that conversion
results in `NaN`, the `toString()` method is called and the rules for converting strings are applied.

2.第一个函数，即转型函数可以用于任何数据类型。另外两个函数则专门用于把字符串转换成数值。实测后两个也可以转换首项是数字或数字字符串的数组，但不能转换布尔值。
3.这三个函数对于同样的输入会有返回不同的结果。
4.转换极大或极小的整数时会返回个位数，因为使用了e底数的计数法。
5.一元加操作符的操作与Number()函数相同

parseInt和parseFloat在这种情况下返回NaN

### `Number.parseInt()`
* Leading white space in the string is ignored until the first non–white space character is found.
* If this first character isn’t a number, the minus sign, or the plus sign,  `Number.parseInt()` always returns `NaN`.
* Empty string returns `NaN` (unlike with `Number()`, which returns `0`)
* If the first character is a number, plus, or minus, then the conversion goes
on to the second character and continues on until either the end of the string
is reached or a nonnumeric character is found.
* This function can automatically recognizes hexadecimal integer string, but can
 not recognize octal and binary integer string.
* If the type of parameter is number, this function will return the decimal
value of this number.

### `Number.parseFloat()`
* If the string represents a whole number (no decimal point or only one or more
zero after the decimal point), `Number.parseFloat()` returns an integer.
* Empty string returns `NaN`
* Unlike `Number.parseInt()`, this function can only recognize decimal number
string. But it can also will return decimal value of the parameter which is a
number type.
* Parsing accuracy is limited
    ````js
    let result = Number.parseFloat( '1.337000012397766117451156851189711');
    console.log( result ); // 1.3370000123977661
    ````


## `NaN`
1. `NaN`, short for Not a Number, which is used to indicate when an operation
intended to return a number has failed (as opposed to throwing an error).
2. Any operation involving `NaN` always returns `NaN`.
3. `NaN` is not equal to any value, including `NaN`.
4. `Number.isNaN()` and `isNaN()`
When a value is passed into `isNaN()`, an attempt is made to convert it into a
number by `Number()`.
```js
console.log( isNaN(undefined) );         // true   Number(undefined) returns NaN
console.log( Number.isNaN(undefined) );  // false
console.log( isNaN("blue") );            // true   Number("blue") returns NaN
console.log( Number.isNaN("blue") );     // false
```
Don't use `isNaN()`


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
