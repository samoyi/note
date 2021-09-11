#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "PriorityQueue.h"

void initQueue(Priority_Queue* q, int size) {
    q->size = size;
    q->list = calloc(size+1, sizeof(PQ_Item));
    if (q->list == NULL) {
        printf("calloc failed in initQueue.\n");
        exit(EXIT_FAILURE);
    }
    q->head = 0;
    q->tail = 0;
}

bool isEmpty(Priority_Queue* q) {
    return q->head == q->tail;
}

bool isFull(Priority_Queue* q) {
    return q->tail + 1 == q->head || (q->head == 0 && q->tail == q->size);
}

void enqueue(Priority_Queue* q, PQ_Item* item) {
    if (isFull(q)) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }

    // 先直接入列，之后再根据优先级调整到合适的位置上
    q->list[q->tail].num = item->num;
    q->list[q->tail].priority = item->priority;
    if (q->tail == q->size) {
        q->tail = 0;
    }
    else {
        q->tail++;
    }

    // 如果该元素入列前队列是空的
    if (q->tail == q->head+1) {
        return;
    }

    // 因为要遍历比较优先级，所以要分为两种情况
    if (q->tail > q->head) {
        // 依次和它前面的每一个元素比较优先级
        for (int i = q->tail-2; i >= q->head; i--) {
            // 如果前面的元素优先级更小，就向后移动一个位置，留出当前的位置
            if (q->list[i].priority < item->priority) {
                q->list[i+1].num = q->list[i].num;
                q->list[i+1].priority = q->list[i].priority;
            }
            // 如果前面的元素优先级大于等于新元素的，那新元素就放在它后面。
            // 如果之前发生过移动，那后面的这个位置就是让出来的空位；
            // 如果之前没发生过移动，也就是说 q->tail-2 这个元素的优先级就大于等于新元素的，
            // 那下面的 i+1 其实就是新元素的初始位置。
            // 正确插入后就可以返回
            else {
                q->list[i+1].num = item->num;
                q->list[i+1].priority = item->priority;
                return;
            }
        }

        // 如果上面没有返回，也就是上面的 for 一直执行的 if 分支，也就是说入列元素优先级最高，
        // 那在 for 循环结束后其实当前元素前面的所有元素都依次往后移动的以为，空出了 head 的位置
        q->list[q->head].num = item->num;
        q->list[q->head].priority = item->priority;
    }
    else if (q->tail < q->head) {
        int i;

        // 先遍历数组靠左的半部分，也就是优先级偏低的那部分
        for (i = q->tail-2; i >= 0; i--) {
            if (q->list[i].priority < item->priority) {
                q->list[i+1].num = q->list[i].num;
                q->list[i+1].priority = q->list[i].priority;
            }
            else {
                q->list[i+1].num = item->num;
                q->list[i+1].priority = item->priority;
                return;
            }
        }

        // 再遍历数组靠右的半部分
        // 如果新入列的元素正好是数组最后一项（q->size），那么比较就必须从 q->size - 1 开始比较
        if (q->tail == 0) {
            i = q->size - 1;
        }
        else {
            i = q->size;
        }
        for (; i >= q->head; i--) {
            // 优先级比新入列元素的优先级更低，依次向右移动
            if (q->list[i].priority < item->priority) {
                // 如果遍历的第一个元素正好是数组最后一项，那就要右移到数组第一项
                if (i == q->size) {
                    q->list[0].num = q->list[i].num;
                    q->list[0].priority = q->list[i].priority;
                }
                else {
                    q->list[i+1].num = q->list[i].num;
                    q->list[i+1].priority = q->list[i].priority;
                }
            }
            // 优先级大于等于新入列元素的优先级
            else {
                // 如果遍历的第一个元素（数组最后一项）的优先级大于等于新入列元素的优先级，
                // 它之后的位置就应该是数组第一项。
                if (i == q->size) {
                    q->list[0].num = item->num;
                    q->list[0].priority = item->priority;
                }
                else {
                    q->list[i+1].num = item->num;
                    q->list[i+1].priority = item->priority;
                }
                return;
            }
        }
        // 入列元素优先级最高
        q->list[q->head].num = item->num;
        q->list[q->head].priority = item->priority;
    }
}

PQ_Item dequeue(Priority_Queue* q) {
    if (isEmpty(q)) {
        printf("underflow");
        exit(EXIT_FAILURE);
    }
    PQ_Item dequeued = q->list[q->head];
    if (q->head == q->size) {
        q->head = 0;
    }
    else {
        q->head++;
    }
    return dequeued;
}

void printQueue(Priority_Queue* q) {
    printf("[");
    int i;
    if (q->tail > q->head) {
        for (i=q->head; i<q->tail; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i].num, q->list[i].priority);
        }
    }
    else if (q->tail < q->head) {
        for (i=q->head; i<=q->size; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i].num, q->list[i].priority);
        }
        for (i=0; i<q->tail; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i].num, q->list[i].priority);
        }
    }
    printf("]");
    printf("\n");
}

int countQueue(Priority_Queue* q) {
    if (q->tail >= q->head) {
        return q->tail - q->head;
    }
    else {
        return q->size - q->head + q->tail + 1;
    }
}

void freeQueue (Priority_Queue* q) {
    free(q->list);
}

void print_queue_list(Priority_Queue* q) {
    printf("{\n");
    for (int i=0; i<=q->size; i++) {
        printf("  {num: %d, priority: %d}", q->list[i].num, q->list[i].priority);
        if (q->head == i) {
            printf(" head");
        }
        if (q->tail == i) {
            printf(" tail");
        }
        printf("\n");
    }
    printf("}\n");
}