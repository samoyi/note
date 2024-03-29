# 堆


<!-- TOC -->

- [堆](#堆)
    - [本质](#本质)
        - [维护同一子树中根节点与后代节点的大小关系](#维护同一子树中根节点与后代节点的大小关系)
    - [设计思想](#设计思想)
        - [迁移时注意环境变动](#迁移时注意环境变动)
        - [脑补的秩序](#脑补的秩序)
        - [排序](#排序)
    - [用途](#用途)
    - [关键细节](#关键细节)
        - [堆结构属性](#堆结构属性)
        - [`sink`](#sink)
        - [建堆的顺序](#建堆的顺序)
        - [堆排序](#堆排序)
    - [概述](#概述)
    - [结构属性](#结构属性)
    - [堆的有序化（reheapifying）](#堆的有序化reheapifying)
        - [大元素上浮](#大元素上浮)
        - [小元素下沉](#小元素下沉)
        - [复杂度](#复杂度)
    - [Building a heap](#building-a-heap)
        - [顺序问题](#顺序问题)
        - [复杂度](#复杂度-1)
    - [其他堆操作的实现](#其他堆操作的实现)
        - [添加新节点](#添加新节点)
        - [移除最大的顶节点](#移除最大的顶节点)
        - [删除节点](#删除节点)
    - [最小堆的实现](#最小堆的实现)
    - [Heapsort](#heapsort)
    - [优先队列（Priority Queues）](#优先队列priority-queues)
        - [删除并返回最大元素](#删除并返回最大元素)
        - [提升一个元素的优先级](#提升一个元素的优先级)
        - [加入新元素](#加入新元素)

<!-- /TOC -->


## 本质
### 维护同一子树中根节点与后代节点的大小关系
1. 对于堆中的任意子树，根节点永远不小于它的后代节点；但如果两个节点并不是某个子树的根节点和后代节点的关系，那么它们的高度并不能保证大小关系。
2. 也就是说它维护的有序性并不是系统内任意两个节点的，而是系统中任意子系统的根节点和后代节点的。


## 设计思想
### 迁移时注意环境变动
1. 在设计删除节点算法时很容易就会想到套用 `del_max` 中的方法，但是这个方法虽然在 `del_max` 中是正确的，但是放到删除节点时，却出现了问题。
2. 也就是说，同一个方法，放在不同的实验环境，很有可能就会产生不同的结果。
3. 在进行任何迁移时，都要考虑环境的改变。

### 脑补的秩序
1. 在设计 `delete` 方法时，一开始错误的设计，是因为感觉上，二叉堆就是从大到小按顺序排列的。
2. 二叉堆在整体上确实是按照顺序排列的，但并不是严格按顺序排列。但我却下意识的脑补成了一种更有秩序的状态。
3. 这种对更有秩序、更和谐的脑补是无处不自的。

### 排序
1. 上面本质中说到堆只能维护任意子树的根节点和后代节点的大小关系，所以排序的具体比较步骤只能发生在根节点和后代节点之间，而不能是任意两个节点。
2. 所以堆排序每次都是通过移除最大节点，因为你只能保证这种大小与关系是确定的。


## 用途


## 关键细节
### 堆结构属性

### `sink`
1. 下沉的终止条件是节点不再有子节点，也就是变成了叶节点。
2. 因为第一个叶节点的序号是 $\lfloor N/2 \rfloor$，所以循环条件是 `while (idx < N/2)`（N/2 向下取整）。
3. 两个子节点的序号是 `idx*2 + 1` 和 `idx*2 + 2`。如果循环条件成立，则至少有左子节点。
4. idx 先和左子节点比较得出更大的，然后再用这个更大的和可能存在的右子节点比较。
5. 如果最终最大的不是 idx，则进行交换；是 idx 的话 sink 结束。

### 建堆的顺序

### 堆排序
堆排序因为要不断的删除节点，所以记录节点总数的变量会变化，也就是说不能把它用在循环条件里。
```cpp
void sort () {
    int hs = heapSize; // 应该另外使用一个鼻梁
    for (int i=0; i<hs; i++) {
        del_max();
    }
}
```


## 概述
1. 二叉堆的入队操作和出队操作均可达到 $O(\log n)$。
2. 二叉堆画出来很像一棵树，但实现时只用一个列表作为内部表示。
3. 二叉堆有两个常见的形式：**最小堆**（最小的元素一直在队首）与 **最大堆**（最大的元素一直在队首）。
4. 如果把堆看成一棵树，我们定义一个堆中的节点的 **高度** 为该节点到叶节点的最长简单路径上边的数目。因此可以把堆的高度定义为根节点的高度。
5. 既然一个包含 $N$ 个元素的队列可以看做一颗完全二叉树，那么该堆的高度就是 $Θ(lgN)$。
6. 我们可以看到堆的一些基本操作的运行时间至多与树的高度成正比，也就是时间复杂度为 $O(lgN)$。


## 结构属性
1. 为了使二叉堆能高效地工作，我们利用树的对数性质来表示它。为了保证对数性能，必须维持树的平衡。
2. 平衡的二叉树是指，其根节点的左右子树含有数量大致相等的节点。
3. 在完全平衡的二叉树中，左右子树的节点数相同。最坏情况下，插入节点操作的时间复杂度是 $O(\log_2n)$，其中 $n$ 是树的节点数。
4. 在实现二叉堆时，我们通过创建一棵 **完全二叉树** 来维持树的平衡。在完全二叉树中，除了最底层，其他每一层的节点都是满的。在最底层，我们从左往右填充节点。
5. 完全二叉树的另一个有趣之处在于，可以用一个列表来表示它。由于树是完全的，任何一行完整的节点数都是前一行节点的 2 倍（$2^n$ 关系）。因为第 $i$ 行的节点数是 $2^i$（$i$ 从 0 开始计）。
6. 另外，根据等比数列求和公式 $\frac{a_1(1-q^n)}{1-q}$ 可得：
    * 前 $i$ 行（$i$ 从 0 开始计）的节点总数为 $\frac{1*(1-2^{i+1})}{1-2} = 2^{i+1} - 1$；
    * 第 $i$ 行的节点数是 $2^i$；第 $i+1$ 行的节点数是 $2^{i+1}$。
    * $某一行完整的节点数=它上面所有节点数+1$;
    * 第 $i$ 行的第一个节点序号是 $2^i - 1$，最后一个节点序号是 $2^{i+1} - 2$。
7. 因此，对于在列表中处于位置 $p$（$p$ 从 0 开始计）的节点来说，它的左子节点正好处于位置 $2p+1$；同理，右子节点处于位置 $2p+2$
    <img src="./images/06.png" width="600"  style="display: block; margin: 5px 0 10px;" />
8. 对第 7 点的证明：
    1. 设序号为 $p$ 的节点（$p$ 从 0 开始计）是第 $i$ 行的第 $k$ 个（$k$ 从 0 开始计）节点；
    2. 那它的子节点就是第 $i+1$ 行的第 $2k$ 和 第 $2k+1$ 个节点；
    3. 第 $i$ 行第 0 个节点序号 $2^i - 1$，所以第 $k$ 个节点的序号就是 $2^i - 1 + k$；
    4. 第 $i+1$ 行第 0 个节点序号 $2^{i+1} - 1$，第 $2k$ 和 第 $2k+1$ 个节点的序号就是 $2^{i+1} - 1 + 2k$ 和 $2^{i+1} + 2k$；
9. 第 7 点反过可以得出：序号为 $k$ 的节点的父节点序号为 $\lceil k/2 -1\rceil$，也就是 $\lfloor k/2 \rfloor$。
10. 证明含有 $n$ 个元素的堆的高度是 $\lfloor \lg n \rfloor$:
    1. 根据上面第 6 点，第 $i$ 行（$i$ 从 0 开始计）的节点 **数** 范围是 $[2^i, 2^{i+1}-1]$。
    2. 所以 $2^i \leqslant n \leqslant 2^{i+1}-1$。变形为 $2^i \leqslant n < 2^{i+1}$ 以便计算对数。
    3. 取对数，变为 $i \leqslant \lg n < i+1$。
    4. 所以 $\lfloor \lg n \rfloor = i$。而 $i$ 就是堆的高度。
11. 证明当用数组表示存储 $n$ 个元素的堆时，叶节点下标分别是 $\lfloor n/2 \rfloor, \lfloor n/2 \rfloor, ..., n-1$
    1. 这里可以通过观察一个二叉堆的图，看出来最后一个非叶节点就是第 $n$ 个节点的父节点。
    2. 第 $n$ 个节点的序号是 $n-1$，要么是左侧子节点要么是右侧子节点。
    3. 根据第 7 点，可知该节点的父节点序号 $p$：
        * 如果是第 $n$ 个节点是左侧子节点，则 $n-1 = 2P + 1$；$p = n/2 -1$;
        * 如果是第 $n$ 个节点是右侧子节点，则 $n-1 = 2P + 2$；$p = n/2 - 1/2 - 1$。
    4. 如果是第一种情况，则 $p = n/2 -1$ 是整数，$p = \lfloor n/2 \rfloor - 1$；
    5. 如果是第二种情况，则 $p = n/2 - 1/2 - 1$ 是整数，$p = n/2 - 1/2$ 也是整数，所以 $n/2 - 1/2 = \lfloor n/2 \rfloor$，所以 $p = \lfloor n/2 \rfloor - 1$ 依然成立。
    6. 因此第一个叶节点序号就是 $\lfloor n/2 \rfloor$。
12. 证明对于有 $n$ 个元素的堆中，至少有 $\lceil n/2^{h+1} \rceil$ 个高度为 $h$ 的节点
    1. 根据上面第 6 点中完整一行的节点数是上面所有节点数加一的结论，$n$ 个节点的堆最后一行（$h=0$）最多有 $\lceil n/2 \rceil$ 个节点。
    2. 所以倒数第二行（$h=1$）最多有 $\lceil n/4 \rceil$ 个节点。
    3. 以此类推。


## 堆的有序化（reheapifying）
1. 这里以大顶堆为例，**堆的有序性** 是指：对于堆中任意元素 $x$ 及其父元素 $p$，$p$ 都不小于 $x$。
2. 通过有两种方法来进行大顶堆的有序化：大元素上浮（`swim`）和小元素下沉（`sink`）。

### 大元素上浮 
1. 如果堆的有序状态因为某个节点变得比它的父节点更大而被打破，那么我们就需要通过交换它和它的父节点来修复堆。
2. 交换后，这个上浮的节点比它的两个子节点都大（现在的两个子节点，一个是刚被换下来的曾经的父节点，另一个比曾经的父节点更小，因为它是曾经父节点的子节点）。
3. 但这个上浮的节点仍然可能比它现在新的父节点更大。因此我们可以一遍遍地用同样的办法恢复秩序，将这个节点不断向上移动直到我们遇到了一个更大的父节点
    <img src="./images/13.png" width="400" style="display: block; margin: 5px 0 10px;" />
4. 只要记住位置 $k$ 的节点的父节点的位置是$\lfloor k/2 \rfloor$（序号从 0 开始），这个过程实现起来很简单
    ```cpp
    #define HEAP_LENGTH 10

    int heap[HEAP_LENGTH] = {16, 14, 10, 8, 17, 9, 3, 2, 4, 1};

    int heapSize = HEAP_LENGTH;

    int swim_recursive (int* arr, int i);


    int main(void) {

        swim_recursive(heap, 4);
        print_arr(heap, 0, heapSize-1); // [17, 16, 10, 8, 14, 9, 3, 2, 4, 1]
        return 0;
    }

    int swim_recursive (int* arr, int i) {
        int pIdx = (i-1)/2; // 序号从 0 开始
        if (pIdx >= 0 && arr[pIdx] < arr[i]) {
            swap(arr, pIdx, i);
            i = pIdx;
            i = swim_recursive(arr, i); // 这里的赋值是要追踪每次 swim 后的位置，在递归的最外层返回
        }
        return i;
    }
    ```
5. 循环实现
    ```cpp
    int swim_loop (int* arr, int i) {
        int pIdx = (i-1)/2;
        while (pIdx >= 0 && arr[pIdx] < arr[i]) {
            swap(arr, pIdx, i);
            i = pIdx;
            pIdx = (i-1)/2;
        }
        return i;
    }
    ```

### 小元素下沉
1. 如果堆的有序状态因为某个节点变得比它的两个子节点或是其中之一更小了而被打破了，那么我们可以通过将它和它的两个子节点中的较大者交换来恢复堆。
2. 交换可能会在子节点处继续打破堆的有序状态，因此我们需要不断地用相同的方式将其修复，将节点向下移动直到它的子节点都比它更小或是到达了堆的底部
    <img src="./images/14.png" width="400" style="display: block; margin: 5px 0 10px;" />
3. 递归实现
    ```cpp
    #define HEAP_LENGTH 10

    int heap[HEAP_LENGTH] = {16, 4, 10, 14, 7, 9, 3, 2, 8, 1};

    int heapSize = HEAP_LENGTH;


    int main(void) {

        sink_recursive(heap, 1);
        print_arr(heap, 0, heapSize-1); // [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]

        return 0;
    }


    void sink_recursive (int* arr, int i) {
        int lIdx = i*2 + 1;
        int rIdx = i*2 + 2;

        int largestIdx = i;
        if (lIdx < heapSize && arr[lIdx] > arr[i]) {
            largestIdx = lIdx;
        }
        if (rIdx < heapSize && arr[rIdx] > arr[largestIdx]) {
            largestIdx = rIdx;
        }
        if (largestIdx != i) {
            swap(arr, i, largestIdx);
            sink_recursive(arr, largestIdx);
        }
    }
    ```
4. 循环实现。第一次是这样实现的
    ```cpp
    void sink_loop (int* arr, int i) {
        int lIdx = i*2 + 1;
        int rIdx = i*2 + 2;

        // 这个判断条件只能保证有左侧子节点，但只要有左侧的，就应该进行比较
        while (lIdx < heapSize) {
            int largestIdx = i;
            lIdx = i*2 + 1;
            rIdx = i*2 + 2;

            if (arr[lIdx] > arr[i]) {
                largestIdx = lIdx;
            }

            if (rIdx < heapSize && arr[rIdx] > arr[largestIdx]) {
                largestIdx = rIdx;
            }

            if (largestIdx == i) {
                break;
            }
            
            swap(arr, i, largestIdx);
            i = largestIdx;
        }
    }
    ```
    也是正确的，但是有几个地方看起来不舒服：
    * `lIdx` 和 `rIdx` 在循环内外重复的赋值；
    * `rIdx` 在循环外的初始化是没有用的，循环条件不需要用到，循环内部也会重新赋值；
    * `largestIdx` 反复声明；
5. 修改如下
    ```cpp
    void sink_loop (int* arr, int i) {
        int largestIdx;
        int lIdx;
        int rIdx;

        while (i*2 + 1 < heapSize) {
            largestIdx = i;
            lIdx = i*2 + 1;
            rIdx = i*2 + 2;

            if (arr[lIdx] > arr[i]) {
                largestIdx = lIdx;
            }

            if (rIdx < heapSize && arr[rIdx] > arr[largestIdx]) {
                largestIdx = rIdx;
            }

            if (largestIdx == i) {
                break;
            }
            
            swap(arr, i, largestIdx);
            i = largestIdx;
        }
    }
    ```

### 复杂度
运行时间是 $O(\lg n)$，堆的高度 $h$ 是 $\lfloor \lg n \rfloor$。所以时间复杂度是 $O(h)$。


## Building a heap
1. 既然 `sink` 方法会让一个节点有序，那么我们就可以自底向上的让所有的节点都有序。
2. 当然不需要对每个节点都执行 `sink`，因为叶节点 `sink` 了也没效果，它们只需要等待上面节点的 `sink`。
3. 所以我们就自底向上的对所有的非叶节点进行 `sink`
    ```cpp
    void build (int* arr) {
        // heapSize - 1 是最后一个节点；
        // 因为是从 0 开始计，所以计算父节点要再减去一然后除以二。
        int lastLeafIdx = (heapSize - 2) / 2;
        for (int i=lastLeafIdx; i>=0; i--) {
            sink_loop(arr, i);
        }
    }
    ```

### 顺序问题
1. 为什么上面的 `build` 方法是自底向上而不是自顶向下？
2. 以《算法导论》88 页为例，考虑自顶向下的情况。当节点 1 和节点 16 通过 sink 交换后，之后再也不会访问到节点 16 了，但其实它还没有上浮到位。
3. 因为 sink 只会循环的让小节点一直下沉的合适的位置，但是对于最大的节点，就只会上浮一行，不能保证上浮到位。
4. 而自底向上就保证了那些没有上浮到位的节点还会被访问到。
5. 那么，现在就可以想到，如果要自顶向下，就不能用 sink 而要用 swim，swim 会让之后不再访问的大节点上浮到位，而只会让小节点下沉一层，但因为是自顶向下，所以它们还会被访问到。
6. 但是因为 swim 是从子节点出发向父节点比较，所以不能省略对叶节点的遍历
    ```cpp
    void build_swim (int* arr) {
        for (int i=0; i<heapSize; i++) {
            swim_loop(arr, i);
        }
    }
    ```

### 复杂度
TODO   $O(n)$


## 其他堆操作的实现
```js
class BinaryHeap {
    constructor (arr=[]) {
        this.arr = [null];
        this.size = arr.length; 
        if (arr.length) {
            this.arr = [null, ...arr];
            this.build();
        }
    }

    // 对元素的列表，和 arr 不同。
    // 这里不包括起始的 null；以及 del_max 时，只是不计入 list 中，而并不会真的从 arr 中移除
    get list () {
        return this.arr.slice(1, this.size+1);
    }

    swap( index1, index2 ) {
        let aux = this.arr[index1];
        this.arr[index1] = this.arr[index2];
        this.arr[index2] = aux;
    }

    less ( index1, index2 ) {
        return this.arr[index1] < this.arr[index2];
    }

    swim (k) {
        while ( k > 1 && this.less(Math.floor(k/2), k) ) {
            let parentIndex = Math.floor(k/2);
            this.swap(parentIndex, k);
            k = parentIndex;
        }
        return k;
    }

    sink (i) {
        // 这个判断条件只能保证有左侧子节点，但只要有左侧的，就应该进行比较
        while (2*i <= this.size) {
            let left = 2*i; 
            let right = 2*i + 1; 
            let largest = left; // 假设左侧子节点是最大的，作为比较的基准

            // 如果有右侧的，就和左侧的比较，确定子节点中更大的那个，然后再去和父节点比较
            if ( right <= this.size && this.less(left, right)) {
                largest = right;
            }

            if (!this.less(i, largest)) {
                break;
            }

            this.swap(i, largest);

            i = largest;
        }
    }

    sink_recursive (i) {
        let left = 2*i;
        let right = 2*i + 1;
        let largest;

        if (left <= this.size && this.less(i, left)) {
            largest = left;
        }
        else {
            largest = i;
        }
        if (right <= this.size && this.less(largest, right)) {
            largest = right;
        }

        if (largest !== i) {
            this.swap(i, largest);
            this.sink_recursive(largest);
        }
    }

    build () {
        for (let i=Math.floor(this.size/2); i>0; i--) {
            this.sink(i);
        }
    }

    insert (v) {
        this.arr.push(v);
        this.size++;
        return this.swim(this.size);
    }

    del_max () {
        let maxNode = this.arr[1];
        this.swap(1, this.size); 
        this.size--;
        this.sink(1);
        return maxNode;
    }
}
```

### 添加新节点
1. 先将元素追加到列表的末尾，然后再通过大小比较把它移动到合适的位置
    <img src="./images/07.png" width="400"  style="display: block; margin: 5px 0 10px;" />
2. `insert` 方法先把新的节点添加到尾部，然后再使用 `swim` 方法把它移动到合适的位置
    ```cpp
    int insert(int* arr, int k) {
        if (heapSize < HEAP_LENGTH) {
            arr[heapSize] = k;
            int idx = swim_loop(arr, heapSize);
            heapSize++;
            return idx;
        }
        else {
            printf("Insert failed, heap is full.\n");
        }
    }
    ```

### 移除最大的顶节点
1. 要移除根节点，肯定不能直接移除，否则就变成两棵树了。那么找谁来填补空位呢？
2. 因为根节点是最大的，那么看起来应该找第二大的节点来填补，也就是根节点的某个子节点。
3. 但是这样并不行，因为这个第二大的节点几乎都有两个子节点了，不能再接收和它同父的节点了。就算让这个第二大的节点舍弃调一个本身的子树，那这个子树的重新安放就会很麻烦。
4. 不过，因为有了 sink 方法，所以就可以换上了一个节点，然后再让它 sink 到合适的位置。
5. 被换上的节点只能是叶节点，因为如果不是的话，那就要拆树。
6. 理论上可以换上去任何一个叶节点，但考虑到后续操作的方便性，还是应该换上去最后一个叶节点
    <img src="./images/08.png" width="400"  style="display: block; margin: 5px 0 10px;" />
7. 把最后一个节点移到顶节点，然后再通过大小比较把它移动到合适的位置
    ```cpp
    int del_max(int* arr) {
        if (heapSize > 0) {
            int deleted = arr[0];
            arr[0] = arr[heapSize-1];
            heapSize--;
            sink_loop(arr, 0);
            return deleted;
        }
        else {
            printf("Del_max failed, heap is empty.\n");
        }
    }
    ```
8. 为了后续的堆排序算法实现，修改一下 `del_max`，让 `arr[0]` 和 `arr[heapSize-1]` 互相交换，而不是单向赋值
    ```cpp
    int del_max(int* arr) {
        if (heapSize > 0) {
            int deleted = arr[0];
            swap(arr, 0, heapSize-1);
            // sink_loop 需要根据正确的 heapSize 来执行，所以要在 sink_loop 之前就 heapSize--；
            // 把最大元素换到最后之后，如果还是按照之前的 heapSize 进行 sink_loop，
            // 最大元素可能就会发生移动，最后 heapSize-- 删除的就是最大元素了。
            heapSize--;
            sink_loop(arr, 0);
            return deleted;
        }
        else {
            printf("Del_max failed, heap is empty.\n");
        }
    }
    ```

### 删除节点
1. 有了上面的 `del_max`，大概很容易想到这样的实现
    ```js
    delete(i) {
        if (i > this.size || i < 1) {
            throw new RangeError("Wrong index");
        }
        let deletedNode = this.arr[i];
        this.swap(i, this.size); 
        this.size--;
        this.sink(i);
        return deletedNode;
    }
    ```
2. 但是 `[15, 7, 9, 1, 2, 3, 8]` 这样的数组在执行 `delete(4)` 时就暴露了问题：最后一个元素被交换后并不需要往下移动，而是需要往上移动。`del_max` 之所以没有问题，是因为被交换到了顶部，只有下移的可能存在。
3. 而其他情况的交换，只要两个节点没有明确的 “祖先-后代” 关系，就不能确定它俩的大小关系，所以最后一个节点交换过去（都不能说交换 “上去”，因为就像上面这个例子中这样两者其实高度是一样的）之后，不一定是要上浮还是下沉。
4. 既然交换之后有可能需要上移也有可能是下移，那就做个判断
    ```cpp
    int delete(int* arr, int index) {
        if (index >= heapSize || index < 0) {
            printf("Delete failed, wrong index.\n");
        }
        else {
            int deleted = arr[index];
            arr[index] = arr[heapSize-1];
            heapSize--;
            int pIdx = (index-1)/2;
            if (pIdx >= 0 && arr[pIdx] < arr[index]) {
                swim_loop(arr, index);
            }
            else {
                sink_loop(arr, index);
            }
            return deleted;
        }
    }
    ```
5. 其实还可以简化。因为 swim 方法本身就可以判断父节点是否存在以及是否比父节点大；而且，只要换上来的节点比被删除的节点大，它就只可能是 swim，否则就只可能是 sink
    ```cpp
    int delete(int* arr, int index) {
        if (index >= heapSize || index < 0) {
            printf("Delete failed, wrong index.\n");
        }
        else {
            int deleted = arr[index];
            arr[index] = arr[heapSize-1];
            heapSize--;
            if (arr[index] > deleted) {
                swim_loop(arr, index);
            }
            else {
                sink_loop(arr, index);
            }
            return deleted;
        }
    }
    ```


## 最小堆的实现
需要修改 `swim` 和 `sink` 方法，以及把 `del_max` 换成 `del_min`
```js
class MinBinaryHeap {
    constructor (arr=[]) {
        this.arr = [null];
        this.size = arr.length; 
        if (arr.length) {
            this.arr = [null, ...arr];
            this.build();
        }
    }

    swap( index1, index2 ) {
        let aux = this.arr[index1];
        this.arr[index1] = this.arr[index2];
        this.arr[index2] = aux;
    }

    less ( index1, index2 ) {
        return this.arr[index1] < this.arr[index2];
    }

    get list () {
        return this.arr.slice(1, this.size+1);
    }

    swim (k) {
        while ( k > 1 && this.less(k, Math.floor(k/2)) ) {
            let parentIndex = Math.floor(k/2);
            this.swap(parentIndex, k);
            k = parentIndex;
        }
        return k;
    }

    sink (i) {
        while (2*i <= this.size) {
            let left = 2*i; 
            let right = 2*i + 1; 
            let smallest = left;

            if ( right <= this.size && this.less(right, left)) {
                smallest = right;
            }

            if (!this.less(smallest, i)) {
                break;
            }

            this.swap(i, smallest);

            i = smallest;
        }
    }

    build () {
        for (let i=Math.floor(this.size/2); i>0; i--) {
            this.sink(i);
        }
    }

    insert (v) {
        this.arr.push(v);
        this.size++;
        return this.swim(this.size);
    }

    del_min () {
        let minNode = this.arr[1];
        this.swap(1, this.size); 
        this.size--;
        this.sink(1);
        return minNode;
    }
}
```


## Heapsort
1. 上面的 `del_max` 可以实现为最大节点交换到堆列表尾部（`arr[heapSize-1]`），之后随着 `heapSize--`，之前的最大节点不在计入堆的范围中，但是仍然保存在 `arr` 中。
2. 那么反复调用 `del_max` 就可以从大到小的移除堆中的节点，被移除的节点按从小到大顺序保存在 `arr` 中
    ```cpp
    #define HEAP_LENGTH 10
    int heap[HEAP_LENGTH] = {4, 1, 3, 2, 16, 9, 10, 14, 8, 7};
    int heapSize = 10;

    int main(void) {
        heap_sort(heap, HEAP_LENGTH);
        print_arr(heap, 0, HEAP_LENGTH-1); // [1, 2, 3, 4, 7, 8, 9, 10, 14, 16]
        return 0;
    }

    void heap_sort(int* arr, int size) {
        build(arr);
        for (int i=0; i<size; i++) {
            del_max(arr);
        }
    }
    ```
3. `build` 的时间复杂度是 $O(n)$；每次 `sink` 的时间复杂度是 $O(\lg n)$，一共 $n-1$ 次。所以排序的复杂度是 $O(n \lg n)$。


## 优先队列（Priority Queues）
1. 许多应用程序都需要处理有序的元素，但不一定要求它们全部有序，或是不一定要一次就将它们排序。很多情况下我们会收集一些元素，处理当前键值最大的元素，然后再收集更多的元素，再处理当前键值最大的元素，如此这般。
2. 在这种情况下，一个合适的数据结构应该支持两种操作：**删除并返回最大元素**（或最小元素） 和 **插入元素**。这种数据类型叫做 **优先队列**。
3. 优先队列的典型应有包括作业调度，每次都要从作业队列中选择优先级最高的作业来执行，这可以用最大优先队列实现；还有比如基于事件驱动的模拟器，队列中保存着要模拟的事件，每个事件都有一个发生时间的属性，要按照时间从小到大依次的触发，这可以用最小优先队列实现。
4. 如果使用优先队列来处理一个数值数组，我们可以规定数组项就是队列元素，数组项值的大小就是元素的优先级。对于实际的应用中，优先队列对应的不是数组，而是应用程序中的对象，因此我们需要确定对象和队列元素的对应关系。为此，需要在队列的每个元素中存储对应对象的 **句柄**（handle），通过一个队列元素的句柄（如一个指针或者整型数），我们可以找到应用程序里对应的那个对象；同样在应用程序的每个对象中，我们也要存储一个可以找到对应队列元素的句柄，通常使用队列数组的下标（如果这个对象的优先级变化，那对应的下标也会跟着变化）。

### 删除并返回最大元素
直接使用 `del_max` 实现，因此时间复杂度是 $O(\lg n)$
```cpp
int dequeue(int* arr) {
    return del_max(arr);
}
```

### 提升一个元素的优先级
1. 增加一个数组项的值，然后通过上面实现的 swim 把它移动到合适的位置。
2. 提升之后，还要知道被提升到什么位置了，所以要返回 swim 的结果
    ```cpp
    int main(void) {

        print_arr(heap, 0, HEAP_LENGTH-1); // [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]
        int idx = increase_key (heap, 9, 11);
        printf("%d\n", idx); // 4
        print_arr(heap, 0, HEAP_LENGTH-1); // [16, 14, 10, 8, 11, 9, 3, 2, 4, 7]
    
        return 0;
    }

    int increase_key (int* arr, int index, int key) {
        if (index >= heapSize || index < 0) {
            printf("Increase failed, wrong index.\n");
        }
        else if (key < arr[index]) {
            printf("Increase failed, new key is smaller than current key.\n");
        }
        arr[index] = key;
        return swim_loop(arr, index);
    }
    ```
3. 时间复杂度由 swim 来决定，因此是 $O(\lg n)$。

### 加入新元素
1. 直接使用堆的 `insert` 方法
    ```cpp
    int enqueue (int* arr, int key) {
        return insert(arr, key);
    }
    ```
2. 时间复杂度由 `insert` 中的 swim 来决定，因此是 $O(\lg n)$。