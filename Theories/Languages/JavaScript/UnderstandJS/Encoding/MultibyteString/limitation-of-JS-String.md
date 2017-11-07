
The JS string type is the set of all ordered sequences of zero or more 16-bit
unsigned integer values, as this reason, many JS string methods(and `length`
property) can only be used for 2-byte characters, which are in Basic
Multilingual Plane of Unicode.

***
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
