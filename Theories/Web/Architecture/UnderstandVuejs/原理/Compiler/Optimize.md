# Optimize

* 源码版本：2.5.21


<!-- TOC -->

- [Optimize](#optimize)
    - [优化目的](#优化目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
    - [静态节点的概念](#静态节点的概念)
    - [判断节点自身是否为静态](#判断节点自身是否为静态)
    - [`markStatic` 标记子树是否为静态](#markstatic-标记子树是否为静态)
    - [标记最大静态子树](#标记最大静态子树)
    - [优化入口](#优化入口)
    - [References](#references)

<!-- /TOC -->

## 优化目的
1. DOM 中有些节点是静态的，和数据无关的；也有些节点虽然是根据数据渲染，但之后依赖的数据不会发生变化。这样的节点都可以算是静态的，在之后都是不会发生变化的。
2. 如果能确定哪些是静态节点，那么在后序重新渲染时不需要对这些静态节点进行修改，提升渲染效率。

### 关键细节
* 怎么判断一个节点是静态的；
* 如果一个节点本身是静态的，但它的内部有非静态节点，应该怎么算；
* 重渲染是具体怎么跳过静态节点；


## 实现原理
优化器会遍历模板生成的 AST，查找其中的静态子树。一旦找到一个静态子树，就可以：
* 将它提升为常量，这样在每次重渲染时就不需要为它们创建节点。
* patch 的过程中直接跳过它。


## 抽象本质


## 设计思想
缓存


## 静态节点的概念
1. 节点本身必须是静态的，而且它的所有后代节点也要是静态。
2. 也就是说，必须是一颗静态子树的根节点。
3. 当然这个子树也可能只有它一个节点，但根据这里的定义，它只能是一个静态节点（`static` 属性)，不能是一个静态根节点（`staticRoot` 属性）。
4. 下面的 `isStatic` 不能判断一个节点是否是静态节点，因为它不会考察后代节点。而只有通过 `markStatic` 标记后才能知道是否是静态节点。


## 判断节点自身是否为静态
1. `isStatic` 判断一个节点自身是否为静态，而不考虑它的后代节点
    ```js
    // src/compiler/optimizer.js

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
    ```


## `markStatic` 标记子树是否为静态
1. `isStatic` 可以判断一个节点自身是否静态，那么以一个节点作为根节点开始，递归的调用 `isStatic` 遍历它的所有后代节点，就可以判断该子树是否为静态，并在该节点上标记结果。
2. 因为会递归的对子树中的每个节点都调用 `markStatic` 方法，所以会标记该子树的任意子子树（包括只有叶节点的子树）是否为静态子树
    ```js
    // src/compiler/optimizer.js

    // 标记节点是否为静态节点，考虑子节点
    function markStatic(node: ASTNode) {
        // 先判断节点本身是否为静态，并暂时标记结果
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
    ```


## 标记最大静态子树
1. `markStatic` 会为所有子树（所有节点）标记是否为静态，但只有这些信息还不足以进行优化，因为不可能给所有的静态子树都变为常量，因为很多静态子树都是嵌套的。
2. 所以需要找到最大的静态子树来整体常量化，而不必再考虑它内部的后代静态子树。
3. `markStaticRoots` 函数就是要找到最大静态子树的根节点
    ```js
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
    ```


## 优化入口
1. 有了上面的函数，就可以对模板的 AST 进行优化
    ```js
    // src/compiler/optimizer.js
    
    export function optimize(root: ?ASTElement, options: CompilerOptions) {
        if (!root) return;

        isStaticKey = genStaticKeysCached(options.staticKeys || "");
        isPlatformReservedTag = options.isReservedTag || no;

        // first pass: mark all non-static nodes.
        // 先标记所有节点
        markStatic(root);

        // second pass: mark static roots.
        // 在找到其中的若干个最大静态子树
        markStaticRoots(root, false);
    }
    ```


## References
* [聊聊Vue的template编译.MarkDown](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)
* [【Vue原理】Compile - 源码版 之 optimize 标记静态节点](https://segmentfault.com/a/1190000020028904)
* [Vue编译之 optimize和 code generate源码解析](https://juejin.cn/post/7016597507664773151)