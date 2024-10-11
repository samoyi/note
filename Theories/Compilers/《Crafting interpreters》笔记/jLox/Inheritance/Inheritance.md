# Inheritance


<!-- vscode-markdown-toc -->
* 1. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


## Superclasses and Subclasses
1. 我们在 Lox 中支持继承的第一步是在声明类时指定超类。我们使用下面示例的语法
	```js
	class Doughnut {
		// General doughnut stuff...
	}

	class BostonCream < Doughnut {
		// Boston Cream-specific stuff...
	}
	```
2. 为此我们把 `classDecl` 的 rule 从
	```
	classDecl      → "class" IDENTIFIER "{" function* "}" ;
	```
	更新为
	```
	classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )? "{" function* "}" ;
	```
3. 更新后完整的 grammar
 	```
    program        → declaration* EOF ;

    declaration    → classDecl
                    | funDecl
					| varDecl
                    | statement ;

    classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )? "{" function* "}" ;

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
4. 与 Java 等其他面向对象语言不同，Lox 没有所有内容都继承自的根类，因此当您省略超类子句时，该类没有超类。
5. class 语句节点也更新
	```java
	// GenerateAst.java

	defineAst(outputDir, "Stmt", Arrays.asList(
		"Block      : List<Stmt> statements",
		// "Class      : Token name, List<Stmt.Function> methods",
		"Class      : Token name, Expr.Variable superclass, List<Stmt.Function> methods",
		"Expression : Expr expression",
		"Function   : Token name, List<Token> params, List<Stmt> body",
		"If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
		"Print      : Expr expression",
		"Return     : Token keyword, Expr value",
		"Var        : Token name, Expr initializer",
		"While      : Expr condition, Stmt body"
	));
	```
	更新后的 class 语句类
	```java
	// Stmt.java

	static class Class extends Stmt {
        Class(Token name, Expr.Variable superclass, List<Stmt.Function> methods) {
            this.name = name;
            this.superclass = superclass;
            this.methods = methods;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitClassStmt(this);
        }
    
        final Token name;
        final Expr.Variable superclass;
        final List<Stmt.Function> methods;
    }
	```
6. You might be surprised that we store the superclass name as an `Expr.Variable`, not a Token. The grammar restricts the superclass clause to a single identifier, but at runtime, that identifier is evaluated as a variable access. Wrapping the name in an `Expr.Variable` early on in the parser gives us an object that the resolver can hang the resolution information off of.
7. Parse
	```java
	// Parser.java

	private Stmt classDeclaration() {
		Token name = consume(IDENTIFIER, "Expect class name.");

		// 新增
		Expr.Variable superclass = null;
		if (match(LESS)) {
			consume(IDENTIFIER, "Expect superclass name.");
			superclass = new Expr.Variable(previous());
		}
		
		consume(LEFT_BRACE, "Expect '{' before class body.");

		List<Stmt.Function> methods = new ArrayList<>();
		while (!check(RIGHT_BRACE) && !isAtEnd()) {
			methods.add(function("method"));
		}

		consume(RIGHT_BRACE, "Expect '}' after class body.");

		// 替换
		// return new Stmt.Class(name, methods);
		return new Stmt.Class(name, superclass, methods);
	}
	```
8. If we didn’t parse a superclass clause, the superclass expression will be null. We’ll have to make sure the later passes check for that. The first of those is the resolver。
9. Resolver 需要检查是否有继承，如果有且不是继承它自己，那就 resolve 超类语句
	```java
	// Resolver.java

	@Override
    public Void visitClassStmt(Stmt.Class stmt) {
        ClassType enclosingClass = currentClass;
        currentClass = ClassType.CLASS;

        declare(stmt.name);
        define(stmt.name);

        // 新增
        if (stmt.superclass != null && stmt.name.lexeme.equals(stmt.superclass.name.lexeme)) {
            Lox.error(stmt.superclass.name, "A class can't inherit from itself.");
        }
        if (stmt.superclass != null) {
            resolve(stmt.superclass);
        }

        beginScope();
        scopes.peek().put("this", true);

        for (Stmt.Function method : stmt.methods) {
            FunctionType declaration = FunctionType.METHOD;
            if (method.name.lexeme.equals("init")) {
                declaration = FunctionType.INITIALIZER;
            }
            resolveFunction(method, declaration); 
        }

        endScope();

        currentClass = enclosingClass;
        return null;
    }
	```
10. 然后进入解释器。如果该类有超类表达式，我们会对其进行求值。由于该表达式可能会求值为其他类型的对象，因此我们必须在运行时检查我们想要作为超类的对象是否实际上是一个类
	```java
	// Interpreter.java

	@Override
    public Void visitClassStmt(Stmt.Class stmt) {
		// 新增
        Object superclass = null;
        if (stmt.superclass != null) {
            superclass = evaluate(stmt.superclass);
            if (!(superclass instanceof LoxClass)) {
                throw new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }

        environment.define(stmt.name.lexeme, null);

        Map<String, LoxFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            LoxFunction function = new LoxFunction(method, environment, 
                                                    method.name.lexeme.equals("init"));
            methods.put(method.name.lexeme, function);
        }

        LoxClass klass = new LoxClass(stmt.name.lexeme, methods);

        environment.assign(stmt.name, klass);
        return null;
    }
	```
11. 执行类声明会将类的语法表示（其 AST 节点）转换为其运行时表示，即 LoxClass 对象。我们也需要将超类与此联系起来。我们再更新 `visitClassStmt`，将超类传递给构造函数
```java
	// Interpreter.java
	
	@Override
    public Void visitClassStmt(Stmt.Class stmt) {
        Object superclass = null;
        if (stmt.superclass != null) {
            superclass = evaluate(stmt.superclass);
            if (!(superclass instanceof LoxClass)) {
                throw new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }

        environment.define(stmt.name.lexeme, null);

        Map<String, LoxFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            LoxFunction function = new LoxFunction(method, environment, 
                                                    method.name.lexeme.equals("init"));
            methods.put(method.name.lexeme, function);
        }

		// 替换
        // LoxClass klass = new LoxClass(stmt.name.lexeme, methods);
        LoxClass klass = new LoxClass(stmt.name.lexeme, (LoxClass)superclass, methods);

        environment.assign(stmt.name, klass);
        return null;
    }
	```
12. 相应的，更新 `LoxClass` 构造函数
	```java
	// LoxClass

	LoxClass(String name, LoxClass superclass, Map<String, LoxFunction> methods) {
		this.name = name;
		this.superclass = superclass;
		this.methods = methods;
	}
	```


## Inheriting Methods
1. Inheriting from another class means that everything that’s true of the superclass should be true, more or less, of the subclass. 
2. In statically typed languages, that carries a lot of implications. The subclass must also be a subtype, and the memory layout is controlled so that you can pass an instance of a subclass to a function expecting a superclass and it can still access the inherited fields correctly.
3. Lox 是一种动态类型语言，所以我们的要求要简单得多。基本上，这意味着如果您可以在超类的实例上调用某个方法，那么在给定子类的实例时，您应该能够调用该方法。换句话说，方法是从超类继承的。
4. 我们只需要在查找方法的时候到超类也找一下
	```java
	// LoxClass

	LoxFunction findMethod(String name) {
		if (methods.containsKey(name)) {
			return methods.get(name);
		}

		if (superclass != null) {
			return superclass.findMethod(name);
		}
		
		return null;
	}
	```


## Calling Superclass Methods
1. 根据上面新的 `findMethod`  方法，子类默认会覆盖超类的同名方法。但有时我们在子类中使用和超类同名，的方法时，并不是想完全覆盖，只是想实现子类自己的一个独特的方法，然后也想要继续需要使用父类中的那个同名方法。
2. 我们将通过 `super` 关键字来调用父类方法
	```js
	class Doughnut {
		cook() {
			print "Fry until golden brown.";
		}
	}

	class BostonCream < Doughnut {
		cook() {
			super.cook();
			print "Pipe full of custard and coat with chocolate.";
		}
	}

	BostonCream().cook();
	// Fry until golden brown.
	// Pipe full of custard and coat with chocolate.
	```

### Syntax
1. `primary` 的 rule 改成
	```
	primary        → "true" | "false" | "nil" | "this"
					| NUMBER | STRING
					| "(" expression ")"
					| IDENTIFIER
					| "super" "." IDENTIFIER ;
	```
2. 完整的表达式 rule
    ```
    expression     → assignment ;

    assignment     → ( call "." )? IDENTIFIER "=" assignment
                    | logic_or ;

	logic_or       → logic_and ( "or" logic_and )* ;

	logic_and      → equality ( "and" equality )* ;

    equality       → comparison ( ( "!=" | "==" ) comparison )* ;

    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;

    term           → factor ( ( "-" | "+" ) factor )* ;

    factor         → unary ( ( "/" | "*" ) unary )* ;

	unary          → ( "!" | "-" ) unary | call ;

    call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;

    primary        → "true" | "false" | "nil" | "this"
					| NUMBER | STRING
					| "(" expression ")"
					| IDENTIFIER
					| "super" "." IDENTIFIER ;

	arguments      → expression ( "," expression )* ;
	
	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
