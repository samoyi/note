# Primitive And Reference Values
<!-- TOC -->

- [Primitive And Reference Values](#primitive-and-reference-values)
    - [Misc](#misc)
    - [能用 `let`/`const` 就别用`var`](#能用-letconst-就别用var)
        - [块级作用域](#块级作用域)
        - [声明提升](#声明提升)
        - [不会作为全局属性](#不会作为全局属性)
        - [重复声明](#重复声明)
        - [TDZ(Temporal Dead Zone)](#tdztemporal-dead-zone)
    - [`const`](#const)
        - [声明的同时必须明确赋值](#声明的同时必须明确赋值)
    - [`instanceof`](#instanceof)
    - [解构（Destructuring）赋值](#解构destructuring赋值)
        - [默认值](#默认值)
        - [Iterable 类型的解构赋值](#iterable-类型的解构赋值)
            - [使用扩展运算符的解构赋值](#使用扩展运算符的解构赋值)
        - [对象的解构赋值](#对象的解构赋值)
            - [对象式解构赋值的内部机制](#对象式解构赋值的内部机制)
            - [和数组一样也可以嵌套解构](#和数组一样也可以嵌套解构)
            - [也可以使用默认值](#也可以使用默认值)
        - [数值和布尔值式解构赋值](#数值和布尔值式解构赋值)
        - [函数参数式解构赋值](#函数参数式解构赋值)
            - [默认值要改为使用对象形式参数](#默认值要改为使用对象形式参数)
        - [常见用途](#常见用途)

<!-- /TOC -->



## Misc
1. ECMAScript 变量松散类型的本质，决定了它只是在特定时间用于保存特定值的一个名字而已。由于不存在定义某个变量必须要保存何种数据类型值的规则，变量的值及其数据类型可以在脚本的生命周期内改变。
2. 在很多语言中，字符串以对象的形式表示，因此被认为是引用类型。ECMAScript 放弃了这一传统。


## 能用 `let`/`const` 就别用`var`
### 块级作用域
1. `let` 会生成块级作用域
    ```js
    {
        let n = 2;
    }
    console.log(typeof n); // undefined
    ```
2. `var` 因为没有块级作用域而臭名昭著的问题
    ```js
    let arr = [];
    for (var i = 0; i < 3; i++) {
        arr[i] = function () {
            console.log(i);
        };
    }
    arr[1](); // 3
    ```
    相当于：
    ```js
    let arr = [];

    {
        var i = 0;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 1;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 2;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 3;
    }

    arr[1](); // 3
    ```
    三个函数的父级作用域其实是同一个作用域，也只有一个 `i`。在函数调用时，`i` 已经是4了
3. 如果使用 `let` 进行 `for` 循环，展开后相当于：
    ```js
    let arr = [];

    {
        let i = 0;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 1;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 2;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 3;
    }

    arr[1](); // 1
    ```
    三个函数的父级作用域都是分别独立的，而且 `i` 各不相同。
4. `{}` 的必要性
    ```js
    if (false)
    let a = 2;
    // SyntaxError: Lexical declaration cannot appear in a single-statement context
    ```
    块级作用域（使用 `{}` ）的出现，就使得省略 `{}` 的情况不一定安全。在块级作用域出现之前，这里的 `{}` 是可有可无的，但因为块级作用域要求必须使用 `{}`，所以这里就会出错。同样的情况在严格模式下声明函数时也会出现。

### 声明提升
1. `let` 声明的变量不会被提升
    ```js
    console.log(i); // ReferenceError: i is not defined
    let i = 0;
    ```
    这很合理直观，因为 `console.log(i)` 的时候还没有定义 `i`
2. `var` 变量声明会被提前。不过变量初始化并不会
    ```js
    console.log(i); // undefined
    var i = 0;
    ```
    其实相当于：
    ```js
    var i; // 声明提升
    console.log(i);
    i = 0; // 初始化没有被提升
    ```
3. 一个因为提升而反直觉的例子
    ```js
    var x = 22;

    function foo(){
        console.log(x);
        var x = 33; // 声明了一个局部作用域的 x，并提升到局部作用域顶部
    };

    foo(); // undefined
    ```
    最舒服的直觉，应该打印 `22` 或 `33`。函数内部相当于如下顺序：
    ```js
    var x;
    console.log(x);
    x = 33;
    ```
    如果使用 `let`，则根本不会给你反直觉的机会，直接就报错了
    ```js
    function foo(){
        console.log(x); // ReferenceError: x is not defined
        let x = 33;
    };
    ```

### 不会作为全局属性
```js
var a = 22;
let b = 33;

console.log(window.a); // 22
console.log(window.b); // undefined
```

### 重复声明
1. `var` 声明的变量可以再次用 `var` 重复声明
    ```js
    var n = 2;
    var n = 3;
    ```
2. 只要有 `let` 参与的声明，在整个作用域的任何地方(不管之前还是之后)都不能重复声明
    ```js
    // 之后的情况
    let n = 0;
    var n = 2; // SyntaxError: Identifier 'n' has already been declared
    // 可以理解为 let 不允许自己声明的变量被重新声明

    // 之前的情况
    var n = 2;
    let n = 0; // SyntaxError: Identifier 'n' has already been declared
    // 可以理解为 let 不会去声明别人已经声明过的变量
    ```

### TDZ(Temporal Dead Zone)
1. 好像因为 `let` 的出现，又要学习 TDZ 这个 “新概念”。这是因为我们已经适应了 `var` 的不合理性，然后突然出现了一个理所应当的情况，反倒成了一个 “新概念”。
2. 上面声明提升中的例子
    ```js
    function foo(){
        console.log(x); // ReferenceError: x is not defined
        let x = 33;
    };
    ```
    如果没有先入为主学习了不合理的声明提升，这种错误可以说是很明显的：在你还没声明一个变量的时候就是用它，当然要报错。
3. 但是这所谓 TDZ，还是有他新的地方，倒不如说是缺陷。就是让 `typeof` 变得不那么正确了：
    ```js
    console.log(typeof x); // ReferenceError: x is not defined
    let x;
    ```
    `typeof` 一个未声明的变量返回 `undefined` 这合情合理，那么在 `let x` 之前，`x` 就是未声明的，所以理应依然返回 `undefined`，但这里还是把它设计为报错了。那这是不是说，`let` 之前的未声明和真正的未声明是有区别的呢？否则为什么前者报错后者返回 `undefined`？


## `const`
### 声明的同时必须明确赋值
1. 不管是 `let` 或 `var`，声明变量的时候都可以不明确赋值：
    ```js
    let n;
    n = 2;
    ```
    先声明一个变量 `n` 并赋值 `undefined`，之后再把变量 `n` 的值变为 `2`.
2. 但使用 `const` 声明变量必须明确赋值：
    ```js
    const n; // Uncaught SyntaxError: Missing initializer in const declaration
    ```
3. 声明的时候不明确赋值，其实就是对其赋值 `undefined`。几乎所有的情况下，都是在以后需要对其进行重新赋值的，这显然是常量所不允许的。所以虽然你也有极小的可能性以至于不正常的就是想要声明一个值为 `undefined` 的常量，但 ES 还是直接禁止了这种行为。
4. 因为 JS 的引用类型变量实际上只是指针，所以将其定义为常量，只是将该指针定义为常量，而不是将实际引用的对象定义为常量
    ```js
    const OBJ = {
        age: 22,
    };
    OBJ.age = 33;
    console.log(OBJ); // {age: 33}
    ```
    上面这种情况，并不能解释为 “如果把一个引用类型定义为常量，那么该引用类型本身不能改变，但是它的子属性可以改变”。常量就是完全不能变的，只不过这里的常量不是对象本身，而是指向对象的指针。上述过程中，指针没有发生变化，一直都是指向的同一个对象，但是对象本身发生了变化。然而对象不本身不是常量，所以这么变化没什么问题。
5. 想要定义一个真正的常量对象，只有递归使用 `Object.freeze`


## `instanceof`
`object instanceof constructor`

1. This operator tests whether the `prototype` property of a constructor appears **anywhere in the prototype chain** of an object. 即，`object` 的原型链中是否有一节是 `constructor.prototype`
2. 注意是根据构造函数的原型链而不是根据构造函数来判断
    ```js
    function Foo(){}
    let foo = new Foo(); // foo 的直接原型就是 Foo.prototype 引用的对象，设为 proto1
    console.log(foo instanceof Foo); // 所以这里是 true
    Foo.prototype = {}; // Foo.prototype 引用了一个新对象作为原型，设为 proto2
    // foo 的原型链里有 proto1 但没有 proto2，所以 Foo.prototype 不在 foo 的原型链里
    console.log(foo instanceof Foo); // false
    ```
3. 可以自己实现一个 `instanceof`，来更明确的看到它的原理
    1. 函数原型
        ```js
        function my_instanceof (instance, constructor) {
            let bool;

            return bool;
        }
        ```
    2. 算法流程
        1. 读取 `constructor` 的原型 `consProto`;
        2. 通过循环遍历 `instance` 的原型链上的每个原型，直到原型不存在则返回 `false`，或者找到的原型就是 `consProto`。
    3. 边界条件：
        * 基础类型的最终原型也会是 `Object.prototype`，所以 `instance` 不能是基础类型；
        * 如果 `instance` 是 `null`，虽然会通过使用 `typeof` 的基础类型筛选，但是 `Object.getPrototypeOf(null)` 时，ES5 会直接报错，ES6 会试图将基础类型的参数转换为对象，但是 `null` 无法转换为对象，所以还是会报错；
        * 循环获取原型直到获取到 `undefined`；
        * `constructor` 不是函数；
    4. 实现
        ```js
        function my_instanceof (instance, constructor) {
            if (typeof constructor !== "function") {
                throw new TypeError(`The second parameter is not a function.`);
            }

            let consProto = constructor.prototype;
            let insProto = Object.getPrototypeOf(instance);
            while (insProto && insProto !== consProto) {
                insProto = Object.getPrototypeOf(insProto);
            }
            if (insProto && insProto === consProto) {
                return true;
            }

            return false;
        }
        ```
4. 所有引用类型的值都是 `Object` 的实例。因此在检测一个引用类型值和 `Object` 构造函数时，`instanceof` 操作符始终会返回 `true`。
5. 当然，使用 `instanceof` 操作符检测基本类型的值，始终会返回 `false`，因为基本类型不是对象实例。
6. 不懂。下面这种情况要怎么解释
    ```js
    function Foo(){}

    let obj_Foo = Foo.bind({});

    let instance = new obj_Foo();

    console.log(obj_Foo.prototype); // undefined
    console.log(instance instanceof obj_Foo); // true
    ```
    《Javascript - The Definitive Guide 6th》也只是对这个做了事实陈述，也没有在其他地方看到原因。但给人的感觉是，如果调用构造函数创建的实例在这种情况下返回 `false` 会比较违和，所以就让 `instanceof` 在这种情况下做出了妥协。


## 解构（Destructuring）赋值
1. 本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。
2. 如果解构赋值不成功，变量的值就等于`undefined`。但是如果是扩展运算符的变量解构赋值失
败，则值为空数组
    ```js
    let [foo] = [];
    let [bar, baz] = [1];
    console.log(foo); // undefined
    console.log(bar); // 1
    console.log(baz); // undefined

    let [x, y, ...z] = [1];
    console.log(x); // 1
    console.log(y); // undefined
    console.log(z); // []
    ```

### 默认值
1. 解构赋值允许指定默认值
    ```js
    var [m, n=3] = [2];
    console.log(m, n); // 2, 3
    ```
2. 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。
    ```js
    function fn() {
    	console.log('aaa'); //并不会执行
    	return 2233;
    }
    let [x = fn()] = [123]; // 因为这里不是用默认值，所以表达式不会求值
    console.log(x); // 123
    let [y = fn()] = []; // 这里使用默认值，表达式求值，输出 "aaa"
    console.log(y); // 2233
    ```
3. 默认值可以引用解构赋值的其他变量，但该变量必须已经声明
    ```js
    {
    	let [x = 1, y = x] = [];
    	console.log(x, y); // 1 1
    }

    {
    	let [x = 1, y = x] = [2];
    	console.log(x, y); // 2 2
    }

    {
    	let [x = 1, y = x] = [1, 2];
    	console.log(x, y); // 1 2
    }

    {
    	let [x = y, y = 1] = []; // ReferenceError: y is not defined
    	// 因为求值过程是从左到右，先执行 x = y，而此时 y 还没来得及被赋予默认值
    }
    ```

### Iterable 类型的解构赋值
```js
// 数组
{
	let [a, b, c] = [1, 2, 3];
	console.log(a, b, c); // 1 2 3
}
{
	let [foo, [[bar], baz]] = [1, [[2], 3]];
	console.log(foo, bar, baz); // 1 2 3
}
{
	let [x, , y] = [1, 2, 3];
	console.log(x, y); // 1 3
}
{
	let [x, y] = [1, 2, 3];
	console.log(x, y); // 1 2

	[x, y] = [y, x];
	console.log(x, y); // 2 1
}

// set
{
    let set = new Set([1, 2, 3]);
    let [x, y, z] = set;
    console.log(x, y, z); // 1 2 3
}
{
    let set = new Set([1, 2, [3, 4]]);
    let [x, y, [a, b]] = set;
    console.log(x, y, a, b); // 1 2 3 4
}
{
    let set = new Set([1, 2, new Set([3, 4])]);
    let [x, y, [a, b]] = set;
    console.log(x, y, a, b); // 1 2 3 4
}

// map
{
    let map = new Map();
    map.set(1, 4).set(2, 5).set(3, 6);
    let [x, y, z] = map;

    console.log(x); // [1, 4]
    console.log(y); // [2, 5]
    console.log(z); // [3, 6]
}
{
    let map = new Map();
    map.set(1, 6).set(2, 7).set(3, 8).set([4, 9], [5, 10]);
    let [x, y, z, [a, b]] = map;

    console.log(x); // [1, 6]
    console.log(y); // [2, 7]
    console.log(z); // [3, 8]
    console.log(a); // [4, 9]
    console.log(b); // [5, 10]
}
{
    let map = new Map();
    map.set(1, 6).set(2, 7).set(3, 8).set(new Map([[4, 9]]), new Map([[5, 10]]));
    let [x, y, z, [[a], [b]]] = map;

    console.log(x); // [1, 6]
    console.log(y); // [2, 7]
    console.log(z); // [3, 8]
    console.log(a); // [4, 9]
    console.log(b); // [5, 10]
}

// string
{
    let str = '123';
    let [x, y, z] = str;
    console.log(x, y, z); // "1" "2" "3"
}
```

1. 如果等号右边不是 Iterable 类型，则会报错
    ```js
    let [] = {}; // TypeError: {} is not iterable
    ```

#### 使用扩展运算符的解构赋值
```js
let [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]

let [x, y, ...z] = [1];
console.log(x); // 1
console.log(y); // undefined
console.log(z); // []
```


### 对象的解构赋值
1. 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对
象的属性没有次序，变量必须与属性同名，才能取到正确的值。
    ```js
    let { foo, bar } = { baz: '没有用', foo: "aaa", bar: "bbb" };
    console.log(foo); // "aaa"
    console.log(bar); // "bbb"

    let { baz } = { foo: "aaa", bar: "bbb" };
    console.log(baz); // undefined
    ```
2. 如果变量名与属性名不一致，必须按照下面的规则，不能使用再属性的简写形式
    ```js
    let obj = { first: 'hello', last: 'world' };
    let { first: f, last: l } = obj;
    console.log(f); // "hello"
    console.log(l); // "world"

    let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
    console.log(baz); // "aaa"
    console.log(foo); // ReferenceError: foo is not defined
    ```

#### 对象式解构赋值的内部机制
1. 结合上面正确和错误的例子，以及下面的例子，分析对象式解构赋值的内部机制
    ```js
    let { foo: foo, bar: bar, foo: baz} = { foo: "aaa", bar: "bbb" };
    console.log(foo); // "aaa"
    console.log(bar); // "bbb"
    console.log(baz); // "aaa"
    ```
2. 先根据左边的属性名，找到右边的对应属性；然后把右边属性的属性值赋给左边对应属性的属性值变量。
3. 以给`baz`成功赋值为例：先根据左边的`foo`属性名找到右边对应的`foo`属性，获得属性值`'aaa'`。
4. 然后把`'aaa'`赋值给左边的`foo`属性的属性值变量`baz`。
5. 所以`foo: baz`里面的`foo`并不是声明的变量，它只是一个查找标识符。正因为它不是一个声明的变
量，所以才不会和`foo: foo`冲突导致重复声明变量的错误。
6. 冒号右边才是被声明的变量，所以下面的就会出错
    ```js
    let {foo: baz, bar: baz} = { foo: "aaa", bar: "bbb" };
    // SyntaxError: Identifier 'baz' has already been declared
    ```

#### 和数组一样也可以嵌套解构
```js
const obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
console.log(x); // "Hello"
console.log(y); // "World"
```
```js
const node = {
	loc: {
		start: {
			line: 1,
			column: 5
		}
	}
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
console.log(loc); // {start: {…}}
console.log(start); // {line: 1, column: 5}
console.log(line); // 1
```

#### 也可以使用默认值
```js
var {x = 3} = {};
x // 3

var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x: y = 3} = {};
y // 3

var {x: y = 3} = {x: 5};
y // 5

var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"
```


### 数值和布尔值式解构赋值
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。
```js
let {toString: ns} = 123;
console.log(ns === Number.prototype.toString); // true

let {toString: bs} = true;
console.log(bs === Boolean.prototype.toString); // true
```


### 函数参数式解构赋值
```js
// 对象形式
{    
    function add({x, y}){
        console.log(x + y);
    }
    add({x: 1, y: 2}); // 3
}

// 数组形式
{    
    function add([x, y]){
        console.log(x + y);
    }
    add([1, 2]); // 3

    // 遍历过程共调用两次回调，分别传参[1, 2]好[3, 4]，解构赋值给 a 和 b
    let arr = [[1, 2], [3, 4]].map(([a, b]) => a + b);
    console.log(arr); // [3, 7]
}
```

#### 默认值要改为使用对象形式参数
1. 最基本的默认值
    ```js
    {
    	function add({x=1, y=2}){
    		 console.log(x + y);
    	 }
    	 add({}); // 3
    	 add({x: 3, y: 4}); // 7
    }
    {
    	function add([x=1, y=2]){
    		console.log(x + y);
    	}
    	add([]); // 3
    	add([3, 4]); // 7
    }
    ```
    注意这里仍然要传参一个空对象或空数组，否则就是在对`undefined`解构了，会报错
2. 显然这还不够默认。应该把空对象或空数组设置为普通的函数参数默认值
    ```js
    {
    	function add({x=1, y=2} = {}){
    		 console.log(x + y);
    	 }
    	 add(); // 3
    	 add({x: 3, y: 4}); // 7
    }
    {
    	function add([x=1, y=2] = []){
    		console.log(x + y);
    	}
    	add(); // 3
    	add([3, 4]); // 7
    }
    ```

### 常见用途
1. 交换变量值
    ```js
    let x = 1;
    let y = 2;

    [x, y] = [y, x];
    ```
根据[这篇文章](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
，截至 2017.10，这种方式有明显的性能损失
2. 从函数返回多个值
    ```js
    // 返回一个数组
    function example() {
      return [1, 2, 3];
    }
    let [a, b, c] = example();

    // 返回一个对象
    function example() {
      return {
        foo: 1,
        bar: 2
      };
    }
    let { foo, bar } = example();
    ```
3. 直接以数组或对象传参。不过与`apply`和 spread 运算符来传参数组不同，这里的函数必须预定义解
构赋值格式的参数。
4. 提取对象中的属性和方法。常见于获取模块方法。
5. 遍历 map
    ```js
    for (let [key, value] of map) {}
    ```
