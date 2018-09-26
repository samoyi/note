# ES6 Module

## 特性
### 静态化
1. ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的
变量。
2. CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
    ```js
    // CommonJS模块
    let { stat, exists, readFile } = require('fs');

    // 等同于
    let _fs = require('fs');
    let stat = _fs.stat;
    let exists = _fs.exists;
    let readfile = _fs.readfile;
    ```
上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象 `_fs`，然后再从这个
对象上面读取3个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全
没办法在编译时做“静态优化”。
3. ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
4. 这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比
CommonJS 模块的加载方式高。
5. 当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。
6. 由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript
的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

#### 静态化下的`export`和`import`
##### `export`
`export` 必须处于模块顶层。如果处于块级作用域内，就没法做静态优化了
```js
function foo() {
    export default 'bar' // SyntaxError: Unexpected token export
}
```

##### `import`
* `import`命令具有提升效果，会提升到整个模块的头部，首先执行。因为`import`命令是编译阶
段执行的。
    ```js
    foo();
    import { foo } from 'my_module';
    ```
* 由于 `import` 是静态执行，所以不能使用表达式和变量。
    ```js
    // 报错
    import { 'f' + 'oo' } from 'my_module';

    // 报错
    let module = 'my_module';
    import { foo } from module;

    // 报错
    if (x === 1) {
        import { foo } from 'module1';
    } else {
        import { foo } from 'module2';
    }
    ```

### 动态绑定
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

### CommonJS 模块输出值的拷贝
1. 因此 CommonJS 模块一旦输出一个值，模块内部的变化就影响不到这个值。
    ```js
    // lib.js
    let counter = 3;

    function incCounter() {
        counter++;
    }

    module.exports = {
        counter,
        incCounter,
    };
    ```
    ```js
    // main.js

    // 这里分别拷贝了一个基本类型的数值变量和一个函数指针
    // 这里的 counter 和 lib 模块里面的 counter 已经没关系了
    let mod = require('./lib');

    console.log(mod.counter);  // 3
    mod.incCounter();
    console.log(mod.counter); // 3

    console.log(counter);  // 3   本地的 counter
    incCounter(); // 因为闭包，所以这个函数修改的是 lib 模块的 counter，而不是本地的
    console.log(counter); // 3
    ```
2. 如果希望获取到模块里的值而不是其拷贝，可以用 getter 输出值


2. `export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实
时的值。
3. JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚
本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的
`import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，
ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
4. 由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值
会报错。
    ```js
    import {year} from './test.js';
    year = 1987; // TypeError: Assignment to constant variable.
    ```
5. `export`通过接口输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。其中
一个脚本对模块的值进行了更新，其他脚本再读取该值时，也会是更新后的值。不懂具体怎么实现


## ES6 模块与 CommonJS 模块的差异
* CommonJS 模块是运行时加载并输出对象，ES6 模块是编译时输出接口。
* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。


## 基本用法
### `export`
#### 输出单一变量声明
```js
export var year = 1958;
export function multiply(x, y) {
    return x * y;
};
```
```js
import {year, multiply} from './test.js';
console.log(multiply(year, 2)); // 3916
```

#### 一次输出多个变量
```js
let name = '33';
let age = 22;
let year = 1958;

export {name, age, year as num1, year as num2};
```
使用关键字`as`可以为输出重命名，而且可以给同一个变量输出两个不同的名字。但 import 就不
能使用原变量名`year`了，否则会报错
```js
import {name, age, num1, num2} from './test.js';
console.log([name, age, num1, num2]); // ["33", 22, 1958, 1958]
```


### `import`
1. 引入想要的变量时同样可以使用`as`重命名
    ```js
    import {name, age, num1 as year1, num2 as year2} from './test.js';
    console.log([name, age, year1, year2]); // ["33", 22, 1958, 1958]
    console.log(num1); // ReferenceError: num1 is not defined
    ```
2. `import`语句会执行所加载的模块，甚至可以不引入变量只执行模块
    ```js
    import './profile.js';
    ```
3. 如果多次重复执行同一句`import`语句，那么只会执行一次，而不会执行多次。

