/* @flow */

// 2.5.21

import { makeMap, isBuiltInTag, cached, no } from "shared/util";

let isStaticKey;
let isPlatformReservedTag;

// TODO
const genStaticKeysCached = cached(genStaticKeys); 

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
export function optimize(root: ?ASTElement, options: CompilerOptions) {
    // root 是需要遍历并查找其静态子树的抽象语法树
    if (!root) return;

    // TODO
    isStaticKey = genStaticKeysCached(options.staticKeys || "");

    // isReservedTag 函数判断一个标签是否是平台环境自身的 tag。对于 web 环境，包括 html 标签和 svg 标签。
    // isReservedTag 的实现在 src/platforms/web/util/element.js
    isPlatformReservedTag = options.isReservedTag || no;

    // first pass: mark all non-static nodes.
    // 标记是否为静态节点
    markStatic(root);

    // second pass: mark static roots.
    markStaticRoots(root, false);
}

// 静态 key
// 如果节点添加了 vue 指令，ast 就会有非静态的 key
// 比如添加了 v-if 指令，就会有 if 和 ifConditions 这两个 key
function genStaticKeys(keys: string): Function {
    return makeMap(
        "type,tag,attrsList,attrsMap,plain,parent,children,attrs" +
            (keys ? "," + keys : "")
    );
}

// 标记节点是否为静态节点
function markStatic(node: ASTNode) {
    node.static = isStatic(node);
    if (node.type === 1) {
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        // TODO
        if (
            !isPlatformReservedTag(node.tag) &&
            node.tag !== "slot" &&
            node.attrsMap["inline-template"] == null
        ) {
            return;
        }

        // 遍历标记子节点
        for (let i = 0, l = node.children.length; i < l; i++) {
            const child = node.children[i];
            markStatic(child);
            
            // 如果一个节点的子节点不是静态的，那这个节点也不能是静态的
            if (!child.static) {
                node.static = false;
            }
        }

        // 一组条件渲染的节点
        if (node.ifConditions) {
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                const block = node.ifConditions[i].block;
                // 从 isStatic 的实现看起来，条件渲染中的节点都会被标记为非静态的，
                markStatic(block);
                // 因此它们的父级也只能是非静态的。
                if (!block.static) {
                    node.static = false;
                }
            }
        }
    }
}

function markStaticRoots(node: ASTNode, isInFor: boolean) {
    if (node.type === 1) {
        // 静态节点或 v-once 节点
        if (node.static || node.once) {
            node.staticInFor = isInFor; // TODO
        }
        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        if (
            node.static &&
            node.children.length &&
            !(node.children.length === 1 && node.children[0].type === 3)
        ) {
            node.staticRoot = true;
            return;
        } else {
            node.staticRoot = false;
        }
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for);
            }
        }
        if (node.ifConditions) {
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                markStaticRoots(node.ifConditions[i].block, isInFor);
            }
        }
    }
}

function isStatic(node: ASTNode): boolean {
    if (node.type === 2) {
        // expression
        return false;
    }
    if (node.type === 3) {
        // text
        return true;
    }
    return !!(
        node.pre // v-pre 节点
        || (
          // hasBindings 指示节点是否绑定了 vue 指令，但不包括 v-if 指令
          // hasBindings 的设置在 src/compiler/parser/index.js 中的 processAttrs 函数
          !node.hasBindings // no dynamic bindings
            && !node.if
            && !node.for // not v-if or v-for or v-else
                // tag 不能是 "slot" 或者 "component"，因为这两个节点肯定是动态编译的。
                // isBuiltInTag 的实现在 src/shared/util.js。
            && !isBuiltInTag(node.tag) // not a built-in
                // 必须是当前平台环境自身的 tag，而不能是自定义组件的 tag。
            && isPlatformReservedTag(node.tag) // not a component
            && !isDirectChildOfTemplateFor(node) // TODO
            // ast 的所有 key 都必须是静态 key
            && Object.keys(node).every(isStaticKey)
        )
    );
}

// TODO
function isDirectChildOfTemplateFor(node: ASTElement): boolean {
    while (node.parent) {
        node = node.parent;
        if (node.tag !== "template") {
            return false;
        }
        if (node.for) {
            return true;
        }
    }
    return false;
}