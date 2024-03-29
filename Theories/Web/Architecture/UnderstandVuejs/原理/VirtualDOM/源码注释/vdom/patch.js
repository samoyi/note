/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

import VNode, { cloneVNode } from "./vnode";
import config from "../config";
import { SSR_ATTR } from "shared/constants";
import { registerRef } from "./modules/ref";
import { traverse } from "../observer/traverse";
import { activeInstance } from "../instance/lifecycle";
import { isTextInputType } from "web/util/element";

import { warn, isDef, isUndef, isTrue, makeMap, isRegExp, isPrimitive } from "../util/index";

export const emptyNode = new VNode("", {}, []);

const hooks = ["create", "activate", "update", "remove", "destroy"];


// 注意：key 相同不一定是 sameVnode，可能标签类型有变化但还是标记了相同的 key；反过来 sameVnode 也不一定
// 是 key 相同，也可能是都没有 key。在 updateChildren 函数中会区分这两种情况。
function sameVnode(a, b) {
    return (
        a.key === b.key && // key 要么相同要么都没定义 // 且满足以下两个条件之一
        ((a.tag === b.tag &&
            a.isComment === b.isComment &&
            isDef(a.data) === isDef(b.data) && // 同时定义或同时不定义
            sameInputType(a, b)) || // 下述
            // TODO
            (isTrue(a.isAsyncPlaceholder) &&
                a.asyncFactory === b.asyncFactory &&
                isUndef(b.asyncFactory.error)))
    );
}

// 根据上面的 sameVnode 中的逻辑，调用这个函数的时候，说明两个节点的是相同类型的 tag 了
// 这时还要看看 tag 类型是不是 input：
//    * 如果是的话，它们的 type 也要相等才认为是相同的节点
//    * 如果不是的话那就没关系，它们就是相同的节点
function sameInputType(a, b) {
    if (a.tag !== "input") return true;
    let i;
    const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
    const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
    // 要么是 type 一样，要么虽然不一样，但是都是文本输入的类型
    return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
    // isTextInputType 实现如下
    // const isTextInputType = makeMap('text,number,password,search,email,tel,url')
}

// 返回一组元素 从 key 到 index 的映射
// 如果没有 key 就返回空映射
// 这个函数本身和 old 没什么关系，只不过使用的时候第一个参数传的是 old 的子节点列表
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, key;
    const map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key)) {
            map[key] = i;
        }
    }
    return map;
}

