/* @flow */

// 2.5.21

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref
} from "./util/compat";

const idToTemplate = cached(id => {
    const el = query(id);
    return el && el.innerHTML;
});


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
            // compileToFunctions 的实现在 src/compiler/to-function.js 中
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

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
    if (el.outerHTML) {
        return el.outerHTML;
    } else {
        const container = document.createElement("div");
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

Vue.compile = compileToFunctions;

export default Vue;
