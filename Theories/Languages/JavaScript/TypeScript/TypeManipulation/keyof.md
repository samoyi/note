# Keyof Type Operator

<!-- TOC -->

- [Usage](#usage)
- [是否包含不可遍历属性](#是否包含不可遍历属性)
- [References](#references)

<!-- /TOC -->


## Usage
1. The `keyof` operator takes an object type and produces a string or numeric literal union of its keys. 
2. The following type `P` is the same type as `“x” | “y”`:
    ```ts
    type Point = { x: number; y: number };
    type P = keyof Point;
    let p1:P = "x"; // OK
    let p2:P = "y"; // OK
    let p3:P = "z"; // Error - Type '"z"' is not assignable to type 'keyof Point'.
    ```
3. 结合 `typeof` 可以获取一个对象的 key 的字面量属性
    ```ts
    const obj = {
        x: 1,
        y: 2,
    };
    type ObjKeys = keyof typeof obj;
    // type ObjKeys = "x" | "y"
    ```
4. TODO，下面的例子没看懂
    ```ts
    If the type has a string or number index signature, keyof will return those types instead:

    type Arrayish = { [n: number]: unknown };
    type A = keyof Arrayish; // type A = number
        
    type A = number
    
    type Mapish = { [k: string]: boolean };
    type M = keyof Mapish; // type M = string | number
    ```


## 是否包含不可遍历属性
<img src="../images/01.jpg" width="600" style="display: block; margin: 5px 0 10px;" />


## References
* [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)