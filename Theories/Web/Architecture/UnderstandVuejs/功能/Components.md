# Components


## 组件是可复用的 Vue 实例
1. 稍微想一下，组件和所谓的“普通”实例确实没什么差别。
2. 所谓的“普通”实例其实也是一个组件，都是组件，共同组成一个组件系统。
3. 要说不同的话，就是狭义的组件需要自创模板，可以自定义标签名，以及可复用。


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



## Props
### Prop Casing (camelCase vs kebab-case)
1. HTML attribute names are case-insensitive, so browsers will interpret any
uppercase characters as lowercase.
```html
<ul id="components-demo">
    <child-component :myNum="num"></child-component>
    <!-- <child-component :my-num="num"></child-component> -->
</ul>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: ['myNum'],
            template: `<li>{{myNum}}</li>`,
        }
    },
    data: {
        num: 2233,
    },
});
```
2. 在实例里使用 camelCase 肯定是没有问题，因为是 JS 变量名。而在 HTML 中的 camelCase
特性，正如前面说的，会被转换为纯小写的`mynum`。Vue 也会给出如下提示：
>[Vue tip]: Prop "mynum" is passed to component <Anonymous>, but the declared
prop name is "myNum". Note that HTML attributes are case-insensitive and
camelCased props need to use their kebab-case equivalents when using in-DOM
templates. You should probably use "my-num" instead of "myNum".

3. 如果在实例中使用了 camelCase 形式的变量，则在 HTML 需要像注释中那样使用 kebab-case
形式。

### 类型检测和默认值
1. 最简单的类型检测，需要把`prop`从数组变成对象形式，并在内部指定通过每个数据的构造函数
来约束类型（对应`Object.prototype.toString.call`显示的那个）。源码参考`assertType`函
数
```html
<div id="components-demo">
    <child-component :name="name" :age="age"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: {
                name: String,
                age: Number,
            },
            template: `<p>{{name}}, {{age}}</p>`,
        }
    },
    data: {
        name: '33',
        age: 22,
        // age: new Number(22), // 可以通过，数值包装类型的构造函数也是 Number
        // age: '22', // 不能通过
    },
});
```

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

new Vue({
    el: '#components-demo',
    data: {
        info: {
            name: '33',
            age: 22,
        },
    },
});
```

### One-Way Data Flow
1. 父组件使用一个子组件时，通过`prop`对其传参经常是很必要的需求。
2. 但如果子组件可以修改父组件传入的数据，那就会带来一些麻烦。
3. 如果传入的是引用类型，而子组件修改了该引用类型，则会直接影响到父组件中的数据。
4. 这就需要父组件知道子组件将怎样修改这个引用类型的值，而且如果该引用类型的值还用在了其
他地方，就要更加小心。
5. 组件最重要的特性之一是复用，可以作为公共组件来使用。如果使用者在使用一个组件时要注意
这么多，显然是效率低下的。
6. 如果传入的基础类型，情况会稍微好一些。因为子组件对其的修改不会影响到父组件。
7. 但同样麻烦的是，使用者在使用一个公共组件时，还是要了解组件将对传入的值将做怎样的修改
，否则传入的值莫名其妙发生了变化而不可预期。
8. 基于上述的麻烦，Vue 直接禁止了子组件对`prop`的直接修改。
9. 但实际情况中，确实会出现需要对传入的数据进行再加工的情况。这是需要把`prop`的值转换为
子组件自身的`data`或计算属性
10. 对于基础类型，可以
    ```js
    props: ['initialCounter'],
    data: function () {
        return {
            counter: this.initialCounter
        }
    }
    ```
    或
    ```js
    props: ['size'],
    computed: {
        normalizedSize: function () {
            return this.size.trim().toLowerCase()
        }
    }
    ```
11. 对于引用类型，则需要根据值的类型进行相应的拷贝，在子组件实例上重新定义独立的引用类
型的值。
    ```js
    props: ['profile'],
    data: function(){
        return {
            innerProfile: {}, // 声明该变量，用来拷贝 profile 中的属性
        };
    },
    created(){
        // 把 profile 的属性定义到 innerProfile 里面
        for (let key in this.profile){
            this.$set(this.innerProfile, key, this.profile[key]);
        }
    },
    mounted(){
        // 这里修改 innerProfile 就不会影响 profile
        this.innerProfile.name = '333';
        this.innerProfile.age = 222;
    },
    ```



## Event
### Emitting a Value With an Event
1. 子组件通过`$emit`发送该值
2. 父组件事件监听的方法通过第一个参数来接受该值
3. 如果要在行内使用该值，则为`$event`
4. 注意，普通事件的`ev`参数或`$event`是事件对象，而子组件`$emit`事件的这两个值是 emit
出来的值
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

### Using `v-model` on Components
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
组件有`slot`时，组件标签之间的作用域仍然是外部作用域。


## 异步组件
在指定的时间加载组件并渲染

### 基本用法
```html
<div id="components-demo">
    <!-- 在组件异步加载完成之前，不会被渲染 -->
    <async-component></async-component>
