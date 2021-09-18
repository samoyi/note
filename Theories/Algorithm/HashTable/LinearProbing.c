#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define SIZE 11

typedef struct Node {
    int key;
    int val;
} Node;

int aux_hash_fn (int key);
int hash_fn (int key);

// 散列表是一个数组，每个数组项的 node 属性指向该槽位的节点， deleted 属性说明是否之前被删除
struct slot {
    Node* node;
    bool deleted;
} table[SIZE];
void hash_init(void);
void hash_put(int key, int val);
Node* hash_get(int key);
void hash_delete(int key);
void print_table(void);


static int index = 0; // 遍历探查序列时自增


int main(void) {

    hash_init();
    
    hash_put(5, 55);
    hash_put(23, 2323);
    hash_put(14, 1414);
    hash_put(4, 8);
    hash_put(9, 18);
    hash_put(7, 14);
    hash_put(15, 155);
    print_table();
    // 1: {23: 2323}
    // 3: {14: 1414}
    // 4: {4: 8}
    // 5: {5: 55}
    // 6: {15: 155}
    // 7: {7: 14}
    // 9: {9: 18}


    printf("--------------------\n");
    hash_delete(4);
    hash_delete(14);
    print_table();
    // 1: {23: 2323}
    // 5: {5: 55}
    // 6: {15: 155}
    // 7: {7: 14}
    // 9: {9: 18}


    printf("--------------------\n");
    printf("15: %d\n", hash_get(15)->val);
    // 15: 155

    return 0;
}

// 辅助散列函数没有过多的计算，只是保证让 key 落入到链表槽位范围内
int aux_hash_fn (int key) {
    return key % SIZE;
}

// 每个操作反复调用散列函数时，内部的 index 都会自增遍历探查序列
int hash_fn (int key) {
    int pos = (aux_hash_fn(key) + index++) % SIZE; 
    return pos % SIZE;
}

void hash_init(void) {
    index = 0;
    for (int i=0; i<SIZE; i++) {
        table[i].node = NULL;
        table[i].deleted = false;
    }
}

void hash_put (int key, int val) {
    if (index == SIZE) {
        printf("Input overflow");
        index = 0;
        return;
    }
    index = 0; // 每次操作都要从 0 开始遍历探查序列

    // 槽位为空或 DELETE 时，可以插入新的节点;
    // 槽位有节点并且节点 key 和参数中的相同时，更新节点的值;
    // 因此槽位有节点但 key 不同，并且没有遍历完探查序列时，再散列;
    // 下面不会发出现 index == SIZE 的情况，因为至少一个槽位。
    int pos = hash_fn(key);
    while (table[pos].node && table[pos].node->key != key) {
        pos = hash_fn(key);
    }

    if (table[pos].node) { // 更新
        table[pos].node->val = val;
    }
    else {
        Node* newNode = malloc(sizeof(Node));
        if (newNode == NULL) {
            printf("Create node fail.");
            exit(EXIT_FAILURE);
        }
        newNode->key = key;
        newNode->val = val;
        table[pos].node = newNode;
        table[pos].deleted = false; // 需要？
    }
}

Node* hash_get (int key) {
    index = 0;

    // 散列到空槽位或者遍历了整个探查序列仍然没找到则结束
    int pos = hash_fn(key);
    if (index == SIZE) { // 只有 SIZE 为 1 时
        return NULL;
    }
    while ( table[pos].deleted
            || (table[pos].node && table[pos].node->key != key) 
    ) {
        pos = hash_fn(key);
        if (index == SIZE) {
            return NULL;
        }
    }

    return table[pos].node; // 实际的节点或者 NULL
}

void hash_delete (int key) {
    index = 0;
    
    int pos = hash_fn(key);

    // 遍历停止的条件：
    //      完整遍历了探查序列（index == SIZE）
    //      || 槽位为空（table[pos].node == NULL）
    //      || 找到节点（table[pos].node->key == key）

    if (index == SIZE || table[pos].node == NULL) { // 只有 SIZE 为 1 时，此时 index 才会等于 SIZE
        return;
    }

    while ( table[pos].node->key != key ) {
        pos = hash_fn(key);
        if (index == SIZE || table[pos].node == NULL) {
            return;
        }
    }

    free(table[pos].node);
    table[pos].node = NULL;
    table[pos].deleted = true;
}

void print_table(void) {
    for (int i=0; i<SIZE; i++) {
        if (table[i].node) {
            printf("%d: {%d: %d}\n", i, table[i].node->key, table[i].node->val);
        }
    }
}