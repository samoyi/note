# Functions


<!-- TOC -->

- [Functions](#functions)
    - [函数的定义和调用](#%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9A%E4%B9%89%E5%92%8C%E8%B0%83%E7%94%A8)
        - [函数调用只能在其他函数里](#%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E5%8F%AA%E8%83%BD%E5%9C%A8%E5%85%B6%E4%BB%96%E5%87%BD%E6%95%B0%E9%87%8C)
    - [函数声明](#%E5%87%BD%E6%95%B0%E5%A3%B0%E6%98%8E)
    - [实际参数](#%E5%AE%9E%E9%99%85%E5%8F%82%E6%95%B0)
        - [实际参数的转换](#%E5%AE%9E%E9%99%85%E5%8F%82%E6%95%B0%E7%9A%84%E8%BD%AC%E6%8D%A2)
        - [数组型实际参数](#%E6%95%B0%E7%BB%84%E5%9E%8B%E5%AE%9E%E9%99%85%E5%8F%82%E6%95%B0)
        - [为什么其他维的长度必须指定](#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%85%B6%E4%BB%96%E7%BB%B4%E7%9A%84%E9%95%BF%E5%BA%A6%E5%BF%85%E9%A1%BB%E6%8C%87%E5%AE%9A)
        - [变长数组形式参数](#%E5%8F%98%E9%95%BF%E6%95%B0%E7%BB%84%E5%BD%A2%E5%BC%8F%E5%8F%82%E6%95%B0)
        - [在数组参数声明中使用 static](#%E5%9C%A8%E6%95%B0%E7%BB%84%E5%8F%82%E6%95%B0%E5%A3%B0%E6%98%8E%E4%B8%AD%E4%BD%BF%E7%94%A8-static)
        - [复合字面量](#%E5%A4%8D%E5%90%88%E5%AD%97%E9%9D%A2%E9%87%8F)
    - [return 语句](#return-%E8%AF%AD%E5%8F%A5)
    - [程序终止](#%E7%A8%8B%E5%BA%8F%E7%BB%88%E6%AD%A2)
        - [exit 函数](#exit-%E5%87%BD%E6%95%B0)
    - [习题](#%E4%B9%A0%E9%A2%98)
    - [References](#references)

<!-- /TOC -->


## 函数的定义和调用
1. 以一个计算两个 `double` 类型数值的平均值的函数为例
    ```cpp
    double average(double a, double b)
    {
        return (a + b) / 2;
    }
    ```
2. 在函数开始处放置的单词 `double` 表示 `average` 函数的 **返回类型**（return type），也就是每次调用该函数时返回数据的类型。 
3. 标识符 `a` 和标识符 `b`（即函数的 **形式参数**（parameter））表示在调用 `average` 函数时需要提供的两个数。每一个形式参数都必须有类型（正像每个变量有类型一样），这里选择了 `double` 作为 `a` 和 `b` 的类型。
4. 函数的形式参数本质上是变量，其初始值在调用函数的时候才提供。
5. 函数也可以没有形式参数
    ```cpp
    void print_pun(void)
    {
        printf("To C, or not to C: that is the question.\n");
    }
    ```
6. 每个函数都有一个用花括号括起来的执行部分，称为 **函数体**（body）。`average` 函数的函数体由一条 `return` 语句构成。执行这条语句将会使函数 “返回” 到调用它的地方，表达式 `(a+b)/2` 的值将作为函数的返回值。
7. 函数不能返回数组，但关于返回类型没有其他限制。
8. 如果省略返回类型，C89 会假定函数返回值的类型是 `int` 类型， 但在 C99 中这是不合法的。
7. 为了调用函数，需要写出函数名及跟随其后的 **实际参数**（argument）列表。
8. 为了指示出不带返回值的函数，需要指明这类函数的返回类型是 `void`。（`void` 是一种没有值的类型。）
9. C 语言不允许一个函数的定义出现在另一个函数体中。这个限制可以使编译器简单化。在 GUN C 中有支持嵌套函数的扩展，但因为不是普遍支持，所以不具有可移植性。

### 函数调用只能在其他函数里
1. 尝试下面调用时报错
    ```cpp
    malloc(10000);


    int main(void)
    {

        return 0;
    }
    ```
2. VSCode 提示：“应输入类型说明符”；尝试编译运行时，报错 `error: expected declaration specifiers or '...' before numeric constant`。
3. 这两个提示都说明，编译器把这一行当做类型声明了，根本不认为它是函数调用。因为不能再非顶层调用函数。


## 函数声明
1. 为了避免定义前调用的问题，一种方法是使每个函数的定义都出现在其调用之前。可惜的是，有时候无法进行这样的安排；而且即使可以这样安排，程序也会因为函数定义的顺序不自然而难以阅读。
2. 幸运的是，C 语言提供了一种更好的解决办法：在调用前声明每个函数。**函数声明**（function declaration）使得编译器可以先对函数进行概要浏览，而函数的完整定义以后再给出。
3. 函数声明类似于函数定义的第一行，不同之处是在其结尾处有分号：
    ```cpp
    #include <stdio.h>

    double average(double a, double b);     // DECLARATION 

    int main(void)
    {
        double x,  y,  z;

        printf("Enter three numbers:  ");
        scanf("%lf%lf%lf",  &x,  &y,  &z);
        printf("Average of %g and %g: %g\n", x, y, average(x, y));
        printf("Average of %g and %g: %g\n", y, z, average(y, z));
        printf("Average of %g and %g: %g\n", x, z, average(x, z));

        return 0;
    }

    double average(double a, double b)   // DEFINITION
    {
        return  (a + b)  / 2;
    }
    ```
4. 为了与过去的那种圆括号内为空的函数声明风格相区别，我们把正在讨论的这类函数声明称为 **函数原型**（function prototype）。原型为如何调用函数提供了完整的描述：提供了多少实际参数，这些参数应该是什么类型，以及返回的结果是什么类型。
5. 函数原型不需要说明函数形式参数的名字，只要显示它们的类型就可以了：
    ```cpp
    double average(double, double);
    ```
6. 省略原型中的参数名字通常是出于防御目的。如果恰好有一个宏的名字跟参数一样，预处理时参数的名字会被替换，从而导致相应的原型被破坏。这种情况在一个人编写的小程序中不太可能出现，但在很多人编写的大型应用程序中是可能出现的。
7. 即使使用形参的名字，也不需要和函数定义时的一样。一些程序员利用这一特性，在原型中给参数一个较长名字，然后在实际定义中使用较短的名字。或者，说法语的程序员可以在函数原型中使用英文名字，然后在函数定义中切换成更为熟悉的法语名字。
8. C99 遵循这样的规则：在调用一个函数之前，必须先对其进行声明或定义。调用函数时，如果此前编译器未见到该函数的声明或定义，会导致出错。
9. 如果几个函数具有相同的返回类型，可以把它们的声明合并
    ```cpp
    void print_pun(void), print_count(int n);
    ```
    事实上，C 语言甚至允许把函数声明和变量声明合并在一起：
    ```cpp
    double x, y, average(double a, double b);
    ```
    但是，此种方式的合并声明通常不是个好方法，它可能会使得程序有点混乱。
    

## 实际参数
1. 在 C 语言中，实际参数是 **通过值传递** 的：调用函数时，计算出每个实际参数的值并且把它赋值给相应的形式参数。
2. 在函数执行过程中，对形式参数的改变不会影响实际参数的值，这是因为形式参数中包含的是实际参数值的副本。从效果上来说，每个形式参数的行为好像是把变量初始化成与之匹配的实际参数的值。
3. 实际参数按值传递既有利也有弊。因为形式参数的修改不会影响到相应的实际参数，所以可以把形式参数作为函数内的变量来使用，这样可以减少真正需要的变量的数量。
4. 可惜的是，C 语言关于实际参数按值传递的要求使它很难编写某些类型的函数。例如，假设我们需要一个函数，它把 `double` 型的值分解成整数部分和小数部分。因为函数无法返回两个数，所以可以尝试把两个变量传递给函数并且修改它们：
    ```cpp
    void decompose(double x, long int_part, double frac_part)
    {
        int_part = (long) x;   /* drops the fractional part of x */
        frac_part = x - int_part;
    }
    ```
    假设采用下面的方法调用这个函数：
    ```cpp
    decompose(3.14159, i, d);
    ```
    可惜的是，变量 `i` 和 `d` 不会因为赋值给 `int_part` 和 `frac_part` 而受到影响，所以它们在函数调用前后的值是完全一样的。

### 实际参数的转换
C 语言允许在实际参数的类型与形式参数的类型不匹配的情况下进行函数调用。管理如何转换实际参数的规则与编译器是否在调用前遇到函数的原型（或者函数的完整定义）有关
* **编译器在调用前遇到原型**。就像使用赋值一样，每个实际参数的值被隐式地转换成相应形式参数的类型。例如，如果把 `int` 类型的实际参数传递给期望得到 `double` 类型数据的函数，那么实际参数会被自动转换成 `double` 类型。
* **编译器在调用前没有遇到原型**。编译器执行 **默认的实际参数提升**：
    * 把 `float` 类型的实际参数转换成 `double` 类型
    * 执行整值提升，即把 `char` 类型和 `short` 类型的实际参数转换成 `int` 类型。（ C99 实现了整数提升。）

### 数组型实际参数
1. 数组经常被用作实际参数。当形式参数是一维数组时，可以（而且是通常情况下）不说明数组的长度：
    ```cpp
    int f(int a[])     /* no length specified */
    {
        ...
    }
    ```
     实际参数可以是元素类型正确的任何一维数组。
2. 指定长度并不会带来什么其他好处。编译器不会检查参数实际上的长度，所以不会增加安全性。事实上，这种做法会产生误导，因为这种写法暗示只能把指定长度的数组传递给函数，但实际上可以传递任意长度的数组。
3. 只有一个问题：`f` 函数如何知道数组是多长呢？可惜的是，C 语言没有为函数提供任何简便的方法来确定传递给它的数组的长度；如果函数需要，我们必须把长度作为额外的参数提供出来
    ```cpp
    int sum_array(int a[], int n)
    {
        int i, sum = 0;

        for (i = 0; i < n; i++)
            sum += a[i];

        return sum;
    }
    ```
4. 虽然可以用运算符 `sizeof` 计算出数组变量的长度，但是它无法给出关于数组型形式参数的正确答案：
    ```cpp
    int f(int a[])
    {
        int len = sizeof(a) / sizeof(a[0]);
        /*** WRONG: not the number of elements in a ***/
        // 编译器给出了警告：“warning: 'sizeof' on array function parameter 'a' will return size of 'int *'”
        printf("%d\n", len);
    }

    int main(void)
    {
        int a[] = {1, 3, 5, 7, 9};
        f(a); // 1 // 指针的 size 是 4，整数数组项的 size 也是 4

        return 0;
    }
    ```
5. `sum_array` 函数的原型有下列形式：
    ```cpp
    int sum_array(int a[], int n);
    ```
    通常情况下，如果愿意可以省略形式参数的名字：
    ```cpp
    int sum_array(int [], int);
    ```
6. 函数无法检测传入的数组长度的正确性。我们可以利用这一点来告诉函数实际需要操作的数组部分。假设，虽然数组 `b` 有 100 个元素，但是实际仅存储了 50 个数。通过书写下列语句可以对数组的前 50 个元素进行求和：
    ```cpp
    total = sum_array(b, 50);   /* sums first 50 elements */
    ```
    `sum_array` 函数将忽略另外50个元素。（事实上，`sum_array` 函数甚至不知道另外 50 个元素的存在！）
7. 和 JS 里的情况一样，因为数组参数传递的是指针，所以在函数内修改形参的数组也会影响外面实参的数组。
8. 如果形式参数是多维数组，声明参数时只能省略第一维的长度。例如，如果修改 `sum_array` 函数使得 `a` 是一个二维数组，我们可以不指出行的数量，但是必须指定列的数量：
    ```cpp
    #define LEN 10

    int sum_two_dimensional_array(int a[][LEN], int n)
    {
        int i, j, sum = 0;

        for (i = 0; i < n; i++)
            for (j = 0; j < LEN; j++)
              sum += a[i][j];

        return sum;
    }
    ```
    不能传递具有任意列数的多维数组是很讨厌的。幸运的是，我们经常可以通过使用指针数组的方式解决这种困难。C99 中的变长数组形式参数则提供了一种更好的解决方案。

### 为什么其他维的长度必须指定
1. 首先，需要知道 C 语言是如何传递数组的。在把数组传递给函数时，是把指向数组第一个元素的指针给了函数。
2. 其次，需要知道取下标运算符是如何工作的。假设 `a` 是要传给函数的一维数组。在书写语句
    ```cpp
    a[i] = 0;
    ```
    时，编译器计算出 `a[i]` 的地址，方法是用 `i` 乘以每个元素的大小，并把乘积加到数组 `a` 表示的地址（传递给函数的指针）上。
3. 这个计算过程没有依靠数组a的长度，这说明了为什么可以在定义函数时忽略数组长度。
4. 那么多维数组怎么样呢？回顾一下就知道，C 语言是按照行主序存储数组的，即首先存储第 0 行的元素，然后是第 1 行的元素，依此类推。假设 `a` 是二维数组型的形式参数，并且写了语句
    ```cpp
    a[i][j] = 0;
    ```
5. 编译器产生指令执行如下：
    1. 用 `i` 乘以数组 `a` 中每行的大小；
    2. 把乘积的结果加到数组 `a` 表示的地址上；
    3. 用 `j` 乘以数组 `a` 中每个元素的大小；
    4. 把乘积的结果加到第二步计算出的地址上。
6. 为了产生这些指令，编译器必须知道 `a` 数组中每一行的大小，行的大小由列数决定。

### 变长数组形式参数
1. 如果使用变长数组形式参数：
    ```cpp
    int sum_array(int n, int a[n])
    {
        ...
    }
    ```
    第一个参数（`n`）的值确定了第二个参数（`a`）的长度。
2. 注意，这里交换了形式参数的顺序，使用变长数组形式参数时参数的顺序很重要。下面的 `sum_array` 函数定义是非法的：
    ```cpp
    int sum_array(int a[n], int n)    /*** WRONG ***/
    {
        ...
    }
    ```
    编译器会在遇到 `int a[n]` 时显示出错消息，因为此前它没有见过 `n`。

3. 对于新版本的 `sum_array` 函数，其函数原型有好几种写法。一种写法是使其看起来跟函数定义一样：
    ```cpp
    int sum_array(int n, int a[n]);      /* Version 1 */
    ```
4. 另一种写法是用 `*`（星号）取代数组长度：
    ```cpp
    int sum_array(int n, int a[*]);      /* Version 2a */
    ```
    使用 `*` 的理由是：函数声明时，形式参数的名字是可选的。如果第一个参数定义被省略了，那么就没有办法说明数组 `a` 的长度是 `n`，而星号的使用则为我们提供了一个线索——数组的长度与形式参数列表中前面的参数相关：
    ```cpp
    int sum_array(int, int [*]);        /* Version 2b */
    ```
5. 另外，方括号中为空也是合法的。在声明数组参数中我们经常这么做：
    ```cpp
    int sum_array(int n, int a[]);      /* Version 3a */
    int sum_array(int, int []);         /* Version 3b */
    ```
    但是让括号为空不是一个很好的选择，因为这样并没有说明 `n` 和 `a` 之间的关系。
6. 一般来说，变长数组形式参数的长度可以是任意表达式。例如，假设我们要编写一个函数来连接两个数组 `a` 和 `b`，要求先复制 `a` 的元素，再复制 `b` 的元素，把结果写入第三个数组 `c`：
    ```cpp
    int concatenate(int m, int n, int a[m], int b[n], int c[m+n])
    {
        ...
    }
    ```
7. 到目前为止，我们所举的例子都是一维变长数组形式参数，变长数组的好处还体现得不够充分。一维变长数组形式参数通过指定数组参数的长度使得函数的声明和定义更具描述性。但是，由于没有进行额外的错误检测，数组参数仍然有可能太长或太短。
8. 如果变长数组参数是多维的则更加实用。之前，我们尝试过写一个函数来实现二维数组中元素相加。原始的函数要求数组的列数固定。如果使用变长数组形式参数，则可以推广到任意列数的情况：
    ```cpp
    int sum_two_dimensional_array(int n, int m, int a[n][m])
    {
    int i, j, sum = 0;

    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++)
            sum += a[i][j];

    return sum;
    }
    ```
9. 这个函数的原型可以是以下几种：
    ```cpp
    int sum_two_dimensional_array(int n, int m, int a[n][m]);
    int sum_two_dimensional_array(int n, int m, int a[*][*]);
    int sum_two_dimensional_array(int n, int m, int a[][m]);
    int sum_two_dimensional_array(int n, int m, int a[][*]);
    ```

### 在数组参数声明中使用 `static` 
1. C99 允许在数组参数声明中使用关键字 `static`。在下面这个例子中，将 `static` 放在数字 3 之前表明数组 `a` 的长度至少可以保证是 `3`：
    ```cpp
    int sum_array(int a[static 3], int n)
    {
        ...
    }
    ```
2. 这样使用 `static` 不会对程序的行为有任何影响。`static` 的存在只不过是一个 “提示”，C 编译器可以据此生成更快的指令来访问数组。（如果编译器知道数组总是具有某个最小值，那么它可以在函数调用时预先从内存中取出这些元素值，而不是在遇到函数内部实际需要用到这些元素的语句时才取出相应的值。）
3. 如果数组参数是多维的，`static` 仅可用于第一维（例如，指定二维数组的行数。）

### 复合字面量 
1. 让我们再来看看 `sum_array` 函数。当调用 `sum_array` 函数时，第一个参数通常是（用于求和的）数组的名字。例如，可以这样调用 `sum_array`：
    ```cpp
    int b[] = {3, 0, 3, 4, 1};
    total = sum_array(b, 5);
    ```
2. 这样写的唯一问题是需要把 `b` 作为一个变量声明，并在调用前进行初始化。如果 `b` 不作它用，这样做其实有点浪费。
3. 在 C99 中，可以使用复合字面量来避免该问题，复合字面量是通过指定其包含的元素而创建的没有名字的数组。下面调用 `sum_array` 函数，第一个参数就是一个复合字面量：
    ```cpp
    total = sum_array((int []){3, 0, 3, 4, 1},5);
    ```
    在这个例子中，复合字面量创建了一个由 5 个整数 `3`, `0`, `3`, `4` 和 `1` 组成的数组。
4. 这里没有对数组的长度进行特别的说明，是由复合字面量的元素个数决定的。当然，也可以做准确说明，如 `(int[4]){1, 9, 2, 1}`，这种方式等同于 `(int[]){1, 9, 2, 1}`。
5. 复合字面量类似于应用于初始化式的强制转换。事实上，复合字面量和初始化式遵守同样的规则。复合字面量可以包含指示符，就像指定初始化式一样；可以不提供完全的初始化（未初始化的元素默认被初始化为零）。例如，复合字面量 `(int[10]){8, 6}` 有 10 个元素，前两个元素的值为 `8` 和 `6`，剩下的元素值为 `0`。
6. 函数内部创建的复合字面量可以包含任意的表达式，不限于常量。例如：
    ```cpp
    total = sum_array((int []){2 * i, i + j, j * k}, 3);
    ```
7. 复合字面量为左值，所以其元素的值可以改变。如果要求其值为 “只读”，可以在类型前加上 `const`，如 `(const int []){5, 4}`。


## `return` 语句
1. 非 `void` 的函数必须使用 `return` 语句来指定将要返回的值。`return` 语句有如下格式：
    ```cpp
    return 表达式;
    ```
2. 如果 `return` 语句中表达式的类型和函数的返回类型不匹配，那么系统将会把表达式的类型隐式转换成返回类型。例如，如果声明函数返回 `int` 类型值，但是 `return` 语句包含 `double` 类型表达式，那么系统将会把表达式的值转换成 `int` 类型。
3. 如果没有给出表达式，`return` 语句可以出现在返回类型为 `void` 的函数中：
    ```cpp
    return;  /* return in a void function */
    ```
4. 如果非 `void` 函数到达了函数体的末尾（也就是说没有执行 `return` 语句），那么如果程序试图使用函数的返回值，其行为是未定义的。有些编译器会在发现非 `void` 函数可能到达函数体末尾时产生诸如 “control reaches end of non-void function” 这样的警告消息。


## 程序终止
1. 既然 `main` 是函数，那么它必须有返回类型。正常情况下，`main` 函数的返回类型是 `int` 类型。以往的 C 程序常常省略 `main` 的返回类型，这其实是利用了返回类型默认为 `int` 类型的传统。
2. 省略函数的返回类型在 C99 中是不合法的，所以最好不要这样做。
3. 省略 `main` 函数参数列表中的 `void` 是合法的，但是（从编程风格的角度看）最好显式地表明 `main` 函数没有参数。
4. `main` 函数返回的值是状态码，在某些操作系统中程序终止时可以检测到状态码。如果程序正常终止，`main` 函数应该返回 `0`；为了表示异常终止，`main` 函数应该返回非 `0` 的值。（实际上，这一返回值也可以用于其他目的。）即使不打算使用状态码，确保每个 C 程序都返回状态码也是一个很好的实践，因为以后运行程序的人可能需要测试状态码。

### `exit` 函数
1. 在 `main` 函数中执行 `return` 语句是终止程序的一种方法，另一种方法是调用 `exit` 函数，此函数属于 `<stdlib.h>`头。
2. 传递给 `exit` 函数的实际参数和 `main` 函数的返回值具有相同的含义：两者都说明程序终止时的状态。为了表示正常终止，传递 `0`：
    ```cpp
    exit(0);                      /* normal termination */
    ```
3. 因为 `0` 有点模糊，所以 C 语言允许用 `EXIT_SUCCESS` 来代替（效果是相同的）：
    ```cpp
    exit(EXIT_SUCCESS);           /* normal termination */
    ```
4. 传递 `EXIT_FAILURE` 表示异常终止：
    ```cpp
    exit(EXIT_FAILURE);           /* abnormal termination */
    ```
5. `EXIT_SUCCESS` 和 `EXIT_FAILURE` 都是定义在 `<stdlib.h>` 中的宏。`EXIT_SUCCESS` 和 `EXIT_FAILURE` 的值都是由实现定义的，通常分别是 `0` 和 `1`。
6. 作为终止程序的方法，`return` 语句和 `exit` 函数关系紧密。事实上，`main` 函数中的语句 `return 表达式;` 等价于 `exit(表达式);`。
7. `return` 语句和 `exit` 函数之间的差异是：不管哪个函数调用 `exit` 函数都会导致程序终止，`return` 语句仅当由 `main` 函数调用时才会导致程序终止。一些程序员只使用 `exit` 函数，以便更容易定位程序中的全部退出点。


## 习题
* 编程题 8
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include <time.h>
    #include <stdbool.h>

    int roll_dice(void);
    bool play_game (void);


    int main(void)
    {
        
        int n = 50;
        srand((unsigned) time(NULL));
        char isGoOnInput;
        bool isGoOn = true;

        

        while ( isGoOn ) {
            if ( play_game() ) {
                printf("You win!\n");
            }
            else {
                printf("You lose!\n");
            }

            printf("Play again? ");
            // 第一次输入 y 的时候 scanf 会剩下一个换行符，这里加空格匹配换行符，然后让 $c 匹配到实际的字符；
            // 否则 $c 会匹配到换行符，不给用户输入的机会；然后换行符会走到下面 if 的分支退出程序。
            scanf(" %c", &isGoOnInput); 
            
            if ( isGoOnInput != 'Y' && isGoOnInput != 'y' ) {
                isGoOn = false;
            }
            else {
                isGoOn = true;
                printf("\n");
            }
        }

        return 0;
    }


    int roll_dice (void) {
        int r = rand() % 11 + 2;
        printf("You rolled: %d\n", r);
        return r;
    }

    bool play_game (void) {
        int randNum = roll_dice();

        if ( randNum == 7 || randNum == 11 ) {
            return true;
        }
        else if ( randNum == 2 || randNum == 3 || randNum == 12 ) {
            return false;
        }
        else {
            int point = randNum;
            printf("Your point is %d\n", point);
            randNum = roll_dice();
            while ( randNum != point && randNum != 7 ) {
                randNum = roll_dice();
            }
            if ( randNum == point ) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    ```


## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)