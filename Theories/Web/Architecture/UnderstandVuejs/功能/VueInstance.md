# Vue Instance

## 创建 Vue 实例时，做了哪些工作？
没有看源码，但大概的过程就是编译模板并双向绑定，也就是这一篇：
`Theories\Web\Architecture\UnderstandVuejs\原理\Two-wayBinding.md`

### mount 之后，节点被添加`__vue__`属性
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
,而且居然也不是之前的`undefined`，竟然是`null`。不懂。


## Vue 应用结构
1. 一个 Vue 应用由一个通过`new Vue`创建的根 Vue 实例，以及可选的嵌套的、可复用的组件树
组成。
2. 所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象 (一些根实例特有的选项除外)。
3. 所以说一个 Vue 应用可以理解为层层嵌套的 Vue 实例，或者层层嵌套的 Vue 组件。


## 实例与 View 和 Model 的关系
* 实例不包含 View（HTML），但它会通过`el`来把已有的 HTML 节点定义为模板，或者自定义
HTML 并通过`template`将其指定为模板。
* 实例同样不包括 Model（数据），但它会通过 `data` 来引用数据。


## 创建 Vue 实例时，选项最终在实例上的位置
### `vm.$options`
* 看起来除了`data`以外的属性都会作为`vm.$options`的属性

### `vm.$el`
* `vm.$el`会引用节点，但同样也是添加了`__vue__`属性的
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
    });

    console.log(vm.$el.id === 'components-demo'); // true
    console.log(vm.$el['__vue__'] === vm); // true
    ```



## References
* [Vue 实例](https://cn.vuejs.org/v2/guide/instance.html)
