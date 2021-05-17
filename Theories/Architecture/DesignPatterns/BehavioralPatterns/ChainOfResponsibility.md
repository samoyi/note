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
            - [1.1.2 流水线式的链式逻辑结构](#112-流水线式的链式逻辑结构)
        - [1.2 链条组合的本质——信息的有序传递](#12-链条组合的本质信息的有序传递)
    - [2. 实现原理](#2-实现原理)
    - [3. 适用场景](#3-适用场景)
        - [在处理请求前不确定由哪个对象来处理](#在处理请求前不确定由哪个对象来处理)
        - [链式处理](#链式处理)
    - [4. 缺点](#4-缺点)
    - [从粗放职责链到解耦职责链](#从粗放职责链到解耦职责链)
        - [粗放职责链](#粗放职责链)
        - [解耦职责链](#解耦职责链)
    - [异步的职责链](#异步的职责链)
    - [用 AOP 实现职责链](#用-aop-实现职责链)
    - [与其他模式的关系](#与其他模式的关系)
        - [组合模式](#组合模式)
        - [命令模式](#命令模式)
        - [装饰模式](#装饰模式)
    - [References](#references)

<!-- /TOC -->


## 0. 设计思想
### 0.1 OCP
1. 职责链核心的思想不是链，因为即使是疯狂的 `if...else` 也是链式结构。
2. 核心思想仍然是解耦，是对链的解耦。疯狂的 `if...else` 只写死的职责链，而这里的职责链则是解耦的链，或者说是可以任意拆开、组合、删减和修改节点的链。
3. 链式处理的结构不需要因为上述修改而修改。

### 0.2 SRP
1. 每个节点都独立且完整的负责自己的工作。
2. 提高可维护性：每个节点可以单独维护，不涉及整个链式结构。
3. 提高复用性：每个节点处理逻辑也可以复用到职责链以外的其他地方。


## 1. 本质
### 1.1 两种链式逻辑结构
转移责任式和流水线式。

#### 1.1.1 转移责任式的链式逻辑结构
1. 就像 DOM 的事件处理一样，一个节点如果不负责处理这个事件，那就转义给相邻的节点。
2. 为什么不能直接定位哪一个节点负责呢？ 从链表到哈希表。
3. 不能直接定位而需要顺着链一个一个尝试的情况，就是那种在处理之前不能确定由谁来负责的，必须要让节点处理着试一下才知道能不能处理。
4. 转移责任式的链式逻辑结构中，各个节点是可以是平级的，也可以是渐进式的。
5. 比如你想打听个人，你就问甲，甲不知道，就再帮你问乙，乙也不知道的话就帮你问丙。这里的甲乙丙就是平级的。
6. 而比如你在饭馆想投诉，你就问服务员。服务员无权解决，就找大堂经理，大堂经理如果也满足不了你，那就只能找老板。这里显然就是一种渐进式的链式逻辑结构。
7. 作用域链、原型链、DOM 事件传播都算是这种渐进式的链式逻辑结构。

#### 1.1.2 流水线式的链式逻辑结构
1. 流水线上工人或机器，都分别对产品进行一部分的处理。
2. 程序中比如说有表单验证：比如可能有负责验证电话格式的，验证通过传给下一个验证函数；下一个可能是负责验证邮箱格式的等等，通过了再传给下一个验证函数。若干个验证步骤都依次通过了才是最终通过。

### 1.2 链条组合的本质——信息的有序传递
1. 不管是上面说的转移责任式的还是流水线式的链式逻辑结构，都是在有序的进行信息传递。
2. 或者，即使我们不使用职责链模式，直接使用 `if-else` 之类的，依然是一种有序的信息传递。
3. 不同之处在于，职责链可以在运行时更灵活的组织顺序。`if-else` 之类的也可以实现运行时组织顺序，但就很麻烦了。


## 2. 实现原理
1. 和链表类似，每个节点包括两部分内容：节点本身的处理逻辑，指向后继节点的方法。
2. 具体的业务逻辑包括两个分支：可以处理则处理，不能处理则表明要传递给后继节点。
3. 每种具体的业务逻辑作为处理逻辑传给对应的节点，并设置后继节点。


## 3. 适用场景
### 在处理请求前不确定由哪个对象来处理
1. 请求在处理前不能知道到底由哪个对象来处理，而是必须要让各个对象依次尝试，不行再转交给其他对象。
2. 前者是哈希表的结构，后者是链表的结构。

### 链式处理
1. 请求需要在若干个节点间传递，然后选择一个可以处理请求的节点。
2. 如果这些节点的顺序还可能发生变化，或者增加删除节点，或者修改某些节点的逻辑，就更适合职责链。


## 4. 缺点
职责链模式使得程序中多了一些节点对象，可能在某一次的请求传递过程中，大部分节点并没有起到实质性的作用，它们的作用仅仅是让请求传递下去，从性能方面考虑，我们要避免过长的职责链带来的性能损耗。


## 从粗放职责链到解耦职责链
### 粗放职责链
1. 假设我们负责一个售卖手机的电商网站，经过分别交纳 500 元定金或 200 元定金的两轮预定后（订单已在此时生成），现在已经到了正式购买的阶段。
2. 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过 500 元定金的用户会收到 100 元的商城优惠券，200 元定金的用户可以收到 50 元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。
3. 后端返回包含以下三个字段：
    * `orderType`：表示订单类型（定金用户或者普通购买用户），值为 `Order500` 的时候是 500 元定金用户，为 `Order200` 的时候是 200 元定金用户，为 `OrderNormal` 的时候是普通购买用户。
    * `pay`：表示用户是否已经支付定金，值为 `true` 或者 `false`， 虽然用户已经下过交定金的订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
    * `stock`：表示当前用于普通购买的手机库存数量，已经支付过 500 元或者 200 元定金的用户不受此限制。
4. 根据后端返回计算订单结果
    ```js
    const Order500 = 1;
    const Order200 = 2;
    const OrderNormal = 3;
    
    function orderResult ( orderType, isPaid, stock ){
        if ( orderType === Order500 ) {      
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
        else if ( orderType === Order200 ) {     
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
        else if ( orderType === OrderNormal ) {
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
6. 但缺点也是很明显的，但里面的三种处理逻辑没有进行意图和实现的分离，导致函数过大难以理解，而且严重违反了 OCP：
    * 增加减少节点需要修改整个链的函数
    * 修改某个节点也需要修改整个链的函数
    * 调整节点的链接顺序仍然需要修改整个链的函数

### 解耦职责链
1. 职责链上的每个节点有两部分要素：对于需求的处理函数 `handler`；如果处理不了，把需求传递给继任节点 `successor`。
2. 因此节点类实现如下
    ```js
    class ChainNode {
        constructor ( handler ) {
            this.handler = handler;
            this.successor = null;
        }

        setNextSuccessor ( successor ) {
            return this.successor = successor;
        }

        receiveRequest ( ...args ) {
            let ret = this.handler( ...args );
            // 如果 handler 实现不了，会返回常量 TO_NEXT
            if ( ret === TO_NEXT ) {
                // 将需求传递给继任节点
                return this.successor && this.successor.receiveRequest( ...args );
            }

            return ret;
        }
    }
    ```
3. 现在就可以把三种订单逻辑抽出单独的函数。每个函数在接收到处理数据后，如果能处理则处理，处理不了则返回 `TO_NEXT`，将需求转发给后继节点
    ```js
    const order500Handler = function ( orderType, isPaid, stock ) {
        if ( orderType === Order500 && isPaid === true ) {
            return '500 元定金预购，得到 100 优惠券';
        }
        else {
            return TO_NEXT; // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const order200Handler = function ( orderType, isPaid, stock ) {
        if ( orderType === Order200 && isPaid === true ) {
            return '200 元定金预购，得到 50 优惠券';
        }
        else{
            return TO_NEXT; // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const orderNormalHandler = function ( orderType, isPaid, stock ) {
        if ( stock > 0 ){
            return '普通购买，无优惠券';
        }
        else {
            return '手机库存不足';
        }
    };
    ```
4. 现在使用节点类和三个处理函数，就可以创建三个节点
    ```js
    const chainNodeOrder500 = new ChainNode( order500Handler );
    const chainNodeOrder200 = new ChainNode( order200Handler );
    const chainNodeOrderNormal = new ChainNode( orderNormalHandler );
    ```
5. 将三个节点设置为链
    ```js
    chainNodeOrder500.setNextSuccessor( chainNodeOrder200 );
    chainNodeOrder200.setNextSuccessor( chainNodeOrderNormal );
    ```    
6. 让职责链的起点接受不同的数据，根据数据的不同，会在职责链不同节点进行处理
    ```js
    console.log(chainNodeOrder500.receiveRequest( Order500, true, 500 ));    // 500 元定金预购，得到 100 优惠券
    console.log(chainNodeOrder500.receiveRequest( Order200, true, 500 ));    // 200 元定金预购，得到 50 优惠券
    console.log(chainNodeOrder500.receiveRequest( OrderNormal, true, 500 )); // 普通购买，无优惠券
    console.log(chainNodeOrder500.receiveRequest( Order500, false, 0 ));     // 手机库存不足
    ```


## 异步的职责链
1. 链节点返回 `TO_NEXT` 可以立即同步地把职责传递给下一个节点。但往往也存在节点处理中包含异步的情况，例如在请求接口后才能决定能否处理。
2. 因为这时 `handler` 函数已经返回，所以无法通过上面返回 `TO_NEXT` 的方式传递给后继。可以再定义一个原型方法 `next`，在异步操作结束后手动调用来通知下一个节点接收任务
    ```js
    class ChainNode {
        constructor (handler) {
            this.handler = handler;
            this.successor = null;
        }

        setNextSuccessor ( successor ) {
            return this.successor = successor;
        }

        next ( ...args ) {
            return this.successor && this.successor.receiveRequest( ...args );
        }

        receiveRequest ( ...args ) {
            let ret = this.handler( ...args );

            if ( ret === TO_NEXT ){
                // 这里可以改为直接调用 next
                return this.next( ...args );
            }

            return ret;
        }
    }


    const handler1 = new ChainNode( function () {
        console.log( 1 );
        return TO_NEXT; // 通过返回值传递给后继
    });
    const handler2 = new ChainNode( function () {
        console.log( 2 );
        setTimeout(()=>{
            this.next(); // 通过 next 方法手动传递给后继
        }, 3000 );
    });
    const handler3 = new ChainNode( function () {
        console.log( 3 );
    });


    handler1.setNextSuccessor( handler2 ).setNextSuccessor( handler3 );
    handler1.receiveRequest();
    ```


## 用 AOP 实现职责链
```js
// 初始函数调用 after 并传入函数 handler 后，会返回另一个函数，被返回的函数在调用时会先执行初始函数
// 如果初始函数解决了问题，则返回初始函数的返回值；如果初始函数没解决，则调用参数函数 handler
Function.prototype.after = function( handler ){
    return (...args)=>{
        let re = this(...args);
        if ( re === TO_NEXT ){
            // 初始函数返回了字符串 nextSuccessor，表示没解决问题，请求转给后续节点函数 handler
            return handler(...args);
        }
        return re;
    };
};


const order500Handler = function( orderType, pay, stock ){
    console.log(1);
    if ( orderType === 1 && pay === true ){
        console.log( '500元定金预购，得到100优惠券' );
    }
    else{
        return TO_NEXT;
    }
};

const order200Handler = function( orderType, pay, stock ){
    console.log(2);
    if ( orderType === 2 && pay === true ){
        console.log( '200元定金预购，得到50优惠券' );
    }
    else{
        return TO_NEXT;
    }
};

const orderNormalHandler = function( orderType, pay, stock ){
    console.log(3);
    if ( stock > 0 ){
        console.log( '普通购买，无优惠券' );
    }
    else{
        console.log( '手机库存不足' );
    }
};


let order = order500Handler.after( order200Handler ).after( orderNormalHandler );
order( 1, false, 500 );   // 输出：普通购买，无优惠券
```


##　与其他模式的关系
1. 责任链模式、命令模式、中介者模式和观察者模式用于处理请求发送者和接收者之间的不同连接方式：
    * 责任链按照顺序将请求动态传递给一系列的潜在接收者，直至其中一名接收者对请求进行处理；
    * 命令在发送者和请求者之间建立单向连接；
    * 中介者清除了发送者和请求者之间的直接连接，强制它们通过一个中介对象进行间接沟通；
    * 观察者允许接收者动态地订阅或取消接收请求。

### 组合模式
责任链通常和组合模式结合使用。在这种情况下，叶组件接收到请求后，可以将请求沿包含全体父组件的链一直传递至对象树的底部。

### 命令模式
1. 责任链的管理者可使用命令模式实现。在这种情况下，你可以对由请求代表的同一个上下文对象执行许多不同的操作。
2. 还有另外一种实现方式，那就是请求自身就是一个命令对象。在这种情况下，你可以对由一系列不同上下文连接而成的链执行相同的操作。

### 装饰模式
见装饰模式
    

## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)
