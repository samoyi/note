# State


## 设计思想
### 本质功能仍然是状态改变引发行为改变
1. 允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
2. This pattern is close to the concept of finite-state machines. The state pattern can be interpreted as a strategy pattern, which is able to switch a strategy through invocations of methods defined in the pattern's interface.
3. This can be a cleaner way for an object to change its behavior at runtime without resorting to conditional statements and thus improve maintainability.
4. 可以看到，这一本质是对象的基本功能，状态变化影响行为是最基本的功能了。

### 状态模式的特别性：封装状态——在封装行为之上进一步的剥离，将复杂的状态逻辑打碎分散
1. 封装行为其实类似于，电灯开关例子中第一种情况中，把条件语句的具体执行的逻辑进行封装，而状态的关系还保留在 context 中。
2. 而封装状态后，context 也不关心状态关系了，某种状态和它对应的行为被封装在一起，作为外部的业务逻辑。
3. 想象一个对象有很多状态，这些状态会形成一个网状的状态策略路径网。如果 context 中维护这种状态关系会很复杂，需要判断各种情况下状态将导致怎样的行为。
4. 而如果使用状态模式，则完全不需要维护策略路径网。因为某个状态都有自己明确的行为，策略网上的每一步都被封装在某个具体的状态内部了，切换状态的行为也交给了某种具体的状态，因为切换状态也属于某种状态的行为。
5. Context 现在只需要维持一个引用，该引用指向当前的状态对象。需要发生行为时，直接使用该状态对象即可，不需要做任何判断。



## 例子
### 不使用状态模式的一个电灯开关程序
```js
class Light {
    constructor(){
        // 默认为关
        this.state = 'off';
        this.button = null;
    }

    init(){
        let button = document.createElement( 'button' );

        button.innerHTML = '开关';
        this.button = document.body.appendChild( button );
        this.button.onclick = ()=>{
            // 开关绑定点击事件
            this.buttonWasPressed();
        }
    }

    // 第一次按开启弱光，第二次按开启强光，再按关闭
    buttonWasPressed(){
        if ( this.state === 'off' ){
            console.log( '弱光' );
            this.state = 'weakLight';
        }
        else if ( this.state === 'weakLight' ){
            console.log( '强光' );
            this.state = 'strongLight';
        }
        else if ( this.state === 'strongLight' ){
            console.log( '关灯' );
            this.state = 'off';
        }
    }
}

let light = new Light();
light.init();
```

#### 缺点
* 扩展即修改，违反 OCP。
* 核心功能（灯光切换）没有和业务功能（不同的灯光模式）分离。
* 状态管理不明确：理想的是单独维护一个状态与行为的映射表，而不是直接罗列。
* 状态修改不明确：状态修改是直接给变量赋值，应该有一种更规范的切换机制。例如 vuex 就不能直接修改 state，而是要通过 commit。

### 使用状态模式改进
1. 通常我们谈到封装，一般都会优先封装对象的行为，而不是对象的状态。但在状态模式中刚好相反，状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部，所以 button 被按下的的时候，只需要在上下文中，把这个请求委托给当前的状态对象即可，该状态对象会负责渲染它自身的行为。
2. 同时我们还可以把状态的切换规则事先分布在状态类中， 这样就有效地消除了原本存在的大量条件分支语句。也就是说，context 本来是要维护
完整的状态流程，但现在每个状态应该做什么都交给具体的状态自己去决定。

```js
// OffLightState：
class OffLightState {
    constructor(light){
        this.light = light;
    }

    buttonWasPressed(){
        console.log( '弱光' );    // offLightState对应的行为
        this.light.setState( this.light.weakLightState );    // 切换状态到weakLightState
    }
}


// WeakLightState：
class WeakLightState {
    constructor(light){
        this.light = light;
    }

    buttonWasPressed(){
        console.log( '强光' );    // weakLightState对应的行为
        this.light.setState( this.light.strongLightState );    // 切换状态到strongLightState
    }
}


// StrongLightState：
class StrongLightState {
    constructor(light){
        this.light = light;
    }

    buttonWasPressed(){
        console.log( '关灯' );    // strongLightState对应的行为
        this.light.setState( this.light.offLightState );    // 切换状态到offLightState
    }
}


class Light {
    constructor(){
        this.offLightState = new OffLightState( this );
        this.weakLightState = new WeakLightState( this );
        this.strongLightState = new StrongLightState( this );
        this.button = null;
        this.currState = null; // 灯的行为取决于当前的状态
    }

    init(){
        let button = document.createElement( 'button' );

        button.innerHTML = '开关';
        this.button = document.body.appendChild( button );
        this.button.onclick = ()=>{
            this.currState.buttonWasPressed();
        }

        this.currState = this.offLightState; // 设置当前状态
    }

    setState( newState ){
        this.currState = newState;
    }
}

let light = new Light();
light.init();
```

