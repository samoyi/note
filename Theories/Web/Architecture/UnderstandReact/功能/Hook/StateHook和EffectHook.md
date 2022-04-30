# StateHook 和 EffectHook


## 概述
1. What is a Hook? A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components.


## State Hook
* 直接修改数据没有效果（也不会报错），必须要通过 `setCount`。
* 类组件的 `setState` 参数如果是引用类型，它是会合并到原对象上；但是 state hook 如果参数是应用类型的话，是直接替换对应的 state。


## Effect Hook
1. Effect Hook 可以让你在函数组件中执行副作用操作。
2. 你可以把 `useEffect` Hook 看做 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。
3. 在 React 组件中有两种常见副作用操作：需要清除的和不需要清除的。
4. React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得额外操作很方便。

### 无需清除的 effect
1. 有时候，我们只想在 React 更新 DOM 之后运行一些额外的代码。比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了。
2. 默认情况下，`useEffect` 会在第一次渲染之后和每次更新之后都会执行。
3. 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。

### 需要清除的 effect
1. 在函数式组件里，钩子函数只能写一个，所以所有使用某个钩子的逻辑都要混杂的写在同一个钩子函数里。而且如果在 `componentDidMount` 写了一个需要清除的 effect，它的清除逻辑就要写在 `componentWillUnmount`，又导致一个功能的逻辑写在了两个钩子函数里。既不 SRP 又不高内聚。
2. 使用 `useEffect` 的话，一个功能的副作用功能就都写在同一个函数里，实现了 SRP 和高内聚。
3. 默认情况，effect 的清除阶段在每次重新渲染时都会执行，而不是只在卸载组件的时候执行一次。因为有些 effect 需要在数据更新后清除旧的然后使用重新执行。

### 更新控制
1. 默认情况下 `useEffect` 的函数在每次组建更新时都会调用，但可以通过 `useEffect` 第二个参数的数组指定只有在某些数据更新后才调用函数。
2. 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。


## 只在最顶层使用 Hook
1. 不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层以及任何 return 之前调用他们。
2. 遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。
3. 这是因为，React 需要靠 Hook 调用的顺序来判断哪个 state 对应哪个 `useState`。不懂，例如
    ```js
    const [name, setName] = useState('Mary');
    ```
    首次渲染时 `useState` 返回一个默认值为 `'Mary'` 的 state，但它本身并不知道你明明为了 `name`。之后如果调用 `setName` 更新了 `useState` 内部对应 `name` 的那个值，那更新渲染时 `useState` 只要返回那个值就行了，为什么需要知道 `name` 呢？
4. 但既然要根据顺序来判断对应关系，就要保证每次调用时各个 hook 的顺序不能变，所以如果把 hook 不一定会执行的位置，例如循环或者条件等，那就不能保证每次所有的 hook 顺序都一样。
5. 如果我们想要有条件地执行一个 effect，可以将判断放到 hook 的内部：
    ```js
    useEffect(function persistForm() {
        if (name !== '') {
            localStorage.setItem('formData', name);
        }
    });
    ```