#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define SIZE 701

typedef struct Node{
    int key;
    int val;
} Node;


int hash_fn_mod (int key);
int rehash_step (int key);

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


static int count = 0;


int main(void) {

    hash_init();
    
    hash_put(5, 55);
    hash_put(23, 2323);
    hash_put(14, 1414);
    hash_put(4, 8);
    hash_put(9, 18);
    hash_put(7, 14);
    hash_put(80, 8080);
    hash_put(123456, 654321);
    print_table();

    printf("--------------------\n");
    hash_delete(4);
    hash_delete(14);
    print_table();

    printf("--------------------\n");
    printf("80: %d\n", hash_get(80)->val);

    return 0;
}

int hash_fn_mod (int key) {
    return key % SIZE;
}
int rehash_step (int key) {
    return 1 + key % (SIZE-1);
}
void hash_init(void) {
    count = 0;
    for (int i=0; i<SIZE; i++) {
        table[i].node = NULL;
        table[i].deleted = false;
    }
}
void hash_put (int key, int val) {
    
    if (count == SIZE) {
        printf("Input overflow");
        return;
    }

    int pos = hash_fn_mod(key);
    int rehash_times = 0;
    while (table[pos].node && table[pos].node->key != key) {
        rehash_times++;
        pos += rehash_step(key);
        pos %= SIZE;
    }
    if (table[pos].node) {
        table[pos].node->val = val;
        table[pos].deleted = false;
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

        count++;
    }
}
Node* hash_get (int key) {
    int pos = hash_fn_mod(key);
    int rehash_times = 0;
    // 如果全部都是有节点或者删除状态，那么查找一个不存在的节点时会无限循环
    // 使用 times 记录查找次数，如果找了一圈还没找到就跳出
    int times = 0;
    while ((table[pos].node && table[pos].node->key != key) || table[pos].deleted) {
        rehash_times++;
        pos += rehash_step(key);
        pos %= SIZE;
        if (times++ == SIZE) {
            break;
        }
    }
    if (times == SIZE+1) {
        return NULL;
    }
    else {
        return table[pos].node;
    }
}
void hash_delete (int key) {
    int pos = hash_fn_mod(key);
    int rehash_times = 0;
    int times = 0;
    while ((table[pos].node && table[pos].node->key != key) || table[pos].deleted) {
        rehash_times++;
        pos += rehash_step(key);
        pos %= SIZE;
        if (times++ == SIZE) {
            break;
        }
    }
    if (times != SIZE+1 && table[pos].node != NULL) {
        free(table[pos].node);
        table[pos].node = NULL;
        table[pos].deleted = true;
        count--;
    }
}
void print_table(void) {
    for (int i=0; i<SIZE; i++) {
        if (table[i].node) {
            printf("%d: {%d: %d}\n", i, table[i].node->key, table[i].node->val);
        }
    }
}