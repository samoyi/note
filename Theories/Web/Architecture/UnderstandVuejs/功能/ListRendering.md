# List Rendering

## `v-for`
```html
<div id="components-demo">
    <!-- 你也可以用 of 替代 in 作为分隔符，因为它是最接近 JavaScript 迭代器的语法 -->
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
        // 在遍历对象时，是按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的
        // JavaScript 引擎下是一致的。
        console.log(Object.keys(this.obj)); // ["name", "age", "sex"]
    },
});
```

### `key`
1. 当 Vue.js 用`v-for`正在更新已渲染过的元素列表时，它默认用“就地复用”策略。
2. 如果数据项的顺序被改变，Vue将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处
每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。
3. 这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态的列表渲染输出。

#### 依赖子组件状态的列表
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
1. 因为列表是根据`arr`的顺序渲染的，所以颠倒了`arr`，理应再反向渲染列表。
2. 但这样会导致直接修改 DOM 节点，是比较耗时的操作。如果仅仅颠倒列表项的数据，不真的颠
倒重渲染整个列表，就会节省时间。
3. Vue 默认也是这么做的。本来传入列表项的`outerValue`是`22`和`33`，现在改为传入`33`和
`22`。
4. 这样，子组件的`outerValue`就发生了颠倒。
5. 但是`innerValue`并没发发生更新，因为`data`里面的属性并不会根据依赖动态更新。所以就
会出现`outerValue`更新了但对应的`innerValue`没有更新的情况。
6. 如果是真的颠倒渲染列表，则不会出现这个问题。
7. 使用`key`就可以阻止 Vue 的复用策略，让它真的按照新的顺序重新渲染。
8. 给每个列表项添加各不相同的`key`之后，Vue 就会知道这个列表项是唯一的，不应该被复用。
    ```html
    <child-component :outer-value="val" :key="val"></child-component>
    ```
9. 上面给每个列表项都设置了一个唯一的`key`值，这样它们都不会被复用。当然你也可以设置相
同的`key`值，则相同`key`值的列表项因为是同一个身份，所以还是可以继续复用。
10. 不过仅就本里这种数据依赖不复杂的情况来说，即使不使用`key`也有办法实现正常的顺序颠倒。
因为上面说了，不能正确颠倒的原因是作为`data`属性的`innerValue`不能根据依赖动态更新，那
只要把`innerValue`定义为计算属性就行了
    ```js
    components: {
        'child-component': {
            props: ['outerValue'],
            template: `<span>
                outerValue: {{outerValue}}  innerValue: {{innerValue}}
            </span>`,
			computed: {
				innerValue(){
					return '_' + this.outerValue;
				},
			},
        }
    },
    ```

#### 依赖临时 DOM 状态
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
下面的设置，将渲染十个节点出来
```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

### `v-for` on a `<template>`
类似于`v-if`时的情况，你也可以利用带有`v-for`搭配`<template>`循环渲染多个元素
```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

### `v-for` with `v-if`
1. 当它们处于同一节点，`v-for`的优先级比`v-if`更高，这意味着`v-if`将分别重复运行于每个
`v-for`循环中。
2. 这是理所应当的，如果`v-if`优先级更高那它就可以控制是否进行列表渲染，而这个工作完全可
以交给`v-for`来执行，比如让数组长度为`0`。

### `v-for` with a Component
1. 在组件元素上设置`v-for`时，必须要设置`key`。不懂为什么
2. 循环时的值也一样要通过`props`传到组件内部
    ```html
    <my-component
      v-for="(item, index) in items"
      v-bind:item="item"
      v-bind:index="index"
      v-bind:key="item.id"
    ></my-component>
    ```
4. 不自动将 item 注入到组件里的原因是，这会使得组件与`v-for`的运作紧密耦合。这种耦合不
利于组件复用于其他场合。
5. 如果能自动注入，那上面的组件内部就可以直接使用`this.item`、`this.index`和`this.id`
，这显然就需要组件编写者和组件使用者商量好要传入哪些属性。


## Array Change Detection
1. 由于属性的子属性的变动不会触发属性的 setter，Vue 不能检测以下的数组变动：
    * 利用索引直接设置一个项时：`vm.items[2] = 33`
    * 修改数组的长度：`vm.items.length = 3`
2. 针对第一种情况，可以使用以下两个方法解决：
    * `Vue.set`方法
    ```js
    Vue.set(vm.items, 2, 33)
    // or
    vm.$set(vm.items, 2, 33)
    ```
    * `Array.prototype.splice`
    ```js
    vm.items.splice(2, 1, 33)
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
    vm.items.splice(3)
    ```


## Object Change Detection Caveats
* 同样不能检测对象属性的添加或删除
* 对于已经创建的实例，Vue 不能动态添加根级别的响应式属性。不懂为什么
    ```js
    this.$set(this.$data, 'n', 33);
    // [Vue warn]: Avoid adding reactive properties to a Vue instance or its
    // root $data at runtime - declare it upfront in the data option.
    ```
* 有时你可能需要为已有对象赋予多个新属性，比如使用`Object.assign()`。在这种情况下，你
应该用两个对象的属性创建一个新的对象。
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
        但是不能这样，不懂：
        ```js
        vm.userProfile = Object.assign(vm.userProfile, anotherObj)
        ```


## References
* [StackOverflow](https://stackoverflow.com/a/44079395)
* [List Rendering and Vue’s v-for Directive](https://css-tricks.com/list-rendering-and-vues-v-for-directive/)
