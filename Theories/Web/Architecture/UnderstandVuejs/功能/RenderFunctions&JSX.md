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
```js
// @returns {VNode}
createElement(
    // {String | Object | Function}
    // An HTML tag name, component options, or async
    // function resolving to one of these. Required.
    'div',

    // {Object}
    // A data object corresponding to the attributes
    // you would use in a template. Optional.
    {
        // (see details in the next section below)
    },

    // {String | Array}
    // Children VNodes, built using `createElement()`,
    // or using strings to get 'text VNodes'. Optional.
    [
        'Some text comes first.',
        createElement('h1', 'A headline'),
        createElement(MyComponent, {
            props: {
                someProp: 'foobar'
            }
        })
    ]
)
```
1. 先看个简单的例子
```html
<div id="components-demo">
    <anchored-heading :level="1">H1标题</anchored-heading>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'anchored-heading': {
            render: function (createElement) {
                return createElement(
                    'h' + this.level,
                    this.$slots.default
                );
            },
            props: {
                level: {
                    type: Number,
                    required: true
                }
            },
        },
    },
});
```
2. 不懂。上面例子中`createElement`的参数只有两个，而且看类型应该是第一个和第三个。为什
么第二个直接被省略了也没有问题？

### The Data Object In-Depth（第二个参数）
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

### Complete Example
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

### VNodes Must Be Unique
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
