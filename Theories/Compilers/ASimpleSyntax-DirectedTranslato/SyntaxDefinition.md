# 语法定义

<!-- vscode-markdown-toc -->
* [文法定义](#)
* [推导](#-1)
* [语法分析树](#-1)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


## <a name=''></a>文法定义
1. **上下文无关文法**（context-free grammar）或简称文法，用于表明一个语言的语法。在《编译原理》一书中用于组织编译器前端。
2. 文法描述了大多数程序设计语言的 **层次化结构**。
3. 例如 Java 的 if-else 语句具有如下形式
    ```
    if (expression) statement else statement
    ```
4. 如果我们用变量 `expr` 来表示表达式，用变量 `stmt` 来表示语句，上述规则可以表示为
    ```
    stmt -> if ( expr ) stmt else stmt
    ```
    其中的箭头可以读作 “可以具有如下形式（can have the form）”
5. 这种表示称为 **产生式（production）**。在一个产生式中，像关键字 `if` 和括号这样的词法元素称为 **终端（terminal）**；像 `expr` 和 `stmt` 这样的变量，表示终端的序列，称为 **非终端（nonterminal）**。（原书翻译为 “终结符号”，但显示它并没有结束的意思）

### 文法有四部分组件
* 终端的集合。也被成为 tokens。在使用文法定义一个语言时，终端是其中的基础符号。
* 非终端的集合。也被称为 syntactic variables。每个非终端都表示了一组终端字符串的集合。
* 产生式的集合。每个生产式由以下元素组成：
    * 一个称为该产生式的 **head** 或 **left side** 的非终端；
    * 一个箭头；
    * 一个由终端和非终端组成的序列，称为该产生式的 **body** 或 **right side**

### 产生式
1. 产生式的用途是表示某个结构的书写形式。
2. 如果一个产生式的 head 指代一个结构，则该产生式的 body 就表示出该结构的书写形式。


## <a name='-1'></a>推导


## <a name='-1'></a>语法分析树


## 二义性


