# CommonJS


## Node.js 的 CommonJS 模块实现
### 缘起
在 ES6 之前，JS 都是不支持模块化的。Node.js 使用 CommonJS 规范实现了模块化。

### 实现原理
1. 其实要实现模块功能，并不需要语法层面的支持。Node.js 并没有增加任何 JavaScript 语法。
2. 实现模块功能的奥妙就在于 JavaScript 是一种函数式编程语言，它支持闭包。如果我们把一
段 JavaScript 代码用一个函数包装起来，这段代码的所有全局变量就变成了函数内部的局部变量。
3. 例如下面一个模块`sayHi.js`
    ```js
    function sayHi(){
        console.log('Hi');
    }
    ```
4. 当`require('sayHi')`时，Node.js 加载该文件，然后把它内部的代码包装进函数，变成这样执行：
    ```js
    (function(exports, require, module, __filename, __dirname){
        function sayHi(){
            console.log('Hi');
        }
    })
    ```
5. 这样，本来的全局变量`sayHi`就变成了匿名函数内部的局部变量。

#### 实现变量输出
1. 上面封闭了模块的作用域，但还不能把模块内的变量`sayHi`输出给外部。




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
2. 上面代码就是 Node 内部加载模块后生成的一个对象。该对象的 `id` 属性是模块名，
`exports` 属性是模块的输出，`loaded` 属性是一个布尔值，表示该模块的脚本是否执行完毕。
3. 以后需要用到这个模块的时候，就会到 `exports` 属性上面取值。即使再次执行`require`命
令，也不会再次执行该模块，而是到缓存之中取值，除非手动清除系统缓存。

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
1. `a.js` 脚本先输出一个 `done` 变量，然后加载另一个脚本文件 `b.js`。
2. 此时 `a.js` 代码就停在这里，等待 `b.js` 执行完毕，再往下执行。
3. `b.js` 执行到第二行，就会去加载 `a.js`，这时，就发生了“循环加载”。
4. 系统会去 `a.js` 模块对应对象的 `exports` 属性取值，可是因为 `a.js` 还没有执行完，
从 `exports` 属性只能取回已经执行的部分，而不是最后的值。
5. 因此，对于 `b.js` 来说，它从 `a.js` 只输出一个变量 `done`，值为 `false`。
6. `b.js` 接着往下执行，等到全部执行完毕，再把执行权交还给 `a.js`。于是，`a.js` 接着往
下执行，直到执行完毕。
7. `main.js` 获得`a.js`输出的变量 `done`，值为 `true`。


## References
