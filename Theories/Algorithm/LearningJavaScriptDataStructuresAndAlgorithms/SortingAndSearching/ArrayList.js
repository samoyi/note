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

        if(array.length > 1)
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


    this.bubbleSort = function(){
        let len = array.length;
        while(len--){
            for(let i=0; i<len; i++){
                if( array[i]>array[i+1] ){
                    swap(i, i+1);
                }
            }
        }
        return array;
    };


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


    this.insertionSort = function(){
        let len = array.length,
            temp = null,
            j = null;
        for(let i=1; i<len; i++){
            temp = array[i];
            j = i;
            while(temp<array[j-1] && j>0){
                array[j] = array[j-1];
                j--;
            }
            array[j] = temp;
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

        while (nLowIndex <= nHighIndex)
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

module.exports = ArrayList;
