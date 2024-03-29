# Vue.js 的 MVVM 原理


<!-- TOC -->

- [Vue.js 的 MVVM 原理](#vuejs-的-mvvm-原理)
    - [引用说明](#引用说明)
    - [后续内容](#后续内容)
    - [Summary](#summary)
    - [ViewModel](#viewmodel)
    - [View](#view)
    - [Model](#model)
    - [Directives](#directives)
    - [Filters](#filters)
    - [References](#references)

<!-- /TOC -->


<img src="../images/VueMVVM.png" width="600" style="display: block; margin: 5px 0 10px;" />


## 引用说明
* 参考的是 [0.12版本的文档](https://012.vuejs.org/guide/)，不知道和 Vue2 的版本有多少差别。


## 后续内容
* `./Observer/基本原理/ReactivitySystem.md` 对 Vuejs 的响应式数据绑定做了进一步的说明
* `./Observer/基本原理/Two-wayBinding.md` 实现了一个简单的 ViewModel 构造器


## Summary
1. Technically, Vue.js is focused on the **ViewModel** layer of the MVVM pattern. It connects the **View** and the **Model** via two way data bindings.
2. Actual DOM manipulations and output formatting are abstracted away into **Directives** and **Filters**. 用 Vue 的时候并没有明确的意识到这一点，不过确实是任何对 DOM 的改变都要通过 Directives（包括 Mustache syntax） 和 Filters。


## ViewModel
1. An object that syncs the Model and the View. In Vue.js, every Vue instance is a ViewModel.
2. 从名字和 Vue.js 实际使用上的感受来看，ViewModel 是 Model 化了的 View。也就是说，把 View 用数据表现出来，将 View 数据化。
3. 例如，页面的文本转化为某个变量的值，页面节点的隐藏和显示转化为某个布尔值变量，一个列表转化为数据中的数组。
4. 这样，就和 MVC 的架构感觉上是不同的。MVC 的 Controller 就如同它的名字一样，有着明显的 “操控” 的感觉，要按照业务逻辑去操控数据。而 MVVM 中的 ViewModel，在使用 Vuejs 的过程中，并没有那种明显的操控感。
5. 直白的翻译，就是 “视图模型”。Model 的数据是抽象的，View 是具象的，没办法直接把 Model 的数据应用到 View 上。但一旦对 View 进行抽象建模，将其转换为数据模型 ViewModel 之后，就可以很方便的把 Model 的各种数据作为变量插入到 View。
6. 这中间是不需要控制的！ViewModel 是 View 抽象化之后的模型，但它同时也是 Model 眼里的模板，所以才可以很方便的把数据作为变量插入。ViewModel 既是 View 层的 model，也是 Model 层的 view。
7. 所以 VM 其实和 DOM 的功能有些类似，都是根据 HTML（View）建立一个可供 JS 操作的 Model。只不过 DOM 这个模型体现的仍然是 HTML 的结构逻辑，而 VM 体现的则是 HTML 的数据逻辑。所以 VM 可以直接作为数据层的 View，而 DOM 则不行。


## View
1. The actual DOM that is managed by Vue instances.
2. Vue.js uses DOM-based templating. Each Vue instance is associated with a corresponding DOM element.
3. When a Vue instance is created, it recursively walks all child nodes of its root element while setting up the necessary data bindings. After the View is compiled, it becomes reactive to data changes.
4. When using Vue.js, you rarely have to touch the DOM yourself except in custom directives. View updates will be automatically triggered when the data changes.
5. These view updates are highly granular with the precision down to a textNode. They are also batched and executed asynchronously for greater performance.


## Model
1. In Vue.js, models are simply plain JavaScript objects, or data objects.
2. Once an object is used as data inside a Vue instance, it becomes reactive.
3. You can manipulate their properties and Vue instances that are observing them will be notified of the changes.
4. Vue.js achieves transparent reactivity by converting the properties on data objects into ES5 getter/setters.
5. There’s no need for dirty checking, nor do you have to explicitly signal Vue to update the View. Whenever the data changes, the View is updated on the next frame.
6. Vue instances proxy all properties on data objects they observe. So once an object `{ a: 1 }` has been observed, both `vm.$data.a` and `vm.a` will return the same value, and setting `vm.a = 2` will modify `vm.$data`. 即 ViewModel 和
Model 的数据保持一致。
7. The data objects are mutated in place, so modifying it by reference has the same effects as modifying `vm.$data`. This makes it possible for multiple Vue instances to observe the same piece of data.
8. In larger applications it is also recommended to treat Vue instances as pure views, and externalize the data manipulation logic into a more discrete store layer. 这里的意思可能就是上面在解释 ViewModel 说的那样，把 ViewModel 当做 Model 层的 view。尽量只是往里面插入变量，至于数据层面的各种计算，不要放到 ViewModel 里面来进行。因为 ViewModel 只是 Model 层的 view，虽然它比 View 层更数据，但它本质上还是属于 Model 层的模板，显然不应该在模板里进行复杂的运算。


## Directives
1. ViewModel 上的所有数据变动和计算，最终都要通过 View 中的内置或自定义指令（包括 Mustache syntax）才能实现对 View 的改变。
2. 不同的指令意味着对 View 有不同的改变方式。除了内置的指令，自定义指令可以实现对 View 更丰富的改变方式。


## Filters
只是对 Directives 的修饰。


## References
* [Doc 0.12](https://012.vuejs.org/guide/#View)
