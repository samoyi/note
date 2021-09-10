#ifndef PRIORITY_QUEUE
#define PRIORITY_QUEUE

#include <stdbool.h>


typedef struct {
    int size;
    PQ_Item* list;
    int head;
    int tail;
} Priority_Queue;

typedef struct {
    int num;
    int priority;
} PQ_Item;

void initQueue(Priority_Queue*, int size);
bool isEmpty(Priority_Queue*);
bool isFull(Priority_Queue*);
void enqueue(Priority_Queue*, PQ_Item*);
int  dequeue(Priority_Queue*);
void printQueue(Priority_Queue*);
int countQueue(Priority_Queue*);
void freeQueue (Priority_Queue*);


#endif
