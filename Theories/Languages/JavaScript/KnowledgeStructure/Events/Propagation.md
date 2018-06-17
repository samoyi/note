# Propagation

## Propagation
* 尽管规范要求事件要从 `document` 对象开始传播，但不管是事件捕获还是事件冒泡的阶段，都
包含 `window`
* 尽管规范要求捕获阶段不涉及事件目标，但各种浏览器都会在捕获阶段触发事件对象上的事件。
结果就是有两个机会在目标对象上面操作事件。

```html
<body>
    <div>d</div>
</body>
```

```js
window.addEventListener('click', function(){
    console.log('Capturing window');
}, true);

document.addEventListener('click', function(){
    console.log('Capturing document');
}, true);

document.body.addEventListener('click', function(){
    console.log('Capturing body');
}, true);

document.querySelector('div').addEventListener('click', function(){
    console.log('Capturing div');
}, true);

window.addEventListener('click', function(){
    console.log('Bubbling  window');
}, false);

document.addEventListener('click', function(){
    console.log('Bubbling  document');
}, false);

document.body.addEventListener('click', function(){
    console.log('Bubbling  body');
}, false);

document.querySelector('div').addEventListener('click', function(){
    console.log('Bubbling  div');
}, false);
```

点击 div 之后的输出是：
```shell
Capturing window
Capturing document
Capturing body
Capturing div
Bubbling  div
Bubbling  body
Bubbling  document
Bubbling  window
```

## 相关事件属性
### `ev.target` and `ev.currentTarget`
在一次事件中，触发事件的对象只有一个；事件触发后的传播过程中，事件会流经不同的对象。触发
事件的对象是 `ev.target`，事件流当前所处的对象是 `ev.currentTarget`。在上例中，改变一
个事件监听如下，可以看出二者的不同：
```js
document.body.addEventListener('click', function(ev){
    console.log(ev.target.nodeName); // DIV
    console.log(ev.currentTarget.nodeName); // BODY
    console.log(ev.currentTarget === this); // true
}, true);
```

### `ev.eventPhase`
事件当前处于哪个阶段：调用事件处理程序的阶段：`1` 表示此事件处理发生在捕获阶段，`2` 表
示在处于目标阶段，`3` 表示在冒泡阶段。

### `ev.bubbles`
一个事件是否可冒泡。
例如 `click` 事件是可冒泡的，但 `load` 事件就不是：
```js
window.addEventListener('load', function(ev){
    console.log(ev.bubbles); // false
});
```
