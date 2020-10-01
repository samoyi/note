# nextTick


<!-- TOC -->

- [nextTick](#nexttick)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [环境](#环境)
    - [优先使用 microtask 的原因](#优先使用-microtask-的原因)
    - [只用 microtask 实现 `nextTick` 的问题](#只用-microtask-实现-nexttick-的问题)
        - [回调打断事件序列的情况](#回调打断事件序列的情况)
        - [在冒泡阶段就执行回调的问题](#在冒泡阶段就执行回调的问题)
    - [只用 macrotask 实现 `nextTick` 的问题](#只用-macrotask-实现-nexttick-的问题)
    - [nextTick](#nexttick-1)
    - [watcher queue](#watcher-queue)
    - [无关内容](#无关内容)
        - [Flow](#flow)
        - [`/* istanbul ignore if */`](#-istanbul-ignore-if-)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 本质


## 环境
key | value
--|--
源码版本 | 2.5.2
文件路径 | `src/core/util/next-tick.js`


## 优先使用 microtask 的原因
根据这个 [回答](https://www.zhihu.com/question/55364497/answer/144215284) 及其链接的 [文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)，可以看到在一个事件循环内，是先执行 microtask 然后再重渲染。所以使用 microtask 就可以在本次渲染的时候使用更新的数据，而不是下一次渲染才更新。


## 只用 microtask 实现 `nextTick` 的问题
看看源码中的注释：
> In < 2.4 we used microtasks everywhere, but there are some scenarios where microtasks have too high a priority and fire in between supposedly sequential events (e.g. #4521, #6690) or even between bubbling of the same event (#6566).

### 回调打断事件序列的情况
1. [issue 4521](https://github.com/vuejs/vue/issues/4521) 里面提到的例子，代码放在了 `./issue4521.html` 中。点击 `<checkbox>` 之后并不会显示选中状态。因为官方已经在 2.1.7 中修复了这个问题，所以要引用之前的 Vue。
2. 在修复的文件中，可以看到如下的注释：
    > #4521: if a click event triggers update before the change event is
    > dispatched on a checkbox/radio input, the input's checked state will
    > be reset and fail to trigger another update.
3. 太具体的原因需要仔细看源码，但大概的原因如下：
    1. 在这种嵌套结构中，点击 `<checkbox>` 是会先触发外层的 `click` 事件再触发 `input` 的 `change` 事件。
    2. `click` 的回调因为是放在了 microtask 中，所以会很快执行，进而触发了某些涉及 `<checkbox>` 的更新。
    3. 而此时 `change` 事件还没有被分发到 `<checkbox>` 之上，`<checkbox>` 就被更新了，因而不能触发选中的更新。
4. 作为验证，可以把 `click` 回调里面的 `this.num++` 改为，`this.num = 2`。这样，在第一次点击时，因为发生了实际的数据变化，所以会触发更新，因此 `<checkbox>` 不会被选中；之后再点击，每次都是给 `num` 赋值 `2`，数据没有真的变化，不会触发更新，所以 `<checkbox>` 就可以正常被选中。
5. 修复的方法，可以沿着上面的思路，将 `click` 回调中要执行的代码放进 `setTimeout` 里，将其改为 macrotask，保证先执行完 `change`事件的回调。或者直接给 `click` 事件添加 `self` 修饰符，让点击 `<checkbox>` 的时候不会触发 `click` 事件。

### 在冒泡阶段就执行回调的问题
1. [issue 6566](https://github.com/vuejs/vue/issues/6566) 里面提到的例子，我将其简化后放在了 `./issue6566.html` 中。预期在点击 A 所在的 `<i>` 之后会切换到 B 所在的 `<i>`，但是在 2.5 之前的版本中并不会。
2. 看 `console.log` 的话，可以发现 `switchAB` 实际执行了两次，也就是说在切换过去之后又立刻切换了回来。
3. 原因，在上面的 issue 里尤雨溪也给出了解释。如下：
    1. 首先明确一点，因为两个切换的 `<div>` 结构相同，所以在切换时，是节点复用，并不是真的重新渲染。
    2. 点击事件发生时，事件处理被 `nextTick` 推入到 microtask 队列，该事件处理的内容是更新 DOM。
    3. 因为 microtask 的执行优先级比事件冒泡还快，所以在事件还没有传播到外层 `<div>` 的时候，microtask 中的事件处理函数就被执行了。
    4. 也就是说，在事件还没传播到外层 `<div>` 的时候，外层 `<div>` 就变成了下面的那个。
    5. 而下面的那个 `<div>` 上面也绑定了点击事件，同时，点击事件即将传播到这里！
    6. 随后，点击事件传播到了这个 `<div>`，因此又切换回去了。
4. 作为验证，如果把下面那个点击事件绑定到捕获阶段（`<div class="header" v-if="!bDisplayA" @click.capture="switchAB">`），就可以避免这个问题的发生。


## 只用 macrotask 实现 `nextTick` 的问题
1. 看看源码中的注释：
    > However, using (macro) tasks everywhere also has subtle problems when state is changed right before repaint (e.g. #6813, out-in transitions).
2. [issue 6813](https://github.com/vuejs/vue/issues/6813) 里面提到的例子，我将其简化后放在了 `./issue6813.html` 中。当缩小页面宽度至小于 500px 的瞬间时，列表项 `display` 会先瞬间变为 `list-item`，然后整个列表再消失。期望的情况是直接消失。
3. 当窗口缩到 499px 时，会触发 CSS 的媒体查询和 Vue 的数据更新。但因为在当前的 Vue 版本里，Vue 更新的实现是使用 macrotask。而媒体查询触发的重绘看起来是在当前事件循环，所以会先进行媒体查询的重绘，然后在下个事件循环在隐藏列表。
4. 作为测试，可以加载新版本的 Vue，会按照预期的情况直接隐藏。然后通过 `setTimeout` 把 `checkWidth` 推迟到下一个事件循环，则可以发现又出现了同样的情况。


## nextTick
1. 源码中首先会定义一个 `callbacks` 数组来存储 `nextTick` 的回调，在下一个 tick 调用 `flushCallbacks` 执行保存在 `callbacks` 中的所有 `nextTick` 回调。


## watcher queue
1. 依赖更新后，依赖的 dep 会通过 `notify` 方法调用每个的订阅者（watcher）的 `update` 方法。如果不是明确要同步进行更新，那就会被加入队列等待更新
    ```js
    // core/observer/watcher.js
    
    update () {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true
        }
        // sync 更新立刻执行
        else if (this.sync) {
            this.run()
        }
        else {
            // 加入队列等待执行
            queueWatcher(this)
        }
    }
    ```
2. 但是如果，一个周期内多次的修改了依赖，那对应的 watch 的 `update` 多次调用，但实际上中间的值都是不需要的，只需要更新为最后一次修改的值就行了。这就需要类似于函数防抖的机制，`queueWatcher` 方法会实现这一机制。看一下 `queueWatcher` 方法
    ```js
    // core/observer/scheduler.js
    
    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     */
    export function queueWatcher (watcher: Watcher) {
        const id = watcher.id
        if (has[id] == null) {
            has[id] = true
            if (!flushing) {
                queue.push(watcher)
            }
            else {
                // if already flushing, splice the watcher based on its id
                // if already past its id, it will be run next immediately.
                let i = queue.length - 1
                while (i > index && queue[i].id > watcher.id) {
                    i--
                }
                queue.splice(i + 1, 0, watcher)
            }
            // queue the flush
            if (!waiting) {
                waiting = true
                nextTick(flushSchedulerQueue)
            }
        }
    }
    ```
3. 注意 `if (has[id] == null)`，`has` 是一个 map，里面存放 `id -> null/true` 的形式，用来判断某个 `id` 对应的 watcher 是否已经被添加进队列。默认是 `null`，如果添加后某个 watcher 后，对应 `id` 的值会变成 `true`，因此不会重复添加。
4. `waiting` 是一个标记位，标记是否已经向 `nextTick` 传递了 `flushSchedulerQueue` 方法，在下一个 tick 的时候执行 `flushSchedulerQueue` 方法来 flush 队列 queue，执行它里面的所有 Watcher 对象的 `run` 方法
    ```js
    // core/observer/scheduler.js

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
    ```
4. 其中还会调用 `resetSchedulerState` 来重置状态
    ```js
    // core/observer/scheduler.js

    /**
     * Reset the scheduler's state.
     */
    function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0
    has = {}
    if (process.env.NODE_ENV !== 'production') {
        circular = {}
    }
    waiting = flushing = false
    }
    ```
    

## 无关内容
### Flow
* 该文件顶部的注释 `/* @flow */` 告诉 Flow background process 该文件使用了 Flow 语法，如果不加的话，会被 Flow background process 忽略。参考 [文档](https://flow.org/en/docs/usage/#toc-prepare-your-code-for-flow)
* 注释 `// $flow-disable-line` 告诉 Flow 忽略下一行可能的错误。参考 Flow 的 [配置规则](https://flow.org/en/docs/config/options/#toc-suppress-comment-regex) 以及 Vue 中的 [配置](https://github.com/vuejs/vue/blob/dev/.flowconfig#L23)

### `/* istanbul ignore if */`
istanbul 的内容，参考 [官方文档](https://github.com/gotwarlost/istanbul) 或者阮一峰的 [这篇文章](代码覆盖率工具 Istanbul 入门教程)


## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)