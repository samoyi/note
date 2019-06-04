# Decorator


## 设计思想
1. 有一个有若干流程的功能体，我们想完成一个任务，但是需要在这个功能体的基础上再添加（push或unshift）若干流程才能实现。
2. 但是这里要求我们不能直接修改这个功能体，比如我们没有权限修改它，或者它还要在其他地方用到。
3. 也不能自己再实现一遍这个功能里的功能流程，比如重实现起来成本比较高，难以实现或者浪费资源。
4. 必须要使用这个功能体，但还要为其追加功能。
5. 另外，这个新的功能体对于它的用户来说，最好是和旧的功能体使用起来没有差别。也就是说用户不需要关心这个功能体是新的还是旧的，不需要为此做出任何调整，不管新旧，只需要按照相同的习惯使用即可。
6. 这在逻辑中是很自然就可以解决的。我们创建一个新的功能体，这个功能体的外部和旧功能体是一样的，使用方法也和旧功能体是一样的。在这个心功能体内部，先调用就功能的流程，完成后再追加新的流程即可。
7. 不过在工程方面，就要考虑怎么实现一个标准的追加流程的方法，以及将原功能和追加流程包装在一个新的功能体中。

### 美学
* 如果我们可以将两个功能体组合到一起，那我们就可以设计简洁的功能体，而不需要庞大冗长的。这样不仅易于设计、制作和维护，而且可以更方便的应对不同的场景。高内聚低耦合的设计美学。




## 实现难点
### 在不改变就功能体的前提下追加新流程
### 新功能体包装成和旧功能体一样的外部形态和使用方法


## 实现逻辑
1. In object-oriented programming, the decorator pattern is a design pattern that allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class.
2. The decorator pattern is often useful for adhering to the Single Responsibility Principle, as it allows functionality to be divided between classes with unique areas of concern.
3. The decorator pattern is structurally nearly identical to the chain of responsibility pattern, the difference being that in a chain of responsibility, exactly one of the classes handles the request, while for the decorator, all classes handle the request.


## 模拟传统面向对象语言的装饰者模式
```js
class Mission1 {
  done(){
    console.log('Mission1 done.');
  }
}

class Mission2 {
  constructor(mission){
    this.mission = mission;
  }

  done(){
    this.mission.done();
    console.log('Mission2 done.');
  }
}

class Mission3 {
  constructor(mission){
    this.mission = mission;
  }

  done(){
    this.mission.done();
    console.log('Mission3 done.');
  }
}

let mission1 = new Mission1();
mission1 = new Mission2(mission1);
mission1 = new Mission3(mission1);
mission1.done();
```

1. 这种给对象动态增加职责的方式，并没有真正地改动对象自身，而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，形成一个聚合对象。这些对象都拥有相同的接口（`done`方法），当请求达到链中的某个对象时，这个对象会执行自身的操作，随后把请求转发给链中的下一个对象。
2. 因为装饰者对象和它所装饰的对象拥有一致的接口，所以它们对使用该对象的客户来说是透明的，被装饰的对象也并不需要了解它曾经被装饰过，这种透明性使得我们可以递归地嵌套任意多个装饰者对象。


## JavaScript 的装饰者
JavaScript 语言动态改变对象相当容易，我们可以直接改写对象或者对象的某个方法，并不需要使用“类”来实现装饰者模式
```js
let mission1 = {
  done(){
    console.log('Mission1 done.');
  },
};
function mission2Done(){
  console.log('Mission2 done.');
};
function mission3Done(){
  console.log('Mission3 done.');
};

let done1 = mission1.done;
mission1.done = function(){
  done1();
  mission2Done();
  mission3Done();
}

mission1.done();
```


## 装饰函数
1. 在《设计模式》成书之前，GoF 原想把装饰者（decorator）模式称为包装器（wrapper）模式。从功能上而言，decorator 能很好地描述这个模式，但从结构上看，wrapper 的说法更加贴切。装饰者模式将一个对象嵌入另一个对象之中，实际上相当于这个对象被另一个对象包装起来，形成一条包装链。请求随着这条链依次传递到所有的对象，每个对象都有处理这条请求的机会。
2. 上面通过保存`mission1.done`原引用到`done1`的方式就可以改写这个函数，在包装函数中调用`done1`，就可以实现装饰`mission1.done`。
3. 这样的代码当然是符合开放-封闭原则的，我们在增加新功能的时候，确实没有修改原来的代码，但是这种方式存在以下两个问题。
  * 必须维护`done1`这个中间变量，虽然看起来并不起眼，但如果函数的装饰链较长，或者需要装饰的函数变多，这些中间变量的数量也会越来越多。
  * `this`被劫持的问题。如果`mission1.done`中涉及环境，则还要对`done1`进行`this`绑定。


