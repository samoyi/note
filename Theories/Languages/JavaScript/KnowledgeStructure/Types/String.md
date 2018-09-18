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


## Escape Sequences in String Literals
1. String 数据类型包含一些特殊的字符字面量，也叫转义序列，用于表示非打印字符，或者具有
其他用途的字符。这些字符字面量如下表所示：

字面量 | 含义
---|---
`\n` | 换行
`\t` | 制表
`\b` | 退格
`\r` | 回车
`\f` | 进纸
`\\\` | 斜杠
`\\'` | 单引号（'），在用单引号表示的字符串中使用。例如：'He said, \'hey.\''
`\\"` | 双引号（"），在用双引号表示的字符串中使用。例如："He said, \"hey.\""
`\xnn` | 以十六进制代码 nn 表示的一个字符。例如，`\x41`表示`A`
`\unnnn` | 以十六进制代码 nnnn 表示的一个 Unicode 字符。例如，`\u03a3`表示希腊字符`Σ`

2. 这些字符字面量可以出现在字符串中的任意位置，而且也将被作为一个字符来解析，如下面的例
子所示：
    ```js   
    var text = "This is the letter sigma: \u03a3.";
    ```
3. 因为会被作为一个字符解析，所以其`length`值也是1


## 字符的 Unicode 表示法
1. 上面提到可以使用`\unnnn`表示一个字符，但该方法最大只能表示`\uffff`。
2. 比如字符`𝑒`的 Unicode 码点值是`U+1d452`，如果还强行使用上面的写法写成`\u1d452`，则
只有`\u1d45`会被解析为一个字符，后面的`2`会被当做独立的字符
    ```js
    console.log('\u1d452');      // "ᵅ2"
    console.log('\u1d45');       // "ᵅ"
    ```
3. 如果超出了这个范围，在 ES6 之前，只能按照 utf-16 的规则写成两个`\unnnn`。比如`𝑒`使
用 utf-16 编码后的两个值是`d835`和`dc52`，那么就可以写成
    ```js
    console.log('\ud835\udc52'); // "𝑒"
    ```
4. 但这比较麻烦，因为你还要先进行 utf-16 编码。不过 ES6 支持直接写多字节字符，只要把码
点值写在大括号里即可
    ```js
    console.log('\u{1d452}');    // "𝑒"
    ```

console.log('\ud835\udc52'); // "𝑒"
console.log('\u1d45');       // "ᵅ"
console.log('\u{1d452}');    // "𝑒"



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
2. 使用扩展运算符转换为数组
    ```js
    let str = 'd𝑒f';
    console.log(str.length); // 3

    let arr = [...str];
    console.log(arr); // ["d", "𝑒", "f"]
    console.log([...str].length); // 3
    ```
3. 使用`for...of`遍历字符串
    ```js
    let str = 'd𝑒f';

    for(let i in str){
    	console.log(str[i]);
    }
    // d
    // �
    // �
    // f

    for(let c of str){
    	console.log(c);
    }
    // d
    // 𝑒
    // f
    ```


## 字符方法
### `charAt()`
与`[]`语法的差异
```js
let str = 'a';
console.log(str.charAt(1)); // ""
console.log(typeof str[1]); // undefined
```

### `codePointAt()`
```js
let str = '𝑒';
console.log(str.codePointAt(0)); // 119890
console.log(str.charCodeAt(0)); // 55349
console.log(str.codePointAt(1)); // 56402
```
* 从上面的例子可以看出来，该方法相比于`charCodeAt()`，对多字节字符的兼容性更好一些。但
还不是完全兼容，因为它仍然可以访问到第二个 2byte。


### `String.fromCodePoint()`
*  `String.fromCodePoint(num1[, ...[, numN]])`接受若干个 Unicode code point，返回
它们对应的字符组成的字符串
* 相比于`String.fromCharCode`，这个方法可以兼容多字节字符
    ```js
    console.log(String.fromCodePoint(72, 119890, 0o154, 0o154, 0x6f)); // H𝑒llo
    console.log(String.fromCharCode(72, 119890, 0o154, 0o154, 0x6f)); // H푒llo
    ```


## 拼接和延长字符串
### `concat()`
```js
let str1 = '1';
let str2 = '2';
let str3 = '3';
console.log(str1.concat(str2, str3)); // "123"
console.log(str1); // "1"
```

### `padStart()`和`padEnd()`
#### Syntax
`str.padStart(targetLength [, padString])`

