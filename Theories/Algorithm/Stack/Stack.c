#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "Stack.h"


bool isEmpty(Stack* s) {
    return s->top == -1;
}
void push(Stack* s, int n) {
    if (s->top == STACK_SIZE-1) {
        printf("overflow");
        exit(EXIT_FAILURE);
    }
    s->list[++s->top] = n;
}
int pop(Stack* s) {
    if (isEmpty(s)) {
        printf("underflow");
        exit(EXIT_FAILURE);
    }
    return s->list[s->top--];
}
void printStack(Stack* s) {
    int i = -1;
    while (++i <= s->top) {
        printf("%d ", s->list[i]);
    }
    printf("\n");
}