# Dynamic Programming
1. 贪心算法遵循一种近似解决问题的技术，期盼通过每个阶段的局部最优选择（当前最好的解），从而达到全局的最优（全局最优解）。它不像动态规划那样计算更大的格局。
2. 比起动态规划算法而言，贪心算法更简单、更快。然而，它并不总是得到最优答案。但是综合来看，它相对执行时间来说，输出了一个可以接受的解。


## 思路
1. 斐波那契数列的实现思路很明确，该数列的定义就已经明确的说出了算法，5 的结果 f(5) 就是用 4 的结果 f(4) 加 3 的结果 f(3)，没有任何问题。
2. 但硬币最少找零的问题时，问题描述本身并没有明确的说出算法。
3. 直接套用斐波那契数列的算法思路也是不对的，比如： 5 的结果等于 4 的结果加 3 的结果，或者 5 的结果等于 4 的结果加 1 的结果，这都是不对的。 4 可以是 2+2 或 3+1，但 5 就不一定要是 2+2+1 或者 3+1+1，而可以直接是 3+2。
4. TODO，但是，是怎么想到下面的思路的：
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
5. 因此算法实现如下：
    ```js
    class MinCoinChange {
        constructor (coins=[]) {
            this.coins = coins.sort((m, n) => m - n);
            this.cache = {};
        }

        makeChange (amount) {
            if (this.cache[amount] !== undefined) {
                return this.cache[amount];
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
    ```


## Referecens
* [动态规划系列（2）——找零钱问题](https://www.jianshu.com/p/9ea65dd9e792)