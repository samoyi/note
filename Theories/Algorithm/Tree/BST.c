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

void bst_insert (Node* newNode) {
    Node* curr = root;
    Node* p = NULL;

    while (curr) {
        p = curr;
        if (newNode->key <= curr->key) {
            curr = curr->left;
        }
        else {
            curr = curr->right;
        }
    }

    newNode->parent = p;

    if (p == NULL) {
        root = newNode;
    }
    else if (newNode->key <= p->key) {
        p->left = newNode;
    }
    else {
        p->right = newNode;
    }
}

static void bst_insert_recursive_aux (Node* curr, Node* parent, Node* newNode) {
    if (curr == NULL) {
        newNode->parent = parent;
        if (parent == NULL) {
            root = newNode;
        }
        else if (newNode->key <= parent->key) {
            parent->left = newNode;
        }
        else {
            parent->right = newNode;
        }
    }
    else if (newNode->key <= curr->key) {
        bst_insert_recursive_aux(curr->left, curr, newNode);
    }
    else {
        bst_insert_recursive_aux(curr->right, curr, newNode);
    }
}
void bst_insert_recursive (Node* newNode) {
    bst_insert_recursive_aux(root, NULL, newNode);
}


void bst_inorder_traverse (Node* node, void cb(Node*)) {
    if (node == NULL) {
        return;
    }
    bst_inorder_traverse(node->left, cb);
    cb(node);
    bst_inorder_traverse(node->right, cb);
}


Node* bst_search (Node* root, int key) {
    Node* curr = root;
    while (curr && curr->key != key) {
        if (key <= curr->key) {
            curr = curr->left;
        }
        else {
            curr = curr->right;
        }
    }
    return curr;
}

Node* bst_search_recursive (Node* node, int key) {
    if (node == NULL) {
        return NULL;
    }
    if (node->key == key) {
        return node;
    }
    else if (key <= node->key) {
        bst_search_recursive(node->left, key);
    }
    else {
        bst_search_recursive(node->right, key);
    }
}

Node* bst_successor(Node* node) {
    if (node == NULL) {
        return NULL;
    }
    if (node->right) {
        return bst_min(node->right);
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
Node* bst_predecessor (Node* node) {
    if (node == NULL) {
        // TODO，这里其实不应该返回 NULL，因为最小的节点的后继就是 NULL，两者无法区分
        return NULL;
    }

    if (node->left) {
        return bst_max(node->left);
    }

    Node* curr = node;
    while (curr->parent && curr->parent->left == curr) {
        curr = curr->parent;
    }
    return curr->parent;
}
Node* bst_successor (Node* node) {
    if (node == NULL) {
        return NULL;
    }
    if (node->right) {
        return bst_min(node->right);
    }
    Node* curr = node;
    while (curr->parent && curr->parent->right == curr) {
        curr = curr->parent;
    }
    return curr->parent;
}

Node* bst_min (Node* root) {
    if (root == NULL) {
        return NULL;
    }
    Node* curr = root;
    while (curr->left) {
        curr = curr->left;
    }
    return curr;
}

static Node* bst_min_recursive_aux (Node* curr) {
    if (curr->left == NULL) {
        return curr;
    }
    else {
        bst_min_recursive_aux(curr->left);
    }
}
Node* bst_min_recursive (Node* root) {
    if (root == NULL) {
        return NULL;
    }
    return bst_min_recursive_aux(root);
}

Node* bst_max (Node* root) {
    if (root == NULL) {
        return NULL;
    }
    Node* curr = root;
    while (curr->right) {
        curr = curr->right;
    }
    return curr;
}

static Node* bst_max_recursive_aux (Node* curr) {
    if (curr->right == NULL) {
        return curr;
    }
    else {
        bst_max_recursive_aux(curr->right);
    }
}
Node* bst_max_recursive (Node* root) {
    if (root == NULL) {
        return NULL;
    }
    return bst_max_recursive_aux(root);
}

static void bst_transplant (Node* oldNode, Node* newNode) {
    if (oldNode == NULL) {
        printf("oldNode is NULL\n");
        exit(EXIT_FAILURE);
    }

    Node* p = oldNode->parent;
    
    if (p == NULL) {
        root = newNode;
    }
    else {
        if (p->left == oldNode) {
            p->left = newNode;
        }
        else {
            p->right = newNode;
        }
    }

    if (newNode) {
        newNode->parent = p;
    }
}
void bst_delete (Node* root, Node* node) {
    if (node == NULL) {
        return;
    }

    Node* p = node->parent;

    if (node->left == NULL && node->right == NULL) {
        bst_transplant(node, NULL);
    }
    else if (node->right == NULL) {
        bst_transplant(node, node->left);
    }
    else if (node->left == NULL) {
        bst_transplant(node, node->right);
    }
    else {
        Node* succ = bst_successor(node);
        if (succ == node->right) {
            bst_transplant(node, succ);
            succ->left = node->left;
            node->left->parent = succ;
        }
        else {
            bst_transplant(succ, succ->right);
            succ->left = node->left;
            node->left->parent = succ;
            succ->right = node->right;
            node->right->parent = succ;
            bst_transplant(node, succ);
        }
    }
    free(node); // 通常删除操作还伴随着释放内存
}

void bst_pre_order_traverse (Node* root, void cb(Node*)) {
    if (root != NULL) {
        cb(root);
        bst_pre_order_traverse(root->left, cb);
        bst_pre_order_traverse(root->right, cb);
    }
}

void bst_in_order_traverse (Node* root, void cb(Node*)) {
    if (root != NULL) {
        bst_in_order_traverse(root->left, cb);
        cb(root);
        bst_in_order_traverse(root->right, cb);
    }
}

void bst_post_order_traverse (Node* root, void cb(Node*)) {
    if (root != NULL) {
        bst_post_order_traverse(root->left, cb);
        bst_post_order_traverse(root->right, cb);
        cb(root);
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
    Node* node = bst_min(root);
    while (node) {
        printf("%d\n", node->key);
        node = bst_successor(node);
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