3. Typically, a `super` expression is used for a method call, but, as with regular methods, the argument list is not part of the expression. Instead, a super *call* is a super *access* followed by a function call. 看起来的意思是说调用还是属于父类的具体方法，`super.IDENTIFIER` 本身不能算是方法，所以参数不属于这部分。
4. So the super expression itself contains only the token for the super keyword and the name of the method being looked up. 增加语法树节点
	```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Expr", Arrays.asList(
		"Assign   : Token name, Expr value",
		"Binary   : Expr left, Token operator, Expr right",
		"Call     : Expr callee, Token paren, List<Expr> arguments",
		"Get      : Expr object, Token name",
		"Grouping : Expr expression",
		"Literal  : Object value",
		"Set      : Expr object, Token name, Expr value",
		"Logical  : Expr left, Token operator, Expr right",
		"Super    : Token keyword, Token method",
		"This     : Token keyword",
		"Unary    : Token operator, Expr right",
		"Variable : Token name"
	));
	```
	生成的 `super` 表达式类
	```java
	// Expr.java

	static class Super extends Expr {
		Super(Token keyword, Token method) {
			this.keyword = keyword;
			this.method = method;
		}

		@Override
		<R> R accept(Visitor<R> visitor) {
			return visitor.visitSuperExpr(this);
		}

		final Token keyword;
		final Token method;
	}
	```
5. Parser 中 `primary` 方法新增解析 `super`
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
        if (match(SUPER)) {
            Token keyword = previous();
            consume(DOT, "Expect '.' after 'super'.");
            Token method = consume(IDENTIFIER, "Expect superclass method name.");
            return new Expr.Super(keyword, method);
        }

        if (match(THIS)) return new Expr.This(previous());

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

### Semantics
TODO

### Invalid uses of super



##  1. <a name='References'></a>References
* [*Crafting interpreters*: Inheritance](https://craftinginterpreters.com/inheritance.html)
