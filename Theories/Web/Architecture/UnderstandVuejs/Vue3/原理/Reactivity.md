# Reactivity


<!-- TOC -->

- [Reactivity](#reactivity)
    - [需要实现的功能](#需要实现的功能)
    - [实现原理](#实现原理)
    - [Proxy 比 defineProperty 好的地方](#proxy-比-defineproperty-好的地方)
    - [References](#references)

<!-- /TOC -->


## 需要实现的功能
1. 假设希望数据 `A2` 依赖于数据 `A0` 和 `A1`，在 `A0` 或 `A1` 变化是 `A2` 也能响应式的自动变化。为了实现这个功能，我们定义一个 `update` 函数
    ```js
    function update() {
        A2 = A0 + A1
    }
    ```
2. `update` 不是纯函数，它会产生副作用，简称为 **作用（effect）**。
3. A0 和 A1 被视为这个作用的 **依赖 (dependency)**，因为它们的值被用来执行这个作用。因此这次作用也可以说是一个它依赖的 **订阅者 (subscriber)**。
4. 我们需要实现一个功能，能够在 A0 或 A1 这两个依赖变化时调用 `update()` 产生作用。假设该功能实现为 `whenDepsChange` 函数
    ```js
    whenDepsChange(update)
    ```
5. `whenDepsChange` 需要实现两方面的功能，订阅依赖和触发作用：
    * `whenDepsChange` 需要在副作用 `update()` 被首次执行时，感知到里面的依赖项 `A0` 和 `A1`，然后把  `update()` 注册为 `A0` 和 `A1` 的订阅者。
    * 当 `A0` 或 `A1` 变化时，通知它的订阅者 `update()` 执行作用来更新 `A2`。


## 实现原理
1. 看一下 `reactive` 函数的伪代码
    ```js
    function reactive(obj) {
        return new Proxy(obj, {
            get(target, key) {
                track(target, key)
                return target[key]
            },
            set(target, key, value) {
                target[key] = value
                trigger(target, key)
            }
        })
    }
    ```
2. 在 `track()` 内部，我们会检查当前是否有正在运行的副作用。Vue3 源码还不知道，但在 Vue2 中，这个当前正在运行的副作用，就是那个 `Dep.target`
3. 如果有正在运行的副作用，我们会查找到一个存储了所有追踪了该属性的订阅者的 Set，然后将当前这个副作用作为新订阅者添加到该 Set 中
    ```js
    // 这会在一个副作用就要运行之前被设置
    // 我们会在后面处理它
    let activeEffect

    function track(target, key) {
        if (activeEffect) {
            const effects = getSubscribersForProperty(target, key)
            effects.add(activeEffect)
        }
    }
    ```
4. 副作用订阅将被存储在一个全局的 `WeakMap<target, Map<key, Set<effect>>>` 数据结构中。如果在第一次追踪时没有找到对相应属性订阅的副作用集合，它将会在这里新建。
5. 当某个属性被重新设值时，`trigger()` 被触发，我们会查找到所有订阅该属性的副作用，然后执行它们
    ```js
    function trigger(target, key) {
        const effects = getSubscribersForProperty(target, key)
        effects.forEach((effect) => effect())
    }
    ```
6. 现在，当 `update` 函数调用并访问到 `A0` 和 `A1` 时，就会出发它们对应的 `track` 函数收集副作用 `update` 函数；然后 `A0` 和 `A1` 更新时，就会触发它们对应的 `track` 函数来调用副作用函数 `update`，实现响应式的更新 `A2`。


## Proxy 比 defineProperty 好的地方
1. defineProperty 只能代理对象属性的读取和设置，新增删除都不行。尤其是数组方法，Vue2 中为此单独包装了一组数组操作。
2. Proxy 可以代理对象的很多操作，包括新增和删除。所以同时对数组项的增删也可以代理。
3. 而且新增的属性也会自动实现响应式，而不需要用 `Vue.set`
    ```js
    const proxy = reactive({})

    const raw = {}
    // 新添加了一个属性，并引用一个对象。但引用的不是 raw 本身，而是 raw 的代理
    // 新添加的嵌套的引用类型属性也会自动的使用 proxy 实现响应式
    proxy.nested = raw

    console.log(proxy.nested === raw) // false
    ```


## References
* [深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)