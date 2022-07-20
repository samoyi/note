# Static


<!-- TOC -->

- [Static](#static)
    - [Static Members](#static-members)
        - [Special Static Names](#special-static-names)
    - [`static` Blocks in Classes](#static-blocks-in-classes)

<!-- /TOC -->


## Static Members
1. Static members can also use the same `public`, `protected`, and `private` visibility modifiers
    ```ts
    class MyClass {
        private static x = 0;
    }
    console.log(MyClass.x);
    // Property 'x' is private and only accessible within class 'MyClass'.
    ```
2. Static members are also inherite
    ```ts
    class Base {
        static getGreeting() {
            return "Hello world";
        }
    }
    class Derived extends Base {
        myGreeting = Derived.getGreeting();
    }

    const d = new Derived();
    console.log(d.myGreeting); // "Hello world"
    ```

### Special Static Names
1. It’s generally not safe/possible to overwrite properties from the `Function` prototype. Because classes are themselves functions that can be invoked with new, certain static names can’t be used.
2. Function properties like `name`, `length`, and `call` aren’t valid to define as static members
    ```ts
    class S {
        static name = "S!"; // Error
        // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
    }
    ```


## `static` Blocks in Classes
1. Static blocks allow you to write a sequence of statements with their own scope that can access private fields within the containing class. This means that we can write initialization code with all the capabilities of writing statements, no leakage of variables, and full access to our class’s internals.
2. `static` 代码块里的代码，在创建类（而非类实例）的时候会执行，在其中可以访问到类的静态属性
    ```ts
    class Foo {
        static #count = 0;
    
        get count() {
            return Foo.#count;
        }
    
        static {
            try {
                console.log(Foo.#count);
            }
            catch {}
        }
    }
    ```
