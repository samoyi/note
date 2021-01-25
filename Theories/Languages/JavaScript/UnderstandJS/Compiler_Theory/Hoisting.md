# Hoisting

There are two predominant models for how scope works:
* The first of these is by far the most common, used by the vast majority of
programming languages. It's called *Lexical Scope*.
* The other model, which is still used by some languages (such as Bash scripting
, some modes in Perl, etc.) is called *Dynamic Scope*.


## 编译器对变量声明和函数声明的提升
1. 代码中有声明变量（使用`var`）或声明函数时，JS 引擎会在编译阶段处理该声明。
2. 因此，这样的变量或函数在它们真正被访问（runtime）之前就已经存在于它们所在的作用域里
面并且能被访问了，只不过还没有被初始化赋值，因为初始化赋值是运行时的操作。
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
3. 但对于函数声明的情况，函数的初始化也会被一并提升。
    ```js
    var getName = function () { console.log(4);};
    function getName() { console.log(5);}
    getName(); //  4
    ```
    函数初始化`{ console.log(5);}`也被提升了，所以`getName`先被初始化为
    `{ console.log(5);}`，之后在运行时又被修改为`{ console.log(4);}`。相当于
    ```js
    function getName() { console.log(5);}
    var getName = function () { console.log(4);};
    getName(); //  4
    ```


## Reference
* [You Don't Know JS: What is Scope?](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [You Don't Know JS: Hoisting](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch4.md)