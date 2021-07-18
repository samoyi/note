# Knapsack problem


<!-- TOC -->

- [Knapsack problem](#knapsack-problem)
    - [0-1 背包问题](#0-1-背包问题)
        - [最优子结构](#最优子结构)
        - [重叠子问题](#重叠子问题)
        - [递归式](#递归式)
        - [两种递归式本质区别](#两种递归式本质区别)
        - [实现](#实现)
    - [设计思想](#设计思想)
        - [一个问题是怎么想出用动态规划的——递归感的寻找](#一个问题是怎么想出用动态规划的递归感的寻找)
    - [本质](#本质)
    - [思路](#思路)
        - [1. 找到问题的变量](#1-找到问题的变量)
        - [2. 寻找初始状态](#2-寻找初始状态)
        - [3. 遍历从初始状态到求解状态的所有状态的最优解](#3-遍历从初始状态到求解状态的所有状态的最优解)
    - [0-1 背包](#0-1-背包)
        - [实现](#实现-1)
    - [0-1 背包问题的递归解法](#0-1-背包问题的递归解法)

<!-- /TOC -->


## 0-1 背包问题
### 最优子结构
1. 原问题的解决包含做出某种选择：要选择一件物品。每种选择都会产生一种子问题。
2. 所以原问题的最优解就包括一种选择和对应的子问题的最优解，具有最优子结构。

### 重叠子问题
1. 问题的递归算法是否会反复的求解相同的子问题？如果递归算法反复求解相同的子问题，我们就说最优化问题具有重叠子问题性质，也就可以自底向上并配合表的方法来解决。或者使用自顶向下带备忘的方法。
2. 0-1 背包问题问题中，在做出第一次选择后，产生的若干种子问题中，会有不少相同的子子问题，这就满足了重叠子问题的性质。

### 递归式
1. 如果剩余物品数量为 0 时，背包的收益为 0。
2. 如果还有若干件物品和若干容积时，解的形式为 $max(选出的某一件物品的价值 + 对剩余物品递归计算得到的价值)$。
3. 因为有容量的限制，所以问题或者子问题的解的容量占用超过了背包容量，那就要舍弃。
4. 上面的递归式看起来没有问题，但是求解的时候却遇到了问题，很难写出表示子问题的二维数组：
    * 第一种写法
        ```cpp
        #define N 3 // 物品数量
        #define V 4 // 背包容量
        // 序号从 1 开始
        int weights[N+1] = {0, 1, 4, 3}; // 物品重量
        int values[N+1] = {0, 1500, 3000, 2000}; // 物品价值
        int table[N+1][V+1];

        int knapsack_01 () {
            for (int i=1; i<=N; i++) {
                int maxVal = 0;
                int currVal = 0;
                for (int j=1; j<=V; j++) {
                    if (weights[i] > j) {
                        continue;
                    }
                    // 第一个下标要怎么写才能表示出了第 i 个物品以外的其他物品
                    currVal = values[i] + table[这个下标要怎么写][v-weights[i]];
                    if (currVal > maxVal) {
                        maxVal = currVal;
                    }
                }
            }
        }
        ```
    * 第二种写法
        ```cpp
        int knapsack_01 () {
            for (int i=1; i<=N; i++) {
                int maxVal = 0;
                int currVal = 0;
                for (int j=1; j<=V; j++) {
                    if (weights[i] > j) {
                        continue;
                    }
                    // table[i][v-weights[i]] 表示：在 V-weights[i] 容量，
                    // 且物品种类不包含第 i 个的情况下，所能装的最大价值
                    currVal = values[i] + table[i][v-weights[i]];
                    if (currVal > maxVal) {
                        maxVal = currVal;
                    }
                    // table[这个下标要怎么写][v] = maxVal;
                }
            }
        }
        ```
5. 在之前分析最优子结构的时候，都是先选定一个元素，然后再对剩下的元素递归求解。但在这里这个方法却遇到了问题。
6. 0-1 背包问题用到的递归式是，在还有若干件物品和若干容积时：$max(不装入当前物品的话的最大价值, 装入当前物品的话的最大价值)$。
7. 根据《算法图解》中例子的表格，乍一看这样的递归式是有问题的：在同一个容量下，它只能计算【吉他】、【吉他和音响】、【吉他、音响和笔记本电脑】的价值，但不能计算【音响和笔记本电脑】以及【吉他和笔记本电脑】的价值。
8. 但其实是可以的。比如装了笔记本电脑之后，剩余容量只能装一个音响，那就是【音响和笔记本电脑】；如果剩余的容量装不了音响只能装一个吉他，那就是【吉他和笔记本电脑】。《算法图解》中例子的表格就能找到这样的格子。
9. 还有一个错觉是，只能计算一个物品和它前面物品的组合，因为填充表格的每一行就是这样的这样的顺序。比如我可以计算先放一个笔记本电脑然后再看能不能放音响，但不会进行先放一个音响然后再放笔记本电脑的计算。
10. 如果是这样，那行的顺序似乎也就会影响结果的顺序了。假如《算法图解》的例子中：如果先放音响就只能放一个 3000 美元的音响，而如果先放 2000 美元的笔记本电脑，就还能再放一个 1500 美元的吉他。
11. 然而实际上这两种放法确实都能计算到。考虑这种担心：如果当前容量是 7 磅，那放了音响之后其实还能再放一个笔记本电脑，但是因为是能向前组合，所以在计算音响这一行时，只能放音响和吉他。
12. 不过，等到计算笔记本那一行时，先放了笔记本电脑之后就可以再放一个音响他，这样就计算了刚才漏掉的情况。

### 两种递归式本质区别

### 实现
```cpp
#include <stdio.h>

#define N 4 // 物品数量
#define V 4 // 背包容量 
int weights[N+1] = {0, 1, 4, 3, 1}; // 物品重量
int values[N+1] = {0, 1500, 3000, 2000, 2000}; // 物品价值
int table[N+1][V+1]; // 一行对应一个物品，一列对应一种容量

int knapsack_01 () {
    for (int i=1; i<=N; i++) {
        int currVal = 0;
        for (int j=1; j<=V; j++) {
            if (weights[i] > j) {
                if (i > 1) {
                    table[i][j] = table[i-1][j];
                }
            }
            else {
                if (i == 1) {
                    table[i][j] = values[i];
                }
                else {
                    int currVal = values[i] + table[i-1][j-weights[i]];
                    table[i][j] = currVal > table[i-1][j] ? currVal : table[i-1][j];
                }
            }
        }
    }
    return table[N][V];
}

void print_table () {
    for (int i=1; i<=N; i++) {
        for (int j=1; j<=V; j++) {
            printf("%d ", table[i][j]);
        }
        printf("\n");
    }
}
int main(void) {
    int result = knapsack_01();
    printf("%d\n", result); // 4000
    printf("\n");
    print_table();
    // 1500 1500 1500 1500 
    // 1500 1500 1500 3000 
    // 1500 1500 2000 3500 
    // 2000 3500 3500 4000
}
```




## 设计思想
### 一个问题是怎么想出用动态规划的——递归感的寻找


## 本质


## 思路
### 1. 找到问题的变量
* 物品种类
* 背包容量

### 2. 寻找初始状态
只有一种物品并且背包容量为 1。

### 3. 遍历从初始状态到求解状态的所有状态的最优解
1. 两个变量所有可能的状态会组成一个二维数组，即 `[[物品种类][背包容量]]`。
2. 求解二维数组每一项对应的状态 `dp[物品种类][背包容量]`。
3. 寻找最优解的情况，在硬币找零问题中比较明显，也就是每种金额有不同的找零方案，然后比较每种方案即可。
4. 但在背包问题中，有哪些方案不是很直观。在指定的物品种类和背包容量下，最优解是什么概念？有哪些可选方案可供比较？
5. 最优解的概念是当前物品当前容量下可装的最大价值。可选方案有哪些？
6. 比如说 3 个物品 4 磅容量，容量是固定的，那可变的就是不同物品的组合。可以 3 个都放，可以放其中 2 个，可以放其中 1 个，一共有 6 中方案。排除掉其中放不下的方案后，剩下方案的比较就能得出最优解。
7. 但这是单独思考某一种状态时的方案选择，实际上不需要遍历所有可能的方案。因为当前的计算可以依赖之前计算的结果。
8. 在 4 磅的情况下，是存在一个曾经的最优解的，就是只有前两个物品的情况下得出的最优解。而这个最优解，在有了第三个物品时，也是作为当前一种可选方案，即：不放第三个物品的方案。
9. 那么，于此对应的就还有另一种方案：放第三个物品的方案。
10. 从放不放第三个物品的维度，可以获得两个方案，这两个方案就是该维度下所有的方案。我们只需要选出这两种方案里面的最优解即可。
11. 不放第三个物品方案的最大价值之前已经算出来，现在就需要算放第三个物品的最大价值。
12. 放第三个物品的最大价值就是，第三个物品的价值加上剩余容量的最大价值。而剩余容量的最大价值也是之前算出来的。


## 0-1 背包
### 实现
```js
class Knapsack_DP {
    constructor (capacity, goods=[]) {
        this.capacity = capacity;
        this.goods = goods;
    }

    addGoods (goods) {
        this.goods = this.goods.concat(goods)
    }

    calc () {
        let index = 0;
        let result = [];

        // 下面通过两个循环，而矩阵进行遍历
        // 矩阵的行是每次新增的物品，列是背包不同的容量

        // 逐一增加物品时
        this.goods.forEach((item, index) => {
            // 记录每行加入新物品时各个容量的最大价值
            let currRow = [];

            // 上一轮新增物品时，所有背包容量可装的最大物品价值
            // 例如，本轮如果是电脑，则 lastRow 是：
            // [empty, 1500, 1500, 1500, 3000]
            // 本轮的计算会用到上一轮的结果
            let lastRow = result[result.length-1];
           
            // 每种背包容量
            for ( let currCapa=1; currCapa<=this.capacity; currCapa++ ) {

                // 上一轮该容量的最大价值
                // 如果本轮该容量的价值没有更大，那就还沿用上一轮的
                // 第一轮时，没有 lastRow
                let maxVal = (lastRow && lastRow[currCapa]) || 0;

                // 本轮新的物品重量如果大于当前容量，则当前容量不能装该物品，继续沿用上一轮的重量
                if ( item.weight <= currCapa ) {
                    // 当前容量的空背包放入本轮新的物品后剩余的容量可以装的最大价值
                    let lastRowPad = lastRow ? ( lastRow[currCapa-item.weight] || 0 ) : 0;
                    
                    // 本轮新物品的价值加上空余容量的最大价值，
                    let currVal = item.value + lastRowPad;
                    // 和上一轮该容量的最大价值比较，确定新的最大价值
                    if ( currVal > maxVal ) {
                        maxVal = currVal;
                    }
                }

                // 记录本轮当前容量下的最大价值
                currRow[currCapa] = maxVal;
            }

            // 经过 for 循环，currRow 记录了加入本轮物品时各个容量的最大价值
            // 经过 forEach 循环，result 记录了每轮加入新物品时各个容量的最大价值
            result.push(currRow)
        });

        return result;
    }
}


const goods = [
    { // 吉他
        weight: 1,
        value: 1500,
    },
    { // 音响
        weight: 4,
        value: 3000,
    },
    { // 电脑
        weight: 3,
        value: 2000,
    },
];

let knapsack = new Knapsack_DP(4, goods);
console.log( knapsack.calc() );
// [empty, 1500, 1500, 1500, 1500]
// [empty, 1500, 1500, 1500, 3000]
// [empty, 1500, 1500, 2000, 3500]

knapsack.addGoods([[1, 2000]]); // 重量 1 价值 2000 的手机
console.log( knapsack.calc() );
// [empty, 1500, 1500, 1500, 1500]
// [empty, 1500, 1500, 1500, 3000]
// [empty, 1500, 1500, 2000, 3500]
// [empty, 2000, 3500, 3500, 4000]
```


## 0-1 背包问题的递归解法
```js
function knapsack_01 (weights, values, capacity) {
    if (weights.length === 0 || values.length === 0) {
        return 0;
    }

    let max = 0;
    for (let i=0; i<weights.length; i++) {
        if (weights[i] > capacity) {
            continue;
        }
        let newWeights = [...weights.slice(0, i), ...weights.slice(i+1)];
        let newValues = [...values.slice(0, i), ...values.slice(i+1)];
        let val = values[i] + knapsack_01(newWeights, newValues, capacity-weights[i]);
        if (val > max) {
            max = val;
        }
    }
    return max;
}

let result1 = knapsack_01([1, 4, 3], [1500, 3000, 2000], 4);
console.log(result1); // 3500
let result2 = knapsack_01([1, 4, 3, 1], [1500, 3000, 2000, 2000], 4);
console.log(result2); // 4000
let result3 = knapsack_01([2, 3, 4, 5], [3, 4, 5, 6], 8);
console.log(result3); // 10
```