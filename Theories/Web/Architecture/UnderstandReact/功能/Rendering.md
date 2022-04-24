# Rendering


<!-- TOC -->

- [Rendering](#rendering)
    - [React 元素](#react-元素)
    - [React 元素是不可变对象](#react-元素是不可变对象)
    - [React 只更新它需要更新的部分](#react-只更新它需要更新的部分)
    - [注意 React 中 render 的概念](#注意-react-中-render-的概念)

<!-- /TOC -->


## React 元素
1. 元素是构成 React 应用的最小块。元素描述了你在屏幕上想看到的内容
    ```js
    const element = <h1>Hello, world</h1>;
    ```
2. 与浏览器的 DOM 元素不同，React 元素是创建开销极小的普通对象。React DOM 会负责更新 DOM 来与 React 元素保持一致。
3. 你可能会将元素与另一个被熟知的概念——“组件” 混淆起来。组件是由元素构成的。
4. 仅使用 React 构建的应用通常只有单一的根 DOM 节点。使用 `ReactDOM.createRoot()` 设置根节点
    ```js
    const element = <h1>Hello, world</h1>;
    const root = ReactDOM.createRoot(
        document.getElementById('root')
    );
    root.render(element);
    ```
    把 ID 为 `root` 的元素作为根节点，然后把 `element` 渲染进根节点。
    

## React 元素是不可变对象
1. 一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。
2. 根据我们已有的知识，更新 UI 唯一的方式是创建一个全新的元素，并将其传入 `ReactDOM.render()`。
3. 考虑一个计时器的例子：
    ```js
    function tick() {
        const element = (
            <div>
            <h1>Hello, world!</h1>
            <h2>It is {new Date().toLocaleTimeString()}.</h2>
            </div>
        );
        ReactDOM.render(element, document.getElementById('root'));
    }

    setInterval(tick, 1000);
    ```
4. 这个例子会在 `setInterval()` 回调函数，每秒都调用 `ReactDOM.render()`。


## React 只更新它需要更新的部分
1. React DOM 会将元素和它的子元素与它们之前的状态进行比较，并只会进行必要的更新来使 DOM 达到预期的状态。
2. 上面的例子中，尽管每一秒我们都会新建一个描述整个 UI 树的元素，React DOM 只会更新实际改变了的内容，也就是例子中的文本节点。
3. React 元素每次都会销毁重建，但其代表的 DOM 元素，并不会完整的销毁重建。应该就是新旧虚拟 DOM 的 patch 过程吧。
4. 根据我们的经验，考虑 UI 在任意给定时刻的状态，而不是随时间变化的过程，能够消灭一整类的 bug。TODO，什么 bug。


## 注意 React 中 render 的概念
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
2. 挂载三秒钟之后，`setState` 使用相同的值重新设置了 `names`，但这依然触发了 `render` 函数和 `componentDidUpdate` 钩子。
3. 显然，如果单纯的类比到 Vue 的情况，这就很奇怪了，因为 Vue 不会在这种情况下触发 `updated` 并重渲染。这看起来似乎是只要调用了`setState` 就会导致重渲染，如果是这样，这显然是很消耗性能的。
4. 然而 React 语境下的 render，是指渲染虚拟 DOM。参考[这个回答](https://stackoverflow.com/a/24719289)
5. 如果你没有在 `shouldComponentUpdate` 方法里返回 `false`，或者该组件不是 PureComponent，那么只要调用 `setState()`，就一定会触发虚拟 DOM 重渲染，进而触发相关的函数。
6. 但是令人放心的是，只要 `setState()` 没有导致状态值的真正改变，并不会触发渲染真实 DOM。