# 使用lex和yacc编写计算器


<!-- vscode-markdown-toc -->
* 1. [lex](#lex)
	* 1.1. [.l 文件结构](#l)
	* 1.2. [规则区块中用到的正则](#)
	* 1.3. [lex 的正则匹配规则](#lex-1)
* 2. [yacc](#yacc)
	* 2.1. [yacc 的语法规则](#yacc-1)
	* 2.2. [规约过程](#-1)
		* 2.2.1. [先直观的看一下规约过程](#-1)
		* 2.2.2. [再看一下具体的规约逻辑](#-1)
* 3. [生成执行文件](#-1)
* 4. [冲突](#-1)
* 5. [错误处理](#-1)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='lex'></a>lex
1. lex/flex 是自动生成词法分析器的工具，通过输入 `.l` 类型的文件，输出词法分析器的 C 语言代码。
2. 词法分析会将输入的字符串分割为 token，因此需要定义 token 都是哪些类型的字符串。
3. mycalc 用到的 token 字符串包括以下种类
    * 运算符： `+`、`-`、`*`、`/`；
    * 整数；
    * 浮点数；
    * 换行符：一个算式输入后，再输入换行符就会执行计算。
4. lex 中，使用正则表达式定义 token 字符串。为 mycalc 编写的输入文件 `mycalc.l` 代码如下
    ```lex
    %{
    #include <stdio.h>
    #include "y.tab.h"

    int yywrap(void)
    {
        return 1;
    }
    %}
    %%
    "+"             return ADD;
    "-"             return SUB;
    "*"             return MUL;
    "/"             return DIV;
    "\n"            return CR;
    ([1-9][0-9]*)|0|([0-9]+\.[0-9]*) {
        double temp;
        sscanf(yytext, "%lf", &temp);
        yylval.double_value = temp;
        return DOUBLE_LITERAL;
    }
    [ \t] ;
    . {
        fprintf(stderr, "lexical error.\n");
        exit(1);
    }
    %%
    ```

###  1.1. <a name='l'></a>`.l` 文件结构
1. 两个 `%%` 之间的部分是 **规则区块**（rules），规则区块之前的是 **定义区块**（definitions），规则区块之后的是 **用户代码区块**（subroutines）。
2. 在定义区块内，可以定义初始状态或者为正则表达式命名。
3. 定义区块内 `%{` 和 `%}` 包裹的部分，是要让生成的词法分析器将此部分代码原样输出。后续程序所需的头文件在这里被包含，比如 y.tab.h 就是之后 yacc 自动生成的头文件，规则区块中用到的 `ADD` 等宏就是在 y.tab.h 中定义的。y.tab.h 中实际的定义是写在 `mycalc.y` 中。
4. 定义区块里还定义了一个 `yywrap` 函数,`yywrap` 是 flex 保留的函数名，这个函数是当输入结束时调用的。如果没有实现这个函数，就必须手动链接 lex 的库文件来获得它默认的 `yywrap` 函数实现。例如在编译命令 `gcc lex.yy.c -lfl -o myprogram` 使用 `-lfl` 进行链接。
5. 之后是规则区块，里面的每一个规则，都是一个正则表达式跟着若干个空格然后再加一段 C 代码。如果输入的字符串匹配到了这条规则的正则表达式，则该条规则后面的 C 代码就会执行。这段 C 代码称为这条规则的 **动作**（action）。
6. 最后是用户代码区块，其中可以编写任意的 C 代码。

###  1.2. <a name=''></a>规则区块中用到的正则
1. lex 的正则可以使用 `""` 转义，上面对加减乘除和换行都使用了这样的转义。如果匹配到了这里的运算符或者换行符，则执行后面的动作，返回对应的特征符。所谓特征符，就是定义在 y.tab.h 中的用来识别某个 token 符号的代号。
2. `([1-9][0-9]*)|0|([0-9]+\.[0-9]*)` 匹配实数。但实际上还能匹配到 `000`、`001`、`00.` 和 `00.1` 这样的写法。
3. 可以看出 mycalc 并没有整数类型数值，整数也表示为 `DOUBLE_LITERAL` token。
4. 如果匹配到了，匹配到的字符串会保存在全局变量 `yytext` 中，并在 action 中被 `sscanf` 解析，解析后的值保存在全局的联合体 `yylval` 的 `double_value` 字段中。联合体 `yylval` 也是定义在 `mycalc.y` 中。
5. `[ \t]` 匹配空格或制表符。动作对应为空，因此可以忽略每一行的空白字符。
6. 最后的 `.` 匹配任意一个字符。用于检测是否输入了程序不允许的字符。相当于 `switch...case` 的 `default` 分支。如果输入了程序不允许的字符，就打印错误信息并退出程序。

###  1.3. <a name='lex-1'></a>lex 的正则匹配规则
1. 正则会尽可能的选择较长的字符串进行匹配。例如 C 语言中有 `+` 和 `++` 运算符。那么当输入是 `++` 时，lex 会优先匹配为 `++` 而不是 `+`。
2. 如果两个规则都匹配到同样的长度的字符串时，则会优先使用前面那个规则进行匹配。
3. 看一下字符串 `00.00` 的匹配结果：
   1. `([1-9][0-9]*)|0|([0-9]+\.[0-9]*)` 的第二个分支 `0` 会匹配到第一个  `0`，匹配长度为 1;
   2. 第三个分支 `([0-9]+\.[0-9]*)` 会匹配到 `00.00`，匹配长度为 5；
   3. 根据最长匹配原则，最终会选择匹配为为 `00.00`。
   4. 之后的语义执行代码中，`sscanf(yytext, "%lf", &temp)` 会把 `00.00` 转为 `double` 类型。
4. 上面 lex 的最后一条正则 `.` 实际上可以匹配到每一个字符，但因为它是最后一条规则，所以只有在前面的规则都匹配不了时，它才会进行匹配。


##  2. <a name='yacc'></a>yacc
1. yacc 是自动生成语法分析器的工具，输入 `.y` 类型的文件，就会输出语法分析器的 C 语言代码。
2. mycalc 中的 yacc 输入文件 `mycalc.y` 代码如下
    ```yacc
    %{
    #include <stdio.h>
    #include <stdlib.h>
    #define YYDEBUG 1
    %}
    %union {
        int          int_value;
        double       double_value;
    }
    %token <double_value>      DOUBLE_LITERAL
    %token ADD SUB MUL DIV CR
    %type <double_value> expression term primary_expression
    %%
    line_list
        : line
        | line_list line
        ;
    line
        : expression CR
        {
            printf(">>%lf\n", $1);
        }
    expression
        : term
        | expression ADD term
        {
            $$ = $1 + $3;
        }
        | expression SUB term
        {
            $$ = $1 - $3;
        }
        ;
    term
        : primary_expression
        | term MUL primary_expression 
        {
            $$ = $1 * $3;
        }
        | term DIV primary_expression
        {
            $$ = $1 / $3;
        }
        ;
    primary_expression
        : DOUBLE_LITERAL
        ;                 
    %%
    int
    yyerror(char const *str)
    {
        extern char *yytext;
        fprintf(stderr, "parser error near %s\n", yytext);
        return 0;
    }

    int main(void)
    {
        extern int yyparse(void);
        extern FILE *yyin;

        yyin = stdin;
        if (yyparse()) {
            fprintf(stderr, "Error ! Error ! Error !\n");
            exit(1);
        }
    }
    ```
3. 最前面 `%{` 和 `%}` 包裹的部分仍然是要原样输出的 C 代码。其中 `#define YYDEBUG 1` 是开启 debug 模式，可以看到程序运行中语法分析的状态。
4. 紧接着的那个 union 定义了 token 和非终结符的类型。定义了两个联合成员：
   * 成员 `int_value` 定义为 C 语言的整数类型；
   * 成员 `double_value` 定义为 C 语言的浮点类型。
5. 这两个成员之后用来保存表示整数的 token，以及表示浮点数的 token。但在词法分析阶段已经可以看到，mycalc 的例子里实际上没有 `int_value` 类型的值，整数也是用浮点数表示的。
6. 之后的 10~11 行是 token 的声明。mycalc 所用到的 token 种类都在这里定义。`DOUBLE_LITERAL` 这个 token 被保存到联合成员 `double_value` 中；而 `DOUBLE_LITERAL` 这个 token 就是上面词法分析时正则 `[1-9][0-9]*)|0|([0-9]+\.[0-9]*` 匹配到之后返回的。
7. 在上面词法分析中，正则匹配到的数字字符串会保存燥一个联合变量中，也就是 `yylval.double_value = temp;`。而 `yylval` 是个全局变量，它其实就是 yacc 这里定义的这个 union。
8. `ADD`、`SUB`、 `MUL`、`DIV` 和 `CR` 只是操作符，不涉及数据类型。
9. 之后 `%type` 开始的那一行，声明了有 `double_value` 类型的非终结符有哪几个。
10. 再下面是和 lex 一样的规则区块。yacc 的规则区块，由语法规则以及 C 语言编写的相应动作组成。
11. 最后是用户代码区块，里面有 C 必需的 `main` 函数。

###  2.1. <a name='yacc-1'></a>yacc 的语法规则
1. 在 yacc 中，会使用类似 BNF（Backus–Naur form，Backus Normal form，巴科斯范式）。
2. 这里单独列出规则区块的代码
   ```yacc
    line_list
        : line
        | line_list line
        ;
    line
        : expression CR
        {
            printf(">>%lf\n", $1);
        }
    expression
        : term
        | expression ADD term
        {
            $$ = $1 + $3;
        }
        | expression SUB term
        {
            $$ = $1 - $3;
        }
        ;
    term
        : primary_expression
        | term MUL primary_expression 
        {
            $$ = $1 * $3;
        }
        | term DIV primary_expression
        {
            $$ = $1 / $3;
        }
        ;
    primary_expression
        : DOUBLE_LITERAL
        ; 
    ```      

### 顶层规则 `line_list`
1. 语法
   ```yacc
   line_list
        : line
        | line_list line
        ;
    ``` 
2. 该规则表示多行表达式。
3. 基础情况是一行表达式 `line`；递归情况是多行表达式 `line_list` 加 一行表达式 `line`。

### 行规则 `line`
1. 语法
    ```yacc
    line
        : expression CR
        {
            printf(">>%lf\n", $1);
        }
    ```
2. 该规则表示一行表达式：`expression` 后面跟着一个回车符 `CR`。
3. 语义动作 `printf(">>%lf\n", $1); ` 是计算表达式后打印结果。
4. `line` 表示一行表达式，而 `expression` 是具体的表达式。

### 表达式层级结构
语法采用分层设计解决运算符优先级

#### 加减法层 `expression`
1. 语法
    ```yacc
    expression
        : term                      # 基础情况：单个 term
        | expression ADD term       # 左递归：expression + term
        {
            $$ = $1 + $3;
        }
        | expression SUB term       # 左递归：expression - term
        {
            $$ = $1 - $3;
        }
        ;
        ```
2. 该规则的基础情况是单个 `term`，也就是下面会说到的乘除法层。
3. 递归情况的语义动作是加减法操作。因为加减法优先级最低，所以 `ADD` 和 `SUB` 是加减整个 `expression` 和 `term` 的结果。
4. `$$` 表示规则左部 `expression` 的语义值，`$1` 和 `$3` 表示规则右部 第1个（`expression`）和 第3个（`term`）符号的语义值。
5. 基础情况没有语义动作，使用默认动作​ `$$ = $1`。

#### 乘除法层 `term`
1. 语法
    ```yacc
    term
    : primary_expression                # 基础情况
    | term MUL primary_expression       # 左递归：term * primary
    {
        $$ = $1 * $3;
    }
    | term DIV primary_expression       # 左递归：term / primary
    {
        $$ = $1 / $3;
    }
    ;
    ```
2. 该规则的基础情况是单个 `primary_expression`；递归情况是乘除法操作。

#### 基本表达式 `primary_expression`
1. 语法
    ```yacc
    primary_expression
    : DOUBLE_LITERAL
    ;
    ```
2. 该规则表示一个浮点数字面量。
3. 没有语义动作，使用默认动作​ `$$ = $1`。

###  2.2. <a name='-1'></a>规约过程
根据上面的语法规则，以输入为 `1 + 2 * 3`，看看对其的规约过程。

####  2.2.1. <a name='-1'></a>先直观的看一下规约过程
1. `1 + 2 * 3` 被词法分析为 token 流 `DOUBLE_LITERAL(1) ADD DOUBLE_LITERAL(2) MUL DOUBLE_LITERAL(3) CR` 并输入给语法分析器。
2. 第一个数的规约：`DOUBLE_LITERAL(1) → primary_expression(1.0) → term(1.0) → expression(1.0)`。
3. 第二个数的规约：`DOUBLE_LITERAL(2) → primary_expression(2.0)`。这里不会继续规约为 `term`，因为之后又优先级更高的乘法运算符，所以要先移入后续的 token `MUL` 和 `DOUBLE_LITERAL(3)`。
4. 在移入 `MUL` 之前，要把前面的 `primary_expression` 规约为 `term`：`primary_expression(2.0) → term(2.0)`。
5. 第三个数的规约：`DOUBLE_LITERAL(3) → primary_expression(3.0)`。
6. 乘法运算规约：`term(2.0) MUL primary_expression(3.0) → term(6.0)`。
7. 加法运算规约：`expression(1.0) ADD term(6.0) → expression(7.0)`。
8. line 规约：`expression(7.0) CR → line`。并执行语义动作 `printf(">>%lf\n", $1);` 打印 `7.0`。


##  3. <a name='-1'></a>生成执行文件
### 生成词法分析器
1. 命令：`bison --yacc -dv mycalc.y`。
2. 这里把 `mycalc.y` 输入给 yacc 生成 `y.tab.c` 和 `y.tab.h`，以及一个 `y.output`。其中 `tab` 是 **分析表**（parsing tables）的缩写。
3. `y.tab.c` 中包含 yacc 生成的语法分析器的代码。
4. 为了将 `mycalc.y` 中定义的 token 传递给 `lex.yy.c`，yacc 会生成 `y.tab.h`。`-d` 参数指定要生成该文件。
5. `y.output` 是详细调试信息，用于调试语法分析器，它包含所有的语法规则、解析器、所有可能的分支状态以
及编译器启动信息。`-v` 参数指定要生成该文件。

### 生成语法分析器
1. 命令：`flex mycalc.l`。
2. 这里把 `mycalc.l` 输入给 lex 生成 `lex.yy.c`，其中是词法分析器的代码。

### 编译生成 mycalc 的完整编译器
1. 命令：`gcc -o mycalc y.tab.c lex.yy.c` 生成 `mycalc.exe`。


## `y.output`
1. `y.output` 是 LALR(1) 语法分析器的状态机描述文件，它展示了语法分析器如何从文法规则构建出确定性的状态机。
2. 代码
    ```
    Grammar

        0 $accept: line_list $end

        1 line_list: line
        2          | line_list line

        3 line: expression CR

        4 expression: term
        5           | expression ADD term
        6           | expression SUB term

        7 term: primary_expression
        8     | term MUL primary_expression
        9     | term DIV primary_expression

    10 primary_expression: DOUBLE_LITERAL


    Terminals, with rules where they appear

    $end (0) 0
    error (256)
    DOUBLE_LITERAL (258) 10
    ADD (259) 5
    SUB (260) 6
    MUL (261) 8
    DIV (262) 9
    CR (263) 3


    Nonterminals, with rules where they appear

    $accept (9)
        on left: 0
    line_list (10)
        on left: 1 2, on right: 0 2
    line (11)
        on left: 3, on right: 1 2
    expression (12)
        on left: 4 5 6, on right: 3 5 6
    term (13)
        on left: 7 8 9, on right: 4 5 6 8 9
    primary_expression (14)
        on left: 10, on right: 7 8 9


    state 0

        0 $accept: . line_list $end

        DOUBLE_LITERAL  shift, and go to state 1

        line_list           go to state 2
        line                go to state 3
        expression          go to state 4
        term                go to state 5
        primary_expression  go to state 6


    state 1

        10 primary_expression: DOUBLE_LITERAL .

        $default  reduce using rule 10 (primary_expression)


    state 2

        0 $accept: line_list . $end
        2 line_list: line_list . line

        $end            shift, and go to state 7
        DOUBLE_LITERAL  shift, and go to state 1

        line                go to state 8
        expression          go to state 4
        term                go to state 5
        primary_expression  go to state 6


    state 3

        1 line_list: line .

        $default  reduce using rule 1 (line_list)


    state 4

        3 line: expression . CR
        5 expression: expression . ADD term
        6           | expression . SUB term

        ADD  shift, and go to state 9
        SUB  shift, and go to state 10
        CR   shift, and go to state 11


    state 5

        4 expression: term .
        8 term: term . MUL primary_expression
        9     | term . DIV primary_expression

        MUL  shift, and go to state 12
        DIV  shift, and go to state 13

        $default  reduce using rule 4 (expression)


    state 6

        7 term: primary_expression .

        $default  reduce using rule 7 (term)


    state 7

        0 $accept: line_list $end .

        $default  accept


    state 8

        2 line_list: line_list line .

        $default  reduce using rule 2 (line_list)


    state 9

        5 expression: expression ADD . term

        DOUBLE_LITERAL  shift, and go to state 1

        term                go to state 14
        primary_expression  go to state 6


    state 10

        6 expression: expression SUB . term

        DOUBLE_LITERAL  shift, and go to state 1

        term                go to state 15
        primary_expression  go to state 6


    state 11

        3 line: expression CR .

        $default  reduce using rule 3 (line)


    state 12

        8 term: term MUL . primary_expression

        DOUBLE_LITERAL  shift, and go to state 1

        primary_expression  go to state 16


    state 13

        9 term: term DIV . primary_expression

        DOUBLE_LITERAL  shift, and go to state 1

        primary_expression  go to state 17


    state 14

        5 expression: expression ADD term .
        8 term: term . MUL primary_expression
        9     | term . DIV primary_expression

        MUL  shift, and go to state 12
        DIV  shift, and go to state 13

        $default  reduce using rule 5 (expression)


    state 15

        6 expression: expression SUB term .
        8 term: term . MUL primary_expression
        9     | term . DIV primary_expression

        MUL  shift, and go to state 12
        DIV  shift, and go to state 13

        $default  reduce using rule 6 (expression)


    state 16

        8 term: term MUL primary_expression .

        $default  reduce using rule 8 (term)


    state 17

        9 term: term DIV primary_expression .

        $default  reduce using rule 9 (term)
    ```

### 文件结构概览
* Grammar（文法规则）：编号的语法规则
* Terminals（终结符）：词法单元及其编号
* Nonterminals（非终结符）：语法变量及其编号
* State（状态）：LR自动机的所有状态

### 文法规则部分
1. 每条规则都有一个编号。
2. 其中 0 号规则 `$accept: line_list $end` 是 Yacc 自动添加的起始规则。`$accept` 代表输入的内容，`$end`
代表输入结束，整条规则表示整个输入由 `line_list` 后跟文件结束符 `$end` 组成。

### 终结符部分
1. 代码及注释
    ```
    Nonterminals, with rules where they appear

    $end (0) 0                # 文件结束符（内部编号0）
    error (256)               # 错误处理符号
    DOUBLE_LITERAL (258) 10   # 浮点数常量，出现在规则10
    ADD (259) 5               # '+'，出现在规则5
    SUB (260) 6               # '-'，出现在规则6
    MUL (261) 8               # '*'，出现在规则8
    DIV (262) 9               # '/'，出现在规则9
    CR (263) 3                # 换行符，出现在规则3
    ```
2. 括号中是终结符的编号，从 258 开始是用户定义的终结符的编号。

### 非终结符部分
1. 代码及注释
    ```
    Nonterminals, with rules where they appear

    $accept (9)                                
        on left: 0                             # 出现在规则0左侧
    line_list (10)
        on left: 1 2, on right: 0 2            # 出现在规则1-2左侧，规则0和2右侧
    line (11)
        on left: 3, on right: 1 2              # 出现在规则3左侧，规则1-2右侧
    expression (12)
        on left: 4 5 6, on right: 3 5 6        # 出现在规则4-6左侧，规则3/5/6右侧
    term (13)                                  
        on left: 7 8 9, on right: 4 5 6 8 9    # 出现在规则7-9左侧，规则4-6/8-9右侧
    primary_expression (14)                    
        on left: 10, on right: 7 8 9           # 出现在规则10左侧，规则7-9右侧
    ```

### 状态部分
#### 状态表示法
* `.` 符号：表示当前分析位置
* `shift`：移进动作，消耗一个输入符号，进入新状态
* `reduce`：归约动作，用规则右侧替换为左侧非终结符
* `go to`：跳转动作，归约后进入新状态
* `accept`：接受输入，分析成功

#### state 0
由三部分组成，分别是产生式、动作表和跳转表。

##### 产生式
1. `0 $accept: . line_list $end`
2. 最开始的数字是产生式编号，可以在规约动作中使用。例如 `reduce using rule 10` 就是使用编号是 10 的产生式进行规约。
3. 右部第一个符号为 `.`，表示当前分析位置。它左边没有其他内容，因为这是初始状态，之前没有任何内容。
4. `.` 之后是 `line_list`，也就是程序接收到的所有输入。
5. 最后的 `$end` 表示输入结束（EOF）。也就是接收到了所有的输入。
6. 右部规约为 `$accept`，也就是程序接受的输入。

##### 动作表
1. `DOUBLE_LITERAL  shift, and go to state 1`
2. 这里只有一个动作，表示看到 `DOUBLE_LITERAL` token，就将其移进到分析栈，并进入状态 1。
3. 之所以只有这一个动作，是因为我们这里的计算器程序只能以数字开头，其他类型的终结符（ADD、SUB、MUL、DIV、CR）都是语法错误。（我们没有定义括号，否则括号也可以作为开头）

##### 跳转表
1. 代码
    ```
    line_list           go to state 2
    line                go to state 3
    expression          go to state 4
    term                go to state 5
    primary_expression  go to state 6
    ```
2. TODO, 要看明白这里看起来需要一些更底层的知识。


##  4. <a name='-1'></a>冲突
TODO


##  5. <a name='-1'></a>错误处理
1. 最省事的解决方法之一就是，一旦出错，立即使用 `exit()` 退出。
2. 但是对于计算器来说，是需要与用户互动，如果输错了一点程序就强制退出的话，对用户也太不友好了。因此我们可以利用 yacc 的功能实现一个简单的错误恢复机制。
3. 首先在 `mycalc.y` 的非终结符 `line` 的语法规则中，追加下面的部分
    ```yacc
    line
        : expression CR
        {
            printf(">>%lf\n", $1);
        }
        | error CR
        {
            yyclearin;
            yyerrok;
        }
        ;
    ```
4.  `error` 记号是匹配错误的特殊记号。 `error` 可以后接 `CR`（换行符），这样书写可以匹配包含了错误的所有记号以及行尾。
5. 动作中的 `yyclearin` 会丢弃预读的记号，而 `yyerrok` 则会通知 yacc 程序已经从错误状态恢复了。
