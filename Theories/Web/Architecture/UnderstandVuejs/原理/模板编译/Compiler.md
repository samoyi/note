# Compiler


<!-- TOC -->

- [Compiler](#compiler)
    - [相关信息](#相关信息)
    - [TODO](#todo)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [将模板编译为渲染函数](#将模板编译为渲染函数)
    - [`compileToFunctions`](#compiletofunctions)
    - [实际的编译](#实际的编译)
    - [生成的渲染函数](#生成的渲染函数)
    - [optimize](#optimize)
        - [标记静态节点和静态子树](#标记静态节点和静态子树)
        - [`markStatic` 遍历标记静态节点](#markstatic-遍历标记静态节点)
        - [`markStaticRoots` 遍历标记静态子树](#markstaticroots-遍历标记静态子树)
        - [判断静态节点](#判断静态节点)
    - [References](#references)

<!-- /TOC -->


## 相关信息
* 源码版本：2.5.21



## TODO
模板编译是在 beforeMount 之前还是 mounted 之前？之前在生命周期的地方是在 beforeMount 之前
`$mount` 方法 在 `beforeMount` 钩子之前执行


## 设计思想


## 本质


## 将模板编译为渲染函数
1. [文档](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only) 中说到 Vue 的构建分为完整版本（Runtime + Compiler）和运行时版本（Runtime-only），两者的区别就是运行时版本不会进行模板编译的工作，也就是说不会把模板字符串编译为渲染函数。
2. 负责模板编译工作的 Compiler，是从下面的方法开始的
  ```js
  // src/platforms/web/entry-runtime-with-compiler.js
  
  // 把原本不带编译的 $mount 方法保存下来，在最后会调用
  const mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function(
      el?: string | Element,
      hydrating?: boolean
  ): Component {
      // 获取实例要挂载到的 DOM 节点
      el = el && query(el);
      
      /* istanbul ignore if */
      // 不能挂载到 html 和 body 上
      if (el === document.body || el === document.documentElement) {
          process.env.NODE_ENV !== "production" &&
              warn(
                  `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
              );
          return this;
      }

      // 获取 vue 实例 options
      const options = this.$options;

      // resolve template/el and convert to render function
      // 如果没有主动使用渲染函数，则转换为渲染函数
      if (!options.render) { 
          let template = options.template;

          // 下面会获取到模板的字符串
          if (template) { // 使用 template 属性来编写组件模板
              if (typeof template === "string") {
                  if (template.charAt(0) === "#") {
                      // TODO template 什么时候会是节点 id？
                      template = idToTemplate(template);
                      /* istanbul ignore if */
                      if (process.env.NODE_ENV !== "production" && !template) {
                          warn(
                              `Template element not found or is empty: ${options.template}`,
                              this
                          );
                      }
                  }
              } 
              // TODO template 什么时候会是 DOM 节点？
              else if (template.nodeType) {
                  template = template.innerHTML;
              } 
              else {
                  if (process.env.NODE_ENV !== "production") {
                      warn("invalid template option:" + template, this);
                  }
                  return this;
              }
          } 
          else if (el) { // 通过 el 属性直接指定已存在与 DOM 的节点挂载
              // getOuterHTML 把实际的 DOM 节点转换为模板字符串
              template = getOuterHTML(el);
          }

          if (template) {
              /* istanbul ignore if */
              if (
                  process.env.NODE_ENV !== "production" &&
                  config.performance &&
                  mark
              ) {
                  mark("compile");
              }

              // 编译成渲染函数
              const { render, staticRenderFns } = compileToFunctions(
                  template,
                  {
                      shouldDecodeNewlines,
                      shouldDecodeNewlinesForHref,
                      delimiters: options.delimiters,
                      comments: options.comments
                  },
                  this
              );

              // 最终还是转换为渲染函数模式，
              options.render = render;
              options.staticRenderFns = staticRenderFns;

              /* istanbul ignore if */
              if (
                  process.env.NODE_ENV !== "production" &&
                  config.performance &&
                  mark
              ) {
                  mark("compile end");
                  measure(`vue ${this._name} compile`, "compile", "compile end");
              }
          }
      }
      
      return mount.call(this, el, hydrating);
  };
  ```
3. 可以看出来，即使是使用模板语法，之后也会被转为渲染函数的方式。
  

## `compileToFunctions`
1. 可以看到，上面把模板编译为渲染函数的任务，是交给 `compileToFunctions` 的。该函数源码如下
    ```js
    // src/compiler/to-function.js

    function createFunction(code, errors) {
        try {
            return new Function(code);
        } catch (err) {
            errors.push({ err, code });
            return noop;
        }
    }

    export function createCompileToFunctionFn(compile: Function): Function {
        const cache = Object.create(null); // 编译结果缓存

        return function compileToFunctions(
            template: string,
            options?: CompilerOptions,
            vm?: Component
        ): CompiledFunctionResult {
            options = extend({}, options);
            const warn = options.warn || baseWarn;
            delete options.warn;

            /* istanbul ignore if */
            if (process.env.NODE_ENV !== "production") {
                // detect possible CSP restriction
                try {
                    new Function("return 1");
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn(
                            "It seems you are using the standalone build of Vue.js in an " +
                                "environment with Content Security Policy that prohibits unsafe-eval. " +
                                "The template compiler cannot work in this environment. Consider " +
                                "relaxing the policy to allow unsafe-eval or pre-compiling your " +
                                "templates into render functions."
                        );
                    }
                }
            }

            // check cache
            const key = options.delimiters
                ? String(options.delimiters) + template
                : template;
            if (cache[key]) {
                return cache[key];
            }

            // compile
            // 实际的模板编译
            // compile 的实现在 src/compiler/create-compiler.js
            // compiled 是一个对象，包括编译出的抽象语法树、渲染函数字符串、staticRenderFns 以及错误和提示信息。
            // 以如下代码为例
            // <template>
            //   <div id="app">app</div>
            // </template>
            // <script>
            //   new Vue({
            //       el: '#app',
            //   });
            // </script>
            // 返回的 compiled 如下
            // {
            //     ast: {type: 1, tag: "div", attrsList: Array(1), attrsMap: {…}, parent: undefined, …},
            //     errors: [],
            //     render: "with(this){return _c('div',{attrs:{"id":"app"}},[_v("app")])}",
            //     staticRenderFns: [],
            //     tips: []
            // }
            const compiled = compile(template, options);
        
            // check compilation errors/tips
            if (process.env.NODE_ENV !== "production") {
                if (compiled.errors && compiled.errors.length) {
                    warn(
                        `Error compiling template:\n\n${template}\n\n` +
                            compiled.errors.map(e => `- ${e}`).join("\n") +
                            "\n",
                        vm
                    );
                }
                if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(msg => tip(msg, vm));
                }
            }

            // turn code into functions
            const res = {};
            const fnGenErrors = [];

            // 把渲染函数字符串转换为实际的渲染函数
            res.render = createFunction(compiled.render, fnGenErrors);
            res.staticRenderFns = compiled.staticRenderFns.map(code => {
                return createFunction(code, fnGenErrors);
            });

            // check function generation errors.
            // this should only happen if there is a bug in the compiler itself.
            // mostly for codegen development use
            /* istanbul ignore if */
            if (process.env.NODE_ENV !== "production") {
                if (
                    (!compiled.errors || !compiled.errors.length) &&
                    fnGenErrors.length
                ) {
                    warn(
                        `Failed to generate render function:\n\n` +
                            fnGenErrors
                                .map(
                                    ({ err, code }) =>
                                        `${err.toString()} in\n\n${code}\n`
                                )
                                .join("\n"),
                        vm
                    );
                }
            }

            return (cache[key] = res);
        };
    }
    ```
2. 可以看到，`compileToFunctions` 里面仍然不执行实际的编译，而是交给 `compile` 函数。但实际上，`compile` 仍然不会进行具体的编译，而是在内部调用 `baseCompile` 进行编译
    ```js
    // src/compiler/create-compiler.js
    
    export function createCompilerCreator(baseCompile: Function): Function {
        return function createCompiler(baseOptions: CompilerOptions) {
            function compile(
                template: string,
                options?: CompilerOptions
            ): CompiledResult {
                const finalOptions = Object.create(baseOptions);
                const errors = [];
                const tips = [];
                finalOptions.warn = (msg, tip) => {
                    (tip ? tips : errors).push(msg);
                };
                
                if (options) {
                    // merge custom modules
                    if (options.modules) {
                        finalOptions.modules = (baseOptions.modules || []).concat(
                            options.modules
                        );
                    }
                    // merge custom directives
                    if (options.directives) {
                        finalOptions.directives = extend(
                            Object.create(baseOptions.directives || null),
                            options.directives
                        );
                    }
                    // copy other options
                    for (const key in options) {
                        if (key !== "modules" && key !== "directives") {
                            finalOptions[key] = options[key];
                        }
                    }
                }

                // compile 调用 baseCompile 进行编译
                const compiled = baseCompile(template, finalOptions);
                if (process.env.NODE_ENV !== "production") {
                    errors.push.apply(errors, detectErrors(compiled.ast));
                }
                compiled.errors = errors;
                compiled.tips = tips;
                return compiled;
            }

            return {
                compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            };
        };
    }
    ```


## 实际的编译
1. `createCompilerCreator` 接受 `baseCompile` 函数作为参数。`baseCompile` 源码为
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
        // 一旦检测到这些静态树，我们就能做以下这些事情：
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
1. 以官方文档上模板编译中的[模板](https://vuejs.org/v2/guide/render-function.html#Template-Compilation)为例
    ```html
    <div id="app">
        <header>
            <h1>I'm a template!</h1>
        </header>
        <p v-if="message">{{ message }}</p>
        <p v-else>No message.</p>
    </div>
    ```
2. 生成的渲染函数字符串为
    ```js
    with(this){return _c('div',{attrs:{"id":"app"}},[_m(0),_v(" "),(message)?_c('p',[_v(_s(message))]):_c('p',[_v("No message.")])])}
    ```
3. 静态渲染函数有一个，字符串为
    ```js
    with(this){return _c('header',[_c('h1',[_v("I'm a template!")])])}
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


## optimize
1. 有些节点是静态的、和数据无关的，也有些节点虽然是根据数据渲染后，但之后依赖的数据不会发生变化的。这样的节点在之后都是不会发生变化的。
2. 优化器会遍历模板生成的 AST，查找其中的静态子树。一旦找到一个静态子树，就可以：
    * 将它提升为常量，这样在每次重渲染时就不需要为它们创建节点。
    * patch 的过程中直接跳过它。
3. 详细的注释在源码文件中：`src/compiler/optimizer.js`

### 标记静态节点和静态子树
1. 遍历 AST，然后找到其中的静态节点；然后再确定这些静态节点组成的静态子树，静态优化的时候直接以静态子树为整体进行优化。
2. 遍历标记的函数如下
    ```js
    // src/compiler/optimizer.js
    
    export function optimize(root: ?ASTElement, options: CompilerOptions) {
        if (!root) return;

        isStaticKey = genStaticKeysCached(options.staticKeys || "");
        isPlatformReservedTag = options.isReservedTag || no;

        // first pass: mark all non-static nodes.
        markStatic(root);

        // second pass: mark static roots.
        markStaticRoots(root, false);
    }
    ```

### `markStatic` 遍历标记静态节点
```js
// src/compiler/optimizer.js

function markStatic(node: ASTNode) {
    // 先初步判断是否为静态节点，下面紧接着进一步的判断，可能会得出和初步判断相反的结果
    node.static = isStatic(node);

    if (node.type === 1) {
        // do not make component slot content static. this avoids
        // 1. components not able to mutate slot nodes
        // 2. static slot content fails for hot-reloading
        // 可以通过这个判断的 node 是自定义组件或者是 vue 的动态组件 component，直接 return 就是不再遍历它们的插槽内容。
        // 因此插槽里面的节点内容不会检查是否静态，也就是默认为非静态。
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

                // 条件渲染中的节点都会被标记为非静态的，
                markStatic(block);

                // 因此它们的父级也只能是非静态的。
                if (!block.static) {
                    node.static = false;
                }
            }
        }
    }
}
```

### `markStaticRoots` 遍历标记静态子树
1. 这里会遍历整个树，如果找到了一个节点是静态根节点，则会直接 return，不再遍历它的子节点。
2. 也就是说，对于一个静态子树，只有该子树整体的根节点才会是静态根节点，它内部再有更小的子树，这些更小子树的根节点也不会被标记为静态根节点。例如下面的模板中
    ```html
    <section id="app">
        <p>{{ message }}</p>
        <div>
            <ul>
                <li>1</li>
                <li>2</li>
            </ul>
        </div>
    </section>
    ```
    只有 `div` 会被标记为静态根节点，而 `ul` 就不会被标记
3. 源码
    ```js    
    // src/compiler/optimizer.js

    function markStaticRoots(node: ASTNode, isInFor: boolean) {
    
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
            if (
                node.static &&
                node.children.length &&
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
    ```

### 判断静态节点
`isStatic` 判断一个节点是否为静态节点
```js
// src/compiler/optimizer.js

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
        !node.hasBindings // no dynamic bindings。hasBindings 为 true 表示有 v-if 以外的 vue 指令
            && !node.if
            && !node.for // not v-if or v-for or v-else
            && !isBuiltInTag(node.tag) // not a built-in。tag 不能是 "slot" 或者 "component"
            && isPlatformReservedTag(node.tag) // not a component。必须是当前平台环境自身的 tag
            && !isDirectChildOfTemplateFor(node) // 下述
            // ast 的所有 key 都必须是静态 key，即 genStaticKeys 返回的 key
            && Object.keys(node).every(isStaticKey)
        )
    );
}
```


## References
* [聊聊Vue的template编译.MarkDown](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)
* [【Vue原理】Compile - 源码版 之 optimize 标记静态节点](https://segmentfault.com/a/1190000020028904)