# Props

## Props are Read-Only
All React components must act like pure functions with respect to their props.


## 指定属性
### 使用 JavaScript 表达式指定属性
1. 可以传递任何`{}`包裹的 JavaScript 表达式作为一个属性值
    ```js
    <MyComponent foo={1 + 2 + 3 + 4} />
    ```
2. `if`语句和`for`循环在 JavaScript 中不是表达式，因此它们不能直接在 JSX 中使用，但是
你可以将它们放在周围的代码中
    ```js
    function NumberDescriber(props) {
        let description;
        if (props.number % 2 == 0) {
            description = <strong>even</strong>;
        }
        else {
            description = <i>odd</i>;
        }
        return <div>{props.number} is an {description} number</div>;
    }
    ```

### 使用字符串常量指定属性
1. 你可以将字符串常量作为属性值传递。下面这两个 JSX 表达式是等价的：
    ```html
    <MyComponent message="hello world" />

    <MyComponent message={'hello world'} />
    ```
2. 当传递一个字符串常量时，该值会被解析为 HTML 非转义字符串，所以下面两个 JSX 表达式是
相同的：
    ```html
    <MyComponent message="&lt;3" />

    <MyComponent message={'<3'} />
    ```

### 属性默认为`true`
1. 如果你没有给属性传值，它默认为`true`。因此下面两个 JSX 是等价的：
    ```html
    <MyTextBox autocomplete />

    <MyTextBox autocomplete={true} />
    ```
2. 一般情况下，我们不建议这样使用，因为它会与 ES6 对象简洁表示法 混淆。比如`{foo} `是
`{foo: foo}`的简写，而不是`{foo: true}`。这里能这样用，是因为它符合 HTML 的做法。

### 扩展属性
1. 如果你已经有了个`props`对象，并且想在 JSX 中传递它，你可以使用`...`作为扩展操作符来
传递整个属性对象。下面两个组件是等效的：
    ```js
    function App1() {
        return <Greeting firstName="Ben" lastName="Hector" />;
    }

    function App2() {
        const props = {firstName: 'Ben', lastName: 'Hector'};
        return <Greeting {...props} />;
    }
    ```
2. 当你构建通用容器时，扩展属性会非常有用。然而，这样做也可能让很多不相关的属性，传递到
不需要它们的组件中使代码变得混乱。我们建议你谨慎使用此语法。


## 在构造函数中传入 props
```js
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
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

ReactDOM.render(
    <Clock />,
    document.getElementById('root')
);
```

1. 文档中说类组件应该始终使用`props`调用基础构造函数。应该也使用要有`super(props)`，原
因后面有。
2. 但其实不传参`props`给`constructor()`也可以，但在构造函数中就没办法访问了`props`。
当然也不一定要访问。

### `super(props)`
1. 那还有`super(props)`是干什么用的呢？`constructor(props)`保证了在构造函数中可以通
过`props`引用到传入的属性，而`super(props)`保证了在构造函数中可以通过`this.props`引用
到传入的属性。
2. 为什么`super(props)`之后，就能在构造函数里通过`this.props`访问传入的属性了呢？
看看下面在普通的 JS 类中的情况
    ```js
    class Foo {
        constructor(props){}
    }

    class Bar extends Foo {
        constructor(props){
            super(props);
            console.log(props.age); // 22
            console.log(this.props); // undefined
        }
    }

    let bar = new Bar({age: 22});
    ```
    加上一行代码，`this.props`就可以引用到传入的对象了
    ```js
    class Foo {
        constructor(props){
            this.props = props;
        }
    }

    class Bar extends Foo {
        constructor(props){
            super(props);
            console.log(props.age); // 22
            console.log(this.props); // {age: 22}
        }
    }

    let bar = new Bar({age: 22});
    ```
3. `super(props)`使用自己的`this`调用父类构造函数，所以自己的`this`上的`props`属性就
引用了传入的对象。  
4. 但我们在上面编写的 React 代码里，并没有`this.props = props`。但是注意，任何组件类
都是继承自`React.Component`的。所以，虽然没有看源码，但是猜想在`React.Component`中可
能就执行了`this.props = props`。

### 为什么组件的构造函数以及内部的`super()`都要传参`props`
```js
class Foo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1>Foo</h1>
        );
    }
}

class Bar extends Foo {
    constructor(props) {
        super(props);
        console.log(props.age); // 22
        console.log(this.props.age); // 22
    }
}

ReactDOM.render(
    <Bar age={22} />,
    document.getElementById('root')
);
```

1. 上面先通过`React.Component`创建了`Foo`组件，然后又通过`Foo`的子类创建了`Bar`组件。
2. 为了`Bar`中的`this.props`可以应用到传入的属性，所以`Bar`的构造函数里就必须调用
`super(props)`；而为了调用`super(props)`，父类的构造函数就必须有形参来接收`props`参数
。
3. 但是注意，父类构造函数在接收到子类的 prop 之后，虽然没有设置`this.props = props`，
但子类仍然可以通过`this.props`访问到传入的属性。
4. 这是因为父类构造函数也调用了`super(props)`，这个会调用`React.Component`的构造函数，
在其内部应该会设置`this.props = props`。所以`Foo`的`this.props`旧引用到了传入的属性，
进而`Bar`的`this.props`就引用到了传入的属性。
5. 即使`Foo`的构造函数中`super()`不传参，只要手动设置`Foo`的`this.props`，`Bar`的
`this.props`也可以引用到了传入的属性。
    ```js
    class Foo extends React.Component {
        constructor(props) {
            super();
            this.props = props;
        }

        render() {
            return (
                <h1>Foo</h1>
            );
        }
    }
    ```
