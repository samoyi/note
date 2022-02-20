# Diff Algorithm

<!-- TOC -->

- [Diff Algorithm](#diff-algorithm)
    - [TODO](#todo)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
    - [DOM 树变化差异比较（diff 算法）](#dom-树变化差异比较diff-算法)
    - [patch 的整体逻辑](#patch-的整体逻辑)
        - [首先比较 oldVnode 和 vnode 自身](#首先比较-oldvnode-和-vnode-自身)
        - [patchVnode](#patchvnode)
        - [updateChildren](#updatechildren)
            - [没有 key 的情况](#没有-key-的情况)
            - [有 key 的情况](#有-key-的情况)
    - [`patch` 逻辑](#patch-逻辑)
        - [`sameVnode` 逻辑](#samevnode-逻辑)
        - [`patch` 函数源码](#patch-函数源码)
    - [`patchVnode` 逻辑](#patchvnode-逻辑)
    - [`updateChildren` 逻辑](#updatechildren-逻辑)
        - [四个特殊的节点复用情况](#四个特殊的节点复用情况)
        - [其他情况](#其他情况)
        - [`while` 循环结束以后](#while-循环结束以后)
    - [测试](#测试)
    - [列表的情况](#列表的情况)
        - [Diff 算法并不知道用户操作](#diff-算法并不知道用户操作)
        - [使用 `key` 给节点一个身边标识](#使用-key-给节点一个身边标识)
    - [References](#references)

<!-- /TOC -->

## TODO
从 watcher 更新到触发 patch 的代码流程


## 设计目的
1. 更新一个节点时，如果不需要整体替换那就不要替换，只替换其中变更的部分就好。

### 关键细节
* 怎么判断需不需要整体替换；
* 如果不需要整体替换，怎么计算要替换哪些部分；


## 实现原理
1. `patch` 函数判断新旧 VNode 的关系，以下四种关系中的一种：
    * 没有旧 VNode，那说明是新增，直接添加新节点；
    * 没有新 VNode，那说明要删除旧节点；
    * 新旧 VNode 都有：
        * 需要用新节点整体替换旧节点；
        * 不需要整体替换，只需要进行修补（patch）。
2. 使用 `sameVnode` 函数判断是否需要整体替换。如果是新旧 VNode 是 same 的，则不需要整体替换。但这里的 same 也不是指完全一样，只是说功能上一样，可以修补而不需要替换。
3. 如果要根据新节点对旧节点进行 patch，则调用 `patchVnode` 函数计算哪些部分需要替换；
4. `patchVnode` 需要分析新旧节点内部有哪些不一样的地方，所以要根据新旧节点各自是否有子节点分为四种情况，其他三种（都无、旧无新有、旧有新无）都好处理，也就是直接删除或者直接新增。只有在新旧节点都有子节点的时候，需要判断哪些节点可以复用，哪些只能增删。这部分是最核心的 diff 逻辑，由 `updateChildren` 函数处理。


## 抽象本质


## 设计思想


## DOM 树变化差异比较（diff 算法）
1. 查找任意两个树之间的差异是一个 $O(n^3)$ 问题，React 使用了一种简单强大并且直观的算法使得复杂度降至 $O(n)$。
2. 这是因为 React 只会对两棵树的同层进行比较，也即是说，如果一个节点从上层移动到了下层，React 只会简单的认为上下两层都发生了变化，而不会更智能的识别传是发生了移动。TODO 复杂度分析，[参考](https://www.zhihu.com/question/66851503/answer/246766239)
    <img src="./images/01.png" width="400" style="display: block; margin: 5px 0 10px 0;" />
3. 这样就大大降低了 diff 算法的复杂度。因为在 web 组件中很少会将节点移动到不同的层级，所以这种简化很少会影响性能。
3. 比如如下变动
    ```html
    <!-- 变动前 -->
    <div>                       <!-- 层级1 -->
        <p>                     <!-- 层级2 -->
            <b> aoy </b>        <!-- 层级3 -->   
            <span>diff</span>   <!-- 层级3 -->
        </p> 
    </div>

    <!-- 变动后 -->
    <div>                       <!-- 层级1 -->
        <p>                     <!-- 层级2 -->
            <b> aoy </b>        <!-- 层级3 -->
        </p>
        <span>diff</span>       <!-- 层级2 -->
    </div>
    ```
4. 如果 diff 算法会进行深度比较的话，它就会直接把 `<span>diff</span>` 从第三层提出来放到 `<p>` 后面。这样移动起来很高效，但是比较起来却很低效。
5. 实际上，因为它只能同层比较，所以它在比较第二层的时候会发现多了一个 `<span>diff</span>`，所以就新加一个；然后再比较第三层的时候发现 `<span>diff</span>` 没了，于是就删除该节点。


## patch 的整体逻辑
### 首先比较 oldVnode 和 vnode 自身
* 如果 oldVnode 不存在，直接添加 vnode；
* 如果 oldVnode 存在但 vnode 不存在，直接删除 oldVnode；
* 如果 oldVnode 和 vnode 都存在，看看它俩是不是 sameVnode：
    * 如果是，patchVnode：用 vnode 修补 oldVnode；
    * 如果不是，直接用 vnode 替换 oldVnode。

### patchVnode
1. patchVnode 是比较 oldVnode 和 vnode 的子节点，看看有哪些复用的，所以要先比较子节点的情况。
2. 这里只考虑子节点是元素节点的情况，实际上还要再考虑是文本节点的情况，不过逻辑也比较简单，可以直接看源码。
3. oldVnode 和 vnode 的子节点情况分为以下几种：
    * 如果 oldVnode 没有子节点，那就直接添加 vnode 的子节点；
    * 如果 vnode 没有子节点，那就直接删除 oldVnode 的子节点；
    * 两者都有子节点，需要通过 updateChildren 实现的 diff 算法判断哪些子节点可以复用。

### updateChildren
1. oldVnode 的子节点列表记为 oldCh，vnode 的子节点列表记为 newCh。
2. diff 算法需要四个指针，分别指向这两个列表的首尾元素。记为 oldStartIdx、oldEndIdx、newStartIdx 和 newEndIdx。对应的四个节点记为 oldStartVnode、oldEndVnode、newStartVnode 和 newEndVnode。

#### 没有 key 的情况
1. 没有 key 时，新旧节点如果是 sameVnode 就 patch 复用，如果不是则新节点替换旧节点。
2. sameVnode 的比较分为四种方式：
    * oldStartIdx 和 newStartVnode 如果 sameVnode，patch 后两个指针分别向右移动一位；
    * oldEndIdx 和 newEndIdx 如果 sameVnode，patch 后两个指针分别向左移动一位；
    * oldStartIdx 和 newEndIdx 如果 sameVnode，patch 后本应该在右边的节点（newEndIdx 位置）跑到了左边（oldStartIdx 位置），所以要把 DOM 元素的位置移动到正确的位置，也就是把 oldStartIdx 对应的元素移到 oldEndIdx 对应得元素右边；
    * oldEndVnode 和 newStartVnode 如果 sameVnode，和上一种情况同理但是正好相反，因此 patch 后要把 oldEndVnode 对应的元素移动到 oldStartIdx 对应元素的左边。
3. 如果上面四种 sameVnode 都没有命中，那就必须为当前 newStartVnode 建立一个新元素。
2. 随着比较和 patch，首尾指针逐渐靠拢，直到有一对指针先碰面并错过以为或者同时碰面并错过一位，比较结束。
3. 如果此时 oldCh 还没碰面，说明 oldStartIdx 和 oldEndIdx 中间的子节点就是用不上得了，直接删掉。
4. 如果此时 newCh 还没碰面，说明 newStartIdx 和 newEndIdx 中间的子节点还没有插入，用这些子节点创建元素插入 DOM。

#### 有 key 的情况
1. 因为有了 key，所以 sameVnode 还要加上 key 相同的条件。
2. 此时上面的四种比较方式依然成立，但如果没有命中并不一定要创建新元素，还要和中间的节点比较有没有 key 相同的。
3. 这里在 oldCh 中寻找和 newStartVnode 的拥有相同 key 的节点：
    * 如果没找到的话就使用 newStartVnode 创建一个新元素，放到 oldStartVnode 左边。
    * 如果找到了的话：
        * 如果不是 sameVnode，比如虽然同 key 但是不同元素类型，那还是要创建新元素，放到 oldStartVnode 左边。
        * 如果是 sameVnode，那就用 newStartVnode 去 patch 那个节点。然后把那个旧节点对应的 DOM 元素放到 oldStartVnode 对应元素的左边。


## `patch` 逻辑
1. patch 的过程相当复杂，我们先用简化的代码来看一下
    ```js
    function patch (oldVnode, vnode, parentElm) {
        if ( !oldVnode ) {
            addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
        } 
        else if ( !vnode ) {
            removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
        } 
        else {
            if ( sameVnode(oldVNode, vnode) ) {
                patchVnode(oldVNode, vnode);
            } 
            else {
                removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
                addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
            }
        }
    }
    ```
2. 因为 `patch` 的主要功能是比对两个 VNode 节点，将「差异」更新到视图上，所以入参有新老两个 `VNode` 以及父节点的 `parentElm` 。
3. 首先在 `oldVnode`（老 VNode 节点）不存在的时候，相当于新的 VNode 替代原本没有的节点，所以直接用 `addVnodes` 将这些节点批量添加到 `parentElm` 上
    ```js
    if (!oldVnode) {
        addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    }
    ```
3. 然后同理，在 `vnode`（新 VNode 节点）不存在的时候，相当于要把老的节点删除，所以直接使用 `removeVnodes` 进行批量的节点删除即可
    ```js
    else if (!vnode) {
        removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
    }
    ```
4. 最后一种情况，当 `oldVNode` 与 `vnode` 都存在的时候，需要判断它们是否属于 sameVnode（相同的节点）。如果是则进行 patchVnode 操作；如果不是则删除老节点，增加新节点
    ```js
    if (sameVnode(oldVNode, vnode)) {
        patchVnode(oldVNode, vnode);
    } 
    else {
        removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
        addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    }
    ```

### `sameVnode` 逻辑
1. 源码
    ```js
    // /src/core/vdom/patch.js

    function sameVnode(a, b) {
        return (
            a.key === b.key // key 要么相同要么都没定义
            &&
            ( // 且满足以下两个条件之一
                (
                    a.tag === b.tag &&
                    a.isComment === b.isComment &&
                    isDef(a.data) === isDef(b.data) && // 同时定义或同时不定义
                    sameInputType(a, b) // 下述
                )
                ||
                (
                    // TODO
                    isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)
                )
            )
        );
    }
    ```
2. 当标签类型同时为 `input` 的时候，类型也相同（某些浏览器不支持动态修改 `<input>` 类型，所以他们被视为不同类型）时，两个节点就被视为相同的节点
    ```js
    function sameInputType(a, b) {
        if (a.tag !== 'input') return true;
        let i;
        const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
        const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
        // 要么是 type 一样，要么虽然不一样，但是都是文本输入的类型
        return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
        // isTextInputType 实现如下
        // const isTextInputType = makeMap('text,number,password,search,email,tel,url')
    }
    ```
    
### `patch` 函数源码
`/src/core/vdom/patch.js`

```js
export function createPatchFunction (backend) {
    
    // ...
    
    return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
        // 如果没有新 VNode 只有旧 VNode，那就直接删除旧 VNode
        // TODO，没找到删除元素的逻辑
        if (isUndef(vnode)) {
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
            return;
        }

        let isInitialPatch = false;
        const insertedVnodeQueue = [];

        // 有新 VNode 但没有旧 VNode，则创建一个新元素
        if (isUndef(oldVnode)) { 
            // empty mount (likely as component), create new root element
            isInitialPatch = true;
            createElm(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        // 新旧 VNode 都有
        else { 
            const isRealElement = isDef(oldVnode.nodeType);
            // 新旧 VNode 相同，则进行 patch
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // patch existing root node
                patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
            }
            // 新旧 VNode 不同，替换
            else {
                if (isRealElement) {
                    // mounting to a real element
                    // check if this is server-rendered content and if we can perform
                    // a successful hydration.
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                    }
                    if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                            invokeInsertHook(vnode, insertedVnodeQueue, true);
                            return oldVnode;
                        } 
                        else if (process.env.NODE_ENV !== 'production') {
                            warn(
                              'The client-side rendered virtual DOM tree is not matching ' +
                              'server-rendered content. This is likely caused by incorrect ' +
                              'HTML markup, for example nesting block-level elements inside ' +
                              '<p>, or missing <tbody>. Bailing hydration and performing ' +
                              'full client-side render.'
                            );
                        }
                    }

                    // either not server-rendered, or hydration failed.
                    // create an empty node and replace it
                    oldVnode = emptyNodeAt(oldVnode);
                }

                // 获取旧节点的元素和父级，用来创建新元素
                // replacing existing element
                const oldElm = oldVnode.elm;
                const parentElm = nodeOps.parentNode(oldElm);

                // 创建新元素
                // create new node
                createElm(
                    vnode,
                    insertedVnodeQueue,
                    // extremely rare edge case: do not insert if old element is in a
                    // leaving transition. Only happens when combining transition +
                    // keep-alive + HOCs. (#4590)
                    oldElm._leaveCb ? null : parentElm,
                    nodeOps.nextSibling(oldElm)
                );

                // update parent placeholder node element, recursively
                if (isDef(vnode.parent)) {
                    let ancestor = vnode.parent;
                    const patchable = isPatchable(vnode);
                    while (ancestor) {
                        for (let i = 0; i < cbs.destroy.length; ++i) {
                            cbs.destroy[i](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                            for (let i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, ancestor);
                            }
                            // #6513
                            // invoke insert hooks that may have been merged by create hooks.
                            // e.g. for directives that uses the "inserted" hook.
                            const insert = ancestor.data.hook.insert;
                            if (insert.merged) {
                                // start at index 1 to avoid re-invoking component mounted hook
                                for (let i = 1; i < insert.fns.length; i++) {
                                    insert.fns[i]();
                                }
                            }
                        } 
                        else {
                            registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                    }
                }

                // 删除旧的 VNode 和元素
                // destroy old node
                if (isDef(parentElm)) {
                    removeVnodes(parentElm, [oldVnode], 0, 0);
                } 
                else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode);
                }
            }
        }

        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
    };
}
```


## `patchVnode` 逻辑
1. `patchVnode` 是在符合 sameVnode 的条件下触发的，所以会进行「比对」。
2. 源码
    ```js
    `/src/core/vdom/patch.js`

    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
        if (oldVnode === vnode) {
            return;
        }

        // 新的 vnode 将挂载到原 vnode 的节点上
        const elm = (vnode.elm = oldVnode.elm);

        // TODO
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
            if (isDef(vnode.asyncFactory.resolved)) {
                hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
            } 
            else {
                vnode.isAsyncPlaceholder = true;
            }
            return;
        }

        // TODO
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (
            isTrue(vnode.isStatic) &&
            isTrue(oldVnode.isStatic) &&
            vnode.key === oldVnode.key &&
            (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
        ) {
            vnode.componentInstance = oldVnode.componentInstance;
            return;
        }

        // TODO
        let i;
        const data = vnode.data;
        if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
          i(oldVnode, vnode);
        }

        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (isDef(data) && isPatchable(vnode)) {
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
          if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
        }
        // 如果不是文本节点
        if (isUndef(vnode.text)) {
            // 都存在子节点且不相同，更新子节点
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
            } 
            // 旧的 Vnode 不包含子节点
            else if (isDef(ch)) {
                // 旧节点如果内部有文本，则清除
                if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
                // 把新的 Vnode 的子节点加入
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            } 
            // 新的 Vnode 不包含子节点
            else if (isDef(oldCh)) {
                // 清除旧节点的子节点
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            } 
            // 都没有子节点，则清空旧节点可能的内部文本
            else if (isDef(oldVnode.text)) {
                nodeOps.setTextContent(elm, '');
            }
        } 
        // 如果是文本节点直接设置 textContent
        else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, vnode.text);
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
        }
    }
    ```
3. 首先在新老 VNode 节点相同的情况下，就不需要做任何改变了，直接 return。
4. 在当新老 VNode 节点都是 `isStatic`（静态的），并且 `key` 相同时，只要将 `componentInstance` 与 `elm` 从老 VNode 节点 “拿过来” 即可，这样就可以跳过比对的过程。TODO，`componentInstance` 是什么。
5. 接下来，当新 VNode 节点是文本节点的时候，直接用 `setTextContent` 来设置 text，这里的 `nodeOps` 是一个适配层，根据不同平台提供不同的操作平台 DOM 的方法，实现跨平台。
6. 当新 VNode 节点是非文本节点当时候，需要分几种情况
    * `oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点。
    * 如果只有 `ch` 存在的时候，如果老节点是文本节点则先将节点的文本清除，然后将 `ch` 批量插入插入到节点 `elm` 下。
    * 同理当只有 `oldCh` 存在时，说明需要将老节点通过 `removeVnodes` 全部清除。
    * 最后一种情况是如果两者都没有子节点，还要看看老节点是不是文本节点，是的话清除掉内容。


## `updateChildren` 逻辑
1. `updateChildren` 函数实现了上面的 $O(n)$ 的 diff 算法。
    ```js
    `/src/core/vdom/patch.js`

    function updateChildren(
        parentElm,
        oldCh,
        newCh,
        insertedVnodeQueue,
        removeOnly
    ) {
        // 四个比对索引指针和对应的四个节点
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];

        let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        const canMove = !removeOnly;

        if (process.env.NODE_ENV !== "production") {
            checkDuplicateKeys(newCh);
        }

        // while 为 false 的条件是新子节点列表或旧子节点列表其中之一的首位指针相遇，即其中一个列表比对结束
        while ( oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx ) { 
            if ( isUndef(oldStartVnode) ) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
            } 
            else if ( isUndef(oldEndVnode) ) {
                oldEndVnode = oldCh[--oldEndIdx];
            } 

            else if ( sameVnode(oldStartVnode, newStartVnode) ) {
                patchVnode(
                    oldStartVnode,
                    newStartVnode,
                    insertedVnodeQueue,
                    newCh,
                    newStartIdx
                );
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } 
            else if ( sameVnode(oldEndVnode, newEndVnode) ) {
                patchVnode(
                    oldEndVnode,
                    newEndVnode,
                    insertedVnodeQueue,
                    newCh,
                    newEndIdx
                );
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } 
            else if ( sameVnode(oldStartVnode, newEndVnode) ) {
                // Vnode moved right
                patchVnode(
                    oldStartVnode,
                    newEndVnode,
                    insertedVnodeQueue,
                    newCh,
                    newEndIdx
                );
                canMove &&
                    nodeOps.insertBefore(
                        parentElm,
                        oldStartVnode.elm,
                        nodeOps.nextSibling(oldEndVnode.elm)
                    );
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } 
            else if ( sameVnode(oldEndVnode, newStartVnode) ) {
                // Vnode moved left
                patchVnode(
                    oldEndVnode,
                    newStartVnode,
                    insertedVnodeQueue,
                    newCh,
                    newStartIdx
                );
                canMove &&
                    nodeOps.insertBefore(
                        parentElm,
                        oldEndVnode.elm,
                        oldStartVnode.elm
                    );
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } 
            
            else {
                if ( isUndef(oldKeyToIdx) ) {
                    // 旧节点列表中，key 到 index 的映射
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }

                // 如果 newStartVnode 存在 key，则通过 key 找到该节点在旧列表中对应的旧节点的索引；
                // 如果 newStartVnode 不存在 key，让然试图通过 findIdxInOld 找找在旧列表中有没有对应的节点，有的话返回索引
                idxInOld = isDef(newStartVnode.key)
                    ? oldKeyToIdx[newStartVnode.key]
                    : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

                // 所以，idxInOld 存在意味着：
                // 1. 要么在旧节点列表中找到了 key 相同的节点（key 相同也不一定满足 sameVnode）
                // 2. 要么新节点虽然不存在 key 但是和旧节点列表中的某个节点 sameVnode

                if ( isUndef(idxInOld) ) { // 如果 newStartVnode 这个节点是新的
                    // New element
                    // 则新建一个元素
                    createElm(
                        newStartVnode,
                        insertedVnodeQueue,
                        parentElm,
                        oldStartVnode.elm,
                        false,
                        newCh,
                        newStartIdx
                    );
                } 
                else {
                    vnodeToMove = oldCh[idxInOld];
                    if ( sameVnode(vnodeToMove, newStartVnode) ) { // 有可能 key 相同但不是 sameVode，所以验证一下
                        patchVnode(
                            vnodeToMove,
                            newStartVnode,
                            insertedVnodeQueue,
                            newCh,
                            newStartIdx
                        );
                        oldCh[idxInOld] = undefined;
                        canMove &&
                            nodeOps.insertBefore(
                                parentElm,
                                vnodeToMove.elm,
                                oldStartVnode.elm
                            );
                    } 
                    else { // key 相同但不是 sameVnode，还是不能复用
                        // same key but different element. treat as new element
                        createElm(
                            newStartVnode,
                            insertedVnodeQueue,
                            parentElm,
                            oldStartVnode.elm,
                            false,
                            newCh,
                            newStartIdx
                        );
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }

        if ( oldStartIdx > oldEndIdx ) { // 老节点比对完了，还有几个新的节点需要插入
            // 如果 newCh[newEndIdx + 1] 节点存在，则这个节点已经插入到
            // newCh[newEndIdx + 1] 是上一个从右边比对完成的子节点
            refElm = isUndef(newCh[newEndIdx + 1])
                ? null
                : newCh[newEndIdx + 1].elm;
            addVnodes(
                parentElm,
                refElm,
                newCh,
                newStartIdx,
                newEndIdx,
                insertedVnodeQueue
            );
        } 
        else if ( newStartIdx > newEndIdx ) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }


    function findIdxInOld (node, oldCh, start, end) {
        for (let i = start; i < end; i++) {
            const c = oldCh[i]
            if (isDef(c) && sameVnode(node, c)) return i
        }
    }
    ```
2. 首先我们定义 `oldStartIdx`、`newStartIdx`、`oldEndIdx` 以及 `newEndIdx` 分别是新老两个 VNode 的子节点两边的索引，同时 `oldStartVnode`、`newStartVnode`、`oldEndVnode` 以及 `newEndVnode` 分别指向这几个索引对应的 VNode 节点
    <img src="./images/04.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
3. 接下来是一个 `while` 循环，在这过程中，`oldStartIdx`、`newStartIdx`、`oldEndIdx` 以及 `newEndIdx` 会逐渐向中间靠拢
    <img src="./images/05.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
4. 首先的两个 `if`，是当 `oldStartVnode` 或者 `oldEndVnode` 不存在的时候，`oldStartIdx` 与 `oldEndIdx` 继续向中间靠拢，并更新对应的 `oldStartVnode` 与 `oldEndVnode` 的指向。不懂，为什么会不存在
    ```js
    if (!oldStartVnode) {
        oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
        oldEndVnode = oldCh[--oldEndIdx];
    }
    ```

### 四个特殊的节点复用情况
1. 接下的四个 `if`，是将 `oldStartIdx`、`newStartIdx`、`oldEndIdx` 以及 `newEndIdx` 两两比对的过程，一共会出现 2*2=4 种情况。
2. 第一种情况，`oldStartVnode` 与 `newStartVnode` 符合 `sameVnode` 时，说明老 VNode 节点的头部与新 VNode 节点的头部是相同的 VNode 节点，直接进行 `patchVnode` 进行复用，同时 `oldStartIdx` 与 `newStartIdx` 向后移动一位。
3. 第二种情况，`oldEndVnode` 与 `newEndVnode` 符合 `sameVnode`，也就是两个 VNode 的结尾是相同的 VNode，同样进行 `patchVnode` 操作进行复用，并将 `oldEndVnode` 与 `newEndVnode` 向前移动一位。
4. 第三种情况，`oldStartVnode` 与 `newEndVnode` 符合 `sameVnode` 的时候，也就是老 VNode 节点的头部与新 VNode 节点的尾部是同一节点的时候，将 `oldStartVnode.elm` 这个节点直接移动到 `oldEndVnode.elm` 这个节点的后面即可进行复用。然后 `oldStartIdx` 向后移动一位，`newEndIdx` 向前移动一位。
4. 第四种情况，`oldEndVnode` 与 `newStartVnode` 符合 `sameVnode` 时，也就是老 VNode 节点的尾部与新 VNode 节点的头部是同一节点的时候，将 `oldEndVnode.elm` 插入到 `oldStartVnode.elm` 前面进行复用。同样的，`oldEndIdx` 向前移动一位，`newStartIdx` 向后移动一位。

### 其他情况
```js
else {
    let elmToMove = oldCh[idxInOld];
    if ( !oldKeyToIdx ) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
    }
    idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
    if ( !idxInOld ) {
        createElm(newStartVnode, parentElm, oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
    } 
    else {
        elmToMove = oldCh[idxInOld];
        if ( sameVnode(elmToMove, newStartVnode) ) {
            patchVnode(elmToMove, newStartVnode);
            oldCh[idxInOld] = undefined;
            nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
        } 
        else {
            createElm(newStartVnode, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
        }
    }
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
    }
    return map
}
```

1. `createKeyToOldIdx` 的作用是产生 `key` 与 `index` 索引对应的一个 map 表。比如说：
    ```js
    [
        {xx: xx, key: 'key0'},
        {xx: xx, key: 'key1'}, 
        {xx: xx, key: 'key2'}
    ]
    ```
    在经过 `createKeyToOldIdx` 转化以后会变成：
    ```js
    {
        key0: 0, 
        key1: 1, 
        key2: 2
    }
    ```
    我们可以根据 `newCh` 中某一个节点的 `key` 值，快速地从 `oldKeyToIdx`（`createKeyToOldIdx` 的返回值）中获取相同 `key` 的节点的索引 `idxInOld`，然后找到 `oldCh` 中相同的节点。
2. 如果没有在 `oldCh` 中找到和 `newStartVnode` 同 `key` 的节点，则通过 `createElm` 创建一个新节点，插入到 `oldStartVnode` 前面，并将 `newStartIdx` 向后移动一位
    ```js
    if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
    idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
    if (!idxInOld) {
        createElm(newStartVnode, parentElm, oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
    }
    ```
3. 否则如果找到了节点，同时它符合 `sameVnode`，则将这两个节点进行 `patchVnode`，将该位置的老节点赋值 `undefined`（之后如果还有新节点与该节点 `key` 相同可以检测出来提示已有重复的 `key` ），同时将 `newStartVnode.elm` 插入到 `oldStartVnode.elm` 的前面。同理，`newStartIdx` 往后移动一位
    ```js
    else {
        elmToMove = oldCh[idxInOld];
        if ( sameVnode(elmToMove, newStartVnode) ) {
            patchVnode(elmToMove, newStartVnode);
            oldCh[idxInOld] = undefined;
            nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
        } 
        // ...
    }
    ```
4. 如果不符合 `sameVnode`，只能创建一个新节点插入到 `parentElm` 的子节点中，`newStartIdx` 往后移动一位
    ```js
    else {
        createElm(newStartVnode, parentElm, oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
    }
    ```

### `while` 循环结束以后
1. 如果 `oldStartIdx > oldEndIdx`，说明老节点比对完了，但是新节点还有多的，需要将新节点插入到真实 DOM 中去，调用 `addVnodes` 将这些节点插入即可
    ```js
    if (oldStartIdx > oldEndIdx) {
        refElm = (newCh[newEndIdx + 1]) ? newCh[newEndIdx + 1].elm : null;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx);
    } 
    ```
2. 同理，如果满足 `newStartIdx > newEndIdx` 条件，说明新节点比对完了，老节点还有多，将这些无用的老节点通过 `removeVnodes` 批量删除即可
    ```js
    else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
    ```


## 测试
1. 子节点只包含文本，且文本就作为 `key`。代码如下
    ```html
    <div id="app">
        <p v-for="key in arr":key="key">{{key}}</p>
    </div>
    ```
    ```js
    var app = new Vue({
        el: '#app',
        
        data: {
            arr: ["a", "b", "c", "d"]
        },
        
        mounted () {
            setTimeout(() => {
                this.arr = ["b", "e", "d", "c"];
            }, 1000)
        }
    })
    ```
2. 准备 patch 时，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>a</td>
            <td>b</td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td>b</td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>3</td>
            <td>0</td>
            <td>3</td>
        </tr>
    </table>
3. 第一轮 `while` 开始:
    1. 首尾结点没有相同的，进入 `else` 分支；
    2. 通过新的 Vnode `b` 的 `key` 找到旧的 Vnode `b`；
    3. 符合 sameVnode，进行 `patchVnode`；
    4. 旧的 Vnode `b` 设置为 `undefined`；
    5. 把旧的 Vnode `b` 对应的实际 DOM 元素 `b` 移动到 `oldCh[0]` 对应的 DOM 元素 `a` 之前。
    6. `++newStartIdx`。
4. 第一轮 `while` 结束，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>b</td>
            <td>a</td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td><pre>undefined</pre></td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>3</td>
            <td>1</td>
            <td>3</td>
        </tr>
    </table>
5. 第二轮 `while` 开始:
    1. 首尾结点没有相同的，进入 `else` 分支；
    2. 在 `oldCh` 找不到新的 Vnode `e` 对应的 `key`； 
    3. 通过 `createElm` 创建新的 DOM 元素：使用新的 Vnode `e` 创建，插入到 `oldCh[0]` 对应的 DOM 元素 `a` 之前；
    4. `++newStartIdx`。
6. 第二轮 `while` 结束，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>b</td>
            <td>e</td>
            <td>a</td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td><pre>undefined</pre></td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>3</td>
            <td>2</td>
            <td>3</td>
        </tr>
    </table>
7. 第三轮 `while` 开始:
    1. 进入 `sameVnode(oldEndVnode, newStartVnode)` 分支；
    2. `patchVnode`:
    3. 把旧的 `oldCh[3]` 对应的实际 DOM 元素 `d` 移动到 `oldCh[0]` 对应的 DOM 元素 `a` 之前。
    4. `--oldEndIdx`、`++newStartIdx`。
8. 第三轮 `while` 结束，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>a</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td><pre>undefined</pre></td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>3</td>
        </tr>
    </table>
9. 第四轮 `while` 开始:
    1. 进入 `sameVnode(oldEndVnode, newEndVnode)` 分支；
    2. `patchVnode`:
    4. `--oldEndIdx`、`--newEndIdx`。
10. 第四轮 `while` 结束，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>a</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td><pre>undefined</pre></td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>1</td>
            <td>3</td>
            <td>2</td>
        </tr>
    </table>
11. 退出 `while`，进入 因为 `newStartIdx > newEndIdx`。移除 `oldCh` 中 [0, 1] 对应的的真实 DOM 节点，也就是删除的 DOM 元素 `a`。
12. 退出 `updateChildren`，各部分状态如下
    <table style="text-align:center">
        <tr>
            <th>DOM:</th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldCh:</pre></th>
            <td>a</td>
            <td><pre>undefined</pre></td>
            <td>c</td>
            <td>d</td>
        </tr>
        <tr>
            <th><pre>newCh:</pre></th>
            <td>b</td>
            <td>e</td>
            <td>d</td>
            <td>c</td>
        </tr>
        <tr>
            <th><pre>oldStartIdx <br /> oldEndIdx <br /> newStartIdx <br /> newEndIdx</pre></th>
            <td>0</td>
            <td>1</td>
            <td>3</td>
            <td>2</td>
        </tr>
    </table>


## 列表的情况
不加 key 导致 bug：用源代码分析为什么导致 bug
不加 key 影响复用

### Diff 算法并不知道用户操作
1. 比如根据一个数组 `[1, 2, 3, 4, 5]` 循环渲染出一个列表。之后往数组里又插入了一项，变成了 `[1, 2, 3, 3.5, 4, 5]`。
2. 你插入的时候当然是知道插入的 index 是 3，但是 diff 算法只是监听数据变化，它并不知道你插入的位置。
3. 所以，它对比两个数组的差异，会发现：前三项 `1`、`2`、`3` 都没变，第四项 `4` 变成了 `3.5`，第五项 `5` 变成了 `4`，后面新加了一个第六项 `5`。
4. 删除的时候也是同样的问题。
5. 当然如果只是这样的话，就算 diff 算法没有正确理解插入，它重新渲染列表后也是符合预期的。
6. 比如说本来通过 `<li v-for="item in array">{{item}}</li>` 渲染出这个列表
    ```html
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
    </ul>
    ```
7. 数组改变后，按照 diff 算法的理解，它会复用前三个，然后更改之后的两个，最后再加一个新的。渲染为
    ```html
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>3.5</li>
        <li>4</li>
        <li>5</li>
    </ul>
    ```
7. 但是如果在列表项里再加一个输入框 `<li v-for="item in array"><input>{{item}}</li>`，渲染好之后再往每个输入框里输入不一样的内容，比如这样
    <img src="./images/02.png" width="200" style="display: block; margin: 5px 0 10px 0;" />
8. 然后再改变数组触发重渲染，就成了下面的样子
    <img src="./images/03.png" width="200" style="display: block; margin: 5px 0 10px 0;" />
9. Diff 算法直接复用的前三个，没问题。
10. 因为 diff 算法并不知道你是插在哪个位置，所以只是按顺序继续往后比较，然后发现第四项的值从 `4` 变成了 `3.5`，所以它并不需要重新渲染整个`<li>`，只需要修改里面的文本节点值就行了。
11. 因为前面说了 diff 算法是同层比较，所以不会去看子节点 `<input>`，而且 `<input>` 也没有依赖什么数据，所以就直接复用它了，就出现了问题。

### 使用 `key` 给节点一个身边标识
1. 为了解决这个问题，需要给每个列表元素提供一个身份标识，diff 算法根据这个标识来判断到底发生了什么改变
    ```js
    <li v-for="item in array" :key="item"><input>{{item}}</li>
    ```
2. 现在五个列表项的 `key` 分别是 `1`、`2`、`3`、`4`、`5`。列表更新后，diff 算法发现这五个 `key` 所在的列表项都在，然后在第三项后面多了一个节点，现在就能正确的插入了。
3. 因为 `key` 必须是唯一的表明节点身份的，所以不能用列表循环的索引作为 `key`。





## References
* [React’s diff algorithm](https://calendar.perfplanet.com/2013/diff/)
* [React’s diff algorithm 翻译](https://zhuanlan.zhihu.com/p/82506257)
* [Vue2.0 v-for 中 :key 到底有什么用？ - 方应杭的回答 - 知乎](https://www.zhihu.com/question/61064119/answer/766607894)
* [解析vue2.0的diff算法](https://github.com/aooy/blog/issues/2)
* [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
* [剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991)