#### `targetLength`参数
1. The length of the resulting string once the current string has been padded.
2. If the value is lower than the current string's length, the current string
will be returned as is.
```js
let str = '123';
console.log(str.padEnd(8, '456')); // "12345645"
console.log(str.padEnd(2, '456')); // "123"
console.log(str); // "123"  不改变原字符串
```

#### 可选的`padString`参数
1. The string to pad the current string with.
2. If this string is too long to stay within the target length, it will be
truncated and the left-most part will be applied.
3. The default value for this parameter is " " (U+0020).
```js
let str = '123';
console.log(str.padEnd(5, '4567890')); // "12345"
console.log(str.padEnd(5) + '.'); // "123  ."
```

### `repeat()`
#### Syntax
`str.repeat(count);`

#### `count`参数
An integer between 0 and +∞: [0, +∞), indicating the number of times to repeat
the string in the newly-created string that is to be returned.
```js
let str = '123';
console.log(str.repeat(3)); // "123123123"
console.log(str.repeat(0)); // ""
console.log(str); // "123"  不改变原字符串
```

#### 不规范参数
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


## 字符串转数组
### `split`
#### Syntax
`str.split([separator[, limit]])`

#### 可选的`separator`参数
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

#### 可选的`limit`参数
最大分块数量。如果拆分的块数已经达到该值，即使字符串还没有拆分完，也会停止拆分，只返回已
拆分出来的部分。
```js
let str = '102030405060';
console.log(str.split('0', 3)); // ["1", "2", "3"]
```


## 确定/查找子字符串
### `includes()`
1. `str.includes(searchString[, position])`
2. 可选参数表示从哪里开始找
3. 搜索空字符串总是返回`true`
```js
let str = 'hello world';
console.log(str.includes('lo'));    // true
console.log(str.includes('lo', 4)); // false
console.log(str.includes(''));      // true
console.log(str.includes(''));      // true
console.log(str.includes('', -1));  // true
console.log(str.includes('', 99));  // true
```

### `indexOf()` `lastIndexOf()`
1. `str.indexOf(searchValue[, fromIndex])`
    `str.lastIndexOf(searchValue[, fromIndex])`
2. 不支持正则
    ```js
    let str = 'abcdefgfedcba';
    console.log(str.indexOf('c'));     // 2
    console.log(str.lastIndexOf('c')); // 10
    ```
3. 对于第二个参数，`indexOf()`是从左边开始数起点位置，`lastIndexOf()`是从右边开始数起
点位置，都是和搜索的方向一样
    ```js
    console.log(str.indexOf('c', 3));     // 10   跳过了左边的 c
    console.log(str.lastIndexOf('c', 3)); // 2    跳过了右边的 c
    ```
3. 如果第二个参数指定的序号超出了范围，则该序号自动变为距离它最近的序号
    ```js
    let str = 'abcdefgfedcba';
    console.log(str.indexOf('c', -100));     // 2    fromIndex 自动变为 0
    console.log(str.lastIndexOf('c', 100)); // 10    fromIndex 自动变为 12
    ```
4. 如果第一个参数为空字符串，逻辑有些讲不通，记住规则就行了：
    * 如果没有第二个参数，一个返回首序号一个返回尾序号：
    ```js
    console.log(str.indexOf(''));         // 0
    console.log(str.lastIndexOf(''));     // 13
    ```
    * 如果有第二个参数：如果参数指定的序号合理就直接返回该序号，如果序号不合理就返回离
    它最近的合理序号
    ```js
    console.log(str.indexOf('', 3));      // 3
    console.log(str.lastIndexOf('', 3));  // 3
    console.log(str.indexOf('', 33));     // 13
    console.log(str.lastIndexOf('', 33)); // 13
    console.log(str.indexOf('', -3));     // 0
    console.log(str.lastIndexOf('', -3)); // 0
    ```

### `startsWidth` `endsWidth`
1. `str.startsWith(searchString [, position])`
   `str.endsWith(searchString[, length])`
2. 注意`endsWith`的第二个参数并不是和`lastIndexOf`的第二个参数一样
    ```js
    let str = 'hello world';
    console.log(str.startsWith('he'));    // true
    console.log(str.startsWith('he', 1));    // false
    console.log(str.endsWith('ld'));    // true
    console.log(str.endsWith('ld', 10));    // false
    console.log(str.endsWith('ld', 11));    // true
    ```
