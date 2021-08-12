# 堆


<!-- TOC -->

- [堆](#堆)
    - [本质](#本质)
        - [维护同一子树中根节点与后代节点的大小关系](#维护同一子树中根节点与后代节点的大小关系)
        - [`swim` 和 `sink`](#swim-和-sink)
    - [设计思想](#设计思想)
        - [迁移时注意环境变动](#迁移时注意环境变动)
        - [排序](#排序)
        - [优先队列](#优先队列)
    - [用途](#用途)
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
        - [时间复杂度](#时间复杂度)
    - [优先队列（Priority Queues）](#优先队列priority-queues)
        - [最大优先队列（Max-priority queues）的实现](#最大优先队列max-priority-queues的实现)
            - [建立队列](#建立队列)
            - [删除并返回最大元素](#删除并返回最大元素)
            - [提升一个元素的优先级](#提升一个元素的优先级)
            - [加入新元素](#加入新元素)
        - [用最小堆实现最小优先队列](#用最小堆实现最小优先队列)

<!-- /TOC -->


## 本质
### 维护同一子树中根节点与后代节点的大小关系
1. 对于堆中的任意子树，根节点永远不小于它的后代节点；但如果两个节点并不是某个子树的根节点和后代节点的关系，那么它们的高度并不能保证大小关系。
2. 也就是说它维护的有序性并不是系统内任意两个节点的，而是系统中任意子系统的根节点和后代节点的。

### `swim` 和 `sink`
1. 两种操作都是对堆进行有序化，但两者并不能互相替代。也就是说，如果一个节点过大，那只能让该节点上浮，而不能让它的父节点下沉；如果一个节点过小，那只能让该节点下沉，而不能让它的子节点上浮。
2. 因为这两个操作都不是简单的交换节点，而是首先要通过参数标记一个位置错误的节点，然后把这个节点放在序列中正确的位置。所以在本质上，这其实是类似于插入排序的过程。


## 设计思想
### 迁移时注意环境变动
1. 在设计删除节点算法时很容易就会想到套用 `delMax` 中的方法，但是这个方法虽然在 `delMax` 中是正确的，但是放到删除节点时，却出现了问题。
2. 也就是说，同一个方法，放在不同的实验环境，很有可能就会产生不同的结果。
3. 在进行任何迁移时，都要考虑环境的改变。

### 排序
1. 上面本质中说到堆只能维护任意子树的根节点和后代节点的大小关系，所以排序的具体比较步骤只能发生在根节点和后代节点之间，而不能是任意两个节点。
2. 所以堆排序每次都是通过移除最大节点，因为你只能保证这种大小与关系是确定的。

### 优先队列
1. 同样根据上面的本质，优先队列只能保证子树的根节点相对于后代节点的优先，而不能保证整个队列是按照优先度排序的。
2. 所以，当我们希望 **一整组** 对象都要按照某个顺序时，就符合优先队列的特性。
3. 注意必须是一整组，这样才能通过不断的移除堆顶来维持顺序；而如果只是组内的一部分，是不能保证顺序的，因为顺序的维持必须要通过不断设置堆顶元素来实现。


## 用途


## 概述
1. 二叉堆的入队操作和出队操作均可达到 $O(\log n)$。
2. 二叉堆画出来很像一棵树，但实现时只用一个列表作为内部表示。
3. 二叉堆有两个常见的形式：**最小堆**（最小的元素一直在队首）与 **最大堆**（最大的元素一直在队首）。
4. Viewing a heap as a tree, we define the **height** of a node in a heap to be the number of edges on the longest simple downward path from the node to a leaf, and we define the height of the heap to be the height of its root. 
5. Since a heap of $N$ elements is based on a complete binary tree, its height is $Θ(lgN)$.
We shall see that the basic operations on heaps run in time at most proportional
to the height of the tree and thus take $O(lgN)$ time.


## 结构属性
1. 为了使二叉堆能高效地工作，我们利用树的对数性质来表示它。为了保证对数性能，必须维持树的平衡。
2. 平衡的二叉树是指，其根节点的左右子树含有数量大致相等的节点。
3. 在完全平衡的二叉树中，左右子树的节点数相同。最坏情况下，插入节点操作的时间复杂度是 $O(\log_2n)$，其中 $n$ 是树的节点数。
4. 在实现二叉堆时，我们通过创建一棵 **完全二叉树** 来维持树的平衡。在完全二叉树中，除了最底层，其他每一层的节点都是满的。在最底层，我们从左往右填充节点。
5. 完全二叉树的另一个有趣之处在于，可以用一个列表来表示它。由于树是完全的，任何一行完整的节点数都是前一行节点的 2 倍（$2^n$ 关系）。因为第 $i$ 行的节点数是 $2^i$（$i$ 从 0 开始计）。
6. 另外，根据等比数列求和公式 $\frac{a_1(1-q^n)}{1-q}$ 可得：
    * 前 $n$ 行（$n$ 从 1 开始计）的节点总数为 $\frac{1*(1-2^n)}{1-2} = 2^n - 1$；
    * 第 $n+1$ 行（$i=n$）的节点数是 $2^n$
7. 也就是说：$某一行完整的节点数=它上面所有节点数+1$。
8. 因此，对于在列表中处于位置 $p$（$p$ 从 1 开始计）的节点来说，它的左子节点正好处于位置 $2p$；同理，右子节点处于位置 $2p+1$
    <img src="./images/06.png" width="600"  style="display: block; margin: 5px 0 10px;" />
9. 对第 8 点的证明：
    1. 已知第 $n$ 行的第 $k$ 个元素的总序号是 $p$
    2. 根据上面第 6 条，可以得出来 $p = 2^{n-1} - 1 + k$
    2. 同样根据第 6 条，可以得出第 $n$ 行最后一个节点的总序号是 $2^n - 1$
    4. 因此第 $n+1$ 行的第 1 组两个节点的总序号是 $2^n$ 和 $2^n + 1$
    5. 第 $n+1$ 的第 2 组两个节点的总序号是 $2^n + 2$ 和 $2^n + 3$
    6. 因此第 $n+1$ 的第 $k$ 组两个节点的总序号是 $2^n + 2k-2$ 和 $2^n + 2k-1$，变形为 $2(2^{n-1} + k - 1)$ 和 $2(2^{n-1} + k - 1) + 1$
    7. 根据第 2 步，可以得出 $2p$ 和 $2p+1$。
    8. 如果 $p$ 从 0 开始计，则两个子节点是 $2p+1$ 和 $2p+2$，父节点就是 $\lfloor (p-1)/2 \rfloor$。
10. 证明含有 $n$ 个元素的堆的高度是 $\lfloor \lg n \rfloor$:
    1. 先用行数来计算。根据上面第 6 点，第 x 行的元素数量范围是 $[2^{x-1}, 2^x)$。
    2. 现在就假设 $n$ 个元素的堆有 $x$ 行，所以 $2^{x-1} \leq n < 2^x$。
    3. 取对数，有 $x-1 \leq \lg n < x$。所以 $x-1 = \lfloor \lg n \rfloor$。
    4. 因为 $x$ 是堆的行数，所以 $x - 1$ 就是堆的高度。
11. 证明当用数组表示存储 $n$ 个元素的堆时，叶节点下标分别是 $\lfloor n/2 \rfloor + 1, \lfloor n/2 \rfloor + 2, ..., n$
    1. 这里可以通过观察一个二叉堆的图的方法。
    2. 看出来最后一个非叶节点就是第 $n$ 个节点的父节点，所以该节点的序号为 $\lfloor n/2 \rfloor$。
    3. 而该父节点之后所有的节点都是叶节点。
12. 证明对于有 $n$ 个元素的堆中，至少有 $\lceil n/2^{h+1} \rceil$ 个高度为 $h$ 的节点
    1. 根据上面第 7 点，如果最后一行（$h=0$）最多有 $\lceil n/2 \rceil$ 个节点。
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
4. 只要记住位置 $k$ 的节点的父节点的位置是 $\lfloor k/2\rfloor$（序号从 1 开始），这个过程实现起来很简单
    ```cpp
    #define HEAP_LENGTH 10

    int heap[HEAP_LENGTH] = {16, 14, 10, 8, 17, 9, 3, 2, 4, 1};

    int heapSize = HEAP_LENGTH;

    void swim_recursive (int* arr, int i);


    int main(void) {

        swim_recursive(heap, 4);
        print_arr(heap, 0, heapSize-1); // [17, 16, 10, 8, 14, 9, 3, 2, 4, 1]
        return 0;
    }

    void swim_recursive (int* arr, int i) {
        int pIdx = (i-1)/2; // 序号从 0 开始
        if (pIdx >= 0 && arr[pIdx] < arr[i]) {
            swap(arr, pIdx, i);
            i = pIdx;
            swim_recursive(arr, i);
        }
    }
    ```
5. 循环实现。最初实现成了下面的样子
    ```cpp
    void swim_loop (int* arr, int i) {
        int pIdx = (i-1)/2;
        while (pIdx >= 0 && arr[pIdx] < arr[i]) {
            swap(arr, pIdx, i);
            i = pIdx;
            pIdx = (i-1)/2;
        }
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
    // 这里不包括起始的 null；以及 delMax 时，只是不计入 list 中，而并不会真的从 arr 中移除
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

    delMax () {
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
    void insert(int* arr, int k) {
        if (heapSize < HEAP_LENGTH) {
            arr[heapSize] = k;
            printf("%d\n", heapSize);
            swim_loop(arr, heapSize);
            heapSize++;
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
    void delMax(int* arr) {
        if (heapSize > 0) {
            arr[0] = arr[heapSize-1];
            sink_loop(arr, 0);
            heapSize--;
        }
        else {
            printf("Insert failed, heap is empty.\n");
        }
    }
    ```

### 删除节点
1. 有了上面的 `delMax`，大概很容易想到这样的实现
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
2. 但是 `[15, 7, 9, 1, 2, 3, 8]` 这样的数组在执行 `delete(5)` 时就暴露了问题：最后一个元素被交换后并不需要往下移动，而是需要往上移动。`delMax` 之所以没有问题，是因为被交换到了顶部，只有下移的可能存在。
3. 而其他情况的交换，只要两个节点没有明确的 “祖先-后代” 关系，就不能确定它俩的大小关系，所以最后一个节点交换过去（都不能说交换上去，因为就像上面这个例子中这样两者其实高度是一样的）之后，不一定是要上浮还是下沉。
4. 既然交换之后有可能需要上移也有可能是下移，那就做个判断
    ```js
    delete(i) {
        if (i > this.size || i < 1) {
            throw new RangeError("Wrong index");
        }
        let deletedNode = this.arr[i];
        this.swap(i, this.size); 
        this.size--;
        let parent = this.arr[Math.floor(i/2)];
        if (parent && parent<this.arr[i]) {
            this.swim(i);
        }
        else {
            this.sink(i);
        }
        return deletedNode;
    }
    ```
4. 其实还可以简化。因为 `swim` 方法本身就可以判断父节点是否存在以及是否比父节点大；而且，只要换上来的节点比被删除的节点大，它就只可能是 `swim`，否则就只可能是 `sink`
    ```js
    delete(i) {
        if (i > this.size || i < 1) {
            throw new RangeError("Wrong index");
        }
        let deletedNode = this.arr[i];
        this.swap(i, this.size); 
        this.size--;
        if (this.arr[i] > deletedNode) {
            this.swim(i);
        }
        else {
            this.sink(i);
        }
        return deletedNode;
    }
    ```


## 最小堆的实现
需要修改 `swim` 和 `sink` 方法，以及把 `delMax` 换成 `delMin`
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

    delMin () {
        let minNode = this.arr[1];
        this.swap(1, this.size); 
        this.size--;
        this.sink(1);
        return minNode;
    }
}
```


## Heapsort
1. 上面实现的 `delMax` 可以把最大节点移到 `list` 尾部，然后再从 `list` 中移除。
2. 那么反复调用 `delMax` 就可以从大到小的移除堆中的节点，被移除的节点按从小到大顺序保存在 `arr` 中
    ```js
    function heapSort(arr) {
        let heap = new BinaryHeap(arr);

        let size = heap.size;
        for (let i=size; i>1; i--) {
            heap.delMax();
        }
        return heap.arr.slice(1);
    }
    ```
3. 为什么不是反向交换，也就是说从堆顶开始？好像也可以，试了一下没发现问题
    ```js
    for (let i=1; i<size; i++) {
        heap.delMax();
    }
    ```

### 时间复杂度
1. `build` 的时间复杂度是 $O(n)$；每次 `sink` 的时间复杂度是 $O(\lg n)$，一共 $n-1$ 次。所以排序的复杂度是 $O(n \lg n)$。
2. 如果输入数组是升序的，复杂度如何？因为是升序，所以 build 过程移动的会比较多，因为整体要让小节点下来大节点上去，但时间复杂度仍然是 $O(n)$。在经过 build 后，其实也就打乱顺序了，而且升序的数组并不会让 build 更快。所以复杂度还是一样的。
3. 降序呢？降序的数组在 build 时每个 sink 都会在第一次 `while` 循环 break，但 build 的复杂度仍然是 $O(n)$ 级别。build 完之后顺序并没有改变，还是降序的，正好和期望的排顺序相反，排序会不会更慢呢？因为是降序，所以每次 `delMax` 中的 `sink` 都会从根节点下降到叶节点，但仍然是 $O(\lg n)$ 界别的。所以整体的时间复杂度还是不变的。


## 优先队列（Priority Queues）
1. 许多应用程序都需要处理有序的元素，但不一定要求它们全部有序，或是不一定要一次就将它们排序。很多情况下我们会收集一些元素，处理当前键值最大的元素，然后再收集更多的元素，再处理当前键值最大的元素，如此这般。
2. 在这种情况下，一个合适的数据结构应该支持两种操作：**删除并返回最大元素**（或最小元素） 和 **插入元素**。这种数据类型叫做 **优先队列**。
3. 优先队列的典型应有包括作业调度，每次都要从作业队列中选择优先级最高的作业来执行，这可以用最大优先队列实现；还有比如基于事件驱动的模拟器，队列中保存着要模拟的事件，每个时间都有一个发生时间的属性，要按照时间从小到大依次的触发，这可以用最小优先队列实现。
4. 如果使用优先队列来处理一个数值数组，我们可以规定数组项就是队列元素，数组项值的大小就是元素的优先级。对于实际的应用中，优先队列对应的不是数组，而是应用程序中的对象，因此我们需要确定对象和队列元素的对应关系。为此，需要再队列的每个元素中存储对应对象的 **句柄**（handle），通过一个队列元素的句柄（如一个指针或者整型数），我们可以找到应用程序里对应的那个对象；同样在应用程序的每个对象中，我们也要存储一个可以找到对应队列元素的句柄，通常使用队列数组的下标（如果这个对象的优先级变化，那对应的下标也会跟着变化）。

### 最大优先队列（Max-priority queues）的实现
#### 建立队列
```js
class Max_Priority_Queue {
    constructor (arr) {
        this.heap = new BinaryHeap(arr);
    }

    get list () {
        return this.heap.list;
    }

    get maximum () {
        return this.heap.list[1];
    }
}
```

#### 删除并返回最大元素
时间复杂度由 `delMax` 中的 `sink` 来决定，因此是 $O(\lg n)$
```js
dequeue () {
    if (this.heap.size < 1) {
        throw new RangeError("Heap underflow");
    }

    return this.heap.delMax();
}
```

#### 提升一个元素的优先级
1. 增加一个数组项的值，然后通过上面实现的 `swim` 把它移动到合适的位置。
2. 提升之后，还要知道被提升到什么位置了，所以要返回 `swim` 的结果。在堆的实现中，序号是从 1 开始计的，不过感觉这里的队列还是从 0 开始计比较合适，所以 `increase_key` 的实现里涉及两个 +1 和一个 -1 的操作
    ```js
    increase_key (index, key) {
        if (index >= this.heap.size || index < 0) {
            throw new RangeError("Wrong index");
        }
        if (key < this.list[index]) {
            throw new RangeError("New key is smaller than current key");
        }
        this.heap.arr[index+1] = key;
        return this.heap.swim(index+1) - 1;
    }
    ```
3. 时间复杂度由 `swim` 来决定，因此是 $O(\lg n)$。

#### 加入新元素
1. 把一个元素加入到最后，然后根据优先级 `swim` 到合适的位置。可以直接使用堆的 `insert` 方法
    ```js
    enqueue (key) {
        let idx = this.heap.size + 1;
        this.heap.arr[idx] = key;
        return this.heap.insert(idx) - 1;
    }
    ```
2. 时间复杂度由 `insert` 中的 `swim` 来决定，因此是 $O(\lg n)$。

### 用最小堆实现最小优先队列
只需要把 `increase_key` 换成 `decrease_key`
```js
decrease_key (index, key) {
    if (index >= this.heap.size || index < 0) {
        throw new RangeError("Wrong index");
    }
    if (key > this.list[index]) {
        throw new RangeError("New key is bigger than current key");
    }
    this.heap.arr[index+1] = key;
    return this.heap.swim(index+1) - 1;
}
```