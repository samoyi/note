# State


<!-- TOC -->

- [State](#state)
    - [Misc](#misc)
    - [状态更新可能是异步的](#状态更新可能是异步的)
        - [不一定会同步更新 state 数据](#不一定会同步更新-state-数据)
        - [解决方法](#解决方法)
        - [对比 Vue](#对比-vue)

<!-- /TOC -->


## Misc
* `state` 只应存储于渲染相关的值。如果一个值不被用于 `render()` 中，那就不应该定义在 `state` 里。例如本例中的定时器 ID `timerID`。
* 不能直接修改 `state` 属性，只能使用 `setState()`。构造函数是唯一能直接初始化赋值 `this.state` 的地方
    ```js
    this.state.title = 'hello'; // 不能这样直接修改
    ```


## 状态更新可能是异步的
### 不一定会同步更新 state 数据
1. 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。
2. 因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
3. 先看一个例子
    ```js
    class Foo extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                counter: 0,
            };
        }

        handleClick() {
            console.log(this.state.counter);  // 0
            this.setState({
                counter: this.state.counter + this.props.increment,
            });
            console.log(this.state.counter); // 0

            setTimeout(()=>{
                console.log(this.state.counter); // 1
            })
        }

        render() {
            return (
                <h1 onClick={()=>this.handleClick()}>{this.state.counter}</h1>
            );
        }
    }

    ReactDOM.render(
        <Foo increment={1} />,
        document.getElementById('root')
    );
    ```
4. 这就明显的不是同步更新状态了。更实际的例子是，把 `handleClick` 函数改为如下
    ```js
    handleClick() {
        this.setState({
            counter: this.state.counter + this.props.increment,
        });
        this.setState({
            counter: this.state.counter + this.props.increment,
        });
    }
    ```
    一次点击后虽然会触发两次 `setState`，但不管是页面渲染结果还是实际的数据，`state` 都是 `1`，即只更新了一次。
5. 文档中说到 “可能是” 异步的，参考这个[问题](https://www.zhihu.com/question/66749082)

### 解决方法
1. 要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。
2. 这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：
    ```js
    // Correct
    this.setState((state, props) => ({
        counter: state.counter + props.increment
    }));
    ```
3. 不过这个参数的函数并不是回调，不是等到上次更新完成了才执行的。代码演示
    ```js
    handleClick() {
        this.setState((prevState, props) => ({
            counter: prevState.counter + props.increment
        }));

        console.log(this.state.counter); // 0  先输出这个

        this.setState((prevState, props) => {
            // 最后执行这里
            console.log(this.state.counter); // 0
            console.log(prevState.counter); // 1
            return {
                counter: prevState.counter + props.increment
            };
        });

        console.log(this.state.counter); // 0  再输出这个
    }
4. 可以看到，在该函数内部，`state` 仍然没有被更新，只是可以通过第一个参数访问到理论上的更新后的值。
5. 用下面的方法看起来也可以，但是不是就走到下一个 MacroTask 了？
    ```js
    handleClick() {
        this.setState({
            counter: this.state.counter + this.props.increment,
        });
        setTimeout(()=>{
            this.setState({
                counter: this.state.counter + this.props.increment,
            });
        });
    }
    ```


### 对比 Vue
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
            console.log(this.counter); // 1
            this.counter++;
            console.log(this.$el.textContent); // "0"
            console.log(this.counter); // 2
            this.$nextTick(()=>{
                console.log(this.$el.textContent); // "2"
            });
        },
    }).$mount('#app');
    </script>
    ```
2. Vue 只是没有同步渲染，但数据本身确实是同步更新了，只是把两次渲染合并为了一次。
3. 这就保证了连续的数据更新不会错误。虽然等待最终合并的渲染结果要在下一次事件循环。
4. 而 React 不仅是合并的渲染，连数据更新本身都合并了。 