# 自定义事件的实现

* 源码版本： 2.5.17
* 代码文件：core/instance/events.js


## 测试代码
```html
<div id="app">
    <child @myevent1="getEvent1" @myevent2="getEvent2"></child>
</div>
```
```js
new Vue({
    el: '#app',
    components: {
        child: {
            template: `<p></p>`,
            mounted(){
                this.$emit('myevent1');
                this.$emit('myevent2');
            },
        }
    },
    methods: {
        getEvent1(){
            console.log('--------------------------');
        },
        getEvent2(){
            console.log('--------------------------');
        },
    },
})
```


## 绑定事件源码分析
1. 源码函数如下
    ```js
    function initEvents (vm) {
    	// 这里创建 _events 属性来保存事件绑定
    	vm._events = Object.create(null);
    	vm._hasHookEvent = false;

    	// init parent attached events
    	var listeners = vm.$options._parentListeners;
    	// 根实例的该值为 undefined，子组件的该值为一个对象 {myevent1: ƒ, myevent2: ƒ}
        // 事件名对应事件处理函数。
    	console.log(listeners);

    	if (listeners) {
    		updateComponentListeners(vm, listeners);
    	}

    	if (listeners) {
    		console.log(vm._events); // {myevent1: Array(1), myevent2: Array(1)}
    	}
    }
    ```
2. 可以看出来，注册的事件名及其回调函数，以键值对的形式保存在`_events`属性里。一个事件
可以有若干个回调，保存为数组的形式。在[这里](https://forum.vuejs.org/t/render-functions-multiple-event-handlers-on-same-event-solved/13755)看到一个使用渲染函数注册多个事件处理函数的方法
    ```js
    on: {
      click: [handler1, handler2]
    }
    ```
3. `_events`是子组件实例的属性，而不是父组件的。虽然事件回调是父组件的方法。
4. `_events`里保存的事件回调并不是直接就是父组件的事件监听方法，而是经过包装过的。


## emit 事件源码分析
1. 源码函数如下
    ```js
    Vue.prototype.$emit = function (event) {
        // 子组件 emit 一个事件
        var vm = this;
        {
            var lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(
                    "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                    (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                    "Note that HTML attributes are case-insensitive and you cannot use " +
                    "v-on to listen to camelCase events when using in-DOM templates. " +
                    "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                );
            }
        }
        // 下面这一行，找到了该事件的回调函数。可以是多个
        var cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            var args = toArray(arguments, 1);
            for (var i = 0, l = cbs.length; i < l; i++) {
                try {
                    // 调用事件回调函数
                    cbs[i].apply(vm, args);
                } catch (e) {
                    handleError(e, vm, ("event handler for \"" + event + "\""));
                }
            }
        }
        return vm
    };
    ```
2. 以为之间的事件和回调都注册到了子组件的`_events`属性里，所以这里在 emit 一个事件的时
候，就能根据该事件名在`_events`对象里找到对应的回调，进行调用。
3. 之前我还不明白实例方法`vm.$on`为什么是监听自己的自定义事件而不是子组件的自定义事件，
因为模板里的写法给人的感觉就是父组件监听子组件的事件。现在再看就明白了，下面我自己实现的
一个自定义事件方法更明显。


## 自己实现自定义事件的对象间通信，及通信模式分析
```js
// 父组件提供事件回调函数
let parent = {
    getEvent1(n){
        console.log(n);
    },
    getEvent2(n){
        console.log(n);
    },
    getEvent2again(n){
        console.log(n);
    },
}

let child = {
    // 保存注册的事件和对应的回调函数
    _events: {},

    // 注册事件的方法
    // 参数为事件名和事件回调
    on(eventName, handler){
        // 如果还没有注册该事件，则为该事件新建一个数组，把当前时间回调存进去
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
child.on('myevent2', parent.getEvent2again);

child.emit('myevent1', 22);
child.emit('myevent2', 33);
// 22
// 33
// 33
```
