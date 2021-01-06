#ifndef QUEUE_H
#define QUEUE_H

#include <stdbool.h>

typedef struct moe {
    char name[10];
    int age;
} Item;

typedef struct queue_type *Queue;

Queue create(void);
void destroy(Queue q);
void make_empty(Queue q);
bool is_empty(Queue q);
bool is_full(Queue q);
void enqueue(Queue q, Item i);
Item dequeue (Queue q);

#endif
