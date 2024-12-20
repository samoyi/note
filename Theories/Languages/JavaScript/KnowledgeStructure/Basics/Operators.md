<!-- vscode-markdown-toc -->
* 1. [一元操作符](#)
	* 1.1. [递增和递减操作符，分为前置型和后置型。](#-1)
	* 1.2. [一元加减操作符](#-1)
		* 1.2.1. [和模板字符串以及 `concat` 方法转字符串的不同](#concat)
	* 1.3. [Spread syntax](#Spreadsyntax)
		* 1.3.1. [Syntax](#Syntax)
		* 1.3.2. [Usage](#Usage)
* 2. [Bitwise Operators](#BitwiseOperators)
	* 2.1. [Basic](#Basic)
	* 2.2. [Bitwise NOT](#BitwiseNOT)
	* 2.3. [Bitwise AND](#BitwiseAND)
	* 2.4. [Bitwise OR](#BitwiseOR)
	* 2.5. [Bitwise XOR](#BitwiseXOR)
	* 2.6. [Left Shift](#LeftShift)
	* 2.7. [Signed Right Shift](#SignedRightShift)
	* 2.8. [Unsigned Right Shift](#UnsignedRightShift)
* 3. [布尔操作符](#-1)
	* 3.1. [逻辑非  `!`](#-1)
	* 3.2. [逻辑与  `&&`](#-1)
	* 3.3. [逻辑或  `||`](#-1)
	* 3.4. [使用逻辑运算符实现 `if` 的功能](#if)
	* 3.5. [Nullish coalescing operator `??`](#Nullishcoalescingoperator)
	* 3.6. [Logical nullish assignment `??=`](#Logicalnullishassignment)
	* 3.7. [Logical OR assignment `||=`](#LogicalORassignment)
	* 3.8. [Optional chaining `?.`](#Optionalchaining.)
		* 3.8.1. [Dealing with optional callbacks or event handlers](#Dealingwithoptionalcallbacksoreventhandlers)
* 4. [乘性操作符](#-1)
	* 4.1. [乘法](#-1)
	* 4.2. [除法](#-1)
	* 4.3. [求模](#-1)
* 5. [加性操作符](#-1)
	* 5.1. [加法](#-1)
	* 5.2. [减法](#-1)
* 6. [指数操作符 `**`](#-1)
* 7. [关系操作符 `>` `<`](#-1)
* 8. [相等操作符](#-1)
	* 8.1. [`==` 和 `!=`](#-1)
	* 8.2. [`===` 和 `!==`](#-1)
* 9. [条件操作符](#-1)
* 10. [赋值操作符](#-1)
* 11. [逗号操作符](#-1)
* 12. [`in`](#in)
* 13. [`delete`](#delete)
* 14. [运算符优先级](#-1)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># Operators

Operators are unique in ECMAScript in that they can be used on a wide range of values, including strings, numbers, Booleans, and even objects. When used on objects, operators typically call the `valueOf()` and/or `toString()` method to retrieve a value they can work with.


<!-- TOC -->

- [Operators](#operators)
    - [一元操作符](#一元操作符)
        - [递增和递减操作符，分为前置型和后置型。](#递增和递减操作符分为前置型和后置型)
        - [一元加减操作符](#一元加减操作符)
        - [Spread syntax](#spread-syntax)
            - [Syntax](#syntax)
            - [Usage](#usage)
                - [Replace apply](#replace-apply)
                - [Apply for `new`](#apply-for-new)
                - [拷贝和拼接数组](#拷贝和拼接数组)
                - [结合 destructuring 和 rest syntax](#结合-destructuring-和-rest-syntax)
                - [将字符串转为数组](#将字符串转为数组)
                - [将可遍历（iterable）对象转换为数组](#将可遍历iterable对象转换为数组)
                - [Spread in object literals](#spread-in-object-literals)
    - [Bitwise Operators](#bitwise-operators)
        - [Basic](#basic)
        - [Bitwise NOT](#bitwise-not)
        - [Bitwise AND](#bitwise-and)
        - [Bitwise OR](#bitwise-or)
        - [Bitwise XOR](#bitwise-xor)
        - [Left Shift](#left-shift)
        - [Signed Right Shift](#signed-right-shift)
        - [Unsigned Right Shift](#unsigned-right-shift)
    - [布尔操作符](#布尔操作符)
        - [逻辑非  `!`](#逻辑非--)
        - [逻辑与  `&&`](#逻辑与--)
        - [逻辑或  `||`](#逻辑或--)
        - [使用逻辑运算符实现 `if` 的功能](#使用逻辑运算符实现-if-的功能)
        - [Nullish coalescing operator `??`](#nullish-coalescing-operator-)
        - [Logical nullish assignment `??=`](#logical-nullish-assignment-)
        - [Logical OR assignment `||=`](#logical-or-assignment-)
        - [Optional chaining `?.`](#optional-chaining-)
            - [Dealing with optional callbacks or event handlers](#dealing-with-optional-callbacks-or-event-handlers)
    - [乘性操作符](#乘性操作符)
        - [乘法](#乘法)
        - [除法](#除法)
        - [求模](#求模)
    - [加性操作符](#加性操作符)
        - [加法](#加法)
        - [减法](#减法)
    - [指数操作符 `**`](#指数操作符-)
    - [关系操作符 `>` `<`](#关系操作符--)
    - [相等操作符](#相等操作符)
        - [`==` 和 `!=`](#-和-)
        - [`===` 和 `!==`](#-和-)
    - [条件操作符](#条件操作符)
    - [赋值操作符](#赋值操作符)
    - [逗号操作符](#逗号操作符)
    - [`in`](#in)
    - [`delete`](#delete)
    - [运算符优先级](#运算符优先级)

<!-- /TOC -->


##  1. <a name=''></a>一元操作符
###  1.1. <a name='-1'></a>递增和递减操作符，分为前置型和后置型。
1. 不管是前置还是后置，这个表达式都会对变量进行加一或减一，如果变量不是数值类型会先试图转换为数值类型。但两者的返回值不同：前置语句返回自增或自减之后的值，而后置型的返回原来的值。
2. 所有这四个操作符对任何值都适用，还可以用于字符串、布尔值、浮点数和对象。在应用于不同的值时，递增和递减操作符遵循下列规则：
    * 在应用于一个包含有有效数字字符的字符串时，先将其转换为数字值，再执行操作。
    * 在应用于一个不包含有效数字字符串时，将变量的值设置为 `NaN`。
    * 在应用于布尔值 `false` 时，先将其转换为 `0` 再执行操作。
    * 在应用于布尔值 `true` 时，先将其转换为 `1` 再执行操作。
    * 在应用于浮点数值时，直接执行操作。
    * 在应用于对象时，先调用对象的 `valueOf()` 方法以取得一个可供操作的值，然后对该值应用前述规则。

###  1.2. <a name='-1'></a>一元加减操作符
1. 一元加操作符放在数值前面，对数值不会产生任何影响。
2. 在对非数值应用时，一元加操作符会像 `Number()` 转型函数一样对这个值执行转换。布尔值转换为 `0` 和 `1`，字符串值按照一组特殊的规则进行解析，而对象是先调用它们的 `valueOf()` 和（或）`toString()` 方法，再转换得到的值。
3. 一元减操作符主要用于表示负数。而当应用于非数值时，一元减操作符遵循与一元加操作符相同的规则，最后再将得到的数值转换为负数。

####  1.2.1. <a name='concat'></a>和模板字符串以及 `concat` 方法转字符串的不同
1. `+` 转字符串是调用被转对象的 `valueOf` 方法，而模板字符串以及 `concat` 方法转字符串时是调用 `toString` 方法
    ```js
    const obj = {
        valueOf() {
            return "hello";
        },
        toString() {
            return "world";
        },
    };

    console.log("" + obj);       // hello
    console.log(`${obj}`);       // world
    console.log("".concat(obj)); // world
    ```
2. 如果不确定被转对象的 `valueOf` 是否会符合预期，那建议还是使用模板字符串或 `concat` 方法转字符串。

###  1.3. <a name='Spreadsyntax'></a>Spread syntax
Spread syntax allows an iterable such as an array expression or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected.

####  1.3.1. <a name='Syntax'></a>Syntax
* For function calls:
    ```js
    myFunction(...iterableObj);
    ```
* For array literals or strings:
    ```js
    [...iterableObj, '4', 'five', 6];
    ```
* For object literals (new in ECMAScript 2018):
    ```js
    let objClone = { ...obj };
    ```

####  1.3.2. <a name='Usage'></a>Usage
##### Replace apply
Any argument in the argument list can use spread syntax and it can be used multiple times:
```js
function myFunction(v, w, x, y, z) { }
var args = [0, 1];
myFunction(-1, ...args, 2, ...[3]);
```

##### Apply for `new`
1. When calling a constructor with `new`, it's not possible to directly use an array and `apply` (`apply` does a `[[Call]]` and not a `[[Construct]]`). However, an array can be easily used with `new` thanks to spread syntax:
    ```js
    let dateFields = [1970, 0, 1];  // 1 Jan 1970
    let d = new Date(...dateFields);
    ```
2. To use `new` with an array of parameters without spread syntax, you would have to do it indirectly through partial application:
    ```js
    function applyAndNew(fnConstructor, args) {
        function partial () {
        return fnConstructor.apply(this, args);
        };
        if (typeof fnConstructor.prototype === "object") {
        partial.prototype = Object.create(fnConstructor.prototype);
        }
        return partial;
    }

    function myConstructor () {
    console.log("arguments.length: " + arguments.length);
    this.prop1="val1";
    this.prop2="val2";
    };

    var myArguments = ["hi", "how", "are", "you", "mr", null];
    var myConstructorWithArguments = applyAndNew(myConstructor, myArguments);

    console.log(new myConstructorWithArguments());
    ```

##### 拷贝和拼接数组
```js
var arr = [1, 2, 3];
var arr2 = [...arr]; // like arr.slice()

var parts = ['shoulders', 'knees'];
var lyrics = ['head', ...parts, 'and', 'toes'];
// ["head", "shoulders", "knees", "and", "toes"]
```

##### 结合 destructuring 和 rest syntax
1. 看下面浅拷贝数组的例子：
    ```js
    const arr1 = [1, 2];
    const [...arr2] = arr1;
    ```
2. `const [x, y] = arr1` 是 destructuring 的形式，`function (...arr2)` 是 rest syntax 的形式。上述拷贝就好像是进行了如下的过程：`x` 和 `y` 分别被赋值 `1` 和 `2`，然 后使用 rest “参数” `arr2` 获得 `x` 和 `y` 的值。结合其他变量的例子：
    ```js
    const list = [1, 2, 3];
    const [a, ...rest] = list;
    console.log(a); // 1
    console.log(rest); // [2, 3]
    ```
3. 和 rest syntax 一样，`...rest` 也只能出现在最后一项。如果不是最后 rest 参数没在最后一项一样报错：
    ```shell
    Uncaught SyntaxError: Rest element must be last element
    ```
    从错误信息也可以看出来，这也是 rest syntax，只不过是用于数组项而非函数参数。

##### 将字符串转为数组
尤其适用于处理多字节字符的情况：
```js
const str = '我𝑒你';
console.log(str.length); // 4
console.log(str.split('')); // ["我", "�", "�", "你"]
console.log([...str].length); // 3
console.log([...str]); // ["我", "𝑒", "你"]
```

##### 将可遍历（iterable）对象转换为数组
任何实现了 Iterator 接口的对象，都可以用扩展运算符转为真正的数组
```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let set = new Set([1, 2, 3]);
console.log([...set]); // [1, 2, 3]
```

对于那些没有部署 Iterator 接口的类数组对象，扩展运算符就无法将其转为真正的数组，只能使 用 `Array.from`
```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3,
};

[...arrayLike]; // Uncaught TypeError: arrayLike is not iterable
```

##### Spread in object literals
1. Copies own enumerable properties from a provided object onto a new object. Shallow-cloning (excluding prototype) or merging of objects is now possible using a shorter syntax than `Object.assign()`.
```js
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// Object { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// Object { foo: "baz", x: 42, y: 13 }
```


##  2. <a name='BitwiseOperators'></a>Bitwise Operators
###  2.1. <a name='Basic'></a>Basic
1. All numbers in ECMAScript are stored in IEEE-754 64-bit format, but the bitwise operations do not work directly on the 64-bit representation. Instead, the value is converted into a 32-bit integer, which in the range of `[-2147483648, 2147483647]`,the operation takes place, and the result is converted back into 64 bits. To the developer, it appears that only the 32-bit integer exists, because the 64-bit storage format is transparent.
2. A curious side effect of this conversion is that the special values `NaN` and `Infinity` both are treated as equivalent to `0` when used in bitwise operations.
3. Signed integers use the first 31 of the 32 bits to represent the numeric value of the integer. The 32nd bit represents the sign of the number: `0` for positive or `1` for negative.
4. Depending on the value of that bit, called the sign bit, the format of the rest of the number is determined.
5. Positive numbers are stored in true binary format, with each of the 31 bits representing a power of `2`, starting with the first bit (called bit 0), representing 2<sup>0</sup> , the second bit represents 2<sup>1</sup>, and so on.
6. Negative numbers are also stored in binary code but in a format called *two’s complement*. The two’s complement of a number is calculated in three steps:
    1. Determine the binary representation of the absolute value (for example, to find `–18`, first determine the binary representation of `18`).
    2. Find the `one’s complement` of the number, which essentially means that every `0` must be replaced with a `1` and vice versa.
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
7. ECMAScript does its best to keep all of this information from you. When outputting a negative number as a binary string, you get the binary code of the absolute value preceded by a minus sign:
    ```js
    console.log(-18..toString(2)); // '-10010'
    ```
8. If a bitwise operator is applied to a nonnumeric value, the value is first converted into a number using the `Number()` function automatically and then the bitwise operation is applied. The resulting value is a number.

###  2.2. <a name='BitwiseNOT'></a>Bitwise NOT
1. `~`: returns the one’s complement of the number.
    ```js
    console.log(~26);        // -27
    console.log(~-26);       // 25
    console.log(~0);         // -1
    console.log(~NaN);       // -1
    console.log(~Infinity);  // -1
    ```
2. 可以看出来十进制数的位操作也有着明显的规律，通过再次分析计算机存储负数的方法来探明其中
的规律。Let's imagine how computer store a negative number:
    1. Found a token, say `-18`
    2. Ignore the negative sign, got `18`
    3. Save this token in memory, as `00000000 00000000 00000000 00010010`
    4. Bitwise-not it, got `11111111 11111111 11111111 11101101`
    5. Add `1`, the result is `11111111 11111111 11111111 11101110`  
3. 如果你对一个正数按位非，然后再加一，结果就是这个正数的相反数。即，一个正数 `n` 的相反数再减一就是它的按位非结果（`-n-1`）；相反的过程，如果你对一个负数减一，然后再按位非，结果就是这个负数的相反数。即，一个负数减一的按位非是该负数的相反数，也即，一个负数 `n` 的按位非结果等于对该负数加一再求相反数（`-(n+1)`）。
    ```js
    function bitwiseNOT(n){
        return -n - 1
    }
    ```
4. The summary above is actually not much useful, bitwise operation is not used to achieve a faster math calculation.

###  2.3. <a name='BitwiseAND'></a>Bitwise AND
* `&`

###  2.4. <a name='BitwiseOR'></a>Bitwise OR
* `|`

###  2.5. <a name='BitwiseXOR'></a>Bitwise XOR
* `^`: when different returns `1`, when same returns `0`

###  2.6. <a name='LeftShift'></a>Left Shift
* `<<`

###  2.7. <a name='SignedRightShift'></a>Signed Right Shift
* `>>`: The empty bits occur at the left of the number but after the sign bit

###  2.8. <a name='UnsignedRightShift'></a>Unsigned Right Shift
* `>>>`
* For numbers that are negative, the empty bits get fi lled with zeros regardless of the sign of the number.
* Because the negative number is the two’s complement of its absolute value, the number becomes very large if not only moved a few bits.


##  3. <a name='-1'></a>布尔操作符
###  3.1. <a name='-1'></a>逻辑非  `!`
可以用于ECMAScript中的任何值。无论这个值是什么数据类型，这个操作符都会返回一个布尔值。逻辑非操作符首先会将它的操作数转换为个布尔值，然后再对其求反。

###  3.2. <a name='-1'></a>逻辑与  `&&`
1. 逻辑与操作属于短路操作，即如果第一个操作数能够决定结果，那么就不会再对第二个操作数求值
    ```js
    var a = true;
    var result = (a && someUndefinedVariable);      //这里会发生错误
    alert(result);                                //这里不会执行

    var a = false;
    var result = (a && someUndefinedVariable);      //这里不会发生错误
    alert(result);                                //这里会执行
    ```
2. 逻辑与的返回结果是两个操作数中的一个，它的规则是：结合上面短路操作原理，返回那个决定了整体逻辑布尔值的操作数。即，例如 `x && y`：如果 `x == false`，则返回 `x`；如果 `x == true`，则返回 `y`。

### Logical AND assignment (`&&=`)
only evaluates the right operand and assigns to the left if the left operand is truthy
```js
let a = 1;
let b = 0;

a &&= 2;
console.log(a); // 2

b &&= 2;
console.log(b); //0
```

###  3.3. <a name='-1'></a>逻辑或  `||`
1. 逻辑或运算符也是短路操作符
2. 返回结果的逻辑与逻辑与相似

###  3.4. <a name='if'></a>使用逻辑运算符实现 `if` 的功能
` a || b();` 相当于：
```js
if (!a){
    b()
}
```
`a && b();` 相当于：
```js
if(a){
    b();
}
```
例如函数的有一个可选的回调函数参数，则函数内部可以写成：
```js
callback && callback();
```

###  3.5. <a name='Nullishcoalescingoperator'></a>Nullish coalescing operator `??`
1. 与 `||` 不同的是，`??` 只有在左侧操作数不是 `null` 或者 `undefined` 是才会返回右侧的操作数。这样就可以保证只有在左侧严格为空值时才返回右侧，如果左侧是 `0` 或者 `""` 之类的 falsy 时依然返回左侧操作数。
    ```js
    const foo = null ?? 'default string';
    console.log(foo); // "default string"

    const baz = 0 ?? 42;
    console.log(baz); // 0
    ```
2. 显然使用 `??` 来设定默认值就要更加合理，现在只有 `null` 和 `undefined` 才被认为是没有值，而是用后面的默认值。
3. 优先级比 `||` 低，比 conditional (ternary) operator 高。

###  3.6. <a name='Logicalnullishassignment'></a>Logical nullish assignment `??=`
1. 只有当左侧的值是 nullish (`null` or `undefined`) 才进行赋值操作，否则直接短路
    ```js
    const a = { duration: 50 };

    a.duration ??= 10;
    console.log(a.duration); // 50

    a.speed ??= 10;
    console.log(a.speed); // 10

    function getSpeed () {
        console.log("不会被调用");
        return 10;
    }
    a.speed ??= getSpeed();
    ```
2. 看起来的作用是，只有一个属性或者变量为空时才能赋值，如果有了值就不能再改变，除非是使用 `=` 来清空或者强制改写
    ```js
    let n;

    n ??= 22;
    console.log(n); // 22

    n ??= 33;
    console.log(n); // 22

    n ??= null;
    console.log(n); // 22

    n = null;
    console.log(n); // null
    ```

###  3.7. <a name='LogicalORassignment'></a>Logical OR assignment `||=`
感觉大部分时候还是要使用 `??=`

###  3.8. <a name='Optionalchaining.'></a>Optional chaining `?.`
1. 属性链中如果某个属性或方法为 nullish (`null` or `undefined`)，则该表达式直接在此短路并返回 `undefined`，否则正常求值。这样就不用先判断该属性存在然后再向后求值了
    ```js
    const adventurer = {
        name: 'Alice',
        cat: {
            name: 'Dinah'
        }
    };

    console.log(adventurer.dog?.name); // undefined
    console.log(adventurer.cat?.name); // 'Dinah'
    console.log(adventurer.someNonExistentMethod?.()); // undefined
    ```
2. 也可以用在数组和其他引用类型上
    ```js
    const arr = ['a', 'b', 'c', 'd']
    let arrayItem = arr?.[42];

    let myMap = new Map();
    myMap.set("foo", {name: "baz", desc: "inga"});

    let nameBar = myMap.get("bar")?.name;
    ```
3. 和 `??` 搭配使用可以实现默认值
    ```js
    let customer = {
        name: "Carl",
        details: { age: 82 }
    };
    const customerCity = customer?.city ?? "Unknown city";
    console.log(customerCity); // Unknown city
    ```
4. Optional chaining cannot be used on a non-declared root object, but can be used with an undefined root object
    ```js
    let obj = {}
    console.log(obj?.name); // undefined

    console.log(obj1?.name); // ReferenceError: obj1 is not defined
    ```
5. 不能用在左值中
    ```js
    let object = {};
    object?.property = 1; // Uncaught SyntaxError: Invalid left-hand side in assignment
    ```

####  3.8.1. <a name='Dealingwithoptionalcallbacksoreventhandlers'></a>Dealing with optional callbacks or event handlers
1. If you use callbacks or fetch methods from an object with a destructuring assignment, you may have non-existent values that you cannot call as functions unless you have tested their existence。例如使用类似于下面异步回调函数时可能只会传成功的处理函数而不传失败的，那么在回调内部就要判断一下是否传了失败的处理函数
    ```js
    function foo (onSuccess, onError) {
        if (success) {
            onSuccess(res);
        }
        else {
            if (onError) {
                onError(err)
            }
        }
    }
    ```
2. 使用 `?.` 就可以简化写法
    ```js
    function foo (onSuccess, onError) {
        if (success) {
            onSuccess(res);
        }
        else {
            onError?.(err)
        }
    }
    ```
3. 其实不光是回调之类的，普通参数函数都可以这样。


##  4. <a name='-1'></a>乘性操作符
ECMAScript 定义了 3 个乘性操作符：乘法、除法和求模。在操作符为非数值的情况下会调用 `Number()` 函数执行自动的类型转换。

###  4.1. <a name='-1'></a>乘法
在处理特殊值的情况下，乘法操作符遵循下列特殊的规则：
* 如果有一个操作数是 `NaN`，则结果是 `NaN`；
* 如果 `Infinity` 与 `0` 相乘，结果是 `NaN`；
* 如果正负 `Infinity` 与非 `0` 数值相乘，结果是正负 `Infinity`；
* 如果无穷之间相乘，结果仍然是无穷，正负号也相乘；
* 如果有一个操作数不是数值，则在后台调用 `Number()`，然后再应用上面的规则。

###  4.2. <a name='-1'></a>除法
在处理特殊值的情况下，除法操作符遵循下列特殊的规则：
* 如果有一个操作数是 `NaN`，则结果是 `NaN`；
* 如果无穷除无穷，结果是 `NaN`；
* 如果无穷除非无穷书，结果是还是无穷；符号取决于两者；
* 如果是 `0` 被 `0` 除，结果是 `NaN`；
* 如果是非零数（包括无穷）被 `0` 除，则结果是无穷。**居然不是`NaN`！**
  符号取决于该非零数和 `0` 两者的符号。
* 如果有一个操作数不是数值，则在后台调用 `Number()` 将其转换为数值，然后再应用上面的规则。

###  4.3. <a name='-1'></a>求模
1. 结果的符号和被除数相同
    ```js
    console.log(8 % -3); // 2
    ```
2. It also works for floating-point values. 同样要注意浮点数计算的不准确性
    ```js
    console.log(-7.2%3.5); // -0.20000000000000018
    ```
3. 在处理特殊值的情况下，求模操作符遵循下列特殊的规则：
    * 如果被除数无穷而除数有穷，则结果是 `NaN`；
    * 如果除数是 `0`，则结果是 `NaN`；
    * 如果无穷被无穷除，结果是 `NaN`；
    * 如果被除数是有限大的数值而除数是无限大的数值，则结果是被除数；
    * 如果被除数是 `0`，则结果是 `0`；
    * 如果有一个操作数不是数值，则在后台调用 `Number()` 将其转换为数值，然后再应用上面的规则。


##  5. <a name='-1'></a>加性操作符
加性操作符也会在后台转换不同的数据类型。然而，对于加性操作符而言，相应的转换规则还稍微有点复杂。

###  5.1. <a name='-1'></a>加法
* 如果有一个操作数是 `NaN`，则结果是 `NaN`；
* 正无穷加正无穷等于正无穷，负无穷加负无穷等于负无穷，正无穷加负无穷结果为 `NaN`；
* `+0` 加 `+0`，结果是 `+0`；`-0` 加 `-0`，结果是 `-0`；`+0` 加 `-0`，结果是 `+0`;
* 如果两个操作数都是字符串，则将第二个操作数与第一个操作数拼接起来；
* 如果只有一个操作数是字符串，则将另一个操作数转换为字符串，然后再将两个字符串拼接起来；
* 如果操作数是对象、布尔值以及 `undefined` 和 `null`：
    ```js
    let result1 = undefined + 1;
    console.log(result1); // NaN

    let result2 = null + 1;
    console.log(result2); // 1
    console.log(typeof result2); // number

    let result3 = true + 1;
    console.log(result3); // 2
    console.log(typeof result3); // number

    let result4 = false + 1;
    console.log(result4); // 1
    console.log(typeof result4); // number

    let result5 = [] + 1;
    console.log(result5); // 1
    console.log(typeof result5); // string

    let result6 = [2] + 1;
    console.log(result6); // 21
    console.log(typeof result6); // string

    let result7 = {} + 1;
    console.log(result7); // [object Object]1
    console.log(typeof result7); // string

    let result8 = {name: '33'} + 1;
    console.log(result8); // [object Object]1
    console.log(typeof result8); // string
    ```

###  5.2. <a name='-1'></a>减法
* 如果有一个操作数是 `NaN`，则结果是 `NaN`；
* 正无穷减正无穷结果为 `NaN`，负无穷减负无穷结果为 `NaN`，正无穷减负无穷结果为正无穷，负无穷减正无穷结果为负无穷；
* 两种 0 之间互相减：
    ```js
    const n1 = 0 - 0;
    const n2 = 0 - -0;
    const n3 = -0 - -0;
    const n4 = -0 - 0;
    console.log(Object.is(n1, 0)); // true
    console.log(Object.is(n2, 0)); // true
    console.log(Object.is(n3, 0)); // true
    console.log(Object.is(n4, -0)); // true
    ```
* 如果有一个操作数是字符串、布尔值、`null` 或 `undefined`，则先在后台调用 `Number()` 函数将其转换为数值然后再执行减法计算；
* 如果有一个操作数是对象，则调用对象的 `valueOf()` 方法以取得表示该对象的数值。如果对象没有 `valueOf()` 方法，则调用其 `toString()` 方法。


##  6. <a name='-1'></a>指数操作符 `**`
```js
console.log(2 ** 3); // 8
```
1. 这个运算符的一个特点是右结合，而不是常见的左结合。多个指数运算符连用时，是从最右边开始计算的
    ```js
    console.log(2 ** 3 ** 2); // 512
    ```
2. 指数运算符也可以与等号结合，形成一个新的赋值运算符 `**=`
    ```js
    let n = 2;
    console.log(n **= 3); // 8
    ```
3. V8 引擎的指数运算符与 `Math.pow` 的实现不相同，对于特别大的运算结果，两者会有细微的差异
    ```js
    console.log(Math.pow(99, 99)); // 3.697296376497263e+197
    console.log(99 ** 99); // 3.697296376497268e+197
    ```


##  7. <a name='-1'></a>关系操作符 `>` `<`
* 当关系操作符的操作数使用了非数值时，也要进行数据转换或完成某些奇怪的操作：
    * 如果两个操作数都是字符串，则比较两个字符串对应的字符串编码；
    * 如果一个操作数是数值，则将另一个操作数转换为数值，然后进行比较；
    * 如果有一个操作数是对象，则调用对象的 `valueOf()` 方法以取得表示该对象的数值。如果对象没有 `valueOf()` 方法，则调用其 `toString()` 方法。
    * 如果一个操作数是布尔值，则先将其转化为数值，然后再执行比较。
* 比较字符串时，实际比较的是两个字符串中对应位置的每个字符的字符编码值
    ```js
    alert("23"<"3");    // true
    alert(23<"3");      // false。因为“3”会先被转化为数值
    ```
* 任何操作数与 `NaN` 进行关系比较，结果都是 `false`。
* 连续比较时的情况：
    ```js
    console.log(1 < 2 < 3); // true   符合直观，但其实也是误解
    console.log(3 < 2 < 1); // true   不符合直观
    console.log(3 > 2 > 1); // false  不符合直观
    ```
    只要注意关系操作符的返回值，就可以理解上述运算的结果。上述操作实际上的逻辑步骤是：
    ```js
    console.log((1 < 2) < 3);
    console.log((3 < 2) < 1);
    console.log((3 > 2) > 1);
    ```
    下一步是：
    ```js
    console.log(true < 3);
    console.log(false < 1);
    console.log(true > 1);
    ```


##  8. <a name='-1'></a>相等操作符
###  8.1. <a name='-1'></a>`==` 和 `!=`
两个操作符都会先转换操作数，然后再比较；
* 如果有一个操作数是布尔值，则在比较相等性之前先将其转换为数值；
* 如果一个操作数是字符串，另一个操作数是数值，先将字符串转为数值；
    ```js
    console.log(false == '0'); // true
    // 结合上一条规则，看起来是fasle被转换为数字0，'0'也被转换为数字0
    ```
* 如果一个操作数是对象，另一个操作数不是，则调用对象的 `valueOf()` 方法，用得到的基本类型值比较；
* `null` 和 `undefined` 相等；
* 要比较相等性之前，不能将 `null` 和 `undefined` 转换成其他任何值；
* 如果有一个操作数是 `NaN`，则相等操作符返回 `false`，而不相等操作符返回 `true`；
* 即使两个操作数都是 `NaN`，相等操作符也返回 `false`；
* 如果两个操作数都是对象，则比较它们是不是同一个对象。如果是则返回 `true`，否则返回 `false`。
* `null` 和 `0` 不相等，`undefined`和 `0` 也不相等。

###  8.2. <a name='-1'></a>`===` 和 `!==`
* 不转换类型直接比较。
* `-0` 和 `0` 相等


##  9. <a name='-1'></a>条件操作符
```js
variable = boolean_expression ? true_value : false_value;
```

##  10. <a name='-1'></a>赋值操作符
* 每个主要算数操作符（以及个别的其他操作符）都有对应的赋值操作符：
    ```js
    *=
    /=
    %=
    +=
    -=
    **=
    <<=
    >>=
    >>>=
    ```
* 设计这些操作符的主要目的就是简化赋值操作，使用它们不会带来任何性能的提升。


##  11. <a name='-1'></a>逗号操作符
1. 逗号操作符可以在一条语句中执行多个操作，多用于声明多个变量
    ```js
    var num1 = 1, num2 = 2, num3 = 3;
    ```
2. 逗号操作符还可用于赋值，总会返回表达式中的最后一项
    ```js
    var num = (4, 5, 2, 8);  // num的值为8。看起来好像没什么意义
    ```

##  12. <a name='in'></a>`in`
It evaluates to true if the left-side value is the name of a property of the right-side object.


##  13. <a name='delete'></a>`delete`
1. 它用来 **删除** 对象属性或者 **清空** 数组元素
2. 针对对象是删除其整个属性（而不仅仅是属性值）；针对数组并不是删除，而是清空该项的内容。如果用数组的 `splice` 方法，则是彻底删除该项，后面的项也会一次修改序号
    ```js
    let a1 = ["a", "b", "c"];
    console.log( a1[1] ); // b
    delete a1[0];
    console.log( a1[1] ); // b
    console.log( a1 ); // [undefined, "b", "c"]

    let a2 = ["a", "b", "c"];
    console.log( a2[1] ); // b
    a2.splice(1, 1);
    console.log( a2[1] ); // c
    console.log( a2 ); // ["a", "c"]
    ```
3. only deletes own properties, not inherited ones.
4. `delete` does not remove properties that have a configurable attribute of `false`, but it will remove configurable properties of nonextensible objects
5. 返回值
    * 返回 `true` 的情况
        * delete succeeded
        * the delete had no effect(such as deleting a nonexistent property)
        * when used with an expression that is not a property access expression
            ```js
            console.log(delete 2); // true
            ```
    * 返回 `false` 的情况: 严格模式下会报错的情况，在非严格模式下会返回 `false`
6. 如果对变量使用 `delete`，非严格模式下会静默失败，严格模式下报错。删除其他类型的值有些会在严格模式下报错，有些不一定，比如上面删除数字值虽然无意义但不会报错。
7. 使用 `var` 声明的全局变量会作为 `window` 的属性，但其 `configurable` 特性为 `false`，不能通过 `delete` 删除


##  14. <a name='-1'></a>运算符优先级
下表按照运算符的优先级排序的，前面的运算符优先级要高于后面的运算符优先级。被水平分割线分隔开来的运算符具有不同的优先级。标题为A的列表示运算符的结合性，L（从左至右）或 R（从右至左），标题为N的列表示操作数的个数。标题为 “类型” 的列表示期望的操作数类型，以及运算符的结果类型（在 “→” 符号之后）。
![运算符优先级](./assets/运算符优先级.jpg)
