# Handling Edge Cases

这里记录的都是和处理边界情况有关的功能，即一些需要对 Vue 的规则做一些小调整的特殊情况。
不过注意这些功能都是有劣势或危险的场景的。我们会在每个案例中注明，所以当你使用每个功能的
时候请稍加留意。


## Element & Component Access
* 在绝大多数情况下，我们最好不要触达另一个组件实例内部或手动操作 DOM 元素。不过也确实在
一些情况下做这些事情是合适的。
* 通过直接访问其他组件，可以调用其他组件的方法，但注意方法的定义是通过`bind()`绑定到定
义时的组件上的，所以方法内部的`this`永远指向定义它的组件实例。参考`原理\Misc.md`。

### Accessing the Root Instance
* All subcomponents will be able to access root instance and use it as a global
store.
1. 所有组件后代组件都可以通过`$root`访问根实例，并将其作为一个全局 store 来使用。
2. 下面的例子，点击最内部的`inner-component`组件，会直接修改根实例的`outerNum`，从而
影响到中间的`child-component`组件
    ```html
    <div id="components-demo">
        <child-component :num="outerNum"></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                props: ['num'],
                template: `<p>
                child-component: {{num}} <br />
                <inner-component></inner-component>
                </p>`,
                components: {
                    'inner-component': {
                        template: `<span @click="increaseRoot">inner component</span>`,
                        methods: {
                            increaseRoot(){
                                this.$root.outerNum++;
                            },
                        },
                    },
                },
            },
        },
        data: {
            outerNum: 0,
        },
    });
    ```
2. 对于 demo 或非常小型的有少量组件的应用来说这是很方便的。不过这个模式扩展到中大型应用
来说就不然了。因此在绝大多数情况下，都应该使用 Vuex 来管理应用的状态。


### Accessing the Parent Component Instance
1. 和`$root`类似，`$parent`属性可以用来从一个子组件访问父组件的实例。它提供了一种机会，
可以在后期随时触达父级组件，以替代将数据以 prop 的方式传入子组件的方式。
2. 下面的例子，点击任何一个子组件，都会直接修改父组件数据
    ```html
    <div id="components-demo">
        <child-component :num="outerNum"></child-component>
        <child-component :num="outerNum"></child-component>
        <child-component :num="outerNum"></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                props: ['num'],
                template: '<p @click="increase">{{num}}</p>',
                methods: {
                    increase(){
                        this.$parent.outerNum++;
                    },
                },
            },
        },
        data: {
            outerNum: 0,
        },
    });
    ```
3. 在绝大多数情况下，触达父级组件会使得你的应用更难调试和理解，尤其是当你变更了父级组件
的数据的时候。当我们稍后回看那个组件的时候，很难找出那个变更是从哪里发起的。


### Accessing Child Component Instances & Child Elements
1. 可以通过 `ref` 特性为一个子组件标签指定一个被应用的 ID，父组件通过 `$refs` 可以找到所有指定了 `ref` 特性的子组件。
2. 不仅是组件，还可以给组件内的非自定义元素指定 `ref` 特性，也可以被实例的 `$refs` 引用。
3. 看看 `vm.$refs` 的说明：An object of DOM elements and component instances, registered with `ref` attributes
    ```html
    <div id="components-demo">
        <child-component ref="first"></child-component>
        <child-component ref="second"></child-component>
        <child-component ref="third"></child-component>
        <div ref="div">123</div>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<p>{{num}}</p>`,
                data: function(){
                    return {
                        num: 0,
                    };
                },
                methods: {
                    sayNum(){
                        console.log(this.num);
                    },
                },
            },
        },
        mounted(){ // 这里不能使用 created，

            // 直接调用子组件方法
            this.$refs.third.sayNum(); // "0"

            setTimeout(()=>{
                // 直接修改子组件属性
                this.$refs.first.num = 1;
                this.$refs.second.num = 2;
                this.$refs.third.num = 3;
                this.$refs.third.sayNum(); // "3"

                // 访问和修改自定义元素
                this.$refs.div.textContent = '456';
            }, 2000);
        },
    });
    ```
4. `$refs` 只会在组件渲染完成之后生效
    ```js
    beforeMount(){
        console.log(this.$refs.test); // 仍然是 undefined
        debugger;
    },
    mounted(){
        console.log(this.$refs.test); // 引用到节点
        debugger;
    },
    ```
5. 并且它们不是响应式的，你应该避免在模板或计算属性中访问 `$refs`
    ```html
    <div id="components-demo">
        <child-component ref="child"></child-component>
        <br />
        <br />
        {{childNums}}
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<p>Child: {{num}} => {{numPlusOne}}</p>`,
                data () {
                    return {
                        num: 0,
                    };
                },
                computed: {
                    numPlusOne () {
                        return this.num + 1;
                    },
                },  
                mounted () {
                    setInterval(()=>{
                        this.num = Math.random();
                    }, 2222)
                },
            },
        },

        computed: {
            childNums () {
                // 挂载前该计算属性会调用一次，但因为还没渲染，所以是 undefined。
                // 挂载后虽然 child 的数据会更新，但因为不是响应式的，所以这个计算属性永远不会再被调用
                if (this.$refs.child === undefined) {
                    return 'undefined'
                }
                return 'Parent:' + this.$refs.child.num + '=>' + this.$refs.child.numPlusOne;
            },
        },

        methods: {
            getChildNums () {
                // 主动引用子组件并查询数据，可以查询到最新的
                console.log(this.$refs.child.num);
                console.log(this.$refs.child.numPlusOne);
            }
        },

        mounted () {
            setInterval(()=>{
                this.getChildNums();
            }, 2222);
        },
    });
    ```
