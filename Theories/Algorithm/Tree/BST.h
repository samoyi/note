#ifndef BST
#define BST


typedef struct Node {
    int key;
    struct Node* left;
    struct Node* right;
    struct Node* parent;
} Node;


void insert(int key);
void inorder_walk(Node* node);
void inorder_by_stack(Node* node);
void preorder_walk(Node* node);
void postorder_walk(Node* node);
Node* get_root(void);


#endif
