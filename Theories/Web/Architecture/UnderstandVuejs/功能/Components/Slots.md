# Slots

## Compilation Scope
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
Vue.component('child-component', {
    template: `<div>
        {{text}}
        <slot></slot>
    </div>`,
    data(){
        return {
            text: 'hello',
        };
    },
    methods: {

    },
});

const vm = new Vue({
    el: '#components-demo',
    data: {
        name: '33',
    },
});
```
组件有`slot`时，组件标签之间的作用域仍然是外部作用域。
