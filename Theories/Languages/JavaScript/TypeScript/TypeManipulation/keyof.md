# Keyof Type Operator

<!-- TOC -->

- [Keyof Type Operator](#keyof-type-operator)
    - [Usage](#usage)
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
3. TODO，下面的例子没看懂
    ```ts
    If the type has a string or number index signature, keyof will return those types instead:

    type Arrayish = { [n: number]: unknown };
    type A = keyof Arrayish; // type A = number
        
    type A = number
    
    type Mapish = { [k: string]: boolean };
    type M = keyof Mapish; // type M = string | number
    ```


## References
* [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)