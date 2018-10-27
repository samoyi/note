# List

## 基本用法
* 和 Vue 的双向绑定原理一样。看起来虽然没有 Vue 的`v-model`写法简单，因为需要自己绑定
表单`value`并监听输入事件。不过就是可以更自由的处理用户输入，Vue 想要处理用户输入的话也
需要通过计算属性的函数来处理。

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
