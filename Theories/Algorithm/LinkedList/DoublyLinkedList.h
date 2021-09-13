#ifndef DOUBLY_LINKED_LIST
#define DOUBLY_LINKED_LIST

#include <stdlib.h>
#include <stdbool.h>

typedef struct Node{
    int key;
    struct Node* prev;
    struct Node* next;
} Node;


static Node* head = NULL;
static Node* tail = NULL;


static void init_node (Node* node, int key) {
    node->key = key;
    node->prev = NULL;
    node->next = NULL;
}

static bool is_list_empty (void) {
    return head == NULL;
}

Node* list_search (int key);
void list_insert (int key);
Node* list_delete (int key);
void empty_list (void);
void print_list (void);


#endif
