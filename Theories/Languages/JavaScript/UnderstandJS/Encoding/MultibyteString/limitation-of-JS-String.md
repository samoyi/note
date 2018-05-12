# Limitation of JS String
* The JS string type is the set of all ordered sequences of zero or more 16-bit
unsigned integer values, as this reason, many JS string methods(and `length`
property) can only be used for 2-byte characters, which are in Basic
Multilingual Plane of Unicode.
* `length`属性的定义是字符串的长度，这没有错。但字符串的定义**并不是若干字符组成的序列**
，而是**若干用来表示字符的16位值组成的序列**。`length`统计的是序列中单元的总数，但单元
并不是可见的一个字符，而是不可见的一个16位数值。


## Example
### `String.prototype.charCodeAt` and `String.fromCharCode`
Specification:  [String.prototype.charCodeAt](https://tc39.github.io/ecma262/#sec-string.prototype.charcodeat) and [String.fromCharCode](https://tc39.github.io/ecma262/#sec-string.fromcharcode).
* The unicode of `𝑒` is `U+1D452`, when using UTF-8, its code is `d835dc52`. For
JS, `d835dc52` are two 2-byte characters.
```js
let s = '𝑒';
console.log(s.charCodeAt(0).toString(16)); // d835
console.log(s.charCodeAt(1).toString(16)); // dc52
```
* `String.fromCharCode` will perform [ToUint16](https://tc39.github.io/ecma262/#sec-touint16) on the parameters
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


## JS引擎对UTF-8编码字符的处理
1. 最初产生的疑问是：一个汉字使用UTF-8编码后是3字节（极少数是4字节），那使用UCS-2编码规
则的JS在读取这个汉字的`length`属性时为什么是`1`而不是`2`？
2. 不过这个问题本身就有一个问题，按理说，汉字的`length`属性应该是`1.5`才对，但显然不存
在`1.5`，也不存在两个汉字的`length`属性是`3`的情况。
3. 没有找到具体的解释，但感觉上，应该是下面的逻辑：
4. JS引擎在读取一个JS文件时，发现它是UTF-8编码，然后就对里面的字符串进行解码，从UTF-8
变成Unicode。
5. 一个UTF-8编码下的3字节汉字，解码为没有编码的Unicode是就成了一个2字节大小的码点值。
既然是2字节大小，JS引擎在对其进行UCS-2编码后，自然也就是`length`为1了。