3. 用状态模式的好处很明显，它可以使每一种状态和它对应的行为之间的关系局部化，这些行为被分散和封装在各自对应的状态类之中，便于阅读和管理代码。
4. 当我们需要为`light`对象增加一种新的状态时，只需要增加一个新的状态类，再稍稍改变一些现有的代码即可。不懂，可是还需要修改`Light`构造函数。


## 缺少抽象类的变通方式
1. 我们看到，在状态类中将定义一些共同的行为方法，Context 最终会将请求委托给状态对象的这些方法，在这个例子里，这个方法就是`buttonWasPressed`。无论增加了多少种状态类，它们都必须实现`buttonWasPressed`方法。
2. 在 Java 中，所有的状态类必须继承自一个`State`抽象父类，当然如果没有共同的功能值得放入抽象父类中，也可以选择实现`State`接口。这样做的原因一方面是我们曾多次提过的向上转型，另一方面是保证所有的状态子类都实现了`buttonWasPressed`方法。
3. 遗憾的是，JavaScript 既不支持抽象类，也没有接口的概念。所以在使用状态模式的时候要格外小心，如果我们编写一个状态子类时，忘记了给这个状态子类实现`buttonWasPressed`方法，则会在状态切换的时候抛出异常。因为 Context 总是把请求委托给状态对象的`buttonWasPressed`方法。
4. 这里建议的解决方案跟《模板方法模式》中一致，让抽象父类的抽象方法直接抛出一个异常，这个异常至少会在程序运行期间就被发现
    ```js
    class State {
        constructor(light){
            this.light = light;
        }

        // OffLightState 没有重写该方法，到时就会调用父类的该方法而抛出错误
        buttonWasPressed(){
            throw new Error( '父类的 buttonWasPressed 方法必须被重写' );
        }
    }

    // OffLightState：
    class OffLightState extends State {
        constructor(light){
            super(light);
        }
    }
    ```


## 状态模式中的性能优化点
### 是否动态创建并销毁状态对象
1. 有两种选择来管理`state`对象的创建和销毁。第一种是仅当`state`对象被需要时才创建并随后销毁，另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。
2. 如果`state`对象比较庞大，可以用第一种方式来节省内存，这样可以避免创建一些不会用到的对象并及时地回收它们。但如果状态的改变很频繁，最好一开始就把这些`state`对象都创建出来，也没有必要销毁它们，因为可能很快将再次用到它们。

### 多个 context 共享状态对象
如果多个`state`对象类似的，那么可以使用享元模式来减少对象的数量。


## 状态模式和策略模式的关系
1. 状态模式和策略模式像一对双胞胎，它们都封装了一系列的算法或者行为，它们的类图看起来几乎一模一样，但在意图上有很大不同，因此它们是两种迥然不同的模式。
2. 策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。
3. 它们之间的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；而在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部。对客户来说，并不需要了解这些细节。这正是状态模式的作用所在。


## JavaScript 版本的状态机
1. 状态模式是状态机的实现之一，但在 JavaScript 这种“无类”语言中，没有规定让状态对象一定要从类中创建而来。
2. 另外一点，JavaScript 可以非常方便地使用委托技术，并不需要事先让一个对象持有另一个对象。
3. 下面的状态机选择了通过`Function.prototype.call`方法直接把请求委托给某个字面量对象来执行
    ```js
    const FSM = {
        off: {
            buttonWasPressed(){
                this.button.innerHTML = '关灯';
                this.currState = FSM.on;
                console.log( '灯已打开' );
            }
        },
        on: {
            buttonWasPressed(){
                this.button.innerHTML = '开灯';
                this.currState = FSM.off;
                console.log( '灯已关闭' );
            }
        }
    };

    class Light {
        constructor(){
            this.currState = FSM.off;
            this.button = null;
        }

        init(){
            let button = document.createElement( 'button' );

            button.innerHTML = '开灯';
            this.button = document.body.appendChild( button );

            this.button.onclick = ()=>{
                this.currState.buttonWasPressed.call( this );    // 把请求委托给 FSM
            }
        }
    };

    let light = new Light();
    light.init();
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
