# Virtual DOM


<!-- TOC -->

- [Virtual DOM](#virtual-dom)
    - [设计思想](#设计思想)
        - [使用更高效或更方便的模型](#使用更高效或更方便的模型)
        - [缓冲和防抖（debounce）](#缓冲和防抖debounce)
    - [原理](#原理)
    - [本质](#本质)
        - [抽象建模](#抽象建模)
    - [环境](#环境)
    - [DOM 操作为什么慢](#dom-操作为什么慢)
    - [Virtual DOM 的优点](#virtual-dom-的优点)
        - [避免频繁的 DOM 更新](#避免频繁的-dom-更新)
        - [避免不必要的 DOM 更新](#避免不必要的-dom-更新)
        - [节点复用——diff 算法](#节点复用diff-算法)
        - [性能以外的好处](#性能以外的好处)
            - [获得了 JavaScript 的编程能力](#获得了-javascript-的编程能力)
            - [可以使代码的通用性更强](#可以使代码的通用性更强)
            - [支持 JSX](#支持-jsx)
    - [模板语法和渲染函数](#模板语法和渲染函数)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### 使用更高效或更方便的模型
1. 现实中的很多实验都是很麻烦或者成本高，这种时候经常就可以尝试对其建模，在计算机上进行模拟和预测。
2. 将不容易做的事情交给更高效的模型去模拟。
3. 虚拟 DOM 也是这样的建模思想，作为真实 DOM 的模型，它改变起来成本更低，就可以承担大部分的真实 DOM 的改变操作。

### 缓冲和防抖（debounce）
1. 频繁的更新不仅消耗资源，更重要的是，在大多数时候我们根本不需要那么频繁的更新，甚至过于频繁的更新反而会带来烦恼。
2. 虽然不确定，但是我想这种批更新的策略肯定不能用到游戏画面刷新，因为一个是要降低 FPS 而另一个是要提升 FPS。
3. 对于展示普通信息的页面来说，高刷新率是没有必要的，而且因此产生的抖动反而是需要被解决的问题。
4. 而且，因为需要的刷新率很低，所以在一个更新周期内如果数据几次更新后又回到了初始状态，那么该周期结束后就完全不需要更新 DOM 了。


## 原理


## 本质
### 抽象建模


## 环境
key | value
--|--
源码版本 | 2.5.21


## DOM 操作为什么慢
1. 可以直接看这个[回答](https://www.zhihu.com/question/324992717/answer/707044362)，下面总结一下大意。
2. DOM 是 C++ 写的，性能肯定不慢。而且 V8 Binding 会把原生 DOM 对象映射为包装的 JS 对象。因此，我们操作 DOM 和操作 JS 对象是一样的。
3. 所以，修改 DOM 节点的属性（property）是和 JS 对象的属性一样的。例如 `document.a = 1;` 的操作。
4. 但是，如果修改的是 DOM 节点的特性（attribute），那就会慢得多了。例如 `document.title = 1;` 的操作。
5. 因为 DOM 节点特性（attribute）的修改不是在被包装成的 JS 对象上的修改，而是要修改实际的 DOM 对象。
6. 另外，如果修改了节点的 CSS，就会引起 relayout。甚至仅仅是读取样式都会触发 relayout。
7. 而且，DOM 对象还会导致 GC 变复杂。 


## Virtual DOM 的优点
### 避免频繁的 DOM 更新
1. 如果一个节点只短时间内发生了好几次更新，就会连续触发页面的更新。但其实很多时候对于用户来说只有最后一次的更新才是有意义的。
2. 使用虚拟 DOM 就可以在一个更新周期内只多次触发虚拟 DOM 的更新，而虚拟 DOM 更新只是修改 JS 对象属性，所以速度很快。只在该周期结束后使用最终的只触发一个真实的 DOM 更新。

### 避免不必要的 DOM 更新
1. 有些 DOM 更新后，相比于之前的状态，会有一些元素（包括数据）实际上并未没有变化。这些元素的重复更新是没有必要的。
2. 而 Virtual DOM 可以识别那些没有变化的元素，在更新 DOM 的时候不更新这些元素，从而节省了更新时间。

### 节点复用——diff 算法
比如从一个列表切换为另一个相同结构的列表时，如果两部分只有几个列表项发生了变化，使用虚拟 DOM 就不需要重新渲染整个新的列表，而只需要原地复用之前的结构，只修改发生变化的部分。

### 性能以外的好处
#### 获得了 JavaScript 的编程能力
比如通过 JavaScript 的数组方法，可以创建工厂式的函数来创建虚拟节点。如果使用模板语法的话这样的功能实现起来会更困难。

#### 可以使代码的通用性更强
因为 Vue 实例并不会耦合在 HTML 文件里，所以也可以使用服务端来渲染。

#### 支持 JSX
渲染函数允许 JS 拓展使用 JSX 语法，因此可以更合适的构建基于组件的应用。

    
## 模板语法和渲染函数
1. Vue 有两种方法创建虚拟 DOM：模板语法编译和直接使用渲染函数。
2. `template` 里面的 HTML 模板代码会被 Vue 的编译器隐式的自动编译为虚拟 DOM
    ```js
    let res = Vue.compile('<div><span>{{ msg }}</span></div>')
    res.render
    // ƒ anonymous() {
    //     with(this){return _c('div',[_c('span',[_v(_s(msg))])])}
    // }
    ```
3. 用户也可是手动调用渲染函数来主动的创建虚拟 DOM。
4. 可以通过 [这个简易实现](https://github.com/livoras/blog/issues/13) 了解虚拟 DOM 的构建原理


## References
* [What’s The Deal With Vue’s Virtual DOM?](https://medium.com/js-dojo/whats-the-deal-with-vue-s-virtual-dom-3ed4fc0dbb20)
* [Understanding Rendering Process with Virtual DOM In Vue.js](https://medium.com/@koheimikami/understanding-rendering-process-with-virtual-dom-in-vue-js-a6e602811782)
* [网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？ - 尤雨溪的回答 - 知乎](https://www.zhihu.com/question/31809713/answer/53544875)
* [前端为什么操作 DOM 是最耗性能的呢？ - justjavac的回答 - 知乎](https://www.zhihu.com/question/324992717/answer/707044362)
* [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
* [剖析 Vue.js 内部运行机制](https://juejin.cn/book/6844733705089449991)