export function createPatchFunction(backend) {
    let i, j;
    const cbs = {};

    const { modules, nodeOps } = backend;

    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }

    function emptyNodeAt(elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }

    function createRmCb(childElm, listeners) {
        function remove() {
            if (--remove.listeners === 0) {
                removeNode(childElm);
            }
        }
        remove.listeners = listeners;
        return remove;
    }

    function removeNode(el) {
        const parent = nodeOps.parentNode(el);
        // element may have already been removed due to v-html / v-text
        if (isDef(parent)) {
            nodeOps.removeChild(parent, el);
        }
    }

    function isUnknownElement(vnode, inVPre) {
        return (
            !inVPre &&
            !vnode.ns &&
            !(
                config.ignoredElements.length &&
                config.ignoredElements.some((ignore) => {
                    return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
                })
            ) &&
            config.isUnknownElement(vnode.tag)
        );
    }

    let creatingElmInVPre = 0;

    // 里面会处理好几种情况，最常见的一种是：用 vnode 创建一个元素，插入到 refElm 前面
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            vnode = ownerArray[index] = cloneVNode(vnode);
        }

        vnode.isRootInsert = !nested; // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }

        const data = vnode.data;
        const children = vnode.children;
        const tag = vnode.tag;
        if (isDef(tag)) {
            if (process.env.NODE_ENV !== "production") {
                if (data && data.pre) {
                    creatingElmInVPre++;
                }
                if (isUnknownElement(vnode, creatingElmInVPre)) {
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
            if (__WEEX__) {
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
                createChildren(vnode, children, insertedVnodeQueue);
                if (isDef(data)) {
                    invokeCreateHooks(vnode, insertedVnodeQueue);
                }
                // 把 vnode.elm 插入到 refElm 前面
                insert(parentElm, vnode.elm, refElm);
            }

            if (process.env.NODE_ENV !== "production" && data && data.pre) {
                creatingElmInVPre--;
            }
        } 
        else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps.createComment(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        } 
        else {
            vnode.elm = nodeOps.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i = vnode.data;
        if (isDef(i)) {
            const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
            if (isDef((i = i.hook)) && isDef((i = i.init))) {
                i(vnode, false /* hydrating */, parentElm, refElm);
            }
            // after calling the init hook, if the vnode is a child component
            // it should've created a child instance and mounted it. the child
            // component also has set the placeholder vnode's elm.
            // in that case we can just return the element and be done.
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                if (isTrue(isReactivated)) {
                    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                }
                return true;
            }
        }
    }

    function initComponent(vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
            insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            vnode.data.pendingInsert = null;
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            setScope(vnode);
        } else {
            // empty component root.
            // skip all element-related modules except for ref (#3455)
            registerRef(vnode);
            // make sure to invoke the insert hook
            insertedVnodeQueue.push(vnode);
        }
    }

    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        let i;
        // hack for #4339: a reactivated component with inner transition
        // does not trigger because the inner node's created hooks are not called
        // again. It's not ideal to involve module-specific logic in here but
        // there doesn't seem to be a better way to do it.
        let innerNode = vnode;
        while (innerNode.componentInstance) {
            innerNode = innerNode.componentInstance._vnode;
            if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                for (i = 0; i < cbs.activate.length; ++i) {
                    cbs.activate[i](emptyNode, innerNode);
                }
                insertedVnodeQueue.push(innerNode);
                break;
            }
        }
        // unlike a newly created component,
        // a reactivated keep-alive component doesn't insert itself
        insert(parentElm, vnode.elm, refElm);
    }

    // 如果有 ref 元素，把 elm 插入到 ref 前面；
    // 如果有 ref 元素，把 elm 作为 parent 最后一个子节点；
    function insert(parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {
                if (ref.parentNode === parent) {
                    nodeOps.insertBefore(parent, elm, ref);
                }
            } 
            else {
                nodeOps.appendChild(parent, elm);
            }
        }
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
        if (Array.isArray(children)) {
            if (process.env.NODE_ENV !== "production") {
                checkDuplicateKeys(children);
            }
            for (let i = 0; i < children.length; ++i) {
                createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
            }
        } else if (isPrimitive(vnode.text)) {
            nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
        }
    }

    function isPatchable(vnode) {
        while (vnode.componentInstance) {
            vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (let i = 0; i < cbs.create.length; ++i) {
            cbs.create[i](emptyNode, vnode);
        }
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
            if (isDef(i.create)) i.create(emptyNode, vnode);
            if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
        }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
        let i;
        if (isDef((i = vnode.fnScopeId))) {
            nodeOps.setStyleScope(vnode.elm, i);
        } else {
            let ancestor = vnode;
            while (ancestor) {
                if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                    nodeOps.setStyleScope(vnode.elm, i);
                }
                ancestor = ancestor.parent;
            }
        }
        // for slot content they should also get the scopeId from the host instance.
        if (
            isDef((i = activeInstance)) &&
            i !== vnode.context &&
            i !== vnode.fnContext &&
            isDef((i = i.$options._scopeId))
        ) {
            nodeOps.setStyleScope(vnode.elm, i);
        }
    }

    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(
                vnodes[startIdx],
                insertedVnodeQueue,
                parentElm,
                refElm,
                false,
                vnodes,
                startIdx
            );
        }
    }

    function invokeDestroyHook(vnode) {
        let i, j;
        const data = vnode.data;
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
        }
        if (isDef((i = vnode.children))) {
            for (j = 0; j < vnode.children.length; ++j) {
                invokeDestroyHook(vnode.children[j]);
            }
        }
    }

    // 移除 vnodes 中 [startIdx, endIdx] 对应的的真实 DOM 节点
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
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

    // TODO 第一个分支的细节
    function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
            let i;
            const listeners = cbs.remove.length + 1;
            if (isDef(rm)) {
                // we have a recursively passed down rm callback
                // increase the listeners count
                rm.listeners += listeners;
            } else {
                // directly removing
                rm = createRmCb(vnode.elm, listeners);
            }
            // recursively invoke hooks on child component root node
            if (isDef((i = vnode.componentInstance)) && isDef((i = i._vnode)) && isDef(i.data)) {
                removeAndInvokeRemoveHook(i, rm);
            }
            for (i = 0; i < cbs.remove.length; ++i) {
                cbs.remove[i](vnode, rm);
            }
            if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                i(vnode, rm);
            } else {
                rm();
            }
        } 
        else {
            removeNode(vnode.elm);
        }
    }

    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
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
        const canMove = !removeOnly; // 所以 canMove 一般都为 true

        if (process.env.NODE_ENV !== "production") {
            checkDuplicateKeys(newCh);
        }

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            // isUndef 的情况是，下面有 oldCh[idxInOld] = undefined;
            if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
            } 
            else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            } 
            
            // 首首 patch 或者 尾尾 patch，直接 patch 就行了
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } 
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } 

            // 首尾 patch 会导致本来应该在最右边的节点跑到了最左边，
            // 尾首 patch 会导致本来应该在最左边的节点跑到最右边，
            // （最左最右不是指在整体的子节点里最左最右，而是在首尾指针范围内）
            // 所以 patch 之后需要调整一下位置，也就是 canMova && 后面的操作。
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                // 既然新的 vnode 是在最右边，然后你用它修补旧的最左边的 vnode，
                // 那也就是说修补后这个旧的最左边的 vnode 的元素应该移动到最右的位置。
                canMove &&
                    nodeOps.insertBefore(
                        parentElm,
                        oldStartVnode.elm,
                        nodeOps.nextSibling(oldEndVnode.elm)
                    );
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } 
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                // 既然新的 vnode 是在最左边，然后你用它修补旧的最右边的 vnode，
                // 那也就是说修补后这个旧的最右边的 vnode 的元素应该移动到最左的位置。
                canMove && 
                    nodeOps.insertBefore(
                        parentElm, 
                        oldEndVnode.elm, 
                        oldStartVnode.elm
                    );
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } 
            // 四个特殊的首尾子节点没有 sameVnode 的情况
            else {
                // 还要找找有没有和中间某个节点相同的情况。
                // 没有 key 的情况下依然是通过 sameVnode 逻辑判断;
                // 有 key 的情况下先用 key 比较,命中后还要再通过 sameVnode 比较.
                // 下面判断相同是通过两种方法之一：
                //                           首选是通过比对有没有相同的 key，
                //                           其次是通过 sameVnode 方法。
                // TODO，有 key 时为什么不直接使用 sameVnode,此时的 sameVnode 也会先检测 key

                // 获得旧子节点列表的节点 key 到其 index 的映射
                // 如果没有 key 就返回空映射
                if ( isUndef(oldKeyToIdx) ) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                // 如果子节点 newStartVnode 有 key，那么通过映射查找 oldCh 里有没有同 key 子节点；
                // 如果找到就返回该旧子节点的 index；
                // 如果子节点 newStartVnode 没有 key，则通过 findIdxInOld 从 oldCh 查找有没
                // 有和 newStartVnode 符合 sameVnode 的节点，找到的话返回 index
                idxInOld = isDef(newStartVnode.key)
                    ? oldKeyToIdx[newStartVnode.key]
                    : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

                if ( isUndef(idxInOld) ) { // 如果没有在 oldCh 里找到和 newStartVnode 相同的节点
                    // 那就证明 newStartVnode 是一个新增节点
                    // 使用 newStartVnode 新增一个元素，插入到 oldStartVnode.elm 前面
                    // New element
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
                else { // 如果找到了和 newStartVnode 相同的节点
                    vnodeToMove = oldCh[idxInOld];
                    if (sameVnode(vnodeToMove, newStartVnode)) {
                        // 如果两者是 sameVnode（此时可能是 key 相同也可能都没有 key）
                        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        canMove &&
                            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                    } 
                    else {
                        // 不是 sameVnode，那就只能是 key 相同
                        // 也就是要在当前位置插入一个不同类型的元素
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
        if (oldStartIdx > oldEndIdx) { // 新节点有剩余
            // isUndef(newCh[newEndIdx + 1]) 为 true 则表示 newEndIdx 指的还是最右的一个 vnode，最右的
            // vnode 还没有插入 DOM。
            // 也就是说此时 newCh 剩余的是最后的一个或多个 vnode，那么这些节点对应的元素就应该 append 到
            // 尾部而不是 insert 到谁之前。
            // 所以把 refElm 设为 null，addVnodes 内部就是 append 的逻辑。
            // 如果 isUndef(newCh[newEndIdx + 1]) 为 false 则说明最右至少有一个 vnode 已经插入了 DOM。
            // 那现在 newCh 剩余的部分就应该 insert 到右侧已经插入的若干个元素的最左一个的左边，也就是 
            // newEndIdx + 1 指向的那个元素的左边。
            refElm = isUndef(newCh[newEndIdx + 1]) 
                        ? null 
                        : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        } 
        else if (newStartIdx > newEndIdx) { // 旧节点有剩余
            // 这里的逻辑比上面的简单，较少的 newCh 已经插入完，oldCh 两个指针中间还没比较过的就是没用的
            // 移除 oldCh 中 [oldStartIdx, oldEndIdx] 对应的的真实 DOM 节点
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }

    function checkDuplicateKeys(children) {
        const seenKeys = {};
        for (let i = 0; i < children.length; i++) {
            const vnode = children[i];
            const key = vnode.key;
            if (isDef(key)) {
                if (seenKeys[key]) {
                    warn(
                        `Duplicate keys detected: '${key}'. This may cause an update error.`,
                        vnode.context
                    );
                } else {
                    seenKeys[key] = true;
                }
            }
        }
    }

    // 从子节点列表 oldCh 查找有没有和 node 符合 sameVnode 的节点，找到的话返回 index
    function findIdxInOld(node, oldCh, start, end) {
        for (let i = start; i < end; i++) {
            const c = oldCh[i];
            if (isDef(c) && sameVnode(node, c)) {
                return i;
            }
        }
    }

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
            } else {
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
                if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
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
                nodeOps.setTextContent(elm, "");
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

    function invokeInsertHook(vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
            vnode.parent.data.pendingInsert = queue;
        } else {
            for (let i = 0; i < queue.length; ++i) {
                queue[i].data.hook.insert(queue[i]);
            }
        }
    }

    let hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    const isRenderedModule = makeMap("attrs,class,staticClass,staticStyle,key");

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
        let i;
        const { tag, data, children } = vnode;
        inVPre = inVPre || (data && data.pre);
        vnode.elm = elm;

        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
            vnode.isAsyncPlaceholder = true;
            return true;
        }
        // assert node match
        if (process.env.NODE_ENV !== "production") {
            if (!assertNodeMatch(elm, vnode, inVPre)) {
                return false;
            }
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.init))) i(vnode, true /* hydrating */);
            if (isDef((i = vnode.componentInstance))) {
                // child component. it should have hydrated its own tree.
                initComponent(vnode, insertedVnodeQueue);
                return true;
            }
        }
        if (isDef(tag)) {
            if (isDef(children)) {
                // empty element, allow client to pick up and populate children
                if (!elm.hasChildNodes()) {
                    createChildren(vnode, children, insertedVnodeQueue);
                } else {
                    // v-html and domProps: innerHTML
                    if (isDef((i = data)) && isDef((i = i.domProps)) && isDef((i = i.innerHTML))) {
                        if (i !== elm.innerHTML) {
                            /* istanbul ignore if */
                            if (
                                process.env.NODE_ENV !== "production" &&
                                typeof console !== "undefined" &&
                                !hydrationBailed
                            ) {
                                hydrationBailed = true;
                                console.warn("Parent: ", elm);
                                console.warn("server innerHTML: ", i);
                                console.warn("client innerHTML: ", elm.innerHTML);
                            }
                            return false;
                        }
                    } else {
                        // iterate and compare children lists
                        let childrenMatch = true;
                        let childNode = elm.firstChild;
                        for (let i = 0; i < children.length; i++) {
                            if (
                                !childNode ||
                                !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)
                            ) {
                                childrenMatch = false;
                                break;
                            }
                            childNode = childNode.nextSibling;
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            /* istanbul ignore if */
                            if (
                                process.env.NODE_ENV !== "production" &&
                                typeof console !== "undefined" &&
                                !hydrationBailed
                            ) {
                                hydrationBailed = true;
                                console.warn("Parent: ", elm);
                                console.warn(
                                    "Mismatching childNodes vs. VNodes: ",
                                    elm.childNodes,
                                    children
                                );
                            }
                            return false;
                        }
                    }
                }
            }
            if (isDef(data)) {
                let fullInvoke = false;
                for (const key in data) {
                    if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                    }
                }
                if (!fullInvoke && data["class"]) {
                    // ensure collecting deps for deep class bindings for future updates
                    traverse(data["class"]);
                }
            }
        } else if (elm.data !== vnode.text) {
            elm.data = vnode.text;
        }
        return true;
    }

    function assertNodeMatch(node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
            return (
                vnode.tag.indexOf("vue-component") === 0 ||
                (!isUnknownElement(vnode, inVPre) &&
                    vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase()))
            );
        } else {
            return node.nodeType === (vnode.isComment ? 8 : 3);
        }
    }

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
                        } else if (process.env.NODE_ENV !== "production") {
                            warn(
                                "The client-side rendered virtual DOM tree is not matching " +
                                    "server-rendered content. This is likely caused by incorrect " +
                                    "HTML markup, for example nesting block-level elements inside " +
                                    "<p>, or missing <tbody>. Bailing hydration and performing " +
                                    "full client-side render."
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
                        } else {
                            registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                    }
                }

                // 删除旧的 VNode 和元素
                // destroy old node
                if (isDef(parentElm)) {
                    removeVnodes(parentElm, [oldVnode], 0, 0);
                } else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode);
                }
            }
        }

        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
    };
}
