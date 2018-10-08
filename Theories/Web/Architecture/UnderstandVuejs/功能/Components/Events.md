# Event

## Emitting a Value With an Event
1. 子组件`$emit`第一个参数是自定义事件名，之后的参数是可选的要发送该值。父组件对该自定
义事件处理函数的若干个参数对应这些发送出来的若干个值。
    ```html
    <div id="components-demo">
	    <child-component @inner-click="getClick"></child-component>
	</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<div @click="clickChild">child</div>`,
                methods: {
                    clickChild(){
                        this.$emit('inner-click', 'foo', 'bar');
                    },
                }
            }
        },
        methods: {
            getClick(...vals){
                console.log([...vals]); // ["foo", "bar"]
            },
        },
    });
    ```
2. 普通事件的行内`$event`值或事件处理函数的`ev`参数是事件对象，而组件自定义事件不存在事
件对象，所以这两个值都是`$emit`方法的第一个 emit 出来的值。
    ```html
    <div id="components-demo">
	    <child-component @inner-click="showValue($event)"></child-component>
	</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<div @click="clickChild">child</div>`,
                methods: {
                    clickChild(){
                        this.$emit('inner-click', 'foo', 'bar');
                    },
                }
            }
        },
        methods: {
            showValue(val){
                console.log(val); // "foo"
            },
        },
    });
    ```
5. 与组件名和 prop 名不同，camelCase 定义的事件名在模板添加监听时并不能使用对应的
kebab-case 版本，而是会转换为纯小写。`this.$emit('myEvent')`不会被`@my-event`监听到
，只会被`#myevent`监听到。因此建议始终使用 kebab-case 的事件名。


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
`compositionend`事件阻止了类似于拼音输入法输入时的拼音字符更新变量。
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
            // 是否应该用表单值更新更新 searchText
            // 在用拼音输入汉字的过程中，表单里会有拼音字母，所以不应该更新
            bShouldUpdate: true,
        };
    },
    methods: {
        emitInput(ev){
            if (this.bShouldUpdate){
                this.$emit('input', ev.target.value);
            }
        },
        compositionstart(){ // 开始输入汉字
            this.bShouldUpdate = false;
        },
        compositionend(ev){ // 输入汉字结束
            // 当前表单里没有拼音字母了，已经是拼好的汉字了
            this.$emit('input', ev.target.value);
            this.bShouldUpdate = true;
        },
    },
}
```

### 非`value-input`的`<input>`
1. 例如`checkbox`类型，值要绑定到`checked`而非`value`特性上，而输入的事件类型是
`change`而非`input`。
2. 但是`v-model`它是吧值绑定到`value`特性上，而且监听`input`事件。
3. 所以`checkbox`组件仍然要接收名为`value`的 prop，只不过要在内部把它绑定到自己的
`checked`属性上；而当`checkbox`的`change`事件被触发后，要 emit 出去一个`input`事件。

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
    ```html
    <div id="components-demo">
        <!--
            可以通过 Chrome DevTools 看到 child-component 渲染出来的 p 元素上并没有
            绑定点击事件
        -->
	    <child-component @click="foo"></child-component>
	</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<p>child</p>`,
            },
        },
        methods: {
            foo(){
                console.log('foo');
            },
        },
    });
    ```
4. 但有时不得已的情况下，组件使用者想在组件上监听原生的事件，而使用者又不能在组件内部添
加对该事件的监听，就需要在组件标签上使用`.native`修饰符来监听原生事件。
    ```html
    <!-- 出于某些原因，不能在组件内部监听 click 的时候 -->
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
>包含了父作用域中的(不含`.native`修饰器的)`v-on`事件监听器。它可以通过
`v-on="$listeners"`传入内部组件——在创建更高层次的组件时非常有用。

7. 下面例子中，`vm.$listeners`只能获得父组件的、没有`.native`的时间监听器
    ```html
    <div id="components-demo">
        <base-input @focus="focusEvent" @custom-event @click.native></base-input>
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
            focusEvent(){},
        },
    });
    ```
8. 因此通过`$listeners`把`focus`事件的监听拷贝到组件内部的`<input>`上
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
9. 上一步的例子会把组件上绑定的所有事件都拷贝到真正的`input`元素上。如果你只允许拷贝部
分事件，那可以直接设定指定的事件类型，例如
    ```html
    <input type="text" @focus="$listeners.focus" />
    ```


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
3. `.sync`修饰符表明这个 prop 将被设置为双向绑定。
4. 而在子组件内部，需要升级`num`的时候，需要 emit 上述事件。`update:`是规定的写法，后
面的`propName`是要更新的双向绑定的 prop 名称，第二个参数就是更新的值
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
6. 将`v-bind.sync`用在一个字面量的对象上是无法正常工作的，例如
`v-bind="{name: profile.name ,age: profile.age,}"`，因为在解析一个像这样的复杂表达
式的时候，有很多边缘情况需要考虑。不懂复杂性的原因，需要看源码。使用字面量时数据是可以正
常传入的，只是不能从子组件里向外更新。


## 其他三个事件方法
都是针对当前实例，而非子组件实例

### `vm.$on( event, callback )`
监听的是当前实例 emit 的事件，而不是子组件实例 emit 的
```html
<div id="app">
    <child-component></child-component>
</div>
```
```js
new Vue({
    el: '#app',
    components: {
        'child-component': {
            template: `<p @click="$emit('inner-click')">child-component</p>`,
            mounted(){
                this.$on('inner-click', ()=>{
                    console.log(333);
                });
            },
        },
    },
});
```

### `vm.$once( event, callback )`
也是监听的是当前实例 emit 的事件，而不是子组件实例 emit 的

### `vm.$off( [event, callback] )`
* `{string | Array<string>} event` (array only supported in 2.2.2+)
* `{Function} [callback]`
* If no arguments are provided, remove all event listeners;
* If only the event is provided, remove all listeners for that event;
* If both event and callback are given, remove the listener for that
    specific callback only.
* 也是移除的是当前实例 emit 的事件的监听

```html
<div id="app">
    <child-component></child-component>
</div>
```
```js
new Vue({
    el: '#app',
    components: {
        'child-component': {
            template: `<p @click="emit">child-component</p>`,
            methods: {
                emit(){
                    this.$emit('event1');
                    this.$emit('event2');
                    console.log('-------------------');
                },
                handler11(){
                    console.log('event1-1');
                },
                handler12(){
                    console.log('event1-2');
                },
                handler21(){
                    console.log('event2-1');
                },
                handler22(){
                    console.log('event2-2');
                },
            },
            mounted(){
                this.$on('event1', this.handler11);
                this.$on('event1', this.handler12);
                this.$on('event2', this.handler21);
                this.$on('event2', this.handler22);

                setTimeout(()=>{
                    console.log('remove event1 handler12');
                    console.log('-------------------');
                    this.$off('event1', this.handler12);
                }, 3000);

                setTimeout(()=>{
                    console.log('remove event2 handlers');
                    console.log('-------------------');
                    this.$off('event2');
                }, 6000);

                setTimeout(()=>{
                    console.log('remove all event handlers');
                    console.log('-------------------');
                    this.$off();
                }, 9000);
            },
        },
    },
});
```