## 用 AOP 装饰函数
1. `Function.prototype.before`方法和`Function.prototype.after`方法
    ```js
    Function.prototype.before = function( beforefn ){
        var __self = this;  // 保存原函数的引用
        return function(){  // 返回包含了原函数和新函数的"代理"函数
            // 执行新函数，且保证 this 不被劫持。如果不绑定 this，则 beforefn 的 this 就总是 undefined；绑定之后，beforefn
            // 的 this 就和包装函数的 this 相同
            // 删除追加的函数也不影响原函数
            beforefn && beforefn.apply( this, arguments );
            // 原函数同样绑定 this，维持了原函数之前应有的 this
            return __self.apply( this, arguments );
        }
    }

    Function.prototype.after = function( afterfn ){
        var __self = this;
        return function(){
            var ret = __self.apply( this, arguments );
            afterfn && afterfn.apply( this, arguments );
            return ret;
        }
    };
    ```
2. 维持`this`并添加额外操作
    ```js
    document.getElementById = document.getElementById.before(function(){
        console.log('pre action');
        console.log(this); // document。和包装函数的 this相同，包装函数是 document 的方法调用
    });
    document.getElementById( 'button' );
    ```

### 不修改原型的 AOP 实现
修改原型不仅不安全，而且还会降低函数性能。可以使用传参的方法来实现
```js
const before = function(fn, beforefn){
    return function(){
        beforefn && beforefn.apply( this, arguments );
        return fn.apply( this, arguments );
    };
}
const after = function(fn, afterfn){
    return function(){
        let re = fn.apply( this, arguments );
        afterfn && afterfn.apply( this, arguments );
        return re;
    };
}
let obj = {
    foo(){
        console.log(this);
    }
};
function bar(){
    console.log(this);
}
let foo = after(obj.foo, bar);
foo(); // 两个 undefined
obj.foo = after(obj.foo, bar);
obj.foo(); // 两个 obj
```


## 应用实例
### 数据统计上报
1. 分离业务代码和数据统计代码，无论在什么语言中，都是 AOP 的经典应用之一。
2. 在项目开发的结尾阶段难免要加上很多统计数据的代码，这些过程可能让我们被迫改动早已封装好的函数。
3. 比如页面中有一个登录 button，点击这个 button 会弹出登录浮层，与此同时要进行数据上报，来统计有多少用户点击了这个登录 button。如果没有解耦，就会是：
    ```js
    function log( tag ){
        console.log( '上报标签为: ' + tag );
        // (new Image).src = 'http:// xxx.com/report?tag=' + tag;    // 真正的上报代码略
    }

    function showLogin(){
        console.log( '打开登录浮层' );
        log( this.nodeName );
    }

    document.getElementById( 'button' ).onclick = showLogin;
    ```
4. 使用 AOP 解耦后：
    ```js
    function showLogin(){
        console.log( '打开登录浮层' );
    }

    function log(){
        console.log( '上报标签为: ' + this.nodeName );
        // (new Image).src = 'http:// xxx.com/report?tag=' + tag;    // 真正的上报代码略
    }

    showLogin = after(showLogin, log);

    document.getElementById( 'button' ).onclick = showLogin;
    ```

### 动态改变函数的参数
1. 从 AOP 的实现可以看到，原函数和附加函数在调用时，参数对象实际上是同一个对象。也就是说，可以通过修改附加函数参数来实现动态修改原函数参数
    ```js
    function foo( param ){
        console.log( param );
    }
    foo( {a: 'a'} ); // {a: "a"}

    foo = before( foo, function( param ){
        param.b = 'b';
    });
    foo( {a: 'a'} ); // {a: "a", b: "b"}
    ```
2. 假设有一个通用的 ajax 请求函数
    ```js
    var ajax = function( type, url, param ){
        // 发送ajax请求的代码略
    };

    ajax( 'get', 'http:// xxx.com/userinfo', { name: 'sven' } );
    ```
