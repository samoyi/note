# Hoisting


<!-- TOC -->

- [Hoisting](#hoisting)
    - [编译器对变量声明和函数声明的提升](#编译器对变量声明和函数声明的提升)
    - [Reference](#reference)

<!-- /TOC -->


## 编译器对变量声明和函数声明的提升
1. 一个有趣的例子
    ```js
    a = 2;

    var a;

    console.log( a ) // 2
    ```
    ```js
    console.log( a ); // undefined

    var a = 2;
    ```
2. 引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。
3. 因此，包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理；而对声明的变量和函数进行赋值则会发生在执行阶段。
4. 因此，这样的变量或函数在它们真正被访问（runtime）之前就已经存在于它们所在的作用域里面并且能被访问了，只不过还没有被初始化赋值，因为初始化赋值是运行时的操作
    ```js
    foo(); // not ReferenceError, but TypeError
    var foo = function bar() {};    
    ```
    JavaScript engine considers the code above as 3 steps:
    ```js
    var foo;
    foo();
    foo = function bar() {};
    ```
5. 不过对于函数声明的情况，它所谓的初始化其实也是声明的一部分，所以也会被一并提升。看下面这个有趣的例子
    ```js
    var getName = function () { 
        console.log(4);
    };

    function getName() { 
        console.log(5);
    }

    getName(); //  4
    ```
    函数声明会被提升，所以 `getName` 先被初始化为`{ console.log(5);}`。之后在运行时又被赋值修改为 `{ console.log(4);}`。所以整体效果相当于
    ```js
    function getName() { 
        console.log(5);
    }

    var getName = function () { 
        console.log(4);
    };

    getName(); //  4
    ```
6. 函数的重复声明会覆盖
    ```js
    foo(); // 2

    function foo() {
        console.log( 1 );
    }

    function foo() {
        console.log( 2 );
    }
    ```


## Reference
* [You Don't Know JS: What is Scope?](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [You Don't Know JS: Hoisting](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch4.md)