# Template Method

Template Method is a behavioral design pattern that defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.


<!-- TOC -->

- [Template Method](#template-method)
    - [设计思想](#设计思想)
        - [便利与自由，安全与自由](#便利与自由安全与自由)
        - [SRP](#srp)
        - [OCP](#ocp)
            - [环境和数据分离](#环境和数据分离)
    - [本质](#本质)
        - [对若干相同类型的算法提供公共模板](#对若干相同类型的算法提供公共模板)
        - [对若干相同类型的算法提供约束模板](#对若干相同类型的算法提供约束模板)
    - [实现原理](#实现原理)
        - [抽象的负责约束步骤](#抽象的负责约束步骤)
        - [现实的具体实现行为](#现实的具体实现行为)
    - [适用场景](#适用场景)
        - [多个算法有相同逻辑，但有不同实现](#多个算法有相同逻辑但有不同实现)
        - [一个算法的某些步骤有多种实现](#一个算法的某些步骤有多种实现)
        - [约束一类相似算法的公共执行步骤](#约束一类相似算法的公共执行步骤)
    - [缺点](#缺点)
    - [例子 —— Coffee or Tea](#例子--coffee-or-tea)
    - [抽象类](#抽象类)
        - [抽象类的作用](#抽象类的作用)
        - [抽象方法和具体方法](#抽象方法和具体方法)
        - [用 Java 实现 Coffee or Tea 的例子](#用-java-实现-coffee-or-tea-的例子)
        - [JavaScript 没有抽象类的缺点和解决方案](#javascript-没有抽象类的缺点和解决方案)
            - [缺点](#缺点-1)
            - [解决方案](#解决方案)
                - [接口检查](#接口检查)
                - [禁止抽象类实例化](#禁止抽象类实例化)
    - [模板方法模式的使用场景](#模板方法模式的使用场景)
        - [例1](#例1)
        - [例2](#例2)
    - [钩子方法](#钩子方法)
    - [好莱坞原则](#好莱坞原则)
    - [抓住设计思想，不要拘泥于形式](#抓住设计思想不要拘泥于形式)
    - [和其他模式的关系](#和其他模式的关系)
        - [策略模式](#策略模式)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### 便利与自由，安全与自由
1. 抽象的通用部分提供了可复用的内容，比如说模板方法，那么现实的对象就不用自己实现执行步骤了，只要实现每个步骤的具体行为即可。
2. 这对于现实的对象是一种便利，但也是一种约束。你用了通用的模板，就少了自我发挥的空间。
3. 模板方法的设计思想，除了提供便利以外，应该说同等重要的还是提供了一种约束，约束了现实对象应该有的行为。这样，只要现实对象使用这个抽象类型，那它一定就符合该类型的规则的，也就是说，是符合该类型的标准的。这就是抽象类型的约束所带来的安全性。
4. 同样，这种安全性的约束，一样是以牺牲了自由为代价的。

### SRP
1. 算法分为若干个步骤，如果步骤复杂性不是很低的话，就值得提取出来单独管理。
2. 这样不管是后期维护还是进行复用都更方便。

### OCP
1. 一个运用了模板方法模式的程序中，子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑抽象到父类的模板方法里面。
2. 而子类的方法具体怎么实现则是可变的，于是我们把这部分变化的逻辑封装到子类中。
3. 通过增加新的子类，我们便能给系统增加新的功能，并不需要改动抽象父类以及其他子类。

#### 环境和数据分离
通过实现 SRP 和 OCP，就实现了环境和数据的分离。环境（算法步骤）保持稳定，数据（具体步骤的实现）根据需求灵活变化。


## 本质
### 对若干相同类型的算法提供公共模板
1. 对若干相同类型的算法抽出相同的可复用的部分作为基础通用的内容。
2. 在具体执行时，每种情况在通用的基础上，使用个性化的内容覆盖通用的某些部分。

### 对若干相同类型的算法提供约束模板
1. 具体的情况执行时，只能覆盖，而不能增加或减少通用的设计。
2. 也就是说，通用的部分不仅仅提供了通用的内容，还约束了具体执行时必须要按照自己的逻辑执行。


## 实现原理
1. 模板方法模式建议将算法分解为一系列步骤，然后将这些步骤改写为方法，最后在 “模板方法” 中依次调用这些方法。步骤可以是抽象的，也可以有一些默认的实现。
2. 为了能够使用算法，客户端需要自行提供子类并实现所有的抽象步骤。 如有必要还需重写一些步骤 （但这一步中不包括模板方法自身）。

### 抽象的负责约束步骤
1. 当我们需要制定某一类行为的时候，可以根据这一类的共同特点，抽象出一个基础的类型。
2. 抽象类及其模板方法规定了该类应该具有哪些行为，以及这些行为的执行顺序，继承该基础类型的现实类都应该具体实现每个行为。

### 现实的具体实现行为
1. 继承这个抽象类型的现实类型必须实现抽象类规定的每个行为的具体工作。
2. 但这些方法的执行步骤是在抽象类里面定好的，所以现实类只是负责每个步骤具体的事情，但无权控制步骤的顺序。

 
## 适用场景
### 多个算法有相同逻辑，但有不同实现
1. 多个算法具有相同的逻辑步骤或结构，但具体步骤的实现各不相同的情况。
2. 创建共同的父类，该父类通过定义公共方法和模板方法，确定了应该有哪些方法，以及方法的执行步骤。
3. 这个应用场景是把多个算法抽象出一个共同的逻辑模板。

### 一个算法的某些步骤有多种实现
1. 当你只希望客户端扩展某个特定算法步骤， 而不是整个算法或其结构时， 可使用模板方法模式。
2. 模板方法将整个算法转换为一系列独立的步骤， 以便子类能对其进行扩展， 同时还可让超类中所定义的结构保持完整。
3. 和上面的场景相对应，这个应用场景是把一个算法扩展为不同的实现。

### 约束一类相似算法的公共执行步骤
父类约束所有子类应该具有算法步骤以及步骤的执行顺序，但具体步骤的实现由子类自己决定。


## 缺点
* 就像上面提到的，具体的某些实现可能会失去自由度。
* You might violate the Liskov Substitution Principle by suppressing a default step implementation via a subclass. TODO 这里违反里氏替换原则有什么危害？


## 例子 —— Coffee or Tea
1. 泡一杯咖啡
    ```js
    class Coffee {
        constructor(){

        }

        boilWater () {
            console.log( '把水煮沸' );
        }

        brewCoffeeGriends () {
            console.log( '用沸水冲泡咖啡' );
        }

        pourInCup () {
            console.log( '把咖啡倒进杯子' );
        }

        addSugarAndMilk () {
            console.log( '加糖和牛奶' );
        }

        init () {
            this.boilWater();
            this.brewCoffeeGriends();
            this.pourInCup();
            this.addSugarAndMilk();
        }
    }

    let coffee = new Coffee();
    coffee.init();
    ```
2. 泡一杯茶
    ```js
    class Tea {
        constructor(){

        }

        boilWater(){
            console.log( '把水煮沸' );
        }

        steepTeaBag(){
            console.log( '用沸水浸泡茶叶' );
        }

        pourInCup(){
            console.log( '把茶水倒进杯子' );
        }

        addLemon(){
            console.log( '加柠檬' );
        }

        init(){
            this.boilWater();
            this.steepTeaBag();
            this.pourInCup();
            this.addLemon();
        }
    }

    let tea = new Tea();
    tea.init();
    ```
3. 经过比较，我们发现咖啡和茶的冲泡过程是大同小异的。经过抽象之后，不管是泡咖啡还是泡茶，我们都能整理为下面四步：
    1. 把水煮沸
    2. 用沸水冲泡饮料
    3. 把饮料倒进杯子
    4. 加调料
4. 第一个步骤是相同的，可以共用。而且最重要的是，**整个流程也是相同的**，可以创建一个父类，子类可以有若干自己的步骤，但核心逻辑都使用相同的父类逻辑。
5. 创建一个抽象父类
    ```js
    class Beverage {
        constructor () {

        }

        // 两个子类的该方法实现完全相同，所以都使用父类的 boilWater 方法
        boilWater(){
            console.log( '把水煮沸' );
        }

        brew(){} // 因为泡的饮料不同，所以应该由子类重写

        pourInCup(){} // 因为倒的东西不同，所以应该由子类重写

        addCondiments(){} // 因为加的调料不同，所以应该由子类重写

        // 两个子类的操作顺序是相同的，所以也使用该父类的 init 方法
        init () {
            this.boilWater();
            this.brew();
            this.pourInCup();
            this.addCondiments();
        }
    }
    ```
6. 创建 `Coffee` 子类和 `Tea` 子类
    ```js
    class Coffee extends Beverage {
        brew () {
            console.log( '用沸水冲泡咖啡' );
        }

        pourInCup () {
            console.log( '把咖啡倒进杯子' );
        }

        addCondiments () {
            console.log( '加糖和牛奶' );
        }
    }
    let coffee = new Coffee();
    coffee.init();

    class Tea extends Beverage {
        brew () {
            console.log( '用沸水浸泡茶叶' );
        }

        pourInCup () {
            console.log( '把茶倒进杯子' );
        }

        addCondiments () {
            console.log( '加柠檬' );
        }
    }
    let tea = new Tea();
    tea.init();
    ```
7. 这里的 `Beverage.prototype.init` 就是所谓的 **模板方法**(Template Method)，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法。


## 抽象类
### 抽象类的作用
1. 抽象类不能被实例化，如果有人编写了一个抽象类，那么这个抽象类一定是用来被某些具体类继承的。JavaScript 在语言层面并没有提供对抽象类的支持，这里将着重讨论 Java 中抽象类的作用。
2. 抽象类和接口一样可以用于向上转型，在静态类型语言中，编译器对类型的检查总是一个绕不过的话题与困扰。虽然类型检查可以提高程序的安全性，但繁琐而严格的类型检查也时常会让程序员觉得麻烦。把对象的真正类型隐藏在抽象类或者接口之后，这些对象才可以被互相替换使用。这可以让我们的 Java 程序尽量遵守依赖倒置原则。
3. 除了用于向上转型，抽象类也可以表示一种契约。继承了这个抽象类的所有子类都将拥有跟抽象类一致的接口方法，抽象类的主要作用就是为它的子类定义这些公共接口。如果我们在子类中删掉了这些方法中的某一个，那么将不能通过编译器的检查，这在某些场景下是非常有用的，比如我们本章讨论的模板方法模式，`Beverage` 类的 `init` 方法里规定了冲泡一杯饮料的顺序如下：
    ```js
    this.boilWater();    // 把水煮沸
    this.brew();     // 用水泡原料
    this.pourInCup();    // 把原料倒进杯子
    this.addCondiments();    // 添加调料
    ```
4. 如果在 `Coffee` 子类中没有实现对应的 `brew` 方法，那么我们百分之百得不到一杯咖啡。既然父类规定了子类的方法和执行这些方法的顺序，子类就应该拥有这些方法，并且提供正确的实现。

### 抽象方法和具体方法
1. 抽象方法被声明在抽象类中，抽象方法并没有具体的实现过程，是一些 “哑” 方法。比如 `Beverage` 类中的 `brew` 方法、`pourInCup` 方法和 `addCondiments` 方法，都被声明为抽象方法。当子类继承了这个抽象类时，必须重写父类的抽象方法。
2. 除了抽象方法之外，如果每个子类中都有一些同样的具体实现方法，那这些方法也可以选择放在抽象类中，这可以节省代码以达到复用的效果，这些方法叫作具体方法。当代码需要改变时，我们只需要改动抽象类里的具体方法就可以了。比如饮料中的 `boilWater` 方法，假设冲泡所有的饮料之前，都要先把水煮沸，那我们自然可以把 `boilWater` 方法放在抽象类 `Beverage` 中。

### 用 Java 实现 Coffee or Tea 的例子
```java
public abstract class Beverage { // 饮料抽象类
    final void init () { / 模板方法
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    void boilWater () {        // 具体方法 boilWater
        System.out.println( "把水煮沸" );
    }

    abstract void brew();          // 抽象方法 brew
    abstract void addCondiments(); // 抽象方法 addCondiments
    abstract void pourInCup();     // 抽象方法 pourInCup
}


public class Coffee extends Beverage{
    @Override
    void brew () {    
        System.out.println( "用沸水冲泡咖啡" );
    }

    @Override
    void pourInCup (){    
        System.out.println( "把咖啡倒进杯子" );
    }

    @Override
    void addCondiments() {        
        System.out.println( "加糖和牛奶" );
    }
}


public class Tea extends Beverage{        
    @Override
    void brew () {        
        System.out.println( "用沸水浸泡茶叶" );
    }

    @Override
    void pourInCup (){        
        System.out.println( "把茶倒进杯子" );
    }

    @Override
    void addCondiments () {        
        System.out.println( "加柠檬" );
    }
}

public class Test {

    private static void prepareRecipe( Beverage beverage ){
        beverage.init();
    }

    public static void main( String args[] ){
         Beverage coffee = new Coffee();   
         prepareRecipe( coffee );   

        Beverage tea = new Tea();   
        prepareRecipe( tea );   
    }
}
```

### JavaScript 没有抽象类的缺点和解决方案
#### 缺点
1. JavaScript 并没有从语法层面提供对抽象类的支持。抽象类的第一个作用是隐藏对象的具体类型，由于 JavaScript 是一门 “类型模糊” 的语言，所以隐藏对象的类型在 JavaScript 中并不重要。
2. 另一方面， 当我们在 JavaScript 中使用原型继承来模拟传统的类式继承时，并没有编译器帮助我们进行任何形式的检查，我们也没有办法保证子类会重写父类中的 “抽象方法”。
3. 我们知道，`Beverage.prototype.init` 方法作为模板方法，已经规定了子类的算法框架，代码如下：
    ```js
    Beverage.prototype.init = function(){
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
    };
    ```
4. 如果我们的 `Coffee` 类或者 `Tea` 类忘记实现这 4 个方法中的一个呢？拿 `brew` 方法举例，如果我们忘记编写 `Coffee.prototype.brew` 方法，那么当请求 `coffee` 对象的 `brew` 时，请求会顺着原型链找到 `Beverage` “父类” 对应的 `Beverage.prototype.brew` 方法，而 `Beverage.prototype.brew` 方法到目前为止是一个空方法，这显然是不能符合我们需要的。
5. 在 Java 中编译器会保证子类会重写父类中的抽象方法，但在 JavaScript 中却没有进行这些检查工作。我们在编写代码的时候得不到任何形式的警告，完全寄托于程序员的记忆力和自觉性是很危险的，特别是当我们使用模板方法模式这种完全依赖继承而实现的设计模式时。

#### 解决方案
##### 接口检查
1. 第一种方案是用鸭子类型来模拟接口检查，以便确保子类中确实重写了父类的方法
    ```js
    class Beverage {
        constructor () {
            this.requiredSubclassMethods = ['brew', 'pourInCup', 'addCondiments'];
            // 子类会调用 super，然后这里参数中 this 会被设置为子类的实例
            this.checkAPI(this);
        }

        boilWater(){
            console.log( '把水煮沸' );
        }

        brew () {}

        pourInCup ()  {}

        addCondiments () {}

        init () {
            this.boilWater();
            this.brew();
            this.pourInCup();
            this.addCondiments();
        }

        checkAPI (instance) {
            
            // 获取子类的原型方法
            let prototype = Object.getPrototypeOf(instance);
            let methods = Object.getOwnPropertyNames(prototype);

            // 检查父类要求的接口子类是否都实现了
            this.requiredSubclassMethods.every((key) => {
                if ( !methods.includes(key) ) {
                    throw new Error(`子类 ${prototype.constructor.name} 必须重写 ${key} 方法`);
                }
                return true;
            });
        }
    }

    class Coffee extends Beverage {

        pourInCup () {
            console.log( '把咖啡倒进杯子' );
        }

        addCondiments () {
            console.log( '加糖和牛奶' );
        }
    }

    new Coffee(); // Error: 子类必须重写 brew 方法
    ```
2. 第二种方案是让 `Beverage.prototype.brew` 等方法直接抛出一个异常，如果因为粗心忘记编写 `Coffee.prototype.brew` 方法，那么至少我们会在程序运行时得到一个错误：
    ```js
    Beverage.prototype.brew = function(){
        throw new Error('子类必须重写brew方法');
    };
    　
    Beverage.prototype.pourInCup = function(){
        throw new Error('子类必须重写pourInCup方法');
    };
    　
    Beverage.prototype.addCondiments = function(){
        throw new Error('子类必须重写addCondiments方法');
    };
    ```
3. 第一种方案在实例化子类的时候就可以抛出错误，第二种方案要在执行模板方法的时候才抛出错误

##### 禁止抽象类实例化
使用 `new.target`
```js
class Beverage_Abstract {
    constructor () {
        if (new.target === Beverage_Abstract) {
            throw new Error('Beverage_Abstract 作为抽象类不能被实例化');
        }
        this.requiredSubclassMethods = ['brew', 'pourInCup', 'addCondiments'];
        this.checkAPI(this);
    }

    // 省略其他代码
}
```


## 模板方法模式的使用场景
**多个功能具有相同的逻辑步骤或结构，但具体步骤的实现各不相同的情况**

### 例1
1. 从大的方面来讲，模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面填空。
2. 比如 Java 程序员大多使用过 HttpServlet 技术来开发项目。一个基于 HttpServlet 的程序包含 7 个生命周期，这 7 个生命周期分别对应下面的一个方法。
    ```java
    doGet()
    doHead()
    doPost()
    doPut()
    doDelete()
    doOption()
    doTrace()
    ```
3. `HttpServlet` 类还提供了一个 `service` 方法，它就是这里的模板方法，`service` 规定了上面这七个方法的执行顺序，而这七个方法的具体实现则需要 `HttpServlet` 的子类来提供。

### 例2
1. 在 Web 开发中也能找到很多模板方法模式的适用场景，比如我们在构建一系列的 UI 组件，这些组件的构建过程一般如下所示：
    1. 初始化一个 div 容器；
    2. 通过 ajax 请求拉取相应的数据；
    3. 把数据渲染到 div 容器里面，完成组件的构造；
    4. 通知用户组件渲染完毕。
2. 我们看到，任何组件的构建都遵循上面的 4 步，其中第 (1) 步和第 (4) 步是相同的。第 (2) 步不同的地方只是请求 ajax 的远程地址，第 (3) 步不同的地方是渲染数据的方式。
3. 于是我们可以把这 4 个步骤都抽象到父类的模板方法里面，父类中还可以顺便提供第 (1) 步和第 (4) 步的具体实现。当子类继承这个父类之后，会重写模板方法里面的第 (2) 步和第 (3) 步。


## 钩子方法
1. 通过模板方法模式，我们在父类中封装了子类的算法框架。这些算法框架在正常状态下是适用于大多数子类的，但如果有一些子类略有特殊，某些步骤不遵循父类的框架，如果仍然想要兼容，则可以使用钩子方法。
2. 放置钩子是隔离变化的一种常见手段。我们在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要 “挂钩”，这由子类自行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向，这样一来，程序就拥有了变化的可能。
3. 下面在 `Beverage_Abstract` 类中添加一个决定是否要添加调料的钩子，兼容不加调料的咖啡
    ```js
    class Beverage_Abstract {
        constructor(){
            if (new.target === Beverage_Abstract) {
                throw new Error('Beverage_Abstract 作为抽象类不能被实例化');
            }
            this.requiredSubclassMethods = ['brew', 'pourInCup', 'addCondiments'];
            this.checkAPI(this);
        }

        customerWantsCondiments_hook(){
            return true; // 默认需要调料
        }

        boilWater(){
            console.log( '把水煮沸' );
        }

        brew(){}

        pourInCup(){}

        addCondiments(){}

        init(){
            this.boilWater();
            this.brew();
            this.pourInCup();
            // 如果挂钩返回 true，则需要调料
            this.customerWantsCondiments_hook() && this.addCondiments();
        }

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


    class CoffeeWithHook extends Beverage_Abstract {
        brew () {
            console.log( '用沸水冲泡咖啡' );
        }

        pourInCup () {
            console.log( '把咖啡倒进杯子' );
        }

        addCondiments () {
            console.log( '加糖和牛奶' );
        }

        customerWantsCondiments_hook () {
            return window.confirm('请问需要调料吗？');
        }
    }

    let coffeeWithHook = new CoffeeWithHook();
    coffeeWithHook.init();
    ```


## 好莱坞原则
1. 好莱坞无疑是演员的天堂，但好莱坞也有很多找不到工作的新人演员，许多新人演员在好莱坞把简历递给演艺公司之后就只有回家等待电话。有时候该演员等得不耐烦了，给演艺公司打电话询问情况，演艺公司往往这样回答：“不要来找我，我会给你打电话。”
2. 在设计中，这样的规则就称为好莱坞原则。在这一原则的指导下，我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件，高层组件对待底层组件的方式，跟演艺公司对待新人演员一样，都是 “别调用我们，我们会调用你”。
3. 模板方法模式是好莱坞原则的一个典型使用场景，它与好莱坞原则的联系非常明显，当我们用模板方法模式编写一个程序时，就意味着子类放弃了对自己的控制权，而是改为父类通知子类，哪些方法应该在什么时候被调用。作为子类，只负责提供一些设计上的细节。
4. 除此之外，好莱坞原则还常常应用于其他模式和场景，例如发布-订阅模式和回调函数。


## 抓住设计思想，不要拘泥于形式
1. 只要有必要步骤约束和步骤顺序约束，就可以算作是模板方法模式。
2. 比如在 JavaScript 中，我们很多时候也不一定要用面向对象的方法实现模版方法模式，高阶函数也是一个选择。下面用非面向对象的方法来实现
    ```js
    const Beverage = function( methods ) {

        const boilWater = function () {
            console.log( '把水煮沸' );
        };

        const brew = methods.brew || function () {
            throw new Error( '必须传递 brew 方法' );
        };

        const pourInCup = methods.pourInCup || function () {
            throw new Error( '必须传递 pourInCup 方法' );
        };

        const addCondiments = methods.addCondiments || function () {
            throw new Error( '必须传递 addCondiments 方法' );
        };

        return class F {
            init () {
                boilWater();
                brew();
                pourInCup();
                addCondiments();
            }
        };
    };

    const Coffee = Beverage({
        brew () {
            console.log( '用沸水冲泡咖啡' );
        },
        pourInCup () {
            console.log( '把咖啡倒进杯子' );
        },
        addCondiments () {
            console.log( '加糖和牛奶' );
        }
    });

    const Tea = Beverage({
        brew () {
            console.log( '用沸水浸泡茶叶' );
        },
        pourInCup () {
            console.log( '把茶倒进杯子' );
        },
        addCondiments () {
            console.log( '加柠檬' );
        }
    });


    let coffee = new Coffee();
    coffee.init();

    let tea = new Tea();
    tea.init();
    ```


## 和其他模式的关系
### 策略模式
见策略模式


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/template-method)
