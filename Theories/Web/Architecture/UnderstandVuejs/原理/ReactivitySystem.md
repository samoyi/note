# Reactivity System

**该篇内容是对响应式数据绑定的概述和使用注意事项，深入的原理分析在当前目录下的 `Two-wayBinding.md`**


<!-- TOC -->

- [Reactivity System](#reactivity-system)
    - [How Changes Are Tracked](#how-changes-are-tracked)
    - [Change Detection Caveats](#change-detection-caveats)
        - [For Objects](#for-objects)
        - [For Arrays](#for-arrays)
    - [Declaring Reactive Properties](#declaring-reactive-properties)
    - [Async Update Queue](#async-update-queue)
        - [异步更新](#异步更新)
        - [处理异步更新的问题](#处理异步更新的问题)
    - [References](#references)

<!-- /TOC -->


## How Changes Are Tracked
1. When you pass a plain JavaScript object to a Vue instance as its `data` option, Vue will walk through all of its properties and convert them to getter/setters using `Object.defineProperty`. Vue 实例将代理对这些属性的访问和设置。
2. The getter/setters are invisible to the user, but under the hood they enable Vue to perform dependency-tracking and change-notification when properties are accessed or modified.
3. Every component instance has a corresponding **watcher** instance, which records any properties “touched” during the component’s render as dependencies. 
4. 这里看起来，watcher 相当于管理订阅者的一个对象，每个订阅者希望监听某个或某几个 `data` 属性或计算属性的变化，watch 会负责把这个订阅者的变化监听回调函数注册到响应的 `data` 属性或计算属性名下。
4. Later on when a dependency’s setter is triggered, it notifies the watcher, which in turn causes the component to re-render.
5. 被依赖的 `data` 属性或者计算属性的 setter 被调用时，该属性之前名下订阅者注册的监听回调就会被调用。

<img src="../images/ReactivitySystem.png" width="600" style="display: block;" />


## Change Detection Caveats
1. 受现代 JavaScript 的限制 (而且 `Object.observe` 也已经被废弃)，Vue 不能检测到对象（包括数组）属性的添加或删除，只有属性的修改才能触发 setter，属性的删除以及子属性的变动都不会触发。
    ```js
    let data = {
        _info: {
            _age: 22,
        },
    };

    Object.defineProperty(data._info, 'age', {
        get(){
            return this._age;
        },
        set(newAge){
            this._age = newAge;
            console.log('modify age');
        },
        enumerable: true,
        configurable: true,
    });

    Object.defineProperty(data, 'info', {
        get(){
            return this._info;
        },
        set(newInfo){
            this._info = newInfo;
            console.log('modify info');
        },
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

### For Objects
1. ，除了不能添加实例的跟级别响应式属性以外，还是可以解决这个问题。
2. Vue does not allow dynamically adding new root-level reactive properties to an already created instance. However, it’s possible to add reactive properties to a nested object using the `Vue.set(object, propertyName, value)` method.
3. Sometimes you may want to assign a number of properties to an existing object, for example using `Object.assign()` or `_.extend()`. However, new properties added to the object will not trigger changes. In such cases, create a fresh object with properties from both the original object and the mixin object:
    ```js
    // Object.assign(this.parent.child, { age: 22, sex: 'female' }); // 不行
    // 下面的可以，因为直接修改了 child 而不是添加属性
    this.parent.child = Object.assign({}, this.parent.child, { age: 22, sex: 'female' }); 
    ```

### For Arrays
1. Vue cannot detect the following changes to an array:
    1. When you directly set an item with the index, e.g. `vm.items[indexOfItem] = newValue`
    2. When you modify the length of the array, e.g. `vm.items.length = newLength`
2. To overcome caveat 1, both of the following will accomplish the same as `vm.items[indexOfItem] = newValue`, but will also trigger state updates in the reactivity system:
    ```js
    // Vue.set
    Vue.set(vm.items, indexOfItem, newValue)
    ```
    ```js
    // Array.prototype.splice
    vm.items.splice(indexOfItem, 1, newValue)
    ```
3. To deal with caveat 2, you can use `splice`:
    ```js
    vm.items.splice(newLength)
    ```


## Declaring Reactive Properties
1. Since Vue doesn’t allow dynamically adding root-level reactive properties, you have to initialize Vue instances by declaring all root-level reactive data properties upfront, even with an empty value.
2. If you don’t declare message in the `data` option, Vue will warn you that the render function is trying to access a property that doesn’t exist.
3. There are technical reasons behind this restriction - it eliminates a class of edge cases in the dependency tracking system, and also makes Vue instances play nicer with type checking systems. 
3. But there is also an important consideration in terms of code maintainability: the data object is like the schema for your component’s state. Declaring all reactive properties upfront makes the component code easier to understand when revisited later or read by another developer.


## Async Update Queue
### 异步更新
1. Vue performs DOM updates asynchronously. 
2. Whenever a data change is observed, it will open a queue and buffer all the data changes that happen in the same event loop. 
3. If the same watcher is triggered multiple times, it will be pushed into the queue only once. 
4. This buffered de-duplication is important in avoiding unnecessary calculations and DOM manipulations. 
5. Then, in the next event loop “tick”, Vue flushes the queue and performs the actual (already de-duped) work. 
6. Internally Vue tries native `Promise.then`, `MutationObserver`, and `setImmediate` for the asynchronous queuing and falls back to `setTimeout(fn, 0)`.
7. For example, when you set `vm.someData = 'new value'`, the component will not re-render immediately. It will update in the next “tick”, when the queue is flushed.


### 处理异步更新的问题
1. Most of the time we don’t need to care about this, but it can be tricky when you want to do something that depends on the post-update DOM state. 
2. Although Vue.js generally encourages developers to think in a “data-driven” fashion and avoid touching the DOM directly, sometimes it might be necessary to get your hands dirty. 
3. In order to wait until Vue.js has finished updating the DOM after a data change, you can use `Vue.nextTick(callback)` immediately after the data is changed. The callback will be called after the DOM has been updated
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
4. There is also the `vm.$nextTick()` instance method, which is especially handy inside components, because it doesn’t need global `Vue` and its callback’s `this` context will be automatically bound to the current Vue instance
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
* [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html) 及 [译文](https://cn.vuejs.org/v2/guide/reactivity.html)
