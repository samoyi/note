# Reactivity System

**该篇内容是对响应式数据绑定的概述和使用注意事项，深入的原理分析在该目录下
Two-wayBinding.md**


## How Changes Are Tracked
1. When you pass a plain JavaScript object to a Vue instance as its `data`
option, Vue will walk through all of its properties and convert them to
getter/setters using `Object.defineProperty`.
2. The getter/setters are invisible to the user, but under the hood they enable
Vue to perform dependency-tracking and change-notification when properties are
accessed or modified.
3. Every component instance has a corresponding **watcher** instance, which
records any properties “touched” during the component’s render as dependencies.
Later on when a dependency’s setter is triggered, it notifies the watcher, which
 in turn causes the component to re-render.

![Reactivity System](../images/ReactivitySystem.png)


## Change Detection Caveats
1. Due to the limitations of modern JavaScript (and the abandonment of
`Object.observe`), Vue **cannot detect property addition or deletion**. 因为只有
属性的修改才能触发 setter，属性的删除以及子属性的变动都不会触发。
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
2. Since Vue performs the getter/setter conversion process during instance
initialization, a property must be present in the data object in order for Vue
to convert it and make it reactive.
3. Vue does not allow dynamically adding new root-level reactive properties to
an already created instance. However, it’s possible to add reactive properties
to a nested object using the `Vue.set(object, key, value)` method:
```js
Vue.set(vm.someObject, 'b', 2)
```
You can also use the `vm.$set` instance method, which is an alias to the global
`Vue.set`:
```js
this.$set(this.someObject, 'b', 2)
```
4. Sometimes you may want to assign a number of properties to an existing object
, for example using `Object.assign()` or `_.extend()`. However, new properties
added to the object will not trigger changes. In such cases, create a fresh
object with properties from both the original object and the mixin object, then
replace the original object with this fresh object:
```js
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 });
```


## Declaring Reactive Properties
1. Since Vue doesn’t allow dynamically adding root-level reactive properties,
you have to initialize Vue instances by declaring all root-level reactive data
properties upfront, even with an empty value.
2. If you don’t declare message in the data option, Vue will warn you that the
render function is trying to access a property that doesn’t exist.
3. There are technical reasons behind this restriction - it eliminates a class
of edge cases in the dependency tracking system, and also makes Vue instances
play nicer with type checking systems. But there is also an important
consideration in terms of code maintainability: the data object is like the
schema for your component’s state. Declaring all reactive properties upfront
makes the component code easier to understand when revisited later or read by
another developer.


## Async Update Queue
1. In case you haven’t noticed yet, Vue performs DOM updates asynchronously.
2. Whenever a data change is observed, it will open a queue and buffer all the
data changes that happen in the same event loop.
3. If the same watcher is triggered multiple times, it will be pushed into the
queue only once. This buffered de-duplication is important in avoiding
unnecessary calculations and DOM manipulations.
4. Then, in the next event loop “tick”, Vue flushes the queue and performs the
actual (already de-duped) work.
5. Internally Vue tries native `Promise.then` and `MessageChannel` for the
asynchronous queuing and falls back to `setTimeout(fn, 0)`.
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
6. There is also the `vm.$nextTick()` instance method, which is especially handy
 inside components, because it doesn’t need global Vue and its callback’s `this`
  context will be automatically bound to the current Vue instance:
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
