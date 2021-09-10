#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "Queue.h"

void initQueue(Queue* q, int size) {
    q->size = size;
    q->list = calloc(size+1, sizeof(int)); // 数组项比队列元素数多一个
    if (q->list == NULL) {
        printf("calloc failed in initQueue.\n");
        exit(EXIT_FAILURE);
    }
    q->head = 0;
    q->tail = 0;
}
bool isEmpty(Queue* q) {
    return q->head == q->tail;
}
bool isFull(Queue* q) {
    return q->tail + 1 == q->head || (q->head == 0 && q->tail == q->size);
}
void enqueue(Queue* q, int n) {
    if (isFull(q)) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }
    q->list[q->tail] = n;
    if (q->tail == q->size) {
        q->tail = 0;
    }
    else {
        q->tail++;
    }
}
int dequeue(Queue* q) {
    if (isEmpty(q)) {
        printf("underflow");
        exit(EXIT_FAILURE);
    }
    int dequeued = q->list[q->head];
    if (q->head == q->size) {
        q->head = 0;
    }
    else {
        q->head++;
    }
    return dequeued;
}
void printQueue(Queue* q) {
    printf("[");
    int i;
    if (q->tail > q->head) {
        for (i=q->head; i<q->tail; i++) {
            printf("%d ", q->list[i]);
        }
    }
    else if (q->tail < q->head) {
        for (i=q->head; i<=q->size; i++) {
            printf("%d ", q->list[i]);
        }
        for (i=0; i<q->tail; i++) {
            printf("%d ", q->list[i]);
        }
    }
    printf("]");
    printf("\n");
}
int countQueue(Queue* q) {
    if (q->tail >= q->head) {
        return q->tail - q->head;
    }
    else {
        return q->size - q->head + q->tail + 1;
    }
}
void freeQueue (Queue* q) {
    free(q->list);
}