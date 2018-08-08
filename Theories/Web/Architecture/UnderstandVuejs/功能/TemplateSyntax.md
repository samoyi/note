# Template Syntax

**看这篇笔记前，要先看懂这一篇：**
`Theories\Web\Architecture\UnderstandVuejs\原理\Two-wayBinding.md`  
本篇中提到的以下四个模块都出自这篇笔记：Compiler、Publisher、Observer 和 Subscriber


* Vue.js uses an HTML-based template syntax that allows you to declaratively
bind the rendered DOM to the underlying Vue instance’s data. Vue 正是作为 VM 层实
现 DOM 和 Data 的绑定。
* Under the hood, Vue compiles the templates into Virtual DOM render functions.
即使使用模板语法，也会被转换为渲染函数的形式。If you are familiar with Virtual DOM
concepts and prefer the raw power of JavaScript, you can also directly write
render functions instead of templates, with optional JSX support.
* Vue is able to intelligently figure out the minimal number of components to
re-render and apply the minimal amount of DOM manipulations when the app state
changes.


## Interpolations
1. Compiler 在编译模板时如果发现了一个文本节点里包含`{{}}`，例如发现了`1{{ num }}3`，
就会把该文本节点的值在虚拟 DOM 设置为 `'1' + num + '3'`。
2. 假如在创建 Vue 实例时，`num`值为`2`，那在初次渲染时就会输出`123`。
3. 这实现了模板渲染，但还没有实现数据绑定。即之后`num`变化时，页面上仍然会是`123`。
4. 实现这种绑定，Vue 会通过数据劫持结合发布者-订阅者模式。需要用到 Observer 模块 、
Publisher 模块和 Subscriber 模块。
5. Observer 模块的数据劫持过程会把`num`变为访问器属性，让`num`的变化有了回调函数来捕获
变化。
6. Observer 在对`num`进行数据劫持的时候，也会同时为其创建一个 Publisher 实例。该实例
有两个作用：需要知道哪些节点依赖该`num`；当`num`发生变化时，想办法通知那些节点。显然，
通知的操作应该是放在`num`的 setter 函数里。
7. 有 Publisher 发布`num`，还有该有人负责接收变化并通知依赖`num`的节点们。这是由
Subscriber 模块来实现的。
8. 因为一个 subscriber 对应一个节点，所以应该在编译的时候（Compiler负责的过程）给每个
节点添加一个`Subscriber`实例。
9. 该实例会记录自己负责的节点，还会根据节点上的指令，例如`{{}}`、`v-html`、`v-show`等
，记录如果数据更改了要怎么修改该节点。例如指令是`{{}}`则数据更改后直接替换文本，
`v-html`是数据变化后将数据作为`innerHTML`插入，`v-show`指令是数据更改后根据数据的布尔
值对节点进行显示或隐藏。
10. 同时，还要把这些订阅实例添加到`num`的 Publisher 实例的订阅者列表里，让 Publisher
实例知道到时数据变化了要通知这些订阅者。
9. 等到`num`变化时，它的 getter 被触发，publisher 发出通知给所有的订阅者，每个订阅者
接到通知后，都会对节点（虚拟DOM中的）进行修改。

###
```html
<div id="components-demo">
    {{num1}}
    <!-- <input type="text" v-model="num1" /> -->
    <span>{{num2}}</span>
    <!-- <test-component></test-component> -->
</div>
```


## Directives
### `v-html`
* Dynamically rendering arbitrary HTML on your website can be very dangerous
because it can easily lead to XSS attacks. Only use v-html on trusted content
and never on user-provided content. 写个xss获取cookie并发送的例子
### `v-once`
1. Render the element and component once only.
2. On subsequent re-renders, the element/component and all its children will be
treated as static content and skipped.
3. This can be used to optimize update performance.
4. 会作用到后辈节点

```html
<div id="components-demo" v-once>
    {{num1}}
    <span>{{num2}}</span>
</div>
```
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
        num2: 33,
    },
});
// 之后的修改都无效
vm.num1 = 222;
vm.num2 = 333;
```
