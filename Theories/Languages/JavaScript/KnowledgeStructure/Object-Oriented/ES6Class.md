# Class


## Overview
* 基本上，ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的
`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。ES6 的类，完全可以
看作构造函数的另一种写法
    ```js
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        toString() {
            return '(' + this.x + ', ' + this.y + ')';
        }
    }

    console.log(typeof Point) // "function"
    console.log(Point === Point.prototype.constructor) // true
    ```
    上面结果表明，类的数据类型就是函数，类本身就指向构造函数。
* 类的内部所有定义的方法，都是不可枚举的：
    ```js
    class Point {
        constructor(x, y) {
        }

        toString() {
        }
    }

    console.log(Object.keys(Point.prototype)); // []
    console.log(Object.getOwnPropertyNames(Point.prototype)); // ["constructor","toString"]
    ```
* 类和模块的内部，默认就是严格模式


## 语法
### 实例属性和原型方法
* `constructor`中定义的是实例属性，之后的方法定义都是原型方法
    ```js
    class Point {
        constructor(color) {
            this.color = color;
        }

        foo() {
            console.log(555);
        }
    }

    let p = new Point();

    console.log(p.hasOwnProperty('foo')); // false
    p.foo = 22;
    console.log(p.hasOwnProperty('foo')); // true
    console.log(p.foo); // 22
    delete p.foo;
    console.log(p.hasOwnProperty('foo')); // false
    p.foo(); // 555
    ```
* 虽然也可以在中定义实例方法，但好像意义不大
    ```js
    class Point {
        constructor(color) {
            this.foo = function(){
                console.log(color);
            };
        }
    }

    let p1 = new Point('red');
    let p2 = new Point('green');

    p1.foo(); // "red"
    p2.foo(); // "green"
    console.log(p1.hasOwnProperty('foo')); // true
    ```

### 声明 class
虽然`class`的用法很像`function`，但它不存在提升。否则下面的代码就会报错：
```js
{
    let Foo = class {};
    class Bar extends Foo {
    }
}
```
因为`let`不会提升，假如`class`会提升，则声明`Bar`的时候`Foo`还不存在。

### `constructor`
* 一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认
添加。
* 实例属性定义在`constructor`里
* [静态属性和新的实例属性定义方法的提案](http://es6.ruanyifeng.com/#docs/class#Class-%E7%9A%84%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7%E5%92%8C%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)

### 方法的定义
* 不加逗号
* 可以使用 ES6 的方法定义简写和方法名表达式，但不能使用`:`和`...`语法：
    ```js
    let str1 = 'say';
    let str2 = 'Hi';

    let oMthods = {
        baz(){},
    };

    class Point {
        constructor(x, y) {
        }

        toString(){
        }

        [str1 + str2](){
            console.log('hi');
        }

        // bar: function(){ // SyntaxError: Unexpected token :
        // }

        // baz: ()=>{ // SyntaxError: Unexpected token :
        //
        // }

        // ...oMthods // SyntaxError: Unexpected token ...
    }
    ```


## 实现私有方法的两种方法
* 第一种方法是沿用过去模块中处理私有方法的方法，将私有方法定义到模块输出外面
* 第二种方法仍然是在 class 中定义方法，但是方法名使用`Synbol`值。把`Synbol`值定义在
class 之外且不作为模块输出，所以外部无法获取该`Synbol`值：
    ```js
    // class.js

    const foo = Symbol('foo');

    export class myClass{
        [foo](){
            console.log('This is private');
        }

        bar(){
            this[foo]();
        }
    }
    ```
    ```html
    <script type="module">
        import {myClass} from './class.js';
        let ins = new myClass();
        ins.bar(); // This is private
        ins[foo](); // ReferenceError: foo is not defined
    </script>
    ```
* [私有属性/方法的提案](http://es6.ruanyifeng.com/#docs/class#%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7%E7%9A%84%E6%8F%90%E6%A1%88)


## Accessor Property
```js
class CustomHTMLElement {
    constructor(element) {
        this.element = element;
    }

    get html() {
        return this.element.innerHTML;
    }

    set html(value) {
        this.element.innerHTML = value;
    }
}

let descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype, "html"
);

console.log("get" in descriptor);  // true
console.log("set" in descriptor);  // true
```


## 静态方法
如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类（构造
函数）来调用：
```js
class Foo {
    static classMethod() {
        console.log('hello');
    }
}

Foo.classMethod(); // "hello"
Foo.prototype.constructor.classMethod(); // "hello"

let foo = new Foo();
foo.classMethod(); // TypeError: foo.classMethod is not a function
```


### `this`
普通方法中的`this`指向实例，静态方法中的`this`指向类（构造函数）：
```js
class Foo {
    static bar () {
        this.baz();
    }
    static baz () {
        console.log('hello');
    }
    baz () {
        console.log('world');
    }
}

Foo.bar() // hello
```

### 父类的静态方法，可以被子类继承或直接引用：
* 继承：
    ```js
    class Foo {
        static classMethod() {
            return 'hello';
        }
    }

    class Bar extends Foo {
    }

    console.log(Bar.classMethod()); // 'hello'
    ```
* 引用：
    ```js
    class Foo {
        static classMethod() {
            return 'hello';
        }
    }

    class Bar extends Foo {
        static classMethod() {
            return super.classMethod() + ' world';
        }
    }

    console.log(Bar.classMethod()); // "hello world"
    ```


## References
* [《ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/class)
