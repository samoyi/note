# JSX

## 目的
组件应该是独立且完整的，所以组件就应该包含模板和逻辑。


## Misc
* 本质上来讲，JSX 只是为`React.createElement(component, props, ...children)`方法提
供的语法糖。Vue 的情况也是一样，`template`也只是渲染函数的语法糖。


## 基本语法
1. 可以近似的把 JSX 理解为模板字符串，只是它没有外面的反引号。
2. 因此与模板字符串类似，JSX 中使用 JS 表达式需要放在大括号。
3. 对于普通字符串，换行会造成错误，因为解析器无法识别两行是一个字符串。
    ```js
    console.log('22
            33');
    ```
    这种情况就需要模板字符串的反引号来包裹整个字符串。  
4. 书写 JSX 一般都会像 HTML 那样换行，而又因为 JSX 实际上是在 JS 代码中的，所以虽然不总是，但某些情况下也有可能会被解析器解析为单独的行，从而引发错误。因此在多行 JSX 的情况下，应该把整个 JSX 代码放在小括号内，就像模板字符串的反引号一样。
    ```js
    function formatName(user) {
        return user.firstName + ' ' + user.lastName;
    }

    const user = {
        firstName: 'Harper',
        lastName: 'Perez'
    };

    const element = (
        <h1>
        Hello, {formatName(user)}!
        </h1>
    );
    ```
5. 因为 JSX 其实也是和模板字符串一样的 JS 表达式，所以就可以把它当做普通的 JS 表达式来任意使用。
    ```js
    function getGreeting(user) {
        if (user) {
            return <h1>Hello, {formatName(user)}!</h1>;
        }
        return <h1>Hello, Stranger.</h1>;
    }
    ```
6. 像添加节点特性一样添加 JSX 属性
    * 以引号来定义字符串属性值
        ```js
        // 这里的属性是字符串"0"而不是数字 0
        // 相当于 vue 中的 "'0'"
        const element = <div tabIndex="0"></div>;
        ```
    * 以大括号来定义表达式属性值
        ```js
        // 相当于 vue 中的 "user.avatarUrl"
        const element1 = <img src={user.avatarUrl}></img>;
        // 相当于 vue 中的 "0"
        const element2 = <div tabIndex={0}></div>;
        ```
    * 因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase小驼峰命名来定义属性的名称，而不是使用 HTML 的属性名称。例如，`class`变成了`className`，而`tabindex`则对应着`tabIndex`。
7. 如果 JSX 标签是闭合式的，那么你需要在结尾处用 `/>`
    ```js
    const element = <img src={user.avatarUrl} />;
    ```
8. JSX 标签可以相互嵌套
    ```js
    const element = (
        <div>
            <h1>Hello!</h1>
            <h2>Good to see you here.</h2>
        </div>
    );
    ```


## 虚拟节点
1. 就如同 Vue 的`template`会被编译为使用渲染函数创建虚拟节点一样，Babel 转译器会把 JSX转换成一个名为`React.createElement()`的方法调用，并返回一个虚拟节点。
2. 下面两种代码的作用是完全相同的：
    ```js
    const element = (
        <h1 className="greeting">
        Hello, world!
        </h1>
    );
    ```
    ```js
    const element = React.createElement(
        'h1',
        {className: 'greeting'},
        'Hello, world!'
    );
    ```
3. `React.createElement()` 这个方法首先会进行一些避免 bug 的检查，之后会返回一个类似下面例子的对象：
    ```js
    // 注意: 以下示例是简化过的（不代表在 React 源码中是这样）
    const element = {
        type: 'h1',
        props: {
            className: 'greeting',
            children: 'Hello, world'
        }
    };
    ```
    应该就是虚拟节点了。


## JSX 防注入攻击
1. 你可以放心地在 JSX 当中使用用户输入。React DOM 在渲染之前默认会过滤所有传入的值。它可以确保你的应用不会被注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS(跨站脚本) 攻击。
2. 不知道这种插入用户输入是否和 Vue 的`v-hmtl`是同一个级别，如果是的话，Vue 的`v-html`为什么不会过滤？下面的 Vue 例子会导致弹窗
    ```html
    <div id="app" v-html="input"></div>
    <script>
    "use strict";
    new Vue({
        data: {
            input: '<img src="https://www.xxx.com" onerror="alert()" />',
        },
    }).$mount('#app');
    </script>
    ```
    而下面的 React 例子只会在页面上渲染出`title`中保存的字符串
    ```js
    const title = '<img src="https://www.xxx.com" onerror="alert()" />';
    const element = <h1>{title}</h1>;

    ReactDOM.render(
        element,
        document.getElementById('root')
    );
    ```


## 比较 Vue
* React 和 Vue 都支持渲染函数。Vue 通过`template`实现模板语法，React 通过 JSX 实现模
板语法。（虽然 Vue 也支持 JSX）
