#include <stdio.h>
#include <stdlib.h>
#include "DoublyLinkedList.h"


Node* list_search (int key) {
    Node* ptr = head;
    while (ptr && ptr->key != key) {
        ptr = ptr->next;
    }
    return ptr;
}

void list_insert (int key) {
    Node* node = malloc(sizeof(Node));
    if (node == NULL) {
        printf("malloc failed in list_insert");
        exit(EXIT_FAILURE);
    }

    init_node(node, key);

    if (is_list_empty()) {
        head = node;
        tail = node;
    }
    else {
        node->prev = tail;
        tail->next = node;
        tail = node;
    }
}

Node* list_delete (int key) {
    Node* ptr = head;
    while (ptr && ptr->key != key) {
        ptr = ptr->next;
    }
    if (ptr == NULL) {
        return NULL;
    }

    if (ptr == head) {
        head = ptr->next;
    } 
    else {
        ptr->prev->next = ptr->next;
    }

    if (ptr == tail) {
        tail = ptr->prev;
    } 
    else {
        ptr->next->prev = ptr->prev;
    }

    return ptr;
}

void empty_list (void) {
    Node* ptr = head;
    Node* next;
    while (ptr) {
        next = ptr->next;
        free(ptr);
        ptr = next;
    }

    // 释放了 head 和 tail 指向的内存并不会让这两个指针变为空指针，所以要手动设置
    head = NULL;
    tail = NULL;
}

void print_list (void) {
    Node* ptr = head;
    while (ptr) {
        printf("%d -> ", ptr->key);
        ptr = ptr->next;
    }
    printf("\n");
}