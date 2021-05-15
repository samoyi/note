# Longest Common Substring


<!-- TOC -->

- [Longest Common Substring](#longest-common-substring)
    - [设计思想](#设计思想)
        - [因果递推关系](#因果递推关系)
    - [本质](#本质)
    - [思路](#思路)
    - [适合使用动态规划](#适合使用动态规划)
        - [最优子结构](#最优子结构)
        - [重叠子问题](#重叠子问题)
    - [第一步：描绘最优解的结构](#第一步描绘最优解的结构)
    - [第二步：递归的定义最优解的值](#第二步递归的定义最优解的值)
    - [第三步：自底向上求解](#第三步自底向上求解)
    - [第四步：计算最优解的值](#第四步计算最优解的值)
    - [《图解算法》中的思路](#图解算法中的思路)
    - [最长公共子串](#最长公共子串)
        - [思路](#思路-1)
        - [实现](#实现)
    - [公共子序列](#公共子序列)
        - [思路](#思路-2)
        - [长度值的单调性](#长度值的单调性)
        - [长度值的计算](#长度值的计算)
        - [实现](#实现-1)
    - [Referecens](#referecens)

<!-- /TOC -->


## 设计思想
### 因果递推关系
1. 我们想知道两个字符串最长的公共子串的长度，假设这个长度为 $x$。怎么才能知道这个 $x$ 是多少？
2. 如果我们知道了 $x-1$ 是多少，就会知道 $x$ 是多少；同理，如果我们知道了 $x-2$ 是多少，就会知道 $x-1$ 是多少。
3. 以此类推，我们遍历比较每个字符的时候，遇到一个相同的字符时，它可能是公共子串的任意位置的字符。要确定它是第几个，就要看它之前的那个位置：如果之前的位置不相同，那当前的就是公共子串的第一个；如果之前的位置是公共子串的第 $n$ 个字符，那此时这个就是第 $n+1$ 个。


## 本质



## 思路

## 适合使用动态规划
### 最优子结构
看下面最优解的结构的描述，两个序列的 LCS 是基于它们前缀序列的 LCS。

### 重叠子问题
求任何一个公共子序列时，都要求比它更小的所有的公共子序列。


## 第一步：描绘最优解的结构
1. 描述一下《算法导论》定义 15.1。
2. 如果 Z 是 X 和 Y 的一个 LCS，那么：
    * 如果 X 和 Y 的最后一个元素相等：
        1. 那么显然这个元素肯定会出现在 Z 中，而且是 Z 的最后一个元素；
        2. 同时，Z 除去这最后一个元素的序列，也是 X 和 Y 的 CS；
        3. 而且，Z 除去这最后一个元素的序列，也是 X 和 Y 分别除去最有一个元素的序列的 LCS。
    * 即使 X 和 Y 的最后一个元素不相等，Z 的最后一个元素也可能是 X 的最后一个元素 **或者** Y 的最后一个元素。例如 $<A, B, C, B , D, A, B>$ 和 $<B, D, C, A, B, A>$ 的 LCS 是 $<B, D, A, B>$。
    * 如果 X 和 Y 的最后一个元素不相等，并且 Z 和 X 的最后一个元素不相等：
        1. 那么可以更严格的说，Z 是 X 除去最有一个元素的序列的 LCS；
        2. 同时因为 Z 和 Y 的最后一个元素可能相等；
        3. 所以 Z 是 X 除去最有一个元素的序列和 Y 的 LCS。
    * 如果 X 和 Y 的最后一个元素不相等，并且 Z 和 Y 的最后一个元素不相等：
        * 同理，Z 是 X 和 Y 除去最有一个元素的序列的 LCS。
3. 这个定理告诉我们，两个序列的 LCS 包含两个序列的前缀的 LCS。因此，LCS 问题具有最优子结构性质。


## 第二步：递归的定义最优解的值
1. 直接看《算法导论》392 页。


## 第三步：自底向上求解
1. 书上的伪代码中序列的序号从 1 开始，然后把表格中序号包含 0 的值都设定为 0，作为下溢出的值，所以它可以放心的使用 `csl[i-1][j-1]`。
2. 但下面实际实现中，序列的序号从 0 开始，因此表格中序号包含 0 的值就是实际的解的值，不存在作为下溢出的值，所以使用 `csl[i-1][j-1]` 必须要先判断，以免序号出现 -1。
3. 实现如下
    ```cpp
    #include <stdio.h>

    #define M 7
    #define N 6

    char c1[M] = {'A', 'B', 'C', 'B', 'D', 'A', 'B'};
    char c2[N] = {'B', 'D', 'C', 'A', 'B', 'A'};

    int csl[M][N] = {}; 

    int LCS_length (char c1[], char c2[]) {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                if (c1[i] == c2[j]) {
                    // 这里不能像书上递归式那样直接使用 csl[i-1][j-1] + 1，
                    // 因为这里的序号是从 0 开始
                    if (i == 0 || j == 0) { 
                        csl[i][j] = 1;
                    }
                    else {
                        csl[i][j] = csl[i-1][j-1] + 1;
                    }
                }
                else {
                    // 同样要对序号包含 0 的特殊处理
                    if (i == 0 && j == 0) {
                        csl[i][j] = 0;
                    }
                    else if (i == 0) {
                        csl[i][j] = csl[i][j-1];
                    }
                    else if (j == 0) {
                        csl[i][j] = csl[i-1][j];
                    }
                    else {
                        int sub1Len = csl[i][j-1];
                        int sub2Len = csl[i-1][j];
                        csl[i][j] = (sub1Len > sub2Len) ? sub1Len : sub2Len;
                    }
                }
            }
        }
        return csl[M-1][N-1];
    }

    void print_csl_table () {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                printf("%d ", csl[i][j]);
            }
            printf("\n");
        }
    }

    int main(void) {
        int n = LCS_length(c1, c2);
        printf("%d\n", n); // 4

        printf("\n");
        print_csl_table();
        // 0 0 0 1 1 1
        // 1 1 1 1 2 2
        // 1 1 2 2 2 2
        // 1 1 2 2 3 3
        // 1 2 2 2 3 3
        // 1 2 2 3 3 4
        // 1 2 2 3 4 4
    }
    ```

## 第四步：计算最优解的值
1. 根据《算法导论》定理 15.1，每一个位置（两个子序列）的 LCS 都是依赖之前某个位置（更小的两个子序列）的 LCS。
2. 所以为了得到最末尾位置 `(M-1, N-1)`（两个完整序列）的 LCS，只需要找到它依赖的前一个位置（两个子序列）。这个位置可能是 `(M-2, N-2)`、`(M-2, N-1)` 或 `(M-1, N-2)` 中的一个。
3. 因此我们需要在第三步的基础上，记录每个位置依赖的前一个位置
    ```cpp
    #include <stdio.h>
    #include <string.h>

    #define M 7
    #define N 6

    char c1[M] = {'A', 'B', 'C', 'B', 'D', 'A', 'B'};
    char c2[N] = {'B', 'D', 'C', 'A', 'B', 'A'};

    int csl[M][N] = {}; 
    char* last_csl[M][N] = {}; // 记录每个位置依赖的上一个位置

    int LCS_length (char c1[], char c2[]) {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                if (c1[i] == c2[j]) {
                    if (i == 0 || j == 0) { 
                        csl[i][j] = 1;
                        // 这种情况下并没有依赖的前一个位置，当前位置就是一个 CS 的开始位置
                        last_csl[i][j] = "*";
                    }
                    else {
                        csl[i][j] = csl[i-1][j-1] + 1;
                        // 用箭头记录依赖的前一个位置
                        last_csl[i][j] = "↖";
                    }
                }
                else {
                    if (i == 0 && j == 0) {
                        csl[i][j] = 0;
                        // 这种情况下同样没有依赖的前一个位置，但当前位置也并不是一个 CS 的开始
                        last_csl[i][j] = " ";
                    }
                    else if (i == 0) {
                        csl[i][j] = csl[i][j-1];
                        last_csl[i][j] = "←";
                    }
                    else if (j == 0) {
                        csl[i][j] = csl[i-1][j];
                        last_csl[i][j] = "↑";
                    }
                    else {
                        int sub1Len = csl[i][j-1];
                        int sub2Len = csl[i-1][j];
                        if (sub1Len > sub2Len) {
                            csl[i][j] = sub1Len;
                            last_csl[i][j] = "←";
                        }
                        else {
                            csl[i][j] = sub2Len;
                            last_csl[i][j] = "↑";
                        }
                    }
                }
            }
        }
        return csl[M-1][N-1];
    }

    void print_csl_table () {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                printf("%d ", csl[i][j]);
            }
            printf("\n");
        }
    }

    void print_last_csl_table () {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                printf("%s ", last_csl[i][j]);
            }
            printf("\n");
        }
    }

    int main(void) {
        int n = LCS_length(c1, c2);
        printf("%d\n", n); // 4

        printf("\n");
        print_csl_table();
        // 0 0 0 1 1 1
        // 1 1 1 1 2 2
        // 1 1 2 2 2 2
        // 1 1 2 2 3 3
        // 1 2 2 2 3 3
        // 1 2 2 3 3 4
        // 1 2 2 3 4 4

        printf("\n\n");
        print_last_csl_table();
        //   ← ← * ← *
        // * ← ← ↑ ↖ ←
        // ↑ ↑ ↖ ← ↑ ↑
        // * ↑ ↑ ↑ ↖ ←
        // ↑ ↖ ↑ ↑ ↑ ↑
        // ↑ ↑ ↑ ↖ ↑ ↖
        // * ↑ ↑ ↑ ↖ ↑


    }
    ```
3. 


两个完整只要记录每个位置所依赖的前一个位置，就能最终一步步的得出整个两个序列的 LCS。也就是从连个序列


```cpp
#include <stdio.h>
// #include <stdlib.h>


#define M 7
#define N 6

char c1[M] = {'A', 'B', 'C', 'B', 'D', 'A', 'B'};
char c2[N] = {'B', 'D', 'C', 'A', 'B', 'A'};

int csl[M][N] = {}; 
typedef struct {
    int x; int y;
} Coor;
Coor last_csl_coor[M][N] = {};

int LCS_length (char c1[], char c2[]) {
    for (int i=0; i<M; i++) {
        for (int j=0; j<N; j++) {
            if (c1[i] == c2[j]) {
                // 这里不能像书上递归式那样直接使用 csl[i-1][j-1] + 1，
                // 因为这里的序号是从 0 开始
                if (i == 0 || j == 0) { 
                    csl[i][j] = 1;
                    last_csl_coor[i][j] = (Coor){-1, -1};
                }
                else {
                    csl[i][j] = csl[i-1][j-1] + 1;
                    last_csl_coor[i][j] = (Coor){i-1, j-1};
                }
            }
            else {
                // 同样要对序号包含 0 的特殊处理
                if (i == 0 && j == 0) {
                    csl[i][j] = 0;
                    last_csl_coor[i][j] = (Coor){-1, -1};
                }
                else if (i == 0) {
                    csl[i][j] = csl[i][j-1];
                    last_csl_coor[i][j] = (Coor){i, j-1};
                }
                else if (j == 0) {
                    csl[i][j] = csl[i-1][j];
                    last_csl_coor[i][j] = (Coor){i-1, j};
                }
                else {
                    int sub1Len = csl[i][j-1];
                    int sub2Len = csl[i-1][j];
                    // csl[i][j] = (sub1Len > sub2Len) ? sub1Len : sub2Len;
                    if (sub1Len > sub2Len) {
                        csl[i][j] = sub1Len;
                        last_csl_coor[i][j] = (Coor){i, j-1};
                    }
                    else {
                        csl[i][j] = sub2Len;
                        last_csl_coor[i][j] = (Coor){i-1, j};
                    }
                }
            }
        }
    }
    return csl[M-1][N-1];
}

void print_csl_table () {
     for (int i=0; i<M; i++) {
        for (int j=0; j<N; j++) {
            printf("%d ", csl[i][j]);
        }
        printf("\n");
    }
}

void print_last_csl_coor_table () {
     for (int i=0; i<M; i++) {
        for (int j=0; j<N; j++) {
            printf("{%-2d %2d} ", last_csl_coor[i][j].x, last_csl_coor[i][j].y);
        }
        printf("\n");
    }
}

void print_csl () {
    int i = M;
    int j = N;
    printf("%d ", c1[i]);
    while (last_csl_coor[i][j].x > -1 && last_csl_coor[i][j].y > -1) {
        printf("%d ", c1[i]);
    }
}

int main(void) {
    
    // Coor a = {5, 4};
    // last_csl_coor[3][4] = a;
    // printf("%d %d\n", last_csl_coor[3][4].x, last_csl_coor[3][4].y);
    int n = LCS_length(c1, c2);
    printf("%d\n", n); // 4

    printf("\n");
    print_csl_table();
    // 0 0 0 1 1 1
    // 1 1 1 1 2 2
    // 1 1 2 2 2 2
    // 1 1 2 2 3 3
    // 1 2 2 2 3 3
    // 1 2 2 3 3 4
    // 1 2 2 3 4 4

    printf("\n\n");
    print_last_csl_coor_table();

    printf("\n\n");
    print_csl();
}
```

## 《图解算法》中的思路
## 最长公共子串
### 思路
1. 因为最长公共子串可能出现在两个字符串的不同的任意位置，所以需要对两个字符串的每个字符都一一比较。
2. 当两个字符比较结果为相同时，它们就是处于长度至少为 1 的公共子串里。
3. 这个相同的字符可能是公共子串的第一个字符，也可能是之后的某个字符。要确定它到底是公共子串的第几个字符，就要看它 “前面” 还有没匹配结果相同的字符。这个 “前面” 是哪儿？
4. 如果当前相同的这个字符的坐标位置是 $(3, 4)$，即第一个字符串的第 3 个字符和第二个字符串的第 4 个字符，那 “前面” 比较的字符就应该是第一个字符串的第 2 个字符和第二个字符串的第 3 个字符，即 $(2, 3)$。
5. 所以，如果 $(2, 3)$ 是公共子串的第一个字符，那 $(3, 4)$ 就是公共子串的第二个字符。也即是说，当前的公共子串长度为 2。
6. 所以，如果一个字符 $(x, y)$ 是匹配结果相同的，那它的长度值就应该是它前面字符 $(x-1, y-1)$ 的长度值加一。当然 $x-1$ 和 $y-1$ 都要大于零，否则 $(x, y)$ 的长度值就只能是 1。

### 实现
```js
function mls (str1, str2) {
    let len1 = str1.length;
    let len2 = str2.length;

    let arr = [];

    for ( let i=0; i<len1; i++ ) {
        arr[i] = [];

        for ( let j=0; j<len2; j++ ) {
            if ( str1[i] === str2[j] ) {
                if ( i>0 && j>0 ) {
                    arr[i][j] = arr[i-1][j-1] + 1;
                }
                else {
                    arr[i][j] = 1;
                }
            }
            else {
                arr[i][j] = 0;
            }
        }   
    }

    return arr;
}


let str0 = 'fish';
let str1 = 'hish';
let str2 = 'vista';

console.log( mls(str0, str1) );
// [0, 0, 0, 0]
// [0, 1, 0, 0]
// [0, 0, 2, 0]
// [1, 0, 0, 3]

console.log( mls(str0, str2) );
// [0, 0, 0, 0, 0]
// [0, 1, 0, 0, 0]
// [0, 0, 2, 0, 0]
// [0, 0, 0, 0, 0]

console.log( mls(str0, str0) );
// [1, 0, 0, 0]
// [0, 2, 0, 0]
// [0, 0, 3, 0]
// [0, 0, 0, 4]
```


## 公共子序列
### 思路
### 长度值的单调性
1. 公共子串的情况中，因为要求必须是连续的，所以一个字符串中可能会出现多个不连续的公共子串。
2. 所以，随着矩阵坐标的增加，每个位置的长度值不一定是单调的。比如前面有一个长度为 3 的公共子串，所以最大的长度值为 3。但到 3 就中断，之后可能又会有新的子串，这时就又出现了长度值 1。
3. 而公共子序列则不需要连续，所以长度值就会随着坐标值单调递增的。也就是说，在矩阵中，一个节点的长度值肯定是小于等于它下方和右方的节点长度值。
4. 也就是说，在一个区域内，最大的值一定是右下角的那一个。

### 长度值的计算
1. 一个节点可能有两种比较结果：字符不同和字符相同。
2. 字符不同时，公共子序列长度不变，还是之前子序列最大的长度值。这个最大的长度值，要么是当前位置的左边，要么是当前位置的上面。所以当前位置的长度值应该是取这两个位置中较大的那一个。
3. 如果字符相同，这时我的第一反应是：因为又出现了一个相同的，所以公共子序列的长度又要加一了，大概就是从那两个位置中较大的值再加一。
4. 但是下面的情况显然不符合预期的
    <table>
        <tr>
            <td></td>
            <th>A</th>
            <th>B</th>
            <th>B</th>
        </tr>
        <tr>
            <th>A</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <tr>
            <th>B</th>
            <td>1</td>
            <td>2</td>
            <td>?</td>
        </tr>
    </table>
5. $(2, 3)$ 这个位置的值应该是 2 而不是 3。$(2, 3)$ 的比较结果是相同，它要基于本次比较之前的结果加一，而本次比较之前的结果肯定是不能包括本次的第二行和第三列这两个 B 的，因为如果要计算这两个 B 相同时的长度值，那么这两个就不能同时再和其他的 B 相同了。
6. 也就是说，第二行的那个 B，它可以和第二列的 B 相同从而组成一个公共子序列，也可以和第三列的 B 相同从而组成另一个公共子序列，但它不能同时和这两个 B 相同。你计算第二个公共子序列的长度时，不能基于第一个公共子序列。
7. 所以 $(2, 3)$ 只能基于下面情况的最大值，也就是 $(1, 2)$
    <table>
        <tr>
            <td></td>
            <th>A</th>
            <th>B</th>
        </tr>
        <tr>
            <th>A</th>
            <td>1</td>
            <td>1</td>
        </tr>
    </table>
8. 也就是说，如果 $(x, y)$ 比较结果相同，那它的长度值应该是它的左上角 $(x-1, y-1)$ 的长度值加一。
9. 但比较结果为不同的时候并不需要考虑这个情况，并不需要使用左上角的值
    <table>
        <tr>
            <td></td>
            <th>A</th>
            <th>B</th>
            <th>C</th>
        </tr>
        <tr>
            <th>A</th>
            <td>1</td>
            <td>1</td>
            <td>1</td>
        </tr>
        <tr>
            <th>B</th>
            <td>1</td>
            <td>2</td>
            <td>?</td>
        </tr>
    </table>
10. 因为不同时，当前长度值的意义是：之前所有公共子序列的最大值；而相同时长度值的意义是：当前公共子序列的最大值。

### 实现
```js
function lcs (str1, str2) {
    let len1 = str1.length;
    let len2 = str2.length;

    let arr= [];

    for ( let i=0; i<len1; i++ ) {
        arr[i] = [];

        for ( let j=0; j<len2; j++ ) {
            if ( str1[i] === str2[j] ) {
                if ( i>0 && j>0 ) {
                    arr[i][j] = arr[i-1][j-1] + 1;
                }
                else {
                    arr[i][j] = 1;
                }
            }
            else {
                if ( i>0 && j>0 ) {
                    arr[i][j] = Math.max(arr[i-1][j], arr[i][j-1]);    
                }
                else if ( i>0 ) {
                    arr[i][j] = arr[i-1][j];
                }
                else if ( j>0 ){
                    arr[i][j] = arr[i][j-1];
                }
                else {
                    arr[i][j] = 0;
                }
            }
        }   
    }

    return arr;
}


let str0 = 'fish';
let str1 = 'hish';
let str2 = 'vista';

console.log( lcs(str0, str1) );
// [0, 0, 0, 0]
// [0, 1, 1, 1]
// [0, 1, 2, 2]
// [1, 1, 2, 3]

console.log( lcs(str0, str2) );
// [0, 0, 0, 0, 0]
// [0, 1, 1, 1, 1]
// [0, 1, 2, 2, 2]
// [0, 1, 2, 2, 2]

console.log( lcs(str0, str0) );
// [1, 1, 1, 1]
// [1, 2, 2, 2]
// [1, 2, 3, 3]
// [1, 2, 3, 4]

console.log( lcs('fort', 'fosh') );
// [1, 1, 1, 1]
// [1, 2, 2, 2]
// [1, 2, 2, 2]
// [1, 2, 2, 2]

console.log( lcs('fish', 'fosh') );
// [1, 1, 1, 1]
// [1, 1, 1, 1]
// [1, 1, 2, 2]
// [1, 1, 2, 3]
```



## Referecens
* [图解算法](https://book.douban.com/subject/26979890/)
* [算法导论](https://book.douban.com/subject/20432061/)