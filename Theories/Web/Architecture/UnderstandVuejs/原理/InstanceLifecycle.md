# Instance Lifecycle


<!-- TOC -->

- [Instance Lifecycle](#instance-lifecycle)
    - [Misc](#misc)
    - [实例生命周期](#实例生命周期)
        - [第一步 实例初始化](#第一步-实例初始化)
            - [`beforeCreate`](#beforecreate)
        - [第二步 创建实例](#第二步-创建实例)
            - [`created`](#created)
        - [第三阶段 编译模板](#第三阶段-编译模板)
            - [`beforeMount`](#beforemount)
        - [第四阶段 挂载](#第四阶段-挂载)
            - [`mounted`](#mounted)
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

![lifecycle](../images/lifecycle.png)


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


## 实例生命周期
### 第一步 实例初始化
1. 不懂这个初始化到底做了什么，必须要看源码。但总之是很初步的工作，没做什么重要内容。
2. 初始化结束后触发 `beforeCreate`

#### `beforeCreate`
Called synchronously immediately after the instance has been initialized, before data observation and event/watcher setup. 也就是说还没有开始处理实例的选项。
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

### 第二步 创建实例
1. 这一阶段将处理创建实例时的配置，进而完成创建实例。包括：
    * 实现 data observation。应该就是指 Observer 模块使用 setter、getter 劫持了实例数据。
    * 处理了 computed properties, methods, watch/event callbacks。
2. 这一阶段还不涉及模板，只是纯 JS 的部分。所以实例的 `$el` 也还不可用。
3. 创建实例结束后触发 `created`

#### `created`
既然已经创建完成，所以实例上的各种属性都可访问
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

### 第三阶段 编译模板
1. 编译模板只是根据数据更新虚拟 DOM，只有 mounting 才会涉及真实 DOM。
2. 所以真实的 DOM 并不会更新，下面的例子中，虽然这时 `this.$el` 已经指向了实际的 DOM 节点，但该节点还是没有被更新渲染过的。
3. `beforeMount` 钩子在服务器端渲染期间不被调用。因为涉及挂载的两个钩子函数在服务端渲染期间不会被调用，所以他们不能用于获取数据这样的操作。这样的操作应该在 `created()` 中进行。
4. 模板编译完成后触发 `beforeMount`，渲染函数准备首次调用来进行渲染。

#### `beforeMount`
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
1. 用编译好的虚拟 DOM 更新实际的 DOM，并进行渲染。
2. 挂载之后，`this.$el` 指向的实际 DOM 节点已经是更新后的了。并且还带上了 `__vue__` 属性指向它的 Vue 实例。
3. If the root instance is mounted to an in-document element, `vm.$el` will alsobe in-document when mounted is called. 不懂，但总之 mounting 阶段会进行渲染，而 `mounted` 触发时已经完成了渲染。
4. `mounted` 触发时只保证该组件已经被挂载，但不保证它的所有子组件也已经被挂载。如果你要确保它的子组件都已经挂载，就要在该钩子函数里使用 `vm.$nextTick`
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
6. 挂载结束后触发 `mounted`

#### `mounted`
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
2. 不影响 DOM 的更新不会进入该阶段，不会触发涉及更新的两个钩子函数。
3. 所谓影响 DOM 更新，包括所有影响的情况，可见的和不可见的。可见的例如直接渲染出数据的值，在某个影响更新的计算属性中用到该数据，用到该数据的涉及渲染的指令（例如以该数据为长度进行 `v-for`）。不可见的目前只发现了一个，就是不涉及渲染的指令用到了该数据。
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
4. 判断数据是否更新的算法是 Same-value-zero。下面的情况不会触发更新：
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
5. 该阶段结束后，触发 `beforeUpdate`，之后将进入虚拟 DOM 更新和重渲染阶段。看起来也就是说这一阶段只是数据更新的相关工作，还不涉及 DOM 更新。
6. 如果要在更新前做点什么，那就应该在 `beforeUpdate` 钩子函数中执行。比如移除节点的事件绑定。
7. 这个钩子函数也不会在服务端渲染被调用，因为只有初始渲染是在服务端进行的。

### 第六阶段 虚拟 DOM 更新和重渲染
1. 数据更新引发 DOM 更新后，会触发 `updated` 函数。
2. 这里所谓的 DOM 更新，和 `beforeUpdate` 的情况一样，不仅涉及可见的更新，也涉及不引发重渲染的的指令的更新。
3. 因为 `updated` 触发时 DOM 已经更新完成，所以可以进行依赖 DOM 的操作。
4. `updated` 触发时只保证该组件已经被重渲染，但不保证它的所有子组件也已经被重渲染。如果你要确保它的子组件都已经重渲染，就要在该钩子函数里使用 `vm.$nextTick`。
5. 避免在这个钩子函数中操作数据，可能陷入死循环
6. 同样在服务端渲染中不会被触发。

### 第七阶段 准备销毁实例
1. 当调用 `vm.$destroy()`，开始进入这一阶段。
2. 该阶段结束后，触发 `beforeDestroy`，之后将执行实例销毁。
3. 在这个阶段内因为还只是准备销毁，所以实例还可以正常使用。
4. 常用于销毁定时器、解绑全局事件、销毁插件对象等操作。
5. 在服务端渲染中不会被触发。

### 第八阶段 销毁实例
1. 实例的所有指令和 watcher 会被解绑，事件监听会被移除，子实例也会销毁。
2. 上面官方的图中，这一阶段做的工作为 “Teardown watchers, child components and event listeners”。
3. 我之前测试的时候，发现在 `destroyed` 钩子里面依然可以通过 `this._watchers` 访问到所有的 watcher，子组件啥的也都能访问到，看起来好像和 `beforeDestroy` 的没啥区别。
4. 找到这一阶段的源码
    ```js
    Vue.prototype.$destroy = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestroy');

        vm._isBeingDestroyed = true;
        // remove self from parent
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm);
        }
        // teardown watchers
        if (vm._watcher) {
            vm._watcher.teardown();
        }
        var i = vm._watchers.length;
        while (i--) {
            vm._watchers[i].teardown();
        }
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);

        // fire destroyed hook
        callHook(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
            vm.$vnode.parent = null;
        }
    };
    ```
5. 再看看 `teardown` 的代码
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
7. 销毁完毕后，会触发 `destroyed()`。
8. `destroyed()` 用于销毁实例后的后续清理工作，或者通知远程服务器该本次销毁。
9. 同样在服务端渲染中不会被触发。


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
这里比较有意思的是子实例的创建时间，是在父实例编译完成之后。父实例编译的过程中才会发现子
组件标签，所以应该就是发现之后，在编译完成后就紧接着开始创建刚发现的子实例。

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
按照文档说的：Hook functions with the same name are merged into an array so that
all of them will be called. Mixin hooks will be called before the component’s
own hooks.


## 与自定义指令钩子函数相比的执行顺序
`Theories\Web\Architecture\UnderstandVuejs\功能\Directives.md`


## References
* [API Options / Lifecycle Hooks](https://vuejs.org/v2/api/#Options-Lifecycle-Hooks)
* [The Vue Instance](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
* [Vue Instance Lifecycle & Hooks](https://codingexplained.com/coding/front-end/vue-js/vue-instance-lifecycle-hooks)
* [Demystifying Vue Lifecycle Methods](https://scotch.io/tutorials/demystifying-vue-lifecycle-methods)
* [Vue生命周期深入](https://segmentfault.com/a/1190000014705819)
