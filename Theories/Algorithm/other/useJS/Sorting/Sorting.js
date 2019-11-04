/*
 * 其他参考:
 * [JS家的排序算法](http://www.jianshu.com/p/1b4068ccd505)
 *
 */


// Swapping variables with destructuring assignment causes significant
// performance loss, as of October 2017.
// [arr[i], arr[j]] = [arr[j], arr[i]];
function swap(arr, index1, index2) {
    let aux = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = aux;
}

/**
 * 参考《学习JavaScript数据结构与算法》上面的步骤图：
 * 1. 将一个数组拆为两个数组，再递归拆这两个子数组。一路递归直到拆为一个个的单项数组。
 * 2. 但还需要再反向 merge 回一个数组。不管是最后的单项数组，还是过程中的多项子数组，都要进行 merge。
 * 3. 因此每次递归拆分开的两个子数组，都要传给 merge 函数。
 * 4. 在拆分的时候，left 和 right 的数组还没有排好顺序的。但是等反向回来之后实际执行 merge 的时候，两个参数就已经是排好顺序的了。
 * 5. 之所以 mergeSortRec 要返回 merge 的结果，因为在两个小数组 merge 为一个大数组后，这个大数组还要在外层和另一个大数组 merge
 *    。这样一返回，就返回到了外层函数里面的 merge 参数上，就可以继续 merge 了。
 */
function mergeSortRec(arr) {
    let len = arr.length;
    if (len === 1) return arr;

    let mid = Math.floor(len / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid, len);

    return merge(mergeSortRec(left), mergeSortRec(right));
}
/**
 * 这里 merge 的两个数组必须是排好序的数组，如果数组只有一项，也可以认为是排好序的
 * 因为要求数组必须是排好序的，所以上面拆分的过程必须要一拆到底，否则两个子数组很有可能就不是排好序的。想象[15, 20], [99, 1]这两* 个字数组，按照下面的 merge 方法得到的结果将是[15, 20, 99, 1]。
 * 这里的排序排序方法是从小到大，也就是说 left 和 right 两个数组 merge 为一个之后所有的项也是从小到大排列
 * 想想现实中人脑 merge 的过程：
 *      1. 有一个结果数组，用来放置 merge 后的结果。
 *      2. 分别挑选 left 和 right 中各自最小的项，比较选出更小的，push 进结果数组。第一次挑选时，肯定都是分别挑选第 0 项。
 *      3. 第二轮再选择时，上一轮比小输了的数组还是要选出刚才的第 0 项，而刚才比小赢了的数组就要选出第 1 项，两项再进行比较。
 *      4. 以此类推。也就是说，如果某个数组比小赢了，则该数组的选择序号就要加 1。
 *      5. 这种比较的终止条件，就是有一个数组的最右一项也比小赢了，那么该数组的所有项都已经被加入了结果数组。而另一个数组里肯定至*         少还有一项之多还有所有的项没有被加入结果数组。
 *      6. 最后一步就是把剩下的那个数组的数组项依次 push 到结果数组。
 */
function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let leftLen = left.length;
    let rightLen = right.length;

    while (leftIndex < leftLen && rightIndex < rightLen) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }
    while (leftIndex < leftLen) {
        result.push(left[leftIndex++]);
    }
    while (rightIndex < rightLen) {
        result.push(right[rightIndex++]);
    }

    return result;
}

