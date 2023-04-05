# Hooks


<!-- TOC -->

- [Hooks](#hooks)
    - [Hook 的优点](#hook-的优点)
    - [使用限制](#使用限制)
        - [只在最顶层使用 Hook](#只在最顶层使用-hook)
        - [只在 React 函数中调用 Hook](#只在-react-函数中调用-hook)
    - [References](#references)

<!-- /TOC -->


## Hook 的优点
* 复用：相同的功能可以作为 hook 被不同的组件复用
* 关注点分离：不同的逻辑不用再乱杂的写在一个生命周期函数里，而是作为独立的 hook 使用
* 函数比 class 要简单


## 使用限制
### 只在最顶层使用 Hook
1. 不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层以及任何 return 之前调用他们。
2. 遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。
3. 这是因为，因为 hooks 的设计是基于链表实现的，React 需要靠 hook 调用的顺序来判断哪个 state 对应哪个 `useState`。不懂，例如
    ```js
    const [name, setName] = useState('Mary');
    ```
    首次渲染时 `useState` 返回一个默认值为 `'Mary'` 的 state，但它本身并不知道你命名为了 `name`。之后如果调用 `setName` 更新了 `useState` 内部对应 `name` 的那个值，那更新渲染时 `useState` 只要返回那个值就行了，为什么需要知道 `name` 呢？
4. 但既然要根据顺序来判断对应关系，就要保证每次调用时各个 hook 的顺序不能变，所以如果把 hook 不一定会执行的位置，例如循环或者条件等，那就不能保证每次所有的 hook 顺序都一样。
5. 如果我们想要有条件地执行一个 effect，可以将判断放到 hook 的内部：
    ```js
    useEffect(function persistForm() {
        if (name !== '') {
            localStorage.setItem('formData', name);
        }
    });
    ```

### 只在 React 函数中调用 Hook
1. 只能在 React 的函数式组件和自定义 Hook 中调用 Hook。
2. 遵守这条规则，可以确保组件内的所有状态逻辑从源码中清晰可见。
3. 不懂，详细原理


## References
* [Introducing Hooks](https://legacy.reactjs.org/docs/hooks-intro.html)
* [Rules of Hooks](https://legacy.reactjs.org/docs/hooks-rules.html)