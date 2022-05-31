# Additional Hooks

<!-- TOC -->

- [Additional Hooks](#additional-hooks)
    - [useMemo](#usememo)
    - [References](#references)

<!-- /TOC -->


## useMemo
1. 相当于 Vue 的计算属性，只不过这里并不能直接根据函数参数的变动来更新缓存，而是必须要传递一个数组，数组项中指明依赖的数据
    ```js
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    ```
2. If no array is provided, a new value will be computed on every render.
3. Remember that the function passed to `useMemo` runs during rendering. Don’t do anything there that you wouldn’t normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.
4. You may rely on `useMemo` as a performance optimization, not as a semantic guarantee. In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. 也就是说可能某些类型缓存的值也会被丢弃，所以不要从语义上确信一定会使用缓存，而只是应该作为一种锦上添花的优化手段，确保如果缓存即使被丢弃也不影响程序功能。
5. 第一个参数的函数所依赖的所有值都应该出现在第二个参数的数组中，也包括函数参数。



## References
* [Material-UI](https://v4.mui.com/zh/api/typography/)
* [Material-UI](https://mui.com/material-ui/react-typography/)