/* partition函数的作用
 * 1. 选定一个 pivot 项，其他数组项通过与 pivot 进行比较，以及相应的位置交换，使得在该数组中，pivot 左侧的都小于等于 pivot，
 *    pivot 右侧的项都大于等于 pivot。
 * 2. 这两部分整体的大小关系已经确定了，就是左边的任一都小于等于右边的任一项。接下来就是分别对这两个部分再递归上面的过程。
 * 3. 因此返回后一部分的第一项的 index， 表明划分的位置，用以递归前后两部分。
 * 4. 这样递归的不断细分的整体分类大小，操作的子数组会越来越小，最底层会是两项或单项数组的操作，最终实现了从粗到细的完整排序。
 *
 * 在分析大小比较和位置交换的过程中，虽然 arr[i] 和 arr[j] 是和数组的某一项的值比较，但是不要想着是和某一项比较。
 * 虽然 pivot 的值是从某一项选出来的，但选出来之后它就独立于数组，并且会和数组里每一项的值比较，包括它所由来的那一项。
 * 以这个数组为例：[4, 6, 1, 7, 8, 2, 5, 3, 9, 0]。
 * 不是其他项和第五项 8 比较，而是说，选出一个 pivot 值为 8，然后数组中每一项进行位置变化，变化为之后，在某一现在还不确定的位置，* 该位置左边都是小于 8，右边都是大于等8。
 * 如果要把 pivot 插入排好的数组，就会插到这个位置。当然 pivot 不需要也不能插进数组，因为它本身就不属于数组。数组项 8 属于数组，* 但 pivot不属于数组。
 * 如果想象成数组其他项和一个基准项比较，而当该基准项也发生了位置交换，就会显得有些混乱。
 * 
 */
function partition(arr, leftIndex, rightIndex) {
    // 选定中间项的值作为 pivot
    let pivot = arr[Math.floor((rightIndex + leftIndex) / 2)];
    // 从左右两端开始进行比较
    let i = leftIndex;
    let j = rightIndex;

    // TODO 这里为什么是 <= 而不是 < ?
    while (i <= j) { // 只要两边比较的指针没有交错
        /**
         * 下面两个和 pivot 的比较必须排除等于的情况，如果包含等于，则有可能出错。
         * 考虑当 i 行进到 pivot 的位置时，这时如果是 <= 判断，则 i 会继续增大，假如 pivot 之后没有更大的元素了，则 i 就会一直增* 大下去。
         * 
         */
        while (arr[i] < pivot) { // 左边的指针一直移动到大于等于 pivot 的项
            i++;
        }
        while (arr[j] > pivot) { // 右边的指针一直移动到小于等于 pivot 的项
            j--;
        }
        /**
         * TODO 这里必须是 <= 而非 < 的原因
         * 假如是 < ，如果 i、j 同时落到了 pivot 元素上，不会进行 swap，i 和 j 还是相同，满足 i<=j，进入下一轮大 while。
         * 但是下一轮大 while 中的两个小 while 并不会执行，因为都是相等的，所以又会走到这里，无限循环。
         * 但是，即使大 while 的判断你条件改为 <，还是会出现无限循环的情况。
         */
        
        if (i <= j) { // 两边一动暂停后，如果没有相遇，
            // 则交换。通过该次交换，保证了从起始位置到当前位置，左边所有的项都
            // 是小于 pivot 的值，右边所有的项都是大于 pivot 的值
            swap(arr, i++, j--);
        }
    }
    // 循环比较结束，i 左边的都小于等于 pivot，i 右边的都大于等于 pivot
    return i;
}
function quick(arr, leftIndex, rightIndex) {
    let index = null;

    if (arr.length > 1) {
        // 对数组进行一次大小二分
        index = partition(arr, leftIndex, rightIndex); // 对数组进行一次大小二分
        if (leftIndex < index - 1) { // partition 之后左边的数组项不止一个
            quick(arr, leftIndex, index - 1); // 继续进行二分
        }
        if (index < rightIndex) { // partition 之后右边的数组项不止一个
            quick(arr, index, rightIndex); // 继续进行二分
        }
    }
}

