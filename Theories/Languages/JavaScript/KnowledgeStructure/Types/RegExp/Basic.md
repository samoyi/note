# RegExp


<!-- TOC -->

- [Creating a regular expression](#creating-a-regular-expression)
  - [Literal](#literal)
  - [Constructor](#constructor)
- [规则](#规则)
  - [容易误解的几个](#容易误解的几个)
- [flags](#flags)
  - [`g`](#g)
    - [`lastIndex​` 属性](#lastindex-属性)
- [References](#references)

<!-- /TOC -->


## Creating a regular expression
You construct a regular expression in one of two ways: literal and constructor.

### Literal
1. Using a regular expression literal, which consists of a pattern enclosed between slashes, as follows:
    ```js
    let re = /ab+c/;
    ```
2. Regular expression literals provide **compilation of the regular expression when the script is loaded**. 
3. If the regular expression remains constant, using this can improve performance.

### Constructor
1. Or calling the constructor function of the `RegExp` object, as follows:
    ```js
    let re = new RegExp('ab+c');
    ```
2. Using the constructor function provides `runtime compilation` of the regular expression. 
3. Use the constructor function when you know the regular expression pattern will be changing, or you don't know the pattern and are getting it from another source, such as user input.


## 规则
### 容易误解的几个
* `[^ab]`：中括号里开头的 `^` 并不是匹配字符串的开始，而是表示排除掉中括号里的字符。对于本例，也就是说任何不是 `a` 或 `b` 的字符。
* `[a^b]`：中括号里非开头的 `^` 就是它的字面值。对于本例，就是匹配 `a` 或 `^` 或 `b` 三个字符。
* `[a|b]`：中括号里 `|` 就不说或，而是它的字面值。
* `.`：匹配换行符(`\n`)以外的任意字符。


## flags 
### `g`
#### `lastIndex​` 属性
1. 当正则表达式使用 `g` 标志时，它会维护一个 `lastIndex​` 实例属性，表示下次匹配开始搜索的位置
    ```js
    const regex = /abc/g;
    const str = 'abcdef';

    console.log(regex.lastIndex); // 0（还没匹配过一次，所以开始位置是第一个字符）

    // 第一次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 3（匹配到了前三个字符，lastIndex 更新第四个字符的位置）

    // 第二次 test
    console.log(regex.test(str));  // false
    console.log(regex.lastIndex);  // 0（匹配失败后重置为 0）

    // 第三次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 3
    ```
2. 如果必须要用 `g` 标志但还要进行这种重复匹配，那可以在每次匹配后重置 `lastIndex` 属性为 0
    ```js
    const regex = /abc/g;
    const str = 'abcdef';

    // 第一次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 3

    regex.lastIndex = 0; // 重置

    // 第二次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 3
    ```
3. 这个属性其实是 `exec` 方法所使用的，`test` 等其他一些方法内部调用了 `exec` 方法所以也有类似的特点。但并不是所有和正则相关的匹配方法都受到这个影响
   ```js
    const regex = /abc/g;
    const str = 'abcdef';

    // 第一次
    console.log(str.match(regex));  // ['abc']
    console.log(regex.lastIndex);  // 0


    // 第二次
    console.log(str.match(regex));  // ['abc']
    console.log(regex.lastIndex);  // 0
    ```
    ```js
    const regex = /abc/g;
    const str = 'abcdef';

    // 第一次
    console.log([...str.matchAll(regex)][0]);  // ['abc', index: 0, input: 'abcdef', groups: undefined]
    console.log(regex.lastIndex);  // 0


    // 第二次
    console.log([...str.matchAll(regex)][0]);  // ['abc', index: 0, input: 'abcdef', groups: undefined]
    console.log(regex.lastIndex);  // 0
    ```
    ```js
    const regex = /abc/g;
    const str = 'abcdef';

    // 第一次
    console.log(str.search(regex));  // 0
    console.log(regex.lastIndex);  // 0


    // 第二次
    console.log(str.search(regex));  // 0
    console.log(regex.lastIndex);  // 0
    ```
4. 如果 `lastIndex` 超出了字符串的范围，也会匹配失败，并且 `lastIndex` 会被重置为 0
    ```js
    const regex = /abc/g;
    const str = 'abcabc';

    console.log(regex.lastIndex); // 0（还没匹配过一次，所以开始位置是第一个字符）

    // 第一次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 3（匹配到了前三个字符，lastIndex 更新第四个字符的位置）

    // 第二次 test
    console.log(regex.test(str));  // true
    console.log(regex.lastIndex);  // 6（超出自付出啊你的范围）

    // 第三次 test
    console.log(regex.test(str));  // false
    console.log(regex.lastIndex);  // 0
    ```


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

