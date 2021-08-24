# 栈


<!-- TOC -->

- [栈](#栈)
    - [设计思想](#设计思想)
        - [时间或空间的对称性](#时间或空间的对称性)
        - [栈和递归的关系](#栈和递归的关系)
    - [用两个栈实现一个队列](#用两个栈实现一个队列)

<!-- /TOC -->


## 设计思想
### 时间或空间的对称性
1. 在进行括号匹配算法时，体会出了这种空间上的对称性。
2. 不管是栈还是正确匹配的括号，都有这种空间上的对称性。
3. 至于时间上的对称性，可以想象，越早入栈的元素，会匹配越晚的时间来出栈。
4. 现在还不知道怎么用语言来准确的描述这种对称性，先体会这种感觉。

### 栈和递归的关系


## 用两个栈实现一个队列
1. 这里的一个前提是，我们的栈已经实现好了，也就是说不能为了实现队列而修改当前栈的实现。
2. 栈和队列添加元素的方式是一样的，而取出元素的方式是相反的。
3. 为了取出最早 push 的元素，需要把后来加入的所有元素先 pop 出来并保存到其他地方。
4. 假设现在栈 A 里面是 `[1, 2, 3, 4, 5]`，要 dequeue 的对象是 `1`。那就先依次把 `5`、`4`、`3`、`2` pop 出来并 push 到栈 B 里面。
5. 栈 B 变成 `[5, 4, 3, 2]`。现在，不仅能成功的 dequeue `1`，而且 B 里面的顺序也成了队列的顺序了。
6. 正是由于栈的对称性，所以在轻松实现了反转。
7. 现在 dequeue 就从 B 里面 pop，enqueue 就往 A 里面 push；如果 B 空了就再把 A 里面的转移进来
    ```cpp
    #include <stdio.h>
    #include "Stack.h"


    Stack s1;
    Stack s2;

    void enqueue (int n);
    int dequeue ();
    void remove_to_s2();
    void printQueue();


    int main(void) {
        
        s1.top = -1;
        s2.top = -1;
        
        enqueue(15);
        enqueue(6);
        enqueue(9);
        enqueue(8);
        enqueue(4);
        printQueue();

        enqueue(17);
        enqueue(3);
        enqueue(5);
        printQueue();

        printf("Dequeue %d\n", dequeue());
        printQueue();

        return 0;

    }


    void enqueue (int n) {
        push(&s1, n);
    }
    int dequeue () {
        if (isEmpty(&s2)) {
            remove_to_s2();
        }
        return pop(&s2);
    }
    void remove_to_s2 () {
        int top1 = s1.top;
        while (top1-- >= 0) {
            push(&s2, pop(&s1));
        }
    }
    void printQueue() {
        int top2 = s2.top;
        while (top2 >= 0) {
            printf("%d ", s2.list[top2--]);
        }
        printStack(&s1);
        printf("\n");
    }
    ```