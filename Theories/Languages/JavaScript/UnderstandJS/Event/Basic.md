# Basic


<!-- TOC -->

- [Basic](#basic)
    - [事件监听的本质](#事件监听的本质)

<!-- /TOC -->


## 事件监听的本质
1. 从最本质来说，就是：如果一个对象 A 上面发生了什么事情，那么就会把这个情况通知到需要了解的对象 B。
2. B 对象可以有两种情况获取到通知：
    * 如果发生了变化，有某种通知机制通知到 B 对象。JS 的事件监听就是这种方法。
    * 它一直在观察是否发生了变化：比如一直在轮询监听。其实这种方法才是真正意义上的监听。
3. JS 的事件监听中，所谓的 “某种通知机制”，就是通过事件处理函数。也就是说，给 A 对象提供一个函数，让它在发生了某个事件的时候调用这个函数即可。
4. 注意这里的事件监听的元素：函数、某个事件。其实就是事件处理函数和事件名。只要给一个对象提供这两个要素，就能实现该对象发生变动时通知到外部。
5. JS 的原生事件是这样实现的，Vue 的自定义事件也是这样实现的
    ```js
    // 父组件提供事件回调函数
    let parent = {
        getEvent1(n){
            console.log(n);
        },
        getEvent2(n){
            console.log(n);
        },
        getEvent2Again(n){
            console.log(n);
        },
    }

    let child = {
        // 保存注册的事件和对应的回调函数
        _events: {},

        // 注册事件的方法
        // 参数为事件名和事件回调
        on(eventName, handler){
            // 如果还没有注册该事件，则为该事件新建一个数组，把当前事件回调存进去
            if (!this._events[eventName]){
                this._events[eventName] = [handler];
            }
            // 如果已经注册过该事件，则把新的回调保存到回调数组里
            else {
                this._events[eventName].push(handler);
            }
        },

        // emit 事件
        // 指定要 emit 的事件名及参数
        emit(eventName, n){
            // 找到该事件的所有回调，分别传参调用
            this._events[eventName].forEach(fn=>fn(n));
        },
    };

    child.on('myevent1', parent.getEvent1);
    child.on('myevent2', parent.getEvent2);
    child.on('myevent2', parent.getEvent2Again);

    child.emit('myevent1', 22);
    child.emit('myevent2', 33);
    // 22
    // 33
    // 33
    ```
