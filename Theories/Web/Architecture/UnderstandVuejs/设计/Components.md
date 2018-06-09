# Components

**这篇总结不涉及组件的用法，主要通过 Vuejs 来学习组件化系统的设计思想**

## TODO
* 组件注册的内部流程



## Misc
### 一个组件也是一个 Vue 实例
* 定义组件相当于定义一个组件的构造函数，使用组件相当于实例化。
* TODO：关于组件的 `data` 必须定义为函数的内部原因，要看源码。
* 它不是通过 `el` 来把已有的 HTML 节点定义为模板，而是自定义 HTML 并通过
`template` 将其指定为模板。


## *functional* component -- decoupled
* 类比于函数式编程的“纯函数”思想，Vue 也把组件设计的尽量独立。
* The API for a Vue component comes in three parts: props, events, and slots
    * Props allow the external environment to pass data into the component
    * Events allow the component to trigger side effects in the external
      environment
    * Slots allow the external environment to compose the component with
      extra content

### 影响组件的只能是其参数，即 props 和 slots
* Unless a component exposes a specific prop or slot explicitly, it will not
be affected by external environment.
* Reusable components should define a clean public interface and make no
assumptions about the context it’s used in.
* 虽然可以通过 `$parent` 之类的绕过这个限制，但还是能不用尽量就不用。保持组件的独立
性对于维护显然很有好处。
* 组件的事件也应该由组件自己来处理。正常情况下，你不能在组件的标签上随便监听组件 emit
出来的以外的事件，即 [native 事件](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)。
比如这样：
```html
<parent-component>
    <child-component @click="handleClick"></child-component>
</parent-component>
```
如果 `child-component` 组件内部没有 emit 一个 `click` 事件，这种在组件外的点击监听是
没有效果的。因为组件的应该由组件内部来处理，如果父组件需要，可以 emit 给父组件:
```js
Vue.component('child-component', {
    template: `<div @click="emitClick" />`,
    methods: {
        emitClick(){
            this.$emit('click');
        },
    },
});
```
当然，Vue 仍然提供了 `.native` modifier 来绕过这个限制。但还是不要在非必要的情况下进行
绕过，应该让组件尽可能的独立，和环境解耦。

### 组件不能有副作用
* A component can not directly change the external environment, it can only
throw a event which exteranl environment may receive.
* However, if the `prop` that is passed is a reference type, the value
passed in fact is a pointer instead of the real value pointed by the pointer.
So if the `prop` is assigned to a variable `var` inside the child component,
the corresponding property outside the component is also modified when
modifying the `var`'s property in child component.

### 愿意被改变，才能被改变
* 如果子组件愿意被父组件改变，它就要设置一个 prop 作为接口，父组件可以使用这个 prop
 改变子组件内容。而且子组件可以约束这个 prop 的类型、范围等。
* 如果父组件愿意被子组件改变，它就要设置一个事件监听作为接口，子组件可以发射这个事件
来申请改变。

### 不限于软件开发方面的管理
* 说到底，组件化本质上也是一种管理。就如同管理一个大的公司，需要划分各种部门，各个
部分既要分工明确，也要配合流畅。既要有严格的规定（通过 prop 和 event 交互），但也存
在潜规则（$parent 和 $refs）。
* 不管管理什么，这种组件化的思想都是存在的，但又不尽相同。


## `props` 不是传递数据，而是建立数据通道，维持长效交流
1. 使用一个 prop 并不是传递一个数据进去就完事了。
2. 如果只是传递数据，那 `props` 只是相当于子组件的初始化选项，之后父组件就不再影响子组
件。Vue 就会允许子组件修改 prop。
3. 但实际的情况是，父组件数据只要更新，就会通知到子组件，所以一个 prop 就是一项数据的传
递通道，用来维持长效交流。
4. 因此，子组件为了接收到父组件正确的数据更新，内部不能随便更改对接用的 prop，只能将其
复制一份拷贝到自己的 data 或计算属性中才能进行修改。


## Events
* TODO：需要看源码。不知道仅仅是约定还是其他原因，对于子组件发出的事件的监听，只能放在子
组件标签上，而不能放在父组件标签上。当然这样逻辑会清晰，而且也没有必要放到父组件标签上。
但是为什么不能放到父组件标签上？
