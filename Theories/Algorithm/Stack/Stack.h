#ifndef STACK
#define STACK

#include <stdbool.h>


typedef struct {
    int* list;
    int size;
    int top;
} Stack;

void initStack(Stack* s, int size);
bool isEmpty(Stack*);
void push(Stack*, int);
int  pop(Stack*);
void printStack(Stack*);
void freeStack (Stack*);

#endif
