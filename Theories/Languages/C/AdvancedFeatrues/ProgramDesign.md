# Program Design


<!-- TOC -->

- [Program Design](#program-design)
    - [模块](#模块)
        - [将程序分割成模块的好处](#将程序分割成模块的好处)
            - [抽象](#抽象)
            - [可复用性](#可复用性)
            - [可维护性](#可维护性)
        - [内聚性与耦合性](#内聚性与耦合性)
        - [模块的类型](#模块的类型)
            - [数据池](#数据池)
            - [库](#库)
            - [抽象对象](#抽象对象)
            - [抽象数据类型（ADT）](#抽象数据类型adt)
    - [信息隐藏](#信息隐藏)
    - [抽象数据类型](#抽象数据类型)
        - [封装](#封装)
        - [不完整类型](#不完整类型)
    - [栈抽象数据类型](#栈抽象数据类型)
        - [为栈抽象数据类型定义接口](#为栈抽象数据类型定义接口)
        - [用定长数组实现栈抽象数据类型](#用定长数组实现栈抽象数据类型)
        - [改变栈抽象数据类型中数据项的类型](#改变栈抽象数据类型中数据项的类型)
    - [References](#references)

<!-- /TOC -->


## 模块
1. 设计 C 程序（或其他任何语言的程序）时，最好将它看作是一些独立的 **模块**。模块是一组 **服务** 的集合，其中一些服务可以被程序的其他部分（称为 **客户**）使用。每个模块都有一个 **接口** 来描述所提供的服务。模块的细节（包括这些服务自身的源代码）都包含在模块的 **实现** 中。
2. C 语言环境下，这些服务就是函数。模块的接口就是头文件，头文件中包含那些可以被程序中其他文件调用的函数的原型。模块的实现就是包含该模块中函数的定义的源文件。
3. 一旦我们确定要进行模块化设计，设计程序的过程就变成了确定究竟应该定义哪些模块，每个模块应该提供哪些服务，各个模块之间的相互关系是什么。

### 将程序分割成模块的好处
#### 抽象
1. 如果模块设计合理，我们可以把它们作为 **抽象** 对待。我们知道模块会做什么，但不需要知道这些功能的实现细节。
2. 因为抽象的存在，我们不必为了修改部分程序而了解整个程序是如何工作的。
3. 同时，抽象让一个团队的多个程序员共同开发一个程序更容易。一旦对模块的接口达成一致，实现每一个模块的责任可以被分派到各个成员身上。团队成员可以更大程度上相互独立地工作。

#### 可复用性
任何一个提供服务的模块都有可能在其他程序中复用。例如，我们的栈模块就是可复用的。由于通常很难预测模块的未来使用，因此最好将模块设计成可复用的。

#### 可维护性
1. 将程序模块化后，程序中的错误通常只会影响一个模块实现，因而更容易找到并修正错误。在修正了错误之后，重建程序只需重新编译该模块实现（然后重新链接整个程序）即可。
2. 更广泛地说，为了提高性能或将程序移植到另一个平台上，我们甚至可以替换整个模块的实现。

### 内聚性与耦合性
好的模块接口并不是声明的随意集合。在设计良好的程序中，模块应该具有下面两个性质。
* **高内聚性**。模块中的元素应该彼此紧密相关。我们可以认为它们是为了同一目标而相互合作的。高内聚性会使模块更易于使用，同时使程序更容易理解。
* **低耦合性**。模块之间应该尽可能相互独立。低耦合性可以使程序更便于修改，并方便以后复用模块。

### 模块的类型
由于需要具备高内聚性、低耦合性，模块通常分为下面几类。

#### 数据池
1. 数据池是一些相关的变量或常量的集合。在 C 语言中，这类模块通常只是一个头文件。
2. 从程序设计的角度说，通常不建议将变量放在头文件中，但建议把相关常量放在头文件中。
3. 在 C 库中，`<float.h>` 头和 `<limits.h>` 头都属于数据池。

#### 库
库是一个相关函数的集合。例如 `<string.h>` 头就是字符串处理函数库的接口。

#### 抽象对象
1. 抽象对象是指对于隐藏的数据结构进行操作的函数的集合。
2. 本章中术语 “对象” 的含义与其他章不同。在 C 语言术语中，对象仅仅是可以存储值的一块内存，而在本章中，对象是一组数据以及针对这些数据的操作的集合。如果数据是隐藏起来的，那么这个对象是 “抽象的”。

#### 抽象数据类型（ADT）
1. 将具体数据实现方式隐藏起来的数据类型称为抽象数据类型。
2. 客户模块可以使用该类型来声明变量，但不会知道这些变量的具体数据结构。如果客户模块需要对这种变量进行操作，则必须调用抽象数据类型模块所提供的函数。


## 信息隐藏
1. 设计良好的模块经常会对它的客户隐藏一些信息。信息隐藏有以下两大优点
    * **安全性**。如果客户不知道栈是如何存储的，就不可能通过栈的内部机制擅自修改栈的数据。它们必须通过模块自身提供的函数来操作栈，而这些函数都是我们编写并测试过的。
    * **灵活性**。无论对模块的内部机制进行多大的改动，都不会很复杂。例如，我们可以首先将栈用数组实现，以后再改用链表或其他方式实现。我们当然需要重写这个模块的实现，但是只要模块是按正确的方式设计的，就不需要改变模块的接口。
2. 在 C 语言中，强制信息隐藏的主要工具是 `static` 存储类型。将具有文件作用域的变量声明成 `static` 可以使其具有内部链接，从而避免它被其他文件（包括模块的客户）访问。将函数声明成 `static` 也是有用的——函数只能被同一文件中的其他函数直接调用。
3. 出于风格的考虑，一些程序员使用宏来指明哪些函数和变量是 “公有的”（可以在程序的任何地方访问），哪些是 “私有的”（只能在一个文件内访问）：
    ```cpp
    #define  PUBLIC   /* empty */
    #define  PRIVATE  static
    ```
4. 将 `static` 写成 `PRIVATE` 是因为 `static` 在 C 语言中有很多的用法，使用 `PRIVATE` 可以更清晰地指明这里它是被用来强制信息隐藏的
    ```cpp
    PRIVATE int contents[STACK_SIZE];
    PRIVATE int top = 0;

    PRIVATE void terminate(const char *message)  { ... }

    PUBLIC void make_empty(void)  { ... }

    PUBLIC bool is_empty(void)  { ... }

    PUBLIC bool is_full(void)  { ... }

    PUBLIC void push(int i)  { ... }

    PUBLIC int pop(void)  { ... }
    ```


## 抽象数据类型
1. 作为抽象对象的模块（例如一个栈模块）有一个严重的缺点：无法拥有该对象的多个实例（本例中指多个栈）。
2. 为了达到这个目的，我们需要进一步创建一个新的 **类型**。
3. 一旦定义了 `Stack` 类型，就可以有任意个栈了。下面的程序段显示了如何在同一个程序中有两个栈：
    ```cpp
    Stack s1, s2;

    make_empty(&s1);
    make_empty(&s2);
    push(&s1, 1);
    push(&s2, 2);
    if (!is_empty(&sl))
        printf("%d\n", pop(&s1));    /* prints "1" */
    ```
4. 我们并不知道 `s1` 和 `s2` 究竟是什么（结构？指针？），但这并不重要。对于栈模块的客户，`s1` 和 `s2` 是 **抽象**，它只响应特定的操作（`make_empty`、`is_empty`、`is_full`、`push` 以及 `pop`）。
5. 下面实现一个 `Stack` 类型，其中 `Stack` 是结构。这需要给每个函数增加一个 `Stack` 类型（或 `Stack *`）的形式参数
    ```cpp
    #define STACK_SIZE 100

    typedef struct {
        int contents[STACK_SIZE];
        int top;
    ) Stack;

    void make_empty(Stack *s);
    bool is_empty(const Stack *s);
    bool is_full(const Stack *s);
    void push(Stack *s, int i);
    int pop(Stack *s);
    ```
6. 作为函数 `make_empty`、`push` 和 `pop` 参数的栈变量需要为指针，因为这些函数会改变栈的内容。`is_empty` 和 `is_full` 函数的参数并不需要为指针，但这里我们仍然使用了指针。给这两个函数传递 `Stack` 指针比传递 `Stack` 值更有效，因为传递值会导致整个数据结构被复制。

### 封装
1. 遗憾的是，上面的 `Stack` 不是抽象数据类型，因为暴露了 `Stack` 类型的具体实现方式，因此无法阻止客户将 `Stack` 变量作为结构直接使用：
    ```cpp
    Stack s1;

    s1.top =0;
    s1.contents[top++] = 1;
    ```
2. 由于提供了对 `top` 和 `contents` 成员的访问，模块的客户可以破坏栈。更糟糕的是，由于无法评估客户的修改产生的效果，我们不能改变栈的存储方式。
3. 我们真正需要的是一种阻止客户知道 `Stack` 类型的具体实现的方式。C 语言对于封装类型的支持很有限。新的基于 C 的语言（包括 C++、Java 和 C#）对于封装的支持更好一些。

### 不完整类型
1. C 语言提供的唯一封装工具为 **不完整类型**（incomplete type）。C 标准对不完整类型的描述是：描述了对象但缺少定义对象大小所需的信息。
2. 例如，声明
    ```cpp
    struct t;      /* incomplete declaration of t */
    ```
    告诉编译器 `t` 是一个结构标记，但并没有描述结构的成员。所以，编译器并没有足够的信息去确定该结构的大小。这样做的意图是：不完整类型将会在程序的其他地方将信息补充完整。
3. 不完整类型的使用是受限的。 因为编译器不知道不完整类型的大小，所以不能用它来声明变量：
    ```cpp
    struct t s;    /*** WRONG ***/
    ```
4. 但是完全可以定义一个指针类型引用不完整类型：
    ```cpp
    typedef struct t *T;
    ```
    这个类型定义表明，类型 `T` 的变量是指向标记为 `t` 的结构的指针。
5. 现在可以声明类型 `T` 的变量，将其作为函数的参数进行传递，并可以执行其他合法的指针运算（指针的大小并不依赖于它指向的对象，这就解释了为什么 C 语言允许这种行为）。
6. 但是我们不能对这些变量使用 `->` 运算符，因为编译器对 `t` 结构的成员一无所知。


## 栈抽象数据类型
为了说明抽象数据类型怎样利用不完整类型进行封装，我们需要开发一个栈抽象数据类型（Abstract Data Type，ADT）。在这一过程中，我们将用三种不同的方法来实现栈。

### 为栈抽象数据类型定义接口
1. 首先，我们需要一个定义栈抽象数据类型的头文件，并给出代表栈操作的函数的原型。现在将该头文件命名为 `stackADT.h`
    ```cpp
    // stackADT.h (version 1)
    
    #ifndef STACKADT_H
    #define STACKADT_H

    #include <stdbool.h>

    typedef struct stack_type *Stack;

    Stack create(void);
    void destroy(Stack s);
    void make_empty(Stack s);
    bool is_empty(Stack s);
    bool is_full(Stack s);
    void push(Stack s, int i);
    int pop(Stack s);

    #endif
    ```
2. `Stack` 类型将作为指针指向 `stack_type` 结构，该结构存储栈的实际内容。
3. 这个结构是一个不完整类型，在实现栈的文件中信息将变得完整。该结构的成员依赖于栈的实现方法。
4. 包含头文件 `stackADT.h` 的客户可以声明 `Stack` 类型的变量，这些变量都可以指向 `stack_type` 结构。之后客户就可以调用在 `stackADT.h` 中声明的函数来对栈变量进行操作。
5. 但是客户不能访问 `stack_type` 结构的成员，因为该结构的定义在另一个文件中。
6. 需要注意函数 `create` 和 `destroy`。模块通常不需要这些函数，但是抽象数据类型需要。`create` 会自动给栈分配内存（包括 `stack_type` 结构需要的内存），同时把栈初始化为 “空” 状态。`destroy` 将释放栈的动态分配内存。
7. 下面的客户文件可以用于测试栈抽象数据类型。它创建了两个栈，并对它们执行各种操作：
    ```cpp
    // stackclient.c
    
    #include <stdio.h>
    #include "stackADT.h"

    int main(void)
    {
        Stack s1, s2;
        int n;

        s1 = create();
        s2 = create();

        push(s1, 1);
        push(s1, 2);

        n = pop(s1);
        printf("Popped %d from s1\n", n);
        push(s2, n);
        n = pop(s1);
        printf("Popped %d from s1\n",n);
        push(s2, n);

        destroy(s1);

        while (!is_empty(s2))
            printf("Popped %d from s2\n", pop(s2));

        push(s2,3);
        make_empty(s2);
        if (is_empty(s2))
            printf("s2 is empty\n");
        else
            printf("s2 is not empty\n");

        destroy(s2);

        return 0;
    }
    ```
8. 如果栈抽象数据类型的实现是正确的，程序将产生如下输出：
    ```
    Popped 2 from s1
    Popped 1 from s1
    Popped 1 from s2
    Popped 2 from s2
    s2 is empty
    ```

### 用定长数组实现栈抽象数据类型
1. 实现栈抽象数据类型有多种方法，这里介绍的第一种方法是最简单的。`stackADT.c` 文件中定义了结构 `stack_type`，该结构包含一个定长数组（记录栈中的内容）和一个整数（记录栈顶）：
    ```cpp
    struct stack_type {
        int contents[STACK_SIZE];
        int top;
    };
    ```
2. `stackADT.c` 程序如下所示
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "stackADT.h"

    #define STACK_SIZE 100

    struct stack_type {
        int contents[STACK_SIZE];
        int top;
    };

    static void terminate (const char *message)
    {
        printf("%s\n", message);
        exit(EXIT_FAILURE);
    }

    Stack create(void)
    {
        Stack s = malloc(sizeof(struct stack_type));
        if (s == NULL)
            terminate("Error in create: stack could not be created.");
        s->top = 0;
        return s;
    }

    void destroy(Stack s)
    {
        free(s);
    }

    void make_empty(Stack s)
    {
        s->top = 0;
    }

    bool is_empty(Stack s)
    {
        return s->top == 0;
    }

    bool is_full(Stack s)
    {
        return s->top == STACK_SIZE;
    }

    void push(Stack s, int i)
    {
        if (is_full(s))
            terminate("Error in push: stack is full.");
        s->contents[s->top++] = i;
    }

    int pop(Stack s)
    {
        if (is_empty(s))
            terminate("Error in pop: stack is empty.");
        return s->contents[--s->top];
    }
    ```
    注意这里是用 `->` 运算符而不是 `.` 运算符来访问 `stack_type` 结构的 `contents` 和 `top` 成员。因为参数 `s` 是指向 `stack_type` 结构的指针，而不是结构本身。

### 改变栈抽象数据类型中数据项的类型
1. 现在我们已经有了栈抽象数据类型的一个版本，下面对其进行改进。
2. 首先，注意到栈里的项都是整数，太具有局限性了。事实上，栈中的数据项类型是无关紧要的，可以是其他基本类型，也可以是结构、联合或指针。
3. 为了使栈抽象数据类型更易于针对不同的数据项类型进行修改，我们在 `stackADT.h` 中增加了一行类型定义。现在用类型名 `Item` 表示待存储到栈中的数据的类型。
    ```cpp
    #ifndef STACKADT_H
    #define STACKADT_H

    #include <stdbool.h>

    typedef int Item; // 改动

    typedef struct stack_type *Stack;

    Stack create(void);
    void destroy(Stack s);
    void make_empty(Stack s);
    bool is_empty(Stack s);
    bool is_full(Stack s);
    void push(Stack s, Item i); // 改动
    Item pop (Stack s); // 改动

    #endif

    ```
4. 为了跟 `stackADT.h` 匹配，`stackADT.c` 文件也需要做相应的修改。`stack_type` 结构将包含一个数组，数组的元素是 `Item` 类型而不再是 `int` 类型：
    ```cpp
    struct stack_type {
        Item contents[STACK_SIZE]; // 改动
        int top;
    };
5. `push` 和 `pop` 的函数体部分没有改变，相应的改变仅仅是把 `push` 的第二个参数和 `pop` 的返回值改成了 `Item` 类型
    ```cpp
    void push(Stack s, Item i) // 改动
    {
        if (is_full(s))
            terminate("Error in push: stack is full.");
        s->contents[s->top++] = i;
    }

    Item pop(Stack s) // 改动
    {
        if (is_empty(s))
            terminate("Error in pop: stack is empty.");
        return s->contents[--s->top];
    }
    ```
6. 现在我们就可以通过修改 `stackADT.h` 中 `Item` 类型的定义来任意修改数据项类型了。比如把它定义为一个结构类型
    ```cpp
    typedef struct moe {
        char name[10];
        int age;
    } Item;
    ```
    然后在 `stackclient.c` 中也要使用 `struct moe` 类型的数据
    ```cpp
    #include <stdio.h>
    #include "stackADT.h"

    int main(void)
    {

        struct moe moe22 = { "22chan", 33 };
        struct moe moe33 = { "33chan", 22 };
        struct moe moeTV = { "TV", 450 };

        Stack s1, s2;
        struct moe moe_ptr;

        s1 = create();
        s2 = create();

        push(s1, moe22);
        push(s1, moe33);
        
        moe_ptr = pop(s1);
        
        printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);

        push(s2, moe_ptr);
        moe_ptr = pop(s1);
        
        printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);
        push(s2, moe_ptr);

        destroy(s1);
        
        while (!is_empty(s2)) {
            moe_ptr = pop(s2);
            printf("Popped %s(age %d) from s2\n", moe_ptr.name, moe_ptr.age);
        }
        
        push(s2, moeTV);
        make_empty(s2);
        
        if (is_empty(s2))
            printf("s2 is empty\n");
        else
            printf("s2 is not empty\n");

        destroy(s2);

        return 0;
    }
    ```
    输出为
    ```cpp
    Popped 33chan(age 22) from s1
    Popped 22chan(age 33) from s1
    Popped 22chan(age 33) from s2
    Popped 33chan(age 22) from s2
    s2 is empty
    ```





































































































## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)