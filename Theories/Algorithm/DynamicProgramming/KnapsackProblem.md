# Knapsack problem


<!-- TOC -->

- [Knapsack problem](#knapsack-problem)
    - [设计思想](#设计思想)
        - [和硬币找零问题](#和硬币找零问题)
    - [有问题的最优子结构](#有问题的最优子结构)
        - [递归式](#递归式)
        - [递归解法](#递归解法)
        - [回看上面的最优子结构](#回看上面的最优子结构)
    - [新的最优子结构](#新的最优子结构)
    - [重叠子问题](#重叠子问题)
        - [两种递归式本质区别](#两种递归式本质区别)
        - [实现](#实现)
    - [分数背包问题](#分数背包问题)
        - [和 0-1 背包问题的区别](#和-0-1-背包问题的区别)
    - [0-1 背包](#0-1-背包)
        - [实现](#实现-1)
    - [0-1 背包问题的递归解法](#0-1-背包问题的递归解法)

<!-- /TOC -->


## 设计思想
### 和硬币找零问题
1. 如果每个物品数量不限，就类似于找零问题。
2. 那么每次递归变化就只有容量，而物品数（这种情况下实际上是物品种类）是不变的，所以缓存也就只需要一维数组，索引是容量
    ```js
    let N = 4;
    let weights = [0, 1, 4, 3, 1];
    let values = [0, 1500, 3000, 2000, 2000];
    let capcity = 4;
    let table = Array(N+1);


    function knapsack_01 (capcity) {
        if (table[capcity]) {
            return table[capcity];
        }
        let maxVal = 0;
        for (let i=1; i<=N; i++) {
            if (weights[i] <= capcity) {
                let newCapcity = capcity - weights[i];
                let val = values[i] + knapsack_01(newCapcity);
                if (val > maxVal) {
                    maxVal = val;
                    table[capcity] = val;
                }
            }
        }
        
        return maxVal;
    }


    console.log(knapsack_01 (capcity)); // 8000
    console.log(table); // [empty, 2000, 4000, 6000, 8000]
    ```


## 有问题的最优子结构
1. 原问题的解决包含做出某种选择：要选择一件物品。选定之后，剩下的物品和空间就会产生一种子问题。
2. 所以原问题的最优解就包括一种选择和对应的子问题的最优解，具有最优子结构。

### 递归式
1. 如果剩余物品数量为 0 时，背包的收益为 0。
2. 如果还有若干件物品和若干容积时，解的形式为 $max(选出的某一件物品的价值 + 对剩余物品递归计算得到的价值)$。
3. 因为有容量的限制，所以问题或者子问题的解的容量占用超过了背包容量，那就要舍弃。

### 递归解法
1. 实现
    ```js
    let weights = [0, 1, 4, 3, 1];
    let values = [0, 1500, 3000, 2000, 2000];
    let capcity = 4;

    function knapsack_01 (weights, values, capcity) {
        let maxVal = 0;
        for (let i=0; i<weights.length; i++) {
            if (weights[i] <= capcity) {
                let newWeight = [...weights.slice(0, i), ...weights.slice(i+1)];
                let newValues = [...values.slice(0, i), ...values.slice(i+1)];
                let newCapcity = capcity-weights[i];
                let val = values[i] + knapsack_01(newWeight, newValues, newCapcity);
                if (val > maxVal) {
                    maxVal = val;
                }
            }
        }
        return maxVal;
    }

    console.log(knapsack_01 (weights, values, capcity)); // 4000
    ```
2. 由于每次递归都要创建两个新的数组，所以用 C 实现起来就比较困难了。而且更麻烦的是，如果要使用缓存
    ```js
    const table = Array.from(Array(4), ()=>Array(4));
    
    function knapsack_01 (weights, values, capcity) {
        if (table[weights.length-1][capcity]) {
            return table[weights.length-1][capcity];
        }
        let maxVal = 0;
        for (let i=0; i<weights.length; i++) {
            if (weights[i] <= capcity) {
                let newWeight = [...weights.slice(0, i), ...weights.slice(i+1)];
                let newValues = [...values.slice(0, i), ...values.slice(i+1)];
                let newCapcity = capcity-weights[i];
                let val = values[i] + knapsack_01(newWeight, newValues, newCapcity);
                if (val > maxVal) {
                    maxVal = val;
                    table[这个下标怎么写][capcity] = val;
                }
            }
        }
        
        return maxVal;
    }
    ```
3. 这个不知道怎么写的下标，要区分出不同的物品组合。4 个物品，一共有 $C_4^1 + C_4^2 + C_4^3 + C_4^4 = 15$ 种组合方式。而且每种组合除非进行映射，否则不能用简单相邻的数字来表示。
4. 而且更关键的是，因为每次递归都是创建新的数组，所以不同的递归中，对于值同样的 `i`，代表的意思也是不同的。例如第一次的 `i=0` 表示选出第一个物品，而递归之后的 `i=0` 就表示选出第二个物品了。这就导致了无法建立正确的 `table` 缓存。

### 回看上面的最优子结构
1. 对于之前的钢条切割问题，只要一个尺寸值就可以确定子问题；而对于矩阵链乘法，只要两个作为矩阵链起终点位置的值就能确定子问题。
2. 但是在这里似乎不能这么方便的确定子问题，所以上面才会使用到生成新数组的方法。所以不能使用物品的序号来确定子问题。
3. 现在再回看上面的递归式中的 $对剩余物品递归计算得到的价值$，就会发现这个 $剩余物品$ 没办法用表格来表示。
4. 也就是说，我们必须重新找到其他形式的递归式。


6. 0-1 背包问题用到的递归式是，在还有若干件物品和若干容积时：$max(不装入当前物品的话的最大价值, 装入当前物品的话的最大价值)$。
7. 根据《算法图解》中例子的表格，乍一看这样的递归式是有问题的：在同一个容量下，它只能计算【吉他】、【吉他和音响】、【吉他、音响和笔记本电脑】的价值，但不能计算【音响和笔记本电脑】以及【吉他和笔记本电脑】的价值。
8. 但其实是可以的。比如装了笔记本电脑之后，剩余容量只能装一个音响，那就是【音响和笔记本电脑】；如果剩余的容量装不了音响只能装一个吉他，那就是【吉他和笔记本电脑】。《算法图解》中例子的表格就能找到这样的格子。
9. 还有一个错觉是，只能计算一个物品和它前面物品的组合，因为填充表格的每一行就是这样的这样的顺序。比如我可以计算先放一个笔记本电脑然后再看能不能放音响，但不会进行先放一个音响然后再放笔记本电脑的计算。
10. 如果是这样，那行的顺序似乎也就会影响结果的顺序了。假如《算法图解》的例子中：如果先放音响就只能放一个 3000 美元的音响，而如果先放 2000 美元的笔记本电脑，就还能再放一个 1500 美元的吉他。
11. 然而实际上这两种放法确实都能计算到。考虑这种担心：如果当前容量是 7 磅，那放了音响之后其实还能再放一个笔记本电脑，但是因为是能向前组合，所以在计算音响这一行时，只能放音响和吉他。
12. 不过，等到计算笔记本那一行时，先放了笔记本电脑之后就可以再放一个音响他，这样就计算了刚才漏掉的情况。


## 新的最优子结构
1. 最优解的递归式，是关于 “做出某种选择” 的描述。上面有问题的递归式的选择是 $选出的某一件物品的价值$，由此得出的最优子结构递归式有问题。因此现在就要从其他方面考虑另一种选择。其实在钢条切割问题中，最初的到的最优子结构虽然正确但比较麻烦，所以也是进行了简化而得到了新的最优子结构。


## 重叠子问题
1. 问题的递归算法是否会反复的求解相同的子问题？如果递归算法反复求解相同的子问题，我们就说最优化问题具有重叠子问题性质，也就可以自底向上并配合表的方法来解决。或者使用自顶向下带备忘的方法。
2. 0-1 背包问题问题中，在做出第一次选择后，产生的若干种子问题中，而每个子问题又会有各自的若干子子问题，不同子问题会有相同的子子问题，这就满足了重叠子问题的性质。



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


## 分数背包问题
### 和 0-1 背包问题的区别
1. 0-1 背包问题的麻烦之处在于，当你想选一个价值更大的物品时，还要考虑它是不是重量也更大，所以必须要权衡比较，而不能仅仅根据物品的价值进行贪心选择。
2. 即使不是贪心的选择最大价值的物品而是选择 $\frac{价值}{重量}$ 最高的物品仍然会有这个问题。
3. 而分数背包问题中，看起来仍然是有好几种物品，但因为拿的时候是一磅一磅的拿，所以每次拿的东西所占的容积都是一样的。
4. 既然容积一样，那就可以根据每一磅的价值进行贪心选择，优先选择单位重量最贵的。





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