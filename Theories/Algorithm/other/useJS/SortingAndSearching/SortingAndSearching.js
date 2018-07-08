/*
 * 其他参考:
 * [JS家的排序算法](http://www.jianshu.com/p/1b4068ccd505)
 *
 */

// Swapping variables with destructuring assignment causes significant
// performance loss, as of October 2017.
// [arr[i], arr[j]] = [arr[j], arr[i]];
function swap(arr, index1, index2){
    let aux = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = aux;
}

function SortingAndSearching(){

    // 叫 bubble 其实也不是很形象
    // 动画：https://www.programming-algorithms.net/article/39344/Bubble-sort
    // 比较任何两个相邻的项，如果第一个比第二个大，则交换它们
    // 动画是小数向右冒泡，下面的代码是大数向右冒泡
    // O(n^2)
    this.bubbleSort = function(arr){
        let len = arr.length;
        while(len-- > 1){
            for(let i=0; i<len; i++){
                if(arr[i] > arr[i+1]){
                    swap(arr, i, i+1);
                }
            }
        }
        return arr;
    };


    // 每轮在剩余的项里找出最小的
    // 动画：https://www.programming-algorithms.net/article/39430/Selection-sort
    // O(n^2)
    this.selectionSort = function(arr){
        let len = arr.length,
            indexMin = null;
        for (let i=0; i<len-1; i++){
            indexMin = i;
            for (let j=i+1; j<len; j++){
                if (arr[indexMin] > arr[j]){
                    indexMin = j;
                }
            }
            if (i !== indexMin){
                swap(arr, i, indexMin);
            }
        }
        return arr;
    };


    // 每轮将最左边的未排序的数逐个向左比较，将它排到第一不比它大的数后面，或者排到首位
    // 动画：https://www.programming-algorithms.net/article/39459/Insertion-sort
    // 动画是从大到小，下面的代码是从小到大
    // O(n^2)
    this.insertionSort = function(arr){
        let len = arr.length,
            current = null, // 最左边的未排序的数
            j = null;
        for (let i=1; i<len; i++){
            current = arr[i];
            j = i;
            // 直到发现一个不大与它的；或者没发现，它最小
            while (j>0 && arr[j-1]>current){
                // 逐个向左
                arr[j] = arr[j-1]; // 它逐个向左，就要逐个和它左边的交换位置
                j--;
            }
            // arr[j-1]不比current小了，所以current放到它右边
            // 或者 j已经为0了，current就是目前最小的
            arr[j] = current;
        }
    };


    // https://www.cnblogs.com/chengxiao/p/6104371.html
    // 和quick sort的思路有些像，都是不断地粗糙但是快速的使数组大体上更有序，以降低之
    // 后排序的时间消耗。shell sort的最后一步也是使用效率较低的insertion sort，但因
    // 为之前已经若干次快速的将数组排的比较有序，最后的insertion sort会很快的完成，从
    // 而整体的排序用时较少。
    this.shellSort = function(arr) {
        var len = arr.length,
            temp = null,
            gap = 1;
        while(gap < len/3){ // 动态定义间隔序列
            gap = gap*3+1;
        }
        for(; gap>0; gap=Math.floor(gap/3)){
            for(let i=gap; i<len; i++){
                temp = arr[i];
                let j = 0;
                for(j=i-gap; j>=0 && arr[j]>temp; j-=gap){
                    arr[j+gap] = arr[j];
                }
                arr[j+gap] = temp;
            }
        }
        return arr;
    };


    // 直接看《学习JavaScript数据结构与算法》就很明确了
    // O(n log^n)
    // 首先会一直递归 mergeSortRec，不断将数组一分为二
    // 倒数第二轮执行两个 mergeSortRec 时，left 和 right 都只有一项
    // 因此最后一轮执行两个 mergeSortRec 时，会分别返回一个单项数组
    // 递归结束，开始执行外面的 merge
    // 两个单项数组 merge，小的排到了 result 左边，大的在右边
    // merge 的结果作为 mergeSortRec 的结果被返回，即 mergeSortRec返回一个两项数组
    // 两个 mergeSortRec 分别返回一个两项数组，再被 merge
    // 这次，merge 参数的 left 和 right 分别是排序好了的两项数组
    // 根据 merge 的规则，它们会 merge 成一个从小到大的四项数组
    // 然后四项数组在作为之前递归的 mergeSortRec 的结果返回，以此类推，最终排序完成
    this.mergeSort = function(arr){
        return mergeSortRec(arr);
    };
    function mergeSortRec(arr){
        let len = arr.length;
        if (len===1)  return arr;

        let mid = Math.floor(len / 2),
            left = arr.slice(0, mid),
            right = arr.slice(mid, len);

        return merge(mergeSortRec(left), mergeSortRec(right));
    }
    function merge(left, right){

        let result = [],
            il = 0,
            ir = 0;

        while (il < left.length && ir < right.length){
            if (left[il] < right[ir]){
                result.push(left[il++]);
            }
            else {
                result.push(right[ir++]);
            }
        }
        while (il < left.length){
             result.push(left[il++]);
        }
        while (ir < right.length){
            result.push(right[ir++]);
        }

        return result;
    };


    // quickSort分析
    /*
     * This article is easier: http://blog.jobbole.com/100531/
     * In this article, chooses the first element as pivot. Basic logic is, by
     * moving i and j, and swapping values, makes sure that the pivot value is
     * always betweet i and j. When i meets j, elements on their left are
     * smaller than pivot value, elements on their right are bigger than pivot
     * value. And value on this position is also smaller than pivot value, so
     * put pivot here by swapping it with this element. Now pivot element
     * dividing this array into 2 subarray, all elements in left subarray are
     * smaller than pivot, elements in right subarray are bigger than pivot.
     */

     this.quickSort = function(arr){
         quick(arr,  0, arr.length - 1);
         return arr;
     };
     function quick(arr, leftIndex, rightIndex){
         let index = null,
             len = arr.length;

         if (arr.length > 1){
             index = partition(arr, leftIndex, rightIndex); // 对数组进行一次大小二分
             if (leftIndex < index - 1) { // partition 之后左边的数组项不止一个
                 quick(arr, leftIndex, index - 1); // 继续进行二分
             }
             if (index < rightIndex) { // partition 之后右边的数组项不止一个
                 quick(arr, index, rightIndex); // 继续进行二分
             }
         }
     }
     /* partition函数的作用
      * 对于一个数组 arr，通过 leftIndex 和 rightIndex 指明一个子数组，对该子数组进
      * 行二分：
      *   1. 选定一个 pivot，通过与其他子数组项进行比较，以及相应的位置交换，将该子数
      *      组分为两部分，前一部分的项都小于 pivot，后一部分的项都大于等于 pivot。
      *   2. 然后返回后一部分的第一项的 index，表明划分的位置。
      *   3. 通过 quick 函数的递归来递归调用 partition 函数对数组进行拆分排序，最终拆
      *      到只剩两项或一项的时候，就完成了排序
      *
      * 在分析大小比较和位置交换的过程中，虽然 arr[i] 和 arr[j] 是和数组的某一项的值比
      * 较，但是不要想着是和某一项比较。虽然pivot的值是从某一项选出来的，但选出来之后它
      * 就独立于数组，并且会和数组里每一项的值比较，包括它所由来的那一项。以这个数组为
      * 例：[4, 6, 1, 7, 8, 2, 5, 3, 9, 0]。
      * 不是其他项和第五项 8 比较，而是说，选出一个 pivot 值为 8，然后数组中每一项进行
      * 位置变化，变化为之后，在某一现在还不确定的位置，该位置左边都是小于 8，右边都是
      * 大于等8。如果要把 pivot 插入排好的数组，就会插到这个位置。当然 pivot 不需要也
      * 不能插进数组，因为它本身就不属于数组。数组项 8 属于数组，但 pivot不属于数组。
      *
      * 如果想象成数组其他项和一个基准项比较，而当该基准项也发生了位置交换，就会显得有
      * 些混乱。
      */
      function partition(arr, leftIndex, rightIndex) {
          // 选定中间项的值作为 pivot
          let pivot = arr[Math.floor((rightIndex + leftIndex) / 2)];
          // 从左右两端开始进行比较
          let i = leftIndex;
          let j = rightIndex;

          while (i <= j) { // 只要两边比较的指针没有相遇
              while (arr[i] < pivot) { // 左边的指针一直移动到大于等于 pivot 的项
                  i++;
              }
              while (arr[j] > pivot) { // 右边的指针一直移动到小于等于 pivot 的项
                  j--;
              }
              if(i <= j) { // 两边一动暂停后，如果没有相遇，
                  // 则交换。通过该次交换，保证了从起始位置到当前位置，左边所有的项都
                  // 是小于 pivot 的值，右边所有的项都是大于 pivot 的值
                  swap(arr, i++, j--);
              }
          }
          // 循环比较结束，i 左边的都小于等于 pivot，i 右边的都大于等于 pivot
          return i;
      }


     // heap sort
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

     let heapSortLen = 0;
     this.heapSort = function(arr){
         buildMaxHeap(arr);
         for (let i = arr.length-1; i > 0; i--){
             [arr[0], arr[i]] = [arr[i], arr[0]];
             heapSortLen--;
             // 交换位置并排除了最大的元素之后，现在的大顶堆的根节点的位置是错误的，但
             // 其他节点的位置还是正确的大顶堆顺序。现在需要使用heapify把当前根节点的
             // 值放到合适的位置，把根节点的位置让给剩余节点中最大的。
             // 然后进入下一轮循环，根节点的值和最后一个节点的值交换，并再次重复上述过
             // 程
             heapify(arr, 0);
         }
         return arr;
     };

     function buildMaxHeap(arr){ // 建立大顶堆
         heapSortLen = arr.length;
         // 从最后一个内部节点开始排序来建立大顶堆
         for(let i = Math.floor(heapSortLen/2)-1; i >= 0; i--){
             heapify(arr, i);
         }
     }
     function heapify(arr, i){ // 堆调整
         let leftChildIndex = 2*i + 1,
             rightChildIndex = 2*i + 2,
             largestIndex = i;

         if(leftChildIndex<heapSortLen && arr[leftChildIndex]>arr[largestIndex]){
             largestIndex = leftChildIndex;
         }
         if(rightChildIndex<heapSortLen && arr[rightChildIndex]>arr[largestIndex]){
             largestIndex = rightChildIndex;
         }
         if(largestIndex !== i){
             [arr[largestIndex], arr[i]] = [arr[i], arr[largestIndex]];
             // 截至上一步，在一父二子的结构里，保证了父节点的值是最大的
             // 注意在交换的时候index并没有交换，因此此时largestIndex对应的节点是某
             // 一个子节点，对应的值是最初父节点的值
             // 下面的递归，将继续给这个当初父节点的值向下寻找合适的位置，直到它在一个
             // 一父二子（一父一子）的结构里可以成为最大的父节点，即largestIndex===i；
             // 或者它向下找到最后也没有成为一个父节点，而成为了一个没有子节点的末尾结
             // 点
             heapify(arr, largestIndex);
         }
     }



     this.binarySearch = function(item){
         this.quickSort();

         let nLowIndex = 0;
         let nHighIndex = arr.length - 1;
         let nMidIndex = null;
         let nMidItem = null;

         while (nLowIndex <= nHighIndex){
             nMidIndex = Math.floor((nLowIndex + nHighIndex) / 2)
             nMidItem = arr[nMidIndex];
             if (item > nMidItem) {
                 nLowIndex = nMidIndex + 1;
             }
             else if (item < nMidItem) {
                 nHighIndex = nMidIndex - 1;
             }
             else {
                 return nMidIndex;
             }
         }
         return -1;
     };
}

module.exports = new SortingAndSearching();
