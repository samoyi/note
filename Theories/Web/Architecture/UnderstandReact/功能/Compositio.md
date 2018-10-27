# Compositio

## Containment
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
2. 因为可以通过 props 传递任何东西，所以可以直接通过 props 传递元素。功能上类似于 Vue
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


## 特殊实例
1. 有时我们认为组件是其他组件的特殊实例。例如，我们会说`WelcomeDialog`是`Dialog`的特
殊实例。其实就是通过给通用的`Dialog`组件传递一些参数来定义一个用作欢迎的`Dialog`组件。
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
