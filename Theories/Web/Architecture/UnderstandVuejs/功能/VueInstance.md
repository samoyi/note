# Vue Instance

## 创建 Vue 实例时，做了哪些工作？
没有看源码，但大概的过程就是编译模板并双向绑定，也就是这一篇：
`Theories\Web\Architecture\UnderstandVuejs\原理\Two-wayBinding.md`

### mount 之后，节点被添加`__vue__`属性，引用 vue 实例
```js
let oNode = document.querySelector('#components-demo');

console.log(oNode['__vue__']); // undefined

const vm = new Vue({
    el: '#components-demo',
    data: {
        name: '33',
    },
    beforeMount(){
        console.log(Object.keys(this.$el)); // []
    },
    mounted(){
        console.log(Object.keys(this.$el)); // ["__vue__"]
    },
});

oNode = document.querySelector('#components-demo');
console.log(oNode['__vue__'] === vm); // true
```
但是注意，在创建实例后，必须要再获取一次元素才行，否则，`oNode['__vue__']`的值不是`vm`
，而且居然也不是之前的`undefined`，竟然是`null`。不懂。


## Vue 应用结构
1. 一个 Vue 应用由一个通过`new Vue`创建的根 Vue 实例，以及可选的嵌套的、可复用的组件树
组成。
2. 所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象 (一些根实例特有的选项除外)。
3. 所以说一个 Vue 应用可以理解为层层嵌套的 Vue 实例，或者层层嵌套的 Vue 组件。


## 实例与 View 和 Model 的关系
* 实例不包含 View（HTML），但它会通过`el`来把已有的 HTML 节点定义为模板，或者自定义
HTML 并通过`template`将其指定为模板。
* 实例同样不包括 Model（数据），但它会通过`data`来引用数据。


## 创建 Vue 实例时，选项最终在实例上的位置
### `vm.$options`
看起来除了`data`以外的属性都会作为`vm.$options`的属性。运行下面代码可以看到效果
```js
new Vue({
	el: '#app',
	data: {
		age: 22,
	},
	methods: {
		foo(){
			return 'this is foo';
		},
	},
	mounted(){
		console.log(this.$options.el);
		console.log(this.$options.methods.foo.toString());
		console.log(this.$options.mounted.toString());
		console.log(this.age);
	},
});
```

### `vm.$el`
`vm.$el`会引用节点
```js
new Vue({
	el: '#app',
	data: {
		age: 22,
	},
	methods: {
		foo(){
			return 'this is foo';
		},
	},
	mounted(){
		console.log(this.$el.id); // "app"
	},
});
```


## 手动挂载
1. 如果 Vue 实例在实例化时没有收到`el`选项，则它处于“未挂载”状态，没有关联的 DOM 元素。
2. 可以使用`vm.$mount()`手动地挂载一个未挂载的实例。`$mount`方法的参数是挂载点选择器，
Vue 将使用实例的模板覆盖选择器所在的元素
    ```html
    <div id="app">app</div>
    <!-- 渲染为 <p>2233</p> -->
    ```
    ```js
    let vm = new Vue({
        template: `<p>2233</p>`
    }).$mount(`#app`);
    ```
3. 如果没有提供选择器参数给`$mount`，模板将被渲染为文档之外的的元素，并且你必须使用原生
DOM API 把它插入文档中。
    ```html
    <div id="app">
        app
    </div>
    <!-- 渲染为：
    <div id="app">
        app
    <p>2233</p></div> -->
    ```
    ```js
    let vm = new Vue({
        template: `<p>2233</p>`
    });

    vm = vm.$mount(); // 返回挂载后的组件
    let node = vm.$el; // 因为已经挂载，所以 $el 属性是渲染后的节点
    // 使用原生方法插入 DOM，显然这样并不会覆盖节点当前的内部子节点
    document.querySelector('#app').appendChild(node);
    ```


## Misc
### `el`
* 也可以是一个 HTMLElement 实例
    ```js
    new Vue({
        el: document.querySelector('#app'),
    });
    ```
* 如果在实例化时存在这个选项，实例将立即进入编译过程，否则，需要显式调用`vm.$mount()`
手动开启编译。
* 如果`render`函数和`template`属性都不存在，挂载 DOM 元素的 HTML 会被提取出来用作模板
，此时，必须使用 Runtime + Compiler 构建的 Vue 库。

### `data`
* 根属性名不能以`_`或`$`开头，因为它们可能和 Vue 内置的属性、API 方法冲突。但子属性名
和计算属性没有该限制
    ```js
    data: {
        // $id: 123, // 报错
        // _code: 456, // 报错
        profile:{
            $name: '33',
            _age: 22,
        },
    },
    computed: {
        $hehe(){
            return 'hehe';
        },
        _haha(){
            return 'haha';
        },
    },
    ```

### `template`
* 出于安全考虑，你应该只使用你信任的 Vue 模板。避免使用其他人生成的内容作为你的模板。
* 如果 Vue 选项中包含渲染函数，该模板将被忽略。

## References
* [Vue 实例](https://cn.vuejs.org/v2/guide/instance.html)
