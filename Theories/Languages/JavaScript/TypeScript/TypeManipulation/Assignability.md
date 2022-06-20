# Assignability


<!-- TOC -->

- [Assignability](#assignability)
    - [Structural typing](#structural-typing)
    - ['top' and 'bottom' types](#top-and-bottom-types)
    - [References](#references)

<!-- /TOC -->


## Structural typing
1. 当在 TS 的类型系统中使用 `A extends B` 这样的语法时，意味着 `A` 类型的任何值都可以安全的赋值给 `B` 类型的变量。
2. In type system jargon we can say that “A is assignable to B”.
3. TS 使用 "structural typing" 来判断这种可赋值性。Structural typing 应用了 duck typing 的思想，只要两个类型有相同的结构和功能，TS 就认为它们可以互相赋值
    ```ts
    class A {}
    class B {}

    const b: B = new A() // OK
    const a: A = new B() // OK
    ```
4. 下面的两种类型就不能互相赋值
    ```ts
    class A {
        x!: string;
    }
    class B {}

    const b: B = new A() // OK
    const a: A = new B() // Error - Property 'x' is missing in type 'B' but required in type 'A'.
    ```
    `B` 的 类型要求 `A` 可以满足，但是 `A` 的 类型要求 `B` 不能满足。
5. 另一个例子
    ```ts
    interface Shape {
        color: string
    }

    class Circle {
        color!: string
        radius!: number
    }

    // ✔ All good! Circles have a color
    const shape: Shape = new Circle()

    // ✘ Type error! Not all shapes have a radius!
    const circle: Circle = shape
    ```
6. 再看 `A extends B`，因为 `A` 扩展自 `B`，所以 `A` 是 `B` 的超集，所以 `A` 类型的值可以赋值给 `B` 类型的变量。
7. 一个可以看做是例外的情况是，如果使用字面量类型，则相同的字面量类型并不能互相赋值
    ```ts
    let n: 22 = 22;
    n = 33; // Error - Type '33' is not assignable to type '22'.

    let o: {age: 22} = {age: 22};
    o = {age: 33}; // Error - Type '33' is not assignable to type '22'.
    ```
    `22` 和 `33` 的结构和功能是一样的，`{age: 22}` 和 `{age: 33}` 的结构和其上的方法也是一样的，


## 'top' and 'bottom' types
1. 在类型理论中，'top' type 是最少特殊性的类型，其他的类型都会比它有更多的属性，因此其他类型的值都可以赋值给 'top' type 变量。'top' type 类型就像一个白纸类型，其他所有类型都是在这张白纸上多少画了一些东西，都是它的超集。
2. TS 中有两个 'top' type，分别是 `any` 和 `unknown`。
3. 'bottom' type 相反，其他所有的值都不能赋值给 'bottom' type 的变量，因为 'bottom' type 拥有最多的特殊性，其他类型无法满足它的所有的属性。'bottom' type 就像是一张画满了每个点的纸，任何其他类型都没它的信息多，都是它的子集。
4. TS 中有一个 'bottom' type，`never`。


## References
* [Conditional types in TypeScript](https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/)