'use strict';

const sas = require('./ArrayList');

// bubble sort
/*
 * 在不考虑计算机算法只是数学的思考要多少步时，给定下面逆序的数组，一般只会统计交换的次数，即45步
 * 大脑的思维过程在一直进行下面的计算：选中这两个，一交换；再选中这两个，一交换……，总共交换了45次
 * 因为一些很简单的行为被我忽略了，根本没有把它当做步骤。比如，“选中两个”和“总共排了5轮”
 * 但即使是很简单的，不管对于人脑还是对于计算机，它都是客观存在的步骤。
 * “选中两个”这个步骤，总共执行了45次；每排一轮排好一个高位，看起来只需要排9轮就排好了，
 * 但不管是人脑还是计算机，最后都还有一步：哦，只剩一个了，不需要排序了；i<0了，不用循环了。
 * 算上这最后一步，总共是10步。
 *
 */
{
    let count1 = 0,
        count2 = 0,
        count3 = 0;

    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    // bubbleSort(arr); // 10 45 45 100
    // bubbleSort(arr.reverse()); // 5 10 0 55

    function bubbleSort(arr){
        let len = arr.length;
        while(len--){
            count1++;
            for(let i=0; i<len; i++){
                count2++;
                if( arr[i]>arr[i+1] ){
                    count3++
                    swap(arr, i, i+1);
                }
            }
        }
        console.log('bubbleSort: ', count1, count2, count3, count1+count2+count3);
        return arr;
    }
}



{
    let count1 = 0,
        count2 = 0,
        count3 = 0,
        count4 = 0;

    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    // selectionSort(arr); // 9 45 25 5 84
    // selectionSort(arr.reverse()); // 9 45 0 0 54

    function selectionSort(arr){
        let len = arr.length,
            indexMin = null;
        for (let i=0; i<len-1; i++){
            count1++;
            indexMin = i;
            for (let j=i+1; j<len; j++){
                count2++;
                if(arr[indexMin]>arr[j]){
                    count3++;
                    indexMin = j;
                }
            }
            if(i !== indexMin){
                count4++;
                swap(arr, i, indexMin);
            }
        }
        console.log('selectionSort: ', count1, count2, count3, count4, count1+count2+count3+count4);
    }
}


// insertion sort
{
    let count1 = 0,
        count2 = 0;

    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    // insertionSort(arr);

    function insertionSort(arr){
        let len = arr.length,
            current = null,
            j = null;
        for(let i=1; i<len; i++){
            count1++;
            current = arr[i];
            j = i;
            while(j>0 && arr[j-1]>current){
                count2++;
                arr[j] = arr[j-1];
                j--;
            }
            arr[j] = current;
            count2++;
        }
        console.log('insertionSort: ', count1, count2, count1+count2);
    }
}


// Shell sort
{
    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    // console.log(sas.shellSort(arr));

    // 9 8 7 6 5 4 3 2 1 0
    // 4 3 2 1 0 9 8 7 6 5

    console.log(shuffle(arr));
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}





function swap(arr, index1, index2){
    var aux = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = aux;
}
