/* @flow */

// 2.5.21

import { parse } from "./parser/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
    template: string,
    options: CompilerOptions
): CompiledResult {
    const ast = parse(template.trim(), options);

    // 将AST进行优化
    // 优化的目标：生成模板 AST，检测不需要进行 DOM 改变的静态子树。
    // 一旦检测到这些静态树，我们就能做以下这些事情：
    //     1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
    //     2.在patch的过程中直接跳过。
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
