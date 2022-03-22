# Instance Lifecycle


<!-- TOC -->

- [Instance Lifecycle](#instance-lifecycle)
    - [Misc](#misc)
    - [整体流程](#整体流程)
        - [`beforeCreate` 之前——基本初始化](#beforecreate-之前基本初始化)
        - [`created` 之前——初始化实例，实现响应式](#created-之前初始化实例实现响应式)
        - [`beforeMount` 之前——模板编译为渲染函数](#beforemount-之前模板编译为渲染函数)
        - [`mounted` 之前——依赖收集；生成虚拟 DOM 并挂载](#mounted-之前依赖收集生成虚拟-dom-并挂载)
        - [从数据更新到 `beforeUpdate` 之前——数据更新，虚拟 DOM 还没有更新](#从数据更新到-beforeupdate-之前数据更新虚拟-dom-还没有更新)
        - [`updated` 之前——虚拟 DOM 更新，然后 patch 实现重渲染](#updated-之前虚拟-dom-更新然后-patch-实现重渲染)
        - [`beforeDestroy` 之前——准备销毁实例](#beforedestroy-之前准备销毁实例)
        - [`destroyed` 之前——销毁实例](#destroyed-之前销毁实例)
    - [实例生命周期](#实例生命周期)
        - [第一步 实例初始化](#第一步-实例初始化)
            - [该阶段结束后的钩子函数——`beforeCreate`](#该阶段结束后的钩子函数beforecreate)
        - [第二步 创建实例](#第二步-创建实例)
            - [该阶段结束后的钩子函数——`created`](#该阶段结束后的钩子函数created)
        - [第三阶段 将模板编译为渲染函数](#第三阶段-将模板编译为渲染函数)
            - [该阶段结束后的钩子函数——`beforeMount`](#该阶段结束后的钩子函数beforemount)
        - [第四阶段 挂载](#第四阶段-挂载)
            - [该阶段结束后的钩子函数——`mounted`](#该阶段结束后的钩子函数mounted)
        - [第五阶段 数据更新](#第五阶段-数据更新)
        - [第六阶段 虚拟 DOM 更新和重渲染](#第六阶段-虚拟-dom-更新和重渲染)
        - [第七阶段 准备销毁实例](#第七阶段-准备销毁实例)
        - [第八阶段 销毁实例](#第八阶段-销毁实例)
    - [父子组件生命周期顺序](#父子组件生命周期顺序)
    - [同辈组件生命周期顺序](#同辈组件生命周期顺序)
    - [Mixin hooks 的顺序](#mixin-hooks-的顺序)
    - [与自定义指令钩子函数相比的执行顺序](#与自定义指令钩子函数相比的执行顺序)
    - [References](#references)

<!-- /TOC -->


**看这篇笔记前，要先看懂这一篇：**
`Theories\Web\Architecture\UnderstandVuejs\原理\Two-wayBinding.md`  
本篇中提到的以下四个模块都出自这篇笔记：`Compiler`、`Publisher`、`Observer`和`Subscriber`

<img src="../images/lifecycle.png" width="600" style="display: block; margin: 5px 0 10px;" />


## Misc
* 同辈组件生命周期顺序和预想的不一样，应该要看源码才能理解
* 前面的钩子函数内部抛出错误，后面的钩子函数仍然会被执行，不知道内部是什么机制
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        beforeCreate(){
            throw new Error('beforeCreate'); // 这里会抛出一个错误
        },
        mounted(){
            console.log('mounted')； // 但这里仍然会打印
        }
    });
    ```

## 整体流程
### `beforeCreate` 之前——基本初始化
创建实例之间的一些初始化工作

### `created` 之前——初始化实例，实现响应式
1. 处理实例的各个属性，创建实例。
2. Observe 实例 `data` 属性，对其中的数据进行响应化。

### `beforeMount` 之前——模板编译为渲染函数
将模板编译为渲染函数，分为以下三大步骤：
1. 将模板编译为 AST；
2. AST 进行静态子树优化；
3. 用优化后的 AST 生成渲染函数。

### `mounted` 之前——依赖收集；生成虚拟 DOM 并挂载
1. 渲染函数被调用，主要完成两件事：
    * 调用过程会 touch 到模板依赖的数据，实现依赖订阅；
    * 调用结束后生成虚拟 DOM。
2. 根据虚拟 DOM 进行挂载，也就是生成真实 DOM。

### 从数据更新到 `beforeUpdate` 之前——数据更新，虚拟 DOM 还没有更新
1. 数据更新触发 setter，Dep 通知到 watcher。
2. 一般是异步更新，watcher 加入到更新队列，在 nextTick 时 flush 掉更新队列。
3. flush 的时候，看起来一个 vm 实例只会有一个总的 watcher，而不是几个订阅者就有几个 watcher。
4. 在队列中该实例的 watcher 调用更新方法前，会调用该实例的 `beforeUpdate` 函数。

### `updated` 之前——虚拟 DOM 更新，然后 patch 实现重渲染
1. 每个实例的 watcher 调用完 `beforeUpdate` 后就进行实际的更新 patch。
2. 异步队列中所有实例的 watcher 都 patch 完后，再一次调用每个实例的 `updated` 函数。

### `beforeDestroy` 之前——准备销毁实例
1. 实例的 `$destroy()` 被调用后进入销毁阶段。
2. `beforeDestroy` 钩子被调用前就只做了一件事，通过 `vm._isBeingDestroyed` 判断该是是否正在被销毁，是的话直接返回。

### `destroyed` 之前——销毁实例
1. 删除和修改与该实例相关的东西，比如
    * 从父实例中移除当前实例，同时销毁子实例
    * 解除和所有订阅者的关系
    * 更新 DOM，取消事件绑定
2. 之后调用 `destroyed` 钩子。


## 实例生命周期
### 第一步 实例初始化
1. 看一下 `/src/core/instance/index.js` 的代码
    ```js
    import { initMixin } from './init'
    import { stateMixin } from './state'
    import { renderMixin } from './render'
    import { eventsMixin } from './events'
    import { lifecycleMixin } from './lifecycle'
    import { warn } from '../util/index'

    function Vue (options) {
        if (process.env.NODE_ENV !== 'production' &&
            !(this instanceof Vue)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword')
        }
        this._init(options)
    }

    initMixin(Vue)
    stateMixin(Vue)
    eventsMixin(Vue)
    lifecycleMixin(Vue)
    renderMixin(Vue)

    export default Vue
    ```
2. 初始化是通过构造函数中的 `this._init(options)` 发起的，而 `_init` 是在 `initMixin` 中定义的。看看 `initMixin` 的代码
    ```js
    // `/src/core/instance/init.js`

    export function initMixin (Vue: Class<Component>) {
        // options 是 new Vue(options) 中的 options 对象
        Vue.prototype._init = function (options?: Object) {
            const vm: Component = this
            // a uid
            vm._uid = uid++ // 全局实例 id

            let startTag, endTag
            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                startTag = `vue-perf-start:${vm._uid}`
                endTag = `vue-perf-end:${vm._uid}`
                mark(startTag)
            }

            // a flag to avoid this being observed
            vm._isVue = true
            // merge options
            if (options && options._isComponent) {
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                initInternalComponent(vm, options)
            } 
            else {
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                )
            }
            /* istanbul ignore else */
            if (process.env.NODE_ENV !== 'production') {
                initProxy(vm)
            } 
            else {
                vm._renderProxy = vm
            }
            // expose real self
            vm._self = vm
            initLifecycle(vm)
            initEvents(vm)
            initRender(vm)
            callHook(vm, 'beforeCreate') // beforeCreate 钩子被调用
            initInjections(vm) // resolve injections before data/props
            initState(vm)
            initProvide(vm) // resolve provide after data/props
            callHook(vm, 'created') // created 钩子被调用

            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                vm._name = formatComponentName(vm, false)
                mark(endTag)
                measure(`vue ${vm._name} init`, startTag, endTag)
            }

            if (vm.$options.el) {
                vm.$mount(vm.$options.el)
            }
        }
    }
    ```
3. 可以看到里面有一组初始化的操作，然后其间调用了 `beforeCreate` 和 `created` 两个钩子函数。也就是说 `initMixin` 中包含了实例初始化和实例创建的内容。

#### 该阶段结束后的钩子函数——`beforeCreate`
1. 实例初始化之后同步的调用该钩子函数，调用之后才会初始化实例的选项
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        beforeCreate(){
            console.log(this.num1); // undefined
        },
    });
    ```
2. `beforeCreate` 之后的 `initState`，才会初始化实例上常见的属性，并进行 observe。

### 第二步 创建实例
1. 从 `initMixin` 中可以看出来，在初始化之后到实例创建完成之间，进行了三个初始化的工作。其中比较重要的是 `initState`。源码如下
    ```js
    export function initState(vm: Component) {
        vm._watchers = [];
        const opts = vm.$options;
        if (opts.props) initProps(vm, opts.props);
        if (opts.methods) initMethods(vm, opts.methods);
        if (opts.data) {
            initData(vm);
        } 
        else {
            observe((vm._data = {}), true /* asRootData */);
        }
        if (opts.computed) initComputed(vm, opts.computed);
        if (opts.watch && opts.watch !== nativeWatch) {
            initWatch(vm, opts.watch);
        }
    }
    ```  
2. 这一阶段将处理创建实例时的配置，进而完成创建实例。包括：
    * 处理实例 data 属性的时候实现 data observation。也就是 Observer 模块使用 setter、getter 劫持了实例数据。
    * 处理了 computed properties, methods, watch/event callbacks。
3. 这一阶段还不涉及模板编译，只是纯 JS 的部分。所以实例的 `$el` 也还不可用。
4. 创建实例结束后触发钩子函数 `created`。

#### 该阶段结束后的钩子函数——`created`
1. 既然已经创建完成，所以实例上的各种属性都可访问
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        methods: {
            foo () {
                return 22
            },
        },
        beforeCreate () {
            console.log(this.num1); // undefined
            console.log(this.foo); // undefined
            console.log(Object.getOwnPropertyDescriptor(this, 'num1')); // undefined
        },
        created(){
            console.log(this.num1); // 22
            console.log(this.foo); // ƒ foo(){return 22}
            // 已经完成了 data observation
            console.log(Object.getOwnPropertyDescriptor(this, 'num1'));
            // {get: ƒ, set: ƒ, enumerable: true, configurable: true}
            console.log(this.$el); // undefined  仍未编译模板
        },
    });
    ```
2. 之所以可以直接在 vm 实例上访问到 `data` 上的数据，是因为 `initData` 函数中将 `data` 上的数据代理到了 vm 实例上。

### 第三阶段 将模板编译为渲染函数
1. `initMixin` 最后会调用 vm 实例的 `$mount` 方法，`$mount` 定义在 `/src/platforms/web/entry-runtime-with-compiler.js` 中，该模块内容如下
    ```js
    /* @flow */

    import config from 'core/config'
    import { warn, cached } from 'core/util/index'
    import { mark, measure } from 'core/util/perf'

    import Vue from './runtime/index'
    import { query } from './util/index'
    import { compileToFunctions } from './compiler/index'
    import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

    const idToTemplate = cached(id => {
        const el = query(id)
        return el && el.innerHTML
    })

    // 下面这行 $mount 定义在 /src/platforms/web/runtime/index.js
    // 在下面新定义的 $mount 还会调用这个方法。不懂
    const mount = Vue.prototype.$mount
    
    Vue.prototype.$mount = function (
        el?: string | Element,
        hydrating?: boolean
    ): Component {
        el = el && query(el)

        /* istanbul ignore if */
        if (el === document.body || el === document.documentElement) {
            process.env.NODE_ENV !== 'production' && warn(
            `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
            )
            return this
        }

        const options = this.$options
        // resolve template/el and convert to render function
        // 把模板编译为渲染函数
        if (!options.render) {
            let template = options.template
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template)
                        /* istanbul ignore if */
                        if (process.env.NODE_ENV !== 'production' && !template) {
                            warn(
                            `Template element not found or is empty: ${options.template}`,
                            this
                            )
                        }
                    }
                } 
                else if (template.nodeType) {
                    template = template.innerHTML
                } 
                else {
                    if (process.env.NODE_ENV !== 'production') {
                        warn('invalid template option:' + template, this)
                    }
                    return this
                }
            } 
            else if (el) {
                template = getOuterHTML(el)
            }
            if (template) {
                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                    mark('compile')
                }

                const { render, staticRenderFns } = compileToFunctions(template, {
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                }, this)
                options.render = render
                options.staticRenderFns = staticRenderFns

                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                    mark('compile end')
                    measure(`vue ${this._name} compile`, 'compile', 'compile end')
                }
            }
        }
        return mount.call(this, el, hydrating)
    }

    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     */
    function getOuterHTML (el: Element): string {
        if (el.outerHTML) {
            return el.outerHTML
        } 
        else {
            const container = document.createElement('div')
            container.appendChild(el.cloneNode(true))
            return container.innerHTML
        }
    }

    Vue.compile = compileToFunctions

    export default Vue
    ```
2. 可以看到上面的内容就是在将模板编译为渲染函数。编译完成后调用之前的 `$mount`，该方法会进一步调用 `/src/core/instance/lifecycle.js` 中的 `mountComponent` 函数。源码如下
    ```js
    export function mountComponent (
        vm: Component,
        el: ?Element,
        hydrating?: boolean
    ): Component {
        vm.$el = el
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode
            if (process.env.NODE_ENV !== 'production') {
                /* istanbul ignore if */
                if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                    vm.$options.el || el) {
                    warn(
                    'You are using the runtime-only build of Vue where the template ' +
                    'compiler is not available. Either pre-compile the templates into ' +
                    'render functions, or use the compiler-included build.',
                    vm
                    )
                } 
                else {
                    warn(
                    'Failed to mount component: template or render function not defined.',
                    vm
                    )
                }
            }
        }
        callHook(vm, 'beforeMount')

        let updateComponent
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
            updateComponent = () => {
                const name = vm._name
                const id = vm._uid
                const startTag = `vue-perf-start:${id}`
                const endTag = `vue-perf-end:${id}`

                mark(startTag)
                const vnode = vm._render()
                mark(endTag)
                measure(`vue ${name} render`, startTag, endTag)

                mark(startTag)
                vm._update(vnode, hydrating)
                mark(endTag)
                measure(`vue ${name} patch`, startTag, endTag)
            }
        } 
        else {
            updateComponent = () => {
                vm._update(vm._render(), hydrating)
            }
        }

        // we set this to vm._watcher inside the watcher's constructor
        // since the watcher's initial patch may call $forceUpdate (e.g. inside child
        // component's mounted hook), which relies on vm._watcher being already defined
        new Watcher(vm, updateComponent, noop, {
            before () {
                if (vm._isMounted && !vm._isDestroyed) {
                    callHook(vm, 'beforeUpdate')
                }
            }
        }, true /* isRenderWatcher */)
        hydrating = false

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        if (vm.$vnode == null) {
            vm._isMounted = true
            callHook(vm, 'mounted')
        }
        return vm
    }
    ```
3. 因为已经有了 `render`，所以会直接触发 `beforeMount` 钩子函数。可以看到 `mounted` 钩子也会在 `mountComponent` 里触发。
4. 编译模板不会涉及真实 DOM，所以真实的 DOM 并不会更新，下面的例子中，虽然这时 `this.$el` 已经指向了实际的 DOM 节点，但该节点还是没有被更新渲染过的。
5. `beforeMount` 钩子在服务器端渲染期间不被调用。因为涉及挂载的两个钩子函数在服务端渲染期间不会被调用，所以他们不能用于获取数据这样的操作。这样的操作应该在 `created()` 中进行。
4. 模板编译完成后触发 `beforeMount`，渲染函数准备首次调用来进行渲染。

#### 该阶段结束后的钩子函数——`beforeMount`
```html
<div id="components-demo">
    {{ num1 }}
</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    methods: {
        foo(){return 22},
    },
    beforeMount(){
        // 该阶段之后才会渲染真实的 HTML
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     {{ num1 }}
        // </div>

        console.log(this.$el.__vue__); // undefined  尚未挂载
    },
});
```

### 第四阶段 挂载
1. 调用渲染函数生成编译好的虚拟节点，然后再根据虚拟节点生成编译好的 DOM 节点，更新模板里的 DOM 节点。上面 `mountComponent` 函数中，`beforeMount` 之后就进入了这一阶段。
2. 里面最主要就是通过 `vm._render()` 生成虚拟节点 `vnode`，然后再把 `vnode` 传给 `vm._update`。
3. `vm._render` 的实现在 `/src/core/instance/render.js`，可以看到最后返回的是 `vnode`；`vm._update` 的实现也在 `/src/core/instance/lifecycle.js`，源码如下
    ```js
    Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
        const vm: Component = this
        // 现在的 vm.$el 还是没有更新的节点，例如上面例子中还带有花括号语法的节点
        const prevEl = vm.$el
        const prevVnode = vm._vnode
        const restoreActiveInstance = setActiveInstance(vm)
        vm._vnode = vnode
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        // 下面 vm.__patch__ 会用渲染函数生成的 vnode 编译出更新后的节点，替换（这个叫做挂载？） vm.$el，
        // 也就是替换掉里面的花括号语法和指令之类的，生成预期效果的节点
        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
        } else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode)
        }
        restoreActiveInstance()
        // update __vue__ reference
        if (prevEl) {
            prevEl.__vue__ = null
        }
        if (vm.$el) {
            vm.$el.__vue__ = vm
        }
        // if parent is an HOC, update its $el as well
        if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
            vm.$parent.$el = vm.$el
        }
        // updated hook is called by the scheduler to ensure that children are
        // updated in a parent's updated hook.
    }
    ```
4. 最后，`mountComponent` 会触发 `mounted` 钩子。
5. `mounted` 触发时只保证该组件已经被挂载，但不保证它的所有子组件也已经被挂载。如果你要确保它的子组件都已经挂载，就要在该钩子函数里使用 `vm.$nextTick`
    ```js
    mounted: function () {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
        })
    }
    ```
    看起来的意思就是在本次执行周期内，它的所有子组件也都会完成 mounting
5. `mounted` 钩子在服务器端渲染期间不被调用。

#### 该阶段结束后的钩子函数——`mounted`
```html
<div id="components-demo">
    {{ num1 }}
</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    methods: {
        foo () {
            return 22;
        },
    },
    beforeMount(){
        // 该阶段之后才会渲染真实的 HTML
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     {{ num1 }}
        // </div>

        console.log(this.$el.__vue__); // undefined  尚未挂载
    },
    mounted(){
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     22
        // </div>
        
        // 已经把 vue 实例挂载到元素上了
        console.log(this.$el.__vue__ === this); // true
    },
});
```

### 第五阶段 数据更新
1. 当有数据更新时，会触发数据属性的 getter。如果该数据更新将影响 DOM，则进入该阶段。
2. 可以看到，`beforeUpdate` 钩子函数的触发也是定义在 `mountComponent` 函数里的
    ```js
    new Watcher(vm, updateComponent, noop, {
        before () {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate')
            }
        }
    }, true /* isRenderWatcher */)
    ```
3. 通过注册一个 watcher 实例来监听当前实例中 `updateComponent` 依赖的变化，如果 `updateComponent` 依赖的值变化，`updateComponent` 则会重新调用，也就是更新节点。
4. 注意实例化 watcher 是是将钩子函数的调用定义再来 `before` 参数中。参考 `/src/core/observer/scheduler.js` 中的 `flushSchedulerQueue` 函数，在实际调用 `watcher.run` 更新前，会先调用 `watcher.before`。所以这里的 `beforeUpdate` 钩子会在实际更新之前调用
    ```js
    /**
     * Flush both queues and run the watchers.
     */
    function flushSchedulerQueue () {
        flushing = true
        let watcher, id

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort((a, b) => a.id - b.id)

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index]
            if (watcher.before) {
                watcher.before()
            }
            id = watcher.id
            has[id] = null
            watcher.run()
            // in dev build, check and stop circular updates.
            if (process.env.NODE_ENV !== 'production' && has[id] != null) {
                circular[id] = (circular[id] || 0) + 1
                if (circular[id] > MAX_UPDATE_COUNT) {
                    warn(
                    'You may have an infinite update loop ' + (
                        watcher.user
                        ? `in watcher with expression "${watcher.expression}"`
                        : `in a component render function.`
                    ),
                    watcher.vm
                    )
                    break
                }
            }
        }

        // keep copies of post queues before resetting state
        const activatedQueue = activatedChildren.slice()
        const updatedQueue = queue.slice()

        resetSchedulerState()

        // call component updated and activated hooks
        callActivatedHooks(activatedQueue)
        callUpdatedHooks(updatedQueue)

        // devtool hook
        /* istanbul ignore if */
        if (devtools && config.devtools) {
            devtools.emit('flush')
        }
    }

    function callUpdatedHooks (queue) {
        let i = queue.length
        while (i--) {
            const watcher = queue[i]
            const vm = watcher.vm
            if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
               callHook(vm, 'updated')
            }
        }
    }
    ```
5. 不影响 DOM 的更新不会进入该阶段，不会触发涉及更新的两个钩子函数。
6. 所谓影响 DOM 更新，包括所有影响的情况，可见的和不可见的。可见的例如直接渲染出数据的值，在某个影响更新的计算属性中用到该数据，用到该数据的涉及渲染的指令（例如以该数据为长度进行 `v-for`）。不可见的目前只发现了一个，就是不涉及渲染的指令用到了该数据。
    ```html
    <div id="app" v-foo="age">
		{{name}}
	</div>
    ```
    ```js
    new Vue({
    	el: '#app',
    	data: {
    		age: 22,
    		name: 'hime',
    	},
    	directives: {
    		foo: {
    			bind(el, binding){},
    		},
    	},
    	beforeUpdate(){
    		console.log('beforeUpdate')
    	},
    	updated(){
    		console.log('updated')
    	},
    	mounted(){
    		this.age = 33;
            // age 虽然不涉及渲染，但它出现在了 DOM 的指令里，所以它的更新会触发 beforeUpdate 和 updated
            // 但如果删除指令，则 age 和 DOM 完全没有关系，则 age 的更新不会触发两个更新的钩子函数
    	},
    })
    ```
7. 判断数据是否更新的算法是 Same-value-zero。下面的情况不会触发更新：
    ```js
    new Vue({
       el: '#components-demo',
       data: {
           num1: 0,
           num2: NaN,
       },
       updated(){
           console.log('updated');
       },
       mounted(){
           this.num1 = -0;
           this.num2 = NaN;
       },
    });
    ```
8. 该阶段结束后，触发 `beforeUpdate` 钩子，之后将进入虚拟 DOM 更新和重渲染阶段。看起来也就是说这一阶段只是数据更新的相关工作，还不涉及 DOM 更新。（`flushSchedulerQueue` 函数中的 `watcher.run()` 还没有执行）
9. 这个钩子函数也不会在服务端渲染被调用，因为只有初始渲染是在服务端进行的。

### 第六阶段 虚拟 DOM 更新和重渲染
1. `watcher.before` 调用后，就会执行 `watcher.run` 进行实际的更新。之后是 `callUpdatedHooks(updatedQueue)`，可以看到里面触发了 `updated` 钩子函数。
2. 这里所谓的 DOM 更新，和 `beforeUpdate` 的情况一样，不仅涉及可见的更新，也涉及不引发重渲染的的指令的更新。
3. 因为 `updated` 触发时 DOM 已经更新完成，所以可以进行依赖 DOM 的操作。
4. `updated` 触发时只保证该组件已经被重渲染，但不保证它的所有子组件也已经被重渲染。如果你要确保它的子组件都已经重渲染，就要在该钩子函数里使用 `vm.$nextTick`。
5. 避免在这个钩子函数中操作数据，可能陷入死循环。`watcher.run()` 下面就是检查死循环的逻辑。
6. 同样在服务端渲染中不会被触发。


### 第七阶段 准备销毁实例
1. 当调用 `vm.$destroy()`，开始进入这一阶段
    ```js
    // /src/core/instance/lifecycle.js
    
    Vue.prototype.$destroy = function () {
        const vm: Component = this
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestroy')
        vm._isBeingDestroyed = true

        // remove self from parent
        const parent = vm.$parent
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm)
        }

        // teardown watchers
        // 实例的所有 watcher 都从它们的依赖的属性的 subs 列表中删除
        // 也就是这些依赖更新后不会在通知这个即将被销毁的实例上的 watcher
        if (vm._watcher) {
            vm._watcher.teardown()
        }
        let i = vm._watchers.length
        while (i--) {
            vm._watchers[i].teardown()
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--
        }
        // call the last hook...
        vm._isDestroyed = true

        // invoke destroy hooks on current rendered tree
        // 销毁后更新 DOM
        vm.__patch__(vm._vnode, null)

        // fire destroyed hook
        callHook(vm, 'destroyed')

        // turn off all instance listeners.
        vm.$off()

        // remove __vue__ reference
        if (vm.$el) {
            vm.$el.__vue__ = null
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
            vm.$vnode.parent = null
        }
    }
    ```
2. 可以看到，`beforeDestroy` 钩子函数被触发前，其实没有做任何销毁的操作。
3. 在这个阶段内因为还只是准备销毁，所以实例还可以正常使用。常用于销毁定时器、解绑全局事件、销毁插件对象等操作。
4. 在服务端渲染中不会被触发。

### 第八阶段 销毁实例
1. `beforeDestroy` 钩子函数被触发后，进正式进入的销毁阶段。
2. 实例的所有指令和 watcher 会被解绑，事件监听会被移除，子实例也会销毁。
3. 上面官方的图中，这一阶段做的工作为 “Teardown watchers, child components and event listeners”。我之前测试的时候，发现在 `destroyed` 钩子里面依然可以通过 `this._watchers` 访问到所有的 watcher，子组件啥的也都能访问到，看起来好像和 `beforeDestroy` 的没啥区别。
4. 看看 `teardown` 的代码
    ```js
    /**
    * Remove self from all dependencies' subscriber list.
    */
    Watcher.prototype.teardown = function teardown () {
        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this);
            }
            var i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    };
    ```
5. 可以看出来，并不是移除本身，而是移除了依赖关系，不再响应依赖的变化了。
6. 可以在 `beforeDestroy` 和 `destroyed` 钩子里分别访问 `this._watchers[0]` 来看其中的 `active` 属性区别，一个是 `true`，一个是 `false`。（因为 `console.log` 本身的问题，不能直接 `console.log(this._watchers)`，打印出来的时候引用的是同一个 `_watchers` 列表，都是 `destroyed` 里面的）
7. 销毁完毕后，会触发 `destroyed` 钩子，用于销毁实例后的后续清理工作，或者通知远程服务器该本次销毁。
8. 同样在服务端渲染中不会被触发。


## 父子组件生命周期顺序
```html
<div id="parent">
    <input type="button" value="update prop" @click="update" />
    <input type="button" value="destroy parent" @click="destroy" />
    <child-component :text="text"></child-component>
</div>
```
```js
const hooks = (componentName)=>{
    return {
        beforeCreate() {
            console.log(`${componentName} -- beforeCreate`)
        },
        created() {
            console.log(`${componentName} -- created`)
        },
        beforeMount() {
            console.log(`${componentName} -- beforeMount`)
        },
        mounted() {
            console.log(`${componentName} -- mounted`)
        },
        beforeUpdate() {
            console.log(`${componentName} -- beforeUpdate`)
        },
        updated() {
            console.log(`${componentName} -- updated`)
        },
        beforeDestroy() {
            console.log(`${componentName} -- beforeDestroy`)
        },
        destroyed() {
            console.log(`${componentName} -- destroyed`)
        },
    };
};

Vue.component('child-component', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child'),
});

const vm = new Vue({
    el: '#parent',
    data: {
        text: 22,
    },
    methods: {
        update(){
            this.text = 33;
        },
        destroy(){
            this.$destroy();
        },
    },
    ...hooks('parent'),
});
```

页面加载后的输出：
```shell
parent -- beforeCreate
parent -- created
parent -- beforeMount
child -- beforeCreate
child -- created
child -- beforeMount
child -- mounted
parent -- mounted
```
这里比较有意思的是子实例的创建时间，是在父实例编译完成之后。父实例编译的过程中才会发现子组件标签，所以应该就是发现之后，在编译完成后就紧接着开始创建刚发现的子实例。

update prop 时的输出：
```shell
parent -- beforeUpdate
child -- beforeUpdate
child -- updated
parent -- updated
```

destroy parent 时的输出：
```shell
parent -- beforeDestroy
child -- beforeDestroy
child -- destroyed
parent -- destroyed
```


## 同辈组件生命周期顺序
```html
<div id="parent">
    <input type="button" value="update prop" @click="update" />
    <input type="button" value="destroy parent" @click="destroy" />
    <child-component1 :text="text"></child-component1>
    <child-component2 :text="text"></child-component2>
</div>
```

```js
// 如上例一样定义 hooks

Vue.component('child-component1', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child1'),
});
Vue.component('child-component2', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child2'),
});

// 如上例一样创建 parent Vue 实例
```

页面加载后的输出：
```shell
parent -- beforeCreate
parent -- created
parent -- beforeMount
child1 -- beforeCreate
child1 -- created
child1 -- beforeMount
child2 -- beforeCreate
child2 -- created
child2 -- beforeMount
child1 -- mounted
child2 -- mounted
parent -- mounted
```
编译完成后统一挂载渲染？

update prop 时的输出：
```shell
parent -- beforeUpdate
child1 -- beforeUpdate
child2 -- beforeUpdate
child2 -- updated
child1 -- updated
parent -- updated
```
也是先编译然后再统一重渲染？

destroy parent 时的输出：
```shell
parent -- beforeDestroy
child1 -- beforeDestroy
child1 -- destroyed
child2 -- beforeDestroy
child2 -- destroyed
parent -- destroyed
```


## Mixin hooks 的顺序
按照文档说的：Hook functions with the same name are merged into an array so that all of them will be called. Mixin hooks will be called before the component’s own hooks.


## 与自定义指令钩子函数相比的执行顺序
`Theories\Web\Architecture\UnderstandVuejs\功能\Directives.md`


## References
* [API Options / Lifecycle Hooks](https://vuejs.org/v2/api/#Options-Lifecycle-Hooks)
* [The Vue Instance](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
* [Vue Instance Lifecycle & Hooks](https://codingexplained.com/coding/front-end/vue-js/vue-instance-lifecycle-hooks)
* [Demystifying Vue Lifecycle Methods](https://scotch.io/tutorials/demystifying-vue-lifecycle-methods)
* [Vue生命周期深入](https://segmentfault.com/a/1190000014705819)
