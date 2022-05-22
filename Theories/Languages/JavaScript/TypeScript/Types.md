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
    - [对象类型](#对象类型)
        - [数组的两种声明方式](#数组的两种声明方式)
        - [`ReadonlyArray`](#readonlyarray)
        - [Tuple](#tuple)
        - [`enum`](#enum)
    - [其他和函数相关的一些类型](#其他和函数相关的一些类型)
        - [`void`](#void)
        - [`never`](#never)
    - [Type Assertions](#type-assertions)
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
2. You usually want to avoid this, though, because any isn’t type-checked. Use the compiler flag `noImplicitAny` to flag any implicit any as an error.
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
3. 上面的例子可以看到，`undefined` 和 `null` 可能会导致以外的错误。在 tsconfig.json 中设置
`"strictNullChecks": true` 可以禁止这种赋值，使得 `null` 和 `undefined` 只能赋值给 `void` 和它们自身。

    
## 对象类型
### 数组的两种声明方式
1. 第一种
    ```ts
    let list: number[] = [1, 2, 3];
    ```
2. 第二种方式是使用数组泛型，`Array<元素类型>`
    ```ts
    let list: Array<number> = [1, 2, 3];
    ```

### `ReadonlyArray`
    ```ts
    function doStuff(values: ReadonlyArray<string>) {
        const copy = values.slice();
        console.log(`The first value is ${values[0]}`);
    
        values.push("hello!"); // 编译报错
        // Property 'push' does not exist on type 'readonly string[]'.
    }   
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

### `enum`
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
    let colorName :string = Color[3];
    console.log(colorName); // "Blue"
    ```


## 其他和函数相关的一些类型
### `void`
1. 用来表示函数没有返回值
    ```ts
    function warnUser(): void {
        console.log("This is my warning message");
    }
    ```
2. 虽然可以声明 `void` 类型变量，但是只能赋值 `undefined` 和 `null`
    ```ts
    let unusable: void = undefined;
    ```

### `never`
1. Some functions never return a value:
    ```ts
    function fail(msg: string): never {
        throw new Error(msg);
    }
    ```
2. The `never` type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.
3. `never` also appears when TypeScript determines there’s nothing left in a union.
    ```ts
    function fn(x: string | number) {
        if (typeof x === "string") {
            // do something
        } else if (typeof x === "number") {
            // do something else
        } else {
            x; // has type 'never'!
        }
    }
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


## References
* [中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)
* [英文文档](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)