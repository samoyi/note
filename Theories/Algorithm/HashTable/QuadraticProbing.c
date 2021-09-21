#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define SIZE 16


typedef struct Node{
    int key;
    int val;
} Node;


int aux_hash_fn (int key);
int hash_fn (int key);

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


static int index = 0;
static int count = 0;


int main(void) {

    hash_init();
    
    hash_put(5, 55); // 5 
    hash_put(23, 2323); // 7
    hash_put(14, 1414); // 14
    hash_put(4, 8); // 4
    hash_put(9, 18); // 9
    hash_put(7, 14); // 8
    hash_put(15, 155); // 15
    hash_put(16, 155); // 0
    hash_put(45, 155); // 13
    hash_put(315, 155); // 11
    hash_put(515, 155); // 3
    hash_put(615, 155); // 10
    hash_put(1615, 155); // 2
    hash_put(3615, 155); // 12
    hash_put(6615, 155);
    hash_put(26615, 155);
    print_table();
    // 4: {4: 8}
    // 5: {5: 55}
    // 7: {23: 2323}
    // 8: {7: 14}
    // 9: {9: 18}
    // 14: {14: 1414}
    // 15: {15: 155}

    // printf("--------------------\n");
    // hash_delete(4);
    // hash_delete(14);
    // print_table();
    // // 5: {5: 55}
    // // 7: {23: 2323}
    // // 8: {7: 14}
    // // 9: {9: 18}
    // // 15: {15: 155}  

    // printf("--------------------\n");
    // printf("15 %d\n", hash_get(15)->val);
    // // 15: 155

    return 0;
}

int aux_hash_fn (int key) {
    return key % SIZE;
}

int hash_fn (int key) {
    // int pos = (aux_hash_fn(key) + C1 * index + C2 * index * index) % SIZE; 
    int pos = (aux_hash_fn(key) + (index * index + index)/2 ) % SIZE; 
    index++;
    return pos % SIZE;
}

void hash_init(void) {
    index = 0;
    for (int i=0; i<SIZE; i++) {
        table[i].node = NULL;
        table[i].deleted = false;
    }
}

bool isVirginalSlot (int pos) {
    return table[pos].node == NULL;
}

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

    index = 0;

    int pos = hash_fn(key);
    while ( hasNode(pos) && table[pos].node->key != key ) {
        pos = hash_fn(key);
    }

    if ( hasNode(pos) ) {
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

    int pos = hash_fn(key);
    // TODO，因为二次探查中并不是逐个槽位探查，所以并不能像线性探查那样
    // 用 index == SIZE 来判断遍历了所有的槽位。但暂时不知道要怎么处理。
    if ( isVirginalSlot(pos) || index == SIZE ) {
        return NULL;
    }

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
    if ( isVirginalSlot(pos) || index == SIZE ) {
        return;
    }

    while ( isDeleted(pos) || table[pos].node->key != key ) {
        pos = hash_fn(key);
        if ( isVirginalSlot(pos) || index == SIZE ) {
            return;
        }
    }

    free(table[pos].node);
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