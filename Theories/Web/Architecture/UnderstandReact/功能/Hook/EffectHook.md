# EffectHook


<!-- TOC -->

- [EffectHook](#effecthook)
    - [Summary](#summary)
    - [需要清除的 effect](#需要清除的-effect)
        - [更好的设计](#更好的设计)
        - [何时清除](#何时清除)
    - [更新控制](#更新控制)
        - [导致循环渲染的情况](#导致循环渲染的情况)
            - [`useEffect` 回调修改 state 导致重渲染](#useeffect-回调修改-state-导致重渲染)
                - [第一种修改方法：Fixing dependencies](#第一种修改方法fixing-dependencies)
                - [第二种修改方法：Using a reference instead of useEffect](#第二种修改方法using-a-reference-instead-of-useeffect)
            - [`useEffect` 依赖引用类型值导致的循环渲染](#useeffect-依赖引用类型值导致的循环渲染)
    - [References](#references)

<!-- /TOC -->


## Summary
1. Effect Hook 可以让你在函数组件中执行副作用操作。也就是实现 “纯组件” 之外的功能，例如获取数据、修改 DOM 等。
2. 你可以把 `useEffect` Hook 看做 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。
4. React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得额外操作很方便。
5. `useEffect` 和 `useState` 一样都是在数据变化后响应式的做一些事情，只不过 `useEffect` 是响应式的重新渲染组件，而 `useEffect` 是响应式的做一些组件外面的事情。
6. 默认情况下，`useEffect` 会在第一次渲染之后和每次更新渲染之后都会执行你传递给它的函数（我们将它称之为 “effect”）。React 保证了每次运行 effect 时，DOM 都已经更新完毕。
7. 实际上，传递给 `useEffect` 的函数在每次渲染中都会有所不同，这样做才使得可以在 effect 中获取最新的 state 值。每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于” 一次特定的渲染。
8. 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。


## 需要清除的 effect
1. 在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。
2. 有时候，我们只想在 React 更新 DOM 之后运行一些额外的代码。比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了。
3. 但还有一些副作用是需要清除的。例如 effect 是订阅外部数据源，这种情况下清除工作是非常重要的，可以防止内存泄露。
4. 在类组件里，可以在 `componentDidMount` 钩子函数里写 effect，然后在 `componentWillUnmount` 写清除该 effect 的逻辑。但是使用 `useEffect`，只需要在 effect 函数里返回一个函数，在这个被返回的函数里编写清除逻辑就行了。
5. 如果 effect 是异步操作，注意不能直接把参数函数写成 `async` 形式，例如
    ```js
    useEffect(async ()=>{});
    ```
    因为回调需要返回用来清理的函数，但 `async` 函数返回的是异步的 promise。
    
### 更好的设计
1. 在类组件里，钩子函数只能写一个，所以所有使用某个钩子的逻辑都要混杂的写在同一个钩子函数里。而且如果在 `componentDidMount` 写了一个需要清除的 effect，它的清除逻辑就要写在 `componentWillUnmount`，又导致一个功能的逻辑写在了两个钩子函数里。既不 SRP 又不高内聚。
2. 使用 `useEffect` 的话，一个功能的副作用功能就都写在同一个函数里，实现了 SRP 和高内聚。

### 何时清除
1. 默认情况，effect 的清除阶段在每次重新渲染时都会执行，而不是只在卸载组件的时候执行一次。因为有些 effect 需要在数据更新后清除旧的然后使用重新执行。这也就是上面说到的为什么每次传给 `useEffect` 的函数都不相同。
2. 同时，这也就是为什么上面说可以把 `useEffect` Hook 看做 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。函数式组件没有类组件那样的 `componentDidUpdate` 来单独处理更新逻辑，它的更新只是重新调用函数。


## 更新控制
1. 在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决。在函数式组件中可以通过 `useEffect` 第二个参数的数组指定只有在数组项中的任意一个数据更新后才调用函数。
2. 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。
3. 如果你要使用此优化方式，请确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量，否则你的代码会引用到先前渲染中的旧变量。

### 导致循环渲染的情况
#### `useEffect` 回调修改 state 导致重渲染
1. 如果 `useEffect` 回调中修改了 state，就会导致重渲染，进而导致 `useEffect` 回调再次执行，又一次修改 state，引发循环渲染的情况。
2. 看下面的例子
    ```js
    function CountInputChanges() {
        const [value, setValue] = useState(''); // 保存表单值
        const [count, setCount] = useState(-1); // 记录更改次数

        useEffect(() => setCount(count + 1)); // 更新更改次数

        const onChange = ({ target }) => setValue(target.value); // 更改表单值

        return (
            <div>
                <input type="text" value={value} onChange={onChange} />
                <div>Number of changes: {count}</div>
            </div>
        )
    }
    ```
    `useEffect` 回调执行后导致 `count` 这个 state 发生更新，导致组件重渲染，又一次导致 `useEffect` 回调执行并更新 `count`，继续触发重渲染。

##### 第一种修改方法：Fixing dependencies
1. 实际上，我们只是希望在 `value` 更新时才触发 `useEffect` 回调，但这里 `count` 更新后也触发了 `useEffect` 回调。
2. 因此可以很简单的用 `useEffect` 的第二个参数来指定只有 `value` 更新才触发回调
    ```js
    useEffect(() => setCount(count + 1), [value]);
    ```
3. 现在，`useEffect` 回调中修改了 `count` 后会导致重渲染，但因为 `value` 并没有变，所以不会再次触发 `useEffect` 回调。

##### 第二种修改方法：Using a reference instead of useEffect
1. 因为使用 `useRef` 可以保存任何值，并且这个值更改后并不会导致组件重渲染，只有等到下次渲染时才能在页面上看到这个值的更新。因此在上面的例子中，可以把 count 值使用  `useRef` 保存。
    ```js
    function CountInputChanges() {
        const [value, setValue] = useState('');
        const countRef = useRef(0);
        const onChange = ({ target }) => {
            setValue(target.value);
            countRef.current++;
        };
        return (
            <div>
                <input type="text" value={value} onChange={onChange} />
                <div>Number of changes: {countRef.current}</div>
            </div>
        );
    }
    ```
2. 现在，表单值更新后，`value` 发生更新之后会触发重渲染，而记录 count 的是 countRef.current，它的更新不会导致重渲染。

#### `useEffect` 依赖引用类型值导致的循环渲染
1. 如果 `useEffect` 依赖了一个引用类型，而这个引用类型在每次重渲染时又会重新创建，那么即使其中的属性值都一样，那也不是同一个对象，所以就会导致重渲染。
2. 这种情况一般都不是真的要比较该引用类型整体是否一直，而是要比较其中的某些属性。所以应该依赖该引用类型其中的基础类型属性。


## References
* [How to Solve the Infinite Loop of React.useEffect()](https://dmitripavlutin.com/react-useeffect-infinite-loop/)