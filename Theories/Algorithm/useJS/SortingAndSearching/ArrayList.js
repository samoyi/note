/*
 * 其他参考:
 * * [JS家的排序算法](http://www.jianshu.com/p/1b4068ccd505)
 *
 *
 *
 *
 */

function SortingAndSearching(){


    // 每次遍历都把未排序的最大的项排到最右边
    this.bubbleSort = function(arr){
        let len = arr.length;
        while(len-- > 1){
            for(let i=0; i<len; i++){
                if( arr[i]>arr[i+1] ){
                    [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                }
            }
        }
        return arr;
    };


    // 每轮在剩余的项里找出最小的
    this.selectionSort = function(arr){
        let len = arr.length,
            indexMin = null;
        for (let i=0; i<len-1; i++){
            indexMin = i;
            for (let j=i+1; j<len; j++){
                if(arr[indexMin]>arr[j]){
                    indexMin = j;
                }
            }
            if(i !== indexMin){
                [arr[i], arr[indexMin]] = [arr[indexMin], arr[i]];
            }
        }
        return arr;
    };


    // 每轮将最左边的未排序的数逐个向左比较，将它排到第一不比它大的数后面，或者排到首位
    this.insertionSort = function(arr){
        let len = arr.length,
            current = null, // 最左边的未排序的数
            j = null;
        for(let i=1; i<len; i++){
            current = arr[i];
            j = i;
            // 直到发现一个不大与它的；或者没发现，它最小
            while(j>0 && arr[j-1]>current){
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
    this.mergeSort = function(arr){
        return mergeSortRec(arr);
    };
    function mergeSortRec(arr){
        let len = arr.length;
        if(len===1)  return arr;

        let mid = Math.floor(len / 2),
            left = arr.slice(0, mid),
            right = arr.slice(mid, len);

        return merge(mergeSortRec(left), mergeSortRec(right));
    }
    function merge(left, right){

        let result = [],
            il = 0,
            ir = 0;

        while(il < left.length && ir < right.length) {
            if(left[il] < right[ir]) {
                result.push(left[il++]);
            } else{
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

         if(arr.length > 1){
             index = partition(arr, leftIndex, rightIndex);
             if(leftIndex < index - 1) {
                 quick(arr, leftIndex, index - 1);
             }
             if(index < rightIndex) {
                 quick(arr, index, rightIndex);
             }
         }
     }
     // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
     // [4, 6, 1, 7, 8, 2, 5, 3, 9, 0]
     // [4, 6, 1, 7, 0, 2, 5, 3, 9, 8]
     /* partition函数的作用
      *
      * 对于一个数组arr，通过leftIndex和rightIndex指明一个子数组，对该子数组进行排序
      * 选定一个pivot，通过对字数组排序，是的子数组的第i项之前的项都小于pivot
      
      * 首先在子数组中选定一个pivot项，然后从子数组左右两端分辨渐进和pivot比较大小；
      * 左右两边都找到一个不小于pivot的项时，停止渐进。比较当前左项序号i和右项序号j，
      * 如果 i<=j，交换两项的值，然后i和j分别再递增和递减一次
      */
     function partition(arr, leftIndex, rightIndex) {

         let pivot = arr[Math.floor((rightIndex + leftIndex) / 2)],
             i = leftIndex,
             j = rightIndex;
        console.log(arr);
         while (i <= j) {
             while (arr[i] < pivot) {
                 i++;
             }
             while (arr[j] > pivot) {
                 j--;
             }
             // console.log(i, j);
             if(i <= j) {
                 [arr[i], arr[j]] = [arr[j], arr[i]];
                 i++;
                 j--;
             }
         }
         console.log(pivot);
         console.log(arr);
         console.log(arr[i]);
         console.log('==========================');
         return i;
     }



     this.sequentialSearch = function(item){
        return arr.indexOf(item);
    };

    this.binarySearch = function(item){
        this.quickSort();

        let nLowIndex = 0,
            nHighIndex = arr.length - 1
            nMidIndex = null,
            nMidEle = null;

        while (nLowIndex <= nHighIndex){
            nMidIndex = Math.floor((nLowIndex + nHighIndex) / 2)
            nMidEle = arr[nMidIndex];
            if(item>nMidEle) {
                nLowIndex = nMidIndex + 1;
            }
            else if(item<nMidEle) {
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
