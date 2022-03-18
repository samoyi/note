# 活动选择问题


<!-- TOC -->

- [活动选择问题](#活动选择问题)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [适用场景](#适用场景)
    - [调度竞争共享资源的多个活动](#调度竞争共享资源的多个活动)
    - [如果使用动态规划](#如果使用动态规划)
    - [活动选择问题的最优子结构及动态规划解法](#活动选择问题的最优子结构及动态规划解法)
        - [产生两个子问题的最优子结构](#产生两个子问题的最优子结构)
            - [C 实现可以求出活动数量，但不能正确求出那几个活动 TODO](#c-实现可以求出活动数量但不能正确求出那几个活动-todo)
        - [产生一个子问题的最优子结构](#产生一个子问题的最优子结构)
            - [C 实现](#c-实现)
            - [背包问题方法的递归解法](#背包问题方法的递归解法)
        - [自底向上解法](#自底向上解法)
            - [C 实现](#c-实现-1)
    - [贪心选择](#贪心选择)
    - [递归贪心算法](#递归贪心算法)
    - [迭代贪心算法](#迭代贪心算法)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质
1. 一个资源是有限的，不能提供给所有的使用对象。
2. 在活动选择问题中，资源是教室的 24 小时，使用对象是多个活动，有限性体现在这 24 小时只能让其中的几个活动使用。
3. 在背包问题中，资源是背包的容积，使用对象是多个物品，有限性体现在背包容积只能放多个物品中的几个。
4. 但是要怎么确定能否用贪心算法还是必须要用动态规划？


## 适用场景


## 调度竞争共享资源的多个活动
1. 若干个活动使用同一个资源，而这个资源在某个时刻只能供一个活动使用。
2. 每个活动都有一个开始时间和结束时间，任务发生在半开半闭的时间区间内。
3. 如果两个任务的时间区间不重叠，则称它们是 **兼容的**。
4. 在活动选择问题中，我们希望选出一个最大兼容活动集。也就是安排尽可能多的活动，而不是总活动时长更多。
5. 假定活动已经按照结束时间的单调递增顺序排序。


## 如果使用动态规划
1. 我们可以通过动态规划方法将这个问题分为两个子问题，然后将两个子问题的最优解整合为原问题的最优解。
2. 在确定该将哪些子问题用于最优解时，需要考虑几种选择。
3. 但之后会发现，如果使用贪心算法则只需要考虑一种选择，即贪心的选择。
4. 在做贪心选择时，子问题之一必是空的。因此，只留下一个非空子问题。
5. 基于这些观察，我们将找到一种递归贪心算法来解决活动调度问题，并将递归算法转化为迭代算法，以完成贪心算法的过程。


## 活动选择问题的最优子结构及动态规划解法
### 产生两个子问题的最优子结构
1. 原问题的解决包含做出某种选择或者处于某种不同状态。这里做出的选择是：选择某个活动包含在可能的最大兼容活动集中。
2. 为了得出最优解而要选择的活动，肯定是所有选择的可能性中的一种，因此需要遍历所有活动。
3. 每种选择出的活动会产生两个子问题：在这个活动之前的时间段里的子最大兼容活动集，和在这个活动之后的时间段里的子最大兼容活动集。
4. 两个子问题的活动集的数量再加上当前选择的活动的数量一，就是当前选择的兼容活动集的数量。
5. 对比每种选择的产生的兼容活动集的数量，就能找到最大兼容活动集
    ```js
    const acts = [
        {start:  1,  finish:   4},
        {start:  3,  finish:   5},
        {start:  0,  finish:   6},
        {start:  5,  finish:   7},
        {start:  3,  finish:   9},
        {start:  5,  finish:   9},
        {start:  6,  finish:  10},
        {start:  8,  finish:  11},
        {start:  8,  finish:  12},
        {start:  2,  finish:  14},
        {start: 12,  finish:  16},
    ];

    // 从活动列表 actList 中筛选出活动时间在 sHour 和 fHour 之间的活动
    function getListByHours (actList, sHour, fHour) {
        return actList.filter((a) => {
            return a.start >= sHour && a.finish <= fHour;
        });
    }

    // 找到活动列表 actList 中最早开始的活动的开始时间
    function firstStartHour(actList) {
        let h = 24;
        actList.forEach((a) => {
            if (a.start < h) {
                h = a.start;
            }
        });
        return h;
    }

    // 找到活动列表 actList 中最晚结束的活动的结束时间
    // 这里因为活动已经按照结束时间排序了所以直接是最后一个活动的
    function lastFinishHour(actList) {
        return actList[actList.length-1].finish;
    }

    function activity_selector (actList) {
        if (actList.length <= 1) {
            return actList;
        }

        let maxList = [];

        for (let i=0; i<actList.length; i++) {
            let currAct = actList[i];
            
            // actList 中在 currAct 之前和之后进行的所有活动
            let beforeList = getListByHours(actList, firstStartHour(actList), currAct.start);
            let afterList = getListByHours(actList, currAct.finish, lastFinishHour(actList));

            // 递归求解子问题
            let beforeSubResult = activity_selector(beforeList);
            let afterSubResult =  activity_selector(afterList);

            // 当前选择的兼容活动集
            let list = [...beforeSubResult, currAct, ...afterSubResult];

            if (list.length > maxList.length) {
                maxList = list;
            }
        }

        return maxList;
    }

    let result = activity_selector(acts)
    console.log(result);
    // 0: {start: 1, finish: 4}
    // 1: {start: 5, finish: 7}
    // 2: {start: 8, finish: 11}
    // 3: {start: 12, finish: 16}
    ```

#### C 实现可以求出活动数量，但不能正确求出那几个活动 TODO
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

#define ACT_COUNT 11
#define MAX_FINISH 16

// 按照结束时间升序
int startTimes[ACT_COUNT] = {1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};
int finishTimes[ACT_COUNT] = {4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};

// 找到在 index 活动开始之前结束的最后活动
int last_finish_before (int startIdx, int endIdx, int index) {
    // 在 index 开始前结束，肯定也在它结束前结束
    int i = index - 1;
    while (i >= startIdx && finishTimes[i] > startTimes[index]) {
        i--;
    }
    return i;
}
// 找到在当前活动结束之后开始的第一个活动
int first_start_after (int startIdx, int endIdx, int index) {
    // 因为开始时间活动没有排序，所以要比较所有之后开始的活动
    // 找到里面开始时间在 index 结束之后的且开始时间最早的
    int firstStartIdx = endIdx + 1; // 默认值超出范围，表示没找到
    int firstStartTime = finishTimes[endIdx]; // 默认的最早开始时间比所有可能的都要大
    for (int i = index+1; i <= endIdx; i++) {
        if (startTimes[i] >= finishTimes[index] && startTimes[i] < firstStartTime) {
            firstStartTime = startTimes[i];
            firstStartIdx = i;
        }
    }
    return firstStartIdx;
}

int actIndices[ACT_COUNT];

int cache[ACT_COUNT][ACT_COUNT];

void init_cache () {
    for (int i=0; i<ACT_COUNT; i++) {
        for (int j=0; j<ACT_COUNT; j++) {
            cache[i][j] = -1;
        }
    }
}

int activity_selector (int startIdx, int endIdx) {
    if (startIdx > endIdx) {
        return 0;
    }
    if (startIdx == endIdx) {
        return 1;
    }
    if (cache[startIdx][endIdx] != -1) {
        return cache[startIdx][endIdx];
    }
    int max = 0;
    int m;
    int _p, _q;
    for (int i=startIdx; i<=endIdx; i++) {
        int p = last_finish_before(startIdx, endIdx, i);
        int q = first_start_after(startIdx, endIdx, i);
        int n = activity_selector(startIdx, p) + 1 + activity_selector(q, endIdx);
        if (n > max) {
            max = n;
            m = i;
        }
    }
    actIndices[m] = 1;
    cache[startIdx][endIdx] = max;
    return max;
}


int main() {
    init_cache();

    int n = activity_selector(0, ACT_COUNT-1);
    printf("[%d]\n", n);

    for (int i=0; i<ACT_COUNT; i++) {
        printf("%d ", actIndices[i]);
    }
    printf("\n");


    return 0;
}
```

### 产生一个子问题的最优子结构
1. 如同钢条切割问题对初始的两个子问题的最优子结构进行的优化一样，这里也可以进行同样的优化。
2. 也就是，每次选择一个活动，作为兼容活动集的最后一个活动。这样，在这个活动之前的所有活动，就可以组成唯一的子问题
    ```js
    function activity_selector (actList) {
        if (actList.length <= 1) {
            return actList;
        }

        let maxList = [];

        for (let i=0; i<actList.length; i++) {
            let lastAct = actList[i];
            let beforeList = getListByHours(actList, firstStartHour(actList), lastAct.start);
            let beforeSubResult = activity_selector(beforeList);
            if ( beforeSubResult.length + 1 > maxList.length ) {
                maxList = [...beforeSubResult, lastAct];
            }
        }

        return maxList;
    }
    ```
3. 加上缓存。可以看到现在函数的参数是数组，如果使用缓存，很难用数组作为缓存的索引。那子问题如何表示出 “当前活动之前的所有活动” 呢？
4. 其实要找到当前活动之前的所有活动也是通过时间来找的，所以可以直接使用时间来做标志，也就是 “当前活动开始时间之前” 作为标记。所以函数的参数和缓存的索引可以使用某个小时数，求解或保存该小时数之前的活动的的最大兼容活动集
    ```js
    const memo = [];

    function activity_selector (actList, beforeHour) {
        if (actList.length < 1 || beforeHour < 1) {
            return [];
        }
        
        if (memo[beforeHour]) {
            return memo[beforeHour];
        }
        
        let maxList = [];
        
        // 循环继续条件的后半部分要求选择的最后一个活动的结束时间不能超过参数指定的结束时间；
        // 不能只写后半部分条件，因为循环到 actList[i] 是最后一个活动时，
        // actList[i].finish 等于 beforeHour，因此循环还会继续，但下一轮 i 就等于 actList.length 了，
        // 这就导致 actList[i] 变成了 undefiend。
        for (let i=0; i<actList.length && actList[i].finish<=beforeHour; i++) {
            let lastAct = actList[i];
            let beforeList = getListByHours(actList, firstStartHour(actList), lastAct.start);
            let beforeSubResult = activity_selector(beforeList, lastAct.start);
            if ( beforeSubResult.length + 1 > maxList.length ) {
                maxList = [...beforeSubResult, lastAct];
            }
        }
        memo[beforeHour] = maxList;

        return maxList;
    }

    
    let result = activity_selector(acts, lastFinishHour(acts));
    console.log(result);
    ```
5. 这里的最优解是要求最多的活动数量，还有一种需求是最多的使用时间，也就是要选出总用时最多的若干个活动。因此需要计算和比较每种选择的活动的总用时
    ```js
    // 增加一个辅助方法，用来计算活动列表 actList 中所有活动总的小时数
    function actsHours (actList) {
        let hours = 0;
        actList.forEach((act) => {
            hours += act.finish - act.start;
        });
        return hours;
    }

    function activity_selector (actList) {
        if (actList.length <= 1) {
            return actList;
        }

        let maxList = [];
        let maxHours = 0;

        for (let i=0; i<actList.length; i++) {
            let lastAct = actList[i];
            let beforeList = getListByHours(actList, firstStartHour(actList), lastAct.start);
            let beforeSubResult = activity_selector(beforeList);
            let resultList = [...beforeSubResult, lastAct];
            // 计算当前选择的总小时数
            let hours = actsHours(resultList)
            if (hours > maxHours) {
                maxHours = hours;
                maxList = resultList;
            }
        }

        return maxList;
    }


    let result = activity_selector(acts)
    console.log(result);
    // 0: (2) [0, 6]
    // 1: (2) [6, 10]
    // 2: (2) [12, 16]
    ```

#### C 实现
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define ACT_COUNT 11
#define MAX_FINISH 16

// 按照结束时间升序
int startTimes[ACT_COUNT] = {1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};
int finishTimes[ACT_COUNT] = {4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};

// 找到在 index 活动开始之前结束的活动中最后一个结束的
int last_finish_before (int startIdx, int endIdx, int index) {
    // 在 index 开始前结束，肯定也在它结束前结束
    int i = index - 1;
    while (i >= startIdx && finishTimes[i] > startTimes[index]) {
        i--;
    }
    return i;
}

int actIndices[ACT_COUNT]; // 记录最优解中的活动

int cache[ACT_COUNT][ACT_COUNT];

void init_cache () {
    for (int i=0; i<ACT_COUNT; i++) {
        for (int j=0; j<ACT_COUNT; j++) {
            cache[i][j] = -1;
        }
    }
}

int activity_selector (int startIdx, int endIdx) {
    if (startIdx > endIdx) {
        return 0;
    }
    if (cache[startIdx][endIdx] != -1) {
        return cache[startIdx][endIdx];
    }

    int max = 0; // 记录最优解活动数量
    int m; // 记录最优解选定的最后一个活动
    for (int i=startIdx; i<=endIdx; i++) {
        int p = last_finish_before(startIdx, endIdx, i);
        int n = activity_selector(startIdx, p) + 1;
        if (n > max) {
            max = n;
            m = i;
        }
    }
    actIndices[m] = 1;
    cache[startIdx][endIdx] = max;
    return max;
}


int main() {
    init_cache();

    int n = activity_selector(0, ACT_COUNT-1);
    printf("%d\n", n); // 4

    for (int i=0; i<ACT_COUNT; i++) {
        printf("%d ", actIndices[i]);
    }
    printf("\n"); // 1 0 0 1 0 0 0 1 0 0 1


    return 0;
}
```

#### 背包问题方法的递归解法
1. 按照 0-1 背包的思路，每次的两个选择是选不选最后一个活动：
    * 如果选了最后一个活动，那子问题参数就是最后一个活动开始前的所有活动；
    * 如果没选，子问题就是活动列表中最后一个活动前面的所有活动。
2. 实现
```cpp
int activity_selector (int startIdx, int endIdx) {
    if (startIdx > endIdx) {
        return 0;
    }
    if (cache[startIdx][endIdx] != -1) {
        return cache[startIdx][endIdx];
    }

    // 选最后一个活动
    // 获得最后一个活动之前能兼容的活动，并计算子问题
    int lastIdx = last_finish_before(startIdx, endIdx, endIdx);
    int m = activity_selector(startIdx, lastIdx) + 1;
    
    // 不选最后一个活动
    int n = activity_selector(startIdx, endIdx-1);

    if (m > n) {
        cache[startIdx][endIdx] = m;
        actIndices[endIdx] = 1; // 选了就标记
        return m;
    }
    else {
        cache[startIdx][endIdx] = n;
        return n;
    }
}
```

### 自底向上解法
1. 在产生一个子问题的最优子结构的递归式中，随着递归的深入，我们会不断的求解更早时间段的最大兼容活动集。例如最开始我们会在前 16 个小时里找到最大兼容活动集，然后递归的子问题中，我们就要在前 12 个小时里找到最大兼容活动集。
2. 因此自底向上的解法中，我们就可以从最小的时间段（一小时）开始，逐个增加时间段长度（增加小时数）并计算每个时间段的最大兼容活动集，一直计算到最终的前 16 个小时时间段的最大兼容活动集。
    ```js
    const table = [];

    function activity_selector (actList, lastHour) {
        // 下面的遍历填表从 1 开始，所以不会填 table[0]，但有活动的开始时间是 0，
        // 不过不设置为空数组则 table[0] 会是 undefined
        table[0] = []; 

        // 计算逐小时递增的时间段的最大兼容活动集
        for (let h=1; h<=lastHour; h++) {
            // 当前时间段里的所有活动
            let currList = getListByHours(actList, firstStartHour(actList), h);
            
            // 根据最优子结构，求出当前时间段的最大兼容活动集
            let maxList = [];
            for (let i=0; i<currList.length; i++) {
                let lastAct = currList[i];
                let result = [...table[lastAct.start], lastAct];
                if (result.length > maxList.length) {
                    maxList = result;
                }
            }
            table[h] = maxList;
        }

        return table[lastHour];
    }


    let result = activity_selector(acts, lastFinishHour(acts));
    console.log(result);
    // 0: {start: 1, finish: 4}
    // 1: {start: 5, finish: 7}
    // 2: {start: 8, finish: 11}
    // 3: {start: 12, finish: 16}
    console.log(table);
    ```

#### C 实现
```cpp
#define ACT_COUNT 11
#define MAX_FINISH 16

int acts[ACT_COUNT+1][2] = {
    {-1, -1}, // 从 1 开始计数
    {1,   4},
    {3,   5},
    {0,   6},
    {5,   7},
    {3,   9},
    {5,   9},
    {6,  10},
    {8,  11},
    {8,  12},
    {2,  14},
    {12, 16},
};

// 记录每个时间段的最大兼容活动集的活动数量
int actCountTable[MAX_FINISH+1] = {0};
// 记录每个时间段的最大兼容活动集的最后一个活动在 acts 中的 index
int resultLastIdxTable[MAX_FINISH+1] = {0};


int activity_selector (int actList[][2], int lastHour) {
    // 从小到大遍历每个时间段，记录每个时间段的最大兼容活动集
    for (int h=1; h<=lastHour; h++) {
        int maxCount = 0;
        // 对于每个时间段，选择该时间段内的一个活动最为最大兼容活动集的最后一个活动
        for (int i=1; i<=ACT_COUNT; i++) {
            // 活动已经按结束时间递增排序了，所以如果选中的一个活动的结束时间超过了时间段范围，
            // 那后序的活动肯定也会超过。
            // 因为下面这个判断，所以在本例中，h 小于 4 时即使 i 为 1 也会直接 break，
            // 因为本例第一个活动的的结束时间是 4。
            if (actList[i][1] > h) { 
                break;
            }
            // 最后一个活动开始前的时间段的最大兼容活动集数量再加上当前最后一个活动的数量 1
            if (actCountTable[actList[i][0]] + 1 > maxCount) {
                maxCount = actCountTable[actList[i][0]] + 1;
                // 记录当前时间段的最大兼容活动集最后一个活动在 acts 中的 index    
                resultLastIdxTable[h] = i;
            }
        }
        // 记录当前时间段的最大兼容活动集数量
        actCountTable[h] = maxCount;
    }

    return actCountTable[lastHour];
}

void print_act_count_table () {
    for (int i=1; i<=MAX_FINISH; i++) {
        printf("%d ", actCountTable[i]);
    }
    printf("\n");
}
void print_result_last_index_table () {
    for (int i=1; i<=MAX_FINISH; i++) {
        printf("%d ", resultLastIdxTable[i]);
    }
    printf("\n");
}

// 通过 resultLastIdxTable 可以知道 MAX_FINISH 时间段里最大兼容活动集最后一个活动，以及它的开始时间 s；
// 根据问题的最优子机构，可以继续从 resultLastIdxTable 查到 s 时间段里最大兼容活动集的最后一个活动；
// 以此类推，知道要查找的时间段小于 1；
void print_result (int finishHour) {
    // finishHour 时间段的最大兼容活动集最后一个活动在 acts 中的 index
    int lastActIdx = resultLastIdxTable[finishHour];
    // 要查找的时间段小于 1 当然要停止；
    // 另外如果 lastActIdx 为 0，就说明当前时间段不存在兼容活动集；
    // 在本例中，4 小时之前的时间段都不存在兼容活动集。
    if (finishHour > 0 && lastActIdx > 0) {
        // 获得前一个时间段
        int prevFinishHour = acts[lastActIdx][0];
        // 递归的求解前一个时间段里的最大兼容活动集的最后一个活动
        print_result(prevFinishHour);
        // 在递归之后打印，因此优先打印调用栈最顶层的活动，也就是活动集中最前面的活动
        printf("{%d %d} ", acts[lastActIdx][0], acts[lastActIdx][1]);
    }
}

int main (void) {

    int count = activity_selector(acts, MAX_FINISH);

    printf("%d\n", count); // 4

    print_act_count_table();
    // 0 0 0 1 1 1 2 2 2 2 3 3 3 3 3 4

    print_result_last_index_table();
    // 0 0 0 1 1 1 4 4 4 4 8 8 8 8 8 11

    print_result(MAX_FINISH); // {1 4} {5 7} {8 11} {12 16} 
    
    printf("\n");

    return 0;
}
```


## 贪心选择
1. 假如我们不需要求解所有的子问题会怎样？如果每次选择一个活动不需要遍历当前的所有活动而是确定的选择一个。
2. 对于活动选择问题，我们其实每次不需要遍历当前的所有活动，而只需要考虑一个选择，就是贪心选择。
3. 我开始想到的贪心选择是时长最短的活动。但实际上正确的贪心选择是结束时间最早的活动。《算法导论》练习 16.1-3。虽然不知道怎么证明，但可以随便举出一个反例：$\{(1,9),(8,11),(10,20)\}$，显然如果选择 $(8, 11)$ 将不会得到最大兼容活动集。
4. 另外，贪心的选择与其他活动冲突最少的活动也不行，反例是 ${(−1,1),(2,5),(0,3),(0,3),(0,3),(4,7),(6,9),(8,11),(8,11),(8,11),(10,12)}$，和其他活动冲突最少的是 $(4,7)$，但唯一的最大兼容子集是 $ (−1,1), (2,5), (6,9), (10,12)$。
5. 《算法导论》证明选择最早结束的活动是正确的。如果最早结束的活动不在最大兼容子集里，那它的结束时间肯定小于等于最大兼容子集里的第一个活动，那么它就至少可以替换掉这个活动，从而构成另一个最大兼容子集。
6. 或者这么想，你如果选择了一个结束更晚的作为第一个，那剩下的时间肯定更短了，所以显然应该选结束更早的作为第一个；又如果你说选一个结束更晚的可能开始的也更晚，这样前面就可以再插一个。那显然前面插入的这个就成了结束更早的那个。
7. 既然现在可以贪心的选择最早结束的活动，那就先从排好序的所有活动里选择第一个，也就是最早结束的；然后再从剩下的活动里面，选择与第一个活动兼容的且最早结束的；然后以此类推直到没有活动可选。
8. 求解活动选择问题的算法不必像基于表格的动态规划算法那样自底向上进行计算，而是可以自顶向下的计算：选择一个活动方法最优解的活动列表中，然后对剩下的活动再递归选择。
9. 贪心算法通常都是这种自顶向下的设计：做出一个选择，然后求解剩下的子问题。而不是自底向上的求解出很多子问题，然后在通过比较做出选择。


## 递归贪心算法
1. 实现
    ```cpp
    #define ACT_COUNT 11

    int acts[ACT_COUNT][2] = {
        {1,   4},
        {3,   5},
        {0,   6},
        {5,   7},
        {3,   9},
        {5,   9},
        {6,  10},
        {8,  11},
        {8,  12},
        {2,  14},
        {12, 16},
    };


    void activity_selector (int idx) {
        printf("{%d %d} ", acts[idx][0], acts[idx][1]);
        int i = idx;
        do {
            if (++i == ACT_COUNT) {
                return;
            }
        }
        while (acts[i][0] < acts[idx][1]);
        activity_selector(i);
    }


    int main (void) {

        activity_selector(0);
        // {1 4} {5 7} {8 11} {12 16}

        return 0;
    }
    ```
2. 运行时间为 $Θ(N)$。假如所有活动都是兼容的，那么 `while` 永远是假，`recursive_activity_selector` 会被调用 N 次；假如所有活动都不兼容，那么 `recursive_activity_selector` 只会初始调用一次，它里面的 `while` 循环会被执行 N 次；其他的情况就是，`while` 少循环一次，而 `recursive_activity_selector` 多调用一次。
3. 如果按照最晚开始时间来设计贪心算法
    ```cpp
    #include <stdio.h>

    #define N 11

    // 这里要按照开始时间排序
    int start_time[N] =  {0, 1, 2,  3, 3, 5, 5, 6,  8,  8,  12};
    int finish_time[N] = {6, 4, 14, 9, 5, 9, 7, 10, 12, 11, 16};

    int activity[N];

    void recursive_activity_selector_by_start_time (int lastIdx, int lastStartTime) {
        int idx = lastIdx - 1;
        while (idx >= 0 && finish_time[idx] > lastStartTime) {
            idx--;
        }
        if (idx == -1) {
            return;
        }
        activity[idx] = 1;
        recursive_activity_selector_by_start_time(idx, start_time[idx]);
    }

    void printSelectedIndexes(int activity[]) {
        for (int i=0; i<N; i++) {
            if (activity[i] == 1) {
                printf("%d ", i);
            }
        }
        printf("\n");
    }


    int main(void) {
        recursive_activity_selector_by_start_time(N, 24);
        printSelectedIndexes(activity); // 4 6 9 10

        return 0;
    }
    ```


## 迭代贪心算法
1. 我们可以很容易的将 `recursive_activity_selector` 转换为迭代形式。`recursive_activity_selector` 几乎就是尾递归，将一个尾递归改为迭代形式通常是很直接的。实际上，某些语言的编译器可以自动完成这一工作。
2. 上面的递归调用中，每次调用内部会递增更新 `i`，每次递归调用时会更新 `idx`。因此在迭代中，使用 `i` 来遍历列表，使用 `idx` 来更新每次最早结束的活动
    ```cpp
    void activity_selector (int idx) {
        printf("{%d %d} ", acts[idx][0], acts[idx][1]);
        int i = idx + 1;
        while (i < ACT_COUNT) {
            if (acts[i][0] >= acts[idx][1]) {
                printf("{%d %d} ", acts[i][0], acts[i][1]);
                idx = i;
            }
            i++;
        }
    }
    ```
3. 运行时间也是 $Θ(N)$。


## TODO
* 《算法导论》练习 16.1-4
* 《算法导论》练习 16.1-5


## References
* [CLRS Solutions](https://walkccc.me/CLRS)