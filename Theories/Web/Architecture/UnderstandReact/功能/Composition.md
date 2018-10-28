# Composition

## 包含关系
1. 看起来功能就相当于 Vue 的 slot，通过`props.children`接收插入的所有子节点
    ```js
    function FancyBorder(props) {
        return (
            <div>
                {props.children}
            </div>
        );
    }

    function WelcomeDialog() {
        return (
            <FancyBorder>
                <h1 className="Dialog-title">
                    Welcome
                </h1>
                <p className="Dialog-message">
                    Thank you for visiting our spacecraft!
                </p>
            </FancyBorder>
        );
    }


    ReactDOM.render(
        <WelcomeDialog />,
        document.getElementById('root')
    );
    ```
2. 需要注意的是，如果你传入不是多个 JSX 元素、多类型插入值或一个明确的数组类型，则`props.children`并不会是一个数组
    ```js
    function Str(props) {
        console.log(Array.isArray(props.children)); // false
        return <div>props.children</div>;
    }
    function Ele(props) {
        console.log(Array.isArray(props.children)); // false
        return <div>props.children</div>;
    }
    function Exp(props) {
        console.log(Array.isArray(props.children)); // false
        return <div>props.children</div>;
    }

    function Com() {
        return (
            <div>
                <Str>
                    1 2
                    3
                </Str>
                <Ele>
                    <span>span</span>
                </Ele>
                <Exp>
                    {{age: 22}}
                </Exp>
            </div>
        );
    }

    ReactDOM.render(
        <Com />,
        document.getElementById('root')
    );
    ```
    `props.children`会是数组的情况
    ```js
    function Str(props) {
        console.log(Array.isArray(props.children)); // true
        return <div>props.children</div>;
    }
    function Ele(props) {
        console.log(Array.isArray(props.children)); // true
        return <div>props.children</div>;
    }
    function Exp(props) {
        console.log(Array.isArray(props.children)); // true
        return <div>props.children</div>;
    }

    function Com() {
        return (
            <div>
                <Str>
                    {/* 多类型，字符串和元素 */ }
                    1<br />2
                </Str>
                <Ele>
                    {/* 多个元素 */ }
                    <span>span1</span>
                    <span>span2</span>
                </Ele>
                <Exp>
                    {/* 明确的数组类型 */ }
                    {[]}
                </Exp>
            </div>
        );
    }
    ```
3. 因为可以通过 props 传递任何东西，所以可以直接通过 props 传递元素。功能上类似于 Vue
的命名插槽，不过要比命名插槽的写法简单且直接，相当直接！
    ```js
    function SplitPane(props) {
        return (
            <div className="SplitPane">
                <div className="SplitPane-left">
                    {props.left}
                </div>
                <div className="SplitPane-right">
                    {props.right}
                </div>
            </div>
        );
    }

    function Contacts(){
        return <p>Contacts</p>;
    }
    function Chat(){
        return <p>Chat</p>;
    }

    function App() {
        return (
            <SplitPane
                left = { <Contacts /> }
                right = { <Chat /> }
            />
        );
    }


    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
    ```
    类似`<Contacts />`和`<Chat />`这样的 React 元素都是对象，所以你可以像任何其他元素
    一样传递它们。

### 可插入的类型
#### 字符串常量
```js
function MyComponent(props) {
    return <p>{props.children}</p>;        
}

ReactDOM.render(
    <MyComponent>Hello world!</MyComponent>,
    document.getElementById('root')
);
```

#### JSX
你可以通过子代嵌入更多的 JSX 元素，这对于嵌套显示组件非常有用
```js
function MyComponent(props) {
    return <p>{props.children}</p>;
}

function Hello(){
    return <span>Hello World!</span>;
}

ReactDOM.render(
    <MyComponent><Hello /></MyComponent>,
    document.getElementById('root')
);
```

#### JavaScript 表达式
1. 你可以将任何`{}`包裹的 JavaScript 表达式作为子代传递。
    ```js
    function Item(props) {
        return <li>{props.message}</li>;
    }

    function TodoList() {
        const todos = ['finish doc', 'submit pr', 'nag dan to review'];
        return (
            <ul>
                {todos.map((message) => <Item key={message} message={message} />)}
            </ul>
        );
    }

    ReactDOM.render(
        <TodoList />,
        document.getElementById('root')
    );
    ```
