# Events


<!-- TOC -->

- [Events](#events)
    - [语法](#语法)
    - [事件处理函数中的 `this`](#事件处理函数中的-this)
    - [向事件处理程序传递参数](#向事件处理程序传递参数)

<!-- /TOC -->


## 语法
1. React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
2. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。
3. 下面是 HTML 的事件绑定
    ```html
    <button onclick="activateLasers()">
        Activate Lasers
    </button>
    ```
4. 下面是 JSX 的事件绑定
    ```html
    <button onClick={activateLasers}>
        Activate Lasers
    </button>
    ```
5. React 中不能通过返回 `false` 的方式阻止默认行为，必须显式的使用 `preventDefault`。


## 事件处理函数中的 `this`
```js
class Foo extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this); // undefined
    }

    render() {
        return (
            <h1 onClick={this.handleClick}>111</h1>
        );
    }
}
```
1. 虽然给 `onClick` 属性传入的是一个方法，但调用的时候并不是方法调用。因为类内部是默认严格模式，因此 `handleClick` 中的 `this` 就是 `undefined`。
2. 所以需要按照注释那样，为用作事件处理函数的方法绑定 `this`。
3. 除了这个方法，还可以按照文档中说的，使用实验性的属性初始化器语法，用箭头函数方式定义方法
    ```js
    handleClick = ()=> {
        console.log(this);
    }
    ```
    这个语法在 Create React App 中默认开启。
4. 上面两个方法都是直接绑定了方法的 `this`。如果希望灵活一些，不固定方法的 `this`，可以在事件绑定时使用箭头函数返回方法
    ```js
    <h1 onClick={()=>{this.handleClick()}}>111</h1>
    ```
5. 使用这个语法有个问题就是每次渲染的时候都会创建一个不同的回调函数。在大多数情况下，这没有问题。然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染。不懂这种场景是什么，但不是下面的这个例子
    ```js
    class Bar extends React.Component {
        constructor(props){
            super(props);
        }

        componentDidUpdate() {
            console.log('componentDidUpdate');
        }

        render() {
            return <p onClick={this.props.onClick}>Bar</p>
        }
    }

    class Foo extends React.Component {
        constructor(props) {
            super(props);
        }

        handleClick(){
            console.log(this);
        }

        render() {
            return (
                <div>
                    <Bar onClick={()=>this.handleClick()} />
                </div>
            );
        }
    }

    ReactDOM.render(
        <Foo />,
        document.getElementById('root')
    );

    setInterval(()=>{
        console.log('rerender');
        ReactDOM.render(
            <Foo />,
            document.getElementById('root')
        );
    }, 3000);
    ```
    上面的例子中，不管是用现在事件绑定写法，还是改成属性初始化器语法来定义 `handleClick`，`componentDidUpdate` 都会不断被调用。
6. 我们通常建议在构造函数中绑定或使用属性初始化器语法来避免这类性能问题。


## 向事件处理程序传递参数
1. 第一种方法，和上面用到的最后一种绑定事件处理函数 `this` 的方法一样，将事件处理函数包装为一个新的函数，在该函数内部调用事件处理函数。这样就可以在调用时任意传递参数。同时通过这个新的函数来接受事件对象
    ```js
    handleClick = (ev, name, age, foo)=>{
        console.log(name); // "33"
        console.log(age); // 22
        console.log(ev.target.nodeName); // "IDV"
        console.log(foo); // undefined
    }

    render() {
        return (
            <div onClick={(ev)=>this.handleClick(ev, '33', 22)}>
                div
            </div>
        );
    }
    ```
2. 第二个方法是，使用 `bind()` 方法在绑定事件处理函数时传入参数
    ```js
    // 和原生 JS 中的事件绑定传参一样，第一个多出来一个形参，会用来接收事件对象
    handleClick = (name, age, ev, foo)=>{
        console.log(name); // "33"
        console.log(age); // 22
        console.log(ev.target.nodeName); // "DIV"
        console.log(foo); // undefined
    }

    render() {
        return (
            <div onClick={this.handleClick.bind(this, '33', 22)}>
                div
            </div>
        );
    }
    ```