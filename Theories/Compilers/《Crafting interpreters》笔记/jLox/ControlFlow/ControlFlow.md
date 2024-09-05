# Control Flow

<!-- vscode-markdown-toc -->
* 1. [Turing Machines (Briefly)](#TuringMachinesBriefly)
* 2. [Conditional Execution](#ConditionalExecution)
	* 2.1. [解析逻辑表达式](#)
	* 2.2. [解释执行逻辑表达式](#-1)
* 3. [While Loops](#WhileLoops)
* 4. [For Loops](#ForLoops)
	* 4.1. [解析](#-1)
* 5. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='TuringMachinesBriefly'></a>Turing Machines (Briefly)


##  2. <a name='ConditionalExecution'></a>Conditional Execution
1. C-derived languages have two main conditional execution features, the `if` statement and the perspicaciously named “conditional” operator (`?:`). 
2. An `if` statement lets you conditionally execute *statements* and the conditional operator lets you conditionally execute *expressions*.
3. For simplicity’s sake, Lox doesn’t have a conditional operator, so let’s get our `if` statement on. 
4. Our statement grammar gets a new production
	```
    program        → declaration* EOF ;

    declaration    → varDecl
                    | statement ;

	varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

    statement      → exprStmt
					| ifStmt
                    | printStmt
                    | block ;

	exprStmt       → expression ";" ;

	
    ifStmt         → "if" "(" expression ")" statement 
					( "else" statement )? ;

    printStmt      → "print" expression ";" ;

    block          → "{" declaration* "}" ;
    ```
5. 老样子，增加对应的语法树节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Stmt", Arrays.asList(
            "Block      : List<Stmt> statements",
            "Expression : Expr expression",
			"If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
            "Print      : Expr expression",
            "Var        : Token name, Expr initializer"
        ));
	```
6. 生成的 `if` 语句类如下
	```java
	// Stmt.java

	static class If extends Stmt {
		If(Expr condition, Stmt thenBranch, Stmt elseBranch) {
			this.condition = condition;
			this.thenBranch = thenBranch;
			this.elseBranch = elseBranch;
		}

		@Override
		<R> R accept(Visitor<R> visitor) {
			return visitor.visitIfStmt(this);
		}

		final Expr condition;
		final Stmt thenBranch;
		final Stmt elseBranch;
	}
	```

### 解析 `if` 语句
1. 对应的，在 `Parser` 中，解析 `statement` 的方法中增加匹配 `if` 语句的情况
	```java
	// Parser.java

	private Stmt statement() {
		if (match(IF)) return ifStatement();
		if (match(PRINT)) return printStatement();
		if (match(LEFT_BRACE)) return new Stmt.Block(block());

		return expressionStatement();
	}
	```
2. `ifStatement` 实现如下
	```java
	// Parser.java
	
	private Stmt ifStatement() {
		consume(LEFT_PAREN, "Expect '(' after 'if'.");
		Expr condition = expression();
		consume(RIGHT_PAREN, "Expect ')' after if condition."); 

		Stmt thenBranch = statement();
		Stmt elseBranch = null;
		if (match(ELSE)) {
			elseBranch = statement();
		}

		return new Stmt.If(condition, thenBranch, elseBranch);
	}
	```
3. 解析 `if...else` 时有个可能引起歧义的地方
	```js
	if (first) if (second) whenTrue(); else whenFalse();
	```
	这里的 `else` 是和哪个 `if` 配对的呢？
	<img src="../../images/dangling-else.png" width="600" style="display: block; margin: 5px 0 10px;" />
4. 从 `ifStatement` 的实现可以看到，我们在解析完 then 的语句之后，立刻就尝试解析 else 的语句，而没有考虑它们中间是否还有其他 if。所以，我们是把 else 和它前面紧挨着的那个 if 配成一对的。其他编程语言也是这样的逻辑。 

### 解释执行 `if` 语句
Interpreter 的 visit 方法如下
```java
// Interpreter.java

@Override
public Void visitIfStmt(Stmt.If stmt) {
	if (isTruthy(evaluate(stmt.condition))) {
		execute(stmt.thenBranch);
	} else if (stmt.elseBranch != null) {
		execute(stmt.elseBranch);
	}
	return null;
}
```


## Logical Operators
1. Lox 没有三元逻辑运算符，但逻辑运算符 `and` 和 `or` 也可以起到流程控制的作用，因为它们会短路。
2. 这两个运算符的优先级都比较低，并且 `or` 比 `and` 更低。我们把它俩插在 `assignment` 和 `equality` 之间
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
    unary          → ( "!" | "-" ) unary
                    | primary ;
    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;
    ```
3. AST 中新增逻辑运算表达式节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Expr", Arrays.asList(
		"Assign   : Token name, Expr value",
		"Binary   : Expr left, Token operator, Expr right",
		"Grouping : Expr expression",
		"Literal  : Object value",
		"Logical  : Expr left, Token operator, Expr right",
		"Unary    : Token operator, Expr right",
		"Variable : Token name"
	));
	```
	生成的逻辑运算表达式类如下
	```java
	// Expr.java

	static class Logical extends Expr {
        Logical(Expr left, Token operator, Expr right) {
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitLogicalExpr(this);
        }
    
        final Expr left;
        final Token operator;
        final Expr right;
    }
	```

###  2.1. <a name=''></a>解析逻辑表达式
1. 首先修改一下 `assignment` 方法，因为现在 `assignment` 表达式不再连接到 `equality` 表达式了
	```java
	// Parser.java

	private Expr assignment() {
		// Expr expr = equality();
		Expr expr = or();

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
2. `or` 方法
	```java
	// Parser.java
	
	private Expr or() {
		Expr expr = and();

		while (match(OR)) {
			Token operator = previous();
			Expr right = and();
			expr = new Expr.Logical(expr, operator, right);
		}

		return expr;
	}

	private Expr and() {
        Expr expr = equality();
    
        while (match(AND)) {
            Token operator = previous();
            Expr right = equality();
            expr = new Expr.Logical(expr, operator, right);
        }
    
        return expr;
    }
	```

###  2.2. <a name='-1'></a>解释执行逻辑表达式
visit 方法
```java
// Interpreter.java

@Override
public Object visitLogicalExpr(Expr.Logical expr) {
	Object left = evaluate(expr.left);

	if (expr.operator.type == TokenType.OR) {
		if (isTruthy(left)) return left;
	} 
	else {
		if (!isTruthy(left)) return left;
	}

	return evaluate(expr.right);
}
	```


##  3. <a name='WhileLoops'></a>While Loops
1. 产生式
	```
    program        → declaration* EOF ;

    declaration    → varDecl
                    | statement ;

	varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

    statement      → exprStmt
					| ifStmt
                    | printStmt
					| whileStmt
                    | block ;

	exprStmt       → expression ";" ;

	
    ifStmt         → "if" "(" expression ")" statement 
					( "else" statement )? ;
	
    printStmt      → "print" expression ";" ;

	whileStmt      → "while" "(" expression ")" statement ;

    block          → "{" declaration* "}" ;
	```
2. 新增语法树节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Stmt", Arrays.asList(
		"Block      : List<Stmt> statements",
		"Expression : Expr expression",
		"If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
		"Print      : Expr expression",
		"Var        : Token name, Expr initializer",
		"While      : Expr condition, Stmt body"
	));
	```	
3. 生成的 `while` 语句类如下
	```java
	// Stmt.java

	static class While extends Stmt {
        While(Expr condition, Stmt body) {
            this.condition = condition;
            this.body = body;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitWhileStmt(this);
        }
    
        final Expr condition;
        final Stmt body;
    }
	```
4. Parser 中
	```java
	// Parser.java

	private Stmt statement() {
		if (match(IF)) return ifStatement();
		if (match(PRINT)) return printStatement();
		if (match(WHILE)) return whileStatement();
		if (match(LEFT_BRACE)) return new Stmt.Block(block());

		return expressionStatement();
	}

	private Stmt whileStatement() {
        consume(LEFT_PAREN, "Expect '(' after 'while'.");
        Expr condition = expression();
        consume(RIGHT_PAREN, "Expect ')' after condition.");
        Stmt body = statement();
    
        return new Stmt.While(condition, body);
    }
	```
5. Interpreter 中
	```java
	// Interpreter.java

	@Override
	public Void visitWhileStmt(Stmt.While stmt) {
		while (isTruthy(evaluate(stmt.condition))) {
			execute(stmt.body);
		}
		return null;
	}
	```


##  4. <a name='ForLoops'></a>For Loops
1. 产生式
	```
    program        → declaration* EOF ;

    declaration    → varDecl
                    | statement ;

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
2. 但 `for` 循环只是语法糖
	```js
	for (var i = 0; i < 10; i = i + 1) print i;
	```
	完全可以写成
	```js
	{
		var i = 0;
		while (i < 10) {
			print i;
			i = i + 1;
		}
	}
	```
3. 语法糖虽然好用，但在复杂的语言实现中，每个需要后端支持和优化的语言功能都是昂贵的。
4. 所以，我们将把 `for` 循环脱糖（desugaring），使其变成解释器已经处理的 `while` 循环和其他语句。
5. `for` 不再需要对应的语法树节点，直接解析和解释执行即可。

###  4.1. <a name='-1'></a>解析
1. `statement` 方法增加匹配 `for` 的 token
	```java
	// Parser.java

	private Stmt statement() {
		if (match(FOR)) return forStatement();
		if (match(IF)) return ifStatement();
		if (match(PRINT)) return printStatement();
		if (match(WHILE)) return whileStatement();
		if (match(LEFT_BRACE)) return new Stmt.Block(block());

		return expressionStatement();
	}
	```
2. `forStatement` 方法暂时如下
	```java
	// Parser.java

	private Stmt forStatement() {
		consume(LEFT_PAREN, "Expect '(' after 'for'.");

		Stmt initializer;
		if (match(SEMICOLON)) {
			initializer = null;
		} 
		else if (match(VAR)) {
			initializer = varDeclaration();
		} 
		else {
			initializer = expressionStatement();
		}

		Expr condition = null;
		if (!check(SEMICOLON)) {
			condition = expression();
		}
		consume(SEMICOLON, "Expect ';' after loop condition.");

		Expr increment = null;
		if (!check(RIGHT_PAREN)) {
			increment = expression();
		}
		consume(RIGHT_PAREN, "Expect ')' after for clauses.");

		Stmt body = statement();

		return body;
	}
	```
3. 这个暂时的 `forStatement` 方法分别解析了 `for` 循环小括号里的三部分以及之后的循环体。
4. 现在的问题是，解析到的 `body` 语句需要反复执行，但 `increment` 表达式也是需要反复求值的。所以，我们把这两者包装到一起，组成一个新的 `body`，这个新 `body` 每次执行时也会重新求值 `increment` 了
	```java
	// Parser.java

	if (increment != null) {
		body = new Stmt.Block(
			Arrays.asList(
				body,
				new Stmt.Expression(increment)));
	}
	```
5. 但现在这个 `body` 还没有实现循环。`while` 的情况是，我们在 `whileStatement` 返回了 `while` 的 AST 节点，然后右解释器解释执行。但我们这里没有实现（因为不需要）`for` 的 AST 节点，因为我们本来就打算用 `while` 循环来实现 `for` 循环。所以我们这里应该返回 `while` 的 AST 节点。因此再对要返回的 `body` 包装一下
	```java
	// Parser.java

	if (condition == null) condition = new Expr.Literal(true);
	body = new Stmt.While(condition, body);
	```
6. 最后，再把 `initializer` 也包装进去
	```java
	// Parser.java

	if (initializer != null) {
		body = new Stmt.Block(Arrays.asList(initializer, body));
	}
	```
7. 完整的 `forStatement` 方法
	```java
	// Parser.java
	
	private Stmt forStatement() {
        consume(LEFT_PAREN, "Expect '(' after 'for'.");
    
        Stmt initializer;
        if (match(SEMICOLON)) {
            initializer = null;
        } 
        else if (match(VAR)) {
            initializer = varDeclaration();
        } 
        else {
            initializer = expressionStatement();
        }

        Expr condition = null;
        if (!check(SEMICOLON)) {
            condition = expression();
        }
        consume(SEMICOLON, "Expect ';' after loop condition.");

        Expr increment = null;
        if (!check(RIGHT_PAREN)) {
            increment = expression();
        }
        consume(RIGHT_PAREN, "Expect ')' after for clauses.");

        Stmt body = statement();

        if (increment != null) {
            body = new Stmt.Block(
                Arrays.asList(
                    body,
                    new Stmt.Expression(increment)));
        }

        if (condition == null) {
            condition = new Expr.Literal(true)
        }
        body = new Stmt.While(condition, body);

        if (initializer != null) {
            body = new Stmt.Block(Arrays.asList(initializer, body));
        }

        return body;
    }
	```


##  5. <a name='References'></a>References
* [*Crafting interpreters*: ControlFlow](https://craftinginterpreters.com/control-flow.html)
