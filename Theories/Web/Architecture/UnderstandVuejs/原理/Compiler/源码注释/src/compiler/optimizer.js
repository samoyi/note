/* @flow */

// 2.5.21

/**
 * ******* 注意 *******
 * 
 * children 属性：ASTNode 的 children 属性并不是 DOM 的 children 属性。DOM 的 children 属性是只包括元素子节点；
 *               而 ASTNode 的 children 属性包括所有的节点，类似于 DOM 的 childNodes  属性。
 *               参考源码 src/compiler/parser/index.js。
 * 
 * type 属性：ASTNode 的 type 属性页不是直接使用 DOM 的 nodeType 属性。注释节点的 type 也会被算作 3，而不是 8。
 *            另外 type 为 2 时表示 Mustache 表达式。参考源码 src/compiler/parser/index.js。
 * 
 * ifConditions 属性：只有添加了 v-if 的节点才会有这个属性，v-else-if 和 v-else 都不会有；
 *                    不过这个属性是个数组，包含每个条件分支的节点。
 */


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
    // 遍历 ast，标记所有的节点是否为静态节点
    markStatic(root);

    // second pass: mark static roots.
    // 遍历 ast，标记里面的静态根节点来找出静态子树。
    // 例如下面的节点经过 markStaticRoots 遍历后
    // <div id="app">
    //     <p>
    //         <span>123</span>
    //     </p>
    //     <p>
    //         <span>{{age}}</span>
    //     </p>
    //     <p>
    //         <span>456</span>
    //     </p>
    // </div>
    // 第一个 <p> 和第三个 <p> 会被标记为静态根节点，进而以这两个 <p> 为根节点的子树就被认为是静态子树，
    // 整棵子树都会作为整体跳过重渲染时的元素重建和 patch 过程，而不需要单独的一个一个节点的跳过。
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
    // 先初步判断是否为静态节点，下面紧接着进一步的判断，可能会得出和初步判断相反的结果
    node.static = isStatic(node);

    // 只有元素节点才需要进一步判断
    if (node.type === 1) {
        
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        // 可以通过这个判断的 node 是自定义组件或者是 vue 的动态组件 component，直接 return 就是不再遍历它们的插槽内容。
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
        if (node.ifConditions) {
            for (let i = 1, l = node.ifConditions.length; i < l; i++) {
                const block = node.ifConditions[i].block;

                // 从 isStatic 的实现看起来，条件渲染中的节点都会被标记为非静态的，
                markStatic(block);

                // 因此它们的父级也只能是非静态的。
                // 这一步是多余的？node.ifConditions 为 true 的话 node 就是静态的吧？
                if (!block.static) {
                    node.static = false;
                }
            }
        }
    }
}

function markStaticRoots(node: ASTNode, isInFor: boolean) {
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

    if (node.type === 1) {
        
        // 标记 v-for 节点子元素的静态节点
        if (node.static || node.once) { // 静态节点或 v-once 节点
            // 如果是 v-for 节点的子元素，则标记
            // src/compiler/codegen/index.js 会用到，但没看出怎么用 // TODO
            node.staticInFor = isInFor;
        }

        // 静态根节点要在静态节点的基础上再要求必须要有元素子节点，即里面不能只包含文本或注释。
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

        // 如果当前节点不是静态根节点，则继续深入遍历，看看里面有没有静态子树
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for);
            }
        }

        // 如果该节点是 v-if 节点，则遍历每个条件分支的节点
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
        // Mustache 表达式
        return false;
    }
    if (node.type === 3) {
        // text
        // 文本节点和注释节点
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