</div>
```
```js
Vue.component('async-component', (resolve, reject) => {
    // 这里指定三秒后再加载组件，加载完成后会进行渲染
    setTimeout(() => {
        resolve({
            template: '<div>I am {{ name }}</div>',
            data(){
                return {name: '33'};
            },
        })
    }, 3000)
});

const vm = new Vue({
    el: '#components-demo',
    data: {
    },
    methods: {

    },
});
```
可以看出来，注册异步组件时，第二个参数实际上会作为 `Promise` 构造函数的参数。异步操作
完成之后，组件对象会作为异步操作的结果，被真正注册为组件并渲染。


## Misc
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


## Handling Edge Cases
[Doc](https://vuejs.org/v2/guide/components-edge-cases.html)  

All the features on this section document the handling of edge cases, meaning
unusual situations that sometimes require bending Vue’s rules a little. Note
however, that they all have disadvantages or situations where they could be
dangerous, so keep them in mind when deciding to use each feature.

### Element & Component Access
#### Accessing the Root Instance
#### Accessing the Parent Component Instance
#### Accessing Child Component Instances & Child Elements
#### Dependency Injection
##### 使用 `$parent` 的问题
```html
<parent-component>
    <child-component></child-component>
</parent-component>
```
在设计`child-component`时，如果考虑到它需要访问`parent-component`的某个属性，那么你也
许会在`child-component`的一个 method 里用到`$parent`。到目前为止，没有问题。但如果页
面结构发生了一些变化：
```html
<parent-component>
    <child-component></child-component>
</parent-component>

<parent-component>
    <middle-component>
        <child-component></child-component>
    </middle-component>
</parent-component>
```
现在你必须要修改`child-component`组件，而且在其内部访问`parent-component`时还要做出判
断并分两种情况：`$parent`和`$parent.$parent`。  
这是就需要用到 Dependency Injection。

##### 前辈组件使用依赖注入明确表示将哪些数据和方法继承给后辈组件
1. 前辈组件使用`provide`表明要把哪些数据和方法提供给后辈组件
2. 后辈组件使用`inject`选择接受前辈组件提供的哪些数据和方法

```html
<div id="components-demo">
    <middle-component>
    </middle-component>
</div>
```
```js
const childComponent = {
    template: '<div @click="showAge">child-component</div>',
    inject: ['age', 'consoleAge'],
    methods: {
        showAge(){
            this.consoleAge(this.age);
        },
    },
};

const middleComponent = {
    components: {
        'child-component': childComponent,
    },
    template: `<div>
                    middle-component
                    <child-component></child-component>
                </div>`,
};

const vm = new Vue({
    el: '#components-demo',
    components: {
        'middle-component': middleComponent,
    },
    data: {
        age: 22,
    },
    methods: {
        consoleAge(age){
            console.log(age);
        },
    },
    provide(){
        return {
            age: this.age,
            consoleAge: this.consoleAge,
        };
    },
});
```
*You can think of dependency injection as sort of “long-range props”*

##### 闭包与非响应式的数据
1. 如果不考虑依赖注入，前辈组件的`consoleAge`一般会写成：
    ```js
    consoleAge(){
        console.log(this.age);
    },
    ```
2. 如果这样写，依赖注入时就不需要再 provide `age` 了，后辈组件的 `showAge` 永远都会显
示前辈组件里的 `age`。
3. 但是如果仍然是按照上面例子中的写法，因为依赖注入的数据是非响应的，所以前辈组件的
`age` 如果发生了变化，后辈组件并不会更新它的 `age`，仍然是保持为 `22`。

### Programmatic Event Listeners

### Circular References
#### Recursive Components
#### Circular References Between Components

### Alternate Template Definitions
#### Inline Templates
#### X-Templates

### Controlling Updates
#### Forcing an Update
1. If you find yourself needing to force an update in Vue, in 99.99% of cases,
you’ve made a mistake somewhere.
2. You may not have accounted for change detection caveats with arrays or
objects, or you may be relying on state that isn’t tracked by Vue’s reactivity
system, e.g. with data.
3. However, if you’ve ruled out the above and find yourself in this extremely
rare situation of having to manually force an update, you can do so with
`$forceUpdate`.

#### Cheap Static Components with `v-once`
1. Rendering plain HTML elements is very fast in Vue, but sometimes you might
have a component that contains a lot of static content. In these cases, you can
ensure that it’s only evaluated once and then cached by adding the `v-once`
directive to the root element, like this:
    ```js
    Vue.component('terms-of-service', {
      template: `
        <div v-once>
          <h1>Terms of Service</h1>
          ... a lot of static content ...
        </div>
      `
    })
    ```
2. Once again, try not to overuse this pattern. While convenient in those rare
cases when you have to render a lot of static content, it’s simply not necessary
 unless you actually notice slow rendering
3. Plus, it could cause a lot of confusion later. For example, imagine another
developer who’s not familiar with `v-once` or simply misses it in the template.
They might spend hours trying to figure out why the template isn’t updating
correctly.


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
