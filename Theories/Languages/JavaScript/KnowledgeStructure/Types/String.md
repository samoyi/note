#String


## String in JS
1. JavaScript uses the USC-2 encoding of the Unicode character set, and JS
strings are sequences of unsigned 16-bit values.（之前有过疑问“为什么大部分汉字的
UTF-8 编码是3字节，但 `length` 却是 `1`？”，就是因为这些汉字会先被 JS 引擎解码为
Unicode 再使用 USC-2 编码，根据 USC-2 的编码规则，编码结果就是两个字节）
2. The most commonly used Unicode characters (those from the “basic multilingual
 plane”) have codepoints that fit in 16 bits and can be represented by a single
 element of a string. Unicode characters whose codepoints do not fit in 16 bits
 are encoded following the rules of USC-2 as a sequence (known as a “surrogate
pair”) of two 16-bit values. This means that a JS string of `length` 2 (two
16-bit values) might represent only a single Unicode character
```js
let p = "π"; // π is 1 character with 16-bit codepoint 0x03c0
let e = "𝑒"; // 𝑒 is 1 character with 17-bit codepoint 0x1d452
p.length // => 1: p consists of 1 16-bit element
e.length // => 2: USC-2 encoding of 𝑒 is 2 16-bit values: "\ud835\udc52"
```
这也证明了 JS 是使用 UCS-2 编码而非 UTF-16 编码，因为 UTF-16 编码可以用两字节表示 BMP
以外的字符，而 USC-2 只能表示 BMP 的字符。
3. [这篇文章](https://mathiasbynens.be/notes/javascript-encoding)说到，JS 引擎大多
使用 UTF-8，但 JS 语言本身是 UCS-2。
4. The `length` of a string is the number of 16-bit values it contains, not the
number of characters.
5. The various string-manipulation methods defined by JavaScript operate on
16-bit values, not on characters. They do not treat surrogate pairs specially,
perform no normalization of the string, and do not even ensure that a string is
well-formed USC-2.
6. ECMAScript strings are immutable.
    * You can access the text at any index of a string, but JavaScript provides
    no way to alter the text of an existing string.
    ```js
    let str = 'abc';
    console.log( str[1] ); // 'b'
    str[1] = 'd'; // TypeError: Cannot assign to read only property '1' of string 'abc'
    ```
    * 要改变某个变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字
    符串充填该变量。
    ```js
    let lang = "Java";
    lang = lang + "Script";
    ```
    实现这个操作的过程如下：首先创建一个能容纳10个字符的新字符串，然后在这个字符串中填
    充"Java"和"Script"，最后一步是销毁原来的字符串"Java"和字符串"Script"。   
    * All string methods that appear to return a modified string are, in fact,
    returning a new string value.
7. In ECMAScript 5, you can break a string literal across multiple lines by
ending each line but the last with a backslash (\\).
```js
let str = "hello \
world \
!";
console.log( str ); // hello world !
```
8. ==不懂ES6对字符unicode表示法的扩展== http://es6.ruanyifeng.com/#docs/string


#### 二. Escape Sequences in String Literals
String数据类型包含一些特殊的字符字面量，也叫转义序列，用于表示非打印字符，或者具有其他
用途的字符。这些字符字面量如下表所示：

字面量 | 含义
---|---
\n | 换行
\t | 制表
\b | 退格
\r | 回车
\f | 进纸
\\\ | 斜杠
\\' | 单引号（'），在用单引号表示的字符串中使用。例如：'He said, \'hey.\''
\\" | 双引号（"），在用双引号表示的字符串中使用。例如："He said, \"hey.\""
\xnn | 以十六进制代码nn表示的一个字符（其中n为0～F）。例如，\x41表示"A"
\unnnn | 以十六进制代码nnnn表示的一个Unicode字符（其中n为0～F）。例如，\u03a3表示希腊字符Σ


这些字符字面量可以出现在字符串中的任意位置，而且也将被作为一个字符来解析，如下面的例子所示：
var text = "This is the letter sigma: \u03a3.";
因为会被作为一个字符解析，所以其length值也是1


## 模板字符串
### 基本用法
1. 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中
    ```js
    $('#list').html(`
    <ul>
        <li>first</li>
        <li>second</li>
    </ul>
    `);
    ```
    上面代码中，所有模板字符串的空格和换行，都是被保留的，比如`<ul>`标签前面会有一个换
    行。如果你不想要这个换行，可以使用`trim`方法消除它。
    ```js
    $('#list').html(`
    <ul>
        <li>first</li>
        <li>second</li>
    </ul>
    `.trim());
    ```
2. 模板字符串中可以通过`${}`嵌入任意的 JavaScript 表达式，如果表达式的值不是字符串，会
    被转化为字符串
    ```js
    let name = '33';
    let num1 = 2;
    let num2 = 3;
    function sayHi(){
    	return 'Hi';
    }
    console.log(`${sayHi()}, I'm ${name}, ${num1+num2} years old.`);
    // "Hi, I'm 33, 5 years old."
    ```
    既然说可以嵌入任意表达式，那也可以再嵌入一个模板字符串
    ```js
    let name = '33';
    let age = 22;
    console.log(`Name: ${name}, ${`Age: ${age}`}.`); // "Name: 33, Age: 22."
    ```

### TODO
[http://es6.ruanyifeng.com/#docs/string#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2](其他高级用法)


## 四字节字符的处理方法
1. 字符串在使用内部的 iterator 遍历时，可以正确识别四字节字符，因此可以使用遍历相关的方
法来获得正确的结果
2. 使用扩展运算符获得正确的字符数量
    ```js
    let str = 'd𝑒f';
    console.log(str.length); // 3
    console.log([...str].length); // 3
    ```
3. 使用`for...of`遍历字符串


## 方法
**一个方法如果没有特别说明，那么它的规则就不兼容 Supplementary plane 中的字符**

### 字符方法
#### `charAt()`
与`[]`语法的差异
```js
let str = 'a';
console.log(str.charAt(1)); // ""
console.log(typeof str[1]); // undefined
```

#### `codePointAt()`
```js
let str = '𝑒';
console.log(str.codePointAt(0)); // 119890
console.log(str.charCodeAt(0)); // 55349
console.log(str.codePointAt(1)); // 56402
```
* 从上面的例子可以看出来，该方法相比于`charCodeAt()`，对多字节字符的兼容性更好一些。但
还不是完全兼容，因为它仍然可以访问到第二个 2byte。
* `codePointAt()`返回字符的 Unicode code point

#### `String.fromCodePoint()`
*  `String.fromCodePoint(num1[, ...[, numN]])` 若干个 Unicode code point，返回它们
对应的字符组成的字符串
    ```js
    console.log(String.fromCodePoint(72, 0B1100101, 0O154, 0O154, 0X6f)); // Hello
    ```

#### `charCodeAt()` 和 `codePointAt()`
使用兼容多字节字符的`codePointAt()`和`fromCodePoint()`



### 编辑字符串
#### `concat()`
```js
let str1 = '1';
let str2 = '2';
let str3 = '3';
console.log(str1.concat(str2, str3)); // "123"
console.log(str1); // "1"
```

#### `padStart()`和`padEnd()`
##### Syntax
`str.padStart(targetLength [, padString])`

##### `targetLength`参数
1. The length of the resulting string once the current string has been padded.
2. If the value is lower than the current string's length, the current string
will be returned as is.
```js
let str = '123';
console.log(str.padEnd(8, '456')); // "12345645"
console.log(str.padEnd(2, '456')); // "123"
console.log(str); // "123"  不改变原字符串
```

##### 可选的`padString`参数
1. The string to pad the current string with.
2. If this string is too long to stay within the target length, it will be
truncated and the left-most part will be applied.
3. The default value for this parameter is " " (U+0020).
```js
let str = '123';
console.log(str.padEnd(5, '4567890')); // "12345"
console.log(str.padEnd(5) + '.'); // "123  ."
```

#### `repeat()`
##### Syntax
`str.repeat(count);`

##### `count`参数
An integer between 0 and +∞: [0, +∞), indicating the number of times to repeat
the string in the newly-created string that is to be returned.
```js
let str = '123';
console.log(str.repeat(3)); // "123123123"
console.log(str.repeat(0)); // ""
console.log(str); // "123"  不改变原字符串
```

##### 不规范参数
* `Infinity`：`RangeError`
    ```js
    str.repeat(1/0); // RangeError
    ```
* `(-∞, -1]`：`RangeError`; `(-1, 0)`：相当于`0`
    ```js
    str.repeat(-0.9); // ""
    str.repeat(-1); // RangeError
    ```
* 正小数: 向下取整
    ```js
    let str = '123';
    console.log(str.repeat(0.9)); // ""
    console.log(str.repeat(1.9)); // "123"
    ```
* `NaN`：相当于`0`
    ```js
    console.log(str.repeat(NaN)); // ""
    ```
* 非数字：内部使用`Number()`转换为数字
    ```js
    let str = '123';
    console.log(str.repeat()); // ""
    console.log(str.repeat(null)); // ""
    console.log(str.repeat('2')); // "123123"
    console.log(str.repeat({})); // ""
    console.log(str.repeat([])); // ""
    console.log(str.repeat([2])); // "123123"
    console.log(str.repeat(false)); // ""
    console.log(str.repeat(true)); // "123"
    ```

#### `split`
##### Syntax
`str.split([separator[, limit]])`

##### 可选的`separator`参数
1. 分隔符
    ```js
    let str = 'hello';
    console.log(str.split('l')); // ["he", "", "o"]
    ```
2. `separator`可以是字符串或正则表达式
    ```js
    let str = '有道云笔记';
    console.log(str.split(/道|笔/)); // ["有", "云", "记"]
    ```
3. 如果`separator`包含多个字符，则整个`separator`字符串作为分隔符
    ```js
    let str = '有道云笔记';
    console.log(str.split('道云笔')); // ["有", "记"]
    ```
4. 如果`separator`不存在于字符串中，或者直接没传`separator`，那因为没有分隔符，所以就
不会进行分割。但还是会返回数组，所以就返回包含整个字符串的单项数组
    ```js
    let str = '有道云笔记';
    console.log(str.split()); // ["有道云笔记"]
    console.log(str.split(' ')); // ["有道云笔记"]
    ```
5. 如果`separator`是`''`，`str`就会被逐个拆分。内在的逻辑是：字符之间包含`''`。
    ```js
    let str = '有道云笔记';
    console.log(str.split('')); // ["有", "道", "云", "笔", "记"]
    ```
6. 如果分隔符出现在字符串的首或尾，则还会相应的分出来一个`''`。
    ```js
    let str = '有道云笔记';
    console.log(str.split(/有|记/)); // ["", "道云笔", ""]
    ```
    这里的逻辑是，不仅字符之间包含`''`，在字符串的首位也各包含一个`''`。即`有`右边是
    `道`左边是`''`。因此，如果分隔符是字符串本身，则结果会是两个`''`数组
    ```js
    let str = '有道云笔记';
    console.log(str.split('有道云笔记')); // ["", ""]
    ```
7. 如果`separator`包含捕获组的正则表达式，则每次`separator`匹配到字符的时候，捕获组中
的值也会被加入到结果数组中
    ```js
    let str = '有道云笔记有道云笔记';
    console.log(str.split(/道云笔/)); // ["有", "记有", "记"]
    console.log(str.split(/(道)云(笔)/)); // ["有", "道", "笔", "记有", "道", "笔", "记"]
    ```
8. 如果字符串和`separator`都是`''`，则结果是空数组。
    ```js
    let str = '';
    console.log(str.split('')); // []
    ```

##### 可选的`limit`参数
最大分块数量。如果拆分的块数已经达到该值，即使字符串还没有拆分完，也会停止拆分，只返回已
拆分出来的部分。
```js
let str = '102030405060';
console.log(str.split('0', 3)); // ["1", "2", "3"]
```

#### `trim()`
1. The `trim()` method removes whitespace from both ends of a string.
2. Whitespace in this context is all the whitespace characters (space, tab,
no-break space, etc.) and all the line terminator characters (LF, CR, etc.).
3. IE 不支持 `trimStart()`/`trimLeft()`和`trimEnd()`/`trimRight()`
