# The maximum-subarray problem


<!-- TOC -->

- [The maximum-subarray problem](#the-maximum-subarray-problem)
    - [本质](#本质)
        - [复杂度不同的本质](#复杂度不同的本质)
            - [动态规划的情况](#动态规划的情况)
            - [分治法的情况](#分治法的情况)
    - [设计思想](#设计思想)
        - [问题变换](#问题变换)
        - [怎么想到用分治的](#怎么想到用分治的)
        - [暴力算法的改进](#暴力算法的改进)
        - [动态规划的子问题空间](#动态规划的子问题空间)
        - [初始值](#初始值)
    - [暴力求解](#暴力求解)
    - [分治思路](#分治思路)
        - [划分](#划分)
        - [寻找跨越中点的最大子数组](#寻找跨越中点的最大子数组)
        - [递归求解](#递归求解)
        - [递归式和复杂度](#递归式和复杂度)
    - [线性时间的动态规划版本](#线性时间的动态规划版本)
    - [References](#references)

<!-- /TOC -->


## 本质
### 复杂度不同的本质
1. 三种算法都会穷尽每种子数组的可能，但是复杂度却截然不同。为什么？
2. 或者说，这三种穷尽，有什么本质上的差别？既然都是穷尽，为什么不都是平方级别呢？
3. 首先，暴力法是 **独立的** 计算了每一种情况。也就是说，计算一种情况并不会对计算另一种情况有帮助。
4. 暴力法的外层循环确定数组的一端，然后内层循环再确定另一端。

#### 动态规划的情况
1. 动态规划中的循环，也是和暴力法的外层循环差不多的，遍历了数组。但动态规划只有一层循环，确定了数组的一端，另一端的确定则需要参考之前的结果。
2. 动态规划在计算一种情况时，会 **参考之前的计算结果**。
3. 之前的结果为正值，那么本次的计算就要合并之前的结果；否则就只是当前的数组项。
4. 也就是说，动态规划算法不用再使用内层循环遍历每一种可能。只要参考之前的结果，就能立刻得出当前轮的最大子数组。
5. 这就是把暴力法内层的线性时间变成了常量时间。
6. 为了参考之前的结果，就要维护变量来保存之前的结果，也就是下面实现中的 `maxLeft`、`maxRight` 和 `currSum`。
7. 注意从功能实现上来说，`currSum` 不是必须的，因为每次可以 `maxLeft` 和 `maxRight` 算出来。但如果每次都算，就变得有些像平方级别了。

#### 分治法的情况
1. 直观的看，分治法应该会增加工作量才对。比如说要遍历 n 个数，正常是需要时间 n，但你如果一分为二，不仅仍然要数 n 个数，还要再加入划分的时间。
2. 这里的分治复杂度是和归并排序一样的，可以使用《算法导论》20 和 21 页的两个图来思考。
3. 考虑一个 8 项数组，使用分治算法，一共只需要计算 32 个子数组，而不是暴力算法的 36 个。
4. 拆分到最后一层时，拆分出了 8 个单项子数组。
TODO


## 设计思想
### 问题变换
1. 我们希望找到在哪一段时间内价格增长最多。
2. 但我们不在乎增长率，也就是说不需要考虑这段时间的长短，哪怕是增长率很慢的很长一段时间，只要在这段时间内价格增长最多那就是最优解。
3. 增长最多要怎么表示？一段时间的增长要怎么表示？
4. 最直观的当然还是首尾价格差，暴力求解方法就是根据这个计算的。
5. 不过一段时间的总的增长，是由每一天的增长或减少组合到一起的。所以把一段时间中每一天的增长或减少相加，就能得出来这段时间的总的增长。
6. 这样问题就变换成了 **最大子数组**（maximum subarray）问题。

### 怎么想到用分治的
1. 拿到问题时，发现问题规模太大了，不好处理。可能只是一个十项数组，但是人脑的处理能力实在有限。
2. 于是可以尝试分治，那么最简单的就是一分为二。分别找到左侧子数组和右侧子数组中的最大子数组。
3. 但是找到后也不能立刻得到结果，因为还有所有跨越两部分的数组。
4. 就像归并排序中，给左右两个子数组分别排序后，也不能立刻得到整个排序的数组一样，还需要进行一步归并；这里还要再解决跨域左右两边的子数组问题。
5. 左侧子数组中的最大子数组、右侧子数组中的最大子数组、跨域两侧的最大子数组，三者中最大的就是整个数组的最大子数组。问题的关键就是在跨域两侧的数组里面求最大的。

### 暴力算法的改进
1. 在确定的子数组起点的情况下，求不同终点时的子数组 sum 有些动态规划重叠子问题的感觉：每次求一个新的 sum 不需要从头开始求，而只需要用当前项加上之前的结果即可。
2. 当我们在解决某个问题的时候，可能会首先想到一个直接粗暴的解法，那我们需要再想想有什么更好的办法，而一种常见的优化就是：利用已有的结果最为基础。

### 动态规划的子问题空间
1. 如果使用动态规划，那就要描绘出问题的最优子结构：对于整个数组的最大子数组，怎么根据整个数组的一个子数组的最大子数组，来计算出整个数组的最大子数组。
2. 最大子数组问题的解是两个数组项，而得出这个解是根据子数组的和值。
3. 如果使用动态规划，就要看最大子数组的是不是包含子数组的最大子数组，也就是是否具有最优子结构。
4. 接下来，要使用一种选择方式，来确定问题的解。最直观的就是通过两个索引来确定一个子数组，然后遍历所有可能的索引选择，选出和值最大的子数组。
5. 但是如果通过两个索引来确定子数组并比较和值，则还是平方级别的复杂度。
6. 这里的巧妙之处是，想出来只需要一个索引来确定不同的子数组，也就是使用子数组的最右索引。这样，只需要线性的实现就可以遍历所有可能的子数组。
7. 而且更重要的是，如果使用两个索引来确定子数组，则子问题空间比较复杂，很难描绘出最优子结构；所以就尽可能的缩减子问题空间，改为只使用子数组最右索引。


### 初始值
1. `find_max_crossing_subarray` 最初实现中，`leftMax` 和 `rightMax` 初始化为 0，在某些输入的情况下会出现内部循环体一次都不执行的情况。
2. 例如输入为 `{13, -3, -25, 20, -3, -16, -23, 18}` 时，右侧的 `for` 循环就不会执行，所以 `rightMax` 会保持在初始值。其实 `rightMax` 的初始值应该是 -3，但这里就错误的设置为了 0。
3. 也就是说，初始值就应该是语义上的初始值，是该数据默认情况下什么都不发生时的值，而不应该随便的设置为 0 这样的值。


## 暴力求解
1. 遍历所有的日期组合
    ```cpp
    #define PRICE_COUNT 16

    void brute_force_find_maximum_subarray(int* prices, int startIdx, int endIdx, 
                                            int* max, int* maxLeftIdx, int* maxRightIdx);

    int main(void) {
        int prices[PRICE_COUNT] = {113, 110, 85, 105, 102, 86, 63, 81, 
                                    101, 94, 106, 101, 79, 94, 90, 97};
        int max = 0, maxLeftIdx = 0, maxRightIdx = 0;

        brute_force_find_maximum_subarray(prices, 0, PRICE_COUNT-1, 
                                            &max, &maxLeftIdx, &maxRightIdx);

        printf("%d %d %d\n", max, maxLeftIdx, maxRightIdx); // 43 6 10

        return 0;
    }

    void brute_force_find_maximum_subarray(int* prices, int startIdx, int endIdx, 
                                            int* max, int* maxLeftIdx, int* maxRightIdx) {
        if (startIdx >= endIdx) {
            printf("endIdx must be larger than startIdx\n");
            return;
        }

        *max = 0;
        for (int i=startIdx; i<endIdx; i++) {
            for (int j=i+1; j<=endIdx; j++) { // 注意 j 的初始值
                int temp = prices[j] - prices[i];
                if (temp > *max) {
                    *max = temp;
                    *maxLeftIdx = i;
                    *maxRightIdx = j;
                }
            }
        }
    }
    ```
2. 当数组规模很小时，暴力算法会更快。不过如果很小，分治也很快，所以没必要同时实现两个算法。


## 分治思路
### 划分
1. Let’s think about how we might solve the maximum-subarray problem using the divide-and-conquer technique. 
2. Suppose we want to find a maximum subarray of the subarray $A[low..high]$. Divide-and-conquer suggests that we divide the subarray into two subarrays of as equal size as possible. 
3. That is, we find the midpoint, say $mid$, of the subarray, and consider the subarrays $A[low..mid]$ and $A[mid+1..high]$. 
4. Any contiguous subarray $A[i..j]$ of $A[low..high]$ must lie in exactly one of the following places:
    * entirely in the subarray $A[low..mid]$, so that $low \le i \le j \le mid$,
    * entirely in the subarray $A[mid+1..high]$, so that $mid < i \le j \le high$, or
    * crossing the midpoint, so that $low \le i \le mid < j \le high$
5. We can find maximum subarrays of $A[low..mid]$ and $A[mid+1..high]$ recursively, because these two subproblems are smaller instances of the problem of finding a maximum subarray. 
6. Thus, all that is left to do is find a maximum subarray that crosses the midpoint, and take a subarray with the largest sum of the three.

### 寻找跨越中点的最大子数组
1. 我的第一反应还是两个嵌套的循环遍历所有跨域中点的子数组，这样的复杂度仍然是平方级别。
2. 没想到这里居然还能在分治一次，从而将复杂度讲到线性级别。
3. We can easily find a maximum subarray crossing the midpoint in time linear in the size of the subarray $A[low..high]$. 
4. This problem is not a smaller instance of our original problem, because it has the added restriction that the subarray it chooses must cross the midpoint.
5. Any subarray crossing the midpoint is itself made of two subarrays $A[i..mid]$ and $A[mid+1..j]$, where $low \le i \le mid$ and $mid < j \le high$. 
6. Therefore, we just need to find maximum subarrays of the form $A[i..mid]$ and $A[mid+1..j]$ and then combine them. 
7. The procedure `find_max_crossing_subarray` takes as input the array `arr` and the indices `lowIdx`, `midIdx`, and `highIdx`, and it returns a tuple containing the indices demarcating a maximum subarray that crosses the midpoint, along with the sum of the values in a maximum subarray
    ```cpp
    #define PRICE_COUNT 16

    typedef struct {
        int lowIdx;
        int highIdx;
    } Arr_Indexes;

    typedef struct {
        int leftIdx;
        int rightIdx;
        int sum;
    } Max_Subarray_Tuple;


    int main(void) {
        int arr[PRICE_COUNT] = {13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7};

        Arr_Indexes indexes = {0, PRICE_COUNT-1};
        Max_Subarray_Tuple tuple = {}; 

        find_max_crossing_subarray(arr, &indexex, &tuple);
        print_subarray_tuple(&tuple); // [7 10 43]

        return 0;
    }

    void find_max_crossing_subarray (int* arr, Arr_Indexes* indexes, Max_Subarray_Tuple* tuple) {
        int midIdx = (indexes->highIdx + indexes->lowIdx) / 2;
        int currLeft = midIdx;
        int currRight = midIdx + 1;
        
        // 本来下面这部分是注释中的实现，其中开始的四个变量都初始化为了 0，
        // 在这个输入数组这里并没有看到问题；
        // 但是如果使用数组 {13, -3, -25, 20, -3, -16, -23, 18} 测试，输出是 [3 4 20]，
        // 而正确的应该是 [3 4 17]；
        // 因为在当前输入中，第二个 for 循环一次都没有执行，所以最后的 rightMax 值为 0；
        // 但实际上如果一次都没执行，rightMax 和 leftMax 都应该是起始位置的值；
        // 这里 leftSum 和 rightSum 初始化为 0 并没有问题，因为如果会进入循环，
        // 会立刻初始化为初始的数组项的值；如果不仅如此循环，最后也不会用到这两个变量。

        // int leftMax = 0;
        // int rightMax = 0;
        // int leftSum = 0;
        // int rightSum = 0;

        // for (int i=midIdx; i>=indexes->lowIdx; i--) {
        //     leftSum += arr[i];
        //     if (leftSum > leftMax) {
        //         leftMax = leftSum;
        //         currLeft = i;
        //     }
        // }

        // for (int j=midIdx+1; j<=indexes->highIdx; j++) {
        //     rightSum += arr[j];
        //     if (rightSum > rightMax) {
        //         rightMax = rightSum;
        //         currRight = j;
        //     }
        // }

        // 现在把 leftMax 和 rightMax 改为真正的初始值，也就是初始位置的数组项的值；
        // leftSum 和 rightSum 虽然没有影响，但按照语义也改为这两个真正的初始值；
        // leftSum 和 rightSum 修改了之后，for 循环就要从初始位置的下一个位置开始计算新的 
        // leftSum 和 rightSum。
        int leftMax = arr[currLeft];
        int rightMax = arr[currRight];
        int leftSum = arr[currLeft];
        int rightSum = arr[currRight];

        for (int i=midIdx-1; i>=indexes->lowIdx; i--) {
            leftSum += arr[i];
            if (leftSum > leftMax) {
                leftMax = leftSum;
                currLeft = i;
            }
        }
        
        for (int j=midIdx+2; j<=indexes->highIdx; j++) {
            rightSum += arr[j];
            if (rightSum > rightMax) {
                rightMax = rightSum;
                currRight = j;
            }
        }

        tuple->leftIdx = currLeft;
        tuple->rightIdx = currRight;
        tuple->sum = leftMax + rightMax;
    }
    ```
6. 可以看到，对于长度为 $n$ 的数组，这个方法中两个 `for` 的总次数也是 $n$。

### 递归求解
1. With a linear-time `find_max_crossing_subarray` procedure in hand, we can write a divide-and-conquer algorithm to solve the maximumsubarray problem
    ```cpp
    void find_maximum_subarray (int* arr, Arr_Indexes* indexes, Max_Subarray_Tuple* tuple) {
        
        if (indexes->lowIdx == indexes->highIdx) {
            // 这里也要赋值，否则递归到最后这里的时候 tuple 里的值还是未初始化的
            tuple->leftIdx = indexes->lowIdx;
            tuple->rightIdx = indexes->highIdx;
            tuple->sum = arr[indexes->lowIdx];
            return;
        }

        int midIdx = (indexes->lowIdx + indexes->highIdx) / 2;

        Arr_Indexes leftIndexes = {indexes->lowIdx, midIdx};
        Max_Subarray_Tuple leftTuple;
        find_maximum_subarray(arr, &leftIndexes, &leftTuple);

        Arr_Indexes rightIndexes = {midIdx+1, indexes->highIdx};
        Max_Subarray_Tuple rightTuple;
        find_maximum_subarray(arr, &rightIndexes, &rightTuple);
        
        Arr_Indexes midIndexes = {indexes->lowIdx, indexes->highIdx};
        Max_Subarray_Tuple crossTuple;
        find_max_crossing_subarray(arr, &midIndexes, &crossTuple);


        Max_Subarray_Tuple maxTuple;
        if (leftTuple.sum >= crossTuple.sum && leftTuple.sum >= rightTuple.sum) {
            maxTuple = leftTuple;
        }
        else if (crossTuple.sum >= leftTuple.sum && crossTuple.sum >= rightTuple.sum) {
            maxTuple = crossTuple;
        }
        else {
            maxTuple = rightTuple;
        }
        tuple->sum = maxTuple.sum;
        tuple->leftIdx = maxTuple.leftIdx;
        tuple->rightIdx = maxTuple.rightIdx;
    }
    ```

### 递归式和复杂度
直接看《算法导论》42 页的分析。和归并排序具有一样的复杂度，都是 $n\lg n$ 级别。


## 线性时间的动态规划版本
1. 最大子数组可能是以数组中的 `A[i]` 作为结尾的。我们遍历数组，计算每个 `A[i]` 作为结尾的局部最大子数组，看看哪一个是全局最大的。
2. 局部最大子数组至少包含一项 `A[i]`，它前面可能包含零个、一个或多个项。
3. 如果以 `A[i-1]` 结尾的局部最大子数组的值是正的，那 `A[i]` 就可以合并它们，变成一个更大的局部子数组；如果以 `A[i-1]` 结尾的局部最大子数组的值是零甚至是负的，那 `A[i]` 合并它们就无效甚至会越来越小，那 `A[i]` 自己就是局部最大子数组。
4. 如果使用变量 `currSum` 来追踪 `A[i-1]` 的局部最大子数组的值，那么就有
    ```cpp
    if (currSum > 0) {
        currSum += arr[i]; 
    }
    else {
        currSum = arr[i];
    }
    ```
5. 最优子结构：以 `A[i]` 结尾的最大子数组，要么是 `A[i]` 自己，要么就是以 `A[i-1]` 结尾的最大子数组再加上 `A[i]`。
6. 重叠子问题：计算以 `A[i]` 结尾的最大子数组，需要用到以 `A[i-1]` 结尾的最大子数组，进一步用到以 `A[i-2]` 结尾的最大子数组，以此类推。
7. 这样就可以每次基于以前一项结尾的局部最大子数组的值计算以当前项结尾的局部最大子数组的值。所有局部最大子数组的值最大的就是全局最大的
    ```cpp
    int main(void) {
        int arr[PRICE_COUNT] = {13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7};

        int maxSum = kadane_find_maximum_subarray (arr, 0, PRICE_COUNT-1);
        printf("%d\n", maxSum); // 43

        return 0;
    }


    int kadane_find_maximum_subarray (int* arr, int lowIdx, int highIdx) {
        if (lowIdx == highIdx) {
            return arr[lowIdx];
        }

        int currSum = arr[lowIdx];
        int maxSum = arr[lowIdx];

        for (int i=lowIdx+1; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum = arr[i] + currSum;
            }
            else {
                currSum = arr[i];
            }
            if (currSum > maxSum) {
                maxSum = currSum;
            }
        }

        return maxSum;
    }
    ```
8. 接下来需要记录最大子数组的首尾序号。尾序号 `maxRight` 好确定，只要当前元素比 `maxSum`，那当前元素的序号就是 `maxRight`。但 `maxLeft` 有点没那么简单，我最初是这么计算
    ```cpp
    void kadane_find_maximum_subarray (int* arr, int lowIdx, int highIdx, 
                                        Max_Subarray_Tuple* tuple) {
        if (lowIdx == highIdx) {
            tuple->leftIdx = lowIdx;
            tuple->rightIdx = highIdx;
            tuple->sum = arr[lowIdx];
        }

        int currSum = arr[lowIdx];
        int maxSum = arr[lowIdx];

        int maxLeft = 0;
        int maxRight = 0;

        for (int i=lowIdx+1; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum = arr[i] + currSum;
            }
            else {
                currSum = arr[i];
                maxLeft = i;
            }
            if (currSum > maxSum) {
                maxSum = currSum;
                maxRight = i;
            }
        }

        tuple->leftIdx = maxLeft;
        tuple->rightIdx = maxRight;
        tuple->sum = maxSum;
    }
    ```
9. 使用数组 `[13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7]` 测试时没发现问题。但使用 `[13, -3, -25, 20, -3, -16, -23, 18]` 测试时，正确的情况是 `maxLeft` 和 `maxRight` 都是 3，但计算结果 `maxLeft` 变成了 7。
10. 问题就在于，这样的实现中，找到了最大子数组之后，如果后面的累加导致 `currSum` 小于等于 0，则 `maxLeft` 会错误的发生变化。
11. 那个长数组之所以没显示出错误，是因为最大子数组是 `[18, 20, -7, 12]`，此时 `currSum` 为 43，后面几项累加的过程也都是正值。
12. 也就是说，这里的 `maxLeft` 在任何 `currSum` 小于等于零的时候都会更新。但正确的情况是，只有在 `maxSum` 发生更新时的 `maxLeft` 才是最大子数组对应的 `maxLeft`。
13. 所以，`maxLeft` 的确定也必须要在 `if (currSum > maxSum)` 里面。引入变量 `lastMaxLeft` 记录每次的更新，然后在 `if (currSum > maxSum)` 中把 `lastMaxLeft` 赋值给 `maxLeft`
    ```cpp
    void kadane_find_maximum_subarray (int* arr, int lowIdx, int highIdx, 
                                        Max_Subarray_Tuple* tuple) {
        if (lowIdx == highIdx) {
            tuple->leftIdx = lowIdx;
            tuple->rightIdx = highIdx;
            tuple->sum = arr[lowIdx];
        }

        int currSum = arr[lowIdx];
        int maxSum = arr[lowIdx];

        int lastMaxLeft = 0;
        int maxLeft = 0;
        int maxRight = 0;

        for (int i=lowIdx+1; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum = arr[i] + currSum;
            }
            else {
                currSum = arr[i];
                lastMaxLeft = i;
            }
            if (currSum > maxSum) {
                maxSum = currSum;
                maxLeft = lastMaxLeft;
                maxRight = i;
            }
        }

        tuple->leftIdx = maxLeft;
        tuple->rightIdx = maxRight;
        tuple->sum = maxSum;
    }
    ```


## References
* [算法导论](https://book.douban.com/subject/20432061/)