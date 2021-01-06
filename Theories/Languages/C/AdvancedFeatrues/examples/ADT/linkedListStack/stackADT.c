#include <stdio.h>
#include <stdlib.h>
#include "stackADT.h"

struct node {
    Item data;
    struct node *next;
};

struct stack_type {
    struct node *top; // 指向表示栈顶的链表节点的指针
};


static void terminate (const char *message)
{
    printf("%s\n", message);
    exit(EXIT_FAILURE);
}

Stack create(void)
{
  Stack s = malloc(sizeof(struct stack_type));
  if (s == NULL)
    terminate("Error in create: stack could not be created.");
  s->top = NULL; // 创建一个空链表作为栈
  return s;
}

void destroy(Stack s)
{
    make_empty(s); // 释放所有的链表节点
    free(s); // 释放整个栈结构
}

void make_empty(Stack s)
{
    // 因为每次 pop 栈顶节点都会设置 top 指针指向下面的节点，最后会指向 NULL，
    // 所以不需要再像数组那样手动设置 s->top = 0
    while (!is_empty(s)) {
        pop(s);
    }
}

bool is_empty(Stack s)
{
    return s->top == NULL; // 空链表
}

bool is_full(Stack s)
{
    return false; // 永远 false
}

void push(Stack s, Item i)
{
    struct node *new_node = malloc(sizeof(struct node)); // 创建列表节点
    if (new_node == NULL) {
        terminate("Error in push: stack is full.");
    }

    new_node->data = i;
    // 新节点将作为新的栈顶节点，next 属性指向原来的栈顶结点（从上往下指）
    new_node->next = s->top; 
    s->top = new_node;
}

Item pop(Stack s)
{
    struct node *old_top; // 指向被 pop 的栈顶节点，临时的中间指针
    Item i;
    if (is_empty(s))
        terminate("Error in pop: stack is empty.");

    // 用 old_top 保存被 pop 的栈顶节点
    old_top = s->top;
    i = old_top->data;

    s->top = old_top->next; // 设置新的栈顶节点

    free(old_top); // 释放临时指针指向的被 pop 节点

    return i;
}