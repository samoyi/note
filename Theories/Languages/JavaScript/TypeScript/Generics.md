# Generics


<!-- TOC -->

- [Generics](#generics)
    - [泛型的用途](#泛型的用途)
    - [使用泛型变量](#使用泛型变量)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 泛型的用途
1. 假设我们实现一个函数，期望它的参数和返回值是同一种类型，但是我们有不限定具体的类型。如果不使用泛型，最多只能这样定义
    ```ts
    function identity(arg: any): any {
        return arg;
    }
    ```
2. 因为不限制类型，所以要用 `any`。但是这样的话，就不能保证参数和返回值是相同的类型。也就是说，我们希望的是 “任意的某一种类型”，而不是 “任意类型”。
3. 下面我们使用 **类型变量**（type variable），它是一种特殊的变量，只用于表示类型而不是值
    ```ts
    function identity<T>(arg: T): T {
        return arg;
    }
    ```
4. 我们给 `identity` 添加了类型变量 `T`。 `T` 帮助我们捕获用户传入的类型，然后用在参数和返回值中。现在我们可以保证参数类型与返回值类型是相同的类型 `T` 了。
5. 我们把这个版本的 `identity` 函数叫做泛型，因为它可以适用于多个类型。
6. 我们定义了泛型函数后，可以用两种方法使用。第一种是明确的给类型变量传值
    ```ts
    let output = identity<string>("myString");  // type of output will be 'string'
    ```
    第二种方法更普遍。利用了类型推论，即编译器会根据传入的参数自动地帮助我们确定 `T` 的类型
    ```ts
    let output = identity("myString");  // type of output will be 'string'
    ```

## 使用泛型变量
1. 使用泛型创建像 `identity` 这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。换句话说，你必须把这些参数当做是任意或所有类型。
2. 看下之前 `identity` 例子
    ```ts
    function identity<T>(arg: T): T {
        return arg;
    }
    ```
    如果我们想同时打印出arg的长度。 我们很可能会这样做：
    ```ts
    function loggingIdentity<T>(arg: T): T {
        console.log(arg.length);  // Error: Property 'length' does not exist on type 'T'.
        return arg;
    }
    ```
3. 因为 `T` 要兼容任何可能的类型，所以无法保证在所有可能的类型都存在 `length` 属性。
4. 现在假设我们想操作 `T` 类型的数组而不是直接的 `T` 类型值，那我们可以使用 `T` 来定义数组类型
    ```ts
    function loggingIdentity<T>(arg: T[]): T[] {
        console.log(arg.length);
        return arg;
    }
    ```
5. 也就是说，类型变量并不是只能直接用于参数和返回值，它可以按照需求随意的使用。
    

## TODO
泛型类型
泛型类
泛型约束


## References
* [中文文档](https://www.tslang.cn/docs/handbook/functions.html)