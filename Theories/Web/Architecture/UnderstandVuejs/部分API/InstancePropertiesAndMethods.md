# Instance Properties And Methods

## Properties
只收录部分不常见、不容易理解和存疑的

### vm.$options
1. The instantiation options used for the current Vue instance.
2. 但是看起来，应该是 Observer 对实例化传入的数据进行了改造，导致某些选项和传入是的不一
样。比如 `vm.$options.data` 变成了一个函数，而想要访问 `mounted` 的函数，必须要按照这
样的方法: `vm.$options.mounted[0]`。


### vm.$children
当前实例的直接子组件。需要注意`$children`并不保证顺序，也不是响应式的。


### vm.$slots
1. 用来访问被插槽分发的内容。
2. 每个具名插槽 有其相应的属性 (例如：`slot="foo"`中的内容将会在`vm.$slots.foo`中被找
到)。
3. `default`属性包括了所有没有被包含在具名插槽中的节点。
4. 不管插入的内容是一个还是多个，`vm.$slots.foo`或`vm.$slots.default`的值都是一个数
组，里面包含一个或多个 VNode。

```html
<div id="app">
    <child-component>
        其他内容1
        <span slot="named">具名插槽内容</span>
        其他内容2
    </child-component>
</div>
```
```js
Vue.component('child-component', {
    render(h) {
        const other = this.$slots.default;
        const named = this.$slots.named;
        console.log(other); // [VNode, VNode, _rendered: false]
        console.log(named); // [VNode, _rendered: false]
        return h('p', [...other, ...named]);
    },
    // template 语法
    // template: `<p>
    //                 <slot></slot>
    //                 <slot name="named"></slot>
    //             </p>`,
});

new Vue({
    el: '#app',
});
```

编译之后的 HTML
```html
<div id="app">
    <p>
        其他内容1

        其他内容2
        <span>具名插槽内容</span>
    </p>
</div>
```


## Methods
### `vm.$watch`
最基本的用法和在创建实例时的`watch`属性用法一样，只不过可以在创建实例后添加监听

#### Arguments
* `{string | Function} expOrFn`
* `{Function | Object} callback`
* `{Object} [options]`
    * `{boolean} deep`
    * `{boolean} immediate`

#### Returns
`{Function} unwatch`

#### 更强大的数据监听
##### 它可以监听一个表达式的值是否变动
    ```js
    // 监听一个不等式的结果是否变动，默认是 true
    const vm = new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
            num2: 33,
        },
    });

    vm.$watch(function(){
        return this.num1 < this.num2;
    }, function(n){
        console.log(n);
        console.log(this.num1, this.num2);
    });

    vm.num2 = 23; // 22 < 23，结果仍为 true，不会触发
    // 下面之所以要使用 setTimeout 回调，是因为 Vue 会对数据属性的修改进行节流，一个
    // 调用周期内的变化只会生肖最后一个。也可以用 nextTic，只不过要嵌套使用
    setTimeout(()=>{
        vm.num2 = 22; // 22 < 22，结果变为 false，会触发
    })
    setTimeout(()=>{
        vm.num2 = 21; // 22 < 21，结果仍为 false，不会触发
    })
    setTimeout(()=>{
        vm.num1 = 20; // 20 < 21，结果变为 true，会触发
    })
    setTimeout(()=>{
        vm.num1 = 24; // 24 < 21，结果变为 false，会触发
    })
    ```

##### 可以取消监听
`vm.$watch` returns an unwatch function that stops firing the callback
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
});

let unwatch = vm.$watch('num1', (n)=>{
    console.log(n);
});

vm.num1 = 20; // 会触发 watcher 回调
// unwatch(); // 不能放在这里，否则 20 的修改都不会触发。
// 可以看出来 watch 回调的执行时间：
// watcher 会收集一个执行周期的所有修改，在该周期的末尾执行回调，所以 20 的输出在
// 在 nextTick 的输出之前。而如果在本次执行周期期间就取消 watch 的话，周期末尾的回调就
// 不会被执行了

vm.$nextTick(()=>{
    console.log('nextTick'); // 在输出 20 之后输出 nextTick
    unwatch();
    vm.num1 = 21; // 不会触发 watcher 回调
});
```

#### 监听属性的后辈属性
使用可选的第三个参数，传入一个对象，其中`deep`属性设为`true`
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        obj: {
            inner: {
                name: 22,
            },
        },
    },
});

vm.$watch('obj', (n)=>{
    console.log(n.inner.name); // 33
}, {
    deep: true,
});

vm.obj.inner.name = 33;
```

Note that you don’t need to do so to listen for Array mutations:
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        arr: [1, 2],
    },
});

vm.$watch('arr', (n)=>{
    console.log(n); // [1, 2, 3, __ob__: Observer]
});

vm.arr.push(3);
```

##### 立即以属性的当前值触发监听回调
第三个参数的`immediate`属性设为`true`的话，添加 watcher 之后不用再修改该属性，就会立刻
以当前的属性值触发回调
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        num1: 22,
    },
});

let unwatch = vm.$watch('num1', (n)=>{
    console.log(n);
}, {
    immediate: true,
});

// 首先以 22 触发回调，下面的 20 也可以触发回调，并不会发生节流现象
vm.num1 = 20; // 会触发 watcher 回调
// unwatch(); // 只能阻止 20 的触发，无法阻止 22 的触发
```
看起来内部的逻辑就是，在添加的时候就顺便调用一下回调，然后才进入真正的 watch 状态。


### `vm.$destroy()`
1. 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
2. 但这里并不能完全清除。看下面的例子，`destroy`子组件之后，它上面的事件监听就会失效。
但是通过父级的`$refs`仍然可以引用甚至调用它的方法，而且组件的元素仍然会留在 DOM中。看起
来这两个都需要手动清除。看看这个[提问](https://forum.vuejs.org/t/how-to-wait-for-element-removal-from-doc-after-vm-destroy/5258)
    ```html
    <div id="app">
        <child-component ref="child" @fromchild="getEmit"></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#app',
        components: {
            'child-component': {
                template: `<p @click="$emit('fromchild')">ppp</p>`,
                beforeDestroy(){
                    console.log('beforeDestroy');
                },
                destroyed(){
                    console.log('destroyed');
                },
                methods: {
                    childMethod(){
                        console.log('子组件方法被触发');
                    },
                },
                mounted(){
                    setTimeout(()=>{
                        this.$destroy();
                    }, 2000);
                },
            },
        },
        methods: {
            getEmit(){
                console.log('收到了子组件的事件');
            },
        },
        mounted(){
            setTimeout(()=>{
                this.$refs.child.childMethod();
            }, 4000);
        },
    });
    ```
3. 触发`beforeDestroy`和`destroyed`钩子.
4. 在大多数场景中你不应该调用这个方法。最好使用`v-if`和`v-for`指令以数据驱动的方式控制
子组件的生命周期。
