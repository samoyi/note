# Forms


<!-- TOC -->

- [Forms](#forms)
    - [受控组件](#受控组件)
        - [`<textarea>`](#textarea)
        - [`<select>`](#select)
        - [处理多个输入](#处理多个输入)
        - [受控输入空值](#受控输入空值)
    - [非受控组件](#非受控组件)
        - [文件 input 标签](#文件-input-标签)
        - [表单默认值](#表单默认值)
        - [文件输入标签](#文件输入标签)
    - [References](#references)

<!-- /TOC -->


## 受控组件
1. 在HTML当中，像 `<input>`、`<textarea>` 和 `<select>` 这类表单元素会维持自身状态，并根据用户输入进行更新。
2. 但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 `setState()` 方法进行更新。
3. 所谓受控组件，就是让表单组件不维护自己的 `value`，也不会根据用户输入更新自己的 `value`。而是由 React 来通过事件来获取用户输入，并保存在 `state` 的属性中，并用该属性来设置表单 `value`。其实就是和 Vue 的双向绑定原理一样。
4. 这样就使得 `state` 成为了组件的唯一数据源
    ```js
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: "" };
            this.handleChange = this.handleChange.bind(this);
        }

        handleChange(event) {
            this.setState({ value: event.target.value });
        }

        render() {
            return (
                <form>
                    <label>
                        名字:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value={`提交值：${this.state.value}`} />
                </form>
            );
        }
    }
    ```

### `<textarea>`
1. 在 HTML 中, `<textarea>` 元素通过其子元素定义其文本。而在 React 中，`<textarea>` 使用 `value` 属性代替。这样，可以使得使用 `<textarea>` 的表单和使用单行 `<input>` 的表单非常类似。
2. 上面的例子只需要修改下面的部分
    ```html
    <textarea type="text" value={this.state.value} onChange={this.handleChange} />
    ```

### `<select>`
1. 不使用 `<option>` 的 `selected` 属性，而是在 `<select>` 上用一个 `value` 属性指示当前选中的值
    ```js
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: "coconut" }; // 设置个初始值
            this.handleChange = this.handleChange.bind(this);
        }

        handleChange(event) {
            this.setState({ value: event.target.value });
            let n = document.querySelector("select");
                debugger;
        }

        render() {
            return (
                <form>
                    <label>
                    选择你喜欢的风味:
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="grapefruit">葡萄柚</option>
                        <option value="lime">酸橙</option>
                        <option value="coconut">椰子</option>
                        <option value="mango">芒果</option>
                    </select>
                    </label>
                    <input type="submit" value={`提交值：${this.state.value}`} />
                </form>
            );
        }
    }
    ```
2. 你可以将数组传递到 `value` 属性中，以支持在 `<select>` 标签中选择多个选项：
    ```html
    <select multiple={true} value={["grapefruit", "lime"]}>
    ```

### 处理多个输入
当需要处理多个 input 元素时，我们可以给每个元素添加 `name` 属性，使用同一个处理函数，根据 `event.target.name` 的值选择要执行的操作
```js
class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGoing: true,
            numberOfGuests: 2,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <form>
                <label>
                    参与:
                    <input
                        name="isGoing"
                        type="checkbox"
                        checked={this.state.isGoing}
                        onChange={this.handleInputChange}
                    />
                </label>
                <br />
                <label>
                    来宾人数:
                    <input
                        name="numberOfGuests"
                        type="number"
                        value={this.state.numberOfGuests}
                        onChange={this.handleInputChange}
                    />
                </label>
            </form>
        );
    }
}
```

### 受控输入空值
1. 受控组件的 `value` 如果没有设置为某个 state 的值，而是设置为一个其他非 `undefined` 和 `null` 的值，则会阻止用户输入。下面的 `<input>` 中会保持 "hi"，不会响应用户输入
    ```html
    <input value="hi" />
    ``` 
2. 如果设置为 `undefined` 或 `null` 的话，则仍然可以正常输入。

    
## 非受控组件
1. 在大多数情况下，我们推荐使用受控组件来实现表单。在受控组件中，表单数据由 React 组件处理。
2. 如果让表单数据由 DOM 处理时，替代方案为使用非受控组件，此时数据不保存在 React 的 `state` 中，而是保存在表单自身中。
3. 为了获取表单自身保存的数据，可以使用 `ref` 从引用表单并获取
    ```js
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.input = React.createRef();
        }

        handleSubmit(event) {
            // 这里并不会用 setState 把新的数据保存到 state 中，所以每次取数据都要到表单里取
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

### 文件 input 标签
文件 input 的 value 是只读，所以它是 React 中的一个非受控组件
```html
<input type="file" />
```

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


## References
* [表单](https://react.docschina.org/docs/forms.html)
* [Forms](https://legacy.reactjs.org/docs/forms.html)