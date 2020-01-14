# Rendering


## Basic
1. Elements are the smallest building blocks of React apps.
2. An element describes what you want to see on the screen:
    ```js
    const element = <h1>Hello, world</h1>;
    ```
3. Unlike browser DOM elements, React elements are plain objects, and are cheap to create. React DOM takes care of updating the DOM to match the React elements.


## 注意 render 的概念
1. 先看一下这个例子
    ```js
    class Foo extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                names: 'Hime',
            }
        }

        componentDidUpdate(){
            console.log('componentDidUpdate');
        }

        componentDidMount(){
            setTimeout(()=>{
                this.setState({
                    names: 'Hime',
                })
            }, 3000);
        }

        render(){
            console.log('render');
            return <div>{this.state.names}</div>
        }
    }
    ReactDOM.render(
        <Foo />,
        document.getElementById('root')
    );
    ```
2. 挂载三秒钟之后，`setState`使用相同的值重新设置了`names`，但这依然触发了`render`函数和`componentDidUpdate`钩子。
3. 显然，如果单纯的类比到 Vue 的情况，这就很奇怪了，因为 Vue 不会再这种情况下触发`updated`并重渲染。这看起来似乎是只要调用了`setState`就会导致重渲染，如果是这样，这显然是很消耗性能的。
4. 然而 React 语境下的 render，是指渲染虚拟 DOM。参考[这个回答](https://stackoverflow.com/a/24719289)
5. 如果你没有在`shouldComponentUpdate`方法里返回`false`，或者该组件不是 PureComponent，那么只要调用`setState()`，就一定会触发虚拟 DOM 重渲染，进而触发相关的函数。
6. 但是令人放心的是，只要`setState()`没有导致状态值的真正改变，并不会触发渲染真实 DOM。
