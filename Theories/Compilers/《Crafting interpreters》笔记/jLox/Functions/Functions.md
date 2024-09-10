# Functions

<!-- vscode-markdown-toc -->
* 1. [Function Calls](#FunctionCalls)
* 2. [Function Objects](#FunctionObjects)
	* 2.1. [Interpreting function declarations](#Interpretingfunctiondeclarations)
* 3. [Return Statements](#ReturnStatements)
	* 3.1. [Returning from calls](#Returningfromcalls)
* 4. [Local Functions and Closures](#LocalFunctionsandClosures)
* 5. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='FunctionCalls'></a>Function Calls
1. The name of the function being called isn’t actually part of the call syntax. The thing being called—the **callee**—can be any expression that evaluates to a function.
2. 下面的例子中有两个 callee，`getCallback` 和 `getCallback()`
	```js
	getCallback()();
	```
3. 如果把 callee 后面的括号视为后缀运算符的话，它是有最高优先级的运算符。我们把它加到 grammar rules 里面
	```
    expression     → assignment ;

    assignment     → IDENTIFIER "=" assignment
                    | logic_or ;

	logic_or       → logic_and ( "or" logic_and )* ;

	logic_and      → equality ( "and" equality )* ;

    equality       → comparison ( ( "!=" | "==" ) comparison )* ;

    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;

    term           → factor ( ( "-" | "+" ) factor )* ;

    factor         → unary ( ( "/" | "*" ) unary )* ;

	unary          → ( "!" | "-" ) unary | call ;

	call           → primary ( "(" arguments? ")" )* ;

    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;

	arguments      → expression ( "," expression )* ;

	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
4. If there are no parentheses, this parses a bare primary expression. Otherwise, each call is recognized by a pair of parentheses with an optional list of arguments inside. 
5. 新增 call 表达式 AST 节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Expr", Arrays.asList(
		"Assign   : Token name, Expr value",
		"Binary   : Expr left, Token operator, Expr right",
		"Call     : Expr callee, Token paren, List<Expr> arguments",
		"Grouping : Expr expression",
		"Literal  : Object value",
		"Logical  : Expr left, Token operator, Expr right",
		"Unary    : Token operator, Expr right",
		"Variable : Token name"
	));
	```
	生成的 `Call` 表达式类
	```java
	// Expr.java

	static class Call extends Expr {
        Call(Expr callee, Token paren, List<Expr> arguments) {
            this.callee = callee;
            this.paren = paren;
            this.arguments = arguments;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitCallExpr(this);
        }
    
        final Expr callee;
        final Token paren;
        final List<Expr> arguments;
    }
	```
6. `Call` 表达式类存储被 callee 表达式和参数的表达式列表 `arguments`。它还存储右括号的 token `paren`，当我们报告由函数调用引起的运行时错误时，我们将使用该 token 的位置。
7. 解析器中，现在解析 `unary` 表达式时要默认落到 `call` 表达式了 
	```java
	// Parser.java

	private Expr unary() {
		if (match(BANG, MINUS)) {
			Token operator = previous();
			Expr right = unary();
			return new Expr.Unary(operator, right);
		}

		return call();
	}

	private Expr call() {
        Expr expr = primary();
    
        while (true) { 
            if (match(LEFT_PAREN)) {
                expr = finishCall(expr);
            } 
            else {
                break;
            }
        }
    
        return expr;
    }

	private Expr finishCall(Expr callee) {
		List<Expr> arguments = new ArrayList<>();
		if (!check(RIGHT_PAREN)) {
			do {
				arguments.add(expression());
			} 
			while (match(COMMA));
		}

		Token paren = consume(RIGHT_PAREN, "Expect ')' after arguments.");

		return new Expr.Call(callee, paren, arguments);
	}
	```
8. `call` 方法中首先解析一个 `primary` 表达式，它可能是一个函数表达式也可能不是。然后在 `while` 循环中，如果接着匹配到了 `(`，那就认为这个 `primary` 表达式是函数表达式，然后通过 `finishCall` 调用函数，传入函数表达式。
9. `finishCall` 中，如果接下来的 token 是 `)`，那说明函数调用没有参数，直接返回函数调用表达式对象；如果接下来的 token 不是 `)`，那就认为是参数，然后循环的读取参数，再返回带参数的调用表达式对象。
10. `finishCall` 在经过一次调用后，会返回到 `call` 方法的循环里，用返回值修改 `expr`。如果接下来再次匹配到 `(`，那就在此进行函数调用，这次的 callee 就是上次 `finishCall` 返回的调用表达式对象。
11. `call` 方法中的循环写法看起来比较奇怪，但之后我会对它扩展。

### Maximum argument counts
1. Our Java interpreter for Lox doesn’t really need a limit, but having a maximum number of arguments will simplify our bytecode interpreter. 
2. We want our two interpreters to be compatible with each other, even in weird corner cases like this, so we’ll add the same limit to jlox
	```java
	// Parser.java
	
	private Expr finishCall(Expr callee) {
		List<Expr> arguments = new ArrayList<>();
		if (!check(RIGHT_PAREN)) {
			do {
				// 这里
				if (arguments.size() >= 255) {
					error(peek(), "Can't have more than 255 arguments.");
				}
				arguments.add(expression());
			} 
			while (match(COMMA));
		}

		Token paren = consume(RIGHT_PAREN, "Expect ')' after arguments.");

		return new Expr.Call(callee, paren, arguments);
	}
	```
3. Note that the code here *reports* an error if it encounters too many arguments, but it doesn’t *throw* the error. 
4. Throwing is how we kick into panic mode which is what we want if the parser is in a confused state and doesn’t know where it is in the grammar anymore. 
5. But here, the parser is still in a perfectly valid state—it just found too many arguments. So it reports the error and keeps on keepin’ on.

### Interpreting function calls
1. As always, interpretation starts with a new visit method for our new call expression node. 暂未完成的 `visitCallExpr`
	```java
	// Interpreter.java

	@Override
    public Object visitCallExpr(Expr.Call expr) {
        Object callee = evaluate(expr.callee);

        List<Object> arguments = new ArrayList<>();
        for (Expr argument : expr.arguments) { 
            arguments.add(evaluate(argument));
        }

        LoxCallable function = (LoxCallable)callee;
        return function.call(this, arguments);
    }
	```
2. 首先，我们对 callee 求值。通常，callee 只是一个通过名称查找函数的标识符，但它可以是任何东西。
3. 然后我们按顺序对每个参数求值，并将结果值存储在列表中。
4. Once we’ve got the callee and the arguments ready, all that remains is to perform the call. We do that by casting the callee to a `LoxCallable` and then invoking a `call()` method on it. 
5. The Java representation of any Lox object that can be called like a function will implement this interface. That includes user-defined functions, naturally, but also class objects since classes are “called” to construct new instances.
6. 新建一个 LoxCallable 文件
	```java
	// lox/LoxCallable.java

	package com.craftinginterpreters.lox;

	import java.util.List;

	interface LoxCallable {
		Object call(Interpreter interpreter, List<Object> arguments);
	}
	```
7. We pass in the interpreter in case the class implementing `call()` needs it. The implementer’s job is then to return the value that the call expression produces.

### Call type errors
1. 如果被调用者实际上不是您可以调用的东西，会发生什么？例如
	```js
	"totally not a function"();
	```
2. 我们目前的代码并不会主动识别出这种错误。Strings aren’t callable in Lox. The runtime representation of a Lox string is a Java string, so when we cast that to `LoxCallable`, the JVM will throw a `ClassCastException`. 
3. 所以我们主动检查这种潜在的错误
	```java
	// Interpreter.java

	@Override
	public Object visitCallExpr(Expr.Call expr) {
		Object callee = evaluate(expr.callee);

		List<Object> arguments = new ArrayList<>();
		for (Expr argument : expr.arguments) { 
			arguments.add(evaluate(argument));
		}

		// 新增
		if (!(callee instanceof LoxCallable)) {
			throw new RuntimeError(expr.paren, "Can only call functions and classes.");
		}
		
		LoxCallable function = (LoxCallable)callee;
		return function.call(this, arguments);
	}
	```
4. We still throw an exception, but now we’re throwing our own exception type, one that the interpreter knows to catch and report gracefully.

### Checking arity
1. The other problem relates to the function’s arity. Arity is the fancy term for the number of arguments a function or operation expects. Unary operators have arity one, binary operators two, etc. With functions, the arity is determined by the number of parameters it declares.
2. 不同的语言在处理实参和形参数量不一致时会采取不同的策略，这里我们选择在调用时检查两者的数量，如果不一致就报错。同样在 `visitCallExpr` 增加检查的逻辑
	```java
	// Interpreter.java
	
	@Override
    public Object visitCallExpr(Expr.Call expr) {
        Object callee = evaluate(expr.callee);

        List<Object> arguments = new ArrayList<>();
        for (Expr argument : expr.arguments) { 
            arguments.add(evaluate(argument));
        }

        if (!(callee instanceof LoxCallable)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }
        
        LoxCallable function = (LoxCallable)callee;

		// 新增
        if (arguments.size() != function.arity()) {
            throw new RuntimeError(expr.paren, "Expected " +
                function.arity() + " arguments but got " +
                arguments.size() + ".");
        }

        return function.call(this, arguments);
    }
	```
3. That requires a new method on the LoxCallable interface to ask it its arity
	```java
	// LoxCallable.java

	interface LoxCallable {
		int arity();
		
		Object call(Interpreter interpreter, List<Object> arguments);
	}
	```


## Native Functions
1. Native Functions are functions that the interpreter exposes to user code but that are implemented in the host language (in our case Java), not the language being implemented (Lox).
2. 这里我们距离实现一个用于报时的 native 函数：`clock`。
3. 当我们开始研究更高效的 Lox 实现时，我们将非常关注性能。性能工作需要测量，这反过来又意味着基准测试。这些程序可以测量执行解释器某个角落所需的时间。
4. 我们可以测量启动解释器、运行基准测试和退出所需的时间。一个更解决方案是让基准测试脚本本身测量代码中两点之间的时间。要做到这一点，Lox 程序需要能够报时。
5. So we’ll add `clock()`, a native function that returns the number of seconds that have passed since some fixed point in time. The difference between two successive invocations tells you how much time elapsed between the two calls. 
6. This function is defined in the global scope, so let’s ensure the interpreter has access to that. `Interpreter` 类创建环境的代码做如下替换
	```java
	// Interpreter.java

	// private Environment environment = new Environment();
	final Environment globals = new Environment();
	private Environment environment = globals;
	```
7. The `environment` field in the interpreter changes as we enter and exit local scopes. It tracks the *current* environment. This new `globals` field holds a fixed reference to the outermost global environment.
8. When we instantiate an Interpreter, we stuff the native function in that global scope。新增构造函数
	```java
	// Interpreter.java

	Interpreter() {
        globals.define("clock", new LoxCallable() {
            @Override
            public int arity() { return 0; }
        
            @Override
            public Object call(Interpreter interpreter, List<Object> arguments) {
                return (double)System.currentTimeMillis() / 1000.0;
            }
        
            @Override
            public String toString() { return "<native fn>"; }
        });
    }
	```
9. This defines a variable named “clock”. Its value is a Java anonymous class that implements `LoxCallable`. 
10. The implementation of `call()` calls the corresponding Java function and converts the result to a double value in seconds.


## Function Declarations
1. 命名函数声明实际上并不是一个单一的原始操作。它是两个不同步骤的语法糖：(1) 创建一个新函数对象，(2) 将新变量绑定到它。
2. 如果 Lox 有匿名函数的语法，我们就不需要函数声明语句了。你只需执行以下操作
	```js
	var add = fun (a, b) {
		print a + b;
	};
	```
3. 但是，由于命名函数是常见的情况，我继续为它们提供了 Lox 良好的语法。更新语句和表达式的 grammar
	```
    program        → declaration* EOF ;

    declaration    → funDecl
					| varDecl
                    | statement ;

	funDecl        → "fun" function ;
	
	function       → IDENTIFIER "(" parameters? ")" block ;

	varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

    statement      → exprStmt
					| forStmt
					| ifStmt
                    | printStmt
					| whileStmt
                    | block ;

	exprStmt       → expression ";" ;

	
	forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
					expression? ";"
					expression? ")" statement ;

    ifStmt         → "if" "(" expression ")" statement 
					( "else" statement )? ;
	
    printStmt      → "print" expression ";" ;

	whileStmt      → "while" "(" expression ")" statement ;

    block          → "{" declaration* "}" ;
	```
	```
    expression     → assignment ;

    assignment     → IDENTIFIER "=" assignment
                    | logic_or ;

	logic_or       → logic_and ( "or" logic_and )* ;

	logic_and      → equality ( "and" equality )* ;

    equality       → comparison ( ( "!=" | "==" ) comparison )* ;

    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;

    term           → factor ( ( "-" | "+" ) factor )* ;

    factor         → unary ( ( "/" | "*" ) unary )* ;

	unary          → ( "!" | "-" ) unary | call ;

	call           → primary ( "(" arguments? ")" )* ;

    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;

	arguments      → expression ( "," expression )* ;
	
	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
4. AST 新增函数声明语句节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Stmt", Arrays.asList(
		"Block      : List<Stmt> statements",
		"Expression : Expr expression",
		"Function   : Token name, List<Token> params, List<Stmt> body",
		"If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
		"Print      : Expr expression",
		"Var        : Token name, Expr initializer",
		"While      : Expr condition, Stmt body"
	));
	```
5. 生成的类如下
	```java
	// Stmt.java

	static class Function extends Stmt {
        Function(Token name, List<Token> params, List<Stmt> body) {
            this.name = name;
            this.params = params;
            this.body = body;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitFunctionStmt(this);
        }
    
        final Token name;
        final List<Token> params;
        final List<Stmt> body;
    }
	```
6. Parser 的 `declaration` 方法中新增函数声明的情况
	```java
	private Stmt declaration() {
		try {
			// 这个解析方法之后还会用于 method，对应的参数是 "method"
			if (match(FUN)) return function("function");
			if (match(VAR)) return varDeclaration();

			return statement();
		} catch (ParseError error) {
			synchronize();
			return null;
		}
	}
	```
7. `function` 方法
	```java
	private Stmt.Function function(String kind) {
		Token name = consume(IDENTIFIER, "Expect " + kind + " name.");

		consume(LEFT_PAREN, "Expect '(' after " + kind + " name.");

		List<Token> parameters = new ArrayList<>();

		if (!check(RIGHT_PAREN)) {
			do {
				if (parameters.size() >= 255) {
					error(peek(), "Can't have more than 255 parameters.");
				}

				parameters.add(consume(IDENTIFIER, "Expect parameter name."));
			} while (match(COMMA));
		}

		consume(RIGHT_PAREN, "Expect ')' after parameters.");

		consume(LEFT_BRACE, "Expect '{' before " + kind + " body.");

		List<Stmt> body = block();
		
		return new Stmt.Function(name, parameters, body);
	}
	```


##  2. <a name='FunctionObjects'></a>Function Objects
1. 我们已经解析了一些语法，因此通常可以进行解释，但首先我们需要考虑如何用 Java 表示 Lox 函数。
2. 我们需要跟踪 parameters，以便在调用函数时将它们绑定到 arguments。当然，我们需要保留函数主体的代码，以便我们可以执行它。
3. 这基本上就是 `Stmt.Function` 类。我们可以直接使用它吗？差不多，但不完全是。我们还需要一个实现 `LoxCallable` 的类，以便我们可以调用它。
4. 我们不希望解释器的运行时阶段渗透到前端的语法类中，所以我们不希望 `Stmt.Function` 本身实现它。所以，我们将它包装在一个新类中
	```java
	// lox/LoxFunction.java

	package com.craftinginterpreters.lox;

	import java.util.List;

	class LoxFunction implements LoxCallable {
		private final Stmt.Function declaration;
		
		LoxFunction(Stmt.Function declaration) {
			this.declaration = declaration;
		}
	}
	```
5. We implement the `call()` of `LoxCallable` like so
	```java
	// LoxFunction.java

	@Override
	public Object call(Interpreter interpreter, List<Object> arguments) {
		// 这里暂时把函数执行的外层环境统一设置为全局环境，后面的 Local Functions and Closures 小节会解决这个问题
		Environment environment = new Environment(interpreter.globals);

		for (int i = 0; i < declaration.params.size(); i++) {
			environment.define(declaration.params.get(i).lexeme, arguments.get(i));
		}

		interpreter.executeBlock(declaration.body, environment);
		
		return null;
	}
	```
6. 函数封装了它的参数，函数之外的其他代码都无法看到它们，这意味着每个函数都有自己的环境来存储这些变量。
7. 此环境必须动态创建，每个函数调用都有自己的环境。如果同时对同一函数进行多次调用，则每个调用都需要自己的环境。
8. `executeBlock` 会暂存当前环境 `this.environment`，使用参数接收的新创建的环境作为函数执行的环境，执行完成后再把当前环境恢复为之前暂存的那个。

###  2.1. <a name='Interpretingfunctiondeclarations'></a>Interpreting function declarations
```java
// Interpreter.java

@Override
public Void visitFunctionStmt(Stmt.Function stmt) {
	LoxFunction function = new LoxFunction(stmt);
	environment.define(stmt.name.lexeme, function);
	return null;
}
```


##  3. <a name='ReturnStatements'></a>Return Statements
1. If Lox were an expression-oriented language like Ruby or Scheme, the body would be an expression whose value is implicitly the function’s result. But in Lox, the body of a function is a list of statements which don’t produce values, so we need dedicated syntax for emitting a result. In other words, return statements
2. 更新语句 grammar
	```
    program        → declaration* EOF ;

    declaration    → funDecl
					| varDecl
                    | statement ;

	funDecl        → "fun" function ;
	
	function       → IDENTIFIER "(" parameters? ")" block ;

	varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

    statement      → exprStmt
					| forStmt
					| ifStmt
                    | printStmt
					| returnStmt
					| whileStmt
                    | block ;

	exprStmt       → expression ";" ;

	
	forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
					expression? ";"
					expression? ")" statement ;

    ifStmt         → "if" "(" expression ")" statement 
					( "else" statement )? ;
	
    printStmt      → "print" expression ";" ;

	returnStmt     → "return" expression? ";" ;

	whileStmt      → "while" "(" expression ")" statement ;

    block          → "{" declaration* "}" ;
	```
3. 增加 return 语句 AST 节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Stmt", Arrays.asList(
		"Block      : List<Stmt> statements",
		"Expression : Expr expression",
		"Function   : Token name, List<Token> params, List<Stmt> body",
		"If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
		"Print      : Expr expression",
		"Return     : Token keyword, Expr value",
		"Var        : Token name, Expr initializer",
		"While      : Expr condition, Stmt body"
	));
	```
4. 生成的 return 语句类
	```java
	// Stmt.java

	static class Return extends Stmt {
		Return(Token keyword, Expr value) {
			this.keyword = keyword;
			this.value = value;
		}

		@Override
		<R> R accept(Visitor<R> visitor) {
			return visitor.visitReturnStmt(this);
		}

		final Token keyword;
		final Expr value;
	}
	```
	It keeps the `return` keyword token so we can use its location for error reporting.
5. 解析方法
	```java
	// Parser.java

	private Stmt returnStatement() {
		Token keyword = previous();
		Expr value = null;
		if (!check(SEMICOLON)) {
			value = expression();
		}

		consume(SEMICOLON, "Expect ';' after return value.");
		return new Stmt.Return(keyword, value);
	}
	```
	
###  3.1. <a name='Returningfromcalls'></a>Returning from calls
1. 可以从函数主体中的任何位置返回，甚至可以从其他语句中深度嵌套返回。执行返回时，解释器需要跳出当前所处的上下文并完成函数调用，就像某种提升控制流构造一样。
2. 例如，假设我们正在运行此程序，并且即将执行 return
	```js
	fun count(n) {
	while (n < 100) {
		if (n == 3) return n; // <--
		print n;
		n = n + 1;
	}
	}

	count(1);
	```
3. The Java call stack currently looks roughly like this:
	```
	Interpreter.visitReturnStmt()
	Interpreter.visitIfStmt()
	Interpreter.executeBlock()
	Interpreter.visitBlockStmt()
	Interpreter.visitWhileStmt()
	Interpreter.executeBlock()
	LoxFunction.call()
	Interpreter.visitCallExpr()
	```
4. return 语句要求我们从栈顶部一直返回 `call()`。That sounds like exceptions.
5.  When we execute a `return` statement, we’ll use an exception to unwind the interpreter past the visit methods of all of the containing statements back to the code that began executing the body.
6. 因此，解释方法直接抛出 `Return` 类型的异常，并带上返回值
	```java
	// Interpreter.java

	@Override
	public Void visitReturnStmt(Stmt.Return stmt) {
		Object value = null;
		if (stmt.value != null) value = evaluate(stmt.value);

		throw new Return(value);
	}
	```
7. 定义 `Return` 类型异常
	```java
	// lox/Return.java

	package com.craftinginterpreters.lox;

	class Return extends RuntimeException {
		final Object value;

		Return(Object value) {
			super(null, null, false, false);
			this.value = value;
		}
	}
	```
8. This class wraps the return value with the accoutrements Java requires for a runtime exception class. 
9. The weird super constructor call with those null and false arguments disables some JVM machinery that we don’t need. Since we’re using our exception class for control flow and not actual error handling, we don’t need overhead like stack traces.
10. We want this to unwind all the way to where the function call began, the `call()` method in LoxFunction
	```java
	// LoxFunction.java

	@Override
	public Object call(Interpreter interpreter, List<Object> arguments) {
		Environment environment = new Environment(interpreter.globals);

		for (int i = 0; i < declaration.params.size(); i++) {
			environment.define(declaration.params.get(i).lexeme, arguments.get(i));
		}

		try {
			interpreter.executeBlock(declaration.body, environment);
		} 
		catch (Return returnValue) {
			return returnValue.value;
		}

		return null;
	}
	```
11. 不懂，那执行过程中有其他异常不也会被当做返回值捕获了吗？


##  4. <a name='LocalFunctionsandClosures'></a>Local Functions and Closures
1. 上面的 `call` 方法把函数执行环境的外层都设置为了全局环境，但显然如果函数定义在局部作用域，那就是有问题的。
2. 而且，按照上面的实现，下面的程序是无法正确执行的
	```js
	fun makeCounter() {
		var i = 0;
		fun count() {
			i = i + 1;
			print i;
		}

		return count;
	}

	var counter = makeCounter();
	counter();
	```
3. `counter` 执行的时候，当前环境已经不是 `makeCounter` 的内部环境了，所以是访问不到 `i` 的。而此时因为把外层环境设置成了全局环境，全局环境也没有 `i`，所以就会出错。
4. 当 `counter`（也就是 `count`）被调用时的作用域链是这样的
	<img src="../../images/global.png" width="600" style="display: block; margin: 5px 0 10px;" />
5. `count` 被调用的时候没有 `i` 所在的环境，但 `count` 被声明的时候，当前的环境是 `makeCounter` 的内部环境，这个环境里是有 `i` 的
	<img src="../../images/body.png" width="600" style="display: block; margin: 5px 0 10px;" />
6. 所以，我们可以在 `count` 被声明的时候，把当前的环境保存下来。这种封闭了函数声明时它周围变量的数据结构，就被称为闭包。
7. 闭包有不同的实现方法，这里我们使用最简单的方法。在函数声明时用一个字段来保存当前的环境
	```java
	// LoxFunction.java

	LoxFunction(Stmt.Function declaration, Environment closure) {
		this.closure = closure;
		this.declaration = declaration;
	}
	```
8. 解释函数声明语句时，把当前环境传给 `LoxFunction`
	```java
	// Interpreter.java

	@Override
	public Void visitFunctionStmt(Stmt.Function stmt) {
		LoxFunction function = new LoxFunction(stmt, environment);
		environment.define(stmt.name.lexeme, function);
		return null;
	}
	```
9. 当我们调用函数时，不再把它的外层环境设置为全局的，而是设置为闭包
	```java
	// LoxFunction.java

	@Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        Environment environment = new Environment(closure);

        for (int i = 0; i < declaration.params.size(); i++) {
            environment.define(declaration.params.get(i).lexeme, arguments.get(i));
        }

        try {
            interpreter.executeBlock(declaration.body, environment);
        } 
        catch (Return returnValue) {
            return returnValue.value;
        }

        return null;
    }
	```
10. 现在 `count` 在调用时就可以访问到它声明时的环境了
	<img src="../../images/closure.png" width="600" style="display: block; margin: 5px 0 10px;" />



##  5. <a name='References'></a>References
* [*Crafting interpreters*: Functions](https://craftinginterpreters.com/functions.html)
