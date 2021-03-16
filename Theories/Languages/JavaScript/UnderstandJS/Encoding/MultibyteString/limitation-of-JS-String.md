# Limitation of JS String


<!-- TOC -->

- [Limitation of JS String](#limitation-of-js-string)
    - [String in JS](#string-in-js)
    - [Example](#example)
        - [旧的可能会产生问题的字符方法：`String.prototype.charCodeAt` and `String.fromCharCode`](#旧的可能会产生问题的字符方法stringprototypecharcodeat-and-stringfromcharcode)
        - [Use `String.prototype.codePointAt` and `String.fromCodePoint` instead](#use-stringprototypecodepointat-and-stringfromcodepoint-instead)
    - [Reference](#reference)

<!-- /TOC -->


## String in JS
1. JavaScript's String type is a set of "elements" of **16-bit unsigned integer** values  (UTF-16 code units，之前有看过是 USC-2 的，不过看最新的规范确实是 UTF-16)。
2. Each element in the String occupies a position in the String.
3. 之前有过疑问 “为什么大部分汉字的　UTF-8 编码是 3 字节，但 `length` 却是 `1`？”，就是因为这些汉字会先被 JS 引擎解码为
Unicode 再使用 UTF-16 编码，根据 UTF-16 的编码规则，编码结果就是两个字节。
4. 位于 Unicode 编码 basic multilingual plane(从 0x0000 到 0xffff) 的字符，字符编码可以用 16 位表示，因为可以正常的表示为一个 JavaScript 字符。
5. 但是超出这个范围的话，字符编码就超过了 16 位，按照 JavaScript UTF-16 的编码规则，就只能表示为两个字符。这就导致你看起来是一个字符，但是查询 `length`属性的话却是两个字符
    ```js
    let p = "π"; // π is 1 character with 16-bit codepoint 0x03c0
    let e = "𝑒"; // 𝑒 is 1 character with 17-bit codepoint 0x1d452
    p.length // => 1: p consists of 1 16-bit element
    e.length // => 2: USC-2 encoding of 𝑒 is 2 16-bit values: "\ud835\udc52"
    ```
6. 看到说因为 UTF-16 编码可以用两字节表示 BMP 以外的字符，而 USC-2 只能表示 BMP 的字符。所以说明 JS 是使用 UCS-2 编码而非 UTF-16 编码，[这篇文章](https://mathiasbynens.be/notes/javascript-encoding) 说到，JS 引擎大多使用 UTF-8，但 JS 语言本身是 UCS-2。
7. 所以说，`length` 属性的定义是字符串的长度，这没有错。但字符串的定义 **并不是若干字符组成的序列**，而是 **若干用来表示字符的 16 位值组成的序列**。`length` 统计的是序列中单元的总数，但单元并不是可见的一个字符，而是不可见的一个 16 位数值。
8. ES6 之前的字符串处理方法都没有考虑到多字符字符的情况。所以应该尽量使用 ES6 及之后的字符串处理方法。如果地址没变的话，[这是一个兼容多字节字符的字符串处理 class](https://github.com/samoyi/Nichijou/blob/master/js/string/MultiByte.js)


## Example
### 旧的可能会产生问题的字符方法：`String.prototype.charCodeAt` and `String.fromCharCode`
1. Specification: [String.prototype.charCodeAt](https://tc39.github.io/ecma262/#sec-string.prototype.charcodeat)
and [String.fromCharCode](https://tc39.github.io/ecma262/#sec-string.fromcharcode).
2. The unicode of `𝑒` is `U+1D452`, when using UTF-8, its code is `d835dc52`. For JS, `d835dc52` are two 2-byte characters:
    ```js
    let s = '𝑒';
    console.log(s.charCodeAt(0).toString(16)); // d835
    console.log(s.charCodeAt(1).toString(16)); // dc52
    ```
3. `String.fromCharCode` will perform [ToUint16](https://tc39.github.io/ecma262/#sec-touint16) on the parameters:
    ```js
    let s = '𝑒';
    console.log(String.fromCharCode(0x1d452)); // 푒
    console.log(String.fromCharCode(0x1d452%0x10000) === String.fromCharCode(0x1d452)); // true
    ```

### Use `String.prototype.codePointAt` and `String.fromCodePoint` instead
```js
let s = '𝑒';
console.log(s.codePointAt(0).toString(16)); // 1d452
// String.prototype.codePointAt: If a valid UTF-16 surrogate pair does not begin
// at pos, the result is the code unit at pos.
console.log(s.codePointAt(1).toString(16)); // dc52
console.log(String.fromCodePoint(0x1d452)); // 𝑒
```


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Text_formatting)
* [JavaScript’s internal character encoding: UCS-2 or UTF-16?](https://mathiasbynens.be/notes/javascript-encoding)

