# Basic Compilation Process

There are two predominant models for how scope works.
* The first of these is by far the most common, used by the vast majority of programming languages. It's called Lexical Scope.
* The other model, which is still used by some languages (such as Bash scripting, some modes in Perl, etc.) is called Dynamic Scope.


***
## Compiler Theory
* Despite the fact that JavaScript falls under the general category of "dynamic" or "interpreted" languages, it is in fact a compiled language. It is not compiled well in advance, as are many traditionally-compiled languages, nor are the results of compilation portable among various distributed systems.
* But, nevertheless, the JavaScript engine performs many of the same steps, albeit in more sophisticated ways than we may commonly be aware, of any traditional language-compiler.

### Traditional compiled-language process
#### 1. Tokenizing/Lexing
* Breaking up a string of characters into meaningful (to the language) chunks, called tokens.  
For instance, consider the program: `var a = 2;`, this program would likely be
broken up into the following tokens: `var`, `a`, `=`, `2`, and `;`.
* Whitespace may or may not be persisted as a token, depending on whether it's meaningful or not.  
* A tokenizer breaks a stream of text into tokens, usually by looking for whitespace (tabs, spaces, new lines). A lexer is basically a tokenizer, but it usually attaches extra context to the tokens -- this token is a number, that token is a string literal, this other token is an equality operator.

#### 2. Parsing
Taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree
is called an "AST" (Abstract Syntax Tree).  
The tree for `var a = 2;` might start with a top-level node called `VariableDeclaration`, with a child node called `Identifier` (whose value is a),
and another child called `AssignmentExpression` which itself has a child called `NumericLiteral` (whose value is 2).

#### 3. Code-Generation
* The process of taking an AST and turning it into executable code. This part varies greatly depending on the language, the platform it's targeting, etc.
* This is a way to take our above described AST for `var a = 2;` and turn it into
a set of machine instructions to actually create a variable called `a` (including reserving memory, etc.), and then store a value into `a`.


###  JavaScript engine
* The JavaScript engine is vastly more complex than just those three steps, as are most other language compilers.
* For one thing, JavaScript engines don't get the luxury (like other language compilers) of having plenty of time to optimize, because JavaScript compilation doesn't happen in a build step ahead of time. For JavaScript, the compilation that occurs happens, in many cases, mere microseconds (or less) before the code is executed.
* 最初我理解上面这一段话是认为是引擎会完整的编译所有的（一个sciprt标签内的或者一个js文
件内的）代码，但根据下面这一段（[出处](https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c)）的描述，看起来是一作用域为界限，边执行边编译。而且其实整体编
译应该也没有那么充分的时间吧，特别是对于很大的JS文件。
> Creation（creating execution context） phase is the phase in which JS engines
has called a function but it’s execution has not started. In the creation phase,
JS engine is in the compilation phase and it scans over the function to compile
the code.  
* To ensure the fastest performance, JS engines use all kinds of tricks (like JITs, which lazy compile and even hot re-compile, etc.)
* Any snippet of JavaScript has to be compiled before (usually right before) it's executed. So, the JS compiler will take the program `var a = 2;` and compile it first, and then be ready to execute it, usually right away.
* In the process of parsing and code-generation, there are certainly steps to optimize the performance of the execution, including collapsing redundant elements, etc.


***
## Hoisting
1. For the declaration of a variable ( declared by `var`. Variable declared by
    `let` will not be hoisted ) or a function，JS engine will handle that
in compilation process.
2. As this reason, a variable or a function is already exsiting in its scope and
can be accessed, before the variable is assigned or the function is invoked in
the runtime.
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
3. Hoisting for variable is just hoisting the declaration without initialization,
but in function declaration's case, the function value initialization
will also be hoisted.
```
var getName = function () { console.log(4);};
function getName() { console.log(5);}
getName(); //  4
```
equivalent to
```
function getName() { console.log(5);}
var getName = function () { console.log(4);};
getName(); //  4
```




## Reference
* [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [stackoverflow](https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are)
