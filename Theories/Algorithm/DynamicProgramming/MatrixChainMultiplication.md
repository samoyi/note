# Matrix Chain Multiplication


<!-- TOC -->

- [Matrix Chain Multiplication](#matrix-chain-multiplication)
    - [设计思想](#设计思想)
        - [自顶向下的复杂度分析](#自顶向下的复杂度分析)
    - [完全括号化的（fully parenthesized）矩阵乘积链及成本](#完全括号化的fully-parenthesized矩阵乘积链及成本)
        - [矩阵乘法实现及成本](#矩阵乘法实现及成本)
        - [矩阵链乘法问题](#矩阵链乘法问题)
    - [描述最优解的结构](#描述最优解的结构)
    - [递归求解方案](#递归求解方案)
        - [时间复杂度](#时间复杂度)
    - [自底向上计算最优代价](#自底向上计算最优代价)
        - [子问题图](#子问题图)
        - [下面列出子矩阵链长度为 2 和 3 时的计算过程](#下面列出子矩阵链长度为-2-和-3-时的计算过程)
            - [长度为 2，只计算 $p*q*r$](#长度为-2只计算-pqr)
            - [长度为 3](#长度为-3)
                - [$m[1, 3]$](#m1-3)
                - [$m[2, 4]$](#m2-4)
                - [$m[3, 5]$](#m3-5)
                - [$m[4, 6]$](#m4-6)
        - [复杂度](#复杂度)
        - [实际计算矩阵链乘积](#实际计算矩阵链乘积)
    - [Referecens](#referecens)

<!-- /TOC -->


## 设计思想
### 自顶向下的复杂度分析


## 完全括号化的（fully parenthesized）矩阵乘积链及成本
1. A product of matrices is **fully parenthesized** if it is either a single matrix or the product of two fully parenthesized matrix products, surrounded by parentheses.
2. 注意这个定义就是递归的。初始状态的单个矩阵是完全括号化的；然后两个单个矩阵加上括号相乘也是完全括号化的；相乘的结果再加上括号乘以单个矩阵或者乘以其他相乘的结果，还是完全括号化的。
3. 矩阵相乘是满足结合律的，所以一个矩阵序列不管按照什么先后顺序相乘（不同的括号化方案），结果都一样。
4. 但是，按照不同的先后顺序相乘的成本可能是不同的（两个矩阵相乘的成本在下面的矩阵乘法实现中）。例如三个矩阵的规模为 $10*100$、$100*5$ 和 $5*50$。如果先计算前两个，则最终成本是 7500；而如果先计算前两个，则最终成本是 75000。

### 矩阵乘法实现及成本
1. 实现
    ```cpp
    #include <stdio.h>

    #define p 2
    #define q 3
    #define r 4

    int A[p][q] = {
        {1, 2, 3},
        {1, 2, 3},
    };

    int B[q][r] = {
        {4, 5, 6, 7},
        {4, 5, 6, 7},
        {4, 5, 6, 7}
    };

    void matrix_multiply(int A[p][q], int B[q][r], int C[p][r]) {
        for (int i=0; i<p; i++) { // 先选出 A 的一行（遍历 A 的行）
            for (int j=0; j<r; j++) { // 再选出 B 的一列（遍历 B 的列）
                for (int k=0; k<q; k++) { // 再遍历 B 的这一列，同时也是遍历 A 的这一行，进行运算
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
    }

    int main(void) {
        int C[p][r] = {0};
        matrix_multiply(A, B, C);

        for (int i=0; i<p; i++) {
            for (int j=0; j<r; j++) {
                printf("%-2d ", C[i][j]);
            }
            printf("\n");
        }
        // 24 30 36 42 
        // 24 30 36 42

        return 0;
    }
    ```
2. 因为有三层循环，所以两个矩阵相乘的成本是 $p*q*r$。

### 矩阵链乘法问题
1. 看书，《算法导论》211 页。
2. 解决这个问题并不是为了优化矩阵链乘法，因为解决这个问题本身花费的时间要比它带来的优化时间还多。


## 描述最优解的结构
1. 动态规划方法的第一步是寻找最优子结构，然后就可以利用这种子结构从子问题的最优解构造出原问题的最优解。
2. 在钢条切割和硬币找零问题时，我们设想的最优解结构的两部分是一块钢条（一枚硬币）和剩下部分的最优解；但是在这里，最优解的结构不一定就是一个矩阵和剩下的矩阵的最优解，也可能是若干个矩阵的最优解和剩下的若干个矩阵的最优解。
3. 实际上，钢条切割问题的最优子结构的标准描述中，其实就是把原问题拆分为两个子问题，所以自顶向下的方法中是要递归调用两次。只不过经过简化后，可以让第一个子问题直接取表里的确定值。但本质上仍然是对原问题一分为二，甚至一分为多。
4. 在矩阵链问题中，很难说最优解最后一步就是最左侧的单个矩阵乘以余下的所有所有矩阵的乘积，很可能是左右两个子矩阵链乘积的乘积。所以原问题必须要分割为两个需要继续求解的子问题。
5. 看《算法导论》212 页的数学描述。


## 递归求解方案
1. 所以，最优解的矩阵相乘成本包括三部分：
    * 前半部分若干个矩阵的最优计算成本
    * 后半部分若干个矩阵的最优计算成本
    * 前后两个乘积矩阵相乘的计算成本
2. 再考虑平凡和非平凡的情况：如果矩阵链就只有一个矩阵，那没有成本；如果有超过一个矩阵，那就要按照上面三部分的结构来计算。
3. 看《算法导论》212 页的数学描述。
4. 直接的递归实现
    ```cpp
    #define CHAIN_SIZE 6


    int chain[CHAIN_SIZE][2] = {
        {30, 35},
        {35, 15},
        {15, 5 },
        {5,  10},
        {10, 20},
        {20, 25},
    };

    int matrix_chain_multiply (int start, int end) {
        if (start == end) {
            return 0;
        }
        else {
            int min = INT_MAX;
            for (int i=start+1; i<=end; i++) {
                int m = matrix_chain_multiply(start, i-1);
                int n = matrix_chain_multiply(i, end);
                int c = chain[start][0] * chain[i][0] * chain[end][1];
                if (m + n + c < min) {
                    min = m + n + c;
                }
            }
            return min;
        }
    }


    int main (void) {

        printf("%d\n", matrix_chain_multiply(0, CHAIN_SIZE-1)); // 15125

        return 0;
    }
    ```
5. 现在可以求出最优解的值了，但怎么求最优解呢？也就是说怎么确定最优的括括号方案呢？
6. 上面的算法中会记录每次的切割位置。最后一个切割位置是讲整个链划分为两个子链的位置，倒数第二第三个是讲这两个子链进一步划分为子子链的位置。但实际情况中并不能保证按照 1、2、4、8 这样的结构，因为可能某一级的子链只是一个单矩阵，因此不会记录位置。
7. 不过，每次的划分都唯一对应一个子链，也就是对应唯一的一组 `start` 和 `end`，因此可以用这两个值为坐标的二维数组记录对应的划分位置
    ```cpp
    #define CHAIN_SIZE 6


    int chain[CHAIN_SIZE][2] = {
        {30, 35},
        {35, 15},
        {15, 5 },
        {5,  10},
        {10, 20},
        {20, 25},
    };

    int resolutions[CHAIN_SIZE][CHAIN_SIZE]; // 所有可能的子链排列（包括完整的链）

    int matrix_chain_multiply (int start, int end) {
        if (start == end) {
            return 0;
        }
        else {
            int min = INT_MAX;
            int min_i; // 用来记录当前子链最优划分方案时的划分位置
            for (int i=start+1; i<=end; i++) {
                int m = matrix_chain_multiply(start, i-1);
                int n = matrix_chain_multiply(i, end);
                int c = chain[start][0] * chain[i][0] * chain[end][1];
                if (m + n + c < min) {
                    min = m + n + c;
                    min_i = i;
                }
            }
            resolutions[start][end] = min_i;
            return min;
        }
    }


    int main (void) {

        printf("%d\n", matrix_chain_multiply(0, CHAIN_SIZE-1)); // 15125

        for (int i=0; i<CHAIN_SIZE; i++) {
            for (int j=0; j<CHAIN_SIZE; j++) {
                printf("%d ", resolutions[i][j]);
            }
            printf("\n");
        }
        // 0 1 1 3 3 3
        // 0 0 2 3 3 3
        // 0 0 0 3 3 3
        // 0 0 0 0 4 5
        // 0 0 0 0 0 5
        // 0 0 0 0 0 0


        return 0;
    }
    ```
8. 有了表 `resolutions`，就可以确定最优解的划分方案。可以递归的计算每次划分的位置
    ```cpp
    void resolution (int start, int end) {
        if (end > start + 1) { // 子链只剩一个或两个矩阵就不用括号了
            int k = resolutions[start][end];
            printf("%d ", k);
            resolution(start, k-1);
            resolution(k, end);
        }
    }
    ```
    使用上面的矩阵链计算输出的划分位置为 3 1 5，也就是 `( 0 ( 1 2 ) ) ( ( 3 4 ) 5 )`。
9. 还希望直接打印出带序号和括号的结果，稍微麻烦一些。每一组子链（`start` 和 `end`）对应一组括号，但是如果子链只有一个矩阵就不需要括号了。最初是这样实现
    ```cpp
    void print_resolution (int start, int end) {
        if (start != end) {
            printf("( ");
            printf("%d", start);
            int k = resolutions[start][end];
            print_resolution(start, k-1);
            print_resolution(k, end);
            printf("%d", end);
            printf(") ");
        }
    }
    ```
    但打印出来有问题，因为看预期的效果中，并不是任何一组子链都要打印数字的，而是只有在子链长度为一个或两个时。因此改为
    ```cpp
    void print_resolution (int start, int end) {
        if (start == end) { // 子链长度为两个时会进一步递归为只有一个然后打印数字
            printf("%d ", start);
        }
        else {
            printf("( ");
            int k = resolutions[start][end];
            print_resolution(start, k-1);
            print_resolution(k, end);
            printf(") ");
        }
    }
    ```
    JS 实现
    ```js
    let str = "";
    function printOptimalSolution (i, j) {
        if (i < j) {
            str += " ( ";
            let pos = splitPoints[i][j];
            printOptimalSolution(i, pos);
            printOptimalSolution(pos+1, j);
            str += " ) ";
        }
        else {
            str += ` A${i} `;
        }
    }

    printOptimalSolution(1, 6);
    console.log(str); //  (  (  A1  (  A2  A3  )  )  (  (  A4  A5  )  A6  )  )
    ```
10. 如《算法导论》211 页所分析的，这种递归的算法复杂度是指数级的，因为会有很多重叠子问题（应该使用动态规划的标志之一）。因此可以加上缓存来减少递归的次数
    ```cpp
    // 省略其他代码
    int cache[CHAIN_SIZE][CHAIN_SIZE] = {0};

    int matrix_chain_multiply (int start, int end) {
        if (start == end) {
            return 0;
        }
        else if (cache[start][end]) {
            return cache[start][end];
        }
        else {
            int min = INT_MAX;
            int min_i;
            for (int i=start+1; i<=end; i++) {
                int m = matrix_chain_multiply(start, i-1);
                int n = matrix_chain_multiply(i, end);
                int c = chain[start][0] * chain[i][0] * chain[end][1];
                if (m + n + c < min) {
                    min = m + n + c;
                    min_i = i;
                }
            }
            resolutions[start][end] = min_i;
            cache[start][end] = min;
            return min;
        }
    }
    ```
11. JS 实现
    ```js
    function memoized_matrix_chain (chain, i, j) {
        if (i === j) {
            return 0;
        }
        else if (costs[i][j]) {
            return costs[i][j];
        }

        let min = Number.POSITIVE_INFINITY;
        let cost = 0;
        for (let k=i; k<=j-1; k++) {
            cost = memoized_matrix_chain(chain, i, k)
                    + memoized_matrix_chain(chain, k+1, j)
                    + subchainMultiplyCost(chain, i, k, j);
            if (cost < min) {
                min = cost;
            }
        }
        return costs[i][j] = min;
    }


    const chain = [
        {r: 30, c: 35},
        {r: 35, c: 15},
        {r: 15, c: 5 },
        {r: 5,  c: 10},
        {r: 10, c: 20},
        {r: 20, c: 25},
    ];

    initTables(chain.length, costs, splitPoints);
    let _chain = chain.slice(0);
    _chain.unshift({});
    console.log(memoized_matrix_chain(_chain, 1, 6)); // 15125
    ```

### 时间复杂度
1. `memoized_matrix_chain` 的调用分为两种：一种是没有命中缓存然后发生后面的递归调用，一种是命中缓存直接返回。
2. 第一种没有命中缓存的次数是 $Θ(n^2)$，因为每个表项对应一次。
3. 第二种命中缓存的调用，都是第一种所产生的递归，因为要递归已有的结果来获得未知的结果。
4. 第一种每次调用时，循环会从 `i` 到 `j-1`，$O(n)$ 次，所以产生的递归调用也是 $O(n)$ 次。也就是说，每次第一种的 `memoized_matrix_chain` 调用都会发生 $O(n)$ 的第二种 `memoized_matrix_chain` 调用。因此第二种的调用次数是 $O(n^3)$。
5. 综合起来，时间复杂度是 $O(n^3)$ 级别。

    
## 自底向上计算最优代价
1. 怎么自底向上？为了计算一个矩阵链的代价，我们可能需要它内部所有组合的代价。
2. 刚开始的时候写出了这样的循环
    ```cpp
    for (int i=0; i<CHAIN_SIZE-1; i++) {
        for (int j=i+1; j<CHAIN_SIZE; j++) {
            int min = INT_MAX;
            int min_i;
            for (int k=i+1; k<=j; k++) {
                int m = cache[i][k-1];
                int n = cache[k][j];
                int c = chain[i][0] * chain[k][0] * chain[j][1];
                if (m + n + c < min) {
                    min = m + n + c;
                    min_i = k;
                }
            }
            resolutions[i][j] = min_i;
            cache[i][j] = min;
        }   
    }
    ```
3. 前两个 `for` 确实可以保证遍历所有可能的子链，但问题是，动态规划要求遇到一个子问题时，它需要的子子问题已经解决过了，而这里显然不满足这个要求。
4. 这种遍历只是遍历所有可能的组合，但并不是动态规划要求自底向上的遍历。
5. 按照自底向上的遍历原则，我们应该先解决最小的子问题，然后逐步解决更大的子问题，直到解决原问题。
6. 因此，我们自底向上的：
    1. 先计算所有两个矩阵相乘的代价；
    2. 再计算所有三个矩阵相乘的代价；
    3. 再计算所有四个矩阵相乘的代价；
    4. ……
    5. 再计算所有 $n-1$ 个矩阵相乘的代价；
    6. 最后得出 $n$ 个矩阵相乘的代价。
7. 上面除了第一步计算两个矩阵相乘的代价以外，每一步的计算都会用到之前计算的结果。所以要把每次计算的结果存入表中。
8. 因为矩阵链的顺序是固定的，所以在计算几个矩阵相乘时候，它们肯定是连在一起的。例如两个矩阵相乘肯定只有 $n-1$ 中可能。如果我们不固定矩阵的顺序，也考虑进去顺序的变化，也就是说矩阵位置可以任意调整，那两个矩阵相乘就有更多的可能性了。
9. 根据第 6 步的描述：我们要循环 $2...n$ 的子链长度，然后在每轮循环里面通过不同的分隔位置遍历当前所有可能的组合，计算每种组合的代价，并保存最优代价。
10. 看《算法导论》213 页的数学描述。
11. 实现如下
    ```cpp
    int bottom_up_matrix_chain_multiply (int start, int end) {
        if (start == end) {
            return 0;
        }
        else if (cache[start][end]) {
            return cache[start][end];
        }
        else { 
            int chainLen = end-start+1;
            // 单个矩阵的代价是 0，所以从两个矩阵的矩阵链开始计算
            for (int subChainLen=2; subChainLen<=chainLen; subChainLen++) {
                for (int i=0; i<=end-subChainLen+1; i++) {
                    int min = INT_MAX;
                    int min_i;
                    for (int k=i+1; k<=i+subChainLen-1; k++) {
                        int m = cache[i][k-1];
                        int n = cache[k][i+subChainLen-1];
                        int c = chain[i][0] * chain[k][0] * chain[i+subChainLen-1][1];
                        if (m + n + c < min) {
                            min = m + n + c;
                            min_i = k;
                        }
                    }
                    resolutions[i][i+subChainLen-1] = min_i;
                    cache[i][i+subChainLen-1] = min;
                }
            }
            return cache[start][end];
        }
    }
    ```
12. JS 实现
    ```js
    const costs = [];
    const splitPoints = [];


    function matrix_chain_order (chain) {
        let len = chain.length;

        if (len === 1) {
            return 0;
        }

        // 从 1 开始计数，计算比较好理解，最后输出的表格也好理解
        let _chain = chain.slice(0);
        _chain.unshift({});

        for (let count = 2; count <= len; count++) { // 遍历每种子链长度
            for (let i = 1; i <= len-count+1; i++) { // 遍历当前子链中所有的矩阵组合
                let j = i + count - 1;
                let min = Number.POSITIVE_INFINITY;
                let kPos = 0;
                for (let k = i; k <= j-1; k++ ) { // 遍历所有分隔符的位置来计算代价
                    let c = costs[i][k] + costs[k+1][j] + subchainMultiplyCost(_chain, i, k, j);
                    if (c < min) {
                        min = c;
                        kPos = k;
                    }
                }
                costs[i][j] = min;
                splitPoints[i][j] = kPos;
            }
        }
        return costs[1][len];
    }


    // 初始化两个表格
    // 两个表格的逻辑有些不同，所以各自使用了独立的循环来初始化更好理解
    function initTables(chainLen, cTable, spTable) {
        // 初始化最优成本表格
        // i 等于 chainLen 时就是最末尾的单个矩阵的成本，其实成本就是 0
        for (let i=1; i<=chainLen; i++) {
            cTable[i] = [];
            for (let j=1; j<=chainLen; j++) {
                // i 小于 j 时是矩阵链相乘的成本；
                // i 等于 j 时是单个矩阵的成本，虽然是 0，但仍然是有意义的；
                // i 大于 j 就没有意义了。
                if (i <= j) {
                    cTable[i][j] = 0;
                }
            }
        }
        // 初始化最优分割点表格
        // i 如果等于 chainLen 时就是最末尾的单个矩阵，单个矩阵不存在分割点
        for (let i=1; i<chainLen; i++) {
            spTable[i] = [];
            for (let j=1; j<=chainLen; j++) {
                // 单个矩阵不存在分割点，所以没有 i 等于 j 的情况
                if (i < j) {
                    spTable[i][j] = 0;
                }
            }
        }
    }
    // 两个子矩阵链的结果再相乘的成本
    function subchainMultiplyCost(chain, i, k, j) {
        return chain[i].r * chain[k].c * chain[j].c;
    }


    const chain = [
        {r: 30, c: 35},
        {r: 35, c: 15},
        {r: 15, c: 5 },
        {r: 5,  c: 10},
        {r: 10, c: 20},
        {r: 20, c: 25},
    ];

    initTables(chain.length, costs, splitPoints);
    matrix_chain_order(chain);
    ```
13. 下图展示了对于上面示例的矩阵链，每个子矩阵链的相乘最优代价和对应的分割位置
    <img src="images/03.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 子问题图
1. n 个矩阵的链为例，子问题包括 n 类：
    * 所有单个矩阵的最优成本，共 n 个；
    * 所有二连矩阵的最优成本，共 n-1 个；
    * 所有三连矩阵的最优成本，共 n-2 个；
    * 所有四连矩阵的最优成本，共 n-3 个；
    * ……
    * 所有 n-1 连矩阵的最优成本，共 2 个；
    * 所有 n 连矩阵的最优成本，共 1 个。
2. 所有子问题图的节点一共有 $\frac{(n+1)n}{2}$。
3. 边的数量  TODO

### 下面列出子矩阵链长度为 2 和 3 时的计算过程
#### 长度为 2，只计算 $p*q*r$
1. $A_1 * A_2$: 30 * 35 * 15 = 15750
2. $A_2 * A_3$: 35 * 15 * 5  = 2625
3. $A_3 * A_4$: 15 * 5  * 10 = 750 
4. $A_4 * A_5$: 5  * 10 * 20 = 1000
5. $A_5 * A_6$: 10 * 20 * 25 = 5000

#### 长度为 3
##### $m[1, 3]$
* $A_1 * (A_2 * A_3): 2625 + 30 * 35 * 5  = 7875$    (最优解)
* $(A_1 * A_2) * A_3: 15750 + 30 * 15 * 5 = 18000$ 

##### $m[2, 4]$
* $A_2 * (A_3 * A_4): 750 + 35 * 15 * 10 = 6000$
* $(A_2 * A_3) * A_4: 2625 + 35 * 5 * 10 = 4375$     (最优解)

##### $m[3, 5]$
* $A_3 * (A_4 * A_5): 1000 + 15 * 5 * 20 = 2500$     (最优解)
* $(A_3 * A_4) * A_5: 750 + 15 * 10 * 20 = 3750$

##### $m[4, 6]$
* $A_4 * (A_5 * A_6): 5000 + 5 * 10 * 25 = 6250$
* $(A_4 * A_5) * A_6: 1000 + 5 * 20 * 25 = 3500$     (最优解)


### 复杂度
* 时间复杂度为 $O(n^3)$
* 存储表的空间复杂度为 $Θ(n^2)$

### 实际计算矩阵链乘积
《算法导论》练习 15.2-2。实现如下，两个矩阵相乘的方法 `matrix_multiply` 没有实现
```js
function matrix_chain_multiply (chain, splitPoints, i, j) {
    if (i < j) { // i 等于 j 的时候就是分割到只剩一个矩阵了
        let pos = splitPoints[i][j];
        let a1 = optimalSolution(i, pos);
        let a2 = optimalSolution(pos+1, j);
        return matrix_multiply(a1, a2);
    }
    return chain[i];
}
```


## Referecens
* [算法导论](https://book.douban.com/subject/20432061/)