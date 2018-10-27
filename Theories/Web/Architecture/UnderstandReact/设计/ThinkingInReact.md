# Thinking in React

## 第一步：把 UI 划分出组件层级
**划分组件的原则：单一功能原则**

1. 和创建一个函数的逻辑一样，一个组件应该只做一件事情。
2. 如果这个组件功能不断丰富，它应该被分成更小的组件。
3. 如果数据模型构建正确，那么 UI 以及组件结构会被很好的映射。这是因为 UI 和数据模型往往
遵循着相同的信息架构，只要把它划分成能准确表示你数据模型的一部分的组件就可以。


## 第二步：用 React 创建一个静态版本
1. 先创建一个静态版本：传入数据模型，渲染 UI 但没有任何交互。
2. 如果你熟悉`state`的概念，在创建静态版本的时候不要使用`state`。State 只在交互的时候
使用，即随时间变化的数据。在组件不涉及交互的时候，它就像一个纯函数。由于这是静态版本的应
用，你不需要使用它。
3. 你可以自顶向下或者自底向上构建应用。也就是，你可以从层级最高的组件开始构建或层级最低
的组件开始构建。在较为简单的例子中，通常自顶向下更容易，而在较大的项目中，自底向上会更容
易并且在你构建的时候有利于编写测试。
4. 在这步的最后，你会拥有一个用于呈现数据模型的可重用组件库。这些组件只会有`render()`方
法，因为这只是你的应用的静态版本。层级最高的组件会把数据模型作为`prop`传入。如果你改变你
的基础数据模型并且再次调用`ReactDOM.render()`，UI 会更新。很容易看到你的 UI 是如何更新
的，哪里进行了更新。因为没有什么复杂的事情发生。React 的单向数据流保证了一切是模块化并且
是快速的。


## 第三步：定义 UI 状态的最小(但完整)表示
1. 为了使你的 UI 交互，你需要能够触发对底层数据模型的更改。React 使用`state`，让这变的
更容易。
2. To build your app correctly, you first need to think of the minimal set of
mutable state that your app needs.
3. The key here is DRY: Don’t Repeat Yourself. Figure out the absolute minimal representation of the state your application needs and compute everything else
you need on-demand.
4. For example, if you’re building a TODO list, just keep an array of the TODO
items around; don’t keep a separate state variable for the count. Instead, when
you want to render the TODO count, simply take the length of the TODO items
array.
5. 对于应用的所有数据，要区分出哪些要表示为 prop，哪些表示为 state。每个数据只要考虑三
个问题：
    * 它是通过 props 从父级传来的吗？如果是，他可能不是 state。（这很显然）
    * 它随着时间推移不变吗？如果是，它可能不是 state。（一次性的给组件传参）
    * 你能够根据组件中任何其他的 state 或 props 把它计算出来吗？如果是，它不是 state。
    （比如 Vue 里，这种数据是数据计算属性，而不是基础的`data`）。


## 第四步：确定你的 State 应该位于哪里
1. 好的，现在我们确定了应用 state 的最小集合。接下来，我们需要确定哪个组件会改变，或拥
有这个 state。
2. 记住：React 中的数据流是单向的，并在组件层次结构中向下传递。一开始我们可能不是很清楚
哪个组件应该拥有哪个 state。所以按照下面的步骤来辨别（状态提升的思路）：  
对你应用的每一个 state：
    1. 确定每一个需要这个 state 来渲染的组件。
    2. 找到一个公共所有者组件(一个在层级上高于所有其他需要这个 state 的组件的组件)
    3. 这个公共所有者组件或另一个层级更高的组件应该拥有这个 state。
    4. 如果你没有找到可以拥有这个 state 的组件，创建一个仅用来保存状态的组件并把它加入
    比这个公共所有者组件层级更高的地方。
3. 没有一个组件既需要 state 又本身应该拥有该 state 的情况吗？如果 state 只是用来保存用
户交互的数据的话，好像还真没有。比如一个表单需要 state 来作为`value`，但它不能也没必要
拥有这个 state：表单本身要用户输入没用，它只是一个收集数据的表单而已，肯定要传给父级之类
的才有用。


## 第五步：添加反向数据流
Vue 是使用自定义事件让子组件数据流向父组件；React 是通过父组件把自己的更新函数传给子组
件，子组件调用该更新函数还把数据传递到父组件。
