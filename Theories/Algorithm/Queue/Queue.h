#ifndef QUEUE
#define QUEUE

#include <stdbool.h>

#define QUEUE_SIZE 12


typedef struct {
    int list[QUEUE_SIZE + 1]; // tail 所在位置不保存元素
    int head;
    int tail;
} Queue;

bool isFull(Queue*);
bool isEmpty(Queue*);
void enqueue(Queue*, int);
int  dequeue(Queue*);
void printQueue(Queue*);
int countQueue(Queue*);


#endif
