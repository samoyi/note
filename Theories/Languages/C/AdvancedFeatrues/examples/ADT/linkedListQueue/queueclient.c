#include <stdio.h>
#include "queueADT.h"

int main(void)
{

    struct moe moe22 = { "22chan", 33 };
    struct moe moe33 = { "33chan", 22 };
    struct moe moeTV = { "TV", 450 };
    
    Queue q1, q2;
    struct moe moe_ptr;
    
    q1 = create();
    q2 = create();
    enqueue(q1, moe22);
    enqueue(q1, moe33);
    

    moe_ptr = dequeue(q1);
    
    printf("Dequeue %s(age %d) from q1\n", moe_ptr.name, moe_ptr.age);

    enqueue(q2, moe_ptr);
    moe_ptr = dequeue(q1);
    
    printf("Dequeue %s(age %d) from q1\n", moe_ptr.name, moe_ptr.age);
    enqueue(q2, moe_ptr);

    destroy(q1);

    while (!is_empty(q2)) {
        moe_ptr = dequeue(q2);
        printf("Dequeue %s(age %d) from q2\n", moe_ptr.name, moe_ptr.age);
    }
    
    enqueue(q2, moeTV);
    make_empty(q2);
    
    if (is_empty(q2))
        printf("q2 is empty\n");
    else
        printf("q2 is not empty\n");

    destroy(q2);

    return 0;
}