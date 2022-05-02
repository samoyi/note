# Error Boundaries


<!-- TOC -->

- [Error Boundaries](#error-boundaries)
    - [功能](#功能)
        - [错误边界无法捕获以下场景中产生的错误：](#错误边界无法捕获以下场景中产生的错误)
    - [用法](#用法)

<!-- /TOC -->


## 功能
1. 过去，组件内的 JavaScript 错误会导致 React 的内部状态被破坏，并且在下一次渲染时 产生可能无法追踪的错误。
2. 这些错误基本上是由较早的其他代码（非 React 组件代码）错误引起的，但 React 并没有提供一种在组件中优雅处理这些错误的方式，也无法从错误中恢复。
3. 部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。
4. 错误边界是一种 React 组件，这种组件可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI，而并不会渲染那些发生崩溃的子组件树。
5. 错误边界可以捕获发生在整个子组件树的渲染期间、生命周期方法以及构造函数中的错误。
6. 如果一个错误边界无法渲染错误信息，则错误会冒泡至最近的上层错误边界，这也类似于 JavaScript 中 `catch {}` 的工作机制。
7. 自 React 16 起，任何未被错误边界捕获的错误将会导致整个 React 组件树被卸载。

### 错误边界无法捕获以下场景中产生的错误：
* 事件处理
* 异步代码
* 服务端渲染
* 它自身抛出来的错误（并非它的子组件）


## 用法
1. 如果一个 class 组件中定义了 `static getDerivedStateFromError()` 或 `componentDidCatch()` 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，可以使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息。
2. 下面的例子中，假如 `./Photos` 中抛出了错误。如果不加错误边界，则会导致整体渲染失败。加上之后就可以降级显示 `<h1>Something went wrong.</h1>`（但此时错误仍然被抛出，可以从控制台看到）
    ```js
    const Comments = React.lazy(() => import('./Comments'));
    const Photos = React.lazy(() => import('./Photos'));

    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            // 更新 state 使下一次渲染能够显示降级后的 UI
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // 你同样可以将错误日志上报给服务器
            // logErrorToMyService(error, errorInfo);
            console.log(error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                // 你可以自定义降级后的 UI 并渲染
                return <h1>Something went wrong.</h1>;
            }

            return this.props.children;
        }
    }

    const MyComponent = () => (
        <div>
            <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <section>
                        <Comments />
                        <Photos />
                    </section>
                </Suspense>
            </ErrorBoundary>
        </div>
    );
    ```
3. 只有 class 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它。