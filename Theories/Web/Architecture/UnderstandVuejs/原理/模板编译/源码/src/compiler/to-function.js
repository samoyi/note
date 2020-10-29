/* @flow */

// 2.5.21

import { noop, extend } from "shared/util";
import { warn as baseWarn, tip } from "core/util/debug";

type CompiledFunctionResult = {
    render: Function,
    staticRenderFns: Array<Function>
};

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