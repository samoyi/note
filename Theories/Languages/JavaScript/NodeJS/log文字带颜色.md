# log文字带颜色


1. 示例
  ```js
  console.log('\x1b[33m Welcome to the app! \x1b[0m');
  ```
2. `\x1b` 是控制字符，后面的 `[数字m` 是设置文字颜色或背景色，[参考](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors)。
3. 如果要在大项目中更多且更有可读性的 log 色彩文字，可以使用 Chalk 库。


## References
* [Using console colors with Node.js](https://blog.logrocket.com/using-console-colors-node-js/)
* [How to change node.js's console font color?](https://stackoverflow.com/a/41407246)
* [ANSI escape code](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors)