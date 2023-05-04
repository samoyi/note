# Props


## Props 声明
1. 一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute。
2. 在使用 `<script setup>` 的单文件组件中，props 可以使用 `defineProps()` 宏来声明
    ```vue
    <script setup>
    const props = defineProps(['foo'])

    console.log(props.foo)
    </script>
    ```
2. `defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。
3. 声明的 `props` 会自动暴露给模板。`defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props：
    ```vue
    <!-- BlogPost.vue -->
    <script setup>
    const props = defineProps(['title'])
    console.log(props.title)
    </script>

    <template>
    <h4>{{ title }}</h4>
    </template>
    ```
4. 除了使用字符串数组来声明 prop 外，还可以使用对象的形式
    ```js
    // 使用 <script setup>
    defineProps({
        title: String,
        likes: Number
    })
    ```
5. 如果你正在搭配 TypeScript 使用 `<script setup>`，也可以使用类型标注来声明 props
    ```vue
    <script setup lang="ts">
    defineProps<{
        title?: string
        likes?: number
    }>()
    </script>
    ```


## Boolean 类型转换​
1. 为了更贴近原生 boolean attributes 的行为，声明为 `Boolean` 类型的 props 有特别的类型转换规则。以带有如下声明的 `<MyComponent>` 组件为例
    ```js
    defineProps({
    disabled: Boolean
    })
    ```
2. 该组件可以被这样使用
    ```html
    <!-- 等同于传入 :disabled="true" -->
    <MyComponent disabled />

    <!-- 等同于传入 :disabled="false" -->
    <MyComponent />
    ```
3. 当一个 prop 被声明为允许多种类型时，无论声明类型的顺序如何，`Boolean` 类型的特殊转换规则都会被应用
    ```js
    defineProps({
        disabled: [Boolean, Number]
    })


## References
* [Props](https://cn.vuejs.org/guide/components/props.html)