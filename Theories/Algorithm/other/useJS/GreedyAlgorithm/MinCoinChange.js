class MinCoinChange {
    constructor (coins) {
        this.coins = coins;
    }

    makeChange (amount) {
        let selected = [];
        let sum = 0;
        let index = this.coins.length - 1;
        while (index > -1 && sum <= amount) {
            let coin = this.coins[index]
            while (sum + coin <= amount) {
                selected.push(coin);
                sum += coin;
            }
            index--;
        } 
        return selected;
    }
}

let minCoinChange_4 = new MinCoinChange ([1, 5, 10, 25]);
console.log(minCoinChange_4.makeChange(36));

let minCoinChange_3 = new MinCoinChange([1, 3, 4]);
console.log(minCoinChange_3.makeChange(6));