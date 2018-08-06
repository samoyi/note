# Directives

## 作用
1. 只有 Model 和 ViewModel 实例，没办法直接操作 HTML，因为它们和 HTML 是没有发生联系
的，必须要提供一套联系的接口。
2. 各种指令就是接口。当 Vue 编译 HTML 模板时，各种节点中的指令将告诉 Vue 该如何处理该
节点。
3. 比如 `v-for` 指令告诉 Vue 要循环该节点，`v-if` 指令告诉 Vue 要根据变量的布尔值来决
定是否渲染该节点，`{{}}` 指令告诉 Vue 要把其中的变量替换为变量值。


## Custom Directives
1. 自定义一个指令，告诉 Vue 在 **什么时间** 对一个节点做 **哪些事情**。
2. **什么时间** 就是钩子函数的函数名，**哪些事情** 就是钩子函数的函数体。


## 一些需要注意的指令
### `v-on`
1. 如果按照常规的事件绑定的写法，类似于把函数赋值给事件属性或作为 `addEventListener`
的参数：
```html
<input id="app" type="button" @click="greet" />
```
则 `greet` 作为事件处理程序，它只接收一个参数，即事件对象。效果如下：
```js
new Vue({
    el: '#app',
    methods: {
        greet(msg, ev){
            console.log(msg); // MouseEvent
            console.log(ev); // undefined
        },
    },
});
```
2. 但如果把函数调用而非函数本身赋值给 `@click` 的话，与在 JS 中的语法有所不同。在 JS
中如果要把函数调用赋值给事件属性或将其作为 `addEventListener` 的参数，该事件调用必须要
返回一个合理的 [`EventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventListener)
```js
function handler(msg){
    return (ev)=>{
        console.log(ev); // MouseEvent
        console.log(msg);  // “hello”
    };
    // 或
    // return {
    //     handleEvent(ev) {
    //         console.log(ev); // MouseEvent
    //         console.log(msg);  // “hello”
    //     }
    // };
}
document.addEventListener('click', handler('hello'));
```
实际上 `handler` 的返回值才是真正的事件处理程序。
3. 如果 Vue 也按照 JS 的写法，应该是这样的：
```html
<input id="app" type="button" @click="greet('hello')" />
```
```js
new Vue({
    el: '#app',
    methods: {
        greet(msg){
            console.log(2233);
            return (ev)=>{
                console.log(msg);
                console.log(ev);
            };
        },
    },
});
```
按照 JS 的思路，应该是 mounted 之后就会立即执行`greet`并打印出`2233`。实际上并没有，而
是在点击按钮之后才打印出 `2233`，而且也仅有 `2233`被打印出。
4. Vue 中的实际的写法是这样的：
```html
<input id="app" type="button" @click="greet('hello', $event)" />
```
```js
new Vue({
    el: '#app',
    methods: {
        greet(msg, ev){
            console.log(msg); // “hello”
            console.log(ev); // MouseEvent
        },
    },
});
```
直观的看起来似乎是直接把事件处理函数本身的调用结果作为实际的事件处理函数，然而实际上
并不是。  
TODO：需要确认源码。这里先推测一下 Vue 内部的处理方法：
    1. 使用一个新的函数 `foo` 作为事件处理程序，事件发生后，`foo` 被调用，在其内部获得
       了事件对象
    2. 将事件对象赋值给`$event`，然后再调用`greet`，并将`$event`作为参数传入。
