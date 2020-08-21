# Single responsibility principle


<!-- TOC -->

- [Single responsibility principle](#single-responsibility-principle)
    - [设计思想](#设计思想)
    - [这里关于 “接口” 的定义](#这里关于-接口-的定义)
    - [Java 的抽象类](#java-的抽象类)
        - [类型检查的限制](#类型检查的限制)
        - [通过向上转型来解决](#通过向上转型来解决)
        - [抽象类解决的问题](#抽象类解决的问题)
    - [`interface`](#interface)
        - [`interface` 的概念](#interface-的概念)
        - [实现](#实现)
    - [JavaScript 的情况](#javascript-的情况)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 这里关于 “接口” 的定义
1. 当我们谈到接口的时候，通常会涉及以下三种含义：
    * 我们经常说一个库或者模块对外提供了某某 API 接口。通过主动暴露的接口来通信，可以隐藏软件系统内部的工作细节。这也是我们最熟悉的第一种接口含义。
    * 第二种接口是一些语言提供的关键字，比如 Java 的 `interface`。`interface` 关键字可以产生一个完全抽象的类。这个完全抽象的类用来表示一种契约，专门负责建立类与类之间的联系。
    * 第三种接口即是我们谈论的 “面向接口编程” 中的接口，接口的含义在这里体现得更为抽象。用《设计模式》中的话说就是：接口是对象能响应的请求的集合。
2. 本篇主要讨论的是第二种和第三种接口。


## Java 的抽象类
### 类型检查的限制
1. 目前我们有一个鸭子类 `Duck`，还有一个让鸭子发出叫声的 `AnimalSound` 类，该类有一个 `makeSound` 方法，接收 `Duck` 类型的对象作为参数
    ```java
    public class Duck {
        public void makeSound(){
            System.out.println( "gaga" );
        }
    }

    public class AnimalSound {
        public void makeSound( Duck duck ){    // 参数类型为 Duck
            duck.makeSound();
        }
    }

    public class Test {
        public static void main( String args[] ){
            AnimalSound animalSound = new AnimalSound();
            Duck duck = new Duck();
            animalSound.makeSound( duck );    // 输出：gaga
        }
    }
    ```
2. 后来动物世界里又增加了一些鸡，现在我们想让鸡也叫唤起来，但发现这是一件不可能完成的事情，因为 `AnimalSound` 类的 `sound` 方法的参数指定了 `Duck` 类型
    ```java
    public class Chicken {
        public void makeSound(){
            System.out.println( "gege" );
        }
    }

    public class Test {
        public static void main( String args[] ){
            AnimalSound animalSound = new AnimalSound();
            Chicken chicken = new Chicken();
            animalSound.makeSound( chicken );
            // 报错，animalSound.makeSound 只能接受 Duck 类型的参数
        }
    }
    ```
3. 在享受静态语言类型检查带来的安全性的同时，我们也失去了一些编写代码的自由。

### 通过向上转型来解决
1. 这个问题可以得到解决，因为静态类型语言通常设计为可以 “向上转型”。
2. 当给一个类变量赋值时，这个变量的类型既可以使用这个类本身，也可以使用这个类的超类。就像看到天上有只麻雀，我们既可以说 “一只麻雀在飞”，也可以说 “一只鸟在飞”，甚至可以说成 “一只动物在飞”。
3. 通过向上转型，对象的具体类型被隐藏在 “超类型” 身后，这些对象就能在类型检查系统的监视下相互替换使用，这样才能看到对象的多态性。
4. 进行向上转型的工具就是抽象类或者 `interface`。我们这里使用抽象类。实现鸡和鸭的抽象类 `Animal`
    ```java
    public abstract class Animal {
        abstract void makeSound();   // 抽象方法
    }
    ```
5. 然后让 `Duck` 类和 `Chicken` 类都继承自抽象类 `Animal`
    ```java
    public class Chicken extends Animal{
        public void makeSound(){
            System.out.println( "咯咯咯" );
        }
    }

    public class Duck extends Animal{
        public void makeSound(){
            System.out.println( "嘎嘎嘎" );
        }
    }
    ```
6. 现在剩下的就是让 `AnimalSound` 类的 `makeSound` 方法接收 `Animal`类型的参数，而不是具体的 `Duck` 类型或者 `Chicken` 类型
    ```java
    public class AnimalSound{
        public void makeSound( Animal animal ){ 
            animal.makeSound();
        }
    }

    public class Test {
        public static void main( String args[] ){
            AnimalSound animalSound = new AnimalSound ();
            Animal duck = new Duck();                       // 向上转型
            Animal chicken = new Chicken();                 // 向上转型
            animalSound.makeSound( duck );
            animalSound.makeSound( chicken ); 
        }
    }
    ```

### 抽象类解决的问题
1. 抽象类在这里主要有以下两个作用：
    * 向上转型。让 `Duck` 对象和 `Chicken` 对象的类型都隐藏在 `Animal` 类型身后，隐藏对象的具体类型之后，`duck` 对象和 `chicken` 对象才能被交换使用，这是让对象表现出多态性的必经之路。
    * 建立约束。继承自抽象类的具体类都会继承抽象类里的 abstract 方法，并且要求覆写它们。这些约束在实际编程中非常重要，可以帮助我们编写可靠性更高的代码。
2. 不关注对象的具体类型，而仅仅针对超类型中的 abstract 方法来编写程序，可以产生可靠性高的程序，也可以极大地减少子系统实现之间的相互依赖关系，这就是我们本篇要讨论的主题：**面向接口编程，而不是面向实现编程**。
3. 这里的抽象类，就是前面提到的第三类的接口。
4. 当对象的具体类型被隐藏在超类型身后时，这些对象就可以相互替换使用，我们的关注点才能从对象的类型上转移到对象的行为上。
5. “面向接口编程” 也可以看成面向抽象编程，即针对超类型中的 abstract 方法编程，接口在这里被当成 abstract 方法中约束的行为。这些行为暴露了一个类或者对象能够做什么，但是不关心具体如何去做。


## `interface`
### `interface` 的概念
1. 除了用抽象类来完成面向接口编程之外，使用 `interface` 也可以达到同样的效果。
2. 虽然很多人在实际使用中刻意区分抽象类和 `interface`，但使用 `interface` 实际上也是继承的一种方式，叫作接口继承。
3. 相对于单继承的抽象类，一个类可以实现多个 `interface`。抽象类中除了 `abstract` 方法之外，还可以有一些供子类公用的具体方法。
4. `interface` 使抽象的概念更进一步，它产生一个完全抽象的类，不提供任何具体实现和方法体（Java 8 已经有了提供实现方法的`interface`），但允许该 `interface` 的创建者确定方法名、参数列表和返回类型，这相当于提供一些行为上的约定，但不关心该行为的具体实现过程。
5. `interface` 同样可以用于向上转型，这也是让对象表现出多态性的一条途径，实现了同一个接口的两个类就可以被相互替换使用。

### 实现
1. 上面使用抽象类实现了向上转型。但也引入了一个限制，抽象类是基于单继承的，也就是说我们不可能让 `Duck` 和 `Chicken` 再继承自另一个类。
2. 如果使用 `interface`，可以仅仅针对发出叫声这个行为来编写程序，同时一个类也可以实现多个 `interface`。
3. 下面用 `interface` 来改写基于抽象类的代码
    ```java
    public interface Animal{
        abstract void makeSound();
    }

    public class Duck implements Animal{
        public void makeSound() {      // 重写 Animal 接口的 makeSound 抽象方法
            System.out.println( "gaga" );
        }
    }

    public class Chicken implements Animal{
        public void makeSound() {     // 重写 Animal 接口的 makeSound 抽象方法
            System.out.println( "gege" );
        }
    }

    public class AnimalSound {
        public void makeSound( Animal animal ){
            animal.makeSound();
        }
    }

    public class Test {
        public static void main( String args[] ){
            Animal duck = new Duck();
            Animal chicken = new Chicken();

            AnimalSound animalSound = new AnimalSound();
            animalSound.makeSound( duck );
            animalSound.makeSound( chicken );
        }
    }
    ```


## JavaScript 的情况
1. 因为 JavaScript 是一门动态类型语言，类型本身在 JavaScript 中是一个相对模糊的概念。也就是说，不需要利用抽象类或者 `interface` 给对象进行 “向上转型”。
2. 除了 `Number`、`String`、`Boolean` 等基本数据类型之外，其他的对象都可以被看成天生被 “向上转型” 成了 `Object` 类型。
3. 在动态类型语言中，对象的多态性是与生俱来的。
4. 因为不需要进行向上转型，接口在 JavaScript 中的最大作用就退化到了检查代码的规范性。比如检查某个对象是否实现了某个方法，或者检查是否给函数传入了预期类型的参数。
5. 但作为一门解释执行的动态类型语言，JavaScript 无法实现在编译阶段进行复杂的代码检查。我们只能自己实现检查逻辑在运行时进行接口检查。
6. 或者尝试使用 TypeScript
    ```ts
    interface Command {
        execute: Function;
    }


    class RefreshCommand implements Command {
        execute(){
            console.log( '刷新面' );
        }
    }

    class AddCommand implements Command {
        execute(){
            console.log( '增加' );
        }
    }

    class DelCommand implements Command {
        // 只要写到上一行，VSCode 就会有错误提示了。即使忽略错误，编译的时候也无法通过。
    }
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
