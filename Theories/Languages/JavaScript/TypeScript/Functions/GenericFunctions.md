# Generic Functions

<!-- TOC -->

- [Generic Functions](#generic-functions)
    - [描述类型关系](#描述类型关系)
    - [Constraints](#constraints)
    - [Specifying Type Arguments](#specifying-type-arguments)
    - [Guidelines for Writing Good Generic Functions](#guidelines-for-writing-good-generic-functions)
        - [Push Type Parameters Down](#push-type-parameters-down)
        - [Use Fewer Type Parameters](#use-fewer-type-parameters)
        - [Type Parameters Should Appear Twice](#type-parameters-should-appear-twice)
    - [References](#references)

<!-- /TOC -->


## 描述类型关系
1. 有时我们的函数并不关心具体的参数和返回值是什么，之关系参数和返回值之间的关系，或者参数之间的关系。比如我们希望一个函数的参数是数组，而返回值是数组第一项，此时我们并不关心具体类型，只是要求返回值的类型应该和参数数组项的类型相同。
2. 因为不关心参数类型，如果不使用泛型函数，那么参数只能使用 `any[]` 类型才行
    ```ts
    function firstElement(arr: any[]) {
        return arr[0];
    }
    ```
3. 现在从功能上已经实现了，但从类型上来说，返回值的类型是 `any`，因此严格来说它不能算是 `any[]` 数组项的类型，这里并没有约束关系。试着调用一下，然后查看函数的类型
    ```ts
    firstElement([1, 2, 3]) // function firstElement(arr: any[]): any
    ```
4. 使用泛型函数可以明确的定义这种情况下的类型约束，它通过在函数签名中定义一个类型参数来实现
    ```ts
    function firstElement<Type>(arr: Type[]): Type | undefined {
        return arr[0];
    }
    ```
5. 现在再试着调用一下
    ```ts
    firstElement(["a", "b", "c"]); // function firstElement<string>(arr: string[]): string | undefined
    firstElement([1, 2, 3]);       // function firstElement<number>(arr: number[]): number | undefined
    firstElement([]);              // function firstElement<never>(arr: never[]): undefined
    ```
    通过传递不同类型的数组，TS 推断出类型参数的类型值，进而在参数和返回值之间建立了明确的类型关系。
6. 多个类型参数的情况
    ```ts
    function my_map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
        return arr.map(func);
    }

    const parsed = my_map(["1", "2", "3"], (n) => parseInt(n)); 
    // function my_map<string, number>(arr: string[], func: (arg: string) => number): number[]
    ```
    TS 推断出此时的类型参数 `Input` 和 `Output` 分别 `string` 和 `number`。
7. 不懂，上面的例子都是约束返回值和参数之间的关系，但是只要通过函数的内部实现就可以实现这种约束，比如最初没有用到泛型的 `firstElement`，它内部就明确返回数组项，那就是参数数组项的类型。这种情况下看起来只是从类型的名字上没有明确，但功能上完全和使用泛型没区别。不懂这种泛型还存在其他用途把。
8. 但是如果泛型是用来约束参数之间的类型关系，那就很有用了，因为参数是调用者传递的，并不能像返回值那样可以在函数体内通过逻辑表达出类型
    ```ts
    function my_indexOf<Type>(arr: Type[], ele: Type) {
        return arr.indexOf(ele);
    }

    console.log( my_indexOf([1, 2, 3], "2") );
    // 报错：Argument of type 'string' is not assignable to parameter of type 'number'.
    ```


## Constraints
1. 上面的泛型函数中，我们并没有限定参数的类型，任意类型都可以，只要符合类型关系之间的约束就行。但有时我们编写的函数并不适用所有的类型，而只适用于一部分类型，此时我们就需要把泛型的类型范围进行约束。
2. 例如我们编写一个函数，希望比较两个参数谁的 `length` 属性更大，此时我们不仅要约束两个参数类型相同，还要约束参数类型是必须要 `length` 属性的类型。如果不对具体类型进行约束，编译就会报错，因为不能保证传进来的参数带有 `length` 属性
    ```ts
    function longer<Type>(a: Type, b: Type) {
        if (a.length >= b.length) { // Property 'length' does not exist on type 'Type'.
            return a;
        } else {
            return b;
        }
    }
    ```
3. 我们可以约束 `Type` 只能是数组或者字符串
    ```ts
    function longer<Type extends any[]|string>(a: Type, b: Type) {
        if (a.length >= b.length) {
            return a;
        } else {
            return b;
        }
    }

    const longerArray = longer([1, 2], [1, 2, 3]); // OK
    const longerString = longer("alice", "bob"); // OK
    const notOK = longer(10, 100); // Error
    // Argument of type 'number' is not assignable to parameter of type 'string | any[]'.
    ```
4. 也可以更宽泛的约束它是有 `length` 属性且值为 `number` 类型的对象
    ```ts
    function longer<Type extends { length: number }>(a: Type, b: Type) {
        if (a.length >= b.length) {
            return a;
        } else {
            return b;
        }
    }

    const longerArray = longer([1, 2], [1, 2, 3]); // OK
    const longerString = longer("alice", "bob"); // OK
    const notOK = longer(10, 100); // Error
    // Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
    ```
5. 注意泛型约束使用的操作符是 `extends`，所以 `extends` 前面的值类似于后面值的 “子类型”，而不是相同的类型。看下面的例子是错误的
    ```ts
    function minimumLength<Type extends { length: number }>(
        obj: Type,
        minimum: number
    ): Type {
        if (obj.length >= minimum) {
            return obj;
        } else {
            return { length: minimum }; // Error
            // Type '{ length: number; }' is not assignable to type 'Type'.
            //     '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
        }
    }
    ```
    `minimumLength` 声明的返回值类型是 `Type`，它是 `{ length: number }` 的子类型而并不是 `{ length: number }` 本身，`Type` 很可能还会有 `length` 以外的其他属性，所以两者并不一样。


## Specifying Type Arguments
1. 在调用泛型函数式经常不需要明确指明类型参数的类型，TS 可以自己进行推断。但有些情况下并不能进行推断。看下面的例子
    ```ts
    function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
        return arr1.concat(arr2);
    }
    combine([1, 2, 3], ["hello"]); // Error - Type 'string' is not assignable to type 'number'.
    ```
2. `[1, 2, 3].concat(["hello"])` 在 JS 中是一个合理的操作，但在这里却出错了。因为 TS 通过 `arr1` 的 `[1, 2, 3]` 推断出 `Type` 是 `number`，然后也就期望 `arr2` 的类型是 `number[]`，所以导致了错误。
3. 在上面的调用中，我们期待的参数类型实际上是 `number | string`，因此在调用泛型函数时可以明确的指明类型参数为该类型，来解决这一问题
    ```ts
    combine<number | string>([1, 2, 3], ["hello"]); // OK
    ```


## Guidelines for Writing Good Generic Functions
### Push Type Parameters Down
1. 看下面两个相似的泛型函数
    ```ts
    function firstElement1<Type>(arr: Type[]) {
        return arr[0];
    }

    function firstElement2<Type extends any[]>(arr: Type) {
        return arr[0];
    }

    const a = firstElement1([1, 2, 3]); // function firstElement1<number>(arr: number[]): number
    const b = firstElement2([1, 2, 3]); // function firstElement2<number[]>(arr: number[]): any
    ```
2. 从函数本身的功能来说都是一样的，但是第一个函数 TS 可以推断出它的返回值类型就是 `Type` 对应的类型，但第二个函数无法进行推断，因为 `Type` 可能是任意类型的数组，所以返回值类型也只能是 `any`。
3. When possible, use the type parameter itself rather than constraining it.

### Use Fewer Type Parameters
1. 看下面两个泛型函数
    ```ts
    function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
        return arr.filter(func);
    }

    function filter2<Type, Func extends (arg: Type) => boolean>(
        arr: Type[],
        func: Func
    ): Type[] {
        return arr.filter(func);
    }
    ```
2. 它们在功能上是一样的，但是如果在调用时要手动指明泛型类型参数，第二个函数就必须指明两个类型参数。
3. 但其实第二个参数是没有必要的，因为类型参数的意义就是为了约束参数与返回值之间或者参数与参数之间的类型，例如 `Type` 就既出现在了参数类型中也出现在了返回值类型中，进而约束了两者之间的类型。但 `Func` 并没有这样的功能。
4. Always use as few type parameters as possible.

### Type Parameters Should Appear Twice
1. Sometimes we forget that a function might not need to be generic
    ```ts
    function greet<Str extends string>(s: Str) {
        console.log("Hello, " + s);
    }
    
    greet("world");
    ```
2. We could just as easily have written a simpler version:
    ```ts
    function greet(s: string) {
        console.log("Hello, " + s);
    }
    ```
3. Remember, type parameters are for relating the types of multiple values. If a type parameter is only used once in the function signature, it’s not relating anything.
4. If a type parameter only appears in one location, strongly reconsider if you actually need it.


## References
* [Generic Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions)