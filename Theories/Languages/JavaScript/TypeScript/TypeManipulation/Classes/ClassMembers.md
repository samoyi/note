# Class Members

<!-- TOC -->

- [Class Members](#class-members)
    - [Fields](#fields)

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
