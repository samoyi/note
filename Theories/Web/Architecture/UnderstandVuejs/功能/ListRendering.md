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
1. The `key` special attribute is primarily used as a hint for Vue’s virtual DOM
algorithm to identify VNodes when diffing the new list of nodes against the old
list.
2. When Vue is updating a list of elements rendered with `v-for`, by default it
uses an “in-place patch” strategy. Without keys, Vue uses an algorithm that
minimizes element movement and tries to patch/reuse elements of the same type
in-place as much as possible. If the order of the data items has changed,
instead of moving the DOM elements to match the order of the items, Vue will
patch each element in-place and make sure it reflects what should be rendered at
that particular index.
3. With keys, it will reorder elements based on the order change of keys, and
elements with keys that are no longer present will always be removed/destroyed.
4. This default mode is efficient, but only suitable when your list render
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
2. 其实和上面的道理一样，`reverse`只是颠倒了`num`依赖的`arr`，而并没有改变组件内
`input`的`value`

### `v-for` with a Range
`v-for` can also take an integer. In this case it will repeat the template that
many times.
```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

### `v-for` on a `<template>`
Similar to template `v-if`, you can also use a `<template>` tag with `v-for` to
render a block of multiple elements.
```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

### `v-for` with `v-if`
When they exist on the same node, `v-for` has a higher priority than `v-if`.
That means the `v-if` will be run on each iteration of the loop separately. 这是
理所应当的，如果`v-if`那它就可以控制是否进行列表渲染，而这个工作完全可以交给`v-for`来执
行，比如让数组长度为0。

### `v-for` with a Component
1. You can directly use `v-for` on a custom component, like any normal element.
2. However, this won’t automatically pass any data to the component, because
components have isolated scopes of their own.
3. In order to pass the iterated data into the component, we should also use
`props`.
```html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```
4. The reason for not automatically injecting item into the component is because
that makes the component tightly coupled to how `v-for` works. Being explicit
about where its data comes from makes the component reusable in other situations.
5. 想象能自动注入的情况：组件内部就可以直接使用`this.item`，而组件编写者不知道谁将使用
这个组件，也就不知道有什么变量会被自动注入。所以在组件内部，在运行时，`this`上面可以出现
任何属性。


## Array Change Detection
### Mutation Methods

### Replacing an Array
You might think this will cause Vue to throw away the existing DOM and re-render
the entire list - luckily, that is not the case. Vue implements some smart
heuristics to maximize DOM element reuse, so replacing an array with another
array containing overlapping objects is a very efficient operation. 需要查看源码

### Caveats
1. 由于属性的子属性的变动不会触发属性的 setter, Vue cannot detect the following
changes to an array:
    1. When you directly set an item with the index, e.g.
        `vm.items[indexOfItem] = newValue`
    2. When you modify the length of the array, e.g.
        `vm.items.length = newLength`
2. 针对第一种情况，可以使用以下两个方法：
    * `Vue.set`方法
    ```js
    Vue.set(vm.items, indexOfItem, newValue)
    // or
    vm.$set(vm.items, indexOfItem, newValue)
    ```
    * `Array.prototype.splice`
    ```js
    vm.items.splice(indexOfItem, 1, newValue)
    ```
3. 其实`Vue.set`在内部也是使用`Array.prototype.splice`
    ```js
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val
    }
    ```
4. 针对第二种情况，也是要用`Array.prototype.splice`
    ```js
    vm.items.splice(newLength)
    ```


## Object Change Detection Caveats
*  同样不能检测对象属性的添加或删除
* Vue does not allow dynamically adding new root-level reactive properties to
an already created instance.不懂为什么
* Sometimes you may want to assign a number of new properties to an existing
object, for example using `Object.assign()` or` _.extend()`. In such cases, you
should create a fresh object with properties from both objects.
    1. 不能使用下面这样的方法：
        ```js
        Object.assign(vm.userProfile, anotherObj)
        ```
    2. 因为`Object.assign()`也是给`vm.userProfile`添加属性的，不会触发
        `vm.userProfile`性的 setter
    3. 应该像下面这样直接修改`vm.userProfile`
        ```js
        vm.userProfile = Object.assign({}, vm.userProfile, anotherObj)
        ```

## References
* [StackOverflow](https://stackoverflow.com/a/44079395)
* [List Rendering and Vue’s v-for Directive](https://css-tricks.com/list-rendering-and-vues-v-for-directive/)