2. 一个传递函数的例子
    ```js
    function Repeat(props) {
        let items = [];
        for (let i = 0; i < props.numTimes; i++) {
            items.push(props.children(i));
        }
        return <div>{items}</div>;
    }

    function ListOfTenThings() {
        return (
            <Repeat numTimes={10}>
                {(index) => <div key={index}>This is item {index} in the list</div>}
            </Repeat>
        );
    }

    ReactDOM.render(
        <ListOfTenThings />,
        document.getElementById('root')
    );
    ```
    `ListOfTenThings`组建中，向`<Repeat>`元素传递了一个函数和一个次数数字。`<Repeat>`
    中会根据这个次数数字进行十次循环，每次都会调用传入的函数生成一个 item 元素。

#### 布尔值、Null 和 Undefined 被忽略
1. `false`、`null`、`undefined`和`true`都是有效的子代，但它们不会直接被渲染。下面的表
达式是等价的：
    ```js
    <div />

    <div></div>

    <div>{false}</div>

    <div>{null}</div>

    <div>{undefined}</div>

    <div>{true}</div>
    ```
2. 这在根据条件来确定是否渲染 React 元素时非常有用。以下的 JSX 只会在`showHeader`为
`true`时渲染`<Header />`组件。
    ```html
    <div>
        {showHeader && <Header />}
        <Content />
    </div>
    ```
3. 要注意的是，JavaScript 中的 “falsy” 值依然会被渲染。所以下面代码中的
`props.messages.length`即使为 0，也会被渲染出`'0'`
    ```html
    <div>
          {props.messages.length &&
            <MessageList messages={props.messages} />
          }
    </div>
    ```
4. 如果你想让`false`、`null`、`undefined`和`true`出现在输出中，你必须先把它转换成字符
串:
    ```html
    <div>
        My JavaScript variable is {undefined+''}.
    </div>
    ```


## 特殊实例
有时我们认为组件是其他组件的特殊实例。例如，我们会说`WelcomeDialog`是`Dialog`的特殊实
例。其实就是通过给通用的`Dialog`组件传递一些参数来定义一个用作欢迎的`Dialog`组件。
```js
function Dialog(props) {
    return (
        <div>
            <h1 className="Dialog-title">
                {props.title}
            </h1>
            <p className="Dialog-message">
                {props.message}
            </p>
        </div>
    );
}

function WelcomeDialog() {
    return (
        <Dialog
            title="Welcome"
            message="Thank you for visiting our spacecraft!"
        />
    );
}

ReactDOM.render(
    <WelcomeDialog />,
    document.getElementById('root')
);
```

## 一个结合了包含关系和特殊实例的例子
```js
function Dialog(props) {
    return (
        <div>
            <h1 className="Dialog-title">
                {props.title}
            </h1>
            <p className="Dialog-message">
                {props.message}
            </p>
            {props.children}
        </div>
    );
}

class SignUpDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.state = {login: ''};
    }

    render() {
        return (
            <Dialog title="Mars Exploration Program"
                    message="How should we refer to you?">
                    <input value={this.state.login}
                            onChange={this.handleChange} />
                    <button onClick={this.handleSignUp}>
                        Sign Me Up!
                    </button>
            </Dialog>
        );
    }

    handleChange(e) {
        this.setState({login: e.target.value});
    }

    handleSignUp() {
        alert(`Welcome aboard, ${this.state.login}!`);
    }
}

ReactDOM.render(
    <SignUpDialog />,
    document.getElementById('root')
);
```

`Dialog`通过`props.children`接收插入的`<input>`和`<button>`，通过两个`props`属性
接收插入的`title`和`message`。进而把通用的`Dialog`定制成了火星探索登录用的对话框。


## 不需要继承
1. 虽然组件一般定义为类，因而可以实现继承。但 React 实现特殊实例的情况还是使用上面
`props`的方法，而非类继承。
2. 组件可以接受任意元素，包括基本数据类型、React 元素或函数。这种方法提供了以清晰和安全
的方式自定义组件的样式和行为所需的所有灵活性。相比使用类继承的方法，这种方法有着更易读的
组件结构和依赖关系。
3. 如果要在组件之间复用 UI 无关的功能，我们建议将其提取到单独的 JavaScript 模块中。这样
可以在不对组件进行扩展的前提下导入并使用该函数、对象或类。
