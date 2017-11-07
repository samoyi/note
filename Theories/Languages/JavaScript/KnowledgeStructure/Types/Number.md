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
4. `Number.isInteger()` 判断一个值是否为整数。需要注意的是，在JavaScript内部，整数
和浮点数是同样的储存方法，所以3和3.0被视为同一个值，都会返回true



***
## 进制
1. ES6提供了二进制数字的写法，使用前缀0b或0B
2. ES6之前，八进制字面值的第一位必须是0.如果字面值中的数值超出了范围，那么前导0将被忽略，后面的数值将当做十进制数值解析。
     var octalNum=08   //无效的八进制数值——解析为8
3. ES6之前，八进制字面量在严格模式下是无效的，会导致支持的JavaScript引擎抛出错误。但ES6提供了八进制的新前缀：0o或0O
4. 十六进制字面值的前两位必须是0x或0X，字母A~F可以大写也可以小写。
5. 在进行算术计算时，所有以八进制和十六进制表示的数值最终都将被转换为十进制数值。



***
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



***
## Binary Floating-Point and Rounding Errors
* There are infinitely many real numbers, but only a finite number of them (18437736874454810627, to be exact) can be represented exactly by the JavaScript floating-point format. This means that when you’re working with real numbers in JavaScript, the representation of the number will often be an approximation of
the actual number.
* The IEEE-754 floating-point representation used by JavaScript is a binary representation, which can exactly represent fractions like `1/2`, `1/8`, and
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
these rounding issues. Until then you might want to perform critical financial calculations using scaled integers. For example, you might manipulate monetary
values as integer cents rather than fractional dollars.
* The most commonly accepted practice is to use a tiny "rounding error" value as
 the tolerance for comparison. This tiny value is often called "machine epsilon"
  which is commonly `2^-52 (2.220446049250313e-16)` for the kind of numbers in JavaScript. `Number.EPSILON` is predefined with this tolerance value:
    ```js
    let x = 0.3 - 0.2;
    let y = 0.2 - 0.1;
    console.log( x === y );    // false
    console.log( numbersCloseEnoughToEqual(x, y) );  // true

    function numbersCloseEnoughToEqual(n1, n2) {
    	return Math.abs( n1 - n2 ) < Number.EPSILON;
    }
    ```



***
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



***
## NaN
1.NaN，即非数值（Not a Number）是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。
2. 任何涉及NaN的操作都会返回NaN。
3. NaN does not compare equal to any other value, including itself. 但通过ES6的 Object.is()方法是，它和它本身相等。
4. isNaN()
（1）ES6之前这是全局方法，且如果参数不是数字，会先调用Number()函数转换为数字再判断；ES6将其作为Number的方法，且不再转型。
（2）在接收到一个值后，会尝试转换为数值(ES6之前)，任何不能被转换为数值的值都会导致这个函数返回true：
```
alert(isNaN(NaN));      //true
alert(Number.isNaN(10));       //false
alert(isNaN("10"));     //false (可以被转换为数值10)
alert( isNaN(undefined) ); // true Number(undefined) 返回NaN
alert( Number.isNaN(undefined) ); // false 不调用Number()转型
alert(isNaN("blue"));   //true  (Number("blue") return NaN)
alert(Number.isNaN("blue"));   //false  (不发生转型,"blue"显然不是NaN)
alert(isNaN(true));     //false (可以被转换为数值1）
```
可以看出来，因为ES6之前isNaN会转型，所以不能直接用它判断一个值本身是不是NaN，必须再同时确定该值 typeof 为 number才行



***
## 数值转换
1.有三个函数可以把非数值转换为数值：Number()、Number.parseInt()和Number.parseFloat()。
2.第一个函数，即转型函数可以用于任何数据类型。另外两个函数则专门用于把字符串转换成数值。实测后两个也可以转换首项是数字或数字字符串的数组，但不能转换布尔值。
3.这三个函数对于同样的输入会有返回不同的结果。
4.转换极大或极小的整数时会返回个位数，因为使用了e底数的计数法。
5.一元加操作符的操作与Number()函数相同

6.Number()函数的转换规则如下：
     （1）如果是Boolean值，true和false将分别被转换为1和0.
     （2）如果是数字值，只是简单的传入和返回。（其他进制会转换到10进制）
     （3）如果是null值，返回0。
     （4）如果是undefined，返回NaN。
     （5）如果是字符串，遵循下列规则：
          ①如果字符串只包含数字（包括前面带正负号的情况），则将其转换为十进制数值。（”011“会被转换为11）
          ②如果字符串中包含有效的浮点格式，则将其转换为对应的浮点数值。（同样忽略前导零）
          ③如果字符串包含有效的十六进制格式，则将其转换为相同大小的十进制整数值。
          ④如果字符串是空的，则将其转换为0。parseInt和parseFloat在这种情况下返回NaN
          ⑤如果字符串包含除上述格式以外的字符，则将其转换为NaN。
    （6）如果是对象，则调用对象的valueOf()方法，然后依照前面的规则转换返回的值。如果转换的结果是NaN，则调用对象的toString()方法，然后再次依照前面的规则转换返回的字符 串值。不懂
7.Number.parseInt()。
（1）ES6之前这是全局方法，ES6将其作为Number的方法
     （2）parseInt()会忽略字符串前面的空格，直到找到第一个非空格字符
     （3）如果第一个非空格字符不是数字字符或者正负号，会返回NaN
     （4）如果第一个字符是数字字符或者正负号，会继续解析下一个，直到解析完后续的所有数字字符或者是遇到一个非数字字符。
     （5）parseInt()可以默认可以识别八进制和十六进制，并解析返回为十进制。ECMAScript 5已经不能识别八进制。但通过传参可以
            识别任何进制，而且不用写成八进制或十六进制格式。和toString()效果相反
     （6）建议无论在什么情况下都明确指定基数。
8. Number.parseFloat()
（1）ES6之前这是全局方法，ES6将其作为Number的方法
（2）如果字符串包含的是一个可解析为整数的数（没有小数点或者小数点后全是0），将会返回整数。
（3）看起来，不管是ES6的还是之前的该方法，解析精度都比较有限
var parsedFloat1 = parseFloat( '1.337000012397766117451156851189711');
console.log( parsedFloat1 );// 1.3370000123977661
var parsedFloat2 = Number.parseFloat( '1.337000012397766117451156851189711');
console.log( parsedFloat2 );// 1.337000012397761