3. 如果第二个参数的位置不合理，会被自动转换为最近的合理的序号
    ```js
    let str = 'hello world';
    console.log(str.startsWith('he', -100));  // true  -100 自动转为 0
    console.log(str.endsWith('ld', 100));     // true  100 自动转为 length 的值
    ```
4. 同样，空串总能被找到
    ```js
    let str = 'hello world';
    console.log(str.startsWith(''));        // true
    console.log(str.endsWith(''));          // true
    console.log(str.startsWith('', -100));  // true
    console.log(str.endsWith('', 100));     // true
    ```

### `match()`
1. `str.match(regexp)`
2. 如果参数不是正则，内部会通过`new RegExp()`将其转换为正则
    ```js
    let str = 'ab|cba';
    console.log(str.match('b|c'));
    // 匹配到的不是"b|c"，而是"b"，因为参数会被转换为正则 /b|c/
    ```
3. 如果没有传参，将匹配空字符串
    ```js
    let str = 'abcba';
    console.log(str.match()); // ["", index: 0, input: "abcba", groups: undefined]
    ```
4. 如果没有匹配到，返回值是`null`。如果匹配到了，返回一个数组，数组项是完整匹配到的字符
串和若干个可能的捕获组。如果不是全局匹配，那么该数组同时还有`index`属性和`input`两个属
性，前者表示完整匹配的字符串的起始位置，后者表示进行匹配的原始字符串。还有一个`groups`
属性不知道是什么，没有地方提到这个属性。
    ```js
    let str = 'abcba';
    console.log(str.match(/(b(c))(b)/)); // ["bcb", "bc", "c", "b", index: 1, input: "abcba", groups: undefined]
    console.log(str.match(/bc|ba/g)); // ["bc", "ba"]
    console.log(str.match(/cd/)); // null
    ```

### `search()`
1. `str.search(regexp)`
2. 和`match`一样，如果参数不是正则先会被转换为正则
3. 和`match`一样，如果不传参将搜索空串
    ```js
    let str = 'abcba';
    console.log(str.search()); // 0
    ```
4. 和`indexOf`一样只会返回第一个匹配到的序号，不支持全局匹配
    ```js
    let str = 'abcba';
    console.log(str.search(/b/g)); // 1
    ```


## 获取、删除和替换子字符串
### 获取子字符串
1. `slice()`方法接收一到两个参数。第一个参数指定字符串的开始位置，第二个参数指定的是子
字符串最后一个字符后面的位置。如果第二个参数小于第一个，则返回空字符串。
2. `substring()`方法接收一到两个参数。第一个参数指定字符串的开始位置，第二个参数指定的
是子字符串最后一个字符后面的位置。如果第二个参数小于第一个，则颠倒两个参数。
3. `substr()`方法接收一到两个参数。第一个参数指定字符串的开始位置，第二个参数指定的是
子字符串的字符个数。
4. 在传递的参数是负值的情况下，`slice()`方法将负值加上字符串`length`；`substring()`方
法会将负值转换为`0`；`substr()`方法第一个参数为负数时将负值加上字符串`length`，而第二
个为负值时，则转换为`0`。

### 替换和删除子字符串
#### `str.replace(regexp|substr, newSubstr|function)`
1. 默认都只是替换第一次匹配到的字符串。但如果第一个参数是正则且使用全局模式，则所有匹配
到的都将被替换。
    ```js
    let str = 'abcba';
    console.log(str.replace(/a/, 'A'));    // "Abcba"
    console.log(str.replace(/a|b/, '6'));  // "6bcba"
    console.log(str.replace('a', 'A'));    // "Abcba"
    console.log(str.replace(/a/g, 'A'));   // "AbcbA"
    ```
