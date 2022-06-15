# Indexed Access Types


<!-- TOC -->

- [Indexed Access Types](#indexed-access-types)
    - [获取类型中某个属性的类型](#获取类型中某个属性的类型)
    - [获取数组元素的类型](#获取数组元素的类型)

<!-- /TOC -->


## 获取类型中某个属性的类型
1. Indexed access type 可以用来获得一个类型中某个属性的类型
    ```ts
    type Person = { age: number; name: string; alive: boolean };
    type Age = Person["age"]; // type Age = number
    ```
2. The indexing type is itself a type, so we can use unions, `keyof`, or other types entirely
    ```ts
    type Person = { age: number; name: string; alive: boolean };

    type I1 = Person["age" | "name"]; // type I1 = string | number

    type I2 = Person[keyof Person];   // type I2 = string | number | boolean

    type AliveOrName = "alive" | "name";
    type I3 = Person[AliveOrName];    // type I3 = string | boolean
    ```
3. 只能直接使用属性名字面量来索引，不能使用变量之类的
    ```ts
    type Person = { age: number; name: string; alive: boolean };

    const key = "age";
    type Age = Person[key];
    // Type 'key' cannot be used as an index type.
    // 'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?
    ```


## 获取数组元素的类型
1. 数组索引是 `number` 类型，所以可以使用下面的方式来获得数组元素的类型
    ```ts
    const MyArray = [
        { name: "Alice", age: 15 },
        { name: "Bob", age: 23 },
        { name: "Eve", age: 38 },
    ];

    type Person = typeof MyArray[number];
    // type Person = {
    //     name: string;
    //     age: number;
    // }
    ```
2. `typeof MyArray[number]` 也可以把 `number` 换位任意一个索引值
    ```ts
    type Person = typeof MyArray[0];
    // type Person = {
    //     name: string;
    //     age: number;
    // }

    // 甚至索引超出范围都可以
    type Person = typeof MyArray[99];
    ```
3. 但是并不能并不能使用 `string` 来获取对象的属性类型
    ```ts
    let obj = { name: "Alice", age: 15 };
    type t = typeof obj[string]; // Error
    // Type '{ name: string; age: number; }' has no matching index signature for type 'string'.
    ```
4. 这里数组项的类型又有两个属性，所以可以进一步的像上面那样获取其中某个属性的类型
    ```ts
    type Age = typeof MyArray[number]["age"]; // type Age = number
    // 或者
    type Age = Person["age"]; // type Age1 = number
    ```