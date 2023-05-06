# 依赖注入


## Misc
* 如果你想确保提供的数据不能被注入方的组件更改，你可以使用 `readonly()` 来包装提供的值。
    ```vue
    <script setup>
        import { ref, provide, readonly } from 'vue'

        const count = ref(0)
        provide('read-only-count', readonly(count))
    </script>
    ```


## 和响应式数据配合使用​
1. 当提供响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中，这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。
2. 有的时候，我们可能需要在注入方组件中更改数据。在这种情况下，我们推荐在供给方组件内声明并提供一个更改数据的方法函数：
    ```vue
    <!-- 在供给方组件内 -->
    <script setup>
        import { provide, ref } from 'vue'

        const location = ref('North Pole')

        function updateLocation() {
            location.value = 'South Pole'
        }

        provide('location', {
            location,
            updateLocation
        })
    </script>
    ```
    ```vue
    <!-- 在注入方组件 -->
    <script setup>
        import { inject } from 'vue'

        const { location, updateLocation } = inject('location')
    </script>

    <template>
        <button @click="updateLocation">{{ location }}</button>
    </template>
    ```


## 使用 Symbol 作注入名​
1. 我们已经了解了如何使用字符串作为注入名,但如果你正在构建大型的应用，包含非常多的依赖提供，或者你正在编写提供给其他开发者使用的组件库，建议最好使用 Symbol 来作为注入名以避免潜在的冲突。
2. 我们通常推荐在一个单独的文件中导出这些注入名 Symbol：
    ```js
    // keys.js
    export const myInjectionKey = Symbol()
    ```
    ```js
    // 在供给方组件中
    import { provide } from 'vue'
    import { myInjectionKey } from './keys.js'

    provide(myInjectionKey, { /*
        要提供的数据
    */ });
    ```
    ```js
    // 注入方组件
    import { inject } from 'vue'
    import { myInjectionKey } from './keys.js'

    const injected = inject(myInjectionKey)
    ```


## References
* [依赖注入](https://cn.vuejs.org/guide/components/provide-inject.html)