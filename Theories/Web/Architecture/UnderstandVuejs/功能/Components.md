# Components


## Props
### Static or Dynamic Props
Static prop 的值永远是作为字符串传入的，而 dynamic prop 是作为一个表达式传入的。
```html
<child-component value="23"></child-component>     <!-- 传入的是字符串 -->
<child-component :value="23"></child-component>    <!-- 传入的是数字 -->
<child-component :value="'23'"></child-component>  <!-- 传入的是字符串 -->
```

### Passing the Properties of an Object
类似于 Spread syntax，不知道内部是不是这样实现的
```html
<div id="components-demo">
    <!-- <child-component :name="info.name" :age="info.age"></child-component> -->
    <!-- 虽然可以分别绑定属性，不过像下面这样整体传入更方便。只要保证属性名对应即可 -->
    <child-component v-bind="info"></child-component>
</div>
```
```js
Vue.component('child-component', {
    props: ['name', 'age'],
    template: `<div>
                    <p>name: {{name}}</p>
                    <p>age: {{age}}</p>
                </div>`,
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        info: {
            name: '33',
            age: 22,
        },
    },
});
```


## Event
### `$listeners` 解决原生事件（`.native`）失效的问题
TODO：按照[文档](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)中的，没有发现失效
```html
<div id="components-demo">
    <base-input v-model="inputText" :label="labelText"
        @click.native="handleClick">
    </base-input>
</div>
```
```js
Vue.component('base-input', {
    props: ['label', 'value'],
    template: `
        <label>
            {{ label }}
            <input :value="value">
        </label>
    `,
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        inputText: '',
        labelText: 'This is label',
    },
    methods: {
        handleClick(){
            console.log('click');
        },
    },
});
```


## Slots
### Compilation Scope
[文档](https://vuejs.org/v2/guide/components-slots.html#Compilation-Scope)说的没
看懂，直接看例子：
```html
<div id="components-demo">
    <child-component>
        {{ name }}
        <!-- 在这里无法访问到 text -->
    </child-component>
</div>
```
```js
Vue.component('child-component', {
    template: `<div>
        {{text}}
        <slot></slot>
    </div>`,
    data(){
        return {
            text: 'hello',
        };
    },
    methods: {

    },
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        name: '33',
    },
});
```
组件有 `slot` 时，组件标签之间的作用域仍然是外部作用域。


## Demo
### 表单子组件和父组件数据双向绑定
表单子组件可以使用自己的数据进行双向绑定(把 `v-model` 写在模板内的 `input`)。但如果
要和父组件的数据绑定(把 `v-model` 写在模板标签上)，则仍然需要 prop 和 event 来实现。
根据[文档](https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components)
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
因此要实现表单子组件的 `v-model`，子组件需要接收一个 `value` prop，然后内部的表单值发
生变化时，emit 出来一个 `input` 事件，且带上当前的表单值。

html:
```html
<div id="components-demo">
    <custom-input v-model="inputValue"></custom-input>
    {{inputValue}}
</div>
```

js:
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