function heapify(arr, i) { // 堆调整
    let leftChildIndex = 2 * i + 1; // 序号为 i 的节点的左侧子节点
    let rightChildIndex = 2 * i + 2; // 序号为 i 的节点的右侧子节点
    let largestIndex = i; // 这个变量用来保存在这一父二子结构中，值最大的那个节点的 index，暂定父节点

    // 如果左侧子节点比父节点更大，则 largestIndex 设置为左侧子节点的 index
    if (leftChildIndex < this.heapSortLen && arr[leftChildIndex] > arr[largestIndex]) {
        largestIndex = leftChildIndex;
    }
    // 如果右侧子节点比上一步比较重更大的那个节点值更大，则 largestIndex 设置为右侧子节点的 index
    if (rightChildIndex < this.heapSortLen && arr[rightChildIndex] > arr[largestIndex]) {
        largestIndex = rightChildIndex;
    }
    // 经过了上面两步比较，如果最大的节点不再是父节点，
    if (largestIndex !== i) {
        // 则将父节点和最大节点位置交换，这样保证了在这个一父二子的结构里，父节点的值是最大的
        // 注意在交换的时候 index 并没有交换，因此此时 largestIndex 对应的节点是某一个子节点，对应的值是最初父节点的值
        [arr[largestIndex], arr[i]] = [arr[i], arr[largestIndex]];
        // 下面的递归，将继续给这个当初父节点的值向下寻找合适的位置，直到它在一个父子（一父一子）的结构里可以成为最大的父节点，
        // 即largestIndex===i；或者它向下找到最后也没有成为一个父节点，而成为了一个没有子节点的末尾结点
        heapify(arr, largestIndex);
    }
}
function buildMaxHeap(arr) { // 建立大顶堆
    this.heapSortLen = arr.length;
    // 从最后一个内部节点开始排序来建立大顶堆
    for (let i = Math.floor(this.heapSortLen / 2) - 1; i >= 0; i--) {
        heapify(arr, i);
    }
}



function bubbleSort(arr) {
    let remain = arr.length - 1;
    while (remain > 0) {
        for (let i=0; i<remain; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(arr, i, i + 1);
            }
        }
        remain--;
    }
    return arr;
}

function selectionSort(arr) {
    let len = arr.length;
    for (let i=0; i<len-1; i++) {
        for (let j=i+1; j<len; j++) {
            if (arr[j] < arr[i]) {
                swap(arr, i, j);
            }
        }
    }
    return arr;
}

function insertionSort(arr) {
    let len = arr.length;
    for (let i=1; i<len; i++) {
        let currItem = arr[i]; // 本轮比较要插入到合适位置的项
        let j = i;
        // 依次和前面已排序的项比较
        // 如果比前一项小，则把前一项向后移动一位，前一项会空出来（为一个重复值）
        while (j > 0 && currItem < arr[j-1]) {
            arr[j] = arr[j-1];
            j--; // j 减一后，位置为空出来的项
        }
        arr[j] = currItem;
    }
    return arr;
}

function mergeSort(arr) {
    return mergeSortRec(arr);
}

// 参考 http://blog.jobbole.com/100531/
function quickSort(arr) {
    quick(arr, 0, arr.length - 1);
    return arr;
}

// 参考 https://www.cnblogs.com/chengxiao/p/6104371.html
/**
 * 和 quick sort 的思路有些像， 都是不断地粗糙但是快速的使数组大体上更有序， 以降低之后排序的时间消耗。
 * shell sort 在分组后也是使用 insertion sort， 但因开始的分组组中项较少， 之后的分组组中项组件增多但渐渐有序， 所以插入排序的效
 *     率不会很低。
 */
