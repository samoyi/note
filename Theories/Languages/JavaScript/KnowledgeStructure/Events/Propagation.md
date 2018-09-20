# Propagation

## Propagation
* 尽管规范要求事件要从 `document` 对象开始传播，但不管是事件捕获还是事件冒泡的阶段，都
包含`window`
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
1. 在一次事件中，事件发生的目标只能有一个。比如说一次点击，只可能点击在一个元素上，不可
能同时穿透该元素点击其父级。虽然捕获和冒泡时会经过它的父级，但真实的事件目标是唯一的。
2. 而这个唯一的事件目标，可能并没有绑定事件监听。事件委托就是这种情况。
3. 当然，如果事件对象的父级绑定了点击事件，当事件流流到这个父级这里，就会这个父级的事件
处理程序。
4. 这个父级事件处理程序中，事件对象的`target`属性，就是上面说的唯一的事件目标。
5. 这个父级事件对象的`currentTarget`，其实就是指代它自身。所以是个没什么用处的属性，因
为直接用`this`就行了。有了它反而会让人和`target`产生混淆。
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
