# Code-Splitting


<!-- TOC -->

- [Code-Splitting](#code-splitting)
    - [Bundling](#bundling)
    - [Code Splitting](#code-splitting)
        - [`import()` 动态引入模块](#import-动态引入模块)
        - [使用 `React.lazy` 动态加载组件](#使用-reactlazy-动态加载组件)
        - [Avoiding fallbacks](#avoiding-fallbacks)
        - [Error boundaries](#error-boundaries)
        - [Route-based code splitting   TODO](#route-based-code-splitting---todo)
        - [Named Exports  TODO](#named-exports--todo)
    - [References](#references)

<!-- /TOC -->


## Bundling
1. 打包是将多个文件引入并合并到一个单独文件的过程，最终形成一个 “bundle”。接着在页面上引入该 bundle，整个应用即可一次性加载。
2. 原理示意：下面两个原文件
    ```js
    // app.js
    import { add } from './math.js';

    console.log(add(16, 26)); // 42
    ```
    ```js
    // math.js
    export function add(a, b) {
        return a + b;
    }
    ```
    经过打包后会变成
    ```js
    function add(a, b) {
        return a + b;
    }

    console.log(add(16, 26)); // 42
    ```


## Code Splitting
1. 打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。
2. 你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。为了避免搞出大体积的代码包，在前期就思考该问题并对代码包进行分割是个不错的选择。代码分割是由诸如 Webpack 这类打包器支持的一项技术，能够创建多个包并在运行时动态加载。
3. 对你的应用进行代码分割能够帮助你懒加载当前用户所需要的内容，能够显著地提高你的应用性能。
4. 尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。

### `import()` 动态引入模块
1. 在你的应用中引入代码分割的最佳方式是通过动态 `import()` 语法
    ```js
    // Before:
    import { add } from './math';
    console.log(add(16, 26));
    ```
    ```js
    // After:
    import("./math").then(math => {
        console.log(math.add(16, 26));
    });
    ```
2. 当 Webpack 解析到该语法时，会自动进行代码分割。

### 使用 `React.lazy` 动态加载组件
1. `React.lazy` 函数能让你像渲染常规组件一样处理动态引入的组件。
2. `React.lazy` 接受一个函数，这个函数需要必须返回一个 Promise（或者有 `then` 实现的对象），它必须返回一个 Promise，该 Promise 需要解析为 React 组件。
3. 因此可以实用上面提到的 `import()`
    ```js
    // Before:
    import OtherComponent from './OtherComponent';
    ```
    ```js
    // After:
    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    ```
4. `React.lazy` 执行时并不会加载组件，只有当 `<OtherComponent />` 需要渲染的时候才回去加载 `./OtherComponent`。
5. 然后应在 `Suspense` 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）
    ```js
    const OtherComponent = React.lazy(() => new Promise((resolve) => {
        // 模拟三秒钟才能加载好组件
        setTimeout(() => {
            resolve(import('./OtherComponent'));
        }, 3000);
    }));

    function MyComponent() {
        return (
            <div>
                <p>MyComponent</p>
                // 三秒钟之前这里显示的都是 fallback 中的内容
                <Suspense fallback={<div>Loading...</div>}>
                    <OtherComponent />
                </Suspense>
            </div>
        );
    }
    ```
    当 `MyComponent` 渲染的时候，内部首先显示 `<div>Loading...</div>`，然后同时加载 `./OtherComponent`，三秒钟之后显示 `<OtherComponent />`。
5. `fallback` 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 `Suspense` 组件置于懒加载组件之上的任何位置。你甚至可以用一个 `Suspense` 组件包裹多个懒加载组件
    ```js
    import React, { Suspense } from 'react';

    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

    function MyComponent() {
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <section>
                        <OtherComponent />
                        <AnotherComponent />
                    </section>
                </Suspense>
            </div>
        );
    }
    ```

### Avoiding fallbacks
1. 看下面的例子
    ```js
    const Comments = React.lazy(() => import('./Comments'));
    const Photos = React.lazy(() => import('./Photos'));

    function MyComponent() {
    const [tab, setTab] = React.useState('photos');
    
    function switchTab() {
        if (tab === "photos") {
            setTab("comments");
        }
        else {
            setTab("photos");
        }
    }
    
    return (
        <div>
            <div onClick={switchTab}>切换</div>
            <Suspense fallback={<p>loading...</p>}>
                {tab === 'photos' ? <Photos /> : <Comments />}
            </Suspense>
        </div>
    );
    }
    ```
2. 有两个异步加载的组件，当前显示的是 `<Photos />`。然后如果用户点击切换，就需要显示 `<Comments />`。因为这是 `<Comments />` 首次渲染，所以要先进行异步加载。因为是异步加载，所以即使没有多余的延迟，也会先显示 `fallback` 中的内容，然后才能显示加载好的 `<Comments />` 组件。
3. 如果希望加载时不显示 `fallback` 中的内容而是继续显示 `<Photos />` 组件，可以使用如下方法
    ```js
  function switchTab() {
    startTransition(() => {
        if (tab === "photos") {
            setTab("comments");
        }
        else {
            setTab("photos");
        }
    })
  }
  ```
4. Here, you tell React that setting tab to 'comments' is not an urgent update, but is a *transition* that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready.

### Error boundaries
1. If the other module fails to load (for example, due to network failure), it will trigger an error. 
2. You can handle these errors to show a nice user experience and manage recovery with [Error Boundaries](https://reactjs.org/docs/error-boundaries.html). 
3. Once you’ve created your Error Boundary, you can use it anywhere above your lazy components to display an error state when there’s a network error.
    ```js
    import React, { Suspense } from 'react';
    import MyErrorBoundary from './MyErrorBoundary';

    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

    const MyComponent = () => (
        <div>
            <MyErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <section>
                <OtherComponent />
                <AnotherComponent />
                </section>
            </Suspense>
            </MyErrorBoundary>
        </div>
    );
    ```

### Route-based code splitting   TODO
1. Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won’t disrupt the user experience.
2. A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. 
3. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.
4. Here’s an example of how to setup route-based code splitting into your app using libraries like *React Router* with `React.lazy`.
    ```js
    import React, { Suspense, lazy } from 'react';
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

    const Home = lazy(() => import('./routes/Home'));
    const About = lazy(() => import('./routes/About'));

    const App = () => (
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
        </Switch>
        </Suspense>
    </Router>
    );
    ```
    
### Named Exports  TODO
1. `React.lazy` currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. 
2. This ensures that tree shaking keeps working and that you don’t pull in unused components.
    ```js
    // ManyComponents.js
    export const MyComponent = /* ... */;
    export const MyUnusedComponent = /* ... */;

    // MyComponent.js
    export { MyComponent as default } from "./ManyComponents.js";

    // MyApp.js
    import React, { lazy } from 'react';
    const MyComponent = lazy(() => import("./MyComponent.js"));
    ```


## References
* [代码分割](https://react.docschina.org/docs/code-splitting.html)