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
* To ensure the fastest performance, JS engines use all kinds of tricks (like JITs, which lazy compile and even hot re-compile, etc.)
* Any snippet of JavaScript has to be compiled before (usually right before) it's executed. So, the JS compiler will take the program `var a = 2;` and compile it first, and then be ready to execute it, usually right away.
* In the process of parsing and code-generation, there are certainly steps to optimize the performance of the execution, including collapsing redundant elements, etc.



***
## Understanding Scope

### 一. 涉及到的三个对象：
1. 引擎 ：从头到尾负责整个JavaScript程序的编译及执行过程。
2. 编译器 ：负责语法分析及代码生成等。
3. 作用域 ：负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

### 二. 以代码 var a = 2; 为例讲解引擎编译代码时的作用域概念
对于引擎来说，这里有两个完全不同的过程，一个由编译器在编译时处理，另一个则由引擎在运行时处理。即，首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。详见如下过程：
1. 首先由引擎解析为词法单元
2. 然后将词法单元解析为一个树结构然后进入开始代码生成阶段。
3. 对于var a，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a。
4. 接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理a = 2这个赋值操作。
引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作a的变量。如果是，引擎就会使用这个变量；如果不是，引擎会继续查找该变量。
5. 如果引擎最终找到了a变量，就会将2赋值给它。否则引擎就会举手示意并抛出一个异常。

### 三. LHS 和 RHS
1. 编译器在编译过程的第二步中生成了代码，引擎执行它时，会通过查找变量a来判断它是否已声明过。查找的过程由作用域进行协助，但是引擎执行怎样的查找，会影响最终的查找结果。
2. 当变量出现在赋值操作的左侧时进行LHS查询，出现在右侧时进行RHS查询。
    RHS查询与简单地查找某个变量的值别无二致，而LHS查询则是试图找到变量的容器本身，从而可以对其赋值。从这个角度说，RHS并不是真正意义上的“赋值操作的右侧”，更准确地说是“非左侧”。
    可以将RHS理解成retrieve his source value（取到它的源值），这意味着“得到某某的值”。
3. 考虑以下代码：
    ```console.log( a );```

    其中对a的引用是一个RHS引用，因为这里a并没有赋予任何值（其实也可以理解为将a的值赋给log()方法的参数）。相应地，需要查找并取得a的值，这样才能将值传递给`console.log(..)`。
    相比之下，例如：  

    ```a = 2;```
    这里对a的引用则是LHS引用，因为实际上我们并不关心当前的值是什么，只是想要为= 2这个赋值操作找到一个目标。
4. 函数声明并不是LHS查询  

    ```function foo(a) {}```
    编译器可以在代码生成的同时处理声明和值的定义。在引擎执行代码时，并不会有线程专门用来将一个函数值“分配给”foo。


### 四. 引擎对作用域的查找过程
    ```
    function foo(a) {
        console.log( a ); // 2
    }
    foo( 2 );
    ```
1. 引擎执行到 foo( 2 ); 时， 需要对 foo 进行RHS，因此查询作用域
2. 因为之前编译器在正确的作用域里声明了该函数，因此引擎可以查询到该函数的值
3. 引擎执行该函数
4. 执行该函数时因为进行了2的传参，因此要进行LHS，看看把2赋值给了谁
5. 因为编译器在正确的作用域里创建了该形参，因此引擎得以找到该变量，成功传参。
6. 函数内部存在一个 console 引擎不知道是什么，需要到作用域中进行RHS查询
7. 作用域中存在该内置对象，引擎找到该对象并从中找到了 log() 方法
8. 将a传给该方法的参数时，还要进行一次RHS来确定a的值。

## Reference
* [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
* [stackoverflow](https://stackoverflow.com/questions/380455/looking-for-a-clear-definition-of-what-a-tokenizer-parser-and-lexers-are)
