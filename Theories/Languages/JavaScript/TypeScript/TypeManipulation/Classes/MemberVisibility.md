# Member Visibility


<!-- TOC -->

- [Member Visibility](#member-visibility)
    - [`public`](#public)
    - [`protected`](#protected)
        - [Exposure of protected members](#exposure-of-protected-members)
        - [Cross-hierarchy protected access](#cross-hierarchy-protected-access)
    - [`private`](#private)
        - [Cross-instance private access](#cross-instance-private-access)

<!-- /TOC -->


## `public`
The default visibility of class members is `public`. A public member can be accessed anywhere.


## `protected`
`protected` 的成员只能在当前类内部和它的后代类内部访问到
```ts
class Greeter {
    public greet() {
        // 可以在 Greeter 类内部访问 getName
        console.log("Hello, " + this.getName()); 
    }
    protected getName() {
        return "world";
    }
}

class SpecialGreeter extends Greeter {
    public howdy() {
        // 可以在 Greeter 子类内部访问 getName；；
        console.log("Howdy, " + this.getName());
    }
}

class ChineseGreeter extends SpecialGreeter {
    public nihao() {
        // 可以在 Greeter 子类内部访问 getName
        console.log("你好，" + this.getName());
    }
}


const g = new Greeter();
g.greet(); // Ok

const sg = new SpecialGreeter();
sg.howdy(); // Ok

const cg = new ChineseGreeter();
cg.nihao(); // Ok


g.getName(); // Error - 不能在 Greeter 类外部访问到 getName
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.

sg.getName(); // Error - 不能在 Greeter 的后代类外部访问到 getName
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.

cg.getName(); // Error - 不能在 Greeter 的后代类外部访问到 getName
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

### Exposure of protected members
1. 子类如果想把从父类继承来的 `protected` 字段暴露出来，可以将该字段重新声明为 `public`
    ```ts
    class Base {
        protected m = 10;
    }

    class Derived extends Base {
        // 声明时没有使用修饰符，默认为 public
        m = 15;
    }

    const d = new Derived();
    console.log(d.m); // 15
    ```
2. 因为可以这样暴露出 `protected` 的字段，所以要注意子类如果要重写父类字段而不希望暴露时，不能遗漏掉 `protected` 修饰符。

### Cross-hierarchy protected access
1. 还有一种特殊的限制访问要注意。前面说了，`protected` 的字段可以在子类内部被访问，因此下面例子中的错误看起来有些不是很容易理解
    ```ts
    class Parent {
        protected x: number = 1;
    }

    class Child extends Parent {
        foo (c: Child) {
            console.log(c.x); // Ok
        }
        bar (p: Parent) {
            console.log(p.x); // Error
            // Property 'x' is protected and only accessible through an instance of class 'Child'. 
            // This is an instance of class 'Parent'.
        }
    }
    ```
2. `Child` 的继承了 `Parent`，它可以在内部访问自身的 `x` 属性，但不能在内部访问父类的 `x` 属性。也就是说，一个 `protected` 字段，不仅不能在类的外部访问到，甚至也不能在子类的内部访问到。
3. Java, for example, considers this to be legal. On the other hand, C# and C++ chose that this code should be illegal. TypeScript sides with C# and C++ here.


## `private`
1. `private` is like `protected`, but doesn’t allow access to the member even from subclasse
    ```ts
    class Base {
        private x = 0;
    }
    const b = new Base();
    console.log(b.x); // Error
    // Property 'x' is private and only accessible within class 'Base'.

    class Derived extends Base {
        showX() {
            console.log(this.x); // Error
            // Property 'x' is private and only accessible within class 'Base'.
        }
    }
    ```
2. Because `private` members aren’t visible to derived classes, a derived class can’t increase its visibility
    ```ts
    class Base {
        private x = 0;
    }
    class Derived1 extends Base {
        // Class 'Derived1' incorrectly extends base class 'Base'.
        //   Property 'x' is private in type 'Base' but not in type 'Derived1'.
        x = 1;
    }
    class Derived2 extends Base {
        // Class 'Derived2' incorrectly extends base class 'Base'.
        //   Property 'x' is private in type 'Base' but not in type 'Derived2'.
        protected x = 1;
    }
    ```
3. 也不能在子类中声明同名 `private` 成员
    ```ts
    class Derived3 extends Base {
        // Class 'Derived3' incorrectly extends base class 'Base'.
        //   Types have separate declarations of a private property 'x'
        private x = 1;
    }
    ```

### Cross-instance private access
Different OOP languages disagree about whether different instances of the same class may access each others’ `private` members. TypeScript does allow cross-instance `private` access
```ts
class A {
    private x = 10;

    public sameAs(other: A) {
        // No error
        return other.x === this.x;
    }
}

const a1 = new A();
const a2 = new A();
a1.sameAs(a2);
```