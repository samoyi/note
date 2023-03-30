# Code-Splitting


<!-- TOC -->

- [Code-Splitting](#code-splitting)
    - [Bundling](#bundling)
    - [Code Splitting](#code-splitting)
        - [`import()` 动态引入模块](#import-动态引入模块)
    - [`React.lazy` 动态加载组件](#reactlazy-动态加载组件)
        - [Avoiding fallbacks](#avoiding-fallbacks)
        - [Error boundaries](#error-boundaries)
        - [Route-based code splitting   TODO](#route-based-code-splitting---todo)
        - [Named Exports  TODO](#named-exports--todo)
    - [References](#references)

<!-- /TOC -->


## Bundling
1. Bundling is the process of following imported files and merging them into a single file: a “bundle”. This bundle can then be included on a webpage to load an entire app at once.
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
1. Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. 
2. You need to keep an eye on the code you are including in your bundle so that you don’t accidentally make it so large that your app takes a long time to load.
3. To avoid winding up with a large bundle, it’s good to get ahead of the problem and start “splitting” your bundle. 
4. Code-Splitting is a feature supported by bundlers like Webpack which can create multiple bundles that can be dynamically loaded at runtime.
5. Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app. 
6. While you haven’t reduced the overall amount of code in your app, you’ve avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

### `import()` 动态引入模块
1. The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
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
2. When Webpack comes across this syntax, it automatically starts code-splitting your app. 


## `React.lazy` 动态加载组件
1. The `React.lazy` function lets you render a dynamic import as a regular component.
    ```js
    // Before:
    import OtherComponent from './OtherComponent';
    ```
    ```js
    // After:
    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    ```
2. This will automatically load the bundle containing the `OtherComponent` when this component is first rendered. `React.lazy` 执行时并不会加载组件，只有当 `<OtherComponent />` 需要渲染的时候才回去加载 `./OtherComponent`。
3. `React.lazy` takes a function that must call a dynamic `import()`. This must return a `Promise` which resolves to a module with a `default` export containing a React component.
4. The lazy component should then be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.
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
5. The `fallback` prop accepts any React elements that you want to render while waiting for the component to load. You can place the `Suspense` component anywhere above the lazy component. 
6. You can even wrap multiple lazy components with a single `Suspense` component.
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