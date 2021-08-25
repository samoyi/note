# Queue


<!-- TOC -->

- [Queue](#queue)
    - [本质](#本质)
        - [先入先出的线性时间顺序](#先入先出的线性时间顺序)
        - [顺序环形结构](#顺序环形结构)
        - [流动循环感](#流动循环感)
    - [用途](#用途)
        - [先入先出的线性时间次序](#先入先出的线性时间次序)
    - [实现细节](#实现细节)
    - [两个队列实现一个栈](#两个队列实现一个栈)
    - [一些习题](#一些习题)
        - [1.3.37 Josephus 问题](#1337-josephus-问题)

<!-- /TOC -->


## 本质
### 先入先出的线性时间顺序
排队

### 顺序环形结构
1. 队列的实现中会把数组首尾相接连成一个环，随着元素的增删，元素组成的队列环会在数组中不断增删和移动。
2. 对于使用者来说，并不会意识到环的存在，只会看到环中的队列部分。

### 流动循环感
1. 队列有一种线性的、定向的流动循环感，从一端进入，从另一端离开。
2. 如果把队列的首尾相连，线性的流动就变成了流动的环，也就是不断的出队列再入队列。
3. 栈就不是线性的结构，而且也没有流动循环感，也无法变成环形结构。
4. 只要发生变化，队列里的元素一定都是在流动的、循环的；而栈就不一定了，越靠近栈底，元素可能越不会变动。


## 用途
### 先入先出的线性时间次序
在任何系统中，如果有按照时间顺序的先入先出的线性逻辑，就可以考虑是否可以用队列。


## 实现细节
1. 与栈不同，队列的数组实现是一种环式结构。
2. 因为有元素出队列后，数组前方就会出现空缺，但这个空缺又不能像栈那样被新元素填补。所以如果不使用环式结构，数组项的内存使用就是一次性的了。
3. 因此，多数时候队列的头部都不是数组第一项，队列的尾部也可能出现在任何位置。
4. 所以，就不能通过单独的头部和尾部的位置来判断队列是否是空的或者满的，而必须要通过两者之间的关系。
5. 显然只能通过头部指针和尾部指针重合来表示空队列。那么：
    * 在队列为空的情况下，头指针就不表示队列的第一个元素；队列非空的情况下，头指针才指向队列头元素。
    * 而尾指针表示的就是下一个元素入列的位置。
6. 由于头尾指针重合表示空队列，并且尾指针表示下一个入列的位置，所以 n 项数组实现的队列只能保存 n-1 个有效队列元素：因为当第 n 个元素也保存了有效队列元素时，尾指针就会和头指针重合，从而让队列称为空的。也就是说，尾指针指向的位置永远都是空的（不一定是在数组末尾）。
7. 那么，判断队列满的条件就是，尾指针之后的位置是头指针。当然要考虑到环式结构，也就是要包含尾指针在数组尾部而头指针在数组头部的情况。


## 两个队列实现一个栈
1. 和两个栈实现一个队列的情况一样，都是加入元素的方法是相同的，但是取出元素的方法是相反的。
2. 因为栈需要让最后加入的先移出，而队列必须先移出之前加入的，所以必须要有个地方先保存之前加入的。
3. 依次 dequeue 队列 A 前面的元素并 enqueue 到队列 B 后，就可以 dequeue 队列 A 最后一个元素来实现 pop。
4. 但与两个栈实现队列不同的是，现在队列 B 并不能直接按顺序 dequeue 来实现 pop，因为队列没有像栈那样的对称性，所以顺序不会反转。
5. 所以现在要再出栈的话，就要再让 B 依次 dequeue 并 enquque 到 A 里面。它前面的元素都先出列到另一个队列。
6. 因为顺序没有反转，所以现在要实现入栈的话，不能像两个栈实现队列一样往空栈 A 中 push 新元素，而是要往队列 B 里 enqueue。
7. 也就是说，要实现 push 就要往已有元素的队列里 enqueue，要实现 pop 就要把已有元素的队列都依次转移到另一个空队列。
8. 也就是说，只要实现的这个栈里有元素，那肯定都按照 enqueue 的顺序全部排列在其中一个队列里
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "Queue.h"


    Queue q1;
    Queue q2;
    Queue* p1 = &q1;
    Queue* p2 = &q2;

    void push(int);
    int pop();
    void printStack();


    int main(void) {
        initQueue(p1, 10);
        initQueue(p2, 10);

        push(15);
        push(6);
        push(9);
        push(8);
        push(4);
        printStack();

        push(17);
        push(3);
        push(5);
        printStack();

        printf("Pop %d\n", pop());
        printStack();

        freeQueue(p1);
        freeQueue(p2);

        return 0;
    }



    void push (int n) {
        if ( isFull(p1) && isFull(p2) ) {
            printf("overflow\n");
            exit(EXIT_FAILURE);
        }

        if ( isEmpty(p2) ) {
            enqueue(p1, n);
        }
        else {
            enqueue(p2, n);
        }
    }

    int pop () {
        if ( isEmpty(p1) && isEmpty(p2) ) {
            printf("underflow");
            exit(EXIT_FAILURE);
        }
        
        if ( isEmpty(p2) ) {
            while ( countQueue(p1) > 1 ) {
                enqueue(p2, dequeue(p1));
            }
            return dequeue(p1);
        }
        else {
            while ( countQueue(p2) > 1 ) {
                enqueue(p1, dequeue(p2));
            }
            return dequeue(p2);
        }
    }

    void printStack() {
        if ( isEmpty(p2) ) {
            printQueue(p1);
        }
        else {
            printQueue(p2);
        }
    }
    ```


## 一些习题
### 1.3.37 Josephus 问题
1. 据说著名犹太历史学家 Josephus 有过以下的故事：在罗马人占领乔塔帕特后，39 个犹太人与 Josephus 及他的朋友躲到一个洞中，39 个犹太人决定宁愿死也不要被人抓到，于是决定了一个自杀方式，41 个人排成一个圆圈，由第 1 个人开始报数，每报数到第 3 人该人就必须自杀，然后再由下一个重新报数，直到所有人都自杀身亡为止。然而 Josephus 和他的朋友并不想遵从，Josephus 要他的朋友先假装遵从，他将朋友与自己安排在第 16 个与第 31 个位置，于是逃过了这场死亡游戏。
2. **线形顺序**，**依次执行**，符合队列的逻辑结构。
3. 只不过要把出列并且没自杀的重新入列排队
    ```cpp
    void Josephus (int peopleNum, int suicideIdx) {

        Queue peopleList;
        Queue deadList;
        initQueue(&peopleList, peopleNum);
        initQueue(&deadList, peopleNum);

        for (int i=1; i<=peopleNum; i++) {
            enqueue(&peopleList, i);
        }


        int c = 1;
        while (peopleNum > 0) {
            int n = dequeue(&peopleList);
            if (c == suicideIdx) {
                c = 1;
                enqueue(&deadList, n);
                peopleNum--;
            }
            else {
                enqueue(&peopleList, n);
                c++;
            }
        }

        printQueue(&deadList);
    }


    int main(void) {

        Josephus(41, 3);
        // [3 6 9 12 15 18 21 24 27 30 33 36 39 1 5 10 14 19 23 28 32 37 41 7 13 20 26 34 40 8 17 29 38 11 25 2 22 4 35 16 31 ]

        
        return 0;
    }
    ```