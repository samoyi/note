# Loops


<!-- TOC -->

- [Loops](#loops)
    - [`for` 语句](#for-语句)
        - [C99 中的 `for` 语句](#c99-中的-for-语句)
    - [退出循环](#退出循环)
        - [`goto` 语句](#goto-语句)
            - [`goto` 语句有什么不好？](#goto-语句有什么不好)
    - [空语句](#空语句)
        - [非预期的空语句](#非预期的空语句)
    - [References](#references)

<!-- /TOC -->


## `for` 语句
### C99 中的 `for` 语句
1. 在 C99 中，`for` 语句的第一个表达式可以替换为一个声明，这一特性使得程序员可以声明一个用于循环的变量：
    ```cpp
    for (int i = 0; i < n; i++)
        ...
    ```
2. 变量 `i` 不需要在该语句前进行声明。事实上，如果变量 `i` 在之前已经进行了声明，这个语句将创建一个新的 `i` 且该值仅用于循环内。
`for` 语句声明的变量不可以在循环外访问：
    ```cpp
    for (int i = 0; i < n; i++){
        ...
        printf("%d", i);     /*legal; i is visible inside loop */
        ...
    }
    printf("%d", i);       /***WRONG***/
    ```
3. 让 `for` 语句声明自己的循环控制变量通常是一个好办法：这样很方便且程序的可读性更强，但是如果在 `for` 循环退出之后还要使用该变量，则只能使用以前的 `for` 语句格式。


## 退出循环
### `goto` 语句
1. `goto` 语句可以跳转到函数中任何有标号的语句处。（C99 增加了一条限制：`goto` 语句不可以用于绕过变长数组的声明。）
2. 执行语句 `goto L;`，控制会转移到标号 `L` 后面的语句上，而且该语句必须和 `goto` 语句在同一个函数中
    ```cpp
    printf("A\n");
    goto C;

    printf("B");

    C: printf("Skip B \n");

    printf("C \n");
    ```
3. `goto` 语句在早期编程语言中很常见，但在日常 C 语言编程中却很少用到它了。`break`、`continue`、`return` 语句（本质上都是受限制的 `goto` 语句）和 `exit` 函数足以应付在其他编程语言中需要 `goto` 语句的大多数情况。
4. 虽然如此，`goto` 语句偶尔还是很有用的。考虑从包含 `switch` 语句的循环中退出的问题。正如前面看到的那样，`break` 语句不会产生期望的效果：它可以跳出 `switch` 语句，但是无法跳出循环。`goto` 语句解决了这个问题：
    ```cpp
    while (...) {
        switch (...) {
            ...
            goto loop_done;     /* break won't work here */
            ...
        }
    }
    loop_done: ...
    ```

#### `goto` 语句有什么不好？
1. `goto` 语句不是天生的魔鬼，只是通常它有更好的替代方式。使用过多 `goto` 语句的程序会迅速退化成“垃圾代码”，因为控制可以随意地跳来跳去。垃圾代码是非常难于理解和修改的。
2. 由于 `goto` 语句既可以往前跳又可以往后跳，所以使得程序难于阅读。（`break` 语句和 `continue` 语句只是往前跳。）含有`goto` 语句的程序经常要求阅读者来回跳转以理解代码的控制流。
3. `goto` 语句使程序难于修改，因为它可能会使某段代码用于多种不同的目的。例如，对于前面有标号的语句，既可以在执行完其前一条语句后到达，也可以通过多条 `goto` 语句中的一条到达。


## 空语句
### 非预期的空语句
不小心在 `if`、`while` 或 `for` 语句的圆括号后放置分号会创建空语句，从而造成 `if`、`while` 或 `for` 语句提前结束。
* `if` 语句中，如果在圆括号后边放置分号，无论控制表达式的值是什么，`if` 语句执行的动作显然都是一样的： 
    ```cpp
    if (d == 0);
    printf("Error: Division by zero\n");
    ```
    因为 `printf` 函数调用不在 `if` 语句内，所以无论 `d` 的值是否等于 0，都会执行此函数调用。
* `while` 语句中，如果在圆括号后边放置分号，会产生无限循环：
    ```cpp
    i = 10;
    while (i > 0);
    {
        printf("T minus %d and counting\n", i);
        --i;
    }
    ```
    另一种可能是循环终止，但是在循环终止后只执行一次循环体语句
    ```cpp
    i = 11;
    while (--i > 0);
    printf("T minus %d and counting\n", i);
    // 只会打印一次，值为 "T minus 0 and counting"
    ```
* `for` 语句中，在圆括号后边放置分号会导致只执行一次循环体语句：
    ```cpp
    for (i = 10; i > 0; i--);
    printf("T minus %d and counting\n", i);
    ```


## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)