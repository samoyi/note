# Components


## 组件是可复用的 Vue 实例
1. 稍微想一下，组件和所谓的“普通”实例确实没什么差别。
2. 所谓的“普通”实例其实也是一个组件，都是组件，共同组成一个组件系统。
3. 要说不同的话，就是狭义的组件需要自创模板，可以自定义标签名，以及可复用。
4. 给所谓的“非组件”实例添加模板，一样会覆盖元素本来的 HTML
```html
<!-- 将被渲染成 <p>p</p> -->
<div id="app">div</div>
```
```js
new Vue({
    el: '#app',
    template: `<p>p</p>`
})
```


## Registration
* Global registration often isn’t ideal. For example, if you’re using a build
system like Webpack, globally registering all components means that even if you
stop using a component, it could still be included in your final build. This
unnecessarily increases the amount of JavaScript your users have to download.



## 复用
### `data`必须是一个函数
1. 想象一下如果`data`是一个对象
    ```js
    data: {
        name: '33',
        age: 22,
    }
    ```
2. 在组件复用一次的情况下，就要创建两个 Vue 实例。Vue 实例上肯定也要引用`data`，即
`vm.$data`。
3. 如果直接引用的话，`data`作为引用类型，肯定两个实例都指向一个共同的`data`对象，因此
必然会互相影响。
4. 如果还想分开，那只有对`data`对象进行深拷贝。
5. 然后深拷贝是一个费力且很难完美实现的操作，所以还是用函数返回一个对象简单得多。
6. 这样每个实例的`$data`都会引用一个新创建的对象。
7. 根实例的`data`也可以写成函数的形式。


## 组件间数据通信的设计
1. 一个子组件不应该随意修改父组件数据，因为父组件数据可能还有其他子组件数据在使用，你擅
自修改父组件数据可能会影响其他组件。
2. 父组件也不应该随意修改子组件的数据，因为子组件就相当是子函数。父函数可以通过子函数提
供的参数在允许的范围内定制子函数的行为，但如果你能修改子函数中的任何变量，相当于就可以随
意改变的彻底的改变一个函数，那这个函数封装性就无从谈起了。
3. Vue 也是基于以上两点设计的组件通信规则，即通过自定义事件和 prop。
4. 当然，Vue 虽然不推荐，但也提供了可以直接修改的方法，即`$root`、`$parent`和`res`。
5. 但不管是非直接修改还是直接修改，都不能很好的解决多层组件嵌套情况下的通信问题。
6. 那你可能会问，为什么不设计成既可以约束随意修改又能方便的在多层嵌套下通信的模式，答案
就是 Vuex。


## Misc
### `template`中是全局作用域，`this`指向全局对象
```html
<div id="components-demo">
    <child-component></child-component>
</div>
```
```js
let str = 'hello';

new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<p>${this}, ${str}</p>`,
            // 渲染出 <p>[object Window], hello</p>
        },
    },
});
```

### 使用`is`解决子节点类型限制的问题
1. Some HTML elements, such as `<ul>`, `<ol>`, `<table>` and `<select>` have
restrictions on what elements can appear inside them, and some elements such as
`<li>`, `<tr>`, and `<option>` can only appear inside certain other elements.
2. This will lead to issues when using components with elements that have such
restrictions. For example:
    ```html
    <table>
      <blog-post-row></blog-post-row>
    </table>
    ```
3. The custom component `<blog-post-row>` will be hoisted out as invalid content
, causing errors in the eventual rendered output.
4. Fortunately, the `is` special attribute offers a workaround:
    ```html
    <table>
      <tr is="blog-post-row"></tr>
    </table>
    ```
5. It should be noted that this limitation does not apply if you are using
string templates from one of the following sources:
    * String templates (e.g. `template: '...'`)
    * Single-file (`.vue`) components
    * `<script type="text/x-template">`



## Demo
### 表单子组件和父组件数据双向绑定
表单子组件可以使用自己的数据进行双向绑定(把`v-model`写在模板内的`input`)。但如果要和父
组件的数据绑定(把`v-model`写在模板标签上)，则仍然需要 prop 和 event 来实现。根据
[文档](https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components)
中对 `v-model` 的解释：
```html
<input v-model="searchText">
```
的机制是：
```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```
因此要实现表单子组件的`v-model`，子组件需要接收一个`value` prop，然后内部的表单值发生
变化时，emit 出来一个`input`事件，且带上当前的表单值。

```html
<div id="components-demo">
    <custom-input v-model="inputValue"></custom-input>
    {{inputValue}}
