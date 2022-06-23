# Additional Hooks

<!-- TOC -->

- [Additional Hooks](#additional-hooks)
    - [`useCallback`](#usecallback)
    - [`useImperativeHandle`](#useimperativehandle)
    - [`useMemo`](#usememo)
        - [引用类型作为依赖的问题](#引用类型作为依赖的问题)
    - [`useReducer`](#usereducer)
    - [`useRef`](#useref)
    - [References](#references)

<!-- /TOC -->


## `useCallback`
1. 在默认情况下，组件内定义的函数在组件重渲染时都会被重新创建。下面的例子使用 `Set` 记录三个函数，可以看到每次组件渲染时，`funccount.size` 都会加 3，说明每次都是创建了新的函数
    ```js
    import React, { useState } from 'react'
    
    const funccount = new Set();
    
    const App = () => {
        const [count, setCount] = useState(0)
        const [number, setNumber] = useState(0)

        const incrementCounter = () => {
            setCount(count + 1)
        }
        const decrementCounter = () => {
            setCount(count - 1)
        }
        const incrementNumber = () => {
            setNumber(number + 1)
        }

        funccount.add(incrementCounter);
        funccount.add(decrementCounter);
        funccount.add(incrementNumber);
        console.log(funccount.size);

        return (
            <div>
                Count: {count}
                <button onClick={incrementCounter}>
                    Increase counter
                </button>
                <button onClick={decrementCounter}>
                    Decrease Counter
                </button>
                <button onClick={incrementNumber}>
                    increase number
                </button>
            </div>
        )
    }


    export default App;
    ```
2. 理想的情况就是这三个函数一直存在，每次点击事件发生时调用函数，然后内部的变量去到外层最新的 `count` 或 `number`。但应该是词法作用域规则不支持这样，因为这样的话你的函数就要定义到 `App` 函数外部才能实现不重新创建，但定义在外部就无法访问 `App` 内部的变量了。
3. 退一步的优化，就是这里的 `useCallback`。它会记录函数的依赖项，如果依赖项不变，就还是使用原来的函数，变得的话就重新创建新的函数。
4. TODO，还没看具体原来，但感觉上，之所以可以不重新创建，是因为把外部的依赖项局部化了，调用的时候不是访问真正的外层的变量，而是使用局部化了的变量，所以只要依赖的变量没有变，那函数的调用就能和之前的效果保持一致。
5. 优化如下
    ```js
    import React, { useState, useCallback } from 'react'

    const funccount = new Set();

    const App = () => {
        const [count, setCount] = useState(0)
        const [number, setNumber] = useState(0)

        const incrementCounter = useCallback(() => {
            setCount(count + 1)
        }, [count])
        const decrementCounter = useCallback(() => {
            setCount(count - 1)
        }, [count])
        const incrementNumber = useCallback(() => {
            setNumber(number + 1)
        }, [number])

        funccount.add(incrementCounter);
        funccount.add(decrementCounter);
        funccount.add(incrementNumber);
        console.log(funccount.size);

        return (
            <div>
                Count: {count}
                <button onClick={incrementCounter}>
                    Increase counter
                </button>
                <button onClick={decrementCounter}>
                    Decrease Counter
                </button>
                <button onClick={incrementNumber}>
                    increase number
                </button>
            </div>
        )
    }


    export default App;
    ```
6. 现在可以看到：当 `count` 变化导致重渲染时，`funccount.size` 只会增加 2，因为只有两个函数依赖 `count`；当 `number` 变化导致重渲染时，`funccount.size` 只会增加 1，因为只有一个函数依赖 `number`。


## `useImperativeHandle`
TODO


## `useMemo`
1. `useCallback` 是只要依赖不变，那 `useCallback` 返回的包装函数就不变，调用效果还是和之前一样；`useMemo` 是只要依赖不变，参数中的函数就不调用，那 `useMemo` 返回的值就不变，返回的还是之前参数函数调用时返回的值。
2. 看下面的例子
    ```js
    import React, { useState } from 'react';

    function App() {
        const [number, setNumber] = useState(0)
        const squaredNum = squareNum(number);
        const [counter, setCounter] = useState(0);

        // Change the state to the input
        const onChangeHandler = (e) => {
            setNumber(e.target.value);
        }

        // Increases the counter by 1
        const counterHander = () => {
            setCounter(counter + 1);
        }
        return (
            <div className="App">
                <h1>Welcome to Geeksforgeeks</h1>
                <input type="number" placeholder="Enter a number"
                    value={number} onChange={onChangeHandler}>
                </input>

                <div>OUTPUT: {squaredNum}</div>
                <button onClick={counterHander}>Counter ++</button>
                <div>Counter : {counter}</div>
            </div>
        );
    }

    // function to square the value
    function squareNum(number) {
        console.log("Squaring will be done!");
        return Math.pow(number, 2);
    }

    export default App;
    ```
3. `setNumber` 执行时，`number` 被修改，组件重渲染，使用新的 `number` 调用 `squareNum`，这没有问题。但是 `counter` 被更改后组件重渲染，`squareNum` 还是会使用没变化的 `number` 再执行一遍并返回和之前一样的值，这样的执行就是可以被优化的。
4. 使用 `useMemo` 优化如下
    ```js
    import React, { useState, useMemo } from 'react';

    function App() {
        const [number, setNumber] = useState(0)
        // Using useMemo
        // 如果 number 没有变化，useMemo 参数中的函数就不会执行，useMemo 返回给 squareNum 的就还是之前的值
        const squaredNum = useMemo(() => {
            return squareNum(number);
        }, [number])

        const [counter, setCounter] = useState(0);

        const onChangeHandler = (e) => {
            setNumber(e.target.value);
        }

        const counterHander = () => {
            setCounter(counter + 1);
        }
        return (
            <div className="App">
                <h1>Welcome to Geeksforgeeks</h1>
                <input type="number" placeholder="Enter a number"
                    value={number} onChange={onChangeHandler}>
                </input>

                <div>OUTPUT: {squaredNum}</div>
                <button onClick={counterHander}>Counter ++</button>
                <div>Counter : {counter}</div>
            </div>
        );
    }

    function squareNum(number) {
        console.log("Squaring will be done!");
        return Math.pow(number, 2);
    }

    export default App;
    ```
5. 类似于 Vue 的计算属性，只不过这里并不能直接根据函数参数的变动来更新缓存，而是必须要传递一个数组，数组项中指明依赖的数据。
6. If no array is provided, a new value will be computed on every render.
7. Remember that the function passed to `useMemo` runs during rendering. Don’t do anything there that you wouldn’t normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.
8. You may rely on `useMemo` as a performance optimization, not as a semantic guarantee. In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. 也就是说可能某些类型缓存的值也会被丢弃，所以不要从语义上确信一定会使用缓存，而只是应该作为一种锦上添花的优化手段，确保如果缓存即使被丢弃也不影响程序功能。
9. 第一个参数的函数所依赖的所有值都应该出现在第二个参数的数组中，也包括函数参数。

### 引用类型作为依赖的问题
1. 在 `useEffect` 那里说到，依赖引用类型值导致的循环渲染，因为每次渲染时虽然引用类型的属性值都一样，但还是一个全新的引用类型。
2. 在这里，如果把引用类型作为依赖也会产生问题
    ```ts
    function Foo(props: { num: number }) {
        let obj = { number: props.num } // eslint warning
        // The 'obj' object makes the dependencies of useMemo Hook change on every render. 
        // Move it inside the useMemo callback. Alternatively, wrap the initialization of 'obj' in its own useMemo() Hook.

        useMemo(() => {
            return obj.number + 1;
        }, [obj])

        return <div></div>
    }
    ```
3. 每次渲染时，即使 `props.num` 没变，`obj` 也都会重新创建，导致 `useMemo` 回调重新求值，但其实返回值都是一样的。所以 eslint 建议可以把 `obj` 的创建放进 `useMemo` 回调里
    ```ts
    function Foo(props: { num: number }) {
        useMemo(() => {
            let obj = { number: props.num }
            return obj.number + 1;
        }, [props.num])

        return <div></div>
    }
    ```



## `useReducer`
TODO


## `useRef`
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
* [ReactJS useCallback Hook](https://www.geeksforgeeks.org/react-js-usecallback-hook/)
* [ReactJS useMemo Hook](https://www.geeksforgeeks.org/react-js-usememo-hook/)