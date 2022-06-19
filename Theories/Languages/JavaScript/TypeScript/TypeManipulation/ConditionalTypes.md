# Conditional Types


<!-- TOC -->

- [Conditional Types](#conditional-types)
    - [从一个例子看起](#从一个例子看起)
    - [Conditional Type Constraints](#conditional-type-constraints)
    - [References](#references)

<!-- /TOC -->


## 从一个例子看起
1. 下面是一段的包含 overloads TS 代码
    ```js
    function process(text: string): string;
    function process(text: number): number;
    function process(text: string | number): string | number {
        throw new Error("unimplemented");
    }

    process("foo");
    process(22);
    ```
2. `process` 可以接受 `string` 类型，也可以接受 `number` 类型。但是，不能接受 `string | number` 类型
    ```ts
    declare const maybeFoo: string | number
    process(maybeFoo); // Error
    // No overload matches this call.
    //   Overload 1 of 2, '(text: string): string', gave the following error.
    //     Argument of type 'string | number' is not assignable to parameter of type 'string'.
    //       Type 'number' is not assignable to type 'string'.
    //   Overload 2 of 2, '(text: number): number', gave the following error.
    //     Argument of type 'string | number' is not assignable to parameter of type 'number'.
    //       Type 'string' is not assignable to type 'number'.
    // The call would have succeeded against this implementation, but implementation signatures of overloads are not externally visible.
    ```
3. 在实际的使用场景中，我们常常都是希望 `process` 可以接受 `string | number` 类型类型的。此时，如果不使用 conditional types，我们只能再加上第三个 overload 签名
    ```ts
    function process(text: string | number): string | number;
    ```
    或者使用泛型来解决
    ```ts
    function process<T extends string | number>(text: T): T {
        throw new Error("unimplemented");
    }
    ```
5. 这种场景下就可以使用 conditional types。我们并不是直接写明返回值的类型，而是根据 `T` 的具体情况来选择对应的返回值类型
    ```ts
    function process<T extends string | number>(text: T): (T extends string ? string : number) {
        throw new Error("unimplemented");
    }

    process("foo"); // function process<"foo">(text: "foo"): string
    process(22); // function process<22>(text: 22): number
    declare const maybeFoo: string | number
    process(maybeFoo); // function process<string | number>(text: string | number): string | number
    ```
6. TODO，这里的 `process` 实现都是内部直接抛出了错误，而没有真的返回值。如果真的有返回值，则泛型方法和 conditional types 方法都会发生错误     
    ```ts
    function process<T extends string | number>(text: T): T {
        if (typeof text === "string") {
            return ""; // Error
            // Type 'string' is not assignable to type 'T'.
            //   'string' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'string | number'.

        }
        else {
            return 0; // Error
            // Type 'number' is not assignable to type 'T'.
            //   'number' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'string | number'.
        }
    }
    ```
    ```ts
    function process<T extends string | number>(text: T): (T extends string ? string : number) {
        if (typeof text === "string") {
            return ""; // Error - Type 'string' is not assignable to type 'T extends string ? string : number'.

        }
        else {
            return 0; // Error - Type 'number' is not assignable to type 'T extends string ? string : number'.
        }
    }
    ```
    官方文档中示例函数如果返回具体的值也是会导致相同的错误。如果这样，那这个函数含有什么意义？


## Conditional Type Constraints
1. 下面的例子中定义了一个泛型类型 `MessageOf`
    ```ts
    type MessageOf<T extends { message: unknown }> = T["message"];
    
    interface Email {
        message: string;
    }
    
    type EmailMessageContents = MessageOf<Email>;
    // type EmailMessageContents = string
    ```
2. 泛型类型 `MessageOf` 的泛型参数 `T` 并不是任何类型都可以，而是被约束为 `T extends { message: unknown }`，`MessageOf` 的类型被定义为 `T` 的 `message` 属性的类型。
3. 上面的例子在实际使用泛型类型 `MessageOf` 时，传入的泛型参数为 `Email` 类型，该类型具有 `message` 属性，符合约束 `{ message: unknown }`。它的 `message` 属性是 `string`，所以类型 `EmailMessageContents` 就是 `string` 类型。
4. 但是如果我们想更灵活一点，不限制泛型类型 `MessageOf` 的参数，如果参数类型有 `message` 属性那就返回 `message` 属性类型，如果没有的话就返回 `never` 类型，那么就可以使用 conditional types
    ```ts
    type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

    interface Email {
        message: string;
    }

    interface Dog {
        bark(): void;
    }

    type EmailMessageContents = MessageOf<Email>;
    // type EmailMessageContents = string

    type DogMessageContents = MessageOf<Dog>;
    // type DogMessageContents = never
    ```
5. 下面是另一个例子：如果泛型类型 `Flatten` 的泛型参数 `T` 是数组的话，那 `Flatten` 返回的实际类型就是数组项的类型；否则就直接返回泛型参数本身的类型
    ```ts
    type Flatten<T> = T extends any[] ? T[number] : T;
    
    // Extracts out the element type.
    type Str = Flatten<string[]>;
    // type Str = string
    
    // Leaves the type alone.
    type Num = Flatten<number>;
    // type Num = number
    ```



## References
* [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* [Conditional types in TypeScript](https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/)