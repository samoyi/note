# Dynamic Programming

## 思路
1. 动态规划是一种解决问题的思想。这种思想的本质是，一个规模比较大的问题，是通过规模比较小的若干问题的结果来得到的。
2. 例如递归求解斐波那契数列的思路就是很明确的动态规划思想。该数列的定义就已经明确的说出了算法，5 的结果`f(5)`就是用 4 的结果`f(4)`加 3 的结果`f(3)`。通过逐步求解小的问题，最终解得大的问题。


## 最少硬币找零问题
1. 思路和阶乘类似：一个数的阶乘，是当前数乘以前一个数的阶乘。对于一定金额 sum 有若干种找零方案，每种方案都是一种硬币加上其他若干枚硬币。
2. 那么，我想知道 sum 最少找零硬币数，我只要找到 sum 分别减去一种硬币面值之后的额度的最少找零硬币数。即
    ```
    f(i) = 0, i = 0
    f(i) = 1, i = 1
    f(i) = min{1 + f(i - value[j])}, i > 1，value[j] <= i
    ```
    * 钱数为 0 时，找零硬币数为 0 个，即 f(0)
    * 钱数为 1 时，找零硬币数为 1 个，即 1 + f(0)
    * 钱数为 `i` 时，假定硬币面额为`[1, 5, 10, 25]`，找零方案最多有以下四种：
        * `1`元硬币加上 f(i-1)
        * `5`元硬币加上 f(i-5)
        * `10`元硬币加上 f(i-10)
        * `25`元硬币加上 f(i-25)

### 不严格的动态规划实现
```js
class MinCoinChange {
    constructor (coins=[]) {
        this.coins = coins.sort((m, n) => m - n);
        this.cache = {};
    }

    makeChange (amount) {
        if (this.cache[amount] !== undefined) {
            return this.cache[amount]; // 命中缓存
        }
        if (amount < this.coins[0]) { // 找零钱数小于最小硬币面额
            return [];
        }
        if (this.coins.includes(amount)) { // 找零钱数等于某个硬币面额
            return [amount];
        }

        let min = null; // 存储最优方案
        for (let i = 0; i < this.coins.length; i++) { // 遍历尝试可能的每种方案
            let currCoin = this.coins[i];
            // 如果当前方案的这枚硬币数量大于要找零的钱数，则该方案不可行
            if (currCoin > amount) break;
            // 得出一种可行的方案的硬币数组
            let arr = [currCoin].concat(this.makeChange(amount - currCoin));
            // 如果该方案的硬币数更小，则该方案作为最优方案
            if (!min || arr.length < min.length) {
                min = arr;
            }
        }
        if (this.cache[amount] === undefined) {
            return this.cache[amount] = min;
        }
        return min;
    }
}

let minCoinChange_4 = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange_4.makeChange(36)); // [1, 10 ,25]

let minCoinChange_3 = new MinCoinChange([1, 3, 4]);
console.log(minCoinChange_3.makeChange(6)); // [3, 3]  

console.log(minCoinChange_4.makeChange(8)); // [1, 1, 1, 5]
console.log(minCoinChange_4.cache);
// { 
//   '2': [ 1, 1 ],
//   '3': [ 1, 1, 1 ],
//   '6': [ 1, 5 ],
//   '7': [ 1, 1, 5 ],
//   '8': [ 1, 1, 1, 5 ] 
// }
```

### 严格的动态规划实现
1. 上面之所以是不严格的，可以从`minCoinChange_4.makeChange(8)`的缓存数据看到：求解 8 的找零时，并没有递归求解到 4 的结果。
2. 事实上，我们所做的优化并不是动态规划，而是通过缓存的方法来优化程序的性能。
3. 真正的动态规划算法会用更系统化的方法来解决问题。在解决找零问题时，动态规划算法会从1分找零开始，然后系统地一直计算到所需的找零金额。这样做可以保证在每一步都已经知道任何小于当前值的找零金额所需的最少硬币数。
4. 实现如下
    ```py
    def dpMakeChange(coinValueList, change, minCoins, coinsUsed):
    # 求解 change 金额的最小找零方案时，动态规划算法会从单位金额开始递增计算每一个金额的找零方案直到 change
        for cents in range(change+1):
            minCount = cents # 最小找零硬币数初始化为当前金额，即全部用单位币值来找零的方案
            newCoin = 1
            # 遍历小于等于当前 cents 的所有硬币币值
            for j in [c for c in coinValueList if c <= cents]:
                if minCoins[cents-j] + 1 < minCount:
                    minCount = minCoins[cents-j] + 1
                    # newCoin 是最优秀方案的找零组合时最后一个找的硬币。例如：
                    # 对 2 找零的最优方案的 [1, 1]，因此 newCoin 为 1
                    # 对 5 找零的最优方案的 [5]，因此 newCoin 为 5
                    # 对 8 找零的最优方案的 [5, 1, 1, 1]，因此 newCoin 为 1
                    newCoin = j 
            minCoins[cents] = minCount
            coinsUsed[cents] = newCoin
        return minCoins[change]

    # 打印某个金额的具体找零方案
    def printCoins(coinsUsed, change):
        coin = change
        while coin > 0:
            # 以 8 的找零方案 [5, 1, 1, 1] 为例
            # 第一轮循环时，获取到 8 的最后一个找的硬币 1，coin 变成 8 的最优方案的上一轮基础，即 7
            # 第二轮循环时，获取到 7 的最后一个找的硬币 1，coin 变成 7 的最优方案的上一轮基础，即 6
            # 第三轮循环时，获取到 6 的最后一个找的硬币 1，coin 变成 6 的最优方案的上一轮基础，即 5
            # 第四轮循环时，获取到 5 的最后一个找的硬币 5，coin 变成 0，退出循环
            thisCoin = coinsUsed[coin]
            print(thisCoin)
            coin = coin - thisCoin

        
    coinValueList = [1, 5, 10, 21, 25]
    change = 8
    coinsUsed = [0]*(change+1)
    minCoins = [0]*(change+1)
    print(dpMakeChange(coinValueList, change, minCoins, coinsUsed), '\n') # 4
    print(minCoins, '\n')  # [0, 1, 2, 3, 4, 1, 2, 3, 4]
    printCoins(coinsUsed, change) # 依次打印出 1 1 1 5
    ```


## Referecens
* [动态规划系列（2）——找零钱问题](https://www.jianshu.com/p/9ea65dd9e792)
* [《Python数据结构与算法分析（第2版）》第四章](https://book.douban.com/subject/34785178/)