# Virtual DOM


<!-- TOC -->

- [Virtual DOM](#virtual-dom)
    - [设计思想](#设计思想)
    - [原理](#原理)
    - [本质](#本质)
        - [抽象建模](#抽象建模)
    - [环境](#环境)
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


## 环境
key | value
--|--
源码版本 | 2.5.21


## 跨平台接口
1. 因为使用了 Virtual DOM 的原因，Vue.js 具有了跨平台的能力（看到 `src/platforms/` 目录下有 `web` 和 `weex` 两个子目录），Virtual DOM 终归只是一些 JavaScript 对象罢了，那么最终是如何调用不同平台的 API 的呢？
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
* `/src/core/vdom/patch.js`
* 具体的实现都是常规 DOM 操作，web 平台的实现在 `src/platforms/web/runtime/node-ops.js`

### `insert`
1. `insert` 用来在 `parent` 这个父节点下插入一个子节点，如果指定了 `ref` 则插入到 `ref` 这个子节点前面。
2. 源码
    ```js
    function insert (parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {
                if (nodeOps.parentNode(ref) === parent) {
                    nodeOps.insertBefore(parent, elm, ref)
                }
            } else {
                nodeOps.appendChild(parent, elm)
            }
        }
    }
    ```

### `createElm`
1. `createElm` 用来新建一个节点， 如果 `tag` 存在则创建一个标签节点，否则创建一个文本节点。
2. 示意代码
    ```js
    function createElm (vnode, parentElm, refElm) {
        if (vnode.tag) {
            insert(parentElm, nodeOps.createElement(vnode.tag), refElm);
        } else {
            insert(parentElm, nodeOps.createTextNode(vnode.text), refElm);
        }
    }
    ```
3. 源码
    ```js
    function createElm(
        vnode,
        insertedVnodeQueue,
        parentElm,
        refElm,
        nested,
        ownerArray,
        index
    ) {
        if ( isDef(vnode.elm) && isDef(ownerArray) ) {
            // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            vnode = ownerArray[index] = cloneVNode(vnode);
        }

        vnode.isRootInsert = !nested; // for transition enter check
        if ( createComponent(vnode, insertedVnodeQueue, parentElm, refElm) ) {
            return;
        }

        const data = vnode.data;
        const children = vnode.children;
        const tag = vnode.tag;
        if ( isDef(tag) ) { // 元素节点
            if ( process.env.NODE_ENV !== "production" ) {
                if ( data && data.pre ) {
                    creatingElmInVPre++;
                }
                if ( isUnknownElement(vnode, creatingElmInVPre) ) {
                    warn(
                        "Unknown custom element: <" +
                            tag +
                            "> - did you " +
                            "register the component correctly? For recursive components, " +
                            'make sure to provide the "name" option.',
                        vnode.context
                    );
                }
            }

            vnode.elm = vnode.ns
                ? nodeOps.createElementNS(vnode.ns, tag)
                : nodeOps.createElement(tag, vnode);
            setScope(vnode);

            /* istanbul ignore if */
            if ( __WEEX__ ) {
                // in Weex, the default insertion order is parent-first.
                // List items can be optimized to use children-first insertion
                // with append="tree".
                const appendAsTree = isDef(data) && isTrue(data.appendAsTree);
                if (!appendAsTree) {
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm);
                }
                createChildren(vnode, children, insertedVnodeQueue);
                if (appendAsTree) {
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm);
                }
            } 
            else {
                createChildren( vnode, children, insertedVnodeQueue );
                if ( isDef(data) ) {
                    invokeCreateHooks( vnode, insertedVnodeQueue );
                }
                insert( parentElm, vnode.elm, refElm );
            }

            if ( process.env.NODE_ENV !== "production" && data && data.pre ) {
                creatingElmInVPre--;
            }
        } 
        else if ( isTrue(vnode.isComment) ) { // 注释节点
            vnode.elm = nodeOps.createComment(vnode.text);
            insert( parentElm, vnode.elm, refElm );
        } 
        else { // 文本节点
            vnode.elm = nodeOps.createTextNode(vnode.text);
            insert( parentElm, vnode.elm, refElm );
        }
    }
    ```

### `addVnodes`
1. `addVnodes` 用来批量调用 `createElm` 新建节点。
2. 源码
    ```js
    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
        }
    }
    ```
    
### `removeNode`
1. `removeNode` 用来用来移除一个节点
2. 源码
    ```js
    function removeNode (el) {
        const parent = nodeOps.parentNode(el)
        // element may have already been removed due to v-html / v-text
        if ( isDef(parent) ) {
            nodeOps.removeChild(parent, el)
        }
    }
    ```

### `removeVnodes`
1. `removeVnodes` 用来批量调用 `removeNode` 移除节点。
2. 源码
    ```js
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if ( isDef(ch) ) {
                if ( isDef(ch.tag) ) {
                    removeAndInvokeRemoveHook(ch);
                    invokeDestroyHook(ch);
                } 
                else {
                    // Text node
                    removeNode(ch.elm);
                }
            }
        }
    }
    ```


## References
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)
