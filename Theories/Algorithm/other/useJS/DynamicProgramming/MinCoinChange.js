class MinCoinChange {
    constructor (coins=[]) {
        this.coins = coins.sort((m, n) => m - n);
        this.cache = {};
    }

    makeChange (amount) {
        if (this.cache[amount] !== undefined) {
            return this.cache[amount];
        }
        if (amount < this.coins[0]) {
            return [];
        }
        if (this.coins.includes(amount)) {
            return [amount];
        }

        let min = null;
        for (let i = 0; i < this.coins.length; i++) {
            let currCoin = this.coins[i];
            if (currCoin > amount) break;
            let arr = [currCoin].concat(this.makeChange(amount - currCoin));
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


