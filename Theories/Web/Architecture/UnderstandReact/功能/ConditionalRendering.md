# Conditional Rendering


<!-- TOC -->

- [Conditional Rendering](#conditional-rendering)
    - [Element Variables](#element-variables)
    - [阻止组件渲染](#阻止组件渲染)

<!-- /TOC -->


## Element Variables
You can use variables to store elements. This can help you conditionally render a part of the component while the rest of the output doesn’t change.
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


## 阻止组件渲染
1. 组件的 `render` 方法返回 `null` 就会阻止该组件渲染。
2. 注意，这里是在 `render` 方法里阻止渲染，也就是说，已经渲染了虚拟节点，但会阻止渲染真实节点。所以这并不会影响该组件生命周期方法的回调。例如，`componentWillUpdate` 和 `componentDidUpdate` 依然可以被调用。
3. 与 Vue 的 `v-if="false"` 比较，两者都是不会渲染组件，但是 Vue 中根本不会创建组件，即连 `beforeCreate()` 都不会被调用
    ```html
    <div id="app">
        <child v-if="true" />
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