#### 模块整体加载
```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```
整体加载
```js
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

#### `export default`
1. 使用`export default`时，对应的`import`语句不需要使用大括号。`export default`命令
用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能
使用一次。所以，`import`命令后面才不用加大括号，因为只可能唯一对应`export default`命令
。
    ```js
    // ./test.js
    let num = 22;
    export default num;
    ```
    ```html
    <script type="module">
        import age from './test.js';
        console.log(age); // 22
    </script>
    ```
2. 本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为
它取任意名字。所以，下面的写法是有效的：
    ```js
    // modules.js
    function add(x, y) {
        return x + y;
    }
    export {add as default};
    // 等同于
    // export default add;

    // app.js
    import { default as foo } from 'modules';
    // 等同于
    // import foo from 'modules';
    ```
3. 正是因为 `export default` 命令其实只是输出一个叫做 `default` 的变量，所以它后面不
能跟变量声明语句。
    ```js
    // 正确
    export var a = 1;

    // 正确
    var a = 1;
    export default a;

    // 错误
    export default var a = 1;
    ```
4. 同样地，因为 `export default` 命令的本质是将后面的值，赋给 `default` 变量，所以可
以直接将一个值写在 `export default` 之后。
    ```js
    // 正确
    export default 42;

    // 报错
    export 42; // SyntaxError: Unexpected token export
    ```
5. 如果想在一条 `import` 语句中，同时输入默认方法和其他接口，可以写成下面这样:
    ```js
    // ./test.js
    let num = 22;
    export default 22;
    export let name = '33';
    ```
    ```html
    <script type="module">
        import age, {name} from './test.js';
        console.log(name, age); // "33", 22
    </script>
    ```

### `export` 与 `import` 的复合写法
```js
export { foo, bar } from 'my_module';
```
写成一行以后，`foo` 和 `bar` 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口
，当前模块不能直接使用 `foo` 和 `bar`。

```js
// test.js
export let name = '33';
export let age = 22;
```
```js
// test1.js
export {name, age} from './test.js';
console.log(typeof age); // undefined
```
```html
<script type="module">
    import {name, age} from './test1.js';
    console.log(name, age); // "33", 22
</script>
```

#### 模块的接口改名和整体输出:
```js
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';
```
`export *` 命令会忽略 `my_module` 模块的 `default` 方法

#### 默认接口的写法
```js
export { default } from 'foo';
```
* 具名接口改为默认接口
```js
export { es6 as default } from './someModule';
```
* 默认接口改名为具名接口
```js
export { default as es6 } from './someModule';
```


## 模块的继承
假设有一个 `circleplus` 模块，继承了 `circle` 模块
```js
// circleplus.js
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
    return Math.exp(x);
}
```
上面代码中的 `export *`，表示再输出 `circle` 模块的所有属性和方法，又输出了自定义的
`e` 变量。因为 `export *` 命令会忽略 `circle` 模块的 `default` 方法，所以又输出了自
己的默认方法。


## 运行时加载模块 `import()`
1. `import()`返回一个 Promise 对象
2. `import()`函数与所加载的模块没有静态连接关系，这点也是与`import`语句不相同。
`import()`类似于 Node 的`require`方法，区别主要是前者是异步加载，后者是同步加载。
3. `import()`加载模块成功以后，这个模块会整体作为一个对象被加载，当作`then`方法的参数
    ```js
    // module.js
    export let name = '33';
    export let age = 22;
    ```
    ```js
    let p = import('./module.js');
    p.then(res=>{
        console.log(res.name); // "33"
        console.log(res.age); // 22
    })
    .catch(err=>{
        console.error(err);
    });
    ```
4. 如果模块有`default`输出接口，可以用`default`属性获得。
    ```js
    import('./myModule.js')
    .then(myModule => {
        console.log(myModule.default);
    });
    ```



## 加载方式
### 浏览器加载
1. 浏览器加载 ES6 模块，也使用`<script>`标签，但是要加入`type="module"`特性。
    ```html
    <script type="module">
        import {year} from './year.js'; // 不能省略后缀
        console.log(year);
    </script>
    ```
2. 默认都是`defer`加载。如果想要`async`加载可以加上该特性。
3. 模块的作用域只在`<script>`标签之间，外部无法引用
    ```html
    <script type="module">
        import foo from './components/foo.js'
        console.log(foo);
    </script>
    <script>
    	console.log(typeof foo); // undefined
    </script>
    ```
4. 另外还可以加载一个封闭的模块，即无法获取其输出的值。
    ```html
    <script type="module" src="./test.js">
        console.log(typeof foo); // undefined
    </script>
    ```

#### 与普通 `<script>` 标签加载的不同之处
* 代码是在模块作用域之中运行，而不是在全局作用域运行。
* 模块脚本自动采用严格模式。
* 模块之中，可以使用`import`命令加载其他模块（`.js`后缀不可省略），也可以使用`export`
命令输出对外接口。不懂输出后怎么引用
* 同一个模块如果加载多次，将只执行一次。
* 模块之中，顶层的`this`关键字返回`undefined`，而不是指向`window`。利用这个语法点，可
以侦测当前代码是否在 ES6 模块之中。
    ```html
    <script type="module">
        console.log(this); // undefined
    </script>
    <script>
        'use strict';
        console.log(this); // window
    </script>
    ```


TODO：再看一遍`<script>`标签加载[后面的内容](http://es6.ruanyifeng.com/#docs/module-loader)


## References
* [《ECMAScript 6 入门》Module 的语法](http://es6.ruanyifeng.com/#docs/module)
* [《ECMAScript 6 入门》Module 的加载实现](http://es6.ruanyifeng.com/#docs/module-loader)
