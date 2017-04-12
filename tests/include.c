#include <stdio.h>
#include <stdlib.h>

#define a <stdlib.h>
#include a

int main()
{
    int a;
    printf("%d", a);

    return 0;
}
