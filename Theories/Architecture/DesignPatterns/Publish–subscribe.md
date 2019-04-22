# Publish–subscribe


## 实现目的
在发生某个事件时，做出某些反应。


## 本质
### 不同角色的划分
1. 监听事件发生的和做出反应的不是同一个角色。
2. 如果是同一个，只需要自己监听并自己做出反应，不存在什么问题。
3. 如果是两个角色，即有监听者和反应者，则会出现四种处理方式：
  * 反应者把事件发生后要做的事情告诉监听者，监听事件的角色在事件发生后替反应者做出某种反应。这是反应者把任务传递给了监听者。
  * 反应者提供给监听者一个通知机制，比如留下电话，监听者在获得事件发生的消息后，使用通知机制通知反应者，反应者自己做出反应。这是监听者把消息传递给了反应者。
  * 监听者在事件发生后，会进行广播，因此反应者要一直监听广播，等待事件发生的消息。
  * 反应者不断轮询监听者，查看是否事件已发生。
4. 后两种方法因为涉及很多次无意义的监听查询，一般情况下效率相比前两者低。Publish–subscribe 模式和前两种有关。

### 前两种处理方式本质上相同
1. 可以看到，都是反应者要事先提供给监听者某种东西，只不过一个是具体的任务，一个是通知机制。
2. 而这个通知机制也可以认为是具体任务的一个预任务，预任务在被监听者执行后，也会触发反应者执行具体的任务。可以说第二种方式是将实际的任务分成了两部分，而将第一步的导火索任务交给了监听者。
3. 所以说，这都是要事先给监听者传递某个任务的，只不过是具体任务和预任务的区别。

### Publish–subscribe 模式解决的实质问题
1. 也许因为传递具体任务不方便，比如具体任务太大无法高效传递，所以只能传递通知机制给监听者，这样会更加高效。
2. 但这并不是 Publish–subscribe 模式要解决的问题，这个模式并不是要减小传递给监听者的任务，而是要改变传递任务的方式。

### 两种传递任务的方式
* 第一种：在构建监听者的时候，就传递好所有的任务，构建完监听者之后无法再添加新的任务。简单粗暴，但不灵活。
* 第二种：在监听者构建完成后，也可以动态的添加任务。显然这种更好。
  ```js
  let callbacks = [];

  function subscribe (fn) {
    callbacks.push(fn);
  }

  window.addEventListener('click', function(){
    callbacks.forEach((fn) => {
      fn();
    });
  });

  subscribe(()=>{console.log(1)});
  subscribe(()=>{console.log(2)});
  subscribe(()=>{console.log(3)});
  ```

### 如何动态添加任务
1. 一种不好的方式是，每次添加新的任务时，都需要监听者进行某些配合。可以想象，一个人正在干活，然后不停的有人过来给他说：“等你这个完成了，就打这个电话通知一下我”，然后监听者就停下来在他的手机里记上这个电话。这样在每次添加新任务时，监听者都会被打断，也就是说监听者需要做一些事情来配合新任务的添加。
  ```js
  let obj1 = {
    listen () {
      window.addEventListener('click', function(){
        obj2.log1();
        obj2.log2();
      });
    },
  };

  let obj2 = {
    log1 () {
      console.log(1);
    },
    log2 () {
      console.log(2);
    },
    log3 () {
      console.log(31);
    },
  };

  obj1.listen();
  ```
  这种模式下，如果`obj2`想再添加`log3`任务，则`obj1`还要修改自己。
2. 另一种方式是，监听者设置一个可以让执行者自行添加任务的机制。例如，这个人在门外挂一个输入器，来添加任务的人不需要敲门，就可以直接输入任务。在这种情况下，添加新任务并不需要监听者配合。
  ```js
  let obj2 = {
    log1 () {
      console.log(1);
    },
    log2 () {
      console.log(2);
    },
    log3 () {
      console.log(3);
    },
  };

  let obj1 = {
    callbacks: [
      obj2.log1,
      obj2.log2,
    ],

    subscribe (cb) {
      this.callbacks.push(cb);
    },

    listen () {
      window.addEventListener('click', () => {
        this.callbacks.forEach((cb) => {
          cb();
        });
      });
    },
  };

  obj1.listen();
  obj1.subscribe(obj2.log3);
  ```
  这种模式下，添加`log3`任务，`obj1`什么也不用干。

### 本质思想
解耦。后续需要动态变化的不应该影响核心部分，也不需要核心部分去配合变动。


