# Strategy

策略模式是一种行为设计模式，它能让你定义一系列算法，并将每种算法分别放入独立的类中，以使算法的对象能够相互替换。

<!-- TOC -->

- [Strategy](#strategy)
    - [设计思想](#设计思想)
        - [SRP](#srp)
        - [OCP——把经常变的和不变的进行分离](#ocp把经常变的和不变的进行分离)
        - [复用](#复用)
        - [运行时的灵活组合](#运行时的灵活组合)
    - [抽象本质](#抽象本质)
    - [实现原理](#实现原理)
    - [适用场景](#适用场景)
    - [缺点](#缺点)
    - [和面向对象编程的相关设计原则](#和面向对象编程的相关设计原则)
        - [针对接口编程，而不是针对实现编程](#针对接口编程而不是针对实现编程)
        - [多用组合，少用继承](#多用组合少用继承)
    - [需要使用策略模式的一个例子](#需要使用策略模式的一个例子)
        - [需求](#需求)
        - [初步的设计](#初步的设计)
        - [存在的问题：](#存在的问题)
            - [违反 OPC](#违反-opc)
            - [意图与实现没有分离](#意图与实现没有分离)
            - [无法复用](#无法复用)
        - [使用组合函数重构代码](#使用组合函数重构代码)
        - [改进的部分](#改进的部分)
            - [计算的部分意图与实现分离](#计算的部分意图与实现分离)
            - [方便复用](#方便复用)
        - [仍然存在的问题](#仍然存在的问题)
    - [面向对象的方式实现策略模式](#面向对象的方式实现策略模式)
    - [策略模式的设计——分离出独立的策略算法实现](#策略模式的设计分离出独立的策略算法实现)
    - [多态在策略模式中的体现](#多态在策略模式中的体现)
    - [JavaScript 版本的策略模式](#javascript-版本的策略模式)
    - [一等函数对象与策略模式](#一等函数对象与策略模式)
    - [更广义的 “策略”](#更广义的-策略)
    - [表单校验的策略模式应用](#表单校验的策略模式应用)
        - [需求](#需求-1)
        - [不使用策略模式的一个思路](#不使用策略模式的一个思路)
            - [代码](#代码)
            - [缺点](#缺点-1)
        - [用策略模式重构表单校验](#用策略模式重构表单校验)
        - [策略模式重构后改进的地方](#策略模式重构后改进的地方)
    - [和其他模式的关系](#和其他模式的关系)
        - [状态模式](#状态模式)
        - [命令模式](#命令模式)
        - [模板方法模式](#模板方法模式)
        - [状态模式](#状态模式-1)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### SRP
1. 策略的实现、选择和执行分成了三个独立的部分。
2. 不同的策略的实现也进行了独立的封装。
3. 因为实现了 SRP，所以下面各种特点才得以实现。

### OCP——把经常变的和不变的进行分离
1. 策略模式提供了对 OCP 的完美支持，将算法封装在独立的策略中，使得它们易于切换，易于理解，易于扩展。
2. 外部的变化，都可以通过增加策略或者修改策略来改变，但执行策略的部分，则可以一直稳定不变。
3. 策略作为参数传入，策略的执行者变成了一个 “纯函数”，只负责执行参数，不负责针对外部环境做判断，也不受外部环境影响。

### 复用
1. 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
2. 这里的重点是，一个策略可以被组合在不同的类里面。
3. 比如一个策略是实现飞行的，那么它可以被组合在鸽子的类里面，也可以被组合在天鹅的类里面。
4. 这里对比继承的复用，继承的复用只是子类复用父类。

### 运行时的灵活组合
当我们把各种算法都放在独立的策略中，当一个对象在运行时，可以根据环境来灵活的选择使用哪种策略，而不是一开始就写死的对象内部。


## 抽象本质


## 实现原理
1. 将每个功能封装为独立的策略对象。每个策略对象都实现一个统一的接口，让执行环境来调用来运行功能。
2. 执行环境提供一个接口来接收一个策略对象。
3. 根据情况选择一个策略对象传入执行环境，执行环境调用策略的运行接口来运行功能。
4. 对于 JavaScript 这种函数一等公民的情况，只要把功能实现为函数就算是统一的接口了；执行环境接收函数也是可以很方便的通过参数。


## 适用场景
1. 一个对象可以处理若干种不同的情况，针对每种情况需要在运行时采取不同的策略。特别是策略会随着需求变动增删或修改的情况。
2. 这种场景的一个典型特征是，在对象的处理逻辑中有多个条件分支。
3. 另外，如果有好几个对象的功能和语义都相似，可以改造成策略模式。


## 缺点
* 客户端必须知晓策略间的不同——它需要选择合适的策略。


## 和面向对象编程的相关设计原则
### 针对接口编程，而不是针对实现编程
1. 面向对象中的接口，实际上就相当于这里的策略。
2. 我们预先定义好几个接口，一个对象在实例化之后，在运行时可以调用其自身的方法（类似于下面的 `setStrategy` 方法）来设置其实现哪个接口。
3. 正如我们不应该把具体的策略写死在策略执行对象里一样，在设计一个类的时候，也不应该把行为写在类的实现里，而应该写在独立的接口（策略）里。

### 多用组合，少用继承
1. 继承显然不够灵活，一个类继承了什么就是什么，不能改变。
2. 但组合，也就是这里的策略模式，可以在运行时根据需要灵活的组合想要的行为。
3. 而且一种策略（接口），也可以被组合进不同的类里面。这种多个类的行为复用比子类对父类的复用范围更广。


## 需要使用策略模式的一个例子
### 需求
绩效等级决定奖金倍数，要求通过绩效等级来计算最终的奖金数。

### 初步的设计
```js
function calculateBonus( performanceLevel, salary ){
    if ( performanceLevel === 'S' ){
        return salary * 4;
    }
    if ( performanceLevel === 'A' ){
        return salary * 3;
    }
    if ( performanceLevel === 'B' ){
        return salary * 2;
    }

};

console.log(calculateBonus( 'B', 20000 ));  // 40000
console.log(calculateBonus( 'S', 6000 ));   // 24000
```

### 存在的问题：
#### 违反 OPC
1. 如果奖金等级发生改变或增删，都要修改这个函数。
2. 这违反了 OCP(Open–closed principle)：software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification。

#### 意图与实现没有分离
1. 每种计算逻辑都是行内写法，是直接的计算方法实现。
2. 目前计算实现的逻辑很简单还好，如果以后复杂了，直接写在行内就影响阅读。

#### 无法复用
三个计算奖金的逻辑都是行内的，如果在其他地方也想用到某个计算奖金的逻辑，不能复用


### 使用组合函数重构代码
```js
const performanceS = function( salary ) {
    return salary * 4;
};
const performanceA = function( salary ) {
    return salary * 3;
};
const performanceB = function( salary ) {
    return salary * 2;
};

const calculateBonus = function( performanceLevel, salary ) {
    if ( performanceLevel === 'S' ) {
        return performanceS( salary );
    }
    if ( performanceLevel === 'A' ) {
        return performanceA( salary );
    }
    if ( performanceLevel === 'B' ) {
        return performanceB( salary );
    }
};

calculateBonus('A', 10000 );    // 输出：30000
```

### 改进的部分
#### 计算的部分意图与实现分离
不管某个计算再复杂，在 `calculateBonus` 中也只需要调用其函数，函数名明确了表明了意图

#### 方便复用   
三种计算函数可以用在其他地方

### 仍然存在的问题
违反 OPC 的问题仍然没有解决，`calculateBonus` 内部的逻辑分支仍然是写死的三种。


## 面向对象的方式实现策略模式
```js
// 制定策略
class PerformanceS {
    calculate (salary) {
        return salary * 4;
    }
}
class PerformanceA {
    calculate (salary) {
        return salary * 3;
    }
}
class PerformanceB {
    calculate (salary) {
        return salary * 2;
    }
}

// 执行策略
class Bonus {
    constructor () {
        this.salary = null;
        this.strategy = null; 
    }
    setSalary ( salary ) {
        this.salary = salary;
    }
    setStrategy ( strategy ) {
        this.strategy = strategy;
    }
    getBonus () {
        return this.strategy.calculate( this.salary );
    }
}

// 选择制定好的策略，并调用执行策略的部分
let bonus = new Bonus();
bonus.setSalary( 10000 );
bonus.setStrategy( new PerformanceS() ); 
console.log( bonus.getBonus() ); // 40000
bonus.setStrategy( new PerformanceA() );
console.log( bonus.getBonus() ); // 30000
```


## 策略模式的设计——分离出独立的策略算法实现
1. 可以看到，策略模式和组合函数模式的根本区别是：计算奖金对象（`Bonus`）不再自己决定选择哪种策略，而是在计算的过程中，由外部传入一种策略。
2. 最开始初步的设计是：执行环境自己实现每种策略的算法并根据情况选择策略；
3. 函数组合的设计是：将实现策略算法的工作分离出去给单独的函数来实现策略算法，执行环境只负责根据情况来选择策略；
4. 而策略模式的设计是：将选择策略的工作也分离出去，执行环境只需要在接到某个策略后无脑执行就行了。
5. 策略的实现、选择和执行分成了三个独立的部分。In Strategy pattern, a class behavior or its algorithm can be changed at run time.


## 多态在策略模式中的体现
1. 通过使用策略模式重构代码，我们消除了原程序中大片的条件分支语句。所有跟计算奖金有关的逻辑不再放在执行环境中，而是保存在外部的策略对象中。
2. 执行环境并没有计算奖金的能力，而是把这个职责委托给了某个策略对象。每个策略对象负责的算法已被各自封装在对象内部。
3. 当我们对这些策略对象发出 “计算奖金” 的请求时，它们会返回各自不同的计算结果，这正是对象多态性的体现：替换执行环境中当前保存的策略对象，便能执行不同的算法来得到我们想要的结果。


## JavaScript 版本的策略模式
```js
const strategies = {
  S ( salary ) {
      return salary * 4;
  },
  A ( salary ) {
      return salary * 3;
  },
  B ( salary ) {
      return salary * 2;
  },
};

const calculateBonus = function ( level, salary ) {
  return strategies[ level ]( salary );
};

console.log( calculateBonus( 'S', 20000 ) );
console.log( calculateBonus( 'A', 10000 ) ); 
```


## 一等函数对象与策略模式
1. 在以类为中心的传统面向对象语言中，不同的算法或者行为被封装在各个策略类中，执行环境将请求委托给这些策略对象，这些策略对象会根据请求返回不同的执行结果，这样便能表现出对象的多态性。
2. Peter Norvig 在他的演讲中曾说过：“在函数作为一等对象的语言中，策略模式是隐形的。strategy 就是值为函数的变量。”
3. 在 JavaScript 中，除了使用类来封装算法和行为之外，使用函数当然也是一种选择。这些 “算法” 可以被封装到函数中并且四处传递，也就是我们常说的 “高阶函数”。
4. 实际上在 JavaScript 这种将函数作为一等对象的语言里，策略模式已经融入到了语言本身当中，我们经常用高阶函数来封装不同的行为，并且把它传递到另一个函数中。
    ```js
    // 制定策略
    const S = function( salary ){
        return salary * 4;
    };
    const A = function( salary ){
        return salary * 3;
    };
    const B = function( salary ){
        return salary * 2;
    };

    // 执行策略
    const calculateBonus = function( func, salary ){
        return func( salary );
    };

    // 选择策略
    calculateBonus( S, 10000  );
    ```
5. 当我们对这些函数发出 “调用” 的消息时，不同的函数会返回不同的执行结果。在 JavaScript 中，“函数对象的多态性” 来得更加简单。


## 更广义的 “策略”
1. 策略模式指的是定义一系列的算法，并且把它们封装起来。
2. 从定义上看，策略模式就是用来封装算法的。但在实际开发中，我们通常会把算法的含义扩散开来，使策略模式也可以用来封装一系列的“业务规则”。只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。
3. 更进一步的推而广之，为了满足做若干种事情而搭建起的一个通用环境，各个事情可以在这个环境里自由的切换而既不影响其他事情也不影响环境，都可以算作是策略模式的应用。


## 表单校验的策略模式应用
### 需求
* 校验用户名、密码和手机号码，未来还可能根据需求增加其他校验规则
* 同样的校验规则可能用在项目的其他表单

### 不使用策略模式的一个思路
#### 代码
```js
const registerForm = document.getElementById( 'registerForm' );

registerForm.onsubmit = function () {
    if ( registerForm.userName.value === '' ){
        alert ( '用户名不能为空' );
        return false;
    }
    if ( registerForm.password.value.length < 6 ){
        alert ( '密码长度不能少于6位' );
        return false;
    }
    if ( !/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value ) ){
        alert ( '手机号码格式不正确' );
        return false;
    }
}
```

#### 缺点
* 违反了 OCP 原则。虽然原则并不一定总是适用在实际的情况，但这里显然应该适用该原则。
* 复用性差。如果其他表单也想使用校验，还要重新写一份这些规则。

### 用策略模式重构表单校验
1. 把校验逻辑都封装成策略对象，每种规则都接受一个校验值和校验失败时需要抛出的错误信息，某些规则(例如 `minLength`)还要接受校验参数
    ```js
    const strategies = {
        isNonEmpty ( value, errorMsg ) {
            if ( value === '' ){
                return errorMsg ;
            }
        },
        minLength ( value, length, errorMsg ) {
            if ( value.length < Number.parseInt(length) ) {
                return errorMsg;
            }
        },
        isMobile ( value, errorMsg ) {
            if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
                return errorMsg;
            }
        }
    };
    ```
2. 实现作为 context 的 `Validator` 类，负责接收用户的请求并委托给 `strategy` 对象
    ```js
    class Validator {
        constructor () {
            // 已经接受了参数等待执行的校验函数。添加若干条规则后，一并调用校验
            this.cache = [];
        }

        // 向校验器中添加一条校验规则
        /**
         * node 是待校验的输入框
         * rule 是一条校验规则。rule 除了校验规则字符串之外，还可能通过 `:` 分割并带上校验参数
         * errorMsg 是校验失败时返回的错误信息
         */
        add ( node, rule, errorMsg ) {
            let ary = rule.split( ':' );    // 把 strategy 和参数分开
            this.cache.push(function(){   // 把校验的步骤用空函数包装起来，并且放入 cache
                let strategy = ary.shift();    // 校验规则函数名
                // 以下两行拼接校验规则函数所需的两个或三个参数
                ary.unshift( node.value );
                ary.push( errorMsg );
                return strategies[ strategy ].apply( node, ary ); // 调用校验规则函数，并返回 `undefined` 或错误信息
            });
        }

        // 依次条用之前保存的校验函数
        start () {
            for ( let i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
                let msg = validatorFunc();    // 开始校验，并取得校验后的返回信息
                if ( msg ){     // 如果有确切的返回值，说明校验没有通过
                    return msg;
                }
            }
        };
    }
    ```
3. 应用 `Validator` 类
    ```js
    let validataFunc = function(){
        let validator = new Validator();

        // 添加一些校验规则
        validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' );
        validator.add( registerForm.password, 'minLength:6', '密码长度不能少于6位' );
        validator.add( registerForm.phoneNumber, 'isMobile', '手机号码格式不正确' );

        let errorMsg = validator.start();
        return errorMsg;
    }

     let registerForm = document.getElementById( 'registerForm' );
     registerForm.onsubmit = function(){
         let errorMsg = validataFunc();
         if ( errorMsg ){
             alert ( errorMsg );
             return false;    // 阻止表单提交
         }
    };
    ```

### 策略模式重构后改进的地方
1. `strategies` 作为公共的校验逻辑仓库，可以保存和统一管理所有的校验逻辑，供不同的表单使用，每个表单不需要每次都写自己的校验逻辑。
2. 一种校验逻辑需要更改时，只需要在 `strategies` 中进行修改，就可以作用到所有使用该逻辑的表单。
3. `Validator` 作为应用，逻辑稳定，不管是针对不同的逻辑还是不同的表单，都不需要做更改。
4. 每一个表单需要运用校验时，只需要创建 `Validator` 类并从 `strategies` 选择需要的校验规则即可，不需要再自行编写校验逻辑。


## 和其他模式的关系
### 状态模式
见状态模式

### 命令模式
见命令模式

### 模板方法模式
1. 模板方法模式基于继承机制：它允许你通过扩展子类中的部分内容来改变部分算法；策略基于组合机制：你可以通过对相应行为提供不同的策略来改变对象的部分行为。 
2. 模板方法在类层次上运作，因此它是静态的；策略在对象层次上运作，因此允许在运行时切换行为。

### 状态模式
见状态模式


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Head First 设计模式（中文版）](https://book.douban.com/subject/2243615/)
