# Lexical Scope
Lexical Scope is by far the most commonly used by the vast majority of programming languages


***
## Lex-time
1. The first traditional phase of a standard language compiler is called lexing (aka, tokenizing).
2. The lexing process examines a string of source code characters and assigns semantic meaning to the tokens as a result of some stateful parsing.


***
## Lexical Scope
1. Lexical scope is scope that is defined at lexing time.
2. In other words, lexical scope is based on where variables and blocks of scope are authored, by you, at write time, and thus is (mostly) set in stone by the time the lexer processes your code.
3. Lexical scope is "write-time", whereas dynamic scope are runtime. Lexical scope cares where a function was declared, but dynamic scope cares where a function was called from.
4. No matter where a function is invoked from, or even how it is invoked, its lexical scope is only defined by where the function was declared.
    ```
    let age = 22;

    // 词法阶段，foo函数是处在全局作用域。全局作用域的age是22
    function foo(){
        console.log(age);
    }

    function bar(){
        let age = 33;
        // 调用阶段，foo函数处在bar作用域，bar作用域的age是33
        foo();
    }

    bar(); // 22
    ```
    即使是作为其他对象的方法调用，也依然是使用词法作用域
    ```
    let age = 22;

    function foo(){
        console.log(age);
    }

    let o = {
        age: 33,
        bar: foo
    };

    o.bar(); // 22
    ```


***
## Cheating Lexical
* It is considered best practice to treat lexical scope as, in fact, lexical-only, and thus entirely author-time in nature.
* Cheating lexical scope leads to poorer performance.
* use strict mode.

### Do not use these methods
* `eval()` without strict mode
* Use a string argument for `setTimeout()` and `setInterval()`
* Create function with `new Function()`
* `with()`

### Performance
* The JavaScript Engine has a number of performance optimizations that it performs during the compilation phase.
* Some of these boil down to being able to statically analyze the code as it lexes, and pre-determine where all the variable and function declarations are, so that it takes less effort to resolve identifiers during execution.
* But if the Engine finds an `eval(..)` or with in the code, it has to assume that all its awareness of identifier location may be invalid, because it cannot know at lexing time exactly what code you may pass to `eval(..)` to modify the lexical scope, or the contents of the object you may pass to `with` to create a new lexical scope to be consulted.
* In other words, in the pessimistic sense, most of those optimizations it would make are pointless if eval(..) or with are present, so it simply doesn't perform the optimizations at all.


***
## Reference
* [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)
