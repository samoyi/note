# Mapped Types


<!-- TOC -->

- [Mapped Types](#mapped-types)
    - [Basic](#basic)

<!-- /TOC -->


## Basic
1. Mapped Types 类型可以对一个类型的属性进行遍历，然后操作每个属性的类型，返回一个新的类型。
2. Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time. 
3. 下面例子中的 mapped type `OnlyBoolsAndNumber` 会让之后创建的这个类型的实例的每个属性都是 `boolean | number` 类型
    ```ts
    // 
    type OnlyBoolsAndNumber = {
        [key: string]: boolean | number;
    };

    const conforms: OnlyBoolsAndNumber = {
        del: true,
        rodney: false,
        foo: 22,
        bar: "hehe" // Error - Type 'string' is not assignable to type 'number | boolean'.
    };
    ```
4. A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a `keyof`) to iterate through keys to create a type. 看起来这里的意思就是遍历泛型参数类型，然后操作参数类型的每个属性的类型，然后返回一个整体经过映射的新类型。
5. 下面的 mapped type `OptionsFlags` 接收泛型参数 `Type`，遍历它的每个属性，将属性的类型设置为 `boolean`，然后返回从 `Type` 映射修改后的新类型
    ```ts
    type OptionsFlags<Type> = {
        [Property in keyof Type]: boolean;
    };

    type FeatureFlags = {
        darkMode: () => void;
        newUserProfile: () => void;
    };

    type FeatureOptions = OptionsFlags<FeatureFlags>;
    //  type FeatureOptions = {
    //     darkMode: boolean;
    //     newUserProfile: boolean;
    // }
    ```
    `FeatureFlags` 属性本来的类型是 `() => void`，经过 `OptionsFlags` 的映射后变成了 `boolean`。