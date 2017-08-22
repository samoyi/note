# Dynamic Scope and `this`

***
## Whate isDynamic Scope
1. Dynamic scope is determined dynamically at runtime, rather than statically at
author-time.
2. Dynamic scope doesn't concern itself with how and where functions and scopes
are declared, but rather where they are called from.
3. In other words, the scope chain is based on the call-stack, not the nesting
of scopes in code.


***
## In JavaScript -- `this`
1. To be clear, JavaScript does not, in fact, have dynamic scope. It has lexical
scope. Plain and simple.
2. But the `this` mechanism is kind of like dynamic scope.


***
## Lexical `this` —— arrow function
