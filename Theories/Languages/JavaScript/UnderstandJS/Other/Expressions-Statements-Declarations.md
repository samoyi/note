# Expressions vs statements vs declarations


<!-- TOC -->

- [Expressions vs statements vs declarations](#expressions-vs-statements-vs-declarations)
    - [Expressions](#expressions)
    - [Statements](#statements)
    - [Function expression versus function declaration](#function-expression-versus-function-declaration)
    - [References](#references)

<!-- /TOC -->


## Expressions
1. An expression is any valid unit of code that **resolves to a value**.
2. Every syntactically valid expression resolves to some value but conceptually, there are two types of expressions:    
    * with side effects (for example: those that assign value to a variable) 
    * those that in some sense evaluate and therefore resolve to a value.
3. The expression `x = 7` is an example of the first type. This expression uses the `=` operator to assign the value seven to the variable `x`. The expression itself evaluates to seven.
4. The code `3 + 4` is an example of the second expression type. This expression uses the `+` operator to add three and four together without assigning the result, seven, to a variable.
5. JavaScript has the following expression categories:
    * Arithmetic: evaluates to a number, for example `3.14159`. (Generally uses arithmetic operators.)
    * String: evaluates to a character string, for example, `"Fred"` or `"234"`. (Generally uses string operators.)
    * Logical: evaluates to true or false. (Often involves logical operators.)
    * Primary expressions: Basic keywords and general expressions in JavaScript. 例如 `this`。
    * Left-hand-side expressions: Left values are the destination of an assignment.


## Statements
1. In a computer programming language, a statement is a line of code **commanding a task**. 
2. Roughly, an expression is something that computes a value but doesn’t do anything: it doesn’t alter the program state in any way. Statements, on the other hand, don’t have a value (or don’t have a value that we care about), but they do alter the state.
3. **A statement performs an action**. Such actions include creating a variable or a function, looping through an array of elements, evaluating code based on a specific condition etc.
3. A program is basically a sequence of statements (we’re ignoring declarations here). Wherever JavaScript expects a statement, you can also write an expression. Such a statement is called an **expression statement**. 
4. The reverse does not hold: you cannot write a statement where JavaScript expects an expression. For example, an `if` statement cannot become the argument of a function.
5. Statements in JavaScript can be classified into the following categories
    * Declaration Statements: Such type of statements create variables and functions.


## Function expression versus function declaration
1. The code below is a function expression:
    ```js
    function () { }
    ```
    这里只写出了函数表达式的部分，但没有写左边赋值给一个变量的部分。
2. You can also give a function expression a name and turn it into a **named function expression**:
    ```js
    function foo() { }
    ```
    这里同样没有写左边赋值给一个变量的部分，如果写上的话可以是
    ```js
    let bar = function () { };
    ```
3. The function name (`foo`, above) only exists inside the function and can, for example, be used for self-recursion:
    ```js
    let bar = function foo(x) { return x <= 1 ? 1 : x * foo(x-1) }
    console.log(bar(10)); // 3628800
    console.log(foo); // ReferenceError: foo is not defined
    ```
4. A named function expression is indistinguishable from a function declaration (which is, roughly, a statement). But their effects are different: A function expression produces a value (the function)，并把它赋给左边的变量. A function declaration leads to an action – the creation of a variable whose value is the function. 函数声明因为创建了变量，所以可以用函数名调用；而命名函数表达式的那个函数名并不是一个引用函数的变量，所以只能在函数体内部使用。
5. 因为表达式不会在编译时执行，所以使用函数表达式创建的变量，变量声明本身虽然会被提升，但是函数表达式不会被执行，所以该变量的值还只是 `undefined`；而函数声明在编译时不仅会声明函数变量，还会在内存中生成函数对象，并将该对象提升到作用域中，所以存在提升的效果。
6. Furthermore, only a function expression can be immediately invoked, but not a function declaration
    ```js
    (function foo() { return console.log("abc") }()) // 正确

    function foo() { return console.log("abc") }() // 错误
    ```
    只有语句是以 `function` 开头才是函数声明，所以第一个是函数表达式。


## References
* [Expressions versus statements in JavaScript](https://2ality.com/2012/09/expressions-vs-statements.html)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#expressions)
* [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Statement)
* [JavaScript Expressions and Statements](https://medium.com/launch-school/javascript-expressions-and-statements-4d32ac9c0e74)
