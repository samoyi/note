# Basic Compilation Process


<!-- TOC -->

- [Basic Compilation Process](#basic-compilation-process)
    - [引言](#引言)
    - [设计思想](#设计思想)
        - [传统编译流程](#传统编译流程)
    - [传统编译语言的编译流程](#传统编译语言的编译流程)
        - [1. 分词/词法分析（Tokenizing/Lexing）](#1-分词词法分析tokenizinglexing)
        - [2. 解析/语法分析（Parsing）](#2-解析语法分析parsing)
        - [3. 代码生成（Code-Generation）](#3-代码生成code-generation)
    - [JavaScript 的编译流程](#javascript-的编译流程)
    - [Reference](#reference)

<!-- /TOC -->


## 引言
1. 尽管通常将 JavaScript 归类为 “动态” 或 “解释执行” 语言，但事实上它是一门编译语言。
2. 但与传统的编译语言不同，它不是提前编译的，编译结果也不能在分布式系统中进行移植。
3. 尽管如此，JavaScript 引擎进行编译的步骤和传统的编译语言非常相似，在某些环节可能比预想的要复杂。


## 设计思想
### 传统编译流程
分词阶段先识别有哪些单词，解析阶段识别单词之间的关系进而理解一句话，代码生成阶段去执行这句话。


## 传统编译语言的编译流程
### 1. 分词/词法分析（Tokenizing/Lexing）
1. 这个过程会将由字符组成的字符串分解成对编程语言来说有意义的代码块，这些代码块被称为 **词法单元**（token）。
2. 例如，考虑程序 `var a = 2;`。这段程序通常会被分解成为下面这些词法单元：`var`、`a`、`=`、`2` 、`;`。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
3. 这个过程就好比当你看到一长串字符，你要先认出来其中有哪些单词，才能理解整句话的意思。
3. Tokenizing 和 Lexing 有些区别。Tokenizing 的过程通常只是根据空白字符（空格、tab、换行等）将代码字符串分成独立的 token。Lexing 的过程通常也包含 Tokenizing，但它还会赋予分出来的 token 某些意义，比如这个 token 是数值，那个 token 是字符串之类的。

### 2. 解析/语法分析（Parsing）
1. 这个过程是将 token 流（数组）转换成一个由元素逐级嵌套所组成的、代表了程序语法结构的树。这个树被称为 **抽象语法树**（Abstract Syntax Tree，AST）。
2. `var a = 2;` 的抽象语法树中可能会有一个叫作 `VariableDeclaration` 的顶级节点，接下来是一个叫作 `Identifier`（它的值是 `a`）的子节点，以及一个叫作 `AssignmentExpression` 的子节点。`AssignmentExpression` 节点有一个叫作 `NumericLiteral`（它的值是 `2`）的子节点。
3. 实际上就是以树状结构来表达一段 token 流的意义。

### 3. 代码生成（Code-Generation）
1. 这个过程将 AST 转换为可执行代码。这个过程与语言、目标平台等息息相关。
2. 抛开具体细节，简单来说就是有某种方法可以将 `var a = 2;` 的 AST 转化为一组机器指令，用来创建一个叫作 `a` 的变量（包括分配内存等），并将一个值储存在 `a` 中。


##  JavaScript 的编译流程
1. 比起那些编译过程只有三个步骤的语言的编译器，JavaScript 引擎要复杂得多。例如，在语法分析和代码生成阶段有特定的步骤来对运行性能进行优化，包括对冗余元素进行优化等。
2. 首先，JavaScript 引擎不会有像其他语言编译器那么多的时间用来进行优化，因为与其他语言不同，JavaScript 的编译过程不是发生在构建之前的。对于 JavaScript 来说，大部分情况下编译发生在代码执行前的几微秒（甚至更短！）的时间内。JavaScript 引擎用尽了各种办法（比如JIT，可以延迟编译甚至实施重编译）来保证性能最佳。
3. 简单地说，任何 JavaScript 代码片段在执行前都要进行编译。因此，JavaScript 编译器首先会对 `var a = 2;` 这段程序进行编译，然后做好执行它的准备，并且通常马上就会执行它。
4. 最初我认为是引擎会完整的编译所有的（一个 `<sciprt>` 标签内的或者一个 `.js` 文件内的）代码，但按照上面说到，看起来是一边编译一边执行的。而且根据下面这一段 （[出处](https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c)）的描述，看起来是以作用域为界限，边执行边编译
    > Creation（creating execution context） phase is the phase in which JS engines has called a function but it’s execution has not started. In the creation phase, JS engine is in the compilation phase and it scans over the function to compile the code.
5. 从这篇也可以看出来是一边编译一边执行：`Theories\Languages\JavaScript\UnderstandJS\ExecutionContext&VariableObject&ScopeChain.md`


## Reference
* [You Don't Know JS: What is Scope?](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [stackoverflow](https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are)
