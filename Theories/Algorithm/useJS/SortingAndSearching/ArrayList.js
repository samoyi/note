/*
 * 其他参考:
 * * [JS家的排序算法](http://www.jianshu.com/p/1b4068ccd505)
 *
 *
 *
 *
 */

function ArrayList(){

    let array = [];

    function swap(index1, index2){
        var aux = array[index1];
        array[index1] = array[index2];
        array[index2] = aux;
    };

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

    function mergeSortRec(array){
        let len = array.length;
        if(len===1)  return array;

        let mid = Math.floor(len / 2),
            left = array.slice(0, mid),
            right = array.slice(mid, len);

        return merge(mergeSortRec(left), mergeSortRec(right));
    }

    swapQuickSort = function(array, index1, index2){
        let aux = array[index1];
        array[index1] = array[index2];
        array[index2] = aux;
    }

    function partition(array, left, right) {
        let pivot = array[Math.floor((right + left) / 2)],
            i = left,
            j = right;

        while (i <= j) {
            while (array[i] < pivot) {
                i++;
            }
            while (array[j] > pivot) {
                j--;
            }
            if(i <= j) {
                swapQuickSort(array, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    function quick(array, left, right){
        let index = null,
            len = array.length;

        if(array.length > 1){
            index = partition(array, left, right)
            if(left < index - 1) {
                quick(array, left, index - 1);
            }
            if(index < right) {
                quick(array, index, right);
            }
        }
    }



    this.insert = function(item){
        array.push(item);
    };


    this.toString= function(){
        return array.join();
    };


    // 每次遍历都把未排序的最大的项排到最右边
    this.bubbleSort = function(){
        let len = array.length;
        while(len-- > 1){
            for(let i=0; i<len; i++){
                if( array[i]>array[i+1] ){
                    swap(i, i+1);
                }
            }
        }
        return array;
    };


    // 每轮在剩余的项里找出最小的
    this.selectionSort = function(){
        let len = array.length,
            indexMin = null;
        for (let i=0; i<len-1; i++){
            indexMin = i;
            for (let j=i+1; j<len; j++){
                if(array[indexMin]>array[j]){
                    indexMin = j;
                }
            }
            if(i !== indexMin){
                swap(i, indexMin);
            }
        }
        return array;
    };

    // 每轮将最左边的未排序的数逐个向左比较，将它排到第一不比它大的数后面，或者排到首位
    this.insertionSort = function(){
        let len = array.length,
            current = null, // 最左边的未排序的数
            j = null;
        for(let i=1; i<len; i++){
            current = array[i];
            j = i;
            // 直到发现一个不大与它的；或者没发现，它最小
            while(j>0 && array[j-1]>current){
                // 逐个向左
                array[j] = array[j-1]; // 它逐个向左，就要逐个和它左边的交换位置
                j--;
            }
            // array[j-1]不比current小了，所以current放到它右边
            // 或者 j已经为0了，current就是目前最小的
            array[j] = current;
        }
    };


    this.mergeSort = function(){
        array = mergeSortRec(array);
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

     this.quickSort = function(){
         quick(array,  0, array.length - 1);
     };


     this.sequentialSearch = function(item){
        return array.indexOf(item);
    };

    this.binarySearch = function(item){
        this.quickSort();

        let nLowIndex = 0,
            nHighIndex = array.length - 1
            nMidIndex = null,
            nMidEle = null;

        while (nLowIndex <= nHighIndex){
            nMidIndex = Math.floor((nLowIndex + nHighIndex) / 2)
            nMidEle = array[nMidIndex];
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

// module.exports = ArrayList;