## 通用实现
```js
const event = {
    clientList: [],

    listen ( key, fn ) {
        if ( !this.clientList[ key ] ) {
            this.clientList[ key ] = [];
        }
        this.clientList[ key ].push( fn );    // 订阅的消息添加进缓存列表
    },

    trigger () {
        var key = Array.prototype.shift.call( arguments ),    // (1);
            fns = this.clientList[ key ];

        if ( !fns || fns.length === 0 ){    // 如果没有绑定对应的消息
            return false;
        }

        for( var i = 0, fn; fn = fns[ i++ ]; ){
            fn.apply( this, arguments );    // (2) // arguments 是trigger时带上的参数
        }
    },

    remove ( key, fn ) {
        var fns = this.clientList[ key ];

        if ( !fns ){    // 如果key对应的消息没有被人订阅，则直接返回
            return false;
        }
        if ( !fn ){    // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
            fns && ( fns.length = 0 );
        }
        else {
            for ( var l = fns.length - 1; l >=0; l-- ){    // 反向遍历订阅的回调函数列表
                var _fn = fns[ l ];
                if ( _fn === fn ){
                    fns.splice( l, 1 );    // 删除订阅者的回调函数
                }
            }
        }
    },
};

const installEvent = function ( obj ) {
    for ( var i in event ) {
        obj[ i ] = event[ i ];
    }
};


const Publisher = {};
installEvent(Publisher);

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
1. 上面的通用实现，就是可以给任意一个对象添加订阅发布的功能。
2. 全局的模式下，并不需要给每一个具体的对象添加各自的发布-订阅机制，只需要一个全局的发布-订阅机构来代理所有的事件订阅和发布。
3. 所有对象想发布的事件都注册到这个代理中介上，所以订阅者都来这个中介这里来订阅事件，只需要保证所有发布者的事件名都不重复即可。如果不同的发布者会用到相同的事件名，需要使用后面讲到的命名空间方案。

```js
const Event = (function(){

    let clientList = {},
        listen,
        trigger,
        remove;

    listen = function ( key, fn ) {
        if ( !clientList[ key ] ) {
            clientList[ key ] = [];
        }
        clientList[ key ].push( fn );
    };

    trigger = function () {
        let key = Array.prototype.shift.call( arguments ),
        fns = clientList[ key ];
        if ( !fns || fns.length === 0 ){
            return false;
        }
        for( let i = 0, fn; fn = fns[ i++ ]; ){
            fn.apply( this, arguments );
        }

    };

    remove = function ( key, fn ) {
        let fns = clientList[ key ];
        if ( !fns ){
            return false;
        }
        if ( !fn ){
            fns && ( fns.length = 0 );
        }
        else{
            for ( let l = fns.length - 1; l >=0; l-- ){
                let _fn = fns[ l ];
                if ( _fn === fn ){
                    fns.splice( l, 1 );
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
Event.listen('event1', subscriber1.ev1_cb);
Event.listen('event1', subscriber2.ev1_cb);
Event.listen('event2', subscriber1.ev2_cb);

// 两个发布事件的对象
const publisher1 = {
    publish () {
        Event.trigger('event1', 'publisher1 event1');
        Event.trigger('event2', 'publisher1 event2');
    }
};
const publisher2 = {
    publish () {
        Event.trigger('event1', 'publisher2 event1');
    }
};

// publisher1 发布了 event1 和 event2 事件
publisher1.publish();
// publisher2 发布了 event1 事件
publisher2.publish();
```


## 模块间通信
1. A模块通过订阅B模块发布的事件，实现从B模块到A模块的信息传递
    ```js
    const module1 = {
        toModule2 (coordinate) {
            Event.trigger('msgToModule2', coordinate);
        },
    };
    const module2 = {
        listenModule1 () {
            Event.listen('msgToModule2', function (coordinate) {
                console.log(coordinate);
            });
        },
    };

    module2.listenModule1();
    window.addEventListener('click', function (ev) {
        module1.toModule2({x: ev.clientX, y: ev.clientY});
    });
    ```
2. 模块之间如果用了太多的全局发布—订阅模式来通信，那么模块与模块之间的联系就被隐藏到了背后。我们最终会搞不清楚消息来自哪个模块，或者消息会流向哪些模块，这又会给我们的维护带来一些麻烦，也许某个模块的作用就是暴露一些接口给其他模块调用。


## 离线事件和命名空间
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
