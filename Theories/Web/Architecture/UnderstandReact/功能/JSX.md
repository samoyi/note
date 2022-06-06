# JSX


<!-- TOC -->

- [JSX](#jsx)
    - [设计](#设计)
    - [语法](#语法)
        - [表达式语法](#表达式语法)
        - [JSX 添加属性](#jsx-添加属性)
        - [用户定义的组件必须以大写字母开头](#用户定义的组件必须以大写字母开头)
        - [在 JSX 类型中使用点语法](#在-jsx-类型中使用点语法)
        - [在运行时选择类型](#在运行时选择类型)
        - [其他一些语法规则](#其他一些语法规则)
    - [Props](#props)
        - [JavaScript 表达式作为 Props](#javascript-表达式作为-props)
        - [字符串字面量](#字符串字面量)
        - [Props 默认值为 “True”](#props-默认值为-true)
        - [属性展开](#属性展开)
    - [Children in JSX](#children-in-jsx)
        - [String Literals](#string-literals)
        - [JSX Children](#jsx-children)
        - [JavaScript Expressions as Children](#javascript-expressions-as-children)
    - [JSX 表示对象](#jsx-表示对象)
    - [JSX 防注入攻击](#jsx-防注入攻击)
    - [比较 Vue](#比较-vue)
    - [References](#references)

<!-- /TOC -->


## 设计
1. 组件应该是独立且完整的，所以组件就应该包含模板和逻辑。Vue 也是这么做的。


## 语法
### 表达式语法
1. 可以近似的把 JSX 理解为模板字符串，只是它没有外面的反引号。
2. 因此与模板字符串类似，JSX 中使用 JS 表达式需要放在大括号里。
3. JSX 中只能使用 JS 表达式，而不能使用语句
    ```js
    <ul>
        {
            // for (let i=0; i<3; i++) {} // 报错，这是循环语句
            // [1, 2, 3].map((n) => <li>{n*n}</li>); // 报错，带了分号，变成了语句
            [1, 2, 3].map((n) => <li>{n*n}</li>) // 正确
        }
    </ul>
    ```
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
5. 因为 JSX 其实也是和模板字符串一样的 JS 表达式，所以就可以把它当做普通的 JS 表达式来任意使用
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
1. 像添加节点特性一样添加 JSX 属性。
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

### 用户定义的组件必须以大写字母开头
以小写字母开头的元素代表一个 HTML 内置组件，比如 `<div>` 或者 `<span>` 会生成相应的字符串 `'div'` 或者 `'span'` 传递给 `React.createElement`。大写字母开头的元素则对应着在 JavaScript 引入或自定义的组件，例如 `<Foo />` 会编译为 `React.createElement(Foo)`。

### 在 JSX 类型中使用点语法
在 JSX 中，你也可以使用点语法来引用一个 React 组件。当你在一个模块中导出许多 React 组件时，这会非常方便。例如
```js
const MyComponents = {
    Foo () {
        return <div>This is Foo</div>
    },
    Bar () {
        return <div>This is Bar</div>
    },
}

function App() {
    return (
        <div className="App">
            <MyComponents.Foo />
            <MyComponents.Bar />
        </div>
    );
}
```

### 在运行时选择类型
1. 你不能将通用表达式作为 React 元素类型,如果你想通过通用表达式来动态决定元素类型，你需要首先将它赋值给大写字母开头的变量。
2. 这通常用于根据 prop 来渲染不同组件的情况下
    ```js
    function PhotoStory () {
        return <div>PhotoStory</div>
    }   
    function VideoStory () {
        return <div>VideoStory</div>
    }

    const components = {
    photo: PhotoStory,
    video: VideoStory
    };

    function Story(props) {
    const SpecificStory = components[props.storyType];
    return <SpecificStory />;
    }

    function App() {
        return (
            <div className="App">
                <Story storyType="photo"/>
                <Story storyType="video"/>
            </div>
        );
    }
    ```

### 其他一些语法规则
* 内联样式要用对象
    ```js
    <div style={{color: "white", fontSize: "18px"}}></div>
    ```
    这里的两个样式是放在 JS 对象中；又因为 JS 表达式要放在大括号中，所以是两层括号。
* 标签名要小写。首字母大写的话是组件。


## Props
有多种方式可以在 JSX 中指定 props。

### JavaScript 表达式作为 Props
1. 你可以把包裹在 `{}` 中的 JavaScript **表达式（expression）** 作为一个 prop 传递给 JSX 元素。例如，如下的 JSX
    ```js
    <MyComponent foo={1 + 2 + 3 + 4} />
    ```
2. 区别
    * Expression: Something which evaluates to a value. Example: `1+2/x`
    * Statement: A line of code which does something. Example: `GOTO 100`

### 字符串字面量
1. 你可以将字符串字面量赋值给 prop。如下两个 JSX 表达式是等价的：
    ```js
    <MyComponent message="hello world" />

    <MyComponent message={'hello world'} />
    ```
2. When you pass a string literal, its value is HTML-unescaped. So these two JSX expressions are equivalent:
    ```js
    <MyComponent message="&lt;3" />

    <MyComponent message={'<3'} />
    ```

### Props 默认值为 “True”
如果你没给 prop 赋值，它的默认值是 `true`。以下两个 JSX 表达式是等价的：
```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

### 属性展开
1. 如果你已经有了一个 props 对象，你可以使用展开运算符来在 JSX 中传递整个 props 对象。以下两个组件是等价的
    ```js
    function App1() {
        return <Greeting firstName="Ben" lastName="Hector" />;
    }

    function App2() {
        const props = {firstName: 'Ben', lastName: 'Hector'};
        return <Greeting {...props} />;
    }
    ```
2. 你还可以选择只保留当前组件需要接收的 props，并使用展开运算符将其他 props 传递下去
    ```js
    const Button = props => {
        const { kind, ...other } = props;
        const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
        return <button className={className} {...other} />;
    };

    const App = () => {
        return (
            <div>
                <Button kind="primary" onClick={() => console.log("clicked!")}>
                    Hello World!
                </Button>
            </div>
        );
    };
    ```
3. 属性展开在某些情况下很有用，但是也很容易将不必要的 props 传递给不相关的组件，或者将无效的 HTML 属性传递给 DOM。我们建议谨慎的使用该语法。


## Children in JSX
In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children.

### String Literals
1. You can put a string between the opening and closing tags and `props.children` will just be that string
    ```js
    <MyComponent>Hello world!</MyComponent>
    ```
    This is valid JSX, and `props.children` in `MyComponent` will simply be the string `"Hello world!"`. 
2. HTML is unescaped, so you can generally write JSX just like you would write HTML in this way
    ```js
    <div>This is valid HTML &amp; JSX at the same time.</div>
    ```
3. JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space. So these all render to the same thing
    ```js
    <div>Hello World</div>

    <div>
        Hello World
    </div>

    <div>
        Hello
        World
    </div>

    <div>

        Hello World
    </div>
    ```

### JSX Children
1. You can provide more JSX elements as the children
    ```js
    <MyContainer>
        <MyFirstComponent />
        <MySecondComponent />
    </MyContainer>
    ```
2. A React component can also return an array of elements. 但是如果在 TS 中这样使用则无法通过检查
    ```js
    function Foo () {
        // No need to wrap list items in an extra element!
        return [
            // Don't forget the keys :)
            <li key="A">First item</li>,
            <li key="B">Second item</li>,
            <li key="C">Third item</li>,
        ];
    }

    function App() {
        return (
            <div className="App">
                <Foo />
            </div>	
        );
    }
    ```

### JavaScript Expressions as Children
1. You can pass any JavaScript expression as children, by enclosing it within `{}`. For example, these expressions are equivalent:
    ```js
    <MyComponent>foo</MyComponent>

    <MyComponent>{'foo'}</MyComponent>
    ```
2. This is often useful for rendering a list of JSX expressions of arbitrary length. For example, this renders an HTML list
    ```js
    function Item(props) {
        return <li>{props.message}</li>;
    }

    function TodoList() {
        const todos = ['finish doc', 'submit pr', 'nag dan to review'];
        return (
            <ul>
                {todos.map((message) => <Item key={message} message={message} />)}
            </ul>
        );
    }

    function App() {
        return (
            <div className="App">
                <TodoList />
            </div>
        );
    }
    ```
3. JavaScript expressions can be mixed with other types of children. This is often useful in lieu of string templates:
    ```js
    function Hello(props) {
        return <div>Hello {props.addressee}!</div>;
    }
    ```


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
4. JSX 只是为渲染函数 `React.createElement(component, props, ...children)` 方法提供的语法糖。和 Vue 的情况一样，Vue 的 `template` 也只是渲染函数的语法糖。
5. 由于 JSX 会编译为 `React.createElement` 调用形式，所以 React 库也必须包含在 JSX 代码作用域内。不懂，至少在 `create-react-app` 创建的项目中，在一个文件中不引入 `react` 也可以定义组件。


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


## References
* [Expression Versus Statement](https://stackoverflow.com/a/19224/10404867)