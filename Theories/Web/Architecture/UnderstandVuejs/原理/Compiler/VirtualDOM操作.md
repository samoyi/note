# Virtual DOM


<!-- TOC -->

- [Virtual DOM](#virtual-dom)
    - [设计思想](#设计思想)
    - [原理](#原理)
    - [本质](#本质)
        - [抽象建模](#抽象建模)
    - [跨平台接口](#跨平台接口)
    - [一些 API](#一些-api)
        - [`insert`](#insert)
        - [`createElm`](#createelm)
        - [`addVnodes`](#addvnodes)
        - [`removeNode`](#removenode)
        - [`removeVnodes`](#removevnodes)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 原理


## 本质
### 抽象建模


## 跨平台接口
1. 因为使用了 Virtual DOM 的原因，Vue.js 具有了跨平台的能力，Virtual DOM 终归只是一些 JavaScript 对象罢了，那么最终是如何调用不同平台的 API 的呢？
2. 这就需要依赖一层适配层了，将不同平台的 API 封装在内，以同样的接口对外提供
    ```js
    const nodeOps = {
        setTextContent (text) {
            if (platform === 'weex') {
                node.parentNode.setAttr('value', text);
            } else if (platform === 'web') {
                node.textContent = text;
            }
        },
        parentNode () {
            //......
        },
        removeChild () {
            //......
        },
        nextSibling () {
            //......
        },
        insertBefore () {
            //......
        }
    }
    ```
3. 举个例子，现在我们有上述一个 `nodeOps` 对象做适配，根据 platform 区分不同平台来执行当前平台对应的 API，而对外则是提供了一致的接口，供 Virtual DOM 来调用。


## 一些 API
### `insert`
1. `insert` 用来在 `parent` 这个父节点下插入一个子节点，如果指定了 `ref` 则插入到 `ref` 这个子节点前面
    ```js
    function insert (parent, elm, ref) {
        if (parent) {
            if (ref) {
                if (ref.parentNode === parent) {
                    nodeOps.insertBefore(parent, elm, ref);
                }
            } else {
                nodeOps.appendChild(parent, elm)
            }
        }
    }
    ```

### `createElm`
1. `createElm` 用来新建一个节点， 如果 `tag` 存在则创建一个标签节点，否则创建一个文本节点
    ```js
    function createElm (vnode, parentElm, refElm) {
        if (vnode.tag) {
            insert(parentElm, nodeOps.createElement(vnode.tag), refElm);
        } else {
            insert(parentElm, nodeOps.createTextNode(vnode.text), refElm);
        }
    }
    ```

### `addVnodes`
1. `addVnodes` 用来批量调用 `createElm` 新建节点
    ```js
    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(vnodes[startIdx], parentElm, refElm);
        }
    }
    ```
    
### `removeNode`
1. `removeNode` 用来用来移除一个节点
    ```js
    function removeNode (el) {
        const parent = nodeOps.parentNode(el);
        if (parent) {
            nodeOps.removeChild(parent, el);
        }
    }
    ```

### `removeVnodes`
1. `removeVnodes` 用来批量调用 `removeNode` 移除节点
    ```js
    function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx]
            if (ch) {
                removeNode(ch.elm);
            }
        }
    }
    ```



## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)
