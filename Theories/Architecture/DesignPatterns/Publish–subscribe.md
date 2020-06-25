# Publish–subscribe


<!-- TOC -->

- [Publish–subscribe](#publishsubscribe)
    - [抽象本质](#抽象本质)
        - [两个对象跨时间和跨空间的交流](#两个对象跨时间和跨空间的交流)
    - [设计思想](#设计思想)
        - [从现实中寻找灵感](#从现实中寻找灵感)
        - [对象解耦](#对象解耦)
        - [OCP——动态添加任务](#ocp动态添加任务)
        - [发布-订阅模式的内幕交易](#发布-订阅模式的内幕交易)
        - [两种角色交流问题的分析](#两种角色交流问题的分析)
            - [交流方式](#交流方式)
            - [前两种处理方式本质上相同](#前两种处理方式本质上相同)
    - [实现原理](#实现原理)
    - [适用场景](#适用场景)
    - [两种通知并传递信息的机制——从普通回调模式到发布-订阅模式](#两种通知并传递信息的机制从普通回调模式到发布-订阅模式)
        - [普通回调模式](#普通回调模式)
            - [发布-订阅模式](#发布-订阅模式)
    - [参考一下 DOM 事件的机制](#参考一下-dom-事件的机制)
    - [给任意对象添加发布-订阅功能](#给任意对象添加发布-订阅功能)
    - [全局的发布-订阅对象](#全局的发布-订阅对象)
    - [模块间通信](#模块间通信)
        - [比较一下两者的调用栈](#比较一下两者的调用栈)
    - [离线事件](#离线事件)
    - [书上的离线事件和命名空间的实现](#书上的离线事件和命名空间的实现)
    - [References](#references)

<!-- /TOC -->


## 抽象本质
### 两个对象跨时间和跨空间的交流
* **跨时间**：提供某种联系方式订阅某个事件，之后事件发生后通过联系方式发送信息。
* **跨空间**：两个对象不方便直接交流，A 就可以把联系方式告诉中介，B 想要发消息给 A 时，告诉中介自己的想要发给 A 以及要发送的消息，中间通过 A 的联系方式帮忙转发。


## 设计思想
### 从现实中寻找灵感
1. 在现实世界，发布-订阅模式可以说很常见的。
2. 所以当我们尝试解决一个问题时，就可以看看现实世界中有没有什么类似的东西可以借鉴。
3. 进一步，当我们在看到现实世界中比较好的管理和解决问题的方式时，也可以考虑是否可以抽象为一种软件设计模式。

### 对象解耦
A 想发送消息给 B，但是不能或不想直接访问到 B 的时候，可以通过中介来转发消息。

### OCP——动态添加任务
1. 后续需要动态变化的不应该影响核心部分，也不需要核心部分去配合变动。
2. 一种不好的方式是，每次添加新的任务时，都需要监听者进行某些配合。可以想象，一个人正在干活，然后不停的有人过来给他说：“等你这个完成了，就打这个电话通知一下我”，然后监听者就停下来在他的手机里记上这个电话。这样在每次添加新任务时，监听者都会被打断，也就是说监听者需要做一些事情来配合新任务的添加。
3. 另一种方式是，监听者设置一个可以让执行者自行添加任务的机制。例如，这个人在门外挂一个输入器，来添加任务的人不需要敲门，就可以直接输入任务。在这种情况下，添加新任务并不需要监听者配合。

### 发布-订阅模式的内幕交易
1. 从下面 [模块间通信](#模块间通信) 部分的介绍可以看到，因为发布-订阅模式并不是两个模块直接沟通，所以要找到两者的关系就比较麻烦。
2. 在一个稍微复杂的系统里，复杂具体模块的人并不会接触到发布-订阅模式功能提供模块的代码，就像我们虽然经常使用浏览器的事件机制，但是并不知道它内部的机制一样。
3. 模式提供者就是一种中介机构，方便固然方便，但中介也是有可能有坑的。

### 两种角色交流问题的分析
#### 交流方式
1. 监听事件发生的（publisher）和做出反应的（subscriber）不是同一个角色。
2. 如果是同一个，只需要自己监听并自己做出反应，不存在什么问题。
3. 如果是两个角色，即有监听者和反应者，则会出现四种处理方式：
    * 反应者把事件发生后要做的事情告诉监听者，监听事件的角色在事件发生后替反应者做出某种反应。这是反应者把任务传递给了监听者。
    * 反应者提供给监听者一个通知机制，比如留下电话，监听者在获得事件发生的消息后，使用通知机制通知反应者，反应者自己做出反应。这是监听者把消息传递给了反应者。
    * 监听者在事件发生后，会进行广播，因此反应者要一直监听广播，等待事件发生的消息。
    * 反应者不断轮询监听者，查看是否事件已发生。
4. 后两种方法因为涉及很多次无意义的监听查询，一般情况下效率相比前两者低。Publish–subscribe 模式和前两种有关。

#### 前两种处理方式本质上相同
1. 可以看到，都是反应者要事先提供给监听者某种东西，只不过一个是具体的任务，一个是通知机制。
2. 而这个通知机制也可以认为是具体任务的一个预任务，预任务在被监听者执行后，也会触发反应者执行具体的任务。
3. 可以说第二种方式是将实际的任务分成了两部分，而将第一步的导火索任务交给了监听者。
4. 所以说，这都是要事先给监听者传递某个任务的，只不过是具体任务和预任务的区别。


## 实现原理
1. 保存事件名和对应的处理函数。
2. 事件发生时，从保存的映射里面找到对应的处理函数，调用并传递事件信息。


## 适用场景
两个对象跨时间和跨空间的交流


## 两种通知并传递信息的机制——从普通回调模式到发布-订阅模式
### 普通回调模式
1. 一个常见的场景是，`publisher` 等待某个事情发生后，通知若干个 `subscriber`，例如常见的 DOM 事件处理过程。
2. 很自然的可以使用下面的方法
    ```js
    const subscriber1 = {
        gotMessage (msg) {
            console.log('subscriber1: ' + msg);
        }
    };

    const subscriber2 = {
        gotMessage (msg) {
            console.log('subscriber2: ' + msg);
        }
    };


    const publisher = {
        publishMessage (msg) {
            subscriber1.gotMessage(msg);
            subscriber2.gotMessage(msg);
        }
    };


    setTimeout(()=>{
        let msg = 'timeout'
        publisher.publishMessage(msg);
    }, 3000);
    ```
3. `publisher.publishMessage` 作为事件回调函数，会获取到的事件信息。
4. `publisher.publishMessage` 在其内部，会调用 `subscriber1` 和 `subscriber2` 的事件处理函数 `gotMessage`，`subscriber1` 和 `subscriber2` 因此也获得的事件信息。
5. 但这种模式的问题是，在定义 `publisher.publishMessage`，内部就已经写死了两个事件处理函数。
6. `publisher` 就和 `subscriber` 耦合了，而且 `publisher` 没有做到 OCP。在运行时，无法动态的再注册事件处理函数；要添加就要修改 `publisher`。

#### 发布-订阅模式
1. 为了解决上面的问题，很自然的就会想到不要写死，而是使用一个事件处理函数列表，可以往这个列表里动态添加处理函数，然后 `publisher.publishMessage` 遍历执行这个列表。于是变成
    ```js
    const subscriber1 = {
        gotMessage (msg) {
            console.log('subscriber1: ' + msg);
        }
    };

    const subscriber2 = {
        gotMessage (msg) {
            console.log('subscriber2: ' + msg);
        }
    };

    const handlers = [subscriber1.gotMessage];

    const publisher = {
        publishMessage (msg) {
            handlers.forEach(item=>item(msg))
        }
    };


    handlers.push(subscriber2.gotMessage);

    setTimeout(()=>{
        let msg = 'timeout'
        publisher.publishMessage(msg);
    }, 3000);
    ```
2. 好了，其实这已经就是发布-订阅模式了，只不过不是那么典型的，但原理是一样的。
3. 如果要典型一点，其实就是要改两点：
    * 把事件处理列表维护在 `publisher` 里面
    * `publisher` 提供一个添加事件处理函数的方法
4. 于是变成
    ```js 
    const subscriber1 = {
        gotMessage (msg) {
            console.log('subscriber1: ' + msg);
        }
    };

    const subscriber2 = {
        gotMessage (msg) {
            console.log('subscriber2: ' + msg);
        }
    };


    const publisher = {
        handlers: [],
        register (cb) {
            this.handlers.push(cb);
        },
        publishMessage (msg) {
            this.handlers.forEach(cb=>{
                cb(msg);
            });
        }
    };

    publisher.register(subscriber1.gotMessage);
    publisher.register(subscriber2.gotMessage);


    setTimeout(()=>{
        let msg = 'timeout'
        publisher.publishMessage(msg);
    }, 3000);
    ```
5. 可以看出来，原理也是一样的。但这种典型的方式有它的优点，就是它有更好的内聚性。
6. 因为从逻辑上来说，作为一对多的发布者，更有一种公共机构的感觉，所以应该由它来统一维护整个完整的功能、提供完整的服务。


## 参考一下 DOM 事件的机制
1. 示例代码
    ```js
    const subscriber1 = {
        gotMessage () {
            console.log('subscriber1');
        }
    };

    const subscriber2 = {
        gotMessage () {
            console.log('subscriber2');
        }
    };

    const subscriber3 = {
        gotMessage () {
            console.log('subscriber3');
        }
    };

    const publisher = document.body;
    publisher.addEventListener( 'click', subscriber1.gotMessage, false );
    publisher.addEventListener( 'click', subscriber2.gotMessage, false );
    publisher.addEventListener( 'touchmove', subscriber3.gotMessage, false );
    ```
2. 这里 publisher 并没有一个显式的 `publishMessage` 方法，而是由浏览器进行操作的。当相应事件发生时，调用 publisher 上相应事件注册的所有处理函数。
3. 与前面例子不同的是，这里一个 publisher 身上可以有多种事件供 subscriber 注册。


## 给任意对象添加发布-订阅功能
我们希望可以很方便的给任何一个对象添加发布-订阅的功能。下面实现了一个构造器 `PublisherFactory`，它接受一个对象，然后基于 publisher 的原型 `PublisherPrototype` 给对象添加发布-订阅功能。
```js
const PublisherPrototype = {
    eventPool: [],

    listen (eventName, handler) {
        if ( !this.eventPool[eventName] ) {
            this.eventPool[eventName] = [];
        }
        this.eventPool[eventName].push(handler);
    },

    trigger (...args) {
        let eventName = args[0];
        let eventMessages = args.slice(1);
        let handlers = this.eventPool[eventName];

        if (!handlers || handlers.length === 0) {
            return false;
        }

        handlers.forEach(fn => {
            fn.call(this, ...eventMessages);
        });
    },

    remove (eventName, handler) {
        let handlerList = this.eventPool[eventName];

        if ( !handlerList ) {
            return false;
        }
        if ( !handler ) {
            handlerList.length = 0;
        }
        else {
            for (let i = handlerList.length - 1; i > -1; i--) {
                let fn = handlerList[i];
                if ( fn === handler ){
                    handlerList.splice( i, 1 );
                }
            }
        }
    },
};

const PublisherFactory = (obj) => {
    for ( let key in PublisherPrototype ) {
        obj[key] = PublisherPrototype[key];
    }
};


const Publisher = {};
PublisherFactory(Publisher);

const subscriber1 = {
    ev1_cb (ev1_msg) {
        console.log('subscriber1: ' + ev1_msg);
    },
    ev2_cb (ev2_msg) {
        console.log('subscriber1: ' + ev2_msg);
    },
};
const subscriber2 = {
    ev1_cb (ev1_msg) {
        console.log('subscriber2: ' + ev1_msg);
    },
};


Publisher.listen('event1', subscriber1.ev1_cb);
Publisher.listen('event2', subscriber1.ev2_cb);
Publisher.listen('event1', subscriber2.ev1_cb);


Publisher.trigger('event1', 'This is event1 message');
Publisher.trigger('event2', 'This is event2 message');
```


## 全局的发布-订阅对象
1. 上面的通用实现，就是可以给任意一个对象添加发布-订阅的功能。就像 DOM 的事件机制一样，可以订阅不同节点类型的不同事件。
2. 但如果并不需要为每个对象定制特有的事件，而是只需要全局通用的事件，则只需要一个全局的发布-订阅机构来代理所有的事件订阅和发布。
3. 所有对象想发布的事件都注册到这个代理中介上，所以订阅者都来这个中介这里来订阅事件，只需要保证所有发布者的事件名都不重复即可。如果不同的发布者会用到相同的事件名，需要使用后面讲到的命名空间方案。

```js
const EventAgency = (function(){

    const eventPool = {};

    const listen = (eventName, handler) => {
        if ( !eventPool[eventName] ) {
            eventPool[eventName] = [];
        }
        eventPool[eventName].push(handler);
    };

    const trigger = (...args) => {
        let eventName = args[0];
        let eventMessages = args.slice(1);
        let handlers = eventPool[eventName];

        if ( !handlers || handlers.length === 0 ) {
            return false;
        }

        handlers.forEach(fn => {
            fn.call(this, ...eventMessages);
        });
    };

    const remove = (eventName, handler) => {
        let handlerList = eventPool[eventName];

        if ( !handlerList ) {
            return false;
        }

        if ( !handler ) {
            handlerList.length = 0;
        }
        else {
            for (let i = handlerList.length - 1; i > -1; i--) {
                let fn = handlerList[i];
                if ( fn === handler ){
                    handlerList.splice( i, 1 );
                }
            }
        }
    };

    return {
        listen,
        trigger,
        remove,
    };

})();


// 两个订阅事件的对象
const subscriber1 = {
    ev1_cb (ev1_msg) {
        console.log('subscriber1: ' + ev1_msg);
    },
    ev2_cb (ev2_msg) {
        console.log('subscriber1: ' + ev2_msg);
    },
};
const subscriber2 = {
    ev1_cb (ev1_msg) {
        console.log('subscriber2: ' + ev1_msg);
    },
};

// event1 事件被订阅了两次，event2 事件被订阅了一次
EventAgency.listen('event1', subscriber1.ev1_cb);
EventAgency.listen('event1', subscriber2.ev1_cb);
EventAgency.listen('event2', subscriber1.ev2_cb);

// 两个发布事件的对象
const publisher1 = {
    publish () {
        EventAgency.trigger('event1', 'publisher1 event1');
        EventAgency.trigger('event2', 'publisher1 event2');
    }
};
const publisher2 = {
    publish () {
        EventAgency.trigger('event1', 'publisher2 event1');
    }
};


// publisher1 发布了 event1 和 event2 事件
publisher1.publish();
// publisher2 发布了 event1 事件
publisher2.publish();
```


## 模块间通信
1. A 模块通过订阅 B 模块发布的事件，实现从 B 模块到 A 模块的信息传递
    ```js
    const module1 = {
        toModule2 (coordinate) {
            EventAgency.trigger('msgToModule2', coordinate);
        },
    };
    const module2 = {
        listenModule1 () {
            EventAgency.listen('msgToModule2', function (coordinate) {
                console.trace('发布订阅模式的调用栈');
                console.log(coordinate);
            });
        },
    };

    module2.listenModule1();
    window.addEventListener('click', function (ev) {
        module1.toModule2({x: ev.clientX, y: ev.clientY});
    });
    ```
2. 模块之间如果用了太多的全局发布—订阅模式来通信，那么模块与模块之间的联系就被隐藏到了背后。我们最终会搞不清楚消息来自哪个模块，或者消息会流向哪些模块，发布者和订阅者都是通过代理联系的，两者甚至都不会知道对方的存在。这又会给我们的维护带来一些麻烦，也许某个模块的作用就是暴露一些接口给其他模块调用。
3. 上面的例子看起来模块间的关系还挺明确的，`module2` 会 `listenModule1`，这完全是因为方法的命名体现出了模块间的关系。如果改成下面这样的命名
    ```js
    const module1 = {
        publishCoordinate (coordinate) {
            EventAgency.trigger('coordinateChange', coordinate);
        },
    };
    const module2 = {
        listenCoordinate () {
            EventAgency.listen('coordinateChange', function (coordinate) {
                console.log(coordinate);
            });
        },
    };

    module2.listenCoordinate();
    window.addEventListener('click', function (ev) {
        module1.publishCoordinate({x: ev.clientX, y: ev.clientY});
    });
    ```
    现在在 `module1` 就看不出和 `module2` 有什么关系了，反之亦然。
4. 如果希望 `module1` 和 `module2` 有着更明确的依赖关系，也许可以直接相互调用方法
    ```js
    const module1 = {
        sendCoordinateToModule2 (coordinate) {
            module2.listenCoordinate(coordinate);
        },
    };
    const module2 = {
        listenCoordinate (coordinate) {
            console.trace('直接调用模块方法的调用栈');
            console.log(coordinate);
        },
    };

    window.addEventListener('click', function (ev) {
        module1.sendCoordinateToModule2({x: ev.clientX, y: ev.clientY});
    });
    ```
5. `module2` 现在有一个明确的接受坐标的方法，任何对象想给它传坐标，都可以明确的调用这个方法。

### 比较一下两者的调用栈
1. 发布订阅模式的调用栈
    ```sh
    eval
    eval
    trigger
    toModule2
    eval
    ```
2. 能看懂的只有一个 `toModule2`，`trigger` 也能看懂是因为 `EventAgency` 以及里面的 `trigger` 方法就是我们自己刚刚编写的。
3. 而 `listenModule1` 更是直接丢失了，因为 `listenModule1` 是之前添加监听时调用的，根本不在这个事件循环里面。
4. 再看看直接调用模块方法的调用栈，可以看到调用者和被调用者的两个方法在栈里是挨在一起的
    ```sh
    listenCoordinate
    sendCoordinateToModule2
    eval
    ```


## 离线事件
1. 一个事件触发后，如果发现并没有人订阅这个事件，则把这个事件保存为离线事件，保存事件名和事件信息。
2. 之后如果有人订阅了事件，先去离线事件里找找有没有这个事件，有的话就执行事件处理函数，并传入事件信息。
3. 如果没有这个离线事件，则注册一个正常的事件监听。
4. 注意因为是离线事件，所以不会一次注册多次监听到，只有在第一次监听的时候会接收到事件，比如 QQ 离线消息的情况。
5. 下面的代码实现了离线事件，并模拟 QQ 离线消息

```js
const EventAgency = (function(){

    const eventPool = {};

    // 保存离线事件和处理函数
    const offlineEventPool = {}

    // 注册离线事件，私有方法
    const listenOffline = (eventName, ...eventMessages) => {
        if ( offlineEventPool[eventName] ) {
            offlineEventPool[eventName].push(eventMessages);
        }
        else {
            offlineEventPool[eventName] = [eventMessages];
        }
    };

    // 触发离线事件，私有方法
    const triggerOffline = (eventName, handler) => {
        offlineEventPool[eventName].forEach(msgs => {
            handler.call(this, ...msgs);
        });
        // 离线事件只触发一次
        delete offlineEventPool[eventName];
    };

    const listen = (eventName, handler) => {
        if ( offlineEventPool[eventName] ) {
            // 注册事件的时候，如果该事件再离线事件里，则直接触发
            triggerOffline(eventName, handler);
            return;
        }

        if ( !eventPool[eventName] ) {
            eventPool[eventName] = [];
        }
        eventPool[eventName].push(handler);
    };

    const trigger = (...args) => {
        let eventName = args[0];
        let eventMessages = args.slice(1);
        let handlers = eventPool[eventName];

        if ( !handlers || handlers.length === 0 ) {
            // 事件触发的时候，如果没有注册，则注册为离线事件
            listenOffline(eventName, ...eventMessages);
            return false;
        }

        handlers.forEach(fn => {
            fn.call(this, ...eventMessages);
        });
    };

    const remove = (eventName, handler) => {
        let handlerList = eventPool[eventName];

        if ( !handlerList ) {
            return false;
        }

        if ( !handler ) {
            handlerList.length = 0;
        }
        else {
            for (let i = handlerList.length - 1; i > -1; i--) {
                let fn = handlerList[i];
                if ( fn === handler ){
                    handlerList.splice( i, 1 );
                }
            }
        }
    };

    return {
        listen,
        trigger,
        remove,
    };

})();

const user1 = {
    sendMessage () {
        EventAgency.trigger('user1ToUser3', 'user3 你好，我是 user1');
        EventAgency.trigger('user1ToUser4', 'user4 你好，我是 user1');
    }
};
const user2 = {
    sendMessage () {
        EventAgency.trigger('user2ToUser3', 'user3 你好，我是 user2');
    }
};

console.log('user1 和 user 2 发送离线消息 ——————————————————————');
user1.sendMessage(); // user1 分别给 user3 和 user4 发了一条离线消息
user2.sendMessage(); // user2 给 user3 发了一条离线消息


const user3 = {
    receiveMessageFromUser1 (msg) {
        console.log('这是我（user3）和 user1 的对话框：' + msg);
    },
    receiveMessageFromUser2 (msg) {
        console.log('这是我（user3）和 user2 的对话框：' + msg);
    },
};
const user4 = {
    receiveMessageFromUser1 (msg) {
        console.log('这是我（user4）和 user1 的对话框：' + msg);
    },
};

setTimeout(() =>{
    console.log('user3 打开 QQ ——————————————————————');
    // 接受发送给自己的消息，也就是监听 `sendMessageToUser3` 事件
    EventAgency.listen('user1ToUser3', user3.receiveMessageFromUser1); // 和 user1 的对话框
    EventAgency.listen('user2ToUser3', user3.receiveMessageFromUser2); // 和 user2 的对话框
}, 2000);

setTimeout(() =>{
    console.log('user4 打开 QQ ——————————————————————');
    // 接受发送给自己的消息，也就是监听 `sendMessageToUser4` 事件
    EventAgency.listen('user1ToUser4', user4.receiveMessageFromUser1); // 和 user1 的对话框
}, 4000);

setTimeout(() =>{
    console.log('提前打开 QQ 等待在线消息 ——————————————————————');
    // 离线事件已经发送，这里只是普通事件的注册，不会触发事件回调
    EventAgency.listen('user1ToUser3', user3.receiveMessageFromUser1);
    EventAgency.listen('user2ToUser3', user3.receiveMessageFromUser2);
    EventAgency.listen('user1ToUser4', user4.receiveMessageFromUser1);
}, 6000);

setTimeout(() =>{
    console.log('user1 和 user 2 发送在线消息 ——————————————————————');
    user1.sendMessage();
    user2.sendMessage();
}, 8000);
```


## 书上的离线事件和命名空间的实现
1. 可以先发布事件，然后在事件订阅的时候再触发事件回调。
2. 事件发布时，内部先不真的触发事件的回调，而是将回调保存进离线事件列表中。等到事件订阅的时候，再触发离线事件列表中的保存的回调。

```js
const Event = (function(){

    let global = this,
        Event,
        _default = 'default';

    Event = function(){
        let _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            // 遍历调用 fn 时，fn 中的 this 会被设置为当前的数组项。这里实际就是某个事件回调函数
            each = function( ary, fn ){
                let ret;
                for ( let i = 0, l = ary.length; i < l; i++ ){
                    let n = ary[i];

                    ret = fn.call( n, i, n);
                }
                return ret;
            };

        _listen = function( key, fn, cache ){
            if ( !cache[ key ] ){
                cache[ key ] = [];
            }
            cache[key].push( fn );
        };

        _remove = function( key, cache ,fn){
            if ( cache[ key ] ){
                if( fn ){
                    for( let i = cache[ key ].length; i >= 0; i-- ){
                        if( cache[ key ][i] === fn ){
                            cache[ key ].splice( i, 1 );
                        }
                    }
                }else{
                    cache[ key ] = [];
                }
            }
        };

        // 立即执行事件的所有回调
        _trigger = function(){
            let cache = _shift.call(arguments), // 第一个参数要传事件回调集合
                key = _shift.call(arguments), // 事件名
                args = arguments, // 有效的事件参数
                _self = this,
                ret,
                stack = cache[ key ]; // 当前事件的回调函数列表

            if ( !stack || !stack.length ){
                return;
            }

            // 依次调用事件回调
            return each( stack, function(){
                return this.apply( _self, args );
            });
        };

        _create = function( namespace ){
            namespace = namespace || _default;
            let cache = {},
                offlineStack = [],    // 离线事件
                ret = {

                    listen ( key, fn, last ) {
                        // 将回调加入事件回调集合
                        _listen( key, fn, cache );
                        // 如果没有离线事件则直接返回
                        if ( offlineStack === null ){
                            return;
                        }

                        if ( last === 'last' ){
                            offlineStack.length && offlineStack.pop()();
                        }
                        else {
                            // 依次触发离线事件
                            each( offlineStack, function(){
                                this();
                            });
                        }

                        // TODO 只要在有离线事件的情况下进行了 listen，不管 listen 的是不是存在的离线事件，都会清空离线事件列表
                        offlineStack = null;
                    },

                    one ( key, fn, last ) {
                        _remove( key, cache );
                        this.listen( key, fn, last );
                    },

                    remove ( key, fn ) {
                        _remove( key, cache ,fn);
                    },

                    // 立刻调用事件对应的回调或者将回调推入离线事件栈
                    trigger () {
                        let fn,
                            args,
                            _self = this;

                        // 调用 _trigger 函数需要传入事件回调集合
                        _unshift.call( arguments, cache );
                        args = arguments;

                        // fn 函数会调用某个事件的所有回调，但 fn 并不一定会立刻执行，因为有可能被会是离线事件
                        fn = function(){
                            return _trigger.apply( _self, args );
                        };

                        // listen 之前的 trigger 都会被推入离线事件栈，第一次 listen 之后就会删除离线事件栈
                        if ( offlineStack ){
                            return offlineStack.push( fn );
                        }
                        else {
                            // 非离线事件
                            return fn();
                        }
                    },
                };

            return namespace ?
                ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                    namespaceCache[ namespace ] = ret )
                : ret;
        };

        return {
            // TODO 为什么每次都要 create
            create: _create,
            one ( key, fn, last ) {
                let event = this.create( );
                event.one( key, fn, last );
            },
            remove ( key, fn ) {
                let event = this.create( );
                event.remove( key, fn );
            },
            listen ( key, fn, last ) {
                let event = this.create( );
                event.listen( key, fn, last );
            },
            trigger () {
                let event = this.create( );
                event.trigger.apply( this, arguments );
            },
        };
    }();

    return Event;

})();


/************** 先发布后订阅 ********************/

Event.trigger( 'click', 1 );

Event.listen( 'click', function( a ){
    console.log( a );       // 输出：1
});

/************** 使用命名空间 ********************/

Event.create( 'namespace1' ).listen( 'click', function( a ){
    console.log( a );    // 输出：1
});

Event.create( 'namespace1' ).trigger( 'click', 1 );


Event.create( 'namespace2' ).listen( 'click', function( a ){
    console.log( a );     // 输出：2
});

Event.create( 'namespace2' ).trigger( 'click', 2 );
```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)