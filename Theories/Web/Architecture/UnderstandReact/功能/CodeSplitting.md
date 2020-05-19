# Code-Splitting


<!-- TOC -->

- [Code-Splitting](#code-splitting)
    - [`import()` 动态引入模块](#import-动态引入模块)
    - [`React.lazy` 动态加载组件](#reactlazy-动态加载组件)
        - [Error boundaries](#error-boundaries)
        - [Named Exports   不懂，需要实践](#named-exports---不懂需要实践)
    - [Route-based code splitting   不懂，需要实践](#route-based-code-splitting---不懂需要实践)

<!-- /TOC -->


## `import()` 动态引入模块
1. The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
    ```js
    <!-- Before: -->
    import { add } from './math';
    console.log(add(16, 26));
    // After:

    import("./math").then(math => {
    console.log(math.add(16, 26));
    });
    ```
2. When Webpack comes across this syntax, it automatically starts code-splitting your app. 
3. If you’re using *Create React App*, this is already configured for you and you can start using it immediately. It’s also supported out of the box in *Next.js*.
4. If you’re setting up Webpack yourself, you’ll probably want to read Webpack’s [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).
5. When using *Babel*, you’ll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [babel-plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).


## `React.lazy` 动态加载组件
1. The `React.lazy` function lets you render a dynamic import as a regular component.
    ```js
    // Before:
    import OtherComponent from './OtherComponent';

    // After:
    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    ```
2. This will automatically load the bundle containing the `OtherComponent` when this component is first rendered.
3. `React.lazy` takes a function that must call a dynamic `import()`. This must return a `Promise` which resolves to a module with a `default` export containing a React component.
4. The lazy component should then be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.
    ```js
    import React, { Suspense } from 'react';

    const OtherComponent = React.lazy(() => import('./OtherComponent'));

    function MyComponent() {
    return (
        <div>
        <Suspense fallback={<div>Loading...</div>}>
            <OtherComponent />
        </Suspense>
        </div>
    );
    }
    ```
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

### Named Exports   不懂，需要实践
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


## Route-based code splitting   不懂，需要实践
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