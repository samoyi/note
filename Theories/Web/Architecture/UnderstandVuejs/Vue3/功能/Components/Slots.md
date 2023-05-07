# Slots


## 具名插槽
`v-slot` 有对应的简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。



## 作用域插槽
### 无渲染组件​
1. 一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为无渲染组件。
2. 这里有一个无渲染组件的例子，一个封装了追踪当前鼠标位置逻辑的组件：
    ```html
    <MouseTracker v-slot="{ x, y }">
        Mouse is at: {{ x }}, {{ y }}
    </MouseTracker>
    ```
3. 虽然这个模式很有趣，但大部分能用无渲染组件实现的功能都可以通过组合式 API 以另一种更高效的方式实现，并且还不会带来额外组件嵌套的开销。尽管如此，作用域插槽在需要同时封装逻辑、组合视图界面时还是很有用。


## References
* [插槽 Slots](https://cn.vuejs.org/guide/components/slots.html)