# Components

## Misc
* Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.


## 组件定义
* 可以通过函数或类来定义组件
* 甚至可以使用对象属性点表示法来表示组件并将其作为标签名
    ```js
    const MyComponents = {
        DatePicker(props) {
            return <div>Imagine a {props.color} datepicker here.</div>;
        }
    }

    function BlueDatePicker() {
        return <MyComponents.DatePicker color="blue" />;
    }
    // 但不能使用中括号语法
    // function BlueDatePicker() {
    //     return <MyComponents['DatePicker'] color="blue" />;
    // }

    ReactDOM.render(
        <BlueDatePicker />,
        document.getElementById('root')
    );
    ```
    在这种情况下，首字母小写也没有问题
    ```js
    const myComponents = {
        datePicker(props) {
            return <div>Imagine a {props.color} datepicker here.</div>;
        }
    }

    function BlueDatePicker() {
        return <myComponents.datePicker color="blue" />;
    }
    ```

### 首字母大写    
1. 当元素类型以小写字母开头时，它表示一个内置的组件，如`<div>`或`<span>`，并将字符串
`'div'`或`'span'`传递给`React.createElement`。
2. 以大写字母开头的类型，如`<Foo />`，将被编译为`React.createElement(Foo)`，对应于你
在 JavaScript 文件中定义或导入的组件。
3. 建议用大写开头命名组件。如果你的组件以小写字母开头，请在 JSX 中使用之前其赋值给大写开
头的变量。
    ```js
    function hello(props) {
        return <div>Hello {props.toWhat}</div>;
    }

    let UpperCaseHello = hello;

    function HelloWorld() {
        return <UpperCaseHello toWhat="World" />;
    }
    ```


### 函数定义
定义一个组件最简单的方式是使用 JavaScript 函数
```js
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}
```
该函数是一个有效的 React 组件，它接收一个单一的“props”对象并返回了一个 React 元素。

### 类定义
```js
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

### 组件一般都必须有一个包裹元素
1. 和 Vue 中的情况一样，这样是不行的
    ```js
    function Welcome(props) {
        return (
                    <p key="1">Hello, {props.name}</p>
                    <p key="2">Hello, {props.name}</p>
                );
    }
    ```
2. 但组件可以返回一个数组，这时不需要有包裹元素
    ```js
    function Welcome(props) {
        return [
                    <p key="1">Hello, {props.name}</p>,
                    <p key="2">Hello, {props.name}</p>
                ];
    }

    ReactDOM.render(
        <Welcome name="33"/>,
        document.getElementById('root')
    );
    ```


## 组合组件
1. 组件可以在它的输出中引用其它组件，这就可以让我们用同一组件来抽象出任意层次的细节。
2. 组件的返回值只能有一个根元素。

```js
function Welcome(props) {
    return <h2>Hello, {props.name}</h2>;
}

function App() {
    return (
        <section>
            <h1>Welcome</h1>
            <div>
                <Welcome name="Sara" />
                <Welcome name="Cahal" />
                <Welcome name="Edite" />
            </div>
        </section>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
```
