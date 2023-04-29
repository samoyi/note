# Performance

## Misc
* 在 React 应用中检测性能问题时，请务必使用压缩过的生产版本。
* 更新 UI 时，React 在内部使用几种巧妙的技术来最小化 DOM 操作的数量。


## 避免重复渲染
1. React 在渲染出的 UI 内部建立和维护了一个内层的实现方式，它包括了从组件返回的 React
元素。这种实现方式使得 React 避免了一些不必要的创建和关联 DOM 节点，因为这样做可能比直
接操作 JavaScript 对象更慢一些。有时它被称之为“虚拟DOM”，但是它其实和 React Native 的
工作方式是一样的。
2. 当一个组件的`props`或者`state`改变时，React 通过比较新返回的元素和之前渲染的元素来
决定是否有必要更新实际的 DOM。当他们不相等时，React 会更新真实 DOM。
3. 在一些情况下，你的组件可以通过重写这个生命周期函数`shouldComponentUpdate`来提升速
度， 它是在重新渲染过程开始前触发的。 这个函数默认返回`true`，可使 React 执行更新：
    ```js
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    ```
    如果你知道在某些情况下你的组件不需要更新，你可以在`shouldComponentUpdate`内返回
    `false`来跳过整个渲染进程，该进程包括了对该组件和之后的内容调用`render()`指令。
4. 注意，这里说的渲染是指对虚拟 DOM 的渲染。当然，阻止了虚拟 DOM 的渲染也会阻止真是的。
5. 例如你想让组件只在 `props.color` 或者 `state.count` 的值变化时重新渲染，你可以像下面这
样设定 `shouldComponentUpdate`
    ```js
    class CounterButton extends React.Component {
        constructor(props) {
            super(props);
            this.state = {count: 1};
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (this.props.color !== nextProps.color) {
                return true;
            }
            // 如果删除下面这个判断，点击按钮时 count 还会增加，但不会渲染出来，下面的
            // componentWillUpdate 钩子也不会触发
            if (this.state.count !== nextState.count) {
                return true;
            }
            return false;
        }

        componentWillUpdate(){
            console.log('componentWillUpdate');
        }

        render() {
            return (
                <button color={this.props.color}
                        onClick={() => this.setState(state => ({count: state.count + 1}))}>
                    Count: {this.state.count}
                </button>
            );
        }
    }

    ReactDOM.render(
        <CounterButton />,
        document.getElementById('root')
    );
    ```
5. 看起来这种阻止重新渲染的功能和 Vue 的 `v-once` 组件类似，是不是也会和使用 `v-once` 组件
有同样的风险呢？

### PureComponent
1. 只有输入值（state 和 props）改变时才会重渲染虚拟 DOM 的组件。
2. 使用纯组件，就不用像上面例子中那样手动在 `shouldComponentUpdate` 方法中做判断。
3. 纯组件继承自 `React.PureComponent`
    ```js
    class CounterButton extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {count: 1};
        }

        componentWillUpdate(){
            console.log('componentWillUpdate');
        }

        render() {
            return (
                <button color={this.props.color}
                        onClick={() => this.setState(state => ({count: state.count + 1}))}>
                    Count: {this.state.count}
                </button>
            );
        }
    }
    ```

#### 纯组件的问题
##### 同属性的引用类型判定为不同
纯组件对 state 和 prop 值得判断是浅相等判断，它不会深入引用类型的属性去做相等性判断。
即认为`{} !== {}`。所以即使是相同属性值的引用类型也会触发重渲染
```js
class CounterButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {count: [1]};
    }

    componentWillUpdate(){
        console.log('componentWillUpdate');
    }

    render() {
        return (
            <button color={this.props.color}
                    onClick={() => this.setState(state => ({count: [1]}))}>
                Count: {this.state.count}
            </button>
        );
    }
}
```

##### 修改引用类型状态时引起的问题
1. 直接赋值引用引用类型值，
    ```js
    class WordAdder extends React.PureComponent {
        constructor(props){
            super(props);
            this.state = {
                names: ['Hime'],
            }
        }

        componentWillUpdate(){
            console.log('componentWillUpdate');
        }

        componentDidMount(){
            setTimeout(()=>{
                let names = this.state.names; // 直接拷贝引用类型指针
                names.push('Hina'); // 修改该引用类型

                console.log(this.state.names); // ["Hime", "Hina"]
                console.log(names); // ["Hime", "Hina"]
                console.log(this.state.names === names); // true

                // 同值更新
                this.setState({
                    names,
                })
            }, 3000);
        }

        render(){
            return <div>{this.state.names}</div>
        }
    }
    ReactDOM.render(
        <WordAdder />,
        document.getElementById('root')
    );
    ```
2. 因为纯组件只有输入值改变时才会重渲染虚拟 DOM 的组件，所以上面的`setState`并不会引发
渲染。因此，虽然数据确实改变了，但虚拟 DOM 和真实 DOM 都没有更新。
3. 如果这里用的是普通组件，因为普通组件中`setState`一定会触发虚拟 DOM 更新，所以就可以
用新数据渲染虚拟 DOM 并渲染真实 DOM。
4. 避免这种问题也很简单，因为上面是直接拷贝指针，所以两个`this.state.names`和`names`
才是同一个数组。只要拷贝出一个新数组就可以了
    ```js
    setTimeout(()=>{
        let names = this.state.names.slice();
        names.push('Hina');

        console.log(this.state.names); // ["Hime"]
        console.log(names); // ["Hime", "Hina"]
        console.log(this.state.names === names); // false

        this.setState({
            names,
        })
    }, 3000);
    ```

### `React.memo`