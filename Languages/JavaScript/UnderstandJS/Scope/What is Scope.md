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
### The Cast
* **Engine**: Responsible for start-to-finish compilation and execution of our JavaScript program.
* **Compiler**: Handles all the dirty work of parsing and code-generation.
* **Scope**: Collects and maintains a look-up list of all the declared identifiers (variables), and enforces a strict set of rules as to accessibility to currently executing code.

### 以代码 var a = 2; 为例讲解引擎编译代码时的作用域概念
对于引擎来说，这里有两个完全不同的过程，一个由编译器在编译时处理，另一个则由引擎在运行时处理。即，首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。详见如下过程：
1. The first thing Compiler will do with this program is perform lexing to break it down into tokens.
2. Parse these tokens into a tree.
3. Encountering var `a`, Compiler asks Scope to see if a variable `a` already exists for that particular scope collection. If so, Compiler ignores this declaration and moves on. Otherwise, Compiler asks Scope to declare a new variable called `a` for that scope collection.
4. Compiler then produces code for Engine to later execute, to handle the `a = 2` assignment.
5. The code Engine runs will first ask Scope if there is a variable called a accessible in the current scope collection. If so, Engine uses that variable. If not, Engine looks elsewhere.
6. If Engine eventually finds a variable, it assigns the value `2` to it. If not, Engine will throw an error.  
**To summarize**: Two distinct actions are taken for a variable assignment:
1. First, Compiler declares a variable (if not previously declared in the current scope)
2. Second, when executing, Engine looks up the variable in Scope and assigns to it, if found.

### LHS 和 RHS
* When Engine executes the code that Compiler produced for step (2), it has to look-up the variable a to see if it has been declared, and this look-up is consulting Scope. But the type of look-up Engine performs affects the outcome of the look-up.
* An LHS look-up is done when a variable appears on the left-hand side of an assignment operation, and an RHS look-up is done when a variable appears on the right-hand side of an assignment operation.
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
