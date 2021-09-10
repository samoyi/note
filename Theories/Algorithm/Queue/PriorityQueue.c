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

    q->list[q->tail]->num = item->num;
    q->list[q->tail]->priority = item->priority;
    q->tail++;

    if (q->tail > q->head) {
        for (int i = q->tail-2; i >= q->head; i--) {
            if (q->list[i]->priority < item->priority) {
                q->list[i+1]->num = q->list[i]->num;
                q->list[i+1]->priority = q->list[i]->priority;
            }
            else {
                q->list[i+1]->num = item->num;
                q->list[i+1]->priority = item->priority;
                return;
            }
        }
    }
    else if (q->tail < q->head) {
        int i;
        for (i = q->tail-2; i >= 0; i--) {
            if (q->list[i]->priority < item->priority) {
                q->list[i+1]->num = q->list[i]->num;
                q->list[i+1]->priority = q->list[i]->priority;
            }
            else {
                q->list[i+1]->num = item->num;
                q->list[i+1]->priority = item->priority;
                return;
            }
        }
        for (i = q->size; i >= q->head; i--) {
            if (q->list[i]->priority < item->priority) {
                if (i == q->size) {
                    q->list[0]->num = q->list[i]->num;
                    q->list[0]->priority = q->list[i]->priority;
                }
                else {
                    q->list[i+1]->num = q->list[i]->num;
                    q->list[i+1]->priority = q->list[i]->priority;
                }
            }
            else {
                if (i == q->size) {
                    q->list[0]->num = item->num;
                    q->list[0]->priority = item->priority;
                }
                else {
                    q->list[i+1]->num = item->num;
                    q->list[i+1]->priority = item->priority;
                }
                return;
            }
        }
    }
}

int dequeue(Priority_Queue* q) {
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

void printQueue(Priority_Queue* q) {
    printf("[");
    int i;
    if (q->tail > q->head) {
        for (i=q->head; i<q->tail; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i]->num, q->list[i]->priority);
        }
    }
    else if (q->tail < q->head) {
        for (i=q->head; i<=q->size; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i]->num, q->list[i]->priority);
        }
        for (i=0; i<q->tail; i++) {
            printf("{num: %d, priority: %d}\n", q->list[i]->num, q->list[i]->priority);
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
