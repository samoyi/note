'use strict';


// Compiler
/*
 * 初始编译模板
 */
function initCompile (node, vm) {
    // 将子节点剪切到 DocumentFragment，编译完成后一次性添加进 DOM
    // TODO 在哪里看到过 Vuejs 不是使用 `DocumentFragment`，而且在源代码里也没有找到
    let fragment = document.createDocumentFragment();
    let child = null;

    while (child = node.firstChild) {
        compile(child, vm);
        fragment.appendChild(child);
    }
    return fragment;
}

/*
 * 编译节点
 * 实现以下功能：
 *     对 v-model 节点的 value 属性进行从 model 到 view 的初始化赋值
 *     通过给 v-model 节点添加 input 事件实现从 view 到 model 的绑定
 *     将文本节点中 “Mustache” syntax 中的变量替换为 model 中相应的数据
 */
function compile(node, vm) {

    // 节点类型为元素
    if (node.nodeType === 1) {
        // 解析节点属性
        const aAttr = [...node.attributes];
        aAttr.forEach(attr=>{
            if (attr.nodeName === 'v-model') {
                 // 获取 v-model 绑定的 data 属性名
                const sPropName = attr.nodeValue;

                // 对 v-model 节点进行初始化赋值
                // 根据获得的 data 属性名将 model 中该属性的值赋给该节点
                node.value = vm.data[sPropName];

                // 编译后的节点不应该再出现 v-model 属性
                node.removeAttribute('v-model');

                // 通过 input 事件实现从 view 到 model 的绑定
                node.addEventListener('input', function (ev) {
                    vm.data[sPropName] = ev.target.value;
                });

                const subscriber = new Subscriber(node, 'model');
                Publisher.curPub.addSubscriber(subscriber);
            }
        });

        // 编译子节点
        node.childNodes.forEach(child=>{
            compile(child, vm);
        });
    }

    // 节点类型为 text
    if (node.nodeType === 3) {
        // 将 “Mustache” syntax 中的变量替换为 model 中相应的数据
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
/*
 * 遍历所有属性，通过 defineReactive 将每个属性转化为访问器属性
 */
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key]);
    });
};

/*
 * 将 data 的 key 属性转化为访问器属性
 */
function defineReactive(data, key, val) {
    const publisher = new Publisher();
    Publisher.curPub = publisher;

    Object.defineProperty(data, key, {
        enumerable: true,
        get() {
            return val;
        },
        set(newVal) {
            val = newVal;

            // 调用 Publishers 的 notify 方法将变化通知给所有的 subscriber
            publisher.notify(newVal);
        },
    });

    // 递归监听子属性
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
    if (new.target !== MVVM) {
        throw new Error('MVVM必须使用构造函数方式调用');
    }
    this.data = options.data;
    observe(this.data);
    const node = document.querySelector(options.el);
    const dom = initCompile(node, this);
    node.appendChild(dom);
}
