#ifndef STACKADT_H
#define STACKADT_H

#include <stdbool.h>


typedef struct stack_type *Stack;

Stack create(void); // 不再需要指定 size
void destroy(Stack s);
void make_empty(Stack s);
bool is_empty(Stack s);
bool is_full(Stack s);
void push(Stack s, void *p);
void *pop (Stack s);
void *peek (Stack s);
int length (Stack s);

#endif