/**
 * 算法逻辑
 * 
 * 以 10 项数组为例，gap 分别为 5、2、1
 * gap 为 5 时，跨度为 5 的选取同组项。因为跨度很大，很快就跨过了整个数组，所以一组内的同组项数量很少，此时为 2，也就是说把整个
 *     数组分为了 5 个子数组
 * 下面要分别对这 5 个子数组进行插入排序。想想插入排序的规则，当对一个数组进行排序是，开始时是选取数组的第 1 项，而不是第 0 项。
 *     所以下面第二层 for 循环时的 i 设定为 gap 值，正好是第一个子数组的第 1 项。之后 i 递增，是第二个子数组的第 1 项。以此类推。
 * 与直接插入排序不同的是，这里进行插入排序的是以 gap 为间距分散开的数组，所以在 while 循环中，当前项的前一项不是减 1 而是减去
 *     gap。
 * 需要特别注意的是，这里比如当gap 为 2 时，整体数组分成两个 5 项子数组后进行插入排序时，并不是排完了第一个子数组再排第二个子数
 *     组，而是两个子数组一个排一步。步骤如下：
 *     1. 第一个子数组先用其第 1 项（整体数组第 2 项）往前比较，然后第二个数组用其第 1 项（整体数组第 3 项）往前比较；
 *     2. 第一个子数组先用其第 2 项（整体数组第 4 项）往前比较，然后第二个数组用其第 2 项（整体数组第 5 项）往前比较；
 *     3. 第一个子数组先用其第 3 项（整体数组第 6 项）往前比较，然后第二个数组用其第 3 项（整体数组第 7 项）往前比较；
 *     4. 第一个子数组先用其第 4 项（整体数组第 8 项）往前比较，然后第二个数组用其第 4 项（整体数组第 9 项）往前比较。
 */
function shellSort(arr) {
    let len = arr.length;
    for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < len; i++) {
            if (gap === 2) console.log(gap, i)
            let j = i;
            let current = arr[i];
            while (j - gap >= 0 && current < arr[j - gap]) {
                arr[j] = arr[j - gap];
                j = j - gap;
            }
            arr[j] = current;
        }
    }
    return arr;
}

// 参考 https://www.cnblogs.com/chengxiao/p/6129630.html

// [4, 6, 1, 7, 8, 2, 5, 3, 9, 0, 10, 12, 18, 11, 15]
//            4
//     6            1
//  7     8     2      5
// 3 9  0 10  12 18  11 15

// 二叉树完整的一行的节点数是该行之上所有节点数的总和加一的证明过程
// 设某一行节点数为 n;
// 则该行之前的所有行的节点的总和数量为：
//     (n/2)/(2^0) + (n/2)/(2^1) + (n/2)/(2^2) +...+ (n/2)/(2^m), 变形为：
//     n/(2^1)     + n/(2^2)     + n/(2^3)     +...+ n/(2^(m+1))
// 并且第一行是一个节点，即 n/(2^(m+1)) = 1
// 等比数列。求和的三个系数如下：
//     nFirst = n/2,
//     nLength = Math.log2(n),
//     nCommonRatio = 1/2;
// 根据求和公式，和为：n/2 * (1-Math.pow(1/2, Math.log2(n))) / (1-1/2)
// 其中 Math.pow(1/2, Math.log2(n)) 的结果为 1/n
// 最终结果为 n-1

// 最后一个内部节点（非叶节点）的index值为 Math.floor(len/2)-1 的证明
// 对于完整的树，根据上面的证明过程，是很明显的。完整树对应的数组每少两个元素，最
// 后一个内部节点的位置也就会向左移动一个，符合Math.floor(len/2)-1的规律

// TODO 堆排序没看懂
function heapSort(arr) {
    this.heapSortLen = 0;
    buildMaxHeap(arr);
    for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        this.heapSortLen--;
        // 交换位置并排除了最大的元素之后，现在的大顶堆的根节点的位置是错误的，但
        // 其他节点的位置还是正确的大顶堆顺序。现在需要使用heapify把当前根节点的
        // 值放到合适的位置，把根节点的位置让给剩余节点中最大的。
        // 然后进入下一轮循环，根节点的值和最后一个节点的值交换，并再次重复上述过
        // 程
        heapify(arr, 0);
    }
    return arr;
}


module.exports = {
    bubbleSort,
    selectionSort,
    insertionSort,
    shellSort,
    mergeSort,
    quickSort,
    heapSort,
};