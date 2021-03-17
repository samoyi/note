# Recursion


<!-- TOC -->

- [Recursion](#recursion)
    - [Recursion Patterns](#recursion-patterns)
    - [用循环代替递归来节省性能开销](#用循环代替递归来节省性能开销)
        - [merge sort 递归转循环](#merge-sort-递归转循环)
    - [References](#references)

<!-- /TOC -->


## Recursion Patterns
1. When you run into a call stack size limit, your first step should be to identify any instances of recursion in the code. 
2. To that end, there are two recursive patterns to be aware of:
    * The first is the straightforward recursive pattern when a function calls itself. The general pattern is as follows:
    ```js
    function recurse(){
        recurse();
    }
    recurse();
    ```
    * A second, subtler pattern involves two functions:
    ```js
    function first(){
        second();
    }
    function second(){
        first();
    }
    first();
    ```
3. Most call stack errors are related to one of these two recursion patterns. A frequent cause of stack overflow is an incorrect terminal condition, so the first step after identifying the pattern is to validate the terminal condition. 
4. If the terminal condition is correct, then the algorithm contains too much recursion to safely be run in the browser
and should be changed to use iteration, memoization, or both. 看一下下面例子中使用和不使用的巨大差别：

    ```js
    let count = 0;

    console.time('normal fibonacci');
    function fibonacci(n) {
        count++;
        if (n == 0 || n == 1) {
            return n;
        } 
        else {
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    }
    fibonacci(50);
    console.timeEnd('normal fibonacci');
    console.log('process memory usage', process.memoryUsage());
    console.log('final count', count);
    // normal fibonacci: 1278799.905 ms
    // process memory usage {
    //     rss: 27918336,
    //     heapTotal: 15450112,
    //     heapUsed: 4314096,
    //     external: 8680
    // }
    // final count 40730022147
    ```
    ```js
    let count = 0;
    console.time('memoization fibonacci');
    let fibonacci = (function () {
        let memo = {};

        function f(n) {
            count++;
            let value;
            if (n in memo) {
                value = memo[n];
            } else {
                if (n == 0 || n == 1) {
                    value = n;
                } else {
                    value = f(n - 1) + f(n - 2);
                }
                memo[n] = value;
            }
        }
        return f;
    })();
    fibonacci(50);
    console.timeEnd('memoization fibonacci');
    console.log('process memory usage', process.memoryUsage());
    console.log('final count', count);
    // memoization fibonacci: 0.239 ms
    // process memory usage {
    //     rss: 19673088,
    //     heapTotal: 6537216,
    //     heapUsed: 3934600,
    //     external: 8680
    // }
    // final count 99
    ```


## 用循环代替递归来节省性能开销
1. Any algorithm that can be implemented using recursion can also be implemented using iteration. 
2. Iterative algorithms typically consist of several different loops performing different aspects of the process, and thus introduce their own performance issues. However, using optimized loops in place of long-running recursive functions can result in performance improvements due to the lower overhead of loops versus that of executing a function.

### merge sort 递归转循环
1. The merge sort algorithm is most frequently implemented using recursion. A simple JavaScript implementation of merge sort is as follows:
    ```js
    let count = 0;

    function merge(left, right) {
        var result = [];
        while (left.length > 0 && right.length > 0) {
            if (left[0] < right[0]) {
                result.push(left.shift());
            } 
            else {
                result.push(right.shift());
            }
        }
        return result.concat(left).concat(right);
    }
    ```
    ```js
    function mergeSort(items) {
        count++;
        if (items.length == 1) {
            return items;
        }
        var middle = Math.floor(items.length / 2),
            left   = items.slice(0, middle),
            right  = items.slice(middle);
        return merge(mergeSort(left), mergeSort(right));
    }

    let arr = [];
    for (let i=0; i<20; i++){
        arr.push(Math.round(Math.random()*100));
    }

    mergeSort(arr);
    
    console.log('count', count); // 39
    ```
2. The code for this merge sort is fairly simple and straightforward, but the `mergeSort()` function itself ends up getting called very frequently, an array of $n$ items ends up calling `mergeSort()` $2*n –1$ times.
3. Running into the stack overflow error doesn’t necessarily mean the entire algorithm has to change; it simply means that recursion isn’t the best implementation. The merge sort algorithm can also be implemented using iteration, such as:
    ```js
    function mergeSort(items) {
        count++;
        if (items.length == 1) {
            return items;
        }
        var work = [];
        for (var i = 0, len = items.length; i < len; i++) {
            work.push([items[i]]);
        }
        work.push([]); //in case of odd number of items
        for (var lim = len; lim > 1; lim = (lim + 1) / 2) {
            for (var j = 0, k = 0; k < lim; j++, k += 2) {
                work[j] = merge(work[k], work[k + 1]);
            }
            work[j] = []; //in case of odd number of items
        }
        return work[0];
    }
    ```
4. This implementation of `mergeSort()` does the same work as the previous one without using recursion. Although the iterative version of merge sort may be somewhat slower than the recursive option, it doesn’t have the same call stack impact as the recursive version. 
5. Switching recursive algorithms to iterative ones is just one of the options for avoiding stack overflow errors.


## References
* [*High Performance JavaScript* Chapter 4](https://book.douban.com/subject/4183808/)
* [《高性能JavaScript》 第4章](https://book.douban.com/subject/5362856/)
