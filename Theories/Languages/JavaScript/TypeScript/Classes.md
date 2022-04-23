# Classes


<!-- TOC -->

- [Classes](#classes)
    - [类的定义](#类的定义)
    - [`public`、`private` 和 `protected`](#publicprivate-和-protected)
        - [默认为 `public`](#默认为-public)
        - [`protected`](#protected)
        - [类型兼容](#类型兼容)
    - [`readonly` 修饰符](#readonly-修饰符)
        - [只读属性](#只读属性)
        - [参数属性](#参数属性)
    - [抽象类](#抽象类)
    - [TODO](#todo)
    - [References](#references)

<!-- /TOC -->


## 类的定义
```ts
class Greeter {
    greeting: string; // 定义有哪些实例属性

    constructor(message: string) {
        this.greeting = message;
    }

    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```


## `public`、`private` 和 `protected`
### 默认为 `public`
也可以明确的将一个成员标记成 `public`。我们可以用下面的方式来重写上面的 `Animal` 类
```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### `protected`
1. `protected` 修饰符与 `private` 修饰符的行为很相似，但有一点不同，`protected` 成员在派生类中仍然可以访问
    ```ts
    class Animal {
        private name: "33";
        protected age: 22;
    }

    class Rhino extends Animal {
        foo () {
            this.name; // Property 'name' is private and only accessible within class 'Animal'.
            this.age; // 正常
        }
    }

    let rhino = new Rhino();
    rhino.name; // Property 'name' is private and only accessible within class 'Animal'.
    rhino.age; // Property 'age' is protected and only accessible within class 'Animal' and its subclasses.
    ```
2. 构造函数也可以被标记成 `protected`，这样这个类就不能被实例化，只能被继承
    ```ts
    class Person {
        protected name: string;
        // Person 的 constructor 只能在它的子类被访问
        protected constructor(theName: string) { this.name = theName; }
    }

    // Employee 能够继承 Person
    class Employee extends Person {
        private department: string;

        constructor(name: string, department: string) {
            super(name);
            this.department = department;
        }

        public getElevatorPitch() {
            return `Hello, my name is ${this.name} and I work in ${this.department}.`;
        }
    }

    let howard = new Employee("Howard", "Sales");
    // 下面是在子类之外访问 Person 的构造函数
    // 错误: Constructor of class 'Person' is protected and only accessible within the class declaration.
    let john = new Person("John"); 
    ```

### 类型兼容
1. TypeScript 使用的是结构性类型系统。当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。
2. 然而，当我们比较带有 `private` 或 `protected` 成员的类型的时候，情况就不同了。如果其中一个类型里包含一个 `private` 成员，那么只有当另外一个类型中也存在这样一个 `private` 成员，并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。对于 `protected` 成员也适用这个规则
    ```ts
    class Animal {
        private name: string;
        constructor(theName: string) { this.name = theName; }
    }

    class Rhino extends Animal {
        constructor() { super("Rhino"); }
    }

    class Employee {
        private name: string;
        constructor(theName: string) { this.name = theName; }
    }

    let animal = new Animal("Goat");
    let rhino = new Rhino();
    let employee = new Employee("Bob");

    animal = rhino; // 正常
    animal = employee; // 错误
    // Type 'Employee' is not assignable to type 'Animal'.
    //   Types have separate declarations of a private property 'name'.
    ```


## `readonly` 修饰符
### 只读属性
只读属性只能在构造函数中赋值
```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }

    foo () {
        this.name = "333"; // 错误
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误
```

### 参数属性
1. 构造函数的参数名前面加 `readonly` 的话，这个参数会作为一个只读的实例属性，而不仅仅是一个参数
    ```ts
    class Octopus {
        readonly numberOfLegs: number = 8;
        constructor(readonly name: string) {
        }
    }
    let dad = new Octopus("Man with the 8 strong legs");
    dad.name = "Man with the 3-piece suit"; // 这里的错误还是说 name 是只读的，而不是不存在
    ```
2. 如果参数前面不加 `readonly`，则它就只是一个普通参数。上面的例子中如果不加 `readonly`，报的错就是说 `name` 不存在。


## 抽象类
1. 抽象类做为其它派生类的基类使用，它们一般不会直接被实例化。不同于接口，抽象类可以包含成员的实现细节。 
2. `abstract` 关键字是用于定义抽象类和在抽象类内部定义抽象方法
    ```ts
    abstract class Animal {
        abstract makeSound(): void;
        move(): void {
            console.log('roaming the earch...');
        }
    }
    ```
3. 抽象类中的抽象方法不包含具体实现，必须在派生类中实现。抽象方法的语法与接口方法相似，两者都是定义方法签名但不包含方法体
    ```ts
    abstract class Department {

        constructor(public name: string) {
        }

        printName(): void {
            console.log('Department name: ' + this.name);
        }

        abstract printMeeting(): void; // 必须在派生类中实现
    }

    class AccountingDepartment extends Department {

        constructor() {
            super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
        }

        printMeeting(): void {
            console.log('The Accounting Department meets each Monday at 10am.');
        }

        generateReports(): void {
            console.log('Generating accounting reports...');
        }
    }

    let department: Department; // 允许创建一个对抽象类型的引用
    department = new Department(); // 错误: 不能创建一个抽象类的实例
    department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
    department.printName();
    department.printMeeting();
    department.generateReports(); // 错误: 方法在声明的抽象类中不存在
    ```
4. 抽象方法可以包含访问修饰符。


## TODO
高级技巧


## References
* [中文文档](https://www.tslang.cn/docs/handbook/classes.html)