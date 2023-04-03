# memo


<!-- TOC -->

- [memo](#memo)
    - [Useage](#useage)
    - [Minimizing props changes](#minimizing-props-changes)
    - [仍然会重渲染的情况](#仍然会重渲染的情况)
        - [Updating a memoized component using state](#updating-a-memoized-component-using-state)
        - [Updating a memoized component using a context](#updating-a-memoized-component-using-a-context)
    - [Specifying a custom comparison function](#specifying-a-custom-comparison-function)
    - [References](#references)

<!-- /TOC -->


## Useage
1. `memo` lets you skip re-rendering a component when its props are unchanged
    ```js
    const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
    ```
2. 用法直接看 [文档](https://react.dev/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)
3. You should only rely on `memo` as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add `memo` to improve performance.


## Minimizing props changes 
1. When you use `memo`, your component re-renders whenever any prop is not shallowly equal to what it was previously. 
2. This means that React compares every prop in your component with its previous value using the `Object.is` comparison. Note that `Object.is({}, {})` is false.
3. 因此如果要把引用类型作为 props，可以使用 `useMemo` 防止重复创建  
    ```js
    function Page() {
        const [name, setName] = useState('Taylor');
        const [age, setAge] = useState(42);

        const person = useMemo(
            () => ({ name, age }),
            [name, age]
        );

        return <Profile person={person} />;
    }

    const Profile = memo(function Profile({ person }) {
        // ...
    });
    ```
4. 不过更好的方法是直接传入单独的基本类型
    ```js
    function Page() {
        const [name, setName] = useState('Taylor');
        const [age, setAge] = useState(42);
        return <Profile name={name} age={age} />;
    }

    const Profile = memo(function Profile({ name, age }) {
        // ...
    });
    ```
    或者是简化为组件需要的基本类型值再传入
    ```js
    function GroupsLanding({ person }) {
        // 这里不直接传入 person，而是转换为 CallToAction 实际需要的一个布尔类型再作为 prop 传入
        const hasGroups = person.groups !== null;
        return <CallToAction hasGroups={hasGroups} />;
    }

    const CallToAction = memo(function CallToAction({ hasGroups }) {
        // ...
    });
    ```
5. 如果是函数作为 props，可以定义在组件外面，或者使用 `useCallback`。


## 仍然会重渲染的情况
Memoization only has to do with props that are passed to the component from its parent.

### Updating a memoized component using state 
1. Even when a component is memoized, it will still re-render when its own state changes. 
2. [例子](https://react.dev/reference/react/memo#updating-a-memoized-component-using-state)
3. If you set a state variable to its current value, React will skip re-rendering your component even without `memo`. You may still see your component function being called an extra time, but the result will be discarded.

### Updating a memoized component using a context 
1. Even when a component is memoized, it will still re-render when a context that it’s using changes. 
2. [例子](https://react.dev/reference/react/memo#updating-a-memoized-component-using-a-context)
3. To make your component re-render only when a part of some context changes, split your component in two. Read what you need from the context in the outer component, and pass it down to a memoized child as a prop.


## Specifying a custom comparison function 
[文档](https://react.dev/reference/react/memo#specifying-a-custom-comparison-function)


## References
* [memo](https://react.dev/reference/react/memo)