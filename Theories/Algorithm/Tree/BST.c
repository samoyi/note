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
        node->parent = parent;
    }
}


Node* tree_search(Node* root, int key) {
    if (root == NULL || key == root->key) {
        return root;
    }

    if (key < root->key) {
        return tree_search(root->left, key);
    }
    else {
        return tree_search(root->right, key);
    }
}
Node* interative_tree_search(Node* root, int key) {
    while (root != NULL && key != root->key) {
        if (key < root->key) {
            root = root->left;
        }
        else {
            root = root->right;
        }
    }
    return root;
}

Node* tree_successor(Node* node) {
    if (node == NULL) {
        return NULL;
    }
    if (node->right) {
        return tree_minimum(node->right);
    }
    else {
        Node* parent = node->parent;
        while (parent && parent->right == node ) {
            node = parent;
            parent = parent->parent;
        }
        return parent;
    }
}
Node* tree_predecessor(Node* node) {
    if (node == NULL) {
        return NULL;
    }
    if (node->left) {
        return tree_maximum(node->left);
    }
    else {
        Node* parent = node->parent;
        while (parent && parent->left == node) {
            node = parent;
            parent = parent->parent;
        }
        return parent;
    }
}

Node* tree_minimum(Node* root) {
    if (root == NULL) {
        return NULL;
    }
    while (root->left != NULL) {
        root = root->left;
    }
    return root;
}
Node* recursive_tree_minimum(Node* root) {
    if (root == NULL) {
        return NULL;
    }
    if (root->left == NULL) {
        return root;
    }
    else {
        return recursive_tree_minimum(root->left);
    }
}

Node* tree_maximum(Node* root) {
    if (root == NULL) {
        return NULL;
    }
    while (root->right != NULL) {
        root = root->right;
    }
    return root;
}
Node* recursive_tree_maximum(Node* root) {
    if (root == NULL) {
        return NULL;
    }
    if (root->right == NULL) {
        return root;
    }
    else {
        return recursive_tree_maximum(root->right);
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
void inorder_by_successor(Node* root) {
    Node* node = tree_minimum(root);
    while (node) {
        printf("%d\n", node->key);
        node = tree_successor(node);
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
