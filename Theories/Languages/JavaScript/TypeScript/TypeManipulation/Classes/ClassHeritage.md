# Class Heritage


<!-- TOC -->

- [Class Heritage](#class-heritage)
    - [`implements` Clauses](#implements-clauses)

<!-- /TOC -->


## `implements` Clauses
1. You can use an `implements` clause to check that a class satisfies a particular interface. An error will be issued if a class fails to correctly implement it
    ```ts
    interface Pingable {
        ping(): void;
    }

    class Sonar implements Pingable { // Ok
        ping() {
            console.log("ping!");
        }
    }

    class Ball implements Pingable { // Error
        pong() {
            console.log("pong!");
        }
    }
    // Class 'Ball' incorrectly implements interface 'Pingable'.
    //   Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
    ```
2. Classes may also implement multiple interfaces
    ```ts
    interface Pingable {
        ping(): void;
    }
    interface Pongable {
        pong(): void;
    }

    class Ball implements Pingable, Pongable {
        ping() {
            console.log("ping!");
        }

        pong() {
            console.log("pong!");
        }
    }
    ```
3. It’s important to understand that an `implements` clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. 不懂这里的 ”can be treated as the interface type“ 是什么意思，但从下面的例子看，就是只保证类要实现接口中指定的方法，但是方法中的类型还是独立的，和接口没关系
    ```ts
    interface Checkable {
        check(name: string): boolean;
    }
    
    class NameChecker implements Checkable {
        check(s) { // Error 这里 s 并不会自动变成 string 类型
            // Parameter 's' implicitly has an 'any' type.
            return s.toLowestcase() === "ok"; // 因为是 any 类型，所以这里也无法检查出错误
        }
    }
    ```
4. 接口的可选属性类可以不实现，但是如果不实现，也不会自动在类上添加该属性
    ```ts
    interface A {
        x: number;
        y?: number;
    }
    class C implements A {
        x = 0;
    }
    const c = new C();
    c.y = 10; // Error
    // Property 'y' does not exist on type 'C'.
    ```