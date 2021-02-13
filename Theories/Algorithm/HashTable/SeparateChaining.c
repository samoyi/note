#include <stdio.h>
#include <stdlib.h>

#define SIZE 9

typedef struct Node{
    int key;
    struct Node* prev;
    struct Node* next;
} Node;

// 若干个散列函数
int hash_fn_mod (int key);

// 散列表是一个数组，每个数组项指向一个槽位链表的 head 节点
Node* table[SIZE];
void hash_init(void);
void hash_put(int key);
Node* hash_get(int key);
void hash_delete(Node*);
void print_list(int idx);
void print_table(void);

// 确定当前使用的散列函数
int (*hash_fn)(int) = hash_fn_mod;


int main(void) {

    hash_init();
    
    hash_put(5);
    hash_put(23);
    hash_put(14);
    hash_put(4);
    hash_put(9);
    hash_put(7);
    print_table();

    printf("--------------------\n");
    hash_delete(hash_get(14));
    print_table();

    return 0;
}

int hash_fn_mod (int key) {
    return key % SIZE;
}
void hash_init(void) {
    for (int i=0; i<SIZE; i++) {
        table[i] = NULL;
    }
}
void hash_put (int key) {
    int pos = hash_fn(key);
    Node* head = table[pos];
    Node* newNode = malloc(sizeof(Node));
    if (newNode == NULL) {
        printf("Create node fail.");
        exit(EXIT_FAILURE);
    }
    newNode->key = key;
    table[pos] = newNode;
    newNode->next = head;
    newNode->prev = NULL;
    if (head != NULL) {
        head->prev = newNode;
    }
}
Node* hash_get (int key) {
    int pos = hash_fn(key);
    Node* curr = table[pos];
    while (curr != NULL && curr->key != key) {
        curr = curr->next;
    }
    return curr;
}
void hash_delete (Node* node) {
    Node* prev = node->prev;
    Node* next = node->next;

    // 只要有 next，不管 prev 只不是 NULL 都可以
    // 如果没有 next，说明 node 是 tail，删掉后后面也不会有受影响的节点
    if (next != NULL) {
        next->prev = prev;
    }

    // 只要有 prev，不管 next 是不是 NULL 都可以
    // 但 prev 是 NULL 的话，还有一步要处理，因为此时 node 就是 head，
    // 所以 table[idx] 还在引用 node，因此还必须要让 table[idx] 引用 next
    if (prev != NULL) {
        prev->next = next;
    }
    else {
        int idx = hash_fn(node->key);
        table[idx] = next;
    }

    free(node);
}
void print_list(int idx) {
    Node* curr = table[idx];
    while (curr != NULL) {
        printf("%d->", curr->key);
        curr = curr->next;
    }
    printf("\n");
}
void print_table(void) {
    for (int i=0; i<SIZE; i++) {
        printf("%d: ", i);
        print_list(i);
    }
    printf("\n");
}