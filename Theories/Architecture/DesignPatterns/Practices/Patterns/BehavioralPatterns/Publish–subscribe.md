# Publish–subscribe


<!-- TOC -->

- [Publish–subscribe](#publishsubscribe)
    - [适用场景](#适用场景)
    - [要点](#要点)
    - [使用场景](#使用场景)
        - [实现的超简单双向绑定中的发布-订阅模式](#实现的超简单双向绑定中的发布-订阅模式)
        - [Vue.js 中发布订阅模式的源码分析](#vuejs-中发布订阅模式的源码分析)

<!-- /TOC -->


## 适用场景
1. 当一个对象发生变化时需要通知其他若干对象，或者反过来说，一个对象的行为变动需要依赖其他对象的状态变动时；
2. 尤其是，不希望耦合它们之间的关系，或者只有在运行时才能确定关系和需要动态建立或取消关系时；
3. 另外，如果两个对象分属不同的模块，不能或者不应该直接交流时，可以通过发布-订阅平台进行交流。


## 要点


## 使用场景
### 实现的超简单双向绑定中的发布-订阅模式
1. 源码在 `Theories/Web/Architecture/UnderstandVuejs/codes/easyTwoWayBinding/mvvm.js`，这里摘录并简化了其中发布-订阅模式的部分。
2. 发布者和订阅者类
    ```js
    // 一个 publish 对应一个被依赖的数据属性
    class Publisher {
        constructor () {
            // 依赖该数据属性的若干个 subscriber
            this.subscribers = [];
        }

        // 依赖该数据属性的节点，通过这个方法订阅该 publisher 负责的数据属性
        // 参数是一个 subscriber 实例，该实例会统一实现一个变化时的回调方法 update
        addSubscriber (sub) {
            this.subscribers.push(sub)
        }

        // 该 publisher 负责的属性值更新时，调用这个方法通知所有的 subscriber
        notify (newVal) {
            this.subscribers.forEach(sub=>{
                sub.update(newVal);
            });
        }
    }
    Publisher.pubs = {};


    // 一个 subscriber 对应一个依赖某数据属性的节点
    class Subscriber {
        constructor (node, updateType) {
            this.node = node;
            // updateType 对应 updateFns 中的某种更新函数
            this.updateType = updateType;
            this.updateFns = {
                // 负责更新文本内容
                text(newVal) {
                    this.node.textContent = typeof newVal === 'undefined' ? '' : newVal;
                },
                // 负责更新表单内容
                model(newVal) {
                    this.node.value = typeof newVal === 'undefined' ? '' : newVal;
                }
            };
        }

        // 该 subscriber 依赖的数据属性发生变化后，publish 会调用这个方法通知更新
        update(newVal) {
            this.updateFns[this.updateType].call(this, newVal);
        }
    }
    ```
3. 实例化发布者
    ```js
    // 这个方法会把一个数据属性定义为访问器属性，这样才能响应变化，成为被依赖的数据属性
    function defineReactive(data, key, val) {
        // 每个被依赖的属性对应一个 publisher
        const publisher = new Publisher();
        // 加入到全局的发布者仓库里，key 是被依赖的数据属性的属性名
        Publisher.pubs[key] = publisher;

        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                return val;
            },
            set(newVal) {
                val = newVal;

                // 该数据属性变化时会通知所有的 subscriber
                publisher.notify(newVal);
            },
        });
    }
    ```
4. 实例化订阅者并注册到对应的发布者
```js
function compile(node, vm) {

    // 节点类型为元素节点
    if (node.nodeType === 1) {
        const aAttr = [...node.attributes];
        aAttr.forEach(attr=>{
            // 如果是文本框节点
            if (attr.nodeName === 'v-model') {
                 // 获取 v-model 依赖的数据属性名
                const sPropName = attr.nodeValue;
                // 为该节点生成 subscriber，注册到该数据属性的 publisher 上
                const subscriber = new Subscriber(node, 'model');
                Publisher.pubs[sPropName].addSubscriber(subscriber);
            }
        });

        // 编译子节点
        node.childNodes.forEach(child=>{
            compile(child, vm);
        });
    }

    // 节点类型为 text
    if (node.nodeType === 3) {
        const reg = /\{\{(.*)\}\}/;
        const aMatch = node.nodeValue.match(reg);
        if (aMatch) {
             // 获取 {{}} 中依赖的数据属性名
            const sPropName = aMatch[1].trim();
            // 为该节点生成 subscriber，注册到该数据属性的 publisher 上
            const subscriber = new Subscriber(node, 'text');
            Publisher.pubs[sPropName].addSubscriber(subscriber);
        }
    }
}
```

### Vue.js 中发布订阅模式的源码分析
`Theories/Web/Architecture/UnderstandVuejs/原理/Observer/observer.md`