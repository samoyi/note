# Event

## Emitting a Value With an Event
1. 子组件通过`$emit`发送该值
2. 父组件事件监听的方法通过第一个参数来接受该值
3. 如果要在行内使用该值，则为`$event`
4. 普通事件的`ev`参数或`$event`是事件对象，而子组件`$emit`事件的这两个值是 emit
出来的值
5. 与组件名和 prop 名不同，camelCase 定义的事件名在模板添加监听时并不能使用对应的
kebab-case 版本，而是会转换为纯小写。`this.$emit('myEvent')`不会被`@my-event`监听到
，只会被`#myevent`监听到。For these reasons, we recommend you always use
kebab-case for event names.

```html
<div id="components-demo">
    <child-component v-bind="info" @inner-click="getClick"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: ['name', 'age'],
            template: `<div>
                            <p @click="clickName">name: {{name}}</p>
                            <p @click="clickAge">age: {{age}}</p>
                        </div>`,
            methods: {
                clickName(){
                    this.$emit('inner-click', 'name');
                },
                clickAge(){
                    this.$emit('inner-click', 'age');
                },
            }
        }
    },
    data: {
        info: {
            name: '33',
            age: 22,
        },
    },
    methods: {
        getClick(ev){
            console.log(ev + ' is clicked');
        },
    },
});
```


## Using `v-model` on Components
1. 想在一个自定义的 input 组件上使用`v-model`，也就是下面的效果
```html
<div id="components-demo">
    <custom-input v-model="searchText"></custom-input>
    <input type="button" :value="'搜索 ' + searchText" />
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'custom-input': {
            // ...暂略
        }
    },
    data: {
        searchText: '近期新闻',
    },
});
```
2. `v-model`实际上是语法糖，它的实现几乎如下
```html
<custom-input :value="searchText" @input="searchText = $event.target.value">
</custom-input>
```
3. 之所以说几乎，是因为`v-model`除了使用`input`事件，还通过`compositionstart`和
`compositionend`事件阻止了类似于拼音输入法输入是的拼音字符更新变量。
4. 知道了`v-model`的实际实现，就可以在子组件里模拟。
5. 因为`:value="searchText"`，所以子组件的`props`要接受一个变量`value`，并且绑定到它
自身的实际`input`上。
6. 再看`@input="searchText = $event.target.value"`，因为前面说到，子组件 emit 自定
义事件时，父组件行内的`$event`并不是事件对象，而是随着自定义事件 emit 出来的一个值。而
这里因为是`$event.target.value`，显然`$event`是事件对象，而不是具体值。所以会认为子组
件的 emit 应该是这样：`this.$emit('input', ev);`
7. 可实际上，当用在组件上时，`v-model`则会这样：
```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```
8. 预期接受的变成了子组件自定义事件 emit 的值。所以子组件的 emit 要写成
`this.$emit('input', ev.target.value);`
9. 综上，子组件要定义为：
```js
{
    props: ['value'],
    template: `<input :value="value"
        @input="emitInput"
        @compositionstart="compositionstart"
        @compositionend="compositionend"
    >`,
    data: function(){
        return {
            bShouldInputValue: true,
        };
    },
    methods: {
        emitInput(ev){
            if (this.bShouldInputValue){
                this.$emit('input', ev.target.value);
            }
        },
        compositionstart(){
            this.bShouldInputValue = false;
        },
        compositionend(ev){
            ev.target.value += ev.data
            this.$emit('input', ev.target.value);
            this.bShouldInputValue = true;
        },
    }
}
```

### 非`value-input`的`<input>`
1. 例如`checkbox`类型，值要绑定到`checked`而非`value`特性上
2. `checkbox`类型的输入事件是`change`，不过发送给父组件的事件仍然是`input`，因为
`v-model`默认接收的事件就是`input`
```html
<div id="components-demo">
    <custom-input v-model="checked"></custom-input>
    {{checked}}
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'custom-input': {
            props: ['value'],
            template: `<input
                :checked="value"
                type="checkbox"
                @change="emitChange"
            >`,
            methods: {
                emitChange(ev){
                    this.$emit('input', !this.value);
                },
            }
        },
    },
    data: {
        checked: false,
    },
});
```
3. 如果不想出现`input`类型的`value`特性和`input`事件，可以按照[文档](https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model)
上的方法，给组件设置`model`属性，然后就可以使用`checked`和`change`作为prop和自定义事
件名了
```js
new Vue({
    el: '#components-demo',
    components: {
        'custom-input': {
            model: {
                prop: 'checked',
                event: 'change'
            },
            props: ['checked'],
            template: `<input
                :checked="checked"
                type="checkbox"
                @change="emitChange"
            >`,
            methods: {
                emitChange(ev){
                    this.$emit('change', !this.checked);
                },
            },
        },
    },
    data: {
        checked: false,
    },
});
```


