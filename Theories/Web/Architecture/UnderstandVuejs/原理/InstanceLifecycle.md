# Instance Lifecycle

![lifecycle](../images/lifecycle.png)


## TODO
* 不知道图示中的 Init injections 是什么
* 不知道图示中的 Init Lifecycle 是什么
* 同辈组件生命周期顺序和预想的不一样，应该要看源码才能理解


## 生命周期分析
这是以自己编写的双向绑定 `../codes/easyTwoWayBinding/mvvm.js` 为基础，来分析实例的生
命周期。与 Vue 的实际情况肯定有差别。之后还要从 Vue 的源码中了解其真实的生命周期。

### TODO
* 找不到 `beforeCreate` 的时间节点
* 没有 `beforeDestroy` 的时间节点
* 没有 `destroyed` 的时间节点

```js
'use strict';


// Compiler
function initCompile (node, vm) {
    let fragment = document.createDocumentFragment();
    let child = null;

    while (child = node.firstChild) {
        compile(child, vm);
        fragment.appendChild(child);
    }
    return fragment;
}

function compile(node, vm) {
    if (node.nodeType === 1) {
        const aAttr = [...node.attributes];
        aAttr.forEach(attr=>{
            if (attr.nodeName === 'v-model') {
                const sPropName = attr.nodeValue;

                node.value = vm.data[sPropName];

                node.removeAttribute('v-model');

                node.addEventListener('input', function (ev) {
                    vm.data[sPropName] = ev.target.value;
                });

                const subscriber = new Subscriber(node, 'model');
                Publisher.curPub.addSubscriber(subscriber);
            }
        });

        node.childNodes.forEach(child=>{
            compile(child, vm);
        });
    }

    if (node.nodeType === 3) {
        const reg = /\{\{(.*)\}\}/;
        const aMatch = node.nodeValue.match(reg);
        if (aMatch) {
            const sPropName = aMatch[1].trim();
            node.nodeValue = vm.data[sPropName];

            const subscriber = new Subscriber(node, 'text');
            Publisher.curPub.addSubscriber(subscriber);
        }
    }
}


// Observer
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};

function defineReactive(data, key, val) {
    const publisher = new Publisher();
    Publisher.curPub = publisher;

    Object.defineProperty(data, key, {
        enumerable: true,
        get() {
            return val;
        },
        set(newVal) {
            // 触发 beforeUpdate
            val = newVal;
            publisher.notify(newVal);
            // 触发 updated
        },
    });

    observe(val);
}


// Publish & Subscribe 实现
function Publisher(){
    this.subscribers = [];
}

Publisher.prototype = {
    constructor: Publisher,

    addSubscriber(sub){
        this.subscribers.push(sub)
    },

    notify(newVal){
        this.subscribers.forEach(sub=>{
            sub.update(newVal);
        });
    },

};


function Subscriber (node, updateType) {
    this.node = node;
    this.updateType = updateType;
}

Subscriber.prototype = {
    update(newVal) {
        this.updateFns[this.updateType].call(this, newVal);
    },

    updateFns: {
        text(newVal) {
            this.node.textContent = typeof newVal == 'undefined' ? '' : newVal;
        },

        model(newVal) {
            this.node.value = typeof newVal == 'undefined' ? '' : newVal;
        }
    },
};


// MVVM构造函数
function MVVM (options) {
    this.data = options.data;
    observe(this.data); // 在这一步完成了图示中所说的 Init injections & reactivity
    // 触发 created
    const node = document.querySelector(options.el);
    const dom = initCompile(node, this); // 完成了编译模板
    // 触发 beforeMount
    node.appendChild(dom); // 图示中所说的 replace "el" with it
    // 触发 mounted
}
```


