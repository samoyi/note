# Propagation


<!-- TOC -->

- [Propagation](#propagation)
    - [事件流](#事件流)
    - [相关事件属性](#相关事件属性)
        - [`ev.target` and `ev.currentTarget`](#evtarget-and-evcurrenttarget)
        - [`ev.eventPhase`](#eveventphase)
        - [`ev.bubbles`](#evbubbles)
    - [控制事件流](#控制事件流)
        - [`Event.stopPropagation()`](#eventstoppropagation)

<!-- /TOC -->


## 事件流
1. 尽管规范要求事件要从 `document` 对象开始传播，但不管是事件捕获还是事件冒泡的阶段，都包含 `window`。
2. 尽管规范要求捕获阶段不涉及事件目标，但各种浏览器都会在捕获阶段触发事件对象上的事件。结果就是有两个机会在目标对象上面操作事件。
3. 示例
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

    document.querySelector('div').addEventListener('click', function(){
        console.log('Bubbling div');
    }, false);

    document.body.addEventListener('click', function(){
        console.log('Bubbling body');
    }, false);

    document.addEventListener('click', function(){
        console.log('Bubbling document');
    }, false);

    window.addEventListener('click', function(){
        console.log('Bubbling window');
    }, false);
    ```
4. 点击 div 之后的输出是：
    ```
    Capturing window
    Capturing document
    Capturing body
    Capturing div
    Bubbling  div
    Bubbling  body
    Bubbling  document
    Bubbling  window
    ```
5. 如果点击其他区域，假设页面上没有其他元素，且没有设置 body 高度，那点击的对象就是 document，输出如下
    ```sh
    Capturing window
    Capturing document
    Bubbling document
    Bubbling window
    ```


## 相关事件属性
### `ev.target` and `ev.currentTarget`
1. 在一次事件中，事件发生的目标只能有一个。比如说一次点击，只可能点击在一个元素上，不可能同时穿透该元素点击其父级。虽然捕获和冒泡时会经过它的父级，但真实的事件目标是唯一的。
2. 而这个唯一的事件目标，可能并没有绑定事件监听。事件委托就是这种情况。
3. 当然，如果事件对象的父级绑定了点击事件，当事件流流到这个父级这里，就会这个父级的事件处理程序。
4. 这个父级事件处理程序中，事件对象的 `target` 属性，就是上面说的唯一的事件目标。
5. 这个父级事件对象的 `currentTarget`，其实就是指代它自身。所以是个没什么用处的属性，因为直接用 `this` 就行了。有了它反而会让人和 `target` 产生混淆。
6. 下面点击 body 里面的一个 div
    ```js
    document.body.addEventListener('click', function(ev){
        console.log(ev.target.nodeName); // DIV
        console.log(ev.currentTarget.nodeName); // BODY
        console.log(ev.currentTarget === this); // true
    }, true);
    ```
    事件绑定在 body 上，点击 div 后，触发了 body 的事件处理。因为点击是发生在 div 上，所以 `target` 是 div；因为事件是绑定在 body 上，所以 `currentTarget` 是 body。

### `ev.eventPhase`
1. 表明事件当前处于哪个阶段。调用事件处理程序的阶段：`1` 表示此事件处理发生在捕获阶段，`2` 表示在处于目标阶段，`3` 表示在冒泡阶段。
2. 还使用开始那个例子
    ```js
    window.addEventListener('click', function(ev){
        console.log('Capturing window');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, true);

    document.addEventListener('click', function(ev){
        console.log('Capturing document');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, true);

    document.body.addEventListener('click', function(ev){
        console.log('Capturing body');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, true);

    document.querySelector('div').addEventListener('click', function(ev){
        console.log('Capturing div');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, true);

    document.querySelector('div').addEventListener('click', function(ev){
        console.log('Bubbling div');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, false);

    document.body.addEventListener('click', function(ev){
        console.log('Bubbling body');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, false);

    document.addEventListener('click', function(ev){
        console.log('Bubbling document');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, false);

    window.addEventListener('click', function(ev){
        console.log('Bubbling window');
        console.log(ev.eventPhase);
        console.log('-------------');
    }, false);
    ```
3. 点击 div，输出如下
    ```
    Capturing window
    1
    -------------
    Capturing document
    1
    -------------
    Capturing body
    1
    -------------
    Capturing div
    2
    -------------
    Bubbling div
    2
    -------------
    Bubbling body
    3
    -------------
    Bubbling document
    3
    -------------
    Bubbling window
    3
    -------------
    ```
    因为 `target` 是 div，所以不管在它上面用捕获绑定还是冒泡绑定，事件发生时 `eventPhase` 都是处于目标阶段；而其他不是 `target` 的元素，则根据其在哪个阶段触发事件处理，`eventPhase` 是相应的值。
4. 同样如果再尝试点击 document，输出为
    ```
    Capturing window
    1
    -------------
    Capturing document
    1
    -------------
    Bubbling document
    3
    -------------
    Bubbling window
    3
    -------------
    ```
    因为这次的事件都不是直接发生在这两个对象上的，也就是说它俩都不是 `target`，所以它们的事件处理只可能是捕获阶段或冒泡阶段。

### `ev.bubbles`
1. 一个事件是否可冒泡。
2. 例如 `click` 事件是可冒泡的，但 `load` 事件就不是：
    ```js
    window.addEventListener('load', function(ev){
        console.log(ev.bubbles); // false
    });
    ```


## 控制事件流
### `Event.stopPropagation()`
1. 事件对象的 `stopPropagation` 方法可以终止上面事件流的传播。
2. 还是上面事件流的例子中，如果 Capturing body 所在的事件处理函数加上该方法
    ```js
    document.body.addEventListener('click', function(ev){
        ev.stopPropagation();
        console.log('Capturing body');
    }, true);
    ```
    最终的输出就只有前三个
    ```sh
    Capturing window
    Capturing document
    Capturing body
    ```
3. 如果 Bubbling body 所在的事件处理函数加上该方法
    ```js
    document.body.addEventListener('click', function(ev){
        console.log('Bubbling body');
        ev.stopPropagation();
    }, false);
    ```
    最终的输出就会变为
    ```sh
    Capturing window
    Capturing document
    Capturing body
    Capturing div
    Bubbling  div
    Bubbling  body
    ```
4. 但是注意，如果在 `ev.target` 的捕获阶段阻止事件传播，则该节点绑定在冒泡节点的事件依然可以触发。大概是因为事件确实已经传播到该节点了
    ```js
    document.querySelector('div').addEventListener('click', function(ev){
        ev.stopPropagation();
        console.log('Capturing div');
    }, true);
    ```
    最终的输出为
    ```sh
    Capturing window
    Capturing document
    Capturing body
    Capturing div
    Bubbling  div
    ```