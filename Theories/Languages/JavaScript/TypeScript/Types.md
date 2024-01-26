# Types


<!-- TOC -->

- [Types](#types)
    - [Misc](#misc)
        - [隐式推断类型](#隐式推断类型)
    - [基本类型](#基本类型)
        - [`any`](#any)
            - [禁止隐式声明为 `any` 类型](#禁止隐式声明为-any-类型)
        - [`Void`](#void)
        - [`Null` 和 `Undefined`](#null-和-undefined)
            - [断言非 `null` 或 `undefined`](#断言非-null-或-undefined)
    - [引用类型](#引用类型)
        - [Object Types](#object-types)
            - [可选属性](#可选属性)
        - [数组](#数组)
            - [两种声明方式](#两种声明方式)
            - [`ReadonlyArray`](#readonlyarray)
        - [Union Types](#union-types)
        - [Intersection Types](#intersection-types)
            - [函数参数的情况](#函数参数的情况)
        - [Tuple](#tuple)
        - [`enum`](#enum)
    - [Type Aliases](#type-aliases)
    - [Interfaces](#interfaces)
        - [和类型别名的区别](#和类型别名的区别)
    - [Type Assertions](#type-assertions)
    - [Literal Types](#literal-types)
        - [Literal Inference](#literal-inference)
    - [References](#references)

<!-- /TOC -->


## Misc
### 隐式推断类型
1. 如果通过声明变量时的初始化就能确定类型，就不需要明确指明类型
    ```ts
    let str = "hello";
    str = 12; // Type 'number' is not assignable to type 'string'.
    ```
2. 但必须是是在声明变量的时候就赋值才会推断类型，声明时没有初始化赋值则变量的类型就是 `any`
    ```ts
    // Variable 'str' implicitly has an 'any' type, but a better type may be inferred from usage.
    let str;  
    str = "hello";
    ```


## 基本类型
### `any`
1. 声明 `any` 类型的变量就像是声明 JS 的变量一样，它可能是任何类型，所以 TSC 不会进行类型判断。
    ```ts
    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean
    ```
2. 有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any` 类型来标记这些变量：
    ```ts
    let notSure: any = 4;
    notSure.ifItExists(); // okay, ifItExists might exist at runtime
    notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)
    ```
3. 当你只知道一部分数据的类型时，`any` 类型也是有用的
    ```ts
    let list: any[] = [1, true, "free"];
    list[1] = 100;
    ```

#### 禁止隐式声明为 `any` 类型
1. When you don’t specify a type, and TypeScript can’t infer it from context, the compiler will typically default to `any`.
2. You usually want to avoid this, though, because `any` isn’t type-checked. Use the compiler flag `noImplicitAny` to flag any implicit any as an error.
3. 命令行如下进行编译时会报错
    ```ts
    function fn(s) {
        console.log(s.subtr(3));
    }
    ```
    ```sh
    tsc --noImplicitAny helloworld.ts 
    # Parameter 's' implicitly has an 'any' type.
    ```
4. TODO，声明变量时隐式声明为 `any` 并不会报错
    ```ts
    let v;
    ```

### `Void`
1. 它表示没有任何类型。当一个函数没有返回值时，你通常会见到其返回值类型是 `void`
    ```ts
    function warnUser(): void {
        console.log("This is my warning message");
    }
    ```
2. 声明一个 `void` 类型的变量没有什么大用，因为你只能为它赋予 `undefined` 和 `null`
    ```ts
    let unusable: void = undefined;
    ```
    
### `Null` 和 `Undefined`
1. `undefined` 和 `null` 两者各自有自己的类型分别叫做 `undefined` 和 `null`。
2. 默认情况下 `undefined` 和 `null` 是所有类型的子类型。就是说你可以把 `undefined` 和 `null` 赋值给其他类型的变量
    ```ts
    let n :number = 22;
    function foo(num: number) :number {
        return num + 1;
    }

    n = undefined; // 可以通过编译
    console.log( foo(n) ); // NaN
    ```
3. 上面的例子可以看到，`undefined` 和 `null` 可能会导致意外的错误。在 `tsconfig.json` 中设置
`"strictNullChecks": true` 可以禁止这种赋值，使得 `null` 和 `undefined` 只能赋值给 `void` 和它们自身。
    
#### 断言非 `null` 或 `undefined`
1. 下面的代码会有编译错误
    ```ts
    function liveDangerously(x?: number | null) {
        console.log(x.toFixed()); // Error - Object is possibly 'null' or 'undefined'.
    }
    ```
2. 因为 `x` 有可能是 `null`，那就无法调用 `toFixed`。
3. 但你如果确定运行时 `x` 不会是 `null`，就可以使用 `!` 进行断言，明确的保证 `x` 不会为 `null`
    ```ts
    function liveDangerously(x?: number | null) {
        console.log(x!.toFixed());
    }
    ```
4. 但这个有什么用呢？如果运行时 `x` 是 `null`，仍然会导致 `TypeError`。为什么不直接取消参数类型中的 `null`，不懂。


## 引用类型
函数相关的在 `./Functions/`

### Object Types
1. 定义对象类型时，只需要列出它们的属性名和类型
    ```ts
    function printCoord(pt: { x: number, y: number }) {
        console.log("The coordinate's x value is " + pt.x);
        console.log("The coordinate's y value is " + pt.y);
    }
    printCoord({ x: 3, y: 7 });
    ```
2. 在这里，参数 `pt` 的的类型是 `{ x: number, y: number }`。分隔符也可以使用分号
    ```ts
    function printCoord(pt: { x: number; y: number }) {
        console.log("The coordinate's x value is " + pt.x);
        console.log("The coordinate's y value is " + pt.y);
    }
    ```
3. 如果没有指定类型，则被认为是 `any`。

#### 可选属性
1. 使用 `?`
    ```ts
    function printName(obj: { first: string; last?: string }) {
    // ...
    }
    // Both OK
    printName({ first: "Bob" });
    printName({ first: "Alice", last: "Alisson" });
    ```
2. 使用可选属性时，必须要考虑它不存在的情况，也就是它的类型为 `undefiend` 的情况
    ```ts
    function printName(obj: { first: string; last?: string }) {
        // Error - Object is possibly 'undefined'.
        console.log(obj.last.toUpperCase());
    }
    ```
3. 所以需要做出判断
    ```ts
    function printName(obj: { first: string; last?: string }) {
        if (obj.last !== undefined) {
            console.log(obj.last.toUpperCase());
        }
    }
    ```
    或者使用新的 JavaScript 语法 `?.`
    ```ts
    function printName(obj: { first: string; last?: string }) {
        console.log(obj.last?.toUpperCase());
    }
    ```

#### 解构赋值的情况
1. 如下解构复制的情况
    ```ts
    let o = {
        a: "foo",
        b: 12,
        c: "bar"
    };
    let { a, b } = o;
    ```
2. 如果想要明确指定 `a` `b` 的类型,不能这样,因为这是解构赋值重命名的语法
    ```ts
    let { a: string, b: number } = o;
    ```
3. 而是应该
    ```ts
    let { a, b }: { a: string, b: number } = o;
    ```
4. 如果在解构赋值重命名的时候还要指定变量类型,注意制定类型时使用的是重命名之前的变量名
    ```ts
    let { a: a1, b: b1 }: { a: string, b: number } = o;
    ```

### 数组
#### 两种声明方式
1. 第一种
    ```ts
    let list: number[] = [1, 2, 3];
    ```
2. 第二种方式是使用数组泛型，`Array<元素类型>`
    ```ts
    let list: Array<number> = [1, 2, 3];
    ```

#### `ReadonlyArray`
```ts
function doStuff(values: readonly string[]) {
// 或者 function doStuff(values: ReadonlyArray<string>) {
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);

    values.push("hello!"); // 编译报错
    // Property 'push' does not exist on type 'readonly string[]'.
}   
```

### Union Types
1.  A union type is a type formed from two or more other types, representing values that may be any one of those types. 
2. We refer to each of these types as the union’s members. Let’s write a function that can operate on strings or numbers:
    ```ts
    function printId(id: number | string) {
        console.log("Your ID is: " + id);
    }

    // OK
    printId(101);

    // OK
    printId("202");

    // Error
    printId({ myID: 22342 });
    ```
3. 在使用联合类型的值时，必须要保证它的用法要能满足所有成员的类型。例如一个值的类型时 `string | number`，则不能以仅满足 `string` 类型的方法来使用它
    ```ts
    function printId(id: number | string) {
        console.log(id.toUpperCase());
        // Property 'toUpperCase' does not exist on type 'string | number'.
        //   Property 'toUpperCase' does not exist on type 'number'.
    }
    ```
4. 解决方法是使用 narrowing 
    ```ts
    function printId(id: number | string) {
        if (typeof id === "string") {
            console.log(id.toUpperCase());
        } 
        else {
            console.log(id);
        }
    }
    ```

### Intersection Types
1. Intersection types represent values that simultaneously have multiple types. A value of an intersection type `A & B` is a value that is both of type `A` and type `B`.
2. 下面的例子中，`A & B` 类型就要求有且仅有两个类型为 `number` 的属性 `a` 和属性 `b`
    ```ts
    interface A { a: number }
    interface B { b: number }

    var ab: A & B

    ab = { a: 1, b: 1 }; // OK

    ab = { a: 1 }; // Error
    // Type '{ a: number; }' is not assignable to type 'A & B'.
    //   Property 'b' is missing in type '{ a: number; }' but required in type 'B'.

    ab = { a: 1, b: 1, c: 1 }; // Error
    // Type '{ a: number; b: number; c: number; }' is not assignable to type 'A & B'.
    //   Object literal may only specify known properties, and 'c' does not exist in type 'A & B'.

    ab = { a: 1, b: "1" }; // Error
    // Type 'string' is not assignable to type 'number'. 
    ```
3. 接着上面的例子，进一步
    ```ts
    // X 类型要求 有且仅有一个类型为 A 的属性 p
    interface X { p: A }  
    // Y 类型要求 有且仅有一个类型为 B 的属性 p
    interface Y { p: B }

    // X & Y 类型就要求 有且仅有一个类型为 A & B 的属性 p
    var xy: X & Y;

    xy = { p: ab };  // OK   上面例子中 ab 的属性是 A & B

    xy = { p: 22 }; // Error  虽然有属性 p，但是类型不是 A & B
    // Type 'number' is not assignable to type 'A & B'.
    //   Type 'number' is not assignable to type 'A'.

    xy = { q: ab }; // Error 虽然类型是 A & B，但是不是属性 p
    // Type '{ q: A & B; }' is not assignable to type 'X & Y'.
    //   Object literal may only specify known properties, and 'q' does not exist in type 'X & Y'.
    ```

#### 函数参数的情况
TODO，不懂
```ts
// 函数类型 F1 要求有且仅有两个 string 参数
type F1 = (a: string, b: string) => void;  
// 函数类型 F2 要求有且仅有两个 number 参数
type F2 = (c: number, d: number) => void; // 形参名不重要

// F1 & F2
var f: F1 & F2;

f = (a: string | number, b: string | number) => { }; // OK

f("hello", "world");  // Ok  
f(1, 2);              // Ok  
f(1, "test");         // Error  // TODO，不懂
// No overload matches this call.
//   Overload 1 of 2, '(a: string, b: string): void', gave the following error.
//     Argument of type 'number' is not assignable to parameter of type 'string'.
//   Overload 2 of 2, '(c: number, d: number): void', gave the following error.
//     Argument of type 'string' is not assignable to parameter of type 'number'.


f = (a: string | number, b: number | string) => { }; // OK 

f = (a: number | number, b: string | string) => { }; // Error // TODO，不懂
```
不懂，下面那这个是可以的
```ts
function foo (a: string | number, b: string | number): void {

}
foo(1, "test")
```
那为什么上面的这个不行呢
```ts
f = (a: string | number, b: string | number) => { };
f(1, "test");         // Error 
```

### Tuple
1. A tuple type is another sort of `Array` type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
    ```ts
    // 接收 [string, number] 的元组类型参数
    function doSomething(pair: [string, number]) {
        const a: string = pair[0];
        const b: number = pair[1];
        console.log(a, b);
    }

    let p :[string, number] = ["hello", 42]; // 定义一个 [string, number] 的元组类型变量
    doSomething(p);
    ```
2. 访问越界就会报错
    ```ts
    let p :[string, number] = ["hello", 42];
    p[2]; // Tuple type '[string, number]' of length '2' has no element at index '2'.
    ```

### enum
1. 默认起始的值从 0 开始
    ```ts
    enum Color {Red, Green, Blue}
    let c: Color = Color.Green;
    console.log(c); // 1
    ```
2. 也可以手动指定起始值
    ```ts
    enum Color {Red=8, Green, Blue}
    let c: Color = Color.Green;
    console.log(c); // 9
    ```
3. 或者任意指定值
    ```ts
    enum Color {Red=8, Green=99, Blue=3}
    let c: Color = Color.Green;
    console.log(c); // 99
    ```
4. 可以通过值来得到它的名字
    ```ts
    enum Color {Red=8, Green=99, Blue=3}
    let colorName: string = Color[3];
    console.log(colorName); // "Blue"
    ```

### `object` 类型
1. 表示所有的引用类型，包括函数和 `null`.
2. 使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 API。例如：
    ```ts
    declare function create(o: object | null): void;

    create({ prop: 0 }); // OK
    create(null); // OK
    create(() => {}); // OK

    create(42); // Error
    create("string"); // Error
    create(false); // Error
    create(undefined); // Error
    ```


## Type Aliases
1. 语法
    ```ts
    type Point = {
        x: number;
        y: number;
    };
    
    function printCoord(pt: Point) {
        console.log("The coordinate's x value is " + pt.x);
        console.log("The coordinate's y value is " + pt.y);
    }
    
    printCoord({ x: 100, y: 100 });
    ```
2. 可以使用类型别名来为任何类型命名，而不仅仅是对象类型
    ```ts
    type ID = number | string;
    ```

 
## Interfaces
1. An *interface declaration* is another way to name an object type:
    ```ts
    interface Point {
        x: number;
        y: number;
    }
    
    function printCoord(pt: Point) {
        console.log("The coordinate's x value is " + pt.x);
        console.log("The coordinate's y value is " + pt.y);
    }
    
    printCoord({ x: 100, y: 100 });
    ```

### 和类型别名的区别
1. 大多数情况都相同，但也有一些差别。
2. 接口可以添加新字段，类型声明不行
    ```ts
    interface Obj {
        name: string;
    }
    interface Obj {
        age: number;
    }

    let obj: Obj = {name: '33', age: 22}; // OK
    ```
    ```ts
    type Obj = {
        name: string;
    }

    // Error - Duplicate identifier 'Obj'.
    type Obj = {
        age: number;
    }
    ```
3. 但两者都可以继承，只不过继承的方式不同
    * 接口的继承方式
        ```ts
        interface Person {
            age: number;
        }

        interface Obj extends Person { // Obj 继承了 age 属性
            name: string;
        }

        let obj: Obj = {name: '33', age: 22}; // OK
        ```
    * 类型别名的继承方式
        ```ts
        type Person = {
            age: number;
        }

        type Obj = Person & {
            name: string;
        }

        let obj: Obj = {name: '33', age: 22}; // OK
        ```
    
    
## Type Assertions
1. 如果你自己明确的知道一个数据是当前类型的子类型，那可以使用类型断言指定它为更具体的子类型。（也可以反过来断言为父类型）
2. For example, if you’re using `document.getElementById`, TypeScript only knows that this will return some kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID. In this situation, you can use a type assertion to specify a more specific type:
    ```ts
    const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
    ```
3. 除了使用 `as` 语法，还可以在 JSX 以外的场景中使用尖括号语法 
    ```ts
    const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
    ```
4. TypeScript only allows type assertions which convert to a more specific or less specific version of a type. This rule prevents “impossible” coercions like:
    ```ts
    const x = "hello" as number; // 编译报错
    ```


## Literal Types
1. In addition to the general types string and number, we can refer to specific strings and numbers in type positions.
2. 看以下两个声明，一个变量一个常量。把光标分别放到变量和常量之上是，显示出不同的类型说明
    ```ts
    let changingString = "Hello World";   // let changingString: string
    const constantString = "Hello World"; // const constantString: "Hello World"
    ```
3. 可以看到，`constantString` 的类型不是 `string`，而是它的字面量本身。
4. 可以直接声明字面量类型，但意义并不大
    ```ts
    let str: "hello" = "hello";
    str = "world"; // 错误：Type '"world"' is not assignable to type '"hello"'.
    ```
5. 但通过将字面量类型组合为联合，就可以限制为只能是几种字面量之一
    ```ts
    function printText(s: string, alignment: "left" | "right" | "center") {
    // ...
    }
    printText("Hello, world", "left"); // OK

    // 错误：Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
    printText("G'day, mate", "centre"); 
    ```
    ```ts
    function compare(a: string, b: string): -1 | 0 | 1 {
        return a === b ? 0 : a > b ? 1 : -1;
    }
    ```
    ```ts
    interface Options {
        width: number;
    }
    // 字面量类型也可以和其他类型联合
    function configure(x: Options | "auto") {
        // ...
    }

    configure({ width: 100 }); // OK
    configure("auto"); // OK

    // Error - Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
    configure("automatic");
    ```
6. 还有一种字面量类型是布尔值字面量类型
    ```ts
    let t: true;
    t = false; // Error- Type 'false' is not assignable to type 'true'.

    let f: false;
    f = true; // Error- Type 'true' is not assignable to type 'false'.

    function foo (b: true|false) {}
    // 相当于
    function foo (b: boolean) {}
    ```

### Literal Inference
1. 看下面的例子
    ```ts
    function handleRequest (url: string, method: "GET" | "POST") {}

    const req = { url: "https://example.com", method: "GET" };
    // Error - Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
    handleRequest(req.url, req.method);
    ```
2. `handleRequest` 第二个参数的类型是 `"GET" | "POST"`，虽然当前 `req.method` 的值是 `"GET"`，但之后的值可能会变成其他任意字符串，所以 `req.method` 的类型是 `string` 而不是 `"GET" | "POST"`。
3. 针对这个问题，有两种方法可以解决：
    * 使用类型断言
        ```ts
        handleRequest(req.url, req.method  as "GET");
        ```
    * 使用 `as const` 把 `req` 变为 “常量”。就像上面用 `const` 声明的字符串变量的类型会是字符串字面量一样，这里使用 `as const` 后，`req.url` 和 `req.method` 的类型也都不是 `string` 了，而是变成了 `"https://example.com"` 和 `"GET"`
        ```ts
        const req = { url: "https://example.com", method: "GET" } as const;
        ```




Literal Types
as const
https://stackoverflow.com/questions/37978528/typescript-type-string-is-not-assignable-to-type


## References
* [中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)
* [英文文档](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
* [3.5 Intersection Types](https://github.com/microsoft/TypeScript/blob/v4.5.4/doc/spec-ARCHIVED.md#35-intersection-types)