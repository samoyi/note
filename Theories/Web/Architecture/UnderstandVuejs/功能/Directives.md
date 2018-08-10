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


### 钩子函数执行时间
```html
<div id="components-demo" v-_bind v-_inserted v-_update v-_componentupdated v-_unbind>
    {{ num1 }}
</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    directives: {
        _bind: {
            bind: function (el) {
                alert('v-bind');
            },
        },
        _inserted: {
            inserted: function (el) {
                alert('v-inserted');
            },
        },
        _update: {
            update: function (el) {
                alert('v-update');
            },
        },
        _componentupdated: {
            componentUpdated: function (el) {
                alert('v-componentUpdated');
            },
        },
        _unbind: {
            unbind: function (el) {
                alert('v-unbind');
            },
        },
    },
    beforeMount(){
        alert('beforeMount');
    },
    mounted(){
        alert('mounted');
        setTimeout(()=>{
            this.num1 = 33;
        }, 2000);
    },
    beforeUpdate(){
        alert('beforeUpdate');
    },
    updated(){
        alert('updated');
        setTimeout(()=>{
            this.$destroy();
        }, 2000);
    },
    beforeDestroy(){
        alert('beforeDestroy');
    },
    destroyed(){
        alert('destroyed');
    },
});
```


### Hook Functions
规定指令什么时候生效

#### `bind`
1. Called only once, when the directive is first bound to the element. This is
where you can do one-time setup work.

#### `inserted`
1. Called when the bound element has been inserted into its parent node (this
only guarantees parent node presence, not necessarily in-document).
2. `bind`和`inserted`这两个钩子函数，都是在`beforeMount`和`mounted`之间触发的。也就
是说，发生在模板编译之后的挂载阶段，所以说不是一边编译模板一边执行绑定。
3. 不过这样也是有道理的，毕竟钩子函数的第一个参数就是`el`就是实际的节点，要让`el`能正常
访问，必须在实际 DOM 更新之后，但没必要等到挂载渲染全部完成。有可能的顺序是：
`beforeMount`——更新实际 DOM——`bind`——`inserted`——渲染——`mounted`
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        // 也可以局部注册
        directives: {
            _bind: {
                bind: function (el, binding vnode) {
                    console.log(el); // 这里证明已经用虚拟 DOM 更新了实际 DOM
                    // <div id="components-demo">
                    //     22
                    // </div>
                    console.log(el.__vue__); // undefined  这里证明还没完成挂载
                    console.log(vnode); // VNode {...}
                },
            },
            _inserted: {
                inserted: function (el, binding vnode) {
                    console.log(el);
                    // <div id="components-demo">
                    //     22
                    // </div>
                    console.log(el.__vue__); // undefined
                    console.log(vnode); // VNode {...}
                },
            },
            _update: {
                update: function (el, binding vnode) {
                    console.log(el);
                    // <div id="components-demo">
                    //     33
                    // </div>
                    console.log(el.__vue__); // Vue {...}
                    console.log(vnode); // VNode {...}
                },
            },
        },
        mounted(){
            // alert('mounted');
            setTimeout(()=>{
                this.num1 = 33;
            }, 2000);
        },
    });
    ```

#### `update`
1. Called after the containing component’s VNode has updated, but possibly
before its children have updated.
2. 发生在`beforeUpdate`之后，即虚拟 DOM 更新和重渲染，这很合理。
3. 和`updated`一样，判断数据是否更新的算法是 Same-value-zero。
4. The directive’s value may or may not have changed, but you can skip
unnecessary updates by comparing the binding’s current and old values.

#### `componentUpdated`
1. Called after the containing component’s VNode and the VNodes of its children
have updated.
2. 发生在`updated`之前，这很合理。

#### `unbind`
1. Called only once, when the directive is unbound from the element.
2. 发生在`beforeDestroy`和`destroyed`之间，很合理。


### Directive Hook Arguments
* Apart from `el`, you should treat these arguments as read-only and never
modify them. If you need to share information across hooks, it is recommended to
do so through element’s `dataset`.

#### `el`
* The element the directive is bound to. This can be used to directly manipulate
the DOM.
* 即使是最早执行的`bind`钩子函数，也是在挂载阶段虚拟 DOM 替换了真实 DOM 之后。不过此时
挂载过程还没完成，之后才会触发`mounted`
    ```html
    <div id="components-demo" v-_bind>{{ num1 }}</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        // 也可以局部注册
        directives: {
            _bind: {
                bind: function (el, binding vnode) {
                    console.log(el.textContent); // 22   虚拟 DOM 替换了真实 DOM
                    alert('bind');
                },
            },
        },
        beforeMount(){
            console.log(this.$el.textContent);
            alert('beforeMount');
        },
        mounted(){
            console.log(this.$el.textContent);
            alert('mounted');
        },
    });
    ```

#### `binding`
An object containing the following properties:
* `name`: The name of the directive, without the `v-` prefix.
* `value`: The value passed to the directive. For example in
    `v-my-directive="1 + 1"`, the value would be `2`.
    ```html
    <div id="components-demo" v-my-directive="1 + 1">{{ num1 }}</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        directives: {
            'my-directive': {
                bind: function (el, binding){
                    console.log(el.textContent); // "22"
                    console.log(binding.name); // "my-directive"
                    console.log(binding.value); 2
                }
            },
        },
    });
    ```
* `oldValue`: The previous value, only available in update and componentUpdated.
    It is available whether or not the value has changed.不懂，值不改变怎么触发钩子
    函数？
    ```html
    <div id="components-demo" v-_update="num1" v-_componentupdated="num2"></div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
            num2: 33,
        },
        directives: {
            _update: {
                update: function (el, binding) {
                    console.log(binding.value); // 222
                    console.log(binding.oldValue); // 22
                },
            },
            _componentupdated: {
                componentUpdated: function (el, binding) {
                    console.log(binding.value); // 333
                    console.log(binding.oldValue); // 33
                },
            },
        },
        mounted(){
            this.num1 = 222;
            this.num2 = 333;
        },
    });
    ```
* `expression`: The expression of the binding as a string. For example in v-my-directive="1 + 1", the expression would be "1 + 1".
* `arg`: The argument passed to the directive, if any. For example in v-my-directive:foo, the arg would be "foo".
* `modifiers`: An object containing modifiers, if any. For example in v-my-directive.foo.bar, the modifiers object would be { foo: true, bar: true }.

#### `vnode`
The virtual node produced by Vue’s compiler.

#### `oldVnode`
The previous virtual node, only available in the update and componentUpdated
hooks.
```html
<div id="components-demo" v-_update v-_componentupdated>{{ num1 }}</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    directives: {
        _update: {
            update: function (el, binding vnode, oldVnode) {
                console.log(vnode.children[0].text); // 33
                console.log(oldVnode.children[0].text); // 22
            },
        },
        _componentupdated: {
            componentUpdated: function (el, binding vnode, oldVnode) {
                console.log(vnode.children[0].text); // 33
                console.log(oldVnode.children[0].text); // 22
            },
        },
    },
    mounted(){
        this.num1 = 33;
    },
});
```
