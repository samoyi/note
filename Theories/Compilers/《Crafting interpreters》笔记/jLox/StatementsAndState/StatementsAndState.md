# Statements and State


<!-- vscode-markdown-toc -->
* 1. [Statements](#Statements)
	* 1.1. [Parsing statements](#Parsingstatements)
	* 1.2. [使用访问者模式解释执行语句](#)
	* 1.3. [解释的入口](#-1)
* 2. [Global Variables](#GlobalVariables)
	* 2.1. [Variable syntax](#Variablesyntax)
	* 2.2. [Parsing variables](#Parsingvariables)
		* 2.2.1. [解析变量声明语句](#-1)
		* 2.2.2. [解析变量表达式](#-1)
* 3. [Environments](#Environments)
	* 3.1. [Interpreting global variables](#Interpretingglobalvariables)
* 4. [Assignment](#Assignment)
	* 4.1. [Assignment syntax](#Assignmentsyntax)
	* 4.2. [解析赋值表达式](#-1)
	* 4.3. [Assignment semantics（interpret）](#Assignmentsemanticsinterpret)
* 5. [Scope](#Scope)
	* 5.1. [Nesting and shadowing](#Nestingandshadowing)
	* 5.2. [Block syntax and semantics](#Blocksyntaxandsemantics)
* 6. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Statements'></a>Statements
1. 我们首先用语句扩展 Lox 的语法。它们与表达式没有太大区别。我们从两种最简单的类型开始：
    * 表达式语句：允许您将表达式放置在需要语句的位置，它们用于对具有副作用的表达式求值。只要您看到函数或方法调用后跟`;`，您就看到了表达式语句。
    * `print` 语句：对表达式求值并将结果显示给用户。
2. New syntax means new grammar rules. In this chapter, we finally gain the ability to parse an entire Lox script. Since Lox is an imperative, dynamically typed language, the “top level” of a script is simply a list of statements. The new rules are:
    ```
    program        → statement* EOF ;

    statement      → exprStmt
                    | printStmt ;

    exprStmt       → expression ";" ;
    
    printStmt      → "print" expression ";" ;
    ```
3. The first rule is now `program`, which is the starting point for the grammar and represents a complete Lox script or REPL entry. 
4. A program is a list of statements followed by the special “end of file” token. The mandatory end token ensures the parser consumes the entire input and doesn’t silently ignore erroneous unconsumed tokens at the end of a script.
5. The next step is turning this grammar into something we can store in memory—syntax trees.

###  1.1. <a name='Parsingstatements'></a>Parsing statements
1. 上一章中，`Parser` 的 `parse` 方法如下
    ```java
    // Parser.java

    Expr parse() {
        try {
            return expression();
        } catch (ParseError error) {
            return null;
        }
    }
    ```
2. 当时的 grammar rules 最顶层是表达式，所以解析从 `expression()` 开始。现在有了语句，此时源代码的顶层规则不再是表达式，而是 `program`，也就是若干个 `statement`。所以，`parse` 方法变成解析这若干个 `statement`
    ```java
    // Parser.java

    List<Stmt> parse() {
        List<Stmt> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(statement());
        }

        return statements; 
    }
    ```
3. 其中的 `statement` 方法如下，
    ```java
    // Parser.java

    private Stmt statement() {
        if (match(PRINT)) return printStatement();

        return expressionStatement();
    }
    ```
4. 如果 token 流中当前 token 是 `print` 对应的 token，那说明这是一个 `print` 语句，就使用该语句的解析方法 `printStatement()`。否则，如果没匹配到什么其他的语句关键词（比如 `for`，不过这里还没有这些），那就认为它应该是表达式语句。
5. 目前这两个语句的具体解析方法
    ```java
    // Parser.java

    private Stmt printStatement() {
        Expr value = expression();
        consume(SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value);
    }

    private Stmt expressionStatement() {
        Expr expr = expression();
        consume(SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
    }
    ```
6. 因为 `match` 已经消费掉了 `print` 对应的 token，所以 `printStatement` 中调用 `expression()` 就是对要打印的表达式的求值，然后还要把语句结尾的分号消费掉。`expressionStatement` 也是同理。
7. 后面 `return new` 的那行下面再说。

###  1.2. <a name=''></a>使用访问者模式解释执行语句
1. 解析器现在已经可以生成语句的语法树了，现在我们需要解释执行这个语法树。
2. 解释器 `Interpreter` 之前作为访问者解释表达式，现在它还要作为访问者解释语句，所以还要实现语句的访问者接口
    ```java
    // Interpreter.java

    class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Void>
    ```
3. 解释表达式的返回值是 `Object` 类型，而解释语句不返回值，所以泛型参数是 `Void`。
4. 目前有两种语句，所以实现这两种语句对应的访问方法，作为对这两种语句的解释方法
    ```java
    // Interpreter.java

    @Override
    public Void visitExpressionStmt(Stmt.Expression stmt) {
        evaluate(stmt.expression);
        return null;
    }

    @Override
    public Void visitPrintStmt(Stmt.Print stmt) {
        Object value = evaluate(stmt.expression);
        System.out.println(stringify(value));
        return null;
    }
    ```
5. 解释表达式语句就是调用对表达式求值的 `evaluate` 方法，而被求值的表达式是 `stmt.expression`。这个 `stmt.expression` 就是 `Parser.java` 中解析这两个语句时 `return new` 那行创建的。
6. 返回看一下那两个 `return new`。`printStatement` 返回的是 `new Stmt.Print(value)`， `expressionStatement` 返回的是 `new Stmt.Expression(expr)`，分别创建的是两个语句对象的实例，它们位于由 `GenerateAst.java` 生成的 `Stmt.java` 中
    ```java
    // Stmt.java

    package com.craftinginterpreters.lox;

    import java.util.List;

    abstract class Stmt {
        interface Visitor<R> {
            R visitExpressionStmt(Expression stmt);
            R visitPrintStmt(Print stmt);
        }

        static class Expression extends Stmt {
            Expression(Expr expression) {
                this.expression = expression;
            }

            @Override
            <R> R accept(Visitor<R> visitor) {
                return visitor.visitExpressionStmt(this);
            }

            final Expr expression;
        }
        
        static class Print extends Stmt {
            Print(Expr expression) {
                this.expression = expression;
            }

            @Override
            <R> R accept(Visitor<R> visitor) { 
                return visitor.visitPrintStmt(this);
            }

            final Expr expression;
        }

        abstract <R> R accept(Visitor<R> visitor);
    }
    ```
7. 这两个类在实例化时都接受一个表达式对象作为参数，并保存在 `expression` 字段中。可以看到，`Stmt.Print` 接收到的参数是 `print` 后面的表达式，而 `Stmt.Expression` 接收到的就是表达式语句的表达式。
8. `visitExpressionStmt` 和  `visitPrintStmt` 方法中 `evaluate` 的参数就是这两个表达式对象。`visitExpressionStmt` 对表达式求值后返回 `null`，因为语句没有返回值，表达式语句的唯一功能就是对其中的表达式求值；`visitPrintStmt` 对表达式求值后打印出该值。

###  1.3. <a name='-1'></a>解释的入口
1. 现在 `visitExpressionStmt` 和  `visitPrintStmt` 方法可以解释语句了，然后我们再把它和上游的逻辑关联起来。
2. `interpret` 方法原来是对单独的表达式求值
    ```java
    // Interpreter.java

    void interpret(Expr expression) {
        try {
            Object value = evaluate(expression);
            System.out.println(stringify(value));
        } catch (RuntimeError error) {
            Lox.runtimeError(error);
        }
    }
    ```
3. 现在改成执行整个 program，也就是执行若干个 statement
    ```java
    void interpret(List<Stmt> statements) {
        try {
            for (Stmt statement : statements) {
                execute(statement);
            }
        } catch (RuntimeError error) {
            Lox.runtimeError(error);
        }
    }
    ```
4. 具体的执行还是交给每个语句里接收到的访问者方法
    ```java
    private void execute(Stmt stmt) {
        stmt.accept(this);
    }
    ```
5. `Lox.java` 中的 `run` 方法也从 
    ```java
    private static void run(String source) {
        Scanner scanner = new Scanner(source);
        List<Token> tokens = scanner.scanTokens();
    
        Parser parser = new Parser(tokens);
        Expr expression = parser.parse();

        if (hadError) return;

        interpreter.interpret(expression);
    }
    ```
    变成
    ```java
    private static void run(String source) {
        Scanner scanner = new Scanner(source);
        List<Token> tokens = scanner.scanTokens();
    
        Parser parser = new Parser(tokens);
        List<Stmt> statements = parser.parse();

        if (hadError) return;

        interpreter.interpret(statements);
    }
    ```
6. 可看到，解析器现在解析的结构不再是表达式，而是语句序列了。之后解释器也是对语句序列进行解释。


##  2. <a name='GlobalVariables'></a>Global Variables
1. A **variable declaration** statement brings a new variable into the world.
    ```js
    var beverage = "espresso";
    ```
2. This creates a new binding that associates a name with a value.
3. Once that’s done, a **variable expression** accesses that binding. When the identifier `beverage` is used as an expression, it looks up the value bound to that name and returns it.
    ```js
    print beverage; // "espresso"
    ```

###  2.1. <a name='Variablesyntax'></a>Variable syntax
1. 我们要把变量声明语句和普通语句 `statement` 分开处理，因为变量声明语句不能作为在控制流语句的从句。例如，
    ```js
    if (monday) print "Ugh, already?";
    ```
    是可以的。但是
    ```js
    if (monday) var beverage = "espresso";
    ```
    是不行的。
2. 因此我们为声明变量的语句类型添加了另一条规则
    ```
    program        → declaration* EOF ;

    declaration    → varDecl
                    | statement ;

    statement      → exprStmt
                    | printStmt ;
    ```
3. 声明语句是普通语句的特殊情况，允许声明语句出现的地方也允许普通语句出现，所以 `declaration` 规则也会包含 `statement`。并且 `program` 规则也因此改为路由到若干个 `declaration`。
4. 声明变量的规则 `varDecl` 如下
    ```
    varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;
    ```
5. 解析表达式的规则中，`primary` 表达式也要加上标识符的情况
    ```
    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;
    ```
6. That `IDENTIFIER` clause matches a single identifier token, which is understood to be the name of the variable being accessed.
7. 这些新的语法规则会得到相应的语法树。在 AST 生成器中，我们为变量声明添加了一个新的语句节点
    ```java
    // tool/GenerateAst.java

    defineAst(outputDir, "Stmt", Arrays.asList(
            "Expression : Expr expression",
            "Print      : Expr expression",
            "Var        : Token name, Expr initializer" // 新增
    ));
    ```
    再添加一个用于访问变量的表达式节点
    ```java
    // tool/GenerateAst.java

    "Literal  : Object value",
    "Unary    : Token operator, Expr right",
    "Variable : Token name" // 新增
    ```

###  2.2. <a name='Parsingvariables'></a>Parsing variables
####  2.2.1. <a name='-1'></a>解析变量声明语句
1. 解析方法从
    ```java
    // Parser.java

    List<Stmt> parse() {
        List<Stmt> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(statement());
        }

        return statements; 
    }
    ```
    改为
    ```java
    // Parser.java

    List<Stmt> parse() {
        List<Stmt> statements = new ArrayList<>();
        while (!isAtEnd()) {
            statements.add(declaration());
        }

        return statements; 
    }
    ```
2. `declaration` 方法如下
    ```java
    // Parser.java

    private Stmt declaration() {
        try {
            if (match(VAR)) return varDeclaration();

            return statement();
        } catch (ParseError error) {
            synchronize();
            return null;
        }
    }
    ```
3. `declaration` 方法通过查找前导关键字 `var` 来查看我们是否处于变量声明中。如果不是，它将转到解析普通语句的方法 `statement`。
4. `declaration` 方法是我们在解析块或脚本中的一系列语句时反复调用的方法，因此当解析器进入恐慌模式时，它是进行 synchronize 的正确位置。解析方法包装在 `try` 中，以捕获解析器开始错误恢复时抛出的异常。这使其重新尝试解析下一个 statement 或 declaration 的开头。
5. 当匹配到 `var` 时，调用 `varDeclaration` 方法
    ```java
    // Parser.java

    private Stmt varDeclaration() {
        Token name = consume(IDENTIFIER, "Expect variable name.");

        Expr initializer = null;
        if (match(EQUAL)) {
            initializer = expression();
        }

        consume(SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    }
    ```
6. 其中，消费变量名并保存在 `name` 中；如果变量声明有初始化，则对初始化表达式求值并保存在 `initializer` 中；然后消费掉分号；最后返回变量声明语句实例。

####  2.2.2. <a name='-1'></a>解析变量表达式
1. 一个单独的变量就是一个变量表达式，它属于 `primary` 表达式。
2. 在解析 `primary` 表达式的方法里新增 `IDENTIFIER` 的情况
    ```java
    private Expr primary() {
        if (match(FALSE))
            return new Expr.Literal(false);
        if (match(TRUE))
            return new Expr.Literal(true);
        if (match(NIL))
            return new Expr.Literal(null);

        if (match(NUMBER, STRING)) {
            return new Expr.Literal(previous().literal);
        }

        // 新增
        if (match(IDENTIFIER)) {
            return new Expr.Variable(previous());
        }

        if (match(LEFT_PAREN)) {
            Expr expr = expression();
            consume(RIGHT_PAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }

        throw error(peek(), "Expect expression.");
    }
    ```
3. 返回一个变量表达式实例。


##  3. <a name='Environments'></a>Environments
1. 将变量与值关联的绑定需要存储在某个地方，存储这种绑定的数据结构就被称为 **环境**（environment）。
2. 新建一个单独环境类
    ```java
    // Environment.java

    package com.craftinginterpreters.lox;

    import java.util.HashMap;
    import java.util.Map;

    class Environment {
        private final Map<String, Object> values = new HashMap<>();
    }
    ```
3. 我们需要支持两种操作：变量定义和查找变量。
4. 首先，变量定义将新名称绑定到值
    ```java
    // Environment.java

    void define(String name, Object value) {
        values.put(name, value);
    }
    ```
5. 当我们将键添加到映射时，我们不会检查它是否已经存在。这意味着这个程序可以工作：
    ```
    var a = "before";
    print a; // "before".
    var a = "after";
    print a; // "after".
    ```
6. 一旦变量存在，我们就需要一种方法来查找它
    ```java
    Object get(Token name) {
        if (values.containsKey(name.lexeme)) {
            return values.get(name.lexeme);
        }

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    ```
7. 如果没有找到变量，一般来说有三种选择：
    * 使其成为静态语法错误。
    * 使其成为运行时错误。
    * 允许它并返回一些默认值，如 `nil`。
8. 第三中情况太过宽松；第一种情况可以更早的发现错误，但它也有问题。问题在于，对 **求值** 一个变量和 **引用** 一个变量是不一样的，你可能在这个变量被定义之前就引用它，比如下面的情况
    ```
    fun isOdd(n) {
        if (n == 0) return false;
        return isEven(n - 1);
    }

    fun isEven(n) {
        if (n == 0) return true;
        return isOdd(n - 1);
    }
    ```
9. 如果我们编译到 `isOdd` 内部时，会发现其中 **引用的** `isEven` 没有定义。但如果我们编译完成后，调用 `isOdd` 并 **使用** 其中的 `isEven` 时，它已经是指向一个函数了。我们希望使用这样的代码，所以不应该在编译时的静态检查过程中看到 `isEven` 就报错。
10. 不过一些静态类型语言确实可以进行静态检查时合理处理上面这种相互调用的问题，它们会在检查函数体之前先完成所有的变量声明。（Some statically typed languages like Java and C# solve this by specifying that the top level of a program isn’t a sequence of imperative statements. Instead, a program is a set of declarations which all come into being simultaneously. The implementation declares all of the names before looking at the bodies of any of the functions.）另一些早期语言会要求你显式的在定义之前进行提前声明（forward declarations）。
11. 这里我们折中选择中间的处理方式，只在运行时求值无果时才抛出错误。
12. 不过我们也没有变量提升的功能。因此下面的代码会导致运行时错误
    ```
    print a;
    var a = "too late!";
    ```

###  3.1. <a name='Interpretingglobalvariables'></a>Interpreting global variables
1. `Interpreter` 类中会创建一个 `Environment` 类的一个实例，我们将其作为字段直接存储在解释器中，以便只要解释器​​仍在运行，变量就会一直留在内存中
    ```java
    // Interpreter.java

    class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Void> {

        private Environment environment = new Environment();
        
    // ...
    ```
2. 我们有两个新的语法树，因此有两个新的 visit 方法：一个用于解释变量声明语句，一个用于解释变量表达式。
3. 解释变量声明语句的 visit 方法
    ```java
    // Interpreter.java

    @Override
    public Void visitVarStmt(Stmt.Var stmt) {
        Object value = null;
        if (stmt.initializer != null) {
            value = evaluate(stmt.initializer);
        }

        environment.define(stmt.name.lexeme, value);
        return null;
    }
    ```
4. 如果变量声明语句有初始化，则对初始化表达式求值并修改为 `value` 的值；如果没有初始化，则 `value` 的值保持为 `null`，如果访问这个变量，得到的值是 `nil`
    ```js
    var a;
    print a; // "nil".
    ```
5. 然后我们把变量名和变量值绑定到 environment 中。
6. 解释变量表达式的 visit 方法
    ```java
    // Interpreter.java

    @Override
    public Object visitVariableExpr(Expr.Variable expr) {
        return environment.get(expr.name);
    }
    ···


##  4. <a name='Assignment'></a>Assignment
###  4.1. <a name='Assignmentsyntax'></a>Assignment syntax
1. Like most C-derived languages, assignment is an expression and not a statement. 
2. As in C, it is the lowest precedence expression form. That means the rule slots between expression and equality (the next lowest precedence expression)
    ```
    expression     → assignment ;
    assignment     → IDENTIFIER "=" assignment
                    | equality ;
    equality       → comparison ( ( "!=" | "==" ) comparison )* ;
    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
    term           → factor ( ( "-" | "+" ) factor )* ;
    factor         → unary ( ( "/" | "*" ) unary )* ;
    unary          → ( "!" | "-" ) unary
                    | primary ;
    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;
    ```
3. 这表示一个赋值规则：
    * 要么是：变量标识符后跟一个 `=` 再跟对该变量的赋值表达式；
    * 要么是一个 equality表达式（该表达式也可以是其他其他表达式）。
4. 稍后，当我们在对象上添加属性设置器时，赋值规则会变得更加复杂。例如：
    ```js
    instance.field = "value";
    ``` 
5. 同样的，我们为语法树添加一个对应的新节点
    ```java
    // tool/GenerateAst.java

    defineAst(outputDir, "Expr", Arrays.asList(
        // > Statements and State assign-expr
        "Assign   : Token name, Expr value",
        // < Statements and State assign-expr
        "Binary   : Expr left, Token operator, Expr right",
    // ...
    ```
6. 生成的赋值表达式类如下
    ```java
    // Expr.java

    static class Assign extends Expr {
        Assign(Token name, Expr value) {
            this.name = name;
            this.value = value;
        }

        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitAssignExpr(this);
        }

        final Token name;
        final Expr value;
    }
    ```
7. 它的第一个参数是赋值表达式左侧的 token，第二个参数是右侧表达式的值。

###  4.2. <a name='-1'></a>解析赋值表达式
1. `Parser` 类中的 `expression` 方法从
    ```java
    // Parser.java

    private Expr expression() {
        return equality();
    }
    ```
    变为
    ```java
    private Expr expression() {
        return assignment();
    }
    ```
2. 目前我们的 `assignment` 方法如下
    ```java
    // Parser.java

    private Expr assignment() {
        Expr expr = equality();

        if (match(EQUAL)) {
            Token equals = previous();
            Expr value = assignment();
        
            if (expr instanceof Expr.Variable) {
                Token name = ((Expr.Variable)expr).name;
                return new Expr.Assign(name, value);
            }
        
            error(equals, "Invalid assignment target."); 
        }

        return expr;
    }
    ```
3. 我们先解析一个表达式，保存在 `expr`。这个表达式可能是赋值表达式的左侧，也可能不是。
4. 接下来的一个 token 如果是赋值符号，那就说明此时是在是一个赋值表达式中，而 `expr` 就是赋值表达式的左侧；而如果不是赋值符号，那就是其他表达式，直接返回。
5. 是赋值表达式的情况下，通过 `previous` 获取到赋值符号的 token。
6. 由于可能存在连续赋值，例如 `a = b = c`，所以递归调用 `assignment` 来解析赋值表达式的右侧。
7. 之前我们在处理连续的二元表达式操作，例如 `1 + 2 + 3` 的情况时，我们使用了 `while` 循环，因为这样的二元表达式是左结合的，优先计算靠左的操作符。而赋值操作是右结合的，也就是说，`a = b = c` 相当于 `a = (b = c)`，所以这里使用了递归计算赋值表达式右侧。
8. 赋值表达式的左侧由两种情况：
    * 变量：`a = 2`;
    * 对象字段：`obj.count = 2`。
9. 只有 `expr` 是这两种情况之一时，才是一个合理的表达式，所以我们要检查 `expr` 的类型，但目前我们先考虑是变量的情况。
10. 如果左侧是合理的类型，那就建立并返回一个赋值表达式对象。否则生成一个错误。

###  4.3. <a name='Assignmentsemanticsinterpret'></a>Assignment semantics（interpret）
1. 我们有了一个新的语法树节点，因此我们的解释器也要有一个新的 visit 方法
    ```java
    // Interpreter.java

    @Override
    public Object visitAssignExpr(Expr.Assign expr) {
        Object value = evaluate(expr.value);
        environment.assign(expr.name, value);
        return value;
    }
    ```
2. 它对赋值表达式右侧求值，然后通过环境的 `assign` 方法存储在环境中表达式左侧变量名对应的字段
    ```java
    // Environment.java

    void assign(Token name, Object value) {
        if (values.containsKey(name.lexeme)) {
            values.put(name.lexeme, value);
            return;
        }

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    ```
3. `visitAssignExpr` 会返回右侧表达式的值，因为赋值表达式可以作为被嵌套的表达式。例如
    ```js
    var a = 1;
    print a = 2; // "2"
    ```


##  5. <a name='Scope'></a>Scope
1. A **scope** defines a region where a name maps to a certain entity.
2. **Lexical scope** (**static scope**) is a specific style of scoping where the text of the program itself shows where a scope begins and ends. When you see an expression that uses some variable, you can figure out which variable declaration it refers to just by statically reading the code.
3. “Lexical” comes from the Greek “lexikos” which means “related to words”. When we use it in programming languages, it usually means a thing you can figure out from source code itself without having to execute anything.
4. Lox doesn’t have dynamically scoped variables, but methods and fields on objects are dynamically scoped
    ```js
    class Saxophone {
        play() {
            print "Careless Whisper";
        }
    }

    class GolfClub {
        play() {
            print "Fore!";
        }
    }

    fun playIt(thing) {
        thing.play();
    }
    ```
    直到运行时我们才知道 `playIt` 里面的 `play` 方法是哪一个。
5. 当我们的解释器处理代码时，影响作用域的语法树节点将改变环境。
6. 在像 Lox 中，作用域由花括号块控制
    ```js
    {
        var a = "in block";
    }
    print a; // Error! No more "a".
    ```
    块的开头引入了一个新的局部作用域，当执行到 `}` 时，该作用域结束。在块内声明的任何变量都会消失。

###  5.1. <a name='Nestingandshadowing'></a>Nesting and shadowing
1. 看下面的例子
    ```js
    // How loud?
    var volume = 11;

    // Silence.
    volume = 0;

    // Calculate size of 3x4x5 cuboid.
    {
        var volume = 3 * 4 * 5;
        print volume;
    }
    ```
2. 这里有了嵌套的作用域，而且在代码块里面，和外部同名的变量 `volume` 会这遮蔽外面的全局变量。
3. 执行代码块的时候，会新建一个局部的环境，以及局部的变量 `volume`。代码块执行完成后，需要销毁这个局部的 `volume`，但不能因为同名就也把外部的 `volume` 销毁了。
4. 而且，为了支持下面的代码，在代码块内部，一样也需要能够访问到外部环境中的变量，不能只能访问到当前代码块环境中声明的变量
    ```js
    var global = "outside";
    {
        var local = "inside";
        print global + local;
    }
    ```
5. 执行完代码块之后，还要把环境恢复成之前的外部环境。
6. 我们通过把不同层级的环境链接在一起来实现上述功能，每一个环境都会引用它的父级环境，也就是形成作用域链。
7. 但同一个环境中可能有不止一个的同辈环境，所以就会形成作用域链的分叉，最终形成一个 **父指针树**（parent pointer tree，又叫 cactus stack）的结构。
8. 给 `Environment` 类添加一个 `enclosing` 字段用来引用它的父级环境
    ```java
    // Environment.java

    final Environment enclosing;
    ```
9. `enclosing` 字段需要初始化
    ```java
    // Environment.java
    
    Environment() {
        enclosing = null;
    }

    Environment(Environment enclosing) {
        this.enclosing = enclosing;
    }
    ```
    无参数的构造函数用于全局作用域环境，它没有父级环境，所以是 `null`；带参数的构造函数创建一个局部作用域环境，参数是它的父级环境。
10. 我们不必修改 `define` 方法，因为新变量只能声明在当前环境中。但可以读取其他环境中的变量，也可以对其他环境的变量赋值，所以这两个方法需要修改。
11. 读取方法
    ```java
    // Environment.java

    Object get(Token name) {
        if (values.containsKey(name.lexeme)) {
            return values.get(name.lexeme);
        }

        // 走到这里说明从当前环境里没找到。
        // 此时如果还有父级环境，那就到父级环境中找；
        // 如果已经是全局作用域，就抛出错误。
        if (enclosing != null) return enclosing.get(name);

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    ```
12. 赋值方法   
    ```java
    void assign(Token name, Object value) {
        if (values.containsKey(name.lexeme)) {
            values.put(name.lexeme, value);
            return;
        }

        // 走到这里说明当前环境里没有这个变量。
        // 此时如果还有父级环境，那就到父级环境中尝试寻找变量并赋值；
        // 如果已经是全局作用域，就抛出错误。
        if (enclosing != null) {
            enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
    }
    ```

###  5.2. <a name='Blocksyntaxandsemantics'></a>Block syntax and semantics
1. 增加块语句的 grammar 规则
    ```
    program        → declaration* EOF ;

    declaration    → varDecl
                    | statement ;

    varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

    statement      → exprStmt
                    | printStmt
                    | block ;
    
    exprStmt       → expression ";" ;

    printStmt      → "print" expression ";" ;

    block          → "{" declaration* "}" ;
    ```
2. 语法树中增加对应的语句节点
    ```java
    // tool/GenerateAst.java

    defineAst(outputDir, "Stmt", Arrays.asList(
        "Block      : List<Stmt> statements",
        "Expression : Expr expression",
        "Print      : Expr expression",
        "Var        : Token name, Expr initializer"
    ));
    ```
3. 生成的块语句类
    ```java
    // Stmt.java

    static class Block extends Stmt {
        Block(List<Stmt> statements) {
            this.statements = statements;
        }

        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitBlockStmt(this);
        }

        final List<Stmt> statements;
    }
    ```
4. `Parser` 中解析块的方法
    ```java
    // Parser.java

    private List<Stmt> block() {
        List<Stmt> statements = new ArrayList<>();

        while (!check(RIGHT_BRACE) && !isAtEnd()) {
            statements.add(declaration());
        }

        consume(RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }
    ```
5. 这个方法先创建一个空列表，然后逐个解析语句并将它们添加到列表中，直到块的结尾。
6. `while` 循环还进行了 `isAtEnd()` 检查。我们必须小心避免无限循环，即使在解析无效代码时也是如此。如果用户忘记了结束符 `}`，解析器也需要避免卡住。
7. `Interpreter` 中负责解释执行块语句的 visit 方法
    ```java
    // Interpreter.java

    @Override
    public Void visitBlockStmt(Stmt.Block stmt) {
        executeBlock(stmt.statements, new Environment(environment));
        return null;
    }
    ```
8. 可以看到，里面负责执行的 `executeBlock` 不仅接受了块内的语句，也接受了一个新建的环境作为这个块的局部作用域环境。`executeBlock` 如下
    ```java
    // Interpreter.java

    void executeBlock(List<Stmt> statements, Environment environment) {
        Environment previous = this.environment;
        try {
            this.environment = environment;

            for (Stmt statement : statements) {
                execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }
    ```
9. `executeBlock` 先把现有的环境对象（当前块的父环境）保存为 `previous`，用于之后恢复；然后用新创建的环境对象作为当前环境对象执行块里的语句；在结束当前块的执行后，或者执行块内语句发生错误后，通过 `finally` 再把环境恢复为块外层的环境。


##  6. <a name='References'></a>References
* [*Crafting interpreters*: Statements and State](https://craftinginterpreters.com/statements-and-state.html)