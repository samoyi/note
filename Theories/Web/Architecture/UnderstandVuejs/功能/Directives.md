# Directives

## 作用
1. 只有 Model 和 ViewModel 实例，没办法直接操作 HTML，因为它们和 HTML 是没有发生联系
的，必须要提供一套联系的接口。
2. 各种指令就是接口。当 Vue 编译 HTML 模板时，各种节点中的指令将告诉 Vue 该如何处理该
节点。之后数据更新时，指令也会告诉 Vue 怎么更新 View。
3. 也就是说，Vue 通过各种各样的指令，基于 Model，来操作 View。
3. 比如 `v-for` 指令告诉 Vue 要循环该节点，`v-if` 指令告诉 Vue 要根据变量的布尔值来决
定是否渲染该节点，`{{}}` 指令告诉 Vue 要把其中的变量替换为变量值。


## Arguments 和 Modifiers
其实如果把指令理解为函数的话，Arguments 和 Modifiers 都可以理解为指令的参数
```html
<form v-on:submit.prevent="onSubmit">...</form>
```
上面这个事件绑定指令的 argument 是`submit`，modifier 是`prevent`。其实就是告诉 Vue
要添加一个事件绑定，同时有三个参数来个性化这个事件绑定：`:submit`要求事件类型是`submit`
，`.prevent`要求阻止默认事件，`onSubmit`指定事件处理函数。


## Custom Directives
1. 自定义一个指令，告诉 Vue 在 **什么时间** 对一个节点做 **哪些事情**。
2. **什么时间** 就是钩子函数的函数名，**哪些事情** 就是钩子函数的函数体。
3. 和默认指令一样，自定义指令也是告诉 Vue 要怎么处理节点。因为可以自定义，所以就可以订
制各种各样操作 View 的方法。

```html
<div id="components-demo" v-red>
    {{ num1 }}
    <div v-pink>{{ num2 }}</div>
</div>
```
```js
// 全局注册指令
Vue.directive('red', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 文字变成红色
        el.style.color = 'red';
    }
});

new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
        num2: 33,
    },
    // 也可以局部注册
    directives: {
        pink: {
            inserted: function (el) {
                el.style.color = 'pink';
            },
        },
    },
});
```

### Hook Functions
规定指令什么时候生效

#### `bind`
Called only once, when the directive is first bound to the element. This is
where you can do one-time setup work.

#### `inserted`
Called when the bound element has been inserted into its parent node (this only
guarantees parent node presence, not necessarily in-document).

#### `update`
1. Called after the containing component’s VNode has updated, but possibly
before  its children have updated.
2. The directive’s value may or may not have changed, but you can skip
unnecessary updates by comparing the binding’s current and old values.

#### `componentUpdated`
Called after the containing component’s VNode and the VNodes of its children
have updated.

#### `unbind`
Called only once, when the directive is unbound from the element.
