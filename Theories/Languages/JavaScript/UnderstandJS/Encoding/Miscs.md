# Limitation of JS String


<!-- TOC -->

- [Limitation of JS String](#limitation-of-js-string)
    - [ECMAScript strings are immutable](#ecmascript-strings-are-immutable)
    - [Reference](#reference)

<!-- /TOC -->


## ECMAScript strings are immutable
1. You can access the text at any index of a string, but JavaScript provides no way to alter the text of an existing string
    ```js
    let str = 'abc';
    console.log( str[1] ); // 'b'
    str[1] = 'd'; // TypeError: Cannot assign to read only property '1' of string 'abc'
    ```
2. 要改变某个变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字符串充填该变量
    ```js
    let lang = "Java";
    lang = lang + "Script";
    ```
    实现这个操作的过程如下：首先创建一个能容纳 10 个字符的新字符串，然后在这个字符串中填充 `"Java"` 和 `"Script"`，最后一步是销毁原来的字符串 `"Java"` 和字符串 `"Script"`。   
3. All string methods that appear to return a modified string are, in fact, returning a new string value.


## Reference


