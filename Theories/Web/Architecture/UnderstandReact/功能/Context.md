# Context

## When to Use Context
1. Context provides a way to pass data through the component tree without having
to pass props down manually at every level.
2. In a typical React application, data is passed top-down (parent to child) via
props, but this can be cumbersome for certain types of props (e.g. locale
preference, UI theme) that are required by many components within an application
.
3. Context provides a way to share values like these between components without
having to explicitly pass a prop through every level of the tree.
4. Context is designed to share data that can be considered “global” for a tree
of React components, such as the current authenticated user, theme, or preferred
language.


## 用法
1. 创建一个环境“组件”
2. 环境组件可以通过把内部存储的值传递给它的后代组件
3. 后代组件通过环境组件的名字获取其中的值，需要将该值存储到静态属性`contextType`里
4. 然后该后代组件就可以通过`this.context`访问到环境组件中保存的值。

```js
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
    render() {
        // Use a Provider to pass the current theme to the tree below.
        // Any component can read it, no matter how deep it is.
        // In this example, we're passing "dark" as the current value.
        return (
            <ThemeContext.Provider value="dark">
                <Toolbar />
            </ThemeContext.Provider>
        );
    }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar(props) {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

class ThemedButton extends React.Component {
    // Assign a contextType to read the current theme context.
    // React will find the closest theme Provider above and use its value.
    // In this example, the current theme is "dark".
    static contextType = ThemeContext;
    render() {
        return <input type="button" value={this.context} />;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```

### 默认值
1. 给环境变量赋值是通过`value`属性，但是触发默认值并不是没有设置`value`属性，而是没有
使用 Provider
2. 如果上面例子中的`App`组件如下定义，则`ThemedButton`中获得的环境变量值就是`lightn`
    ```js
    class App extends React.Component {
        render() {
            return (
                // <ThemeContext.Provider value="dark">
                    <Toolbar />
                // </ThemeContext.Provider>
            );
        }
    }
    ```


## 节制使用
1. Context is primarily used when some data needs to be accessible by many
components at different nesting levels.
2. Apply it sparingly because it makes component reuse more difficult.
3. If you only want to avoid passing some props through many levels, component
composition is often a simpler solution than context.
