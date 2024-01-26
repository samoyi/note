# Class Heritage


<!-- TOC -->

- [Class Heritage](#class-heritage)
    - [`implements` Clauses](#implements-clauses)
    - [`extends` Clauses](#extends-clauses)
        - [Overriding Methods](#overriding-methods)
        - [Type-only Field Declarations](#type-only-field-declarations)
        - [Initialization Order](#initialization-order)
        - [Inheriting Built-in Types](#inheriting-built-in-types)

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
3. It’s important to understand that an `implements` clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. 不懂这里的 “can be treated as the interface type” 是什么意思，但从下面的例子看，就是只保证类要实现接口中指定的方法，但是方法中的类型还是独立的，和接口没关系
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
5. 接口描述了类的公共部分，而不是公共和私有两部分。它不会帮你检查类是否具有某些私有成员。


## `extends` Clauses
### Overriding Methods
1. It’s important that a derived class follow its base class contract. Remember that it’s very common (and always legal!) to refer to a derived class instance through a base class reference 不懂这句话是什么意思，但从下面的效果看，可以通过子类实例直接创建父类实例
    ```ts
    // Alias the derived instance through a base class reference
    const b: Base = d; // b 现在是 Base 的实例
    b.greet(); // Hello, world!
    ```
2. 子类的重写的属性和方法参数要和父类对应的类型相同
    ```ts
    class Base {
        name!: string;
        greet() {
        console.log("Hello, world!");
        }
    }
    
    class Derived extends Base {
        name!: number; // Error
        // Property 'name' in type 'Derived' is not assignable to the same property in base type 'Base'.
        //   Type 'number' is not assignable to type 'string'.
        
        greet(name: string) { // Error
            // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
            //   Type '(name: string) => void' is not assignable to type '() => void'.
            console.log(`Hello, ${name.toUpperCase()}`);
        }
    }
    ```
    但是方法返回值类型不同却没问题，不懂为什么
    ```ts
    class Base {
        greet():void {
        console.log("Hello, world!");
        }
    }
    
    class Derived extends Base {
        greet(): number { // Error
            return 1;
        }
    }
    ```
3. 但是子类方法可以加父类方法没有的参数作为可选参数
    ```ts
    class Base {
        greet() {
            console.log("Hello, world!");
        }
    }

    class Derived extends Base {
        greet(name?: string) {
            if (name === undefined) {
                super.greet();
            } else {
                console.log(`Hello, ${name.toUpperCase()}`);
            }
        }
    }

    const d = new Derived();
    d.greet();         // Hello, world!
    d.greet("reader"); // Hello, READER
    ```

### Type-only Field Declarations
1. When `target >= ES2022` or `useDefineForClassFields` is true, class fields are initialized after the parent class constructor completes, overwriting any value set by the parent class. This can be a problem when you only want to re-declare a more accurate type for an inherited field.
2. To handle these cases, you can write `declare` to indicate to TypeScript that there should be no runtime effect for this field declaration. 
3. 不懂这里的描述，看下面的例子
    ```ts
    interface Animal {
        dateOfBirth: any;
    }

    interface Dog extends Animal {
        breed: any;
    }

    class AnimalHouse {
        resident: Animal;
        constructor(animal: Animal) {
            this.resident = animal;
        }
    }

    class DogHouse extends AnimalHouse {
        // 因为继承了 AnimalHourse，所以这里 resident 的类型也是 AnimalHouse 中的 Animal
        constructor(dog: Dog) {
            super(dog);
        }
    }

    const dog: Dog = {
        breed: "foo",
        dateOfBirth: "bar",
    };
    const dh = new DogHouse(dog);
    dh.resident;
    // (property) AnimalHouse.resident: Animal
    ```
4. 在这个例子中，我们希望 `DogHouse` 的 `resident` 是 `Dog` 类型而不是 `Animal` 类型。我们当然可以在子类 `DogHouse` 也声明一个 `Dog` 类型的 `resident` 字段
    ```ts
    class DogHouse extends AnimalHouse {
        resident: Dog; // 声明字段
        constructor(dog: Dog) {
            super(dog);
            this.resident = dog; // 字段赋值
        }
    }

    const dog: Dog = {
        breed: "foo",
        dateOfBirth: "bar",
    };
    const dh = new DogHouse(dog);
    let resident = dh.resident;
    // let resident: Dog
    ```
5. 但其实我们并不是想声明 `resident` 字段，只是想改变它的类型。这时就可以使用 `declare` 来声明类型而
    ```ts
    class DogHouse extends AnimalHouse {
        declare resident: Dog;
        constructor(dog: Dog) {
            super(dog);
        }
    }

    const dog: Dog = {
        breed: "foo",
        dateOfBirth: "bar",
    };
    const dh = new DogHouse(dog);
    let resident = dh.resident;
    // let resident: Dog
    ```

### Initialization Order
1. The order that JavaScript classes initialize can be surprising in some cases. Let’s consider this code
    ```ts
    class Base {
        name = "base";
        constructor() {
            console.log(this.name);
        }
    }

    class Derived extends Base {
        name = "derived";
    }

    // Prints "base", not "derived"
    const d = new Derived();
    ```
2. The order of class initialization, as defined by JavaScript, is
    1. The base class fields are initialized
    2. The base class constructor runs
    3. The derived class fields are initialized
    4. The derived class constructor runs
3. 子类 `Derived` 没有明确的定义构造函数，所以会使用默认的空的构造函数，里面当然没有 `console.log(this.name);`，所以只有父类调用了自己的构造函数。

### Inheriting Built-in Types
TODO 先看下 ES 原生的

