# Advanced Uses of Pointers


<!-- TOC -->

- [Advanced Uses of Pointers](#advanced-uses-of-pointers)
    - [动态存储分配](#动态存储分配)
        - [内存分配函数](#内存分配函数)
        - [空指针](#空指针)
    - [动态分配字符串](#动态分配字符串)
        - [使用 `malloc` 函数为字符串分配内存](#使用-malloc-函数为字符串分配内存)
        - [在字符串函数中使用动态存储分配](#在字符串函数中使用动态存储分配)
        - [动态分配字符串的数组](#动态分配字符串的数组)
    - [动态分配数组](#动态分配数组)
        - [使用 `malloc` 函数为数组分配存储空间](#使用-malloc-函数为数组分配存储空间)
        - [`calloc` 函数](#calloc-函数)
        - [`realloc` 函数](#realloc-函数)
    - [释放存储空间](#释放存储空间)
        - [`free` 函数](#free-函数)
        - [“悬空指针” 问题](#悬空指针-问题)
    - [链表](#链表)
        - [声明结点类型](#声明结点类型)
        - [创建结点](#创建结点)
        - [`->` 运算符](#--运算符)
        - [在链表的开始处插入结点](#在链表的开始处插入结点)
        - [搜索链表](#搜索链表)
    - [References](#references)

<!-- /TOC -->


## 动态存储分配
1. C 语言的数据结构通常是固定大小的。例如，一旦程序完成编译，数组元素的数量就固定了。在C99中，变长数组的长度在运行时确定，但在数组的生命周期内仍然是固定长度的。
2. 因为在编写程序时强制选择了大小，所以固定大小的数据结构可能会有问题。也就是说，在不修改程序并且再次编译程序的情况下无法改变数据结构的大小。
3. C 语言支持动态存储分配，即在程序执行期间分配内存单元的能力。利用动态存储分配，可以设计出能根据需要扩大（和缩小）的数据结构。
4. 虽然动态存储分配适用于所有类型的数据，但主要用于字符串、数组和结构。动态分配的结构是特别有趣的，因为可以把它们链接形成表、树或其他数据结构。

### 内存分配函数
1. 为了动态地分配存储空间，需要调用三种内存分配函数的一种，这些函数都是声明在 `<stdlib.h>` 头中的
    * `malloc` 函数——分配内存块，但是不对内存块进行初始化。
    * `calloc` 函数——分配内存块，并且对内存块进行清零。
    * `realloc` 函数——调整先前分配的内存块大小。
2. 在这三种函数中，`malloc` 函数是最常用的一种。因为 `malloc` 函数不需要对分配的内存块进行清零，所以它比 `calloc` 函数更高效。
3. 当为申请内存块而调用内存分配函数时，由于函数无法知道计划存储在内存块中的数据是什么类型的，所以它不能返回 `int` 类型、`char` 类型等普通类型的指针。取而代之的，函数会返回 `void *` 类型的值。`void *` 类型的值是 “通用” 指针，本质上它只是内存地址。

### 空指针
1. 当调用内存分配函数时，总存在这样的可能性：找不到满足我们需要的足够大的内存块。如果真的发生了这类问题，函数会返回 **空指针**（null pointer）。
2. 空指针是 “不指向任何地方的指针”，这是一个区别于所有有效指针的特殊值。
3. 在把函数的返回值存储到指针变量中以后，需要判断该指针变量是否为空指针。程序员的责任是测试任意内存分配函数的返回值，并且在返回空指针时采取适当的动作。试图通过空指针访问内存的效果是未定义的，程序可能会崩溃或者出现不可预测的行为。
4. 空指针用名为 `NULL` 的宏来表示，所以可以用下列方式测试 `malloc` 函数的返回值：
    ```cpp
    p = malloc(10000);
    if (p == NULL) {
        /* allocation failed;  take appropriate action  */
    }
    ```
    一些程序员把 `malloc` 函数的调用和 `NULL` 的测试组合在一起：
    ```cpp
    if ((p = malloc(10000))  == NULL) {
        /* allocation failed;  take appropriate action  */
    }
    ```
5. 名为 `NULL` 的宏在 6 个头 `<locale.h>`、`<stddef.h>`、`<stdio.h>`、`<stdlib.h>`、`<string.h>` 和 `<time.h>` 中都有定义。C99 的 `<wchar.h>` 也定义了 `NULL`。只要把这些头中的一个包含在程序中，编译器就可以识别出 `NULL`。当然，使用任意内存分配函数的程序都会包含 `<stdlib.h>`，这使 `NULL` 必然有效。
6. 在 C 语言中，指针测试真假的方法和数的测试一样。所有非空指针都为真，而只有空指针为假。


## 动态分配字符串
动态内存分配对字符串操作非常有用。字符串存储在字符数组中，而且可能很难预测这些数组需要的长度。通过动态地分配字符串，可以推迟到程序运行时才作决定。

### 使用 `malloc` 函数为字符串分配内存
1. `malloc` 函数具有如下原型：
    ```cpp
    void *malloc(size_t size);
    ```
2. `malloc` 函数分配 `size` 个字节的内存块，并且返回指向该内存块的指针。
3. 注意，`size` 的类型是 `size_t`，这是在 C 语言库中定义的无符号整数类型。除非正在分配一个非常巨大的内存块，否则可以只把 `size` 考虑成普通整数。
4. 用 `malloc` 函数为字符串分配内存是很容易的，因为 C 语言保证 `char` 类型值恰需要一个字节的内存。为给 `n` 个字符的字符串分配内存空间，可以写成
    ```cpp
    p = malloc(n + 1);
    ```
5. 这里的 `p` 是 `char *` 类型变量，在执行赋值操作时会把 `malloc` 函数返回的通用指针转化为 `char *` 类型，而不需要强制类型转换。通常情况下，可以把 `void*` 类型值赋给任何指针类型的变量，反之亦然。然而， 一些程序员喜欢对 `malloc` 函数的返回值进行强制类型转换：
    ```cpp
    p = (char *) malloc(n + 1);
    ```
6. 由于使用 `malloc` 函数分配的内存不需要清零或者以任何方式进行初始化，所以 `p` 指向带有 `n+1` 个字符的未初始化的数组。
7. 对上述数组进行初始化的一种方法是调用 `strcpy` 函数：
    ```cpp
    strcpy(p, "abc");
    ```
    数组中的前 4 个字符分别为 `a`、`b`、`c` 和 `\0`。

### 在字符串函数中使用动态存储分配
1. 动态存储分配使编写返回指向 “新” 字符串的指针的函数成为可能，所谓新字符串是指在调用此函数之前字符串并不存在。
2. C 标准库没有包含此类函数（例如 `strcat` 函数改变了作为参数传递过来的一个字符串，所以此函数并不是我们所要的函数），但是使用动态存储分配可以很容易自行写出这样的函数。
3. 自行编写的函数将测量用来连接的两个字符串的长度，然后调用 `malloc` 函数为结果分配适当大小的内存空间。接下来函数会把第一个字符串复制到新的内存空间中，并且调用 `strcat` 函数来拼接第二个字符串
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    char *concat(const char *s1, const char *s2)
    {
        char *result;

        result = malloc(strlen(s1) + strlen(s2) + 1);
        if (result == NULL)  {
            printf("Error: malloc failed in concat\n");
            exit (EXIT_FAILURE);
        }
        strcpy(result, s1);
        strcat(result, s2);
        return result;
    }

    int main(void)
    {
        char str1[6] = "hello";
        char str2[6] = "world";
        char *newStr = concat(str1, str2);

        puts(str1); // hello
        puts(str2); // world
        puts(newStr); // helloworld
    }
    ```
4. 如果 `malloc` 函数返回空指针，那么 `concat` 函数显示出错消息并且终止程序。这并不是正确的措施，一些程序需要从内存分配失败后恢复并且继续运行。
5. 像 `concat` 这样动态分配存储空间的函数必须小心使用。当不再需要 `concat` 函数返回的字符串时，需要调用 `free` 函数来释放它占用的空间。如果不这样做，程序最终会用光内存空间。

### 动态分配字符串的数组
```cpp
/* Prints a one-month reminder list (dynamic string version) */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_REMIND 50   /* maximum number of reminders */
#define MSG_LEN 60      /* max length of remider message */

int read_line(char str[], int n);

int main(void)
{
    char *reminders[MAX_REMIND];
    char day_str[3], msg_str[MSG_LEN+1];
    int day, i, j, num_remind = 0;

    for (;;) {
        if (num_remind == MAX_REMIND) {
            printf("-- No space left --\n");
            break;
        }

        printf("Enter day and reminder: ");
        scanf("%2d", &day);
        if (day == 0)
            break;
        sprintf(day_str, "%2d", day);
        read_line(msg_str, MSG_LEN);

        for (i = 0; i < num_remind; i++)
            if (strcmp(day_str, reminders[i]) < 0)
                break;
        for (j = num_remind; j > i; j--)
            reminders[j] = reminders[j-1];

        reminders[i] = malloc(2 + strlen(msg_str) + 1);
        if (reminders[i] == NULL) {
            printf("-- No space left --\n");
            break;
        }

        strcpy(reminders[i], day_str);
        strcat(reminders[i], msg_str);

        num_remind++;
    }

    printf("\nDay Reminder\n");
    for (i = 0; i < num_remind; i++)
        printf(" %s\n", reminders[i]);

    return 0;
}

int read_line(char str[], int n)
{
    int ch, i = 0;

    while ((ch = getchar()) != '\n')
        if (i < n)
            str[i++] = ch;
    str[i] = '\0';
    return i;
}


// Enter day and reminder:  24 Susan's birthday
// Enter day and reminder:  5 6:00 - Dinner with Marge and Russ
// Enter day and reminder:  26 Movie - "Chinatown"
// Enter day and reminder:  7 10:30 - Dental appointment
// Enter day and reminder:  12 Movie - "Dazed and Confused"
// Enter day and reminder:  5 Saturday class
// Enter day and remlnder:  12 Saturday class
// Enter day and reminder:  0
// Day  Reminder
//   5  Saturday class
//   5  6:00 - Dinner with Marge and Russ
//   7  10:30 - Dental appointment
//  12  Saturday class
//  12  Movie - "Dazed and Confused"
//  24  Susan's birthday
//  26  Movie - "Chinatown"
```


## 动态分配数组
1. 动态分配数组会获得和动态分配字符串相同的好处，因为字符串就是数组。
2. 虽然 `malloc` 函数可以为数组分配内存空间，但有时会用 `calloc` 函数代替 `malloc`，因为 `calloc` 函数会对分配的内存进行初始化。`realloc` 函数允许根据需要对数组进行 “扩展” 或 “缩减”。

### 使用 `malloc` 函数为数组分配存储空间
1. 可以使用 `malloc` 函数为数组分配存储空间，这种方法和用它为字符串分配空间非常相像。主要区别就是任意数组的元素不需要像字符串那样是一个字节的长度。这样的结果是，我们需要使用 `sizeof` 运算符来计算出每个元素所需要的空间数量。
2. 假设正在编写的程序需要 `n` 个整数构成的数组，这里的 `n` 可以在程序执行期间计算出来。首先需要声明指针变量：
    ```cpp
    int *a;
    ```
    一旦 `n` 的值已知了，就让程序调用 `malloc` 函数为数组分配存储空间：
    ```cpp
    a = malloc(n * sizeof(int));
    ```
3. 一旦 `a` 指向动态分配的内存块，就可以忽略 `a` 是指针的事实，可以把它用作数组的名字。这都要感谢 C 语言中数组和指针的紧密关系。

### `calloc` 函数
1. `calloc` 函数在 `<stdlib.h>` 中具有如下所示的原型：
    ```cpp
    void *calloc(size_t nmemb, size_t size);
    ```
2. `calloc` 函数为 `nmemb` 个元素的数组分配内存空间，其中每个元素的长度都是 `size` 个字节。如果要求的空间无效，那么此函数返回空指针。
3. 在分配了内存之后， `calloc` 函数会通过把所有位设置为 0 的方式进行初始化。例如，下列 `calloc` 函数调用为 `n` 个整数的数组分配存储空间，并且保证所有整数初始均为零：
    ```cpp
    a = calloc(n, sizeof(int));
    ```
4. 因为 `calloc` 函数会清除分配的内存，而 `malloc` 函数不会，所以可能有时对于不同于数组的对象，也希望使用清除内存的功能。因为其他对象并没有元素个数的概念，所以可以通过调用以 1 作为第一个实际参数的 `calloc` 函数，为任何类型的数据项分配空间：
    ```cpp
    struct point { int x, y; } *p;

    p = calloc(1, sizeof(struct point));
    ```
    在执行此语句之后，`p` 将指向一个结构，且此结构的成员 `x` 和 `y` 都会被设为零。

### `realloc` 函数
1. 一旦为数组分配完内存，稍后可能会发现数组过大或过小。`realloc` 函数可以调整数组的大小使它更适合需要。
2. 下列 `realloc` 函数的原型出现在 `<stdlib.h>` 中：
    ```cpp
    void *realloc(void *ptr, size_t size);
    ```
3. 当调用 `realloc` 函数时，`ptr` 必须指向先前通过 `malloc`、`calloc` 或 `realloc` 的调用获得的内存块。
4. `size` 表示内存块的新尺寸，新尺寸可能会大于或小于原有尺寸。
5. 要确定传递给 `realloc` 函数的指针来自于先前 `malloc`、`calloc` 或 `realloc` 的调用。如果不是这样的指针，程序可能会行为异常。
6. C 标准列出了几条关于 `realloc` 函数的规则。
    * 当扩展内存块时，`realloc` 函数不会对添加进内存块的字节进行初始化。
    * 如果 `realloc` 函数不能按要求扩大内存块，那么它会返回空指针，并且在原有的内存块中的数据不会发生改变。
    * 如果 `realloc` 函数被调用时以空指针作为第一个实际参数，那么它的行为就将像 `malloc` 函数一样。
    * 如果 `realloc` 函数被调用时以 0 作为第二个实际参数，那么它会释放掉内存块。
7. C 标准没有确切地指明 `realloc` 函数的工作原理。尽管如此，我们仍然希望它非常有效。在要求减少内存块大小时，`realloc` 函数应该 “在原先的内存块上” 直接进行缩减，而不需要移动存储在内存块中的数据。同理，扩大内存块时也不应该对其进行移动。如果无法扩大内存块（因为内存块后边的字节已经用于其他目的），`realloc` 函数会在别处分配新的内存块，然后把旧块中的内容复制到新块中。
8. 一旦 `realloc` 函数返回，请一定要对指向内存块的所有指针进行更新，因为 `realloc` 函数可能会使内存块移动到了其他地方。


## 释放存储空间
1. `malloc` 函数和其他内存分配函数所获得的内存块都来自一个称为 **堆**（heap）的存储池。过于频繁地调用这些函数（或者让这些函数申请大内存块）可能会耗尽堆，这会导致函数返回空指针。
2. 更糟的是，程序可能分配了内存块，然后又丢失了对这些块的记录，因而浪费了空间。请思考下面的例子：
    ```cpp
    p = malloc(...);
    q = malloc(...);
    p = q;
    ```
3. 在执行完前两条语句后，`p` 指向了一个内存块，而 `q` 指向了另一个内存块。在把 `q` 赋值给 `p` 之后，两个指针现在都指向了第二个内存块。因为没有指针指向第一个内存块，所以再也不能使用此内存块了。
4. 对程序而言，不可再访问到的内存块被称为是 **垃圾**（garbage）。留有垃圾的程序存在 **内存泄漏**（memroy leak）现象。一些语言提供 **垃圾收集器**（garbage collector）用于垃圾的自动定位和回收，但是 C 语言不提供。相反，每个 C 程序负责回收各自的垃圾，方法是调用 `free` 函数来释放不需要的内存。

### `free` 函数
1. `free` 函数在 `<stdlib.h>` 中有下列原型：
    ```cpp
    void free(void *ptr);
    ```
2. 使用 `free` 函数很容易，只需要简单地把指向不再需要的内存块的指针传递给 `free` 函数就可以了：
    ```cpp
    p = malloc(...);
    q = malloc(...);
    free(p);
    p = q;
    ```
3. 调用 `free` 函数会释放 `p` 所指向的内存块。然后此内存块可以被后续的 `malloc` 函数或其他内存分配函数的调用重新使用。
4. `free` 函数的实际参数必须是先前由内存分配函数返回的指针。如果参数是指向其他对象（比如变量或数组元素）的指针，可能会导致未定义的行为。（参数也可以是空指针，此时 `free` 调用不起作用）

### “悬空指针” 问题
1. 虽然 `free` 函数允许收回不再需要的内存，但是使用此函数会导致一个新的问题：**悬空指针**（dangling pointer）。
2. 调用 `free(p)` 函数会释放 `p` 指向的内存块，但是不会改变 `p` 本身。如果忘记了 `p` 不再指向有效内存块，混乱可能随即而来：
    ```cpp
    char *p = malloc(4);
    ...
    free(p);
    ...
    strcpy(p, "abc");     /*** WRONG ***/
    ```
3. 修改 `p` 指向的内存是严重的错误，因为程序不再对此内存有任何控制权了。
4. 试图访问或修改释放掉的内存块会导致未定义的行为。试图修改释放掉的内存块可能会引起程序崩溃等损失惨重的后果。
5. 悬空指针是很难发现的，因为几个指针可能指向相同的内存块。在释放内存块后，全部的指针都悬空了。


## 链表
1. 动态存储分配对建立表、树、图和其他链式数据结构是特别有用的。
2. **链表**（Linked List）是由一连串的结构（称为 **结点**）组成的，其中每个结点都包含指向链中下一个结点的指针，链表中的最后一个结点包含一个空指针。
3. 在前面几章中，我们在需要存储数据项的集合时总使用数组，而现在链表为我们提供了另外一种选择。链表比数组更灵活，我们可以很容易地在链表中插入和删除结点，也就是说允许链表根据需要扩大和缩小。另一方面，我们也失去了数组的 “随机访问” 能力。我们可以用相同的时间访问数组内的任何元素，而访问链表中的结点用时不同。如果结点距离链表的开始处很近，那么访问到它会很快；反之，若结点靠近链表结尾处，访问到它就很慢。

### 声明结点类型
1. 为了建立链表，首先需要一个表示表中单个结点的结构。简单起见，先假设结点只包含一个整数（即结点的数据）和指向表中下一个结点的指针。
2. 下面是结点结构的描述：
    ```cpp
    struct node {
        int value;            // data stored in the node
        struct node *next;    // pointer to the next node
    };
    ```
    注意，成员 `next` 具有 `struct node *` 类型，这就意味着它能存储一个指向 `node` 结构的指针。
3. 关于 `node` 结构，有一点需要特别提一下。通常可以选择使用标记或者用 `typedef` 来定义一种特殊的结构类型的名字。但是，在结构有一个指向相同结构类型的指针成员时，要求使用结构标记。没有 `node` 标记，就没有办法声明 `next` 的类型。
4. 现在已经声明了 `node` 结构，还需要记录表开始的位置。换句话说，需要有一个始终指向表中第一个结点的变量。这里把此变量命名为 `first`
    ```cpp
    struct node *first = NULL;
    ```
    把 `first` 初始化为 `NULL` 表明链表初始为空。

### 创建结点
1. 为了创建结点，需要一个变量临时指向该结点（直到该结点插入链表中为止）。设此变量为 `new_node`
    ```cpp
    struct node *new_node;
    ```
2. 我们用 `malloc` 函数为新结点分配内存空间，并且把返回值保存在 `new_node` 中：
    ```cpp
    new_node = malloc(sizeof(struct node));
    ```
    现在 `new_node` 指向了一个内存块，且此内存块正好能放下一个 `node` 结构。
3. 接下来，将把数据存储到新结点的成员 `value` 中：
    ```cpp
    (*new_node).value = 10;
    ```
    在 `*new_node` 两边的圆括号是强制要求的，因为运算符 `.` 的优先级高于运算符 `*`。

### `->` 运算符
1. 在介绍往链表中插入新结点之前，先来讨论一种有用的捷径。利用指针访问结构中的成员是很普遍的，因此 C 语言针对此目的专门提供了一种运算符。此运算符称为 **右箭头选择**（right arrow selection），它由一个减号跟着一个 `>` 组成。
2. 利用运算符 `->` 可以编写语句
    ```cpp
    new_node->value = 10;
    ```
    来代替语句
    ```cpp
    (*new_node).value = 10;
    ```
3. 由于运算符 `->` 产生左值，所以可以在任何允许普通变量的地方使用它
    ```cpp
    scanf("%d", &new_node->value);
    ```
    注意，尽管 `new_node` 是一个指针，运算符&仍然是需要的。如果没有运算符 `&`，就会把 `new_node->value` 的值传递给 `scanf` 函数，而这个值是 `int` 类型。

### 在链表的开始处插入结点
1. 链表的好处之一就是可以在表中的任何位置添加结点：在开始处、在结尾处或者中间的任何位置。然而，链表的开始处是最容易插入结点的地方，所以这里集中讨论这种情况。
2. 如果 `new_node` 正指向要插入的结点，并且 `first` 正指向链表中的首结点，那么为了把结点插入链表将需要两条语句。
3. 首先，修改结点的成员 `next`，使其指向先前在链表开始处的结点：
    ```cpp
    new_node->next = first;
    ```
4. 接下来，使 `first` 指向新结点：
    ```cpp
    first = new_node;
    ```
5. 下面是向空链表插入两个节点的过程
    <img src="./images/10.png" width="600" style=" display: block; margin: 5px 0 10px;" />
6. 编写插入节点的函数 `add_to_list`。此函数有两个形式参数：`list`（指向旧链表中首结点的指针）和 `n`（需要存储在新结点中的整数）
    ```cpp
    struct node *add_to_list(struct node *list, int n)
    {
        struct node *new_node;

        new_node = malloc(sizeof(struct node));
        if (new_node == NULL) {
            printf("Error: malloc failed in add_to list\n");
            exit(EXIT_FAILURE);
        }

        new_node->value = n;
        new_node->next = list;

        return new_node;
    }
    ```
7. 注意，`add_to_list` 函数不会修改指针 `list`，而是返回指向新产生的结点的指针（现在位于链表的开始处）。
8. 当调用 `add_to_list` 函数时，需要把它的返回值存储到 `first` 中
    ```cpp
    struct node *first = NULL;

    first = add_to_list(first, 10);
    printf("%d\n", first->value); // 10
    first = add_to_list(first, 20);
    printf("%d\n", first->value); // 20
    ```
9. 下列函数用 `add_to_list` 来创建一个含有用户录入数的链表：
    ```cpp
    struct node *read_numbers(void)
    {
        struct node *first = NULL;
        int n;

        printf("Enter a series of integers (0 to terminate): ");
        for (;;) {
            scanf("%d", &n);
            if (n == 0)
                return first;
            first = add_to_list(first, n);
        }
    }
    ```

### 搜索链表
1. 一旦创建了链表，可能就需要为某个特殊的数据段而搜索链表。虽然 `while` 循环可以用于搜索链表，但是 `for` 语句却常常是首选。我们习惯于在编写含有计数操作的循环时使用 `for` 语句，但是 `for` 语句的灵活性使它也适合其他工作，包括对链表的操作。
2. 下面是一种访问链表中结点的习惯方法，使用了指针变量 `p` 来跟踪 “当前” 结点：
    ```cpp
    for (p  =  first;  p  !=  NULL;  p  =  p->next)
    ...
    ```
3. 现在编写名为 `search_list` 的函数，此函数为找到整数 `n` 而搜索链表。如果找到 `n`，那么 `search_list` 函数将返回指向含有 `n` 的结点的指针；否则，它会返回空指针。
3. 下面的第一版 `search_list` 函数依赖于 “链表搜索” 惯用法
    ```cpp
    struct node *search_list(struct node *list, int n)
    {
        struct node *p;

        for (p = list; p != NULL; p = p->next)
            if  (p->value == n)
                return p;
        return NULL;
    }
    ```
4. 当然，还有许多其他方法可以编写 `search_list` 函数。其中一种替换方式是除去变量 `p`，而用 `list` 自身来代替进行当前结点的跟踪
    ```cpp
    struct node *search_list(struct node *list, int n)
    {
        for (; list != NULL; list = list->next)
            if (list->value == n)
                return list;
        return NULL;
    }
    ```
    因为 `list` 是原始链表指针的副本（参数按值传递），所以在函数内改变它不会有任何损害。
5. 另一种替换方法是把判定 `list->value == n` 和判定 `list != NULL` 合并起来
    ```cpp
    struct node *search_list(struct node *list, int n)
    {
        for (; list != NULL && list->value != n; list = list->next)
            ;
        return list;
    }
    ```
6. 如果使用 `while` 语句，那么 `search_list` 函数的这一版本可能会更加清楚：
    ```cpp
    struct node *search_list(struct node *list, int n)
    {
        while (list != NULL && list->value != n)
            list = list->next;
        return list;
    }
    ```





























































## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)