#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "Stack.h"


void initStack(Stack* s, int size) {
    s->list = calloc(size, sizeof(int));
    if (s->list == NULL) {
        printf("calloc failed in initStack.\n");
        exit(EXIT_FAILURE);
    }
    s->size = size;
    s->top = -1;
}
bool isEmpty(Stack* s) {
    return s->top == -1;
}
void push(Stack* s, int n) {
    if (s->top == s->size-1) {
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
void freeStack (Stack* s) {
    free(s->list);
}