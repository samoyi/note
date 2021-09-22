#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define SIZE 701

typedef struct Node{
    int key;
    int val;
} Node;


int aux_hash_fn (int key);
int aux_hash_fn1 (int key);
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
    hash_put(80, 8080);
    hash_put(123456, 654321);
    hash_put(705, 705705);
    print_table();
    // 4: {4: 8}
    // 5: {5: 55}
    // 7: {7: 14}
    // 9: {9: 18}
    // 10: {705: 705705}
    // 14: {14: 1414}
    // 23: {23: 2323}
    // 80: {80: 8080}
    // 337: {123456: 654321}

    printf("--------------------\n");
    hash_delete(4);
    hash_delete(14);
    hash_delete(5);
    print_table();
    // 7: {7: 14}
    // 9: {9: 18}
    // 10: {705: 705705}
    // 23: {23: 2323}
    // 80: {80: 8080}
    // 337: {123456: 654321}

    printf("--------------------\n");
    printf("80: %d\n", hash_get(80)->val);
    // 80: 8080

    return 0;
}


int aux_hash_fn (int key) {
    return key % SIZE;
}
int aux_hash_fn1 (int key) {
    return 1 + key % (SIZE - 1);
}

int hash_fn (int key) {
    int pos = (aux_hash_fn(key) + index*aux_hash_fn1(key)) % SIZE; 
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
    if ( isVirginalSlot(pos) ) {
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
    if ( isVirginalSlot(pos) ) {
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