#include <stdio.h>
#include "stackADT.h"

int main(void)
{

    struct moe moe22 = { "22chan", 33 };
    struct moe moe33 = { "33chan", 22 };
    struct moe moeTV = { "TV", 450 };

    Stack s1, s2;
    struct moe moe_ptr;

    s1 = create(2);
    s2 = create(2);

    push(s1, moe22);
    push(s1, moe33);

    moe_ptr = pop(s1);
    
    printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);

    push(s2, moe_ptr);
    moe_ptr = pop(s1);
    
    printf("Popped %s(age %d) from s1\n", moe_ptr.name, moe_ptr.age);
    push(s2, moe_ptr);

    destroy(s1);
    
    while (!is_empty(s2)) {
        moe_ptr = pop(s2);
        printf("Popped %s(age %d) from s2\n", moe_ptr.name, moe_ptr.age);
    }
    
    push(s2, moeTV);
    make_empty(s2);
    
    if (is_empty(s2))
        printf("s2 is empty\n");
    else
        printf("s2 is not empty\n");

    destroy(s2);

    return 0;
}