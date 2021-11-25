# Publish–subscribe


<!-- TOC -->

- [Publish–subscribe](#publishsubscribe)
    - [抽象本质](#抽象本质)
        - [两个对象跨空间的交流](#两个对象跨空间的交流)
    - [设计思想](#设计思想)
        - [从现实中寻找灵感](#从现实中寻找灵感)
        - [OCP 解耦](#ocp-解耦)
        - [两种角色交流问题的分析](#两种角色交流问题的分析)
            - [交流方式](#交流方式)
            - [前两种处理方式本质上相同](#前两种处理方式本质上相同)
    - [实现原理](#实现原理)
        - [将某个对象实现为发布者](#将某个对象实现为发布者)
        - [全局的发布订阅机制](#全局的发布订阅机制)
    - [适用场景](#适用场景)
    - [缺点](#缺点)
    - [两种通知并传递信息的机制——从普通回调模式到发布-订阅模式](#两种通知并传递信息的机制从普通回调模式到发布-订阅模式)
        - [普通回调模式](#普通回调模式)
            - [发布-订阅模式](#发布-订阅模式)
    - [参考一下 DOM 事件的机制](#参考一下-dom-事件的机制)
    - [给任意对象添加发布-订阅功能](#给任意对象添加发布-订阅功能)
    - [全局的发布-订阅对象](#全局的发布-订阅对象)
    - [`once` 事件绑定](#once-事件绑定)
    - [模块间通信](#模块间通信)
        - [比较一下两者的调用栈](#比较一下两者的调用栈)
    - [离线事件](#离线事件)
    - [书上的离线事件和命名空间的实现](#书上的离线事件和命名空间的实现)
    - [与其他模式的关系](#与其他模式的关系)
        - [中介者模式](#中介者模式)
    - [References](#references)

<!-- /TOC -->


## 抽象本质
### 两个对象跨空间的交流
两个对象不方便直接交流，A 就可以把联系方式告诉中介，B 想要发消息给 A 时，告诉中介自己的想要发给 A 以及要发送的消息，中间通过 A 的联系方式帮忙转发。


## 设计思想
### 从现实中寻找灵感
1. 在现实世界，发布-订阅模式可以说很常见的。
2. 所以当我们尝试解决一个问题时，就可以看看现实世界中有没有什么类似的东西可以借鉴。
3. 进一步，当我们在看到现实世界中比较好的管理和解决问题的方式时，也可以考虑是否可以抽象为一种软件设计模式。

### OCP 解耦
1. 解除了消息发布者和订阅者之间的耦合，后续需要添加或删除订阅者不影响核心部分。
2. 一种不好的方式是，每次添加新的任务时，都需要监听者进行某些配合。可以想象，一个人正在干活，然后不停的有人过来给他说：“等你这个完成了，就打这个电话通知一下我”，然后监听者就停下来在他的手机里记上这个电话。这样在每次添加新任务时，监听者都会被打断，也就是说监听者需要做一些事情来配合新任务的添加。
3. 另一种方式是，监听者设置一个可以让执行者自行添加任务的机制。例如，这个人在门外挂一个输入器，来添加任务的人不需要敲门，就可以直接输入任务。在这种情况下，添加新任务并不需要监听者配合。

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
### 将某个对象实现为发布者
1. 该对象维护一个事件和回调映射表，每一条从一个事件名映射到一个该事件的回调列表。
2. 发布者对象暴露一个订阅事件的方法，其他对象想要订阅该发布者的某个事件的话，就使用订阅方法传递事件名和回调函数。订阅方法将事件名和回调函数保存进映射表。
3. 当发布者的某个事件发生时，从映射表根据事件名找到回调列表，依次调用里面的回调函数，并传递事件信息作为参数。

### 全局的发布订阅机制
1. 将某个对象实现为发布者的实现中，有两类对象：一个发布者和若干个订阅者。发布者维护若干个订阅者，并自己负责发布事件消息。
2. 全局的发布订阅机制中，是在上面的基础上，将发布事件消息的方法也暴露为接口，那么现在这个对象自身其实就只剩下了一个事件和回调的映射表。
3. 订阅事件和发布事件都可以有任何对象来执行，而维护映射表的对象现在相当于一个事件订阅和发布的平台。
4. 任何对象都可以使用订阅接口在映射表里注册事件和对应的回到，而其他对象可以通过发布接口发布已有事件并传递事件信息。


## 适用场景
1. 当一个对象发生变化时需要通知其他若干对象，或者反过来说，一个对象的行为变动需要依赖其他对象的状态变动时；
2. 尤其是，不希望耦合它们之间的关系，或者只有在运行时才能确定关系和需要动态建立或取消关系时；
3. 另外，如果两个对象分属不同的模块，不能或者不应该直接交流时，可以通过发布-订阅平台进行交流。


## 缺点
* 两个对象之间的交流不再直接，而是通过发布-订阅平台，不能直观的看到两个对象之间是否有关系，特别是在查看函数调用栈是。这个缺点对应重构中 *Middle Man* 这条 bad code。


## 两种通知并传递信息的机制——从普通回调模式到发布-订阅模式
### 普通回调模式
1. 一个常见的场景是，发布者获得若干个订阅者提供的函数作为回调函数，等待某个事情发生后，通过调用这些回调函数把数据传递给这些订阅者，例如常见的 DOM 事件处理过程。
2. 很自然的可以使用下面的方法
    ```js
    const subscriber1 = {
        getMessage (msg) {
            console.log('subscriber1: ' + msg);
        }
    };
    const subscriber2 = {
        getMessage (msg) {
            console.log('subscriber2: ' + msg);
        }
    };

    const publisher = {
        publishMessage (msg) {
            subscriber1.getMessage(msg);
            subscriber2.getMessage(msg);
        }
    };

    setTimeout(()=>{
        let msg = 'timeout'
        publisher.publishMessage(msg);
    }, 2000);
    ```
3. 两个订阅者分别定义了自己的回调函数 `getMessage`，该函数把发布者发布的消息作为参数。
4. 发布者在需要发布的时候，分别调用这两个回调函数，把消息作为参数传递进去，这样订阅者就可以在自己的回调函数里接收消息并进行处理。
5. 但这种模式的问题是，在定义 `publisher.publishMessage` 时，内部就已经写死了两个回调函数。这样发布者就和特定的两个订阅者耦合了，发布者没有做到 OCP，想要增删订阅者就必须要修改发布者的逻辑。
6. 而且在运行时，无法动态的添加或删除订阅者。

#### 发布-订阅模式
1. 为了解决上面的问题，很自然的就会想到不要写死，而是使用一个回调函数列表，可以往这个列表里动态添加处理函数，然后 `publisher.publishMessage` 遍历执行这个列表。于是变成
    ```js
    const handlers = [subscriber1.getMessage];

    const publisher = {
        publishMessage (msg) {
            handlers.forEach(item=>item(msg))
        }
    };

    handlers.push(subscriber2.getMessage); // 动态添加订阅者

    setTimeout(()=>{
        let msg = 'timeout'
        publisher.publishMessage(msg);
    }, 2000);
    ```
2. 好了，其实这已经就是发布-订阅模式了，只不过不是那么典型的，但原理是一样的。
3. 如果要典型一点，其实就是要改两点：
    * 把回调函数列表维护在发布者对象里面
    * 发布者提供一个添加回调函数的方法
4. 于是变成
    ```js 
    const publisher = {
        callbacks: [],

        register (cb) {
            this.callbacks.push(cb);
        },
        
        publishMessage (msg) {
            this.callbacks.forEach(cb=>{
                cb(msg);
            });
        }
    };

    publisher.register(subscriber1.getMessage);
    publisher.register(subscriber2.getMessage);
    ```
5. 可以看出来，原理也是一样的。但这种典型的方式有它的优点，就是它有更好的内聚性。
6. 因为从逻辑上来说，作为一对多的发布者，更有一种公共机构的感觉，所以应该由它来统一维护整个完整的功能、提供完整的服务。


## 参考一下 DOM 事件的机制
1. 示例代码
    ```js
    const subscriber1 = {
        getMessage () {
            console.log('subscriber1');
        }
    };

    const subscriber2 = {
        getMessage () {
            console.log('subscriber2');
        }
    };

    const subscriber3 = {
        getMessage () {
            console.log('subscriber3');
        }
    };

    const publisher = document.body;
    publisher.addEventListener( 'click', subscriber1.getMessage, false );
    publisher.addEventListener( 'click', subscriber2.getMessage, false );
    publisher.addEventListener( 'touchmove', subscriber3.getMessage, false );
    ```
2. 这里 publisher 并没有一个显式的 `publishMessage` 方法，而是由浏览器进行操作的。当相应事件发生时，调用 publisher 上相应事件注册的所有处理函数。
3. 与前面例子不同的是，这里一个 publisher 身上可以有多种事件供 subscriber 注册。


## 给任意对象添加发布-订阅功能
我们希望可以很方便的给任何一个对象添加发布-订阅的功能。下面实现了一个构造器 `PublisherFactory`，它接受一个对象，然后基于 publisher 的原型 `PublisherPrototype` 给对象添加发布-订阅功能。
```js
const PublisherPrototype = {
    eventPool: {},
    
    // 订阅者调用该方法为 eventName 事件添加监听函数 handler
    listen (eventName, handler) {
        if ( !this.eventPool[eventName] ) {
            this.eventPool[eventName] = [];
        }
        // 将 handler 函数添加进 eventName 事件的监听函数列表里
        this.eventPool[eventName].push(handler);
    },

    // 通过调用 eventName 事件上注册的监听函数通知所有订阅该事件的订阅者
    trigger (eventName, ...args) {
        let handlers = this.eventPool[eventName];

        if ( !handlers || handlers.length === 0 ) {
            return false;
        }

        handlers.forEach(fn => {
            fn.call(this, ...args);
        });
    },

    // 移除 eventName 事件的监听函数 handler
    // 如果没有传 handler，则移除 eventName 事件的所有事件监听函数
    remove (eventName, handler) {
        // 该事件的监听函数列表
        let handlerList = this.eventPool[eventName];

        if ( !handlerList ) {
            return false;
        }
        if ( !handler ) { // 移除所有的事件监听函数
            handlerList.length = 0;
        }
        else { // 只移除事件监听函数 handler
            for (let i = handlerList.length - 1; i >= 0; i--) {
                let fn = handlerList[i];
                if ( fn === handler ){
                    handlerList.splice(i, 1);
                }
            }
        }
    },
};

const PublisherFactory = (obj) => {
    // 把实现发布者需要的属性和方法拷贝到 obj 上
    for ( let key in PublisherPrototype ) {
        // eventPool 属性必须要新建，否则所有 obj 的 eventPool 都会引用同一个对象
        if (key === "eventPool") {
            obj[key] = {};
        }
        else {
            obj[key] = PublisherPrototype[key];
        }
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

// subscriber1 和 subscriber2 都监听了 event1 事件
Publisher.listen('event1', subscriber1.ev1_cb);
Publisher.listen('event1', subscriber2.ev1_cb);
// subscriber1 还监听了 event2 事件
Publisher.listen('event2', subscriber1.ev2_cb);
```


## 全局的发布-订阅对象
1. 上面的通用实现，就是可以给任意一个对象添加发布-订阅的功能。就像 DOM 的事件机制一样，可以订阅不同节点类型的不同事件。
2. 但如果并不需要为每个对象定制特有的事件，而是只需要全局通用的事件，则只需要一个全局的发布-订阅机构来代理所有的事件订阅和发布。
3. 所有对象想发布的事件都注册到这个代理中介上，所以订阅者都来这个中介这里来订阅事件，只需要保证所有发布者的事件名都不重复即可。如果不同的发布者会用到相同的事件名，需要使用后面讲到的命名空间方案
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

    // 两个将要订阅事件的对象
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
    setTimeout(()=>{
        // publisher2 发布了 event1 事件
        publisher2.publish();
    }, 2222)
    ```


##  `once` 事件绑定
1. 例如 `EventAgency.once("ev", cb)`，当第一次 `ev` 事件触发并调用 `cb` 后，就自动删除 `ev` 事件回调列表里的 `cb` 函数，之后再触发 `ev` 事件，不会再调用 `cb` 函数。
2. 要实现这个功能，就需要在 `cb` 被调用后，使用 `remove` 移除 `cb`。所以这个移除操作，其实也算是事件回调的一部分。
3. 因此可以使用装饰器设计模式，包装一个新的回调 `wrappedCb`，这个回调会调用 `cb`，同时也会调用 `remove("ev", cb)`；`once` 方法内部实际的事件注册监听时使用 `wrappedCb` 而非 `cb` 作为回调，也就是 `on("ev", wrappedCb)`。
4. 还有一个问题，就是 `once` 注册后，我们应该允许在事件触发前主动移除该事件的回调，也就是主动从 `ev` 的事件列表里移除 `wrappedCb`。
5. 但显然用户只知道回调 `cb`，所以它调用 `remove` 时只能传 `cb` 而不能传 `wrappedCb`。因此，当用户调用 `remove("ev", cb)`，我们必须能根据 `cb` 找到 `wrappedCb`。
6. 除了使用映射关系将两者联系起来以外，更简单的方法是，把 `cb` 设置为 `wrappedCb` 的属性，例如设为 `wrappedCb.realCb = cb`。这样，当执行 `remove("ev", cb)`，我们遍历 `ev` 的每个回调 $cb_i$，除了检查 $cb_i$ 是否等于 `cb`，还要检查 $cb_i.realCb$ 是否等于 `cb`。
7. 注意是把 `cb` 设置为 `wrappedCb` 的属性，而不是 `cb.realCb = wrappedCb`。因为：
    * 你不应该随意更改外部对象；
    * `cb` 可能不止注册了一个事件的 `once` 监听。
8. 还有最后一个问题，如果用户同时通过 `on` 和 `once` 注册了 `"ev"` 事件的回调 `cb`，那当用户调用 `remove("ev", cb)` 时，应该全部移除，也就是移除回调列表里的 `cb` 和 `wrappedCb`。因此 `remove` 操作就应该遍历 `"ev"` 事件完整的回调列表，而不是只匹配到一个就结束。
9. 实现
    ```js
    const EventAgency = {
        assertEvName (evName) {
            if (typeof evName !== "string" || evName.length === 0) {
                throw new TypeError("evName must be a non-emtpy string.");
            }
        },
        assertCb (cb) {
            if (cb && typeof cb !== "function") {
                throw new TypeError("Optional cb must be a function.");
            }
        },

        events: {},

        on (evName, cb) {
            this.assertEvName(evName);
            this.assertCb(cb);
            if ( !this.events[evName] ) {
                this.events[evName] = [];
            }
            if ( this.events[evName].indexOf(cb) === -1 ) { // 不会重复添加
                this.events[evName].push(cb);
            }
        },

        emit (evName, ...data) {
            this.assertEvName(evName);
            if (this.events[evName]) {
                this.events[evName].forEach((cb) => {
                    cb(...data);
                });
            }
        },

        remove (evName, cb=undefined) {
            this.assertEvName(evName);
            this.assertCb(cb);
            if (this.events[evName]) {
                if (cb) {
                    let cbList = this.events[evName];
                    // 因为要删除，所以要反向遍历
                    for (let i=cbList.length-1; i>=0; i--) {
                        if ( cbList[i] === cb || cbList[i].realCb === cb ) {
                            cbList.splice(i, 1);
                        }
                    }
                }
                else {
                    this.events[evName] = []; // 不用删除事件。删除不仅没有必要，还影响性能。
                }
            }
        },

        once (evName, cb) {
            let wrappedCb = (...data) => {
                this.remove(evName, cb);
                cb(...data);
            }
            wrappedCb.realCb = cb;
            this.on(evName, wrappedCb);
        },
    };
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
    ```
    (anonymous)
    (anonymous)
    trigger
    toModule2
    (anonymous)
    ```
2. 能看懂的只有一个 `toModule2`。`trigger` 也能看懂是因为 `EventAgency` 以及里面的 `trigger` 方法就是我们自己刚刚编写的。
3. 而 `listenModule1` 更是直接丢失了，因为 `listenModule1` 是之前添加监听时调用的，根本不在这个事件循环里面。
4. 为了使调用栈更明确以下，我们不使用更习惯的匿名函数，而更麻烦的来定义具名函数
    ```js
    const module1 = {
        toModule2 (coordinate) {
            EventAgency.trigger('msgToModule2', coordinate);
        },
    };
    const module2 = {
        listenModule1 () {
            EventAgency.listen('msgToModule2', module2Listener); 
        },
    };
    function module2Listener (coordinate) {
        console.trace('发布订阅模式的调用栈');
        console.log(coordinate);
    }

    module2.listenModule1();

    window.addEventListener('click', clickCB);
    function clickCB (ev) {
        module1.toModule2({x: ev.clientX, y: ev.clientY});
    }
    ```
    调用栈如下。比刚才好理解了一些，不过还是要跳过其中的 `(anonymous)` 和 `trigger` 才能理解调用过程，调用者和被调用者被发布订阅模式分割开了
    ```
    module2Listener
    (anonymous)
    trigger
    toModule2
    clickCB	
    ```
5. 再看看直接调用模块方法的调用栈，可以看到调用者和被调用者的两个方法在栈里是挨在一起的
    ```sh
    listenCoordinate
    sendCoordinateToModule2
    (anonymous)
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
        const _listenOffline = (eventName, ...eventMessages) => {
            if ( offlineEventPool[eventName] ) {
                offlineEventPool[eventName].push(eventMessages);
            }
            else {
                offlineEventPool[eventName] = [eventMessages];
            }
        };

        // 触发离线事件，私有方法
        const _triggerOffline = (eventName, handler) => {
            offlineEventPool[eventName].forEach(msgs => {
                handler.call(this, ...msgs);
            });
            // 离线事件只触发一次
            delete offlineEventPool[eventName];
        };

        const listen = (eventName, handler) => {
            if ( offlineEventPool[eventName] ) {
                // 注册事件的时候，如果该事件再离线事件里，则直接触发
                _triggerOffline(eventName, handler);
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
                _listenOffline(eventName, ...eventMessages);
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
        console.log("");
        console.log('user3 打开 QQ ——————————————————————');
        // 接受发送给自己的消息，也就是监听 `sendMessageToUser3` 事件
        EventAgency.listen('user1ToUser3', user3.receiveMessageFromUser1); // 和 user1 的对话框
        EventAgency.listen('user2ToUser3', user3.receiveMessageFromUser2); // 和 user2 的对话框
    }, 2000);

    setTimeout(() =>{
        console.log("");
        console.log('user4 打开 QQ ——————————————————————');
        // 接受发送给自己的消息，也就是监听 `sendMessageToUser4` 事件
        EventAgency.listen('user1ToUser4', user4.receiveMessageFromUser1); // 和 user1 的对话框
    }, 4000);

    setTimeout(() =>{
        console.log("");
        console.log('user3 user4 提前打开 QQ 等待在线消息 ——————————————————————');
        // 离线事件已经发送，这里只是普通事件的注册，不会触发事件回调
        EventAgency.listen('user1ToUser3', user3.receiveMessageFromUser1);
        EventAgency.listen('user2ToUser3', user3.receiveMessageFromUser2);
        EventAgency.listen('user1ToUser4', user4.receiveMessageFromUser1);
    }, 6000);

    setTimeout(() =>{
        console.log("");
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


## 与其他模式的关系
### 中介者模式
见中介者模式


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoringguru.cn/design-patterns/observer)