# observer


<img src="./pattern.png" style="display: block;" />


<!-- TOC -->

- [observer](#observer)
    - [相关信息](#相关信息)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [发布-订阅模式的要素](#发布-订阅模式的要素)
        - [订阅者](#订阅者)
        - [发布者](#发布者)
    - [整体流程](#整体流程)
    - [主要模块](#主要模块)
        - [`Observer`](#observer)
        - [`Dep`](#dep)
        - [`Watcher`](#watcher)
        - [从单词语义上看 `Watcher` 和 `Observer` 的命名](#从单词语义上看-watcher-和-observer-的命名)
    - [`Dep.target` 的作用](#deptarget-的作用)
    - [实现](#实现)
        - [实现数据响应式](#实现数据响应式)
            - [初始化](#初始化)
            - [响应式化](#响应式化)
        - [第一步：使用 `Dep` 类把 data 属性改造为 publisher，设置 getter 和 setter](#第一步使用-dep-类把-data-属性改造为-publisher设置-getter-和-setter)
        - [第二步：`Watcher` 求值，触发 data 属性的 getter](#第二步watcher-求值触发-data-属性的-getter)
        - [第三步：data 属性的 getter 中，`Dep` 获取当前 `Watcher`，并传递自己](#第三步data-属性的-getter-中dep-获取当前-watcher并传递自己)
        - [第四步： `Watch` 判断如果需要订阅，就调用 `Dep` 的 `addSub` 方法，让自己订阅 `Dep` 的更新](#第四步-watch-判断如果需要订阅就调用-dep-的-addsub-方法让自己订阅-dep-的更新)
    - [References](#references)

<!-- /TOC -->


## 相关信息
* 源码版本：2.5.2
* 文件路径：
    * `src/core/observer/`
    * `src/core/instance/state.js`


## 设计思想


## 本质


## 发布-订阅模式的要素
### 订阅者
* 变动回调函数：依赖的数据发生变化后，发布者会调用这个函数，里面的逻辑是订阅者针对数据变动做出相应的改变。
* 对发布者的引用：需要引用到发布者的订阅函数，把自己的变动回调函数传递给发布者。

### 发布者
* 订阅者列表：保存每个订阅者的变动回调函数。
* 订阅函数：接受订阅者的变动回调函数并保存进订阅者列表。
* 通知函数：订阅者依赖的数据发生变动后，依次调用订阅者列表里每个订阅者的变动回调函数，并传递新的数据值。


## 整体流程
<img src="../../images/ReactivitySystem.png" width="600" style="display: block; background-color: #fff; margin: 5px 0 10px 0;" />

1. **实现发布者**：为每个依赖的数据构造一个发布者，依赖的数据发生变化后通知订阅者。发布者由 `Dep` 类实现。
2. **实现数据响应式**：要获得依赖数据的变化事件，如果让发布者轮询显然不合适，所以需要让数据变动时主动通知发布者。数据响应由 `Observer` 类实现。
3. **实现订阅者**：每一个依赖该数据的对象，要先把自己变成一个订阅者实例。订阅者由 `Watcher` 类实现。
4. **订阅依赖**：订阅者向发布者订阅数据变动。订阅时需要调用发布者的订阅函数并传递订阅者，但这个调用是由 `Observer` 发起的。下述原因。
5. **响应数据变动**：依赖的数据变化后，`Observer` 实现的机制会让发布者者获得变化通知，发布者从自己的订阅者列表里找到所有的订阅者，依次调用它们的回调函数。


## 主要模块
### `Observer`
1. 位于 `core/observer/index.js` 中的 `Observer` 类。
2. Observe 一个 vue 实例，也就是将它的 data 对象里面的属性转换为访问器属性。
3. 通过使用 Dep 模块，将每一个属性设置为 publisher，从而实现在其值更新的时候通知依赖，也就是实现响应式。

### `Dep`
1. 位于 `core/observer/dep.js`
2. 相当于 Publisher & Subscriber 模式的 Publisher。
3. 每一个被依赖的属性都有一个对应的 `Dep` 实例，管理着订阅者们（`Watcher`）对该属性的订阅操作和属性值更新后通知订阅者。

### `Watcher`
1. 位于 `core/observer/watcher.js`
2. 相当于 Publisher & Subscriber 模式的 Subscriber。
3. 管理一个表达式，确定它依赖哪些 `Dep` 并结合相应的 `Dep` 进行订阅。

### 从单词语义上看 `Watcher` 和 `Observer` 的命名
1. 来自这个 [视频](https://www.youtube.com/watch?v=X864N8H9OCg) 的解释：
    * Watch: To look at something or someone for a time, paying attention to what happens.
    * Observe: To watch something or someone carefully, especially to learn more about them.
2. 所以 `Watcher` 只是一直盯着看有没有变化，而 `Observer` 除了观察以外，还要深入其中去给数据设置 getter 和 setter。


## `Dep.target` 的作用
1. 引用当前的 watcher
2. 只对有 watcher 的属性进行响应式化


## 实现
1. 我们举例假设有一个计算属性内部依赖了两个 data 属性，来看看这个依赖关系是怎么绑定的。
2. 计算属性是 subscriber，对应 `Watcher`；data 属性是 publisher，对应 `Dep`。

### 实现数据响应式
#### 初始化
1. 最初通过 `src/core/instance/state.js` 中的 `initState` 方法调用，`initState` 进一步调用 `initData` 方法。
2. `initData` 会对实例的 `data` 进行一些处理，然后交给 `Observer` 进行响应式化并订阅依赖
```js
// src/core/instance/state.js

function initData(vm: Component) {
    // 获取实例的 data 属性
    let data = vm.$options.data;

    // 该属性可能直接是个简单对象，也可能是一个返回简单对象的函数。如果是函数的话就调用并获得简单对象。
    data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};

    // data 如果是函数必须要返回一个简单对象
    // 如果不是简单对象，会被赋值为一个空的简单对象
    if ( !isPlainObject(data) ) {
        data = {};
        process.env.NODE_ENV !== "production" &&
            warn(
                "data functions should return an object:\n" +
                    "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
                vm
            );
    }

    // proxy data on instance
    const keys = Object.keys(data);
    const props = vm.$options.props;
    const methods = vm.$options.methods;
    let i = keys.length;
    // 遍历 data 对象
    while (i--) {
        const key = keys[i];

        // 不能定义和 data 属性名同名的 method
        if (process.env.NODE_ENV !== "production") {
            if (methods && hasOwn(methods, key)) {
                warn(
                    `Method "${key}" has already been defined as a data property.`,
                    vm
                );
            }
        }

        // 不能定义和 data 属性名同名的 prop
        if (props && hasOwn(props, key)) {
            process.env.NODE_ENV !== "production" &&
                warn(
                    `The data property "${key}" is already declared as a prop. ` +
                        `Use prop default value instead.`,
                    vm
                );
        } 
        // 属性名不能使保留字
        else if (!isReserved(key)) {
            // 将 _data 上面的属性代理到了 vm 实例上
            proxy(vm, `_data`, key);
        }
    }
    // observe data
    observe(data, true /* asRootData */);
}
```

#### 响应式化


### 第一步：使用 `Dep` 类把 data 属性改造为 publisher，设置 getter 和 setter
1. Vue 响应式系统的 publisher 是通过 `Dep` 类实现的，因此在编译 `data` 时，会为每一个属性实例化一个 `Dep`。
2. 将该 data 属性改造为访问器属性，getter 里负责绑定和 `Watcher` 的依赖关系，setter 负责在值变化时通知依赖该属性的 `Watcher`。
3. 应该是只在一个 data 属性初始化的时候才会执行绑定，而不是每次访问该属性都绑定。不过目前还没看到这个判断逻辑。

```js
// observer/index.js

export function defineReactive (
    obj: Object,
    key: string,
    val: any,
    customSetter?: ?Function,
    shallow?: boolean)
{
    // 为每个数据属性创建一个 publisher，所有依赖该数据属性的 subscriber 都会订阅这个 publisher
    const dep = new Dep()

    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    const getter = property && property.get

    if (!getter && arguments.length === 2) {
        val = obj[key]
    }

    const setter = property && property.set

    let childOb = !shallow && observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            const value = getter ? getter.call(obj) : val
            // Dep.target 如果有对象，就说明当前有一个 watcher 正在求值。应该是可以通过这个判断只在初始化时进行绑定
            if (Dep.target) {
                // 绑定和 watcher 的依赖关系
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter (newVal) {
            const value = getter ? getter.call(obj) : val
            /* eslint-disable no-self-compare */
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            /* eslint-enable no-self-compare */
            if (process.env.NODE_ENV !== 'production' && customSetter) {
                customSetter()
            }
            if (setter) {
                setter.call(obj, newVal)
            }
            else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)

            // 值变化时通知依赖该属性的 watcher
            dep.notify()
        }
    })
}
```

### 第二步：`Watcher` 求值，触发 data 属性的 getter
1. 对计算属性进行求值，也就是执行计算属性的函数，因此就会访问到里面的两个作为 `Dep` 的 data 属性，进而触发 data 属性的 getter。
2. 看一下 `Watcher` 的求值函数
    ```js
    // watcher.js

    get () {
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        }
        catch (e) {
            if (this.user) {
                handleError(e, vm, `getter for watcher "${this.expression}"`)
            }
            else {
                throw e
            }
        }
        finally {
            if (this.deep) {
                traverse(value)
            }
            popTarget()
            this.cleanupDeps()
        }
        return value
    }
    ```
3. 注意第一步的 `pushTarget`，会把当前 `Watcher` 设为全局可以见的 `Dep.target`。那么前面 getter 里面你的 `if (Dep.target)` 就会判定为真。
4. 同时，`Dep.target` 还会告诉它依赖的两个 `Dep`，当前是哪个 `Watcher` 在求值。这样，两个 `Dep` 就会知道要让哪个 `Watcher` 订阅自己。在下面的第三步可以看，`Dep` 会通过 `Dep.target` 获得当前是哪个 `Watcher` 在求值。
5. 接下来，`this.getter.call(vm, vm)` 会对该 `Watcher` 的表达式求值，在这个过程中就会触发两个 `Dep` 的 getter。
    ```js
    // observer/index.js
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            const value = getter ? getter.call(obj) : val
            // 此时 Dep.target 已经有值
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter (newVal) {
            // 省略
        }
    })
    ```
6. getter 里面关键操作，就是 `dep.depend()`。它会开始这时依赖绑定关系，进入第三步的行为。

### 第三步：data 属性的 getter 中，`Dep` 获取当前 `Watcher`，并传递自己
1. 作为 Publisher 的 `Dep` 对象调用 `depend` 方法。
2. `depend` 方法通过 `Dep.target` 找到当前需要进行绑定 `Watcher` 对象。
3. 调用该 `Watcher` 的 `addDep` 方法，并传递自己（`Dep` 对象）。

```js
// dep.js
depend () {
    if (Dep.target) {
        Dep.target.addDep(this)
    }
}
```

### 第四步： `Watch` 判断如果需要订阅，就调用 `Dep` 的 `addSub` 方法，让自己订阅 `Dep` 的更新
1. 上一步，`Dep` 通过 `Watcher` 的 `addDep` 方法把自己传递给了 `Watcher`。
2. `Watcher` 在自己的 `addDep` 方法中获得了该 `Dep`，它再调用该 `Dep` 的 `addSub` 并传递自己，让 `Dep` 把自己加入到 subscriber 列表里。
    ```js
    // watcher.js
    addDep (dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }
    ```
3. 具体的订阅方法
    ```js
    // dep.js
    addSub (sub: Watcher) {
        this.subs.push(sub)
    }
    ```
4. 注意到，其实第三步的时候，`Dep` 就已经获得了当前的 `Watcher`，但它并没有直接 `addSub`，而是先把自己传给 `Watcher`，再让 `Watcher` 调用自己的 `addSub` 方法。虽然还不知道具体的原理，但这样折腾一下，应该就是因为要进行 `addDep` 里面的两层判断。虽然获得了 `Watcher`，但也不能直接添加，还是要在 `Watcher` 里判断一下是否满足添加的条件。


## References
* [Vue原理解析之observer模块](https://segmentfault.com/a/1190000008377887)
* [learnVue](https://github.com/answershuto/learnVue)
