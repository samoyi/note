# 组合式函数


<!-- TOC -->

- [组合式函数](#组合式函数)
    - [概念](#概念)
    - [鼠标跟踪器示例​](#鼠标跟踪器示例​)
    - [响应式调用示例](#响应式调用示例)
    - [约定和最佳实践​](#约定和最佳实践​)
        - [命名​](#命名​)
        - [输入参数​兼容](#输入参数​兼容)
        - [保持返回值​的响应性](#保持返回值​的响应性)
        - [副作用​](#副作用​)
        - [同步调用](#同步调用)
    - [与其他模式的比较​](#与其他模式的比较​)
        - [和 Mixin 的对比​](#和-mixin-的对比​)
        - [和无渲染组件的对比​](#和无渲染组件的对比​)
        - [和 React Hooks 的对比​](#和-react-hooks-的对比​)
    - [References](#references)

<!-- /TOC -->


## 概念
1. 在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用 **有状态** 逻辑的函数。
2. 当构建前端应用时，我们常常需要复用公共任务的逻辑。例如为了在不同地方格式化时间，我们可能会抽取一个可复用的日期格式化函数。这个函数封装了 **无状态** 的逻辑：它在接收一些输入后立刻返回所期望的输出。复用无状态逻辑的库有很多，比如你可能已经用过的 lodash 或是 date-fns。
3. 相比之下，有状态逻辑负责管理会随时间而变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在实际应用中，也可能是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。


## 鼠标跟踪器示例​
1. 如果我们要直接在组件中使用组合式 API 实现鼠标跟踪功能，它会是这样的：
    ```vue
    <script setup>
        import { ref, onMounted, onUnmounted } from 'vue'

        const x = ref(0)
        const y = ref(0)

        function update(event) {
            x.value = event.pageX
            y.value = event.pageY
        }

        onMounted(() => window.addEventListener('mousemove', update))
        onUnmounted(() => window.removeEventListener('mousemove', update))
    </script>

    <template>Mouse position is at: {{ x }}, {{ y }}</template>
    ```
2. 但是，如果我们想在多个组件中复用这个相同的逻辑呢？我们可以把这个逻辑以一个组合式函数的形式提取到外部文件中：
    ```js
    // mouse.js
    import { ref, onMounted, onUnmounted } from 'vue'

    // 按照惯例，组合式函数名以 “use” 开头
    export function useMouse() {
        // 被组合式函数封装和管理的状态
        const x = ref(0)
        const y = ref(0)

        // 组合式函数可以随时更改其状态。
        function update(event) {
            x.value = event.pageX
            y.value = event.pageY
        }

        // 一个组合式函数也可以挂靠在所属组件的生命周期上
        // 来启动和卸载副作用
        onMounted(() => window.addEventListener('mousemove', update))
        onUnmounted(() => window.removeEventListener('mousemove', update))

        // 通过返回值暴露所管理的状态
        return { x, y }
    }
    ```
3. 下面是它在组件中使用的方式：
    ```vue
    <script setup>
        import { useMouse } from './mouse.js'

        const { x, y } = useMouse()
    </script>

    <template>Mouse position is at: {{ x }}, {{ y }}</template>
    ```
4. 你还可以嵌套多个组合式函数：一个组合式函数可以调用一个或多个其他的组合式函数。这使得我们可以像使用多个组件组合成整个应用一样，用多个较小且逻辑独立的单元来组合形成复杂的逻辑。
5. 举例来说，我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中：
    ```js
    // event.js
    import { onMounted, onUnmounted } from 'vue'

    export function useEventListener(target, event, callback) {
        // 如果你想的话，
        // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
        onMounted(() => target.addEventListener(event, callback))
        onUnmounted(() => target.removeEventListener(event, callback))
    }
    ```
    ```js
    // mouse.js
    import { ref } from 'vue'
    import { useEventListener } from './event'

    export function useMouse() {
        const x = ref(0)
        const y = ref(0)

        function update(event) {
            x.value = event.pageX
            y.value = event.pageY
        }

        useEventListener(window, 'mousemove', update)

        return { x, y }
    }
    ```


## 响应式调用示例
1. 在做异步数据请求时，我们常常需要处理不同的状态：加载中、加载成功和加载失败。例如
    ```vue
    <script setup>
        import { ref } from 'vue'

        const data = ref(null)
        const error = ref(null)

        fetch('...')
            .then((res) => res.json())
            .then((json) => (data.value = json))
            .catch((err) => (error.value = err))
    </script>

    <template>
        <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
        <div v-else-if="data">
            Data loaded:
            <pre>{{ data }}</pre>
        </div>
        <div v-else>Loading...</div>
    </template>
    ```
2. 把请求逻辑抽取成一个组合式函数，接收 URL 作为参数，返回请求结果：
    ```js
    // fetch.js
    import { ref } from 'vue'

    export function useFetch(url) {
        const data = ref(null)
        const error = ref(null)

        fetch(url)
            .then((res) => res.json())
            .then((json) => (data.value = json))
            .catch((err) => (error.value = err))

        return { data, error }
    }
    ```
    ```vue
    <script setup>
        import { useFetch } from './fetch.js'

        const { data, error } = useFetch('...')
    </script>
    ```
3. 但现在还不是响应式的，我们需要在 URL 变化时让 `useFetch` 自动重新执行。通过 watcher 来实现
    ```js
    // fetch.js
    import { ref, isRef, unref, watchEffect } from 'vue'

    export function useFetch(url) {
        const data = ref(null)
        const error = ref(null)

        function doFetch() {
            // 在请求之前重设状态...
            data.value = null
            error.value = null
            // unref() 解包可能为 ref 的值
            fetch(unref(url))
                .then((res) => res.json())
                .then((json) => (data.value = json))
                .catch((err) => (error.value = err))
        }

        if (isRef(url)) {
            // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
            watchEffect(doFetch)
        } else {
            // 否则只请求一次
            // 避免监听器的额外开销
            doFetch()
        }

        return { data, error }
    }
    ```
4. 这个版本的 `useFetch()` 现在同时可以接收静态的 URL 字符串和 URL 字符串的 ref。当通过 `isRef()` 检测到 URL 是一个动态 ref 时，它会使用 `watchEffect()` 启动一个响应式的 effect。该 effect 会立刻执行一次，并在此过程中将 URL 的 ref 作为依赖进行跟踪。


## 约定和最佳实践​
### 命名​
组合式函数约定用驼峰命名法命名，并以 “use” 作为开头。

### 输入参数​兼容
1. 尽管其响应性不依赖 ref，组合式函数仍可接收 ref 参数。如果编写的组合式函数会被其他开发者使用，你最好在处理输入参数时兼容 ref 而不只是原始的值。
2. `unref()` 工具函数会对此非常有帮助：
    ```js
    import { unref } from 'vue'

    function useFeature(maybeRef) {
        // 若 maybeRef 确实是一个 ref，它的 .value 会被返回
        // 否则，maybeRef 会被原样返回
        const value = unref(maybeRef)
    }
    ```
3. 如果你的组合式函数在接收 ref 为参数时会产生响应式 effect，请确保使用 `watch()` 显式地监听此 ref，或者在 `watchEffect()` 中调用 `unref()` 来进行正确的追踪。

### 保持返回值​的响应性
1. 你可能已经注意到了，我们一直在组合式函数中使用 `ref()` 而不是 `reactive()`。我们推荐的约定是组合式函数始终返回一个包含多个 ref 的普通的非响应式对象，这样该对象在组件中被解构为 ref 之后仍可以保持响应性：
    ```js
    // x 和 y 是两个 ref
    const { x, y } = useMouse()
    ```
2. 从组合式函数返回一个响应式对象可能导致在对象解构过程中丢失与组合式函数内状态的响应性连接。与之相反，ref 则可以维持这一响应性连接。
3. 如果你更希望以对象属性的形式来使用组合式函数中返回的状态，你可以将返回的对象用 `reactive()` 包装一次，这样其中的 ref 会被自动解包，例如：
    ```js
    const mouse = reactive(useMouse())
    // mouse.x 链接到了原来的 x ref
    // 如果没有使用 reactive 包装，则 mouse.x 就是新建的基础类型值，就失去了响应
    console.log(mouse.x)
    ```
    ```html
    Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
    ```

### 副作用​
* 如果你的应用用到了服务端渲染，请确保在组件挂载后才调用的生命周期钩子（例如 `onMounted()`）中执行 DOM 相关的副作用，因为这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM。
* 确保在 `onUnmounted()` 时清理副作用。举例来说，如果一个组合式函数设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除。

### 同步调用
1. 组合式函数在应始终被同步地调用。在某些场景下，你也可以在像` onMounted()` 这样的生命周期钩子中使用他们。
2. 这个限制是为了让 Vue 能够确定当前正在被执行的到底是哪个组件实例，（看起来同步执行就是正在解析当前组件实例阶段，所以可以确定就是当前这个实例；但如果异步，就不是在组件实例解析阶段，所以就不知道这个组合式函数是应用在那个组件实例上的）。只有能确认当前组件实例，才能够：
    * 将组合式函数中用到的生命周期钩子注册到该组件实例上
    * 将组合式函数中用到的计算属性和监听器注册到该组件实例上，以便在该组件被卸载时停止监听，避免内存泄漏。
3. `<script setup>` 是唯一在调用 `await` 之后仍可调用组合式函数的地方。编译器会在异步操作之后自动为你恢复当前的组件实例。不懂，那就只是不能在 `setup()` 钩子中异步调用组合式函数了？


## 与其他模式的比较​
### 和 Mixin 的对比​
1. mixins 选项也让我们能够把组件逻辑提取到可复用的单元里。然而 mixins 有三个主要的短板：
    * **不清晰的数据来源**：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 变得不清晰，这使追溯实现和理解组件行为变得困难。这也是我们推荐在组合式函数中使用 ref + 解构模式的理由：让属性的来源在消费组件时一目了然。
    * **命名空间冲突**：多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
    * **隐式的跨 mixin 交流**：多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。
2. 基于上述理由，我们不再推荐在 Vue 3 中继续使用 mixin。保留该功能只是为了项目迁移的需求和照顾熟悉它的用户。

### 和无渲染组件的对比​
1. 在组件插槽一章中，我们讨论过了基于作用域插槽的无渲染组件。我们甚至用它实现了一样的鼠标追踪器示例。
2. 组合式函数相对于无渲染组件的主要优势是：组合式函数不会产生额外的组件实例开销。当在整个应用中使用时，由无渲染组件产生的额外组件实例会带来无法忽视的性能开销。
3. 我们推荐在纯逻辑复用时使用组合式函数，在需要同时复用逻辑和视图布局时使用无渲染组件。

### 和 React Hooks 的对比​
1. 组合式 API 的一部分灵感正来自于 React hooks，Vue 的组合式函数也的确在逻辑组合能力上与 React hooks 相近。
2. 然而，Vue 的组合式函数是基于 Vue 细粒度的响应性系统，这和 React hooks 的执行模型有本质上的不同。这一话题在组合式 API 的常见问题中有更细致的讨论。 TODO


## References
* [组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)