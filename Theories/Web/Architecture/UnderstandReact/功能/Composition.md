# Composition


<!-- TOC -->

- [Composition](#composition)
    - [包含关系](#包含关系)
    - [特殊实例的情况，仍然是使用组合而非继承](#特殊实例的情况仍然是使用组合而非继承)
    - [不需要继承](#不需要继承)

<!-- /TOC -->


## 包含关系
1. 功能类似于 Vue 的 slot，通过 `props.children` 接收插入的所有子节点
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
2. 需要注意的是，如果你传入不是多个 JSX 元素、多类型插入值或一个明确的数组类型，则 `props.children` 并不会是一个数组
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
3. `props.children` 会是数组的情况
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
3. 因为可以通过 props 传递任何东西，所以可以直接通过 props 传递元素。功能上类似于 Vue 的命名插槽，不过要比命名插槽的写法简单且直接
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
    类似 `<Contacts />` 和 `<Chat />` 这样的 React 元素都是对象，所以你可以像任何其他元素一样传递它们。


## 特殊实例的情况，仍然是使用组合而非继承
1. 有时我们认为组件是其他组件的特殊实例。例如，我们会说 `WelcomeDialog` 是 `Dialog` 的特殊实例。
2. 其实就是通过给通用的 `Dialog` 组件传递一些参数来定义一个用作欢迎的 `Dialog` 组件。
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


## 不需要继承
1. 虽然组件一般定义为类，因而可以实现继承。但 React 实现特殊实例的情况还是使用上面 `props` 的方法，而非类继承。
2. 组件可以接受任意元素，包括基本数据类型、React 元素或函数。这种方法提供了以清晰和安全的方式自定义组件的样式和行为所需的所有灵活性。
3. 相比使用类继承的方法，这种方法有着更易读的组件结构和依赖关系。
4. 如果要在组件之间复用 UI 无关的功能，我们建议将其提取到单独的 JavaScript 模块中。这样可以在不对组件进行扩展的前提下导入并使用该函数、对象或类。