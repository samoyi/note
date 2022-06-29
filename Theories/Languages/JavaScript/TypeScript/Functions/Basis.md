# Functions


<!-- TOC -->

- [Functions](#functions)
    - [对函数参数和返回值的描述](#对函数参数和返回值的描述)
        - [函数声明的方式](#函数声明的方式)
        - [函数定义的方式](#函数定义的方式)
        - [完整写法](#完整写法)
        - [Optional Parameters](#optional-parameters)
            - [Optional Parameters in Callbacks](#optional-parameters-in-callbacks)
        - [剩余参数](#剩余参数)
        - [匿名函数的 Contextual typing](#匿名函数的-contextual-typing)
        - [函数相关的一些类型](#函数相关的一些类型)
            - [`void`](#void)
            - [`object`](#object)
            - [`unknown`](#unknown)
            - [`never`](#never)
            - [`Function`](#function)
    - [定义一个整体的函数的类型](#定义一个整体的函数的类型)
        - [Function Type Expressions](#function-type-expressions)
        - [Call Signatures](#call-signatures)
        - [Construct Signatures](#construct-signatures)
    - [Assignability of Functions](#assignability-of-functions)
        - [Return type `void`](#return-type-void)
    - [References](#references)

<!-- /TOC -->


## 对函数参数和返回值的描述
### 函数声明的方式
```ts
function add(x: number, y: number): number {
    return x + y;
}
```
`add` 函数接收两个数值类型参数，返回数值类型。

### 函数定义的方式
```ts
let myAdd = function(x: number, y: number): number { return x + y; };
```  
`myAdd` 指向一个匿名函数函数，匿名函数的两个参数和返回值都是数值类型

### 完整写法
1. 定义普通变量时，会在定义的变量之后加上类型，例如
    ```ts
    let str :string = "hello";
    ```
2. 定义函数变量时如果要使用完整的写法，也可以按照这个结构
    ```ts
    let myAdd: (x: number, y: number) => number =
        function(x: number, y: number): number { return x + y; };
    ```
3. `myAdd` 的类型是 `(x: number, y: number) => number`，说明它是一个函数，并且进一步说明了参数和返回值的类型。
4. 后面的 `= function(x: number, y: number): number { return x + y; };` 就是对 `myAdd` 的具体赋值。
5. 等号右边的类型可以省略
    ```ts
    let myAdd: (x: number, y: number) => number = function(x, y) { return x + y; };
    ```

### Optional Parameters
1. 在参数名后面加上 `?` 可以表示可选参数
    ```ts
    function myFixed (num: number, digits?: number) {
        return num.toFixed(digits)
    }
    console.log( myFixed(3.1415926) );    // 3
    console.log( myFixed(3.1415926, 2) ); // 3.14
    ```
2. 可选参数指定了类型，但其实它真正的类型还要再加上一个 `undefined`。所以上面 `digits` 的实际类型是 `number | undefined`。

#### Optional Parameters in Callbacks
不懂，既然定义了 `callback` 可能有第二个参数，那么在内部调用 `callback` 难道不应该考虑到第二个参数存在的情况吗？为什么要故意不加第二个参数？

### 剩余参数
使用数组形式来约束类型
```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}
```

### 匿名函数的 Contextual typing
1. 看下面的例子
    ```ts
    const names = ["Alice", "Bob", "Eve"];
    
    names.forEach(function (s) {
        console.log(s.toUppercase()); 
        // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
    });
    ```
2. 回调匿名函数虽然没有指明参数类型，但通过它的调用环境可以判断出参数应该是字符串，进而判断出字符串没有 `toUppercase` 方法。

### 函数相关的一些类型
#### `void`
1. 用来表示函数没有 `return` 语句或者 `return` 后面没有值。下面三个函数的返回值类型都是 `void`
    ```ts
    function foo (){}
    const bar = () => {}
    function baz () {return}
    ```
2. In JavaScript, a function that doesn’t return any value will implicitly return the value `undefined`. However, `void` and `undefined` are not the same thing in TypeScript.
3. 虽然可以声明 `void` 类型变量，但是只能赋值 `undefined` 和 `null`
    ```ts
    let unusable: void = undefined;
    ```

#### `object`
The special type 1 refers to any value that isn’t a primitive. This is different from the empty object type `{ }`, and also different from the global type `Object`.

#### `unknown`
1. The `unknown` type represents any value. This is similar to the `any` type, but is safer because it’s not legal to do anything with an `unknown` value
    ```ts
    function f1(a: any) {
        a.b(); // OK
    }
    function f2(a: unknown) {
        a.b(); // Error - Object is of type 'unknown'.
    }
    ```
2. 这里说不能做任何事，其实是说不能对它的类型做出任何假设，或者说只能做那种任何类型都能做的事情
    ```ts
    function f2(a: unknown) {
        console.log(a); // OK
    }
    ```
3. This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.
4. Conversely, you can describe a function that returns a value of `unknown` type:
    ```ts
    function safeParse(s: string): unknown {
        return JSON.parse(s);
    }
    ```

#### `never`
1. Some functions never return a value，例如下面这个函数连 `undefined` 也不会返回
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

#### `Function`
1. The global type `Function` describes properties like `bind`, `call`, `apply`, and others present on all function values in JavaScript. 
2. It also has the special property that values of type `Function` can always be called;不懂 these calls return `any`: 
    ```ts
    function doSomething(f: Function) {
        return f(1, 2, 3);
    }
    ```
    This is an untyped function call and is generally best avoided because of the unsafe `any` return type.
3. If you need to accept an arbitrary function but don’t intend to call it, the type `() => void` is generally safer. 不懂，如果不调用那接收它干啥？


## 定义一个整体的函数的类型
### Function Type Expressions
1. 描述函数最简单的方式就是使用函数类型表达式，它的语法和箭头函数类似
    ```ts
    function greeter(fn: (a: string) => void) {
        fn("Hello, World");
    }
    
    function printToConsole(s: string) {
        console.log(s);
    }
    
    greeter(printToConsole);
    ```
2. 上面的 `(a: string) => void` 就是函数类型表达式，它说明 `greeter` 要接受的参数函数的类型：该函数有一个字符串参数，没有返回值。
3. 如果函数类型表达式中的参数没有指定类型，它就是隐式的 `any` 类型。
4. 函数类型表达式中的参数名是必须的，否则如果是 `(string) => void` 的话，`string` 就成了 `any` 类型的函数名了。
5. 也可以使用 `type` 来定义一个函数类型
    ```ts
    type GreetFunction = (a: string) => void;
    function greeter(fn: GreetFunction) {
        // ...
    }
    ```

### Call Signatures
1. 函数除了参数和返回值以外还可以有其他属性，如果用上面函数类型表达式的话就无法描述函数的属性。可以使用对象形式的调用签名来描述函数的属性
    ```ts
    type DescribableFunction = {
        (someArg: number): boolean; // 注意这里是 : 而不是 =>
        description: string;
    };
    function doSomething(fn: DescribableFunction) {
        console.log(fn.description + " returned " + fn(6));
    }

    function foo (n: number) {
        return n > 5;
    }
    foo.description = "This is foo:";

    doSomething(foo); // This is foo: returned true
    ```
2. 上面的对象签名中除了描述了函数的参数和返回值，还定义了一个 `description` 属性。注意对象签名中

### Construct Signatures
1. 可以通过调用签名的方式来实现构造函数签名
    ```ts
    type SomeObject = any;

    type SomeConstructor = {
        new (s: string): SomeObject;
    };
    function fn(ctor: SomeConstructor) {
        return new ctor("hello");
    }

    class Cons {
        constructor (str: string) {
            console.log(str + " world");
        }
    }

    fn(Cons) // hello world
    ```
2. 不懂，不用 `class` 直接使用普通函数要怎么实现
    ```ts
    function Cons (str: string) {
        console.log(str + " world");
        let obj: SomeObject;
        return obj;
    }

    fn(Cons) // 报错
    // Argument of type '(str: string) => any' is not assignable to parameter of type 'SomeConstructor'.
    //   Type '(str: string) => any' provides no match for the signature 'new (s: string): any'.
    ```
3. 有些函数既可以作为构造函数调用也可以作为普通函数调用，这时可以同时定义构造函数签名和普通的调用签名。例如 `Date` 作为构造函数可以接受 `string | number` 类型参数并返回 `Date` 类型对象，而直接调用时可以接受 `number` 类型参数并返回 `string` 类型。
    ```ts
    interface CallOrConstruct {
        new (s: string | number): Date;
        (n?: number): string;
    }

    function consCall(ctor: CallOrConstruct) {
        let obj = new ctor(22);
        console.log(typeof obj, obj);
    }
    function normalCall(ctor: CallOrConstruct) {
        let str = ctor(22)
        console.log(typeof str, str);
    }

    consCall(Date) // object Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
    normalCall(Date) // string Tue May 31 2022 11:36:15 GMT+0800 (中国标准时间)
    ```


## Assignability of Functions
### Return type `void`
1. The `void` return type for functions can produce some unusual, but expected behavior.
2. Contextual typing with a return type of `void` does not force functions to not return something. Another way to say this is a contextual function type with a `void` return type (`type vf = () => void`), when implemented, can return any other value, but it will be ignored
    ```ts
    type voidFunc = () => void;
    
    const fn: voidFunc = () => {
        return true;
    };
    ```
3. 上面这个返回布尔值的函数依然可以定义为 `voidFunc` 类型。但是 “it will be ignored”，所以看看 `fn` 的返回值
    ```ts
    const v = fn();
    console.log(typeof v); // boolean
    console.log(!!v); // An expression of type 'void' cannot be tested for truthiness.
    ```
4. 虽然函数返回了布尔值，但是 TS 的类型系统仍然是按照 `voidFunc` 的类型把它认为是 `void` 类型。
5. This behavior exists so that the following code is valid even though `Array.prototype.push` returns a number and the `Array.prototype.forEach` method expects a function with a return type of `void`
    ```ts
    const src = [1, 2, 3];
    const dst = [0];
    
    src.forEach((el) => dst.push(el));
    ```
    不懂，`forEach` 的回调的返回值为什么期望的类型是 `void` 而不是 `any`？
6. 但是注意，如果是定义函数时直接定义返回值的类型，而不是像上面 `fn` 那样定义函数整体的类型，则如果定义返回值为 `void`，那么返回值就必须是 `void`
    ```ts
    function fn(): void {
        return true; // Error - Type 'boolean' is not assignable to type 'void'.
    }
    ```


## References
* [中文文档](https://www.tslang.cn/docs/handbook/functions.html)
* [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)