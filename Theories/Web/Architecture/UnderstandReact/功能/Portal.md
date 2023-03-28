# Portal


<!-- TOC -->

- [Portal](#portal)
    - [用途](#用途)
    - [但是 portal 中的事件还是可以冒泡到外层组件](#但是-portal-中的事件还是可以冒泡到外层组件)

<!-- /TOC -->


## 用途
1. 看下面的代码
    ```js
    // App.js
    function Popup () {
        return ReactDOM.createPortal(
            <p>"This is pop-up"</p>,
            document.getElementById('portal')
        )
    }

    function Component1 (props) {
        return (
            <div>
                <p>This is Component1</p>
                <Popup />
            </div>
        );
    }
    
    function App() {
        return (
            <div>
                App
                <Component1 />
            </div>
        );
    }
    ```
    ```html
    <div id="root"></div>
    <div id="portal"></div>
    ```
2. 如果 `Popup` 中没有使用 `ReactDOM.createPortal`，那最终的渲染结果就是：`Popup` 嵌套在 `Component1` 里，`Component1` 嵌套在 `App` 里，`App` 嵌套在 `<div id="root"></div>` 里，`<div id="portal"></div>` 里没有子节点。但实际的 DOM 结构是
    ```html
    <div id="root">
        <div>
            App
            <div>
                <p>This is Component1</p>
            </div>
        </div>
    </div>
    <div id="portal">
        <p>"This is pop-up"</p>
    </div>
    ```
3. 观察 `Popup`
    ```js
    function Popup () {
        return ReactDOM.createPortal(
            <p>"This is pop-up"</p>,
            document.getElementById('portal')
        )
    }
    ```
    portal 有 “传送门” 的意思，它把第一个参数所表示的元素传送出 React 的组件结构之外，传送到了第二个参数指定的节点里。
4. A typical use case for portals is when a parent component has an `overflow: hidden` or `z-index` style, but you need the child to visually “break out” of its container. For example, dialogs, hovercards, and tooltips. 看起来就是，你从源码上还能看出来比如一个弹出框在语义上是属于这个组件的，但实际使用中会渲染到组件之外。
5. When working with portals, remember that managing keyboard focus becomes very important. For modal dialogs, ensure that everyone can interact with them by following the WAI-ARIA Modal Authoring Practices. TODO。


## 但是 portal 中的事件还是可以冒泡到外层组件
1. 虽然渲染出来的结果是 portal 的元素并不在 React 的组件结构里，但是事件流还是遵循源码里的结构。
2. 在上面的例子中，在 portal 的内部元素触发事件，外层的 React 组件还是能捕获到事件
    ```js
    function Popup () {
        return ReactDOM.createPortal(
            (
                <div>
                    <p>"This is pop-up"</p>
                    <button>Button in Popup</button> {/* 如果点击这个按钮 */}
                </div>
            ),
            document.getElementById('portal')
        )
    }

    function Component1 (props) {
        return (
            <div>
                <p>This is Component1</p>
                <Popup />
            </div>
        );
    }
    
    function App() {
        function handleClick (ev) {
            console.log(ev.target); // <button>Button in Popup</button>
        }

        return (
            <div onClick={handleClick}>
                App
                <Component1 />
            </div>
        );
    }
    ```