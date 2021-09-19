#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define SIZE 11
#define C1 1
#define C2 3

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
    // 7: {7: 14}
    // 8: {15: 155}
    // 9: {9: 18}

    printf("--------------------\n");
    hash_delete(4);
    hash_delete(14);
    print_table();
    // 1: {23: 2323}
    // 5: {5: 55}
    // 7: {7: 14}
    // 8: {15: 155}
    // 9: {9: 18}

    printf("--------------------\n");
    printf("15 %d\n", hash_get(15)->val);
    // 15: 155

    return 0;
}

int aux_hash_fn (int key) {
    return key % SIZE;
}

int hash_fn (int key) {
    int pos = (aux_hash_fn(key) + C1 * index + C2 * index * index) % SIZE; 
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