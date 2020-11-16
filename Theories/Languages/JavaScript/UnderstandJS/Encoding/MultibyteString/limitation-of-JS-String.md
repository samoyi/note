# Limitation of JS String


<!-- TOC -->

- [Limitation of JS String](#limitation-of-js-string)
    - [Summary](#summary)
    - [Example](#example)
        - [旧的可能会产生问题的字符方法：`String.prototype.charCodeAt` and `String.fromCharCode`](#旧的可能会产生问题的字符方法stringprototypecharcodeat-and-stringfromcharcode)
        - [Use `String.prototype.codePointAt` and `String.fromCodePoint` instead](#use-stringprototypecodepointat-and-stringfromcodepoint-instead)

<!-- /TOC -->



## Summary
1. The JS string type is the set of all ordered sequences of zero or more 16-bit unsigned integer values, as this reason, many JS string methods(and `length` property) can only be used for 2-byte characters, which are in Basic
Multilingual Plane of Unicode.
2. `length` 属性的定义是字符串的长度，这没有错。但字符串的定义 **并不是若干字符组成的序列**，而是 **若干用来表示字符的 16 位值组成的序列**。`length` 统计的是序列中单元的总数，但单元并不是可见的一个字符，而是不可见的一个 16 位数值。
    ```js
    let p = "π"; // π is 1 character with 16-bit codepoint 0x03c0
    let e = "𝑒"; // 𝑒 is 1 character with 17-bit codepoint 0x1d452
    p.length // => 1: p consists of 1 16-bit element
    e.length // => 2: USC-2 encoding of 𝑒 is 2 16-bit values: "\ud835\udc52"
    ```
3. 如果地址没变的话，[这是一个兼容多字节字符的字符串处理 class](https://github.com/samoyi/Nichijou/blob/master/js/string/MultiByte.js)


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
