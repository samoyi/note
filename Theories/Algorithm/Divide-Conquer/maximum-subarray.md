# The maximum-subarray problem


<!-- TOC -->

- [The maximum-subarray problem](#the-maximum-subarray-problem)
    - [本质](#本质)
    - [设计思想](#设计思想)
        - [怎么想到用分治的](#怎么想到用分治的)
    - [用途](#用途)
    - [分治思路](#分治思路)
        - [划分](#划分)
        - [寻找跨越中点的最大子数组](#寻找跨越中点的最大子数组)
        - [递归求解](#递归求解)
        - [复杂度](#复杂度)
    - [References](#references)

<!-- /TOC -->


## 本质

## 设计思想
### 怎么想到用分治的

创造分治递归

## 用途


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

### 复杂度
直接看《算法导论》42页的分析。和归并排序具有一样的复杂度，都是 $n\lg n$ 级别。



## References
* [算法导论](https://book.douban.com/subject/20432061/)