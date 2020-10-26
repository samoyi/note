# Custom Events


<!-- TOC -->

- [Custom Events](#custom-events)
    - [相关信息](#相关信息)
    - [设计思想](#设计思想)
    - [本质](#本质)
    - [解除绑定](#解除绑定)
    - [Hooks as Events](#hooks-as-events)
        - [Registering Hooks Dynamically](#registering-hooks-dynamically)
    - [自己实现的一个自定义事件的对象间通信](#自己实现的一个自定义事件的对象间通信)

<!-- /TOC -->


## 相关信息
* 源码版本：2.5.21
* 文件路径 | `src/core/instance/events.js`


## 设计思想


## 本质


## 解除绑定
注意这里只要找到一个就会跳出，所以给同一个事件多次绑定了同一个回调，或者分别进行了 `$on` 绑定和 `$once` 绑定，则一次 `$off` 只能解除一个回调。
```js
created(){
    this.$on('from-child1', this.handler1);
    this.$on('from-child1', this.handler1);
    this.$on('from-child2', this.handler2);
    this.$once('from-child2', this.handler2);
},
mounted(){
    this.$off('from-child1', this.handler1);
    this.$off('from-child2', this.handler2);
    this.$emit('from-child1');
    this.$emit('from-child2');
},
methods: {
    handler1(){
        console.log('handler1');
    },
    handler2(){
        console.log('handler2');
    },
},
```
因为只 `$off` 了一遍删除了相同回调中的一个，所以仍然会保留一次回调调用


## Hooks as Events
1. 生命周期钩子函数也会 emit 自定义事件，参考 [这篇文章](https://alligator.io/vuejs/component-event-hooks/)。
2. Vue’s lifecycle hooks emit custom events with the name of the hook itself, prefixed by `hook:`. For example, the `mounted` hook will emit a `hook:mounted` event
    ```html
    <div id="app">
        <child @hook:mounted="handleChildMounted"/></child>
    </div>
    ```
    ```js
    new Vue({
        el: '#app',
        components: {
            child: {
                template: `<p>{{age}}</p>`,
                data(){
                    return {
                        age: 22,
                    };
                },
            },
        },

        methods: {
            handleChildMounted () {
                console.log('child mounted');
            },
        },
    });
    ```
3. That can be useful as well to react to third-party plugins hooks. For instance, if you want to perform an action when [v-runtime-template](https://github.com/alexjoverm/v-runtime-template) finishes rendering the template, you could use the `@hook:updated` event:
    ```vue
    <template>
        <v-runtime-template @hook:updated="doSomething" :template="template"/>
    </template>
    ```

### Registering Hooks Dynamically
```js
new Vue({
    el: '#app',
    components: {
        child: {
        template: `<p>{{age}}</p>`,
        data(){
            return {
                age: 22,
            };
        },
        beforeCreate(){
            console.log('beforeCreate');

            this.$on('hook:beforeCreate', ()=>{
                console.log('hook:beforeCreate');
            });
            this.$on('hook:created', ()=>{
                console.log('hook:created');
            });
            this.$on('hook:beforeMount', ()=>{
                console.log('hook:beforeMount');
            });
            this.$on('hook:mounted', ()=>{
                console.log('hook:mounted');
            });
            this.$on('hook:beforeUpdate', ()=>{
                console.log('hook:beforeUpdate');
            });
            this.$on('hook:updated', ()=>{
                console.log('hook:updated');
            });
            this.$on('hook:beforeDestroy', ()=>{
                console.log('hook:beforeDestroy');
            });
            this.$on('hook:destroyed', ()=>{
                console.log('hook:destroyed');
            });
        },
        created(){
            console.log('created');
        },
        beforeMount(){
            console.log('beforeMount');
        },
        mounted(){
            console.log('mounted');

            this.age = 33;

            this.$nextTick(()=>{
                this.$destroy();
            });
        },
        beforeUpdate(){
            console.log('beforeUpdate');
        },
        updated(){
            console.log('updated');
        },
        beforeDestroy(){
            console.log('beforeDestroy');
        },
        destroyed(){
            console.log('destroyed');
        },
        },
    },
});
```
输出为：
```shell
beforeCreate
hook:beforeCreate
created
hook:created
beforeMount
hook:beforeMount
mounted
hook:mounted
beforeUpdate
hook:beforeUpdate
updated
hook:updated
beforeDestroy
hook:beforeDestroy
destroyed
hook:destroyed
```


## 自己实现的一个自定义事件的对象间通信
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
    on( eventName, handler ){
        // 如果还没有注册该事件，则为该事件新建一个数组，把当前事件回调存进去
        if ( !this._events[eventName] ) {
            this._events[eventName] = [handler];
        }
        // 如果已经注册过该事件，则把新的回调保存到回调数组里
        else {
            this._events[eventName].push(handler);
        }
    },

    // emit 事件
    // 指定要 emit 的事件名及参数
    emit( eventName, n ){
        // 找到该事件的所有回调，分别传参调用
        this._events[eventName].forEach( fn=>fn(n) );
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
