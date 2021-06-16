# Fundamentals


<!-- TOC -->

- [Fundamentals](#fundamentals)
    - [编译和链接](#%E7%BC%96%E8%AF%91%E5%92%8C%E9%93%BE%E6%8E%A5)
    - [简单程序的一般形式](#%E7%AE%80%E5%8D%95%E7%A8%8B%E5%BA%8F%E7%9A%84%E4%B8%80%E8%88%AC%E5%BD%A2%E5%BC%8F)
        - [指令](#%E6%8C%87%E4%BB%A4)
        - [函数](#%E5%87%BD%E6%95%B0)
        - [语句](#%E8%AF%AD%E5%8F%A5)
            - [只有声明语句可以放在全局作用域里面](#%E5%8F%AA%E6%9C%89%E5%A3%B0%E6%98%8E%E8%AF%AD%E5%8F%A5%E5%8F%AF%E4%BB%A5%E6%94%BE%E5%9C%A8%E5%85%A8%E5%B1%80%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%87%8C%E9%9D%A2)
    - [变量和赋值](#%E5%8F%98%E9%87%8F%E5%92%8C%E8%B5%8B%E5%80%BC)
        - [类型](#%E7%B1%BB%E5%9E%8B)
        - [声明](#%E5%A3%B0%E6%98%8E)
        - [赋值](#%E8%B5%8B%E5%80%BC)
        - [显示变量的值](#%E6%98%BE%E7%A4%BA%E5%8F%98%E9%87%8F%E7%9A%84%E5%80%BC)
        - [取整数](#%E5%8F%96%E6%95%B4%E6%95%B0)
        - [初始化](#%E5%88%9D%E5%A7%8B%E5%8C%96)
        - [显示表达式的值](#%E6%98%BE%E7%A4%BA%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E5%80%BC)
    - [读入输入](#%E8%AF%BB%E5%85%A5%E8%BE%93%E5%85%A5)
        - [示例](#%E7%A4%BA%E4%BE%8B)
    - [定义常量的名字](#%E5%AE%9A%E4%B9%89%E5%B8%B8%E9%87%8F%E7%9A%84%E5%90%8D%E5%AD%97)
    - [标识符](#%E6%A0%87%E8%AF%86%E7%AC%A6)
        - [关键字](#%E5%85%B3%E9%94%AE%E5%AD%97)
    - [References](#references)

<!-- /TOC -->


## 编译和链接
1. C 程序文件 `test.c` 需要转化为机器可以执行的形式。对于 C 程序来说，通常包含下列3个步骤
    1. **预处理**。首先程序会被送交给 **预处理器**（preprocessor）。预处理器执行以 `#` 开头的命令（通常称为 **指令**）。预处理器有点类似于编辑器，它可以给程序添加内容，也可以对程序进行修改。
    2. **编译**。修改后的程序现在可以进入 **编译器**（compiler）了。编译器会把程序翻译成机器指令（即 **目标代码**）。然而，这样的程序还是不可以运行的。
    3. **链接**。在最后一个步骤中，**链接器**（linker）把由编译器产生的目标代码和所需的其他附加代码整合在一起，这样才最终产生了完全可执行的程序。这些附加代码包括程序中用到的库函数（如 `printf` 函数）。



## 简单程序的一般形式
即使是最简单的 C 程序也依赖3个关键的语言特性：指令（在编译前修改程序的编辑命令）、函数（被命名的可执行代码块，如 `main` 函数）和语句（程序运行时执行的命令）。例如下面的示意程序 `pun.c`
```cpp
#include <stdio.h> // 指令

int main(void) 
{
    printf("To C, or not to C: that is the question.\n"); // 语句
    return 0; // 语句                                            
}
```

### 指令
1. 在编译 C 程序之前，预处理器会首先对其进行编辑。我们把预处理器执行的命令称为指令。
2. 程序 `pun.c` 由下列这行指令开始：
    ```cpp
    #include <stdio.h>
    ```
3. 这条指令说明，在编译前把 `<stdio.h>` 中的信息 “include” 到程序中。`<stdio.h>` 包含了关于 C 标准输入/输出库的信息。
4. C语言拥有大量类似于 `<stdio.h>` 的 **头**（header），每个头都包含一些标准库的内容。这段程序中包含 `<stdio.h>` 的原因是：C 语言不同于其他的编程语言，它没有内置的 “读” 和 “写” 命令。输入/输出功能由标准库中的函数实现。
5. 所有指令都是以字符 `#` 开始的。这个字符可以把 C 程序中的指令和其他代码区分开来。
6. 指令默认只占一行，每条指令的结尾没有分号或其他特殊标记。

### 函数
1. **函数** 类似于其他编程语言中的 “过程” 或 “子例程”，它们是用来构建程序的构建块。事实上，C 程序就是函数的集合。
2. 函数分为两大类：一类是程序员编写的函数，另一类则是作为 C 语言实现的一部分提供的函数。我们把后者称为 **库函数**（library function），因为它们属于一个由编译器提供的函数 “库”。
3. 虽然一个 C 程序可以包含多个函数，但只有 `main` 函数是必须有的。`main` 函数是非常特殊的：在执行程序时系统会自动调用 `main` 函数。
4. `pun.c` 程序的 `main` 函数前面的 `int` 表明该函数将返回一个整数值。圆括号中的 `void` 表明 `main` 函数没有参数。
5. `main` 函数会在程序终止时向操作系统返回一个状态码。语句 `return 0;` 有两个作用：一是使 `main` 函数终止（从而结束程序），二是指出 `main` 函数的返回值是 `0`。
6. 如果 `main` 函数的末尾没有 `return` 语句，程序仍然能终止。但是，许多编译器会产生一条警告信息（因为函数应该返回一个整数却没有这么做）。

### 语句
1. 语句是程序运行时执行的命令。
2. C 语言规定每条语句都要以分号结尾。（就像任何好的规则一样，这条规则也有一个例外：后面会遇到的复合语句就不以分号结尾。）
3. 由于语句可以连续占用多行，有时很难确定它的结束位置，因此用分号来向编译器显示语句的结束位置。但指令通常都只占一行，因此不需要用分号结尾。

#### 只有声明语句可以放在全局作用域里面
1. 之前遇到一个下面的错误，开始还以为是函数指针相关的错误
    ```cpp
    #include <stdio.h>

    void f (int n) {}
    void (*pf)(int);

    pf = f; // 在这里报错
    
    int main()
    {
        // pf = f; // 在这里正常

        return 0;
    }
    ```
2. 报错如下
    ```sh
    pun.c:6:1: warning: data definition has no type or storage class
    pf = f; // 在这里报错
    ^~
    pun.c:6:1: warning: type defaults to 'int' in declaration of 'pf' [-Wimplicit-int]
    pun.c:6:1: error: conflicting types for 'pf'
    pun.c:4:8: note: previous declaration of 'pf' was here
    void (*pf)(int);
            ^~
    pun.c:6:6: warning: initialization makes integer from pointer without a cast [-Wint-conversion]
    pf = f; // 在这里报错
        ^
    ```
3. 警告信息 “6:1: warning: data definition has no type or storage class” 在说 `pf = f;` 没有给 `pf` 声明类型。因为不允许在全局作用于执行这样的赋值语句，所以编译器就认为这时一个变量声明语句，在它发现声明前面没有类型时就给出了这样的警告。
4. 但这还只是警告，因为没有声明类型的变量会被默认为 `int` 类型，下一句警告说明了这一点：“warning: type defaults to 'int' in declaration of 'pf' [-Wimplicit-int]”。
5. 但之后出现了真正的错误：“error: conflicting types for 'pf'”。因为之前 `pf` 声明为了指向函数的指针，这里又声明为 `int` 类型，所以发生了冲突。
6. 因为现在 `pf` 是 `int` 类型，但是用函数 `f` 指针初始化时，给出了最后的警告：“warning: initialization makes integer from pointer without a cast [-Wint-conversion]”。


## 变量和赋值
### 类型
1. 每一个变量都必须有一个 **类型**（type）。类型用来说明变量所存储的数据的种类。
2. 由于类型会影响变量的存储方式以及允许对变量进行的操作，所以选择合适的类型是非常关键的。数值型变量的类型决定了变量所能存储的最大值和最小值，同时也决定了是否允许在小数点后出现数字。

### 声明
1. 在使用变量之前必须对其进行声明（为编译器所做的描述）。
2. 为了声明变量，首先要指定变量的类型，然后说明变量的名字。例如，我们可能这样声明变量 `height` 和 `profit`：
    ```cpp
    int height;
    float profit;
    ```
3. 如果几个变量具有相同的类型，就可以把它们的声明合并：
    ```cpp
    int height, length, width, volume;
    float profit, loss;
    ```
4. 在 C99 中，声明可以不在语句之前。例如，`main` 函数中可以先有一个声明，后面跟一条语句，然后再跟一个声明。

### 赋值
1. 包含小数点但却不以 `f` 结尾的常量是 `double`（double precision的缩写）型的。`double` 型的值比 `float` 型的值存储得更精确，并且可以存储比 `float` 型更大的值，因此在给 `float` 型变量赋值时需要加上字母 `f`
    ```cpp
    profit = 2150.48f;
    ```
2. 如果不加 `f`，编译器可能会生成一条警告消息，告诉你存储到 `float` 型变量中的数可能超出了该变量的取值范围。

### 显示变量的值
1. 打印 `int` 类型的变量，占位符 `%d` 用来指明在显示过程中变量 `height` 的值的显示位置
    ```cpp
    printf("Height: %d\n", height);
    ```
2. `%d` 仅用于 `int` 型变量。如果要显示 `float` 型变量，需要用 `%f` 来代替 `%d`
    ```cpp
    float profit;
    profit = 2150.48f;
    printf("Profit: %f\n", profit); // Profit: 2150.479980
    ```
3. 默认情况下，`%f` 会显示出小数点后 6 位数字。如果要强制 `%f` 显示小数点后 $p$ 位数字，可以把 $.p$ 放置在 `%` 和 `f` 之间
    ```cpp
    printf("Profit: %.2f\n", profit); // Profit: 2150.48
    ```
4. C 语言没有限制调用一次 `printf` 可以显示的变量的数量
    ```cpp
    int height = 123;
    float profit = 2150.48f;
    printf("Height: %d Profit: %.2f\n", height, profit); // Height: 123 Profit: 2150.48
    ```

### 取整数
1. 在 C 语言中，如果两个整数相除，结果会向下取证
    ```cpp
    int x = 100;
    int y = 17;

    int quotient_int = x / y;
    float quotient_float = x / y;
    
    printf("Quotient_int: %d;\nQuotient_float: %.1f.\n", quotient_int, quotient_float); 
    // Quotient_int: 5;    
    // Quotient_float: 5.0.
    ```
2. 如果希望向上取整，一种解决方案是给被除数加上 $除数-1$，这样保证了结果会达到或超过准确结果之上的整数
    ```cpp
    int x = 100;
    int y = 17;

    int pad = y - 1;
    int quotient_int = (x + pad) / y;
    float quotient_float = (x + pad) / y;
    
    printf("Quotient_int: %d;\nQuotient_float: %.1f.\n", quotient_int, quotient_float); 
    // Quotient_int: 6;    
    // Quotient_float: 6.0.
    ```

### 初始化
1. 当程序开始执行时，某些变量会被自动设置为零，而大多数变量则不会。没有默认值并且尚未在程序中被赋值的变量是 **未初始化的** （uninitialized）。
2. 如果试图访问未初始化的变量（例如，用 `printf` 显示变量的值，或者在表达式中使用该变量），可能会得到不可预知的结果，如 2 568、-30 891 或者其他同样没有意义的数值。在某些编译器中，可能会发生更坏的情况（甚至是程序崩溃）
    ```cpp
    int test;
    printf("%d\n", test); // 4194432
    ```
3. 在同一个声明中可以对任意数量的变量进行初始化：
    ```cpp
    int height = 8, length = 12, width = 10;
    ```

### 显示表达式的值
`printf` 的功能不局限于显示变量中存储的数，它可以显示任意数值表达式的值
```cpp
int height = 8, length = 12, width = 10;
printf("%d\n", height * length * width); // 960
```


## 读入输入
1. 为了获取输入，就要用到 `scanf` 函数。它是 C 函数库中与 `printf` 相对应的函数。
2. `scanf` 中的字母 `f` 和 `printf` 中的字母 `f` 含义相同，都是表示 “格式化” 的意思。`scanf` 函数和 `printf` 函数都需要使用 **格式串**（format string）来指定输入或输出数据的形式。`scanf` 函数需要知道将获得的输入数据的格式，而 `printf` 函数需要知道输出数据的显示格式。
3. 为了读入一个 `int` 型值，可以使用下面的 `scanf` 函数调用：
    ```cpp
    scanf("%d", &i);  /* reads an integer; stores into i */ 
    ```
4. 其中，字符串 `"%d"` 说明 `scanf` 读入的是一个整数，而 `i` 是一个 `int` 型变量，用来存储 `scanf` 读入的输入。
5. 读入一个 `float` 型值时，需要一个形式略有不同的 `scanf` 调用：
    ```cpp
    scanf("%f", &x);  /* reads a float value; stores into x */
    ```
6. `%f` 只用于 `float` 型变量，因此这里假设 `x` 是一个 `float` 型变量。字符串 `"%f"` 告诉 `scanf` 函数去寻找一个 `float` 格式的输入值（此数可以含有小数点，但不是必须含有）。

### 示例
1. 代码
    ```cpp
    /* Computes the dimensional weight of a box from input provided by the user */

    #include <stdio.h>

    int main(void)
    {
        int height, length, width, volume, weight;

        printf("Enter height of box: ");
        scanf("%d", &height);
        printf("Enter length of box: ");
        scanf("%d", &length);
        printf("Enter width of box: ");
        scanf("%d", &width);
        volume = height * length * width;
        weight = (volume + 165) / 166;

        printf("Volume (cubic inches): %d\n", volume);
        printf("Dimensional weight (pounds): %d\n", weight);

        return 0;
    }
    ```
2. 提示用户输入的消息（提示符）通常不应该以换行符结束，因为我们希望用户在同一行输入。这样，当用户敲回车键时，光标会自动移动到下一行，因此就不需要程序通过显示换行符来终止当前行了。
3. 这个程序还存在一个问题：如果用户输入的不是数值，程序就会出问题。


## 定义常量的名字
1. 当程序含有常量时，建议给这些常量命名。可以采用称为 **宏定义**（macro definition）的特性给常量命名：
    ```cpp
    #define INCHES_PER_POUND 166
    ```
2. 这里的 `#define` 是预处理指令，类似于前面所讲的 `#include`，因而在此行的结尾也没有分号。
3. 当对程序进行编译时，预处理器会把每一个宏替换为其表示的值。例如，语句
    ```cpp
    weight = (volume + INCHES_PER_POUND - 1) / INCHES_PER_POUND;
    ```
    将变为
    ```cpp
    weight = (volume + 166 - 1) / 166;
    ```
4. 此外，还可以利用宏来定义表达式。当宏包含运算符时，必须用括号把表达式括起来
    ```cpp
    #define RECIPROCAL_OF_PI (1.0f / 3.14159f)
    ```
5. 注意，宏的名字只用了大写字母。这是大多数 C 程序员遵循的规范，但并不是 C 语言本身的要求。


## 标识符
1. 在编写程序时，需要对变量、函数、宏和其他实体进行命名。这些名字称为 **标识符**（identifier）。
2. 在 C 语言中，标识符可以含有字母、数字和下划线，但是必须以字母或者下划线开头。在 C99 中，标识符还可以使用某些 “通用字符名”。

### 关键字
1. 因为 C 语言是区分大小写的，除了 C99 关键字 `_Bool`、`_Complex` 和 `_Imaginary` 以外的关键字都是纯小写。标准库中函数（如 `printf`）的名字也只能包含小写字母。
2. 请注意有关标识符的其他限制。某些编译器把特定的标识符（如 `asm`）视为附加关键字。属于标准库的标识符也是受限的。误用这些名字可能会导致编译或链接出错。以下划线开头的标识符也是受限的。


## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)