3. 如果某天需要给请求参数`param`再加上一个 token。虽然也可以这样
    ```js
    var ajax = function( type, url, param ){
        param = param || {};
        param.Token = getToken();
    };
    ```
4. 但添加 token 并不是 ajax 函数的核心功能，只是一个附加功能，因此最好还是能够解耦，这样 ajax 函数可以更加灵活，不管是修改还是复用
    ```js
    var ajax = function( type, url, param ){
        console.log(param);
    };

    var getToken = function(){
        return 'Token';
    }

    // 动态修改 ajax 的第三个参数
    ajax = before(ajax, function( type, url, param ){
        param.token = getToken();
    });

    ajax( 'get', 'http:// xxx.com/userinfo', { name: 'sven' } ); // {name: "sven", token: "Token"}
    ```

### 插件式的表单验证
1. 耦合的表单验证
    ```js
    var formSubmit = function(){
        if ( username.value === '' ){
            return alert ( '用户名不能为空' );
        }
        if ( password.value === '' ){
            return alert ( '密码不能为空' );
        }

        var param = {
            username: username.value,
            password: password.value
        }
        ajax( 'http:// xxx.com/login', param );    // ajax具体实现略
    }
    ```
2. 一定程度解耦
    ```js
    var validata = function(){
        if ( username.value === '' ){
            alert ( '用户名不能为空' );
            return false;
        }
        if ( password.value === '' ){
            alert ( '密码不能为空' );
            return false;
        }
    }

    var formSubmit = function(){
        if ( validata() === false ){    // 校验未通过
            return;
        }
        var param = {
            username: username.value,
            password: password.value
        }
        ajax( 'http:// xxx.com/login', param );
    }
    ```
3. 使用改写后的 AOP 进一步解耦
    ```js
    const before = function(fn, beforefn){
        return function(){
            let valid = beforefn.apply( this, arguments );
            if (!valid) return;
            return fn.apply( this, arguments );
        };
    }

    var validata = function(){
        if ( username.value === '' ){
            alert ( '用户名不能为空' );
            return false;
        }
        if ( password.value === '' ){
            alert ( '密码不能为空' );
            return false;
        }
    }

    var formSubmit = function(){
        var param = {
            username: username.value,
            password: password.value
        }
        ajax( 'http:// xxx.com/login', param );
    }
    ```
4. `validata`成为一个即插即用的函数，它甚至可以被写成配置文件的形式，这有利于我们分开维护这两个函数。再利用策略模式稍加改造，我们就可以把这些校验规则都写成插件的形式，用在不同的项目当中。    

### AOP 的缺点
* 这种装饰方式叠加了函数的作用域，如果装饰的链条过长，性能上会受到一些影响。
* 因为函数通过`before`或者`after`被装饰之后，返回的实际上是一个新的函数，如果在原函数上保存了一些属性，那么这些属性会丢失
    ```js
    var func = function(){}
    func.a = 'a';

    console.log( func.a );  // "a"
    func = after(func, function(){});
    console.log( func.a );  // undefined
    ```

## 装饰者模式和代理模式
1. 装饰者模式和代理模式的结构看起来非常相像，这两种模式都描述了怎样为对象提供一定程度上的间接引用，它们的实现部分都保留了对另外一个对象的引用，并且向那个对象发送请求。
2. 代理模式和装饰者模式最重要的区别在于它们的意图和设计目的。代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。本体定义了关键功能，而代理提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情。装饰者模式的作用就是为对象动态加入行为。换句话说，代理模式强调一种关系（Proxy与它的实体之间的关系），这种关系可以静态的表达，也就是说，这种关系在一开始就可以被确定。而装饰者模式用于一开始不能确定对象的全部功能时。代理模式通常只有一层代理-本体的引用，而装饰者模式经常会形成一条长长的装饰链。
3. 在虚拟代理实现图片预加载的例子中，本体负责设置`img`节点的`src`，代理则提供了预加载的功能，这看起来也是“加入行为”的一种方式，但这种加入行为的方式和装饰者模式的偏重点是不一样的。装饰者模式是实实在在的为对象增加新的职责和行为，而代理做的事情还是跟本体一样，最终都是设置`src`。但代理可以加入一些“聪明”的功能，比如在图片真正加载好之前，先使用一张占位的 loading 图片反馈给客户。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
