# Program Organization


<!-- TOC -->

- [Program Organization](#program-organization)
    - [局部变量](#%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F)
        - [性质](#%E6%80%A7%E8%B4%A8)
            - [自动存储期限](#%E8%87%AA%E5%8A%A8%E5%AD%98%E5%82%A8%E6%9C%9F%E9%99%90)
            - [块作用域](#%E5%9D%97%E4%BD%9C%E7%94%A8%E5%9F%9F)
        - [静态局部变量](#%E9%9D%99%E6%80%81%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F)
        - [形式参数](#%E5%BD%A2%E5%BC%8F%E5%8F%82%E6%95%B0)
    - [外部变量](#%E5%A4%96%E9%83%A8%E5%8F%98%E9%87%8F)
        - [外部变量的利与弊](#%E5%A4%96%E9%83%A8%E5%8F%98%E9%87%8F%E7%9A%84%E5%88%A9%E4%B8%8E%E5%BC%8A)
    - [程序块](#%E7%A8%8B%E5%BA%8F%E5%9D%97)
    - [作用域](#%E4%BD%9C%E7%94%A8%E5%9F%9F)
    - [构建 C 程序](#%E6%9E%84%E5%BB%BA-c-%E7%A8%8B%E5%BA%8F)
    - [一例](#%E4%B8%80%E4%BE%8B)
    - [习题](#%E4%B9%A0%E9%A2%98)
    - [References](#references)

<!-- /TOC -->


## 局部变量
我们把在函数体内声明的变量称为该函数的 **局部变量**。

### 性质
默认情况下，局部变量具有下列性质:

#### 自动存储期限
1. 变量的 **存储期限**（storage duration）（或 **存储长度**）是在变量存储单元存在期内程序执行的部分。
2. 局部变量的存储单元是在包含该变量的函数被调用时 “自动” 分配的，函数返回时收回分配，所以称这种变量具有 **自动的存储期限**。
3. 包含局部变量的函数返回时，局部变量的值无法保留。当再次调用该函数时，无法保证变量仍拥有原先的值。

#### 块作用域
1. 变量的 **作用域** 是可以引用该变量的程序文本的部分。
2. 局部变量拥有 **块作用域**：从 **变量声明的点**（不存在提升）开始一直到所在函数体的末尾。因为局部变量的作用域不能延伸到其所属函数之外，所以其他函数可以把同名变量用于别的用途。
3. C99 不要求在函数一开始就进行变量声明，所以局部变量的作用域可能非常小。

### 静态局部变量
1. 在局部变量声明中放置单词 `static` 可以使变量具有 **静态存储期限** 而不再是自动存储期限。
2. 因为具有静态存储期限的变量拥有永久的存储单元，所以在整个程序执行期间都会保留变量的值。
3. 思考下面的函数：
    ```cpp
    void f(void) {
        static int i;    /* static local variable */
        printf("%d\n", i++);
    }

    int main(void)
    {
        f(); // 0
        f(); // 1
        f(); // 2

        return 0;
    }
    ```
    因为局部变量 `i` 已经声明为 `static`，所以在程序执行期间它所占据的内存单元是不变的。在 `f` 返回时，变量 `i` 不会丢失其值。
4. 静态局部变量始终有块作用域，所以它对其他函数是不可见的。概括来说，静态变量是对其他函数隐藏数据的地方，但是它会为将来同一个函数的再调用保留这些数据。

### 形式参数
1. 形式参数拥有和局部变量一样的性质，即自动存储期限和块作用域。
2. 事实上，形式参数和局部变量唯一真正的区别是，在每次函数调用时对形式参数自动进行初始化（调用中通过赋值获得相应实际参数的值）。


## 外部变量
1. 传递参数是给函数传送信息的一种方法。函数还可以通过 **外部变量**（external variable）进行通信。外部变量是声明在任何函数体外的。
2. 外部变量（有时称为 **全局变量**）的性质不同于局部变量的性质：
    * **静态存储期限**。就如同声明为 `static` 的局部变量一样，外部变量拥有静态存储期限。存储在外部变量中的值将永久保留下来。
    * **文件作用域**。外部变量拥有 **文件作用域**：从变量被声明的点开始一直到所在文件的末尾。因此，跟随在外部变量声明之后的所有函数都可以访问（并修改）它。

### 外部变量的利与弊
1. 在多个函数必须共享一个变量时或者少数几个函数共享大量变量时，外部变量是很有用的。然而，在大多数情况下，对函数而言，通过形式参数进行通信比通过共享变量的方法更好。
2. 下面列举的是原因
    * 在程序维护期间，如果改变外部变量（比方说改变它的类型），那么将需要检查同一文件中的每个函数，以确认该变化如何对函数产生影响。
    * 如果外部变量被某个函数赋了错误的值，可能很难确定出错的函数。就好像处理大型聚会上的谋杀案时很难缩小嫌疑人范围一样。
    * 很难在其他程序中复用依赖于外部变量的函数。依赖外部变量的函数不是 “独立的”。为了在另一个程序中使用该函数，必须带上此函数需要的外部变量。


## 程序块
1. 默认情况下，声明在程序块中的变量的存储期限是自动的：进入程序块时为变量分配存储单元，退出程序块时收回分配的空间。变量具有块作用域，也就是说，不能在程序块外引用。
2. C99 允许在程序块的任何地方声明变量，就像允许在函数体内的任何地方声明变量一样。


## 作用域
1. 下面是最重要的作用域规则：当程序块内的声明命名一个标识符时，如果此标识符已经是可见的（因为此标识符拥有文件作用域，或者因为它已在某个程序块内声明），新的声明临时 “隐藏” 了旧的声明，标识符获得了新的含义。在程序块的末尾，标识符重新获得旧的含义。
2. 也就是块级作用域的标识符会覆盖文件作用域中的同名标识符。


## 构建 C 程序
1. 迄今为止，已经知道程序可以包含：
    * 诸如 `#include` 和 `#define` 这样的预处理指令；
    * 类型定义；
    * 外部变量声明；
    * 函数原型；
    * 函数定义。
2. C 语言对上述这些项的顺序要求极少：
    * 执行到预处理指令所在的代码行时，预处理指令才会起作用；
    * 类型名定义后才可以使用；
    * 变量声明后才可以使用;
    * 虽然 C 语言对函数没有什么要求，但是这里强烈建议在第一次调用函数前要对每个函数进行定义或声明。至少 C99 要求我们这么做。
3. 为了遵守这些规则，这里有几个构建程序的方法。下面是一种可能的编排顺序：
    1. `#include` 指令；
    2. `#define` 指令；
    3. 类型定义；
    4. 外部变量的声明；
    5. 除 `main` 函数之外的函数的原型；
    6. `main` 函数的定义；
    7. 其他函数的定义。
4. 因为 `#include` 指令带来的信息可能在程序中的好几个地方都需要，所以先放置这条指令是合理的。
5. `#define` 指令创建宏，对这些宏的使用通常遍布整个程序。
6. 类型定义放置在外部变量声明的上面是合乎逻辑的，因为这些外部变量的声明可能会引用刚刚定义的类型名。
7. 接下来，声明外部变量使得它们对于跟随在其后的所有函数都是可用的。
8. 在编译器看见原型之前调用函数，可能会产生问题，而此时声明除了 `main` 函数以外的所有函数可以避免这些问题。这种方法也使得无论用什么顺序编排函数定义都是可能的。例如，根据函数名的字母顺序编排，或者把相关函数组合在一起进行编排。
9. 在其他函数前定义 `main` 函数使得阅读程序的人容易定位程序的起始点。
10. 最后的建议：在每个函数定义前放盒型注释可以给出函数名、描述函数的目的、讨论每个形式参数的含义、描述返回值（如果有的话）并罗列所有的副作用（如修改了外部变量的值）。


## 一例
1. 出自 [C语言程序设计](https://book.douban.com/subject/4279678/) 第 10 章。
2. 程序的轮廓
    ```cpp
    /* #include directives go here */

    /* #define directives go here */

    /* declarations of external variables go here */

    /* prototypes */
    void read_cards(void);
    void analyze_hand(void);
    void print_result(void);

    /************************************************************
     * main: Calls read_cards, analyze_hand, and print_result   *
     *       repeatedly.                                        *
     ************************************************************/
    int main(void)
    {
        for (;;)  {
            read_cards();
            analyze_hand();
            print_result();
        }
    }

    /***********************************************************
     * read_cards:  Reads the cards into external variables;   *
     *              checks for bad cards and duplicate cards.  *
     ***********************************************************/
    void read_cards(void)
    {
        ...
    }

    /************************************************************
     * analyze_hand: Determines whether the hand contains a     *
     *               straight,  a flush,  four-of-a-kind,       *
     *               and/or three-of-a-kind;  determines the    *
     *               number of pairs;  stores the results into  *
     *               external variables.                        *
     ************************************************************/
    void analyze_hand(void)
    {
        ...
    }

    /************************************************************
    * print_result: prints the classification of the hand, *
    *               the external variables set by              *
    *               analyze_hand.                              *
    ************************************************************/
    void print_result(void)
    {
        ...
    }
    ```
3. 完整程序
    ```cpp
    /* Classifies a poker hand */

    #include <stdbool.h>   /* C99 only */
    #include <stdio.h>
    #include <stdlib.h>

    #define NUM_RANKS 13
    #define NUM_SUITS 4
    #define NUM_CARDS 5

    /* external variables */
    int num_in_rank[NUM_RANKS];
    int num_in_suit[NUM_SUITS];
    bool straight, flush, four, three;
    int pairs;   /* can be 0, 1, or 2 */

    /* prototypes */
    void read_cards(void);
    void analyze_hand(void);
    void print_result(void);

    /************************************************************
     * main: Calls read_cards, analyze_hand, and print_result   *
     *       repeatedly.                                        *
     ************************************************************/
    int main(void)
    {
        for (;;) {
            read_cards();
            analyze_hand();
            print_result();
        }
    }

    /************************************************************
     * read_cards: Reads the cards into the external            *
     *             variables num_in_rank and num_in_suit;       *
     *             checks for bad cards and duplicate cards.    *
     ************************************************************/
    void read_cards(void)
    {
        bool card_exists[NUM_RANKS][NUM_SUITS];
        char ch, rank_ch, suit_ch;
        int rank, suit;
        bool bad_card;
        int cards_read = 0;

        for (rank = 0; rank < NUM_RANKS; rank++) {
            num_in_rank[rank] = 0;
            for (suit = 0; suit < NUM_SUITS; suit++)
                card_exists[rank][suit] = false;
        }

        for (suit = 0; suit < NUM_SUITS; suit++)
            num_in_suit[suit] = 0;

        while (cards_read < NUM_CARDS) {
            bad_card = false;

            printf("Enter a card: ");

            rank_ch = getchar();
            switch (rank_ch) {
                case '0':           exit(EXIT_SUCCESS);
                case '2':           rank = 0; break;
                case '3':           rank = 1; break;
                case '4':           rank = 2; break;
                case '5':           rank = 3; break;
                case '6':           rank = 4; break;
                case '7':           rank = 5; break;
                case '8':           rank = 6; break;
                case '9':           rank = 7; break;
                case 't': case 'T': rank = 8; break;
                case 'j': case 'J': rank = 9; break;
                case 'q': case 'Q': rank = 10; break;
                case 'k': case 'K': rank = 11; break;
                case 'a': case 'A': rank = 12; break;
                default:            bad_card = true;
            }

            suit_ch = getchar();
            switch (suit_ch) {
                case 'c': case 'C': suit = 0; break;
                case 'd': case 'D': suit = 1; break;
                case 'h': case 'H': suit = 2; break;
                case 's': case 'S': suit = 3; break;
                default:            bad_card = true;
            }

            while ((ch = getchar()) != '\n')
                if (ch != ' ') bad_card = true;

                if (bad_card)
                    printf("Bad card; ignored.\n");
                else if (card_exists[rank][suit])
                    printf("Duplicate card; ignored.\n");
                else {
                    num_in_rank[rank]++;
                    num_in_suit[suit]++;
                    card_exists[rank][suit] = true;
                    cards_read++;
            }
        }
    }

    /************************************************************
     * analyze_hand: Determines whether the hand contains a     *
     *               straight, a flush, four-of-a-kind,         *
     *               and/or three-of-a-kind; determines the     *
     *               number of pairs; stores the results into   *
     *               the external variables straight, flush,    *
     *               four, three, and pairs.                    *
     ************************************************************/
    void analyze_hand(void)
    {
        int num_consec = 0;
        int rank, suit;

        straight = false;
        flush = false;
        four = false;
        three = false;
        pairs = 0;

        /* check for flush */
        for (suit = 0; suit < NUM_SUITS; suit++)
            if (num_in_suit[suit] == NUM_CARDS)
                flush = true;

        /* check for straight */
        rank = 0;
        while (num_in_rank[rank] == 0) rank++;
        for (; rank < NUM_RANKS && num_in_rank[rank] > 0; rank++)
            num_consec++;
        if (num_consec == NUM_CARDS) {
            straight = true;
            return;
        }

        /* check for 4-of-a-kind, 3-of-a-kind, and pairs */
        for (rank = 0; rank < NUM_RANKS; rank++) {
            if (num_in_rank[rank] == 4) four = true;
            if (num_in_rank[rank] == 3) three = true;
            if (num_in_rank[rank] == 2) pairs++;
        }
    }
    /************************************************************
     * print_result: prints the  classification of the hand,    *
     *               based on the values of the external        *
     *               variables straight, flush, four, three,    *
     *               and pairs.                                 *
     ************************************************************/
    void print_result(void)
    {
        if (straight && flush) printf("Straight flush");
        else if (four)         printf("Four of a kind");
        else if (three &&
                pairs == 1)   printf("Full house");
        else if (flush)        printf("Flush");
        else if (straight)     printf("Straight");
        else if (three)        printf("Three of a kind");
        else if (pairs == 2)   printf("Two pairs");
        else if (pairs == 1)   printf("Pair");
        else                   printf("High card");

        printf("\n\n");
    }
    ```


## 习题
* 编程题 1
    ```cpp
    #include <stdbool.h>
    #include <stdlib.h>
    #include <stdio.h>

    #define STACK_SIZE 100

    int contents[STACK_SIZE];
    int top = 0;


    void make_empty(void);
    bool is_empty(void);
    bool is_full(void);
    char getTop();
    void push(char ch);
    char pop(void);
    void stack_overflow(void);
    void stack_underflow(void);
    void check(char chars[], int size);
    bool isPair (char ch1, char ch2);


    int main (void) {
        printf("Enter parenteses and/or braces: ");

        char ch;
        char chs[STACK_SIZE];
        int i=0;
        
        while ( (ch=getchar()) != '\n' ) {
            chs[i++] = ch;
        }

        check(chs, i);

        
        if ( is_empty() ) {
            printf("true");
        }   
        else {
            printf("false");
        }

        return 0;
    }

    void make_empty(void)
    {
        top = 0;
    }

    bool is_empty(void)
    {
        return top == 0;
    }

    char getTop() {
        return contents[top-1];
    }

    bool is_full(void)
    {
        return top == STACK_SIZE;
    }

    void push(char ch)
    {
        if (is_full())
            stack_overflow();
        else
            contents[top++]  = ch;
    }

    char pop(void)
    {
        if (is_empty())
            stack_underflow();
        else
            return contents [--top];
    }

    void stack_overflow (void) {
        printf("\nstack_overflow\n");
        exit(EXIT_SUCCESS);
    }

    void stack_underflow (void) {
        printf("\nstack_underflow\n");
        exit(EXIT_FAILURE); 
    }

    void check(char chars[], int size) {
        for ( int i=0; i<size; i++ ) {
            if ( is_empty() ) {
                push( chars[i] );
            }
            else {
                if (isPair( getTop(), chars[i] )) {
                    pop();
                }
                else {
                    push( chars[i] );
                }
            }
            
        }
    }

    bool isPair (char ch1, char ch2) {
        if ( ch1 == '(' && ch2 == ')' ) {
            return true;
        }
        if ( ch1 == ')' && ch2 == '(' ) {
            return true;
        }
        
        if ( ch1 == '[' && ch2 == ']' ) {
            return true;
        }
        if ( ch1 == ']' && ch2 == '[' ) {
            return true;
        }
        
        if ( ch1 == '{' && ch2 == '}' ) {
            return true;
        }
        if ( ch1 == '}' && ch2 == '{' ) {
            return true;
        }

        return false;
    }
    ```
* 编程题 5
TODO 不能处理负数
```cpp
#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>

#define STACK_SIZE 100

char contents[STACK_SIZE];
int top = 0;

void make_empty(void);
bool is_empty(void);
bool is_full(void);
char getTop();
void push(char ch);
char pop(void);
void stack_overflow(void);
void stack_underflow(void);
bool isNumChar (char ch);
bool isOpaChar (char ch);
void calc(char ch);
void makeCalc (void);


int main (void) {
    
    while (1) {
        makeCalc();
    }

    return 0;
}


void make_empty(void)
{
    top = 0;
}

bool is_empty(void)
{
    return top == 0;
}

char getTop() {
    return contents[top-1];
}

bool is_full(void)
{
    return top == STACK_SIZE;
}

void push(char ch)
{
    if (is_full())
        stack_overflow();
    else
        contents[top++]  = ch;
}

char pop(void)
{
    if (is_empty())
        stack_underflow();
    else
        return contents [--top];
}

void stack_overflow (void) {
    printf("\nExpression is too complex\n");
    exit(EXIT_SUCCESS);
}

void stack_underflow (void) {
    printf("\nNot enough operands in expression\n");
    exit(EXIT_FAILURE); 
}


bool isNumChar (char ch) {
    return ch>=48 && ch <= 57;
}
bool isOpaChar (char ch) {
    return ch=='+' || ch=='-' || ch=='*' || ch=='/';
}

void printStack (void) {
    printf("\n\n************printStack***********");
    for (int i = 0; i<10; i++ ) {
        printf("\n%d", contents[i]);
    }
    printf("\n*********************************\n\n");
}

char temp;
char pop1;
char pop2;

void calc(char ch) {
    switch (ch) {
        case '+': 
            push( pop() + pop() );
            break;
        case '-': 
            push( pop() - pop() );
            break;
        case '*': 
            push( pop() * pop() );
            break;
        case '/': 
            push( pop() / pop() );
            break;
    }
}

void makeCalc (void) {
    printf("Enter an RPN expression: ");

    char ch;
    scanf(" %c", &ch);
    while ( ch != '\n' ) {
        if ( isNumChar(ch) ) {
            push(ch-'0'); // 转为该字符串整数对应的字符
            scanf(" %c", &ch);
        }
        else if ( isOpaChar(ch) ) {
            calc(ch);
            scanf(" %c", &ch);
        }
        else if ( ch == '=' ) {
            printf("Value of expression: %d\n\n", pop());
            printf("Enter an RPN expression: ");
            scanf(" %c", &ch);
        }
        else {
            exit(EXIT_SUCCESS);
        }
    }
}
```


## References
* [C语言程序设计](https://book.douban.com/subject/4279678/)