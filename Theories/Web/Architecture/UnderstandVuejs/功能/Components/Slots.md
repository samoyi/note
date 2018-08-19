# Slots

## Slot Content
1. 没有`name`的默认插槽会接收所有插入组件的内容，所以它只能有一个的。
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
会渲染出三个`123`
3. 但如果就是希望插入一个渲染出多个的效果呢？
4. 可以考虑`v-for`，但`v-for`不能加在`<slot>`或其父级上，这样也会产生多个插槽。只能加
在插入的内容之上，比如这样：
```html
<div id="components-demo">
    <child-component>
        <template v-for="n in 3">
            123
        </template>
    </child-component>
</div>
```
5. 看起来也挺麻烦的

### Default Slot Content
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


## Named Slots
```html
<div id="components-demo">
    <child-component>
        内容1（如果模板里没有默认插槽，这个内容就会被丢弃）<br />

        <template slot="header">
            这是头部
        </template>

        内容2（如果模板里没有默认插槽，这个内容就会被丢弃）<br />

        <template>
            内容3（如果模板里没有默认插槽，这个内容就会被丢弃）<br />
        </template>

        <template slot="footer">
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
1. 如果要实现多个插槽，分别插入不同的内容，则需要在`<slot>`上添加`name`特性，用来表明
它们是不同的插槽，根据`name`接收对应的不同内容。也可以保留一个没有`name`特性的插槽，作
为默认插槽。
2. 在插入内容时，想要把一段内容插入某个插槽里，先要把该段内容用想要的标签包裹起来。如果
不想要标签，则要使用`<template>`。
3. 然后在包裹的标签里通过`slot`特性指明要插入那个插槽里，标签里的内容连同标签本身就会被
插入指定的插槽里。
4. 如果标签里没有设置`slot`特性，或者一段内容根本没有被标签包裹，则都会被插入可能存在的
默认插槽。如果默认插槽不存在，这些内容就会被丢弃。



## 编译作用于和组件的“函数性”
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
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<div>
                {{text}}
                <slot></slot>
            </div>`,
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
2. 定义组件相当于定义了一个函数，实参就是在使用组件标签是插入其中的内容，实参在组件内部
就是`<slot>`
3. 那么，`<child-component></child-component>`相当于函数调用`child-component()`，
其中插入的实参的作用域显然是函数外部的，在其中使用函数内部的变量`text`肯定是不行的。
