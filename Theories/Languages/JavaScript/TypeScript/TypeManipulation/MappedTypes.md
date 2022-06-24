# Mapped Types


<!-- TOC -->

- [Mapped Types](#mapped-types)
    - [Basic](#basic)
        - [Mapping Modifiers](#mapping-modifiers)
    - [Key Remapping via `as`](#key-remapping-via-as)
        - [映射联合](#映射联合)

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
6. Mapped types 可以很好地和其他类型操作方法共同使用，下面的例子是和 conditional type 一起使用。`ExtractPII` 遍历参数类型的属性，如果某个属性的属性值有 `pii` 属性且类型为 `true`，就把该属性的类型改为 `true`，否则改为 `false`
    ```ts
    type ExtractPII<Type> = {
        [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
    };

    type DBFields = {
        id: { format: "incrementing" };
        name: { type: string; pii: true };
    };

    type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
    // type ObjectsNeedingGDPRDeletion = {
    //     id: false;
    //     name: true;
    // }
    ```

### Mapping Modifiers
1. `readonly` 和 `?` 两个修饰符可以用来 map 修改一个类型的属性是否为只读和是否为可选。
2. 在这两个修饰符前面加上 `-` 分别表示改为 非只读 和 非可选；加上 `+` 或者什么都不加分别表示改为 只读 和 可选。
3. 下面这个例子中，`CreateMutable` 这个 mapped type 通过使用 `-readonly`，可以把泛型参数类型的每个属性都变成 非只读 的
    ```ts
    // Removes 'readonly' attributes from a type's properties
    type CreateMutable<Type> = {
        -readonly [Property in keyof Type]: Type[Property];
    };

    type LockedAccount = {
        readonly id: string;
        readonly name: string;
    };

    type UnlockedAccount = CreateMutable<LockedAccount>;
    // type UnlockedAccount = {
    //     id: string;
    //     name: string;
    // }
    ```
4. 下面这个例子中，`Concrete` mapped type 通过使用 `-?`，可以把泛型参数类型的每个属性都变成 非可选 的
    ```ts
    // Removes 'optional' attributes from a type's properties
    type Concrete<Type> = {
        [Property in keyof Type]-?: Type[Property];
    };

    type MaybeUser = {
        id: string;
        name?: string;
        age?: number;
    };

    type User = Concrete<MaybeUser>;
    // type User = {
    //     id: string;
    //     name: string;
    //     age: number;
    // }
    ```


## Key Remapping via `as`
1. 前面是 map 修改属性的值，也就是属性的类型。但还可以通过 `as` 配合 [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) 来修改属性名或者删除属性。
2. 下面的例子中，`Getters` 不仅把 `Type` 的属性的类型变成了返回对应类型的函数，而且把属性名也变成了更符合语义的方法名
    ```ts
    type Getters<Type> = {
        [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
    };

    interface Person {
        name: string;
        age: number;
        location: string;
    }

    type LazyPerson = Getters<Person>;
    // type LazyPerson = {
    //     getName: () => string;
    //     getAge: () => number;
    //     getLocation: () => string;
    // }
    ```
3. 下面的例子中，`RemoveKindField` `Exclude` 掉了 `Type` 中属性名为 `kind` 的属性
    ```ts
    // Remove the 'kind' property
    type RemoveKindField<Type> = {
        [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
    };
    
    interface Circle {
        kind: "circle";
        radius: number;
    }
    
    type KindlessCircle = RemoveKindField<Circle>;        
    // type KindlessCircle = {
    //     radius: number;
    // }
    ```

### 映射联合
1. 从下面的例子看，在映射联合时，会把联合中每个类型的映射结果放进结果类型里。
2. 下面的 mapped type `EventConfig` 会把寻找参数 `Events` 类型中名为 `kind` 的属性，然后把它的属性值作为结果类型的属性名，新的属性值是一个函数，函数参数类型是 `Events` 本身，返回值是 `void` 类型
    ```ts
    type EventConfig<Events extends { kind: string }> = {
        [E in Events as E["kind"]]: (event: E) => void;
    }
    
    type SquareEvent = { kind: "square", x: number, y: number };
    type CircleEvent = { kind: "circle", radius: number };

    type Foo = EventConfig<SquareEvent>
    // type Foo = {
    //     square: (event: SquareEvent) => void;
    // }
    type Bar = EventConfig<CircleEvent>
    // type Bar = {
    //     circle: (event: CircleEvent) => void;
    // }
    ```
3. 当把 `EventConfig` 用于联合时，它把联合中每个类型映射的结果合并起来放在结果类型中
    ```ts
    type Config = EventConfig<SquareEvent | CircleEvent> 
    // ty