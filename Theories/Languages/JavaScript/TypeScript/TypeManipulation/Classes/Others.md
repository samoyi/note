# Others


<!-- TOC -->

- [Others](#others)
    - [Generic Classes](#generic-classes)
        - [Type Parameters in Static Members](#type-parameters-in-static-members)
    - [Parameter Properties](#parameter-properties)
    - [Class Expressions](#class-expressions)

<!-- /TOC -->


## Generic Classes
1. Classes, much like interfaces, can be generic. When a generic class is instantiated with `new`, its type parameters are inferred the same way as in a function call
    ```ts
    class Box<Type> {
        contents: Type;
        constructor(value: Type) {
            this.contents = value;
        }
    }

    const b = new Box("hello!");
    // const b: Box<string>

    b.contents = 22; // Error
    // Type 'number' is not assignable to type 'string'.
    ```

### Type Parameters in Static Members
1. This code isn’t legal
    ```ts
    class Box<Type> {
        static defaultValue: Type; // Error
        // Static members cannot reference class type parameters.
    }
    ``` 
2. Remember that types are always fully erased! At runtime, there’s only one `Box.defaultValue` property slot. This means that setting `Box<string>.defaultValue` (if that were possible) would also change `Box<number>.defaultValue` - not good. The static members of a generic class can never refer to the class’s type parameters. 不懂，但从上面的例子看，泛型参数是实例化时提供的，而且不同的实例化会提供不同的泛型参数。但是显然静态属性应该是不需要实例化的，而且也不可能根据不同的实例变化类型。


## Parameter Properties
通过给构造函数的参数添加 `public`、`private`、`protected` 或 `readonly` 修饰符，可以把该参数转换为类的属性
```ts
class Params {
	constructor(
		public readonly x: number,
		protected y: number,
		private z: number
	) {
		// No body necessary
	}
}
const a = new Params(1, 2, 3);
console.log(a.x);
// (property) Params.x: number

console.log(a.z); // Error
// Property 'z' is private and only accessible within class 'Params'.
```


## Class Expressions
类似于函数表达式，类表达式本身不需要类名，你可以通过定义一个类名来引用它
```ts
const someClass = class <Type> {
	content: Type;
	constructor(value: Type) {
		this.content = value;
	}
};

const m = new someClass("Hello, world");
// const m: someClass<string>
```