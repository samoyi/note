# Creating a Vue Application



## App Configurations
1. 应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，用来捕获所有子组件上的错误
    ```js
    app.config.errorHandler = (err) => {
        /* 处理错误 */
    }
    ```
2. 应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件
    ```js
    app.component('TodoDeleteButton', TodoDeleteButton)
    ```
3. 确保在挂载应用实例之前完成所有应用配置。

### API
#### `app.config.globalProperties`
1. 一个用于注册能够被应用内所有组件实例访问到的全局属性的对象。这是对 Vue 2 中 `Vue.prototype` 使用方式的一种替代
    ```js
    app.config.globalProperties.msg = 'hello'
    ```
    ```js
    // 在组件实例中使用
    export default {
        mounted() {  
            console.log(this.msg) // 'hello'
        }
    }
    ```
    ```html
    <!-- 在组件模板中使用 -->
    <template>
        <div class="item">
            {{msg}}
        </div>
    </template>
    ```
4. 如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级。


## Multiple application instances
1. 应用实例并不只限于一个。`createApp` API 允许你在同一个页面中创建多个共存的 Vue 应用，而且每个应用都拥有自己的用于配置和全局资源的作用域。
    ```js
    const app1 = createApp({
    /* ... */
    })
    app1.mount('#container-1')

    const app2 = createApp({
    /* ... */
    })
    app2.mount('#container-2')
    ```
2. 如果你正在使用 Vue 来增强服务端渲染 HTML，并且只想要 Vue 去控制一个大型页面中特殊的一小部分，应避免将一个单独的 Vue 应用实例挂载到整个页面上，而是应该创建多个小的应用实例，将它们分别挂载到所需的元素上去。


## References
* [创建一个 Vue 应用](https://cn.vuejs.org/guide/essentials/application.html)
* [应用实例 API](https://cn.vuejs.org/api/application.html)