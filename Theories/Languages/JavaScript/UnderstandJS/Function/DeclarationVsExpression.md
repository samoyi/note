# Function Declaration vs. Function Expression


1. 形式上来说，如果一行以 `function` 开头，那就是函数声明，否则就是函数表达式。
2. 函数声明在任何代码执行之前就已经加载（编译阶段？），而函数表达式只有在解释器执行到表达式这一行时才加载。
3. 所以函数声明具有提升效果，不管它定义在什么地方，在当前作用域的任何地方都可以访问
    ```js
    foo(); // fff

    function foo () { // 函数声明
        console.log('fff');
    }
    ```
    ```js
    bar(); // TypeError: bar is not a function
    // bar 的 var 声明会提升，所以这里不是 ReferenceError，但函数表达式对 bar 赋值却不能提升

    var bar = function () { // 函数表达式
        console.log('bbb');
    };
    ```
4. 函数声明和函数表达式一起使用时，函数声明无效，且声明中的函数名也无效
    ```js
    let f;

    foo(); // ReferenceError: foo is not defined

    f = function foo () {
        console.log('fff');
    };
    ```
    ```js
    let f;

    f = function foo () {
        console.log('fff');
    };

    foo();  // ReferenceError: foo is not defined
    ```
5. 严格模式下，块级作用域中的函数声明是能在块内访问
    ```js
    {
        function foo () {
            console.log('fff');
        }
    }
    foo(); // ReferenceError: foo is not defined
    ```


## References
* [var functionName = function() {} vs function functionName() {}](https://stackoverflow.com/a/3344397)
* [What is the difference between a function expression vs declaration in JavaScript?](https://stackoverflow.com/a/336868)
