# Scanning

<!-- vscode-markdown-toc -->
* 1. [设计原理](#)
* 2. [解释器框架](#-1)
	* 2.1. [`package`](#package)
	* 2.2. [执行方式](#-1)
	* 2.3. [`run`](#run)
	* 2.4. [错误处理](#-1)
* 3. [Lexemes and Tokens](#LexemesandTokens)
	* 3.1. [Token 可能包含的信息](#Token)
		* 3.1.1. [Token type](#Tokentype)
		* 3.1.2. [Literal value](#Literalvalue)
		* 3.1.3. [Location information](#Locationinformation)
	* 3.2. [jLox 的 token 类](#jLoxtoken)
* 4. [Regular Languages and Expressions](#RegularLanguagesandExpressions)
* 5. [The Scanner Class](#TheScannerClass)
* 6. [Recognizing Lexemes](#RecognizingLexemes)
	* 6.1. [从识别单个字符词素开始](#-1)
	* 6.2. [Lexical errors](#Lexicalerrors)
	* 6.3. [双字符运算符](#-1)
* 7. [Longer Lexemes](#LongerLexemes)
	* 7.1. [注释](#-1)
	* 7.2. [String literals](#Stringliterals)
	* 7.3. [Number literals](#Numberliterals)
		* 7.3.1. [负数的情况](#-1)
* 8. [Reserved Words and Identifiers](#ReservedWordsandIdentifiers)
	* 8.1. [maximal munch/longest match](#maximalmunchlongestmatch)
* 9. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name=''></a>设计原理



##  2. <a name='-1'></a>解释器框架
1. 初始代码
    ```java
    // Lox.java

    package com.craftinginterpreters.lox;

    import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.nio.charset.Charset;
    import java.nio.file.Files;
    import java.nio.file.Paths;
    import java.util.List;

    public class Lox {
        static boolean hadError = false;

        public static void main(String[] args) throws IOException {
            if (args.length > 1) {
                System.out.println("Usage: jlox [script]");
                System.exit(64); 
            } else if (args.length == 1) {
                runFile(args[0]);
            } else {
                runPrompt();
            }
        }
    }
    ```

###  2.1. <a name='package'></a>`package`
1. `package` 指定了当前文件要编译到什么目录之下。在这一章中，四个 java 文件（Lox.java Scanner.java Token.java TokenType.java）的 `package` 都设置了这个相同的值。
2. 这四个 java 文件也在同一个目录中。
3. 在当前目录下编译当前目录的所有 java文件：`javac -d . *.java`。结果是它们对应的 `.class` 都生成到了当前目录的子目录 `com/craftinginterpreters/lox`。
4. 执行命令运行 `java com/craftinginterpreters/lox/Lox`。
5. Lox.java 并没有显式的引用其他几个文件，但可以用其他文件里的类，不知道是不是也和设置了相同的 `package` 有关。

###  2.2. <a name='-1'></a>执行方式
1. `main` 方法会读取命令行参数：
    * 如果参数大于 1，会给出一个提示并退出程序，因为这是非正常的使用方式；
    * 如果有一个参数，那么期望这个参数是一个 jLox 源文件路径，例如 `test.jLox`。然后 `runFile` 会读取这个文件并扫描里面的代码；例如执行命令 `java com/craftinginterpreters/lox/Lox test.jLox`
    * 如果没有参数，那会以 REPL 方式运行，`runPrompt` 被调用，用户输入一行代码就分析一行代码。
2. `runFile` 和 `runPrompt` 内部都是调用 `run` 方法进行扫描
    ```java
    // Lox.java

    private static void runFile(String path) throws IOException {
        // 读取路径制定的文件里面所有字节
        byte[] bytes = Files.readAllBytes(Paths.get(path));
        // 转为字符串传给 run
        run(new String(bytes, Charset.defaultCharset()));

        if (hadError) System.exit(65);
    }

    private static void runPrompt() throws IOException {
        // 创建输入流 reader
        InputStreamReader input = new InputStreamReader(System.in);
        BufferedReader reader = new BufferedReader(input);
    
        // 每轮循环读取一行并分析
        for (;;) { 
            System.out.print("> ");
            String line = reader.readLine();
            // 如果用户终止交互，readLine 会返回 null
            if (line == null) break;
            run(line);

            hadError = false;
        }
    }
    ```

###  2.3. <a name='run'></a>`run`
1. 目前的代码如下
    ```java
    // Lox.java

    private static void run(String source) {
        Scanner scanner = new Scanner(source);
        List<Token> tokens = scanner.scanTokens();
    
        // For now, just print the tokens.
        for (Token token : tokens) {
            System.out.println(token);
        }
    }
    ```
2. 扫描阶段只是通过 `Scanner` 类分析出 token，并没有后续工作，所以这里只是简单的打印 token。

###  2.4. <a name='-1'></a>错误处理
1. 代码
    ```java
    // Lox.java

    static void error(int line, String message) {
        report(line, "", message);
    }

    private static void report(int line, String where, String message) {
        System.err.println("[line " + line + "] Error" + where + ": " + message);
        hadError = true;
    }
    ```
2. 一旦发生错误 `hadError` 就会被设置为 `true`。`runFile` 中发现错误会退出程序，`runPrompt` 中每轮循环会被 `hadError` 置为 `false`，这样就可以正常的继续输入下一行代码并分析。


##  3. <a name='LexemesandTokens'></a>Lexemes and Tokens
1. Lexeme 是对源代码分隔出的最小单元的文本字符串，而 token 是在 lexeme 附加上一些信息组成的。
2. 例如 `var language = "lox";` 中：
    * `var` 和 `"lox"` 这两个字符串本身是 lexeme；
    * `{lexeme: 'var', type: keyword}` 和 `{lexeme: '"lox"', type: string}` 就可以作为 token。

###  3.1. <a name='Token'></a>Token 可能包含的信息
####  3.1.1. <a name='Tokentype'></a>Token type
jLox 的 token 类型如下
```java
// TokenType.java

package com.craftinginterpreters.lox;

enum TokenType {
    // Single-character tokens.
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
    COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

    // One or two character tokens.
    BANG, BANG_EQUAL,
    EQUAL, EQUAL_EQUAL,
    GREATER, GREATER_EQUAL,
    LESS, LESS_EQUAL,

    // Literals.
    IDENTIFIER, STRING, NUMBER,

    // Keywords.
    AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
    PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

    EOF
}
```

####  3.1.2. <a name='Literalvalue'></a>Literal value
1. There are lexemes for literal values—numbers and strings and the like. 
2. Since the scanner has to walk each character in the literal to correctly identify it, it can also convert that textual representation of a value to the living runtime object that will be used by the interpreter later.
3. 看起来就是 lexeme 本身。

####  3.1.3. <a name='Locationinformation'></a>Location information
1. 一些 token 实现将位置存储为两个数字：从源文件开头到 lexeme 开头的偏移量，以及词素的长度。扫描器无论如何都需要知道这些，因此计算它们没有任何开销。
2. 稍后可以通过查看源文件并计算前面的换行符来将偏移量转换为行和列的位置。这听起来很慢，事实也确实如此。但是，只有当您需要实际向用户显示行和列时才需要这样做。大多数标记永远不会出现在错误消息中。对于这些标记，提前计算位置信息所花的时间越少越好。
3. jLox 只记录词素的行号。

###  3.2. <a name='jLoxtoken'></a>jLox 的 token 类
```java
// Token.java

package com.craftinginterpreters.lox;

class Token {
    // token 包含下面四个信息
    final TokenType type;
    final String lexeme;
    final Object literal;
    final int line; 

    Token(TokenType type, String lexeme, Object literal, int line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public String toString() {
        return type + " " + lexeme + " " + literal;
    }
}
```


##  4. <a name='RegularLanguagesandExpressions'></a>Regular Languages and Expressions
1. 扫描器的核心是一个循环，从源代码的第一个字符开始，扫描器会确定该字符属于哪个词素，并使用该字符以及属于该词素的任何后续字符。当它到达该词素的末尾时，它会发出一个标记。
2. 然后它循环回去，从源代码中的下一个字符开始重复这一过程。
3. 决定特定语言如何将字符分组为词素的规则称为这个语言的 lexical grammar，也就是怎样对这个语言进行词法分析的语法。在 Lox 中，与大多数编程语言一样，Lox 使用正则表达式的方法机型词法分析，所以 Lox 是一种 regular language。


##  5. <a name='TheScannerClass'></a>The Scanner Class
整体逻辑
```java
// Scanner.java

package com.craftinginterpreters.lox;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// With the help of static import, we can access the static members of a class directly without class name or any object. 这个文件要引用 TokenType 里面的所有枚举值，使用静态引用可以直接使用枚举值而不用在前面带上 `TokenType.`
import static com.craftinginterpreters.lox.TokenType.*; 

class Scanner {
    // 源代码
    private final String source;
    // token 列表
    private final List<Token> tokens = new ArrayList<>();

    // 当前正在扫描的字符的位置
    private int current = 0;
    // current 所在行
    private int line = 1;
    // 当前词素的第一个字符的位置
    private int start = 0;


    Scanner(String source) {
        this.source = source;
    }

    List<Token> scanTokens() {
        // 每轮循环扫描生成一个 token
        while (!isAtEnd()) {
            // We are at the beginning of the next lexeme.
            start = current;
            scanToken();
        }
        // 扫描结束后加上一个表示结束的 token
        tokens.add(new Token(EOF, "", null, line));
        return tokens;
    }

    private boolean isAtEnd() {
        return current >= source.length();
    }
}
```


##  6. <a name='RecognizingLexemes'></a>Recognizing Lexemes
###  6.1. <a name='-1'></a>从识别单个字符词素开始
1. `scanToken` 方法和辅助方法
    ```java
    // Scanner.java

    private void scanToken() {
        char c = advance();
        switch (c) {
            case '(': addToken(LEFT_PAREN); break;
            case ')': addToken(RIGHT_PAREN); break;
            case '{': addToken(LEFT_BRACE); break;
            case '}': addToken(RIGHT_BRACE); break;
            case ',': addToken(COMMA); break;
            case '.': addToken(DOT); break;
            case '-': addToken(MINUS); break;
            case '+': addToken(PLUS); break;
            case ';': addToken(SEMICOLON); break;
            case '*': addToken(STAR); break; 
        }
    }

    private char advance() {
        return source.charAt(current++);
    }

    private void addToken(TokenType type) {
        addToken(type, null);
    }

    private void addToken(TokenType type, Object literal) {
        String text = source.substring(start, current);
        tokens.add(new Token(type, text, literal, line));
    }
    ```
2. 不懂，`addToken` 为什么嵌套调用并且还重复定义

###  6.2. <a name='Lexicalerrors'></a>Lexical errors
1. 如果源代码中包含不合法的字符，扫描器就会报告错误
    ```java
    default:
        Lox.error(line, "Unexpected character.");
        break;
    ```
2. 注意，我们扔会继续扫描。程序后面可能还会有其他错误。如果我们一次检测到尽可能多的错误，我们的用户将获得更好的体验。
3. 但由于已设置 `hadError`，我们将永远不会尝试执行任何代码，即使我们继续扫描其余部分。

###  6.3. <a name='-1'></a>双字符运算符
1. 例如 `!`，它可以作为单独的运算符，也可以组成 `!=` 这样的双字符运算符。对于 `!` 这种字符，我们还需要判断它后面的字符是什么才能确定当前是什么 token。
    ```java
    case '!':
        addToken(match('=') ? BANG_EQUAL : BANG);
        break;
    case '=':
        addToken(match('=') ? EQUAL_EQUAL : EQUAL);
        break;
    case '<':
        addToken(match('=') ? LESS_EQUAL : LESS);
        break;
    case '>':
        addToken(match('=') ? GREATER_EQUAL : GREATER);
        break;
    ```
2. `match` 方法用来判断是否和后面的字符组成一个双字符运算符
    ```java
    private boolean match(char expected) {
        if (isAtEnd()) return false;
        // 调用 `advance` 的时候里面有 `current++`，所以现在 `current` 已经是指向下一个待处理字符了
        if (source.charAt(current) != expected) return false;

        current++;
        return true;
    }
    ```
3. 注释符号 `//` 也是一个双字符运算符，但因为还要处理它后面的注释文本，所以放在情况有些不同，放在下面。


##  7. <a name='LongerLexemes'></a>Longer Lexemes
###  7.1. <a name='-1'></a>注释
1. `/` 的处理逻辑
    ```java
    case '/':
        if (match('/')) {
            // A comment goes until the end of the line.
            while (peek() != '\n' && !isAtEnd()) advance();
        } 
        else {
            addToken(SLASH);
        }
        break;
    ```
2. `peek` 用来查看下一个字符
    ```java
    private char peek() {
        if (isAtEnd()) return '\0';
        return source.charAt(current);
    }
    ```
3. 注释文本也是词素，但它们没有意义，解析器不处理它们。所以当我们到达注释的末尾时，我们不会调用 `addToken()`。当我们循环回来开始下一个词素时，`start` 会被重置。

###  7.2. <a name='Stringliterals'></a>String literals
1. 字符串字面量以 `"` 开头
    ```java
    case '"': string(); break;
    ```
2. `string` 方法
    ```java
    private void string() {
        while (peek() != '"' && !isAtEnd()) {
            // 换行不会打断循环，因此支持多行字符串
            if (peek() == '\n') line++;
            advance();
        }

        if (isAtEnd()) {
            Lox.error(line, "Unterminated string.");
            return;
        }

        // The closing ".
        advance();

        // Trim the surrounding quotes.
        String value = source.substring(start + 1, current - 1);
        addToken(STRING, value);
    }
    ```

###  7.3. <a name='Numberliterals'></a>Number literals
1. A number literal is a series of digits optionally followed by a `.` and one or more trailing digits
    ```java
    if (isDigit(c)) {
        number();
    } 
    else {
        Lox.error(line, "Unexpected character.");
    }
    ```
2. 相关方法
    ```java
    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    } 

    private void number() {
        while (isDigit(peek())) advance();

        // Look for a fractional part.
        if (peek() == '.' && isDigit(peekNext())) {
            // Consume the "."
            advance();

            while (isDigit(peek())) advance();
        }

        addToken(NUMBER, Double.parseDouble(source.substring(start, current)));
    }

    private char peekNext() {
        if (current + 1 >= source.length()) return '\0';
        return source.charAt(current + 1);
    } 
    ```

####  7.3.1. <a name='-1'></a>负数的情况
1. 根据前面对数值字面量的定义，比如 `-123` 就不算是数值字面量，因为它不是以 digit 开始的。它是一个表达式，给数值字面量 `123` 应用了操作符 `-`。
2. 但这样会有一个问题，`-123.abs()` 的求值会是 -123，因为 `-` 的优先级低于方法调用。
3. TODO，没说怎么解决。


##  8. <a name='ReservedWordsandIdentifiers'></a>Reserved Words and Identifiers
###  8.1. <a name='maximalmunchlongestmatch'></a>maximal munch/longest match
1. 考虑要匹配保留字 `or` 的规则，如果还是按照前面匹配双字符操作符的规则的话，如果扫描到了一个变量名 `orchid`，则会把前两个字符识别成保留字 `or`。
2. 为了避免这个问题，匹配规则应该遵守 maximal munch/longest match 规则：when two lexical grammar rules can both match a chunk of code that the scanner is looking at, whichever one matches the most characters wins.
3. 所以，这里 `orchid` 既满足关键字 `or` 的匹配语法，也满足变量标识符的匹配语法，但因为后者可以匹配的更多，所以就匹配为后者。不懂，那为什么不能在这里使用 `peekNext` 检查一下 `or` 后面是否是空格呢？
4. 因为保留字也是一种特殊的标识符，所以这里我们优先按照普通标识符去匹配，匹配好之后再检查它是不是保留字
    ```java
    default:
        if (isDigit(c)) {
            number();
        } else if (isAlpha(c)) {
            identifier();
        } else {
            Lox.error(line, "Unexpected character.");
        }
        break;
    ```
    ```java
    private boolean isAlpha(char c) {
        return (c >= 'a' && c <= 'z') ||
                (c >= 'A' && c <= 'Z') ||
                c == '_';
    }
    private void identifier() {
        while (isAlphaNumeric(peek())) advance();

        String text = source.substring(start, current);
        // 如果是保留字，type 就是该保留字对应的类型；否则就是 null，说明只是普通的标识符
        TokenType type = keywords.get(text);
        if (type == null) type = IDENTIFIER;
        addToken(type);
    }
    private boolean isAlphaNumeric(char c) {
        return isAlpha(c) || isDigit(c);
    }

    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }
    ```


##  9. <a name='References'></a>References
* [*Crafting interpreters*: Scanning](https://craftinginterpreters.com/scanning.html)