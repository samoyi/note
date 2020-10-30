# Render Functions & JSX


<!-- TOC -->

- [Render Functions & JSX](#render-functions--jsx)
    - [0. Basic](#0-basic)
    - [1. `createElement` Arguments](#1-createelement-arguments)
        - [1.1 第一个参数](#11-第一个参数)
            - [1.1.1 String: 一个 HTML 标签字符串](#111-string-一个-html-标签字符串)
            - [1.1.2 Object: 组件选项对象](#112-object-组件选项对象)
            - [1.1.3 Function: 解析上述任何一种的一个 async 函数](#113-function-解析上述任何一种的一个-async-函数)
        - [1.2 第二个参数](#12-第二个参数)
        - [1.3  第三个参数](#13--第三个参数)
            - [1.3.1 Array](#131-array)
    - [2. 向模板中插入实例数据](#2-向模板中插入实例数据)
    - [3. Complete Example](#3-complete-example)
    - [4. VNodes Must Be Unique](#4-vnodes-must-be-unique)
    - [5. 使用 JavaScript 代替模板功能](#5-使用-javascript-代替模板功能)
        - [5.1 `v-if` and `v-for`](#51-v-if-and-v-for)
        - [5.2 `v-model`](#52-v-model)
        - [5.3 Event & Key Modifiers](#53-event--key-modifiers)
        - [5.4 Slots](#54-slots)
    - [6. `renderError`](#6-rendererror)
    - [7. JSX](#7-jsx)
    - [8. Template Compilation](#8-template-compilation)

<!-- /TOC -->


## 0. Basic
1. `createElement` 返回的并不是一个实际的 DOM 元素。它更准确的名字也许应该是 `createNodeDescription`，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及其子节点。
2. 我们把这样的节点描述为 “虚拟节点 (Virtual Node)”，也常简写它为“VNode”。“虚拟DOM” 是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。


## 1. `createElement` Arguments
* 在只有两个参数的情况下， Vue 会识别第二个参数是形参2还是形参3

### 1.1 第一个参数
`{String | Object | Function}` Required

#### 1.1.1 String: 一个 HTML 标签字符串
```js
render(h) {
    return h('p', '123');
},
```

#### 1.1.2 Object: 组件选项对象
```js
render(h) {
    return h({
        template: `<p>123</p>`,
    });
},
```

#### 1.1.3 Function: 解析上述任何一种的一个 async 函数
不懂。实际测试时，不能直接在参数的位置定义函数，而且函数也只能返回组件选项对象不能返回标签字符串。只能像下面这样先定义好一个返回组件选项对象的 async 函数，然后传入函数名
```js
async function getComponent(){
    return {
        template: `<p>123</p>`,
    };
}
Vue.component('child-component', {
    render(h) {
        return h(getComponent);
    },
});
```

### 1.2 第二个参数
* A data object corresponding to the attributes you would use in a template.
* `{Object}` Optional

```js
{

    // 设定节点的 class 特性，和`v-bind:class`一样的 API
    // 接收一个字符串、对象或字符串和对象组成的数组
    class: {
        foo: true,
        bar: false
    },

    // 设定节点的 style 特性，和`v-bind:style`一样的 API
    // 接收一个字符串、对象或对象组成的数组
    style: {
        color: 'red',
        fontSize: '14px'
    },

    // 设定普通的节点特性
    attrs: {
        id: 'foo'
    },

    // 设定组件 props
    props: {
        myProp: 'bar'
    },

    // 设定节点 DOM 属性
    domProps: {
        innerHTML: 'baz'
    },

    // 设置事件监听
    // 没有了修饰符功能，需要自己操作事件对象
    on: {
        click: this.clickHandler
    },

    // 监听原生事件，而非组件 emit 出来的自定义事件
    nativeOn: {
        click: this.nativeClickHandler
    },

    // 设置自定义指令
    directives: [
        {
            name: 'my-custom-directive',
            value: '2',
            expression: '1 + 1',
            arg: 'foo',
            modifiers: {
                bar: true
            }
        }
    ],

    // Scoped slots in the form of
    // { name: props => VNode | Array<VNode> }
    scopedSlots: {
        default: props => createElement('span', props.text)
    },

    // 不懂这个怎么用
    // The name of the slot, if this component is the
    // child of another component
    slot: 'name-of-slot',

    // 其他特殊顶层属性
    key: 'myKey',
    ref: 'myRef'
}
```

### 1.3  第三个参数
* 定义子节点
* `{Array | String}` Optional

#### 1.3.1 Array
1. 数组项可以是 VNode 或字符串。
2. VNode 可以使用 `createElement()` 构建而成，或者是通过 `vm.$slots` 获得
3. 字符串会被渲染为文字节点。相邻的字符串会合并。

```html
<div id="app">
    <child-component>
        <span>插入默认插槽的内容</span>
        <span slot="named">插入具名的内容1</span>
        <span slot="named">插入具名的内容2</span>
    </child-component>
</div>
```
```js
render(h) {
    return h('p', [
        this.$slots.default,
        ...this.$slots.named,
        '123',
        h('span', '通过 createElement 创建的 VNode'),
        '456',
        '789',
    ]);
},
```
渲染结果为：
```html
<p>
    <span>插入默认插槽的内容</span>  
    <span>插入具名的内容1</span>
    <span>插入具名的内容2</span>
    123
    <span>通过 createElement 创建的 VNode</span>
    456789
</p>
```


## 2. 向模板中插入实例数据
1. 如果 `createElement` 函数的第一个参数是节点名字符串，则可以像下面这样插入比如实例的 data
    ```js
    render(h){
        return h('p', this.age);
    },
    data(){
        return {
            age: 22,
        }
    },
    ```
2. 如果 `createElement` 函数的第一个参数是组件对象的，可以直接写进 `template` 属性里
    ```js
    render(h){
        return h(
            {
                template: `<p>子组件年龄：${this.age}</p>`
            },
        );
    },
    data(){
        return {
            age: 22,
        }
    },
    ```


## 3. Complete Example
```js
function getChildrenTextContent(children) {
    return children.map(function (node) {
        return node.children
        ? getChildrenTextContent(node.children)
        : node.text
    }).join('')
}

Vue.component('anchored-heading', {
    render: function (createElement) {
        // create kebab-case id
        var headingId = getChildrenTextContent(this.$slots.default)
        .toLowerCase()
        .replace(/\W+/g, '-')
        .replace(/(^\-|\-$)/g, '')

        return createElement(
            'h' + this.level,
            [
                createElement('a', {
                    attrs: {
                        name: headingId,
                        href: '#' + headingId
                    }
                }, this.$slots.default)
            ]
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
});

new Vue({
    el: '#components-demo',
});
```


## 4. VNodes Must Be Unique
不懂。按照文档上的例子运行，可以正常的渲染出来两个 `<p>`
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            render(createElement) {
                let myParagraphVNode = createElement('p', 'hi')
                return createElement('div', [
                    myParagraphVNode, myParagraphVNode
                ])
            },
        },
    },
});
```


## 5. 使用 JavaScript 代替模板功能
### 5.1 `v-if` and `v-for`
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            props: ['operation'],
            render(h) {
                const tel = h('input', {
                    attrs: {
                        type: 'tel',
                        placeholder: '输入手机号',
                    },
                });
                const pw = h('input', {
                    attrs: {
                        type: 'password',
                        placeholder: '输入密码',
                    },
                });
                const pw1 = h('input', {
                    attrs: {
                        type: 'password',
                        placeholder: '确认密码',
                    },
                });
                const submit = h('input', {
                    attrs: {
                        type: 'submit',
                        value: '提交',
                    },
                });
                const tips = h('ul', this.tips.map(tip=>{
                    return h('li', tip);
                }));

                if (this.operation === 'sign-in'){
                    return h('form', [tel, pw, submit, tips]);
                }
                else if (this.operation === 'sign-up'){
                    return h('form', [tel, pw, pw1, submit, tips]);
                }
                else {
                    return h('form', [h('input', {
                        attrs: {
                            type: 'button',
                            value: '暂不登陆',
                        }
                    })]);
                }
            },
        },
    },
    data: {
        operation: 'sign-in'
    },
});
```

### 5.2 `v-model`
参考 `Theories\Web\Architecture\UnderstandVuejs\功能\Components\Events.md` 中实现组件 `v-model` 的方法

### 5.3 Event & Key Modifiers
直接看 [文档](https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers)

### 5.4 Slots
1. 不能像下面这样定义 slot
    ```js
    render(h){
        return h({
            template: `<p>
                <slot></slot>
            </p>`,
        });
    },
    ```
    因为既然是渲染函数，所以就不具备编译功能，也就是说只能识别原生的 HTML 标签。
2. 需要通过 `vm.$slots` 获得插入普通插槽的内容，通过 `vm.$scopedSlots` 获得插入作用域插槽的内容
    ```js
    render(h){
        let vnodes = this.$slots.default;
        return h('p', vnodes);
    },
    ```
    `this.$slots.default` 获得的是一个数组，每个数组项都是一个插入默认插槽的插值虚拟节点。可能是文本节点，也可能是其他带标签的节点。把这些虚拟节点全部或部分通过 `createElement` 函数的第三个参数插入即可。
3. 与普通插槽直接通过 `vm.$slots `获取插值不同，作用域插槽的使用逻辑是：先要传入作用域，然后再获取插值内容。所以这时需要用到传参函数的形式：通过参数传入作用域，函数返回插值虚拟节点。
4. `vm.$scopedSlots.插槽名` 数据类型是函数，调用这个函数时，传参一个对象，这个对象指明了传入这个插槽的数据
    ```html
    <div id="components-demo">
        <self-introduction :persons="persons">
            <template slot="title">自我介绍</template>
            <template slot-scope="{myname, age}">
                所以我是{{age>17 ? '成年人' : '未成年人'}}
                <input v-if="age>17" type="button" :value=`请${myname}喝酒` />
            </template>
        </self-introduction>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'self-introduction': {
                props: ['persons'],
                // template: `<div>
                //                 <h2>
                //                     <slot name="title"></slot>
                //                 </h2>
                //                 <ul>
                //                     <li v-for="person in persons" :key="person.name">
                //                         我叫{{person.name}}，{{person.age}}岁
                //                         <slot :myname="person.name" :age="person.age"></slot>
                //                     </li>
                //                 </ul>
                //             </div>
                // `,
                render(h){
                    const h2 = h('h2', this.$slots.title); // 普通插槽的内容
                    const aLi = this.persons.map(person=>{
                        // 下面这个函数参数的意义相当于模板语法中的 :myname="person.name" :age="person.age"
                        let scopeSlot = this.$scopedSlots.default({
                            myname: person.name,
                            age: person.age
                        });
                        return h('li', [`我叫${person.name}，${person.age}岁`, scopeSlot])
                    });

                    return h('div', [h2, h('ul', aLi)]);
                },
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


## 6. `renderError`
1. 当 `render` 函数遭遇错误时，提供另外一种渲染输出。
2. 其错误将会作为第二个参数传递到 `renderError`。
3. 这个功能配合 hot-reload 非常实用。
4. 只在开发者环境下工作。

```js
// 会渲染出红色的 “渲染出错！错误原因：自定义错误”
new Vue({
    el: '#app',
    render(h){
        throw new Error('自定义错误');
    },
    renderError(h, err){
        return h(
            'p',
            {
                style: {color: 'red'},
            },
            `渲染出错！错误原因：${err.message}`
        );
    },
});
```


## 7. JSX


## 8. Template Compilation
