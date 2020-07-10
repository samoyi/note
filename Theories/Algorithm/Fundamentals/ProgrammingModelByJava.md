# Programming Model

我们把描述和实现算法所用到的语言特性、软件库和操作系统特性总称为 **基础编程模型**。


<!-- TOC -->

- [Programming Model](#programming-model)
    - [思想](#思想)
    - [Misc](#misc)
    - [一些算法实现](#一些算法实现)
        - [判断质数](#判断质数)
        - [矩阵库](#矩阵库)
            - [点积](#点积)
            - [转置](#转置)
    - [一些习题](#一些习题)
        - [1.1.14](#1114)
        - [1.1.36　乱序检查](#1136　乱序检查)
        - [1.1.37　糟糕的打乱](#1137　糟糕的打乱)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 思想


## Misc
* 只要能够指定值域和在此值域上的操作，就能定义一个数据类型。


## 一些算法实现
### 判断质数
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

### 矩阵库
#### 点积
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

#### 转置
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
    

## 一些习题
### 1.1.14
1. 编写一个静态方法 `lg()`，接受一个整型参数 `N`，返回不大于 $\log_2N$ 的最大整数。不要使用 Math 库。
2. 一开始没仔细看要干什么，想用刚看到的 Newton-Raphson method，不过发现指数函数的导数是个对数，还是要用 `Math` 库；而且在初始值的时候也遇到了问题，定为 `N` 的话，$2^N$ 很容易就超出极限变成 `Infinity` 了；而且最后发现连 `1e-15` 的精确度都达不到。
3. 其实用穷举法就可以解决这个问题，而且，正因为 $2^N$ 增长的会很快，所以也要不了多少步。
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

### 1.1.36　乱序检查
1. 编写一个程序 `ShuffleTest`，接受命令行参数 $M$ 和 $N$，将大小为 $M$ 的数组打乱 $N$ 次且在每次打乱之前都将数组重新初始化为 `a[i] = i`。
2. 打印一个 $M\times M$ 的表格，对于所有的列 `j`，行 `i` 表示的是 `i` 在打乱后落到 `j` 的位置的次数。数组中的所有元素的值都应该接近于 $N/M$。
    ```js
    function swap(arr, index1, index2){
        let aux = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = aux;
    }

    function shuffle(arr) {
        let len = arr.length;
        for (let i=0; i<len; i++) {
            let j = Math.floor(Math.random() * (len - i) + i);
            swap(arr, i, j);
        }
        return arr;
    }

    function ShuffleTest (arrLen, times) {
        let arr;
        let result = Array.from({length: arrLen}, ()=>Array.from({length: arrLen}, ()=>0))

        while (times--) {
            arr = Array.from({length: arrLen}, (val, index) => index);

            shuffle(arr);
            
            arr.forEach((n, i) => {
                result[n][i]++;
            });
        }

        console.log(result);
    }


    ShuffleTest(10, 100000)

    // 0: (10) [9946, 9994, 9795, 9941, 9992, 10054, 9976, 10049, 10110, 10143]
    // 1: (10) [9989, 9932, 9926, 9994, 10059, 10042, 10031, 10056, 10053, 9918]
    // 2: (10) [9825, 10140, 10061, 9967, 9938, 10057, 10113, 9808, 10030, 10061]
    // 3: (10) [10010, 9903, 9955, 10187, 9979, 9935, 9992, 10017, 9953, 10069]
    // 4: (10) [10112, 10145, 9974, 9962, 9972, 9915, 9979, 9974, 10066, 9901]
    // 5: (10) [9851, 9981, 10116, 9887, 9990, 9956, 9918, 9982, 10191, 10128]
    // 6: (10) [10097, 9985, 10008, 10089, 10113, 10115, 9939, 9955, 9715, 9984]
    // 7: (10) [10088, 10152, 9965, 9954, 10066, 10068, 9873, 10051, 9871, 9912]
    // 8: (10) [10075, 9930, 10085, 9894, 9978, 9991, 10140, 9934, 10074, 9899]
    // 9: (10) [10007, 9838, 10115, 10125, 9913, 9867, 10039, 10174, 9937, 9985]
    ```

### 1.1.37　糟糕的打乱
1. 假设在我们的乱序代码中你选择的是一个 $0$ 到 $N-1$ 而非 $i$ 到 $N-1$ 之间的随机整数。证明得到的结果并非均匀地分布在 $N!$ 种可能性之间。
2. 改一下 `shuffle` 函数，先看看输出
    ```js
    function shuffle(arr) {
        let len = arr.length;
        for (let i=0; i<len; i++) {
            let j = Math.floor(Math.random() * len);
            swap(arr, i, j);
        }
        return arr;
    }

    // 0: (10) [9956, 10127, 10161, 10001, 10024, 10049, 9822, 9838, 10021, 10001]
    // 1: (10) [13002, 9394, 9520, 9444, 9609, 9712, 9616, 9818, 9823, 10062]
    // 2: (10) [12066, 12487, 8945, 9019, 9154, 9423, 9509, 9642, 9719, 10036]
    // 3: (10) [11204, 11619, 12051, 8729, 8832, 9031, 9271, 9610, 9768, 9885]
    // 4: (10) [10391, 10848, 11219, 11921, 8693, 8701, 9208, 9323, 9753, 9943]
    // 5: (10) [9629, 10232, 10591, 11412, 11846, 8487, 8859, 9285, 9553, 10106]
    // 6: (10) [9232, 9657, 9967, 10511, 11184, 11989, 8802, 9071, 9368, 10219]
    // 7: (10) [8687, 9052, 9649, 10175, 10718, 11280, 12035, 8992, 9573, 9839]
    // 8: (10) [8029, 8484, 9205, 9545, 10311, 10839, 11741, 12422, 9444, 9980]
    // 9: (10) [7804, 8100, 8692, 9243, 9629, 10489, 11137, 11999, 12978, 9929]
    ```
3. 具体怎么证明暂时不知道，但可以先大概想一下。
4. 比如说现在 10 个数按照顺序排列，那我们想打乱它们，就先随机选一个数，放到新的队列里，然后从剩下的 9 个数里面再随机选一个，也放到新的队列里。
5. 你每次随机选的时候，都只能从剩下的里面选，不能从新的队列里面选。
6. 在这个算法里，新的队列就相当于当前 index 左边的，所以每次选只能在当前位置及右边的选，不能从整个数组里面选。
7. 可以按照两个队列的思路来实现 `shuffle` 算法
    ```js
    function shuffle(arr) {
        let newArr = [];

        while (arr.length) {
            let i = Math.floor(Math.random() * arr.length);
            let selected = arr.splice(i, 1)[0];
            newArr.push(selected);
        }

        return newArr;
    }
    ```


## TODO 
* 练习 1.1.27
* 矩阵库补完
* 练习 1.1.35
* Fisher-Yates-shuffle 的证明


## References
* [算法（第4版）](https://book.douban.com/subject/19952400/)