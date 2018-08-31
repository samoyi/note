# Function

## Defining Functions
### 四种定义函数的方式
#### 1. function declaration statement
#### 2. function definition expression
* 同时使用函数声明和函数表达式，函数声明的函数名只在函数体内有效
    ```js
    let foo = function bar(){
        console.log( 1 + foo.name ); // bar
        console.log( 2 + bar.name ); // bar
    };
    foo();
    console.log( 3 + foo.name ); // bar
    console.log( 4 + bar.name ); //ReferenceError: bar is not defined
    bar(); //ReferenceError: bar is not defined
    ```

#### 3. ES6 箭头方式
* 如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
    ```js
    var f = () => 5;
    var sum = (num1, num2) => num1 + num2;
    ```
* 如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来。并且，在这种情况
下如果要指定返回值，必须明确的使用`return`
    ```js
    let log = () => {
        let nRan = Math.random();
        alert( nRan );
        return "return value";
     };
    ```
* 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。
    ```js
    var getTempItem = id => ({ id: id, name: "Temp" });
    ```
* 箭头函数的`this`使用词法作用域
    ```js
    function foo(){
        let bar = () => console.log(this);
        bar();
    }
    foo(); // undefined
    let o = {
        name: "o",
        baz: foo
    }
    o.baz(); // Object {name: "o"}
    ```
* 箭头函数同样可以使用解构赋值参数        
    ```js
    const full = ({ first, last }) => first + ' ' + last;
    ```
* 使用箭头函数可以很方便的定义回调函数
    ```js
    var result = values.sort((a, b) => a - b);
    ```

#### 4. Function 构造函数方式
1. 构造函数可以接收任意数量的参数，但最后一个参数始终被看成是函数体，而前面的参数则枚举
出了新函数的参数     
    ```js
    var sum = new Function("num1", "num2", "return num1*num2");
    ```
2. The `Function()` constructor allows JavaScript functions to be dynamically
created and compiled at runtime.
    1. 从技术角度讲，该方法相当于函数表达式，但不推荐使用这种方法定义函数，因为这种语法
    会导致解析两次代码。第一次是解析常规 ECMAScript 代码，第二次是解析传入构造函数中的
    字符串。
    2. The functions it creates do not use lexical scoping; instead, they are
    always compiled as if they were top-level functions
    ```js
    var scope = "global";
    function constructFunction() {
        var scope = "local";
        return new Function("console.log(scope)");
    }
    constructFunction()(); // => "global"
    ```


## Function Declarations vs Function Expressions
One major difference is in the way that a JavaScript engine loads data into the
execution context

### about Hoist
1. Function declarations are read and available in an executioncontext before
any code is executed, whereas function expressions aren’t complete until the
execution reaches that line of code.
2. 这和用`var`定义变量时的情况是一个道理：声明变量会提升，但给变量赋值并不会提升。函数
声明实际上是直接声明一个函数，并不存在赋值，所以会被提升；而函数表达式会先声明一个引用函
数的变量，该变量也会被提升，但实际的赋值却必须要等到执行到该行才可以。

```js
console.log(foo); // ƒ foo(){}
console.log(bar); // undefined
console.log(baz); // ReferenceError: baz is not defined

function foo(){}
var bar = function(){}
let baz = function(){}
```

### about Block Scope
当函数声明出现在代码块中时：
* 在 ES6 中，出现在代码块中的函数声明会生成块级作用域。
    ```js
    {
        var foo = function(){console.log('foo')};
        function bar(){}
    }
    foo(); // "foo"
    bar(); // ReferenceError: foo is not defined
    ```
* 在 ES6 严格模式下中，函数必须声明在顶级作用于或代码块中
    ```js
    if (true)
    function f() {}
    // SyntaxError: In strict mode code, functions can only be declared at top level or inside a block.
    ```
    块级作用域（使用`{}`）的出现，就使得省略`{}`的情况不一定安全。在块级作用域出现之前，
    这里的`{}`是可有可无的，但因为块级作用域要求必须使用`{}`，所以这里就会出错。同样的
    情况在使用`let`或`const`时也会出现。
* 在 ES6 之前的严格模式中会报错，不能在代码块中声明函数，只能使用函数表达式
* 在 ES6 之前的非严格模式中，函数声明会提升出代码块。



## ES6 参数默认值
### 与解构赋值默认值结合使用
1. 使用解构赋值参数时遇到的情况
    ```js
    function foo({x, y = 5}) {
        console.log(x, y);
    }

    foo({}); // undefined, 5
    foo({x: 1}); // 1, 5
    foo({x: 1, y: 2}); // 1, 2
    foo(); // TypeError: Cannot read property 'x' of undefined
    ```
最后一次调用，因为没有传参，所以实际上是在对`undefined`解构。这时就需要用到参数的默认值
    ```js
    function foo({x, y = 5}={}) {
        console.log(x, y);
    }

    foo() // undefined, 5
    ```

### 作用域
1. 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。
等到初始化结束，这个作用域就会消失。
    ```js
    let x = 1;

    function f(x, y = x) {
        console.log(y);
    }

    f(2) // 2
    ```
在传参时，将`2`传进了那个单独的作用域，这个作用域里发生了如下的赋值
    ```js
    let x = 2;
    let y = x;
    ```
