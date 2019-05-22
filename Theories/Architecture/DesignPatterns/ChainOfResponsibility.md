# Chain of Responsibility


## 设计思想
1. 核心的思想不是链，因为即使是疯狂的`if...else`也是链式结构。
2. 核心思想仍然是解耦，是对链的解耦。疯狂的`if...else`只写死的职责链，而这里的职责链则是解耦的链，或者说是可以任意拆开组合的链。
3. 其实有些像模板方法模式和策略模式，都是有一个执行平台，然后接受若干执行步骤。只不过这里的执行步骤有明确的链接关系。


## 从粗放职责链到解耦职责链
### 粗放职责链
1. 假设我们负责一个售卖手机的电商网站，经过分别交纳500元定金和200元定金的两轮预定后（订单已在此时生成），现在已经到了正式购买的阶段。
2. 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过500元定金的用户会收到100元的商城优惠券，200元定金的用户可以收到50元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。
3. 后端返回包含以下三个字段：
    * `orderType`：表示订单类型（定金用户或者普通购买用户），值为`1`的时候是500元定金用户，为`2`的时候是200元定金用户，为`3`的时候是普通购买用户。
    * `pay`：表示用户是否已经支付定金，值为`true`或者`false`， 虽然用户已经下过500元定金的订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
    * `stock`：表示当前用于普通购买的手机库存数量，已经支付过500元或者200元定金的用户不受此限制。

```js
var order = function( orderType, pay, stock ){
    if ( orderType === 1 ){        // 500元定金购买模式
        if ( pay === true ){    // 已支付定金
            console.log( '500元定金预购, 得到100优惠券' );
        }else{    // 未支付定金，降级到普通购买模式
            if ( stock > 0 ){    // 用于普通购买的手机还有库存
                console.log( '普通购买, 无优惠券' );
            }else{
                console.log( '手机库存不足' );
            }
        }
    }

    else if ( orderType === 2 ){     // 200元定金购买模式
        if ( pay === true ){
            console.log( '200元定金预购, 得到50优惠券' );
        }else{
            if ( stock > 0 ){
                console.log( '普通购买, 无优惠券' );
            }else{
                console.log( '手机库存不足' );
            }
        }
    }

    else if ( orderType === 3 ){
        if ( stock > 0 ){
            console.log( '普通购买, 无优惠券' );
        }else{
            console.log( '手机库存不足' );
        }
    }
};

order( 1 , true, 500);  // 输出： 500元定金预购, 得到100优惠券
```

4. 这无疑也是广义上的职责链，需求在链上传递，知道被应该处理它的一个节点捕获，并进行处理。
5. 但缺点也是很明显的：
    * 增加减少节点需要修改整个链的函数
    * 修改某个节点也需要修改整个链的函数
    * 调整节点的链接顺序仍然需要修改整个链的函数

### 解耦职责链
1. 抽出每个节点作为单独的函数。该方法如果能处理则处理，处理不了则返回`'nextSuccessor'`，等待请求被传递。
    ```js
    const order500 = function( orderType, pay, stock ){
        if ( orderType === 1 && pay === true ){
            console.log( '500元定金预购，得到100优惠券' );
        }else{
            return 'nextSuccessor';    // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const order200 = function( orderType, pay, stock ){
        if ( orderType === 2 && pay === true ){
            console.log( '200元定金预购，得到50优惠券' );
        }else{
            return 'nextSuccessor';    // 我不知道下一个节点是谁，反正把请求往后面传递
        }
    };

    const orderNormal = function( orderType, pay, stock ){
        if ( stock > 0 ){
            console.log( '普通购买，无优惠券' );
        }else{
            console.log( '手机库存不足' );
        }
    };
    ```
2. 创建一个节点类，生成节点实例时接受该节点的处理函数。方法`setNextSuccessor`设置如果该节点处理不了要传递到哪里，方法`receiveRequest`用来接受请求并尝试进行处理。
    ```js
    class ChainNode {
        constructor(fn){
            this.fn = fn;
            this.successor = null;
        }

        setNextSuccessor( successor ){
            return this.successor = successor;
        }

        receiveRequest(...args){
            let ret = this.fn( ...args );

            if ( ret === 'nextSuccessor' ){
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
    chainOrder500.receiveRequest( 1, true, 500 );    // 输出：500元定金预购，得到100优惠券
    chainOrder500.receiveRequest( 2, true, 500 );    // 输出：200元定金预购，得到50优惠券
    chainOrder500.receiveRequest( 3, true, 500 );    // 输出：普通购买，无优惠券
    chainOrder500.receiveRequest( 1, false, 0 );     // 输出：手机库存不足
    ```


## 异步的职责链
1. 链节点返回`'nextSuccessor'`可以立即同步地把职责传递给下一个节点。
2. 但往往也存在节点处理中包含异步的情况，例如在请求接口后才能决定能否处理。可以再定义一个原型方法，在异步操作结束后通知下一个节点接收任务
    ```js
    class ChainNode {
        constructor(fn){
            this.fn = fn;
            this.successor = null;
        }

        setNextSuccessor( successor ){
            return this.successor = successor;
        }

        receiveRequest(...args){
            let ret = this.fn( ...args );

            if ( ret === 'nextSuccessor' ){
                return this.successor && this.successor.receiveRequest( ...args );
            }

            return ret;
        }

        next(...args){
            return this.successor && this.successor.receiveRequest( ...args );
        }
    }


    const fn1 = new ChainNode(function(){
        console.log( 1 );
        return 'nextSuccessor';
    });
    const fn2 = new ChainNode(function(){
        console.log( 2 );
        setTimeout(()=>{
            this.next();
        }, 1000 );
    });
    const fn3 = new ChainNode(function(){
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
