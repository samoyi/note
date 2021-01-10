# 堆


<!-- TOC -->

- [堆](#堆)
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
    - [Heapsort](#heapsort)

<!-- /TOC -->


## 概述
1. 二叉堆的入队操作和出队操作均可达到 $O(\log n)$。
2. 二叉堆画出来很像一棵树，但实现时只用一个列表作为内部表示。
3. 二叉堆有两个常见的形式：**最小堆**（最小的元素一直在队首）与 **最大堆**（最大的元素一直在队首）。


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
8. 因此，对于在列表中处于位置 $p$ 的节点来说，它的左子节点正好处于位置 $2p$；同理，右子节点处于位置 $2p+1$
    <img src="./images/06.png" width="600"  style="display: block; margin: 5px 0 10px;" />
9. 对第 8 点的证明：
    1. 已知第 $n$ 行的第 $k$ 个元素的总序号是 $p$
    2. 根据上面第 6 条，可以得出来 $p = 2^{n-1} - 1 + k$
    2. 同样根据第 6 条，可以得出第 $n$ 行最后一个节点的总序号是 $2^n - 1$
    4. 因此第 $n+1$ 行的第 1 组两个节点的总序号是 $2^n$ 和 $2^n + 1$
    5. 第 $n+1$ 的第 2 组两个节点的总序号是 $2^n + 2$ 和 $2^n + 3$
    6. 因此第 $n+1$ 的第 $k$ 组两个节点的总序号是 $2^n + 2k-2$ 和 $2^n + 2k-1$，变形为 $2(2^{n-1} + k - 1)$ 和 $2(2^{n-1} + k - 1) + 1$
    7. 根据第 2 步，可以得出 $2p$ 和 $2p+1$
10. 证明含有 $n$ 个元素的堆的高度是 $\lfloor \lg n \rfloor$:
    1. 先用行数来计算。根据上面第 6 点，第 x 行的元素数量范围是 $[2^{x-1}, 2^x)$。
    2. 现在就假设 $n$ 个元素的堆有 $x$ 行，所以 $2^{x-1} \leq n < 2^x$。
    3. 取对数，有 $x-1 \leq \lg n < x$。所以 $x-1 = \lfloor \lg n \rfloor$。
    4. 因为 $x$ 是对的行数，所以 $x - 1$ 就是堆的高度。
11. 证明当用数组表示存储 $n$ 个元素的堆时，叶节点下表分别是 $\lfloor n/2 \rfloor + 1, \lfloor n/2 \rfloor + 2, ..., n$
    1. 因为最后一个节点的序号是 $n$，所以它的父节点是 $\lfloor n/2 \rfloor$。
    2. 而该父节点之后所有的节点都是叶节点。
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
4. 只要记住位置 $k$ 的节点的父节点的位置是 $\lfloor k/2\rfloor$，这个过程实现起来很简单
    ```js
    swim ( k ) {
        while ( k > 1 && this.less(Math.floor(k/2), k) ) {
            let parentIndex = Math.floor(k/2);
            this.swap(parentIndex , k);
            k = parentIndex;
        }
    }
    ```

### 小元素下沉
1. 如果堆的有序状态因为某个节点变得比它的两个子节点或是其中之一更小了而被打破了，那么我们可以通过将它和它的两个子节点中的较大者交换来恢复堆。
2. 交换可能会在子节点处继续打破堆的有序状态，因此我们需要不断地用相同的方式将其修复，将节点向下移动直到它的子节点都比它更小或是到达了堆的底部
    <img src="./images/14.png" width="400" style="display: block; margin: 5px 0 10px;" />
3. 由位置为 $k$ 的节点的子节点位于 $2k$ 和 $2k+1$ 可以直接得到对应的代码
    ```js
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
    ```
4. 《算法导论》中的递归实现
    ```js
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
    ```

### 复杂度
TODO  
运行时间是 $O(\lg n)$，堆的高度 $h$ 是 $\lfloor \lg n \rfloor$。所以时间复杂度是 $O(h)$。


## Building a heap
1. We can use the procedure MAX-HEAPIFY（小元素下沉） in a bottom-up manner to convert an
array $A[1 \ ..\ n]$, where $n = A.length$, into a max-heap. 
2. The elements in the subarray $A[\lfloor n/2 \rfloor + 1 \ ..\ n]$ are all leaves of the tree, and so each is a 1-element heap to begin with. 
3. The procedure BUILD-MAX-HEAP goes through the remaining nodes of the tree and runs MAX-HEAPIFY on each one
    ```js
    build () {
        for (let i=Math.floor(this.size/2); i>0; i--) {
            this.sink(i);
        }
    }
    ```

### 顺序问题
1. Why do we want the loop index `i` to decrease from $\lfloor n/2 \rfloor$ to $1$ rather than increase from `1` to $\lfloor n/2 \rfloor$? 
2. 对于现在的实现，当一个元素沉下去后，之后还是有可能再浮起来。比如《算法导论》88 页的节点 8。初看起来似乎是应该从上到下的，因为这样可以让最小的元素直接沉到底部。
3. 但这样的问题是，如果下面有更大的元素，它就只可能上浮一层，而不能一直上浮。如果采用这种方法，对于《算法导论》88 页的例子，第一次交换是节点 1 和 16，16 只会上浮一层，没有机会上到顶端了。
4. 现在正确的方法使得浮上去的元素之后还要再进行比较，而如果反过来从上到下，浮上去的元素就没有机会了。
5. 再反过来想一下，现在的方法会不会导致小元素下降一次之后就没有机会再下降？并不会，因为下降的方法是一降到底的。

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
        this.swim(this.size);
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
    ```js    
    insert (v) {
        this.arr.push(v);
        this.size++;
        this.swim(this.size);
    }

    swim (k) {
        while ( k > 1 && this.less(Math.floor(k/2), k) ) {
            let parentIndex = Math.floor(k/2);
            this.swap(parentIndex, k);
            k = parentIndex;
        }
    }
    ```

### 移除最大的顶节点
1. 把最后一个节点移到顶节点，然后再通过大小比较把它移动到合适的位置
    <img src="./images/08.png" width="400"  style="display: block; margin: 5px 0 10px;" />
2. `delMax` 先把最后一个节点移动到顶部，然后再使用 `sink` 方法把它移动到合适的位置
    ```js
    delMax () {
        let maxNode = this.arr[1];
        this.swap(1, this.size); 
        // 删除交换下来的最大节点。但并不是真的删除，只是不再计入堆的 list 中，排序的时候还会用到
        this.size--; 
        this.sink(1);
        return maxNode;
    }
    ```


## Heapsort
1. 上面实现的 `delMax` 可以把最大节点移到 `list` 尾部，然后再从 `list` 中移除。
2. 反复调用 `delMax` 就可以从大到小的移除堆中的节点，被移除的节点按从小到大顺序保存在 `arr` 中。
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
3. 为什么不是反向交换，也就是说从堆顶开始？