2. 单独的作用域使用外部作用域的情况
    ```js
    let x = 1;

    function f(y = x) {
        let x = 2;
        console.log(y);
    }

    f() // 1
    ```
这个例子中，没有给单独的作用域传值。那么这时作用域的赋值情况是
    ```js
    let y = x;
    ```
这个赋值操作首先要找到`x`的值，在这个单独的作用于立并没有，所以只有向外部作用域找，找到
值为`1`，于是用`1`给`y`赋值。如果在外部没有定义`x`，那就会`ReferenceError`
3. 可以把这个单独的作用域理解为函数内部作用域和函数外部作用域之间的作用域。一个函数内部
的变量首先会看内部有没有定义，如果没有就从参数中找，也就是这个单独的作用域，如果还没有，
就从函数外部的作用域去找。所以，下面的两种情况都会报错：
    * 第一种
    ```js
    function bar(x = y, y = 2) {}
    ```
    参数作用域里的逻辑是：
    ```js
    let x = y;
    let y = 2;
    ```
    * 第二种
    ```js
    function foo(x = x) {}
    ```
    参数作用域里的逻辑是：
    ```js
    let x = x;
    ```
    从这里也能看出来，参数默认值的情况下，参数作用域里面定义变量是使用的`let`逻辑。因为
    `var x = x`并不会报错，而是给`x`赋值了`undefined`。


### Misc
* 参数默认值不是传值的，而是每次都重新计算默认值表达式的值
    ```js
    let x = 99;
    function foo(p = x + 1) {
        console.log(p);
    }

    foo(); // 100

    x = 100;
    foo(); // 101
    ```
* `undefined`会触发默认值，因为`undefined`就相当于没有传值
    ```js
    function foo(n=2){
        console.log(n);
    }

    foo(undefined); // 2   
    foo(null); // null
    ```
* 函数的`length`属性不包括带有默认值的参数以及之后的所有参数
    ```js
    function foo(a, b=0) {}
    function bar(a, b=0, c) {}

    console.log(foo.length); // 1
    console.log(bar.length); // 1
    ```
    [规范](https://www.ecma-international.org/ecma-262/6.0/#sec-function-instances-length)
    中对`length`的定义是：“The value of the length property is an integer that
    indicates the typical number of arguments expected by the function. ”。这样看
    来，默认参数不计入可以理解，但是默认参数后面的也不计入，就有些不符合定义了。
* 函数参数的值是在调用时生成的，默认值也是一样
    ```js
    let x = 1;
    function f(y = x)
    {
      let x = 2;
      console.log(y);
    }
    f() // 1
    ```
* 通过将将参数的默认值设定为一个函数调用，可以在未传该参数而调用函数的时候执行某些动作
    ```
    function noPara()
    {
        alert('para missing !');
    }
    function foo( mustBeProvided = noPara() ){}
    foo();
    ```
* 如果一个参数是可省略的，那应该明确的将其默认值设定为undefined




    只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值而生成。如果函数foo调用时参数不是对象，变量x和y就不会生成，从而报错。

## rest parameter
### rest 参数的问题是你不不能直观的看到函数到底期望几个参数



## 箭头函数注意事项
### 不能手动绑定`this`
由于箭头函数没有自己的`this`，所以用`call()`、`apply()`、`bind()`这些方法去改变`this`
指向是无效的
```js
let foo = ()=>{
    console.log(this);
};

foo.call(null); // Window
foo.bind(null)(); // Window
```

### 没有`arguments`
```js
let bar = (a, b)=>{
    console.log(arguments); // ReferenceError: arguments is not defined
};
```

1. 首先[规范](https://www.ecma-international.org/ecma-262/6.0/#sec-functiondeclarationinstantiation)
中明确写到：
> If the value of the [[ThisMode]] internal slot of func is lexical, then
NOTE Arrow functions never have an arguments objects.

    同时参考这个[回答](https://stackoverflow.com/a/30936173)

2. 至于原因，没有找到很官方的，但这个[回答](https://stackoverflow.com/a/41731940)
中说到：
> Arrow functions don't have this since the arguments array-like object was a
workaround to begin with, which ES6 has solved with a rest parameter

3. 使用 rest 参数代替`arguments`
```js
let foo = (...args)=>{
    console.log(args); // [1, 2]
};

let bar = (a, b, ...rest)=>{
    console.log([a, b, ...rest]); // [1, 2, 3]
};

foo(1, 2);
bar(1, 2, 3);
```

### 没有`super`和`new.target`

### 不可以使用`yield`命令
因此箭头函数不能用作`Generator`函数。




## Return
必须返回实际的值
```js
function foo(){
    return var a = 2; // SyntaxError: Unexpected token var
}
```



## `new.target`
ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令
作用于的那个构造函数。如果构造函数不是通过`new`命令调用的，`new.target`会返回
`undefined`：
```js
function Foo(){
    console.log(new.target);
}

new Foo();
// ƒ Foo(){
//     console.log(new.target);
// }

Foo();
// undefined
```
这个属性可以用来确定构造函数是怎么调用的：
```js
function Person(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}

Person('33');  // Error: 必须使用 new 命令生成实例
```
