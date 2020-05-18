# Forms


<!-- TOC -->

- [Forms](#forms)
    - [受控组件](#受控组件)
        - [`<textarea>`](#textarea)
        - [`<select>`](#select)
    - [非受控组件](#非受控组件)
        - [表单默认值](#表单默认值)
        - [文件输入标签](#文件输入标签)

<!-- /TOC -->


## 受控组件
1. 在HTML当中，像 `<input>`、`<textarea>` 和 `<select>` 这类表单元素会维持自身状态，并根据用户输入进行更新。
2. 但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 `setState()` 方法进行更新。
3. 所谓受控组件，就是让表单组件不维护自己的 `value`，也不会根据用户输入更新自己的 `value`。而是由 React 来通过事件来获取用户输入，并保存在一个状态属性中，并用该属性来设置表单 `value`。其实就是和 Vue 的双向绑定原理一样。

### `<textarea>`
在 HTML 中, `<textarea>` 元素通过其子元素定义其文本。而在 React 中，`<textarea>` 使用 `value` 属性代替。这样，可以使得使用 `<textarea>` 的表单和使用单行 `<input>` 的表单非常类似。

### `<select>`
1. 不适用 `<option>` 的 `selected` 属性，而是在 `<select>` 上用一个 `value` 属性指示当前选中的值。
2. 但问题是为什么 `<select>` 的 `value` 属性可以设定表单的初始选项？下面的例子中，`this.state.value` 的初始值的 `'coconut'`，所以表单初始显示的项就是 `coconut`。看了一下渲染出来的 HTML，`<option value="coconut">Coconut</option>` 里面也没有被加上
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
3. 你可以将数组传递到 `value` 属性中，以支持在 `<select>` 标签中选择多个选项：
    ```html
    <select multiple={true} value={['B', 'C']}>
    ```


## 非受控组件
1. 在大多数情况下，我们推荐使用受控组件来实现表单。在受控组件中，表单数据由 React 组件处理。
2. 如果让表单数据由 DOM 处理时，替代方案为使用非受控组件，可以使用 `ref` 从 `DOM` 获取表单值。
    ```js
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.input = React.createRef();
        }

        handleSubmit(event) {
            alert('A name was submitted: ' + this.input.current.value);
            event.preventDefault();
        }

        render() {
            return (
            <form onSubmit={this.handleSubmit}>
                <label>
                Name:
                <input type="text" ref={this.input} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            );
        }
    }
    ```
3. 在这个例子中，通过使用回调 ref，让 `this.input` 引用到文本框元素。这样就能在方法里获得文本框的 `value` 了。
4. 由于非受控组件将真实数据保存在 DOM 中，因此在使用非受控组件时，更容易同时集成 React 和非 React 代码。
5. 如果你想快速而随性，这样做可以减小代码量。否则，你应该使用受控组件。[一篇关于两种表单使用场景的文章](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)

### 表单默认值
1. 在 React 渲染生命周期时，受控表单元素上的 `value` 将会覆盖 DOM 节点中的值。在非受控组件中，你经常希望 React 能赋予组件一个初始值，但是不去控制后续的更新。 在这种情况下, 你可以指定一个 `defaultValue` 属性。
    ```html
     <input
          defaultValue="Bob"
          type="text"
          ref={this.input}
    />
    ```
2. 同样，`<input type="checkbox">` 和 `<input type="radio">` 支持 `defaultChecked`，`<select>` 和 `<textarea>`支持 `defaultValue`。

### 文件输入标签
1. `<input type="file" />` 始终是一个不受控制的组件，因为它的值只能由用户设置，而不是以编程方式设置。
2. 以下示例显示如何创建一个节点的 ref 以访问提交处理程序中的文件：
    ```js
    class FileInput extends React.Component {
        constructor(props) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.fileInput = React.createRef();
        }
        handleSubmit(event) {
            event.preventDefault();
            alert(
            `Selected file - ${this.fileInput.current.files[0].name}`
            );
        }

        render() {
            return (
            <form onSubmit={this.handleSubmit}>
                <label>
                Upload file:
                <input type="file" ref={this.fileInput} />
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