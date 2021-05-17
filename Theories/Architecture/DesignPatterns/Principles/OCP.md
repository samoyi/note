# Open-Closed Principle

Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.


<!-- TOC -->

- [Open-Closed Principle](#open-closed-principle)
    - [设计思想](#设计思想)
        - [SRP 是 OCP 的前提](#srp-是-ocp-的前提)
        - [分离经常变动和不常变动](#分离经常变动和不常变动)
    - [应用](#应用)
        - [用对象的多态性消除条件分支](#用对象的多态性消除条件分支)
        - [放置挂钩](#放置挂钩)
        - [使用回调函数](#使用回调函数)
    - [设计模式中的开放－封闭原则](#设计模式中的开放封闭原则)
        - [发布-订阅模式](#发布-订阅模式)
        - [模板方法模式](#模板方法模式)
        - [策略模式](#策略模式)
        - [代理模式](#代理模式)
        - [职责链模式](#职责链模式)
    - [权衡](#权衡)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### SRP 是 OCP 的前提
1. 通过 SRP 原则把经常变动的和不经常变动的分离，才能更好的实现 OCP。
2. 越是容易变动的地方就越要 SRP，只有 SRP 了才能更好的应对变化，每次修改时只对紧密相关的独立的一小部分做修改，而不需要对整体进行修改。

### 分离经常变动和不常变动
1. 理解系统、维护系统和改变系统功能需要成本。
2. 系统内部的逻辑越复杂，则理解和维护起来越困难，改变的成本也越大。
3. 如果可以抽离出系统中不变的核心部分，则维护和改变只需要针对会变化的部分——分离变化和不变的部分
4. 而且系统的维护者和改变者也不需要去理解核心部分，降低了协作的成本。


## 应用
### 用对象的多态性消除条件分支
1. 过多的条件分支语句是造成程序违反开放-封闭原则的一个常见原因。每当需要增加一个新的 `if` 语句时，都要被迫改动原函数。
2. 下面是一段违反开闭原则的程序
    ```js
    class Duck {

    }
    class Chicken {

    }


    function makeSound ( animal ) {
        if ( animal instanceof Duck ){
            console.log( 'gagagaga' );
        }
        else if ( animal instanceof Chicken ){
            console.log( 'gegegege' );
        }
    }


    makeSound( new Duck() );
    makeSound( new Chicken() );
    ```
3. `makeSound` 里面耦合了两种动物类，后续如果要增加一个新的动物，就必须要修改 `makeSound` 里面的代码。
4. 使用 OCP 重构
    ```js
    class Duck {
        sound () {
            console.log( 'gagagaga' );
        }
    }
    class Chicken {
        sound () {
            console.log( 'gegegege' );
        }
    }


    function makeSound ( animal ) {
        animal.sound();
    }

    makeSound( new Duck() );
    makeSound( new Chicken() );

    // 后期新增一个动物
    class Dog {
        sound () {
            console.log( 'wangwang' );
        }
    }

    makeSound( new Dog() );
    ```
5. 更加面向对象的写法
    ```js
    class Animal  {
        constructor () {
            this.requiredSubclassMethods = ['sound'];
            this.checkAPI(this);
        }

        sound () {}

        checkAPI (instance) {
            let prototype = Object.getPrototypeOf(instance);
            let methods = Object.getOwnPropertyNames(prototype);

            this.requiredSubclassMethods.every((key) => {
                if ( !methods.includes(key) ) {
                    throw new Error(`子类必须重写 ${key} 方法`);
                }
                return true;
            });
        }
    }

    class SoundMaker {
        constructor ( animal ) {
            this.animal = animal;
        }

        sound () {
            this.animal.sound();
        }
    }


    class Duck extends Animal {
        constructor () {
            super ();
        }

        sound () {
            console.log( 'gagagaga' );
        }
    }

    class Chicken extends Animal {
        constructor () {
            super ();
        }
        
        sound () {
            console.log( 'gegegege' );
        }
    }

    let duckSoundMaker = new SoundMaker( new Duck() );
    duckSoundMaker.sound();
    let chickenSoundMaker = new SoundMaker( new Chicken() );
    chickenSoundMaker.sound();


    class Dog extends Animal {
        sound () {
            console.log( 'wangwang' );
        }
    }

    let dogSoundMaker = new SoundMaker( new Dog() );
    dogSoundMaker.sound();  
    ```
6. 实际上，每当我们看到一大片的 `if` 或者 `swtich-case` 语句时，第一时间就应该考虑，能否利用对象的多态性来重构它们。

### 放置挂钩
1. 我们在程序有可能发生变化的地方放置一个挂钩，挂钩的返回结果决定了程序的下一步走向。
2. 这样一来，原本的代码执行路径上就出现了一个分叉路口，程序未来的执行方向被预埋下多种可能性。
3. 由于子类的数量是无限制的，总会有一些 “个性化” 的子类迫使我们不得不去改变已经封装好的算法骨架。
4. 于是我们可以在父类中的某个容易变化的地方放置挂钩，挂钩的返回结果由具体子类决定。这样一来，程序就拥有了变化的可能。

### 使用回调函数
1. 回调函数是一种特殊的挂钩。
2. 我们可以把一部分易于变化的逻辑封装在回调函数里，然后把回调函数当作参数传入一个稳定和封闭的函数中。
3. 当回调函数被执行的时候，程序就可以因为回调函数的内部逻辑不同，而产生不同的结果。


## 设计模式中的开放－封闭原则
### 发布-订阅模式
1. 发布-订阅模式用来降低多个对象之间的依赖关系，它可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。
2. 当有新的订阅者出现时，发布者的代码不需要进行任何修改；同样当发布者需要改变时，也不会影响到之前的订阅者。

### 模板方法模式
1. 在一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽出来放到父类的模板方法里面。
2. 而子类的方法具体怎么实现则是可变的，于是把这部分变化的逻辑封装到子类中。
3. 通过增加新的子类，便能给系统增加新的功能，并不需要改动抽象父类以及其他的子类。

### 策略模式
1. 策略模式和模板方法模式是一对竞争者。在大多数情况下，它们可以相互替换使用。
2. 模板方法模式基于继承的思想，而策略模式则偏重于组合和委托。
3. 策略模式将各种算法都封装成单独的策略类，这些策略类可以被交换使用。
4. 策略和使用策略的客户代码可以分别独立进行修改而互不影响。我们增加一个新的策略类也非常方便，完全不用修改之前的代码。

### 代理模式
主体功能不用修改，使用代理来拓展功能。

### 职责链模式
链的执行环境保持封闭，链的组合保持开放。


## 权衡
1. 让程序保持完全封闭是不容易做到的。就算技术上做得到，也需要花费太多的时间和精力。
2. 而且让程序符合开放-封闭原则的代价是引入更多的抽象层次，更多的抽象有可能会增大代码的复杂度。
4. 更何况，有一些代码是无论如何也不能完全封闭的，总会存在一些无法对其封闭的变化。
5. 另外，随着系统的演进，变化和不变也是会互相转化的。
6. 所以，只能尽量做到分离经常变动和不常变动的，并且随着系统的演进不断的改进。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
