# Compiler


<!-- TOC -->

- [Compiler](#compiler)
    - [相关信息](#相关信息)
    - [TODO](#todo)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [将模板编译为渲染函数](#将模板编译为渲染函数)
    - [实际的编译](#实际的编译)
    - [生成的渲染函数](#生成的渲染函数)
    - [References](#references)

<!-- /TOC -->


## 相关信息
* 源码版本：2.5.21


## TODO
模板编译是在 beforeMount 之前还是 mounted 之前？之前在生命周期的地方是在 beforeMount 之前
`$mount` 方法 在 `beforeMount` 钩子之前执行

* 文本节点变量替换为具体的值，具体怎么实现？
* `v-if` 具体实现？
* `v-for` 具体实现？
* `v-model` 具体实现？



## 设计思想


## 本质


## 将模板编译为渲染函数
1. [文档](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only) 中说到 Vue 的构建分为完整版本（Runtime + Compiler）和运行时版本（Runtime-only），两者的区别就是运行时版本不会进行模板编译的工作，也就是说不会把模板字符串编译为渲染函数。


## 实际的编译
1. `./编译基本流程.md` 说到真正的编译是从 `baseCompile` 开始的。
    ```js
    // src/compiler/index.js

    // `createCompilerCreator` allows creating compilers that use alternative
    // parser/optimizer/codegen, e.g the SSR optimizing compiler.
    // Here we just export a default compiler using the default parts.
    export const createCompiler = createCompilerCreator(function baseCompile(
        template: string,
        options: CompilerOptions
    ): CompiledResult {
        const ast = parse(template.trim(), options);

        // 将 AST 进行优化
        // 优化的目标：生成模板 AST，检测不需要进行 DOM 改变的静态子树。
        // 一旦检测到这些静态子树，我们就能做以下这些事情：
        //     1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
        //     2.在 patch 的过程中直接跳过。
        if (options.optimize !== false) {
            optimize(ast, options);
        }
        
        // 生成渲染函数
        // code 对象包括 render 和 staticRenderFns。
        // render 是渲染函数字符串，staticRenderFns 数组项也是函数字符串
        const code = generate(ast, options);

        return {
            ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        };
    });
    ```
2. `baseCompile` 首先会将模板 `template` 进行 `parse` 得到一个 AST，再通过 `optimize` 做一些优化，最后通过 `generate` 得到 `render` 以及 `staticRenderFns`。
3. `parse` 的实现比较复杂了，这里先不看了。[一篇带注释的源码](https://github.com/answershuto/learnVue/blob/master/vue-src/compiler/parser/index.js#L53)。
4. `optimize` 的主要作用是标记静态节点，后面当 `update` 更新界面时，会有一个 patch 的过程，diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patc h的性能。TODO
5. 至此，我们的 `template` 模板已经被转化成了我们所需的 `AST、render` 函数字符串以及 `staticRenderFns` 字符串数组。


## 生成的渲染函数
1. 以官方文档上模板编译中的 [模板](https://vuejs.org/v2/guide/render-function.html#Template-Compilation)为例
    ```html
    <div id="app">
        <header>
            <h1>I'm a template!</h1>
        </header>
        <p v-if="message">{{ message }}</p>
        <p v-else>No message.</p>
    </div>
    ```
2. 生成的 `render` 字符串格式化之后如下
    ```js
    with (this) { 
        return _c('div', 
                    { attrs: { "id": "app" } }, 
                    [
                        _m(0), 
                        _v(" "), 
                        (message) ? 
                            _c('p', [_v(_s(message))]) : 
                            _c('p', [_v("No message.")])
                    ]
                ) 
    }
    ```
3. `staticRenderFns` 有一个，字符串格式化之后如下
    ```js
    with (this) { 
        return _c('header',
                    [_c('h1',[_v("I'm a template!")])]
                )
    }
    ```
4. `_c` 就是渲染函数中的 `createElement`，其他带下划线的方法的意义可以从 `src/core/instance/render-helpers/index.js` 中找到
    ```js
    export function installRenderHelpers (target: any) {
        target._o = markOnce
        target._n = toNumber
        target._s = toString
        target._l = renderList
        target._t = renderSlot
        target._q = looseEqual
        target._i = looseIndexOf
        target._m = renderStatic
        target._f = resolveFilter
        target._k = checkKeyCodes
        target._b = bindObjectProps
        target._v = createTextVNode
        target._e = createEmptyVNode
        target._u = resolveScopedSlots
        target._g = bindObjectListeners
    }
    ```
5. 可以看到上面例子中 `render` 和 `staticRenderFns` 和 Vue 提供的渲染函数很相似。


## References
* [聊聊Vue的template编译.MarkDown](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)