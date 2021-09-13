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
        - [用数组实现栈模块](#用数组实现栈模块)
        - [用链表实现栈模块](#用链表实现栈模块)
    - [抽象数据类型](#抽象数据类型)
        - [封装](#封装)
        - [不完整类型](#不完整类型)
    - [栈抽象数据类型](#栈抽象数据类型)
        - [为栈抽象数据类型定义接口](#为栈抽象数据类型定义接口)
        - [用定长数组实现栈抽象数据类型](#用定长数组实现栈抽象数据类型)
        - [改变栈抽象数据类型中数据项的类型](#改变栈抽象数据类型中数据项的类型)
        - [用动态数组实现栈抽象数据类型](#用动态数组实现栈抽象数据类型)
        - [用链表实现栈抽象数据类型](#用链表实现栈抽象数据类型)
    - [抽象数据类型的设计问题](#抽象数据类型的设计问题)
        - [命名惯例](#命名惯例)
        - [错误处理](#错误处理)
        - [通用抽象数据类型](#通用抽象数据类型)
        - [新语言中的抽象数据类型](#新语言中的抽象数据类型)
    - [练习](#练习)
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
3. 为了清楚地看到信息隐藏所带来的好处，下面来看看栈模块的两种实现。一种使用数组，另一种使用链表。
4. 两种实现的头文件都是不变的
    ```cpp
    //stack.h
    
    #ifndef STACK_H
    #define STACK_H

    #include <stdbool.h>          /* C99 only */

    void make_empty(void);
    bool is_empty(void);
    bool is_full(void);
    void push(int i);
    int pop(void);

    #endif
    ```
    
### 用数组实现栈模块
1. `stack.c`
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "stack.h"

    #define STACK_SIZE 100

    // 这两个变量都是通过下面的函数来访问，不需要外部访问，所以声明为内部链接
    static int contents[STACK_SIZE];
    static int top = 0;

    // 这个函数也只是本模块使用，同样声明为内部链接
    static void terminate(const char *message)
    {
        printf("%s\n", message);
        exit(EXIT_FAILURE);
    }

    void make_empty(void)
    {
        top = 0;
    }

    bool is_empty(void)
    {
        return top == 0;
    }

    bool is_full(void)
    {
    return top == STACK_SIZE;
    }

    void push(int i)
    {
        if (is_full())
            terminate("Error in push: stack is full.");
        contents[top++] = i;
    }

    int pop(void)
    {
        if (is_empty())
            terminate("Error in pop: stack is empty.");
        return contents[--top];
    }
    ```
2. 出于风格的考虑，一些程序员使用宏来指明哪些函数和变量是 “公有的”（可以在程序的任何地方访问），哪些是 “私有的”（只能在一个文件内访问）：
    ```cpp
    #define  PUBLIC   /* empty */
    #define  PRIVATE  static
    ```
3. 将 `static` 写成 `PRIVATE` 是因为 `static` 在 C 语言中有很多的用法，使用 `PRIVATE` 可以更清晰地指明这里它是被用来强制信息隐藏的
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

### 用链表实现栈模块
1. `stack.c`
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "stack.h"

    struct node {
        int data;
        struct node *next; // 指向栈内下面的节点
    };

    static struct node *top = NULL;

    static void terminate(const char *message)
    {
        printf("%s\n", message);
        exit(EXIT_FAILURE);
    }

    void make_empty(void)
    {
        while (!is_empty()) {
            pop();
        }
    }

    bool is_empty(void)
    {
        return top == NULL;
    }

    bool is_full(void)
    {
        // 链表对大小没有限制，所以栈永远不会满。
        // 程序运行时仍然可能（可能性不大）出现内存不够的问题，从而导致 push 函数失败，但事先很难测试这种情况。
        return false;
    }

    void push(int i)
    {
        struct node *new_node = malloc(sizeof(struct node));
        if (new_node == NULL) {
            terminate("Error in push: stack is full.");
        }

        new_node->data = i;
        new_node->next = top;
        top = new_node;
    }

    int pop(void)
    {
        struct node *old_top;
        int i;

        if (is_empty()) {
            terminate("Error in pop: stack is empty.");
        }

        old_top = top;
        i = top->data;

        top = top->next;

        free(old_top);
        
        return i;
    }
    ```
2. 我们的栈示例清晰地展示了信息隐藏带来的好处：使用数组还是使用链表来实现栈模块无关紧要。两个版本都能匹配模块的接口定义，因此相互替换时不需要修改程序的其他部分。


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
7. 可以看出来，这里定义 `Item` 类型只是保证了栈的实现中的逻辑保持稳定，但对于不同的类型，头文件还是要进行修改。

### 用动态数组实现栈抽象数据类型
1. 栈抽象数据类型的另一个问题是，每一个栈的大小的最大值是固定的。这样我们就不能拥有容量不同的栈了，也不能在程序运行的过程中设置栈的大小。
2. 有两种方法可以解决这个问题。一种方法是把栈作为链表来实现，这样就没有固定的大小限制。稍后我们将讨论这种方法，下面先来看看另一种方法——将栈中的数据项存放在动态分配的数组中。
3. 这一方法的关键在于修改 `stack_type` 结构，使 `contents` 成员为指向数据项所在数组的指针，而不是数组本身：
    ```cpp
    // stackADT.c
    struct stack_type {
        Item *contents;
        int top;
        int size;
    };
    ```
4. 我们还增加了一个新成员 `size` 来存储栈的最大容量（`contents` 指向的数组的长度）。我们将使用这个成员检查 “栈满” 的情况。
5. `create` 函数有一个参数指定所需的栈的最大容量：
    ```cpp
    // stackADT.h
    Stack create(int size);
    ```
    调用 `create` 函数时，它会创建一个 `stack_type` 结构和一个长度为 `size` 的数组，结构的 `contents` 成员将指向这个数组。
6. 修改后的 `stackADT.c`
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "stackADT.h"


    struct stack_type {
    Item *contents; // content 指向 Item 类型数组
    int top;
    int size; // content 指向数组的 size
    };

    static void terminate (const char *message)
    {
        printf("%s\n", message);
        exit(EXIT_FAILURE);
    }

    Stack create(int size)
    {
        Stack s = malloc(sizeof(struct stack_type));
        if (s == NULL)
            terminate("Error in create: stack could not be created.");
        s->contents = malloc(size * sizeof(Item)); // 为 contents 指向的数组分配指定的内存
        if (s->contents == NULL) {
            // 栈创建成功了，但需要的数组创建失败
            free(s);
            terminate("Error in create: stack could not be created.");
        }
        s->top = 0;
        s->size = size; // 设置 size
        return s;
    }

    void destroy(Stack s)
    {
        free(s->contents); // 分配了两个内存，两个都要释放
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
        return s->top == s->size; // 使用动态指定的 size 判断
    }

    void push(Stack s, Item i)
    {
        if (is_full(s))
            terminate("Error in push: stack is full.");
        s->contents[s->top++] = i;
    }

    Item pop(Stack s)
    {
        if (is_empty(s))
            terminate("Error in pop: stack is empty.");
        return s->contents[--s->top];
    }
    ```
7. 还可以使用上面 `struct moe` 的例子，现在创建栈时 `size` 传 2 仍然正常，但如果传 1 就会有 `stack is full` 的错误提示
    ```cpp
    s1 = create(2);
    s2 = create(2);
    ```

### 用链表实现栈抽象数据类型
1. 使用动态分配数组实现栈抽象数据类型比使用定长数组更灵活，但客户在创建栈时仍然需要指定其最大容量。如果使用链表来实现栈，就不需要预先设定栈的大小了。
2. 链表中的结点用如下结构表示：
    ```cpp
    struct node {
        Item data;
        struct node *next;
    };
    ```
3. `stack_type` 结构包含一个指向链表首结点的指针：
    ```cpp
    struct stack_type {
        struct node *top;
    };
    ```
4. 乍一看，这个结构似乎有点冗余：我们可以简单地把 `Stack` 定义为 `struct node*`，同时让 `Stack` 的值为指向链表首结点的指针。
5. 但是，我们仍然需要这个 `stack_type` 结构，这样可以使栈的接口保持不变。如果不这样做，任何一个对栈进行修改的函数都需要 `Stack *` 类型的参数而不是 `Stack` 参数。
6. 此外，如果将来我们想存储更多的信息，`stack_type` 结构的存在可以简化对实现的修改。例如，如果我们以后想给 `stack_type` 结构增加栈数据项的计数器，可以很容易地为 `stack_type` 结构增加一个成员来存储该信息。
7. 仍然可以使用上面 `struct moe` 的例子，但是用 `create` 创建栈的不需要再传 `size` 了。


## 抽象数据类型的设计问题
上面描述了栈抽象数据类型，并介绍了几种实现方法。遗憾的是，这里的抽象数据类型存在一些问题，使其达不到工业级强度。下面一起来看看这些问题，并探讨一下可能的解决方案。

### 命名惯例
1. 目前的栈抽象数据类型函数都采用简短、便于记忆的名字，例如：`create`、`destroy`、`make_empty` 和 `is_empty`。如果在一个程序中有多个抽象数据类型，两个模块中很可能具有同名函数，这样就出现了名字冲突。例如，每个抽象数据类型都需要自己的 `create` 函数。
2. 所以，我们可能需要在函数名中加入抽象数据类型本身的名字，如使用 `stack_create` 代替 `create`。

### 错误处理
1. 栈抽象数据类型通过显示出错消息或终止程序的方式来处理错误。这是一个不错的处理方式。程序员可以通过在每次调用 `pop` 之前调用 `is_empty`，在每次调用 `push` 之前调用 `is_full`，来避免从空栈中弹出数据项或者向满栈里压入数据项。
2. 所以从理论上来讲，对 `pop` 和 `push` 的调用没有理由会出错。（但在链表实现中，调用 `is_full` 并没有效果，后续调用 `push` 仍然可能出错。）
3. 不过，我们可能希望为程序提供一种从这些错误中恢复的途径，而不是简单地终止程序。一个可选的方案是让 `push` 和 `pop` 函数返回一个 `bool` 值说明函数调用是否成功。
4. 目前 `push` 的返回类型为 `void`，所以很容易改成在操作成功时返回 `true`，当堆栈已满时返回 `false`。但修改 `pop` 函数就困难一些了，因为目前 `pop` 函数返回的是弹出的值。如果让 `pop` 返回一个指向弹出的值的指针而不是返回该值本身，那就可以让 `pop` 返回 `NULL` 来表示此时栈为空。
5. 最后关于错误处理的一点评论：C 标准库里包含带参数的 `assert` 宏，可以在指定的条件不满足时终止程序。我们可以用该宏的调用取代目前栈抽象数据类型中使用的 `if` 语句和 `terminate` 函数的调用。

### 通用抽象数据类型
1. 上面我们通过简化对存储在栈中的数据项类型的修改来改进栈抽象数据类型——我们所需做的工作只是改变 `Item` 类型的定义。
2. 这样做仍然有些麻烦，如果栈能够适应任意类型的值，而不需要改变 `stack.h` 文件会更好些。
3. 同时我们注意到，现在的抽象数据类型栈还存在一个严重的问题：程序不能创建两个数据类型不同的栈。创建多个栈很容易，但这些栈中的数据项必须有相同的类型。为了允许多个栈具有不同的数据项类型，我们需要复制栈抽象数据类型的头文件和源文件，并改变一组文件使 `Stack` 类型及相关的函数具有不同的名字。
4. 我们希望有一个 “通用” 的栈类型，可以用来创建整数栈、字符串栈或者需要的其他类型的栈。在 C 中有很多不同的途径可以做到这一点，但没有一个是完全令人满意的。
5. 最常见的一种方法是使用 `void *` 作为数据项类型，这样就可以压入和弹出任何类型的指针了。如果使用这种方法，`stackADT.h` 文件和我们最初的版本相似，但 `push` 和 `pop` 函数的原型需要修改为如下形式：
    ```cpp
    void push(Stack s, void* p);
    void* pop(Stack s);
    ```
    `pop` 返回一个指向从栈中弹出的数据项的指针，如果栈为空，则返回空指针。
6. 使用 `void*` 作为数据项类型有两个缺点:
    * 这种方法不适用于无法用指针形式表示的数据。数据项可以是字符串（用指向字符串第一个字符的指针表示）或动态分配的结构，但不能是 `int`、`double` 之类的基本类型。
    * 不能进行错误检测。存放 `void*` 数据项的栈允许各种类型的指针共存，所以无法检测出由压入错误的指针类型导致的错误。

### 新语言中的抽象数据类型
1. 上面讨论的问题在新的基于 C 的语言（如 C++、Java 和 C#）中处理得更好。
2. 通过在 **类** 中定义函数名可以避免名字冲突的问题。栈抽象数据类型可以用一个 `Stack` 类来表示；栈函数都属于这个类，而且仅当作用于 `Stack` 对象时才能被编译器识别。
3. 这些语言都提供了一种称为 **异常处理**（exception handling）的特性，允许 `push` 和 `pop` 等函数在检测出错误时 “抛出” 异常。客户代码可以通过 “捕获” 异常来处理错误。
4. C++、Java 和 C# 还专门提供了定义通用抽象数据类型的特性。例如，在 C++ 中我们可以定义一个栈 **模板**，而不指定数据项的类型。


## 练习
* 练习题 1
    ```cpp
    // queueADT.h

    #ifndef QUEUE_H
    #define QUEUE_H

    #include <stdbool.h>

    typedef struct moe {
        char name[10];
        int age;
    } Item;

    typedef struct queue_type *Queue;

    Queue create(void);
    void destroy(Queue q);
    void make_empty(Queue q);
    bool is_empty(Queue q);
    bool is_full(Queue q);
    void enqueue(Queue q, Item i);
    Item dequeue (Queue q);

    #endif
    ```
    ```cpp
    // queueADT.c

    #include <stdio.h>
    #include <stdlib.h>
    #include "queueADT.h"

    struct node {
        Item data;
        struct node *next;
    };

    struct queue_type {
        struct node *head;
        struct node *tail;
    };


    static void terminate (const char *message)
    {
        printf("%s\n", message);
        exit(EXIT_FAILURE);
    }

    Queue create(void)
    {
        Queue q = malloc(sizeof(struct queue_type));
        if (q == NULL)
                terminate("Error in create: queue could not be created.");
        q->head = NULL;
        q->tail = NULL;
        return q;
    }

    void destroy(Queue q)
    {
        make_empty(q);
        free(q);
    }

    void make_empty(Queue q)
    {
        while (!is_empty(q)) {
            dequeue(q);
        }
    }

    bool is_empty(Queue q)
    {
        return q->head == NULL;
    }

    bool is_full(Queue q)
    {
        return false;
    }

    void enqueue(Queue q, Item i)
    {
        struct node *new_node = malloc(sizeof(struct node));
        if (new_node == NULL) {
            terminate("Error in push: queue is full.");
        }

        new_node->data = i;
        new_node->next = NULL;
        if (is_empty(q)) {
            q->head = new_node;
            q->tail = new_node;
        }
        else {
            q->tail->next = new_node;
        }
        q->tail = new_node;
    }

    Item dequeue(Queue q)
    {
        struct node *old_head;
        Item i;
        if (is_empty(q))
            terminate("Error in pop: queue is empty.");
    
        old_head = q->head;
        i = old_head->data;

        q->head = old_head->next;
        if (q->head == NULL) {
            q->tail = NULL;
        }

        free(old_head);

        return i;
    }
    ```
    ```cpp
    // queueclient.c

    #include <stdio.h>
    #include "queueADT.h"

    int main(void)
    {

        struct moe moe22 = { "22chan", 33 };
        struct moe moe33 = { "33chan", 22 };
        struct moe moeTV = { "TV", 450 };
        
        Queue q1, q2;
        struct moe moe_ptr;
        
        q1 = create();
        q2 = create();
        enqueue(q1, moe22);
        enqueue(q1, moe33);
        

        moe_ptr = dequeue(q1);
        
        printf("Dequeue %s(age %d) from q1\n", moe_ptr.name, moe_ptr.age);

        enqueue(q2, moe_ptr);
        moe_ptr = dequeue(q1);
        
        printf("Dequeue %s(age %d) from q1\n", moe_ptr.name, moe_ptr.age);
        enqueue(q2, moe_ptr);

        destroy(q1);

        while (!is_empty(q2)) {
            moe_ptr = dequeue(q2);
            printf("Dequeue %s(age %d) from q2\n", moe_ptr.name, moe_ptr.age);
        }
        
        enqueue(q2, moeTV);
        make_empty(q2);
        
        if (is_empty(q2))
            printf("q2 is empty\n");
        else
            printf("q2 is not empty\n");

        destroy(q2);

        return 0;
    }
    ```












































































## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)