## Hooks
生命周期钩子 | 组件状态 | 最佳实践
--|--|--
beforeCreate | 实例初始化之后，this指向创建的实例，不能访问到data、computed、watch、methods上的方法和数据 | 常用于初始化非响应式变量
created | 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到$el属性，$ref属性内容为空数组 | 常用于简单的ajax请求，页面的初始化
beforeMount | 在挂载开始之前被调用，beforeMount之前，会找到对应的template，并编译成render函数 | -
mounted | 实例挂载到DOM上（仅指示当前组件已挂载，不包括子组件），此时可以通过DOM API获取到DOM节点，$ref属性可以访问 | 常用于获取VNode信息和操作，ajax请求
beforeupdate | 响应式数据更新时调用，发生在虚拟DOM打补丁之前 | 适合在更新之前访问现有的DOM，比如手动移除已添加的事件监听器
updated | 虚拟 DOM 重新渲染和打补丁之后调用，组件DOM已经更新，可执行依赖于DOM的操作 | 避免在这个钩子函数中操作数据，可能陷入死循环
beforeDestroy | 实例销毁之前调用。这一步，实例仍然完全可用，this仍能获取到实例 | 常用于销毁定时器、解绑全局事件、销毁插件对象等操作
destroyed | 实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁 | -


## 父子组件生命周期顺序
```html
<div id="parent">
    <input type="button" value="update prop" @click="update" />
    <input type="button" value="destroy parent" @click="destroy" />
    <child-component :text="text"></child-component>
</div>
```
```js
const hooks = (componentName)=>{
    return {
        beforeCreate() {
            console.log(`${componentName} -- beforeCreate`)
        },
        created() {
            console.log(`${componentName} -- created`)
        },
        beforeMount() {
            console.log(`${componentName} -- beforeMount`)
        },
        mounted() {
            console.log(`${componentName} -- mounted`)
        },
        beforeUpdate() {
            console.log(`${componentName} -- beforeUpdate`)
        },
        updated() {
            console.log(`${componentName} -- updated`)
        },
        beforeDestroy() {
            console.log(`${componentName} -- beforeDestroy`)
        },
        destroyed() {
            console.log(`${componentName} -- destroyed`)
        },
    };
};

Vue.component('child-component', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child'),
});

const vm = new Vue({
    el: '#parent',
    data: {
        text: 22,
    },
    methods: {
        update(){
            this.text = 33;
        },
        destroy(){
            this.$destroy();
        },
    },
    ...hooks('parent'),
});
```

页面加载后的输出：
```shell
parent -- beforeCreate
parent -- created
parent -- beforeMount
child -- beforeCreate
child -- created
child -- beforeMount
child -- mounted
parent -- mounted
```

update prop 时的输出：
```shell
parent -- beforeUpdate
child -- beforeUpdate
child -- updated
parent -- updated
```

destroy parent 时的输出：
```shell
parent -- beforeDestroy
child -- beforeDestroy
child -- destroyed
parent -- destroyed
```


## 同辈组件生命周期顺序
```html
<div id="parent">
    <input type="button" value="update prop" @click="update" />
    <input type="button" value="destroy parent" @click="destroy" />
    <child-component1 :text="text"></child-component1>
    <child-component2 :text="text"></child-component2>
</div>
```

```js
// 如上例一样定义 hooks

Vue.component('child-component1', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child1'),
});
Vue.component('child-component2', {
    template: `<div>{{text}}</div>`,
    props: ['text'],
    ...hooks('child2'),
});

// 如上例一样创建 parent Vue 实例
```

页面加载后的输出：
```shell
parent -- beforeCreate
parent -- created
parent -- beforeMount
child1 -- beforeCreate
child1 -- created
child1 -- beforeMount
child2 -- beforeCreate
child2 -- created
child2 -- beforeMount
child1 -- mounted
child2 -- mounted
parent -- mounted
```

update prop 时的输出：
```shell
parent -- beforeUpdate
child1 -- beforeUpdate
child2 -- beforeUpdate
child2 -- updated
child1 -- updated
parent -- updated
```

destroy parent 时的输出：
```shell
parent -- beforeDestroy
child1 -- beforeDestroy
child1 -- destroyed
child2 -- beforeDestroy
child2 -- destroyed
parent -- destroyed
```


## Mixin hooks 的顺序
按照文档说的：Hook functions with the same name are merged into an array so that
all of them will be called. Mixin hooks will be called before the component’s
own hooks.


## References
* [官方文档](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
* [Vue生命周期深入](https://segmentfault.com/a/1190000014705819)
