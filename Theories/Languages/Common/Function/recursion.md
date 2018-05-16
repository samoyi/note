# Recursion


## 编写思路
1. 递归是一种累积性的计算，每次计算时，至少有一个参与计算的值是之前累积性计算的结果。
2. 以每次有两个参与计算的值为例，这两种值有以下两种情况：
    * 一个是之前累积计算的结果，另一个是新值
        ```js
        function factorial(n){
            if (!n){
                return 1;
            }
            else {
                return n * factorial(n - 1);
            }
        }
        ```
    * 两个都是之前累积计算的结果
        ```js
        function Fibonacci (index) {
            if ( index <= 1 ) {return 1};
            return Fibonacci(index - 1) + Fibonacci(index - 2);
        }
        ```
3. 对于这种累积性的、重复渐进的计算序列来说，中间的每一步计算都是同样的规则，因此只需要
考虑二部分：（每一步相同的通用）计算规则、临界值。
4. 不要考虑整个序列，只考虑（每一步相同的通用）计算规则。例如在考虑阶乘的递归计算时，如
果考虑序列的话，思路将是：`10! = 10*9*8*……2*1`。这不是递归的思路，这样的思考方式在遇到
复杂的递归时就会变得混乱。而如果考虑计算规则的话，思路就是：`10! = 10*9!`

### 以阶乘为例
1. 先考虑（每一步相同的通用）计算规则，参与计算的是一个新值和一个之前累积计算的结果，即：
`n * (n-1)!`。然后就知道函数大概
会是如下的样子：
```js
function factorial(n){
    return n * factorial(n-1);
}
```
2. 接着考虑临界值。阶乘计算的数字最小只能是`1`，因此上面函数现在不能计算`1`的阶乘，否则
内部的阶乘函数参数就变成了`0`
```js
function factorial(n){
    // 还应该约束n为正整数，但这属于参数检查的范畴，和递归判断无关
    if (n>1){
        return n * factorial(n-1);
    }
    else {
        return 1;
    }
}
```

### 以 Fibonacci sequence 为例
`0	1	1	2	3	5	8	13	21	34`
1. 先考虑（每一步相同的通用）计算规则，参与计算的是两个之前累积计算的结果，即两个相邻的
Fibonacci number相加。所以函数大概会是如下的样子：
```js
function Fibonacci(index){
    return Fibonacci(index - 1) + Fibonacci(index - 2);
}
```
2. 接着考虑临界值，index最小为0：
    * `Fibonacci(2 - 1) + Fibonacci(2 - 2)`，符合。
    * `Fibonacci(1 - 1) + Fibonacci(1 - 2)`，不符合
```js
function Fibonacci(index){
    if (index > 1){
        return Fibonacci(index - 1) + Fibonacci(index - 2);
    }
    else {
        return index;
    }
}
```

### 参与计算的值作为参数的情况
现在的一个需求是，将上面的阶乘函数改为尾递归
```js
function factorial(n){
    if (n>1){
        return n * factorial(n-1); // 这里必须要返回factorial()
    }
    else {
        return 1;
    }
}
```
1. 因为没有了现在的乘法操作，而要直接返回`factorial()`，所以每次累乘的结果必须要通过参
数传递。而且，为了判断何时停止，还应该传参每次参与计算的新值。  
2. 内部函数应该写成`factorial(n - 1, n * (n - 1))`，相应的外部函数也应该加上一个参数：
```js
function factorial(n, accumulator){
    if (n>1){
        return factorial(n - 1, n * (n - 1));
    }
    else {
        return 1;
    }
}
```
3. 现在上面有两个问题：
    * 返回的永远是`1`。返回的应该是`accumulator`。
    * `accumulator`没有传进内部的函数。
4. 因此改成如下：
```js
function factorial(n, accumulator = 1){
    if (n>1){
        return factorial(n - 1, n * accumulator);
    }
    else {
        return accumulator;
    }
}
```
