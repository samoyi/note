# Strassen Matrix Multiplication


<!-- TOC -->

- [Strassen Matrix Multiplication](#strassen-matrix-multiplication)
    - [本质](#本质)
    - [设计思想](#设计思想)
    - [根据定义计算](#根据定义计算)
    - [简单的分治算法](#简单的分治算法)
        - [思路](#思路)
        - [递归式](#递归式)
    - [Strassen 算法](#strassen-算法)
        - [递归式](#递归式-1)
    - [References](#references)

<!-- /TOC -->


## 本质


## 设计思想


## 根据定义计算
1. 实现
    ```js
    function square_matrix_multiply(A, B) {
        let n = A.length;

        let C = initC(n);
        // 外层的两个循环确定要计算 C 的哪一项
        // 根据 i 和 j，每次取出 A 里面的第 i 行和 B 里面的第 j 列进行计算
        for (let i=0; i<n; i++) {
            for (let j=0; j<n; j++) {
                // 因为计算 C 的某一项需要累加，所以还需要一层循环
                for (let k=0; k<n; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        return C;
    }
    function initC(n) {
        let C = [];
        for (let i=0; i<n; i++) {
            C[i] = [];
            for (let j=0; j<n; j++) {
                C[i][j] = 0;
            }
        }
        return C;
    }

    let A = [
        [1, 3],
        [7, 5],
    ];
    let B = [
        [6, 8],
        [4, 2],
    ];
    console.log(square_matrix_multiply(A, B));
    // [
    //     [18, 14]
    //     [62, 66]
    // ]
    ```
2. 可以看出来复杂度是 $O(n^3)$。


## 简单的分治算法
### 思路
TODO

### 递归式
直接看《算法导论》44 页


## Strassen 算法
TODO

### 递归式



## References
* [算法导论](https://book.douban.com/subject/20432061/)