# Scanning

<!-- vscode-markdown-toc -->
* 1. [设计原理](#)
* 2. [Context-Free Grammars](#Context-FreeGrammars)
	* 2.1. [Formal grammar](#Formalgrammar)
	* 2.2. [Rules for grammars](#Rulesforgrammars)
	* 2.3. [Enhancing our notation](#Enhancingournotation)
	* 2.4. [A Grammar for Lox expressions](#AGrammarforLoxexpressions)
* 3. [Implementing Syntax Trees](#ImplementingSyntaxTrees)
	* 3.1. [Metaprogramming the trees](#Metaprogrammingthetrees)
* 4. [Working with Trees](#WorkingwithTrees)
	* 4.1. [使用访问者模式](#-1)
* 5. [A (Not Very) Pretty Printer](#ANotVeryPrettyPrinter)
* 6. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name=''></a>设计原理


##  2. <a name='Context-FreeGrammars'></a>Context-Free Grammars
1. In the last chapter, the formalism we used for defining the lexical grammar — the rules for how characters get grouped into tokens — was called a **regular language**. TODO，到底是语法分析的 grammar 是是正则语言还是这个语言本身是正则语言？
2. 使用正则的 lexical grammar 对于 scanner 来说很好，但它功能不够强大，无法处理可以任意深度嵌套的表达式。为此，我们需要这里的 **Context-Free Grammars**（CFG）。It’s the next heaviest tool in the toolbox of **formal grammars**. 

###  2.1. <a name='Formalgrammar'></a>Formal grammar
1. A formal grammar describes which strings from an alphabet of a formal language are valid according to the language's syntax. 
2. A formal grammar takes a set of atomic pieces it calls its “alphabet”. Then it defines a (usually infinite) set of “strings” that are “in” the grammar. Each string is a sequence of “letters” in the alphabet.
3. A grammar does not describe the meaning of the strings or what can be done with them in whatever context—only their form. 
4. A formal grammar is defined as a set of production rules for such strings in a formal language.
5. A formal grammar is a set of rules for rewriting strings, along with a "start symbol" from which rewriting starts. Therefore, a grammar is usually thought of as a language generator. 
6. However, it can also sometimes be used as the basis for a "recognizer"—a function in computing that determines whether a given string belongs to the language or is grammatically incorrect.

###  2.2. <a name='Rulesforgrammars'></a>Rules for grammars
1. 在词法分析器的 lexical grammar 中，atomic pieces 是各种单个字符；而这里我们讨论的是语法分析器的 syntactic grammar，atomic pieces 就是各种词法分析器生成的 token。
2. Grammars 有一些规则，通过这些规则，可以把原本无意义的字符序列生成为若干有意义的字符串。这些规则被称为 **产生式**（production），因为它们产生出了有意义的字符串。
3. CFG 的每个产生式都有 **head** 和 **body** 两部分组成。head 是产生式的名称，body 描述了要产生什么。
4. 在纯粹的形式中，body 只是一个符号列表。符号有两种类型：
    * **terminal**：终结符就是 atomic pieces，对应到沃恩这里就是 token。因为它已经是 atomic 的了，所以就是终结的。
    * **nonterminal**：非终结符是用来引用另一条规则的名称。
5. 可以有多个同名规则，如果遇到具有该名称的非终结符时，可以为其选择其中任意一个规则。
6. 这里我们定义一组产生式。每个产生式的 `→` 左边是 head，右边是 body。终结符带引号，非终结符不带
    ```
    breakfast  → protein "with" breakfast "on the side" ;
    breakfast  → protein ;
    breakfast  → bread ;

    protein    → crispiness "crispy" "bacon" ;
    protein    → "sausage" ;
    protein    → cooked "eggs" ;

    crispiness → "really" ;
    crispiness → "really" crispiness ;

    cooked     → "scrambled" ;
    cooked     → "poached" ;
    cooked     → "fried" ;

    bread      → "toast" ;
    bread      → "biscuits" ;
    bread      → "English muffin" ;
    ```
7. 不懂，书上的例子中说到 “Recursion in the grammar is a good sign that the language being defined is context-free instead of regular. In particular, recursion where the recursive nonterminal has productions on both sides implies that the language is not regular.”
8. 每当我们遇到一条有多个产生式的规则时，我们只需任意选择一个。正是这种灵活性使得少量的语法规则能够编码大量的字符串。规则可以直接或间接引用自身这一事实进一步提高了它的性能，让我们能够将无限数量的字符串打包到有限的语法中。

###  2.3. <a name='Enhancingournotation'></a>Enhancing our notation
1. 加强和简化产生式的表示规则。
    * 同名的多个产生式可以写在一起。例如把上面三个 bread 的产生式合并
        ```
        bread → "toast" | "biscuits" | "English muffin" ;
        ```
    * 用括号展开一组同名产生式。例如把 `protein    → cooked "eggs" ;` 改为
        ```
        protein → ( "scrambled" | "poached" | "fried" ) "eggs" ;
        ```
    * 使用后缀 `*` 表示它左边的某个符号或者符号组（用括号括起来的）出现零次或多次。例如 `crispiness → "really" crispiness ;` 这个产生式，`crispiness` 可以递归若干次的产生它所在的这个产生式，最终的结果是 `"really" "really" "really" "really"...`。而同名的产生式 `crispiness → "really" ;` 它的 body 只有一个 `"really"`。所以，对应整体名为 `crispiness` 的产生式来说，它的 body 可能有一个或者多个 `"really"`。使用 `*` 可以表示为
        ```
        crispiness → "really" "really"* ;
        ``` 
    * 使用后缀 `*` 表示它左边的某个符号或者符号组（用括号括起来的）出现一次或多次。所以 `crispiness → "really" "really"* ;` 可以表示为
        ```
        crispiness → "really"+ ;
        ```
    * 使用后缀 `*` 表示它左边的某个符号或者符号组（用括号括起来的）出现零次或一次。所以
        ```
        breakfast  → protein "with" breakfast "on the side" ;
        breakfast  → protein ;
        ```
        可以合并为
        ```
        breakfast → protein ( "with" breakfast "on the side" )? ;
        ```
2. 使用上面这几个规则，上面完整的文法产生式可以写成
    ```
    breakfast → protein ( "with" breakfast "on the side" )?
                | bread ;

    protein   → "really"+ "crispy" "bacon"
                | "sausage"
                | ( "scrambled" | "poached" | "fried" ) "eggs" ;

    bread     → "toast" | "biscuits" | "English muffin" ;
    ```

###  2.4. <a name='AGrammarforLoxexpressions'></a>A Grammar for Lox expressions
1. 我们暂时只考虑下面四种表达式：
    * 字面量（literal）：数字、字符串、布尔值和 `nil`。
    * 一元表达式（unary）：用于执行逻辑非运算的 `!` 和数字求反的 `-`。
    * 二元表达式（binary）。
    * 括号：把一组表达式组装成一个 group。
2. 使用上面的 grammar 表示法表示这四种表达式的 grammar 如下：
    ```
    expression     → literal
                    | unary
                    | binary
                    | grouping ;

    literal        → NUMBER | STRING | "true" | "false" | "nil" ;
    grouping       → "(" expression ")" ;
    unary          → ( "-" | "!" ) expression ;
    binary         → expression operator expression ;
    operator       → "==" | "!=" | "<" | "<=" | ">" | ">="
                    | "+"  | "-"  | "*" | "/" ;
    ```
3. 数值好字符串也是字面量终结符，但我们这里没办法列出所有的数值和字符串字面量，所以用大写的 `NUMBER` 和 `STRING` 替代。之后也会有 `IDENTIFIER` 替代所有的标识符。
4. 上面的表达式 grammar 实际上是有歧义的，在解析的时候会发现问题。不过暂时这样。


##  3. <a name='ImplementingSyntaxTrees'></a>Implementing Syntax Trees
1. 我们将要定义一个 AST，每个产生式都对应树种的一个节点。
2. Scanner 使用单个 Token 类来表示所有的词素，每个 token 里有一个类型字段来区分不同的类型。但语法树不能用单个的类来表示所有的表达式，因为不同的表达式差别比较明显：一元表达式只有一个操作数，二元表达式有两个，而文字没有。
3. 我们首先定义一个表达式的基类，然后为每种表达式（每种表达式的产生式）创建一个子类，这个子类包含这个产生式的非终结符字段。不懂，为什么只有非终结符。
4. 这样，如果我们尝试访问一元表达式的第二个操作数，就会出现编译错误。不懂
5. 下面是表达式基类和其中的二元表达式子类
    ```java
    package com.craftinginterpreters.lox;

    abstract class Expr { 
        static class Binary extends Expr {
            Binary(Expr left, Token operator, Expr right) {
                this.left = left;
                this.operator = operator;
                this.right = right;
            }

            final Expr left;
            final Token operator;
            final Expr right;
        }

        // Other expressions...
    }
    ```

###  3.1. <a name='Metaprogrammingthetrees'></a>Metaprogramming the trees
1. 上面我们写出了 `Binary` 类，我们不用费力地为每一个表达式都这样手写类定义、字段声明、构造函数和初始化程序。我们只需编写一个脚本，它包含每个树类型的描述（名称和字段），并打印出定义具有该名称和状态的类所需的 Java 代码。该脚本是一个小型 Java 命令行应用程序，它生成一个名为 `Expr.java` 的文件。
2. 这个脚本运行时，接收一个目录参数，然后会把 `Expr.java` 生成在这个目录里
    ```java
    // tool/GenerateAst.java

    package com.craftinginterpreters.tool;

    import java.io.IOException;
    import java.io.PrintWriter;
    import java.util.Arrays;
    import java.util.List;

    public class GenerateAst {
        public static void main(String[] args) throws IOException {
            if (args.length != 1) {
                System.err.println("Usage: generate_ast <output directory>");
                System.exit(64);
            }
            String outputDir = args[0];
        }
    }
    ```
3. 为了生成每种表达式对应的子类，需要对每种表达式的类型及其字段进行一些描述，调用时通过参数 `Arrays.asList` 传递这些描述
    ```java
    defineAst(outputDir, "Expr", Arrays.asList(
        "Binary   : Expr left, Token operator, Expr right",
        "Grouping : Expr expression",
        "Literal  : Object value",
        "Unary    : Token operator, Expr right"
    ));
    ```
4. 冒号前面是类的名称；后面是一个或多个字段，多个字段用逗号分隔；每个字段包含类型和名字，用空格分隔。
5. `defineAst` 内部会生成 `Expr.java` 文件，
    ```java
    private static void defineAst(String outputDir, String baseName, List<String> types)
        throws IOException 
    {
        String path = outputDir + "/" + baseName + ".java";
        PrintWriter writer = new PrintWriter(path, "UTF-8");

        writer.println("package com.craftinginterpreters.lox;");
        writer.println();
        writer.println("import java.util.List;");
        writer.println();
        // 从这一行开始写 Expr 基类
        // 这里用了参数 baseName 而不是硬编码为 "Expr"，因为 defineAst 还用来生成 Stmt 基类
        writer.println("abstract class " + baseName + " {");

        writer.println("}");
        writer.close();
    }
    ```
6. `defineAst` 用 `types` 参数接收 `Arrays.asList` 传递进来的子类和类型和字段描述，然后循环定义每一个子类
    ```java
    for (String type : types) {
        // 子类名称
        String className = type.split(":")[0].trim();
        // 该子类若干个字段描述
        String fields = type.split(":")[1].trim(); 
        // 定义该子类
        defineType(writer, baseName, className, fields);
    }
    ```
7. `defineType` 定义如下
    ```java
    private static void defineType(
        PrintWriter writer, String baseName,
        String className, String fieldList) 
    {
        // 开始定义子类
        writer.println("  static class " + className + " extends " + baseName + " {");

        // Constructor. 若干个描述符共同组成的字符串直接所谓形参
        writer.println("    " + className + "(" + fieldList + ") {");

        // Store parameters in fields.
        String[] fields = fieldList.split(", ");
        for (String field : fields) {
            String name = field.split(" ")[1];
            writer.println("      this." + name + " = " + name + ";");
        }

        writer.println("    }");

        // Fields.
        writer.println();
        for (String field : fields) {
            writer.println("    final " + field + ";");
        }

        writer.println("  }");
    }
    ```
8. 现在，运行 `GenerateAst.java` 就可以生成 `Expr.java`，里面包含了所有表达式类的定义。


##  4. <a name='WorkingwithTrees'></a>Working with Trees
1. 对于不同的表达式对象，解释器对其有不同的处理方法。我们当然可以给每个表达式类都添加一个比如 `interpret` 方法，然后在里面写对应的处理逻辑。
2. 但对于表达式对象的操作不只有 `interpret` 这一种，如果其他操作也都写在表达式对象里面，那就使得不同的功能的代码都混在同一个对象里了。
3. 我们这里希望把每种功能的操作都放在各自独立的模块里，也就是负责 `interpret` 放在一个模块里，放在另一个功能的代码放在另一个模块里。
4. 这里我们使用访问者模式来设计

###  4.1. <a name='-1'></a>使用访问者模式
1. 访问者类型的接口定义如下，访问者对象里有对每种表达式的处理方法
    ```java
    interface Visitor<R> {
        R visitAssignExpr(Assign expr);
        R visitBinaryExpr(Binary expr);
        R visitCallExpr(Call expr);
        R visitGetExpr(Get expr);
        R visitGroupingExpr(Grouping expr);
        R visitLiteralExpr(Literal expr);
        R visitLogicalExpr(Logical expr);
        R visitSetExpr(Set expr);
        R visitSuperExpr(Super expr);
        R visitThisExpr(This expr);
        R visitUnaryExpr(Unary expr);
        R visitVariableExpr(Variable expr);
    }
    ```
2. 每个表达式类还有一个 `accept` 方法用来接收访问者并执行访问者对象中属于自己的那个处理方法。以 `Binary` 类为例 
    ```java
    // 表达式基类里面定义了抽象方法 `accept`
    abstract <R> R accept(Visitor<R> visitor);


    static class Binary extends Expr {
        Binary(Expr left, Token operator, Expr right) {
            this.left = left;
            this.operator = operator;
            this.right = right;
        }

        // 表达式子类定义具体的 accept 方法
        // 调用访问者对象上处理 binary 表达式的方法
        @Override
        <R> R accept(Visitor<R> visitor) {
            return visitor.visitBinaryExpr(this);
        }

        final Expr left;
        final Token operator;
        final Expr right;
    }
    ```
3. `R` 是泛型参数。
4. 上述代码都是通过 `GenerateAst.java` 生成的。


##  5. <a name='ANotVeryPrettyPrinter'></a>A (Not Very) Pretty Printer
1. 我们想要打印出语法树的结构，但并不是真的打印树的形状，而是像下面这样，把
    <img src="../../images/expression.png" width="600" style="display: block; margin: 5px 0 10px;" />
    打印成
    ```
    (* (- 123) (group 45.67))
    ```
2. 为此，我们定义一个新的类
    ```java
    // lox/Ast​​Printer.java

    package com.craftinginterpreters.lox;

    class AstPrinter implements Expr.Visitor<String> {
        String print(Expr expr) {
            return expr.accept(this);
        }
    }
    ```
3. 可以看到，它实现了访问者接口 `Expr.Visitor`。具体实现了其中的四个方法来实现对四种表达式的打印
    ```java
    @Override
    public String visitBinaryExpr(Expr.Binary expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitGroupingExpr(Expr.Grouping expr) {
        return parenthesize("group", expr.expression);
    }

    @Override
    public String visitLiteralExpr(Expr.Literal expr) {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    @Override
    public String visitUnaryExpr(Expr.Unary expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    }
    ```
4. 打印字面量表达式最简单，只要不是 `null` 就转为字符串形式，否则转为 `"nil"`。
5. 其他三种表达式都包含子表达式，所以打印它们是都通过 `parenthesize` 方法放在括号里
    ```java
    private String parenthesize(String name, Expr... exprs) {
        /* StringBuilder in Java represents a mutable sequence of characters. Since the String Class in Java creates an immutable sequence of characters, the StringBuilder class provides an alternative to String Class, as it creates a mutable sequence of characters.
        */
        StringBuilder builder = new StringBuilder();

        builder.append("(").append(name);
        for (Expr expr : exprs) {
            builder.append(" ");
            // 子表达式也调用了 accept 方法，递归的打印子表达式
            builder.append(expr.accept(this));
        }
        builder.append(")");

        return builder.toString();
    }
    ```
6. 例如表达式 `1 + 2`，会调用 `visitBinaryExpr` 方法后返回 `(+ 1 2)`。
7. 我们还没有解析器，所以很难看到它的实际作用。现在，我们将编写一个小 `main()` 方法，手动实例化一棵树并打印它
    ```java
    // lox/AstPrinter.java

    public static void main(String[] args) {
        Expr expression = new Expr.Binary(
            new Expr.Unary(
                new Token(TokenType.MINUS, "-", null, 1),
                new Expr.Literal(123)
            ),
            new Token(TokenType.STAR, "*", null, 1),
            new Expr.Grouping(new Expr.Literal(45.67))
        );

        System.out.println(new AstPrinter().print(expression));
    }
    ```
8. 编译运行后打印出 `(* (- 123) (group 45.67))`。



##  6. <a name='References'></a>References
* [*Crafting interpreters*: Representing Code](https://craftinginterpreters.com/representing-code.html)