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
    - [nextTick 实现](#nexttick-实现)
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
文件路径 | `/src/core/util/next-tick.js`


## 优先使用 microtask 的原因
1. 根据这个 [回答](https://www.zhihu.com/question/55364497/answer/144215284) 及其链接的 [文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)，可以看到在一个事件循环内，是先执行 microtask 然后再重渲染，而响应式湖居更新就是要放到 nextTick 去执行。所以使用 microtask 就可以在本次渲染的时候使用更新后的数据，而不是下一次渲染才更新。如果使用宏任务就会出现下面 issue 6813 的 bug，也就是当前事件循环重绘后，下个事件循环数据更新又发生重绘。
2. 但这里并不是说你在 nextTick 的回调里读取 DOM 读取的还是旧的数据。虽然没有找到很明确的资料，但感觉上就是，微任务是在 DOM 更新后执行，但是是在页面重新绘制之前执行。看这个例子
    ```html
    <p>test</p>
    ```
    ```js
    const p = document.querySelector('p');
    p.textContent = 'sync';
    alert(); // 此时页面还是 test
    Promise.resolve().then(function microtask() {
        // 已经进到微任务了，但页面还是 test
        alert(p.textContent);
        p.textContent = 'Promise';
        // 最终页面会跳过 sync，直接变为 Promise
    });
    ```
3. 参考 [这个问题](https://stackoverflow.com/questions/62562845/any-example-proving-microtask-is-executed-before-rendering)。
4. 既然本轮事件结尾时才会统一重绘，那所谓 DOM 性能差就并不是说只要一修改 DOM 数据就会立刻导致重绘，上面显然就是在最后使用最后一次更新的数据重绘了一次。


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
5. 其实这个例子本身就挺奇怪，上面的事件处理绑定在 `div`　上，而下面的绑定到 `i` 上。如果下面的也绑定到 `i` 是哪个那就没这个问题了。


## 只用 macrotask 实现 `nextTick` 的问题
1. 看看源码中的注释：
    > However, using (macro) tasks everywhere also has subtle problems when state is changed right before repaint (e.g. #6813, out-in transitions).
2. [issue 6813](https://github.com/vuejs/vue/issues/6813) 里面提到的例子，我将其简化后放在了 `./issue6813.html` 中。当缩小页面宽度至小于 500px 的瞬间时，列表项 `display` 会先瞬间变为 `list-item`，然后整个列表再消失。期望的情况是直接消失。
3. 当窗口缩到 499px 时，会触发 CSS 的媒体查询和 Vue 的数据更新。但因为在当前的 Vue 版本里，Vue 更新的实现是使用 macrotask。而媒体查询触发的重绘是在当前事件循环，所以会先进行媒体查询的重绘，然后在下个事件循环在隐藏列表。
4. 作为测试，可以加载新版本的 Vue，会按照预期的情况直接隐藏。然后通过 `setTimeout` 把 `checkWidth` 推迟到下一个事件循环，则可以发现又出现了同样的情况。


## nextTick 实现
直接看 `./next-tick注释.js`


## 无关内容
### Flow
* 该文件顶部的注释 `/* @flow */` 告诉 Flow background process 该文件使用了 Flow 语法，如果不加的话，会被 Flow background process 忽略。参考 [文档](https://flow.org/en/docs/usage/#toc-prepare-your-code-for-flow)
* 注释 `// $flow-disable-line` 告诉 Flow 忽略下一行可能的错误。参考 Flow 的 [配置规则](https://flow.org/en/docs/config/options/#toc-suppress-comment-regex) 以及 Vue 中的 [配置](https://github.com/vuejs/vue/blob/dev/.flowconfig#L23)

### `/* istanbul ignore if */`
istanbul 的内容，参考 [官方文档](https://github.com/gotwarlost/istanbul) 或者阮一峰的 [这篇文章](代码覆盖率工具 Istanbul 入门教程)


## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)