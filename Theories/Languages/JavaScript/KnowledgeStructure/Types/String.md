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
3. The `length` of a string is the number of 16-bit values it contains, not the
number of characters.
4. The various string-manipulation methods defined by JavaScript operate on
16-bit values, not on characters. They do not treat surrogate pairs specially,
perform no normalization of the string, and do not even ensure that a string is
well-formed USC-2.
5. ECMAScript strings are immutable.
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
    实现这个操作的过程如下：首先创建一个能容纳10个字符的新字符串，然后在这个字符串中填充"Java"和"Script"，最后一步是销毁原来的字符串"Java"和字符串"Script"。   
    * All string methods that appear to return a modified string are, in fact, returning a new string value.

6. In ECMAScript 5, you can break a string literal across multiple lines by ending each line but the last with a backslash (\\).
```
let str = "hello \
world \
!";
console.log( str ); // hello world !
```
7. ==不懂ES6对字符unicode表示法的扩展== http://es6.ruanyifeng.com/#docs/string


#### 二. Escape Sequences in String Literals
String数据类型包含一些特殊的字符字面量，也叫转义序列，用于表示非打印字符，或者具有其他用途的字符。这些字符字面量如下表所示：

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


#### 三. ES6 模板字符串：直接在字符串里使用变量或者函数
使用反引号（波浪键）的字符串，内部可直接使用变量及其他代码，语法类似如下两个
```
console.log( `hello world` );             // hello world

let name = 22;
console.log( `Hello ${name}` );           // hello 22

let yourName = ()=>11+22;
console.log( `你好，${ yourName()}` );    // 你好，33
```
1. 如果在模板字符串中需要使用反引号，则要转义
2. 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
3. 如果大括号中的值不是字符串，将按照一般的规则转为字符串。
4. 模板字符串可以嵌套

==模板编译 不懂  
标签模板 不懂  
http://es6.ruanyifeng.com/#docs/string==


## 方法

### `split`
分隔符在边缘时，会分割出空的字符串
```js
const str = '小时1小时2小时';
const arr = str.split('小时');
console.log(arr); // ["", "1", "2", ""]
```
