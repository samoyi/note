# 和Vue不同的地方


<!-- TOC -->

- [和Vue不同的地方](#和vue不同的地方)

<!-- /TOC -->


* 阻止组件渲染时，生命周期钩子会正常调用。因为 React 组件的 render，是指渲染虚拟 DOM。也是基于这个原因，如果使用 `setState` 设置了完全相同的值，也是会触发更新的钩子函数，这个更新并不是真实 DOM 更新了，而是指虚拟 DOM。
* 不能直接修改组件内的数据对象，必须要通过 `setState`
* `setState` 参数是函数的话，该函数并不像 Vue 中的 `nextTick` 一样在数据更新和重渲染后执行；这个函数执行时 `this.state` 甚至都没有更新，只不过参数会拿到更新后的值。
* 不需要插槽，子组件直接插入节点标签中或者通过 props 传递子组件。
* 手动双绑
* Vue 中用 `mixin`，React 中用 HOC
* Vue 的 provide/inject 是非响应的，React 的 context 是响应更新的。