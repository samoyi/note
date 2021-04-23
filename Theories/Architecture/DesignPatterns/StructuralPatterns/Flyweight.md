# Flyweight

享元模式是一种结构型设计模式，它摒弃了在每个对象中保存所有数据的方式，通过共享多个对象所共有的相同状态，让你能在有限的内存容量中载入更多对象。


<!-- TOC -->

- [Flyweight](#flyweight)
    - [设计思想](#设计思想)
        - [任何大成本的数据结构或者行为都要考虑复用](#任何大成本的数据结构或者行为都要考虑复用)
        - [传参思想实现复用](#传参思想实现复用)
        - [继承也是传参思想](#继承也是传参思想)
        - [弹性资源投资](#弹性资源投资)
        - [缓存——空间换时间](#缓存空间换时间)
    - [本质](#本质)
        - [剥离通用状态，增加复用性](#剥离通用状态增加复用性)
        - [对象池的弹性资源投资](#对象池的弹性资源投资)
        - [对象池的空间换时间缓存](#对象池的空间换时间缓存)
    - [实现原理](#实现原理)
        - [分离出因环境而异的状态，作为参数传入](#分离出因环境而异的状态作为参数传入)
        - [共享状态不能被修改](#共享状态不能被修改)
    - [适用场景](#适用场景)
        - [同时存在大量相似对象且明显消耗内存](#同时存在大量相似对象且明显消耗内存)
        - [使用了多次的大成本数据结构](#使用了多次的大成本数据结构)
    - [缺点](#缺点)
    - [例子](#例子)
        - [轻量化（Flyweight）对象的例子](#轻量化flyweight对象的例子)
        - [一个对象用很多次的例子](#一个对象用很多次的例子)
    - [内部状态与外部状态](#内部状态与外部状态)
        - [内部状态不应该被修改](#内部状态不应该被修改)
    - [对象池](#对象池)
        - [弹性资源投资](#弹性资源投资-1)
        - [缓存——空间换时间](#缓存空间换时间-1)
        - [实现](#实现)
        - [通用对象池实现](#通用对象池实现)
    - [与其他模式的关系](#与其他模式的关系)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### 任何大成本的数据结构或者行为都要考虑复用
1. 占内存比较多的对象同时使用就要考虑复用，创建比较耗时或耗内存的对象反复使用时要考虑复用，耗时或耗流量的请求反复执行时要考虑缓存，等等。
2. 其实数据量不大而有多个使用者时也应该复用，这样保证每个使用者的数据源同步。只不过享元模式并不是为了解决这个问题。

### 传参思想实现复用
同一个对象，在不同的环境下，通过传递不同的参数，就可以实现略有不同的用途。

### 继承也是传参思想
父类相当于一个可复用的函数，子类的不同实现就相当于给这个父类传不同的参数。

### 弹性资源投资
实际中使用多少资源就先投资多少资源，之后不够了可以再追加，而不是一开始就为可能的适用场景都投资资源。

### 缓存——空间换时间
在特定的场景中，如果时间比空间消耗更多成本，那就可以使用缓存来用空间换取时间。


## 本质
### 剥离通用状态，增加复用性
1. 一组相似的大成本数据结构只实现一个通用的基础，在它里面保留这一组数据结构的公共状态，不同的非公共状态在具体使用时传入。
    <img src="../images/03.png" width="400" style="display: block; background-color: #fff; margin: 5px 0 10px 0;" />
2. 不管是严格的 flyweight 模式，还是一个对象用很多次的模式，本质上都是基于共享通用状态。

### 对象池的弹性资源投资
1. 并不需要一开始就为所有可能的场景投入资源，而是实际需要多少就投资多少。
2. 前期的投资还够用就继续用，不够用再追加。

### 对象池的空间换时间缓存


## 实现原理
### 分离出因环境而异的状态，作为参数传入
1. 如果很多个大成本数据结构拥有某些共同的状态，那么可以创建一个只拥有这些共同状态的实例，作为一个共享实例。
2. 那些在不同的环境中不同的状态，在具体使用时才传入这个共享实例，组成完整的实例状态。

### 共享状态不能被修改


## 适用场景
### 同时存在大量相似对象且明显消耗内存
1. 享元模式本身会增加程序复杂度，所以只有大量对象同时存在时才能体现出享元的意义。
2. 这些大量存在的对象必须相似，必须要有某些相同的状态。

### 使用了多次的大成本数据结构
1. 由于使用了多次大成本数据结构实例，如果每次都创建新的，造成很大的开销。
2. 而且这些大成本数据结构的大多数状态都可以变为外部状态，可以在调用的环境中再传入。
3. 所谓大成本：要么是占用内存比较大，同时创建好多很占内存；要么是创建成本比较高，反复创建很耗时或耗内存。


## 缺点
* 复杂度增加
* 牺牲速度换内存
* 对象池的内存占用成本


## 例子
### 轻量化（Flyweight）对象的例子
1. 假设现在有一个很大的客服系统。有很多客服人员，也有很多客户。
2. 一个很长的客户列表对象，会比较占内存
    ```js
    function getClientList () {
        return {
            '1': {phone: 11111, name: 'client1', info: { /* ... 更多数据 */ }},
            '2': {phone: 22222, name: 'client1', info: { /* ... 更多数据 */ }},
            '3': {phone: 33333, name: 'client1', info: { /* ... 更多数据 */ }},
            // ...
            // ...
            // '9999': {phone: 99999999, name: 'client9999', info: {}},
        };
    }
    ```
3. 实现一个客服对象
    ```js
    class CustomerService  {
        constructor (id) {
            // 因为每个客服都可能联系任何一个客户，所以每个客服对象都保存了一个很大的客户列表
            this.clientList = getClientList();
            this.customerServiceId = id;
        }

        giveCall (phoneNumber) {
            console.log('call ' + phoneNumber);
        }

        callClient (cliendID) {
            this.giveCall(this.clientList[cliendID].phone)
        }
    }
    ```
4. 有 100 个客服人员，可以任意联系客户
    ```js
    let cs1 = new CustomerService('cs1');
    let cs2 = new CustomerService('cs2');
    let cs3 = new CustomerService('cs3');
    // ...
    // ...
    // let cs100 = new CustomerService('cs100');

    cs1.callClient('3');
    cs2.callClient('2');
    cs3.callClient('1');
    ```
5. 虽然可以实现，但问题在于，每个客服对象都有一个很大的客户列表属性，在客服对象很多时这会造成很大的内存占用。
6. 因为这些客户列表其实都是完全相同的，所以可以考虑将它们抽出来，所谓一个公共的属性，而非让每个客服对象自己维护
    ```js
    class BasicCustomerService {
        constructor () {
            this.clientList = getClientList();
        }

        giveCall (phoneNumber) {
            console.log('call ' + phoneNumber);
        }
    }

    class CustomerService extends BasicCustomerService {
        constructor (id) {
            super();
            this.customerServiceId = id;
        }

        callClient (cliendID) {
            this.giveCall(this.clientList[cliendID].phone)
        }
    }
    ```
7. 现在，虽然还是会创建很多个客服对象，但客户列表现在只保存在父级 `BasicCustomerService` 对象上，所以每个对象 `CustomerService` 都比之前小了很多，变成了一个 flyweight 级别的对象。
8. 这个例子不太合理的地方是，其实每个客服可以直接引用同一个客户列表对象，而不需要拷贝一份。不过并不影响说明享元模式的原理。

### 一个对象用很多次的例子
1. 假设有个内衣工厂，目前的产品有 50 种男式内衣和 50 种女士内衣，为了推销产品，工厂决定生产一些塑料模特来穿上他们的内衣拍成广告照片。正常情况下需要 50 个男模特和 50 个女模特，然后让他们每人分别穿上一件内衣来拍照。
2. 不考虑性能的情况下，程序也许会这样写：
    ```js
    class Model {
        constructor (sex, underwear) {
            this.sex = sex;
            this.underwear= underwear;
        }

        takePhoto () {
            console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
        }
    }

    for ( let i = 1; i <= 50; i++ ){
        let maleModel = new Model( 'male', 'male underwear' + i );
        maleModel.takePhoto();

        let femaleModel= new Model( 'female', 'female underwear' + i );
        femaleModel.takePhoto();
    };
    ```
3. 然而一般的老板没有这么土豪，不会为不同的款式专门花钱设计不同的模特。而且，你造那么多模特，也没地方放啊，还得搞个大的仓库。制造和存储的成本都太高了。
4. 所以，虽然有 100 种内衣，男模特和女模特各自有一个就足够了（实际情况可能需要不止一个来对应不同的 size），他们可以分别穿上不同的内衣来拍照
    ```js
    class Model {
        constructor (sex) {
            this.sex = sex;
        }

        takePhoto (underwear) {
            console.log( 'sex= ' + this.sex + ' underwear=' + underwear);
        }
    }

    let maleModel = new Model( 'male' );
    let femaleModel = new Model( 'female' );

    for ( let i = 1; i <= 50; i++ ) {
        maleModel.takePhoto('male underwear' + i);
        femaleModel.takePhoto('female underwear' + i);
    }
    ```
5. 现在，制造和存储的成本都变成了之前的五十分之一。
6. 这个例子不算是严格的 flyweight 模式，因为并没有把对象变小，所以它并不适用同时存在很多对象实例的情况。但本质上的思想还是一样的：相同的东西只需要维护一份，具体不同的适用场景都引用同一个相同的部分。


## 内部状态与外部状态
1. 享元模式要求对象尽可能具有通用性，也就是要求对象的内部固有状态尽可能的少，只在使用时根据环境需求加入需要的外部状态。
2. 因此，需要将对象的属性划分为内部状态与外部状态。关于如何划分内部状态和外部状态：
    * 内部状态存储于对象内部。
    * 内部状态可以被一些对象共享。
    * 内部状态独立于具体的场景，通常不会改变。
    * 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
3. 这样一来，我们便可以把所有内部状态相同的对象都指定为同一个共享的对象。而外部状态可以从对象身上剥离出来，并储存在外部。
4. 剥离了外部状态的对象成为共享（享元）对象，外部状态在必要时被传入共享对象来组装成一个完整的对象。
5. 通常来讲，内部状态有多少种组合，系统中便最多存在多少个对象。
6. 虽然组装外部状态成为一个完整对象的过程需要花费一定的时间，但却可以大大减少系统中的对象数量，相比之下，这点时间或许是微不足道的。因此，享元模式是一种用时间换空间的优化模式。

### 内部状态不应该被修改
由于内部状态是被各种环境公用的，所以必须保证不能被修改
```js
class Model {
    constructor (sex) {
        this.sex = sex;
    }

    get color () {
        return 'white';
    }

    takePhoto (underwear) {
        console.log( 'sex= ' + this.sex + ' underwear=' + underwear);
    }
}

let maleModel = new Model( 'male' );
maleModel.color = 'black'; // TypeError: Cannot set property color of #<Model> which has only a getter
```


## 对象池
对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，但没有分离内部状态和外部状态这个过程。

### 弹性资源投资
1. 对象池的本意应该是，一开始先不需要给所有的场景都创建一个对象，而是这些场景哪几个需要就先创建几个对象。
2. 这几个场景用完后，对象不要扔，先放到对象池里，之后如果有其他场景想用可以从对象池里直接去。如果有更多的场景需要对象而对象池不够时，再创建新的对象。
3. 比如说一个房产中介，有 10 个业务员，但你不需要刚开始就给每个业务员都配一辆电动车，因为并不是每个人都同时要带人去看房。
4. 比如开始只配了 5 辆，有人用完了就放在那里，其他人想用显然并不需要再申请买一辆，而是直接用现有的。用完后也是放在那里。
5. 之后业务量越来越大，大家更忙了，或者业务员也多了，根据业务需求再补充新的电动车。
6. 这里虽然没有实现，但可以想象，因为对象池要持续维护，所以当对象数量需求降低时，还可以从对象池中移除部分对象。就好像业务量下降，没有那么多人看房了，那除了 “向社会输送” 一些业务员人才外，还要卖掉一些电动车。

### 缓存——空间换时间
1. 除了可以实现弹性资源投资，缓存也是对象池的另一个用途。
2. 如果创建对象是一个消耗资源的事情，比如说计算量比较大，或者涉及数据请求，那么现在创建了好几个同类对象，但是用完的对象不要扔，先放进对象池中，之后再需要用到这一类对象时，不用再创建了，直接去对象池取。
3. 现在就是牺牲了一部分内存来维护，而省去了频繁创建的麻烦。
4. 但是如果对象比较占用内存，而创建的成本并不高，那对象池看起来也不是一个好的选择。与其存在那里占内存，不如用的时候再创建。

### 实现
1. 模拟地图地名气泡。先定义一个获取小气泡节点的工厂，作为对象池的数组成为私有属性被包含在工厂闭包里，这个工厂有两个暴露对外的方法，`create` 表示获取一个 `div` 节点，`recover` 表示回收一个 `div` 节点
    ```js
    const toolTipFactory = (function(){
        const toolTipPool = [];    // toolTip 对象池

        return {
            create(){
                if ( toolTipPool.length === 0 ){
                    let div = document.createElement( 'div' );
                    document.body.appendChild( div );
                    return div;
                }
                else {
                    return toolTipPool.shift();
                }
            },
            recover( tooltipDom ){
                return toolTipPool.push( tooltipDom );
            }
        }
    })();
    ```
2. 第一次查询地点出现 2 个气泡，第二次查询出现 6 个气泡。但第二次并不是新创建了6 个，而是先回收了之前的 2 个，再新创建 4 个
    ```js
    let ary = [];

    // 第一次查询，先创建两个新的 toolTip
    for ( let i = 0, str; str = [ 'A', 'B' ][ i++ ]; ){
        let toolTip = toolTipFactory.create();
        toolTip.innerHTML = str;
        ary.push( toolTip );
    };

    // 稍后第二次查询，重新绘制，这次有 6 个。重新绘制前先回收之前的 2 个，再创建6个时只需要创建 4 个新的 toolTip
    setTimeout(()=>{
        for ( let i = 0, toolTip; toolTip = ary[ i++ ]; ){
            toolTipFactory.recover( toolTip );
        };
        for ( let i = 0, str; str = [ 'A', 'B', 'C', 'D', 'E', 'F' ][ i++ ]; ){
            let toolTip = toolTipFactory.create();
            toolTip.innerHTML = str;
        };
    }, 5555);
    ```

### 通用对象池实现
1.  在对象池工厂里，把创建对象的具体过程封装起来，实现一个通用的对象池创建函数
    ```js
    const objectPoolFactory = ( createObjFn ) => {
        let objectPool = [];

        return {
            create ( ...args ) {
                if ( objectPool.length ) {
                    return objectPool.shift();
                }
                else {
                    return createObjFn( ...args ) ;
                }

            },
            recover ( obj ) {
                objectPool.push( obj );
            }
        }
    };
    ```
2. 使用通用的对象池创建函数，创建一个 toolTip 对象池对象
    ```js
    function createToolTip(str){
        console.log('create new object');
        let div = document.createElement( 'div' );
        div.innerHTML = str;
        document.body.appendChild( div );
        return div;
    }
    const toolTipFactory = objectPoolFactory(createToolTip);

    let ary = [];

    for ( let i = 0, str; str = [ 'A', 'B' ][ i++ ]; ){
        let toolTip = toolTipFactory.create(str);
        ary.push( toolTip );
    };

    setTimeout(()=>{
        for ( let i = 0, toolTip; toolTip = ary[ i++ ]; ){
            toolTipFactory.recover( toolTip );
        };
        for ( let i = 0, str; str = [ 'A', 'B', 'C', 'D', 'E', 'F' ][ i++ ]; ){
            toolTipFactory.create(str);
        };
    }, 5555);
    ```


##　与其他模式的关系


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/flyweight)
