# Character escape

A character escape represents a character that may not be able to be conveniently represented in its literal form.

## 控制字符
### 直接的控制字符
1. ``\f``, `\n`, `\r`, `\t`, `\v`
2. `\b` 除外，它在正则表达式中表示单词边界。

### 用 `\c` 表示控制字符
1. `\c` followed by a letter from `A` to `Z` or `a` to `z`。对它后面跟着的字母的 code point 求模 32，得到的值作为某个控制符的 code point。
2. 因为 `A` 和 `a` 正好差了 32，所以大小写无所谓。
3. 但是按照文档说的好像并没用，比如 `\cJ` 并没有变成换行符 `\n`，不懂
    ```js
    console.log(`aa\nbb`);
    // aa
    // bb
    console.log(`aa\cJbb`);
    // aacJbb
    ```


## 空字符 `\0`
1. 空字符，不是空格，应该是没有任何显示效果。但在浏览器中会显示空白字符，node.js 打印时是没有任何效果。
    ```js
    const str = "1" + "\0" + "2";
    console.log(str);
    console.log('[' + str[1] + ']'); // [ ]
    ```
    在浏览器 Console 会显示为 "1 2" 和 "[ ]"，nodejs 命令行中显示为 "12" 和 "[]"
2. 从上面的例子也可以看出，在计算字符串长度时 `\0` 也是算一个字符的。


## 特殊字符本身
`\^`, `\$`, `\\`, `\.` `\*`, `\+`, `\?`, `\(`, `\)`, `\[`, `\]`, `\{`, `\}`, `\|`, `\/`


## `\xHH`
1. 用两位十六进制数指定字符的 Unicode code point 来表示字符
    ```js
    console.log('\x41'); // A
    ```
2. 必须要两位
    ```js
    console.log('\xf'); // SyntaxError: Invalid hexadecimal escape sequence
    ```


## `\uHHHH`
1. 用四位十六进制数指定字符的 Unicode code point 来表示字符
    ```js
    console.log('\u4F60'); // 你
    ```
2. 必须要四位。


## `\u{HHH}`
TODO


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape)