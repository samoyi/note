# Components

## Misc
* 组件可以将 UI 切分成一些独立的、可复用的部件，这样你就只需专注于构建每一个单独的部件。
* 组件从概念上看就像是函数，它可以接收任意的输入值（称之为“props”），并返回一个需要在页
面上展示的 React 元素。


## 组件定义
* 可以通过函数或类来定义组件
* 组件名的首字母必须是大写，因为渲染组件时组件标签名首字母必须是大写

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