6. 当 `ref` 和 `v-for` 一起使用时，得到的引用是一个包含了循环出来的若干个实例的数组
    ```html
    <div id="components-demo">
        <child-component v-for="n in 3" ref="children" :key="n"></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<p>{{num}}</p>`,
                data () {
                    return {
                        num: 0,
                    };
                },
            },
        },
        mounted(){
            // this.$refs.children 是一个三项数组，包含三个循环出来的组件
            console.log(this.$refs.children); // [VueComponent, VueComponent, VueComponent]
            setTimeout(()=>{
                this.$refs.children.forEach((child, index)=>{
                    child.num = index + 1;
                });
            }, 2000);
        },
    });
    ```

### Dependency Injection
#### 使用`$parent`的问题
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

#### 前辈组件使用依赖注入明确表示将哪些数据和方法继承给后辈组件
1. 前辈组件使用`provide`表明要把哪些数据和方法提供给后辈组件
2. 后辈组件使用`inject`选择接受前辈组件提供的哪些数据和方法

```html
<div id="components-demo">
    <middle-component></middle-component>
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

new Vue({
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

3. 你可以把依赖注入看作一部分“大范围有效的 prop”
4. 但依赖注入是非响应的
    ```html
    <div id="components-demo">
        <child-component></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                inject: ['age'],
                template: '<div>{{age}}</div>',
            },
        },
        data: {
            age: 22,
        },
        provide(){
            return {
                age: this.age,
            };
        },
        mounted(){
            setTimeout(()=>{
                this.age = 33;
                console.log(this.age)
            }, 1000);
        }
    });
    ```


## Programmatic Event Listeners


## Circular References
### Recursive Components
### Circular References Between Components


## Alternate Template Definitions
### Inline Templates
### X-Templates

## Controlling Updates
### Forcing an Update
1. 如果你发现你自己需要在 Vue 中做一次强制更新，99.9% 的情况，是你在某个地方做错了事。
你可能还没有留意到数组或对象的变更检测注意事项，或者你可能依赖了一个未被 Vue 的响应式系
统追踪的状态。
2. 然而，如果你已经做到了上述的事项仍然发现在极少数的情况下需要手动强制更新，那么你可以
通过`$forceUpdate`来做这件事。
3. 强制更新因为不会更改数据，所以不会触发 watcher，但会触发实例生命周期钩子函数和自定义
组件钩子函数。更新确实会强制发生，但 watcher 是用来监测数据变动的，所以不会触发。

### Cheap Static Components with `v-once`
1. 渲染普通的 HTML 元素在 Vue 中是非常快速的，但有的时候你可能有一个组件，这个组件包含
了大量静态内容。在这种情况下，你可以在根元素上添加`v-once`特性以确保这些内容只计算一次
然后缓存起来。
2. 如果后续该组件有数据更新操作，则数据会正常更新（watcher 正常触发），组件也会正常更新
（更新钩子函数正常触发），但之后不会重渲染。
    ```html
    <div id="components-demo">
        <child-component></child-component>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component': {
                template: `<p v-once>{{num}}</p>`,
                data(){
                    return {
                        num: 22,
                    };
                },
                watch: {
                    num(newVal){ // 数据可以正常更新
                        console.log(newVal);
                    },
                },
                updated(){ // 组件更新仍然会触发，但不会使用新的 num 重新渲染
                    console.log('updated');
                },
                mounted(){
                    this.num = 33;
                },
            },
        },
    });
    ```
3. 再说一次，试着不要过度使用这个模式。当你需要渲染大量静态内容时，极少数的情况下它会给
你带来便利，除非你非常留意渲染变慢了，不然它完全是没有必要的。
4. 再加上它在后期会带来很多困惑。例如，设想另一个开发者并不熟悉`v-once`或漏看了它在模板
中，他们可能会花很多个小时去找出模板为什么无法正确更新。
