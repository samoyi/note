#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "NodeStack.h"
#include "BST.h"

void initStack(Stack* s) {
    s->top = -1;
}
bool isEmpty(Stack* s) {
    return s->top == -1;
}
void push(Stack* s, Node* node_ptr) {
    if (s->top == STACK_SIZE-1) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }
    s->list[++s->top] = node_ptr;
}
Node* pop(Stack* s) {
    if (isEmpty(s)) {
        printf("underflow");
        exit(EXIT_FAILURE);
    }
    return s->list[s->top--];
}
void printStack(Stack* s) {
    int i = -1;
    while (++i <= s->top) {
        printf("%d ", s->list[i]->key);
    }
    printf("\n");
}