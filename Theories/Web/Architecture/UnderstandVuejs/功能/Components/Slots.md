# Slots


<!-- TOC -->

- [Slots](#slots)
    - [插槽内容](#插槽内容)
        - [默认插槽内容](#默认插槽内容)
        - [渲染作用域](#渲染作用域)
    - [具名插槽](#具名插槽)
        - [具名插槽的缩写](#具名插槽的缩写)
        - [动态插槽名](#动态插槽名)
    - [作用域插槽——通过插槽暴露组件内部作用域](#作用域插槽通过插槽暴露组件内部作用域)
        - [独占默认插槽的缩写语法](#独占默认插槽的缩写语法)
        - [解构插槽 Prop](#解构插槽-prop)
    - [References](#references)

<!-- /TOC -->


## 插槽内容
1. 没有 `name` 的默认插槽会接收所有插入组件的内容，所以它只能有一个。
2. 如果设置了多个的话，则每个插槽都会重复的接收插入的内容，Vue 也会给出错误警告。
    ```html
    <div id="components-demo">
        <child-component>123</child-component>
    </div>
    ```
    ```js
    template: `<div>
        <slot></slot>
        <slot></slot>
        <slot></slot>
    </div>`
    ```
    会渲染出三个 `123`
3. 但如果就是希望插入一个渲染出多个的效果呢？
4. 可以考虑 `v-for`，但 `v-for` 不能加在 `<slot>` 或其父级上，这样也会产生多个插槽。只能加在插入的内容之上，比如这样：
    ```html
    <div id="components-demo">
        <child-component>
            <template v-for="n in 3">
                123
            </template>
        </child-component>
    </div>
    ```
    看起来也挺麻烦的

### 默认插槽内容
```html
<div id="components-demo">
    <child-component>
        如果不插入任何东西，则会使用默认内容。现在这一段会覆盖默认内容
    </child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<div >
                            <slot>这是默认内容</slot>
                        </div>
            `,
        },
    },
});
```

### 渲染作用域
```html
<div id="components-demo">
    <child-component>
        {{ name }}
        <!-- 在这里无法访问到 text -->
    </child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<p>
                {{text}}
                <slot></slot>
            </p>`,
            data(){
                return {
                    text: 'hello',
                };
            },
        },
    },
    data: {
        name: '33',
    },
});
```
1. 可以把插槽的使用理解为函数的传参。prop 是很明显的传参，其实插槽模式也是。
2. 定义组件相当于定义了一个函数，实参就是在使用组件标签是插入其中的内容，实参在组件内部就是 `<slot>`
3. 那么，`<child-component></child-component>` 相当于函数调用 `child-component()`，其中插入的实参的作用域显然是函数外部的，在其中使用函数内部的变量 `text` 肯定是不行的。


## 具名插槽
1. 默认只有一个插槽，如果要实现多个插槽，分别插入不同的内容，显然需要指定内容和插槽之间的对应关系。
2. 通过在 `<slot>` 上添加 `name` 特性，用来表明它们是不同的插槽，根据 `name` 接收对应的不同内容。也可以保留一个没有 `name` 特性的插槽，作为默认插槽。
3. 在插入内容时，想要把一段内容插入某个插槽里，先要把该段内容用 `<template>` 包裹起来，然后在包裹的标签里通过 `v-slot` 指令指明要插入那个插槽里。
4. 如果标签里没有设置 `v-slot` 指令，或者一段内容根本没有被标签包裹，则都会被插入可能存在的默认插槽。如果默认插槽不存在，这些内容就会被丢弃。
```html
<div id="components-demo">
    <child-component>
        内容1（如果模板里没有默认插槽，这个内容就会被丢弃）<br />

        <template v-slot:header>
            这是头部
        </template>

        内容2（如果模板里没有默认插槽，这个内容就会被丢弃）<br />

        <template>
            内容3（如果模板里没有默认插槽，这个内容就会被丢弃）<br />
        </template>

        <template v-slot:footer>
            这是底部
        </template>

        内容4（如果模板里没有默认插槽，这个内容就会被丢弃）
    </child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<div class="container">
                            <header>
                                <slot name="header"></slot>
                            </header>
                            <main>
                                <slot></slot>
                            </main>
                            <footer>
                                <slot name="footer"></slot>
                            </footer>
                        </div>
            `,
        },
    },
});
```

### 具名插槽的缩写
1. 跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：
    ```html
    <base-layout>
        <template #header>
            <h1>Here might be a page title</h1>
        </template>

        <template #default>
            <p>A paragraph for the main content.</p>
            <p>And another one.</p>
        </template>

        <template #footer>
            <p>Here's some contact info</p>
        </template>
    </base-layout>
    ```
然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

<!-- This will trigger a warning -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>

### 动态插槽名
动态指令参数也可以用在 `v-slot` 上，来定义动态的插槽名：
```html
<base-layout>
    <template v-slot:[dynamicSlotName]>
        ...
    </template>
</base-layout>
```


## 作用域插槽——通过插槽暴露组件内部作用域
1. 先看下面这个自我介绍组件，可以让多个人分别自我介绍
    ```html
    <div id="components-demo">
        <self-introduction :persons="persons"></self-introduction>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'self-introduction': {
                props: ['persons'],
                template: `<ul>
                                <li v-for="person in persons" :key="person.name">
                                    我叫{{person.name}}，{{person.age}}岁
                                </li>
                            </ul>`
            },
        },
        data: {
            persons: [
                {
                    name: 'Hime',
                    age: 17,
                },
                {
                    name: 'Hina',
                    age: 18,
                },
            ],
        },
    });
    ```
2. 现在假如你想让她们自我介绍的时候，根据自己的信息来做进一步介绍。例如根据自己的年龄来说自己是否是成年人，再根据年龄判断是否出现可以喝酒的按钮。那么最简单的情况就是在 `self-introduction` 的模板里加上一些内容
    ```js
    template: `<ul>
                    <li v-for="person in persons" :key="person.name">
                        我叫{{person.name}}，{{person.age}}岁
                        所以我是{{person.age>17 ? '成年人' : '未成年人'}}
                        <input v-if="person.age>17" type="button" value="请我喝酒" />
                    </li>
                </ul>`
    ```
3. 但是，如果这个公共组件供多个人使用，每个使用者都想要组件根据年龄有一些个性化的功能，并不都是要显示是否成年及能喝酒。这种情况下，就不能在组件里直接添加了，必须把每个使用者的需求作为参数传入。
4. 如果通过 `props` 传递这种需求显然过于复杂，所以要用到插槽。
5. 但对于普通的插槽，组件标签中间插值的地方是不能获得组件内部数据的。也就是说下面这样是不行的
    ```html
    <self-introduction :persons="persons">
        所以我是{{person.age>17 ? '成年人' : '未成年人'}}
        <input v-if="person.age>17" type="button" value="请我喝酒" />
    </self-introduction>
    ```
6. 所以就要暴露组件内部作用域，使得组件标签中间插值的地方可以访问到组件内部的作用域。
7. 通过插槽暴露组件内部作用域
    ```js
    template: `<ul>
                    <li v-for="person in persons" :key="person.name">
                        我叫{{person.name}}，{{person.age}}岁
                        <slot :myname="person.name" :age="person.age"></slot>
                    </li>
                </ul>`
    ```
    这里添加了一个默认插槽，而且设置了 `myname`（不能用 `name`，否则成了具名插槽了，`:name` 是 `v-name`）和 `age` 两个特性。有些类似于传递 prop，将插槽内部的 `person.name` 和 `person.age` 通过 `myname` 和 `age` 传递到组件外部的标签之间。
8. 插值的部分，要设置一个拥有 `slot-scope` 特性的节点，该特性会暴露插槽作用域（slot scope），该特性的值会被作为一个对象，该对象包含插槽暴露出来的若干个类似于 prop 的值。如果不想让这个节点被渲染，那就是用 `<template>`。
9. 在插值的地方，我们可以 `v-slot` 指令设定一个值，这个值会是一个对象，对象属性是对应插槽暴露出来的值。
10. 例如下面的例子，指示默认插槽的指令 `v-slot:default="slotProps"` 被设置了值 `slotProps`，那么 `slotProps.myname` 的就是插槽作用域中通过 `myname` 暴露出来的 `person.name`。
11. 现在就可以根据读取到的插槽作用域的值来插入自定义的 DOM 节点了
    ```html
    <div id="components-demo">
        <self-introduction :persons="persons">
            <template v-slot:default="slotProps">
                所以我是{{slotProps.age>17 ? '成年人' : '未成年人'}}
                <input v-if="slotProps.age>17" type="button" :value=`请${slotProps.myname}喝酒` />
            </template>
        </self-introduction>
    </div>
    ```
    
### 独占默认插槽的缩写语法
1. 在上述情况下，当被提供的内容只有默认插槽时，我们可以把 `v-slot` 直接用在组件标签上：
    ```html
    <todo-list v-slot:default="slotProps">
        <i class="fas fa-check"></i>
        <span class="green">{{ slotProps.item }}</span>
    </todo-list>
    ```
2. 这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：
    ```html
    <todo-list v-slot="slotProps">
        <i class="fas fa-check"></i>
        <span class="green">{{ slotProps.item }}</span>
    </todo-list>
    ```
3. 注意默认插槽的缩写语法不能和具名插槽混用，因为它会导致作用域不明确：
    ```html
    <!-- 无效，会导致警告 -->
    <todo-list v-slot="slotProps">
        <i class="fas fa-check"></i>
        <span class="green">{{ slotProps.item }}</span>

        <template v-slot:other="otherSlotProps">
            slotProps is NOT available here
        </template>
    </todo-list>
    ```
    只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法：
    ```html
    <todo-list>
        <template v-slot:default="slotProps">
            <i class="fas fa-check"></i>
            <span class="green">{{ slotProps.item }}</span>
        </template>

        <template v-slot:other="otherSlotProps">
            ...
        </template>
    </todo-list>
    ```
    
### 解构插槽 Prop
1. 作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：
    ```js
    function (slotProps) {
        // ... 插槽内容 ...
    }
    ```
2. 这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。你也可以使用 ES2015 解构来传入具体的插槽 prop，如下：
    ```html
    <todo-list v-slot="{ item }">
        <i class="fas fa-check"></i>
        <span class="green">{{ item }}</span>
    </todo-list>
    ```
    这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。
3. 它同样开启了 prop 重命名等其它可能，例如将 `item` 重命名为 `todo`：
    ```html
    <todo-list v-slot="{ item: todo }">
        <i class="fas fa-check"></i>
        <span class="green">{{ todo }}</span>
    </todo-list>
    ```
4. 你甚至可以定义备用内容，用于插槽 prop 是 `undefined` 的情形：
    ```html
    <todo-list v-slot="{ item = 'Placeholder' }">
        <i class="fas fa-check"></i>
        <span class="green">{{ item }}</span>
    </todo-list>
    ```


## References
* [模板语法](https://v3.cn.vuejs.org/guide/template-syntax.html)