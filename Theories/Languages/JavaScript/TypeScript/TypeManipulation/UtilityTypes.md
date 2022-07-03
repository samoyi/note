# Utility Types


<!-- TOC -->

- [Utility Types](#utility-types)
    - [`Partial<Type>`](#partialtype)
    - [`Required<Type>`](#requiredtype)
    - [`Readonly<Type>`](#readonlytype)
    - [`Record<Keys, Type>`](#recordkeys-type)
    - [`Pick<Type, Keys>`](#picktype-keys)
    - [`Omit<Type, Keys>`](#omittype-keys)
    - [`Exclude<UnionType, ExcludedMembers>`](#excludeuniontype-excludedmembers)
    - [`Extract<Type, Union>`](#extracttype-union)
    - [`NonNullable<Type>`](#nonnullabletype)
    - [`Parameters<Type>`](#parameterstype)
    - [`ConstructorParameters<Type>`](#constructorparameterstype)
    - [`ReturnType<Type>`](#returntypetype)

<!-- /TOC -->


## `Partial<Type>`
1. Constructs a type with all properties of `Type` set to optional. This utility will return a type that represents all subsets of a given type.
2. 也就是说时，`Partial<Type>` 会返回的类型可以表示 `Type` 的任何一个子集，包括 `Type` 自身及空集。
    ```ts
    interface Todo {
        title: string;
        description: string;
    }

    function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
        return { ...todo, ...fieldsToUpdate };
    }

    const todo1 = {
        title: "organize desk",
        description: "clear clutter",
    };

    // OK 真子集
    const todo2 = updateTodo(todo1, {
        description: "throw out trash",
    });

    // OK 自身
    const todo3 = updateTodo(todo1, {
        title: "[Completed] organize desk",
        description: "throw out trash",
    });

    // OK 空集
    const todo4 = updateTodo(todo1, {
        
    });

    // Error
    const todo5 = updateTodo(todo1, {
        description: "throw out trash",
        newProp: "new info",
    });
    // Argument of type '{ description: string; newProp: string; }' is not assignable to parameter of type 'Partial<Todo>'.
    //   Object literal may only specify known properties, and 'newProp' does not exist in type 'Partial<Todo>'.
    ```
3. 也就可以理解为 `Partial<Type>` 返回的类型是 `Type` 类型中所有属性都变成可选的一个版本。


## `Required<Type>`
与 `Partial<Type>` 相反，返回的类型是 `Type` 类型中所有属性都变成必选的一个版本
```ts
interface Props {
    a?: number;
    b?: string;
}

const obj: Props = { a: 5 }; // OK

const obj2: Required<Props> = { a: 5 }; // ERROR
// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```


## `Readonly<Type>`
1. Constructs a type with all properties of `Type` set to `readonly`, meaning the properties of the constructed type cannot be reassigned
    ```ts
    interface Todo {
        title: string;
    }

    const todo: Readonly<Todo> = {
        title: "Delete inactive users",
    };

    todo.title = "Hello";
    // Cannot assign to 'title' because it is a read-only property.
    ```
2. 如果要禁止一个对象的属性在运行时被赋值，那就可以通过这个类型操作来在编译时就禁止可能的赋值
    ```ts
    function freeze<Type>(obj: Type): Readonly<Type>;
    ```


## `Record<Keys, Type>`
1. 构造一个对象类型，该对象属性键的类型是 `Keys`，属性值的类型是 `Type`
    ```ts
    interface CatInfo {
        age: number;
        breed: string;
    }

    type CatName = "miffy" | "boris" | "mordred";

    const cats: Record<CatName, CatInfo> = {
        miffy: { age: 10, breed: "Persian" },
        boris: { age: 5, breed: "Maine Coon" },
        mordred: { age: 16, breed: "British Shorthair" },
    };
    ```


## `Pick<Type, Keys>`
1. Constructs a type by picking the set of properties `Keys` (string literal or union of string literals) from `Type`.
2. 也就是选取 `Type` 中的部分属性构造出一个类型
    ```ts
    interface Todo {
        title: string;
        description: string;
        completed: boolean;
    }

    type TodoPreview = Pick<Todo, "title" | "completed">;
    // type TodoPreview = {
    //     title: string;
    //     completed: boolean;
    // }

    const todo: TodoPreview = {
        title: "Clean room",
        completed: false,
    };
    ```


## `Omit<Type, Keys>`
和 `Pick<Type, Keys>` 互补
```ts
interface Todo {
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;
// type TodoPreview = {
//     title: string;
//     completed: boolean;
//     createdAt: number;
// }

const todo: TodoPreview = {
    title: "Clean room",
    completed: false,
    createdAt: 1615544252770,
};
```


## `Exclude<UnionType, ExcludedMembers>`
1. Constructs a type by excluding from `UnionType` all union members that are assignable to `ExcludedMembers`
```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>;  
// type T2 = string | number

// 因为 Function 不能赋值给 （) => void
type T3 = Exclude<string | number | Function, (() => void)>;  
// type T3 = string | number | Function
```


## `Extract<Type, Union>`
Constructs a type by extracting from `Type` all union members that are assignable to `Union`。和 `Exclude<UnionType, ExcludedMembers>` 相反
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;
// type T1 = () => void
```


## `NonNullable<Type>`
Constructs a type by excluding `null` and `undefined` from `Type`.
```ts
type T0 = NonNullable<string | number | undefined>;
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;  
// type T1 = string[]
```


## `Parameters<Type>`
1. 如果 `Type` 是函数类型的话，可以提取函数的参数类型作为一个元组
    ```ts
    type T0 = Parameters<() => string>;
    // type T0 = []

    type T1 = Parameters<(s: string) => void>;
    // type T1 = [s: string]

    type T2 = Parameters<<T>(arg: T) => T>;
    // type T2 = [arg: unknown] // 泛型，类型未知

    declare function f1(arg: { a: number; b: string }): void;
    type T3 = Parameters<typeof f1>;
    // type T3 = [arg: {
    //     a: number;
    //     b: string;
    // }]
    ```
2. `Type` 不是函数类型的情况
    ```ts
    type T4 = Parameters<any>;
    // type T4 = unknown[]

    type T5 = Parameters<never>;
    // type T5 = never

    type T6 = Parameters<string>; // Error
    // Type 'string' does not satisfy the constraint '(...args: any) => any'.

    type T7 = Parameters<Function>; // Error
    // Type 'Function' does not satisfy the constraint '(...args: any) => any'.
    //   Type 'Function' provides no match for the signature '(...args: any): any'.
    ```


## `ConstructorParameters<Type>`
Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type `never` if `Type` is not a function).
```ts
type T0 = ConstructorParameters<ErrorConstructor>;
// type T0 = [message?: string]

type T1 = ConstructorParameters<FunctionConstructor>;
// type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>;     
// type T2 = [pattern: string | RegExp, flags?: string]

class Foo {
    public name: string;
    public age: number;
    
    constructor (name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
type T3 = ConstructorParameters<typeof Foo>;
// type T3 = [name: string, age: number]

type T4 = ConstructorParameters<any>;
// type T4 = unknown[]
 
type T5 = ConstructorParameters<Function>; // Error
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
//   Type 'Function' provides no match for the signature 'new (...args: any): any'.
```


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
