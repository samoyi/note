# Forms

## 受控组件
1. 在HTML当中，像`<input>`、`<textarea>`和`<select>`这类表单元素会维持自身状态，并根
据用户输入进行更新。但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用
`setState()`方法进行更新。
2. 所谓受控组件，就是让表单组件不维护自己的`value`，也不会根据用户输入更新自己的`value`
。而是有 React 来通过事件来获取用户输入，并保存在一个状态属性中，并用该属性来设置表单
`value`。其实就是和 Vue 的双向绑定原理一样。
3. 看起来虽然没有 Vue 的`v-model`写法简单，因为需要自己绑定表单`value`并监听输入事件。
不过就是可以更自由的处理用户输入，Vue 想要处理用户输入的话也需要通过计算属性的函数来处理
。

### text / textarea
用`this.state.value`绑定的表单的`value`；监听表单输入，用新的表单值设置
`this.state.value`
```js
class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

ReactDOM.render(
    <NameForm />,
    document.getElementById('root')
);
```

### select
1. 直接弃用`option`的`selected`属性，而是在`<select>`上用一个`value`属性指示当前选中
的值。
2. `this.state.value`保存选中值，绑定到`<select>`的`value`属性上。监听`<select>`的
`change`事件，使用用户选中的值更新`this.state.value`。
3. 但问题是为什么`<select>`的`value`属性可以设定表单的初始选项？下面的例子中，
`this.state.value`的初始值的`'coconut'`，所以表单初始显示的项就是`coconut`。看了一下
渲染出来的 HTML，`<option value="coconut">Coconut</option>`里面也没有被加上
`selected`，怎么就默认会选中这一项呢？不懂。

```js
class FlavorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 'coconut'};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Pick your favorite La Croix flavor:
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="grapefruit">Grapefruit</option>
                        <option value="lime">Lime</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
                    </select>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

ReactDOM.render(
    <FlavorForm />,
    document.getElementById('root')
);
```


## 非受控组件
1. 在大多数情况下，我们推荐使用受控组件来实现表单。在受控组件中，表单数
据由 React 组件处理。
2. 如果让表单数据由 DOM 处理时，替代方案为使用非受控组件，可以使用`ref`
从`DOM`获取表单值。
    ```js
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
            alert('A name was submitted: ' + this.input.value);
            event.preventDefault();
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text"
                            ref={(input) => this.input = input} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }

    ReactDOM.render(
        <NameForm />,
        document.getElementById('root')
    );
    ```
    在这个例子中，通过使用回调 ref，让`this.input`引用到文本框元素。这
    样就能在方法里获得文本框的`value`了。
3. 由于非受控组件将真实数据保存在 DOM 中，因此在使用非受控组件时，更容易
同时集成 React 和非 React 代码。如果你想快速而随性，这样做可以减小代码
量。否则，你应该使用受控组件。[一篇关于两种表单使用场景的文章](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)

### 表单默认值
1. 在 React 的生命周期中，受控表单元素上的`value`属性将会覆盖 DOM 中的值。使用非受控组
件时，你可能 React 可以为其指定初始值，但不再控制后续更新。要解决这个问题，你可以指定一
个`defaultValue`属性而不是`value`。在上面的例子的文本框元素上加上这个属性即可
    ```html
    <input type="text"
            defaultValue="Bob"
            ref={(input) => this.input = input}
    />
    ```
2. 同样，`<input type="checkbox">`和`<input type="radio">`支持`defaultChecked`，
`<select>`和`<textarea>`支持`defaultValue`。

### 文件输入标签
`<input type="file" />`始终是一个不受控制的组件，因为它的值只能由用户设置，而不是以编
程方式设置。以下示例显示如何创建 ref 节点以访问提交处理程序中的文件：
```js
class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        alert(
            `Selected file - ${this.fileInput.files[0].name}`
        );
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Upload file:
                    <input type="file" ref={input => {this.fileInput = input}}    
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }
}

ReactDOM.render(
    <FileInput />,
    document.getElementById('root')
);
```
