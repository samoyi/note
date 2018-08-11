# Class and Style Bindings

原理基本上就是常规的指令，自己用自定义指令也可以模拟实现。  
下面实现一个对象语法的 class 绑定
```html
<div id="components-demo">
    <p v-myclass="{class1: boolean1, class2: boolean2}"></p>
    <p v-myclass="classObject"></p>
    <child-component v-myclass="{class1: true, class2: true}"></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<p class="class3"></p>`,
        },
    },
    data: {
        boolean1: true,
        boolean2: false,
        classObject: {
            class1: false,
            class2: true,
        },
    },
    methods: {
        isPlainObject(o){
            return Object.prototype.toString(o) === '[object Object]';
        },
        isArray(o){
            return Array.isArray(o);
        },
    },
    directives: {
        myclass: (el, binding, vnode)=>{
            let value = binding.value;
            let vm = vnode.context;

            if (vm.isPlainObject(value)){
                for (let classname in value){
                    if (value[classname]){
                        el.classList.add(classname);
                    }
                    else {
                        el.classList.remove(classname);
                    }
                }
            }

            if (vm.isArray(value)){
                // 省略
            }
        },
    },
});
```
渲染为：
```html
<div id="components-demo">
    <p class="class1"></p>
    <p class="class2"></p>
    <p class="class3 class1 class2"></p>
</div>
```
