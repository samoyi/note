#include <stdio.h>
#include <stdlib.h>
#include "stackADT.h"


struct stack_type {
  Item *contents; // content 指向 Item 类型数组
  int top;
  int size; // content 指向数组的 size
};

static void terminate (const char *message)
{
    printf("%s\n", message);
    exit(EXIT_FAILURE);
}

Stack create(int size)
{
    Stack s = malloc(sizeof(struct stack_type));
    if (s == NULL)
        terminate("Error in create: stack could not be created.");
    s->contents = malloc(size * sizeof(Item)); // 为 contents 指向的数组分配指定的内存
    if (s->contents == NULL) {
        // 栈创建成功了，但需要的数组创建失败
        free(s);
        terminate("Error in create: stack could not be created.");
    }
    s->top = 0;
    s->size = size; // 设置 size
    return s;
}

void destroy(Stack s)
{
    free(s->contents); // 分配了两个内存，两个都要释放
    free(s);
}

void make_empty(Stack s)
{
    s->top = 0;
}

bool is_empty(Stack s)
{
    return s->top == 0;
}

bool is_full(Stack s)
{
    return s->top == s->size; // 使用动态指定的 size 判断
}

void push(Stack s, Item i)
{
    if (is_full(s))
        terminate("Error in push: stack is full.");
    s->contents[s->top++] = i;
}

Item pop(Stack s)
{
    if (is_empty(s))
        terminate("Error in pop: stack is empty.");
    return s->contents[--s->top];
}