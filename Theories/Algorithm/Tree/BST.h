#ifndef BST
#define BST


typedef struct Node {
    int key;
    struct Node* left;
    struct Node* right;
    struct Node* parent;
} Node;


void bst_insert (Node* newNode);
void recursive_insert(int key);
Node* tree_search(Node* root, int key);
Node* interative_tree_search(Node* root, int key);
Node* tree_successor(Node* node);
Node* tree_predecessor(Node* node);
Node* tree_minimum(Node* root);
Node* recursive_tree_minimum(Node* root);
Node* tree_maximum(Node* root);
Node* recursive_tree_maximum(Node* root);
void tree_delete(Node* node);
void bst_inorder_traverse (Node* node, void cb(Node*));
void inorder_by_stack(Node* root);
void inorder_by_successor(Node* root);
void preorder_walk(Node* root);
void postorder_walk(Node* root);
Node* get_root(void);


#endif
