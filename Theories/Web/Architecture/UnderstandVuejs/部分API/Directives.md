# Directives


<!-- TOC -->

- [Directives](#directives)
    - [`v-bind`](#v-bind)
        - [Modifiers](#modifiers)
            - [`.prop`](#prop)
            - [`.camel`](#camel)
    - [`v-html`](#v-html)
    - [`v-on`](#v-on)
    - [`v-pre`](#v-pre)
    - [`v-cloak`](#v-cloak)

<!-- /TOC -->


## `v-bind`
Dynamically bind one or more attributes, or a component prop to an expression.
```html
<div id="components-demo" :class="className">
</div>
```
```js
const vm = new Vue({
    el: '#components-demo',
    data: {
        className: '123',
    },
});

let demo = document.querySelector('#components-demo');
console.log(demo.class); // undefined
for (let val of demo.attributes){ // 可以遍历到 id 和 class
    console.log(val);
}
```

### Modifiers
#### `.prop`
Bind as a DOM property instead of an attribute
    ```html
    <div id="components-demo" :class.prop="className">
    </div>
    ```
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            className: '123',
        },
    });

    let demo = document.querySelector('#components-demo');
    console.log(demo.class); // 123
    for (let val of demo.attributes){ // 只能遍历到 id
        console.log(val);
    }
    ```

#### `.camel`
transform the kebab-case attribute name into camelCase. 不懂怎么用


## `v-html`
1. 在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。
* 虽然根据 [规范](https://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0)，通过 `innerHTML` 插入的 `<script>` 不会被执行，但还是可以通过插入 `<img>` 来执行脚本：
    ```js
    document.body.innerHTML = '<img src="x" onerror="alert(666)" />';
    ```
3. 只在可信内容上使用 `v-html`，永远不要用在用户提交的内容上。


## `v-on`
1. 如果按照常规的事件绑定的写法，类似于把函数赋值给事件属性或作为 `addEventListener` 的参数：
    ```html
    <input id="app" type="button" @click="greet" />
    ```
2. 则 `greet` 作为事件处理程序，它只接收一个参数，即事件对象。效果如下：
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
3. 但如果把函数调用而非函数本身赋值给 `@click` 的话，与在 JS 中的语法有所不同。在 JS 中如果要把函数调用赋值给事件属性或将其作为 `addEventListener` 的参数，该事件调用必须要返回一个合理的 [`EventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventListener)
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
4. 如果 Vue 也按照 JS 的写法，应该是这样的：
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
5. 按照 JS 的思路，应该是 mounted 之后就会立即执行 `greet` 并打印出 `2233`。实际上并没有，而是在点击按钮之后才打印出 `2233`，而且也仅有 `2233` 被打印出。
6. Vue 中的实际的写法是这样的：
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
直观的看起来似乎是直接把事件处理函数本身的调用结果作为实际的事件处理函数，然而实际上并不是。  
7. TODO：需要确认源码。这里先推测一下 Vue 内部的处理方法：
    1. 使用一个新的函数 `foo` 作为事件处理程序，事件发生后，`foo` 被调用，在其内部获得
       了事件对象
    2. 将事件对象赋值给 `$event`，然后再调用 `greet`，并将 `$event` 作为参数传入。


## `v-pre`
1. 跳过这个元素和它的子元素的编译过程，忽略 vue 指令和 Mustache 语法。
2. `<p v-if="message" v-pre>{{ message }}</p>` 被渲染为
    ```html
    <p v-if="message">{{ message }}</p>
    ```
    `<p v-for="n in 5" v-pre>{{ n }}</p>` 被渲染为
    ```html
    <p v-for="n in 5">{{ n }}</p>
    ```


## `v-cloak`
1. 这个指令保持在元素上直到关联实例结束编译。
2. 和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。
    ```css
    [v-cloak] {
        display: none;
    }
    ```
    ```html
    <div id="app" v-cloak>
        {{name}}
    </div>
    ```
    ```js
    new Vue({
        el: '#app',
        data: {
            name: '33',
        },
    });
    ```
3. 不懂，还有什么用