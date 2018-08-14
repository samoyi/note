# List Rendering

## `v-for`
```html
<div id="components-demo">
    <!-- You can also use of as the delimiter instead of in, so that it is
    closer to JavaScript’s syntax for iterators -->
    <p v-for="(value, key, index) of obj">
        {{index}}. {{key}}: {{value}}
    </p>
</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        obj: {
            name: '33',
            age: 22,
            sex: 'female',
        }
    },
    mounted(){
        // When iterating over an object, the order is based on the key
        // enumeration order of Object.keys(), which is not guaranteed to be
        // consistent across JavaScript engine implementations.
        console.log(Object.keys(this.obj)); // ["name", "age", "sex"]
    },
});
```

### `key`
1. When Vue is updating a list of elements rendered with `v-for`, by default it
uses an “in-place patch” strategy.
2. If the order of the data items has changed, instead of moving the DOM
elements to match the order of the items, Vue will patch each element in-place
and make sure it reflects what should be rendered at that particular index.
3. This default mode is efficient, but only suitable when your list render
output does not rely on child component state or temporary DOM state (e.g. form
input values).

#### rely on child component state
```html
<ul id="components-demo" @click="reverse">
    <li v-for="val of arr">
        <child-component :outer-value="val"></child-component>
    </li>
</ul>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: ['outerValue'],
            template: `<span>
                outerValue: {{outerValue}}  innerValue: {{innerValue}}
            </span>`,
            data: function(){
                return {
                    innerValue: '_' + this.outerValue,
                };
            },
        }
    },
    data: {
        arr: [22, 33]
    },
    methods: {
        reverse(){
            this.arr.reverse();
        },
    },
});
```
1. 会渲染出来两个`<span>`，每个`<span>`对应一个组件实例。span1 对应 comp1，span2 对
应comp2。
2. 现在想要颠倒页面上的两个`<span>`，如果直接操作的话就是修改 DOM。但 DOM 操作消耗比较
大，所以 Vue 不想实际颠倒两个 VNode 及真实 `<span>`，只会让 span1 的数据和 span2 的
数据交换一下即可。
3. 如果没有`innerValue`，那现在的数据依赖仅仅是 span1 的`outerValue` 依赖`arr[0]`，
span2 的`outerValue`依赖`arr[1]`。Vue 只需要通过`reverse`方法把`arr`颠倒一下，span1
和 span2 中的`outerValue`就颠倒了。看起来好像真的把节点颠倒了一样。
4. 但现在的情况是，组件内部还有自己的状态`innerValue`，而且这个状态还会影响渲染。
5. `reverse`虽然颠倒了`outerValue`依赖的`arr`，但却没有颠倒`innerValue`依赖的组件内
部属性`innerValue`。
6. 当然你也可以改造一下`reverse`方法，让它连两个`innerValue`也颠倒：
```js
reverse(){
    this.arr.reverse();

    let innerValue0 = this.$children[0].innerValue;
    let innerValue1 = this.$children[1].innerValue;
    this.$children[0].innerValue = innerValue1;
    this.$children[1].innerValue = innerValue0;
}
```
7. 不过还是使用`key`更简单一些。By adding a `key` to the components, however, you
are telling Vue that each component has a specific ID that and Vue will only
re-use that component if it has the same ID.
8. 本例很简单，所以修改`reverse`就可以。对于复杂的情况，显然使用`key`禁止复用强制进行
DOM 移动更简单。但是，性能上哪个更好的？

#### rely on temporary DOM state
```html
<ul id="components-demo" @click="reverse">
    <li v-for="n of arr">
        <child-component :num="n"></child-component>
    </li>
</ul>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: ['num'],
            template: `<p>
                {{num}} <input type="text" />
            </p>`,
        }
    },
    data: {
        arr: [22, 33]
    },
    methods: {
        reverse(ev){
            if (ev.target.nodeName !== 'INPUT'){
                this.arr.reverse();
            }
        },
    },
});
```
1. 现在两个`<input>`，然后点击切换，会发现只有前面的数字换了。

## References
* [StackOverflow](https://stackoverflow.com/a/44079395)
