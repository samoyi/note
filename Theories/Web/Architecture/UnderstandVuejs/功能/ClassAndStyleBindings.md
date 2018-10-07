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
            return Object.prototype.toString.call(o) === '[object Object]';
        },
        isArray(o){
            return Array.isArray(o);
        },
    },
    directives: {
        myclass: (el, {value}, {context})=>{
            // 如果指令值是平对象
            if (context.isPlainObject(value)){
                // 遍历每一个属性名，即实际的 class 名
                for (let classname in value){
                    if (value[classname]){
                        // 如果对应的值为真值，则为该节点添加该 class 名
                        // 因为不是重写整个 class，所以节点本来就有过的 class 名不会
                        // 被覆盖，在本例中就是 class3
                        el.classList.add(classname);
                    }
                    else {
                        // 相反则移除
                        el.classList.remove(classname);
                    }
                }
            }
            // 如果指令值是数组
            if (context.isArray(value)){
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
