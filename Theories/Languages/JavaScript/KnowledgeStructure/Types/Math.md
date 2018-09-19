# Math


## Math Object Properties
Property | Description
-- | --
Math.E | The value of `e`, the base of the natural logarithms
Math.LN10 | The natural logarithm of 10
Math.LN2 | The natural logarithm of 2
Math.LOG2E | The base 2 logarithm of `e`
Math.LOG10E | The base 10 logarithm of `e`
Math.PI | The balue of `π`
Math.SQRT1_2 | The square root of 1/2
Math.SQRT2 | The square root of 2


## Math Object Methods
### `min()` & `max()`
* 不传参的情况，前者返回正无穷，后者返回负无穷。与直觉正好相反
    ```js
    console.log(Math.min());     // Infinity
    console.log(Math.max());     // -Infinity
    ```

### `pow()`
* 关于各种特殊值的情况，参考[规范](http://es5.github.io/#x15.8.2.13)。
* 其中，负数的小数次方会返回`NaN`。但如果使用`Math.cbrt()`对负数开立方，却可以得出立方根。

**ES6新增了17个静态方法**

### `Math.cbrt(x)`
* Returns the cube root of a number.
* 与`Math.pow(-8， 1/3)`返回`NaN`不同，这里`Math.cbrt(-8)`返回的是-2
```js
console.log( Math.cbrt(8) ); // 2
console.log( Math.cbrt(-8) ); // -2
console.log( Math.cbrt(0) ); // 0
console.log( Math.cbrt(-0) ); // -0
console.log( Math.cbrt(Infinity) ); // Infinity
console.log( Math.cbrt(-Infinity) ); // -Infinity
console.log( Math.cbrt("8") ); // 2
console.log( Math.cbrt("-8") ); // -2
console.log( Math.cbrt("0") ); // 0
console.log( Math.cbrt("-0") ); // -0
console.log( Math.cbrt("Infinity") ); // Infinity
console.log( Math.cbrt("-Infinity") ); // -Infinity
console.log( Math.cbrt("s") ); // NaN
console.log( Math.cbrt(undefined) ); // NaN
console.log( Math.cbrt(null) ); // 0
```

### `Math.clz32(x)`
Returns the number of leading zeroes bits in the 32-bit binary representation of a number.
```js
console.log( Math.clz32(1) );          // 31
console.log( Math.clz32(1000) );       // 22
console.log( Math.clz32("1") );        // 31
console.log( Math.clz32("1000") );     // 22          
console.log( Math.clz32(Infinity) );   // 32
console.log( Math.clz32(-Infinity) );  // 32
console.log( Math.clz32("s") );        // 32
console.log( Math.clz32() );           // 32   
console.log( Math.clz32(undefined) );  // 32
console.log( Math.clz32(null) );       // 32
```

### `Math.expm1()`
Rreturns e^x - 1, where x is the argument, and e the base of the natural logarithms.
```js
console.log( Math.exp(3)-1 === Math.expm1(3) );    // true
```

### `Math.fround() `
* Returns the nearest single precision float representation of a number.
* 对于无法用64个二进制位精确表示的小数。这时，Math.fround方法会返回最接近这个小数的单精度浮点数。
```js
Math.fround(1.337) // 1.3370000123977661
// 64位二进制数无法准确表示1.337

var float1 = 1.3370000123977661;
var binary1 = float1.toString( 2 );
console.log( binary1 ); // 1.01010110010001011010001
// 1.3370000123977661可以用64位二进制精确的表示，所以后面其实都是0而省略了

var float2 = 1.337;
var binary2 = float2.toString( 2 );
console.log( binary2 ); //1.0101011001000101101000011100101011000000100000110001
// 1.337不可以用64位二进制精确的表示，所以它在binary1 的基础上会一直试图精确直到最长位数。
```

### `Math.hypot()`
```js
Math.hypot([value1[, value2[, ...]]])
```
* Returns the square root of the sum of squares of its arguments
*  If at least one of the arguments cannot be converted to a number, `NaN` is returned.
    ```
    console.log( Math.hypot(3, 4) );            // 5
    console.log( Math.hypot(5, 10, '10') );     // 15
    ```

### `Math.imul()`
<mark>不懂</mark>
* [阮一峰](http://es6.ruanyifeng.com/?search=imul&x=0&y=0#docs/number)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul)

### `Math.log1p()`
```js
Math.log1p(x)
```
Returns the natural logarithm (base `e`) of 1 + x number
```js
console.log( Math.log1p(3) ===  Math.log(3+1) );    // true
```

### `Math.log2(x)`
Returns the base 2 logarithm of a number

### `Math.sign(x)`
Returns the sign of the x, indicating whether x is positive, negative or zero.
```js
console.log( Math.sign(3.14) ); // 1
console.log( Math.sign(-3.14) ); // -1
console.log( Math.sign(0) ); // 0
console.log( Math.sign(-0) ); // -0
console.log( Math.sign(Infinity) ); // 1
console.log( Math.sign(-Infinity) ); // -1
console.log( Math.sign("3.14") ); // 1
console.log( Math.sign("-3.14") ); // -1
console.log( Math.sign("0") ); // 0
console.log( Math.sign("-0") ); // -0
console.log( Math.sign("Infinity") ); // 1
console.log( Math.sign("-Infinity") ); // -1
console.log( Math.sign("s") ); // NaN
console.log( Math.sign(undefined) ); // NaN
console.log( Math.sign(null) ); // 0
```

### `Math.trunc(x)`
Returns the integral part of the number x, removing any fractional digits.
```js
console.log( Math.trunc(3.14) ); // 3
console.log( Math.trunc(-3.14) ); // -3
console.log( Math.trunc(0) ); // 0
console.log( Math.trunc(-0) ); // -0
console.log( Math.trunc(Infinity) ); // Infinity
console.log( Math.trunc(-Infinity) ); // -Infinity
console.log( Math.trunc("3.14") ); // 3
console.log( Math.trunc("-3.14") ); // -3
console.log( Math.trunc("0") ); // 0
console.log( Math.trunc("-0") ); // -0
console.log( Math.trunc("Infinity") ); // Infinity
console.log( Math.trunc("-Infinity") ); // -Infinity
console.log( Math.trunc("s") ); // NaN
console.log( Math.trunc(undefined) ); // NaN
console.log( Math.trunc(null) ); // 0
```

### Hyperbolic Method
* `Math.sinh(x)` hyperbolic sine
* `Math.cosh(x)` hyperbolic cosin
* `Math.tanh(x)` hyperbolic tangent
* `Math.asinh(x)` inverse hyperbolic sin
* `Math.acosh(x)` inverse hyperbolic cosin
* `Math.atanh(x)` inverse hyperbolic tangent
