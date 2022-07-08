# Member Visibility


<!-- TOC -->

- [Member Visibility](#member-visibility)
    - [`public`](#public)
    - [`protected`](#protected)

<!-- /TOC -->


## `public`
The default visibility of class members is `public`. A public member can be accessed anywhere.


## `protected`
1. `protected` 的成员只能在当前类内部和它的后代类内部访问到
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
            // 可以在 Greeter 子类内部访问 getName
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