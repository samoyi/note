# Higher-Order Components


<!-- TOC -->

- [Higher-Order Components](#higher-order-components)
    - [概念](#概念)
    - [用法](#用法)
    - [不要改变原始组件，而应该使用组合](#不要改变原始组件而应该使用组合)
    - [将不相关的 props 传递给被包裹的组件](#将不相关的-props-传递给被包裹的组件)
    - [不要在 render 方法中使用 HOC](#不要在-render-方法中使用-hoc)
    - [务必复制静态方法](#务必复制静态方法)
    - [Refs 不会被传递](#refs-不会被传递)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 概念
1. 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。
2. 具体而言，高阶组件是参数为组件，返回值为新组件的函数。
    ```js
    const EnhancedComponent = higherOrderComponent(WrappedComponent);
    ```
3. 组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。


## 用法
对应 Vue 中的 `mixin`


## 不要改变原始组件，而应该使用组合
1. 不要试图在 HOC 中修改组件原型或以其他方式改变它
    ```js
    function logProps(InputComponent) {
        InputComponent.prototype.componentDidUpdate = function(prevProps) {
            console.log('Current props: ', this.props);
            console.log('Previous props: ', prevProps);
        };
        // 返回原始的 input 组件，暗示它已经被修改。
        return InputComponent;
    }

    // 每次调用 logProps 时，增强组件都会有 log 输出。
    const EnhancedComponent = logProps(InputComponent);
    ```
2. 这样做会产生一些不良后果。其一是输入组件再也无法像 HOC 增强之前那样使用了。更严重的是，如果你再用另一个同样会修改 `componentDidUpdate` 的 HOC 增强它，那么前面的 HOC 就会失效。同时，这个 HOC 也无法应用于没有生命周期的函数组件。
3. 修改传入组件的 HOC 是一种糟糕的抽象方式。调用者必须知道他们是如何实现的，以避免与其他 HOC 发生冲突。
4. HOC 不应该修改传入组件，而应该使用组合的方式，通过将组件包装在容器组件中实现功能：
    ```js
    function logProps(WrappedComponent) {
        return class extends React.Component {
            componentDidUpdate(prevProps) {
                console.log('Current props: ', this.props);
                console.log('Previous props: ', prevProps);
            }
            render() {
                // 将 input 组件包装在容器中，而不对其进行修改。Good!
                return <WrappedComponent {...this.props} />;
            }
        }
    }
    ```
    该 HOC 与上文中修改传入组件的 HOC 功能相同，同时避免了出现冲突的情况。
5. 它同样适用于 class 组件和函数组件。而且因为它是一个纯函数，它可以与其他 HOC 组合，甚至可以与其自身组合。


## 将不相关的 props 传递给被包裹的组件
1. HOC 为组件添加特性。自身不应该大幅改变约定。HOC 返回的组件与原组件应保持类似的接口。HOC 应该透传与自身无关的 props。
2. 大多数 HOC 都应该包含一个类似于下面的 render 方法：
    ```js
    render() {
        // 过滤掉非此 HOC 额外的 props，且不要进行透传
        const { extraProp, ...passThroughProps } = this.props;

        // 将 props 注入到被包装的组件中。
        // 通常为 state 的值或者实例方法。
        const injectedProp = someStateOrInstanceMethod;

        // 将 props 传递给被包装组件
        return (
            <WrappedComponent
                injectedProp={injectedProp}
                {...passThroughProps}
            />
        );
    }
    ```
3. 这种约定保证了 HOC 的灵活性以及可复用性。


## 不要在 render 方法中使用 HOC
1. React 的 diff 算法使用组件标识来确定它是应该更新现有子树还是将其丢弃并挂载新子树。 如果从 render 返回的组件与前一个渲染中的组件相同（`===`），则 React 通过将子树与新子树进行区分来递归更新子树。 如果它们不相等，则完全卸载前一个子树。
2. 通常，你不需要考虑这点。但对 HOC 来说这一点很重要，因为这代表着你不应在组件的 render 方法中对一个组件应用 HOC
    ```js
    render() {
        // 每次调用 render 函数都会创建一个新的 EnhancedComponent
        // EnhancedComponent1 !== EnhancedComponent2
        const EnhancedComponent = enhance(MyComponent);
        // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！
        return <EnhancedComponent />;
    }
    ```
3. 这不仅仅是性能问题，重新挂载组件还会导致该组件及其所有子组件的状态丢失。
4. 如果在组件之外创建 HOC，这样一来组件只会创建一次。因此，每次 render 时都会是同一个组件。一般来说，这跟你的预期表现是一致的。
5. 在极少数情况下，你需要动态调用 HOC。你可以在组件的生命周期方法或其构造函数中进行调用。


## 务必复制静态方法
1. 有时在 React 组件上定义静态方法很有用。但是，当你将 HOC 应用于组件时，原始组件将使用容器组件进行包装。这意味着新组件没有原始组件的任何静态方法。
    ```js
    // 定义静态函数
    WrappedComponent.staticMethod = function() {/*...*/}
    // 现在使用 HOC
    const EnhancedComponent = enhance(WrappedComponent);

    // 增强组件没有 staticMethod
    typeof EnhancedComponent.staticMethod === 'undefined' // true
    ```
2. 为了解决这个问题，你可以在返回之前把这些方法拷贝到容器组件上：
    ```js
    function enhance(WrappedComponent) {
        class Enhance extends React.Component {/*...*/}
        // 必须准确知道应该拷贝哪些方法 :(
        Enhance.staticMethod = WrappedComponent.staticMethod;
        return Enhance;
    }
    ```
3. 但要这样做，你需要知道哪些方法应该被拷贝。你可以使用 `hoist-non-react-statics` 自动拷贝所有非 React 静态方法:
    ```js
    import hoistNonReactStatic from 'hoist-non-react-statics';
        function enhance(WrappedComponent) {
        class Enhance extends React.Component {/*...*/}
        hoistNonReactStatic(Enhance, WrappedComponent);
        return Enhance;
    }
    ```
4. 除了导出组件，另一个可行的方案是再额外导出这个静态方法。
    ```js
    // 使用这种方式代替...
    MyComponent.someFunction = someFunction;
    export default MyComponent;

    // ...单独导出该方法...
    export { someFunction };

    // ...并在要使用的组件中，import 它们
    import MyComponent, { someFunction } from './MyComponent.js';
    ```


## Refs 不会被传递
1. 虽然高阶组件的约定是将所有 props 传递给被包装组件，但这对于 refs 并不适用。那是因为 `ref` 实际上并不是一个 prop - 就像 `key` 一样，它是由 React 专门处理的。如果将 ref 添加到 HOC 的返回组件中，则 ref 引用指向容器组件，而不是被包装组件。
2. 这个问题的解决方案是通过使用 React.forwardRef API。


## TODO
* 最大化可组合性
* 包装显示名称以便轻松调试


## References
* [Vue 中实现 HOC](http://caibaojian.com/vue-design/more/vue-hoc.html)