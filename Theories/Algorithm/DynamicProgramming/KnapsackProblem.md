# Knapsack problem



## 设计思想
### 一个问题是怎么想出用动态规划的——递归感的寻找


## 本质
1. 背包问题是问 x 个物品 y 容量的背包，最大能装多少。也就是求 $f(x, y)$。



## 动态规划算法会从 1 分找零开始，然后系统地一直计算到所需的找零金额
从 dp[1][1] 到 dp[N][W]


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

        // 逐一增加物品时
        this.goods.forEach((item, index) => {
            // console.log(111)
            // 记录每行加入新物品时各个容量的最大价值
            let currLine = [];

            // 在本轮之前，所有背包容量可装的最大物品价值
            // 例如，本轮如果是电脑，则 lastLine 是：
            // {1 => 1500, 2 => 1500, 3 => 1500, 4 => 3000}
            let lastLine = result[result.length-1];

            // 每种背包容量
            for ( let i=1; i<=this.capacity; i++ ) {
                let currCapacity = i;

                // 上一轮该容量的最大价值
                // 如果本轮该容量的价值没有更大，那就还沿用上一轮的
                // 第一轮时，没有 lastLine
                let maxVal = (lastLine && lastLine[currCapacity]) || 0;

                // 本轮新的物品重量如果大于当前容量，则当前容量不能装该物品，继续沿用上一轮的重量
                if ( item[0] <= currCapacity ) {
                    // 当前容量的空背包放入本轮新的物品后剩余的容量可以装的最大价值
                    let lastLinePad = lastLine ? ( lastLine[currCapacity-item[0]] || 0 ) : 0;
                    
                    // 本轮新物品的价值加上空余容量的最大价值，和上一轮该容量的最大价值比较，确定新的最大价值
                    let currVal = item[1] + lastLinePad;
                    if ( currVal > maxVal ) {
                        maxVal = currVal;
                    }
                }

                // 记录本轮当前容量下的最大价值
                currLine[currCapacity] = maxVal;
            }

            // 经过 for 循环，currLine 记录了加入本轮物品时各个容量的最大价值
            // 经过 forEach 循环，result 记录了每轮加入新物品时各个容量的最大价值
            // console.log(222)
            result.push(currLine)
        });

        return result;
    }
}


const goods = [
    [1, 1500], // 重量 1 价值 1500 的吉他
    [4, 3000], // 重量 4 价值 3000 的音响
    [3, 2000], // 重量 3 价值 2000 的电脑
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