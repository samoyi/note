# Strategy

## 核心设计思想
1. 改动尽量少的影响全局。
2. 因此需要把经常变的和不变的进行分离。
3. 变的部分可以随便变，不会影响过多；不变的部分提供接口和变的部分对接。


## 需要使用策略模式的一个例子
### 需求
绩效等级决定奖金倍数，要求通过绩效等级来计算最终的奖金数。

### 思路
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

### 问题：
1. 如果奖金等级发生改变或增删，都要修改这个函数。
2. 这违反了OCP(Open–closed principle)：software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification。


## 策略模式的原理
1. In Strategy pattern, a class behavior or its algorithm can be changed at run time。也就是说，不会像上面的例子一样，三种策略都写死在函数内部，运行时不能修改策略，只能修改函数然后再运行。
2. 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 第二个部分是环境类 context，context 接受客户的请求，随后把请求委托给某一个策略类。
3. 要做到这点，说明 context 中要维持对某个策略对象的引用，在计算具体问题是，引用策略对象中某个对应的策略。
    ```js

    // 具体的若干个策略
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

    // 在具体环境中接受实际的参数，并运用响应的策略来进行计算
    function calculateBonus ( level, salary ) {
        return strategies[ level ]( salary );
    };

    console.log( calculateBonus( 'S', 20000 ) );     // 80000
    console.log( calculateBonus( 'A', 10000 ) );     // 30000
    ```
4. 不过其实在这个例子，各种策略都是很有规律的，所以不需要使用策略模式，可以把各个策略都抽象成一个
    ```js
    let levels = {
        S: 4,
        A: 3,
        B: 2,
    };

    function calculateBonus( performanceLevel, salary ){
        return levels[performanceLevel] * salary
    };

    console.log(calculateBonus( 'B', 20000 ));  // 40000
    console.log(calculateBonus( 'S', 6000 ));   // 24000
    ```
5. 这就是另一种思路了：因为若干个策略都是类似的，所以使用统一的策略算法，然后接受不同的策略环境配置即可。
6. 不过，说到底，这两个设计都是 OCP 逻辑，也就是“传参”的逻辑：维持一个不变的环境或平台，接受各种变动的参数在这个平台上做各种事情。


## 多态在策略模式中的体现
1. 通过使用策略模式重构代码，我们消除了原程序中大片的条件分支语句。所有跟计算奖金有关的逻辑不再放在 context 中，而是保存在外部的策略对象中。
2. Context 并没有计算奖金的能力，而是把这个职责委托给了某个策略对象。每个策略对象负责的算法已被各自封装在对象内部。
3. 当我们对这些策略对象发出“计算奖金”的请求时，它们会返回各自不同的计算结果，这正是对象多态性的体现：替换 context 中当前保存的策略对象，便能执行不同的算法来得到我们想要的结果。


## 更广义的“策略”
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
var registerForm = document.getElementById( 'registerForm' );

registerForm.onsubmit = function(){
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
1. 把校验逻辑都封装成策略对象，每种规则都接受一个校验值和校验失败时需要抛出的错误信息，某些规则(例如`minLength`)还要接受校验参数
    ```js
    var strategies = {
        isNonEmpty: function( value, errorMsg ){    // 不为空
            if ( value === '' ){
                return errorMsg ;
            }
        },
        minLength: function( value, length, errorMsg ){    // 限制最小长度
            if ( value.length < Number.parseInt(length) ){
                return errorMsg;
            }
        },
        isMobile: function( value, errorMsg ){    // 手机号码格式
            if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
                return errorMsg;
            }
        }
    };
    ```
2. 实现作为 context 的`Validator`类，负责接收用户的请求并委托给`strategy`对象
    ```js
    var Validator = function(){
        // 已经接受了参数等待执行的校验函数。添加若干条规则后，一并调用校验
        this.cache = [];
    };

    // 向校验器中添加一条校验规则
    /**
     * node 是带校验的输入框
     * rule 是一条校验规则。rule 除了校验规则字符串之外，还可能通过`:`分割并带上校验参数
     * errorMsg 是校验失败时返回的错误信息
     */
    Validator.prototype.add = function( node, rule, errorMsg ){
        var ary = rule.split( ':' );    // 把 strategy 和参数分开
        this.cache.push(function(){   // 把校验的步骤用空函数包装起来，并且放入 cache
            var strategy = ary.shift();    // 校验规则函数名
            // 以下两行拼接校验规则函数所需的两个或三个参数
            ary.unshift( node.value );
            ary.push( errorMsg );
            return strategies[ strategy ].apply( node, ary ); // 调用校验规则函数，并返回`undefined`或错误信息
        });
    };

    // 依次条用之前保存的校验函数
    Validator.prototype.start = function(){
        for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
            var msg = validatorFunc();    // 开始校验，并取得校验后的返回信息
            if ( msg ){     // 如果有确切的返回值，说明校验没有通过
                return msg;
            }
        }
    };
    ```
3. 应用`Validator`类
    ```js
    var validataFunc = function(){
        var validator = new Validator();

        // 添加一些校验规则
        validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' );
        validator.add( registerForm.password, 'minLength:6', '密码长度不能少于6位' );
        validator.add( registerForm.phoneNumber, 'isMobile', '手机号码格式不正确' );

        var errorMsg = validator.start();
        return errorMsg;
    }

     var registerForm = document.getElementById( 'registerForm' );
     registerForm.onsubmit = function(){
         var errorMsg = validataFunc();
         if ( errorMsg ){
             alert ( errorMsg );
             return false;    // 阻止表单提交
         }
    };
    ```

### 策略模式重构后改进的地方
1. `strategies`作为公共的校验逻辑仓库，可以保存和统一管理所有的校验逻辑，供不同的表单使用，每个表单不需要每次都写自己的校验逻辑；一种校验逻辑需要更改时，只需要在`strategies`中进行修改，就可以作用到所有使用该逻辑的表单。
2. `Validator`作为应用，逻辑稳定，不管是针对不同的逻辑还是不同的表单，都不需要做更改。
3. 每一个表单需要运用校验是，只需要创建`Validator`类并从`strategies`选择需要的校验规则即可，不需要再自行编写校验逻辑。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
