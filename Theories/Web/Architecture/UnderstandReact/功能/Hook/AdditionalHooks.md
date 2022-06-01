# Additional Hooks

<!-- TOC -->

- [Additional Hooks](#additional-hooks)
    - [useMemo](#usememo)
    - [useRef](#useref)
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


## useRef
1. `useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内持续存在。
2. `useRef` 常见的用法是命令式的访问子组件或者子元素。但它可以很方便地保存任何可变值，其类似于在 class 中使用实例字段的方式。
3. This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that `useRef` will give you the same ref object on every render.
4. Keep in mind that `useRef` doesn’t notify you when its content changes. Mutating the `.current` property doesn’t cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a callback ref instead
    ```js
    function App() {
        // 这个 obj 就是相当于创建了一个普通对象来保存一个值，而不是引用一个子组件和子元素以外的值
        const obj = useRef(22); // 设定 obj.current 初始值
        const [n, rerender] = useState(0); // 用来触发重渲染

        useEffect(() => {
            setTimeout(() => {
                obj.current = 33; // 因为更改并不会导致重渲染，所以页面上的 22 并不会变成 33 
                console.log("change current");
                setTimeout(() => {
                    // 修改 state 来触发重渲染，这时才能看到页面上的 obj.current 值发生变化
                    rerender(Math.random())
                    console.log("change n");
                }, 2000)
            }, 2000);
        }, [])

        return (
            <div className="App">
                <span>{obj.current}</span>
            </div>
        );
    }

    export default App;
    ```


## References
* [Material-UI](https://v4.mui.com/zh/api/typography/)
* [Material-UI](https://mui.com/material-ui/react-typography/)