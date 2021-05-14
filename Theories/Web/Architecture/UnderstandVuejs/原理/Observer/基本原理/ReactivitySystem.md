# Reactivity System

**该篇内容是对响应式数据绑定的概述和使用注意事项，深入的原理分析在当前目录下的 `Two-wayBinding.md`**


<!-- TOC -->

- [Reactivity System](#reactivity-system)
    - [如何追踪变化](#如何追踪变化)
    - [检测变化的注意事项](#检测变化的注意事项)
        - [对于对象](#对于对象)
        - [对于数组](#对于数组)
    - [声明响应式 property](#声明响应式-property)
    - [异步更新队列](#异步更新队列)
        - [异步更新](#异步更新)
        - [处理异步更新的问题](#处理异步更新的问题)
    - [References](#references)

<!-- /TOC -->


## 如何追踪变化
1. 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 `data` 选项，Vue 将遍历此对象所有的 property，并使用 `Object.defineProperty` 把这些 property 全部转为 getter/setter。 Vue 实例将代理对这些属性的访问和设置。
2. 这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 能够追踪依赖，在 property 被访问和修改时通知变更。
3. 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把 “接触” 过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。
    <img src="../../../images/ReactivitySystem.png" width="600" style="display: block; margin: 5px 0 10px;" />
4. 这里看起来，watcher 相当于管理订阅者的一个对象，订阅者希望监听若干个依赖的变化，watcher 会负责把这个订阅者的变化监听回调函数注册到响应的 `data` 属性或计算属性名下。
5. 被依赖的 `data` 属性或者计算属性的 setter 被调用时，该属性之前名下订阅者注册的监听回调就会被调用。


## 检测变化的注意事项
1. 受现代 JavaScript 的限制 (而且 `Object.observe` 也已经被废弃)，Vue 不能检测到对象（包括数组）属性的添加或删除，只有属性的修改才能触发 setter，属性的删除以及子属性的变动都不会触发。
    ```js
    let data = {
        _info: {
            _age: 22,
        },
    };

    Object.defineProperty(data._info, 'age', {
        get () {
            return this._age;
        },
        set (newAge) {
            this._age = newAge;
            console.log('modify age');
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(data, 'info', {
        get () {
            return this._info;
        },
        set (newInfo) {
            this._info = newInfo;
            console.log('modify info');
        },
        enumerable: true,
        configurable: true,
    });
    
    console.log(data.info.age);     // 22
    data.info.age = 33;             // "modify age"   不会输出"modify info"
    console.log(data.info.age);     // 33
    delete data.info.age;           // 不会有输出
    console.log(data.info.age);     // undefined
    data.info = {};                 // "modify info"
    data.info.newProp = 'newProp';  // 不会有输出
    console.log(data.info.newProp); // "newProp"
    delete data.info;               // 不会有输出
    ```
2. 由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在 `data` 对象上存在才能让 Vue 转换它，这样才能让它是响应的。
3. 但还是有办法解决这个问题，动态添加响应式的属性。

### 对于对象
1. 对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。
2. 但是，可以使用 `Vue.set(object, propertyName, value)` 方法向嵌套对象添加响应式 property
    ```js
    Vue.set(vm.someObject, 'b', 2)
    ```
3. 您还可以使用 `vm.$set` 实例方法，这也是全局 `Vue.set` 方法的别名：
    ```js
    this.$set(this.someObject, 'b', 2)    
    ```
4. 有时你可能需要为已有对象赋值多个新 property，比如使用 `Object.assign()` 或 `_.extend()`。但是，这样添加到对象上的新 property 不会触发更新。在这种情况下，你应该用原对象与要混合进去的对象的 property 一起创建一个新的对象。
    ```js
    // Object.assign(this.parent.child, { age: 22, sex: 'female' }); // 不行
    // 下面的可以，因为直接修改了 child 而不是添加属性
    this.parent.child = Object.assign({}, this.parent.child, { age: 22, sex: 'female' }); 
    ```

### 对于数组
1. Vue 不能检测以下数组的变动：
    * 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
    * 当你修改数组的长度时，例如：`vm.items.length = newLength`
2. 因为这两个都是在修改 `vm.items` 的子属性，而不是修改 `vm.items` 本身。
3. 为了解决第一个问题，有两个方法：
    * 可以把子属性 `indexOfItem` 也设置为响应式的
        ```js
        // Vue.set
        Vue.set(vm.items, indexOfItem, newValue)
        ```
        当然这个比较奇怪，因为 `indexOfItem` 是一个数组索引
    * 或者使用 `Array.prototype.splice` 方法，这个方法的修改是响应式的        
        ```js
        vm.items.splice(indexOfItem, 1, newValue)
        ```
4. 为了解决第二个问题，仍然可以使用 `Array.prototype.splice`:
    ```js
    vm.items.splice(newLength)
    ```
5. 之所以可以使用 `Array.prototype.splice`，因为 Vue 对包括这个的若干个数组方法进行了包装，使得在使用它们的时候会触发更新通知。源码位于 `src/core/observer/array.js`。


## 声明响应式 property
1. 由于 Vue 不允许动态添加根级响应式 property，所以你必须在初始化实例前声明所有根级响应式 property，哪怕只是一个空值。
2. 如果你未在 `data` 选项中声明 `message`，Vue 将警告你渲染函数正在试图访问不存在的 property。
3. 这样的限制在背后是有其技术原因的，它消除了在依赖项跟踪系统中的一类边界情况，也使 Vue 实例能更好地配合类型检查系统工作。
4. 但与此同时在代码可维护性方面也有一点重要的考虑：`data` 对象就像组件状态的结构 (schema)。提前声明所有的响应式 property，可以让组件代码在未来修改或给其他开发人员阅读时更易于理解。


## 异步更新队列
### 异步更新
1. Vue 在更新 DOM 时是异步执行的。
2. 只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。然后，在下一个的事件循环 “tick” 中，Vue 刷新队列并执行实际 (已去重的) 工作。
3. 这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。
4. Vue 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。
7. 例如，当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环 “tick” 中更新。


### 处理异步更新的问题
1. 多数情况我们不需要关心这个过程，但是如果你想基于更新后的 DOM 状态来做点什么，这就可能会有些棘手。
2. 虽然 Vue.js 通常鼓励开发人员使用 “数据驱动” 的方式思考，避免直接接触 DOM，但是有时我们必须要这么做。
3. 为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。这样回调函数将在 DOM 更新完成后被调用
    ```html
    <div id="example">{{ message }}</div>
    ```
    ```js
    const vm = new Vue({
        el: '#example',
        data: {
            message: '123'
        },
    });
    vm.message = 'new message'; // change data
    console.log(vm.$el.textContent === 'new message'); // false
    Vue.nextTick(function () {
        console.log(vm.$el.textContent === 'new message'); // true
    });
    ```
4. 在组件内使用 `vm.$nextTick()` 实例方法特别方便，因为它不需要全局 `Vue`，并且回调函数中的 `this` 将自动绑定到当前的 Vue 实例上。
5. 如果不传参回调函数，`Vue.nextTick()` 或 `this.$nextTick()` 会返回一个 promise，resolve 的结果是 nextTick 时的实例。因此也可以使用 `async`/`await` 语法:
    ```js
    methods: {
        updateMessage: async function () {
            this.message = 'updated'
            console.log(this.$el.textContent) // => 'not updated'
            await this.$nextTick()
            console.log(this.$el.textContent) // => 'updated'
        }
    }
    ```
6. 如果传了回调函数，就不会有返回值
    ```js
    let p1 = this.$nextTick();
    console.log(p1); // Promise {<pending>}
    let p2 = this.$nextTick(() => {});
    console.log(p2); // undefined
    ```
    

## References
* [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html)
* [Reactivity in Depth 译文](https://cn.vuejs.org/v2/guide/reactivity.html)
