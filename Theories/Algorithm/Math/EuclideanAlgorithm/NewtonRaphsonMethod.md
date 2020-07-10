# Newton-Raphson method


1. [Newton-Raphson method 的推导](https://www.zhihu.com/question/20690553/answer/146104283)。
2. 设 $t^2 = c$。指定一个数 $c$，要求此时的 $t$。也就是要求方程 $f(t) = t^2 - c$ 在 $f(x)=0$ 时的解。
3. 根据上面该方法的推导，可以知道需要迭代计算 $t = t - \frac{t^2 - c}{2t}$。
4. 迭代停止的条件，应该是 t 的值足够接近实际的解，也就是说两者的误差足够小，即 $|t^2 - c| <  ε$。
5. 实现如下
    ```js
    let c = 1048576

    let t = c; // 初始值不知道有没有优化方案，可以减少迭代次数。我实测根据不同情况会有一次的差别。

    // while (Math.abs(t* t - c) > Number.EPSILON) {
    while (Math.abs(t* t - c) > 1e-15) {
        t = t - (t*t - c)/ (2*t)
    }

    console.log(t); // 1024
    ```
5. 本来误差用的是 `Number.EPSILON`，但是在尝试对 $3$ 开方时，发现退不出循环，`Math.abs(t* t - c)` 最小值是二倍的 `Number.EPSILON`。也就是说，至少在 JS 中，这个方法对于某些情况不会把差距缩小到足够小，于是改成书上设定的值。