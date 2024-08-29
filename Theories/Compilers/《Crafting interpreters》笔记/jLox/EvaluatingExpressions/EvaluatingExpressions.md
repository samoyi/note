# Evaluating Expressions


<!-- vscode-markdown-toc -->
* 1. [Summary](#Summary)
* 2. [Representing Values](#RepresentingValues)
* 3. [Evaluating Expressions](#EvaluatingExpressions)
	* 3.1. [Evaluating literals](#Evaluatingliterals)
	* 3.2. [Evaluating parentheses](#Evaluatingparentheses)
	* 3.3. [Evaluating unary expressions](#Evaluatingunaryexpressions)
	* 3.4. [Evaluating binary operators](#Evaluatingbinaryoperators)
		* 3.4.1. [arithmetic](#arithmetic)
		* 3.4.2. [comparison](#comparison)
		* 3.4.3. [equality](#equality)
* 4. [Runtime Errors](#RuntimeErrors)
	* 4.1. [Detecting runtime errors](#Detectingruntimeerrors)
		* 4.1.1. [一元操作符](#)
		* 4.1.2. [二元操作符](#-1)
* 5. [Hooking Up the Interpreter](#HookingUptheInterpreter)
	* 5.1. [访问者模式在这里的使用](#-1)
	* 5.2. [Reporting runtime errors](#Reportingruntimeerrors)
	* 5.3. [Running the interpreter](#Runningtheinterpreter)
* 6. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Summary'></a>Summary
1. 语言实现有各种各样的方式让计算机执行用户源代码的命令。它们可以将其编译为机器代码，将其翻译成另一种高级语言，或者将其简化为某种字节码格式以供虚拟机运行。
2. 我们这里将采用最简单、最短的方法，也就是执行语法树本身。
3. 目前，我们的解析器仅支持表达式。因此，要执行代码，我们将对表达式求值。对于我们可以解析的每种表达式语法（文字、运算符等），我们需要一段相应的代码，该代码知道如何该树求值。
4. 这设计了两个问题：
    * 我们要产生怎样的值
    * 我们该如何组织这些代码块


##  2. <a name='RepresentingValues'></a>Representing Values
1. 在 Lox 中，值由字面量创建，由表达式计算并存储在变量中。
2. 用户将它们视为 Lox 对象，但它们是用我们编写解释器的语言实现的。这意味着我们要连接 Lox 的动态类型和 Java 的静态类型。
3. Lox 中的变量可以存储任何 (Lox) 类型的值，甚至可以在不同时间点存储不同类型的值。我们可以使用哪种 Java 的 `java.lang.Object` 类型来表示它。
4. In places in the interpreter where we need to store a Lox value, we can use `Object` as the type. Java has boxed versions of its primitive types that all subclass `Object`, so we can use those for Lox’s built-in types
    Lox type      | Java representation
    --|--
    Any Lox value | Object
    `nil`	      | `null`
    Boolean	      | Boolean
    number	      | Double
    string	      | String
5. 给定一个静态类型 `Object` 的值，我们可以使用 Java 的内置 `instanceof` 运算符确定运行时值是数字、字符串还是其他什么。JVM 自己的对象表示方便地为我们提供了实现 Lox 内置类型所需的一切。
6. 我们需要对值进行的另一件事是管理它们的内存，Java 也能做到这一点。


##  3. <a name='EvaluatingExpressions'></a>Evaluating Expressions
1. 接下来，我们需要大量代码来实现每种可以解析的表达式的求值逻辑。我们可以将这些代码以类似方法的形式塞入语法树类中比如称为 `interpret` 的方法中。但更好的方法是，我们可以再次使用访问者模式告诉每个语法树节点 “自己解释”。
2. 创建 `Interpreter` 类
    ```java
    // lox/Interpreter.java

    package com.craftinginterpreters.lox;

    class Interpreter implements Expr.Visitor<Object> {
    }
    ```
3. 这个类声明它是一个访问者。`visit` 方法的返回类型将是 `Object`，这是我们在 Java 代码中用来引用 Lox 值的根类。
4. 为了满足访问者接口，我们需要为解析器生成的四个表达式树类中的每一个定义 `visit` 方法。

###  3.1. <a name='Evaluatingliterals'></a>Evaluating literals
1. 字面量是表达式树的叶节点，是所有其他表达式的语法基本单位。
2. 字面量和值很相似，但也有重要区别。A literal is a bit of syntax that produces a value。字面量总是出现在用户源代码的某个地方，但许多值是由计算产生的，并不存在于代码里。
3. A literal comes from the parser’s domain. Values are an interpreter concept, part of the runtime’s world.
4. 因此，就像我们在解析器中将字面量 token 转换为字面量语法树节点一样，现在我们将字面量树节点转换为运行时值。这很简单
    ```java
    @Override
    public Object visitLiteralExpr(Expr.Literal expr) {
        return expr.value;
    }
    ```
5. 我们在扫描过程中生成了运行时值，并将其加入 token 中。解析器获取该值并将其粘贴到字面量树节点中，因此要对字面量求值，我们只需将其取出来即可。

###  3.2. <a name='Evaluatingparentheses'></a>Evaluating parentheses
1. 括号表达式具有对括号内表达式的内部节点的引用。为了对括号表达式求值，我们递归求值该子表达式并返回它
    ```java
    @Override
    public Object visitGroupingExpr(Expr.Grouping expr) {
        return evaluate(expr.expression);
    }
    private Object evaluate(Expr expr) {
        return expr.accept(this);
    }
    ```
2. `evaluate` 方法将表达式发送回解释器的访问者实例。
3. 有些解析器没有为括号定义树节点。相反，在解析带括号的表达式时，它们只返回内部表达式的节点。我们在 Lox 中为括号创建了一个节点，因为我们稍后需要它来正确处理赋值表达式的左侧。

###  3.3. <a name='Evaluatingunaryexpressions'></a>Evaluating unary expressions
1. 与括号表达式一样，一元表达式也有一个子表达式要先求值。不同之处在于，一元表达式对子表达式求值后还要和运算符进行计算
    ```java
    @Override
    public Object visitUnaryExpr(Expr.Unary expr) {
        Object right = evaluate(expr.right);

        switch (expr.operator.type) {
            case MINUS:
                return -(double)right;
            case BANG:
                return !isTruthy(right);
        }

        // Unreachable.
        return null;
    }
    ```
2. `MINUS` 的操作数必须是数值，因为我们无法静态的确定 `right` 的类型，所以要在对它取反操作前强制转换为数值。
3. 我们定义 Lox 的真值只有 `false` 和 `nil` 两种情况，所以 `isTruthy` 定义如下
    ```java
    private boolean isTruthy(Object object) {
        if (object == null) return false;
        if (object instanceof Boolean) return (boolean)object;
        return true;
    }
    ```

###  3.4. <a name='Evaluatingbinaryoperators'></a>Evaluating binary operators
####  3.4.1. <a name='arithmetic'></a>arithmetic
注意 `PLUS` 可以拼接两个字符串，但此时它的两个操作数必须都是字符串才行
```java
@Override
public Object visitBinaryExpr(Expr.Binary expr) {
    Object left = evaluate(expr.left);
    Object right = evaluate(expr.right); 

    switch (expr.operator.type) {
        case MINUS:
            return (double)left - (double)right;
        case SLASH:
            return (double)left / (double)right;
        case STAR:
            return (double)left * (double)right;
        case PLUS:
            if (left instanceof Double && right instanceof Double) {
                return (double)left + (double)right;
            } 

            if (left instanceof String && right instanceof String) {
                return (String)left + (String)right;
            }
            break;
    }

    // Unreachable.
    return null;
}
```

####  3.4.2. <a name='comparison'></a>comparison
还是在 `visitBinaryExpr` 方法的 `switch` 里
```java
case GREATER:
    return (double)left > (double)right;
case GREATER_EQUAL:
    return (double)left >= (double)right;
case LESS:
    return (double)left < (double)right;
case LESS_EQUAL:
    return (double)left <= (double)right;
```

####  3.4.3. <a name='equality'></a>equality
1. 相等运算和比较运算不同，它支持任何类型的操作数，它不会通过强制转型把操作数作为数值来看
    ```java
    case BANG_EQUAL: return !isEqual(left, right);
    case EQUAL_EQUAL: return isEqual(left, right);
    ```
2. `isEqual` 定义如下
    ```java
    private boolean isEqual(Object a, Object b) {
        if (a == null && b == null) return true;
        if (a == null) return false;

        return a.equals(b);
    }
    ```
3. Lox 不会在相等性比较中进行隐式转换，Java 也不会。我们必须特别处理 `nil`/`null`，以便在尝试调用 `null` 时不会抛出 `NullPointerException`，所以在调用 `a.equals(b)` 之前要先确保 `a` 不是 `null`。
4. 关于 `NaN == NaN` 的问题，IEEE 754 规定 NaN 不等于其自身。In Java, the `==` operator on primitive doubles preserves that behavior, but the `equals()` method on the Double class does not. Lox uses the latter, so doesn’t follow IEEE. 


##  4. <a name='RuntimeErrors'></a>Runtime Errors
1. 每当子表达式生成一个对象并且运算符要求它是数字或字符串时，我都会毫不犹豫地进行强制转换。这些转换可能会失败，我们应该妥善处理该错误。
2. 目前，如果操作数的类型与执行的操作不符，Java 转换将失败，JVM 将抛出 `ClassCastException`。这将解开（unwind）整个堆栈并退出应用程序，向用户显示 Java 堆栈跟踪。
3. 这可能不是我们想要的。我们希望他们了解发生了 Lox 运行时错误，并向他们提供与我们的语言和他们的程序相关的错误消息。
4. 当对一个表达式求值时，如果其中的某个地方出现了错误，那整个表达式都要被跳过。例如下面的表达式
    ```
    2 * (3 / -我们可以打印一个运行时错误，然后中止进程并完全退出应用程序。这有一定的戏剧性。有点像编程语言解释器中的麦克风掉落。

尽管这很诱人，但我们可能应该做一些不那么灾难性的事情。虽然运行时错误需要停止评估表达式，但它不应该杀死解释器。如果用户正在运行 REPL 并且在一行代码中出现拼写错误，他们仍然应该能够保持会话继续，然后输入更多代码。"muffin")
    ```
    `-"muffin"` 会发生求值错误，那么再计算 `/` 和 `*` 就没有意义了。
5. 我们当然可以打印一个运行时错误，然后中止进程并完全退出应用程序。这很简单粗暴，但我们可能应该做一些不那么灾难性的事情。虽然运行时错误需要停止评估表达式，但它不应该杀死解释器。如果用户正在运行 REPL 并且在一行代码中出现拼写错误，他们仍然应该能够保持会话继续，然后输入更多代码。

###  4.1. <a name='Detectingruntimeerrors'></a>Detecting runtime errors
1. 我们的树遍历解释器使用递归方法调用来对嵌套表达式求值，如果出现错误，我们需要从递归调用中解开。
2. 在 Java 中抛出异常是一种很好的实现方法。但是，我们不会使用 Java 自己的强制转换失败，而是定义一个特定于 Lox 的强制转换失败，以便我们可以按照我们想要的方式处理它。
3. 在进行强制类型转换之前，我们检查对象的类型。

####  4.1.1. <a name=''></a>一元操作符
1.  强制转换前检查
    ```java
    case MINUS:
        checkNumberOperand(expr.operator, right);
        return -(double)right;
    ```
2. `checkNumberOperand` 实现
    ```java
    private void checkNumberOperand(Token operator, Object operand) {
        if (operand instanceof Double) return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }
    ```
3. 不懂，你既然要求必须是 `Double` 类型，那之后的强制类型转换还有啥意义？
4. `RuntimeError` 类定义如下
    ```java
    // lox/RuntimeError.java

    package com.craftinginterpreters.lox;

    class RuntimeError extends RuntimeException {
        final Token token;

        RuntimeError(Token token, String message) {
            super(message);
            this.token = token;
        }
    }
    ```
5. 与 Java 强制类型转换异常不同，我们的类会跟踪 token，该 token 可识别运行时错误来自用户代码的哪个位置。

####  4.1.2. <a name='-1'></a>二元操作符
1. 强制类型转换前检查，属于方法名的操作数是复数形式
    ```java
    checkNumberOperands(expr.operator, left, right);
    ```
2. `checkNumberOperands` 实现如下
    ```java
    private void checkNumberOperands(Token operator, Object left, Object right) {
        if (left instanceof Double && right instanceof Double) return;
        
        throw new RuntimeError(operator, "Operands must be numbers.");
    }
    ```
3. `PLUS` 操作有所不同，因为上面 `case PLUS` 时已经对数值和字符串的情况进行了重载，所以这里不再需要进行类型判断，只需要在两种重载都没有命中时抛出错误
    ```java
    case PLUS:
        if (left instanceof Double && right instanceof Double) {
            return (double)left + (double)right;
        } 

        if (left instanceof String && right instanceof String) {
            return (String)left + (String)right;
        }
        
        throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
    ```


##  5. <a name='HookingUptheInterpreter'></a>Hooking Up the Interpreter
1. 错误被抛出。下一步是编写捕获它们的代码。为此，我们需要将 `Interpreter` 类连接到驱动它的主 `Lox` 类中。
2. `Interpreter` 类实现了 `Expr.Visitor` 接口，它是个访问者，

###  5.1. <a name='-1'></a>访问者模式在这里的使用
1. 解释器的类声明为访问者
    ```java
    // Interpreter.java

    class Interpreter implements Expr.Visitor<Object>
    ```
2. 这也就意味着它会有访问者接口的四个方法
    ```java
    // Expr.java

    interface Visitor<R> {
        R visitBinaryExpr(Binary expr);
        R visitGroupingExpr(Grouping expr);
        R visitLiteralExpr(Literal expr);
        R visitUnaryExpr(Unary expr);
    }
    ```
3. 这四个方法是 `Visitor` 针对四种表达式的一个空方法，不同的模块使用这些方法时要进行重载，让它执行具体的功能。
4. 对于解释器来说，它要重载这四个方法让它们实现对四种表达式的求值功能。例如
    ```java
    // Interpreter.java
    
    @Override
    public Object visitLiteralExpr(Expr.Literal expr) {
        return expr.value;
    }
    ```
5. 然后，这个解释器类有一个用来解释表达式的方法 `interpret`
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
6. 其中使用 `evaluate` 方法具体对表达式求值
    ```java
    // Interpreter.java
    
    private Object evaluate(Expr expr) {
        return expr.accept(this);
    }
    ```
7. 可以看到，`evaluate` 方法调用被求值表达式对象的 `accept`，并把当前的解释器实例作为参数传入。
8. 而当前解释器实例就是一个访问者实例。所以，当前被求值的表达式对象在接受到这个作为访问者的解释器之后，从里面找到自己这个表达式类型对应的求值方法，也就是 `Visitor` 接口的那四个方法之一，调用这个方法并传入自身（表达式对象）来进行求值。例如字面量表达式的 `accept` 定义在下面，它用参数接收到解释器实例，然后再调用为字面量表达式重载的 `visitLiteralExpr` 方法，这个方法现在的功能就是为字面量表达式求值，返回值是字面量表达式的值
    ```java
    // Expr.java

    static class Literal extends Expr {
        Literal(Object value) {
            this.value = value;
        }

        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitLiteralExpr(this);
        }

        final Object value;
    }
    ```
9. 整体的调用逻辑是：
    1. 调用 `Lox` 类的 `main` 方法，通过 `runFile` 或者 `runPrompt` 来获得源代码；
    2. 调用 `run` 方法开始编译；
    3. `run` 方法里经过扫描获得 `token` 流，解析器解析 `token` 流获得表达式对象 `expression`，解释器实例调用 `interpret` 方法解释该表达式 
        ```java
        // Lox.java

        interpreter.interpret(expression)
        ```
    4. 解释器的 `interpret` 方法调用解释器的 `evaluate` 方法具体对表达式求值
        ```java
        // Interpreter.java

        Object value = evaluate(expression);
        ```
    5. `evaluate` 方法调用被求值表达式对象的 `accept` 方法，把解释器实例 `interpreter` 传给该表达式对象
        ```java
        // Interpreter.java
        
        private Object evaluate(Expr expr) {
            return expr.accept(this);
        }
        ```
    6. 该表达式对象的 `accept` 方法会从访问者接口的四个方法中找到自己对应的方法进行调用，并把自己传给这个方法。这里以字面量表达式对应的方法为例
        ```java
        // Expr.java

        <R> R accept(Visitor<R> visitor) {
            return visitor.visitLiteralExpr(this);
        }
        ```
    7. 抽象方法 `visitLiteralExpr` 方法已经被它实际所属的 `Interpreter` 重载过了，所以它的实际功能是对字面量表达式求值，所以上面的 `accept` 就返回了当前字面量表达式的值给了 `evaluate` 方法调用，`evaluate` 调用又把值返回给 `interpret` 方法调用，`interpret` 中调用 `println` 打印该表达式的值。

###  5.2. <a name='Reportingruntimeerrors'></a>Reporting runtime errors
1. 求值过程的错误会被捕获并被传给 `Lox.runtimeError` 方法
    ```java
    static void runtimeError(RuntimeError error) {
        System.err.println(error.getMessage() + "\n[line " + error.token.line + "]");
        hadRuntimeError = true;
    }
    ```
2. `hadRuntimeError` 设置为 `true` 后，`runFile` 方法会使用它，这样我们可以在进程退出时设置退出代码以通知调用进程
    ```java
    // Lox.java

    private static void runFile(String path) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(path));
        run(new String(bytes, Charset.defaultCharset()));

        if (hadError) System.exit(65);
        if (hadRuntimeError) System.exit(70);
    }
    ```

###  5.3. <a name='Runningtheinterpreter'></a>Running the interpreter
1. 解释器被实例化为静态类型，以便在 REPL 模式下重复调用 `run` 时使用同一个解释器实例，之后解释器会存储全局变量，静态类型使得这些全局变量应该在整个 REPL 会话中保持不变
    ```java
    // Lox.java

    private static final Interpreter interpreter = new Interpreter();
    ```
2. `stringify` 方法实现如下
    ```java
    // Interpreter.java
    
    private String stringify(Object object) {
        if (object == null)
            return "nil";

        if (object instanceof Double) {
            String text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length() - 2);
            }
            return text;
        }

        return object.toString();
    }
    ```


##  6. <a name='References'></a>References
* [*Crafting interpreters*: Evaluating Expressions](https://craftinginterpreters.com/evaluating-expressions.html)