# Typeof Type Operator

<!-- TOC -->

- [Typeof Type Operator](#typeof-type-operator)
    - [Usage](#usage)
    - [Limitations](#limitations)

<!-- /TOC -->


## Usage
1. TS 中 `typeof` 还有另一个用途，用在表示类型的环境时，它可以获得数据的类型
    ```ts
    let obj = { age: 33 };

    // JS 中的用法
    console.log(typeof obj); // “object” 

    // TS 中的用法，获得 obj 的类型
    type t = typeof obj;
    // type t = {
    //     age: number;
    // }
    ```
2. `typeof` 通常搭配其他类型操作符来使用。例如 `ReturnType` 不能直接用于值而只能用于类型，所以经常就要搭配 `typeof` 来使用
    ```ts
    function f() {
        return { x: 10, y: 3 };
    }
    type P = ReturnType<typeof f>;
    // type P = {
    //     x: number;
    //     y: number;
    // }
    ```

## Limitations
1. TypeScript intentionally limits the sorts of expressions you can use typeof on. Specifically, it’s only legal to use typeof on identifiers (i.e. variable names) or their properties. 
2. This helps avoid the confusing trap of writing code you think is executing(不懂这句话), but isn’t:
    ```ts
    let shouldContinue: typeof msgbox("Are you sure you want to continue?");
    // Parsing error: ',' expected.
    ```
    这里是想获得 `msgbox` 根据当前参数调用后的返回值，但 `typeof` 并不能用于函数调用。
3. 如果想获得函数返回值的类型，可以使用 `ReturnType`
    ```ts
    type t = ReturnType<typeof msgbox>
    ```