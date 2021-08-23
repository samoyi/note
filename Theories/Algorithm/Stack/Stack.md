# 栈


<!-- TOC -->

- [栈](#栈)
    - [设计思想](#设计思想)
        - [时间或空间的对称性](#时间或空间的对称性)
        - [改变方法和改变对象](#改变方法和改变对象)
        - [栈和递归的关系](#栈和递归的关系)
    - [用两个栈实现一个队列](#用两个栈实现一个队列)
    - [TODO](#todo)
        - [习题 1.3.45   1.3.46   1.3.48   1.3.49](#习题-1345---1346---1348---1349)

<!-- /TOC -->


## 设计思想
### 时间或空间的对称性
1. 在进行括号匹配算法时，体会出了这种空间上的对称性。
2. 不管是栈还是正确匹配的括号，都有这种空间上的对称性。
3. 至于时间上的对称性，可以想象，越早入栈的元素，会匹配越晚的时间来出栈。
4. 现在还不知道怎么用语言来准确的描述这种对称性，先体会这种感觉。

### 改变方法和改变对象
1. 栈和队列添加元素的方式是一样的，而取出元素的方式是相反的。
2. 所以，用栈实现队列时，添加元素的方式还是可以继续使用栈的 push，但取出元素是相反的就不能用了。
3. 因为栈的取出元素是的规则是确定的，如果规则不能变，那就可以考虑改变被操作的对象。
4. 规则还是继续用原来的 pop，但是通过第二个栈，把被操作对象的顺序颠倒过来。现在虽然还是使用栈的取元素规则，但因为被操作的元素变了，所以结果也就变了。
5. 改变规则和改变被操作对象，都可以实现对结果的改变。

### 栈和递归的关系


## 用两个栈实现一个队列
1. 这里的一个前提是，我们的栈已经实现好了，也就是说不能为了实现队列而修改当前栈的实现。
2. 栈是后入先出的，你 pop 出来的不是想要的。
3. 不过现在还有另外一个栈，也许我们可以把 pop 出来暂时不想要的先放进去。
4. 假设现在栈 A 里面是 `[1, 2, 3, 4, 5]`，现在要 dequeue 的对象是 1。那就要先把 2、3、4、5 存到栈 B 里面。
5. 依次 push 进 B，B 变成 `[5, 4, 3, 2]`。现在，不仅能成功的 dequeue 1，而且 B 里面的顺序也成了队列的顺序了。
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


## TODO
### 习题 1.3.45   1.3.46   1.3.48   1.3.49