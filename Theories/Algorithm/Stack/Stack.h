#ifndef STACK
#define STACK

#include <stdbool.h>

#define STACK_SIZE 10

typedef struct {
    int list[STACK_SIZE];
    int top;
} Stack;

bool isEmpty(Stack*);
void push(Stack*, int);
int  pop(Stack*);
void printStack(Stack*);

#endif
