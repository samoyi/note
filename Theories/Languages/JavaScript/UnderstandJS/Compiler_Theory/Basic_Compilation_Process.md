# Basic Compilation Process

There are two predominant models for how scope works:
* The first of these is by far the most common, used by the vast majority of
programming languages. It's called *Lexical Scope*.
* The other model, which is still used by some languages (such as Bash scripting
, some modes in Perl, etc.) is called *Dynamic Scope*.


## Compiler Theory
* 尽管通常将 JavaScrip t归类为“动态”或“解释执行”语言，但事实上它是一门编译语言。但与传
统的编译语言不同，它不是提前编译的，编译结果也不能在分布式系统中进行移植。
* 然而 JS 引擎进行编译的步骤仍然和传统的编译语言相似，而且某些方面甚至更复杂。

### Traditional compiled-language process
#### 1. Tokenizing/Lexing
1. 这个过程会将代码字符串分割为对该语言有意义的小块，成为 token。例如代码字符串
`var a = 2;`会被分成以下几个部分：`var`、`a`、 `=`、`2`和`;`。
2. 空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
3. Tokenizing 和 Lexing 有些区别。Tokenizing 的过程通常只是根据空白字符（空格、tab、
换行等）将代码字符串分成独立的 token。Lexing 的过程通常也包含 Tokenizing，但它还会赋予
分出来的 token 某些意义，比如这个 token 是数值，那个 token 是字符串之类的。

#### 2. Parsing
1. 这个过程是将 token 单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构
的树。这个树被称为“抽象语法树”（Abstract Syntax Tree，AST）。
2. `var a = 2;`的抽象语法树中可能会有一个叫作`VariableDeclaration`的顶级节点，接下来
是一个叫作`Identifier`（它的值是`a`）的子节点，以及一个叫作`AssignmentExpression`的子
节点。`AssignmentExpression`节点有一个叫作`NumericLiteral`（它的值是`2`）的子节点。

#### 3. Code-Generation
1. 这个过程将 AST 转换为可执行代码。这个过程与语言、目标平台等息息相关。
2. 抛开具体细节，简单来说就是有某种方法可以将`var a = 2;`的 AST 转化为一组机器指令，用
来创建一个叫作`a`的变量（包括分配内存等），并将一个值储存在`a`中。


###  JavaScript engine
1. 比起那些编译过程只有三个步骤的语言的编译器，JavaScript引擎要复杂得多。
2. 首先，JavaScript 引擎不会有大量的（像其他语言编译器那么多的）时间用来进行优化，因为
与其他语言不同，JavaScript 的编译过程不是发生在构建之前的。对于 JavaScript 来说，大部
分情况下编译发生在代码执行前的几微秒（甚至更短！）的时间内。JavaScript 引擎用尽了各种办
法（比如 JIT，可以延迟编译甚至实施重编译）来保证性能最佳。
3. 简单地说，任何 JavaScript 代码片段在执行前都要进行编译（通常就在执行前）。因此，
JavaScript 编译器首先会对`var a = 2;`这段程序进行编译，然后做好执行它的准备，并且通常
马上就会执行它。
4. 在 parsing 和 code-generation 阶段，会有特定的步骤来优化执行性能，包括 including
collapsing redundant elements 等。
5. 最初我认为是引擎会完整的编译所有的（一个`<sciprt>`标签内的或者一个`.js`文件内的）代
码，但按照上面说到，看起来是一边编译一边执行的。而且根据下面这一段
（[出处](https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c)）的
描述，看起来是以作用域为界限，边执行边编译
> Creation（creating execution context） phase is the phase in which JS engines
has called a function but it’s execution has not started. In the creation phase,
JS engine is in the compilation phase and it scans over the function to compile
the code.

从这篇也可以看出来是一边编译一边执行：`Theories\Languages\JavaScript\UnderstandJS\ExecutionContext&VariableObject&ScopeChain.md`


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
* [stackoverflow](https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are)
