# Declaration Files


## 用途
1. 在一个 TypeScript 项目中，自己编写的 `.ts` 模块在编译时默认不会生成类型声明文件，生成的 `.js` 模块里即使已经丢失了类型信息，也是可以正常运行的。因为 TypeScript 知道这些 `.js` 模块是从本项目的 `.ts` 模块编译而来的，所以可以确
定它们已经经过了类型检查。
2. 但是如果编译生成的 `.js` 模块要被其他 TypeScript 项目使用时，这个项目并不知道这些 `.js` 模块的类型信息，所以就需要类型声明文件（`.d.ts`）来提供类型信息。
3. 例如下面的 `.ts` 代码
    ```ts
    export function add(a: number, b: number): number {
        return a + b;
    }
    ```
    编译生成的 `.js` 代码是
    ```js
    export function add(a, b) {
        return a + b;
    }
    ```
    丢失了类型信息。如果要让其他 TypeScript 项目使用这个 `add` 函数，就需要一个对应的类型声明文件 `index.d.ts`，内容如下
    ```ts
    export declare function add(a: number, b: number): number;
    ``` 
4. 这也就是在使用第三方库时，为什么有些库需要额外安装 `@types/xxx` 包的原因，因为这些库发布的并不是 `.ts` 源码，而是经过编译后的已经丢失类型信息的 `.js` 模块。


## 为自己项目的 `.ts` 模块生成类型声明文件
1. 在 `tsconfig.json` 里设置 `"declaration": true`，然后重新编译项目，就会在输出目录生成对应的 `.d.ts` 类型声明文件。
2. 还可以设置 `"declarationMap": true` 来生成类型声明文件的映射文件，方便调试时定位到源代码的位置。