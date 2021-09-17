#include <stdio.h>
#include <stdlib.h>
#include "SinglyLinkedList.h"


static Node* head = NULL;


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

    node->key = key;
    node->next = head;
    head = node;
}

Node* delete_node(int key) {
    if (head == NULL) {
        return NULL;
    }
    if (key == head->key) {
        head = head->next;
        return head;
    }
    else {
        Node* prev = head;
        Node* curr = head->next;
        while (curr && curr->key != key) {
            prev = prev->next;
            curr = curr->next;
        }
        if (curr) {
            prev->next = curr->next;
            return curr;
        }
        else {
            return NULL;
        }
    }
}

void reverse_iteration(void) {
    Node* curr = head;
    Node* prev = NULL;
    Node* next;
    while (curr) {
        next = curr->next;
        curr->next = prev;
        // 设置下一轮
        prev = curr;
        curr = next;
    }

    head = prev;
}

void reverse_recurse(Node* curr) {
    Node* next = curr->next;
    if (next) {
        reverse_recurse(next);
        next->next = curr;
        curr->next = NULL;
    }
    else {
        head = curr;
    }
}
void reverse_recursion(void) {
    if (head != NULL) {
        reverse_recurse(head);
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

void MoveToFront (const char str[], int size) {
    for (int i=0; i<size; i++) {
        delete_node(str[i] - 'a');
        insert_node(str[i] - 'a');
    }
}