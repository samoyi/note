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


var minCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(minCoinChange.makeChange(36));
var minCoinChange = new MinCoinChange([1, 2, 4, 5]);
console.log(minCoinChange.makeChange(8));
