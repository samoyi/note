# Utility Types


<!-- TOC -->

- [Utility Types](#utility-types)
    - [`ReturnType<Type>`](#returntypetype)

<!-- /TOC -->


## `ReturnType<Type>`
Constructs a type consisting of the return type of function `Type`
```ts
type T0 = ReturnType<() => string>;
// type T0 = string

type T1 = ReturnType<(s: string) => void>;     
// type T1 = void

type T2 = ReturnType<<T>() => T>;
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
// type T3 = number[] // TODO


declare function f1(): { a: number; b: string };
// TODO f1 要怎么用？既不能用函数赋值也不能调用
type T4 = ReturnType<typeof f1>;  
// type T4 = {
//     a: number;
//     b: string;
// }

type T5 = ReturnType<any>;
// type T5 = any

type T6 = ReturnType<never>;  
// type T6 = never

type T7 = ReturnType<string>;
// type T7 = any
// Error - Type 'string' does not satisfy the constraint '(...args: any) => any'.

type T8 = ReturnType<Function>;
// type T8 = any
// Error:
// Type 'Function' does not satisfy the constraint '(...args: any) => any'.
//   Type 'Function' provides no match for the signature '(...args: any): any'.
```
