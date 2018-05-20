# CommonJS and AMD

## CommonJS 模块的加载原理
1. CommonJS 的一个模块，就是一个脚本文件。`require`命令第一次加载该脚本，就会执行整个
脚本，然后在内存生成一个对象。
```js
{
    id: '...',
    exports: { ... },   
    loaded: true,
    ...其他若干属性
}
```
2. 上面代码就是Node内部加载模块后生成的一个对象。该对象的id属性是模块名，`exports`属性
是模块的输出，`loaded`属性是一个布尔值，表示该模块的脚本是否执行完毕。
3. 以后需要用到这个模块的时候，就会到`exports`属性上面取值。即使再次执行`require`命令，
也不会再次执行该模块，而是到缓存之中取值，除非手动清除系统缓存。

### 循环加载
`a.js`:
```js
exports.done = false;
var b = require('./b.js');
exports.done = true;
```
`b.js`:
```js
exports.done = false;
var a = require('./a.js');
exports.done = true;
```
`main.js`:
```js
var a = require('./a.js');
var b = require('./b.js');
```
1. `a.js`脚本先输出一个`done`变量，然后加载另一个脚本文件`b.js`。
2. 此时`a.js`代码就停在这里，等待`b.js`执行完毕，再往下执行。
3. `b.js`执行到第二行，就会去加载`a.js`，这时，就发生了“循环加载”。
4. 系统会去`a.js`模块对应对象的`exports`属性取值，可是因为`a.js`还没有执行完，从
`exports`属性只能取回已经执行的部分，而不是最后的值。
5. 因此，对于`b.js`来说，它从`a.js`只输出一个变量`done`，值为`false`。
6. `b.js`接着往下执行，等到全部执行完毕，再把执行权交还给`a.js`。于是，`a.js`接着往下
执行，直到执行完毕。
7. `main.js`获得`a.js`输出的变量`done`，值为`true`。



## References
* [JavaScript Module Systems Showdown: CommonJS vs AMD vs ES2015](https://auth0.com/blog/javascript-module-systems-showdown/)
* [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/module-loader#CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E5%8E%9F%E7%90%86)
