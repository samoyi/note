/* @flow */

// 2.5.21

/**
 * ******* 注意 *******
 * 
 * children 属性：ASTNode 的 children 属性并不是 DOM 的 children 属性。DOM 的 children 属性是只包括元*               素子节点；而 ASTNode 的 children 属性包括所有的节点，类似于 DOM 的 childNodes 属性。
 *               参考源码 src/compiler/parser/index.js。
 * 
 * type 属性：ASTNode 的 type 属性也不是直接使用 DOM 的 nodeType 属性。注释节点的 type 也会被算作 3，而*            不是 8。另外 type 为 2 时表示 Mustache 表达式。参考源码 src/compiler/parser/index.js。
 * 
 * ifConditions 属性：只有添加了 v-if 的节点才会有这个属性，v-else-if 和 v-else 都不会有；
 *                    不过这个属性是个数组，包含每个条件分支的节点。
 */


import { makeMap, isBuiltInTag, cached, no } from "shared/util";

let isStaticKey;
let isPlatformReservedTag;

// 生成 genStaticKeys 的带缓存版本
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
/**
 *  优化目标：编译 parse 得到的 AST，检测里面的纯静态子树，也就是不会变化的 DOM 子树。
 *  在检测到一个静态子树后：
 *      * 将它提升为常量，这样在每次重渲染时就不需要为它们创建节点。
 *      * patch 的过程中直接跳过它。
 */
export function optimize(root: ?ASTElement, options: CompilerOptions) {
    // root 是需要遍历并查找其静态子树的抽象语法树
    if (!root) return;

    // `isStaticKey` 是下面 `makeMap` 返回的函数，用来确定一个 key 是否是静态 key
    isStaticKey = genStaticKeysCached(options.staticKeys || "");

    // `isReservedTag` 函数判断一个标签是否是平台环境自身的 tag。对于 web 环境，包括 html 标签和 svg 标签。
    // `isReservedTag` 的实现在 /src/platforms/web/util/element.js
    // `|| no` 保证 `isPlatformReservedTag` 返回的一定是布尔值 false 而非其他的 falsy 值
    isPlatformReservedTag = options.isReservedTag || no;

    // first pass: mark all non-static nodes.
    // 先标记所有节点
    markStatic(root);

    // second pass: mark static roots.
    // 在找到其中的若干个最大静态子树
    markStaticRoots(root, false);
}

// 生成静态 key
// 静态 key 包括下面写死的几个还有通过参数 keys 传入的若干个
// 测试在默认情况下，keys 值为 "staticClass,staticStyle"
// genStaticKeys 的返回值是 makeMap 返回的函数，这个函数用来确定一个 key 是否在 makeMap 的参数列表中
function genStaticKeys(keys: string): Function {
    return makeMap(
        "type,tag,attrsList,attrsMap,plain,parent,children,attrs" +
            (keys ? "," + keys : "")
    );
}

// 为以 node 为根的子树是否为静态子树
// 因为会递归的对子树中的每个节点都调用 `markStatic` 方法，所以会标记该子树的任意子子树（包括只有叶节点的子树）是否为静态子树
function markStatic(node: ASTNode) {
    // 先判断节点本身是否为静态
    node.static = isStatic(node);

    // node.type === 1 的 node 类型为 ASTElement
    if (node.type === 1) {
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        // 可以通过下面这个判断的 node 是自定义组件或者是 vue 的动态组件 component，直接 return 就是不再遍历它们的插槽内容。
        // 因此插槽里面的节点内容不会检查是否静态，也就是默认为非静态。
        if (
            !isPlatformReservedTag(node.tag) &&
            node.tag !== "slot" &&
            node.attrsMap["inline-template"] == null // TODO  为什么 inline-template 可以是静态的？
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
        // node 是有 v-if 指令的那个 ASTNode，node.ifConditions 则包括有 v-if、v-else-if 以及 v-else 的 ASTNode
        if (node.ifConditions) {
            // 从 1 开始遍历，所以会遍历 v-else-if 和 v-else 的 ASTNode
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                const block = node.ifConditions[i].block; // block 就是 ASTNode 

                markStatic(block);

                // 如果 v-else 或 v-else-if 不是静态的，则 v-if 的 ASTNode 也不能算是静态的
                if (!block.static) {
                    node.static = false;
                }
            }
        }
    }
}

