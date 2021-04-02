# Vue 组件通信


<!-- TOC -->

- [Vue 组件通信](#vue-组件通信)
    - [组件通信方式](#组件通信方式)
    - [事件总线](#事件总线)
    - [References](#references)

<!-- /TOC -->


## 组件通信方式
<table>
    <thead>
        <tr>
            <th>方式</th>
            <th>对象</th>
            <th>方向</th>
            <th>是否动态</th>
            <th>可以传递的数据类型</th>
            <th>是否有默认值</th>
            <th>其他特点</th>
            <th>缺点</th>
        </tr>
    <thead>
    <tbody>
        <tr>
            <td>prop 和 emit</td>
            <td>父子组件</td>
            <td>双向通信</td>
            <td>父组件通过 prop 响应式传递数据，子组件根据需求随时 emit 事件</td>
            <td>JavaScript 数据类型</td>
            <td>有</td>
            <td>数据校验</td>
            <td></td>
        </tr>
        <tr>
            <td><code>$attrs</code></td>
            <td>父子组件</td>
            <td>单向通信</td>
            <td>非响应</td>
            <td>JavaScript 数据类型</td>
            <td>无</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>Vuex</td>
            <td>任意组件</td>
            <td>双向通信</td>
            <td>响应式</td>
            <td>任意类型</td>
            <td>有</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>$ref、$parent、$children、$root</td>
            <td>父子组件</td>
            <td>双向通信：从父组件通过插值传值给子组件；子组件通过作用域插槽传值给父组件</td>
            <td>响应式</td>
            <td>JavaScript 数据类型、HTML、其他组件</td>
            <td>有</td>
            <td></td>
            <td>组件应该保持黑箱状态，不应该让外部随意修改<br />直接访问组件实例将导致对属性的修改无法追踪，尤其是多个子组件可以同时修改父组件的时候<br />直接的父子访问将导致关系耦合，比如你子组件里如果用到 <code>$parent.map</code>，那么这个组件如果放到其他父组件里，<code>$parent.map</code> 很可能就访问不到期望的数据了</td>
        </tr>
        <tr>
            <td>Provide / Inject</td>
            <td>组件</td>
            <td>向通信</td>
            <td>非响应式（Vue 3 通过 <code>computed</code> 方法支持了响应式）</td>
            <td>JavaScript 数据类型、HTML、其他组件</td>
            <td>无</td>
            <td></td>
            <td>同样要耦合于嵌套结构</td>
        </tr>
        <tr>
            <td>slot</td>
            <td>父子组件</td>
            <td>双向通信：从父组件通过插值传值给子组件；子组件通过作用域插槽传值给父组件</td>
            <td>响应式</td>
            <td>JavaScript 数据类型、HTML、其他组件</td>
            <td>有</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>事件总线（EventBus）</td>
            <td>任意组件</td>
            <td>双向通信：从父组件通过插值传值给子组件；子组件通过作用域插槽传值给父组件</td>
            <td>响应式</td>
            <td>任意类型</td>
            <td>有</td>
            <td></td>
            <td>只适合很小规模的应用，或者局部无法使用 Vuex 的情况。稍微大一些的应用就应该通过 Vuex 来实现通信</td>
        </tr>
        <tr>
            <td>localStroage、sessionStorage、cookie</td>
            <td>父子组件</td>
            <td>双向通信</td>
            <td>否</td>
            <td>JavaScript 数据类型</td>
            <td>无</td>
            <td>离线存储（sessionStorage 不行）</td>
            <td>只支持保存字符串的形式，因此需要类型转换</td>
        </tr>
    </tbody>
</table>


## 事件总线
1. 类似于发布订阅模式，实现一个公共的 Vue 实例（事件总线）作为发布者，需要通信组件的组件作为订阅者。
2. A 组件先通过事件总线的实例方法 `$on` 在事件总线上注册一个事件监听，也就是订阅了该事件；B 组件如果想给 A 发送事件，就调用事件总线的实例方法 `$emit` 触发 A 之前注册的事件监听，事件总线自动调用监听回调函数实现消息的发布。
3. 下面的例子，`component1` 和 `component2` 之间通过 `EventBus` 来收发信息
    ```js
    let EventBus = new Vue();

    export default {
        components: {
            component1: {
                template: `<h2>component1</h2>`,
                methods: {
                    send (componentName, data) {
                        EventBus.$emit(componentName, data);
                    },
                    receive (data) {
                        console.log("Component1 received data: " + data);
                    },
                },
                created () {
                    // 订阅事件总线的 "component1" 事件
                    EventBus.$on("component1", this.receive);

                    setTimeout(()=>{
                        // 触发事件总线的 "component2" 事件，向 component2 发送消息
                        this.send("component2", "data from component1");
                    }, 500);
                },
            },
            component2: {
                template: `<h2>component2</h2>`,
                methods: {
                    send (componentName, data) {
                        EventBus.$emit(componentName, data);
                    },
                    receive (data) {
                        console.log("Component2 received data: " + data);
                    },
                },
                created () {
                    // 订阅事件总线的 "component2" 事件
                    EventBus.$on("component2", this.receive);

                    setTimeout(()=>{
                        // 触发事件总线的 "component1" 事件，向 component2 发送消息
                        this.send("component1", "data from component2");
                    }, 1500);
                },
            },
        },
    }
    ```

## References
* [Vue.js](https://v3.vuejs.org/)
* [vue组件间通信六种方式（完整版）](https://zhuanlan.zhihu.com/p/67621038)
