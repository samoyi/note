# Events


<!-- TOC -->

- [Events](#events)
    - [Misc](#misc)
    - [声明触发的事件​](#声明触发的事件​)
    - [事件校验​](#事件校验​)
    - [References](#references)

<!-- /TOC -->


## Misc
* 和原生 DOM 事件不一样，组件触发的事件没有冒泡机制。你只能监听直接子组件触发的事件。平级组件或是跨越多层嵌套的组件间通信，应使用一个外部的事件总线，或是使用一个全局状态管理方案。
* 如果一个原生事件的名字 (例如 `click`) 被定义在 emits 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件。


## 声明触发的事件​
1. 组件可以显式地通过 `defineEmits()` 宏来声明它要触发的事件
    ```vue
    <script setup>
    defineEmits(['inFocus', 'submit'])
    </script>
    ```
2. 和 `defineProps` 类似，`defineEmits` 仅可用于 `<script setup>` 之中，并且不需要导入，它返回一个等同于 `$emit` 方法的 `emit` 函数
    ```vue
    <script setup>
    const emit = defineEmits(['inFocus', 'submit'])

    function buttonClick() {
        emit('submit')
    }
    </script>
    ```
3. `defineEmits()` 宏不能在子函数中使用。如上所示，它必须直接放置在 `<script setup>` 的顶级作用域下。
4. 尽管事件声明是可选的，我们还是推荐你完整地声明所有要触发的事件，以此在代码中作为文档记录组件的用法。同时，事件声明能让 Vue 更好地将事件和透传 attribute 作出区分，从而避免一些由第三方代码触发的自定义 DOM 事件所导致的边界情况。


## 事件校验​
1. 要为事件添加校验，那么事件可以被赋值为一个函数，接受的参数就是抛出事件时传入 emit 的内容，返回一个布尔值来表明事件是否合法。后者可以设置属性值为 `null` 表示没有校验。
2. 但是验证失败只会有 warn，事件还是可以发送成功
    ```vue
    <script setup>
    const emit = defineEmits({
        ev1(payload) {
            // 通过返回值为 `true` 还是为 `false` 来判断
            // 验证是否通过
            return false;
        },
        ev2: null, // 没有校验
    })

    onMounted (() => {
        emit('ev1') // [Vue warn]: Invalid event arguments: event validation failed for event "ev1".
    })
    </script>
    ```


## References
* [组件事件](https://cn.vuejs.org/guide/components/events.html)