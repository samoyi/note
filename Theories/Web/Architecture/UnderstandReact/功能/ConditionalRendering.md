# Conditional Rendering

## 阻止组件渲染
1. 组件的`render`方法返回`null`就会阻止该组件渲染。
2. 组件的`render`方法返回`null`并不会影响该组件生命周期方法的回调。例如，
`componentWillUpdate`和`componentDidUpdate`依然可以被调用。
3. 与 Vue 的`v-if="false"`比较，两者都是不会渲染组件，但是 Vue 中根本不会创建组件，即
连`beforeCreate()`都不会被调用
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
4. 而 React 的情况则不仅会触发挂载钩子，甚至还能触发更新钩子生命周期函数，即使该组件根
本就没有渲染
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

        // 而且更新了毫无用处的 age 且组件根本没渲染的情况下，这个钩子居然也会被调用
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
