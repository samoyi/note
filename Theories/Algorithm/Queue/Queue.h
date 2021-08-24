#ifndef QUEUE
#define QUEUE

#include <stdbool.h>


typedef struct {
    int size;
    int* list;
    int head;
    int tail;
} Queue;

void initQueue(Queue*, int size);
bool isEmpty(Queue*);
bool isFull(Queue*);
void enqueue(Queue*, int);
int  dequeue(Queue*);
void printQueue(Queue*);
int countQueue(Queue*);


#endif
