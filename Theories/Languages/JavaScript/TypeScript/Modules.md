
# Modules


## Non-modules
1. Before we start, it’s important to understand what TypeScript considers a module. 
2. The JavaScript specification declares that any JavaScript files without an `export` or top-level `await` should be considered a script and not a module.
3. If you have a file that doesn’t currently have any imports or exports, but you want to be treated as a module, add the l ine:
    ```ts
    export {};
    ```

## ES Module Syntax
1. TS 针对 ES 模块语法的 `import` 做了一个小扩展，可以通过 `type` 关键字来说明引入的是类型，而非一般值。这可以用来告知类似于 Bable 这样的非 TS 转译器那些 import 可以被安全的移除。
2. 可以在单独引入类型时使用
    ```ts
    // @filename: animal.ts
    export type Cat = { breed: string; yearOfBirth: number };
    export type Dog = { breeds: string[]; yearOfBirth: number };
    export const createCatName = () => "fluffy";
    ```
    ```ts
    // @filename: valid.ts
    import type { Cat, Dog } from "./animal.js";
    ```
3. 也可以在混合引入类型和一般值时使用
    ```ts
    import { createCatName, type Cat, type Dog } from "./animal.js";
    ```