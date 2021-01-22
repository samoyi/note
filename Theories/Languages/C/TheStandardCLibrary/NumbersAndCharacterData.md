# Numbers and Character Data


<!-- TOC -->

- [Numbers and Character Data](#numbers-and-character-data)
    - [`<float.h>`：浮点类型的特性](#floath浮点类型的特性)
    - [`<limits.h>`：整数类型的大小](#limitsh整数类型的大小)
    - [`<math.h>`：数学计算（C89）](#mathh数学计算c89)
        - [错误](#错误)
        - [三角函数](#三角函数)
        - [双曲函数](#双曲函数)
        - [指数函数和对数函数](#指数函数和对数函数)
        - [幂函数](#幂函数)
        - [就近取整函数、绝对值函数和取余函数](#就近取整函数绝对值函数和取余函数)
    - [`<math.h>`：数学计算（C99）](#mathh数学计算c99)
    - [`<ctype.h>`：字符处理](#ctypeh字符处理)
        - [字符分类函数](#字符分类函数)
        - [字符大小写映射函数](#字符大小写映射函数)
    - [`<string.h>`：字符串处理](#stringh字符串处理)
        - [复制函数](#复制函数)
        - [拼接函数](#拼接函数)
        - [比较函数](#比较函数)
            - [`memcmp`、`strcmp` 和 `strncmp`](#memcmpstrcmp-和-strncmp)
            - [`strcoll` 和 `strxfrm`](#strcoll-和-strxfrm)
        - [搜索函数](#搜索函数)
            - [`strchr`](#strchr)
            - [`memchr`](#memchr)
            - [`strrchr`](#strrchr)
            - [`strpbrk`](#strpbrk)
            - [`strspn` 和 `strcspn`](#strspn-和-strcspn)
            - [`strstr`](#strstr)
    - [References](#references)

<!-- /TOC -->


## `<float.h>`：浮点类型的特性
1. `<float.h>` 中提供了用来定义 `float`、`double` 和 `long double` 类型的范围及精度的宏。在 `<float.h>` 中没有类型和函数的定义。
2. 有两个宏对所有浮点类型适用 `FLT_ROUNDS` 和 `FLT_RADIX`。`FLT_ROUNDS` 表示当前浮点加法的舍入方向。下表列出了 `FLT_ROUNDS` 的可能值。对于表中没有给出的值，舍入行为由实现定义

    取值 | 含义
    --|--
    `-1` | 不确定
    `0`  | 向零舍入
    `1`  | 向最近的整数舍入
    `2`  | 向正无穷方向舍入
    `3`  | 向负无穷方向舍入

3. 与 `<float.h>` 中的其他宏（表示常量表达式）不同，`FLT_ROUNDS` 的值在执行期间可以改变。`fesetround` 函数允许程序改变当前的舍入方向。
4. 另一个宏 `FLT_RADIX` 指定了指数表示中的基数，它的最小值为 2（表明二进制表示）。
5. 其他宏用来描述具体类型的特性，下面会用一系列的表格来描述。根据宏是针对 `float`、`double` 还是 `long double` 类型，每个宏都会以 `FLT`、`DBL` 或 `LDBL` 开头。
    * 有效数字个数的宏。直接看书上的表格。
    * 与指数相关的宏。直接看书上的表格。
    * 最大值、最小值和差值宏。直接看书上的表格。
    * C99 提供了另外两个宏：`DECIMAL_DIG` 和 `FLT_EVAL_METHOD`。直接看书。


## `<limits.h>`：整数类型的大小
1. `<limits.h>` 中提供了用于定义每种整数类型（包括字符类型）取值范围的宏。在< `limits.h>` 中没有声明类型或函数。
2. 字符类型和整数类型的宏直接看书。
3. `<limits.h>` 中定义的宏在查看编译器是否支持特定大小的整数时十分方便。例如，如果要判断 `int` 类型是否可以用来存储像 100 000 一样大的数，可以使用下面的预处理指令：
    ```cpp
    #if INT_MAX < 100000
    #error int type is too small
    #endif
    ```
    如果 `int` 类型不适用，`#error` 指令会导致预处理器显示一条出错消息。
4. 进一步讲，可以使用 `<limits.h>` 中的宏来帮助程序选择正确的类型定义。假设 `Quantity` 类型的变量必须可以存储像 100 000 一样大的整数。如果 `INT_MAX` 至少为 100 000，就可以将 `Quantity` 定义为 `int`；否则，要定义为 `long int`：
    ```cpp
    #if INT_MAX >= 100000
    typedef int Quantity;
    #else
    typedef long int Quantity;
    #endif
    ```

## `<math.h>`：数学计算（C89）
### 错误
1. `<math.h>` 中的函数对错误的处理方式与其他库函数不同。当发生错误时，`<math.h>` 中的大多数函数会将一个错误码存储到一个名为 `errno` 的特殊变量（在 `<errno.h>` 中声明的）中。
2. 此外，一旦函数的返回值大于 `double` 类型的最大取值，`<math.h>` 中的函数会返回一个特殊的值，这个值由 `HUGE_VAL` 宏定义（这个宏在 `<math.h>` 中定义）。
3. `HUGE_VAL` 是 `double` 类型的，但不一定是一个普通的数。IEEE 浮点运算标准定义了一个值叫 “无穷数”——这个值是 `HUGE_VAL` 的一个合理的选择。 
4. `<math.h>` 中的函数检查下面两种错误
    * **定义域错误**。函数的实参超出了函数的定义域。当定义域错误发生时，函数的返回值是由实现定义的，同时 `EDOM`（“定义域错误”）会被存储到 `errno` 中。在 `<math.h>` 的某些实现中，当定义域错误发生时，函数会返回一个特殊的值 `NaN`。
    * **取值范围错误**。函数的返回值超出了 `double` 类型的取值范围。如果返回值的绝对值过大（上溢出），函数会根据正确结果的符号返回正的或负的 `HUGE_VAL`。此外，值 `ERANGE`（“取值范围错误”）会被存储到 `errno` 中。如果返回值的绝对值太小（下溢出），函数返回零；一些实现可能也会将 `ERANGE` 存储到 `errno` 中。

### 三角函数
```cpp
double acos(double x);
double asin(double x);
double atan(double x);
double atan2(double y, double x);
double cos(double x);
double sin(double x);
double tan(double x);
```

### 双曲函数
```cpp
double cosh(double x);
double sinh(double x);
double tanh(double x);
```

### 指数函数和对数函数
```cpp
double exp(double x);
double frexp(double value, int *exp);
double ldexp(double x, int exp);
double log(double x);
double log10(double x);
double modf(double value, double *iptr);
```

### 幂函数
```cpp
double pow(double x, double y);
double sqrt(double x);
```

### 就近取整函数、绝对值函数和取余函数
```cpp
double ceil(double x);
double fabs(double x);
double floor(double x);
double fmod(double x, double y);
```

C 语言不允许对 `%` 运算符使用浮点操作数，不过 `fmod` 函数足以用来替代 `%` 运算符。


## `<math.h>`：数学计算（C99）
TODO


## `<ctype.h>`：字符处理
1. `<ctype.h>` 提供了两类函数：字符分类函数（如 `isdigit` 函数，用来检测一个字符是否是数字）和字符大小写映射函数（如 `toupper` 函数，用来将一个小写字母转换成大写字母）。
2. 虽然 C 语言并不要求必须使用 `<ctype.h>` 中的函数来测试字符或进行大小写转换，但我们仍建议使用 `<ctype.h>` 中定义的函数来进行这类操作：
        * 第一，这些函数已经针对运行速度进行过优化（实际上，大多数都是用宏实现的）；
        * 第二，使用这些函数会使程序的可移植性更好，因为这些函数可以在任何字符集上运行；
        * 第三，当地区改变时，`<ctype.h>` 中的函数会相应地调整其行为，使我们编写的程序可以正确地运行在世界上不同的地点。
3. `<ctype.h>` 中定义的函数都具有 `int` 类型的参数，并返回 `int` 类型的值。许多情况下，参数事先存放在一个 `int` 型的变量中（通常是调用 `fgetc`、`getc` 或 `getchar` 读取的结果）。
4. 当参数类型为 `char` 时，需要小心。C 语言可以自动将 `char` 类型的参数转换为 `int` 类型；如果 `char` 是无符号类型或者使用 ASCII 之类的 7 位字符集，转换不会出问题，但如果 `char` 是有符号类型且有些字符需要用 8 位来表示，那么把这样的字符从 `char` 转换为 `int` 就会得到负值。
5. 当参数为负时，`<ctype.h>` 中的函数行为是未定义的（`EOF` 除外），这样可能会造成一些严重的问题。这种情况下应把参数强制转换为 `unsigned char` 类型以确保安全。为了最大化可移植性，一些程序员在使用 `<ctype.h>` 中的函数之前总是把 `char` 类型的参数强制转换为 `unsigned char` 类型。

### 字符分类函数
取值 | 取值对应的舍入模式
--|--
 `isalnum(c)` | `c` 是否是字母或数字
 `isalpha(c)` | `c` 是否是字母
 `isblank(c)` | `c` 是否是标准空白字符，包括空格和水平制表符（`\t`））
 `iscntrl(c)` | `c` 是否是控制字符。在 ASCII 字符集中，控制字符包括 `\x00` 至 `\x1f`，以及 `\x7f`
 `isdigit(c)` | `c` 是否是十进制数字
 `isgraph(c)` | `c` 是否是可显示字符（除空格外）
 `islower(c)` | `c` 是否是小写字母
 `isprint(c)` | `c` 是否是可打印字符（包括空格）
 `ispunct(c)` | `c` 是否是标点符号。包括所有可打印字符，但要除掉使 `isspace` 或 `isalnum` 为真的字符
 `isspace(c)` | `c` 是否是空白字符。包括空格、换页符（`\f`）、换行符（`\n`）、回车符（`\r`）、水平制表符（`\t`）和垂直制表符（`\v`）
 `isupper(c)` | `c` 是否是大写字母
`isxdigit(c)` | `c` 是否是十六进制数字
    
`ispunct` 在 C99 中的定义与在 C89 中的定义略有不同。在 C89 中，`ispunct(c)` 测试 `c` 是否为除空格符和使 `isalnum(c)` 为真的字符以外的可打印字符。在 C99 中，`ispunct(c)` 测试 `c` 是否为除了使 `isspace(c)` 或 `isalnum(c)` 为真的字符以外的可打印字符。

### 字符大小写映射函数
```cpp
int tolower(int c);
int toupper(int c);
```

1. `tolower` 函数返回与作为参数传递的字母相对应的小写字母，而 `toupper` 函数返回与作为参数传递的字母相对应的大写字母。
2. 对于这两个函数，如果所传参数不是字母，那么将返回原始字符，不加任何改变。


## `<string.h>`：字符串处理
1. 除了用于字符数组（不需要以空字符结尾）的字符串处理函数之外，`<string.h>` 中还有许多其他字符串处理函数。前一类函数的名字以 `mem` 开头，以表明它们处理的是内存块而不是字符串。这些内存块可以包含任何类型的数据，因此 `mem` 函数的参数类型为 `void *` 而不是 `char *`。
2. `<string.h>` 提供了 5 种函数。
    * **复制函数**，将字符从内存中的一处复制到另一处。
    * **拼接函数**，向字符串末尾追加字符。
    * **比较函数**，用于比较字符数组。
    * **搜索函数**，在字符数组中搜索一个特定字符、一组字符或一个字符串。
    * **其他函数**，初始化字符数组或计算字符串的长度。

### 复制函数
```cpp
void *memcpy(void * restrict s1, const void * restrict s2, size_t n);
void *memmove(void * s1, const void * s2, size_t n);
char *strcpy(char * restrict s1, const char * restrict s2);
char *strncpy(char * restrict s1, const char * restrict s2, size_t n);
```

1. 这一类函数将字符（字节）从内存的一处（源）移动到另一处（目的地）。每个函数都要求第一个参数指向目的地，第二个参数指向源。所有的复制函数都会返回第一个参数（即指向目的地的指针）。
2. `memcpy` 函数从源向目的地复制 `n` 个字符，其中 `n` 是函数的第三个参数。
3. 如果源和目的地之间有重叠，`memcpy` 函数的行为是未定义的。
4. `memmove` 函数与 `memcpy` 函数类似，只是在源和目的地重叠时它也可以正常工作（所以没有加 `restrict`）。
5. `strcpy` 函数将一个以空字符结尾的字符串从源复制到目的地。
6. `strncpy` 与 `strcpy` 类似，只是它不会复制多于 `n` 个字符，其中 `n` 是函数的第三个参数。如果 `n` 太小，`strncpy` 可能无法复制结尾的空字符。
7. 如果 `strncpy` 遇到源字符串中的空字符，它会向目的字符串不断追加空字符，直到写满 `n` 个字符为止。
8. 与 `memcpy` 类似，`strcpy` 和 `strncpy` 不保证当源和目的地相重叠时可以正常工作。
9. 下面的例子展示了所有的复制函数，注释中给出了哪些字符会被复制
    ```cpp
    char source[] = {'h', 'o', 't', '\0', 't', 'e', 'a'};
    char dest[7];

    memcpy(dest, source, 3);    /* h, o, t                 */
    memcpy(dest, source, 4);    /* h, o, t, \0             */
    memcpy(dest, source, 7);    /* h, o, t, \0, t, e, a    */

    memmove(dest, source, 3);   /* h, o, t                 */
    memmove(dest, source, 4);   /* h, o, t, \0             */
    memmove(dest, source, 7);   /* h, o, t, \0, t, e, a    */

    strcpy(dest, source);       /* h, o, t, \0             */

    strncpy(dest, source,  3);  /* h, o, t                 */
    strncpy(dest, source,  4);  /* h, o, t, \0             */
    strncpy(dest, source,  7);  /* h, o, t, \0, \0, \0, \0 */
    ```
    * 注意，`memcpy`、`memmove` 和 `strncpy` 都不要求使用空字符结尾的字符串，它们对任意内存块都可以正常工作。而 `strcpy` 函数则会持续复制字符，直到遇到一个空字符为止，因此 `strcpy` 仅适用于以空字符结尾的字符串。
    * 注意最后一条，`strncpy` 会用空字符补全。按照下面的方式打印一下最后一条执行后的效果
        ```cpp
        printf("%s\n", dest); // hot
        for (int i=0; i<sizeof(dest); i++) {
            printf("[%c] ", dest[i]);
        }
        // [h] [o] [t] [ ] [ ] [ ] [ ] 
        ```
    
### 拼接函数
```cpp
char *strcat(char * restrict s1, const char * restrict s2);
char *strncat(char * restrict s1, const char * restrict s2, size_t n);
```

1. `strcat` 函数将它的第二个参数追加到第一个参数的末尾。
2. 两个参数都必须是以空字符结尾的字符串。
3. strcat函数会在拼接后的字符串末尾添加空字符。
4. 考虑下面的例子：
    ```cpp
    char str[7] = "tea";

    strcat(str, "bag");     /* adds b, a, g, \0 to end of str */

    printf("%s\n", str); // tea
    for (int i=0; i<sizeof(str); i++) {
        printf("[%c] ", str[i]);
    }
    // [t] [e] [a] [b] [a] [g] [ ]
    ```
    字母 `b` 会覆盖 `"tea"` 中字符 `a` 后面的空字符，因此现在 `str` 包含字符串 `"teabag"`。
5. `strcat` 函数会返回它的第一个参数（指针）。
6. `strncat` 函数与 `strcat` 函数基本一致，只是它的第三个参数会限制所复制字符的个数：
    ```cpp
    char str[7] = "tea";

    strncat(str, "bag", 2); // adds b, a, \0 to str   

    printf("%s\n", str); // teaba
    for (int i=0; i<sizeof(str); i++) {
        printf("[%c] ", str[i]);
    }
    // [t] [e] [a] [b] [a] [ ] [ ] 
    ```
    ```cpp
    char str[7] = "tea";

    strncat(str, "bag", 3); // adds b, a, g, \0 to str

    printf("%s\n", str); // teabag
    for (int i=0; i<sizeof(str); i++) {
        printf("[%c] ", str[i]);
    }
    // [t] [e] [a] [b] [a] [g] [ ] 
    ```
    ```cpp
    strncat(str, "bag", 4); // adds b, a, g, \0 to str
    
    printf("%s\n", str); // teabag
    for (int i=0; i<sizeof(str); i++) {
        printf("[%c] ", str[i]);
    }
    // [t] [e] [a] [b] [a] [g] [ ] 
    ```
    正如上面的例子所示，`strnact` 函数会保证其结果字符串始终以空字符结尾，这个自动添加的空字符不计入第三个参数中。
7. `strncat` 的调用通常具有如下形式：
    ```cpp
    strncat(str1, str2, sizeof(str1) - strlen(str1) - 1);
    ```
    第三个参数计算 `str1` 中剩余的空间大小，然后减 1 以确保给空字符留出空间。

### 比较函数
```cpp
int memcmp(const void *s1, const void *s2, size_t n);
int strcmp(const char *s1, const char *s2);
int strcoll(const char *s1, const char *s2);
int strncmp(const char *s1, const char *s2, size_t n);
size_t strxfrm(char * restrict s1, const char * restrict s2, size_t n);
```

1. 比较函数分为两组。第一组中的函数（`memcmp`、`strcmp` 和 `strncmp`）比较两个字符数组的内容，第二组中的函数（`strcoll` 和 `strxfrm` 函数）在需要考虑地区时使用。

#### `memcmp`、`strcmp` 和 `strncmp`
1. 这三个函数都需要以指向字符数组的指针作为参数，然后用第一个字符数组中的字符逐一地与第二个字符数组中的字符进行比较。
2. 这三个函数都是在遇到第一个不匹配的字符时返回。结束时第一个字符数组中的字符是小于、等于还是大于第二个字符数组中的字符，而相应地返回负整数、0 或正整数。
3. 这三个函数之间的差异在于如果数组相同，何时停止比较：
    * `memcmp` 函数包含第三个参数 `n`，`n` 会用来限制参与比较的字符个数，但 `memcmp` 函数不会关心空字符。
    * `strcmp` 函数没有对字符数设定限制，因此会在其中任意一个字符数组中遇到空字符时停止比较。因此，`strcmp` 函数只能用于以空字符结尾的字符串。
    * `strncmp` 结合了 `memcmp` 和 `strcmp`，当比较的字符数达到n个或在其中任意一个字符数组中遇到空字符时停止比较。
4. 下面的例子展示了 `memcmp`、`strcmp` 和 `strncmp` 的用法：
    ```cpp
    char s1[] = {'b', 'i', 'g', '\0', 'c', 'a', 'r'};
    char s2[] = {'b', 'i', 'g', '\0', 'c', 'a', 't'};

    printf("%d\n", memcmp(s1, s2, 3));   // 0
    printf("%d\n", memcmp(s1, s2, 4));   // 0
    printf("%d\n", memcmp(s1, s2, 7));   // -1

    printf("%d\n", strcmp(s1, s2));      // 0

    printf("%d\n", strncmp(s1, s2, 3));  // 0
    printf("%d\n", strncmp(s1, s2, 4));  // 0
    printf("%d\n", strncmp(s1, s2, 7));  // 0
    ```

#### `strcoll` 和 `strxfrm`
1. `strcoll` 函数与 `strcmp` 函数类似，但比较的结果依赖于当前的地区（根据 `LC_COLLATE ` 的设置）。大多数情况下，`strcoll` 都足够用来处理依赖于地区的字符串比较。
2. 但有些时候，我们可能需要多次进行比较（`strcoll` 的一个潜在问题是，它不是很快），或者需要改变地区而不影响比较的结果。在这些情况下，`strxfrm` 函数（“字符串变换”）可以用来代替 `strcoll` 使用。
3. `strxfrm` 函数会对它的第二个参数进行变换，将变换的结果放在第一个参数所指向的字符串中。
4. 第三个参数用来限制向数组输出的字符个数，包括最后的空字符。
5. 用两个变换后的字符串作为参数调用 `strcmp` 函数所产生的结果应该与用原始字符串作为参数调用 `strcoll` 函数所产生的结果相同。
6. `strxfrm` 函数返回变换后字符串的长度，因此 `strxfm` 函数通常会被调用两次：一次用于判断变换后字符串的长度，一次用来进行变换。下面是一个例子：
	```cpp
	size_t len;
    char *transformed;

    len = strxfrm(NULL, original, 0);
    printf("%d\n", len);

    transformed = malloc(len + 1);
    strxfrm(transformed, original, len);
	```

### 搜索函数
```cpp
void *memchr(const void *s, int c, size_t n);
char *strchr(const char *s, int c);
size_t strcspn(const char *s1, const char *s2);
char *strpbrk(const char *s1, const char *s2);
char *strrchr(const char *s, int c);
size_t strspn(const char *s1, const char *s2);
char *strstr(const char *s1, const char *s2);
char *strtok(char * restrict s1, const char * restrict s2);
```

#### `strchr`
1. `strchr` 函数在字符串中搜索特定字符。下面的例子说明了如何使用 `strchr` 函数在字符串中搜索字母 `f`：
	```cpp
	char *p, str[] = "Form follows function.";

	p = strchr(str, 'f');     /* finds first 'f' */

	printf("%s", p); // follows function.
	```
	`strchr` 函数会返回一个指针，这个指针指向 `str` 中出现的第一个 `f`。
2. 如果需要多次搜索字符也很简单，例如，可以使用下面的调用搜索 `str` 中的第二个 `f`：
	```cpp
	p = strchr(p + 1, 'f');   /* finds next 'f' */

	printf("%s", p); // function.
	```
3. 如果不能定位所需的字符，`strchr` 返回空指针。

#### `memchr`
1. `memchr` 函数与 `strchr` 函数类似，但 `memchr` 函数会在搜索了指定数量的字符后停止搜索，而不是当遇到首个空字符时才停止。
2. `memchr` 函数的第三个参数用来限制搜索时需要检测的字符总数。当不希望对整个字符串进行搜索或搜索的内存块不是以空字符结尾时，`memchr` 函数会十分有用
	```cpp
	char *p;
    char str[] = {'b', 'i', 'g', '\0', 'c', 'a', 't'};


    p = strchr(str, 'c');
    printf("%d\n", p == NULL); // 1

    p = memchr(str, 'c', sizeof(str));
    printf("%d\n", p == NULL); // 0
    printf("%c\n", *p); // c
	```
#### `strrchr`
`strrchr` 函数与 `strchr` 类似，但它会反向搜索字符：
```cpp
char *p, str[] = "Form follows function.";

p = strrchr(str, 'f');   /* finds last 'f' */

puts(p); // function.
```

#### `strpbrk`
`strpbrk` 函数比 `strchr` 函数更通用，它返回一个指针，该指针指向参数一中第一个与参数二中任意一个字符匹配的字符：
```cpp
char *p, str[] = "Form follows function.";

puts(strpbrk(str, "mn"));  // m follows function.
puts(strpbrk(str, "nm"));  // m follows function.
puts(strpbrk(str, "nmo")); // orm follows function.
```

#### `strspn` 和 `strcspn`
1. 这两个函数与其他的搜索函数不同，它们会返回一个表示字符串中特定位置的整数（`size_t` 类型）。
2. 当给定一个需要搜索的字符串以及一组需要搜索的字符时，`strspn` 函数返回字符串中第一个不属于该组字符的字符的下标。
3. 对于同样的参数，`strcspn` 函数返回第一个属于该组字符的字符的下标。
4. 下面是使用这两个函数的例子：
    ```cpp
    size_t n;
    char str[] = "Form follows function.";

    printf("%d\n", strspn(str, "mosF"));    // 2
    printf("%d\n", strspn(str, "morF"));    // 4
    printf("%d\n", strspn(str, " \t\n"));   // 0

    printf("%d\n", strcspn(str, "morF"));   // 0
    printf("%d\n", strcspn(str, " \t\n"));  // 4
    ```

#### `strstr`
1. `strstr` 函数在第一个参数（字符串）中搜索第二个参数（也是字符串）。在下面的例子中，`strstr` 函数搜索单词 `fun`：
    ```cpp
    char *p, str[] = "Form follows function.";

    p = strstr(str, "fun");   /* locates "fun" in str */

    puts(p); // function.
    ```
2. `strstr` 函数返回一个指向待搜索字符串第一次出现的地方的指针。如果找不到，则返回空指针。


TODO  后续内容









## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)
