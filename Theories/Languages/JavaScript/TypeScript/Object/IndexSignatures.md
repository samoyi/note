
# Index Signatures


<!-- TOC -->

- [Index Signatures](#index-signatures)
        - [一个继承的例子](#一个继承的例子)
    - [Basic](#basic)
    - [Non-existing properties](#non-existing-properties)
    - [String and number key](#string-and-number-key)
    - [Index signature vs `Record<Keys, Type>`](#index-signature-vs-recordkeys-type)
    - [References](#references)

<!-- /TOC -->





Index Signatures

3. An index signature parameter type must be `string`, `number`, `symbol`, or a template literal type
    ```ts
    export interface Foo {
        [key: boolean]: string; // Error
        // An index signature parameter type must be 'string', 'number', 'symbol', or a template literal type.
    }

    type myType = string;
    export interface Bar {
        [key: `${myType}`]: string; // Ok
    }
    ```



### 一个继承的例子
1. 因为索引签名的存在，下面的继承会导致错误
    ```ts
    export interface Foo {
        data?: {
            [key: string]: string;
        };
    }

    interface Data {
        // [key: string]: string;
        "name": string;
        // "age": number;
    }
    interface Bar extends Foo { // Error
    // Interface 'Bar' incorrectly extends interface 'Foo'.
    //   Types of property 'data' are incompatible.
    //     Type 'Data' is not assignable to type '{ [key: string]: string; }'.
    //       Index signature for type 'string' is missing in type 'Data'.
        data: Data;
    }
    ```
2. 因为 `data` 属性的索引签名要求它的所有属性必须是 `string` 类型，但声明 `Bar` 时并没有这个要求。`Data` 完全可以定义其他类型的属性，进而不遵守继承的 `Foo` 中的 `data` 的索引签名
    ```ts
    interface Data {
        "name": string;
        "age": number; // Ok
    }
    ```
3. 为了确保子类型的 `data` 不会违反 `Foo` 中 `data` 的类型，就要求子类型的 `data` 也必须实现相同的索引签名，来保证它不会添加其他类型的属性
    ```ts
    export interface Foo {
        data?: {
            [key: string]: string;
        };
    }

    interface Data {
        [key: string]: string;
        "name": string;
        "age": number; // Error
        // Property '"age"' of type 'number' is not assignable to 'string' index type 'string'.
    }
    interface Bar extends Foo { // Ok
        data: Data;
    }
    ```


## Basic
1. 有时你不能确定对象的属性名具体是什么，但你知道属性名的类型，这时可以使用索引签名来定义属性
    ```ts
    const countInfo1 = {
        a: 2,
        b: 3,
    };
    const countInfo2 = {
        a: 4,
        b: 1,
        c: 2,
    };
    const personInfo = {
        name: "33",
        age: 22,
    }

    interface CountInfo {
        [key: string]: number
    }
    function foo (countInfo: CountInfo) {

    }

    foo(countInfo1); // Ok
    foo(countInfo2); // Ok
    foo(personInfo); // Error
    // Argument of type '{ name: string; age: number; }' is not assignable to parameter of type 'CountInfo'.
    //   Property 'name' is incompatible with index signature.
    //     Type 'string' is not assignable to type 'number'.
    ```
2. 上面的例子中，`foo` 接收 `CountInfo` 类型的参数，但我们并不确定该参数必须有某些指定的属性，但我们确定的是该参数必须对象类型（索引是字符串）而且它的属性都是数值类型，所以我们通过索引签名 `[key: string]: number` 来进行约束。
3. 使用索引签名后还可以继续添加其他具体属性类型的描述
    ```ts
    const countInfo1 = {
        a: 2,
        b: 3,
        total: 5,
    };
    const countInfo2 = {
        a: 4,
        b: 1,
        c: 2,
        total: 7,
    };
    const countInfo3 = {
        a: 4,
        b: 1,
        sum: 5,
    };

    interface CountInfo {
        [key: string]: number;
        total: number; // 除了要求属性必须是数值类型，还要求要有一个名为 total 的属性
    }
    function foo (countInfo: CountInfo) {

    }

    foo(countInfo1); // Ok
    foo(countInfo2); // Ok
    foo(countInfo3); // Error
    // Argument of type '{ a: number; b: number; sum: number; }' is not assignable to parameter of type 'CountInfo'.
    //   Property 'total' is missing in type '{ a: number; b: number; sum: number; }' but required in type 'CountInfo'.
    ```
4. 添加的具体属性必须要符合索引签名的约束
    ```ts
    interface CountInfo {
        [key: string]: number;
        name: string; // Error
        // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
    }
    ```
5. 如果确实需要不同类型的属性，那就可以把索引签名声明为联合类型
    ```ts
    interface CountInfo {
        [key: string]: number | string;
        name: string; // Ok
    }
    ```
6. 索引签名也可是设为只读
    ```ts
    interface ReadonlyStringArray {
        readonly [index: number]: string;
    }

    let myArray: ReadonlyStringArray = ["a", "b", "c"];
    myArray[2] = "Mallory";
    // Index signature in type 'ReadonlyStringArray' only permits reading.
    ```


## Non-existing properties
1. 下面的例子中，因为索引签名的类型是 `string`，所以访问不存在的属性时，返回的值实际上是 `undefined`，但 TS 还是根据索引签名将其判断为 `string` 类型
    ```ts
    interface StringByString {
        [key: string]: string;
    }

    const object: StringByString = {};

    const value = object['nonExistingProp'];
    // const value: string
    ```
2. 看起来这个问题一般情况下并没有什么影响，但如果要更严格的处理，可以在索引签名的类型中包含进去 `undefined` 类型
    ```ts
    interface StringByString {
        [key: string]: string | undefined;
    }

    const object: StringByString = {};

    const value = object['nonExistingProp'];
    // const value: string | undefined
    ```


## String and number key
1. 如果 key 声明为 `number` 类型，则它既可以用于数组，也可以用于 key 为数值字符串的对象
    ```ts
    interface Foo {
        [key: number]: number;
    }

    const foo: Foo = [1, 2, 3]; // Ok
    ```
    ```ts
    interface Foo {
        [key: number]: number;
    }

    const foo: Foo = { // Ok
        "1": 1,
        "2": 2,
    };
    ```
2. 如果 key 声明为 `string` 类型，它可以用于 key 为数值的对象，因为其实对于对象来说数值 key 也会被转换为字符串类型。但是不能用于数组，数组的索引还是被认为是数值类型
    ```ts
    interface Foo {
        [key: string]: number;
    }

    const foo: Foo = { // Ok
        1: 1,
        2: 2,
    };
    ```
    ```ts
    interface Foo {
        [key: string]: number;
    }

    const foo: Foo = [1, 2, 3]; // Error
    // Type 'number[]' is not assignable to type 'Foo'.
    //   Index signature for type 'string' is missing in type 'number[]'.
    ```
3. 只要不把 key `string` 的类型用于数组就行。


## Index signature vs `Record<Keys, Type>`
TODO
https://dmitripavlutin.com/typescript-index-signatures/#4-index-signature-vs-recordkeys-type


## References
* [Index Signatures in TypeScript](https://dmitripavlutin.com/typescript-index-signatures/)