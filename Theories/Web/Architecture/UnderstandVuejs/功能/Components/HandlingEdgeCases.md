# Handling Edge Cases

All the features on this section document the handling of edge cases, meaning
unusual situations that sometimes require bending Vue’s rules a little. Note
however, that they all have disadvantages or situations where they could be
dangerous, so keep them in mind when deciding to use each feature.


## Element & Component Access
In most cases, it’s best to avoid reaching into other component instances or
manually manipulating DOM elements. There are cases, however, when it can be
appropriate.

### Accessing the Root Instance
* All subcomponents will be able to access root instance and use it as a global
store.
* This can be convenient for demos or very small apps with a handful of
components. However, the pattern does not scale well to medium or large-scale
applications, so we strongly recommend using Vuex to manage state in most cases.

下面的例子，点击最内部的`inner-component`组件，会直接修改根实例的`outerNum`，从
而影响到中间的`child-component`组件
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

### Accessing the Parent Component Instance
* This can be tempting to reach for as a lazy alternative to passing data with a
prop.
* In most cases, reaching into the parent makes your application more difficult
to debug and understand, especially if you mutate data in the parent. When
looking at that component later, it will be very difficult to figure out where
that mutation came from.

下面的例子，点击任何一个子组件，都会直接修改父组件数据
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

### Accessing Child Component Instances & Child Elements
1. 可以通过`ref`特性为一个子组件标签指定一个被应用的 ID，父组件通过`$refs`可以找到所有
指定了`ref`特性的子组件。
2. 不仅是组件，还可以给组件内的非自定义元素指定`ref`特性，也可以被实例的`$refs`引用。
3. `$refs` are only populated after the component has been rendered, and they
are not reactive. It is only meant as an escape hatch for direct child
manipulation - you should avoid accessing `$refs` from within templates or
computed properties. 看看`vm.$refs`的说明：An object of DOM elements and
component instances, registered with ref attributes。引用的不只是实例，还有 DOM。
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
            mounted:
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
4. When `ref` is used together with `v-for`, the `ref` you get will be an array
containing the child components mirroring the data source.
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
            data: function(){
                return {
                    num: 0,
                };
            },
        },
    },
    mounted(){
        // this.$refs.children 是一个三项数组，包含三个循环出来的组件
        setTimeout(()=>{
            this.$refs.children.forEach((child, index)=>{
                child.num = index + 1;
            });
        }, 2000);
    },
});
```

### Dependency Injection
#### 使用 `$parent` 的问题
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

#### 闭包与非响应式的数据
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

## Programmatic Event Listeners

## Circular References
### Recursive Components
### Circular References Between Components

## Alternate Template Definitions
### Inline Templates
### X-Templates

## Controlling Updates
### Forcing an Update
1. If you find yourself needing to force an update in Vue, in 99.99% of cases,
you’ve made a mistake somewhere.
2. You may not have accounted for change detection caveats with arrays or
objects, or you may be relying on state that isn’t tracked by Vue’s reactivity
system, e.g. with data.
3. However, if you’ve ruled out the above and find yourself in this extremely
rare situation of having to manually force an update, you can do so with
`$forceUpdate`.

### Cheap Static Components with `v-once`
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
