# Programming Model

我们把描述和实现算法所用到的语言特性、软件库和操作系统特性总称为 **基础编程模型**。


<!-- TOC -->

- [Programming Model](#programming-model)
    - [0. 思想](#0-思想)
    - [1. Misc](#1-misc)
    - [References](#references)

<!-- /TOC -->


## 0. 思想

## 1. Misc
* 只要能够指定值域和在此值域上的操作，就能定义一个数据类型。
* 矩阵点积的 JS 实现
    ```js
    function dot (a, b) {
        let row_a = a.length;
        let column_a = a[0].length;
        let column_b = b[0].length;

        // 结果是 row_a 行 column_b 列的二维数组（矩阵）
        let result = Array.from(
            {length: row_a}, 
            ()=>Array.from(
                {length: column_b}, 
                ()=>0
            )
        );

        for (let i=0; i<row_a; i++) { // 遍历矩阵 a 的行
            for (let j=0; j<column_b; j++) { // 遍历矩阵 b 的列
                for (let k=0; k<column_a; k++) { // 遍历矩阵 b 的某一列
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }

        return result;
    }
    ```
* 判断质数的 JS 实现
    ```js
    function isPrime (n) {
        if (n < 2) {
            return false;
        }
        // 本来是这样实现的，因为顺乎逻辑的就是平方根的思路
        // 不过因为调用了方法，所以速度会慢，而且 n 越大就会越慢吧？
        // for (let i=2; i<=Math.sqrt(n); i++) {
        for (let i=2; i*i<=n; i++) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }
    ```
* Newton-Raphson method 计算平方根
    1. [Newton-Raphson method 的推导](https://www.zhihu.com/question/20690553/answer/146104283)
    2. 设 $t^2 = c$。指定一个数 $c$，要求此时的 $t$。也就是要求函数 $f(t) = t^2 - c$ 在 $f(x)=0$ 时的解。
    3. 根据上面该方法的推导，可以知道需要迭代计算 $t = t - \frac{t^2 - c}{2t}$。
    4. 迭代停止的条件，应该是 t 的值足够接近实际的解，也就是说两者的误差足够小，即 $|t^2 - c| <  ε$。
    5. 实现如下
        ```js
        let c = 1048576

        let t = c; // 初始值不知道有没有优化方案，可以减少迭代次数。我实测根据不同情况会有一次的差别。

        // while (Math.abs(t* t - c) > Number.EPSILON) {
        while (Math.abs(t* t - c) > 1e-15) {
            t = t - (t*t - c)/ (2*t)
        }

        console.log(t); // 1024
        ```
    5. 本来误差用的是 `Number.EPSILON`，但是在尝试对 3 开方时，发现退不出循环，`Math.abs(t* t - c)` 最小值是二倍的 `Number.EPSILON`。也就是说，至少在 JS 中，这个方法对于某些情况不会把差距缩小到足够小，于是改成书上设定的值。
* 矩阵转置
    1. 普通的方法
        ```js
        function transpose (matrix) {
            let row = matrix.length;
            let column = matrix[0].length;

            let result = [];

            for (let c=0; c<column; c++) {
                result[c] = [];
                for (let r=0; r<row; r++) {
                    result[c][r] = matrix[r][c]; 
                }
            }

            return result;
        }
        ```
    2. 简洁一些的
        ```js
        function transpose (matrix) {
            return matrix[0].map((column, index) => {
                return matrix.map((row) => {
                    return row[index];
                });
            });
        }
        ```
* 编写一个静态方法 `lg()`，接受一个整型参数 `N`，返回不大于 $\log_2N$ 的最大整数。不要使用 Math 库。
    1. 一开始没仔细看要干什么，想用刚看到的 Newton-Raphson method，不过发现指数函数的导数是个对数，还是要用 `Math` 库；而且在初始值的时候也遇到了问题，定为 `N` 的话，$2^N$ 很容易就超出极限变成 `Infinity` 了；而且最后发现连 `1e-15` 的精确度都达不到。
    2. 其实用穷举法就可以解决这个问题，而且，正因为 $2^N$ 增长的会很快，所以也要不了多少步。
    ```js
    function foo (N) {
        //  对数自变量必须大于 0 且题目要求是整数
        if (!Number.isInteger(N) || N < 1) {
            return NaN;
        }

        let x = 0;
        while (Math.pow(2, x) <= N) {
            x++;
        }
        
        return x - 1;
    }

    console.log( foo(1025) ); // 10
    ```
    




## References
* [算法（第4版）]