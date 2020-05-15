# JSX


<!-- TOC -->

- [JSX](#jsx)
    - [设计](#设计)
    - [语法](#语法)
        - [表达式语法](#表达式语法)
        - [JSX 添加属性](#jsx-添加属性)
    - [JSX 表示对象](#jsx-表示对象)
    - [JSX 防注入攻击](#jsx-防注入攻击)
    - [比较 Vue](#比较-vue)

<!-- /TOC -->


## 设计
1. 组件应该是独立且完整的，所以组件就应该包含模板和逻辑。Vue 也是这么做的。


## 语法
### 表达式语法
1. 可以近似的把 JSX 理解为模板字符串，只是它没有外面的反引号。
2. 因此与模板字符串类似，JSX 中使用 JS 表达式需要放在大括号里。
3. 书写 JSX 一般都会像 HTML 那样换行，而又因为 JSX 实际上是在 JS 代码中的，所以虽然不总是，但某些情况下也有可能会被解析器解析为单独的行，从而引发错误。
4. 因此在多行 JSX 的情况下，应该把整个 JSX 代码放在小括号内
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
6. 如果 JSX 标签是闭合式的，那么你需要在结尾处用 `/>`
    ```js
    const element = <img src={user.avatarUrl} />;
    ```
7. JSX 标签可以相互嵌套
    ```js
    const element = (
        <div>
            <h1>Hello!</h1>
            <h2>Good to see you here.</h2>
        </div>
    );
    ```

### JSX 添加属性
1. 像添加节点特性一样添加 JSX 属性
2. 通过使用引号，来将属性值指定为字符串字面量：
    ```js
    // 这里的属性是字符串 "0" 而不是数字 0
    const element = <div tabIndex="0"></div>;
    ```
3. 使用大括号，来在属性值中插入一个 JavaScript 表达式：
    ```js
    const element1 = <img src={user.avatarUrl}></img>;
    const element2 = <div tabIndex={0}></div>;
    ```
4. 因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase 来定义属性的名称，而不是使用 HTML 的属性名称。例如，`class` 变成了 `className`，而 `tabindex` 则变为 `tabIndex`。


## JSX 表示对象
1. Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。以下两种示例代码完全等效：
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
2. `React.createElement()` 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：
    ```js
    // 注意：这是简化过的结构
    const element = {
        type: 'h1',
        props: {
            className: 'greeting',
            children: 'Hello, world!'
        }
    };
    ```
3. 这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。
4. 看起来，JSX 只是为渲染函数 `React.createElement(component, props, ...children)` 方法提供的语法糖。和 Vue 的情况一样，Vue 的 `template` 也只是渲染函数的语法糖。


## JSX 防注入攻击
1. 你可以放心地在 JSX 当中使用用户输入。React DOM 在渲染之前默认会过滤所有传入的值。它可以确保你的应用不会被注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS(跨站脚本) 攻击。
2. 不知道这种插入用户输入是否和 Vue 的 `v-hmtl` 是同一个级别，如果是的话，Vue 的 `v-html` 为什么不会过滤？下面的 Vue 例子会导致弹窗
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
    而下面的 React 例子只会在页面上渲染出 `title` 中保存的字符串
    ```js
    const title = '<img src="https://www.xxx.com" onerror="alert()" />';
    const element = <h1>{title}</h1>;

    ReactDOM.render(
        element,
        document.getElementById('root')
    );
    ```


## 比较 Vue
1. React 和 Vue 都支持渲染函数。Vue 通过 `template` 实现模板语法，React 通过 JSX 实现模
板语法。（虽然 Vue 也支持 JSX）
2. 不过和 Vue 的 “模板-指令” 的设计相比，有什么异同？