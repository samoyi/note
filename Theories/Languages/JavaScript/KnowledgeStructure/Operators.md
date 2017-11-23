# Operators
Operators are unique in ECMAScript in that they can be used on a wide range of
values, including strings, numbers, Booleans, and even objects. When used on
objects, operators typically call the `valueOf()` and/or `toString()` method to
retrieve a value they can work with.




## 一元操作符——————————————————————————————————————————————————————————————————
一.递增和递减操作符，分为前置型和后置型。
1. 不管是前置还是后置，这个表达式都会对变量进行加一或减一，如果变量不是数值类型会先试图转换为数值类型。但两者的返回值不同：前置语句返回自增或自减之后的值，而后置型的返回原来的值。

2.所有这四个操作符对任何值都适用，还可以用于字符串、布尔值、浮点数和对象。在应用于不同的值时，递增和递减操作符遵循下列规则：
     （1）在应用于一个包含有有效数字字符的字符串时，先将其转换为数字值，再执行操作。字符串变量变成数值变量。
     （2）在应用于一个不包含有效数字字符串时，将变量的值设置为NaN，字符串变量变成数值变量。
     （3）在应用于布尔值false时，先将其转换为0再执行操作。布尔值变量变成数值变量。
     （4）在应用于布尔值true时，先将其转换为1再执行操作。布尔值变量变成数值变量。
     （5）在应用于浮点数值时，直接执行操作。
     （6）在应用于对象时，先调用对象的valueOf()方法以取得一个可供操作的值。然后对该值应用前述规则。

二.一元加减操作符
1.一元加减操作符放在数值前面，对数值不会产生任何影响。
var a=12;
a=+a;   //仍然是12
2.在对非数值应用时，一元加操作符会像Number()转型函数一样对这个值执行转换。布尔值转换为0和1，字符串值按照一组特殊的规
    则进行解析，而对象是先调用它们的valueOf()和（或）toString()方法，再转换得到的值。
3.一元减操作符主要用于表示负数。而当应用于非数值时，一元减操作符遵循与一元加操作符相同的规则，最后再将得到的数值转换为
    负数。

位操作符———————————————————


***
## Bitwise Operators
### Basic
1. All numbers in ECMAScript are stored in IEEE-754 64-bit format, but the
bitwise operations do not work directly on the 64-bit representation. Instead,
the value is converted into a 32-bit integer, which in the range of
`[-2147483648, 2147483647]`,the operation takes place, and the result is
converted back into 64 bits. To the developer, it appears that only the 32-bit
integer exists, because the 64-bit storage format is transparent.
2. A curious side effect of this conversion is that the special values `NaN` and
 `Infinity` both are treated as equivalent to `0` when used in bitwise
operations.
3. Signed integers use the first 31 of the 32 bits to represent the numeric
value of the integer. The 32nd bit represents the sign of the number: `0` for
positive or `1` for negative.
4. Depending on the value of that bit, called the sign bit, the format of the
rest of the number is determined.
5. Positive numbers are stored in true binary format, with each of the 31 bits
representing a power of `2`, starting with the first bit (called bit 0),
representing 2<sup>0</sup> , the second bit represents 2<sup>1</sup>, and so on.
6. Negative numbers are also stored in binary code but in a format called *two’s
 complement*. The two’s complement of a number is calculated in three steps:
    1. Determine the binary representation of the absolute value (for example,
    to find `–18`, first determine the binary representation of `18`).
    2. Find the `one’s complement` of the number, which essentially means that
    every `0` must be replaced with a `1` and vice versa.
    3. Add `1` to the result.
    ```js
    function twosComplement( nDecimal ){
        if( !Number.isInteger(nDecimal) || nDecimal>-1 || nDecimal<-2147483648 ){ // 2^31
            throw new RangeError('The twosComplement function can only handle integers between [-1, -2147483648]');
        }

        let sOnesComplement = Math.abs(nDecimal)
                              .toString(2)
                              .replace(/0/g, "2").replace(/1/g, "0").replace(/2/g, "1")
                              .padStart(32, '1');

        return (Number.parseInt(sOnesComplement, 2) + 1).toString(2);
    }
    ```
    ```js
    -1            11111111111111111111111111111111
    -2            11111111111111111111111111111110
    -3            11111111111111111111111111111101
    -2147483646   10000000000000000000000000000010
    -2147483647   10000000000000000000000000000001
    -2147483648   10000000000000000000000000000000
    ```
7. ECMAScript does its best to keep all of this information from you. When
outputting a negative number as a binary string, you get the binary code of the
absolute value preceded by a minus sign:
    ```js
    console.log(-18..toString(2)); // '-10010'
    ```