// 标记静态根节点——标记最大静态子树
// 这里会遍历整个树，如果找到了一个节点是静态根节点，则会直接 return，不再遍历它的子节点；
// 也就是说，对于一个静态子树，只有该子树整体的根节点才会是静态根节点，
// 它内部再有更小的子树，这些更小子树的根节点也不会被标记为静态根节点
// 例如下面的模板中
// <section id="app">
//     <p>{{ message }}</p>
//     <div>
//         <ul>
//             <li>1</li>
//             <li>2</li>
//         </ul>
//     </div>
// </section>
// 只有 div 会被标记为静态根节点，而 ul 就不会被标记
// 静态根节点与静态节点的区别是，静态根节点必须要有子节点，而不能只包含静态文本或注释
// 递归的逻辑和 markStatic 一样
function markStaticRoots(node: ASTNode, isInFor: boolean) {
    if (node.type === 1) {
        
        // 标记 v-for 节点子元素的静态节点
        if (node.static || node.once) { // 静态节点或 v-once 节点
            // 如果是 v-for 节点的子元素，则标记
            // /src/compiler/codegen/index.js 会用到，但没看出怎么用 // TODO
            node.staticInFor = isInFor;
        }

        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        // 对于这里提到的权衡，这篇文章做了推测性的分析 https://segmentfault.com/a/1190000020028904
        if (
            node.static && // 本身必须是静态节点
            node.children.length && // 必须有子节点
            // 子节点不能是文本节点。括号里的条件是：只有一个子节点并且是文本或注释。
            !(node.children.length === 1 && node.children[0].type === 3)
        ) {
            node.staticRoot = true;
            return;
        } 
        else {
            node.staticRoot = false;
        }

        // 如果当前节点不是静态根节点，则递归遍历后代节点
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for);
            }
        }

        // 如果该节点是 v-if 节点，则遍历其他条件分支的节点
        // 因为 v-else-if 和 v-else 节点不会出现在父节点的 children 中
        if (node.ifConditions) {
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                markStaticRoots(node.ifConditions[i].block, isInFor);
            }
        }
    }
}

// 判断一个节点本身是否为静态，不考虑子节点
function isStatic(node: ASTNode): boolean {
    if (node.type === 2) {
        // Mustache 表达式
        return false;
    }
    if (node.type === 3) {
        // 文本节点（包括注释节点）
        return true;
    }
    return !!(
        node.pre // v-pre 节点
        || (
          // hasBindings 指示节点是否绑定了 vue 指令，判断的正则表达式如下 /^v-|^@|^:/
          // hasBindings 的设置在 /src/compiler/parser/index.js 中的 processAttrs 函数
          // 但是这里不会判断 v-if 和 v-for 指令，因为这两个都是是否渲染级别的指令
          !node.hasBindings // no dynamic bindings
            && !node.if // TODO 为什么不包括 v-else 和 v-else-if
            && !node.for // not v-if or v-for or v-else
            // tag 不能是 "slot" 或者 "component"，因为这两个节点肯定是动态编译的。
            // isBuiltInTag 的实现在 /src/shared/util.js。
            && !isBuiltInTag(node.tag) // not a built-in
            // 必须是当前平台环境自身的 tag，而不能是自定义组件的 tag。
            && isPlatformReservedTag(node.tag) // not a component
            && !isDirectChildOfTemplateFor(node) // TODO
            // ast 的所有 key 都必须是静态 key
            && Object.keys(node).every(isStaticKey)
        )
    );
}


// 父节点不是 template，返回 false
// 父节点如果是 template，如果它加了 v-for，返回 true
// 父节点如果是 template 但是没有加 v-for，则再以相同规则查看它的父节点
// 如果直到最外层也没有根据上面的规则返回，则返回 false
// 
// 从起始节点逐级访问父节点，尝试找到一个作为终点节点的带 v-for 的 template。
// 如果没找到则返回 false。
// 如果找到了，还要看起始节点和终点节点之间如果还有节点的话，必须都是 template 才会返回 true，否则还是返回 false。
// 类似于如下的两个节点结构会返回 true
// 
// <template v-for="end">
//     <span id="start"></span>
// </template>
// 
// <div>
//     <template v-for="end">
//         <template>
//             <template>
//                 <span id="start"></span>
//             </template>
//         </template>
//     </template>
// </div>
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