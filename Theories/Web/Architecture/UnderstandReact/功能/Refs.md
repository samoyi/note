# Refs


<!-- TOC -->

- [Refs](#refs)
    - [目的](#目的)
    - [尽量避免使用 refs](#尽量避免使用-refs)
    - [用法](#用法)
        - [为 DOM 元素添加 ref 的例子](#为-dom-元素添加-ref-的例子)
        - [为类组件添加 Ref 的例子](#为类组件添加-ref-的例子)
        - [不能在函数式组件上使用 ref 属性](#不能在函数式组件上使用-ref-属性)
    - [回调 Refs](#回调-refs)
        - [ref 可以像普通 prop 一样传递](#ref-可以像普通-prop-一样传递)
    - [将 DOM Refs 暴露给父组件](#将-dom-refs-暴露给父组件)
        - [TODO](#todo)

<!-- /TOC -->


## 目的
1. 在典型的 React 数据流中, props 是父组件与子组件交互的唯一方式。要修改子组件，你需要使用新的 props 重新渲染它。
2. 但是，某些情况下你需要在典型数据流外强制修改子组件。要修改的子组件可以是 React 组件的实例，也可以是 DOM 元素。


## 尽量避免使用 refs
1. 如果可以通过声明式实现，则尽量避免使用 refs。
2. 通常情况下，将组件内的状态提升到外部，使用 props 传参都是更符合逻辑的。
3. 在设计组件时，尽量保持组件的完备性。组件应该仅通过少数几个 props 就可以满足需求，而不应该需要外部直接通过 refs 修改组件。
4. 下面是几个适合使用 refs 的情况：
    * 管理焦点，文本选择或媒体播放。
    * 触发强制动画。
    * 集成第三方 DOM 库。


## 用法
1. 使用 `React.createRef()` 创建一个 ref，通过元素的 `ref` 属性来将创建的 ref 指向该元素上。如果要引用多个元素，就要多次调用 `React.createRef()` 来创建 ref
    ```js
    class MyComponent extends React.Component {
        constructor(props) {
            super(props);
            this.ref1 = React.createRef();
            this.ref2 = React.createRef();
        }

        componentDidMount(){
            console.log(this.ref1.current);
            console.log(this.ref2.current);
        }

        render() {
            return (
                <div>
                    <p ref={this.ref1}></p>
                    <span ref={this.ref2}></span>
                </div>
            );
        }
    }

    ReactDOM.render(
        <MyComponent />,
        document.getElementById('root')
    );
    ```
2. 使用一个 ref 的 `current` 属性来访问其指向的元素
    * 当 `ref` 属性被用于一个普通的 HTML 元素时，`React.createRef()` 将接收底层 DOM 元素作为它的 `current` 属性以创建 ref。
    * 当 `ref` 属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为它的 `current`。
    * 你不能在函数式组件上使用 `ref` 属性，因为它们没有实例。

### 为 DOM 元素添加 ref 的例子
```js
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        // 创建 ref 存储 textInput DOM 元素
        this.textInputRef = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    focusTextInput() {
        // 获取引用的 DOM 节点，并使用原生 API 使其获得焦点
        this.textInputRef.current.focus();
    }

    render() {

        return (
            <div>
                { /* 使用 this.textInputRef 这个 ref 引用该 input */ }
                <input type="text" ref={this.textInputRef} />

                <input type="button" value="Focus the text input"
                    onClick={this.focusTextInput}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <CustomTextInput />,
    document.getElementById('root')
);
```
1. React 会在组件加载时将 DOM 元素传入 `current` 属性，在卸载时则会改回 `null`。
2. ref 的更新会发生在 `componentDidMount` 或 `componentDidUpdate` 生命周期钩子 **之前**
    ```js
    class CustomTextInput extends React.Component {
        constructor(props) {
            super(props);
            this.textInputRef = React.createRef();
        }

        componentDidMount (){
            console.log(this.textInputRef.current); // input
        }

        render() {
            // render 是的前一个钩子
            // 也就是说是在 render 阶段绑定的引用？
            console.log(this.textInputRef.current); // null
            return (
                <div>
                    <input type="text"
                        ref={this.textInputRef}
                    />
                </div>
            );
        }
    }

    ReactDOM.render(
        <CustomTextInput />,
        document.getElementById('root')
    );
    ```

### 为类组件添加 Ref 的例子
```js
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    focusTextInput() {
        this.textInput.current.focus();
    }

    render() {
        return (
            <div>
                <input type="text" ref={this.textInput} />


                <input type="button" value="Focus the text input"
                        disabled={true}
                        onClick={this.focusTextInput}
                />
            </div>
        );
    }
}

class AutoFocusTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.textInputRef = React.createRef();
    }

    componentDidMount() {
        this.textInputRef.current.focusTextInput();
    }

    render() {
        return (
            <CustomTextInput ref={this.textInputRef} />
        );
    }
}

ReactDOM.render(
    <AutoFocusTextInput />,
    document.getElementById('root')
);
```
上一个例子中，`CustomTextInput` 组件中需要手动点击按钮才能让文本框获得焦点。在本例中，`AutoFocusTextInput` 组件通过 ref 引用 `CustomTextInput` 组件，并且在挂载后， 通过 ref
引用 `CustomTextInput` 组件并调用其 `focusTextInput` 来实现自动获得焦点。

### 不能在函数式组件上使用 ref 属性
1. 上面说到，当 `ref` 属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为它的 `current`。然而，函数式组件并没有实例，它只相当于单纯的 HTML 元素，所以无法引用。
2. 如果要在函数组件中使用 ref，你可以使用 forwardRef（可与 useImperativeHandle 结合使用），或者可以将该组件转化为 class 组件。
3. 但你仍然可以在函数组件内部使用 ref 属性，只要它指向一个 DOM 元素或 class 组件
    ```js
    function CustomTextInput(props) {
        const textInput = useRef(null);

        function handleClick() {
            textInput.current.focus();
        }

        return (
            <div>
                <input type="text" ref={textInput} />
                <input type="button" value="Focus the text input" onClick={handleClick} />
            </div>
        );
    }
    ```


## 回调 Refs
1. React 也支持另一种设置 ref 的方式，称为 “回调 ref”，更加细致地控制何时 ref 被设置和解除。
2. 这时传递给 `ref` 属性的不是 `React.createRef()` 创建的 ref，而是一个函数。这个函数接受 React 组件的实例或 DOM 元素作为参数，以存储它们并使它们能被其他地方访问。
3. 下面的例子描述了一个通用的范例：使用 ref 回调函数，在实例的属性中存储对 DOM 节点的引用
    ```js
    class CustomTextInput extends React.Component {
        constructor(props) {
            super(props);

            this.textInputRef = null; // 对 input 的引用

            // 下面这个函数将要传递给元素 ref 属性
            // 这个函数将接收元素作为参数，并让 this.textInputRef 引用该元素
            // 注意这里是直接存储到 textInputRef，没有 current
            this.setTextInputRef = element => {
                this.textInputRef = element;
            };

            this.focusTextInput = () => {
                if (this.textInputRef) {
                    // 引用到 input，并让其获得焦点
                    this.textInputRef.focus();
                }
            };
        }

        componentDidMount() {
            // 渲染后文本框自动获得焦点
            this.focusTextInput();
        }

        render() {
            return (
                <div>
                    {/*
                        把 this.setTextInputRef 函数传给元素的 ref 属性
                        调用该函数并将元素作为参数
                    */}
                    <input
                        type="text"
                        ref={this.setTextInputRef}
                    />
                    <input
                        type="button" value="Focus the text input"
                        disabled={true}
                        onClick={this.focusTextInput}
                    />
                </div>
            );
        }
    }

    ReactDOM.render(
        <CustomTextInput />,
        document.getElementById('root')
    );
    ```
4. React 将在组件挂载时将 DOM 元素传入 ref 回调函数并调用，当卸载时传入 `null` 并调用它。
5. ref 回调函数会在 `componentDidMout` 和 `componentDidUpdate` 生命周期函数前被调用。
6. 如果 ref 回调以内联函数的方式定义，在更新期间它会被调用两次，第一次参数是 `null` ，之后参数是 DOM 元素。这是因为在每次渲染中都会创建一个新的函数实例。因此，React 需要清理旧的 ref 并且设置新的。通过将 ref 的回调函数定义成类的绑定函数的方式可以避免上述问题，但是大多数情况下无关紧要。

### ref 可以像普通 prop 一样传递
```js
function CustomTextInput(props) {
    return (
        <div>
            <input ref={props.inputRef} />
        </div>
    );
}

class Parent extends React.Component {
    constructor (props) {
        super(props);
        this.inputElement = null;
    }

    focusTextInput () {
        if (this.inputElement) this.inputElement.focus();
    }

    componentDidMount () {
        this.focusTextInput();
    }

    render() {
        return <CustomTextInput inputRef={(el) => (this.inputElement = el)} />;
    }
}

```
1. `Parent` 中的 ref 没有直接设置到 `Child` 上面来引用 `Child` 实例，而是通过 `Child` 的属性 `passedRef` 传递到其内部。
2. `Child` 内部通过 `props.passedRef` 接收到 `Parent` 的 ref 函数，通过把这个而设置为 `input` 的 `ref` 属性，让 `Parent` 的 `textInput` 引用到 `input`。


## 将 DOM Refs 暴露给父组件
1. 在极少数情况下，你可能希望在父组件中引用子节点的 DOM 节点。通常不建议这样做，因为它会打破组件的封装，但它偶尔可用于触发焦点或测量子 DOM 节点的大小或位置。
2. 虽然你可以向子组件添加 ref，但这不是一个理想的解决方案，因为你只能获取组件实例而不是 DOM 节点。并且，它还在函数组件上无效。
3. 这种情况下我们推荐使用 *ref 转发*（Forwarding Refs）。Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref。
4. Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧，其允许某些组件接收 ref，并将其向下传递（“转发” 它）给子组件。
5. 在下面的示例中，`FancyButton` 使用 `React.forwardRef` 来获取传递给它的 ref，然后转发到它渲染的 DOM `button`
    ```js
    const FancyButton = React.forwardRef((props, ref) => (
        <button ref={ref} className="FancyButton">
            {props.children}
        </button>
    ));

    // 你可以直接获取 DOM button 的 ref：
    const ref = React.createRef();
    <FancyButton ref={ref}>Click me!</FancyButton>;
    ```
6. 这样，使用 `FancyButton` 的组件可以获取底层 DOM 节点 `button` 的 ref ，并在必要时访问，就像其直接使用 DOM `button` 一样。
7. 第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 class 组件不接收 `ref` 参数，且 `props` 中也不存在 `ref`。
8. Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

### TODO
* 在高阶组件中转发 refs
* 在 DevTools 中显示自定义名称