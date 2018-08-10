# Instance Lifecycle

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
    更为神奇的是，如果前面使用`debugger`，后面的钩子函数甚至会抛出错误：
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
        beforeCreate(){
            debugger;
        },
        mounted(){
            console.log('mounted')； // SyntaxError: Invalid or unexpected token
        }
    });
    ```
    因此如果要断点测试，需要使用`alert`




## 实例生命周期
### 第一步 实例初始化
* 不懂这个初始化到底做了什么，必须要看源码。但总之是很初步的工作，没做什么重要内容。
* 初始化结束后触发`beforeCreate`

#### `beforeCreate`
Called synchronously immediately after the instance has been initialized, before
data observation and event/watcher setup.
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
* 这一阶段将处理创建实例时的配置，进而完成创建实例。包括：
    * 实现 data observation。应该就是指 Observer 模块使用 setter、getter 劫持了实例
        数据。
    * 处理了 computed properties, methods, watch/event callbacks。
* However, the mounting phase has not been started, and the `$el` property will
not be available yet.
* 这一阶段还不涉及模板，只是纯 JS 的部分。
* 创建实例结束后触发`created`

#### `created`
既然已经创建完成，所以实例上的各种属性都可访问
```js
new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
    methods: {
        foo(){return 22},
    },
    created(){
        console.log(this.num1); // 22
        console.log(this.foo); // ƒ foo(){return 22}
        // 已经完成了 data observation
        console.log(Object.getOwnPropertyDescriptor(this, 'num1'));
        // {get: ƒ, set: ƒ, enumerable: true, configurable: true}
        console.log(this.$el); // undefined
    },
});
```

### 第三阶段 编译模板
* 编译模板只是根据数据更新虚拟 DOM，只有 mounting 才会涉及真实 DOM。所以真实的 DOM 并
不会更新，下面的例子中，虽然这是`this.$el`已经指向了实际的 DOM 节点，但还是没有编译更新
过的。
* This hook is not called during server-side rendering.
* As mounting hooks do not run during server side rendering, they shouldn’t be used
for fetching data for components on initialization. `created()` methods are best
suited for that purpose.
* 模板编译完成后触发`beforeMount`，the render function is about to be called for
the first time.

#### `beforeMount`
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
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     {{ num1 }}
        // </div>
        console.log(this.$el.__vue__); // undefined
    },
});
```

### 第四阶段 挂载
* 用编译好的虚拟 DOM 更新实际的 DOM，并进行渲染。
* 这时`this.$el`指向的实际 DOM 节点已经是更新后的了。并且还带上了`__vue__`属性指向它
的 Vue 实例。
* If the root instance is mounted to an in-document element, `vm.$el` will also
be in-document when mounted is called. 不懂，但总之 mounting 阶段会进行渲染，而
`mounted`触发时已经完成了渲染
* Note that `mounted` does not guarantee that all child components have also
been mounted. If you want to wait until the entire view has been rendered, you
can use `vm.$nextTick` inside of `mounted`:
    ```js
    mounted: function () {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
      })
    }
    ```
    看起来的意思就是在本次执行周期内，它的所有子组件也都会完成 mounting
* This hook is not called during server-side rendering.
* 挂载结束后触发`mounted`

#### `mounted`
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
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     {{ num1 }}
        // </div>
        console.log(this.$el.__vue__); // undefined
    },
    mounted(){
        console.log(this.$el);
        // 打印如下：
        // <div id="components-demo">
        //     22
        // </div>
        console.log(this.$el.__vue__ === this); // true
    },
});
```

### 第五阶段 数据更新
* 当有数据更新时，会触发数据属性的 getter，从而进入该阶段。
* 判断数据是否更新的算法是 Same-value-zero。下面的情况不会触发更新：
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
* 该阶段结束后，触发`beforeUpdate`，之后将进入虚拟 DOM 更新和重渲染阶段
* This is a good place to access the existing DOM before an update, e.g. to
remove manually added event listeners.
* This hook is not called during server-side rendering, because only the initial
render is performed server-side.

### 第六阶段 虚拟 DOM 更新和重渲染
* Called after a data change causes the virtual DOM to be re-rendered and patched.
* The component’s DOM will have been updated when this hook is called, so you
can perform DOM-dependent operations here.
* However, in most cases you should avoid changing state inside the hook. To
react to state changes, it’s usually better to use a computed property or
watcher instead.
* Note that updated does not guarantee that all child components have also been
re-rendered. If you want to wait until the entire view has been re-rendered, you
can use `vm.$nextTick` inside of updated
* 避免在这个钩子函数中操作数据，可能陷入死循环
* This hook is not called during server-side rendering.
* 重渲染结束后，触发`updated`

### 第七阶段 准备销毁实例
* 当调用`vm.$destroy()`，开始进入这一阶段
* 该阶段结束后，触发`beforeDestroy`，之后将执行实例销毁
* At this stage the instance is still fully functional.
* 常用于销毁定时器、解绑全局事件、销毁插件对象等操作
* This hook is not called during server-side rendering.

### 第八阶段 销毁实例
* All directives of the Vue instance will be unbound, all event listeners will
be removed, and all child Vue instances will also be destroyed.
* 销毁完毕后，会触发`destroyed()`
* `destroyed()` method can be used to do any last minute cleanup or informing a
remote server that the component was destroyed.
* This hook is not called during server-side rendering.


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

update prop 时的输出：
```shell
parent -- beforeUpdate
child1 -- beforeUpdate
child2 -- beforeUpdate
child2 -- updated
child1 -- updated
parent -- updated
```

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
