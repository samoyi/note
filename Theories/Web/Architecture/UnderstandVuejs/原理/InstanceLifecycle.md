# Instance Lifecycle

![lifecycle](../images/lifecycle.png)


## Caveat
这是以自己编写的双向绑定 `../codes/easyTwoWayBinding/mvvm.js` 为基础，来分析实例的生
命周期。与 Vue 的实际情况肯定有差别。之后还要从 Vue 的源码中了解其真实的生命周期。


## TODO
* 不知道图示中的 Init injections 是什么
* 不知道图示中的 Init Lifecycle 是什么
* 找不到 `beforeCreate` 的时间节点
* 没有 `beforeDestroy` 的时间节点
* 没有 `destroyed` 的时间节点


## 生命周期分析
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
