#ifndef PRIORITY_QUEUE
#define PRIORITY_QUEUE

#include <stdbool.h>

typedef struct {
    int num;
    int priority;
} PQ_Item;

typedef struct {
    int size;
    PQ_Item* list;
    int head;
    int tail;
} Priority_Queue;


void initQueue(Priority_Queue*, int size);
bool isEmpty(Priority_Queue*);
bool isFull(Priority_Queue*);
void enqueue(Priority_Queue*, PQ_Item*);
PQ_Item  dequeue(Priority_Queue*);
void printQueue(Priority_Queue*);
int countQueue(Priority_Queue*);
void freeQueue (Priority_Queue*);
void print_queue_list(Priority_Queue* q);


#endif
