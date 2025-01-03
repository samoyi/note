# Generics


<!-- TOC -->

- [Generics](#generics)
    - [泛型的用途](#泛型的用途)
    - [使用泛型变量](#使用泛型变量)
    - [Generic Types](#generic-types)
    - [Generic Classes](#generic-classes)
    - [Using Class Types in Generics](#using-class-types-in-generics)
    - [References](#references)

<!-- /TOC -->


## 泛型的用途
1. 假设我们实现一个函数，期望它的参数和返回值是同一种类型，但是我们又不限定具体的类型。如果不使用泛型，最多只能这样定义
    ```ts
    function identity(arg: any): any {
        return arg;
    }
    ```
2. 因为不限制类型，所以要用 `any`。但是这样的话，就不能保证参数和返回值是相同的类型。也就是说，我们希望的是 “任意的某一种类型”，而不是 “任意类型”。
3. 下面我们使用 **类型变量**（type variable），它是一种特殊的变量，只用于表示类型而不是值
    ```ts
    function identity<T>(arg: T): T {
        return arg;
    }
    ```
4. 我们给 `identity` 添加了类型变量 `T`。 `T` 帮助我们捕获用户传入的类型，然后用在参数和返回值中。现在我们可以保证参数类型与返回值类型是相同的类型 `T` 了。
5. 我们说这个版本的 `identity` 函数是泛型的（generic），因为它可以适用于多个类型。
6. 我们定义了泛型函数后，可以用两种方法使用。第一种是明确的给类型变量传值
    ```ts
    let output = identity<string>("myString");  // type of output will be 'string'
    ```
    第二种方法更普遍。利用了类型推论，即编译器会根据传入的参数自动地帮助我们确定 `T` 的类型
    ```ts
    let output = identity("myString");  // type of output will be 'string'
    ```


## 使用泛型变量
1. 使用泛型创建像 `identity` 这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。换句话说，你必须把这些参数当做是任意或所有类型。
2. 看下之前 `identity` 例子
    ```ts
    function identity<T>(arg: T): T {
        return arg;
    }
    ```
    如果我们想同时打印出 `arg` 的长度。 我们很可能会这样做：
    ```ts
    function loggingIdentity<T>(arg: T): T {
        console.log(arg.length);  // Error: Property 'length' does not exist on type 'T'.
        return arg;
    }
    ```
3. 因为 `T` 要兼容任何可能的类型，所以无法保证在所有可能的类型都存在 `length` 属性。
4. 现在假设我们想操作 `T` 类型的数组而不是直接的 `T` 类型值，那我们可以使用 `T` 来定义数组类型
    ```ts
    function loggingIdentity<T>(arg: T[]): T[] {
        console.log(arg.length);
        return arg;
    }
    ```
5. 也就是说，类型变量并不是只能直接用于参数和返回值，它可以按照需求随意的使用。
    

## Generic Types
1. 上面介绍的是在函数中使用泛型，也就是泛型函数；而 Generic Types 要说的是，我们定义一个类型，在这个类型上使用泛型。
2. 具体来说，比如我们定义一个函数的类型，但这个函数类型中参数和返回值的类型是不固定的，也就是泛型的。那么我们整个这个函数的类型就是一个泛型的函数类型。
3. 例如
    ```js
    function identity<Type>(arg: Type): Type {
        return arg;
    }

    let myIdentity: <Type>(arg: Type) => Type = identity;

    myIdentity = Array.prototype.slice; // Error
    // Type '(start?: number | undefined, end?: number | undefined) => any[]' is not assignable to type '<Type>(arg: Type) => Type'.
    ```
    1. `identity` 的类型是 `<Type>(arg: Type): Type`，它没有明确定义参数和返回值的类型，而是泛型的；
    2. `myIdentity` 的类型也被定义为相同的泛型类型，所以 `identity` 可以赋值给它；
    3. 但是 `Array.prototype.slice` 的类型并不能套到上面的泛型类型上，所以不能赋值。
4. 还可以使用对象字面量形式的调用签名来定义泛型变量
    ```ts
    let myIdentity: { 
        <Type>(arg: Type): Type 
    } = identity;
    ```
5. 这就引导我们去写成泛型接口的形式了
    ```ts
    interface GenericIdentityFn {
        <Type>(arg: Type): Type;
    }

    function identity<Type>(arg: Type): Type {
        return arg;
    }

    let myIdentity: GenericIdentityFn = identity;
    ```
    甚至 `identity` 也可以使用泛型接口定义
    ```ts
    interface GenericIdentityFn {
        <Type>(arg: Type): Type;
    }

    let identity: GenericIdentityFn = (arg) => {
        return arg;
    }

    let myIdentity: GenericIdentityFn = identity;
    ```
6. `identity` 和 `myIdentity` 都使用了相同的泛型接口，因此这两个函数都是接受一个某类型的参数，然后返回相同类型的值。但他俩并不需要在这个类型上相同，因为是泛型的
    ```ts
    identity(222) // OK
    myIdentity("hello") // OK
    ```
    然后 `identity` 直接赋值给了 `myIdentity`，但它俩完全可以接受不同类型的参数。甚至同样的函数之后接受其他类型的参数也可以
    ```ts
    identity("world") // OK
    myIdentity(333) // OK
    ```
7. 也就是说泛型接口只是约束了参数的数量、参数和返回值的类型关系，而不约束具体的类型。否则也就不叫泛型了。
8. 如果我们把泛型接口的类型参数作为接口整体的参数，那就可以在使用泛型接口时指明该泛型接口最终落到哪个具体的类型上，而让具体定义的函数签名不再是泛型的
    ```ts
    interface GenericIdentityFn<Type> {
        (arg: Type): Type;
    }

    let identity: GenericIdentityFn<number> = (arg) => {
        return arg;
    }

    let myIdentity: GenericIdentityFn<string> = (arg) => {
        return arg;
    };
    // 现在就不能再赋值了，因为已经不是泛型了
    // let myIdentity: GenericIdentityFn<string> = identity;

    identity(222) // OK
    myIdentity("hello") // OK
    dentity("world") // Error
    myIdentity(333) // Error
    ```
9. 泛型函数是在函数定义时使用泛型，调用时确定具体的类型；而泛型类型是在定义该类型时使用泛型，而在使用该类型定义具体函数时确定具体的类型。


## Generic Classes
1. A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (`<>`) following the name of the class
    ```ts
    class GenericNumber<T> {
        zeroValue!: T;
        add!: (x: T, y: T) => T;
    }
    ```
2. 在实例化该类时，可以传入类型参数来确定具体的类型
    ```ts
    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) {
        return x + y;
    };
    ```
3. Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class’s type parameter
    ```ts
    class GenericNumber<T> {
        static str: T = "hello"; // Error - Static members cannot reference class type parameters.
        zeroValue!: T;
        add!: (x: T, y: T) => T;
    }
    ```


## Generic Constraints
1. 泛型默认情况下是允许使用任何类型的。但有时我们期望不要那么广泛，让它可以只在不分类型之间泛型。
2. 例如下面的函数中，我们就不希望函数的参数可以是任何类型，否则 `arg.length` 就无法通过编译
    ```ts
    function loggingIdentity<Type>(arg: Type): Type {
        console.log(arg.length);
        // Property 'length' does not exist on type 'Type'.
        return arg;
    }
    ```
3. 那么我们就希望泛型约束在有 `.length` 属性的类型上。我们可以通过 `extends` 来制定泛型的类型需要满足哪种类型
    ```ts
    function loggingIdentity<Type extends string|any[]>(arg: Type): Type {
        console.log(arg.length);
        return arg;
    }

    loggingIdentity(""); // ok
    loggingIdentity([]); // ok

    loggingIdentity({}); // ok
    // Argument of type '{}' is not assignable to parameter of type 'string | any[]'.
    //   Type '{}' is not assignable to type 'string'.
    ```
4. 上例中，更一般的，我们可以定义一个任何具有 `.length` 属性的类型
    ```ts
    interface Lengthwise {
        length: number;
    }

    function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
        console.log(arg.length);
        return arg;
    }

    loggingIdentity(""); // ok
    loggingIdentity([]); // ok
    loggingIdentity({ length: 10, value: 3 }); // ok

    loggingIdentity({}); // ok
    // Argument of type '{}' is not assignable to parameter of type 'Lengthwise'.
    //   Property 'length' is missing in type '{}' but required in type 'Lengthwise'.
    ```

### Using Type Parameters in Generic Constraints
1. 上面的例子中，约束类型参数 `Type` 的某个具体类型（`string | any[]` 或者 `Lengthwise`）。但我们还可以用一个类型参数去约束另一个类型参数。
2. 例如下面的函数，我们期望返回 `obj` 之上的 `key` 属性
    ```ts
    function getProperty(obj, key) {
        return obj[key];
    }
    ```
3. 此时我们需要确保 `key` 属性确实是在 `obj` 之上。因此可以这样写
    ```ts
    function getProperty<Type>(obj: Type, key: keyof Type) {
        return obj[key];
    }
    
    let x = { a: 1, b: 2, c: 3, d: 4 };

    getProperty(x, "a"); // ok
    getProperty(x, "m");
    // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
    ```
4. 但我们还可以换一种形式。给 `key` 也定义一个类型参数 `Key`，然后用类型参数 `Type` 去约束类型参数 `Key`
    ```ts
    function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
        return obj[key];
    }
    ```



## Using Class Types in Generics
1. 如果我们对工厂函数也使用泛型参数，该泛型参数是工厂函数返回对象的类型，那么工厂函数的构造函数参数就也需要使用该泛型参数。
2. 在下面的工厂函数 `create` 中，泛型参数是 `Type`。我们希望工厂函数返回的实例就是 `Type` 类型，那么对于参数 `constructor`，我们也要定义它的 `new` 操作返回类型是 `Type`
    ```ts
    function create<Type>(constructor: { new (): Type }): Type {
        return new constructor();
    }
    ```
3. 一个更实际的例子。工厂函数接受 `createInstance` 接受 `Bee` 类型或 `Lion` 的构造函数，返回各自类型的实例
    ```ts
    class BeeKeeper {
        hasMask: boolean = true;
    }

    class ZooKeeper {
        nametag: string = "Mikle";
    }

    class Animal {
        numLegs: number = 4;
    }

    class Bee extends Animal {
        numLegs = 6;
        keeper: BeeKeeper = new BeeKeeper();
    }

    class Lion extends Animal {
        keeper: ZooKeeper = new ZooKeeper();
    }

    function createInstance<A extends Animal>(c: new () => A): A {
        return new c();
    }

    createInstance(Lion).keeper.nametag; // ok
    createInstance(Bee).keeper.hasMask;  // ok
    createInstance(Lion).keeper.hasMask; // Property 'hasMask' does not exist on type 'ZooKeeper'
    createInstance(Bee).keeper.nametag;  // Property 'nametag' does not exist on type 'BeeKeeper'
    ```
4. This pattern is used to power the [mixins](https://www.typescriptlang.org/docs/handbook/mixins.html) design pattern.


## Generic Parameter Defaults
TODO





## References
* [中文文档](https://www.tslang.cn/docs/handbook/functions.html)