# 活动选择问题


<!-- TOC -->

- [活动选择问题](#活动选择问题)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [适用场景](#适用场景)
    - [调度竞争共享资源的多个活动](#调度竞争共享资源的多个活动)
    - [如果使用动态规划](#如果使用动态规划)
    - [活动选择问题的最优子结构](#活动选择问题的最优子结构)
    - [贪心选择](#贪心选择)
    - [递归贪心算法](#递归贪心算法)
    - [迭代贪心算法](#迭代贪心算法)
    - [动态规划算法 TODO](#动态规划算法-todo)
    - [TODO](#todo)

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
4. 在 **活动选择问题** 中，我们希望选出一个最大兼容活动集。也就是安排尽可能多的活动，而不是总活动时长更多。
5. 假定活动已经按照结束时间的单调递增顺序排序。


## 如果使用动态规划
1. 我们可以通过动态规划方法将这个问题分为两个子问题，然后将两个子问题的最优解整合为原问题的最优解。
2. 在确定该将哪些子问题用于最优解时，需要考虑几种选择。
3. 但之后会发现，如果使用贪心算法则只需要考虑一种选择，即贪心的选择。
4. 在做贪心选择时，子问题之一必是空的。因此，只留下一个非空子问题。
5. 基于这些观察，我们将找到一种递归贪心算法来解决活动调度问题，并将递归算法转化为迭代算法，以完成贪心算法的过程。


## 活动选择问题的最优子结构
1. 如果使用动态规划，我们就要分析出子结构，找到子问题。
2. 在面对 n 个活动时，我们需要先选定一个活动，假定它就是兼容活动集中的一个。然后，在对它之前的活动（结束时间小于等于它的开始时间）和它之后的活动（开始时间大于等于它的结束时间）递归求解。
3. 我们选定的这个活动，再加上两个递归求解得出的两组活动，加在一起就是一组兼容的活动集合。
4. 当然这一组兼容的活动集合不一定是最优的。所以我们在从 n 个活动里面选定一个活动时，就要遍历 n 个活动，对每种情况都按照上面的方法求解，得出 n 个兼容的活动集合，然后就可以从里面选出一个最优的。
5. 按照这个算法，我们会求解所有可能的子问题。
6. 不过更方便的是，最大兼容活动集的最优子结构包括两部分：
    * 活动集的最后一个活动（选择）
    * 最后这个活动开始之前的所有活动的最大兼容活动集（子问题）
7. 因此最优子结构要做出的选择就是选择哪一个活动作为最优解的最后一个活动，然后做出这个选择后，再递归的求解该活动之前的活动的最优解
    ```js

    const acts = [
        [1, 4],
        [3, 5],
        [0, 6],
        [5, 7],
        [3, 9],
        [5, 9],
        [6, 10],
        [8, 11],
        [8, 12],
        [2, 14],
        [12, 16],
    ];

    // function isCom (act1, act2) {
    //     return act1[1] <= act2[0] || act2[1] <= act1[0];
    // }

    const memo = {};

    // 参数表示求解在时间 finishBefore 之前结束的所有活动的最优解
    function activity_selector (finishBefore) {
        if (finishBefore < 1) {
            return [];
        }
        if (memo[finishBefore]) {
            return memo[finishBefore];
        }
        let max = [];
        for (let i=0; i<acts.length; i++) {
            if (acts[i][1] <= finishBefore) {
                let arr = [...activity_selector(acts[i][0]), acts[i]];
                memo[finishBefore] = arr;
                if (arr.length > max.length) {
                    max = arr;
                }
            }
        }
        return max;
    }


    let result = activity_selector(acts[acts.length-1][1]);
    console.log(result);
    // 0: (2) [3, 5]
    // 1: (2) [5, 7]
    // 2: (2) [8, 11]
    // 3: (2) [12, 16]
    ```
8. 这里的最优解是最多的活动数量，还有一种需求是最多的使用时间，也就是要选出总用时最多的若干个活动。因此需要计算和比较每种选择的活动的总用时
    ```js
    function calcHours (actList) {
        let n = 0;
        actList.forEach((act)=>{
            n += act[1] - act[0];
        });
        return n;
    }


    function activity_selector (finishBefore) {
        if (finishBefore < 1) {
            return [];
        }
        if (memo[finishBefore]) {
            return memo[finishBefore];
        }
        let maxHours = 0;
        let maxList = [];
        for (let i=0; i<acts.length; i++) {
            if (acts[i][1] <= finishBefore) {
                let arr = [...activity_selector(acts[i][0]), acts[i]];
                let hours = calcHours(arr);
                memo[finishBefore] = arr;
                if (hours > maxHours) {
                    maxList = arr;
                    maxHours = hours;
                }
            }
        }
        return maxList;
    }


    let result = activity_selector(acts[acts.length-1][1]);
    console.log(result);
    // 0: (2) [0, 6]
    // 1: (2) [6, 10]
    // 2: (2) [12, 16]
    ```


## 贪心选择
1. 假如我们不需要求解所有的子问题会怎样？如果每次选择一个活动不需要遍历当前的所有活动而是确定的选择一个。
2. 对于活动选择问题，我们其实每次不需要遍历当前的所有活动，而只需要考虑一个选择，就是贪心选择。
3. 我想到的贪心选择是时长最短的活动。但实际上正确的贪心选择是结束时间最早的活动。不懂，为什么不能是时长最短的。一个不算是理由的原因是，如果选择了时长最短的，那么它之前和之后都可能要安排其他活动；而如果选择结束时间最早的，那它之前就没时间安排其他活动了，只要考虑往后面安排活动就行了。
4. TODO，不懂。《算法导论》证明选择最早结束的活动是正确的。《算法导论》练习 16.1-3
5. 既然现在可以贪心的选择最早结束的活动，那就先从排好序的所有活动里选择第一个，也就是最早结束的；然后再从剩下的活动里面，选择与第一个活动兼容的且最早结束的；然后以此类推直到没有活动可选。
6. 求解活动选择问题的算法不必像基于表格的动态规划算法那样自底向上进行计算，而是可以自顶向下的计算：选择一个活动方法最优解的活动列表中，然后对剩下的活动再递归选择。
7. 贪心算法通常都是这种自顶向下的设计：做出一个选择，然后求解剩下的子问题。而不是自底向上的求解出很多子问题，然后在通过比较做出选择。


## 递归贪心算法
1. 假定 `N` 个活动已经按照结束时间递增的顺序排好。
2. 实现
    ```cpp
    #include <stdio.h>

    #define N 11

    int start_time[N] = {1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};
    int finish_time[N] = {4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};
    int activity[N];

    void recursive_activity_selector (int lastIdx, int lastFinishTime) {
        int idx = lastIdx + 1;
        // 找到最早结束的、开始时间大于等于上次活动结束时间的活动
        while ( start_time[idx] < lastFinishTime && idx < N ) {   
            idx++;
        }
        if (idx == N) {
            return;
        }
        activity[idx] = 1; // 标记选中上面找到的活动
        recursive_activity_selector(idx, finish_time[idx]);
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
        recursive_activity_selector(0, 0);
        printSelectedIndexes(activity); // 0 3 7 10
    }
    ```
3. 运行时间为 $Θ(N)$。假如所有活动都是兼容的，那么 `while` 不会被执行，`recursive_activity_selector` 会被递归调用 N 次；假如所有活动都不兼容，那么 `recursive_activity_selector` 只会初始调用一次，它里面的 `while` 循环会被执行 N 次；其他的情况就是，`while` 少执行一次，而 `recursive_activity_selector` 多调用一次。
4. 如果按照最晚开始时间来设计贪心算法
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
2. 一次迭代对应着一次递归调用：新一层的递归调用时传递新的参数，对应新一轮的迭代设置新的值，都是新一轮的新数据；递归的结束条件就是就是迭代的结束条件。
3. 直接改写如下
    ```cpp
    void greedy_activity_selector (int lastFinishTime, int startIdx) {
        while (startIdx < N) { // 结束条件
            if ( start_time[startIdx] >= lastFinishTime ) {
                activity[startIdx] = 1;
                lastFinishTime = finish_time[startIdx]; // 设置新的值
            }
            startIdx++; // 设置新的值
        }
    }
    ```
4. 另外，`recursive_activity_selector` 函数需要参数，是因为每轮递归调用时要通过参数来设置新的值。现在改为迭代后，不需要用该参数来设置新值了，函数值调用一次，即使有参数也是作为初始化的值，所以函数的参数也就没必要了
    ```cpp
    void greedy_activity_selector () {
        activity[0] = 1;
        int finishTime = finish_time[0]; 
        int startIdx = 1;

        while (startIdx < N) {
            if ( start_time[startIdx] >= finishTime ) {
                activity[startIdx] = 1;
                finishTime = finish_time[startIdx];
            }
            startIdx++;
        }
    }
    ```
5. 运行时间也是 $Θ(N)$。



## 动态规划算法 TODO


## TODO
* 《算法导论》练习 16.1-1
* 《算法导论》练习 16.1-4
* 《算法导论》练习 16.1-5
