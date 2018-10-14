# Reactivity System

**该篇内容是对响应式数据绑定的概述和使用注意事项，深入的原理分析在该目录下
Two-wayBinding.md**


## How Changes Are Tracked
1. 当你把一个普通的 JavaScript 对象传给 Vue 实例的`data`选项，Vue 将遍历此对象所有的
属性，并使用`Object.defineProperty`把这些属性全部转为 getter/setter。Vue 实例将代理
对这些属性的访问和设置。
2. 这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访
问和修改时通知变化。
3. 每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之
后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

![Reactivity System](../images/ReactivitySystem.png)


## Change Detection Caveats
1. 受现代 JavaScript 的限制 (而且`Object.observe`也已经被废弃)，Vue 不能检测到对象属
性的添加或删除。因为只有属性的修改才能触发 setter，属性的删除以及子属性的变动都不会触发。
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
2. 由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，所以属性必须在`data`对
象上存在才能让 Vue 转换它，这样才能让它是响应的。
3. Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive
property)。然而它可以使用`Vue.set(object, key, value)`方法将响应属性添加到嵌套的对象
上
```js
Vue.set(vm.someObject, 'b', 2)
```
也可以使用`vm.$set`实例方法，这也是全局`Vue.set`方法的别名：
```js
this.$set(this.someObject, 'b', 2)
```
4. 有时你想向一个已有对象添加多个属性，例如使用`Object.assign()`或`_.extend()`
方法来添加属性。但是，这样添加到对象上的新属性不会触发更新。在这种情况下可以创建一个新的
对象，让它包含原对象的属性和新的属性，之后再用它替换掉原来的属性：
```js
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 });
```


## Declaring Reactive Properties
1. 由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明根级响应式属性，
哪怕先赋一个空值。
2. 这样的限制在背后是有其技术原因的，它消除了在依赖项跟踪系统中的一类边界情况（不懂），
也使 Vue 实例在类型检查系统的帮助下运行的更高效。而且在代码可维护性方面也有一点重要的考
虑：`data`对象就像组件状态的概要，提前声明所有的响应式属性，可以让组件代码在以后重新阅读
或其他开发人员阅读时更易于被理解。


## Async Update Queue
1. Vue 执行 DOM 更新的操作是异步的。
2. 只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如
果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不
必要的计算和 DOM 操作上非常重要。
3. 然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
4. Vue 在内部尝试对异步队列使用原生的`Promise.then`和`MessageChannel`，如果执行环境
不支持，会采用`setTimeout(fn, 0)`代替。
    ```html
    <div id="example">{{ message }}</div>
    ```
    ```js
    var vm = new Vue({
      el: '#example',
      data: {
        message: '123'
      }
    })
    vm.message = 'new message' // change data
    vm.$el.textContent === 'new message' // false
    Vue.nextTick(function () {
      vm.$el.textContent === 'new message' // true
    })
    ```
5. 多数情况我们不需要关心这个过程，但是如果你想在确保 DOM 状态更新之后再执行某个操作，
那么就必须要等到本次事件循环结束。这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员沿着
“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待
Vue 完成更新 DOM ，可以在数据变化之后立即使用`Vue.nextTick(callback)`。这样回调函数在
DOM 更新完成后就会调用。
6. 如果在在组件内，那么使用实例方法`vm.$nextTick()`会更方便，因为它不需要全局 Vue ，并
且回调函数中的`this`将自动绑定到当前的 Vue 实例上
    ```js
      Vue.component('example', {
      template: '<span>{{ message }}</span>',
      data: function () {
        return {
          message: 'not updated'
        }
      },
      methods: {
        updateMessage: function () {
          this.message = 'updated'
          console.log(this.$el.textContent) // => 'not updated'
          this.$nextTick(function () {
            console.log(this.$el.textContent) // => 'updated'
          })
        }
      }
    })
    ```


## References
* [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html#How-Changes-Are-Tracked)
