#include <stdio.h>
#include "stackADT.h"

int main(void)
{

    struct moe moe22 = { "22chan", 33 };
    struct moe moe33 = { "33chan", 22 };
    struct moe moeTV = { "TV", 450 };

    Stack s1, s2;
    struct moe moe_ptr;

    s1 = create();
    s2 = create();

    push(s1, moe22);
    printf("s1 len: %d\n", length(s1));
    push(s1, moe33);
    printf("s1 len: %d\n", length(s1));

    moe_ptr = peek(s1);
    printf("Peak from s1: %s(age %d)\n", moe_ptr.name, moe_ptr.age);

    moe_ptr = pop(s1);
    printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);
    printf("s1 len: %d\n", length(s1));

    push(s2, moe_ptr);
    printf("s2 len: %d\n", length(s2));

    moe_ptr = peek(s1);
    printf("Peak from s1: %s(age %d)\n", moe_ptr.name, moe_ptr.age);

    moe_ptr = pop(s1);
    printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);
    printf("s1 len: %d\n", length(s1));

    push(s2, moe_ptr);
    printf("s2 len: %d\n", length(s2));

    destroy(s1);
    
    while (!is_empty(s2)) {
        moe_ptr = pop(s2);
        printf("Popped %s(age %d) from s2\n", moe_ptr.name, moe_ptr.age);
        printf("s2 len: %d\n", length(s2));
    }
    
    push(s2, moeTV);
    printf("s2 len: %d\n", length(s2));
    
    make_empty(s2);
    printf("s2 len: %d\n", length(s2));
    
    if (is_empty(s2))
        printf("s2 is empty\n");
    else
        printf("s2 is not empty\n");

    destroy(s2);

    return 0;
}