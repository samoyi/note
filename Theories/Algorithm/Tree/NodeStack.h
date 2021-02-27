#ifndef STACK
#define STACK

#include <stdbool.h>
#include "BST.h"

#define STACK_SIZE 10

// extern Node BST_Node;

typedef struct {
    Node* list[STACK_SIZE];
    int top;
} Stack;


void initStack(Stack* s);
bool isEmpty(Stack*);
void push(Stack*, Node*);
Node*  pop(Stack*);
void printStack(Stack*);

#endif
