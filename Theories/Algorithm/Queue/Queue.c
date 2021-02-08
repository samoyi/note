#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "Queue.h"


bool isFull(Queue* q) {
    return q->tail == q->head - 1 || (q->head == 0 && q->tail == QUEUE_SIZE);
}
bool isEmpty(Queue* q) {
    return q->head == q->tail;
}
void enqueue(Queue* q, int n) {
    if (isFull(q)) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }
    q->list[q->tail] = n;
    if (q->tail == QUEUE_SIZE) {
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
    if (q->head == QUEUE_SIZE) {
        q->head = 0;
    }
    else {
        q->head++;
    }
    return dequeued;
}
void printQueue(Queue* q) {
    int i;
    if (q->tail > q->head) {
        for (i=q->head; i<q->tail; i++) {
            printf("%d ", q->list[i]);
        }
    }
    else if (q->tail < q->head) {
        for (i=q->head; i<=QUEUE_SIZE; i++) {
            printf("%d ", q->list[i]);
        }
        for (i=0; i<q->tail; i++) {
            printf("%d ", q->list[i]);
        }
    }
    printf("\n");
}
int countQueue(Queue* q) {
    if (q->tail < q->head) {
        return QUEUE_SIZE - q->head + q->tail + 1;
    }
    else {
        return q->tail - q->head;
    }
}