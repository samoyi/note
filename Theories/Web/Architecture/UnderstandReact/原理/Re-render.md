# Re-render


<!-- TOC -->

- [Re-render](#re-render)
    - [重渲染的原因](#重渲染的原因)
        - [组件内部状态更新](#组件内部状态更新)
        - [父组件重渲染](#父组件重渲染)
        - [context 变化](#context-变化)
    - [References](#references)

<!-- /TOC -->


## 重渲染的原因
### 组件内部状态更新
1. 组件自身的 state 或 props 变化会引起重渲染。组件内部 hook 中的状态变化也会引起组件的重渲染
    ```js
    // 自定义hook
    function useFriendStatus(friendID) {
        const [isOnline, setIsOnline] = useState(null);

        useEffect(() => {
            function handleStatusChange(status) {
                setIsOnline(status.isOnline);
            }

            ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
            return () => {
                ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
            };
        });

        return isOnline;
    }

    // 组件中使用
    function FriendStatus(props) {
        const isOnline = useFriendStatus(props.friend.id);
        if (isOnline === null) {
            return 'Loading...';
        }
        return isOnline ? 'Online' : 'Offline';
    }
    ```
2. 如果一些值的变化对页面渲染无影响，那么我们可以将这些值维护在函数组件外。
3. 或使用 `useRef`，因为 `useRef` 的值更改后并不会导致组件重渲染。

### 父组件重渲染
1. 即使传给子组件的 props 没有变化，子组件也会重渲染。
2. 可以调整逻辑结构来解除它们的父子关系。
3. 或者把子组件作为 `props.children` 传入也不会导致重渲染。

### context 变化
1. 当 `<Context.Provider>` 中的值改变时，所有使用了这个 context 的组件都将重渲染。
2. 可以使用 `useMemo` 对 `<Context.Provider>` 中的值进行缓存。


## References
* [组件又双叒叕重渲染了？！来看看这篇React组件重渲染总结吧～](https://juejin.cn/post/7144652366736785416)
* [Re-rendering Components in ReactJS](https://www.geeksforgeeks.org/re-rendering-components-in-reactjs/)
* [When does React re-render components?](https://felixgerschau.com/react-rerender-components/)
