#include <stdlib.h>
#include <stdio.h>
#include "BST.h"
#include "NodeStack.h"


static Node* root = NULL;


void insert(int key) {
    Node* node = malloc(sizeof(Node));
    if (node == NULL) {
        printf("Create node fail.");
        exit(EXIT_FAILURE);
    }
    node->key = key;
    node->left = NULL;
    node->right = NULL;
    if (root == NULL) {
        root = node;
        node->parent = NULL;
    }
    else {
        Node* parent = NULL;
        Node* curr = root;
        int is_left = 1;
        while (curr) {
            parent = curr;
            if (key < curr->key) {
                curr = curr->left;
                is_left = 1;
            }
            else {
                curr = curr->right;
                is_left =0;
            }
        }
        if (is_left) {
            parent->left = node;
        }
        else {
            parent->right = node;
        }
    }
}

void inorder_walk(Node* node) {
    if (node != NULL) {
        inorder_walk(node->left);
        printf("%d\n", node->key);
        inorder_walk(node->right);
    }
}

void inorder_by_stack(Node* node) {
    Stack* s = malloc(sizeof(Stack));
    initStack(s);


    if (node == NULL) {
        return;
    }
    while (1) {
        if (node != NULL) {
            push(s, node);
            node = node->left;
        }
        else {
            Node* popped = pop(s);
            printf("%d\n", popped->key);
            if (popped->right != NULL) {
                node = popped->right;
            }
            else if (isEmpty(s)) {
                break;
            }
        }
    }
}

void preorder_walk(Node* node) {
    if (node != NULL) {
        printf("%d\n", node->key);
        preorder_walk(node->left);
        preorder_walk(node->right);
    }
}

void postorder_walk(Node* node) {
    if (node != NULL) {
        postorder_walk(node->left);
        postorder_walk(node->right);
        printf("%d\n", node->key);
    }
}

Node* get_root(void){
    return root;
}
