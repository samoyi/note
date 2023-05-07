# Directives


<!-- TOC -->

- [Directives](#directives)
    - [作用](#作用)
    - [Arguments 和 Modifiers](#arguments-和-modifiers)
    - [自定义指令](#自定义指令)
    - [自定义指令钩子函数](#自定义指令钩子函数)
        - [`bind`](#bind)
        - [`inserted`](#inserted)
        - [`update`](#update)
        - [`componentUpdated`](#componentupdated)
        - [`unbind`](#unbind)
        - [执行时间测试](#执行时间测试)
    - [Directive Hook Arguments](#directive-hook-arguments)
        - [`el`](#el)
        - [`binding`](#binding)
        - [`vnode`](#vnode)
        - [`oldVnode`](#oldvnode)
    - [钩子函数不是方法调用](#钩子函数不是方法调用)
    - [在 `bind` 和 `update` 时触发相同行为时的简写](#在-bind-和-update-时触发相同行为时的简写)
    - [可以传入引用类型字面量](#可以传入引用类型字面量)

<!-- /TOC -->


## 作用
1. 只有 Model 和 ViewModel 实例，没办法直接操作 HTML，因为它们和 HTML 是没有发生联系的，必须要提供一套联系的接口。
2. 各种指令就是接口。当 Vue 编译 HTML 模板时，节点中的各种指令将告诉 Vue 该如何处理该节点。之后数据更新时，指令也会告诉 Vue 怎么更新 View。
3. 也就是说，Vue 通过各种各样的指令，基于 Model，来操作 View。
4. 比如 `v-for` 指令告诉 Vue 要循环该节点，`v-if` 指令告诉 Vue 要根据变量的布尔值来决定是否渲染该节点，`{{}}` 指令告诉 Vue 要把其中的变量替换为变量值。


## Arguments 和 Modifiers
1. 其实如果把指令理解为函数的话，Arguments 和 Modifiers 都可以理解为指令的参数
    ```html
    <form v-on:submit.prevent="onSubmit">...</form>
    ```
2. 上面这个事件绑定指令的 argument 是 `submit`，modifier 是 `prevent`。其实就是告诉 Vue 要添加一个事件绑定，同时有三个参数来个性化这个事件绑定：`:submit` 要求事件类型是 `submit`，`.prevent` 要求阻止默认事件，`onSubmit` 指定事件处理函数。


## 自定义指令
1. 自定义一个指令，告诉 Vue 在 **什么时间** 对一个节点做 **哪些事情**。
2. **什么时间** 就是钩子函数的函数名，**哪些事情** 就是钩子函数的函数体。
3. 和默认指令一样，自定义指令也是告诉 Vue 要怎么处理节点。因为可以自定义，所以就可以订制各种各样操作 View 的方法。
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
4. 指令名和 prop 的大小写规则一样。HTML 中的 attribute 名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当你使用 DOM 中的模板时，camelCase 的指令名在模板中需要使用其等价的 kebab-case 形式命名
    ```html
    <div id="demo" v-_component-updated>
        {{ num1 }}
    </div>
    ```
    ```js
    new Vue({
        el: '#demo',
        data: {
            num1: 22,
        },
        directives: {
            _componentUpdated: {
                componentUpdated (el) {
                    alert('v-componentUpdated');
                },
            },

        },
    });
    ```
5. 若你需要在不同的钩子间共享信息，推荐通过元素的 `dataset` attribute 实现。


## 自定义指令钩子函数
规定指令什么时候生效

### `bind`
1. 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
2. 此时虽然已经进入了挂载阶段，但还没有替换真实的 DOM
    ```html
    <div id="demo" v-_bind v-_inserted v-_update v-_component-updated :class="{foo: num1 > 30}">{{ num1 }}</div>
    ```
    ```js
    new Vue({
        el: '#demo',
        data: {
            num1: 22,
        },
        directives: {
            _bind: {
                bind (el, binding, vnode) {
                    alert("bind");

                    // 虚拟 DOM 中的 {{ num1 }} 已经更新成了 22
                    alert(el.outerHTML); // <div id="demo" class="">22</div> 

                    // 但还没有更新实际 DOM
                    alert(document.querySelector("#demo").outerHTML); // <div id="demo" v-_bind="" v-_inserted="" v-_update="" v-_component-updated="" :class="{foo: num1 > 30}">{{ num1 }}</div> 

                    console.log(el.__vue__); // undefined // 没完成挂载
                    console.log(vnode);
                },
            },
            _inserted: {
                inserted (el, binding, vnode) {
                    alert("inserted");

                    // 实际 DOM 也发生了更新
                    alert(document.querySelector("#demo").outerHTML);  // <div id="demo" class="">22</div> 

                    console.log(el.__vue__); // undefined // 挂载阶段还没完全结束
                    console.log(vnode);
                },
            },
            _update: {
                update (el, binding, vnode) {
                    alert("update");

                    // 指令所在 VNode 本身已经发生了更新，也就是 class 发生了更新
                    // 但子 Vnode 还没更新，也就是 {{ num1 }} 的值还是 22
                    alert(document.querySelector("#demo").outerHTML);  // <div id="demo" class="foo">22</div>
                },
            },
            _componentUpdated: {
                componentUpdated (el, binding, vnode) {
                    alert("componentUpdated");

                    // 子 Vnode 也完成了更新
                    alert(document.querySelector("#demo").outerHTML); // <div id="demo" class="foo">33</div>
                },
            },
        },
        mounted(){
            setTimeout(()=>{
                this.num1 = 33;
            }, 2000);
        },
    });
    ```

### `inserted`
1. 被绑定元素插入父节点时调用。
2. 仅保证父节点存在，但不一定已被插入文档中。
3. `bind` 和 `inserted` 这两个钩子函数，都是在 `beforeMount` 和 `mounted` 钩子函数之间触发的。也就是说，发生在模板编译之后的挂载阶段。
4. 从上面的例子可以看到，这时实际 DOM 也发生了更新。

### `update`
1. 所在组件的 VNode 更新时调用（并不一定是指令的值更新），但是可能发生在其子 VNode 更新之前。从上面例子中的 `update` 钩子可以看到，当前 VNode 本身的 `class` 属性发生改变了，但内部文本节点的 Vnode 还没有更新。
2. 发生在 `beforeUpdate` 之后，因为 `beforeUpdate` 的时间点是整个更新过程的起点。
3. 和 `updated` 一样，判断数据是否更新的算法是 Same-value-zero。
4. 指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
    ```html
    <!-- name 和 age 的更新都可以触发 foo 指令的 update 钩子 -->
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
    			update(el, {oldValue, value}){
    				 if (oldValue !== value){
                         // age 更新了
    					 // 指令值更新了再执行
    				 }
                     else {
                         // 其他的更新
                     }
    			},
    		},
    	},
    })
    ```

### `componentUpdated`
1. 指令所在组件的 VNode 及其子 VNode 全部更新后调用。从上面例子中的 `componentUpdated` 钩子可以看到，文本节点的 Vnode 也发生了更新。
2. 生命周期钩子函数要确保子组件全部更新完时必须要用到 `vm.$nextTick`，那这里为什么却有了一个单独的钩子呢？不懂
3. 发生在 `updated` 之前，这很合理。

### `unbind`
1. 只调用一次，指令与元素解绑时调用。
2. 发生在 `beforeDestroy` 和 `destroyed` 之间，很合理。

### 执行时间测试
1. 测试代码
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
2. 顺序如下   
    ``` 
    beforeMount
    v-bind
    v-inserted
    mounted
    beforeUpdate
    v-update
    v-componentUpdated
    updated
    beforeDestroy
    v-unbind
    destroyed
    ```


## Directive Hook Arguments
除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行。

### `el`
1. 指令所绑定的元素，可以用来直接操作 DOM 。
2. 但是，这个值并不总是等于实际的 DOM 节点，看下面的例子
    ```js
    _bind: {
        bind (el, binding, vnode) {
            alert(el === document.querySelector("#demo"));                // false
            console.log(JSON.stringify(el));                              // {"_prevClass":""}
            console.log(JSON.stringify(document.querySelector("#demo"))); // {}
        },
    },
    _inserted: {
        inserted (el, binding, vnode) {
            alert(el === document.querySelector("#demo"));                // true
            console.log(JSON.stringify(el));                              // {"_prevClass":""}
            console.log(JSON.stringify(document.querySelector("#demo"))); // {"_prevClass":""}
        },
    },
    ```
3. `bind` 调用时，虚拟 DOM 中的节点已经更新了，但还没有更新实际 DOM，所以两者是不相同的。所以在 `bind` 调用时，`el` 还只是虚拟 DOM 中的元素，只有到 `inserted` 调用时，才同步更新到实际的 DOM，两者才是一样的。

### `binding`
一个对象，包含以下属性：
* `name`: 指令名，不包括 `v-` 前缀。 
* `value`: 指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
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
                    console.log(binding.name); // "my-directive"
                    console.log(binding.value); // 2
                }
            },
        },
    });
    ```
* `oldValue`: 指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。在其他钩子函数中值为 `undefined`。无论值是否改变都可用。
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
* `expression`: 字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。不懂，有什么用
    ```html
    <div id="components-demo" v-_bind1="22 + 33" v-_bind2></div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        directives: {
            _bind1: {
				bind(el, {expression}){
					console.log(expression); // "22 + 33"
				},
			},
			_bind2: {
				bind(el, {expression}){
					console.log(expression); // undefined
				},
			},
        },
    });
    ``` 
* `arg`: 传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`
    ```html
    <div id="components-demo">
        <span v-font-color:red>111</span>
        <span v-font-color:royalblue>222</span>
        <span v-font-color>333</span>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        directives: {
            'font-color': {
                inserted: function(el, {arg}){
    				if (arg){
    					el.style.color = arg;
    				}
                },
            },
        },
    });
    ```
* `modifiers`: 一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`
    ```html
    <div id="components-demo">
        <span v-font.bold>111</span>
        <span v-font.italic>222</span>
        <span v-font.italic.underline>333</span>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        directives: {
            'font': {
                inserted: function(el, {modifiers}){
                    if (modifiers.bold){
                        el.style.fontWeight = 'bold';
                    }
                    if (modifiers.italic){
                        el.style.fontStyle = 'italic';
                    }
                    if (modifiers.underline){
                        el.style.textDecoration = 'underline';
                    }
                },
            },
        },
    });
    ```

### `vnode`
* Vue 编译生成的虚拟节点。
* 比较常用的是在钩子函数里通过 `vnode.context` 引用当前 vm 实例
    ```html
    <div id="components-demo" v-show_this></div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        directives: {
            show_this(el, binding, vnode){
                console.log(this); // undefined
                console.log(vnode.context.$options.el); // "#components-demo"
            }
        },
    });
    ```

### `oldVnode`
上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。
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
            update: function (el, binding, vnode, oldVnode) {
                console.log(vnode.children[0].text); // 33
                console.log(oldVnode.children[0].text); // 22
            },
        },
        _componentupdated: {
            componentUpdated: function (el, binding, vnode, oldVnode) {
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


## 钩子函数不是方法调用
```js
new Vue({
    el: '#components-demo',
	directives: {
	    focus: {
	        inserted: function (el, b, vnode) {
	            console.log(this); // undefined  非严格模式下是 window
	            console.log(vnode.context); // 需要这样引用当前实例
	        },
	    },
	},
	mounted(){
	    console.log(this.focus); // undefined
		console.log(this.$options.directives.focus); // 需要这样引用指令
	},
});
```


## 在 `bind` 和 `update` 时触发相同行为时的简写
在很多时候，你可能想在 `bind` 和 `update `时触发相同行为，而不关心其它的钩子，可以直接把指令设定为函数。下面的例子会打印 `22` 和 `33`
```html
<div id="components-demo" v-console="num1"></div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    directives: {
        console: function(el, binding){
            console.log(binding.value);
        },
    },
    mounted(){
        this.num1 = 33;
    },
});
```


## 可以传入引用类型字面量
```html
<div id="components-demo" v-object="{name: '33', age: 22}" v-array="['Hime', 'Hina']"></div>
```
```js
new Vue({
    el: '#components-demo',
    directives: {
        object: function(el, {value}){
            console.log(value.name + ': ' + value.age); // "33: 22"
        },
        array: function(el, {value}){
            console.log(value[0] + ' & ' + value[1]); // "Hime & Hina"
        },
    },
});
```