8. If a bitwise operator is applied to a nonnumeric value, the value is first
converted into a number using the `Number()` function automatically and then the
 bitwise operation is applied. The resulting value is a number.

### Bitwise NOT
* `~`: returns the one’s complement of the number.
    ```js
    console.log(~26);        // -27
    console.log(~-26);       // 25
    console.log(~0);         // -1
    console.log(~NaN);       // -1
    console.log(~Infinity);  // -1
    ```
* 可以看出来十进制数的位操作也有着明显的规律，通过再次分析计算机存储负数的方法来探明其中
的规律。Let's imagine how computer store a negative number:
    1. Found a token, say `-18`
    2. Ignore the negative sign, got `18`
    3. Save this token in memory, as `00000000 00000000 00000000 00010010`
    4. Bitwise-not it, got `11111111 11111111 11111111 11101101`
    5. Add `1`, the result is `11111111 11111111 11111111 11101110`  
* 如果你对一个正数按位非，然后再加一，结果就是这个正数的相反数。即，一个正数`n`的相
反数再减一就是它的按位非结果（`-n-1`）；相反的过程，如果你对一个负数减一，然后再按位
非，结果就是这个负数的相反数。即，一个负数减一的按位非是该负数的相反数，也即，一个负
数`n`的按位非结果等于对该负数加一再求相反数（`-(n+1)`）。
    ```js
    function bitwiseNOT(n){
        return -n - 1
    }
    ```
* The summary above is actually not much useful, bitwise operation is not used
to achieve a faster math calculation.

### Bitwise AND
* `&`

### Bitwise OR
* `|`

### Bitwise XOR
* `^`: when different returns `1`, when same returns `0`

### Left Shift
* `<<`

### Signed Right Shift
* `>>`: The empty bits occur at the left of the number but after the sign bit

### Unsigned Right Shift
* `>>>`
* For numbers that are negative, the empty bits get fi lled with zeros
regardless of the sign of the number.
* Because the negative number is the two’s complement of its absolute value, the
 number becomes very large if not only moved a few bits.


布尔操作符————————————————————

一.逻辑非
逻辑非操作符由一个叹号（!）表示，可以用于ECMAScript中的任何值。无论这个值是什么数据类型，这个操作符都会返回一个布尔值。逻辑非操作符首先会将它的操作数转换为个布尔值，然后再对其求反。



二.逻辑与
1.逻辑与操作属于短路操作，即如果第一个操作数能够决定结果，那么就不会再对第二个操作数求值
var a=true;
var result=(a && someUndefinedVariable);      //这里会发生错误
alert(result);                                //这里不会执行

var a=false;
var result=(a && someUndefinedVariable);      //这里不会发生错误
alert(result);                                //这里会执行