2. 第二个参数如果是普通的字符串，会直接替换。但也可以包含一些特殊的替换模式符：
    * `$&`：表示匹配到的子串
    ```js
    let str = 'abcba';
    console.log(str.replace(/a/, '[$&]'));     // "[a]bcba"
    console.log(str.replace('a', '[$&]'));     // "[a]bcba"
    console.log(str.replace(/a/g, '[$&]'));    // "[a]bcb[a]"
    console.log(str.replace(/a|b/g, '[$&]'));  // "[a][b]c[b][a]"
    ```
    * `$``：表示匹配到的子串的前面的部分
    ```js
    let str = 'abcba';
    console.log(str.replace(/a/, '[$`]'));     // "[]bcba"
    console.log(str.replace('a', '[$`]'));     // "[]bcba"
    console.log(str.replace(/b/, '[$`]'));     // "a[a]cba"
    console.log(str.replace(/b/g, '[$`]'));    // "a[a]c[abc]a"
    console.log(str.replace(/a|b/g, '[$`]'));  // "[][a]c[abc][abcb]"
    ```
    * `$'`：表示匹配到的子串的后面的部分
    ```js
    let str = 'abcba';
    console.log(str.replace(/a/, "[$']"));     // "[bcba]bcba"
    console.log(str.replace('a', "[$']"));     // "[bcba]bcba"
    console.log(str.replace(/b/, "[$']"));     // "a[cba]cba"
    console.log(str.replace(/b/g, "[$']"));    // "a[cba]c[a]a"
    console.log(str.replace(/a|b/g, "[$']"));  // "[bcba][cba]c[a][]"
    ```
    * `$n`：表示第`n`个捕获组
    ```js
    let str = 'abcba';
    console.log(str.replace(/(b(c)b)/, '[$2]'));       // "a[c]a"
    console.log(str.replace(/(bc)(b)/, '[$2]'));       // "a[b]a"

    //abc匹配替换后，cba就匹配不上东西了
    console.log(str.replace(/abc|cba/g, '6'));         // "6ba"  
    console.log(str.replace(/a(bc)|c(ba)/g, '[$1]'));  // "[bc]ba"
    // 因为cba匹配不上东西了，所以第二个匹配组就是空的
    console.log(str.replace(/a(bc)|c(ba)/g, '[$2]'));  // "[]ba"
    ```
    * `$$`：表示字符串`$`
    ```js
    let str = 'abcba';
    console.log(str.replace(/c/, '[$$]'));       // "ab[$]ba"
    ```
3. 如果第二个参数是函数，则该函数的返回值将作为替换的值。该函数的第一个参数是匹配到的字
符串，最后一个参数是进行匹配的的完整字符串，倒数第二个参数是匹配位置的偏移量(For
example, if the whole string was 'abcd', and the matched substring was 'bc',
then this argument will be 1.)，中间的若干个可选参数是捕获组。
    ```js
    let str = 'abcba';
    let newStr = str.replace(/b((c)b)/, function(match, p1, p2, offset, string){
    	console.log(match);  // "bcb"
    	console.log(p1);	 // "cb"
    	console.log(p2);     // "c"
    	console.log(offset); // 1
    	console.log(string); // "abcba"
    	return '-';
    });
    console.log(newStr); // "a-a"
    ```
    ```js
    function styleHyphenFormat(propertyName) {
    	function upperToHyphenLower(match, offset, string) {
    		return (offset > 0 ? '-' : '') + match.toLowerCase();
    	}
    	return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
    }
    console.log(styleHyphenFormat('BorderTop')); // "border-top"
    ```


## 格式化字符串
## 大小写转换的`Locale`的问题
1. 先看一下规范中说的：
>This function works exactly the same as toLowerCase except that its result is
intended to yield the correct result for the host environment’s current locale,
rather than a locale-independent result. There will only be a difference in the
few cases (such as Turkish) where the rules for that language conflict with the
regular Unicode case mappings.

2. 看起来是说，Unicode 本身有一套大小写映射，而且绝大多数语言都符合这套映射规则。但只有
很少的语言不符合该规则，比如土耳其语。
3. 也就是说，如果是类似于土耳其语这样的语言，仍然使用`toLowerCase`的话，就是使用的
Unicode 的大小写转换规则，而这并不是土耳其语本身的大小写规则，所以转换结果就不是正确的
土耳其语。
4. 比如你要对用户输入内容进行大小写转换，而恰好用户使用土耳其语输入的，那就可能出现异常。
下面是一个例子：
    ```js
    var str = 'İstanbul';
    console.log(str.toLocaleLowerCase('en-US') === str.toLocaleLowerCase('tr'));
    // false
    // 使用美式英语和土耳其语的规则转换的结果并不相同
    ```
5. 所以如果不确定应用会应用于哪些语言环境，最好还是使用带`Locale`的。
6. 带`Locale`方法的参数是指定使用哪里的转换规则，不过一般情况下都不需要传参，以为根据
MDN 上说的，该参数默认值是 the host environment’s current locale。

### `trim()`
1. The `trim()` method removes whitespace from both ends of a string.
2. Whitespace in this context is all the whitespace characters (space, tab,
no-break space, etc.) and all the line terminator characters (LF, CR, etc.).
3. IE 不支持 `trimStart()`/`trimLeft()`和`trimEnd()`/`trimRight()`


## 字符串比较
`localeCompare()`
