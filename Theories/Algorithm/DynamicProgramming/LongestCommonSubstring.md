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
    - [算法改进](#算法改进)
    - [自顶向下的带备忘版本](#自顶向下的带备忘版本)
    - [练习](#练习)
        - [《算法导论》15.4-5](#算法导论154-5)
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
求任何一个公共子序列时，都要求比它更小的公共子序列。


## 第一步：描绘最优解的结构
1. 原问题比较复杂，那怎么拆解为规模更小但结构相同的子问题？最长公共子序列，是由次长公共子序列加上最后一个公共元素构成的。
2. 关于这最后一个公共元素，会做出什么选择？或者它有哪些不同的状态？
3. 其实到这里并没有明确的思路可供遵循，不过既然是最后一个，那我们就可以尝试看看它和两个序列的最后一个元素的关系（设两个序列为 $X$ 和 $Y$，它们的是 LCS 是 $Z$）：
    * 如果 $Z$ 的最后一个公共元素恰好是 $X$ 和 $Y$ 的最后一个元素，那么 $Z$ 减去最后一个元素的序列就是 $X$ 和 $Y$ 减去最后一个元素的序列的 LCS。也就是在这种情况下，子问题就是求解 $X$ 和 $Y$ 分别减去最后一个元素之后的子 LCS。这个子 LCS 再加上 $Z$ 的最后一个元素就是原问题的 LCS；
    * 如果最后一个公共元素和两个序列的最后一个元素都不相同，那么子问题 “$X$ 和 $Y$ 分别减去最后一个元素后的 LCS” 就是原问题的 LCS；
    * 如果最后一个公共元素只和 $X$ 的最后一个元素相同而和 $Y$ 的最后一个元素不同，那么原序列 $X$ 和 $Y$ 减去最后一个元素的子序列的 LCS 就是原问题的 LCS；
    * 同理，如果最后一个公共元素只和 $Y$ 的最后一个元素相同而和 $X$ 的最后一个元素不同，那么原序列 $Y$ 和 $X$ 减去最后一个元素的子序列的 LCS 就是原问题的 LCS。
4. 可以看到，对于最后一个公共元素的四种状态，会构造出不同的子问题，进而缩减原问题的规模，通过求解更小的子问题来解决原问题。
5. 四种状态会求出四种可能的 LCS，我们通过比较选出其中真正的 LCS。不过有两点特殊的：
    * 如果两个序列满足第一种状态，那第一种状态的 LCS 就是真正的 LCS，因为此时的 LCS 已经包含到了最后一个公共元素；
    * 第二种情况其实是第三、四种情况的特例。因此实际比较重，只要不是第一种情况，那只要比较三、四种情况即可。
6. 《算法导论》223 页的 定理15.1 描述了上述逻辑。这个定理告诉我们，两个序列的 LCS 包含两个序列的前缀的 LCS。因此，LCS 问题具有最优子结构性质。


## 第二步：递归的定义最优解的值
1. 上面的分析已经描述了最优子结构的递归式，可以再看看《算法导论》223 页的描述。
2. 实现递归解法。JS 实现起来很简单
    ```js
    const X = ['A', 'B', 'C', 'B', 'D', 'A', 'B'];
    const Y = ['B', 'D', 'C', 'A', 'B', 'A'];

    // 这里可以传递两个数组，但因为递归操作的子数组元素都是相邻的，所以可以直接用序号表示
    function LCS (m, n) {
        if (m < 0 || n < 0) {
            return "";
        }
        if ( X[m] === Y[n] ) {
            return LCS(m-1, n-1) + X[m];
        }
        else {
            let s1 = LCS(m, n-1);
            let s2 = LCS(m-1, n);
            return s1.length > s2.length ? s1 : s2;
        }
    }


    console.log( LCS(X.length-1, Y.length-1) ); // BCBA
    ```
3. TODO，C 实现不会
    ```cpp
    #define M 7
    #define N 6

    char* X[M] = {"A", "B", "C", "B", "D", "A", "B"};
    char* Y[N] = {"B", "D", "C", "A", "B", "A"};


    char* LCS (int m, int n) {
        if (m == 0 || n == 0) {
            return "";
        }

        if ( X[m] == Y[n] ) {
            char* s = calloc(N+1, sizeof(char));
            strcpy(s, LCS(m-1, n-1));
            strcpy(s, X[m]);
            // printf("1: %s\n", s);
            return s;
        }
        else {
            char* s1 = calloc(N+1, sizeof(char));
            char* s2 = calloc(N+1, sizeof(char));
            strcpy(s1, LCS(m, n-1));
            strcpy(s2, LCS(m-1, n));
            // printf("2: %s\n", s1);
            // printf("3: %s\n", s2);
            return strlen(s1) > strlen(s2) ? s1 : s2;
        }
    }

    int main (void) {

        char* lcs = LCS(M-1, N-1);
        
        printf("%d\n", strlen(lcs));
        
        for (int i=0; i<N-1; i++) {
            printf("%c ", lcs[i]);
        }
        printf("\n");
        
        return 0;
    }
    ```
4. 加入缓存。注意，在上面的实现中，`m` 和 `n` 都是可以为 0 的，所以其中的 `m-1` 和 `n-1` 都可能为是 -1。但是缓存的数组序号不能为 -1。因此修改一下两个序列，让它们从 1 开始，这样 `m-1` 和 `n-1` 最小就只能为 0
    ```js

    const X = [null, 'A', 'B', 'C', 'B', 'D', 'A', 'B'];
    const Y = [null, 'B', 'D', 'C', 'A', 'B', 'A'];
    // 缓存表的长宽相应的也要包括 0 的情况，也是从 1 开始保存
    const memo = Array.from(Array(X.length), ()=>Array(Y.length));


    function LCS (m, n) {
        // 因为从 1 开始计数，所以 m 和 n 的合理最小值只能是 1
        if (m < 1 || n < 1) {
            return "";
        }

        // 这里必须要判断是否为 `undefined` 不能直接 `if (memo[m][n])`，因为有的公共子序列就是空字符串
        if (memo[m][n] !== undefined) {
            return memo[m][n];
        }

        if ( X[m] === Y[n] ) {
            // 如果 m 和 n 都是最小的合理值 1，那下面的递归就是 LCS(0, 0)，
            // 返回空字符串，保存到 memo[0][0]
            let s = LCS(m-1, n-1);
            memo[m-1][n-1] = s;
            return s + X[m];
        }
        else {
            // 如果 n 是最小的合理值 1，那下面的递归就是 LCS(m, 0)，返回空字符串，保存到 memo[m][0]
            let s1 = LCS(m, n-1);
            memo[m][n-1] = s1;
            let s2 = LCS(m-1, n);
            memo[m-1][n] = s2;
            return s1.length > s2.length ? s1 : s2;
        }
    }


    console.log( LCS(X.length-1, Y.length-1) ); // BCBA
    console.log(memo);
    // 0: (7) [empty, '', '', '', empty × 3]
    // 1: (7) ['', '', '', '', 'A', empty × 2]
    // 2: (7) [empty, 'B', 'B', 'B', 'A', empty × 2]
    // 3: (7) ['', 'B', 'B', 'BC', 'BC', empty × 2]
    // 4: (7) [empty, 'B', 'B', 'BC', 'BC', 'BCB', empty]
    // 5: (7) [empty × 2, 'BD', 'BC', 'BC', 'BCB', empty]
    // 6: (7) [empty × 4, 'BCA', empty, 'BCBA']
    // 7: (7) [empty × 5, 'BCAB', empty]
    ```

## 第三步：自底向上求解
1. JS 实现
    ```js
    const X = [null, 'A', 'B', 'C', 'B', 'D', 'A', 'B'];
    const Y = [null, 'B', 'D', 'C', 'A', 'B', 'A'];
    const table = Array.from(Array(X.length), ()=>Array(Y.length));
    // 最开始会读取到行或列为 0 的位置，必须要返回字符串而非 `undefined` 
    // 才能进行字符串拼接和读取 `length` 属性
    for (let i=0; i<X.length; i++) {
        for (let j=0; j<Y.length; j++) {
            if (i === 0 || j === 0) {
                table[i][j] = "";
            }
        }    
    }

    function LCS (m, n) {
        if (m < 1 || n < 1) {
            return "";
        }

        for (let i=1; i<=m; i++) {
            for (let j=1; j<=n; j++) {
                if ( X[i] === Y[j] ) {
                    table[i][j] = table[i-1][j-1] + X[i];
                }
                else {
                    let s1 = table[i][j-1];
                    let s2 = table[i-1][j];
                    table[i][j] = s1.length > s2.length ? s1 : s2;
                }
            }
        }
        return table[m][n];
    }


    console.log( LCS(X.length-1, Y.length-1) ); // BCBA
    console.log(table);
    // 0: (7) ['', '', '', '', '', '', '']
    // 1: (7) ['', '', '', '', 'A', 'A', 'A']
    // 2: (7) ['', 'B', 'B', 'B', 'A', 'AB', 'AB']
    // 3: (7) ['', 'B', 'B', 'BC', 'BC', 'AB', 'AB']
    // 4: (7) ['', 'B', 'B', 'BC', 'BC', 'BCB', 'BCB']
    // 5: (7) ['', 'B', 'BD', 'BC', 'BC', 'BCB', 'BCB']
    // 6: (7) ['', 'B', 'BD', 'BC', 'BCA', 'BCB', 'BCBA']
    // 7: (7) ['', 'B', 'BD', 'BC', 'BCA', 'BCAB', 'BCBA']
    ```
2. C 实现，计算最优解，不包括最优解的值
    ```cpp
    #define M 7
    #define N 6

    char X[M+1] = {' ', 'A', 'B', 'C', 'B', 'D', 'A', 'B'};
    char Y[N+1] = {' ', 'B', 'D', 'C', 'A', 'B', 'A'};
    char table[M+1][N+1] = {0};



    int LCS (int m, int n) {
        if (m<1 || n<1) {
            return 0;
        }

        for (int i=1; i<=m; i++) {
            for (int j=1; j<=n; j++) {
                if (X[i] == Y[j]) {
                    table[i][j] = table[i-1][j-1] + 1;
                }
                else {
                    int a = table[i][j-1];
                    int b = table[i-1][j];
                    table[i][j] = a > b ? a : b;
                }
            }       
        }

        return table[m][n];
    }

    void print_table () {
        for (int i=0; i<=M; i++) {
            for (int j=0; j<=N; j++) {
                printf("%d ", table[i][j]);
            }
            printf("\n");
        }
    }


    int main (void) {

        int len = LCS(M, N);
        
        printf("%d\n\n", len); // 4
        
        print_table();
        // 0 0 0 0 0 0 0 
        // 0 0 0 0 1 1 1 
        // 0 1 1 1 1 2 2 
        // 0 1 1 2 2 2 2 
        // 0 1 1 2 2 3 3 
        // 0 1 2 2 2 3 3 
        // 0 1 2 2 3 3 4 
        // 0 1 2 2 3 4 4 
        
        return 0;
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
4. 现在，为了获得两个完整序列的 LCS，需要从表格的右下角开始，不断追溯前一个依赖的位置，然后记录下其中 `↖` 位置和最后的 `*` 位置的字符，因为这两个位置都是 LCS 的字符
    ```cpp
    // 省略已有代码

    void print_csl (int i, int j) {
        if ( strcmp(last_csl[i][j], " ") == 0 ) {
            
        }
        if ( strcmp(last_csl[i][j], "*") == 0 ) {
            printf("%c", c1[i]);
        }
        else if ( strcmp(last_csl[i][j], "↖") == 0 ) {
            print_csl(i-1, j-1);
            printf("%c", c1[i]);
        }
        else if ( strcmp(last_csl[i][j], "↑") == 0 ) {
            print_csl(i-1, j);
        }
        else if ( strcmp(last_csl[i][j], "←") == 0 ) {
            print_csl(i, j-1);
        }
    }

    int main(void) {
        // 省略已有代码

        printf("\n\n");
        print_csl(M-1, N-1); // BCBA
    }
    ```
5. 上面这一过程的运行时间为 $O(M+N)$，因为每次递归调用 `print_csl` 时 `i` 和 `j` 至少有一个会减一


## 算法改进
1. 一旦设计出一个算法，通常情况下你都会发现它在时空开销上有改进的余地。
2. 一些改进可以将性能提升常数倍，但并不会有渐进性的提升；而另一些改进则可以带来时空上巨大的渐进性提升。
3. 例如在 LCS 算法中，我们可以不使用 `last_csl`，给定表 `csl` 中的任意值 `csl[i][j]`，我们可以通过比较它和 `csl[i-1][j]`、`csl[i][j-1]` 的关系就能得出它依赖的前一项是哪一个。
4. 这样的比较是 $O(1)$ 的复杂度。因此这种情况下实现的 `print_csl` 仍然可以保证 $O(M+N)$ 的运行时间
    ```cpp
    void print_csl_no_last_csl (int i, int j) {
        if (c1[i] == c2[j]) {
            if (i == 0 || j == 0) { 
                printf("%c", c1[i]);
            }
            else {
                print_csl_no_last_csl(i-1, j-1);
                printf("%c", c1[i]);
            }
        }
        else {
            if (i == 0 && j == 0) {
                
            }
            else if (i == 0) {
                print_csl_no_last_csl(i, j-1);
            }
            else if (j == 0) {
                print_csl_no_last_csl(i-1, j);
            }
            else {
                int sub1Len = csl[i][j-1];
                int sub2Len = csl[i-1][j];
                if (sub1Len > sub2Len) {
                    print_csl_no_last_csl(i, j-1);
                }
                else {
                    print_csl_no_last_csl(i-1, j);
                }
            }
        }
    }
    ```
5. 这个方法通过移除 `last_csl` 而节省了 $Θ(MN)$ 的空间，但 `csl` 也需要 $Θ(MN)$ 的空间，所以整体的空间渐进性并没有改变。
6. TODO，《算法导论》练习 15.4-4


## 自顶向下的带备忘版本
1. 数组现在作为备忘，需要进行初始化
    ```cpp
    void initCSL () {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                csl[i][j] = -1;
            }
        }
    }
    ```
2. `LCS_length` 改为自顶向下的带备忘版本
    ```cpp
    int memoized_LCS_length (char c1[], char c2[], int i, int j) {
        if (c1[i] == c2[j]) {
            if (i == 0 || j == 0) { 
                return 1;
            }
            else {
                if (csl[i-1][j-1] == -1) {
                    csl[i-1][j-1] = memoized_LCS_length(c1, c2, i-1, j-1);
                }
                return csl[i-1][j-1] + 1;
            }
        }
        else {
            if (i == 0 && j == 0) {
                return 0;
            }
            else if (i == 0) {
                if (csl[i][j-1] == -1) {
                    csl[i][j-1] = memoized_LCS_length(c1, c2, i, j-1);
                }
                return csl[i][j-1];
            }
            else if (j == 0) {
                if (csl[i-1][j] == -1) {
                    csl[i-1][j] = memoized_LCS_length(c1, c2, i-1, j);
                }
                return csl[i-1][j];
            }
            else {
                (csl[i][j-1] == -1) && (csl[i][j-1] = memoized_LCS_length(c1, c2, i, j-1));
                (csl[i-1][j] == -1) && (csl[i-1][j] = memoized_LCS_length(c1, c2, i-1, j));
                return (csl[i][j-1] > csl[i-1][j]) ? csl[i][j-1] : csl[i-1][j];
            }
        }
    }
    ```
3. 调用
    ```cpp
    int main(void) {
        initCSL();

        int n = memoized_LCS_length(c1, c2, M-1, N-1);
        printf("%d\n", n); // 4

        printf("\n");
        print_csl_table();
        //  0  0  0  1 -1 -1
        //  1  1  1  1 -1 -1
        //  1  1  2  2 -1 -1
        //  1  1  2  2  3 -1
        // -1  2  2  2  3 -1
        // -1 -1 -1  3 -1  4
        // -1 -1 -1 -1  4 -1

        printf("\n\n");
        print_csl_no_last_csl(M-1, N-1); // BCBA
    }
    ```


## 练习
### 《算法导论》15.4-5
TODO


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