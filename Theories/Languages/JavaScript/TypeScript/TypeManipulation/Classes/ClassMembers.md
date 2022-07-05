# Class Members

<!-- TOC -->

- [Class Members](#class-members)
    - [Fields](#fields)
    - [Constructors](#constructors)
    - [Methods](#methods)
    - [Getters / Setters](#getters--setters)
    - [Index Signatures](#index-signatures)

<!-- /TOC -->


## Fields
1. 最基本的字段声明，声明  public 且 writeable 的类属性
    ```ts
    class Point {
        x: number;
        y: number;
    }

    const pt = new Point();
    pt.x = 0;
    pt.y = 0;
    ```
2. 字段声明时也可以有初始化式，初始化会在类被实例化时执行
    ```ts
    class Point {
        x = 0;
        y = 0;
    }
    ```
3. 如果 `strictPropertyInitialization` 设置为 `true`，则声明的字段要么在声明时有初始化式，要么在构造函数中进行初始化，否则就会编译报错
    ```ts
    class Point {
        x: number; // Error
        // Property 'x' has no initializer and is not definitely assigned in the constructor.
        y: number; // Error
        // Property 'y' has no initializer and is not definitely assigned in the constructor.

        // 要么在这里初始化
        // x: number = 22;
        // y: number = 33;

        constructor() {
            // 要么在这里初始化
            // this.x = 22;
            // this.y = 33;
        }
    }
    ```
4. 如果你确定要在其他地方对字段进行初始化，那可以使用 definite assignment assertion operator `!`
    ```ts
    class Point {
        // 不会编译报错
        x!: number;
        y!: number;

        constructor() {

        }
    }
    ```
5. 还可以通过 `readonly` 声明只读字段，只读字段在构造函数之外的地方不能被修改
    ```ts
    class Greeter {
        readonly name: string = "world";

        constructor(otherName?: string) {
            if (otherName !== undefined) {
                // 在构造函数里可以被修改
                this.name = "otherName";
            }
        }

        err() {
            this.name = "not ok"; // Error
            // Cannot assign to 'name' because it is a read-only property.
        }
    }

    const g = new Greeter();
    g.name = "also not ok"; // Error
    // Cannot assign to 'name' because it is a read-only property.
    ```


## Constructors
1. Class constructors are very similar to functions. You can add parameters with type annotations, default values, and overloads
    ```ts
    class Point {
        // Overloads
        constructor(x: number, y: string);
        constructor(s: string);
        constructor(xs: any, y?: any) {
            console.log(xs);
            y && console.log(y);
        }
    }
    ```
2. There are just a few differences between class constructor signatures and function signatures
    * Constructors can’t have type parameters - these belong on the outer class declaration.
    * Constructors can’t have return type annotations - the class instance type is always what’s returned.


## Methods
1. A function property on a class is called a method. Methods can use all the same type annotations as functions and constructors
    ```ts
    class Point {
        x = 10;
        y = 10;

        scale(n: number): void {
            this.x *= n;
            this.y *= n;
        }
    }
    ```
2. Note that inside a method body, it is still mandatory to access fields and other methods via `this.`. An unqualified name in a method body will always refer to something in the enclosing scope
    ```ts
    let x: number = 0;

    class C {
        x: string = "hello";

        m() {
            // This is trying to modify 'x' from line 1, not the class property
            x = "world"; // Error
            // Type 'string' is not assignable to type 'number'.
        }
    }
    ```


## Getters / Setters
1. Classes can also have accessors
    ```ts
    class C {
        _length = 0;
        get length() {
            return this._length;
        }
        set length(value) {
            this._length = value;
        }
    }
    ```
2. TypeScript has some special inference rules for accessors:
    * If `get` exists but no `set`, the property is automatically `readonly`
    * If the type of the setter parameter is not specified, it is inferred from the return type of the getter
        ```ts
        class C {
            _length = 0;
            get length() {
                return this._length;
            }
            set length(value) { // (parameter) value: number
                this._length = value;
            }
        }
        ```
    * Getters and setters must have the same Member Visibility
3. It is possible to have accessors with different types for getting and setting
    ```ts
    class Thing {
        _size = 0;

        get size(): number {
            return this._size;
        }

        set size(value: string | number | boolean) {
            let num = Number(value);

            // Don't allow NaN, Infinity, etc

            if (!Number.isFinite(num)) {
                this._size = 0;
                return;
            }

            this._size = num;
        }
    }
    ```


## Index Signatures
1. Classes can declare index signatures; these work the same as Index Signatures for other object types
    ```ts
    class MyClass {
        // 如果是属性的话必须是布尔值属性；
        // 如果是方法的话必须是一个字符串参数，返回值为布尔值
        [s: string]: boolean | ((s: string) => boolean);

        constructor(bool: boolean, num: number) {
            this.bool = false; // OK
            this.num = 22; // Error
            // Type '22' is not assignable to type 'boolean | ((s: string) => boolean)'.
        }

        check(s: string) {
            return this[s] as boolean;
        }

        foo (age: number) { // Error
            return true;
        }
        // Property 'foo' of type '(age: number) => void' is not assignable to 'string' index type 'boolean | ((s: string) => boolean)'.

        bar (name: string, age: number) { // Error
            return true;
        }
        // Property 'bar' of type '(name: string, age: number) => boolean' is not assignable to 'string' index type 'boolean | ((s: string) => boolean)'.
    }
    ```
2. Because the index signature type needs to also capture the types of methods, it’s not easy to usefully use these types. Generally it’s better to store indexed data in another place instead of on the class instance itself.