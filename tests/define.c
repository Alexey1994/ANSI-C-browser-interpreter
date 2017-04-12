#include <stdio.h>
#include <stdlib.h>



#define jgg12(a, b)

#define a1 2+\
2

#define a2(b,\
c) b+c

#define a3 "as\
 def"

#define a\
4 1

#\
define a5

#define a6(a)
#define a6 "7"
//#include a6

#define a7(a7)

//#define a8(t) 8t

int main()
{jgg12(1,2);
    printf("%d\n", a1);
    printf("%d\n", a2(2, 2));
    printf("%s\n", a3);
    printf("%d\n", a4);

    printf("%d\n", a6);

    //printf("%d\n", a8(9));

    return 0;
}
