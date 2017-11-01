function MinCoinChange(coins){

    this.makeChange = function(amount) {
        let change = [],
            total = 0,
            len = coins.length;
        for (let i=len-1; i>=0; i--){
            let coin = coins[i];
            while (total + coin <= amount) {
                change.push(coin);
                total += coin;
            }
        }
        return change;
    };
}

module.exports = MinCoinChange;
