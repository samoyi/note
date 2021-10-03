#ifndef BST
#define BST


typedef struct Node {
    int key;
    struct Node* left;
    struct Node* right;
    struct Node* parent;
} Node;


void bst_insert (Node* newNode);
void bst_insert_recursive (Node* newNode);
Node* bst_search(Node* root, int key);
Node* bst_search_recursive(Node* root, int key);
Node* bst_successor(Node* node);
Node* bst_predecessor(Node* node);
Node* bst_min(Node* root);
Node* bst_min_recursive(Node* root);
Node* bst_max(Node* root);
Node* bst_max_recursive(Node* root);
void bst_delete(Node* root, Node* node);
void bst_pre_order_traverse (Node* root, void cb(Node*));
void bst_in_order_traverse (Node* root, void cb(Node*));
void bst_post_order_traverse (Node* root, void cb(Node*));
void inorder_by_stack(Node* root);
void inorder_by_successor(Node* root);
void preorder_walk(Node* root);
void postorder_walk(Node* root);
Node* get_root(void);


#endif
