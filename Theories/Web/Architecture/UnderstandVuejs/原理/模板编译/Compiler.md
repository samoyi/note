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




## References
* [聊聊Vue的template编译.MarkDown](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)
* [【Vue原理】Compile - 源码版 之 optimize 标记静态节点](https://segmentfault.com/a/1190000020028904)