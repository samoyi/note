# Components


<!-- TOC -->

- [Components](#components)
    - [组件定义](#组件定义)
        - [函数组件与 class 组件](#函数组件与-class-组件)
        - [开发模式下函数式组件更新时函数调用两次 TODO](#开发模式下函数式组件更新时函数调用两次-todo)
        - [组件一般都必须有一个包裹元素](#组件一般都必须有一个包裹元素)
    - [组件渲染过程](#组件渲染过程)
    - [返回值](#返回值)
    - [References](#references)

<!-- /TOC -->


## 组件定义
组件从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

### 函数组件与 class 组件
1. 定义组件最简单的方式就是编写 JavaScript 函数：
    ```js
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
    }
    ```
2. 该函数是一个有效的 React 组件，因为它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为 “函数组件”，因为它本质上就是 JavaScript 函数。（该函数内部的 `this` 为 `undefined`，因为经过 Babel 编译后会加上严格模式，且该函数会以普通形式调用）
3. 你同时还可以使用 ES6 的 class 来定义组件：
    ```js
    class Welcome extends React.Component {
        render() {
            return <h1>Hello, {this.props.name}</h1>;
        }
    }
    ```
4. 上述两个组件在 React 里是等效的。
5. 甚至可以使用对象属性点表示法来表示组件并将其作为标签名
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
6. 在这种情况下，首字母小写也没有问题
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

### 开发模式下函数式组件更新时函数调用两次 TODO
* https://www.zhihu.com/question/387196401
* https://github.com/facebook/react/issues/17786

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


## 组件渲染过程
1. 例如，这段代码会在页面上渲染 “Hello, Sara”：
    ```js
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
    }

    const element = <Welcome name="Sara" />;
    ReactDOM.render(
        element,
        document.getElementById('root')
    );
    ```
2. 我们调用 `ReactDOM.render()` 函数，并传入 `<Welcome name="Sara" />` 作为参数。
3. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}` 作为 props 传入。
4. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
5. React DOM 将 DOM 高效地更新为 `<h1>Hello, Sara</h1>`。


## 返回值
函数式组件（或者是类组件的 `render()` 方法）可以返回以下类型的值：
* **React elements**. Typically created via JSX. For example, `<div />` and `<MyComponent />` are React elements that instruct React to render a DOM node, or another user-defined component, respectively.
* **Arrays and fragments**. Let you return multiple elements from render.
* **String and numbers**. These are rendered as text nodes in the DOM.
* **Portals**. Let you render children into a different DOM subtree.
* **`Booleans` or `null` or `undefined`**. Render nothing. (Mostly exists to support `return test && <Child />` pattern, where `test` is boolean).


## References
* [React.Component](https://legacy.reactjs.org/docs/react-component.html)