# Render Functions & JSX


## Basic
`createElement`返回的并不是一个实际的 DOM 元素。它更准确的名字也许应该是
`createNodeDescription`，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及
其子节点。我们把这样的节点描述为“虚拟节点 (Virtual Node)”，也常简写它为“VNode”。“虚拟
DOM”是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。


## `createElement` Arguments
* 在只有两个参数的情况下， Vue 会识别第二个参数是形参2还是形参3

### 第一个参数
`{String | Object | Function}` Required

#### String: 一个 HTML 标签字符串
```js
render(h) {
    return h('p', '123');
},
```
#### Object: 组件选项对象
```js
render(h) {
    return h({
        template: `<p>123</p>`,
    });
},
```
#### Function: 解析上述任何一种的一个 async 函数
不懂。实际测试时，不能直接在参数的位置定义函数，而且函数也只能返回组件选项对象不能返回标
签字符串。只能像下面这样先定义好一个返回组件选项对象的 async 函数，然后传入函数名
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

### 第二个参数
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

### 第三个参数
* 定义子节点
* `{Array | String}` Optional

#### Array
1. 数组项可以是 VNode 或字符串。
2. VNode 可以使用`createElement()`构建而成，或者是通过`vm.$slots`获得
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


## 向模板中插入实例数据
1. 如果`createElement`函数的第一个参数是节点名字符串，则可以像下面这样插入比如实例的
data
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
2. 如果`createElement`函数的第一个参数是组件对象的，可以直接写进`template`属性里
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


## Complete Example
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


## VNodes Must Be Unique
不懂。按照文档上的例子运行，可以正常的渲染出来两个`<p>`
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


## 使用 JavaScript 代替模板功能
### `v-if` and `v-for`
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

### `v-model`
参考`Theories\Web\Architecture\UnderstandVuejs\功能\Components\Events.md`中实现组
件`v-model`的方法

### Event & Key Modifiers
直接看[文档](https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers)


### Slots
1. 通过`vm.$slots`获得插入普通插槽的内容，通过`vm.$scopedSlots`获得插入作用域插槽的内
容
2. `vm.$scopedSlots.插槽名`数据类型是函数，调用这个函数时，传参一个对象，这个对象指明
了传入这个插槽的数据
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


## `renderError`
1. 当`render`函数遭遇错误时，提供另外一种渲染输出。
2. 其错误将会作为第二个参数传递到`renderError`。
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


## JSX


## Template Compilation
