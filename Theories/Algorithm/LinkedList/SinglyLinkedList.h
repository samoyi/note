#ifndef DOUBLY_LINKED_LIST
#define DOUBLY_LINKED_LIST

#include <stdlib.h>

typedef struct Node{
    int key;
    struct Node* prev;
    struct Node* next;
} Node;


Node* search_node (int key);
void insert_node (int key);
void delete_node(Node* node);
void reverse_iteration(void);
void reverse_recursion(void);
void empty_list (void);
void print_list (void);


#endif
