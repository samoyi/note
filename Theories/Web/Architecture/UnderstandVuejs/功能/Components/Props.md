# Props

## Prop Casing (camelCase vs kebab-case)
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


## 类型检测和默认值
1. 需要把`prop`从数组变成对象形式，并在内部指定通过每个数据的构造函数来约束类型（对应
`Object.prototype.toString.call`显示的那个）。源码参考`assertType`函数
2. The type can be one of the following native constructors，或者自定义构造函数:
    * String
    * Number
    * Boolean
    * Array
    * Object
    * Date
    * Function
    * Symbol
3. 因为是使用构造函数来检测，所以包装类型是用其构造函数而不是`Object`。例如
`new Number(22)`会通过`Number`的检测。
4. `null` matches any type
5. `type` can also be a custom constructor function and the assertion will be
made with an `instanceof` check. For example, given the following constructor
function exists:
    ```js
    function Person (firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
    }
    ```
You could use:
    ```js
    props: {
        author: Person
    }
    ```
to validate that the value of the `author` prop was created with `new Person`.
6. Note that props are validated before a component instance is created, so
instance properties (e.g. `data`, `computed`, etc) will not be available inside
`default` or `validator` functions.

```js
props: {
    // Basic type check
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Required string
    propC: {
        type: String,
        required: true
    },
    // Number with a default value
    propD: {
        type: Number,
        default: 100
    },
    // Object with a default value
    propE: {
        type: Object,
        // Object or array defaults must be returned from
        // a factory function
        default: function () {
            return { message: 'hello' }
        }
    },
    // Custom validator function
    propF: {
        validator: function (value) {
            // The value must match one of these strings
            return ['success', 'warning', 'danger'].indexOf(value) !== -1
        }
    }
}
```


## Static or Dynamic Props
Static prop 的值永远是作为字符串传入的，而 dynamic prop 是作为一个表达式传入的。
```html
<child-component value="23"></child-component>     <!-- 传入的是字符串 -->
<child-component :value="23"></child-component>    <!-- 传入的是数字 -->
<child-component :value="'23'"></child-component>  <!-- 传入的是字符串 -->
```


## Passing the Properties of an Object
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


## One-Way Data Flow
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


## Non-Prop Attributes
A non-prop attribute is an attribute that is passed to a component, but does not
have a corresponding prop defined.
```html
<div id="components-demo">
    <child-component age="22"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<p></p>`,
            mounted(){
                console.log(this.$el.getAttribute('age')); // 22
                console.log(this.$attrs); // {age: "22"}
            },
        },
    },
});
```


## Replacing/Merging with Existing Attributes
1. For most attributes, the value provided to the component will replace the
value set by the component.
2. The `class` and `style` attributes are a little smarter, both values are
merged.
```html
<div id="components-demo">
    <child-component type="number" style="text-decoration: line-through;"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<input type="text" style="color: red;" />`,
        },
    },
});
```
只能输入数字，红色，有 text-decoration


## Disabling Attribute Inheritance
1. If you do not want the root element of a component to inherit attributes, you
can set `inheritAttrs: false` in the component’s options.
2. 这时虽然在元素上访问不到特性，但是在实例中仍然可见。也就是说，在该特性传入组件后，并
没有被设置到组件模板的元素之上
```html
<div id="components-demo">
    <child-component age="22"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            inheritAttrs: false,
            template: `<p></p>`,
            mounted(){
                console.log(this.$el.getAttribute('age')); // null
                console.log(this.$attrs); // {age: "22"}
            },
        },
    },
});
```
