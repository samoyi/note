# Context


<!-- TOC -->

- [Context](#context)
    - [When to Use Context](#when-to-use-context)
    - [用法](#用法)
        - [默认值](#默认值)
    - [`useContext` hook](#usecontext-hook)
    - [TODO](#todo)
    - [节制使用](#节制使用)

<!-- /TOC -->


## When to Use Context



## 用法
1. 和 Vue 中的 provide/inject 功能类似，但 context 是响应式的。
2. 函数式组件中用法如下
    ```js
    const NameContext = createContext(); // 在这里创建 context “组件”

    function Component1 () {
        const [name, setName] = useState("Hime");
        return (
            <div>
                Component1
                <input type="button" value="set to Hina" onClick={()=>{setName("Hina")}} />

                {/* 通过 context “组件” 把值传递给后代 */}
                <NameContext.Provider value={name}> 
                    <Component2 />
                </NameContext.Provider>
            </div>
        );
    }
        
    function Component2 () {
        return (
            <div>
                Component2
                <Component3 />
            </div>
        );
    }

    function Component3() {
        const name = useContext(NameContext); // 后代通过 context “组件” 接收传进来的值
        return (
            <div>
                Component3
                {name}
            </div>
        );
    }
    ```
3. 与 Vue 中的 provide/inject 不同，context 是响应式的：all consumers that are descendants of a Provider will re-render whenever the Provider’s `value` prop changes. 
4. The propagation from Provider to its descendant consumers is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component skips an update.
5. 通过新旧值检测来确定变化，使用了与 `Object.is` 相同的算法。

### 默认值
1. 创建 context “组件” 时可以指定默认值
    ```js
    const NameContext = React.createContext("Hime");
    ```
2. 但是触发默认值并不是 `Provider` 中没有设置 `value` 属性时触发，而是没有使用 `Provider` 时触发。比如如果上面例子中的 `Component1` 如下定义，则 `Component3` 中 `name` 会获得默认值 `"Hime"`
    ```js
    function Component1 () {
        return (
            <div>
                Component1
                <Component2 />
            </div>
        );
    }
    ```


## `useContext` hook
1. 使用 `useContext(MyContext)` 获得外层注入的 context 对象 `MyContext` 的 `value` 值。
2. 当外层 `MyContext` 的 `value` 值更新时，这个钩子会触发当前组件的重渲染并获得更新后的 `value` 值。
3. 即使某个外层组件使用 `React.memo` 或 `shouldComponentUpdate`，这个使用 `useContext` 的组件也会重渲染。
4. 调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以通过使用 [memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693) 来优化。



## TODO
* Context.Consumer
* Context.displayName


## 节制使用
1. Context is primarily used when some data needs to be accessible by many components at different nesting levels.
2. Apply it sparingly because it makes component reuse more difficult.
3. If you only want to avoid passing some props through many levels, component composition is often a simpler solution than context.