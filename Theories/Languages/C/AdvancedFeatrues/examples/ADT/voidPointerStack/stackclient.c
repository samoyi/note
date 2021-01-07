#include <stdio.h>
#include "stackADT.h"

int main(void)
{
    typedef struct moe {
        char name[10];
        int age;
    } Moe;


    Moe *moe22 = &((Moe){ "22chan", 33 });
    Moe *moe33 = &((Moe){ "33chan", 22 });
    char *Corp = "Bilibili";

    Stack s1 = create();

    Moe *popped;

    push(s1, moe22);
    push(s1, moe33);
    push(s1, Corp);

    printf("%s: ", pop(s1));
    popped = pop(s1);
    printf("%s & ", popped->name);
    popped = pop(s1);
    printf("%s.", popped->name);

    destroy(s1);


    return 0;
}