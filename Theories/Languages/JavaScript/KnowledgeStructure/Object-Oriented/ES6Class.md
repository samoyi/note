# Class


<!-- TOC -->

- [Class](#class)
    - [Misc](#misc)
    - [语法](#语法)
        - [实例属性和原型方法](#实例属性和原型方法)
        - [声明 class](#声明-class)
        - [`constructor`](#constructor)
        - [方法的定义](#方法的定义)
        - [`new.target`](#newtarget)
    - [实现私有方法的两种方法](#实现私有方法的两种方法)
    - [Accessor Property](#accessor-property)
    - [静态方法](#静态方法)
        - [定义](#定义)
        - [`this`](#this)
        - [父类的静态方法，可以被子类继承或直接引用：](#父类的静态方法可以被子类继承或直接引用)
    - [References](#references)

<!-- /TOC -->


## Misc
* 基本上，ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 `class` 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。ES6 的类，完全可以看作构造函数的另一种写法
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
* 类的内部所有定义的方法，都是不可枚举的。这一点与 ES5 的行为不一致。
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
* `constructor` 中定义的是实例属性，之后的方法定义都是原型方法
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
* 虽然也可以在构造函数中定义实例方法，但好像意义不大
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
1. 虽然 `class` 的用法很像 `function` ，但它不存在提升。否则下面的代码就会报错：
    ```js
    {
        let Foo = class {};
        class Bar extends Foo {}
    }
    ```
2. 因为 `let` 不会提升，假如 `class` 会提升，则声明 `Bar` 的时候 `Foo` 还不存在。

### `constructor`
* 一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。
* 实例属性定义在 `constructor` 里
* [静态属性和新的实例属性定义方法的提案](http://es6.ruanyifeng.com/#docs/class#Class-%E7%9A%84%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7%E5%92%8C%E5%AE%9E%E4%BE%8B%E5%B1%9E%E6%80%A7)

### 方法的定义
1.  可以使用 ES6 的方法定义简写和方法名表达式，但不能使用`:`和`...`语法。也就是说，必须使用严格的方法定义模式
    ```js
    let str1 = 'say';
    let str2 = 'Hi';

    let oMthods = {
        baz () {},
    };

    class Point {
        constructor (x, y) {}

        toString () {}

        [str1 + str2] () {
            console.log('hi');
        }

        // bar: function () { // SyntaxError: Unexpected token :
        // }

        // baz: () => { // SyntaxError: Unexpected token :
        //
        // }

        // ...oMthods // SyntaxError: Unexpected token ...
    }
    ```
2. `:` 和 `...` 严格来说都是用来定义属性的。

### `new.target`  
1. ES6 为 `new` 命令引入了一个 `new.target` 属性，该属性一般用在构造函数之中，返回 `new` 命令作用于的那个构造函数。如果构造函数不是通过 `new` 命令调用的， `new.target` 会返回 `undefined`：
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
2. 这个属性可以用来确定构造函数是怎么调用的：
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
    

## 实现私有方法的两种方法
1. 第一种方法是沿用过去模块中处理私有方法的方法，将私有方法定义到模块输出外面
2. 第二种方法仍然是在 class 中定义方法，但是方法名使用 `Synbol` 值。把 `Synbol` 值定义在 class 之外且不作为模块输出，所以外部无法获取该 `Synbol` 值：
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
3. [私有属性/方法的提案](http://es6.ruanyifeng.com/#docs/class#%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7%E7%9A%84%E6%8F%90%E6%A1%88)


## Accessor Property
```js
class Person {
    constructor(person) {
        this.person = person;
    }

    get age() {
        return this.person.age;
    }

    set age(value) {
        this.person.age = value;
    }
}

let ins = new Person({
    name: '33',
    age: 22,
});
console.log(ins.age)
ins.age = 33;
console.log(ins.age)
```


## 静态方法
### 定义
如果在一个方法前，加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类（构造函数）来调用：
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
普通方法中的 `this` 指向实例，静态方法中的 `this` 指向类（构造函数）：
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

    class Bar extends Foo {}

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
* [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/class)