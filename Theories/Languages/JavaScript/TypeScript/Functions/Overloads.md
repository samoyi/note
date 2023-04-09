# Overloads


<!-- TOC -->

- [Overloads](#overloads)
    - [函数重载的概念](#函数重载的概念)
    - [TypeScript 中的情况](#typescript-中的情况)
    - [函数调用时不能使用实现签名](#函数调用时不能使用实现签名)
    - [References](#references)

<!-- /TOC -->


## 函数重载的概念
1. In some programming languages, function overloading or method overloading is the ability to create multiple functions of the same name with different implementations. 
2. Calls to an overloaded function will run a specific implementation of that function appropriate to the context of the call, allowing one function call to perform different tasks depending on context.
3. 下面是 C++ 中的例子
    ```cpp
    #include <iostream>
    using namespace std;

    void print(int i) {
        cout << " Here is int " << i << endl;
    }
    void print(double f) {
        cout << " Here is float " << f << endl;
    }
    void print(char const *c) {
        cout << " Here is char* " << c << endl;
    }

    int main() {
        print(10);    // Here is int 10 
        print(10.10); // Here is float 10.1 
        print("ten"); // Here is char* ten
        return 0;
    }
    ```

## TypeScript 中的情况
1. 有时我们的 JavaScript 函数虽然是在做一件事情，但可能接受不同的参数，然后相应的有不同的处理逻辑。例如 `new Date()` 用来创建一个 `Date` 实例，但可以接受不同形式的参数，然后对参数进行不同形式的处理。
2. `new Date()` 可以接受 4 种情况的参数，我们这里封装一个 `makeDate` 函数，只接受其中的两种情况：毫秒数或者是年月日。在 TypeScript 中，我们可以通过 **重载签名**（overload signatures） 来实现函数重载。下面是两种情况的函数签名
    ```ts
    function makeDate(timestamp: number): Date;
    function makeDate(m: number, d: number, y: number): Date;
    ```
3. 两个重载签名说明 `makeDate` 可以接受两种情况的参数：一个 `number` 类型参数表示时间戳，三个 `number` 类型参数表示年月日。
4. 然后我们要编写 `makeDate` 的具体实现，该实现也有一个 **实现签名**（implementation signature），它要兼容上面的重载签名
    ```ts
    function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
        // 函数实现内部需要兼容两种重载签名的处理逻辑
        if (d !== undefined && y !== undefined) {
            return new Date(y, mOrTimestamp, d);
        } else {
            return new Date(mOrTimestamp);
        }
    }
    ```
5. 可以看到，不管是按照第一种重载签名传一个 `number` 类型参数，还是按照第二种重载签名传三个 `number` 类型参数，都可以满足实现签名的参数类型 `(mOrTimestamp: number, d?: number, y?: number)` 约束。
6. 所以下面两种调用都是可以的
    ```ts
    const d1 = makeDate(12345678); // 符合第一个重载签名
    const d2 = makeDate(5, 5, 5);  // 符合第二个重载签名
    ```
7. 实现签名必须要兼容所有的重载签名
    ```ts
    // 这个例子中没有兼容其中一个重载签名的参数类型
    function fn(x: boolean): void;
    function fn(x: string): void; // This overload signature is not compatible with its implementation signature.
    function fn(x: boolean) {}
    ```
    ```ts
    // 这个例子中没有兼容其中一个重载签名的返回值类型
    function fn(x: string): string;
    function fn(x: number): boolean; // This overload signature is not compatible with its implementation signature.
    function fn(x: string | number) {
        return "oops";
    }
    ```

## 函数调用时不能使用实现签名
1. 函数调用时只能使用重载签名，不能使用实现签名
    ```ts
    const d3 = makeDate(1, 3);
    // No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
    ```
2. 如果使用实现签名 `(mOrTimestamp: number, d?: number, y?: number)`，那就是要接受一个 `number` 类型参数，然后两个可选的 `number` 类型参数，所以 `makeDate(1, 3)` 应该是可以的。
3. 但实现签名只是用来兼容若干个重载签名的，调用时真正使用的还是其中某一个重载签名。
4. 下面是另一个例子。这样实现函数重载是没有问题的，调用 `len` 时可以传递一个字符串或者一个数组，来满足两个重载签名之一
    ```ts
    function len(s: string): number;
    function len(arr: any[]): number;
    function len(x: any) {
        return x.length;
    }
    ```
5. 但如果这样调用就会编译报错
    ```ts
    len(Math.random() > 0.5 ? "hello" : [0]);
    // No overload matches this call.
    //   Overload 1 of 2, '(s: string): number', gave the following error.
    //     Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
    //       Type 'number[]' is not assignable to type 'string'.
    //   Overload 2 of 2, '(arr: any[]): number', gave the following error.
    //     Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
    //       Type 'string' is not assignable to type 'any[]'.
    ```
6. 可以看到，这里的参数类型实际上是 `number[] | "hello"`，所以它既不满足第一个重载签名也不满足第二个重载签名。
7. 这种参数数量和返回值相同的情况下，不使用重载就可以很好地实现
    ```ts
    function len(x: any[] | string) {
        return x.length;
    }
    ```
8. Always prefer parameters with union types instead of overloads when possible.


## References
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)