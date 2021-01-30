# QuickSort


<!-- TOC -->

- [QuickSort](#quicksort)
    - [设计思想](#设计思想)
    - [概述](#概述)
    - [基本算法](#基本算法)
        - [分治描述](#分治描述)
        - [`partition` 实现](#partition-实现)
    - [时间复杂度](#时间复杂度)
        - [`partition` 的时间复杂度](#partition-的时间复杂度)
        - [最坏的输入情况](#最坏的输入情况)
        - [最好的输入情况](#最好的输入情况)
        - [常数比例的划分，时间复杂度都是 $O(n \lg n)$](#常数比例的划分时间复杂度都是-on-\lg-n)
        - [对于平均情况的直观观察](#对于平均情况的直观观察)
        - [如果想按照递减的顺序排序](#如果想按照递减的顺序排序)
    - [随机化版本](#随机化版本)
        - [乱序输入数据](#乱序输入数据)
        - [随机抽样选择 pivot](#随机抽样选择-pivot)
    - [算法改进](#算法改进)
        - [切换到插入排序](#切换到插入排序)
        - [三取样切分](#三取样切分)
    - [从两边向中间靠拢的 `partition` 版本](#从两边向中间靠拢的-partition-版本)
    - [性能分析](#性能分析)
        - [命题：将长度为 $N$ 的无重复数组排序，快速排序平均需要 $\sim2N\ln N$ 次比较（以及 1/6 的交换）。](#命题将长度为-n-的无重复数组排序快速排序平均需要-\sim2n\ln-n-次比较以及-16-的交换)
        - [命题：快速排序最多需要约 $N^2/2$ 次比较，但随机打乱数组能够预防这种情况](#命题快速排序最多需要约-n^22-次比较但随机打乱数组能够预防这种情况)
    - [算法改进](#算法改进-1)
        - [切换到插入排序](#切换到插入排序-1)
        - [熵最优的排序](#熵最优的排序)
            - [实现](#实现)
            - [分析](#分析)
    - [References](#references)

<!-- /TOC -->

## 设计思想


## 概述
1. The quicksort algorithm has a worst-case running time of $O(n^2)$ on an input array
of n numbers. Despite this slow worst-case running time, quicksort is often the best
practical choice for sorting because it is remarkably efficient on the average: its
expected running time is $O(n \lg n)$, and the constant factors hidden in the $O(n \lg n)$
notation are quite small. 
2. It also has the advantage of sorting in place, and it works well even in virtual-memory environments.


## 基本算法
1. 快速排序是一种分治的排序算法。它将一个数组分成两个子数组，将两部分独立地排序。
2. 快速排序和归并排序是互补的：归并排序将数组分成两个子数组分别排序，并将有序的子数组归并以将整个数组排序；而快速排序将数组排序的方式则是当两个子数组都有序时整个数组也就自然有序了。
3. 在第一种情况中，递归调用发生在处理整个数组之前；在第二种情况中，递归调用发生在处理整个数组之后。
4. 在归并排序中，一个数组被等分为两半；在快速排序中，切分（partition）的位置取决于数组的内容。
5. 主要缺点是非常脆弱，在实现时要非常小心才能避免低劣的性能。已经有无数例子显示许多种错误都能致使它在实际中的性能只有平方级别。幸好我们将会看到，由这些错误中学到的教训也大大改进了快速排序算法，使它的应用更加广泛。

### 分治描述
1. **分解**：确定一个 pivot，把数组分为两个子数组，一个子数组的每个元素都小于等于 pivot，另一个子数组的每个元素都大于等于 pivot。
2. **解决**：对两个子数组递归调用快速排序。
3. **合并**：因为子数组都是原址排序，所以不需要合并。
4. 外层的实现如下
    ```js
    function quickSort (arr, leftIndex, rightIndex) {
        if (leftIndex < rightIndex ) {
            let index = partition(arr, leftIndex, rightIndex);
            quickSort( arr, leftIndex, index-1);
            quickSort( arr, index+1, rightIndex);
        }
    }
    ```

### `partition` 实现
1. `partition` 会先确定一个元素作为 pivot ，然后根据 pivot 的值将数组划分为两部分。
2. 在划分的过程中，除了 pivot 以外，数组是被划分为三部分的：小于等于 pivot 的、大于 pivot 的、尚未被划分的
    <img src="./images/15.png" width="400" style="display: block; margin: 5px 0 10px;" />
3. 这里把数组最后一个元素作为 pivot，然后如上图设定两个索引来把其余部分划分为三部分。索引 `i` 标记比 pivot 大的区间的前一个位置、索引 `j` 标记下一个待探索的位置。排序过程如下
    <img src="./images/16.png" width="300" style="display: block; margin: 5px 0 10px;" />
4. 排序开始的时候，因为还没有比 pivot 大的，所以 `i` 在 `leftIndex` 的左边；将要被探索的元素是第一个元素。
5. 每次探索一个元素，该元素分为两种情况
    * 如果大于 pivot：直接 `j` 加一。以 `j` 作为循环的索引，循环体内什么都不用做。
    * 如果小于等于 pivot：把当前元素和深色区域最左边的元素交换，然后 `i` 和 `j` 都加一。
6. 循环结束后，`j` 走到 pivot 的位置，把 pivot 和深色区域最左边的交换后，整个数组就是被 pivot 一分为二了。
7. 实现如下
    ```js
    function partition (arr, leftIndex, rightIndex) {
        let pivot = arr[rightIndex];
        let i = leftIndex - 1;
        let j = leftIndex;

        for (; j<rightIndex; j++) {
            if (arr[j] <= pivot) {
                swap(arr, ++i, j);
            }
        } 

        swap(arr, i+1, rightIndex);

        return i+1;
    }
    ```


## 时间复杂度
1. The running time of quicksort depends on whether the partitioning is balanced or unbalanced, which in turn depends on which elements are used for partitioning.
2. If the partitioning is balanced, the algorithm runs asymptotically as fast as merge sort. If the partitioning is unbalanced, however, it can run asymptotically as slowly as insertion sort.

### `partition` 的时间复杂度
1. `for` 之前和之后的操作都输常数次数。
2. `for` 的次数是 $n-1$，里面的每次比较和交换也都是常数次数。
3. 所示整体的时间复杂度是 $O(n)。

### 最坏的输入情况
1. 输入数据最坏情况是，快速排序的每次 `partition` 产生的两部分分别包含 $n-1$ 和 0 个元素。
2. 在这种情况下，快速排序运行时间的递归式为 $T(n) = O(n) + T(n-1) + T(0) = T(n-1) + O(n)$。
3. 可以想象，随着不断的递归，会得到一个算术级数，结果为 $O(n^2)$。
4. 所以在最坏的输入情况下，快速排序并不比插入排序更好。
5. 进一步的，如果输入数组本来就是有序的（包括升序、降序和所有元素都相等的情况），快速排序的算法时间复杂度就是这里的 $O(n^2)$；而对应的（对应的是指）插入排序此时只需要 $O(n)$。

### 最好的输入情况
1. 输入数据最好情况是，快速排序的每次 `partition` 产生的两部分都不大于 $n/2$，也就是 $n$ 为偶数时平分、为奇数时差一个。
2. 在这种情况下，快速排序运行时间的递归式为 $T(n) = O(n) + 2T(n/2)$。
3. 和归并排序的复杂度一样，$O(n \lg n)$。

### 常数比例的划分，时间复杂度都是 $O(n \lg n)$
1. 快速排序的平均运行时间更接近于最好情况，而非最坏情况。
2. 假设划分算法总是产生 1:9 的划分，看起来是很不平衡的。递归式为 $T(n) = cn + T(n/10) + T(9n/10)$。
3. 这里直接看《算法导论》98 页。
4. 这样的划分会产生左右很不平衡的递归树。短的那边高度是 $\log_{10} n$，长的那边高度是 $\log_{10/9} n$。
5. 在短的那侧还没递归结束之前，对于整棵树来说，每层的划分代价都是 $cn$，$O(n)$ 级别。
6. 短的那侧递归完了之后只剩下长的那侧自己递归，这时对于整棵树来说，每层的划分代价的上限是 $cn$（在本例中是 $9cn/10$ ？），$O(n)$ 级别。
7. 所以纵观整棵树，：每层的代价都是 $O(n)$ 级别；而深度 $\log_{10/9} n$ 为 $O(\lg n)$ 级别。所以整棵树总的复杂度还是 $O(n \lg n)$。

### 对于平均情况的直观观察
1. 这里直接看《算法导论》99 页。
2. 在平均的情况中，每次的划分情况有好有坏，所以总的层数会比最好情况要多。
3. 但这种层数的加深仍然只是常数倍的；而且整体来说，都是要对 $n$ 个元素进行划分，不平衡的划分在分出一个比最好情况时大的子数组时，也会分出一个比最会好情况时小的子数组。
4. 所以整体来说，在平均情况下，时间复杂度还是 $O(n \lg n)$。

### 如果想按照递减的顺序排序
1. 思考一下现有的 `partition` 逻辑，左边的两部分分别是小于等于 pivot 的和大于 pivot 的。
2. 那么只要把这两部分变成大于等于 pivot 的和小于 pivot 的就行了，也就是只需要把 `if (val <= pivot)` 改成  `if (val >= pivot)` 就行了。


## 随机化版本
1. 前面说到如果输入数据是有序的（包括所有元素都相等），那么快速排序就会变成 $O(n^2)$ 复杂度
    <img src="./images/11.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 这是最糟的情况，数组并没有被分成两半，相反，其中一个子数组始终为空，这导致调用栈非常长，为 $O(N)$，而在最佳情况下，栈高为 $O(log N)$。
3. 而不管是最糟情况还是最佳情况，在调用栈的每层都涉及 $N$ 个元素。所以，最糟情况下快速排序的时间复杂度为 $O(N^2)$，而最佳情况的时间复杂度是 $O(N log N)$。
4. 即使输入数据不是完全有序的，很多时候也是比较有序的，完全的随机常常是需要设计之后才能实现的抽样结果。
5. 这样的数据虽然不一定会导致 $O(n \lg n)$ 的复杂度，但也会让快速排序无法发挥出最快的速度。因此我们希望可以在算法中引入随机性，从而使算法对于所有的输入都能获得较好的期望性能。
6. 一种方法是在排序之前先对输入数据进行乱序，另一种方法是采用 **随机抽样**（random sampling）技术 选择 pivot。

### 乱序输入数据
1. 使用一个 $O(n)$ 复杂度的乱序算法先对输入数据乱序再进行快速排序。
2. 但是如果输入数据的元素都是相同的，那么乱序也没有效果，每次 `partition` 还是会进行最低效的划分。
3. 所以还要再改进一下 `partition` 让它处理这种情况。判断是否所有元素都相等，如果是的话，每次返回中间的索引
    ```js
    function partition (arr, leftIndex, rightIndex) {
        let pivot = arr[rightIndex];
        let i = leftIndex - 1;
        let j = leftIndex;
        let nSameTimes = 0;

        for (; j<rightIndex; j++) {
            let val = arr[j];
            if (val <= pivot) {
                swap(arr, ++i, j);
            }
            if (val === pivot) {
                nSameTimes++; // 比较每个元素时如果和 pivot 相等就计一次
            }
        } 

        if (nSameTimes === rightIndex - leftIndex) { // 说明所有元素都相等
            return Math.floor((leftIndex + rightIndex)/2);
        }

        swap(arr, i+1, rightIndex);

        return i+1;
    }
    ```

### 随机抽样选择 pivot
1. 随机抽样选择 pivot 可以不用对输入数据进行额外的乱序，（但是仍然需要额外处理所有元素相等的情况）
2. 与每次都选择子数组中最右（`rightIndex`）元素作为 pivot 不同，随机抽样是每次都随机选择一个元素作为 pivot。
3. 实现方法是每次随机选出一个元素和 `rightIndex` 元素交换来作为 pivot
    ```js
    function partition (arr, leftIndex, rightIndex) {
        let randIdx = Math.floor(Math.random() * (rightIndex - leftIndex + 1) + leftIndex);
        swap(arr, randIdx, rightIndex);

        let pivot = arr[rightIndex];
        let i = leftIndex - 1;
        let j = leftIndex;
        let nSameTimes = 0;

        for (; j<rightIndex; j++) {
            let val = arr[j];
            if (val <= pivot) {
                swap(arr, ++i, j);
            }
            if (val === pivot) {
                nSameTimes++;
            }
        } 

        if (nSameTimes === rightIndex - leftIndex) {
            return Math.floor((leftIndex + rightIndex)/2);
        }

        swap(arr, i+1, rightIndex);

        return i+1;
    }
    ```


## 算法改进
1. 几乎从 Hoare 第一次发表这个算法开始，人们就不断地提出各种改进方法。并不是所有的想法都可行，因为快速排序的平衡性已经非常好，改进所带来的提高可能会被意外的副作用所抵消。但其中一些，也是我们现在要介绍的，非常有效。
2. 如果你的排序代码会被执行很多次或者会被用在大型数组上（特别是如果它会被发布成一个库函数，排序的对象数组的特性是未知的），那么下面所讨论的这些改进意见值得你参考。
3. 需要注意的是，你需要通过实验来确定改进的效果并为实现选择最佳的参数。一般来说它们能将性能提升 20% ～ 30%。

### 切换到插入排序
1. 和大多数递归排序算法一样，改进快速排序性能的一个简单办法基于以下两点：
    * 对于小数组，快速排序比插入排序慢；
    * 因为递归，快速排序的 `quickSort()` 方法在小数组中也会调用自己。
2. 因此，在排序小数组时应该切换到插入排序。小数组边界大小的最佳值是和系统相关的，但是 5 ～ 15 之间的任意值在大多数情况下都能令人满意
    ```js
    function quickSort (arr, leftIndex, rightIndex) {
        if ( leftIndex + 10 >= rightIndex ) {
            insertionSort(arr, leftIndex, rightIndex);
            return;
        }

        let index = partition(arr, leftIndex, rightIndex);
        quickSort( arr, leftIndex, index-1);
        quickSort( arr, index+1, rightIndex);
    }
    ```

### 三取样切分





## 从两边向中间靠拢的 `partition` 版本
这是快速排序最初的划分方法，但是在分析和处理边界条件时比较麻烦，还是上面的版本更好理解。
```js
function hoare_partition (arr, leftIndex, rightIndex) {
    let pivot = arr[leftIndex];
    let i = leftIndex;
    let j = rightIndex + 1;

    while (true) { 
        
        while (arr[++i] < pivot) {
            if (i === rightIndex) {
                break;
            }
        }

        while (arr[--j] > pivot) {

        }
        
        if (i >= j) {
            break; 
        }
        swap(arr, i, j);
    }
    swap(arr, leftIndex, j);
    return j;
}
```





## 性能分析
1. 快速排序切分方法的内循环会用一个递增的索引将数组元素和一个定值比较。这种简洁性也是快速排序的一个优点，很难想象排序算法中还能有比这更短小的内循环了。例如，归并排序和希尔排序一般都比快速排序慢，其原因就是它们还在内循环中移动数据。
2. 总的来说，可以肯定的是对于大小为 $N$ 的数组，快速排序的运行时间在 $1.39N\lg N$ 的某个常数因子的范围之内。归并排序也能做到这一点，但是快速排序一般会更快（尽管它的比较次数多 39%），因为它移动数据的次数更少。这些保证都来自于数学概率，你完全可以相信它。

### 命题：将长度为 $N$ 的无重复数组排序，快速排序平均需要 $\sim2N\ln N$ 次比较（以及 1/6 的交换）。
1. 令 $C_N$ 为将 $N$ 个不同元素排序平均所需的比较次数。显然 $C_0=C_1=0$，对于 $N>1$，由递归程序可以得到以下归纳关系：

    $$
    C_N = (N+1) + (C_0+C_1+\cdots+C_{N-2}+C_{N-1})/N + (C_{N-1}+C_{N-2}+\cdots+C_0)/N
    $$

2. $N+1$ 第一次对整个数组调用 `partition` 时，`partition` 函数内部的比较次数，也就是两个指针所在的元素和 `pivot` 比较的次数，就是两个内循环 `while` 条件的比较次数。
3. $(C_0+C_1+\cdots+C_{N-2}+C_{N-1})/N$ 是第一次 `partition` 后得到的左子数组（长度可能是 0 到 N-1）排序的平均比较次数。
4. $(C_{N-1}+C_{N-2}+\cdots+C_0)/N$ 是相应的右子数组（长度和左子数组相同）排序的平均比较次数。
5. 将等式左右两边乘以 $N$ 并整理各项得到：
    
    $$
    NC_N=N(N+1)+2(C_0+C_1+\cdots+C_{N-2}+C_{N-1})
    $$

6. 将该等式减去 $N-1$ 时的相同等式可得：
   
    $$
    NC_N-(N-1)C_{N-1}=2N+2C_{N-1}
    $$

7. 整理等式并将两边除以 N(N+1) 可得：

    $$
    \frac{C_N}{N+1}=\frac{C_{N-1}}{N} + \frac{2}{N+1} 
    $$

8. 后面的不懂 TODO

### 命题：快速排序最多需要约 $N^2/2$ 次比较，但随机打乱数组能够预防这种情况
1. 尽管快速排序有很多优点，它的基本实现仍有一个潜在的缺点：在切分不平衡时这个程序可能会极为低效。例如，如果第一次从最小的元素切分，第二次从第二小的元素切分，如此这般，每次调用只会移除一个元素。这会导致一个大子数组需要切分很多次。我们要在快速排序前将数组随机排序的主要原因就是要避免这种情况。它能够使产生糟糕的切分的可能性降到极低，我们就无需为此担心了。
2. 根据刚才的证明，在每次切分后两个子数组之一总是空的情况下，比较次数为：

    $$
    N+(N-1)+(N-2)+\cdots+2+1=(N+1)N/2
    $$

3. 这不仅说明算法所需的时间是平方级别的，也显示了算法所需的空间是线性的，而这对于大数组来说是不可接受的。
4. 但是（经过一些复杂的工作）通过扩展对一般情况的分析我们可以得到比较次数的标准差约为 $0.65N$。因此，随着 $N$ 的增大，运行时间会趋近于平均数，且不可能与平均数偏差太大。
5. 例如，对于一个有 100 万个元素的数组，由 Chebyshev 不等式可以粗略地估计出运行时间是平均所需时间的 10 倍的概率小于 0.000 01（且真实的概率还要小得多）。对于大数组，运行时间是平方级别的概率小到可以忽略不计


## 算法改进
1. 几乎从 Hoare 第一次发表这个算法开始，人们就不断地提出各种改进方法。并不是所有的想法都可行，因为快速排序的平衡性已经非常好，改进所带来的提高可能会被意外的副作用所抵消。但其中一些，也是我们现在要介绍的，非常有效。
2. 如果你的排序代码会被执行很多次或者会被用在大型数组上（特别是如果它会被发布成一个库函数，排序的对象数组的特性是未知的），那么下面所讨论的这些改进意见值得你参考。
3. 需要注意的是，你需要通过实验来确定改进的效果并为实现选择最佳的参数。一般来说它们能将性能提升 20% ～ 30%。


### 切换到插入排序
1. 和大多数递归排序算法一样，改进快速排序性能的一个简单办法基于以下两点：
    * 对于小数组，快速排序比插入排序慢；
    * 因为递归，快速排序的 $sort()$ 方法在小数组中也会调用自己。
2. 因此，在排序小数组时应该切换到插入排序。小数组边界大小的最佳值是和系统相关的，但是 5 ～ 15 之间的任意值在大多数情况下都能令人满意
    ```js
    function quickSort ( arr, leftIndex, rightIndex ) {
        if ( leftIndex + 10 >= rightIndex ) {
            insertionSortForMergeSort( arr, leftIndex, rightIndex );
            return;
        }
        let index = partition( arr, leftIndex, rightIndex );
        quickSort( arr, leftIndex, index-1);
        quickSort( arr, index+1, rightIndex);
    }
    ```



### 熵最优的排序
1. 实际应用中经常会出现含有大量重复元素的数组，在这些情况下，我们实现的快速排序的性能尚可，但还有巨大的改进空间。例如，一个元素全部重复的子数组就不需要继续排序了，但我们的算法还会继续将它切分为更小的数组。
2. 在有大量重复元素的情况下，快速排序的递归性会使元素全部重复的子数组经常出现，这就有很大的改进潜力，将当前实现的线性对数级的性能提高到线性级别。
3. 一个简单的想法是将数组切分为三部分，分别对应小于、等于和大于切分元素的数组元素。
4. 从左到右遍历数组一次，维护一个指针 `lt` 使得 `arr[lo..lt-1]` 中的元素都小于 `pivot`，一个指针 `gt` 使得 `arr[gt+1..hi]` 中的元素都大于 `pivot`，一个指针 `i` 使得 `arr[lt..i-1]` 中的元素都等于` pivot`，`arr[i..gt]` 中的元素都还未确定
    <img src="./images/10.png" width="400" style="display: block; margin: 5px 0 10px; border: 10px solid #fff" />
5. 注意三个指针所在的边界：`lt` 所在的元素是等于 `pivot`，`i` 指针和 `gt` 指针所在的元素都是未确定的。
6. 一开始 `i` 和 `lo` 相等，对 `arr[i]` 进行三向比较来直接处理以下情况：
    * `arr[i]` 小于 `pivot`，将 `arr[lt]` 和 `arr[i]` 交换；将 `lt` 和 `i` 加一，`lt` 重新指向第一个和 `pivot` 相等的元素，`i` 指向新的待比较的元素。
    * `arr[i]` 大于 `pivot`，将 `arr[gt]` 和 `arr[i]` 交换；将 `gt` 减一，`gt` 重新指向最后一个未确定的元素，`i` 不用动因为换到它这里的是之前 `gt` 所在的最后一个未确定元素。
    * `arr[i]` 等于 `pivot`，将 `i` 加一。
7. 这些操作都会保证数组元素不变且缩小 `gt-i` 的值（这样循环才会结束）。另外，除非和切分元素相等，其他元素都会被交换。

#### 实现
```js
function quickSort ( arr, leftIndex, rightIndex ) {
    if ( leftIndex >= rightIndex ) {
        return;
    }

    let lt = leftIndex;
    let i = leftIndex + 1;
    let gt = rightIndex;
    let pivot = arr[leftIndex];

    while ( i<= gt ) {
        if ( arr[i] < pivot ) {
            swap(arr, lt++, i++);
        }
        else if ( arr[i] > pivot ) {
            swap(arr, gt--, i);
        }
        else {
            i++;
        }
    }
    quickSort( arr, leftIndex, lt-1);
    quickSort( arr, gt+1, rightIndex);
}
```

#### 分析
TODO


## References
* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [学习JavaScript数据结构与算法](https://book.douban.com/subject/26639401/)
* [图解排序算法(二)之希尔排序](https://www.cnblogs.com/chengxiao/p/6104371.html)
* [《算法图解》](https://book.douban.com/subject/26979890/)