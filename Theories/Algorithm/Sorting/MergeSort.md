# ElementarySorts


<!-- TOC -->

- [ElementarySorts](#elementarysorts)
    - [两个已排序的数组归并排序为一个大的数组](#两个已排序的数组归并排序为一个大的数组)
    - [使用上面的归并方法实现排序](#使用上面的归并方法实现排序)
    - [原地归并的抽象方法](#原地归并的抽象方法)
    - [自顶向下的归并排序](#自顶向下的归并排序)
    - [分析](#分析)
        - [数组长度和层数的关系](#数组长度和层数的关系)
    - [Merge Sort](#merge-sort)
            - [分治思想](#分治思想)

<!-- /TOC -->


## 两个已排序的数组归并排序为一个大的数组
1. 实现归并的一种直截了当的办法是将两个不同的有序数组归并到第三个数组中。
2. 实现的方法很简单，创建一个大的数组然后将两个输入数组中的元素一个个从小到大放入这个数组中。
    ```js
    function merge(left, right) {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;
        let leftLen = left.length;
        let rightLen = right.length;

        // 两个数组都还有元素没有比较完，不断比较并按顺序加入新数组
        while ( leftIndex < leftLen && rightIndex < rightLen ) {
            if ( left[leftIndex] < right[rightIndex] ) {
                result.push( left[leftIndex++] );
            } else {
                result.push( right[rightIndex++] );
            }
        }

        // 右边数组的元素已经比较完了，左边数组还有没有比较的
        while ( leftIndex < leftLen ) {
            result.push( left[leftIndex++] );
        }

        // 左边数组的元素已经比较完了，右边数组还有没有比较的
        while ( rightIndex < rightLen ) {
            result.push( right[rightIndex++] );
        }

        return result;
    }

    let arr1 = [2, 10, 17, 27, 29, 35, 37, 67, 91, 94];
    let arr2 = [6, 21, 26, 33, 38, 42, 50, 55, 68, 79];

    console.log( merge( arr1, arr2 ) ); 
    // [2, 6, 10, 17, 21, 26, 27, 29, 33, 35, 37, 38, 42, 50, 55, 67, 68, 79, 91, 94]
    ```


## 使用上面的归并方法实现排序
1. 上面的归并方法，让我们掌握了一种对数组进行排序的方法，但前提是这个数组里的两个子数组必须是各自有序的。
2. 不过既然我们掌握了这个排序方法，那就可以用这个方法来对两个子数组进行排序。
3. 递归感出来了。只要我们递归的对子数组进行归并排序，最终就能对整个数组进行排序。
4. 递归的终点，或者说起点，是子数组只有一个元素的情况。
5. 从这个起点回溯，归并排序这两个单元素数组
    <img src="./images/03.png" width="400" style="display: block; margin: 5px 0 10px;" />
    ```js
    function mergeSort ( arr ) {
        let len = arr.length;
        if ( len === 1 ) {
            return arr;
        }

        let midIndex = Math.floor( len/2 );
        let left = arr.slice( 0, midIndex );
        let right = arr.slice( midIndex );

        return merge( mergeSort( left ), mergeSort( right ) );
    }
    ```


## 原地归并的抽象方法
1. 但是，当用归并将一个大数组排序时，我们需要进行很多次归并，因此在每次归并时都创建一个新数组来存储排序结果会带来问题。
2. 我们更希望有一种能够在原地归并的方法，这样就可以先将前半部分排序，再将后半部分排序，然后在数组中移动元素而不需要使用额外的空间。乍一看很容易做到，但实际上已有的实现都非常复杂，尤其是和使用额外空间的方法相比。
3. 尽管如此，将原地归并 **抽象化** 仍然是有帮助的。
4. 下面的方法将两个排好序的数组组成的一个大数组归并为整体有序的数组
    ```js
    function merge ( arr, low, mid, high ) {
        let i = low;
        let j = mid+1;
        let aux = [];

        // 将数组复制一份到 aux
        for ( let k=low; k<=high; k++ ) {
            aux[k] = arr[k];
        }

        for ( let k=low; k<=high; k++ ) {
            if ( i > mid ) { // 前半部分元素已经归并完了，后半部分还有剩余
                arr[k] = aux[j];
                j++;
            }
            else if ( j > high ) { // 后半部分元素已经归并完了，前半部分还有剩余
                arr[k] = aux[i];
                i++;
            }
            else if ( aux[i] < aux[j] ) {
                arr[k] = aux[i];
                i++;
            }
            else {
                arr[k] = aux[j];
                j++;
            }
        }
    }

    let arr1 = [2, 10, 17, 27, 29, 35, 37, 67, 91, 94];
    let arr2 = [6, 21, 26, 33, 38, 42, 50, 55, 68, 79]
    let arr = [...arr1, ...arr2];

    merge( arr, 0, 9, 19 );
    console.log( arr ); 
    // [2, 6, 10, 17, 21, 26, 27, 29, 33, 35, 37, 38, 42, 50, 55, 67, 68, 79, 91, 94]
    ```
5. 虽然不懂这里说的抽象化是什么意思，而且这个归并也创建了中间数组。不过，现在已经不是把两个数组归并为一个了，而是把一个数组里两个独立有序的部分原地归并排序了。也就是说，相比于上面归并的方法，这里不需要每次都创建一个 `left` 和 `right` 数组了。


## 自顶向下的归并排序
1. 下面的算法基于原地归并的抽象实现了另一种递归归并，这也是应用高效算法设计中 **分治思想** 的最典型的一个例子。
2. 这段递归代码是归纳证明算法能够正确地将数组排序的基础：如果它能将两个子数组排序，它就能够通过归并两个子数组来将整个数组排序。
```js
function mergeSort ( arr, low, high ) {
    // 算法（第4版）这里使用的 >=，什么时候会出现小于的情况 不懂
    // 这里要是 >=，那只能是下面 mid+1 大于 high 了，也就是 mid 要等于 high，怎么等于？
    if ( low === high ) { 
        return;
    }

    let mid = Math.floor( low + (high-low) / 2 );

    mergeSort( arr, low, mid );
    mergeSort( arr, mid+1, high );
    merge ( arr, low, mid, high );
}
```


## 分析
1. 命题：对于长度为 N 的任意数组，自顶向下的归并排序需要 $\frac{1}{2}N\log_2 N$ 至 $N\log_2 N$ 次比较。
2. 可以通过下图所示的树状图来理解这个命题
    <img src="./images/04.png" width="600" style="display: block; margin: 5px 0 10px;" />
3. 每个结点都表示一个 `mergeSort()` 方法通过 `merge()` 方法归并而成的子数组。
4. 这棵树正好有 $n$ 层。对于 $0$ 到 $n-1$ 之间的任意 $k$，自顶向下的第 $k$ 层有 $2^k$ 个子数组。因为每次都一分为二成两个子数组。
5. 因为完整数组的长度 $N= 2^n$，而每层所有子数组的长度总和就是完整数组的长度。所以任意一个子数组的长度为 $2^{n-k}$。
6. 根据归并的算法，归并两个长度为 $x$ 的数组，最少需要 $x$ 次比较，最多需要 $2x$ 次比较。也就是说在归并排序中，对于长度为 $x$，最少需要 $\frac{1}{2}x$ 次比较，最多需要 $x$ 比较。
7. 那么对于第 $k$ 层的任意子数组，在归并排序中就最多需要 $2^{n-k}$ 次比较。
8. 因此每层的比较次数最多为 $2^k\times2^{n-k}=2^n$；$n$ 层总共的比较次数最多为 $n2^n = N\log_2 N$，最少$\frac{1}{2}N\log_2 N$。

### 数组长度和层数的关系
1. 每分出一层，新层的子数组元素个数都是前一层的一半，也就是除以 2。
2. 总共有 $n$ 层，那就是对长度为 $N$ 的原数组一共分出了 $n-1$层，也就是除以了 $2^{n-1}$。
3. 最后一层分出的子数组长度为 $2$，也就是说 $N$ 除以 $2^{n-1}$ 的结果为 $2$，所以 $N = 2^n$。




## Merge Sort 


时间复杂度是`O(n log^n)`

#### 分治思想
不懂，分治的设计思想是什么。以及它为什么比前面的方法快



* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [学习JavaScript数据结构与算法](https://book.douban.com/subject/26639401/)
* [图解排序算法(二)之希尔排序](https://www.cnblogs.com/chengxiao/p/6104371.html)