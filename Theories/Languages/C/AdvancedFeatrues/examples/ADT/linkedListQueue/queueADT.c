#include <stdio.h>
#include <stdlib.h>
#include "queueADT.h"

struct node {
    Item data;
    struct node *next;
};

struct queue_type {
    struct node *head;
    struct node *tail;
};


static void terminate (const char *message)
{
    printf("%s\n", message);
    exit(EXIT_FAILURE);
}

Queue create(void)
{
    Queue q = malloc(sizeof(struct queue_type));
    if (q == NULL)
            terminate("Error in create: queue could not be created.");
    q->head = NULL;
    q->tail = NULL;
    return q;
}

void destroy(Queue q)
{
    make_empty(q);
    free(q);
}

void make_empty(Queue q)
{
    while (!is_empty(q)) {
        dequeue(q);
    }
}

bool is_empty(Queue q)
{
    return q->head == NULL;
}

bool is_full(Queue q)
{
    return false;
}

void enqueue(Queue q, Item i)
{
    struct node *new_node = malloc(sizeof(struct node));
    if (new_node == NULL) {
        terminate("Error in push: queue is full.");
    }

    new_node->data = i;
    new_node->next = NULL;
    if (is_empty(q)) {
        q->head = new_node;
        q->tail = new_node;
    }
    else {
        q->tail->next = new_node;
    }
    q->tail = new_node;
}

Item dequeue(Queue q)
{
    struct node *old_head;
    Item i;
    if (is_empty(q))
        terminate("Error in pop: queue is empty.");
   
    old_head = q->head;
    i = old_head->data;

    q->head = old_head->next;
    if (q->head == NULL) {
        q->tail = NULL;
    }

    free(old_head);

    return i;
}