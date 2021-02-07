#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define QUEUE_SIZE 12


typedef struct {
    int list[QUEUE_SIZE + 1]; // tail 所在位置不保存元素
    int head;
    int tail;
} Queue;

bool isFull(Queue*);
void tail_enqueue(Queue*, int);
int  head_dequeue(Queue*);
void head_enqueue(Queue*, int);
int  tail_dequeue(Queue*);
void printQueue(Queue*);


int main(void) {
    Queue q;
    q.head = 0;
    q.tail = 0;

    head_enqueue(&q, 15);
    head_enqueue(&q, 6);
    head_enqueue(&q, 9);
    head_enqueue(&q, 8);
    head_enqueue(&q, 4);
    printQueue(&q);

    head_enqueue(&q, 17);
    head_enqueue(&q, 3);
    head_enqueue(&q, 5);
    printQueue(&q);

    printf("%d\n", tail_dequeue(&q));
    printQueue(&q);
}


bool isFull(Queue* q) {
    return q->tail == q->head - 1 || (q->head == 0 && q->tail == QUEUE_SIZE);
}
void tail_enqueue(Queue* q, int n) {
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
int head_dequeue(Queue* q) {
    if (q->head == q->tail) {
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

void head_enqueue(Queue* q, int n) {
    if (isFull(q)) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }
    if (q->head == 0) {
        q->head = QUEUE_SIZE;
    }
    else {
        q->head--;
    }
    q->list[q->head] = n;
}
int  tail_dequeue(Queue* q) {
    if (q->head == q->tail) {
        printf("underflow");
        exit(EXIT_FAILURE);
    }
    if (q->tail == 0) {
        q->tail = QUEUE_SIZE;
    }
    else {
        q->tail--;
    }
    return q->list[q->tail];
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