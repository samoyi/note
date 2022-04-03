# Virtual DOM

源码版本 | 2.5.21


<!-- TOC -->

- [Virtual DOM](#virtual-dom)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
        - [使用更高效或更方便的模型](#使用更高效或更方便的模型)
        - [缓冲和防抖（debounce）](#缓冲和防抖debounce)
    - [原理](#原理)
    - [本质](#本质)
        - [抽象建模](#抽象建模)
    - [真实 DOM 操作为什么慢](#真实-dom-操作为什么慢)
    - [Virtual DOM 的优点](#virtual-dom-的优点)
        - [避免频繁的 DOM 更新](#避免频繁的-dom-更新)
        - [避免不必要的 DOM 更新](#避免不必要的-dom-更新)
        - [节点复用——diff 算法](#节点复用diff-算法)
        - [性能以外的好处](#性能以外的好处)
            - [获得了 JavaScript 的编程能力](#获得了-javascript-的编程能力)
            - [可以使代码的通用性更强](#可以使代码的通用性更强)
            - [支持 JSX](#支持-jsx)
    - [虚拟 DOM 怎么变成真实页面](#虚拟-dom-怎么变成真实页面)
        - [编译之后的工作——生成虚拟 DOM，mount 和 patch](#编译之后的工作生成虚拟-dommount-和-patch)
        - [mount 中的渲染入口](#mount-中的渲染入口)
        - [patch 时的渲染](#patch-时的渲染)
        - [具体的 DOM 操作](#具体的-dom-操作)
    - [References](#references)

<!-- /TOC -->



## 设计目的
1. DOM 是页面的模型，我们通过操作 DOM 来操作页面。
2. DOM 本身就是对页面的抽象，所以操作 DOM 就比直接操作页面要简单得多。
3. DOM 已经很好了，但它的一个问题是，它对太 “勤劳” 和 “忠实” 了：
    * DOM 一有涉及页面的改动，它就立刻去同步修改页面；
    * 即使改动的结果和改动前一样的，DOM 还是会去进行无意义的页面修改；
    * 用户提交使用新节点替换旧节点时，其实可能实际上只需要修改其中一部分就行了，但 DOM 还是会忠实的进行整体替换。
4. 程序会频繁的修改 DOM，这本身没有什么性能问题，DOM 本身也是 JS 对象，改起来很快。但因为 DOM 会频繁的同步页面修改，而页面修改涉及重绘，重绘相比起来很慢，频繁的重绘就会是性能瓶颈。
5. 因此我们还需要一个 DOM 的模型，也就是这里的虚拟 DOM，对它的修改不会随便就同步给 DOM，而是在必要的时候才进行同步。
6. 另外，因为虚拟 DOM 本身和页面脱离了关系，也可以实现一些普通 DOM 无法实现的功能。

### 关键细节
* 怎么防止 DOM 那样的频繁更新；
* 怎么防止 DOM 那样无意义的更新；
* 怎么实现部分替换；

## 实现原理


## 抽象本质


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


## 真实 DOM 操作为什么慢
1. 可以直接看这个 [回答](https://www.zhihu.com/question/324992717/answer/707044362)，下面总结一下大意。
2. DOM 是 C++ 写的，性能肯定不慢。而且 V8 Binding 会把原生 DOM 对象映射为包装的 JS 对象。因此，我们操作 DOM 和操作 JS 对象是一样的。
3. 所以，修改 DOM 节点的属性（property）是和 JS 对象的属性一样的。例如 `document.a = 1` 的操作。
4. 但是，如果修改的是 DOM 节点的特性（attribute），那就会变慢了。例如 `document.title = 1` 的操作。
5. 因为 DOM 节点特性（attribute）的修改不是在被包装成的 JS 对象上的修改，而是要修改实际的 DOM 对象。
6. 但这还是不最慢的，因为浏览器并不是对任何 DOM 操作都同步的更新，例如在一个事件周期内多次更改一个节点内的文本，只会在本轮事件循环的结尾处进行一次重绘
    ```html
    <p>test</p>
    ```
    ```js
    const p = document.querySelector('p');
    p.textContent = 'sync';
    alert(); // 此时页面还是 test
    // 不能用 debugger，参考 https://stackoverflow.com/questions/62562845/any-example-proving-microtask-is-executed-before-rendering
    Promise.resolve().then(function microtask() {
        // 已经进到微任务了，但页面还是 test
        alert(p.textContent);
        p.textContent = 'Promise';
        // 最终页面会跳过 sync，直接变为 Promise
    });
    ```
7. 也就是说，这种更新其实也是通过异步重绘做了防抖处理。真正影响性能的会导致同步重绘操作，是那些要读取当前元素尺寸啊距离啊之类的操纵。
8. 因为你的读取结果是要同步获得的，为了获得当前准确的尺寸，必须要重绘一下获得最新的尺寸。参考下面两篇：
    * https://segmentfault.com/a/1190000038204886
    * https://zhuanlan.zhihu.com/p/54811712
9. 这里列出了哪些操作会导致同步重绘：https://gist.github.com/paulirish/5d52fb081b3570c81e3a
10. 另外，DOM 对象还会导致 GC 变复杂。 


## Virtual DOM 的优点
### 避免频繁的 DOM 更新
1. 如果一个节点只短时间内发生了好几次更新，就会连续触发相对更慢的 DOM 更新，。但其实很多时候对于用户来说只有最后一次的更新才是有意义的。
2. 使用虚拟 DOM 就可以在一个更新周期内只多次触发虚拟 DOM 的更新，而虚拟 DOM 更新只是修改 JS 对象属性，所以速度很快。只在该周期结束后使用最终的只触发一个真实的 DOM 更新。
3. 但是这个好像不能避免上面重绘的问题吧。TODO

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

    
## 虚拟 DOM 怎么变成真实页面
### 编译之后的工作——生成虚拟 DOM，mount 和 patch
1. 编译器的工作是把模板编译为渲染函数（当然如果你不使用模板而直接使用渲染函数，那就跳过了编译的步骤），渲染函数会被运行时渲染器调用，生成虚拟 DOM。（渲染函数调用的时候也会进行依赖绑定）
2. 运行时渲染器遍历虚拟 DOM，并据此构建真实的 DOM。这个过程被称为 **mount**（挂载）。
3. 之后当依赖发生变化后，运行时渲染器会根据新数据创建一个新的虚拟 DOM，然后与之前的虚拟 DOM 比较，并只把必须要的更新应用都真实 DOM 上。这个过程被称为 **patch**
<img src="./images/06.png" width="800" style="display: block; margin: 5px 0 10px 0;" />

### mount 中的渲染入口

### patch 时的渲染

### 具体的 DOM 操作
1. 虚拟 DOM 是 DOM 的模型，所以渲染页面也是要通过 DOM 来进行。


## References
* [What’s The Deal With Vue’s Virtual DOM?](https://medium.com/js-dojo/whats-the-deal-with-vue-s-virtual-dom-3ed4fc0dbb20)
* [Understanding Rendering Process with Virtual DOM In Vue.js](https://medium.com/@koheimikami/understanding-rendering-process-with-virtual-dom-in-vue-js-a6e602811782)
* [网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？ - 尤雨溪的回答 - 知乎](https://www.zhihu.com/question/31809713/answer/53544875)
* [前端为什么操作 DOM 是最耗性能的呢？ - justjavac的回答 - 知乎](https://www.zhihu.com/question/324992717/answer/707044362)
* [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
* [剖析 Vue.js 内部运行机制](https://juejin.cn/book/6844733705089449991)
* [官方文档](https://vuejs.org/guide/extras/rendering-mechanism.html)

