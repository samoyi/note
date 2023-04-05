# StateHook


<!-- TOC -->

- [StateHook](#statehook)
    - [Summary](#summary)
    - [Usage](#usage)
    - [同值更新的情况](#同值更新的情况)
    - [Functional updates](#functional-updates)
    - [Batching of state updates](#batching-of-state-updates)
    - [TypeScript 的情况](#typescript-的情况)
    - [References](#references)

<!-- /TOC -->


## Summary
A Hook is a special function that lets you “hook into” React features. For example, `useState` is a Hook that lets you add React state to function components.


## Usage
1. 组件首次渲染时， `useState` 会声明一个变量并对其进行初始化。如果这个变量没有被设值函数改变，那组件在先吃渲染时，`useState` 还会返回相同的值给这个变量。
2. 如果使用了设值函数改变了变量，那会触发组件重新渲染，然后 `useState` 就会返回更新后的值给这个变量。
3. 这也是为什么这个钩子不叫 `createState`，因为它只有在组件第一次渲染时才是 create，之后都是 use。
4. 直接修改变量没有效果（也不会报错），必须要通过设值函数。
5. 类组件的 `setState` 参数如果是引用类型，它是会合并到原对象上；但是 state hook 如果参数是引用类型的话，是直接替换对应的 state
    ```js
    function Component1 (props) {
        const [person, setPerson] = useState({name: "Hime", age: 22});
        setTimeout(() => {
            // 三秒钟只会只会渲染出名字，年龄为空
            setPerson({name: "Hina"});
        }, 3333);
        return (
            <div>
                <p>Name: {person.name}</p>
                <p>Age: {person.age}</p>
            </div>
        );
    }
    ```
6. 初始值参数也可以传一个函数，该函数返回初始值。


## 同值更新的情况
1. 如果新的 state 与当前的 state 相同（Object.is 比较算法），React 将跳过子组件的渲染并且不会触发 effect 的执行。
2. 需要注意的是，React 可能仍需要在跳过渲染前渲染该组件。不过由于 React 不会对组件树的 “深层” 节点进行不必要的渲染，所以大可不必担心。
3. 如果你在渲染期间执行了高开销的计算，则可以使用 `useMemo` 来进行优化。


## Functional updates
1. 如果一个 state 的新值需要在旧值的基础上计算得到，那可以给 `setState` 传递函数作为参数，该函数的参数是单签的 state 值
    ```js
    function Counter({ initialCount }) {
        const [count, setCount] = useState(initialCount);
        return (
            <>
                Count: {count}
                <button onClick={() => setCount(initialCount)}>Reset</button>
                <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
                <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
            </>
        );
    }
    ```
    这里第一个 `setCount` 设置的值不依赖旧的值，所以直接传递新值；后两个都是在现有值的基础上进行计算，所以传递了一个函数，参数是现有的值。
2. 如果传递的函数的返回值与当前 state 完全相同，则随后的重渲染会被完全跳过。React 使用 `Object.is` 比较算法来比较 state。
3. 上面说到 `setState` 参数如果是引用类型，它是会合并到原对象上。这种情况下可以利用函数式更新，在传递的函数中手动和原对象进行合并，然后返回最终的新对象
    ```js
    const [state, setState] = useState({});
    setState(prevState => {
        // 也可以使用 Object.assign
        return {...prevState, ...updatedValues};
    });
    ```
    `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。


## Batching of state updates
1. React may group several state updates into a single re-render to improve performance. Normally, this improves performance and shouldn’t affect your application’s behavior.
2. Before React 18, only updates inside React event handlers were batched. Starting with React 18, batching is enabled for all updates by default. 
3. Note that React makes sure that updates from several different user-initiated events — for example, clicking a button twice — are always processed separately and do not get batched. This prevents logical mistakes. TODO，但看起来这里只是说了不 batch，但好像并不会同步渲染，更不是同步更新 state 的值
    ```js
    function MyComp() {
        const [age, setAge] = useState(0);
        const onButtonClick = () => {
            setAge(222)
            console.log(age)
            debugger
        };

        return (
            <button onClick={onButtonClick}>{age}</button>
        );
    }
    ```
    debugger 的时候 age 的值和按钮上的显示都没有变。
4. In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in `flushSync`. However, this can hurt performance so do this only where needed. [例子](https://react.dev/learn/manipulating-the-dom-with-refs#flushing-state-updates-synchronously-with-flush-sync)
    ```js
    flushSync(() => {
        setSomething(123);
    });
    // By this line, the DOM is updated.
    ```
    但是 `flushSync` 这里只是说会同步渲染，并不是说修改 state 之后会同步查询到新的值
    ```js
    function MyComp() {
        const [age, setAge] = useState(0);
        const onButtonClick = () => {
            flushSync(() => {
            setAge(222)
            });
            console.log(age)
            debugger
        };
        

        return (
            <button onClick={onButtonClick}>{age}</button>
        );
    }
    ```
    点击按钮后 debugger 时，按钮上的数字已经变成 222，但是 `age` 此时显示的值还是 0。


## TypeScript 的情况
1. 看起来在默认情况下，必须要使用初始值，否则初始值就是 `undefined`，然后之后赋值就会类型错误
    ```ts
    const [age, setAge] = useState();
    setAge(17); 
    // Argument of type '17' is not assignable to parameter of type 'SetStateAction<undefined>'.
    ```
2. 如果不想使用默认值，就需要在调用 `useState()` 时指明类型
    ```ts
    const [age, setAge] = useState<number>();
    setAge(17); 
    ``` 
3. 使用 interface 也是一样
    ```ts
    interface User {
        name: string;
        age: number;
    }
      
    const [age, setAge] = useState<User>();
    setAge({name: "33", age: 22}); 
    ```


## References
* [Flushing state updates synchronously with flushSync ](https://react.dev/learn/manipulating-the-dom-with-refs#flushing-state-updates-synchronously-with-flush-sync)

