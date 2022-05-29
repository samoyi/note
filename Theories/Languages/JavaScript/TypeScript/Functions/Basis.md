# Functions


<!-- TOC -->

- [Functions](#functions)
    - [为函数指定参数和返回值类型](#为函数指定参数和返回值类型)
        - [函数声明的方式](#函数声明的方式)
        - [函数定义的方式](#函数定义的方式)
        - [完整写法](#完整写法)
    - [可选参数](#可选参数)
    - [默认参数](#默认参数)
    - [剩余参数](#剩余参数)
    - [匿名函数的 Contextual typing](#匿名函数的-contextual-typing)
    - [函数相关的一些类型](#函数相关的一些类型)
        - [`void`](#void)
        - [`never`](#never)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 为函数指定参数和返回值类型
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

      
## 可选参数
```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
```


## 默认参数
默认参数如果传了具体的参数，类型必须要相同
```ts
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

console.log(buildName("John", 22)); // 错误
```


## 剩余参数
使用数组形式来约束类型
```ts
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}
```

## 匿名函数的 Contextual typing
1. 看下面的例子
    ```ts
    const names = ["Alice", "Bob", "Eve"];
    
    names.forEach(function (s) {
        console.log(s.toUppercase()); 
        // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
    });
    ```
2. 回调匿名函数虽然没有指明参数类型，但通过它的调用环境可以判断出参数应该是字符串，进而判断出字符串没有 `toUppercase` 方法。


   
## 函数相关的一些类型
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


## TODO


## References
* [中文文档](https://www.tslang.cn/docs/handbook/functions.html)