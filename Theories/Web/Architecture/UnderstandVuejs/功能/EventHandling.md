# Event Handling


## 从事件绑定来看 DOM 和 MVVM 的风格差异
1. 在使用原生 JS 时，在 HTML 里绑定事件处理程序显然是不符合 separation of concerns
规范的。
2. DOM 风格中，JS 把 HTML 看成一个被动被操作的对象（DOM），JS 会对这个对象执行各种各样
的操作。核心的思路是 **操作文档**。
3. 而在 MVVM 风格中，JS 所在的 ViewModel 尽量的不关心文档，只关心数据。ViewModel 的理
想就是只 **操作数据**，至于这些数据会对文档造成什么影响，那都交给包括事件绑定在内的各种
指令去处理。
4. 指令接触文档，ViewModel 只接触数据。ViewModel 的事件处理函数也不关心到底发生了什么
事件（事件名）、以怎样的形式（事件修饰符）发生，事件对于 ViewModel 来说只是单纯的数据输
入。


## 参数
1. 因为很多时候参数都可以从实例中获得，所以事件处理函数很多时候没有传参的必要。但可能这
时还是需要一个参数，就是事件对象。如果事件处理函数不实际传参，则和 JS 的事件绑定一样，第
一个形参就是事件对象
    ```html
    <div id="components-demo" @click.prevent="say">
        111
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        methods: {
            say(ev){
                console.log(ev.defaultPrevented); // true
            },
        },
    });
    ```
2. 当然也可以传其他参数，而且这在父子组件通信是很必要的。如果在调用时传递了其他参数，那
显然第一个形参就不再对应事件对象了，这时就必须通过实参`$event`来显式的传递事件对象
    ```html
    <div id="components-demo" @click.prevent="say('hi', $event)">
        111
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        methods: {
            say(sth, ev){
                console.log(sth); // "hi"
                console.log(ev.defaultPrevented); // true
            }
        },
    });
```


## Modifiers
在事件处理程序中调用`event.preventDefault()`或`event.stopPropagation()`是非常常见的
需求。尽管我们可以在方法中轻松实现这点，**但更好的方式是：方法只有纯粹的数据逻辑，而不
是去处理 DOM 事件细节**。所以通过一下几个修饰符，使得本来需要在实例方法里做的工作现在可
以放在模板里。

### `.stop`
`ev.stopPropagation()`
```html
<div id="components-demo" @click="say('div')">
    <p @click.stop="say('p')">111</p>
</div>
```
事件在`p`上就会停止，不会冒泡触发`div`上的事件监听

### `.prevent`
`ev.preventDefault()`
```html
<div id="components-demo">
    <form id="form" action="https://www.douban.com" method="GET">
        <input type="submit" @click.prevent="say('hi')" />
    </form>
</div>
```
点击后不会跳转

### `.capture`
`el.addEventListener('click', handler, true)`
```html
<div id="components-demo" @click.capture="say('div')">
    <p @click="say('p')">111</p>
</div>
```
先打印`"div"`后打印`"p"`

### `.self`
`if (ev.target === ev.currentTarget)`
```html
<div id="components-demo" @click.self="say('div')">
    222
    <p>111</p>
</div>
```
点击“111”不会触发，只有点击“222”才行

### `.passive`
`el.addEventListener('click', handler, {passive: true})`
```html
<div id="components-demo" @click.passive="say('div', $event)">
    222
</div>
```
```js
methods: {
    say(sth, ev){
        ev.preventDefault(); // Unable to preventDefault inside passive event listener invocation.
    }
},
```
以及`<div @click.passive.prevent="say()"></div>`会导致 Vue 报错


### `.once`
* `el.addEventListener('click', handler, {once: true})`
* 与其他修饰符只能对原生 DOM 事件有效不同，`.once`修饰符还能被用到自定义的组件事件上。
其他几个显然对于组件事件也是没有意义的。
```html
<div id="components-demo" @click.once="say('div')">
    222
</div>
```


## 按键和鼠标事件修饰符
用的时候直接查[文档](https://vuejs.org/v2/guide/events.html#Key-Modifiers)吧
