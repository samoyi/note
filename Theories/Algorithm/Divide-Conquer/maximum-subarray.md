# The maximum-subarray problem


<!-- TOC -->

- [The maximum-subarray problem](#the-maximum-subarray-problem)
    - [本质](#本质)
        - [复杂度不同的本质](#复杂度不同的本质)
            - [动态规划的情况](#动态规划的情况)
            - [分治法的情况](#分治法的情况)
    - [设计思想](#设计思想)
        - [怎么想到用分治的](#怎么想到用分治的)
        - [暴力算法的改进](#暴力算法的改进)
        - [动态规划](#动态规划)
    - [分治思路](#分治思路)
        - [划分](#划分)
        - [寻找跨越中点的最大子数组](#寻找跨越中点的最大子数组)
        - [递归求解](#递归求解)
        - [递归式和复杂度](#递归式和复杂度)
    - [暴力求解](#暴力求解)
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
### 怎么想到用分治的
1. 拿到问题时，发现问题规模太大了，不好处理。（可能只是一个十项数组，但是人脑的处理能力实在有有限）
2. 于是可以尝试分治，那么最简单的就是一分为二。
3. 立刻会想到的是左侧子数组和右侧子数组找最大的，但是很快就会意识到跨越的问题。于是就是三个里面找最大的。
4. 问题的关键就是在跨域两侧的数组里面求最大的。

### 暴力算法的改进
1. 在确定的子数组起点的情况下，求不同终点时的子数组 sum 有些动态规划的感觉：每次求一个新的 sum 不需要从头开始求，而只需要用当前项加上之前的结果即可。
2. 当我们在解决某个问题的时候，可能会首先想到一个直接粗暴的解法，那我们需要再想想有什么更好的办法，而一种常见的优化就是：利用已有的结果最为基础。

### 动态规划


## 分治思路
### 划分
1. Let’s think about how we might solve the maximum-subarray problem using the divide-and-conquer technique. 
2. Suppose we want to find a maximum subarray of the subarray $A[low..high]$. Divide-and-conquer suggests that we divide the subarray into two subarrays of as equal size as possible. 
3. That is, we find the midpoint, say $mid$, of the subarray, and consider the subarrays $A[low..mid]$ and $A[mid+1..high]$. 
4. Any contiguous subarray $A[i..j]$ of $A[low..high]$ must lie in exactly one of the following places:
    * entirely in the subarray $A[low..mid]$, so that low $i \le j \le mid$,
    * entirely in the subarray $A[mid+1..high]$, so that $mid < i \le j \le high$, or
    * crossing the midpoint, so that $low \le i \le mid < j \le high$
5. We can find maximum subarrays of $A[low..mid]$ and $A[mid+1..high]$ recursively, because these two subproblems are smaller instances of the problem of finding a maximum subarray. 
6. Thus, all that is left to do is find a maximum subarray that crosses the midpoint, and take a subarray with the largest sum of the three.

### 寻找跨越中点的最大子数组
1. We can easily find a maximum subarray crossing the midpoint in time linear in the size of the subarray $A[low..high]$. 
2. This problem is not a smaller instance of our original problem, because it has the added restriction that the subarray it chooses must cross the midpoint.
3. Any subarray crossing the midpoint is itself made of two subarrays $A[i..mid]$ and $A[mid+1..j]$, where $low \le i \le mid$ and $mid < j \le high$. 
4. Therefore, we just need to find maximum subarrays of the form $A[i..mid]$ and $A[mid+1..j]$ and then combine them. 
5. The procedure `find_max_crossing_subarray` takes as input the array `arr` and the indices `lowIdx`, `midIdx`, and `highIdx`, and it returns a tuple containing the indices demarcating a maximum subarray that crosses the midpoint, along with the sum of the values in a maximum subarray
    ```js
    let arr = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
    let len = arr.length; 
    // 中点是 18

    function find_max_crossing_subarray (arr, lowIdx, midIdx, highIdx) {
        let leftSum = Number.NEGATIVE_INFINITY;
        let rightSum = Number.NEGATIVE_INFINITY;
        let leftMaxtIdx, rightMaxtIdx, tempSum;
        
        tempSum = 0;
        for (let i=midIdx; i>=0; i--) {
            tempSum += arr[i];
            if (tempSum > leftSum) {
                leftSum = tempSum;
                leftMaxtIdx = i;
            }
        }

        tempSum = 0;
        for (let i=midIdx+1; i<=highIdx; i++) {
            tempSum += arr[i];
            if (tempSum > rightSum) {
                rightSum = tempSum;
                rightMaxtIdx = i;
            }
        }

        return [leftMaxtIdx, rightMaxtIdx, leftSum + rightSum];
    }

    let re = find_max_crossing_subarray(arr, 0, Math.floor((len-1)/2), len-1);
    console.log(re); // [7, 10, 43]
    ```
6. 可以看到，对于长度为 $n$ 的数组，这个方法中两个 `for` 的总次数也是 $n$。

### 递归求解
1. With a linear-time `find_max_crossing_subarray` procedure in hand, we can write pseudocode for a divide-and-conquer algorithm to solve the maximumsubarray problem
    ```js
    function find_maximum_subarray (arr, lowIdx, highIdx) {
        if (lowIdx === highIdx) {
            return [lowIdx, highIdx, arr[lowIdx]];
        }

        let midIdx = Math.floor((lowIdx + highIdx)/2);

        let leftTuple = find_maximum_subarray(arr, lowIdx, midIdx);
        let rightTuple = find_maximum_subarray(arr, midIdx+1, highIdx);
        let crossTuple = find_max_crossing_subarray(arr, lowIdx, midIdx, highIdx);
        
        let leftSum = leftTuple[2];
        let rightSum = rightTuple[2];
        let crossSum = crossTuple[2];

        if (leftSum >= rightSum && leftSum >= crossSum) {
            return leftTuple;
        }
        else if (rightSum >= leftSum && rightSum >= crossSum) {
            return rightTuple;
        }
        else {
            return crossTuple;
        }
    }
    ```

### 递归式和复杂度
直接看《算法导论》42页的分析。和归并排序具有一样的复杂度，都是 $n\lg n$ 级别。


## 暴力求解
1. 刚开始写了这样的解法
    ```js
    function brute_force_find_maximum_subarray(arr, lowIdx, highIdx) {
        let i, j, k, maxLeft, maxRight, sum, max = Number.NEGATIVE_INFINITY;
        for (i=lowIdx; i<=highIdx; i++) {
            for (j=i; j<=highIdx; j++) {
                sum = 0;
                for (k=i; k<=j; k++) {
                    sum += arr[k];
                }
                if (sum > max) {
                    max = sum;
                    maxLeft = i;
                    maxRight = j;
                }
            }
        }
        return [maxLeft, maxRight, max];
    }
    ```
2. 都达到立方级别了。实际上最内层的 `for` 循环是不需要的，在 `i` 确定后，每次 `j` 的更新不需要清零 `sum` 重新计算，而是直接在上一次 `j` 计算出的 `sum` 的基础上累加就行了
    ```js
    function brute_force_find_maximum_subarray(arr, lowIdx, highIdx) {
        let i, j, maxLeft, maxRight, sum, max = Number.NEGATIVE_INFINITY;
        for (i=lowIdx; i<=highIdx; i++) {
            sum = 0;
            for (j=i; j<=highIdx; j++) {
                sum += arr[j];
                if (sum > max) {
                    max = sum;
                    maxLeft = i;
                    maxRight = j;
                }
            }
        }
        return [maxLeft, maxRight, max];
    }
    ```
3. 当数组规模很小时，暴力算法会更快。不过话说回来，如果很小，分治也很快，所以没必要同时实现两个算法。


## 线性时间的动态规划版本
1. 最大子数组可能是以数组中的 `A[i]` 作为结尾的。我们遍历数组，计算每个 `A[i]` 作为结尾的局部最大子数组，看看哪一个是全局最大的。
2. 局部最大子数组至少包含一项 `A[i]`，它前面可能包含另个或多个项。
3. 如果以 `A[i-1]` 结尾的局部最大子数组的值是正的，那 `A[i]` 就可以合并它们，变成一个更大的局部子数组；如果以 `A[i-1]` 结尾的局部最大子数组的值是零甚至是负的，那 `A[i]` 合并它们就无效甚至会越来越小，那 `A[i]` 自己就是局部最大子数组。
4. 如果使用变量 `currSum` 来追踪 `A[i-1]` 的局部最大子数组的值，那么就有
    ```js
    if (currSum > 0) {
        currSum += arr[i]; 
    }
    else {
        currSum = arr[i];
    }
    ```
5. 这样就可以每次基于以前一项结尾的局部最大子数组的值计算以当前项结尾的局部最大子数组的值。所有局部最大子数组的值中最大的就是全局最大的
    ```js
    function kadane_find_maximum_subarray(arr, lowIdx, highIdx) {
        let maxSum = Number.NEGATIVE_INFINITY;
        let currSum = Number.NEGATIVE_INFINITY;
        
        for (let i=lowIdx; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum += arr[i]; 
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
6. 记录上最大子数组的首尾序号。尾序号 `maxRight` 好确定，只要当前元素比 `maxSum`，那当前元素的需要就是 `maxRight`。但 `maxLeft` 有点没那么简单，我最初是这么计算
    ```js
    function kadane_find_maximum_subarray(arr, lowIdx, highIdx) {
        let maxSum = Number.NEGATIVE_INFINITY;
        let currSum = Number.NEGATIVE_INFINITY;
        let maxLeft = -1;
        let maxRight = -1;

        for (let i=lowIdx; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum += arr[i]; 
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
        
        return [maxLeft, maxRight, maxSum];
    }
    ```
7. 使用数组 `[13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7]` 测试时没发现问题。但使用 `[13, -3, -25, 20, -3, -16, -23, 18]` 测试时，正确的情况是 `maxLeft` 和 `maxRight` 都是 3，但计算结果 `maxLeft` 变成了 7。
8. 问题就在于，这样的实现中，找到了最大子数组之后，如果后面的累加导致 `currSum` 小于等于 0，则 `maxLeft` 会错误的发生变化。那个长数组之所以没法显示出错误，是因为最大子数组是 `[18, 20, -7, 12]`，此时 `currSum` 为 43，后面几项累加的过程也都是正值。
9. 所以，`maxLeft` 的确定也必须要在 `if (currSum > maxSum)` 里面。那么怎么确定？
10. 一步步推演一次计算的过程会发现，需要在局部 sum 从负值变为非负值的时候记下当前的索引，然后在 `currSum` 大于 `maxSum` 的时候，把刚才记下的索引作为 `maxLeft`。增加一个变量 `tempMaxLeft` 用于记录
    ```js
    function kadane_find_maximum_subarray(arr, lowIdx, highIdx) {
        let maxSum = Number.NEGATIVE_INFINITY;
        let currSum = Number.NEGATIVE_INFINITY;
        let maxLeft = -1;
        let maxRight = -1;

        let tempMaxLeft = -1;

        for (let i=lowIdx; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum += arr[i]; 
            }
            else {
                currSum = arr[i];
                // 上一轮的 currSum 小于等于零，所以走到了这里的 else
                // 下面的 if 说明变为了非负值
                if (currSum >= 0) {
                    tempMaxLeft = i;
                }
            }
            if (currSum > maxSum) {
                maxSum = currSum;
                maxLeft = tempMaxLeft;
                maxRight = i;
            }
        }

        return [maxLeft, maxRight, maxSum];
    }
    ```
11. 但现在还有问题，比如说输入数组是 `[-5, -4, -3, -2, -1]` 这样全都是负值的，则 `currSum >= 0` 永远都会是 `false`。导致 `maxLeft` 停留在初始的 -1。在这种情况下，并不存在 “局部 sum 从负值变为非负值”。
12. 实际上，`maxLeft` 所在的位置并不要求是非负值，而是要求它前一个位置不能是正值，因为如果是正值，那 `maxLeft` 就应该左移到这个正值上。
13. 所以 `tempMaxLeft = i` 不需要外层的判断
    ```js
    function kadane_find_maximum_subarray(arr, lowIdx, highIdx) {
        let maxSum = Number.NEGATIVE_INFINITY;
        let currSum = Number.NEGATIVE_INFINITY;
        let maxLeft = -1;
        let maxRight = -1;

        let tempMaxLeft = -1;

        for (let i=lowIdx; i<=highIdx; i++) {
            if (currSum > 0) {
                currSum += arr[i]; 
            }
            else {
                currSum = arr[i];
                tempMaxLeft = i;
            }
            if (currSum > maxSum) {
                maxSum = currSum;
                maxLeft = tempMaxLeft;
                maxRight = i;
            }
        }
        return [maxLeft, maxRight, maxSum];
    }
    ```


## References
* [算法导论](https://book.douban.com/subject/20432061/)