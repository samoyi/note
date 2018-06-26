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

### 声明 class
虽然`class`的用法很像`function`，但它不存在提升。否则下面的代码就会报错：
```js
{
    let Foo = class {};
    class Bar extends Foo {
    }
}
```
因为`let`不会提升，假如`class`会提升，则声明`Bar`的时候`Foo`还存在，因此报错。

### 方法的定义
* 不用加逗号
* 可以使用 ES6 的方法定义简写和方法名表达式，但不能使用 `function` 和 扩展运算符`...`：
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

        // function foo(){ // SyntaxError: Unexpected identifier
        //     console.log('bar');
        // }

        // ...oMthods // SyntaxError: Unexpected token ...
    }
    ```

### `constructor` 方法
一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。


## References
* [《ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/class)