## Binding Native Events to Components
1. 组件是被设计为功能完整的、独立的、只需要接收一些参数来个性化的对象。
2. 因此，组件上的事件正常情况下都应该在组件内部来处理。例如你设计了一个按钮组件，显然点
击事件应该由组件内部来处理，而不应该由使用它的父级来处理。只有组件内部抛出的自定义事件才
应该由父级来处理。
3. 所以，组件标签上的事件绑定默认只是用来接收组件内部的自定义事件的。
4. 但有时不得已的情况下，组件使用者想在组件上监听原生的事件，而使用者又不能在组件内部添
加对该事件的监听，就需要在组件标签上使用`.native`修饰符来监听原生事件。
    ```js
    // 出于某些原因，不能在组件内部监听 click 的时候
    <child-components @click.native="clickP"></child-components>
    ```
5. 但下面这种情况中，却无法预期监听到期望的原生事件。公共组件`base-input`类似于`input`
，所以你可能想在上面添加`focus`事件。但是该组件最外层其实是`<p>`，所以绑定在上面的
`focus`事件不会被触发。
```html
<div id="components-demo">
    <base-input @focus.native="focusEvent"></base-input>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            template: `<p><input type="text" /></p>`,
        },
    },
    data: {

    },
    methods: {
        focusEvent(){
            console.log('focusEvent');
        },
    },
});
```
6. 针对这种情况，Vue 提供的解决方法是`vm.$listeners`。该属性的定义是：
>Contains parent-scope v-on event listeners (without `.native` modifiers). This
can be passed down to an inner component via `v-on="$listeners"` - useful when
creating transparent wrapper components.

7. 下面例子中的组件内 emit 事件`custom-event`以及没有使用`.native`的原生事件`focus`
都通过`vm.$listeners`获得
```html
<div id="components-demo">
    <base-input @focus="focusEvent" @custom-event></base-input>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            template: `<p @click="clickEvent">
                            <input type="text" />
                        </p>`,
            methods: {
                clickEvent(){},
            },
            mounted(){
                console.log(this.$listeners); // {focus: ƒ, custom-event: ƒ}
            },
        },
    },
    methods: {
        focusEvent(){
            console.log('focusEvent');
        },
    },
});
```
8. 可以通过`$listeners`把`focus`事件的监听拷贝到组件内部的`<input>`上
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            template: `<p @click="clickEvent">
                            <input type="text" v-on="$listeners" />
                        </p>`,
            methods: {
                clickEvent(){},
            },
        },
    },
    data: {

    },
    methods: {
        focusEvent(){
            console.log('focusEvent');
        },
    },
});
```
10. 但还有一个不明白的问题是，现在组件内部的`<input>`上也同时监听了`custom-event`事件
，这会不会有什么不良影响？


## 实现双向绑定
1. 当内部数据变化时，通过自定义事件将变化的值传给父级，父级根据事件更新外部数据
```html
<div id="components-demo">
    outerNum: {{outerNum}}
    <base-input :num="outerNum" @update-parent="updateOuterNum"></base-input>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            props: ['num'],
            template: `<p @click="update">innerNum: {{innerNum}}</p>`,
            data: function(){
                return {
                    innerNum: this.num,
                };
            },
            methods: {
                update(){
                    this.$emit('update-parent', ++this.innerNum);
                },
            },
        },
    },
    data: {
        outerNum: 0,
    },
    methods: {
        updateOuterNum(){
            this.outerNum++;
        },
    },
});
```
2. Vue 内部通过上述原理进行 prop 双向绑定，但实现了简单的语法糖来提供双向绑定，即
`.sync`修饰符和`vm.$emit('update:propName'， newValue)`事件。
```html
<div id="components-demo">
    outerNum: {{outerNum}}
    <base-input :num.sync="outerNum"></base-input>
</div>
```
3. `.sync`修饰表明这个 prop 将被设置为双向绑定。
4. 而在子组件内部，需要升级`num`的时候，需要 emit上述事件。`update:`是规定的写法，后面
的`propName`是要更新的双向绑定的 prop 名称，第二个参数就是更新的值
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            props: ['num'],
            template: `<p @click="update">innerNum: {{num}}</p>`,
            methods: {
                update(){
                    this.$emit('update:num', this.num + 1);
                },
            },
        },
    },
    data: {
        outerNum: 0,
    },
});
```
5. 如果要同时设置多个双向绑定 prop 的时候，可以按照如下的方法
```html
<div id="components-demo">
    outerName: {{profile.name}}, outerAge: {{profile.age}}
    <base-input v-bind.sync="profile"></base-input>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'base-input': {
            props: ['name', 'age'],
            template: `<p @click="update">innerName: {{name}}, innerAge: {{age}}</p>`,
            methods: {
                update(){
                    // 事件还是要一个一个 emit
                    this.$emit('update:name', this.name + '3');
                    this.$emit('update:age', Number.parseInt(this.age + '2'));
                },
            },
        },
    },
    data: {
        profile: {
            name: '33',
            age: 22,
        },
    },
});
```
6. Using `v-bind.sync` with a literal object, such as in
`v-bind="{name: profile.name ,age: profile.age,}"`, will not work, because there
are too many edge cases to consider in parsing a complex expression like this.
不懂复杂性的原因，使用字面量时数据是可以正常传入的，只是不能从子组件里向外更新。
需要看源码。
