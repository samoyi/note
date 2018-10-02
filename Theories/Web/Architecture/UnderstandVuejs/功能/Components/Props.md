# Props

## Prop Casing (camelCase vs kebab-case)
1. HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符
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


## 类型检测
1. 需要把`prop`从数组变成对象形式，并在内部指定通过每个数据的构造函数来约束类型（对应
`Object.prototype.toString.call`显示的那个）。源码参考`assertType`函数。注意是使用
构造函数而不是`instanceof`，所以，比如说数组，只能通过`Array`的验证而不能通过`Object`
的验证。
2. 可以通过任何内置构造函数或者是自定义构造函数来指定类型；也可以设置为`null`来匹配任何
类型。
3. 设置为对象时：通过`type`属性设定上述三种值，通过`default`属性指定默认值；如果设置了
`require`属性且值为`true`，则必须传值。
4. 可以设置为对象并添加`validator`，在该方法内部可通过自定义逻辑来验证传入的值

```html
<div id="app">
    <child v-bind="props"></clild>
</div>
```
```js
new Vue({
	el: '#app',
	data: {
		props: {
			propA1: '123',
			propA2: 123,
			propA3: false,
			propA4: [],
			propA5: new Set(),
			propA6: new Map(),
			propA7: {},
			propA8: new Date,
			propA9: function(){},
			propA10: Symbol('symbol'),

			propB1: 123,
			propB2: '123',

			// propC: 123,

			propD: '123',

			propE: 'warning',
		}
	},
	components: {
		child: {
			template: `<p>{{propC}}</p>`,
			props: {
			    // Basic type check
				propA1: String,
			    propA2: Number,
			    propA3: Boolean,
			    propA4: Array,
			    propA5: Set,
			    propA6: Map,
			    propA7: Object,
			    propA8: Date,
			    propA9: Function,
			    propA10: Symbol,
				propA0: null, // 什么类型都可以

			    // 多个允许的类型
			    propB1: [String, Number],
			    propB2: [String, Number],

			    // default 属性设定默认值
			    propC: {
			        type: Number,
			        default: 100
			    },

				// required 属性要求必须传值
			    propD: {
			        type: String,
			        required: true, // 必填
			    },

				propE: {
	      			validator: function (value) {
	        			// 这个值必须匹配下列字符串中的一个
	        			return ['success', 'warning', 'danger'].indexOf(value) !== -1
	      			},
				}
			},
		},
	}
});
```

4. 因为是使用构造函数来检测，所以包装类型是用其构造函数而不是`Object`。例如
`new Number(22)`会通过`Number`的检测，而不是`Object`
    ```js
    console.log(typeof new Number(22)); // "object"
    console.log(Object.prototype.toString.call(new Number(22))); // "[object Number]"
    ```
5. 如果默认值为引用类型，则该值必须要通过工厂函数来返回
    ```js
    propF: {
        type: Array,
        default: function(){
            return [1, 2, 3];
        },
    }
    ```
5. 如果要使用自定义构造函数来判断传入值是否是其实例，则判断的逻辑是`instanceof`
    ```js
    function Person (firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
    }
    ```
    ```js
    props: {
        author: Person
    }
    ```
6. 注意 prop 会在组件实例创建之前进行验证，所以实例的属性 (如 `data`、`computed` 等)
在 `default` 或 `validator` 函数中是不可用的。


## 静态 prop 和动态 prop
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


## 单向数据流
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
1. A non-prop attribute is an attribute that is passed to a component, but does
not have a corresponding prop defined.
2. 可以通过实例的`$attrs`属性获取。也可以通过 DOM 的`getAttribute()`方法获取。

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

### Replacing/Merging with Existing Attributes
对于绝大多数特性，从外部传入的值会覆盖组件内部设定的同名特性的值。例外是`class`和
`style`，这两个特性的外部值和内部值会结合到一起。
```html
<div id="components-demo">
    <child-component type="number" style="text-decoration: line-through;">
    </child-component>
    <!--
        组件被渲染为
        <input type="number" style="color: red; text-decoration: line-through;">
    -->
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

### Disabling Attribute Inheritance
1. 如果你不希望组件的根元素继承特性，你可以设置在组件的选项中设置`inheritAttrs: false`
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
