# State

状态模式是一种行为设计模式， 让你能在一个对象的内部状态变化时改变其行为， 使其看上去就像改变了自身所属的类一样。

<!-- TOC -->

- [State](#state)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [1. 设计思想](#1-设计思想)
        - [去中心化及其优劣](#去中心化及其优劣)
            - [去中心化](#去中心化)
            - [优劣](#优劣)
        - [状态模式的特别性：封装状态——在封装行为之上进一步的剥离，将复杂的状态逻辑打碎分散](#状态模式的特别性封装状态在封装行为之上进一步的剥离将复杂的状态逻辑打碎分散)
        - [SRP](#srp)
        - [OCP](#ocp)
            - [隔离变化](#隔离变化)
            - [数据和环境分离](#数据和环境分离)
    - [2. 抽象本质](#2-抽象本质)
        - [有限状态机](#有限状态机)
        - [本质上和策略模式一样](#本质上和策略模式一样)
        - [数据和执行环境解耦](#数据和执行环境解耦)
        - [取消显式的条件判断——移除映射，直接引用](#取消显式的条件判断移除映射直接引用)
    - [3. 实现原理](#3-实现原理)
    - [4. 适用场景](#4-适用场景)
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
        - [改进的部分](#改进的部分)
            - [没有重复的状态判断了](#没有重复的状态判断了)
            - [SRP 和 OCP](#srp-和-ocp)
            - [状态管理明确](#状态管理明确)
    - [缺少抽象类的变通方式](#缺少抽象类的变通方式)
    - [状态模式中的性能优化点](#状态模式中的性能优化点)
        - [是否动态创建并销毁状态对象](#是否动态创建并销毁状态对象)
        - [多个 context 共享状态对象](#多个-context-共享状态对象)
    - [JavaScript 版本的状态机](#javascript-版本的状态机)
        - [可以使用一个委托函数来明确的和状态对象建立委托关系](#可以使用一个委托函数来明确的和状态对象建立委托关系)
    - [和其他模式的关系](#和其他模式的关系)
        - [策略模式](#策略模式)
    - [References](#references)

<!-- /TOC -->


## 设计目的
    
### 关键细节


## 实现原理


## 1. 设计思想
### 去中心化及其优劣
#### 去中心化
1. 在使用状态模式对状态机的重构中，有一个明显去中心化过程。
2. 本来，状态的转换都是在环境中进行了，环境就是中心。使用状态模式后，状态的转换交给了一个个具体的状态。
3. 环境现在甚至不需要知道有哪些状态，更不会知道有哪些状态转换规则。
4. 环境现在只需要保证符合转换规则的切换流程可以正常执行。

#### 优劣
1. 集权和自治的对立是广泛且持久存在的，并没有固定的好坏标准，都需要根据具体的情况具体分析。
2. 集权对于中心的成本更高，而且会丧失灵活性。但可以对各部分有更好的掌控。
3. 自治会更灵活，但仍然需要一个中心，或者说是一套公共的规则。这个规则必须明确且严格，保证自治不会变成乱来。比如作为状态类的接口或者超类，就要保证具体的对象类实现了要求的方法。

### 状态模式的特别性：封装状态——在封装行为之上进一步的剥离，将复杂的状态逻辑打碎分散
1. 封装行为其实类似于，电灯开关例子中第一种情况中，把条件语句的具体执行的逻辑进行封装，而状态的关系还保留在 context 中。
2. 而封装状态后，context 也不关心状态关系了，某种状态和它对应的行为被封装在一起，作为外部的业务逻辑。
3. 想象一个对象有很多状态，这些状态会形成一个网状的状态策略路径网。如果 context 中维护这种状态关系会很复杂，需要判断各种情况下状态将导致怎样的行为。
4. 而如果使用状态模式，则完全不需要维护策略路径网。因为某个状态都有自己明确的行为，策略网上的每一步都被封装在某个具体的状态内部了，切换状态的行为也交给了某种具体的状态，因为切换状态也属于某种状态的行为。
5. Context 现在只需要维持一个引用，该引用指向当前的状态对象。需要发生行为时，直接使用该状态对象即可，不需要做任何判断。

### SRP
将与特定状态相关的代码放在单独的类中。

### OCP 
#### 隔离变化
状态机的执行规则不常变动，但状态常常变动，所以将状态分离出去，作为参数传入。

#### 数据和环境分离
状态机本身是执行环境，不同的状态是状态机的输入数据。


## 2. 抽象本质
### 有限状态机
1. 状态模式与 **有限状态机**（Finite-State Machine）的概念紧密相关。其主要思想是：
    * 程序在任意时刻仅可处于几种有限的状态中；
    * 在任何一个特定状态中，程序的行为都不相同；
    * 根据当前状态，程序可能会切换到另外一种状态，也可能会保持当前状态不变。
2. 你还可将该方法应用在对象上。假如你有一个文档类 `Document`，文档可能会处于 *草稿*、*审阅中* 和 *已发布* 三种状态中的一种。文档的 `publish` 发布方法在不同状态下的行为略有不同：
    * 处于 *草稿* 状态时，它会将文档转移到 *审阅中* 状态；
    * 处于 *审阅中* 状态时，如果当前用户是管理员，它会公开发布文档；
    * 处于 *已发布* 状态时，它不会进行任何操作。
    
### 本质上和策略模式一样
都是把对象在不同状态下执行的不同行为分离出单独的策略，然后根据不同的状态使用不同的策略。

### 数据和执行环境解耦
1. 对于一个状态机来说，它可以处理不同的状态。所以状态就属于状态机的数据，属于外部输入的东西。而状态机本身就是数据的执行环境。
2. 在没有使用状态模式之前，数据和环境是耦合在一起的。使用状态模式之后，状态就成了状态机的输入。
3. 现在，状态和环境就从之前耦合的关系变成了引用的关系。

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
1. 一个对象针对不同状态有不同的行为，这些状态比较多，并且会互相切换，尤其是状态会经常增删以及状态内部逻辑经常变动的情况。
2. 因为状态比较多，要是都放在一个对象里，首先体积上会很臃肿，而且还要进行复杂的逻辑判断。
3. 对于经常变动的情况，这里的变动包括状态本身的增减或者状态行为的改变。使用状态模式就可以分离经常变的和不经常变化的。
4. 这种场景的一个典型特点就是对象行为中会有很多条件判断语句来区分不同的状态。
5. 重要的一点是，对象本身的行为会导致对象状态的改变。如果一个对象的状态改变只是由外部决定，那么即使把自身的若干种状态分离出去，环境每次要触发行为时，还是需要自己判断当前的状态。


## 5. 缺点
* **需要额外维护若干状态类**：如果状态机只有很少的几个状态， 或者很少发生改变， 那么应用该模式可能会显得小题大作。
* **状态分散在不同的地方**：由于逻辑分散在状态类中，虽然避开了不受欢迎的条件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。


## 一个电灯状态机的例子
### 有限状态机（Finite-State Machine）
1. 考虑那种一个开关按钮就可以切换开关和光强度的灯。第一次按，弱光；再按，强光；再按，关灯；再按，弱光……
2. 这就是有一个有限状态机。有限状态机具有以下特点
    * 状态有限：在任意时刻，程序中有有限数量的状态。这里的灯就是有 光灯-弱光-强光 三种状态。
    * 每种状态下程序的行为不同：这里的灯虽然每次都是按按钮这同一个操作，但是执行的行为是不同的。
    * 可能的状态转换：电灯状态机的每种状态都可以通过灯光切换转换到其他状态。
3. 上面说到 “可能的” 状态转换，因为并不是所有情况都会像电灯一样每种状态都能发生转换。例如 “学历” 对象，可能有 小学-中学-大学-研究生 四种状态。前三种状态都有一个 “升学” 的方法，可以转换到下一个状态，而最后一个研究生就不再有 “升学” 了，或者也有但是什么都不执行。

### 不使用状态模式的一个电灯状态机
```js
class Light {
    constructor () {
        this.state = "off"; // 默认为关
        this.button = null;
    }

    init (button) {
        this.button = document.body.appendChild( button );
        this.button.onclick = ()=>{
            // 开关绑定点击事件
            this.buttonWasPressed();
        }
    }

    // 第一次按开启弱光，第二次按开启强光，再按关闭
    buttonWasPressed () {
        if ( this.state === "off" ){
            console.log( "弱光" );
            this.state = "weakLight";
        }
        else if ( this.state === "weakLight" ){
            console.log( "强光" );
            this.state = "strongLight";
        }
        else if ( this.state === "strongLight" ){
            console.log( "关灯" );
            this.state = "off";
        }
    }
}

let light = new Light();
let button = document.querySelector("#btn");
light.init(button);
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
7. 如果执行环境还需要负责谁转换为谁，那它还是没有和状态解耦
    ```js
    class OffLightState {
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "弱光" ); // offLightState 对应的行为
            this.light.setState( this.light.weakLightState ); // 切换状态到 weakLightState
        }
    }

    class WeakLightState {
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "强光" ); // weakLightState 对应的行为
            this.light.setState( this.light.strongLightState ); // 切换状态到 strongLightState
        }
    }

    class StrongLightState {
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "关灯" ); // strongLightState 对应的行为
            this.light.setState( this.light.offLightState ); // 切换状态到 offLightState
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

        init (button) {
            this.button = button;
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
    let button = document.querySelector("#btn");
    light.init(button);
    ```

### `Light` 类和具体的状态解耦和耦合 
1. 可以看到，上面 `Light` 的构造函数里，和具体的状态耦合了，如果之后要新增或删除状态，还是要修改作为环境的 `Light` 的代码。
2. 应该考虑可以动态的传入状态实例给 `Light` 类。首先改造 `Light` 类如下
    ```js
    class Light {
        constructor () {
            this._button = null;
            this._currState = null; 
            this._stateInstances = new WeakMap(); // 保存动态传入的状态实例
        }

        // 动态添加状态实例
        addState ( stateInstance ) {
            // 保存为 类构造函数-类实例 的映射
            let stateCons = this._getStateCons(stateInstance);
            this._stateInstances.set(stateCons, stateInstance);
            return this;
        }

        // 切换状态
        // 因为切换方法是在状态类中定义的，当时还没有状态实例，所以通过类构造函数来设置
        setState ( stateCons ) {
            this._currState = this._stateInstances.get(stateCons);
        }

        // 设置初始状态
        setInitState ( stateInstance ) {
            this.setState( this._getStateCons(stateInstance) );
        }

        init (button) {
            this._button = button;
            this._button.onclick = ()=>{
                this._currState.buttonWasPressed();
            }
        }

        _getStateCons (stateInstance) {
            return Object.getPrototypeOf(stateInstance).constructor;
        }
    }
    ```
3. 接下来创建需要的状态类
    ```js
    class OffLightState {
        // 切换状态时需要使用 Light 的 setState 方法
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "弱光" );
            // 设置切换到的状态
            this.light.setState( WeakLightState ); 
        }
    }

    class WeakLightState {
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "强光" );
            this.light.setState( StrongLightState );
        }
    }

    class StrongLightState {
        constructor (light) {
            this.light = light;
        }

        buttonWasPressed () {
            console.log( "关灯" );
            this.light.setState( OffLightState );
        }
    }
    ```
4. 实例化 `Light` 和所需的状态，并传入状态实例
    ```js
    let light = new Light();
    let offLightState = new OffLightState(light);
    let weakLightState = new WeakLightState(light);
    let strongLightState = new StrongLightState(light);

    // 动态的传入状态实例
    light
    .addState(offLightState)
    .addState(weakLightState)
    .addState(strongLightState);
    ```
5. 初始化
    ```js
    // 自主选择初始状态
    light.setInitState(strongLightState);

    let button = document.querySelector("#btn");
    light.init(button);
    ```    

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
                    throw new Error(`子类 ${prototype.constructor.name} 必须重写 ${key} 方法`);
                }
                return true;
            });
        }
    }

    class OffLightState extends LightState {
        // 切换状态时需要使用 Light 的 setState 方法
        constructor (light) {
            super();
        }

        buttonWasPressed () {
            console.log( "弱光" );
            // 设置切换到的状态
            this.light.setState( WeakLightState ); 
        }
    }

    class WeakLightState extends LightState {
        constructor (light) {
            super();
        }

        buttonWasPressed () {
            console.log( "强光" );
            this.light.setState( StrongLightState );
        }
    }

    class StrongLightState extends LightState {
        constructor (light) {
            super();
        }

        buttonWasPressed () {
            console.log( "关灯" );
            this.light.setState( OffLightState );
        }
    }
    ```


## 状态模式中的性能优化点
### 是否动态创建并销毁状态对象
1. 有两种选择来管理 state 对象的创建和销毁。第一种是仅当 state 对象被需要时才创建并随后销毁，另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。
2. 如果 state 对象比较庞大，可以用第一种方式来节省内存，这样可以避免创建一些不会用到的对象并及时地回收它们。但如果状态的改变很频繁，最好一开始就把这些 state 对象都创建出来，也没有必要销毁它们，因为可能很快将再次用到它们。

### 多个 context 共享状态对象
如果多个 state 对象类似的，那么可以使用享元模式来减少对象的数量。


## JavaScript 版本的状态机
1. 状态模式是状态机的实现之一，但在 JavaScript 这种 “无类” 语言中，没有规定让状态对象一定要从类中创建而来。
2. 另外一点，JavaScript 可以非常方便地使用委托技术，并不需要事先让一个对象持有另一个对象，直接引用被委托对象的方法，执行的时候设置 `this` 就行了。
3. 下面的状态机选择了通过 `Function.prototype.call` 方法直接把请求委托给某个字面量对象来执行
    ```js
    const FSM = {
        off: {
            buttonWasPressed () {
                this.button.innerHTML = '关灯';
                this.currState = FSM.on;
                console.log( '灯已打开' );
            }
        },
        on: {
            buttonWasPressed () {
                this.button.innerHTML = '开灯';
                this.currState = FSM.off;
                console.log( '灯已关闭' );
            }
        }
    };

    class Light {
        constructor () {
            this.currState = FSM.off;
            this.button = null;
        }

        init (button) {
            this.button = button; 
            this.button.onclick = () => {
                this.currState.buttonWasPressed.call( this );  // 把请求委托给 FSM
            }
        }
    };

    let light = new Light();
    let button = document.querySelector('#btn');
    light.init(button);
    ```
    
### 可以使用一个委托函数来明确的和状态对象建立委托关系
```js
const delegateState = function ( client, delegation ) {
    return {
        buttonWasPressed ( ...args ) {    // 将客户的操作委托给 delegation 对象
            return delegation.buttonWasPressed.apply( client, args );
        }
    }
};

const FSM = {
    off: {
        buttonWasPressed () {
            console.log( '开灯' );
            this.button.innerHTML = '下一次按我是关灯';
            this.currState = this.onState;
        }
    },
    on: {
        buttonWasPressed () {
            console.log( '关灯' );
            this.button.innerHTML = '下一次按我是开灯';
            this.currState = this.offState;
        }
    }
};

class Light {
    constructor () {
        this.offState = delegateState( this, FSM.off );
        this.onState = delegateState( this, FSM.on );
        this.currState = this.offState;    // 设置初始状态为关闭状态
        this.button = null;
    }

    init (button) {
        this.button = button;
        this.button.onclick = () => {
            this.currState.buttonWasPressed();
        }
    }
};


let light = new Light();
let button = document.querySelector('#btn');
light.init(button);
```


## 和其他模式的关系
### 策略模式
1. 状态模式和策略模式像一对双胞胎，它们都封装了一系列的算法或者行为，它们的类图看起来几乎一模一样，但在意图上有很大不同，因此它们是两种迥然不同的模式。
2. 策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。
3. 它们之间的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；
4. 而在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为” 这件事情发生在状态模式内部。对客户来说，并不需要了解这些细节。这正是状态模式的作用所在。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/state)
* [JavaScript与有限状态机](https://www.ruanyifeng.com/blog/2013/09/finite-state_machine_for_javascript.html)
