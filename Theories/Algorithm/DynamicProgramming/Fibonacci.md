# Fibonacci


<!-- TOC -->

- [Fibonacci](#fibonacci)
    - [最直白的递归求解](#最直白的递归求解)
    - [使用缓存来解决重复接计算的问题](#使用缓存来解决重复接计算的问题)
    - [使用动态规划来避免调用栈堆积的问题](#使用动态规划来避免调用栈堆积的问题)
    - [Referecens](#referecens)

<!-- /TOC -->


## 最直白的递归求解
1. 实现
    ```cpp
    long long fibonacci(int n) {
        if (n < 2) {
            return n;
        }

        return fibonacci(n-1) + fibonacci(n-2);
    }
    ```
2. 问题就是性能太差，会进行巨量的重复计算。
3. 但可以看出来明显的具有最优子结构和重叠子问题。


## 使用缓存来解决重复接计算的问题
1. 实现
    ```cpp
    long long memo[20] = {0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

    long long memo_fibonacci(int n) {
        if (n < 2) {
            return n;
        }

        if (memo[n] > 0) {
            return memo[n];
        }

        return memo[n] = fibonacci(n-1) + fibonacci(n-2);
    }
    ```
2. 性能问题解决了。但是在极端的情况下，因为还是使用递归，所以会出现栈溢出
    ```js
    fibonacci(20000); // Uncaught RangeError: Maximum call stack size exceeded
    ```


## 使用动态规划来避免调用栈堆积的问题
1. 递归的思路是，想知道一个结果，就要一层层的反推原因，就是递归的求解原因的原因。
2. 要知道一个结果，就要知道它之前嵌套的所有原因。也就是说，必须等待要一直逆推到最初的原因，才能知道并返回最终的结果。这就是调用栈的堆积。
3. 可以看到，递归的逻辑是：要知道 C，就要 **先** 求 B；要知道 B，就要 **先** 求 A。
4. 而动态规划则是相反，它不从问题出发，它其实并不在乎问题是什么，而是直接按照因果关系去推导整个因果链，只是在问题的那个环节停止推导而已。
5. 比如不管是求 `fibonacci(20000)` 还是 `fibonacci(20)`，动态规划都是按照 `fibonacci(0)`、`fibonacci(1)`、`fibonacci(2)`、`fibonacci(3)` 这样的顺序推导完整的斐波那契数列，只是最后停止在问题的那个数。
6. 实现
    ```cpp
    long long memo[20] = {0, 1}; // 要正确初始化前两项

    long long fibonacci(int n) {
        int i;
        for (i=2; i<=n; i++) {
            memo[i] = memo[i-1] + memo[i-2];
        }

        return memo[n];
    }
    ```
7. 递归需要等待所有的前因才能知道（返回）后果，而动态规划每一步都是一个前因推导出一个后果，所以不存在嵌套的调用栈。


## Referecens
* [从最简单的斐波那契数列来学习动态规划（JavaScript版本）](https://developer.51cto.com/art/202005/616273.htm)
* [动态规划系列（2）——找零钱问题](https://www.jianshu.com/p/9ea65dd9e792)
* [《Python数据结构与算法分析（第2版）》第四章](https://book.douban.com/subject/34785178/)