# Instance Properties And Methods

## Properties
只收录部分不常见、不容易理解和存疑的

### vm.$options
1. The instantiation options used for the current Vue instance.
2. 但是看起来，应该是 Observer 对实例化传入的数据进行了改造，导致某些选项和传入是的不一
样。比如 `vm.$options.data` 变成了一个函数，而想要访问 `mounted` 的函数，必须要按照这
样的方法: `vm.$options.mounted[0]`。


### vm.$children
Note there’s no order guarantee for `$children`, and it is not reactive.


### vm.$slots
1. Used to programmatically access content distributed by slots.
2. Each named slot has its own corresponding property (e.g. the contents of
`slot="foo"` will be found at `vm.$slots.foo`).
3. The `default` property contains any nodes not included in a named slot.

模板 HTML
```html
<blog-post>
    <h1 slot="header">
        About Me
    </h1>
    <p>
        Here's some page content, which will be included in vm.$slots.default,
        because it's not inside a named slot.
    </p>
    <p slot="footer">
        Copyright 2016 Evan You
    </p>
    <p>
        If I have some content down here, it will also be included in vm.$slots.default.
    </p>.
</blog-post>
```

使用 `render` 来创建组件
```js
Vue.component('blog-post', {
    render(createElement) {
        const header = this.$slots.header;
        const body   = this.$slots.default;
        const footer = this.$slots.footer;
        return createElement('div', [
            createElement('header', header),
            createElement('main', body),
            createElement('footer', footer),
        ]);
    },
});
```

编译之后的 HTML
```html
<div>
    <header>
        <h1>About Me</h1>
    </header>
    <main>
        <p>
            Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.
        </p>  
        <p>
            If I have some content down here, it will also be included in vm.$slots.default.
        </p>
    </main>
    <footer>
        <p>
            Copyright 2016 Evan You
        </p>
    </footer>
</div>
```


## Methods
### `vm.$watch`
最基本的用法和在创建实例时的`watch`属性用法一样，只不过可以在创建实例后添加监听

#### 更强大的数据监听
1. 不同的是，该方法可以监听子属性
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            name: '33',
            age: 22,
            other: {
                sex: 'female',
            },
        },
    });
    vm.$watch('other.sex', function(){
        console.log('⑨');
    });
    ```
2. 更高级的是，它可以监听一个表达式的值是否变动
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

#### 可以取消监听
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

#### 立即以属性的当前值触发监听回调
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
看起来内部的逻辑就是，在添加的时候就顺便调用以下回调，然后才进入真正的 watch 状态。