2..逻辑与操作符（&&），在有一个操作数不是布尔值的情况下，逻辑结果就不一定返回布尔值：
这里的原理是，根据上面短路操作原理，返回一个操作数，这个操作数决定了这两个操作数逻辑与的布尔值。
     （1）如果第一个操作数是非null对象，则返回第二个操作数；（这里第一个是true，所以第二个操作数决定整体
     （2）如果第二个操作数是非null对象，则只有在第一个操作数的求值结果为true的情况下才会返回该对象；(如果第一个是false，就没必要再看第二个了
     （3）如果两个操作数都是非null对象，则返回第二个操作数；（第一个为true，所以最终结果由第二个决定
     （4）如果有一个操作数是null，则返回null；
     （5）如果有一个操作数是NaN，则返回NaN；
     （6）如果有一个操作数是undefined，则返回undefined。
可以推得，如果null、NaN、undefined两个或三个连在一起，返回的是最前面的。因为最前面的就已经决定了整个组合是false了


四.逻辑或
1.逻辑或操作符（），如果有一个操作数不是布尔值，逻辑或也不一定返回布尔值：
     （1）如果第一个操作数是非空对象，则返回第一个操作数；
     （2）如果第一个操作数的求值结果是false，则返回第二个操作数；
     （3）如果两个操作数都是非空对象，则返回第一个操作数；
     （4）如果两个操作数都是null，则返回null；
     （5）如果两个操作数都是NaN，则返回NaN；
     （6）如果两个操作数都是undefined，则返回undefined。

* 五.逻辑或运算符也是短路操作符。我们可以利用逻辑或的这一行为来避免为变量赋null或undefined值：
var myObject = preferredObject backupObject;
        在这个例子中，变量myObject将被赋予等号后面两个值中的一个。变量preferredObject中包含优先赋给变量myObject的值，变量backupObject
    负责在preferredObject中不包含有效值的情况下提供后备值。如果preferredObject的值不是null，那么它的值将被赋给myObject；如果是null，则
    将backupObject的值赋给myObject。

* 六. 使用逻辑运算符实现if-else的功能
 a || b() 相当于：
```
if( !a )
{
    b()
}
```
a && b() 相当于：
```
if( a )
{
    b();
}
```
例如函数的有一个可选的回调函数参数，则函数内部可以写成：
```
callback && callback();
```


乘性操作符——————————————————————
     ECMAScript定义了3个乘性操作符：乘法、除法和求模。在操作符为非数值的情况下会调用Number()函数执行自动的类型转换。
一.乘法。在处理特殊值的情况下，乘法操作符遵循下列特殊的规则：
     （1）如果有一个操作数是NaN，则结果是NaN；
     （2）如果Infinity与0相乘，结果是NaN；
     （3）如果正负Infinity与非0数值相乘，结果是正负Infinity；
     （4）如果无穷之间相乘，解释仍然是无穷，正负号也相乘；
     （5）如果有一个操作数不是数值，则在后台调用Number()，然后再应用上面的规则。
二.除法。在处理特殊值的情况下，除法操作符遵循下列特殊的规则：
     （1）如果有一个操作数是NaN，则结果是NaN；
     （2）如果无穷除无穷，结果是NaN；
     （3）如果是0被0除，结果是NaN；
     （4）如果是非零的有限数被0除，则结果是无穷。符号取决于该有限数和0两者的符号。（有-0）
     （5）如果是无穷被任何非零数值除，结果还是无穷
     （6）如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，然后再应用上面的规则。
三.求模。
1. 结果的符号和被除数相同
2. it also works for floating-point values. 同样要注意浮点数计算的不准确性
    console.log( -7.2%3.5 ); // -0.20000000000000018
3. 在处理特殊值的情况下，求模操作符遵循下列特殊的规则：
     （1）如果被除数无穷而除数有穷，则结果是NaN；
     （2）如果除数是0，则结果是NaN；
     （3）如果无穷被无穷除，结果是NaN；
     （4）如果被除数是有限大的数值而除数是无限大的数值，则结果是被除数；
     （5）如果被除数是0，则结果是0；
     （6）如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，然后再应用上面的规则。

加性操作符————————————————————
加性操作符也会在后台转换不同的数据类 型。然而，对于加性操作符而言，相应的转换规则还稍微有点复杂。
一.加法
     （1）如果有一个操作数是NaN，则结果是NaN；
     （2）正无穷加正无穷等于正无穷，负无穷加负无穷等于负无穷，正无穷加负无穷结果为
            NaN；
     （3）+0加+0，结果是+0；-0加-0，结果是-0；+0加-0，结果是+0。没发现+0和-0有什么区别，全等测试也返回true
     （6）如果两个操作数都是字符串，则将第二个操作数与第一个操作数拼接起来；
     （7）如果只有一个操作数是字符串，则将另一个操作数转换为字符串，然后再将两个字符串拼接起来；
     （8）如果有一个操作数是对象、数值或布尔值，则调用它们的toString()方法取得相应的字符串值，然后再相加。对于undefined和null，则分别调用String()函数并取得字符串。
  2.减法
     （1）如果有一个操作数是NaN，则结果是NaN；
     （2）正无穷减正无穷结果为NaN，负无穷减负无穷结果为NaN，正无穷减负无穷结果为正无穷，负无穷减正无穷结果为负无穷；
     （3）+0减+0，结果是+0；+0减-0，结果是-0；-0减-0，结果是+0；
     （6）如果有一个操作数是字符串、布尔值、null或undefined，则现在后台调用Number()函数将其转换为数值然后再执行减法计算；
     （7）如果有一个操作数是对象，则调用对象的valueOf()方法以取得表示该对象的数值。如果对象没有valueOf()方法，则调用其toString()方法。

指数操作符————————————————————
ES7新增的指数运算符 **
2 ** 3 // 8
1. 指数运算符可以与等号结合，形成一个新的赋值运算符（**=）







关系操作符————————————————————
一.当关系操作符的操作数使用了非数值时，也要进行数据转换或完成某些奇怪的操作：
     （1）如果两个操作数都是字符串，则比较两个字符串对应的字符串编码；
     （2）如果一个操作数是数值，则将另一个操作数转换为数值，然后进行比较；
     （3）如果有一个操作数是对象，则调用对象的valueOf()方法以取得表示该对象的数值。如果对象没有valueOf()方法，则调用其toString()方法。
     （4）如果一个操作数是布尔值，则先将其转化为数值，然后再执行比较。
二.比较字符串时，实际比较的是两个字符串中对应位置的每个字符的字符编码值
alert("23"<"3");    //true
alert(23<"3");      //false。因为“3”会先被转化为数值
三.任何操作数与NaN进行关系比较，结果都是false。
四.不能连续比较，比如 3<a<9


相等操作符——————————————————————
一.相等（==）和不相等（!=）：两个操作符都会先转换操作数，然后再比较；
     （1）如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值；
     （2）如果一个操作数是字符串，另一个操作数是数值，先将字符串转为数值；
     （3）如果一个操作数是对象，另一个操作数不是，则调用对象的ValueOf()方法，用得到的基本类型值比较；
     （4）null和undefined相等；
     （5）要比较相等性之前，不能将null和undefined转换成其他任何值；
     （6）如果有一个操作数是NaN，则相等操作符返回false，而不相等操作符返回true；
     （7）即使两个操作数都是NaN，相等操作符也返回false。因为NaN和任何数包括它自己都不相等；
     （8）如果两个操作数都是对象，则比较它们是不是同一个对象。如果是则返回true，否则返回false。
     （9）null和0不相等，undefined和0也不相等。
二.全等（===）和不全等（!==）：不转换类型直接比较。
     由于相等和不相等操作符存在类型转换问题，而为了保持代码中数据类型的完整性，我们推荐使用全等和不全等操作符。

条件操作符————————————————————
     variable = boolean_expression ? true_value : false_value;

赋值操作符————————————————————
     每个主要算数操作符（以及个别的其他操作符）都有对应的赋值操作符：
     *=        /=        %=        +=        -=        <<=       >>=       >>>=
     设计这些操作符的主要目的就是简化赋值操作，使用它们不会带来任何性能的提升。

逗号操作符————————————————————
     逗号操作符可以在一条语句中执行多个操作，多用于声明多个变量
     var num1=1,num2=2,num3=3;
     逗号操作符还可用于赋值，总会返回表达式中的最后一项
var num = (4,5,2,8);     //num的值为8。看起来好像没什么意义

in操作符————————————————————
It evaluates to true if the left-side value is the name of a property of the right-side object.
var obj = {
    a:12,
    b:123
 };
 alert("b" in obj);       //true

let arr = [1, 3];;
console.log( 0 in arr); // true  arr[0]
console.log( 3 in arr); // false arr[3]


## delete操作符   
* 它用来删除对象属性或者清空数组元素
* 针对对象是删除其整个属性（而不仅仅是属性值），而针对数组并不是删除，而是清空该项的内容。而是用数组的splice方法，则是彻底删除该项，后面的项也会一次修改序号
```
let a1 = ["a", "b", "c"];
console.log( a1[1] ); //b
delete a1[0];
console.log( a1[1] ); //b
console.log( a1 ); // [undefined, "b", "c"]

let a2 = ["a", "b", "c"];
console.log( a2[1] ); //b
a2.splice(1, 1);
console.log( a2[1] ); //c
console.log( a2 ); // ["a", "c"]
```
* only deletes own properties, not inheritedones.
* delete does not remove properties that have a configurable attribute of false, but it will remove configurable properties of nonextensible objects
* 返回值
    * 返回true的情况
        * delete succeeded
        * the delete had no effect(such as deleting a nonexistent property)
        * when used with an expression that is not a property access expression
    * 返回false的情况: 严格模式下会报错的情况，在非严格模式下会返回false
* 如果对变量使用delte，非严格模式下会静默失败，严格模式下报错。删除其他类型的值有些会在严格模式下报错，有些不一定，比如上面删除数字值虽然无意义但不会报错。
* 使用var声明的全局变量会作为window的属性，但其configurable特性为false，不能通过delete删除




## 运算符优先级
下表按照运算符的优先级排序的，前面的运算符优先级要高于后面的运算符优先级。被水平分割线分隔开来的运算符具有不同的优先级。标题为A的列表示运算符的结合性，L（从左至右）或R（从右至左），标题为N的列表示操作数的个数。标题为“类型”的列表示期望的操作数类型，以及运算符的结果类型（在“→”符号之后）。
![image](http://note.youdao.com/yws/public/resource/dec185d3327b2d9cb540bb06bd81edd8/xmlnote/AFB0FCA5A0AB4BCAA46D399F4F229EE9/50596)