</div>
```

```js
Vue.component('custom-input', {
    props: ['value'],
    template: `<input :value="value" @input="emitInput" />`,
    methods: {
        emitInput(ev){
            this.$emit('input', ev.target.value);
        },
    },
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        inputValue: '',
    },
});
```

### Customizing Component `v-model`
1. 如果使用 HTML 自有的表单标签作为组件模板，加在其上的 `v-model` 可以根据表单类型自动
绑定到表单相应的属性上，并且正确接收表单组件 emit 的事件。例如如果表单类型是 `text`，会
把 `v-model` 绑定到其表单 `value` 上，且接收表单 emit 的 `input` 事件；如果表单类型是
`checkbox`，则会绑定到 `checked` 上，且接收表单 emit 的 `change` 事件。
2. 但对于自定义子组件，Vue 并不能自动识别并正确绑定，`v-model` 默认绑定到子组件名为
`value` 的 prop 上，且默认接收子组件 emit 的 `input` 事件。显然，如果自定义组件是
`checkbox` 类型，默认的情况就是不行的。
3. 为了可以正确绑定，需要用到组件的 `model` 属性。`model.prop` 指定 `v-model` 绑定到
子组件的哪个 prop 上，`model.event` 指定接收组件 emit 的什么事件。
    ```html
    <div id="components-demo">
        <custom-input v-model="bChecked"></custom-input>
        {{bChecked}}
    </div>
    ```

    ```js
    Vue.component('custom-input', {
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: ['checked'],
        template: `<input type="checkbox" :checked="checked" @change="emitChange" />`,
        methods: {
            emitChange(ev){
                this.$emit('change', ev.target.checked);
            },
        },
    });

    const vm = new Vue({
        el: '#components-demo',
        data: {
            bChecked: false,
        },
    });
    ```
4. 不过其实也并不是必须要用 `model` 属性。虽然 `v-model` 默认是绑定到子组件的 `value`
prop 上且接收 `input` 事件，但 `value` 只用 prop 名而已，且 emit 的事件名也不是必须要
和表单真实的事件名相同。所以子组件里就用 `value` 来接受、同时 emit 的事件名就使用
`input` 也没有什么问题：
    ```html
    <div id="components-demo">
        <custom-input v-model="bChecked"></custom-input>
        {{bChecked}}
    </div>
    ```
    ```js
    Vue.component('custom-input', {
        props: ['value'],
        template: `<input type="checkbox" :checked="value" @change="emitChange" />`,
        methods: {
            emitChange(ev){
                this.$emit('input', ev.target.checked);
            },
        },
    });

    const vm = new Vue({
        el: '#components-demo',
        data: {
            bChecked: false,
        },
    });
    ```
当然，这样看起来可能稍微有一点点混乱，因为 `value` 和 `input` 与组件内的表单属性和变动
事件名不同。

### `.sync` Modifier，双向绑定 prop 的简写
1. Vue 不允许子组件直接修改 prop 所引用的父组件数据，如果要修改，则子组件先要 emit 事
件给父组件，父组件接收事件后改写相应的数据。
2. `.sync` Modifier 并不是另一套改写父组件的方法，而只是上述事件操作的简写形式。
```html
<div id="components-demo">
    <!-- `.sync` 表示该属性可以被子组件内部的 `update:prop-name` 事件自动更新 -->
    <child-component :text.sync="text"></child-component>
</div>
```
```js
Vue.component('child-component', {
    props: ['text'],
    template: `<div @click="modifyParentData">{{ text }}</div>`,
    methods: {
        modifyParentData(ev){
            // emit text 的更新时间，第二个参数为更新的值
            this.$emit('update:text', Math.random());
        },
    },
});
const vm = new Vue({
    el: '#components-demo',
    data: {
        text: '123',
    },
    watch: {
        text(newText){
            console.log(newText);
        },
    },
});
```
3. 同样也可以一个对象的所有属性整体进行双向绑定
```html
<child-component v-bind.sync="obj"></child-component>
```
这样子组件内部 emit 任何一个属性的更新事件时，父组件相应的属性都会自动更新
4. Using `v-bind.sync` with a literal object, such as in
`v-bind.sync="{ title: doc.title }"`, will not work, because there are too many
edge cases to consider in parsing a complex expression like this.

### `keep-alive` with Dynamic Components
子组件会在 `input-component` 和 `textarea-component` 之间切换。如果不加
`<keep-alive>`，对 `input` 或 `textarea` 的修改再切换之后不会保存，切换回来之后会重新
实例化组件。加上 `<keep-alive>` 就不会重新实例化，而是保存组件状态。
```html
<div id="components-demo">
    <input type="button" value="切换" @click="changeComponent" /><br />
    <keep-alive>
        <component :is="curComponent"></component>
    </keep-alive>
</div>
```
```js
Vue.component('input-component', {
    template: `<input type="text" :value="inputText" />`,
    data(){
        return {
            inputText: '这是个 input',
        };
    },
    methods: {

    },
});
Vue.component('textarea-component', {
    template: `<textarea>{{ areaText }}</textarea>`,
    data(){
        return {
            areaText: '这是个 textarea',
        };
    },
    methods: {

    },
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        curComponent: 'input-component',
    },
    methods: {
        changeComponent(){
            if (this.curComponent === 'input-component'){
                this.curComponent = 'textarea-component';
            }
            else {
                this.curComponent = 'input-component';
            }
        }
    },
});
```
