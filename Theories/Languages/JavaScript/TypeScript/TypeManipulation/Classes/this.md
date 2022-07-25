# this


## `this` at Runtime in Classes
1. 如果要在方法中将 `this` 绑定到当前类的实例，在 JS 中需要用到箭头函数
    ```js
    class MyClass {
        name = "MyClass";
        getName = () => {
            return this.name;
        };
    }
    const c = new MyClass();
    const g = c.getName;
    console.log(g()); // "MyClass"
    ```
2. This has some trade-offs
    * The `this` value is guaranteed to be correct at runtime, even for code not checked with TypeScript
    * This will use more memory, because each class instance will have its own copy of each function defined this way.
    * You can’t use `super.getName` in a derived class, because there’s no entry in the prototype chain to fetch the base class method from
        ```js
        class MyClass {
            name = "MyClass";
            getName = () => {
                return this.name;
            };
        }
        class Child extends MyClass {
            foo () {
                return super.getName();
                // TypeError: (intermediate value).getName is not a function
            }
        }

        const c = new Child();
        c.foo();
        ```
3. TS 提供了 **`this` 参数** 来实现另一种解决方案。

### `this` parameters
1. TypeScript checks that calling a function with a `this` parameter is done so with a correct context. 通过指定 `this` 参数来指明一个类型，TS 会要求这个函数在调用时的 `this` 必须是 `this` 参数指定的类型
    ```ts
    interface AgedObj {age: number}


    function foo (this: AgedObj) {
        console.log(this.age);
    }

    let obj = {
        age: 22,
        name: "33",
        bar: foo,
    };

    obj.bar(); // Ok

    foo(); // Error
    // The 'this' context of type 'void' is not assignable to method's 'this' of type 'AgedObj'.
    ```
2. 上面的例子中，`obj.bar()` 作为方法调用，`this` 是 `obj`，符合 `AgedObj` 类型要求。但直接调用时，默认的 `this` 类型是 `void`，不符合 `this` 参数指定的类型。不懂为什么 `obj` 有多余的属性却仍然符合。
3. This method makes the opposite trade-offs of the arrow function approach
    * JavaScript callers might still use the class method incorrectly without realizing it
    * Only one function per class definition gets allocated, rather than one per class instance
    * Base method definitions can still be called via `super`.


## `this` Types
1. 在 class 中有一个特殊类型 `this`，它可以 **动态的** 表示当前类的类型
    ```ts
    class Box {
        contents: string = "";
        set(value: string) {
            // set 方法的类型如下，它的返回值就是 this 类型
            // (method) Box.set(value: string): this
            this.contents = value;
            return this;
        }
    }
    ```
2. `Box` 的子类调用继承的 `set` 方法，因为返回值类型是动态的 `this` 而非静态固定的 `Box`，所以返回的类型就是子类
    ```ts
    class ClearableBox extends Box {
        clear() {
            this.contents = "";
        }
    }

    const a = new ClearableBox();
    const b = a.set("hello");
    // const b: ClearableBox
    ```
3. 使用 `this` 来声明类型
    ```ts
    class Box {
        content: string = "";
        sameAs(other: this) {
            return other.content === this.content;
        }
    }

    class DerivedBox extends Box {
        otherContent: string = "?";
    }

    const base = new Box();
    const derived = new DerivedBox();
    derived.sameAs(base); // Error
    // Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
    //   Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'
    ```
4. `sameAs` 方法的参数类型是动态的 `this`，所以 `Box` 调用时参数类型就是 `Box`，`DerivedBox` 调用时参数类型就是 `DerivedBox`。

### `this`-based type guards
TODO