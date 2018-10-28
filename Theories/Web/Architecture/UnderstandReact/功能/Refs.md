# Refs


## 目的
1. 在典型的 React 数据流中, 属性（props）是父组件与子组件交互的唯一方式。要修改子组件，
你需要使用新的 props 重新渲染它。
2. 但是，某些情况下你需要在典型数据流外强制修改子组件。要修改的子组件可以是 React 组件
的实例，也可以是 DOM 元素。
3. Refs 提供了一种方式，用于访问在 render 方法中创建的 DOM 节点或 React 元素。


## 尽量避免使用 refs
1. 如果可以通过声明式实现，则尽量避免使用 refs。
2. 通常情况下，将组件内的状态提升到外部，使用 props 传参都是更符合逻辑的。
3. 在设计组件时，尽量保持组件的完备性。组件应该仅通过少数几个 props 就可以满足需求，而
不应该需要外部直接通过 refs 修改组件。


## 用法
1. 使用`React.createRef()`创建一个 ref，通过元素的`ref`属性来将创建的 ref 指向该元素
上。如果要引用多个元素，就要多次调用`React.createRef()`来创建 ref
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
2. 使用一个 ref 的`current`属性来访问其指向的元素。
    * 当`ref`属性被用于一个普通的 HTML 元素时，`React.createRef()`将接收底层 DOM 元
    素作为它的`current`属性以创建 ref 。
    * 当`ref`属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为它的
    `current`。
    * 你不能在函数式组件上使用`ref`属性，因为它们没有实例。

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
1. React 会在组件加载时将 DOM 元素传入`current` 属性，在卸载时则会改回`null`。
2. ref 的更新会发生在`componentDidMount`或`componentDidUpdate`生命周期钩子之前。
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
上一个例子中，`CustomTextInput`组件中需要手动点击按钮才能让文本框获得焦点。在本例中，
`AutoFocusTextInput`组件通过 ref 引用`CustomTextInput`组件，并且在挂载后， 通过 ref
引用`CustomTextInput`组件并调用其`focusTextInput`来实现自动获得焦点。

### 不能在函数式组件上使用 ref 属性
1. 上面说到，当`ref`属性被用于一个自定义类组件时，ref 对象将接收该组件已挂载的实例作为
它的`current`。然而，函数式组件并没有实例，它只相当于单纯的 HTML 元素，所以无法引用。

### 回调 Refs
1. React 也支持另一种设置 ref 的方式，称为“回调 ref”，更加细致地控制何时 ref 被设置和
解除。
2. 这时传递给`ref`属性的不是`React.createRef()`创建的 ref，而是一个函数
3. 这个函数接受 React 组件的实例或 DOM 元素作为参数，以存储它们并使它们能被其他地方访问

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

4. React 将在组件挂载时将 DOM 元素传入 ref 回调函数并调用，当卸载时传入`null`并调用它。
5. ref 回调函数会在`componentDidMout`和`componentDidUpdate`生命周期函数前被调用。
6. 如果 ref 回调以内联函数的方式定义，在更新期间它会被调用两次，第一次参数是`null` ，之
后参数是 DOM 元素。这是因为在每次渲染中都会创建一个新的函数实例。因此，React 需要清理旧
的 ref 并且设置新的。通过将 ref 的回调函数定义成类的绑定函数的方式可以避免上述问题，但
是大多数情况下无关紧要。

### ref 可以像普通 prop 一样传递
```js
class Child extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <p>
                <input type="text" ref={this.props.passedRef} />
                {/* <input type="text" ref={this.props.refFn} /> */}
            </p>
        );
    }
}
class Parent extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        // this.inputRef = null;
    }

    componentDidMount() {
        console.log(this.inputRef.current);
        // console.log(this.inputRef);
    }

    render() {
        return (
            <Child passedRef={this.inputRef} />
        );
        // const fn = (el)=>{this.inputRef= el};
        // return <Child refFn={fn} />;
    }
}

ReactDOM.render(
    <Parent />,
    document.getElementById('root')
);
```
1. `Parent`中的 ref 没有直接设置到`Child`上面来引用`Child`实例，而是通过`Child`的属性
`passedRef`传递到其内部。
2. 内部元素`input`通过`passedRef`接收到`Parent`的 ref，让这个 ref 来引用自己。
3. 可以传递 ref 对象，也可以像注释中表示的那样，传递回调 ref 函数。
