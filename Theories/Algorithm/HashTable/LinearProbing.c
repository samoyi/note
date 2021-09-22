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
static bool isVirginalSlot (int pos);
static bool isDeleted (int pos);
static bool hasNode (int pos);
static bool isTableFull ();
void hash_put(int key, int val);
Node* hash_get(int key);
void hash_delete(int key);
void print_table(void);


static int index = 0; // 遍历探查序列时自增
static int count = 0; // 槽位占用数


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

// node 为 NULL 说明槽位为空，之前从来没有被插入过节点；
// 因此槽位一旦被插入节点，即使删除后，node 也不会变为 NULL。
bool isVirginalSlot (int pos) {
    return table[pos].node == NULL;
}

// 所以要判断一个槽位是否有节点，必须要再结合 delete；
// 在 node 不为 NULL 时：
//      * deleted 为 true 说明当前的节点已经被删除
//      * delete 为 false 说明当前有节点
bool isDeleted (int pos) {
    return table[pos].node && table[pos].deleted;
}
bool hasNode (int pos) {
    return table[pos].node && !table[pos].deleted;
}

bool isTableFull () {
    return count == SIZE;
}

void hash_put (int key, int val) {
    if ( isTableFull() ) {
        printf("Input overflow");
        return;
    }
    index = 0; // 每次操作都要从 0 开始遍历探查序列

    // 槽位为空或 DELETE 时，可以插入新的节点;
    // 槽位有节点并且节点 key 和参数中的相同时，更新节点的值;
    // 因此槽位有节点但 key 不同，并且没有遍历完探查序列时，再散列;
    // 下面不会出现 index == SIZE 的情况，因为至少一个槽位可用。
    int pos = hash_fn(key);
    while ( hasNode(pos) && table[pos].node->key != key ) {
        pos = hash_fn(key);
    }

    if ( hasNode(pos) ) { // 更新
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
        table[pos].deleted = false;
        count++;
    }
}

Node* hash_get (int key) {
    index = 0;

    // 散列到空槽位或者遍历了整个探查序列仍然没找到则操作结束
    int pos = hash_fn(key);
    if ( isVirginalSlot(pos) ) {
        return NULL;
    }

    // 槽位节点已删除或者不是对应的节点时则循环继续（再散列）
    // 这里区分操作结束的条件和循环退出的条件，可以简化循环的判断条件，
    // 同时在循环退出后，明确当前状态而不需要再判断因为哪种情况退出
    while ( isDeleted(pos) || table[pos].node->key != key ) {
        pos = hash_fn(key);
        if ( isVirginalSlot(pos) || index == SIZE ) {
            return NULL;
        }
    }

    return table[pos].node;
}

void hash_delete (int key) {
    index = 0;
    
    int pos = hash_fn(key);
    // 散列到空槽位或者遍历了整个探查序列仍然没找到则操作结束
    if ( isVirginalSlot(pos) ) {
        return;
    }

    // 槽位节点已删除或者不是对应的节点时则循环继续（再散列）
    while ( isDeleted(pos) || table[pos].node->key != key ) {
        pos = hash_fn(key);
        if ( isVirginalSlot(pos) || index == SIZE ) {
            return;
        }
    }

    free(table[pos].node);
    // table[pos].node = NULL; // 这样设置就会变成空槽位
    table[pos].deleted = true;
    count--;
}

void print_table(void) {
    for (int i=0; i<SIZE; i++) {
        if ( hasNode(i) ) {
            printf("%d: {%d: %d}\n", i, table[i].node->key, table[i].node->val);
        }
    }
}