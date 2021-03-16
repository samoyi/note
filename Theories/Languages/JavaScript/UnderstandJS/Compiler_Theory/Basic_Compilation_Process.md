# Basic Compilation Process


<!-- TOC -->

- [Basic Compilation Process](#basic-compilation-process)
    - [传统编译语言的编译流程](#传统编译语言的编译流程)
        - [1. 分词/词法分析（Tokenizing/Lexing）](#1-分词词法分析tokenizinglexing)
        - [2. 解析/语法分析（Parsing）](#2-解析语法分析parsing)
        - [3. 代码生成（Code-Generation）](#3-代码生成code-generation)
    - [JavaScript 的编译流程](#javascript-的编译流程)
    - [Reference](#reference)

<!-- /TOC -->


## 传统编译语言的编译流程
### 1. 分词/词法分析（Tokenizing/Lexing）
1. 这个过程会将由字符组成的字符串分解成对编程语言来说有意义的代码块，这些代码块被称为 **词法单元**（token）。
2. 例如，考虑程序 `var a = 2;`。这段程序通常会被分解成为下面这些词法单元：`var`、`a`、`=`、`2` 、`;`。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
3. 这个过程就好比当你看到一长串字符，你要先认出来其中有哪些单词，才能理解整句话的意思。
4. Tokenizing 和 Lexing 有些区别。Tokenizing 的过程通常只是根据空白字符（空格、tab、换行等）将代码字符串分成独立的 token。Lexing 的过程通常也包含 Tokenizing，但它还会赋予分出来的 token 某些意义，比如这个 token 是数值，那个 token 是字符串之类的。

### 2. 解析/语法分析（Parsing）
1. 这个过程是将 token 流（数组）转换成一个由元素逐级嵌套所组成的、代表了程序语法结构的树。这个树被称为 **抽象语法树**（Abstract Syntax Tree，AST）。
2. `var a = 2;` 的抽象语法树中可能会有一个叫作 `VariableDeclaration` 的顶级节点，接下来是一个叫作 `Identifier`（它的值是 `a`）的子节点，以及一个叫作 `AssignmentExpression` 的子节点。`AssignmentExpression` 节点有一个叫作 `NumericLiteral`（它的值是 `2`）的子节点。
3. 实际上就是以树状结构来表达一段 token 流的意义。

### 3. 代码生成（Code-Generation）
1. 这个过程将 AST 转换为可执行代码。这个过程与语言、目标平台等息息相关。
2. 抛开具体细节，简单来说就是有某种方法可以将 `var a = 2;` 的 AST 转化为一组机器指令，用来创建一个叫作 `a` 的变量（包括分配内存等），并将一个值储存在 `a` 中。


##  JavaScript 的编译流程
参考 `V8\Parsing\ByteCode.md`


## Reference
* [You Don't Know JS: What is Scope?](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [stackoverflow](https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are)
