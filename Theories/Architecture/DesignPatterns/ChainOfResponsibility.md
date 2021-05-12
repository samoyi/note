# Chain of Responsibility

Chain of Responsibility is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.


<!-- TOC -->

- [Chain of Responsibility](#chain-of-responsibility)
    - [0. 设计思想](#0-设计思想)
        - [0.1 OCP](#01-ocp)
        - [0.2 SRP](#02-srp)
    - [1. 本质](#1-本质)
        - [1.1 两种链式逻辑结构](#11-两种链式逻辑结构)
            - [1.1.1 转移责任式的链式逻辑结构](#111-转移责任式的链式逻辑结构)
                - [1.1.1.1 递进式的链式逻辑结构](#1111-递进式的链式逻辑结构)
            - [1.1.2 流水线式的链式逻辑结构](#112-流水线式的链式逻辑结构)
        - [1.2 链条组合的本质——信息的有序传递](#12-链条组合的本质信息的有序传递)
    - [2. 实现原理](#2-实现原理)
    - [3. 适用场景](#3-适用场景)
        - [链式处理](#链式处理)
        - [需要灵活的调整顺序或灵活的增删改处理节点的情况](#需要灵活的调整顺序或灵活的增删改处理节点的情况)
    - [4. 缺点](#4-缺点)
    - [从粗放职责链到解耦职责链](#从粗放职责链到解耦职责链)
        - [粗放职责链](#粗放职责链)
        - [解耦职责链](#解耦职责链)
    - [异步的职责链](#异步的职责链)
    - [用 AOP 实现职责链](#用-aop-实现职责链)
    - [References](#references)

<!-- /TOC -->


## 0. 设计思想
### 0.1 OCP
1. 职责链核心的思想不是链，因为即使是疯狂的 `if...else` 也是链式结构。
2. 核心思想仍然是解耦，是对链的解耦。疯狂的 `if...else` 只写死的职责链，而这里的职责链则是解耦的链，或者说是可以任意拆开组合的链。
3. 链式处理的结构不需要因为具体处理节点的增删改而修改。

### 0.2 SRP
1. 每个节点都独立且完整的负责自己的工作。
2. 提高可维护性：每个节点可以单独维护，不涉及整个链式结构。
3. 提高复用性：每个节点处理逻辑也可以复用到职责链以外的其他地方。


## 1. 本质
### 1.1 两种链式逻辑结构
链条组合好之后进行的工作，本质都是遍历。不过遍历可能中途退出。

#### 1.1.1 转移责任式的链式逻辑结构
1. 就像 DOM 的事件处理一样，一个节点如果不负责处理这个事件，那就转义给相邻的节点。
2. 为什么不能直接定位哪一层负责呢？ 从链表到哈希表！
3. 如果链条的节点足够的时候，是可以考虑哈希表的方式实现。但实际上这种产品级别的逻辑结构都是很少的，所以根本用不到相对来说很复杂的实现。

##### 1.1.1.1 递进式的链式逻辑结构
1. 转移责任式的链式逻辑结构中，各个节点是可以是平级的，也可以是渐进式的。
2. 比如你想打听个人，你就问甲，甲不知道，就再帮你问乙，乙也不知道的话就帮你问丙。这里的甲乙丙就是平级的。
3. 而比如你在饭馆想投诉，你就问服务员。服务员无权解决，就找大堂经理，大堂经理如果也满足不了你，那就只能找老板。这里显然就是一种渐进式的链式逻辑结构。
4. 作用域链、原型链、DOM 事件传播都算是这种类型的链式逻辑结构。

#### 1.1.2 流水线式的链式逻辑结构
1. 流水线上工人或机器，都分别对产品进行一部分的处理。
2. 程序中比如说有表单验证：比如可能有负责验证电话格式的，验证通过传给下一个验证函数；下一个可能是负责验证邮箱格式的等等，通过了再传给下一个验证函数。若干个验证步骤都依次通过了才是最终通过。

### 1.2 链条组合的本质——信息的有序传递
1. 不管是上面说的转移责任式的还是传递被处理对象的链式逻辑结构，都是在有序的进行信息传递。
2. 或者，即使我们不适用职责链模式，直接使用 `if-else` 之类的，依然是一种有序的信息传递。
3. 不同之处在于，职责链可以在运行时更灵活的组织顺序。`if-else` 之类的也可以实现运行时组织顺序，但就很麻烦了。


## 2. 实现原理
1. 将各个环境的行为抽出为单独的节点对象，每个对象都要有一个方法来执行职责链的下一个节点。
2. 每个节点的处理逻辑中，进行实际的处理，如果处理不了或者还有后续逻辑，则再把信息传递给下一个个节点。
3. 将若干个节点通过设置下一个节点的方法组成一个职责链。


## 3. 适用场景
### 链式处理
可以从链结构的任何一个节点开始处理

### 需要灵活的调整顺序或灵活的增删改处理节点的情况


## 4. 缺点
职责链模式使得程序中多了一些节点对象，可能在某一次的请求传递过程中，大部分节点并没有起到实质性的作用，它们的作用仅仅是让请求传递下去，从性能方面考虑，我们要避免过长的职责链带来的性能损耗。


## 从粗放职责链到解耦职责链
### 粗放职责链
1. 假设我们负责一个售卖手机的电商网站，经过分别交纳 500 元定金或 200 元定金的两轮预定后（订单已在此时生成），现在已经到了正式购买的阶段。
2. 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过 500 元定金的用户会收到 100 元的商城优惠券，200 元定金的用户可以收到 50 元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。
3. 后端返回包含以下三个字段：
    * `orderType`：表示订单类型（定金用户或者普通购买用户），值为 `1` 的时候是 500 元定金用户，为 `2` 的时候是 200 元定金用户，为 `3` 的时候是普通购买用户。
    * `pay`：表示用户是否已经支付定金，值为 `true` 或者 `false`， 虽然用户已经下过交定金的订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
    * `stock`：表示当前用于普通购买的手机库存数量，已经支付过 500 元或者 200 元定金的用户不受此限制。
4. 根据后端返回计算订单结果
    ```js
    function orderResult ( orderType, isPaid, stock ){
        if ( orderType === 1 ) {      
            if ( isPaid === true ) { 
                return '500 元定金预购, 得到 100 优惠券';
            }
            else {    
                if ( stock > 0 ){    
                    return '普通购买, 无优惠券';
                }
                else {
                    return '手机库存不足';
                }
            }
        }
        else if ( orderType === 2 ) {     
            if ( isPaid === true ) {
                return '200 元定金预购, 得到 50 优惠券';
            }
            else {
                if ( stock > 0 ){
                    return '普通购买, 无优惠券';
                }
                else {
                    return '手机库存不足';
                }
            }
        }
        else if ( orderType === 3 ) {
            if ( stock > 0 ) {
                return '普通购买, 无优惠券';
            }
            else {
                return '手机库存不足';
            }
        }
    };

    console.log( orderResult( 1 , true, 500) ); // 500元定金预购, 得到100优惠券
    ```
5. 这无疑也是广义上的职责链，需求在 `if-else` 链上传递，直到被应该处理它的一个节点捕获，并进行处理。
6. 但缺点也是很明显的，意图和实现没有分离，导致函数过大难以理解，而且严重违反了 OCP：
    * 增加减少节点需要修改整个链的函数
    * 修改某个节点也需要修改整个链的函数
    * 调整节点的链接顺序仍然需要修改整个链的函数

### 解耦职责链
1. 抽出每个节点作为单独的函数。该方法如果能处理则处理，处理不了则返回`'nextSuccessor'`，等待请求被传递。
    ```js
    const order500 = function ( orderType, isPaid, stock ) {
        if ( orderType === 1 && isPaid === true ) {
            return '500 元定金预购，得到 100 优惠券';
        }
        else {
            return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const order200 = function ( orderType, isPaid, stock ) {
        if ( orderType === 2 && isPaid === true ) {
            return '200 元定金预购，得到 50 优惠券';
        }
        else{
            return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const orderNormal = function ( orderType, isPaid, stock ) {
        if ( stock > 0 ){
            return '普通购买，无优惠券';
        }
        else {
            return '手机库存不足';
        }
    };
    ```
2. 创建一个节点类，生成节点实例时接受该节点的处理函数。方法 `setNextSuccessor` 设置如果该节点处理不了要传递到哪里，方法`receiveRequest` 用来接受请求并尝试进行处理
    ```js
    class ChainNode {
        constructor ( fn ) {
            this.fn = fn;
            this.successor = null;
        }

        setNextSuccessor ( successor ) {
            return this.successor = successor;
        }

        receiveRequest ( ...args ) {
            let ret = this.fn( ...args );

            if ( ret === 'nextSuccessor' ) { // 如果处理不了，需要传递给下一个节点
                return this.successor && this.successor.receiveRequest( ...args );
            }

            return ret;
        }
    }
    ```
3. 试着创建三个链条节点，并设置传递关系
    ```js
    const chainOrder500 = new ChainNode( order500 );
    const chainOrder200 = new ChainNode( order200 );
    const chainOrderNormal = new ChainNode( orderNormal );

    chainOrder500.setNextSuccessor( chainOrder200 );
    chainOrder200.setNextSuccessor( chainOrderNormal );
    ```
4. 让链条的不同节点接受请求。有的能直接处理，有的需要向后传递
    ```js
    console.log(chainOrder500.receiveRequest( 1, true, 500 ));    // 500 元定金预购，得到 100 优惠券
    console.log(chainOrder500.receiveRequest( 2, true, 500 ));    // 200 元定金预购，得到 50 优惠券
    console.log(chainOrder500.receiveRequest( 3, true, 500 ));    // 普通购买，无优惠券
    console.log(chainOrder500.receiveRequest( 1, false, 0 ));     // 手机库存不足
    ```


## 异步的职责链
1. 链节点返回 `'nextSuccessor'` 可以立即同步地把职责传递给下一个节点。但往往也存在节点处理中包含异步的情况，例如在请求接口后才能决定能否处理。
2. 可以再定义一个原型方法，在异步操作结束后通知下一个节点接收任务
    ```js
    class ChainNode {
        constructor (fn) {
            this.fn = fn;
            this.successor = null;
        }

        setNextSuccessor ( successor ) {
            return this.successor = successor;
        }

        receiveRequest ( ...args ) {
            let ret = this.fn( ...args );

            if ( ret === 'nextSuccessor' ){
                return this.successor && this.successor.receiveRequest( ...args );
            }

            return ret;
        }

        next ( ...args ) {
            return this.successor && this.successor.receiveRequest( ...args );
        }
    }


    const fn1 = new ChainNode( function () {
        console.log( 1 );
        return 'nextSuccessor';
    });
    const fn2 = new ChainNode( function () {
        console.log( 2 );
        setTimeout(()=>{
            this.next();
        }, 3000 );
    });
    const fn3 = new ChainNode( function () {
        console.log( 3 );
    });


    fn1.setNextSuccessor( fn2 ).setNextSuccessor( fn3 );
    fn1.receiveRequest();
    ```


## 用 AOP 实现职责链
```js
// 初始函数调用 after 并传入函数 fn 后，会返回另一个函数，被返回的函数在调用时会先执行初始函数
// 如果初始函数解决了问题，则返回初始函数的返回值；如果初始函数没解决，则调用参数函数 fn
Function.prototype.after = function( fn ){
    return (...args)=>{
        let re = this(...args);
        if ( re === 'nextSuccessor' ){
            // 初始函数返回了字符串 nextSuccessor，表示没解决问题，请求转给后续节点函数 fn
            return fn(...args);
        }
        return re;
    };
};


const order500 = function( orderType, pay, stock ){
    console.log(1);
    if ( orderType === 1 && pay === true ){
        console.log( '500元定金预购，得到100优惠券' );
    }
    else{
        return 'nextSuccessor';
    }
};

const order200 = function( orderType, pay, stock ){
    console.log(2);
    if ( orderType === 2 && pay === true ){
        console.log( '200元定金预购，得到50优惠券' );
    }
    else{
        return 'nextSuccessor';
    }
};

const orderNormal = function( orderType, pay, stock ){
    console.log(3);
    if ( stock > 0 ){
        console.log( '普通购买，无优惠券' );
    }
    else{
        console.log( '手机库存不足' );
    }
};


let order = order500.after( order200 ).after( orderNormal );
order( 1, false, 500 );   // 输出：普通购买，无优惠券
```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)