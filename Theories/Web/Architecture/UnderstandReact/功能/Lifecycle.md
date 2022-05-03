# Lifecycle


<!-- TOC -->

- [Lifecycle](#lifecycle)
    - [生命周期函数](#生命周期函数)
        - [挂载阶段](#挂载阶段)
        - [更新阶段](#更新阶段)
        - [卸载阶段](#卸载阶段)
    - [错误处理钩子函数](#错误处理钩子函数)
    - [常用的生命周期方法详解](#常用的生命周期方法详解)
        - [`constructor(props)`](#constructorprops)
            - [避免将 `props` 的值复制给 `state`](#避免将-props-的值复制给-state)
        - [`render()`](#render)
        - [`componentDidMount()`](#componentdidmount)
        - [`componentDidUpdate(prevProps, prevState, snapshot)`](#componentdidupdateprevprops-prevstate-snapshot)
        - [`componentWillUnmount()`](#componentwillunmount)
    - [References](#references)

<!-- /TOC -->


## 生命周期函数
* [图示](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
* 浅色部分是不常用的函数

### 挂载阶段
当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：
1. `constructor()`
2. <span style="opacity:0.2">`static getDerivedStateFromProps()`</span>
3. `render()`
4. `componentDidMount()`

### 更新阶段
当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：
1. <span style="opacity:0.2">`static getDerivedStateFromProps()`</span>
2. <span style="opacity:0.2">`shouldComponentUpdate()`</span>
4. `render()`
5. <span style="opacity:0.2">`getSnapshotBeforeUpdate()`</span>
6. `componentDidUpdate()`

### 卸载阶段
当组件从 DOM 中移除时会调用如下方法：
* `componentWillUnmount()`


## 错误处理钩子函数
当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
* `static getDerivedStateFromError()`
* `componentDidCatch()`


## 常用的生命周期方法详解
### `constructor(props)`
1. 如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。
2. 在 React 组件挂载之前，会调用它的构造函数。
3. 通常，在 React 中，构造函数仅用于以下两种情况：
    * 通过给 `this.state` 赋值对象来初始化内部 state。
    * 为事件处理函数绑定实例
4. 在 `constructor()` 函数中不要调用 `setState()` 方法。只能在构造函数中直接为 `this.state` 赋值。如需在其他方法中赋值，你应使用 `this.setState()` 替代
    ```js
    constructor(props) {
        super(props);
        // 不要在这里调用 this.setState()
        this.state = { counter: 0 };
        this.handleClick = this.handleClick.bind(this);
    }
    ```
5. 要避免在构造函数中引入任何副作用或订阅。如遇到此场景，请将对应的操作放置在 `componentDidMount` 中。

#### 避免将 `props` 的值复制给 `state`
1. 例如
    ```js
    constructor(props) {
        super(props);
        // 不要这样做
        this.state = { color: props.color };
    }
    ```
2. 如此做毫无必要（你可以直接使用 `this.props.color`），同时还产生了 bug：更新 `prop` 中的 `color` 时，并不会反映到 `state` 上。
3. 只有在你刻意忽略 `prop` 更新的情况下使用。此时，应将 `prop` 重命名为 `initialColor` 或 `defaultColor`。必要时，你可以修改它的 `key`，以强制 “重置” 其内部 `state`。

### `render()`
1. `render()` 方法是 class 组件中唯一必须实现的方法。
2. 当 `render` 被调用时，它会检查 `this.props` 和 `this.state` 的变化并返回以下类型之一：
    * React 元素。通常通过 JSX 创建。无论是原生 HTML 原生（如 `<div />`）还是 React 节点（如`<MyComponent />`）均为 React 元素。
    * 数组或 fragments。使得 render 方法可以返回多个元素。
    * Portals。可以渲染子节点到不同的 DOM 子树中。
    * 字符串或数值类型。它们在 DOM 中会被渲染为文本节点
    * 布尔类型或 `null`。什么都不渲染。主要用于支持返回类似 `bool && <Child />` 的模式，其中 `bool` 为布尔类型，用来确定 `<Child />` 是否要渲染。
3. `render()` 函数应该为纯函数，这意味着在 `this.props` 和 `this.state` 不变的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。
4. 如需与浏览器进行交互，请在 `componentDidMount()` 或其他生命周期方法中执行你的操作。保持 `render()` 为纯函数，可以使组件更容易思考。
5. 如果 `shouldComponentUpdate()` 返回 `false`，则不会调用 `render()`。

### `componentDidMount()`
1. `componentDidMount()` 会在组件挂载后（插入 DOM 树中）立即调用。
2. 依赖于 DOM 节点的初始化应该放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。
3. 这个方法是比较适合添加订阅的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount()` 里取消订阅。
4. 你可以在 `componentDidMount()` 里直接调用 `setState()`，它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如此保证了即使在 `render()` 两次调用的情况下，用户也不会看到中间状态。请谨慎使用该模式，因为它会导致性能问题。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况下，你可以使用此方式处理

### `componentDidUpdate(prevProps, prevState, snapshot)`
1. 会在更新后会被立即调用。
2. 你也可以在 `componentDidUpdate()` 中直接调用 `setState()`，但请注意它必须被包裹在一个条件语句里，否则会导致死循环。
3. 如果 `shouldComponentUpdate()` 返回值为 `false`，则不会调用 `componentDidUpdate()`。
4. 如果组件实现了 `getSnapshotBeforeUpdate()` 生命周期（不常用），则它的返回值将作为 `componentDidUpdate()` 的第三个参数 `snapshot` 参数传递，否则此参数将为 `undefined`。

### `componentWillUnmount()` 
1. 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作。
2. `componentWillUnmount()` 中不应调用 `setState()`，因为该组件将永远不会重新渲染。
3. 组件实例卸载后，将永远不会再挂载它。


## References
* [React.Component](https://zh-hans.reactjs.org/docs/react-component.html)