# Template Syntax

**看这篇笔记前，要先看懂这一篇：**
`Theories\Web\Architecture\UnderstandVuejs\原理\Two-wayBinding.md`  
本篇中提到的以下四个模块都出自这篇笔记：Compiler、Publisher、Observer 和 Subscriber


* Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数
据。 Vue.js 正是作为 VM 层实现 DOM 和 Data 的绑定。
* 在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。所以说即使使用模板语法，也会被转换
为渲染函数的形式。


## 实现原理
1. Compiler 在编译模板时如果发现了一个文本节点里包含`{{}}`，例如发现了`1{{ num }}3`，
就会把该文本节点的值在虚拟 DOM 设置为 `'1' + num + '3'`。
2. 假如在创建 Vue 实例时，`num`值为`2`，那在初次渲染时就会输出`123`。
3. 这实现了模板渲染，但还没有实现数据绑定。即之后`num`变化时，页面上仍然会是`123`。
4. 实现这种绑定，Vue 会通过数据劫持结合发布者-订阅者模式。需要用到 Observer 模块、
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
9. 等到`num`变化时，它的 setter 被触发，publisher 发出通知给所有的订阅者，每个订阅者
接到通知后，都会对节点（虚拟 DOM 中的）进行修改。


## Using JavaScript Expressions
1. 必须是有明确返回值的单独表达式
2. 模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如`Math`和`Date`。你不应该在
模板表达式中试图访问用户定义的全局变量。
3. 想想在模板里用了实例没定义的属性的话，出现的是 Vue 级别的报错，内容类似于：
`Property or method "某某" is not defined on the instance but referenced during
render`。如果可以随意引用全局变量，只会出现 JS 级别的报错，类似于：`ReferenceError:
某某 is not defined`
    ```html
    <div id="components-demo">
        {{ Math.random() }}  <!-- 没问题 -->
    </div>
    ```
