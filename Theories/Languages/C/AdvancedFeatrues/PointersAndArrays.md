# Pointers and Arrays


<!-- TOC -->

- [Pointers and Arrays](#pointers-and-arrays)
    - [Summary](#summary)
    - [指针的算术运算](#%E6%8C%87%E9%92%88%E7%9A%84%E7%AE%97%E6%9C%AF%E8%BF%90%E7%AE%97)
        - [指针加上整数](#%E6%8C%87%E9%92%88%E5%8A%A0%E4%B8%8A%E6%95%B4%E6%95%B0)
        - [指针减去整数](#%E6%8C%87%E9%92%88%E5%87%8F%E5%8E%BB%E6%95%B4%E6%95%B0)
        - [两个指针相减](#%E4%B8%A4%E4%B8%AA%E6%8C%87%E9%92%88%E7%9B%B8%E5%87%8F)
        - [指针计算的缩放](#%E6%8C%87%E9%92%88%E8%AE%A1%E7%AE%97%E7%9A%84%E7%BC%A9%E6%94%BE)
        - [指针比较](#%E6%8C%87%E9%92%88%E6%AF%94%E8%BE%83)
        - [指向复合常量的指针](#%E6%8C%87%E5%90%91%E5%A4%8D%E5%90%88%E5%B8%B8%E9%87%8F%E7%9A%84%E6%8C%87%E9%92%88)
    - [指针用于数组处理](#%E6%8C%87%E9%92%88%E7%94%A8%E4%BA%8E%E6%95%B0%E7%BB%84%E5%A4%84%E7%90%86)
        - [* 运算符和 ++/-- 运算符的组合](#-%E8%BF%90%E7%AE%97%E7%AC%A6%E5%92%8C----%E8%BF%90%E7%AE%97%E7%AC%A6%E7%9A%84%E7%BB%84%E5%90%88)
    - [用数组名作为指针](#%E7%94%A8%E6%95%B0%E7%BB%84%E5%90%8D%E4%BD%9C%E4%B8%BA%E6%8C%87%E9%92%88)
        - [数组型实际参数（改进版）](#%E6%95%B0%E7%BB%84%E5%9E%8B%E5%AE%9E%E9%99%85%E5%8F%82%E6%95%B0%E6%94%B9%E8%BF%9B%E7%89%88)
        - [把数组型形式参数声明为 *a 和 a[] 哪种风格更好呢？](#%E6%8A%8A%E6%95%B0%E7%BB%84%E5%9E%8B%E5%BD%A2%E5%BC%8F%E5%8F%82%E6%95%B0%E5%A3%B0%E6%98%8E%E4%B8%BA-a-%E5%92%8C-a-%E5%93%AA%E7%A7%8D%E9%A3%8E%E6%A0%BC%E6%9B%B4%E5%A5%BD%E5%91%A2)
        - [用指针作为数组名](#%E7%94%A8%E6%8C%87%E9%92%88%E4%BD%9C%E4%B8%BA%E6%95%B0%E7%BB%84%E5%90%8D)
        - [数组变量与指针的区别](#%E6%95%B0%E7%BB%84%E5%8F%98%E9%87%8F%E4%B8%8E%E6%8C%87%E9%92%88%E7%9A%84%E5%8C%BA%E5%88%AB)
        - [一个奇怪的例子](#%E4%B8%80%E4%B8%AA%E5%A5%87%E6%80%AA%E7%9A%84%E4%BE%8B%E5%AD%90)
    - [指针和多维数组](#%E6%8C%87%E9%92%88%E5%92%8C%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84)
        - [处理多维数组的元素](#%E5%A4%84%E7%90%86%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84%E7%9A%84%E5%85%83%E7%B4%A0)
        - [处理多维数组的行](#%E5%A4%84%E7%90%86%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84%E7%9A%84%E8%A1%8C)
        - [处理多维数组的列](#%E5%A4%84%E7%90%86%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84%E7%9A%84%E5%88%97)
        - [用多维数组名作为指针](#%E7%94%A8%E5%A4%9A%E7%BB%B4%E6%95%B0%E7%BB%84%E5%90%8D%E4%BD%9C%E4%B8%BA%E6%8C%87%E9%92%88)
    - [C99 中的指针和变长数组](#c99-%E4%B8%AD%E7%9A%84%E6%8C%87%E9%92%88%E5%92%8C%E5%8F%98%E9%95%BF%E6%95%B0%E7%BB%84)
    - [习题](#%E4%B9%A0%E9%A2%98)
    - [References](#references)

<!-- /TOC -->


## Summary
1. 当指针指向数组元素时，C 语言允许对指针进行算术运算（加法和减法），通过这种运算我们可以用指针代替数组下标对数组进行处理。
2. 用指针处理数组的主要原因是效率，但是这里的效率提升已经不再像当初那么重要了，这主要归功于编译器的改进。


## 指针的算术运算
1. 因为指针可以指向数组元素。例如，假设已经声明 `a` 和 `p` 如下：
    ```cpp
    int a[10], *p;
    ```
2. 通过下列写法可以使 `p` 指向 `a[0]`：
    ```cpp
    p = &a[0];
    ```
3. 现在可以通过 `p` 访问 `a[0]`。例如，可以通过下列写法把值 `5` 存入 `a[0]` 中：
    ```cpp
    *p = 5;
    ```
4. 通过在 `p` 上执行 **指针算术运算**（或者 **地址算术运算**）可以访问数组 `a` 的其他所有元素。C 语言支持 3 种格式的指针算术运算：
    * 指针加上整数；
    * 指针减去整数；
    * 两个指针相减。
5. 在一个不指向任何数组元素的指针上执行算术运算会导致未定义的行为。此外，只有在两个指针指向同一个数组时，把它们相减才有意义。
6. 下面的所有例子都假设有如下声明：
    ```cpp
    int a[10], *p, *q, i;
    ```

### 指针加上整数
1. 指针 `p` 加上整数 j 产生指向特定元素的指针，这个特定元素是 `p` 原先指向的元素后的 j 个位置。
2. 更确切地说， 如果 `p` 指向数组元素 `a[i]`，那么 `p+j` 指向 `a[i + j]`（当然，前提是 `a[i + j]` 必须存在）。

### 指针减去整数
如果 `p` 指向数组元素 `a[i]`，那么 `p - j` 指向 `a[i - j]`。

### 两个指针相减
1. 当两个指针相减时，结果为指针之间的距离（用数组元素的个数来度量）。
2. 因此，如果 `p` 指向 `a[i]` 且 `q` 指向 `a[j]`，那么 `p-q` 就等于 `i-j`。

### 指针计算的缩放
1. 如果指针是地址，那么这是否意味着诸如 `p + j` 这样的表达式是把 j 加到存储在 `p` 中的地址上呢？
2. 并不是，因为用于指针算术运算的整数需要根据指针的类型进行缩放。
3. 例如，如果 `p` 的类型是 `int *`，那么 `p + j` 通常给 `p` 加上 4 × j（假定 `int` 类型的值要用 4 个字节存储）。但是，如果 `p` 的类型为 `double *`，那么 `p + j` 可能给 `p` 加上 8 × j，因为 `double` 类型的值通常都是 `8` 个字节长。

### 指针比较
1. 可以用关系运算符和判等运算符进行指针比较。
2. 只有在两个指针指向同一数组时，用关系运算符进行的指针比较才有意义。
3. 比较的结果依赖于数组中两个元素的相对位置。例如，在下面的赋值后 `p <= q` 的值是 `0`，而 `p >= q` 的值是 `1`
    ```cpp
    p = &a[5];
    q = &a[1];
    ```

### 指向复合常量的指针 
指针指向由复合字面量创建的数组中的某个元素是合法的
```cpp
int *p = (int []){3, 0, 3, 4, 1};
```


## 指针用于数组处理
1. 指针的算术运算允许通过对指针变量进行重复自增来访问数组的元素。下面这个对数组 `a` 中元素求和的程序段说明了这种方法
    ```cpp
    #define N 10
    ...
    int a[N], sum, *p;
    ...
    sum = 0;
    for (p = &a[0]; p < &a[N]; p++)
        sum += *p;
    ```
2. `for` 语句中的条件 `p < &a[N]` 值得特别说明一下。尽管元素 `a[N]` 不存在，但是对它使用取地址运算符是合法的。因为循环不会尝试检查 `a[N]` 的值，所以在上述方式下使用 `a[N]` 是非常安全的。不懂，意思是说只检查 `a[N]` 的地址而不检查 `a[N]` 值？
3. 支持采用指针算术运算的最常见论调是，这样做可以节省执行时间。但是，这依赖于具体的实现——对有些编译器来说，实际上依靠下标的循环会产生更好的代码。

### `*` 运算符和 `++`/`--` 运算符的组合
1. C 程序员经常在处理数组元素的语句中组合 `*`（间接寻址）运算符和 `++` 运算符。思考一个简单的例子：把值存入一个数组元素中，然后前进到下一个元素。利用数组下标可以这样写：
    ```cpp
    a[i++] = j;
    ```
2. 如果 `p` 指向数组元素，那么相应的语句将会是
    ```cpp
    *p++ = j;
    ```
3. 因为后缀 `++` 的优先级高于 `*`，所以编译器把上述语句看成是
    ```cpp
    *(p++) = j;
    ```
    `p++` 的值是 `p`，因此，`*(p++)` 的值将是 `*p`，即 `p` 当前指向的对象。
4. `*p++` 不是唯一合法的 `*` 和 `++` 的组合
    <table border="1" style="margin-bottom: 20px;">
        <thead>
            <tr>
                <th>表达式</th>
                <th>含义</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>*p++</code> 或 <code>*(p++)</code></td>
                <td>自增前表达式的值是 <code>*p</code>，以后再自增 <code>p</code></td>
            </tr>
            <tr>
                <td><code>(*p)++</code></td>
                <td>自增前表达式的值是 <code>*p</code>，以后再自增 <code>*p</code></td>
            </tr>
            <tr>
                <td><code>*++p</code> 或 <code>*(++p)</code></td>
                <td>先自增 <code>p</code>，自增后表达式的值是 <code>*p</code></td>
            </tr>
            <tr>
                <td><code>++*p</code> 或 <code>++(*p)</code></td>
                <td>先自增 <code>*p</code>，自增后表达式的值是 <code>*p</code></td>
            </tr>
        </tbody>
    </table>
5. 最频繁见到的就是 `*p++`，它在循环中是很方便的。对数组 `a` 的元素求和时，可以把
    ```cpp
    for (p = &a[0]; p < &a[N]; p++)
        sum += *p;
    ```
    改写成
    ```cpp
    p = &a[0];
    while (p < &a[N])
        sum += *p++;
    ```


## 用数组名作为指针
1. 可以用数组的名字作为指向数组第一个元素的指针。当单独使用数组名的变量时，它表示指向该数组第一个元素的指针。
2. 例如，假设用如下形式声明 `a`：
    ```cpp
    int a[10];
    ```
3. 用 `a` 作为指向数组第一个元素的指针，可以修改 `a[0]`：
    ```cpp
    *a = 7;        /* stores 7 in a[0] */
    ```
4. 可以通过指针 `a + 1` 来修改 `a[1]`：
    ```cpp
    *(a+1) = 12;      /* store 12 in a[1] */
    ```
5. 通常情况下，`a + i` 等同于 `&a[i]`（两者都表示指向数组 `a` 中元素 `i` 的指针），并且 `*(a+i)` 等价于 `a[i]`。
6. 换句话说，可以把数组的取下标操作看成是指针算术运算的一种形式。
7. 数组名可以用作指针这一事实使得编写遍历数组的循环更加容易。下面这个循环：
    ```cpp
    for (p = &a[0]; p < &a[N]; p++)
        sum += *p;
    ```
    可以简化为
    ```cpp
    for (p = a; p < a + N; p++)
        sum += *p;
    ```
8. 虽然可以把数组名用作指针，但是不能给数组名赋新的值。试图使数组名指向其他地方是错误的：
    ```cpp
    while (*a != 0)
        a++;              /*** WRONG ***/
    ```
    这一限制不会对我们造成什么损失：我们可以把 `a` 复制给一个指针变量，然后改变该指针变量：
    ```cpp
    p = a;
    while (*p != 0)
        p++;
    ```

### 数组型实际参数（改进版）
1. 数组名在传递给函数时，总是被视为指针。看下这个直观的例子
    ```cpp
    void print_msg (char msg[]) {
        printf("%s\n", msg); // "hello world"
        printf("%d\n", sizeof(msg)); // 4
    }

    int main()
    {
        char str[] = "hello world";
        printf("%d\n", sizeof(str)); // 12
        print_msg(str); // warning: 'sizeof' on array function parameter 'msg' will return size of 'char *'

        return 0;
    }
    ```
2. 直接调用 `sizeof(str)` 时，`str` 是作为数组，所以长度为 12。但是作为数组型参数时，会被视为指针，所以 `print_msg` 内的 `sizeof(msg)` 计算的是指向 `str` 数组指针的长度。
3. 再思考下面的函数，这个函数会返回整型数组中最大的元素：
    ```cpp
    int find_largest(int a[], int n) {
        int i, max;

        max = a[0];
        for (i = 1; i < n; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }
        return max;
    }
    ```
4. 假设调用 `find_largest` 函数如下：
    ```cpp
    largest = find_largest (b, N);
    ```
5. 这个调用会把指向数组 `b` 第一个元素的指针赋值给 `a`，数组本身并没有被复制。现在在函数里 `a` 是数组第一个元素的指针了，所以 `sizeof(a)` 会是指针变量的长度而非数组的长度。但为什么函数里面用的是 `a[0]` 而不是 `*a` 呢？因为正如下一节要说的，不仅可以用数组名作为指针，C 语言还允许反过来把指针看作数组名来进行取下标操作。
6. 所以下面的方式传参和传递数组名的方式是一个效果
    ```cpp
    largest = find_largest (&b[0], N);
    ```
7. 在给函数传递普通变量时，变量的值会被复制；任何对相应的形式参数的改变都不会影响到变量。反之，因为没有对数组本身进行复制，所以作为实际参数的数组是可能被改变的。
8. 为了指明数组型形式参数不会被改变，可以在其声明中包含单词 `const`：
    ```cpp
    int find_largest(const int a[], int n)
    {
        ...
    }
    ```
    如果参数中有 `const`，编译器会核实 `find_largest` 函数体中确实没有对 `a` 中元素的赋值。
9. 给函数传递数组所需的时间与数组的大小无关。因为没有对数组进行复制，所以传递大数组不会产生不利的结果。
10. 如果需要，可以把数组型形式参数声明为指针。例如，可以按如下形式定义 `find_largest` 函数：
    ```cpp
    int find_largest(int *a, int n)
    {
        ...
    }
    ```
    声明 `a` 是指针就相当于声明它是数组。 编译器把这两类声明看作是完全一样的。
11. 对于形式参数而言，声明为数组跟声明为指针是一样的；但是对变量而言，声明为数组跟声明为指针是不同的。声明
    ```cpp
    int a[10];
    ```
    会导致编译器预留 10 个整数的空间。但声明
    ```cpp
    int *a;
    ```
    只会导致编译器为一个指针变量分配空间。
12. 既然传参时可以传递数组第一项的指针，那也可以传递其他项的指针。假设希望用 `find_largest` 函数来定位数组 `b` 中某一部分的最大元素，比如说元素 `b[5]`,…,`b[14]`。调用 `find_largest` 函数时，将传递 `b[5]` 的地址和数 `10`，表明希望 `find_largest` 函数从 `b[5]` 开始检查 10 个数组元素：
    ```cpp
    largest = find_largest(&b[5], 10);
    ```

### 把数组型形式参数声明为 `*a` 和 `a[]` 哪种风格更好呢？
1. 这个问题很棘手。一种观点认为，因为 `*a` 是不明确的（函数到底需要多对象的数组还是指向单个对象的指针？），所以 `a[]` 更好是显而易见的。
2. 但是，许多程序员认为把形式参数声明为 `*a` 更准确，因为它会提醒我们传递的仅仅是指针而不是数组的副本。
3. 有些人则根据具体情况在两种风格之间进行切换，切换的依据是函数是使用指针算术运算还是使用取下标运算来访问数组的元素的。（本书也采用这种方法。）
4. 在实践中，`*a` 比 `a[]` 更常用。

### 用指针作为数组名
1. 不仅可以用数组名作为指针，C 语言还允许反过来把指针看作数组名来进行取下标操作。
    ```cpp
    #define N 10
    ...
    int a[N], i, sum = 0, *p = a;
    ...
    for (i = 0; i < N; i++)
        sum += p[i];
    ```
    编译器把 `p[i]` 看作 `*(p+i)`，这是指针算术运算非常正规的用法。
2. 看起来，数组名本身就是指向数组第一项的指针，两者似乎就是一个东西。但从技术上说，数组的名字不是指针，只是 C 语言编译器会 **在需要时把数组的名字转换为指针**。使用 `find_largest` 举个例子来看出区别
    ```cpp
    int a[16] = {4, 6, 15, 7, 3, 11, 10, 9, 2, 12, 8, 1, 5, 0, 14, 13};
    int *p = a; // 指针 p 指向数组

    printf("max by a: %d\n", find_largest(a, 16));    // 得出 15
    printf("max by p: %d\n\n", find_largest(p, 16));  // 同样得出 15

    printf("size of a: %d\n", sizeof(a)); // size 为 64
    printf("size of p: %d", sizeof(p));   // size 为 4
    ```

### 数组变量与指针的区别
1. 考虑下面这段代码：
    ```cpp
    char s[] = "How big is it?";
    char *t = s;

    printf("%s\n", s); // "How big is it?"
    printf("%s\n", t); // "How big is it?"
    printf("%d\n", sizeof(s)); // 15
    printf("%d\n", sizeof(t)); // 4
    ``` 
2. `sizeof(t)` 是指向数组的指针的长度，而 `sizeof(s)` 是数组在存储器中的长度。
3. 当创建指针变量时，计算机会为它分配 4 或 8 字节的存储空间；但如果创建的是数组，**计算机会为数组分配存储空间，但不会为数组变量分配任何空间，编译器仅在出现它的地方把它替换成数组的起始地址**。
4. 由于计算机没有为数组变量分配空间，也就不能把它指向其他地方
    ```cpp
    s = t; // error: assignment to expression with array type
    ```
5. 把数组赋值给指针时也要注意，因为赋值之后，指针变量只会包含数组的地址信息，而对数组的长度一无所知，相当于指针丢失了一些信息。我们把这种信息的丢失称为 **退化**。把数组传递给函数，就会发生这种退化变为指针。

### 一个奇怪的例子
1. 如果 `i` 和 `a` 都是数组名，那么 `i[a]` 和 `a[i]` 是一样的。
2. 对于编译器而言 `i[a]` 等同于 `*(i + a)`，也就是 `*(a + i)`（像普通加法一样，指针加法也是可交换的）。而 `*(a + i)` 也就是 `a[i]`。
3. 但是请不要在程序中使用这种奇怪的形式。


## 指针和多维数组
### 处理多维数组的元素
1. C 语言按行主序存储二维数组；换句话说，先是 0 行的元素，接着是 1 行的，依此类推。
2. 使用指针时可以利用这一布局特点。如果使指针 `p` 指向二维数组中的第一个元素（即 0 行 0 列的元素），就可以通过重复自增 `p` 的方法访问数组中的每一个元素。
3. 作为示例，一起来看看把二维数组的所有元素初始化为 `0` 的问题。假设数组的声明如下：
    ```cpp
    int a[NUM_ROWS][NUM_COLS];
    ```
    显而易见的方法是用嵌套的 `for` 循环：
    ```cpp
    int row, col;
    ...
    for (row = 0; row < NUM_ROWS; row++)
        for (col = 0; col < NUM_COLS; col++)
            a[row][col] = 0;
    ```
    但是，如果使用指针，那么就可以把上述两个循环改成一个循环了：
    ```cpp
    int *p;
    ...
    for (p = &a[0][0]; p <= &a[NUM_ROWS-1][NUM_COLS-1]; p++)
        *p = 0
    ```
4. 注意循环的终止条件，按照一维数组的习惯，比如 `i<N;`，这里可能会习惯性的写成 `p < &a[NUM_ROWS][NUM_COLS];`。但是注意，`&a[NUM_ROWS][NUM_COLS]` 其实并不是二维数组最后一项的后一个位置，因为 `a[NUM_ROWS]` 就已经是数组最后一行的 “后一行” 了。所以如果一定要用 `<` 的话，应该写成 `p < &a[NUM_ROWS-1][NUM_COLS]`。不过这样看起来就不那么顺眼，所以还是 `p <= &a[NUM_ROWS-1][NUM_COLS-1]` 比较好。
5. 把二维数组当成一维数组的方法虽然是合法的，但是明显破坏了程序的可读性。对一些老的编译器来说这种方法在效率方面进行了补偿，但是对许多现代的编译器来说，这样所获得的速度优势往往极少甚至完全没有。
6. 对大多数 C 语言编译器而言，把二维数组当成一维数组来处理都是合法的。但是一些现代的 “越界检查” 编译器不仅记录指针的类型，还会在指针指向数组时记录数组的长度。例如，假设给 `p` 赋一个指向 `a[0][0]` 的指针。从技术上讲，`p` 指向的是一维数组 `a[0]` 的第一个元素。如果在遍历 `a` 的所有元素的过程中反复对 `p` 进行自增操作，当 `p` 越过 `a[0]` 的最后一个元素时我们就越界了。执行越界检查的编译器会插入代码验证 `p` 只能用于访问 `a[0]` 指向的数组中的元素；一旦越过这个数组的边界，再对 `p` 进行自增就会导致编译器报错。

### 处理多维数组的行
1. 处理二维数组的一行中的元素，该怎么办呢？再次选择使用指针变量 `p`。为了访问到第 `i` 行的元素，需要初始化 `p` 使其指向数组 `a` 中第 `i` 行的元素 0：
    ```cpp
    p = &a[i][0];
    ```
2. 对于任意的二维数组 `a` 来说，由于表达式 `a[i]` 是指向第 `i` 行中第一个元素（元素 0）的指针，上面的语句可以简写为
    ```cpp
    p = a[i];
    ```
3. 因为 `a[i]` 是指向数组 `a` 的第 `i` 行的指针，所以可以把 `a[i]` 传递给需要用一维数组作为实际参数的函数。换句话说，使用一维数组的函数也可以处理二维数组中的一行。

### 处理多维数组的列
1. 下面的循环对数组 `a` 的第 `i` 列清零：
    ```cpp
    int a[NUM_ROWS][NUM_COLS], (*p)[NUM_COLS], i;
    ...
    for (p = &a[0]; p < &a[NUM_ROWS]; p++)
        (*p)[i] = 0;
    ```
2. 这里把 `p` 声明为指向长度为 `NUM_COLS` 的整型数组的指针，数组的每一项都是一个指针，分别指向二维数组的一行。
3. `p` 初始化为 `&a[0]`，也就是指向二维数组的第一行。表达式 `p++` 把 `p` 移到下一行的开始位置。
4. 在表达式 `(*p)[i]` 中，`*p` 代表 `a` 的一整行，因此 `(*p)[i]` 选中了该行第 `i` 列的那个元素。
5. `(*p)[i]` 中的括号是必要的，因为编译器会将 `*p[i]` 解释为 `*(p[i])`。

### 用多维数组名作为指针
1. 就像一维数组的名字可以用作指针一样，无论数组的维数是多少都可以采用任意数组的名字作为指针。
2. 但是，需要特别小心。思考下列数组：
    ```cpp
    int a[NUM_ROWS][NUM_COLS];
    ```
    `a` 不是指向 `a[0][0]` 的指针，而是指向 `a[0]` 的指针
    ```cpp
    int a[2][3] = {0};

    printf("%d\n", a);          // 6422280
    printf("%d\n", (a[0]));     // 6422280
    printf("%d\n", &(a[0][0])); // 6422280
    printf("%d\n", &(a[0][1])); // 6422284
    printf("%d\n", a[1]);       // 6422292
    printf("%d\n", a+1);        // 6422292

    // 指的是同一个字节，但是指针类型不一样
    // int* p = a; // warning: initialization from incompatible pointer type
    // int* q = a[0]; // 正确
    ```
3. 也就是说，数组名 `a` 保存的永远是数组第一项的指针。只不过对于一维整型数组来说，数组第一项就是一个整数，而对于二维数组来说，第一项是一个一维整型数组。
4. 从 C 语言的观点来看，这样是有意义的。C 语言认为 `a` 不是二维数组而是一维数组，且这个一维数组的每个元素又是一维数组。
5. 用作指针时，`a` 的类型是 `int (*)[NUM_COLS]`（指向长度为 `NUM_COLS` 的整型数组的指针）。
6. 使用多维数组名作为指针，可以让函数把多维数组看成是一维数组。例如，思考如何使用 `find_largest` 函数找到二维数组 `a` 中的最大元素。
7. 我们把尝试把 `a`（数组的地址）作为 `find_largest` 函数的第一个实际参数，`NUM_ROWS * NUM_COLS`（数组 `a` 中的元素总数量）作为第二个实际参数：
    ```cpp
    largest = find_largest(a, NUM_ROWS * NUM_COLS);        /* WRONG */
    ```
8. 这条语句不能通过编译，因为数组名 `a` 保存的是数组第一项的指针，对于二维数组来说，第一项是一个一维整型数组，它的类型为 `int (*)[NUM_COLS]`，而 `find_largest` 函数期望的实际参数类型是 `int *`，也就是一维整形数组第一项的指针。
9. 所以正确的调用是：
    ```cpp
    largest = find_largest(a[0], NUM_ROWS * NUM_COLS);
    ```
    `a[0]` 指向第 0 行的元素 0（数组参数传递的永远是数组第一项的指针），类型为 `int *`（编译器转换以后），所以这一次调用将正确地执行。
10. `a` 和 `a[0]` 确实指向同一位置，两者都指向元素 `a[0][0]`，但是它们的类型不同。


## C99 中的指针和变长数组 
1. 普通的指针变量可以用于指向一维变长数组的元素：
    ```cpp
    void f(int n)
    {
        int a[n], *p;
        p = a;
        ...
    }
    ```
2. 如果变长数组是多维的，指针的类型取决于除第一维外每一维的长度。下面是二维的情况：
    ```cpp
    void f(int m, int n)
    {
        int a[m][n], (*p)[n];
        p = a;
        ...
    }
    ```
3. 因为 `p` 的类型依赖于 `n`，而 `n` 不是常量，所以说 `p` 具有 **可改变类型**。
4. 需要注意的是，编译器并非总能确定 `p = a` 这样的赋值语句的合法性。例如，下面的代码可以通过编译，但只有当 `m = n` 时才是正确的：
    ```cpp
    int a[m][n], (*p)[m];
    p = a;
    ```
5. 与变长数组一样，可改变类型也具有特定的限制，其中最重要的限制是，可改变类型的声明必须出现在函数体内部或者在函数原型中。
6. 变长数组中的指针算术运算和一般数组中的指针算术运算一样。例如，将二维数组 `a` 声明为变长数组：
    ```cpp
    int a[m][n];
    ```
    指向数组 `a` 中某行的指针可以声明为：
    ```cpp
    int (*p)[n];
    ```
    把第 `i` 列清零的循环如下：
    ```cpp
    for (p = a; p < a + m; p++)
        (*p)[i] = 0;
    ```


## 习题
* 练习题 9
    ```cpp
    #define N 10

    double inner_product(const double *a, const double *b, int n) {
        double sum = 0;

        for ( int p=0; p<n; p++ ) {
            sum += *(a+p) * *(b+p);
        }

        return sum;
    }

    int main(void)
    {
        double a[N] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        double b[N] = {11, 12, 13, 14, 15, 16, 17, 18, 19, 20};
        
        double sum = inner_product(a, b, N);

        printf("%lf", sum);

        return 0;
    }
    ```

* 练习题 12
    ```cpp
    void find_two_largest(int *a, int n, int *largest, int *second_largest) {

        // 因为参数是按值传递，也就是拷贝一份指向相同对象的指针传递进函数。
        // 所以如果在函数里面修改 largest 和 second_largest 的指向，并不会在外部反映出来。
        // 例如在函数里这样的操作 largest = &a[i]，就会丢失和外部 largest 指针的联系。
        // 因为现在内部的 largest 指针指向新的对象了，并不是指向和外部 largest 相同的对象了。

        if ( *a > *(a+1)) {
            *largest = *a;
            *second_largest = *(a+1);
        }
        else {
            *largest = *(a+1);
            *second_largest = *a;
        }

        for ( int i=2 ; i<n; i++ ) {
            if ( *(a+i) > *largest ) {
                *second_largest = *largest;
                *largest = *(a+i);
                continue;
            }
            else if ( *(a+i) > *second_largest ) {
                *second_largest = *(a+i);
            }
        }
    }

    int main(void)
    {
        int a[N] = {16, 17, 18, 19, 20, 11, 12, 13, 14, 15};

        int largest;
        int second_largest;
        find_two_largest(a, N, &largest, &second_largest);

        // 因为不能给没有初始化的指针的对象赋值，所以不能这样
        // int *largest;
        // int *second_largest;
        // find_two_largest(a, N, largest, second_largest);
        // 这样进到函数里之后，`*largest = *a;` 就是在给没有初始化的指针的对象赋值

        printf("%d %d", largest, second_largest);

        return 0;
    }
    ```

* 练习题 13
    ```cpp
    #define N 10

    int main(void)
    {
        int ident[N][N] = {0};
        int row, col;

        int *p;
        int i = 0;

        ident[0][0] = 1;
        for ( p = &ident[0][1]; p <= &ident[N-1][N-1]; p++ ) {
            if ( i++ == 10 ) {
                *p = 1; 
                i = 0;
            }
            else {
                *p = 0;
            }
        }

        
        for ( p = &ident[0][0]; p <= &ident[N-1][N-1]; p++ ) {
            printf("%d ", *p);

            if ( ++i == 10 ) {
                printf("\n");
                i = 0;
            }
        }

        return 0;
    }
    ```

* 编程题 2
    ```cpp
    #include <stdio.h>
    #include <stdbool.h>
    #include <ctype.h>

    bool isValidChar ( char ch ) {
        if ( (ch >=65 && ch <= 90) || (ch >=97 &&  ch <= 122) ) {
            return true;
        }
        else {
            return false;
        }
    }

    bool isPalindrome(void)
    {
        char a[SIZE];
        char r[SIZE];
        char *p = &a[0];
        char *q = &r[0];
        char ch;

        printf("Enter a message: ");
        while ( (ch=getchar()) != '\n' ) {
            if ( isValidChar(ch) ) {
                *p++ = toupper(ch);
                *q++ = toupper(ch);
            }
        }

        p = &a[0];
        q--;
        while ( q >= r ) {
            if ( *p++ != *q-- ) {
                return false;
            }
        }
        
        return true;
    }

    int main(void)
    {

        if ( isPalindrome() ) {
            printf("Palindrome");
        }
        else {
            printf("Not a palindrome");
        }

        return 0;
    }
    ```

* 编程题 5
    ```cpp
    #include <stdio.h>
    #include <stdbool.h>
    #include <ctype.h>

    #define SIZE 50


    void printCharArray ( char *a, int n);
    void printIntArray ( int *a, int n);

    void reversal (void);
    int readStr ( char str[] );
    bool isTerminator ( char ch );


    int main(void)
    {
        reversal();

        return 0;
    }


    bool isTerminator ( char ch ) {
        if ( ch == '?' || ch == '.' || ch == '!' ) {
            return true;
        }
        else {
            return false;
        }
    }
    void printCharArray ( char *a, int n) {
        char *p;

        for ( p=a; p<a+n; p++ ) {
            printf("%c ", *p);
        }

        printf("\n");
    }

    void printIntArray ( int *a, int n) {
        int *p;

        for ( p=a; p<a+n; p++ ) {
            printf("%d ", *p);
        }

        printf("\n");
    }
    int readStr ( char str[] ) {
        char ch;
        char *p = str;
        int len = 0;

        while ( (ch=getchar()) != '\n' ) {
            *p++ = ch;
            len++;
        }

        return len;
    }
    void reversal (void) {
        char str[SIZE];

        printf("Enter a sentence: ");

        int len = readStr( str );

        char *end = str + len-1;
        char *start = end;
        char terminator;
        bool hasTerminator = false;

        if ( isTerminator(*end) ) {
            terminator = *end;
            hasTerminator = true;
            end--;
            start--;
        }

        char *i;
        while ( start >= str ) {
            while ( *start != ' ' && start >= str ) {
                start--;
            }
            for ( i = start+1; i <= end; i++ ) {
                printf("%c", *i);
            }
            if ( start > str ) {
                printf(" ");
            }

            end = --start;
        }

        if ( hasTerminator ) {
            printf("%c", terminator);
        }
    }
    ```

* 编程题 7
    ```cpp
    /* Finds the largest and smallest elements in an array */

    #include <stdio.h>

    #define N 10

    void max_min(int a[], int n, int *max, int *min);

    int main(void)
    {
        int b[N], i, big, small;

        printf("Enter %d numbers: ", N);
        for (i = 0; i < N; i++)
            scanf("%d", &b[i]);

        max_min(b, N, &big, &small);

        printf("Largest: %d\n", big);
        printf("Smallest: %d\n", small);

        return 0;
    }

    void max_min(int *a, int n, int *max, int *min)
    {
        int *q = a + 1;

        // 之前想着，既然 max 和 min 是指针，那作为起点，就让它们指向数组第一个元素。
        // 又犯了因为参数按值传递在函数内修改指针指向的问题。
        // max = min = a;
        *max = *min = *a;

        for ( ; q < a + n; q++ ) {
            if ( *q > *max ) {
                *max = *q;
            }
            else if ( *q < *min ) {
                *min = *q;
            }
        }
    }
    ```


## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)
* [嗨翻C语言](https://book.douban.com/subject/25703412/)