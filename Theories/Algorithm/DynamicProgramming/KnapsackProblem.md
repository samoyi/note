# Knapsack problem



## 设计思想
### 一个问题是怎么想出用动态规划的——递归感的寻找


## 本质
1. 背包问题是问 x 个物品 y 容量的背包，最大能装多少。也就是求 $f(x, y)$。


## 思路
### 1. 找到问题的变量
* 物品种类
* 背包容量
Longest Common Substring
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