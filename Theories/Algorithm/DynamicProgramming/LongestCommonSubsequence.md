# Longest Common Subsequence


<!-- TOC -->

- [Longest Common Subsequence](#longest-common-subsequence)
    - [设计思想](#设计思想)
        - [因果递推关系](#因果递推关系)
        - [答案很多时候就在问题中——首先要观察和理解问题](#答案很多时候就在问题中首先要观察和理解问题)
        - [最长公共子串中非动态规划实现的两种方法](#最长公共子串中非动态规划实现的两种方法)
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
    - [练习](#练习)
        - [《算法导论》15.4-5](#算法导论154-5)
    - [最长公共子串](#最长公共子串)
        - [非动态规划实现](#非动态规划实现)
        - [TODO 自顶向下的递归解法](#todo-自顶向下的递归解法)
        - [自底向上方法](#自底向上方法)
    - [Referecens](#referecens)

<!-- /TOC -->


## 设计思想
### 因果递推关系
1. 我们想知道两个字符串最长的公共子串的长度，假设这个长度为 $x$。怎么才能知道这个 $x$ 是多少？
2. 如果我们知道了 $x-1$ 是多少，就会知道 $x$ 是多少；同理，如果我们知道了 $x-2$ 是多少，就会知道 $x-1$ 是多少。
3. 以此类推，我们遍历比较每个字符的时候，遇到一个相同的字符时，它可能是公共子串的任意位置的字符。要确定它是第几个，就要看它之前的那个位置：如果之前的位置不相同，那当前的就是公共子串的第一个；如果之前的位置是公共子串的第 $n$ 个字符，那此时这个就是第 $n+1$ 个。

### 答案很多时候就在问题中——首先要观察和理解问题
1. 在刚看到最长公共子串的问题时，一时不知道要怎么解，并且因为最长公共子序列的惯性思维，导致连暴力解法也没有想到。
2. 当面对一个问题而不知道解决方法时，最好的处理方法之一就是，先取观察和理解问题，因为越充分观察和理解才更有可能认识到其中的规律。
3. “最长公共子串”，这个名字，其实就已经提供了解法，虽然不是最优解。
4. 这是一个有两个修饰词的辩证短语，“最长的” “公共的” “子串”。
5. 从语言的逻辑上就可以看出，答案首先要是一个子串，然后选出其中公共的，然后再选出其中最长的。
6. 现在就有了暴力解法的思路：找到两个字符串的所有子串，然后遍历其中所有公共的子串，遍历的过程中记录最长的公共子串。
7. 【学习策略——面对困难——不要急于解决问题】。


### 最长公共子串中非动态规划实现的两种方法
TODO


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
2. C 实现。由于 C 不能像 JS 那样方便的操作字符串，所以这里只是计算最优解，不包括最优解的值，也就是只计算 LCS 的长度
    ```cpp
    #define M 7
    #define N 6

    char X[M+1] = {' ', 'A', 'B', 'C', 'B', 'D', 'A', 'B'};
    char Y[N+1] = {' ', 'B', 'D', 'C', 'A', 'B', 'A'};
    int table[M+1][N+1] = {0};



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
1. 两个完整序列的 LCS 会不断递归的依赖子序列的 LCS，所以我们可以追踪完整的 LCS 依次依赖了哪些子序列对的 LCS。
2. 另外，从上面的计算可以看出来，真正构建 LCS 的步骤，只有在两个子序列满足 `X[i] == Y[j]` 时；而此时的 `X[i]` 就是 LCS 新加上的一个元素。
3. 所以结合上面两个特征，我们追踪依赖的子序列对的同时，记录那些满足 `X[i] == Y[j]` 的子序列对，就可以构建出完整的 LCS。
4. 依赖的子序列分为三种情况：`table[i-1][j-1]`、`table[i][j-1]` 和 `table[i-1][j]`。从 `table` 表的位置来说，就是依赖当前位置的左上、左侧和上侧。
5. 我们新建一个表来记录依赖关系，并使用 `"↖"`、`"←"` 和 `"↑"` 来记录三种依赖
    ```cpp
    #define M 7
    #define N 6

    char X[M+1] = {' ', 'A', 'B', 'C', 'B', 'D', 'A', 'B'};
    char Y[N+1] = {' ', 'B', 'D', 'C', 'A', 'B', 'A'};
    int table[M+1][N+1] = {0};
    char* result[M+1][N+1] = {}; // 因为 "↖" 是多字符，所以只能使用字符串而不能使用字符类型


    int LCS (int m, int n) {
        if (m<1 || n<1) {
            return 0;
        }

        for (int i=1; i<=m; i++) {
            for (int j=1; j<=n; j++) {
                if (X[i] == Y[j]) {
                    table[i][j] = table[i-1][j-1] + 1;
                    result[i][j] = "↖";
                }
                else {
                    int a = table[i][j-1];
                    int b = table[i-1][j];
                    if (a > b) {
                        table[i][j] = a;
                        result[i][j] = "←";
                    }
                    else {
                        table[i][j] = b;
                        result[i][j] = "↑";
                    }
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

    void print_result () {
        for (int i=0; i<=M; i++) {
            for (int j=0; j<=N; j++) {
                if (i == 0) {
                    printf("%5d", j);
                }
                else if (j == 0) {
                    printf("%5d", i);
                }
                else {
                    printf("%7s", result[i][j]);
                }
            }
            printf("\n");
        }
    }

    void print_LCS () {
        char lcs[N+1]; 
        int idx = 0;
        int m = M;
        int n = N;
        while (m && n) {
            if ( strcmp(result[m][n], "←") == 0 ) {
                n--;
            }
            else  if  ( strcmp(result[m][n], "↑") == 0 ){
                m--;
            }
            else {
                lcs[idx++] = X[m];
                m--;
                n--;
            }
        }
        while (--idx >= 0) {
            printf("%c", lcs[idx]);
        }
        printf("\n");
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

        print_result();
        // 0    1    2    3    4    5    6
        // 1    ↑    ↑    ↑    ↖    ←    ↖
        // 2    ↖    ←    ←    ↑    ↖    ←
        // 3    ↑    ↑    ↖    ←    ↑    ↑
        // 4    ↖    ↑    ↑    ↑    ↖    ←
        // 5    ↑    ↖    ↑    ↑    ↑    ↑
        // 6    ↑    ↑    ↑    ↖    ↑    ↖
        // 7    ↖    ↑    ↑    ↑    ↖    ↑

        print_LCS(); // BCBA

        return 0;
    }
    ```
6. `print_LCS` 的递归实现。注意要把 `printf` 放在递归调用后面，使用递归的栈式结构保证最后访问到的元素最先打印
    ```cpp
    void print_LCS (int m, int n) {
        if (m <= 0 || n <= 0) {
            return;
        }
        if ( strcmp(result[m][n], "←") == 0 ) {
            print_LCS (m, n-1);
        }
        else  if  ( strcmp(result[m][n], "↑") == 0 ){
            print_LCS (m-1, n);
        }
        else {
            print_LCS (m-1, n-1);
            printf("%c", X[m]);
        }
    }
    ```
7. `print_LCS` 的运行时间为 $O(M+N)$，因为每次循环或递归时 `i` 和 `j` 至少有一个会减一。


## 算法改进
1. 一旦设计出一个算法，通常情况下你都会发现它在时空开销上有改进的余地。
2. 一些改进可以将性能提升常数倍，但并不会有渐进性的提升；而另一些改进则可以带来时空上巨大的渐进性提升。
3. 例如在 LCS 算法中，我们可以不使用 `result`，给定表 `table` 中的任意值 `table[i][j]`，我们可以通过比较它和 `table[i-1][j]`、`table[i][j-1]` 的关系就能得出它依赖的前一项是哪一个。规律如下：
    1. 如果 `table[i][j]` 比 `table[i-1][j]` 和 `table[i][j-1]` 都大 1（此时也一定比 `table[i-1][j-1]`），那么 `result[i][j]` 为 `"↖"`；
    2. 如果 `table[i-1][j]` 比 `table[i][j-1]` 大 1，那么 `result[i][j]` 为 `"↑"`；
    3. 如果 `table[i][j-1]` 比 `table[i-1][j]` 大 1，那么 `result[i][j]` 为 `"←"`；
    4. 如果 `table[i][j]`、 `table[i-1][j]` 和 `table[i][j-1]` 相同呢？这就说明这两对子序列都可以达到相同长度的公共子序列。例如本例中 `table` 右下角三个值都是 4，因为 `ABCBDA` 和 `BDCABA` 拥有 LCS `BCBA`，`ABCBDAB` 和 `BDCAB` 也拥有 LCS `BDAB`。
4. 实现
    ```cpp
    void print_LCS (int m, int n) {
        if (m <= 0 || n <= 0) {
            return;
        }
        if ( table[m][n] > table[m-1][n] && table[m][n] > table[m][n-1] ) {
            print_LCS (m-1, n-1);
            printf("%c", X[m]);      
        }
        else if ( table[m-1][n] > table[m][n-1] ) {
            print_LCS (m-1, n);
        }
        else {
            print_LCS (m, n-1);
        }
    }
    ```
5. 这样的比较是 $O(1)$ 的复杂度。因此这种情况下实现的 `print_LCS` 仍然可以保证 $O(M+N)$ 的运行时间
6. 这个方法通过移除 `result` 而节省了 $Θ(MN)$ 的空间，但 `table` 也需要 $Θ(MN)$ 的空间，所以整体的空间渐进性并没有改变。
7. TODO，《算法导论》练习 15.4-4


## 练习
### 《算法导论》15.4-5
TODO


## 最长公共子串
与最长公共子序列不同的是，最长公共子串要求字符必须是连接在一起的。

### 非动态规划实现
1. 最暴力的方法，就是找到两个字符串的所有子串，对比其中所有公共的子串，然后找到最大的
    ```js
    function LCStr (str1, str2) {
        let len1 = str1.length;
        let len2 = str2.length;
        if (len1 < 1 || len2 < 1) {
            return "";
        }
        let maxStr = "";
        for (let i=0; i<len1; i++) { 
            for (let j=i; j<len1; j++) {
                let sub1 = str1.slice(i, j+1);
                for (let m=0; m<len2; m++) {
                    for (let n=m; n<len2; n++) {
                        let sub2 = str2.slice(m, n+1);
                        if (sub1 === sub2 && sub1.length > maxStr.length) {
                            maxStr = sub1;
                        }
                    }
                }
            }
        }
        return maxStr;
    }
    ```
2. 四层 `for` 循环有点多。虽然确实需要四个序号才能确定两个子串，但其实我们不需要遍历比较所有的子串，而是可以有选择的。比如如果两个子串是 `ABC` 和 `DEF`，那其实是没有必要进行比较的。    
3. 两个子串是公共子串是有前提的，一个前提就是，它们的首字符应该相同。
4. 因此，我们可以在每个字符串里只分别遍历一个序号，即单个字符。如果两个字符相同，那至少有了一个长度为 1 的公共子串。我们再查看后序的字符，如果相等那公共子串的长度就加一，如果不相等那当前公共子串就结束
    ```js
    let str1 = "habcwxopqrt";
    let str2 = "fabcgtopqrz";
    // let str1 = "hish";
    // let str2 = "fish";
    // let str2 = "vista";


    function LCStr (str1, str2) {
        let len1 = str1.length;
        let len2 = str2.length;
        if (len1 < 1 || len2 < 1) {
            return "";
        }

        let maxStr = "";
        for (let i=0; i<len1; i++) {
            for (let j=0; j<len2; j++) {
                if (str1[i] === str2[j]) {
                    let m = i+1;
                    let n = j+1;
                    let str = str1[i];
                    while ( m < len1 && n < len2 && str1[m] === str2[n] ) {
                        str += str1[m];
                        m++;
                        n++;
                    }
                    if (str.length > maxStr.length) {
                        maxStr = str;
                    }
                }
            }
        }
        return maxStr;
    }


    console.log( LCStr(str1, str2) ); // opqr
    ```
5. C 实现
    ```cpp
    const char* str1 = "habcwxopqrt";
    const char* str2 = "fabcgtopqrz";
    // const char* str1 = "hish";
    // const char* str2 = "fish";


    void LCStr (int* start, int* end) {
        *start = -1;
        *end = -1;
        int size1 = strlen(str1) / sizeof(char);
        int size2 = strlen(str2) / sizeof(char);
        if (size1 < 1 || size2 < 1) {
            return;
        }
        int maxLen = 0;
        for (int i=0; i<size1; i++) {
            for (int j=0; j<size2; j++) {
                if (str1[i] == str2[j]) {
                    int len = 1;
                    int m = i+1;
                    int n = j+1;
                    while ( m < size1 && n < size2 && str1[m] == str2[n] ) {
                        len++;
                        m++;
                        n++;
                    }
                    if (len > maxLen) {
                        maxLen = len;
                        *start = i;
                        *end = m-1;
                    }
                }
            }   
        }
    }

    int main (void) {
        int start;
        int end;
        LCStr(&start, &end);

        for (int i=start; i<=end; i++) {
            printf("%c", str1[i]);
        }
        printf("\n");


        return 0;
    }
    ```

### TODO 自顶向下的递归解法

### 自底向上方法
1. 最长公共子串的长度，等于它前面的公共子串的长度加一。
2. 例如 `str1[i]` 和 `str2[j]` 是最长公共子串的最后一个字符，那这个最长公共子串的长度，就是以 `str1[i-1]` 和 `str2[j-1]` 为结尾的公共子串的长度再加一。
3. 当然，如果 `str1[i-1]` 和 `str2[j-1]` 不相等，那这个最长公共子串其实就一个字符，也就是 `str1[i]` 和 `str2[j]` 的那个字符。
4. 因此我们从两个字符串的开始出依次比较每对字符，记录以当前字符对为结尾的公共子串长度，就能找到最长公共子串
    ```cpp
    #define M 4
    #define N 4
    const char* str1 = "hish";
    const char* str2 = "fish";


    int table[M][N] = {0};


    void LCStr (int* maxLen, int* maxEnd) {
        *maxLen = 0; // 记录当前最长的公共子串
        *maxEnd = -1; // 记录当前最长的公共子串在 str1 中的结束位置

        for (int i=0; i<=M; i++) {
            for (int j=0; j<=N; j++) {
                // 考察以 `str1[i]` 和 `str2[j]` 为结尾的公共子串的长度
                if (str1[i] == str2[j]) {
                    // 如果两个字符相同，它该字符在公共子串中的序号就是前一个字符的序号加一
                    if (i == 0 || j == 0) {
                        table[i][j] = 1;    
                    }
                    else {
                        table[i][j] = table[i-1][j-1] + 1;
                    }
                }
                else {
                    // 如果两个字符不相同，那当前位置就不处于公共子串中
                    table[i][j] = 0;
                }
                
                if (table[i][j] > *maxLen) {
                    *maxLen = table[i][j];
                    *maxEnd = i;
                }
            }   
        }
    }

    void print_table () {
        for (int i=0; i<M; i++) {
            for (int j=0; j<N; j++) {
                printf("%-2d", table[i][j]);
            }
            printf("\n");
        }
    }

    void print_LCStr (int maxLen, int maxEnd) {
        for (int i=maxEnd-maxLen+1; i<=maxEnd; i++) {
            printf("%c", str1[i]);
        }
        printf("\n");
    }


    int main (void) {

        int maxLen;
        int maxEnd;
        LCStr(&maxLen, &maxEnd);

        print_table();
        // 0 0 0 1 
        // 0 1 0 0 
        // 0 0 2 0 
        // 0 0 0 3 

        print_LCStr(maxLen, maxEnd); // ish


        return 0;
    }
    ```
5. JS 实现
    ```js

    let str1 = "habcwxopqrt";
    let str2 = "fabcgtopqrz";
    // let str1 = "hish";
    // let str2 = "fish";
    // let str2 = "vista";

    let table = Array.from(Array(str1.length), ()=>Array(str2.length));

    function LCStr (str1, str2) {
        let len1 = str1.length;
        let len2 = str2.length;
        if (len1 < 1 || len2 < 1) {
            return "";
        }

        let maxLen = 0;
        let maxEnd = -1;
        
        for (let i=0; i<len1; i++) { 
            for (let j=0; j<len2; j++) {
                if (str1[i] === str2[j]) {
                    if (i === 0 || j === 0) {
                        table[i][j] = 1;
                    }
                    else {
                            table[i][j] = table[i-1][j-1] + 1;
                        }
                }
                else {
                    table[i][j] = 0;
                }
                if (table[i][j] > maxLen) {
                    maxLen = table[i][j];
                    maxEnd = i;
                }
            }
        }

        let LCStr = "";
        for (let i=maxEnd-maxLen+1; i<=maxEnd; i++) {
            LCStr += str1[i];
        }
        return LCStr;
    }

    console.log( LCStr(str1, str2) );
    console.log( table );
    ```


## Referecens
* [图解算法](https://book.douban.com/subject/26979890/)
* [算法导论](https://book.douban.com/subject/20432061/)