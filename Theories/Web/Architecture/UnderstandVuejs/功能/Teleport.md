# Teleport


## 基本用法
直接看 [文档](https://cn.vuejs.org/guide/built-ins/teleport.html#basic-usage)


## 搭配组件使用​
1. `<Teleport>` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系。也就是说，如果 `<Teleport>` 包含了一个组件，那么该组件始终和这个使用了 `<teleport>` 的组件保持逻辑上的父子关系。传入的 props 和触发的事件也会照常工作。
2. 这也意味着来自父组件的注入也会按预期工作，子组件将在 Vue Devtools 中嵌套在父级组件下面，而不是放在实际内容移动到的地方。


## 禁用 Teleport
1. 在某些场景下可能需要视情况禁用 `<Teleport>`。举例来说，我们想要在桌面端将一个组件当做浮层来渲染，但在移动端则当作行内组件。我们可以通过对 `<Teleport>` 动态地传入一个 disabled prop 来处理这两种不同情况。
    ```html
    <Teleport :disabled="isMobile">
    ...
    </Teleport>
    ```
2. 这里的 `isMobile` 状态可以根据 CSS media query 的不同结果动态地更新。


## 多个 Teleport 共享目标​
一个可重用的模态框组件可能同时存在多个实例。对于此类场景，多个 `<Teleport>` 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上。


## References
* [Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html)