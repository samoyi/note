# Template Refs


<!-- TOC -->

- [Template Refs](#template-refs)
    - [`v-for` 中的模板引用](#v-for-中的模板引用)
    - [函数模板引用​](#函数模板引用​)
    - [组件上的 ref](#组件上的-ref)

<!-- /TOC -->


## `v-for` 中的模板引用
1. 当在 `v-for` 中使用模板引用时，对应的 `ref` 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：
    ```vue
    <script setup>
        import { ref, onMounted } from 'vue'

        const list = ref([
            /* ... */
        ])

        const itemRefs = ref([]) // 这里

        onMounted(() => console.log(itemRefs.value))
    </script>

    <template>
        <ul>
            <li v-for="item in list" ref="itemRefs">
            {{ item }}
            </li>
        </ul>
    </template>
    ```
2. 注意，ref 数组并不保证与源数组相同的顺序。


## 函数模板引用​
1. 除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数
    ```html
    <input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
    ```
2. 当绑定的元素被卸载时，函数也会被调用一次，此时的 `el` 参数会是 `null`。
3. 你当然也可以绑定一个组件方法而不是内联函数。


## 组件上的 ref
1. 如果一个子组件使用的是选项式 API 或没有使用 `<script setup>`，被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。
2. 使用了 `<script setup>` 的组件是默认私有的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西。
3. 除非子组件在其中通过 defineExpose 宏显式暴露出想要暴露的数据
    ```vue
    <script setup>
    import { ref } from 'vue'

    const a = 1
    const b = ref(2)

    // 像 defineExpose 这样的编译器宏不需要导入
    defineExpose({
        a,
        b
    })
    </script>
    ```
    当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)。


* [Template Refs](https://cn.vuejs.org/guide/essentials/template-refs.html)