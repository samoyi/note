# List Rendering


## Misc
* 对列表项解构
    ```js
    const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
    ```
    ```html
    <li v-for="{ message } in items">
        {{ message }}
    </li>
    ```
    ```html
    <li v-for="({ message }, index) in items">
        {{ message }} {{ index }}
    </li>
    ```


## `v-for` 与 `v-if` 一起使用
1. 与 Vue2 相反，Vue3 中 `v-if` 的优先级比 `v-for` 更高，也就是说 `v-if` 控制着整个列表是否渲染，而不是其中的某一项。
2. 这也意味着 `v-if` 中无法访问到 `v-for` 作用域内定义的变量别名
    ```html
    <!--
        这会抛出一个错误，因为属性 todo 此时没有在该实例上定义
    -->
    <li v-for="todo in todos" v-if="!todo.isComplete">
        {{ todo.name }}
    </li>
    ```
3. 在外新包装一层 `<template>` 再在其上使用 `v-for` 可以解决这个问题
    ```html
    <template v-for="todo in todos">
        <li v-if="!todo.isComplete">
            {{ todo.name }}
        </li>
    </template>
    ```


## References
* [列表渲染](https://cn.vuejs.org/guide/essentials/list.html)