# Dynamic Scope and `this`


## What is Dynamic Scope
1. Dynamic scope is determined dynamically at runtime, rather than statically at author-time.
2. Dynamic scope doesn't concern itself with how and where functions and scopes are declared, but rather where they are called from.
3. In other words, the scope chain is based on the call-stack, not the nesting of scopes in code.


## In JavaScript -- `this`
1. To be clear, JavaScript does not, in fact, have dynamic scope. It has lexical scope. Plain and simple.
2. But the `this` mechanism is kind of like dynamic scope. 但其实 `this` 的规则也不是作用域方式的，而是其他的一套规则。说它是动态作用域，反而会引起误解，比如下面的情况
    ```js
    function foo () {
        console.log(this); // obj
        function bar () {
            console.log(this); // undefined
        }
        bar();
    }

    let obj = {};

    foo.call(obj);
    ```
    对于普通的函数调用，`this` 就是 `undefined`，但你如果觉得 `this` 是作用域规则，那就可能会觉得它会使用父级函数的 `this`。


## Lexical `this` —— arrow function