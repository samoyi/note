# Hooks


<!-- TOC -->

- [Hooks](#hooks)
    - [Hook 的优点](#hook-的优点)
    - [使用限制](#使用限制)
        - [只在最顶层使用 Hook](#只在最顶层使用-hook)
        - [只在 React 函数中调用 Hook](#只在-react-函数中调用-hook)
    - [重渲染时闭包问题](#重渲染时闭包问题)
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


## 重渲染时闭包问题
1. 看下面的组件，`handleAlertClick` 使用闭包用到了外面的变量 `count`
    ```js
    function Example() {
        const [count, setCount] = useState(0);

        function handleAlertClick() {
            setTimeout(() => {
                alert('You clicked on: ' + count);
            }, 3000);
        }

        return (
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => setCount(count + 1)}>
                    Click me
                </button>
                <button onClick={handleAlertClick}>
                    Show alert
                </button>
            </div>
        );
    }
    ```
2. 现在首先点击 Show alert 触发定时器，然后立刻点击 Click me 更新 `count`。然后触发重渲染，页面上显示出的 `count` 变成了 1，但是三秒钟后 alert 出 `count` 的值是还是 0。
3. 组件重渲染，`Example` 函数重新调用，重新创建了一个新的作用域，而重渲染之前的那个回调函数还是使用的之前的作用域，之前作用于中的局部变量 `count` 的值当然是 0。
4. This prevents bugs caused by the code assuming props and state don’t change. 不懂
5. 如果需要在异步回调中使用最新的值，可以使用 ref，因为 ref 永远引用的是同一个对象，而不会在重渲染时创建新对象
    ```js
    function Example() {
        const [count, setCount] = useState(0);
        const countRef = useRef(count);

        function handleAlertClick() {
            setTimeout(() => {
                alert('You clicked on: ' + countRef.current);
            }, 3000);
        }

        return (
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => {setCount(count+1); countRef.current += 1}}>
                    Click me
                </button>
                <button onClick={handleAlertClick}>
                    Show alert
                </button>
            </div>
        );
    }
    ```
6. 在使用 `useEffect` 时也可能出现这个问题
    ```js
    function Example() {
        const [count, setCount] = useState(0);

        useEffect(() => {
            setTimeout(() => {
                alert('You clicked on: ' + count);
            }, 3000);
        }, []);

        return (
            <div>
                <p>You clicked {count} times</p>
                <button onClick={() => {setCount(count+1) }}>
                    Click me
                </button>
            </div>
        );
    }
    ```
    三秒钟之内不管 `count` 更新到了几，alert 的也是 0。
7. 因为依赖数组里面没有传入 `count`，所以 `useEffect` 的回调只会调用一次，这唯一一次的调用创建的 `setTimeout` 回调函数使用的作用域中的 `count` 就是 0。
8. 加上依赖后，`setTimeout` 每次都会调用，也就会有多次的 alert，每次的值也都和本次重渲染的 `count` 一样。


## References
* [Introducing Hooks](https://legacy.reactjs.org/docs/hooks-intro.html)
* [Rules of Hooks](https://legacy.reactjs.org/docs/hooks-rules.html)
* [Why am I seeing stale props or state inside my function](https://legacy.reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)