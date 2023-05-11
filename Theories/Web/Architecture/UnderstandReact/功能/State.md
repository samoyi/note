# State


<!-- TOC -->

- [State](#state)
    - [一例](#一例)
    - [不能直接修改 State](#不能直接修改-state)
    - [不能在构造函数内调用 `setState`](#不能在构造函数内调用-setstate)
    - [状态更新可能是异步的](#状态更新可能是异步的)
        - [不一定会同步更新 state 数据](#不一定会同步更新-state-数据)
    - [State 的更新会被合并](#state-的更新会被合并)
    - [对比 Vue](#对比-vue)
    - [References](#references)

<!-- /TOC -->


## 一例
1. 下面的 class 组件每秒钟会更新一次时间显示
    ```js
    class Clock extends React.Component {
        constructor(props) {
            super(props);
            this.state = { date: new Date() };
        }

        componentDidMount() {
            this.timerID = setInterval(() => this.tick(), 1000);
        }

        componentWillUnmount() {
            clearInterval(this.timerID);
        }

        tick() {
            this.setState({
                date: new Date(),
            });
        }

        render() {
            return (
                <div>
                    <h1>Hello, world!</h1>
                    <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
                </div>
            );
        }
    }
    ```
2. 逻辑流程如下
    1. 当渲染 `<Clock />` 时，React 会调用 `Clock` 组件的构造函数。
    2. 因为 `Clock` 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 `this.state`。我们会在之后更新 `state` 来修改里面的 `date` 属性。
    3. 之后 React 会调用组件的 `render()` 方法，React 更新 DOM 来匹配 `Clock` 渲染的输出。
    4. 当 `Clock` 的输出被插入到 DOM 中后，React 就会调用 `ComponentDidMount()` 生命周期方法。在这个方法中，`Clock` 组件向浏览器请求设置一个计时器来每秒调用一次组件的 `tick()` 方法。
    5. `state` 只应存储于渲染相关的值。如果一个值不被用于 `render()` 中，那就不应该定义在 `state` 里。所以这里的 `timerID` 就直接保存到了 `this` 上。
    6. 浏览器每秒都会调用一次 `tick()` 方法。在这方法之中，`Clock` 组件会通过调用 `setState()` 来 **计划**（schedules）进行一次 UI 更新。
    7. 得益于 `setState()` 的调用，React 能够知道 `state` 已经改变了，然后会重新调用 `render()` 方法来确定页面上该显示什么。这一次，`render()` 方法中的 `this.state.date` 就不一样了，如此一来就会渲染输出更新过的时间。React 也会相应的更新 DOM。
    8. 一旦 `Clock` 组件从 DOM 中被移除，React 就会调用 `componentWillUnmount()` 生命周期方法，这样计时器就停止了。


## 不能直接修改 State
1. 例如，此代码不会重新渲染组件：
    ```js
    // Wrong
    this.state.comment = 'Hello';
    ```
2. 而是应该使用 `setState()`
    ```js
    // Correct
    this.setState({comment: 'Hello'});
    ```
3. 构造函数是唯一可以给 `this.state` 赋值的地方。


## 不能在构造函数内调用 `setState`
1. 例子
    ```js
    class Clock extends React.Component {
        constructor(props) {
            super(props);
            this.state = {age: 22};
            
            setTimeout(()=>{
                this.setState({
                    age: 33,
                });
            }, 1000);
        }

        render() {
            return (
                <div>
                    <h1>Hello, world!</h1>
                </div>
            );
        }
    }
    ```
2. 警告如下
    ```
    Warning: Can't call setState on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the Clock component.
    ```
3. 不懂。`setTimeout` 回调调用的时候组件已经 mounted 了，为什么不行。


## 状态更新可能是异步的
### 不一定会同步更新 state 数据
1. 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。
2. 因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
3. 把上面的例子改成每秒计数加一
    ```js
    class Clock extends React.Component {
        constructor(props) {
            super(props);
            this.state = { counter: 0 }; // 修改这里的属性
        }

        componentDidMount() {
            this.timerID = setInterval(() => this.tick(), 1000);
        }

        componentWillUnmount() {
            clearInterval(this.timerID);
        }

        tick() {
            this.setState({
                counter: this.state.counter + 1, // 这里改为加一
            });
        }

        render() {
            return (
                <div>
                    <h1>Hello, world!</h1>
                    <h2>It is {this.state.counter}.</h2> // 这里改为显示计数
                </div>
            );
        }
    }
    ```
4. 如果你在 `tick()` 中同步的执行两次 `this.setState()`，会发现计数并不是每秒钟加了 2，仍然还是加 1
    ```js
    tick() {
        this.setState({
            counter: this.state.counter + 1,
        });
        this.setState({
            counter: this.state.counter + 1,
        });
    }
    ```
5. 因为两个 `setState()` 调用合并成一个调用，所以调用时 `counter` 的值还是上一次 `tick()` 后的值。
6. 要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。这个函数用上一个 `state` 作为第一个参数，将此次更新被应用时的 `props` 做为第二个参数。看起来相当于 Vue 的 `nextTick()`
    ```js
    tick() {
        this.setState({
            counter: this.state.counter + 1,
        });
        this.setState((state, props) => ({
            // 这个函数看起来相当于 `nextTick()` 的回调，它会在上面那个 setState 执行完之后再执行
            counter: state.counter + props.increment
        }));
    }
    ```
    注意函数返回的对象外面包了一层括号，这和 React 没关系。如果不加的话，大括号会被认为是函数体的标志。
7. 但是这个函数并不是等到 `this.state` 更新后才调用的。通过下面的断点可以看到
    ```js
    this.setState((state, props) =>{
        let m = state.counter; // 1
        let n = this.state.counter; // 0
        debugger;
        return {
            counter: state.counter + props.increment
        }
    });
    ```
    当这个函数调用时，`this.state` 并没有真的更新，只不过参数中的 `state` 是更新后的状态。TODO，很奇怪。
8. 旧的文档中说到 “可能是” 异步的，但看新的 18 版本的文档中说：“设置 state 只会为 下一次 渲染变更 state 的值”、“一个 state 变量的值永远不会在一次渲染的内部发生变化”。


## State 的更新会被合并
1. 当你在类组件中调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 `state`。因此每个 `setState()` 可以只修改 `state` 的部分属性
    ```js
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            comments: []
        };
    }

    componentDidMount() {
        fetchPosts().then(response => {
            this.setState({
                posts: response.posts
            });
        });

        fetchComments().then(response => {
            this.setState({
                comments: response.comments
            });
        });
    }
    ```
2. 函数式组件 `useState` 的设值方法不会合并，而是整体设值
    ```js
    function Component1 (props) {
        const [person, setPerson] = useState({name: "Hime", age: 22});
        setTimeout(() => {
            // 三秒钟只会只会渲染出名字，年龄为空
            setPerson({name: "Hina"});
        }, 3333);
        return (
            <div>
                <p>Name: {person.name}</p>
                <p>Age: {person.age}</p>
            </div>
        );
    }
    ```

## 对比 Vue
1. 代码
    ```html
    <div id="app">{{ counter }}</div>
    <script>
    "use strict";
    new Vue({
        data: {
            counter: 0,
        },
        mounted(){
            this.counter++;
            console.log(this.$el.textContent); // "0"
            debugger;
            console.log(this.counter); // 1
            debugger;
            this.counter++;
            console.log(this.$el.textContent); // "0"
            debugger;
            console.log(this.counter); // 2
            debugger;
            this.$nextTick(()=>{
                console.log(this.$el.textContent); // "2"
                debugger;
            });
        },
    }).$mount('#app');
    </script>
    ```
2. Vue 只是没有同步渲染，但数据本身确实是同步更新了，只是把两次渲染合并为了一次。
3. 这就保证了连续的数据更新不会错误。虽然等待最终合并的渲染结果要在下一次事件循环。
4. 而 React 不仅是合并的渲染，连数据更新本身都合并了。 


## References
* [State & 生命周期](https://react.docschina.org/docs/state-and-lifecycle.html)