# Knapsack problem


<!-- TOC -->

- [Knapsack problem](#knapsack-problem)
    - [TODO](#todo)
    - [设计思想](#设计思想)
        - [和硬币找零问题](#和硬币找零问题)
        - [两种最优子结构](#两种最优子结构)
    - [有问题的最优子结构](#有问题的最优子结构)
        - [递归式](#递归式)
        - [递归解法](#递归解法)
        - [回看上面的最优子结构](#回看上面的最优子结构)
    - [新的最优子结构](#新的最优子结构)
        - [容量检查](#容量检查)
        - [JS 递归实现](#js-递归实现)
        - [自底向上的实现](#自底向上的实现)
        - [C 实现 带最优解方案](#c-实现-带最优解方案)
    - [重叠子问题](#重叠子问题)
    - [分数背包问题](#分数背包问题)
        - [和 0-1 背包问题的区别](#和-0-1-背包问题的区别)

<!-- /TOC -->


## TODO
怎么想出来要用这种最优子结构的


## 设计思想
### 和硬币找零问题
1. 如果每个物品数量不限，就类似于找零问题。
2. 那么每次递归变化就只有容量，而物品数（这种情况下实际上是物品种类）是不变的，所以缓存也就只需要一维数组，索引是容量
    ```js
    let N = 4;
    let weights = [0, 1, 4, 3, 1];
    let values = [0, 1500, 3000, 2000, 2000];
    let capacity = 4;
    let memo = Array(N+1);


    function knapsack_01 (capacity) {
        if (memo[capacity]) {
            return memo[capacity];
        }
        let maxVal = 0;
        for (let i=1; i<=N; i++) {
            if (weights[i] <= capacity) {
                let newCapacity = capacity - weights[i];
                let val = values[i] + knapsack_01(newCapacity);
                if (val > maxVal) {
                    maxVal = val;
                    memo[capacity] = val;
                }
            }
        }
        
        return maxVal;
    }


    console.log(knapsack_01 (capacity)); // 8000
    console.log(memo); // [empty, 2000, 4000, 6000, 8000]
    ```
3. 因为物品可以无限取，所以 `weights` 和 `values` 是永远不变的，而不会像下面第一次的递归解法中每次递归都要更新这两个数组。

### 两种最优子结构
1. 两种最优子结构本身来说都是正确的，只不过第一个最优子结构所构造出的子问题无法使用表来缓存。
2. 那么在其他时候构建最优子结构时，就可以先考虑一下该最优子结构对于后序计算是否够简单。
3. 钢条切割问题最初的最优子结构可以被优化，背包问题最初的最优子结构必须被优化。


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
    const items = [
        {weight: 1, value: 1500},
        {weight: 4, value: 3000},
        {weight: 3, value: 2000},
        {weight: 1, value: 2000},
    ];
    const capacity = 4;

    function knapsack_01 (items, capacity) {
        if (items.length === 0 || capacity <= 0) {
            return 0;
        }
        let maxVal = 0;
        for (let i=0; i<items.length; i++) {
            if (items[i].weight <= capacity) {
                let newItems = [...items.slice(0, i), ...items.slice(i+1)];
                let newCapacity = capacity - items[i].weight;
                let val = items[i].value + knapsack_01(newItems, newCapacity);
                if (val > maxVal) {
                    maxVal = val;
                }
            }
        }
        return maxVal;
    }

    console.log(knapsack_01 (items, capacity)); // 4000
    ```
2. 因为每次取了一个就少了一个，所以递归的时候要更新物品数组，删掉已经取的物品。基于同样的原因，函数也必须要把这个数组作为参数。
3. 能不能不创建新数组，而是用什么标记来表明剩下的物品呢？目前看来，剩下的物品数量不定，而且在序号上也不一定连接，所以没有什么好办法。
4. 由于每次递归都要创建两个新的数组，所以用 C 实现起来就比较困难了。而且更麻烦的是，如果要使用缓存
    ```js
    const memo = Array.from(Array(4), ()=>Array(4));
    
    function knapsack_01 (items, capacity) {
        if (items.length === 0 || capacity <= 0) {
            return 0;
        }
        let maxVal = 0;
        for (let i=0; i<items.length; i++) {
            if (items[i].weight <= capacity) {
                let newItems = [...items.slice(0, i), ...items.slice(i+1)];
                let newCapacity = capacity - items[i].weight;
                let val = items[i].value + knapsack_01(newItems, newCapacity);
                if (val > maxVal) {
                    maxVal = val;
                    memo[这个下标怎么写][capacity] = val;
                }
            }
        }
        return maxVal;
    }
    ```
4. 这个不知道怎么写的下标，要区分出不同的物品组合。4 个物品，一共有 $C_4^1 + C_4^2 + C_4^3 + C_4^4 = 15$ 种组合方式。而且每种组合除非进行映射，否则不能用简单相邻的数字来表示。
5. 如果给每个物品一个 key，然后将物品组合进行映射再缓存，虽然可以实现，但是比较麻烦
    ```js
    const items = [
        {key: 1, weight: 1, value: 1500},
        {key: 2, weight: 4, value: 3000},
        {key: 3, weight: 3, value: 2000},
        {key: 4, weight: 1, value: 2000},
    ];

    const capacity = 4;
    const memo = Array.from(Array(capacity+1), ()=>new Map());

    function getCache (items, capacity) {
        if (items.length === 0 || capacity <= 0) {
            return 0;
        }
        let keyStr = items.map(i=>i.key).join("-");
        return memo[capacity].get(keyStr);
    }
    function setCache (items, capacity, val) {
        if (items.length === 0 || capacity <= 0) {
            return;
        }
        let keyStr = items.map(i=>i.key).join("-");
        return memo[capacity].set(keyStr, val);
    }
    function knapsack_01 (items, capacity) {
        if (items.length === 0 || capacity <= 0) {
            return 0;
        }
        let cached = getCache(items, capacity);
        if (cached) {
            return cached;
        }
        let maxVal = 0;
        for (let i=0; i<items.length; i++) {
            if (items[i].weight <= capacity) {
                let newItems = [...items.slice(0, i), ...items.slice(i+1)];
                let newCapacity = capacity - items[i].weight;
                let val = items[i].value + knapsack_01(newItems, newCapacity);
                if (val > maxVal) {
                    maxVal = val;
                    setCache(items, capacity, val);
                }
            }
        }
        return maxVal;
    }


    console.log(knapsack_01 (items, capacity)); // 4000
    console.log(memo);
    // 0: Map(0) {size: 0}
    // 1: Map(1) {'1-2-4' => 2000} // 容量为 1 且物品为 1、2、4 时，只能存放 4 的手机
    // 2: Map(0) {size: 0}
    // 3: Map(2) {'2-3-4' => 2000, '1-2-3' => 2000} // 容量为 3 且物品为 1、2、4 及 1、2、3 时
    // 4: Map(1) {'1-2-3-4' => 4000} // 容量为 4 且物品为 1、2、3、4 时
    ```
6. 并且，如果按照这个思路进行自底向上的动态规划设计时，会更加麻烦。因为每种容量的情况下，都要考虑所有的 15 种物品组合方式。

### 回看上面的最优子结构
1. 对于之前的钢条切割问题，只要一个尺寸值就可以确定子问题；而对于矩阵链乘法，只要两个作为矩阵链起终点位置的值就能确定子问题。
2. 但是在这里似乎不能这么方便的确定子问题，所以上面才会使用到生成新数组的方法。
3. 现在再回看上面的递归式中的 $对剩余物品递归计算得到的价值$，就会发现这个 $剩余物品$ 没办法用表格来表示。
4. 也就是说，我们必须重新找到其他形式的递归式。


## 新的最优子结构
1. 最优解的递归式，是关于 “做出某种选择” 的描述。钢条切割问题基于选择常量一条的长度拆分出了子问题，矩阵链问题基于在哪里分割而拆分出了两个子问题，找零问题基于最后一枚硬币是哪个拆分出了子问题。
2. 但是做出的选择拆分子问题而形成的递归式不一定就是可用的或者好用的。在钢条切割问题中，得到的最优子结构虽然正确但比较麻烦，所以也是进行了简化而得到了新的子结构。
3. 也就是说对于一个问题，子结构可能并不止一种，有些不可行，有些比较麻烦。
4. 上面有问题的递归式的选择是 “选出某一件物品”，由此得出的子结构递归式有问题。所以就要考虑从其他角度进行划分。
5. 实际上，背包问题的选择是：拿不拿第 N 件物品。这种情况下，选择的选项不是 N 个，而是两个。
6. 因为这是一个最优化问题，所以就需要比较这两种选择。
7. 两种选择分别会得到一个子问题：
    * 如果选了，子问题参数就是剩下的物品和剩余的背包容量；
    * 如果没选，子问题参数就是剩下物品和全部的背包容量。
8. 基本逻辑如下
    ```cpp
    #define N 4 // 物品数量
    #define V 4 // 背包容量

    int weights[N+1] = {0, 1, 4, 3, 1}; // 物品重量
    int values[N+1] = {0, 1500, 3000, 2000, 2000}; // 物品价值

    int knapsack_01 (int n, int cap) {
        if (n < 1 || cap < 1) {
            return 0;
        }

        // 决定放第 n 个
        int v1 = knapsack_01(n-1, cap-weights[n]) + values[n];

        // 决定不选第 n 个
        int v2 = knapsack_01(n-1, cap);
        
        return v1 > v2 ? v1 : v2;
    }
    ```

### 容量检查
1. 实际运行一下上面的函数就会发现，结果是所有物品的价值。因为没有检查能不能放进去。
2. 应该怎么检查呢？从逻辑上讲似乎是，如果选择了第 n 个，那整体的重量就是子问题最优解若干物品的重量加上第 n 个物品的重量应该不超过当前的 cap。那 `knapsack_01` 还要计算最优解的总重量。
3. 但其实不需要检查子问题的总重量。因为既然决定要选第 n 个物品，那只要第 n 个物品本身重量不超过当前容量，它前面的物品能否装进剩余容量就不是决定性的了，如果一个都装不下，那子问题函数返回 0 就行了。
4. 所以，如果决定放第 n 个物品，但是第 n 个物品又超过当前容量，那看起来这种情况下就和选择不放第 n 个物品一样了。似乎可以如下合并
    ```cpp
    int knapsack_01 (int n, int cap) {
        if (n < 1 || cap < 1) {
            return 0;
        }

        int v1, v2;

        // 不放第 n 个物品，或者想放但是放不下
        if (weights[n] > cap) {
            v1 = knapsack_01(n-1, cap);
        }
        else {
            // 成功放了第 n 个物品
            v2 = knapsack_01(n-1, cap-weights[n]) + values[n];
        }

        return v1 > v2 ? v1 : v2;
    }
    ```
5. 但运行结果显然有问题。因为不放和放不下这两种情况是不一样的，合并到一起后，下面这种情况就得不到执行了：能放下但是选择不放。
6. 所以不能合并这两种情况
    ```cpp
    int knapsack_01 (int n, int cap) {
        if (n < 1 || cap < 1) {
            return 0;
        }

        int v1, v2;

        // 选择放第 n 个
        if (weights[n] > cap) { // 但是放不下
            return knapsack_01(n-1, cap);
        }
        else { // 放下了
            v1 = knapsack_01(n-1, cap-weights[n]) + values[n];
        }

        // 选择不放第 n 个
        v2 = knapsack_01(n-1, cap);

        // 比较
        return v1 > v2 ? v1 : v2;
    }
    ```

### JS 递归实现
1. 直接实现如下
    ```js
    const items = [
        {weight: 1, value: 1500},
        {weight: 4, value: 3000},
        {weight: 3, value: 2000},
        {weight: 1, value: 2000},
    ];

    const capacity = 4;


    function knapsack_01 (items, capacity) {
        if (items.length === 0 || capacity <= 0) {
            return 0;
        }
        let lastItem = items[items.length-1];
        if (lastItem.weight > capacity) {
            return knapsack_01(items.slice(0, items.length-1), capacity);
        }
        else {
            let m = knapsack_01(items.slice(0, items.length-1), capacity);
            let n = lastItem.value 
                        + knapsack_01(items.slice(0, items.length-1), capacity-lastItem.weight);
            return m > n ? m : n;
        }
    }


    console.log(knapsack_01 (items, capacity)); // 4000
    ```
2. 但是考虑到现在只是对最后一个物品进行选或不选两种选择，而不是从所有物品里选择一个，所以其实子问题中剩余的物品都是连着的了，因此没必要再创建子数组，可以直接用序号标注
    ```js
    const items = [
        {weight: 1, value: 1500},
        {weight: 4, value: 3000},
        {weight: 3, value: 2000},
        {weight: 1, value: 2000},
    ];

    const capacity = 4;


    function knapsack_01 (itemNum, capacity) {
        if (itemNum === 0 || capacity <= 0) {
            return 0;
        }
        let lastItem = items[itemNum-1];
        if (lastItem.weight > capacity) {
            return knapsack_01(itemNum-1, capacity);
        }
        else {
            let m = knapsack_01(itemNum-1, capacity);
            let n = lastItem.value 
                        + knapsack_01(itemNum-1, capacity-lastItem.weight);
            return m > n ? m : n;
        }
    }


    console.log(knapsack_01 (items.length, capacity)); // 4000
    ```
3. 因为每个子问题的物品可以仅仅用一个序号标注，那么缓存就可以使用简单的整数二维数组
    ```js
    const items = [
        {weight: 1, value: 1500},
        {weight: 4, value: 3000},
        {weight: 3, value: 2000},
        {weight: 1, value: 2000},
    ];

    const capacity = 4;
    const memo = Array.from(Array(items.length+1), ()=>Array(capacity+1));


    function knapsack_01 (itemNum, capacity) {
        if (itemNum === 0 || capacity <= 0) {
            return 0;
        }
        if (memo[itemNum][capacity]) {
            return memo[itemNum][capacity];
        }
        let lastItem = items[itemNum-1];
        if (lastItem.weight > capacity) {
            return knapsack_01(itemNum-1, capacity);
        }
        else {
            let m = knapsack_01(itemNum-1, capacity);
            let n = lastItem.value 
                        + knapsack_01(itemNum-1, capacity-lastItem.weight);
            let max = m > n ? m : n;
            memo[itemNum][capacity] = max;
            return max;
        }
    }


    console.log(knapsack_01 (items.length, capacity)); // 4000
    console.log(memo);
    // 0: (5) [empty × 5]
    // 1: (5) [empty, 1500, empty, 1500, 1500]
    // 2: (5) [empty × 4, 3000]
    // 3: (5) [empty × 3, 2000, 3500]
    // 4: (5) [empty × 4, 4000]
    ```

### 自底向上的实现
1. 原问题的子问题是前 N-1 个物品在全部容积或全部容积减去 N 的重量的容积下的求解。那么依次类推，更小的子问题就需要更靠前的几个物品和更小的容积。
2. 因此自底向上的算法中，将会遍历从一个物品到 N 个物品，分别在每种容积下的最优解
    ```js
    const N = 4; // 物品数量

    const items = [
        null, // 序号从 1 开始，比较方便
        {weight: 1, value: 1500},
        {weight: 4, value: 3000},
        {weight: 3, value: 2000},
        {weight: 1, value: 2000},
    ];

    const capacity = 4;
    const table = Array.from(Array(N+1), ()=>Array.from(Array(capacity+1), ()=>0));
    // [0, 0, 0, 0, 0]
    // [0, 0, 0, 0, 0]
    // [0, 0, 0, 0, 0]
    // [0, 0, 0, 0, 0]
    // [0, 0, 0, 0, 0]


    function knapsack_01 (itemNum, capacity) {
        if (itemNum === 0 || capacity === 0) {
            return 0;
        }
        if (table[itemNum][capacity]) {
            return table[itemNum][capacity];
        }

        for (let i=1; i<=itemNum; i++) { // 从只有一个物品到有 N 个物品
            let item = items[i];
            for (let c=1; c<=capacity; c++) { // 前 i 个物品在所有容积情况下的最优解
                if (item.weight > c) {
                    // 如果第 i 个物品本身的重量就已经超过当前容积 c，那么当前容积就不能放物品 i，
                    // 所以能放的最大价值就是前 i-1 个物品在容积 c 时的最大价值。
                    table[i][c] = table[i-1][c];
                }
                else {
                    let m = table[i-1][c];
                    let n = item.value + table[i-1][c-item.weight];
                    table[i][c] = m > n ? m : n;
                }
            }
        }
        
        return table[itemNum][capacity];
    }


    console.log(knapsack_01 (N, capacity)); // 4000
    console.log(table);
    // [0, 0, 0, 0, 0]
    // [0, 1500, 1500, 1500, 1500]
    // [0, 1500, 1500, 1500, 3000]
    // [0, 1500, 1500, 2000, 3500]
    // [0, 2000, 3500, 3500, 4000]
    ```

### C 实现 带最优解方案
```cpp
#define N 4 // 物品数量
#define V 4 // 背包容量

int weights[N+1] = {0, 1, 4, 3, 1}; // 物品重量
int values[N+1] = {0, 1500, 3000, 2000, 2000}; // 物品价值
int table[N+1][V+1]= {0};
int solutions[N+1][V+1] = {0}; // 默认值为 0，表示没有选当前物品

int knapsack_01 (int itemNum, int capacity) {
    if (itemNum <= 0 || capacity <= 0) {
        return 0;
    }

    for (int n=1; n<=itemNum; n++) {
        for (int c=1; c<=capacity; c++) {
            if (weights[n] > c) {
                // 想放第 n 个但是放不下
                table[n][c] = table[n-1][c];
            }
            else {
                // 选择放第 n 个并且放下了
                int v1 = values[n] + table[n-1][c-weights[n]];
                // 选择不放第 n 个
                // 这里不能像递归解法那样放在 else 外面，否则会对 if 里面的 table 重新赋值
                int v2 = table[n-1][c];
                table[n][c] = v1 > v2 ? v1 : v2;
                solutions[n][c] = v1 > v2; // 记录选择了当前物品
            }
        }
    }

    return table[itemNum][capacity];
}

void print_table () {
    for (int n=1; n<=N; n++) {
        for (int c=1; c<=V; c++) {
            printf("%d ", table[n][c]);
        }   
        printf("\n");
    }
}

void print_solution (int itemNum, int capacity) {
    if (itemNum <= 0 || capacity <= 0) {
        printf("[]\n");
        return;
    }
    printf("[");
    while (itemNum > 0 && capacity > 0) {
        int isSeleted = solutions[itemNum][capacity]; // 是否选了当前物品
        if (isSeleted) {
            // 选了那子问题容量就要减去当前物品的
            capacity -= weights[itemNum];
            // 打印选中的物品编号
            printf("%d ", itemNum);
        }
        itemNum--;
    }
    printf("]\n");
}


int main (void) {

    int v = knapsack_01(N, V);
    printf("%d\n\n", v); // 4000

    print_table(table);
    // 1500 1500 1500 1500 
    // 1500 1500 1500 3000 
    // 1500 1500 2000 3500 
    // 2000 3500 3500 4000

    print_solutions_table();
    // 1 1 1 1
    // 0 0 0 1
    // 0 0 1 1
    // 1 1 1 1

    print_solution(N, V); // [4 3 ]

    return 0;
}
```


## 重叠子问题
1. 问题的递归算法是否会反复的求解相同的子问题？如果递归算法反复求解相同的子问题，我们就说最优化问题具有重叠子问题性质，也就可以自底向上并配合表的方法来解决。或者使用自顶向下带备忘的方法。
2. 0-1 背包问题问题中，在做出第一次选择后，产生的若干种子问题中，而每个子问题又会有各自的若干子子问题，不同子问题会有相同的子子问题，这就满足了重叠子问题的性质。


## 分数背包问题
### 和 0-1 背包问题的区别
1. 0-1 背包问题的麻烦之处在于，当你想选一个价值更大的物品时，还要考虑它是不是重量也更大，所以必须要权衡比较，而不能仅仅根据物品的价值进行贪心选择。
2. 即使不是贪心的选择最大价值的物品而是选择 $\frac{价值}{重量}$ 最高的物品仍然会有这个问题。
3. 而分数背包问题中，看起来仍然是有好几种物品，但因为拿的时候是一磅一磅的拿，所以每次拿的东西所占的容积都是一样的。
4. 既然容积一样，那就可以根据每一磅的价值进行贪心选择，优先选择单位重量最贵的。