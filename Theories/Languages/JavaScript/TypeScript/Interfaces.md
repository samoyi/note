# Interface


<!-- TOC -->

- [Interface](#interface)
    - [接口的基本用途](#接口的基本用途)
    - [可选属性](#可选属性)
    - [只读属性](#只读属性)
    - [额外的属性检查](#额外的属性检查)
    - [函数类型](#函数类型)
    - [可索引的类型](#可索引的类型)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 接口的基本用途
1. 下面的 `printLabel` 函数要求参数是一个对象，该对象必须要有一个名为 `label` 的属性，且该属性的值为字符串类型
    ```ts
    function printLabel(labelledObj: { label: string }) {
        console.log(labelledObj.label);
    }

    let myObj = { size: 10, label: "Size 10 Object" };
    printLabel(myObj);
    ```
2. 使用接口可以更直接的定义这个对象的类型
    ```ts
    interface LabelledValue {
        label: string;
    }

    function printLabel(labelledObj: LabelledValue) {
        console.log(labelledObj.label);
    }

    let myObj = {size: 10, label: "Size 10 Object"};
    printLabel(myObj);
    ```
3. 需要注意的是，我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。然而，如果是直接把对象字面量作为参数，编译器则会认为发生了错误（下面【额外的属性检查】部分详述）
    ```ts
    interface LabelledValue {
        label: string;
    }

    function printLabel(labelledObj: { label: string }) {
        console.log(labelledObj.label);
    }

    printLabel({ size: 10, label: "Size 10 Object" });
    // Object literal may only specify known properties, and 'size' does not exist in type '{ label: string; }'.
    ```
4. 还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。


## 可选属性
1. 接口里的属性不全都是必需的
    ```ts
    interface SquareConfig {
        color?: string;
        width?: number;
    }

    function createSquare(config: SquareConfig): {color: string; area: number} {
        let newSquare = {color: "white", area: 100};
        if (config.color) {
            newSquare.color = config.color;
        }
        if (config.width) {
            newSquare.area = config.width * config.width;
        }
        return newSquare;
    }

    let mySquare = createSquare({color: "black"});
    ```
2. 可选属性的好处之一是可以对可能存在的属性进行预定义。好处之二是可以捕获引用了不存在的属性时的错误。比如，我们故意将 `createSquare` 里的 `color` 属性名拼错，就会得到一个错误提示
    ```ts
    interface SquareConfig {
        color?: string;
        width?: number;
    }

    function createSquare(config: SquareConfig): { color: string; area: number } {
        let newSquare = {color: "white", area: 100};
        if (config.clor) { // 编译报错
            // Property 'clor' does not exist on type 'SquareConfig'
            newSquare.color = config.clor;
        }
        if (config.width) {
            newSquare.area = config.width * config.width;
        }
        return newSquare;
    }

    let mySquare = createSquare({color: "black"});
    ```


## 只读属性
1. 一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly` 来指定只读属性
    ```ts
    interface Point {
        readonly x: number;
        readonly y: number;
    }
    ```
2. 你可以通过赋值一个对象字面量来构造一个 `Point`。但之后 `x` 和 `y` 再也不能被改变了
    ```ts
    let p1: Point = { x: 10, y: 20 };
    p1.x = 5; // error!
    ```
3. TypeScript 具有 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改
    ```ts
    let ro: ReadonlyArray<number> = [1, 2, 3, 4];
    ro[0] = 12; // 编译错误：Index signature in type 'readonly number[]' only permits reading.
    ro.push(5); // 编译错误：Property 'push' does not exist on type 'readonly number[]'.
    ro.length = 100; // 编译错误：Cannot assign to 'length' because it is a read-only property.
    ```
4. 可以把普通数组赋值给只读数组，但不能进行相反操作
    ```ts
    let a: number[] = [1, 2, 3, 4];
    let ro: ReadonlyArray<number> = a;
    a = ro; // 编译错误：The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
    ```
5. 但如果你明确的知道自己要把不可读数组转换为可读数组，则可以使用类型断言
    ```ts
    let a: number[] = [1, 2, 3, 4];
    let ro: ReadonlyArray<number> = a;
    a = ro as number[];

    a[0] = 12; // 不会报错
    a.push(5); // 不会报错
    a.length = 100; // 不会报错
    ```


## 额外的属性检查
1. 把对象字面量赋值给变量或作为参数传递时，会被特殊对待而且会经过额外属性检查。如果一个对象字面量存在任何目标类型不包含的属性时，就会导致编译错误
    ```ts
    interface LabelledValue {
        label: string;
    }

    // 不会报错
    // let myObj = {size: 10, label: "Size 10 Object"};
    // let x :LabelledValue = myObj;

    // 编译报错
    let x :LabelledValue = { size: 10, label: "Size 10 Object" };
    ```
2. 通过类型断言可以绕过检查
    ```ts
    let x :LabelledValue = { size: 10, label: "Size 10 Object" } as LabelledValue;
    ```
3. 但是最佳的方式是能够添加一个字符串索引签名。如果 `LabelledValue` 还会带有任意数量的其它属性，那么我们可以这样定义它
    ```ts
    interface LabelledValue {
        label: string;
        [propName: string]: any;
    }
    ```
    这里表示是 `LabelledValue` 可以有任意数量的属性，并且只要它们不是 `label`，那么就无所谓它们的类型是什么。
4. 最后一种绕开额外属性检查的就是前面出现过的，将对象赋给变量。


## 函数类型
1. 为了使用接口表示函数类型，我们需要给接口定义一个调用签名
    ```ts
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }
    ```
2. 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。
    ```ts
    let mySearch: SearchFunc;
    mySearch = function(source: string, subString: string) {
        let result = source.search(subString);
        return result > -1;
    }
    ```
3. 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。比如，我们使用下面的代码重写上面的例子：
    ```ts
    let mySearch: SearchFunc;
    mySearch = function(src: string, sub: string): boolean {
        let result = src.search(sub);
        return result > -1;
    }
    ```
    函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。 
4. 如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 `SearchFunc` 类型变量。函数的返回值类型是通过其返回值推断出来的（此例是 `false` 和 `true`）。 
5. 如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与 `SearchFunc` 接口中的定义不匹配。


## 可索引的类型
1. 与使用接口描述函数类型差不多，我们也可以描述那些 “能够通过索引得到” 的类型，比如 `a[10]` 或 `ageMap["daniel"]`。
2. 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型
    ```ts
    // 任何 StringArray 类型的变量，它的 key 需要是数值，而 value 需要是字符串
    interface StringArray {
        [index: number]: string;
    }

    let myArray: StringArray;
    myArray = ["Bob", "Fred"];

    let myStr: string = myArray[0];
    ```
3.  可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number` 来索引时，JavaScript 会将它转换成 `string` 然后再去索引对象。TODO
    ```ts
    class Animal {
        name: string;
    }
    class Dog extends Animal {
        breed: string;
    }

    interface NotOkay {
        // 正确
        // [x: number]: Animal; 
        // [x: string]: Animal;

        // 正确
        // [x: number]: Dog; 
        // [x: string]: Animal;

        // 编译错误： 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
        [x: number]: Animal; 
        [x: string]: Dog;
    }
    ```
4. 索引可以设置为只读
    ```ts
    interface ReadonlyStringArray {
        readonly [index: number]: string;
    }
    let myArray: ReadonlyStringArray = ["Alice", "Bob"];
    myArray[2] = "Mallory"; // error!
    ```


## TODO
类类型
继承接口
混合类型
接口继承类


## References
* [中文文档](https://www.tslang.cn/docs/handbook/interfaces.html)