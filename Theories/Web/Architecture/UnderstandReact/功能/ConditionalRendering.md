# Conditional Rendering


<!-- TOC -->

- [Conditional Rendering](#conditional-rendering)
    - [根据条件渲染不同的组件](#根据条件渲染不同的组件)
    - [元素变量](#元素变量)
    - [使用 `&&` 运算符进行条件渲染](#使用--运算符进行条件渲染)
    - [使用三目运算符进行条件渲染](#使用三目运算符进行条件渲染)
    - [阻止组件渲染](#阻止组件渲染)

<!-- /TOC -->


## 根据条件渲染不同的组件
1. 下面两个组件分别针对已登录的用户和游客
    ```js
    function UserGreeting(props) {
        return <h1>Welcome back!</h1>;
    }

    function GuestGreeting(props) {
        return <h1>Please sign up.</h1>;
    }
    ```
2. 包装一个统一的组件，根据参数的登录状态来返回上面两个组件中的一个
    ```js
    function Greeting(props) {
        const isLoggedIn = props.isLoggedIn;
        if (isLoggedIn) {
            return <UserGreeting />;
        }
        else {
            return <GuestGreeting />;
        }
    }
    ```
3. 使用包装后的组件
    ```js
    ReactDOM.render(
        // Try changing to isLoggedIn={true}:
        <Greeting isLoggedIn={false} />,
        document.getElementById('root')
    );
    ```


## 元素变量
你可以使用变量来储存元素。它可以帮助你有条件地渲染组件的一部分，而其他的渲染部分并不会因此而改变。
```js
render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
        button = <LogoutButton onClick={this.handleLogoutClick} />;
    } 
    else {
        button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
        <div>
            <Greeting isLoggedIn={isLoggedIn} />
            {button}
        </div>
    );
}
```


## 使用 `&&` 运算符进行条件渲染
```js
function Mailbox(props) {
    const unreadMessages = props.unreadMessages;
    return (
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 &&
                <h2>
                    You have {unreadMessages.length} unread messages.
                </h2>
            }
        </div>
    );
}
```


## 使用三目运算符进行条件渲染
```js
render() {
    const isLoggedIn = this.state.isLoggedIn;
    return (
        <div>
            {isLoggedIn
                ? <LogoutButton onClick={this.handleLogoutClick} />
                : <LoginButton onClick={this.handleLoginClick} />
            }
        </div>
    );
}
```


## 阻止组件渲染
1. 组件的 `render` 方法返回 `null` 就会阻止该组件渲染
    ```js
    function WarningBanner(props) {
        if (!props.warn) {
            return null;
        }

        return (
            <div className="warning">Warning!</div>
        );
    }
    ```
2. 注意，这里是在 `render` 方法里阻止渲染，也就是说，已经创建了虚拟节点，但会阻止渲染真实节点。所以这并不会影响该组件生命周期方法的回调。例如，`componentWillUpdate` 和 `componentDidUpdate` 依然可以被调用。
3. 与 Vue 的 `v-if="false"` 比较，两者都是不会渲染组件，但是 Vue 中根本不会创建组件，即连 `beforeCreate()` 都不会被调用
    ```html
    <div id="app">
        <child v-if="false" />
    </div>
    <script>
    "use strict";
    new Vue({
        components: {
            child: {
                render(h){
                    return h('p', 'child');
                },
                beforeCreate(){ // 不会被调用
                    console.log('beforeCreate');
                },
            }
        },
    }).$mount('#app');
    </script>
    ```
    ```js
    class Foo extends React.Component {
        constructor(props) {
            super(props);
        }

        componentDidMount(){ // 会被调用
            console.log('componentDidMount');
        }

        render() {
            return null;
        }
    }

    ReactDOM.render(
        <Foo display={false} />,
        document.getElementById('root')
    );
    ```
4. 而 React 的情况下，因为其钩子函数是针对虚拟 DOM 的，所以不仅会触发挂载钩子，甚至还能触发更新钩子生命周期函数，即使该组件根本就没有真实的渲染
    ```js
    class Foo extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                age: 22,
            }
        }

        componentDidMount(){ // 不仅这个钩子会被调用
            console.log('componentDidMount');
            setTimeout(()=>{
                this.setState({
                    age: 33,
                });
            }, 2000);
        }

        // 而且更新了毫无用处的 age 且组件根本没真实渲染的情况下，这个钩子也会被调用
        componentWillUpdate(){
            console.log('componentWillUpdate');
        }

        render() {
            return null;
        }
    }

    ReactDOM.render(
        <Foo display={false} />,
        document.getElementById('root')
    );
    ```


    ## References
    * [条件渲染](https://react.docschina.org/docs/conditional-rendering.html)