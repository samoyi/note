# State


State is a behavioral design pattern that lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.


<!-- TOC -->

- [State](#state)
    - [1. 设计思想](#1-设计思想)
        - [本质功能仍然是状态改变引发行为改变](#本质功能仍然是状态改变引发行为改变)
        - [状态模式的特别性：封装状态——在封装行为之上进一步的剥离，将复杂的状态逻辑打碎分散](#状态模式的特别性封装状态在封装行为之上进一步的剥离将复杂的状态逻辑打碎分散)
        - [类似于策略模式？状态变成一种策略？或者命令模式？](#类似于策略模式状态变成一种策略或者命令模式)
    - [2. 抽象本质](#2-抽象本质)
        - [取消显式的条件判断——移除映射，直接引用](#取消显式的条件判断移除映射直接引用)
    - [3. 实现原理](#3-实现原理)
    - [4. 适用场景](#4-适用场景)
        - [一个对象针对不同状态有不同的行为，而且状态比较多或者经常变动的情况](#一个对象针对不同状态有不同的行为而且状态比较多或者经常变动的情况)
    - [5. 缺点](#5-缺点)
    - [一个电灯状态机的例子](#一个电灯状态机的例子)
        - [有限状态机（Finite-State Machine）](#有限状态机finite-state-machine)
        - [不使用状态模式的一个电灯状态机](#不使用状态模式的一个电灯状态机)
        - [缺点](#缺点)
            - [重复的状态判断](#重复的状态判断)
            - [违反 SRP](#违反-srp)
            - [违反 OCP —— 数据和逻辑没有分离](#违反-ocp--数据和逻辑没有分离)
            - [状态管理不明确](#状态管理不明确)
        - [使用状态模式改进](#使用状态模式改进)
        - [`Light` 类和具体的状态解耦和耦合](#light-类和具体的状态解耦和耦合)
        - [作为环境的 `Light` 甚至不需要引用所有的状态对象](#作为环境的-light-甚至不需要引用所有的状态对象)
        - [改进的部分](#改进的部分)
            - [没有重复的状态判断了](#没有重复的状态判断了)
            - [SRP 和 OCP](#srp-和-ocp)
            - [状态管理明确](#状态管理明确)
    - [缺少抽象类的变通方式](#缺少抽象类的变通方式)
    - [状态模式中的性能优化点](#状态模式中的性能优化点)
        - [是否动态创建并销毁状态对象](#是否动态创建并销毁状态对象)
        - [多个 context 共享状态对象](#多个-context-共享状态对象)
    - [JavaScript 版本的状态机](#javascript-版本的状态机)
    - [和其他模式的关系](#和其他模式的关系)
        - [策略模式](#策略模式)
    - [References](#references)

<!-- /TOC -->


## 1. 设计思想
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


### 类似于策略模式？状态变成一种策略？或者命令模式？
多分支的逻辑从环境逻辑中提取出来
还有点像职责链？


数据和逻辑分离，所有状态配置到一个单独的地方，不写死在逻辑流程里。

构造函数耦合状态违反 OCP，解耦是策略模式？命令模式？


委托 等的具体处理逻辑委托给具体的状态类

格力变化 OCP


## 2. 抽象本质
### 取消显式的条件判断——移除映射，直接引用
1. 下面用状态模式实现状态机之后，就不存在状态判断了。但是想想，状态机要执行行为，确实还是要知道当前状态的。
2. 那么，在状态模式下，为什么不需要显式的判断了？实际上的判断是在哪里进行的？
3. 可以看到，在没有使用状态模式时，当前的状态是标记在 `state` 属性中的，类型是字符串，指示状态的名称。
4. 所以在执行某个行为时，要先根据 `state` 确定状态名称，然后找到该状态对应的方法。
5. 而使用状态模式，标记状态的不再是状态的名称了，而是状态本身。
6. 所以在执行行为时，不需要通过名字找对象了，现在直接可以找到对象。
7. 下面还可以通过一个折衷的办法来取消显式的条件判断
    ```js
    class Light {
        // ...省略其他

        buttonWasPressed () {
            stateMap[this.state](this);
        }
    }

    const stateMap = {
        off ( ctx ) {
            console.log( '弱光' );
            ctx.state = 'weakLight';
        },
        weakLight ( ctx ) {
            console.log( '强光' );
            ctx.state = 'strongLight';
        },
        strongLight ( ctx ) {
            console.log( '关灯' );
            ctx.state = 'off';
        },
    };
    ```
8. 可以看到，现在仍然是使用字符串的 `state` 来保存当前状态的名字而不是直接引用状态。但不同的是，现在是把条件判断的工作交给了哈希表 `stateMap` 去执行。`stateMap` 内部仍然需要根据状态的名字来找到状态，但在我们的代码中就实现了环境和状态的解耦。


## 3. 实现原理
1. 把每种状态都从原对象分离出去，作为一个个单独的状态对象，内部包含了该状态下的行为。
2. 原对象现在不再负责具体的行为，也不引用所有的状态对象，它只引用当前状态对应的状态对象。
3. 原对象现在成了当前状态的运行环境。
4. 需要执行行为时，环境直接委托给当前状态对象。
5. 如果需要切换当前执行环境的状态，需要调用环境的某个方法来改变环境对当前状态对象的引用。
6. 具体要切换到哪个状态对象，是由当前状态对象决定的，而不是由环境决定的。
7. 理论上来说，环境是不需要引用所有状态对象的，它只需要引用当前状态对象。切换状态的时候，当前状态对象传给环境需要切换到的状态对象的引用就行了。
8. 这种情况下，一个状态对象类需要引用它状态转换的目标状态对象。有时这样会更方便一些，不过有时状态类引用其他状态类的实例并不方便。


## 4. 适用场景
### 一个对象针对不同状态有不同的行为，而且状态比较多或者经常变动的情况
1. 因为状态比较多，要是都放在一个对象里，首先体积上会很臃肿，而且还要进行复杂的逻辑判断。
2. 对于经常变动的情况，这里的变动包括状态本身的增减或者状态行为的改变。使用状态模式就可以分离经常变的和不经常变化的。
3. 这种场景的一个典型特点就是对象行为中会有很多条件判断语句来区分不同的状态。


## 5. 缺点
* **需要额外维护若干状态类**：applying the pattern can be overkill if a state machine has only a few states or rarely changes.
* **状态分散在不同的地方**：由于逻辑分散在状态类中，虽然避开了不受欢迎的条件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。


## 一个电灯状态机的例子
### 有限状态机（Finite-State Machine）
1. 考虑那种一个开关按钮就可以切换开关和光强度的灯。第一次按，弱光；再按，强光；再按，关灯；再按，弱光……
2. 这就是有一个有限状态机。有限状态机具有以下特点
    * 状态有限：在任意时刻，程序中有有限数量的状态。这里的灯就是有 光灯-弱光-强光 三种状态。
    * 每种状态下程序的行为不同：这里的等虽然每次都是按按钮这同一个操作，但是执行的行为是不同的。
    * 可能的状态转换：例如 “学历” 对象，可能有 小学-中学-大学-研究生 四种状态。前三种状态都有一个 “升学” 的方法，可以转换到下一个状态，而最后一个研究生就不再有 “升学” 了，或者也有但是什么都不执行。

### 不使用状态模式的一个电灯状态机
```js
class Light {
    constructor () {
        // 默认为关
        this.state = 'off';
        this.button = null;
    }

    init () {
        let button = document.createElement( 'button' );

        button.innerHTML = '开关';
        this.button = document.body.appendChild( button );
        this.button.onclick = ()=>{
            // 开关绑定点击事件
            this.buttonWasPressed();
        }
    }

    // 第一次按开启弱光，第二次按开启强光，再按关闭
    // 
    buttonWasPressed () {
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

### 缺点
#### 重复的状态判断
1. 现在这个状态机里还只有 `buttonWasPressed` 这一个涉及状态的方法，在现实中，可能会有更多的方法设计状态。那么每一个方法在其内部都要通过条件语句判断所有可能的状态。
2. 重复不仅仅是多做一份工作，更严重的是会带来混乱。

#### 违反 SRP
1. 核心逻辑（灯光切换）没有和业务数据（不同的灯光模式）分离，全部在 `buttonWasPressed` 中。
2. 这里只是简单的 `console.log`，实际业务中的代码量会更多，逻辑也会更复杂。

#### 违反 OCP —— 数据和逻辑没有分离
1. 扩展即修改：因为核心逻辑没有和业务数据分离，所以每次要修改转换逻辑，或者增删修改状态，所有涉及状态的核心逻辑方法都要进行修改。
2. 本例中还只需要修改 `buttonWasPressed` 一个方法，现实中可能需要同时修改好几个方法。

#### 状态管理不明确
* 状态关系不明确：理想的是单独建立一个状态与行为的映射，而不是直接 `if-else` 罗列。
* 状态修改不明确：状态修改是直接给变量赋值，不仅无法约束合理的值，也无法追踪赋值操作，应该有一种更规范的切换机制。              

### 使用状态模式改进 
1. 通常我们谈到封装，一般都会优先封装对象的行为，而不是对象的状态。
2. 但在状态模式中刚好相反，状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部。
3. 之前所有的行为都是由原对象来执行，现在原对象不执行具体行为了，它成了一个执行环境。
4. 这个执行环境甚至不需要引用提取出去的若干个状态对象，它只需要引用当前的那个状态对象，需要执行具体行为时，执行环境直接委托给当前的状态对象。
5. 至于不同状态之间的转换规则，也是由具体的状态对象来处理。即，一个状态对象要决定它会转换为哪个对象。
6. 执行环境并不需要负责某个对象转换为哪个对象，具体状态对象转换的时候只要告诉执行环境当前转换切换成哪个就行了。
7. 如果执行环境还需要负责谁转换为谁，那它还是没有和状态解耦。
    ```js
    // OffLightState
    class OffLightState {
        constructor(light){
            this.light = light;
        }

        buttonWasPressed(){
            console.log( '弱光' );    // offLightState对应的行为
            this.light.setState( this.light.weakLightState );    // 切换状态到weakLightState
        }
    }


    // WeakLightState
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

### `Light` 类和具体的状态解耦和耦合 
1. 可以看到，上面 `Light` 的构造函数里，和具体的状态耦合了。
2. 应该考虑可以动态的传入状态实例给 `Light` 类。如下
    ```js
    class Light {
        constructor () {
            this.button = null;
            this._currState = null; 
        }

        init(){
            let button = document.createElement( 'button' );

            button.innerHTML = '开关';
            this.button = document.body.appendChild( button );
            this.button.onclick = ()=>{
                this._currState.buttonWasPressed();
            }
        }

        // 动态添加状态
        addState ( stateInstance, stateName ) {
            stateInstance.name = stateName;
            this[stateName] = stateInstance;
        }

        // 设置初始状态
        setInitStateByName ( stateName ) {
            this.setState( this[stateName] );
        }

        setState( newState ){
            this._currState = newState;
        }

        get currentState () {
            return this._currState.name;
        }
    }

    let light = new Light();
    let offLightState = new OffLightState( light );
    let weakLightState = new WeakLightState( light );
    let strongLightState = new StrongLightState( light );

    // 动态的传入状态实例。
    // 还需要传入一个实例名称，用于在状态实例中对该实例的引用，
    // 比如 StrongLightState 类中引用 this.light.offLightState
    light.addState( offLightState, 'offLightState' );
    light.addState( weakLightState, 'weakLightState' );
    light.addState( strongLightState, 'strongLightState' );

    // 自主选择初始状态
    light.setInitStateByName( 'strongLightState' );

    light.init();

    console.log( light.currentState );
    ```

### 作为环境的 `Light` 甚至不需要引用所有的状态对象
1. 因为环境不需要知道哪个状态转换为哪个状态，所以理论上它不需要知道都有哪些状态。
2. 环境切换状态的时候，只需要接收要切换的状态对象实例，然后将其设为当前对象的引用即可
    ```js
    class OffLightState {
        constructor(light){
            this.light = light;
        }

        buttonWasPressed(){
            console.log( '弱光' );
            // 直接引用状态转换的目标状态对象，传递给环境让它切换
            this.light.setState( weakLightState );
        }
    }

    class WeakLightState {
        constructor(light){
            this.light = light;
        }

        buttonWasPressed(){
            console.log( '强光' );
            this.light.setState( strongLightState );
        }
    }

    class StrongLightState {
        constructor(light){
            this.light = light;
        }

        buttonWasPressed(){
            console.log( '关灯' );
            this.light.setState( offLightState );
        }
    }


    class Light {
        constructor () {
            this.button = null;
            this._currState = null; 
        }

        init(){
            let button = document.createElement( 'button' );

            button.innerHTML = '开关';
            this.button = document.body.appendChild( button );
            this.button.onclick = ()=>{
                this._currState.buttonWasPressed();
            }
        }

        // 不需要关心有哪些状态对象，接收状态对象实例，改变当前状态对象的引用即可
        setState( newState ){
            this._currState = newState;
        }

        get currentState () {
            return this._currState;
        }
    }

    let light = new Light();
    let offLightState = new OffLightState( light );
    let weakLightState = new WeakLightState( light );
    let strongLightState = new StrongLightState( light );

    // 环境只引用一个当前状态对象
    light.setState( offLightState);

    light.init();

    console.log( light.currentState );
    ```
3. 这样改变后，环境变得更简单了。但缺点也很明显，就是各个状态类需要直接找到转换目标的状态对象实例进行引用，而这些实例可能分布在各个地方。这样就让引用关系看起来很乱，正好是需要应用中介者模式进行重构的那种情况。
4. 而如果让环境引用所有的状态实例，各个状态对象都统一到环境去引用，就整齐的多了。

### 改进的部分
#### 没有重复的状态判断了
甚至根本就没有状态判断了。

#### SRP 和 OCP
1. 业务数据和环境分离，环境只负责调用当前状态的方法，具体的执行逻辑都在状态对象里。
2. 之后业务数据的修改只会发生在具体的状态对象里，不会影响到执行环境。

#### 状态管理明确
* 状态关系明确：通过 `addState` 方法明确指定状态和对应的处理逻辑（状态对象）。
* 状态修改明确：状态修改统一通过 `setState` 方法。


## 缺少抽象类的变通方式
1. 我们看到，在状态类中将定义一些共同的行为方法，Context 最终会将请求委托给状态对象的这些方法，在这个例子里，这个方法就是 `buttonWasPressed`。无论增加了多少种状态类，它们都必须实现 `buttonWasPressed` 方法。
2. 在 Java 中，所有的状态类必须继承自一个 `State` 抽象父类，当然如果没有共同的功能值得放入抽象父类中，也可以选择实现 `State` 接口。这样做的原因一方面是我们曾多次提过的向上转型，另一方面是保证所有的状态子类都实现了 `buttonWasPressed` 方法。
3. 遗憾的是，JavaScript 既不支持抽象类，也没有接口的概念。所以在使用状态模式的时候要格外小心，如果我们编写一个状态子类时，忘记了给这个状态子类实现 `buttonWasPressed` 方法，则会在状态切换的时候抛出异常。因为 Context 总是把请求委托给状态对象的 `buttonWasPressed` 方法。
4. 这里还是使用模板方法模式中的方法，定义一个状态超类，里面会对子类进行接口检查
    ```js
    class LightState {
        constructor () {
            this.requiredSubclassMethods = ['buttonWasPressed'];
            this.checkAPI(this);
            this.light = light;
        }

        checkAPI ( instance ) {
            let prototype = Object.getPrototypeOf( instance ) ;
            let methods = Object.getOwnPropertyNames( prototype );
            this.requiredSubclassMethods.every(( key ) => {
                if ( !methods.includes(key) ) {
                    throw new Error(`子类必须重写 ${key} 方法`);
                }
                return true;
            });
        }
    }

    class OffLightState extends LightState {
        constructor () {
            super();
        }

        buttonWasPressed () {
            console.log( '弱光' );    
            this.light.setState( this.light.weakLightState );    
        }
    }

    class WeakLightState extends LightState {
        constructor () {
            super();
        }

        buttonWasPressed () {
            console.log( '强光' );    
            this.light.setState( this.light.strongLightState );     
        }
    }

    class StrongLightState extends LightState {
        constructor () {
            super();
        }

        buttonWasPressed () {
            console.log( '超强光' ); 
            this.light.setState( this.light.superStrongLightState );  
        }
    }

    class SuperStrongLightState extends LightState {
        constructor () {
            super();
        }

        buttonWasPressed () {
            console.log( '关灯' );
            this.light.setState( this.light.offLightState ); 
        }
    }
    ```


## 状态模式中的性能优化点
### 是否动态创建并销毁状态对象
1. 有两种选择来管理 `state` 对象的创建和销毁。第一种是仅当 `state` 对象被需要时才创建并随后销毁，另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。
2. 如果 `state` 对象比较庞大，可以用第一种方式来节省内存，这样可以避免创建一些不会用到的对象并及时地回收它们。但如果状态的改变很频繁，最好一开始就把这些 `state` 对象都创建出来，也没有必要销毁它们，因为可能很快将再次用到它们。

### 多个 context 共享状态对象
如果多个 `state` 对象类似的，那么可以使用享元模式来减少对象的数量。


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



## 和其他模式的关系
### 策略模式
1. 状态模式和策略模式像一对双胞胎，它们都封装了一系列的算法或者行为，它们的类图看起来几乎一模一样，但在意图上有很大不同，因此它们是两种迥然不同的模式。
2. 策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。
3. 它们之间的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；而在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部。对客户来说，并不需要了解这些细节。这正是状态模式的作用所在。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/state)
