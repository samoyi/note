# Queue


<!-- TOC -->

- [Queue](#queue)
    - [队列和栈的比较](#队列和栈的比较)
        - [线性流动感](#线性流动感)
    - [可能的变体结构](#可能的变体结构)
        - [环](#环)
    - [两个队列实现一个栈](#两个队列实现一个栈)
    - [一些习题](#一些习题)
        - [1.3.37 Josephus 问题](#1337-josephus-问题)
            - [死亡顺序](#死亡顺序)
            - [怎么快速确定最后一个人？](#怎么快速确定最后一个人)

<!-- /TOC -->


## 队列和栈的比较
### 线性流动感
1. 队列有一种线性的、定向的流逝感，从一端进入，从另一端离开。
2. 如果把队列的首尾相连，线性的流逝就变成了流动的环，也就是不断的出队列再入队列。
3. 栈就不是线性的结构，而且也没有流动感。
4. 只要发生变化，队列里的元素一定都是在流动的；而栈就不一定了，越靠近栈底，元素可能越不会变动。


## 可能的变体结构
### 环


## 两个队列实现一个栈
1. 和两个栈实现一个队列的情况一样，都是加入元素的方法是相同的，但是取出元素的方法是相反的。
2. 那么同样尝试，在不改变出列规则的情况下，使用第二个队列改变被操作操作的队列元素。
3. 按照两个两个栈实现一个队列的思路尝试，发现不行。因为队列并不是栈那样对称性的数据结构，而是顺序性的，所以并不会对称反转。
4. 好像没什么办法，只能用最笨的办法了，也就是要实现出栈的时候让它前面的元素都先出列到另一个队列。
5. 那么根据这种出栈方法，入栈的的时候只能是让新元素加入到非空的那个队列里，这样才能维持所有元素的队列顺序，才能正确出列
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include "Queue.h"


    Queue q1;
    Queue q2;

    void push(int);
    int pop();
    void remove_to_q2();
    void remove_to_q1();
    void printStack();


    int main(void) {
        q1.head = q2.head = 0;
        q1.tail = q2.tail = 0;

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
    }



    void push(int n) {
        if (isEmpty(&q2)) {
            enqueue(&q1, n);
        }
        else {
            enqueue(&q2, n);
        }
    }
    int pop() {
        if (isEmpty(&q1) && isEmpty(&q2)) {
            printf("underflow");
            exit(EXIT_FAILURE);
        }
        else if (isEmpty(&q2)) {
            remove_to_q2();
            return dequeue(&q1);
        }
        else {
            remove_to_q1();
            return dequeue(&q2);
        }
    }
    void remove_to_q2() {
        int i = countQueue(&q1);
        while (i-- > 1) {
            enqueue(&q2, dequeue(&q1));
        }   
    }
    void remove_to_q1() {
        int i = countQueue(&q2);
        while (i-- > 1) {
            enqueue(&q1, dequeue(&q2));
        }   
    }
    void printStack() {
        if (isEmpty(&q2)) {
            printQueue(&q1);
        }
        else {
            printQueue(&q2);
        }
    }
    ```


## 一些习题
### 1.3.37 Josephus 问题
1. 据说著名犹太历史学家 Josephus 有过以下的故事：在罗马人占领乔塔帕特后，39 个犹太人与 Josephus 及他的朋友躲到一个洞中，39 个犹太人决定宁愿死也不要被人抓到，于是决定了一个自杀方式，41 个人排成一个圆圈，由第 1 个人开始报数，每报数到第 3 人该人就必须自杀，然后再由下一个重新报数，直到所有人都自杀身亡为止。然而 Josephus 和他的朋友并不想遵从，Josephus 要他的朋友先假装遵从，他将朋友与自己安排在第 16 个与第 31 个位置，于是逃过了这场死亡游戏。
2. 逻辑上就是不断的出队列，两次回到队尾，一次不再回去。

#### 死亡顺序
```js
function Josephus ( nPeople, nDeadIndex ) {
    let queue = Array.from( {length: nPeople}, (item, index)=>index+1 );
    
    let deathList = [];

    let index = 1;
    while ( queue.length > 0 ) {
        let p = queue.shift();
        if ( index !== nDeadIndex ) {
            queue.push( p );
            index++;
        }
        else {
            deathList.push( p );
            index = 1;
        }
    }

    return deathList;
}


console.log( Josephus ( 41, 3 ) );
// [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 1, 5, 10, 14, 19, 23, 28, 32, 37, 41, 7, 13, 20, 26, 34, 40, 8, 17, 29, 38, 11, 25, 2, 22, 4, 35, 16, 31]
```

#### 怎么快速确定最后一个人？
TODO
