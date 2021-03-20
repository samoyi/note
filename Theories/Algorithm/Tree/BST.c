#include <stdlib.h>
#include <stdio.h>
#include "BST.h"
#include "NodeStack.h"


static Node* root = NULL;

static Node* createNode (int key) {
    Node* node = malloc(sizeof(Node));
    if (node == NULL) {
        printf("Create node fail.");
        exit(EXIT_FAILURE);
    }
    node->key = key;
    node->left = NULL;
    node->parent = NULL;
    node->right = NULL;
}

void insert(int key) {
    Node* node = createNode(key);

    // 从根开始比较，找到新节点合适的位置
    Node* curr = root;
    Node* parent = NULL; // 用来追踪新节点要作为谁的子节点
    while (curr) { // 新节点最终会被添加为一个叶节点
        parent = curr;
        if (key < curr->key) {
            curr = curr->left;
        }
        else {
            curr = curr->right;
        }
    }

    // 设置新节点和父节点的关系
    node->parent = parent;
    if (parent == NULL) {
        root = node;
    }
    else if (key < parent->key) {
        parent->left = node;
    }
    else {
        parent->right = node;
    }
}

static void insert_recursive(Node* node, Node* parent) {
    if (node->key < parent->key) {
        if (parent->left == NULL) {
            parent->left = node;
            node->parent = parent;
        }
        else {
            insert_recursive(node, parent->left);
        }
    }
    else {
        if (parent->right == NULL) {
            parent->right = node;
            node->parent = parent;
        }
        else {
            insert_recursive(node, parent->right);
        }
    }
}
void recursive_insert(int key) {
    Node* node = createNode(key);
    if (root == NULL) {
        root = node;
    }
    else {
        insert_recursive(node, root);
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

void transplant(Node* y, Node* z) {
    if (y->parent == NULL) { // y 是根节点
        root = z;
    }
    else if (y->parent->left == y) { // y 是左侧子节点
        y->parent->left = z;
    }
    else {
        y->parent->right = z; // y 是左侧子节点
    }
    // 如果 z 等于 NULL，则是第一种情况
    if (z != NULL) {
        z->parent = y->parent;
    }
}
// void tree_delete(Node* node) {
//     if (node->left == NULL) { // 这条分支包括两第一种情况以及第二种情况中只有右侧子节点的部分
//         transplant(node, node->right);
//     }
//     else if (node->right == NULL) { // 这条分支处理第二种情况中有左侧子节点的部分
//         transplant(node, node->left);
//     }
//     else { // 这条分支处理第三种情况
//         // 《算法导论》这里直接用的 tree_minimum，其实两者是一样的，不过我觉得写成后继的形式更好理解
//         Node* successor = tree_successor(node);
//         if (node->right == successor) {
//             transplant(node, successor);
//             // 这里在 transplant 之后，successor 的子节点发生了变化
//             successor->left = node->left;
//             node->left->parent = successor;
//         }
//         else {
//             // successor 要去替换 node，那这里要让 successor 的后继接任它的位置
//             transplant(successor, successor->right);

//             // successor 替换 node，并和 node 的子节点建立关系
//             transplant(node, successor);
//             successor->left = node->left;
//             node->left->parent = successor;
//             successor->right = node->right;
//             node->right->parent = successor;
//         }
//     }
//     free(node);
// }
void tree_delete(Node* node) {
    if (node->left == NULL) { // 这条分支包括两第一种情况以及第二种情况中只有右侧子节点的部分
        transplant(node, node->right);
    }
    else if (node->right == NULL) { // 这条分支处理第二种情况中有左侧子节点的部分
        transplant(node, node->left);
    }
    else { // 这条分支处理第三种情况
        // 《算法导论》这里直接用的 tree_minimum，其实两者是一样的，不过我觉得写成后继的形式更好理解
        Node* successor = tree_successor(node);
        if (node->right != successor) {
            // successor 要去替换 node，那这里要让 successor 的后继接任它的位置
            transplant(successor, successor->right);
            // successor 替换 node，并和 node 的子节点建立关系
            successor->right = node->right;
            node->right->parent = successor;
        }
        transplant(node, successor);
        successor->left = node->left;
        node->left->parent = successor;
    }
    free(node);
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
