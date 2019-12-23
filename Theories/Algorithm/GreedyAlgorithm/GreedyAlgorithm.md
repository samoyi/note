# Greedy Algorithm
1. 贪心算法遵循一种近似解决问题的技术，期盼通过每个阶段的局部最优选择（当前最好的解），从而达到全局的最优（全局最优解）。它不像动态规划那样计算更大的格局。
2. 比起动态规划算法而言，贪心算法更简单、更快。然而，它并不总是得到最优答案。但是综合来看，它相对执行时间来说，输出了一个可以接受的解。

## JS 实现
```js
class MinCoinChange {
    constructor (coins) {
        this.coins = coins.sort((a,b)=>a-b);
    }

    makeChange (amount) {
        let selected = [];
        let sum = 0;
        let index = this.coins.length - 1; // 贪心所以先找最大面值的
        while (index > -1 && sum <= amount) {
            let coin = this.coins[index]
            while (sum + coin <= amount) { // 尽可能多的使用当前面额（当前面额是剩下面额中最大的）
                selected.push(coin);
                sum += coin;
            }
            index--;
        } 
        return selected;
    }
}

let minCoinChange_4 = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange_4.makeChange(36)); // [25, 10, 1]

let minCoinChange_3 = new MinCoinChange([1, 3, 4]);
// 最优解是 [3, 3]，但因为最开始的贪心，所以
console.log(minCoinChange_3.makeChange(6)); // [4, 1, 1]  
```