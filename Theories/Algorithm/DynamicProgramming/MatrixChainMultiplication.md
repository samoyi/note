# Matrix Chain Multiplication


<!-- TOC -->

- [Matrix Chain Multiplication](#matrix-chain-multiplication)
    - [完全括号化的（fully parenthesized）矩阵乘积链](#完全括号化的fully-parenthesized矩阵乘积链)
        - [矩阵链乘法问题](#矩阵链乘法问题)
    - [描述最优解的结构](#描述最优解的结构)
    - [递归求解方案](#递归求解方案)
    - [Referecens](#referecens)

<!-- /TOC -->


## 完全括号化的（fully parenthesized）矩阵乘积链
1. A product of matrices is fully parenthesized if it is either a single matrix or the product of two fully parenthesized matrix products, surrounded by parentheses.
2. 注意这个定义就是递归的。初始状态的单个矩阵是完全括号化的；然后两个单个矩阵加上括号相乘也是完全括号化的；相乘的结果再加上括号乘以单个矩阵或者乘以其他相乘的结果，还是完全括号化的。
3. 矩阵相乘是满足交换律的，所以一个矩阵序列不管按照什么顺序相乘结果都一样。但是，按照不同的顺序相乘的成本可能是不同的。
4. 矩阵相乘算法如下
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
        for (int i=0; i<p; i++) {
            for (int j=0; j<r; j++) {
                for (int k=0; k<q; k++) {
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
    }
    ```
5. 因为有三层循环，所以两个矩阵相乘的成本是 $p*q*r$。

### 矩阵链乘法问题
1. 看书，《算法导论》211 页。
2. 解决这个问题并不是为了优化矩阵链乘法，因为解决这个问题本身花费的时间要比它带来的优化时间还多。


## 描述最优解的结构
1. 动态规划方法的第一步是寻找最优子结构，然后就可以利用这种子结构从子问题的最优解构造出原问题的最优解。
2. 在钢条切割和硬币找零问题时，我们设想的最优解结构的两部分是一块钢条（一枚硬币）和剩下部分的最优解；但是在这里，最优解的结构不一定就是一个矩阵和剩下的矩阵的最优解，也可能是若干个矩阵的最优解和剩下的若干个矩阵的最优解。也就是说最优解不是一对多，而是多对多。
3. 看《算法导论》212 页的数学描述。


## 递归求解方案
1. 所以，最优解的矩阵相乘成本包括三部分：
    * 前半部分若干个矩阵的最优计算成本
    * 后半部分若干个矩阵的最优计算成本
    * 前后两个乘积矩阵相乘的计算成本
2. 再考虑平凡和非平凡的情况：如果矩阵链就只有一个矩阵，那没有成本；如果有超过一个矩阵，那就要按照上面三部分的结构来计算。
3. 看《算法导论》212 页的数学描述。





## Referecens
* [算法导论](https://book.douban.com/subject/20432061/)