# Classes


<!-- vscode-markdown-toc -->
* 1. [OOP and Classes](#OOPandClasses)
* 2. [Class Declarations](#ClassDeclarations)
	* 2.1. [Get expressions](#Getexpressions)
* 3. [Methods on Classes](#MethodsonClasses)
* 4. [This](#This)
	* 4.1. [实现 `this`](#this)
	* 4.2. [Invalid uses of `this`](#Invalidusesofthis)
* 5. [Constructors and Initializers](#ConstructorsandInitializers)
	* 5.1. [Invoking `init()` directly](#Invokinginitdirectly)
	* 5.2. [Returning from `init()`](#Returningfrominit)
* 6. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->



##  1. <a name='OOPandClasses'></a>OOP and Classes
1. There are three broad paths to object-oriented programming: classes, prototypes, and multimethods. 我们将使用类来实现面向对象。
2. The main goal is to bundle data with the code that acts on it. Users do that by declaring a class that:
    1. Exposes a constructor to create and initialize new instances of the class
    2. Provides a way to store and access fields on instances
    3. Defines a set of methods shared by all instances of the class that operate on each instances’ state.
3. 图示
    <img src="../../images/circle.png" width="300" style="display: block; margin: 5px 0 10px;" />



##  2. <a name='ClassDeclarations'></a>Class Declarations
1. class 引入一个新语句，我们更新语句 grammar
    ```
    program        → declaration* EOF ;

    declaration    → classDecl
                    | funDecl
					| varDecl
                    | statement ;

    classDecl      → "class" IDENTIFIER "{" function* "}" ;

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
2. 增加语句节点
    ```java
    // tool/GenerateAst.java

    defineAst(outputDir, "Stmt", Arrays.asList(
        "Block      : List<Stmt> statements",
        "Class      : Token name, List<Stmt.Function> methods",
        "Expression : Expr expression",
        "Function   : Token name, List<Token> params, List<Stmt> body",
        "If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
        "Print      : Expr expression",
        "Return     : Token keyword, Expr value",
        "Var        : Token name, Expr initializer",
        "While      : Expr condition, Stmt body"
    ));
    ```
    生成的 class 语句类
    ```java
    // Stmt.java

    static class Class extends Stmt {
        Class(Token name, List<Stmt.Function> methods) {
            this.name = name;
            this.methods = methods;
        }

        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitClassStmt(this);
        }

        final Token name;
        final List<Stmt.Function> methods;
    }
    ```
3. 简单来说，类声明就是：`class` 关键字，后面跟着类名，然后是花括号内的主体；主体内是方法声明列表，与函数声明不同，方法没有前导关键字 `fun`；每个方法都包含一个名称、参数列表和主体。
4. 下面是一个示例
    ```js
    class Breakfast {
        cook() {
            print "Eggs a-fryin'!";
        }

        serve(who) {
            print "Enjoy your breakfast, " + who + ".";
        }
    }
    ```
5. 与大多数动态类型语言一样，字段未在类声明中明确列出。实例是松散的数据包，您可以使用普通命令式代码随意向其中添加字段。

### Parse
类可以出现在允许命名声明的任何地方，由前导 `class` 关键字触发
```java
// Parser.java

private Stmt declaration() {
    try {
        if (match(CLASS)) return classDeclaration();
        if (match(FUN)) return function("function");
        if (match(VAR)) return varDeclaration();

        return statement();
    } catch (ParseError error) {
        synchronize();
        return null;
    }
}

private Stmt classDeclaration() {
    Token name = consume(IDENTIFIER, "Expect class name.");
    consume(LEFT_BRACE, "Expect '{' before class body.");

    List<Stmt.Function> methods = new ArrayList<>();
    while (!check(RIGHT_BRACE) && !isAtEnd()) {
        methods.add(function("method"));
    }

    consume(RIGHT_BRACE, "Expect '}' after class body.");

    return new Stmt.Class(name, methods);
}
```

### Resolve
暂时如下
```java
// Resolver.java

@Override
public Void visitClassStmt(Stmt.Class stmt) {
    declare(stmt.name);
    define(stmt.name);
    return null;
}
```

### Interpret
1. 将类声明为局部变量并不常见，但 Lox 允许这样做。所以在解释类声明语句时要考虑它所在的作用域
    ```java
    // Interpreter.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        environment.define(stmt.name.lexeme, null);
        LoxClass klass = new LoxClass(stmt.name.lexeme);
        environment.assign(stmt.name, klass);
        return null;
    }
    ```
2. 现在当前环境声明类的名称，然后把这个类的语法树节点转换为类的运行时表示 `LoxClass`，再把这个运行时表示和刚声明类名绑定。
3. 之所以没有在声明的时候没有直接把运行时表示作为 `define` 第二个参数而是选择之后赋值，是因为这样就可以在 `new LoxClass` 的时候访问到声明的类名，这样就可以在类的方法中引用当前类本身。

### LoxClass
暂时如下
```java
// lox/LoxClass.java

package com.craftinginterpreters.lox;

import java.util.List;
import java.util.Map;

class LoxClass {
    final String name;

    LoxClass(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
```


## Creating Instances
1. Lox doesn’t have “static” methods that you can call right on the class itself, so without actual instances, classes are useless. Thus instances are the next step.
2. 不同语言创建实例的语法并不相同，这里我们使用简单的语法，直接对类名使用调用表达式创建实例。这样我们不用引入像 `new` 这样新的语法，可以跳过前端直接进入运行时。示例
    ```js
    class Bagel {}
    Bagel();
    ```
3. 如果我们现在直接运行上面的代码，会得到一个运行时错误，因为解释调用表达式的 `visitCallExpr` 要求被调用的对象必须实现了 `LoxCallable`
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

        if (arguments.size() != function.arity()) {
            throw new RuntimeError(expr.paren, "Expected " +
                function.arity() + " arguments but got " +
                arguments.size() + ".");
        }

        return function.call(this, arguments);
    }
    ```
4. 所以我们修改一下 `LoxClass`
    ```java
    // lox/LoxClass.java

    class LoxClass implements LoxCallable
    ```
5. 为了实现 `LoxCallable`，`LoxClass` 需要定义这两个方法
    ```java
    // LoxClass.java

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        LoxInstance instance = new LoxInstance(this);
        return instance;
    }

    @Override
    public int arity() {
        return 0;
    }
    ```
6. 根据 `arity` 的定义，现在我们不能传递任何参数。当我们讨论用户定义的构造函数时，我们会重新讨论这一点。
7. 新建 `LoxInstance` 类
    ```java
    // lox/LoxInstance.java

    package com.craftinginterpreters.lox;

    import java.util.HashMap;
    import java.util.Map;

    class LoxInstance {
        private LoxClass klass;

        LoxInstance(LoxClass klass) {
            this.klass = klass;
        }

        @Override
        public String toString() {
            return klass.name + " instance";
        }
    }
    ```


## Properties on Instances
1. Lox follows JavaScript and Python in how it handles state. Every instance is an open collection of named values. 
2. Methods on the instance’s class can access and modify properties, but so can outside code. 
3. Properties are accessed using a `.` syntax. That dot has the same precedence as the parentheses in a function `call` expression, 把 `call` 表达式规则从
    ```
    call           → primary ( "(" arguments? ")" )* ;
    ```
    改成
    ```
    call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
    ```
4. 新的完整的表达式 grammar
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

    call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;

    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;

	arguments      → expression ( "," expression )* ;
	
	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
5. After a primary expression, we allow a series of any mixture of parenthesized calls and dotted property accesses. 
6. “Property access” is a mouthful, so from here on out, we’ll call these “get expressions”.

###  2.1. <a name='Getexpressions'></a>Get expressions
1. 新增 Get 表达式的语法树节点
    ```java
	// tool/GenerateAst.java

	defineAst(outputDir, "Expr", Arrays.asList(
		"Assign   : Token name, Expr value",
		"Binary   : Expr left, Token operator, Expr right",
		"Call     : Expr callee, Token paren, List<Expr> arguments",
        "Get      : Expr object, Token name",
		"Grouping : Expr expression",
		"Literal  : Object value",
		"Logical  : Expr left, Token operator, Expr right",
		"Unary    : Token operator, Expr right",
		"Variable : Token name"
	));
	```
    生成的 `Get` 表达式类
	```java
	// Expr.java

	static class Get extends Expr {
        Get(Expr object, Token name) {
            this.object = object;
            this.name = name;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitGetExpr(this);
        }
    
        final Expr object;
        final Token name;
    }
	```
2. `Parser` 中的 `call` 方法新增匹配 DOT 的分支
    ```java
    // Parser.java

    private Expr call() {
        Expr expr = primary();

        while (true) { 
            if (match(LEFT_PAREN)) {
                expr = finishCall(expr);
            } 
            else if (match(DOT)) {
                Token name = consume(IDENTIFIER, "Expect property name after '.'.");
                expr = new Expr.Get(expr, name);
            }
            else {
                break;
            }
        }

        return expr;
    }
    ```
3. `Resolver` 增加对 `Get` 节点的 resolve 方法
    ```java
    // Resolver.java

    @Override
    public Void visitGetExpr(Expr.Get expr) {
        resolve(expr.object);
        return null;
    }
    ```
4. 可以看到只 resolve 的对象（`expr.object`）而没有 resolve 属性（`expr.name`），由于属性是动态查找的（不是词法的），因此它们不会被 resolve。在 resolve 过程中，我们只递归到 dot 左侧的表达式。
5. 解释方法
    ```java
    // Interpreter.java

    @Override
    public Object visitGetExpr(Expr.Get expr) {
        Object object = evaluate(expr.object);
        if (object instanceof LoxInstance) {
            return ((LoxInstance) object).get(expr.name);
        }

        throw new RuntimeError(expr.name, "Only instances have properties.");
    }
    ```
6. 上面的解释方法中，我们首先对属性所在的对象求值。在 Lox 中，只有类的实例才具有属性。如果对象是其他类型（例如数字），则在其上调用 getter 会导致运行时错误。
7. 如果对象是 `LoxInstance` 实例，那么我们在它上面查找属性。我们给 `LoxInstance` 增加需要的内容
    ```java
    class LoxInstance {
        private LoxClass klass;
        // 新增
        private final Map<String, Object> fields = new HashMap<>();

        LoxInstance(LoxClass klass) {
            this.klass = klass;
        }

        // 新增
        Object get(Token name) {
            if (fields.containsKey(name.lexeme)) {
                return fields.get(name.lexeme);
            }
        
            throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.");
        }

        @Override
        public String toString() {
            return klass.name + " instance";
        }
    }
    ```

### Set expressions
1. 我们把赋值表达式的 grammar 规则从
    ```
    assignment     → IDENTIFIER "=" assignment
                    | logic_or ;
    ```
    改为
    ```
    assignment     → ( call "." )? IDENTIFIER "=" assignment
                    | logic_or ;
    ```
2. 新的完整的表达式 grammar
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

    primary        → "true" | "false" | "nil"
                    | NUMBER | STRING
                    | "(" expression ")"
                    | IDENTIFIER ;

	arguments      → expression ( "," expression )* ;
	
	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
3. 新增 Set 的语法树节点
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
            "Unary    : Token operator, Expr right",
            "Variable : Token name"
    ));
    ```
    生成的 Set 表达式类
    ```java
    static class Set extends Expr {
        Set(Expr object, Token name, Expr value) {
            this.object = object;
            this.name = name;
            this.value = value;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitSetExpr(this);
        }
    
        final Expr object;
        final Token name;
        final Expr value;
    }
    ```
4. 修改赋值表达式的解析方法
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
            else if (expr instanceof Expr.Get) {
                Expr.Get get = (Expr.Get)expr;
                return new Expr.Set(get.object, get.name, value);
            }
        
            error(equals, "Invalid assignment target."); 
        }

        return expr;
    }
    ```
5. resolve 赋值表达式的方法
    ```java
    // Resolver.java

    @Override
    public Void visitSetExpr(Expr.Set expr) {
        resolve(expr.value);
        resolve(expr.object);
        return null;
    }
    ```
    和 `Expr.Get` 一样，属性是动态求值的，所以不用 resolve `expr.name`
6. 解释方法
    ```java
    // Interpreter.java
    
    @Override
    public Object visitSetExpr(Expr.Set expr) {
        Object object = evaluate(expr.object);

        if (!(object instanceof LoxInstance)) { 
            throw new RuntimeError(expr.name, "Only instances have fields.");
        }

        Object value = evaluate(expr.value);
        ((LoxInstance)object).set(expr.name, value);
        return value;
    }
    ```
7. 给 `LoxInstance` 增加 `set` 方法
    ```java
    // LoxInstance.java

    void set(Token name, Object value) {
        fields.put(name.lexeme, value);
    }
    ```
    由于 Lox 允许在实例上自由创建新字段，因此无需查看键是否已存在。


##  3. <a name='MethodsonClasses'></a>Methods on Classes
1. We’re already parsing the method declarations inside the class body, so the next step is to resolve them
    ```java
    // Resolver.java

    Override
    public Void visitClassStmt(Stmt.Class stmt) {
        declare(stmt.name);
        define(stmt.name);

        for (Stmt.Function method : stmt.methods) {
            FunctionType declaration = FunctionType.METHOD;
            resolveFunction(method, declaration); 
        }

        return null;
    }
    ```
2. 为此枚举类型 `FunctionType` 增加值 `METHOD`
    ```java
    // Resolver.java

    private enum FunctionType {
        NONE,
        FUNCTION,
        METHOD
    }
    ```
3. 解释方法，给 `LoxClass` 传入方法列表
    ```java
    // Interpreter.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        environment.define(stmt.name.lexeme, null);
        
        // LoxClass klass = new LoxClass(stmt.name.lexeme);
        Map<String, LoxFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            LoxFunction function = new LoxFunction(method, environment);
            methods.put(method.name.lexeme, function);
        }

        LoxClass klass = new LoxClass(stmt.name.lexeme, methods);

        environment.assign(stmt.name, klass);
        return null;
    }
    ```
4. 修改 `LoxClass` 类
    ```java
    // LoxClass.java

    private final Map<String, LoxFunction> methods;

    LoxClass(String name, Map<String, LoxFunction> methods) {
        this.name = name;
        this.methods = methods;
    }
    ```
5. 实例存储状态，而类存储行为。`LoxInstance` 有字段映射，`LoxClass` 有方法映射。即使方法归类所有，它们仍可通过该类的实例访问。所以 `LoxInstance` 的 `get` 方法也要访问到类的方法
    ```java
    // LoxInstance.java

    Object get(Token name) {
        if (fields.containsKey(name.lexeme)) {
            return fields.get(name.lexeme);
        }

        LoxFunction method = klass.findMethod(name.lexeme);
        if (method != null) return method;

        throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.");
    }
    ```
6. 但仍然是通过类的 `findMethod` 方法来查找类
    ```java
    // LoxClass.java

    LoxFunction findMethod(String name) {
        if (methods.containsKey(name)) {
            return methods.get(name);
        }

        return null;
    }
    ```

##  4. <a name='This'></a>This
1. 上面解释类的方法时，有一个边缘情况需要考虑
    ```js
    class Person {
        sayName() {
            print this.name;
        }
    }

    var jane = Person();
    jane.name = "Jane";

    var bill = Person();
    bill.name = "Bill";

    bill.sayName = jane.sayName;
    bill.sayName(); // ?
    ```
2. 在 Lua 和 JavaScript 中会打印出 "Bill"，这些语言并没有真正的方法，有的只是存储在字段中的函数。
3. Lox 有真正的类语法，它可以区分方法和函数，we will have methods “bind” `this` to the original instance when the method is first grabbed.
4. 目前，我们可以在对象上定义行为和状态，但它们尚未绑定在一起。在方法内部，我们无法访问当前对象（即调用该方法的实例）的字段，也无法调用同一对象上的其他方法。
5. Inside a method body, a `this` expression evaluates to the instance that the method was called on. Or, more specifically, since methods are accessed and then invoked as two steps, it will refer to the object that the method was *accessed* from. 
6. 那看起来，就上面的例子来说，`jane.sayName` 是访问（access）实例 `jane` 的 `sayName` 方法；而 `bill.sayName()` 是调用（invoke）实例 `jane` 的 `sayName` 方法，不是调用实例 `bill` 的 `sayName` 方法。
7. 再看下面的例子
    ```js
    class Egotist {
        speak() {
            print this;
        }
    }

    var method = Egotist().speak;
    method();
    ```
8. `Egotist().speak` 是引用 `Egotist` 类的实例的 `speak` 方法，这个方法因为是定义在这个实例上的，所以它里面的 `this` 就永远指向这个实例。现在这个方法被变量 `method` 引用，然后以看起来像函数方式调用，但它实际上还是那个实例的方法。
9. We need to take `this` at the point that the method is accessed and attach it to the function somehow so that it stays around as long as we need it to. 也就是说，在 `Egotist().speak`，需要记住它里面的 `this` 是指向 `Egotist()` 返回的那个实例的。
10. 再看这个例子
    ```js
    class Cake {
        taste() {
            var adjective = "delicious";
            print "The " + this.flavor + " cake is " + adjective + "!";
        }
    }

    var cake = Cake();
    cake.flavor = "German chocolate";
    cake.taste(); // Prints "The German chocolate cake is delicious!".
    ```
11. 当我们第一次对类定义求值时，我们为 `taste()` 方法创建一个 `LoxFunction` 实例，并把它的闭包设置为类所在的环境，在本例中是全局环境。
    ```java
    // Interpreter.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        environment.define(stmt.name.lexeme, null);

        Map<String, LoxFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            LoxFunction function = new LoxFunction(method, environment);
            methods.put(method.name.lexeme, function);
        }

        LoxClass klass = new LoxClass(stmt.name.lexeme, methods);

        environment.assign(stmt.name, klass);
        return null;
    }
    ```
12. 类里面的 `methods` 保存了 `taste` 方法名到 `LoxFunction` 实例的映射。这个 `LoxFunction` 实例的闭包的指向如下图
    <img src="../../images/method_closure.png" width="600" style="display: block; margin: 5px 0 10px;" />
    全局环境中有 `Cake` 类和它的实例 `cake`，`taste` 方法的闭包指向这个全局环境。
13. 然后，当我们通过 `get` 表达式对 `cake.taste` 求值时，给这个 `taste` 进行了一个 `bind` 操作，传参 `this`
    ```java
    // LoxInstance.java

    Object get(Token name) {
        if (fields.containsKey(name.lexeme)) {
            return fields.get(name.lexeme);
        }

        LoxFunction method = klass.findMethod(name.lexeme);
        if (method != null) return method.bind(this);
    
        throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.");
    }
    ```
14. 再看 `bind` 方法
    ```java
    // LoxFunction.java

    LoxFunction bind(LoxInstance instance) {
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        return new LoxFunction(declaration, environment);
    }
    ```
15. 它先用 `closure`（也就是本例中的全局环境）创建一个新环境，在这个新环境里定义一个 `this`。
16. 然后，它又新建了一个函数对象。因为 `bind` 是作为 `taste` 的方法调用的，也就是说 `bind` 是 `taste` 这个函数实例的方法，那么此时 `taste` 里的 `declaration` 就是这个 `taste` 的方法声明语句对象。
17. 那么，此时 `new LoxFunction` 新建的这个函数或者说方法，它本身是和 `taste` 方法一样的，因为它们的第一个参数是一样的。那再看看第二个参数，也就是它们的 `closure` 指向。
18. 原本的 `taste` 方法的 `closure` 指向上面你已经说了，指向全局环境；`bind` 返回的这个函数的 `closure` 指向新创建的那个环境，这个新环境并不是全局环境，这个新环境的父级才是全局环境，因为 `Environment environment = new Environment(closure);`，`Environment` 的参数是新创建环境的父级，而参数此时 `closure` 就是全局环境。
19. 也就是说，新创建的函数的 `closure` 指向新创建的那个环境，而这个新创建的环境的父级是全局环境。
20. 当新建的函数被调用时，它内部没有 `this` 的定义，所以它到它的闭包里去找。它的闭包就是那个新建的环境，这个环境里定义了 `this`，这个 `this` 的指向是 `bind` 参数指向的对象，而这个对象就是 `method.bind(this)` 的那个 `this`。目前我们还没实现解释这个 `this`，但根据我们对 `this` 的需求，它需要是 `cake` 这个实例。
    <img src="../../images/call.png" width="600" style="display: block; margin: 5px 0 10px;" />
    不知道这个图为什么没画原本的 `taste` 方法，就是 `closure` 指向全局环境的那个。难道是因为用不上所以会被删除或者垃圾回收？

###  4.1. <a name='this'></a>实现 `this`
1. `primary` 的 rule 改成
	```
	primary        → "true" | "false" | "nil" | "this"
					| NUMBER | STRING
					| "(" expression ")"
					| IDENTIFIER ;
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
                    | IDENTIFIER ;

	arguments      → expression ( "," expression )* ;
	
	parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
    ```
1. 新增 `this` 表达式节点
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
            "This     : Token keyword",
            "Unary    : Token operator, Expr right",
            "Variable : Token name"
    ));
    ```
    生成的表达式类
    ```java
    // Expr.java

    static class This extends Expr {
        This(Token keyword) {
            this.keyword = keyword;
        }
    
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitThisExpr(this);
        }
    
        final Token keyword;
    }
    ```
2. Parse
    ```java
    // Parser.java

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
        f (match(THIS)) return new Expr.This(previous());
        
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
3. Resolve `this` 表达式
    ```java
    // Resolver.java

    @Override
    public Void visitThisExpr(Expr.This expr) {
        resolveLocal(expr, expr.keyword);
        return null;
    }
    ```
4. 可以看到，resolve `this` 表达式也用了 `resolveLocal`，也就是说和 resolve 一般变量一样的。我们把 `this` 就当做一个变量名。
5. 上面的 `visitThisExpr` 是 resolve `this` 表达式的读取，下面 resolve 它的“声明”。在 resolve 方法声明之前，我们要为 `this` 新建一层作用域
    ```java
    // Resolver.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        declare(stmt.name);
        define(stmt.name);

        beginScope();
        scopes.peek().put("this", true);

        for (Stmt.Function method : stmt.methods) {
            FunctionType declaration = FunctionType.METHOD;
            resolveFunction(method, declaration); 
        }

        endScope();

        return null;
    }
    ```
6. Now, whenever a this expression is encountered, it will resolve to a “local variable” defined in an implicit scope just outside of the block for the method body.
7. The resolver has a new *scope* for this, so the interpreter needs to create a corresponding *environment* for it. Remember, we always have to keep the resolver’s scope chains and the interpreter’s linked environments in sync with each other. 
8. At runtime, we create the environment after we find the method on the instance. 上面讲解原理已时经展示了需要的这两个方法
    ```java
    // LoxInstance.java

    Object get(Token name) {
        if (fields.containsKey(name.lexeme)) {
            return fields.get(name.lexeme);
        }

        LoxFunction method = klass.findMethod(name.lexeme);
        if (method != null) return method.bind(this);
    
        throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.");
    }
    ```
    ```java
    // LoxFunction.java

    LoxFunction bind(LoxInstance instance) {
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        return new LoxFunction(declaration, environment);
    }
    ```
9. 解释 `this`
    ```java
    @Override
    public Object visitThisExpr(Expr.This expr) {
        return lookUpVariable(expr.keyword, expr);
    }
    ```
10. TODO，`if (method != null) return method.bind(this);` 这一行的里面的 `this` 是什么时候定义它的值的？

###  4.2. <a name='Invalidusesofthis'></a>Invalid uses of `this`
1. `this` 只能出现在方法中。所以在 resolve 过程中我们要检查 `this` 是否出现在方法声明过程中。
2. 和检查是函数还是方法时使用了枚举类型 `FunctionType` 一样，这里我们也定义枚举类型 `ClassType`（之后还会再增加枚举值）
    ```java
    // Resolver.java

    private ClassType currentClass = ClassType.NONE;

    private enum ClassType {
        NONE,
        CLASS
    }
    ```
3. 现在我们 resolve 类声明的时候，就把表示当前类型的 `currentClass` 设置为 `ClassType.CLASS`，表示是在类声明环境，可以使用 `this`
    ```java
    // Resolver.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        ClassType enclosingClass = currentClass;
        currentClass = ClassType.CLASS;

        declare(stmt.name);
        define(stmt.name);

        beginScope();
        scopes.peek().put("this", true);

        for (Stmt.Function method : stmt.methods) {
            FunctionType declaration = FunctionType.METHOD;
            resolveFunction(method, declaration); 
        }

        endScope();

        currentClass = enclosingClass;
        return null;
    }
    ```
4. 然后，具体 resolve `this` 的时候，就检查当前是否是在类声明中
    ```java
    // Resolver.java

    @Override
    public Void visitThisExpr(Expr.This expr) {
        if (currentClass == ClassType.NONE) {
            Lox.error(expr.keyword, "Can't use 'this' outside of a class.");
            return null;
        }

        resolveLocal(expr, expr.keyword);
        return null;
    }
    ```


##  5. <a name='ConstructorsandInitializers'></a>Constructors and Initializers
1. `LoxClass` 的 `call` 方法增加调用构造函数的内容
    ```java
    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        LoxInstance instance = new LoxInstance(this);

        LoxFunction initializer = findMethod("init");
        if (initializer != null) {
            initializer.bind(instance).call(interpreter, arguments);
        }
        
        return instance;
    }
    ```
2. 之前我们表示形参数量的 `arity` 一直返回 0，现在要根据构造函数的形参数量来决定了
    ```java
    @Override
    public int arity() {
        LoxFunction initializer = findMethod("init");
        if (initializer == null) return 0;
        return initializer.arity();
    }
    ```

###  5.1. <a name='Invokinginitdirectly'></a>Invoking `init()` directly
1. 直接调用 `init` 方法也应该返回 `this`。例如
    ```js
    class Foo {
        init() {
            this.name = "33";
        }
    }

    var foo = Foo();
    var initFn = foo.init;
    var bar = initFn();
    print bar.name; // "33"
    ```
2. 所以，在调用一个函数或者方法时，我们要判断当前是否是类的构造函数，如果是的话，就返回 `this`
    ```java
    // LoxFunction.js

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

        // 新增
        if (isInitializer) return closure.getAt(0, "this");

        return null;
    }
    ```
3. 这里我们引入了新的字段 `isInitializer`
    ```java
    // LoxFunction.js

    private final boolean isInitializer;

    LoxFunction(Stmt.Function declaration, Environment closure, boolean isInitializer) {
        this.isInitializer = isInitializer;
        this.closure = closure;
        this.declaration = declaration;
    }
    ```
    每次创建一个函数时，都要通过第三个参数来说明是否是构造函数。
4. 这里我们并没有简单的通过函数名是否是 `init` 来判断是否构造函数，因为我们允许用户创建名为 `init` 的函数。
5. 然后我们在创建 `LoxFunction` 的三个地方加上第三个参数
    ```java
    // Interpreter.java

    @Override
    public Void visitFunctionStmt(Stmt.Function stmt) {
        // LoxFunction function = new LoxFunction(stmt, environment);
        LoxFunction function = new LoxFunction(stmt, environment, false);
        environment.define(stmt.name.lexeme, function);
        return null;
    }

    public Void visitClassStmt(Stmt.Class stmt) {
        environment.define(stmt.name.lexeme, null);

        Map<String, LoxFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            // LoxFunction function = new LoxFunction(method, environment);
            LoxFunction function = new LoxFunction(method, environment, 
                                                    method.name.lexeme.equals("init"));
            methods.put(method.name.lexeme, function);
        }

        LoxClass klass = new LoxClass(stmt.name.lexeme, methods);

        environment.assign(stmt.name, klass);
        return null;
    }
    ```
    ```java
    // LoxFunction.java

    LoxFunction bind(LoxInstance instance) {
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        // return new LoxFunction(declaration, environment);
        return new LoxFunction(declaration, environment, isInitializer);
    }
    ```

###  5.2. <a name='Returningfrominit'></a>Returning from `init()`
1. 我们不允许 `init` 方法返回值。例如不允许
    ```js
    class Foo {
        init() {
            return this;
        }
    }
    ```
    但是允许空的返回
    ```js
    class Foo {
        init() {
            return;
        }
    }
    ```
2. 所以在我们 resolve 返回值的时候，要看当前是否是构造函数。
3. 我们给枚举类型 `FunctionType` 新加一个值 `INITIALIZER`
    ```java
    // Resolver.java

    private enum FunctionType {
        NONE,
        FUNCTION,
        INITIALIZER,
        METHOD
    }
    ```
4. 然后，在我们声明类里面的方法时，如果当前方法是 `init`，我们则注明当前方法类型是 `INITIALIZER`
    ```java
    // Resolver.java

    @Override
    public Void visitClassStmt(Stmt.Class stmt) {
        ClassType enclosingClass = currentClass;
        currentClass = ClassType.CLASS;

        declare(stmt.name);
        define(stmt.name);

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
5. 之后如果在 resolve `return` 的时候发现有返回值并且是 `init` 方法，则报错
    ```java
    // Resolver.java

    @Override
    public Void visitReturnStmt(Stmt.Return stmt) {
        if (currentFunction == FunctionType.NONE) {
            Lox.error(stmt.keyword, "Can't return from top-level code.");
        }

        if (stmt.value != null) {
            if (currentFunction == FunctionType.INITIALIZER) {
                Lox.error(stmt.keyword, "Can't return a value from an initializer.");
            }
            
            resolve(stmt.value);
        }

        return null;
    }
    ```
6. 另外，我们允许 `init` 有空的返回，所以在解释阶段，`call` 方法中设置返回值的地方，判断如果是 `init` 就返回 `this`。此时已经是解释阶段了，`init` 如果还有 `return` 就只能空 `return` 了，resolve 阶段已经检查过不合理的非空 return
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
            // 新增
            if (isInitializer) return closure.getAt(0, "this");
            
            return returnValue.value;
        }

        if (isInitializer) return closure.getAt(0, "this");

        return null;
    }
    ```


##  6. <a name='References'></a>References
* [*Crafting interpreters*: Classes](https://craftinginterpreters.com/classes.html)
