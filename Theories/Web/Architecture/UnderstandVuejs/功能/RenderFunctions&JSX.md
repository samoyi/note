# Render Functions & JSX


## Basic
* What is `createElement` actually returning? It’s not exactly a real DOM
element. It could perhaps more accurately be named `createNodeDescription`, as
it contains information describing to Vue what kind of node it should render on
the page, including descriptions of any child nodes. We call this node
description a “virtual node”, usually abbreviated to VNode. “Virtual DOM” is
what we call the entire tree of VNodes, built by a tree of Vue components.


## 模板渲染和渲染函数渲染的过程
### 模板渲染的过程：
1. 从 HTML 中找到组件标签
2. 从组件实例中找到模板
3. 根据模板上面的 directives 和 filters，结合数据，把模板编译成实际的 HTML
4. 用编译好的 HTML 替换之前的组件标签

### 渲染函数渲染的过程：
1. 从 HTML 中找到组件标签
2. 从组件实例中找到渲染函数 `render`
3. 根据 `render` 的内部逻辑，结合数据，把模板编译成实际的 HTML
4. 用编译好的 HTML 替换之前的组件标签


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
    // Same API as `v-bind:class`, accepting either
    // a string, object, or array of strings and objects.
    class: {
        foo: true,
        bar: false
    },
    // Same API as `v-bind:style`, accepting either
    // a string, object, or array of objects.
    style: {
        color: 'red',
        fontSize: '14px'
    },
    // Normal HTML attributes
    attrs: {
        id: 'foo'
    },
    // Component props
    props: {
        myProp: 'bar'
    },
    // DOM properties
    domProps: {
        innerHTML: 'baz'
    },
    // Event handlers are nested under `on`, though
    // modifiers such as in `v-on:keyup.enter` are not
    // supported. You'll have to manually check the
    // keyCode in the handler instead.
    on: {
        click: this.clickHandler
    },
    // For components only. Allows you to listen to
    // native events, rather than events emitted from
    // the component using `vm.$emit`.
    nativeOn: {
        click: this.nativeClickHandler
    },
    // Custom directives. Note that the `binding`'s
    // `oldValue` cannot be set, as Vue keeps track
    // of it for you.
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
    // The name of the slot, if this component is the
    // child of another component
    slot: 'name-of-slot',
    // Other special top-level properties
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


## Replacing Template Features with Plain JavaScript
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
* Only works in development mode.
* Provide an alternative render output when the default render function
encounters an error.
* The error will be passed to renderError as the second argument.
* This is particularly useful when used together with hot-reload.

```js
// 会渲染出红色的 “渲染出错！错误原因：自定义错误”
new Vue({
    el: '#app',
    render(h){
        throw new Error('自定义错误');
    },
    renderError(h, err){
        return h('p', {
            style: {color: 'red'},
        }, `渲染出错！错误原因：${err.message}`);
    },
});
```


## JSX


## Template Compilation
