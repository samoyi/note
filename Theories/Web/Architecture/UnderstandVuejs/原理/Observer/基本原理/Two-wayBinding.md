# Two-way binding

Vue.js 采用数据劫持结合发布者-订阅者模式的方式，通过 `Object.defineProperty()` 来劫持各个属性的 setter、getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

**完整代码位置**: `./mvvm.js`

**预备知识**：`./ReactivitySystem.md`


<!-- TOC -->

- [Two-way binding](#two-way-binding)
    - [0. 思想](#0-思想)
        - [发布-订阅模式的应用](#发布-订阅模式的应用)
    - [1. 实现功能](#1-实现功能)
        - [初始编译模板](#初始编译模板)
        - [从 view 到 model 的绑定](#从-view-到-model-的绑定)
        - [从 model 到 view 的绑定](#从-model-到-view-的绑定)
    - [2. 功能模块](#2-功能模块)
    - [3. 初始编译模板](#3-初始编译模板)
        - [实现逻辑](#实现逻辑)
    - [4. 从 view 到 model 的绑定](#4-从-view-到-model-的绑定)
        - [实现逻辑](#实现逻辑-1)
    - [5. 从 model 到 view 的绑定](#5-从-model-到-view-的绑定)
        - [各模块功能](#各模块功能)
        - [Observer](#observer)
        - [Publisher & Subscriber 模式](#publisher--subscriber-模式)
            - [Publisher 对象](#publisher-对象)
            - [Subscriber 对象](#subscriber-对象)
            - [使用 Publisher](#使用-publisher)
            - [使用 Subscriber](#使用-subscriber)
            - [把 subscriber 注册到 publisher](#把-subscriber-注册到-publisher)
    - [6. 修改完成最终的 MVVM 构造函数](#6-修改完成最终的-mvvm-构造函数)
    - [References](#references)

<!-- /TOC -->


## 0. 思想
### 发布-订阅模式的应用
1. 就这里的实现而言，模板编译和从 view 到 model 的绑定都是比较简单直观的，从 model 到 view 的实现复杂一些，应用了发布-订阅模式。
2. 发布-订阅模式模式的本质就是：有几个对象（订阅者）希望在某件事情发生后得到通知，它们会把自己的回调函数传递给一个负责的对象（发布者），发布者在事件发生时，调用订阅者的回调函数，传递事件信息。
3. 那么 Vue 的响应式，也正是这个意思：多个 view 节点（订阅者）会在依赖的数据更新后重新渲染，就是因为之前它们把自己的回调函数传给了被依赖的数据对应的对象，在数据更新后，该对象就会调用这些回调通知相应的节点。


## 1. 实现功能
以下三个功能，就是一个基础但完整的双向绑定的内容：
* 初始编译模板，获得用户标记的绑定关系
* 从 view 到 model 的绑定
* 从 model 到 view 的绑定

<img src="../../../images/ReactivitySystem.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 初始编译模板
1. 从 model 到 view 的初始化赋值。  
2. 保证网页打开后，在不交互的情况下，页面正常显示。包括但不限于：
    * HTML 中的文本变量已经替换为具体的数据文本
    * `v-model` 的表单使用了 model 中的值
    * `v-for` 的节点循环渲染
    * `v-if="false"` 的节点不渲染
3. 本例只实现前两个功能

### 从 view 到 model 的绑定
改变 view 中 `input` 的值时，model 的 data 发生更新。

### 从 model 到 view 的绑定
1. 改变 model 的某个数据时，更新 view 中依赖该数据的节点。包括但不限于：
    * `input` 的 `value`
    * 节点的 `textContent`
    * 节点的 `class`
    * `v-show` 节点的显示和隐藏
2. 本例只实现前两个功能


## 2. 功能模块
* Compiler：编译模板；
* Publisher：对应 Vue 中的 Dep 类，也就是依赖，view 节点依赖的数据；
* Observer
* Subscriber：对应 Vue 中的 Watcher 类


## 3. 初始编译模板  
Compiler 模块

### 实现逻辑
1. 扫描节点，识别其中的 mustache syntax 和 `v-model` 指令。
2. 将模板中的文本变量替换成数据，给 `v-model` 节点的 `value` 属性赋值。
3. 实现
    ```html
    <div id="app">
        <input type="text" v-model="text">
        {{ text }}
    </div>
    ```
    ```js
    /*
     * 初始编译模板
     */
    function initCompile (node, vm) {
        // 将子节点剪切到 DocumentFragment，编译完成后一次性添加进 DOM
        // TODO 在哪里看到过 Vuejs 不是使用 `DocumentFragment`，而且在源代码里也没有找到
        // 又看到如下：Vue 2.0 中模板渲染与 Vue 1.0 完全不同，1.0 中采用的 DocumentFragment，而 2.0 采用 Virtual DOM。
        let fragment = document.createDocumentFragment();

        let child;
        while (child = node.firstChild) {
            compile(child, vm);
            fragment.appendChild(child); // appendChild 对节点直接移动，而非拷贝
        }
        return fragment;
    }

    /*
     * 编译节点
     * 实现以下功能：
     *     对 v-model 节点的 value 属性进行从 model 到 view 的初始化赋值
     *     将文本节点中 mustache syntax 中的变量替换为 model 中相应的数据
     */
    function compile (node, vm) {

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
                }
            });

            // 编译子节点
            node.childNodes.forEach(child=>{
                compile(child, vm);
            });
        }

        // 节点类型为文本
        if (node.nodeType === 3) {
            // 将 mustache syntax 中的变量替换为 model 中相应的数据
            const reg = /\{\{(.*)\}\}/;
            const aMatch = node.nodeValue.match(reg);
            if (aMatch) {
                const sPropName = aMatch[1].trim();
                node.nodeValue = vm.data[sPropName];
            }
        }
    }

    // MVVM 构造函数
    function MVVM (options) {
        this.data = options.data;
        const node = document.querySelector(options.el);
        const dom = initCompile(node, this);
        node.appendChild(dom);
    }

    // 实例化、绑定节点、设定数据
    const vm = new MVVM({
        el: '#app',
        data: {
            text: 'hello world',
        },
    });
    ```


## 4. 从 view 到 model 的绑定
也是由 Compiler 模块实现

### 实现逻辑
1. 对 `v-model` 节点添加事件监听，将输入值传入 model 中对应的变量。
2. 只需在上述代码中，在 `node.removeAttribute('v-model');` 之后添加以下事件绑定即可：
    ```js
    // 通过 input 事件实现从 view 到 model 的绑定
    node.addEventListener('input', function (ev) {
        vm.data[sPropName] = ev.target.value;
    });
    ```


## 5. 从 model 到 view 的绑定
1. Observer 模块 、Publisher 模块和 Subscriber 模块
2. 现在改变 `input` 的值时，虽然 model 中的数据会发生改变，但文本节点中的值并不会发生改变，因为还没有实现从 model 到 view 的绑定。同样，直接改变 model 时，view 也无法动态更新。

### 各模块功能
1. 首先要能监听到 model 中某个数据的变化。使用 Observer 来实现。
2. 确定哪些节点依赖该数据，在监听到变化后，更新依赖该数据的节点。使用 Publisher & Subscriber 模式来实现

### Observer
1. Observer 的作用是将一个对象的所有属性转化为访问器属性，这样就可以监听其属性值的变化，然后再进行相应的 DOM 更新操作。（Vue 实际上是先更新虚拟 DOM ）
2. 从 [vm.$data的文档说明](https://vuejs.org/v2/api/index.html#vm-data) 也可以看出来 Observer 的作用：The data object that the Vue instance is observing. The Vue instance proxies access to the properties on its data object. 其实不光是 `data`，
`props`、`methods` 等属性也都是通过 Observer 被 Vue 实例代理了。
3. Observer 由以下两个函数组成：
    ```js
    /*
     * 遍历所有属性，通过 defineReactive 将每个属性转化为访问器属性
     */
    function observe(data) {
        Object.keys(data).forEach(function(key) {
            defineReactive(data, key, data[key]);
        });
    };

    /*
     * 将 data 的 key 属性转化为访问器属性
     */
    function defineReactive(data, key, val) {
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                return val;
            },
            set(newVal) {
                val = newVal;

                // 之后在这里将添加更新虚拟 DOM 的操作，该操作是由 Publisher & Subscriber 模式来实现的，
                // 因此这里之后会调用该模式的 API。
            },
        });

        // 递归子属性
        observe(val);
    }
    ```

### Publisher & Subscriber 模式
1. 当监听到一个属性变化时，需要通知那些依赖该属性的节点或计算属性。
2. 首先要有若干个依赖该属性的 subscriber 提前订阅该属性，当该属性发生更新时，需要一个 publisher 将更新通知给所有的 subscriber，然后每个 subscriber 执行相应的（虚拟）DOM 更新。
3. 一个 publisher 对应一个数据属性，一个 subscriber 对应依赖该数据的一个节点。
4. 在 Vuejs 中，由 watcher 模块负责这些工作。

#### Publisher 对象
Publisher 对象要有以下功能：
* 拥有一个 subscriber 列表，并且可以添加 subscriber
* 向所有的 subscriber 发布通知，告知新的数据值

```js
class Publisher {
    constructor () {
        this.subscribers = [];
    }

    addSubscriber(sub){
        this.subscribers.push(sub)
    }

    notify(newVal){
        this.subscribers.forEach(sub => {
            // 每个 subscriber 实例都有一个 update 方法，调用该方法就可以更新节点
            sub.update(newVal);
        });
    }
}
```

#### Subscriber 对象
Subscriber 对象要有以下功能：在接收到 Publisher 发布的数据的更新通知后，根据自己对应的节点类型，进行更新

```js
/*
 * 实例化时候，需要指明该 subscriber 负责更新哪个节点；
 * 并指明更新类型。比如是更新 textContent、更新表单 value、更新 class 属性等
 */
class Subscriber {
    constructor (node, updateType) {
        this.node = node;
        this.updateType = updateType;

        // 这里只实现了两种更新类型。即更新文本和更新表单 value
        this.updateFns = {
            text (newVal) {
                this.node.textContent = typeof newVal === 'undefined' ? '' : newVal;
            },
    
            model (newVal) {
                this.node.value = typeof newVal === 'undefined' ? '' : newVal;
            }
        };
    }

    // 调用指定的更新类型函数更新节点
    update(newVal) {
        this.updateFns[this.updateType](newVal);
    }
}
```

#### 使用 Publisher
1. 因为一个 publisher 对应一个数据属性，所以应该在 `defineReactive` 函数中实例化 `Publisher`。
2. 因为要在数据更新后通知 subscribers，所以应该在数据属性的 `setter` 里调用 `Publisher` 实例的通知方法 `notify`。
3. `defineReactive` 函数添加代码后变成如下：
    ```js
    function defineReactive(data, key, val) {
        const publisher = new Publisher();

        Object.defineProperty(data, key, {
            enumerable: true,
            get: function() {
                return val;
            },
            set: function(newVal) {
                val = newVal;

                publisher.notify(newVal);
            },
        });

        // 递归监听子属性
        observe(val);
    }
    ```

#### 使用 Subscriber
因为一个 subscriber 对应一个节点，所以应该在编译的时候给每个节点添加一个 `Subscriber` 实例。即，在 `compile` 函数中实例化：

```js
function compile (node, vm) {

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

                new Subscriber(node, 'model');
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

            new Subscriber(node, 'text');
        }
    }
}
```

#### 把 subscriber 注册到 publisher
1. 现在已经实现了 subscriber 和 publisher，但两者还没有关联，创建的 subscriber 实例也没有注册到 publisher 实例中。
2. 注册需要用到 `Publisher` 实例的 `addSubscriber` 方法，即：
    ```js
    publisher.addSubscriber(subscriber);
    ```
3. 但是 `Publisher` 实例和 `subscriber` 不在相同的作用域，没办法直接添加。那就想办法把 `Publisher` 实例传到 `subscriber` 的作用域。
4. 为 `Publisher` 定义一个静态属性 `pubs`，用来保存所有的 publisher，每一条记录是一个 publisher 属性名到 `Publisher` 实例的映射
    ```js
    Publisher.pubs = {};
    ```
5. 生成 `Publisher` 实例时，将该实例保存到 `Publisher.pubs`。这样，在 `subscriber` 的作用域，即 `compile` 函数中也可以访问到当前的 `Publisher` 实例。
6. `defineReactive` 函数变成如下：
    ```js
    function defineReactive(data, key, val) {
        const publisher = new Publisher();
        Publisher.pubs[key] = publisher;

        Object.defineProperty(data, key, {
            enumerable: true,
            get: function() {
                return val;
            },
            set: function(newVal) {
                val = newVal;

                publisher.notify(newVal);
            },
        });

        // 递归监听子属性
        observe(val);
    }
    ```
6. 这样就可以在 `compile` 函数中添加生成的 `subscriber`：
    ```js
    function compile (node, vm) {

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
            // 将 “Mustache” syntax 中的变量替换为 model 中相应的数据
            const reg = /\{\{(.*)\}\}/;
            const aMatch = node.nodeValue.match(reg);
            if (aMatch) {
                const sPropName = aMatch[1].trim();
                node.nodeValue = vm.data[sPropName];

                const subscriber = new Subscriber(node, 'text');
                Publisher.pubs[sPropName].addSubscriber(subscriber);
            }
        }
    }
    ```


## 6. 修改完成最终的 MVVM 构造函数
```js
function MVVM (options) {
    this.data = options.data;
    observe(this.data);
    const node = document.querySelector(options.el);
    const dom = initCompile(node, this);
    node.appendChild(dom);
}
```


## References
* [剖析Vue原理&实现双向绑定MVVM](https://segmentfault.com/a/1190000006599500)
* [Vue.js双向绑定的实现原理](http://www.cnblogs.com/kidney/p/6052935.html)
* [Reactivity in Depth](https://vuejs.org/v2/guide/reactivity.html#How-Changes-Are-Tracked)
