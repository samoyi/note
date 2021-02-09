#include <stdio.h>
#include <stdlib.h>
#include "DoublyLinkedList.h"


Node* head = NULL;
Node* tail = NULL;


Node* search_node (int key) {
    Node* p = head;
    while (p != NULL && p->key != key) {
        p = p->next;
    }
    return p;
}

void insert_node (int key) {
    Node* node = malloc(sizeof(Node));
    if (node == NULL) {
        printf("Create node fail.");
        exit(EXIT_FAILURE);
    }
    if (tail == NULL) {
        tail = node;
    }
    else {
        head->prev = node;
    }
    node->key = key;
    node->prev = NULL;
    node->next = head;
    head = node;
}

void delete_node(Node* node) {
    Node* p = head;
    while (p != NULL && p->key != node->key) {
        p = p->next;
    }
    if (p != NULL) {
        int pIsHead = p->prev == NULL;
        int pIsTail = p->next == NULL;

        if (pIsHead && pIsTail) {
            head = NULL;
            tail = NULL;
        }
        else if (pIsHead) {
            head = p->next;
            p->next->prev = NULL;
        }
        else if (pIsTail) {
            tail = p->prev;
            p->prev->next = NULL;
        }
        else {
            p->prev->next = p->next;
            p->next->prev = p->prev;
        }
        free(p);
    }

}

void empty_list (void) {
    Node* curr = head;
    Node* next;
    while (curr != NULL) {
        next = curr->next;
        free(curr);
        curr = next;
    }
}

void print_list (void) {
    Node* p = head;
    while (p != NULL) {
        printf("%d->", p->key);
        p = p->next;
    }
    printf("\n");
}