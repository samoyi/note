# State


## Misc
* `state`只应存储于渲染相关的值。如果一个值不被用于`render()`中，那就不应该定义在`state`里。例如本例中的定时器 ID `timerID`。
* 不能直接修改`state`属性，只能使用`setState()`。构造函数是唯一能直接初始化赋值`this.state`的地方
    ```js
    this.state.title = 'hello'; // 不能这样直接修改
    ```


## 状态更新可能是异步的
1. React 可以将多个`setState()`调用合并成一个调用来提高性能。
2. 先看一个例子
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
3. 这就明显的不是同步更新状态了。更实际的例子是，把`handleClick`函数改为如下
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
    一次点击后虽然会触发两次`setState`，但不管是页面渲染结果还是实际的数据，`state`都是`1`，即只更新了一次。
4. 不按照文档中说的方法，直接修复这个问题也很简单
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
5. 对比一下 Vue 的情况
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
6. Vue 只是没有同步渲染，但数据本身确实是同步更新了，只是把两次渲染合并为了一次。这就保证了连续的数据更新不会错误。虽然等待最终合并的渲染结果要在下一次事件循环。而 React 不仅是合并的渲染，连数据更新本身都合并了。
7. React 的文档说明不应该像上面那样使用`this.setState`，而是要给它传参一个函数。该函数类似于一个回调，即上一次数据更新后，会调用该函数返回本次更新的数据。该函数的第一个参数，是上次数据更新的结果
    ```js
    handleClick() {
        this.setState((prevState, props) => ({
            counter: prevState.counter + props.increment
        }));

        console.log(this.state.counter); // 0  先输出这个

        this.setState((prevState, props) => {
            // 最后执行该回调
            console.log(this.state.counter); // 0
            console.log(prevState.counter); // 1
            return {
                counter: prevState.counter + props.increment
            };
        });

        console.log(this.state.counter); // 0  再输出这个
    }
    ```
8. 不过可以看到，这也不是真正的回调，也不是真的等到上次更新完成了才执行的。因为在该函数内部，`state`仍然没有被更新，只是可以通过第一个参数访问到理论上的更新后的值。    
9. 文档中说到“可能是”异步的，参考这个[问题](https://www.zhihu.com/question/66749082)
