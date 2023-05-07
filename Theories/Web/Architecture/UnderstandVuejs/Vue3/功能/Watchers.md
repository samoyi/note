# Watchers


<!-- TOC -->

- [Watchers](#watchers)
    - [侦听数据源类型](#侦听数据源类型)
    - [深层侦听器](#深层侦听器)
    - [`watchEffect`](#watcheffect)
    - [回调的触发时机​](#回调的触发时机​)
    - [停止侦听器​](#停止侦听器​)
    - [References](#references)

<!-- /TOC -->


## 侦听数据源类型
1. watch 的第一个参数可以是不同形式的 “数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组
    ```js
    const x = ref(0)
    const y = ref(0)

    // 单个 ref
    watch(x, (newX) => {
        console.log(`x is ${newX}`)
    })

    // getter 函数
    watch(
        () => x.value + y.value,
        (sum) => {
            console.log(`sum of x + y is: ${sum}`)
        }
    )

    // 多个来源组成的数组
    watch([x, () => y.value], ([newX, newY]) => {
        console.log(`x is ${newX} and y is ${newY}`)
    })
    ```
2. 侦听其他类型的数据源则会出错
    ```js
    const obj = reactive({ count: 22 })

    // 这里侦听的是响应式对象里面的一个 number 属性值，而并非一个子响应式对象或者 ref 之类的
    // [Vue warn]: Invalid watch source:  22 A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types. 
    watch(obj.count, (count) => {
        console.log(`count is: ${count}`)
    })
    ```
3. 如果要侦听响应式对象中的其他数据源就要包装为 getter
    ```js
    watch(
        () => obj.count,
        (count) => {
            console.log(`count is: ${count}`)
        }
    )
    ```
4. 但如果不是响应式对象中的属性，而是随便其他数据，包装为 getter 也没用
    ```js
    let obj = {};
    watch(
        () => obj, // 侦听不到变化
        (count) => {
            console.log(count)
        }
    )
    ```

## 深层侦听器
1. 直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发
    ```js
    const obj = reactive({ count: 0 })

    watch(obj, (newValue, oldValue) => {
        // 在嵌套的属性变更时触发
        // 注意：`newValue` 此处和 `oldValue` 是相等的
        // 因为它们是同一个对象！
    })

    obj.count++
    ```
2. 相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调
    ```js
    watch(
        () => state.someObject,
        () => {
            // 仅当 state.someObject 被替换时触发
        }
    )
    ```
3. 你也可以给上面这个例子显式地加上 deep 选项，强制转成深层侦听器
    ```js
    watch(
    () => state.someObject,
    (newValue, oldValue) => {
        // 注意：`newValue` 此处和 `oldValue` 是相等的
        // *除非* state.someObject 被整个替换了
    },
    { deep: true }
    )
    ```
4. 深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。


## `watchEffect`
1. 如果希望在创建侦听器时先立刻执行一遍回调，然后之后在每次数据源变化时再执行回调，之前可以这样写
    ```js
    const todoId = ref(1)
    const data = ref(null)

    watch(todoId, async () => {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
        )
        data.value = await response.json()
    }, { immediate: true })
    ```
2. 现在使用 `watchEffect` 可以简化为
    ```js
    watchEffect(async () => {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
        )
        data.value = await response.json()
    })
    ```
3. 在执行期间，它会自动追踪 `todoId.value` 作为依赖（和计算属性类似）。每当 `todoId.value` 变化时，回调会再次执行。有了 `watchEffect()`，我们不再需要明确传递 `todoId` 作为源值。
4. 对于这种只有一个依赖项的例子来说，`watchEffect()` 的好处相对较小。但是对于有多个依赖项的侦听器来说，使用 `watchEffect()` 可以消除手动维护依赖列表的负担。
5. 此外，如果你需要侦听一个嵌套数据结构中的几个属性，`watchEffect()` 可能会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性
    ```js
    watchEffect(async () => {
        // 只侦听单独的两个属性，而不需要递归的侦听 obj 的所有属性
        doSomething(obj.name, obj.value);
    })
    ```
6. `watchEffect` 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪
    ```js
    const ref1 = ref(1);
    const ref2 = ref(2);
    watchEffect(async () => {
        console.log(ref1.value)
        await '';
        console.log(ref2.value) // ref2.value 更改时不会触发 watchEffect 回调
    })
    ```


## 回调的触发时机​
1. 当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。
2. 默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
3. 如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 `flush: 'post'` 选项
    ```js
    watch(source, callback, {
        flush: 'post'
    })

    watchEffect(callback, {
        flush: 'post'
    })
    ```
4. 后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`
    ```js
    import { watchPostEffect } from 'vue'

    watchPostEffect(() => {
        /* 在 Vue 更新后执行 */
    })
    ```


## 停止侦听器​
1. 在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。
2. 但是，如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏
    ```vue
    <script setup>
    import { watchEffect } from 'vue'

    // 它会自动停止
    watchEffect(() => {})

    // ...这个则不会！
    setTimeout(() => {
        watchEffect(() => {})
    }, 100)
    </script>
    ```
3. 要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：
    ```js
    const unwatch = watchEffect(() => {})

    // ...当该侦听器不再需要时
    unwatch()
    ```
4. 注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑
    ```js
    // 需要异步请求得到的数据
    const data = ref(null)

    watchEffect(() => {
        if (data.value) {
            // 数据加载后执行某些操作...
        }
    })
    ```


## References
* [Watchers](https://vuejs.org/guide/essentials/watchers.html)