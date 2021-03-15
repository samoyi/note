# Memory Leaks


<!-- TOC -->

- [Memory Leaks](#memory-leaks)
    - [内存泄露的四种类型](#内存泄露的四种类型)
    - [Accidental global variables](#accidental-global-variables)
    - [Forgotten intervals or callbacks](#forgotten-intervals-or-callbacks)
        - [Forgotten intervals](#forgotten-intervals)
        - [Forgotten callbacks](#forgotten-callbacks)
    - [`removeChild` 或 `replaceChild` 节点之后没有清空对其引用](#removechild-或-replacechild-节点之后没有清空对其引用)
    - [Closures](#closures)
        - [所有的内部函数会共享闭包——返回函数不引用数据也可能导致内存泄露的情况](#所有的内部函数会共享闭包返回函数不引用数据也可能导致内存泄露的情况)
    - [其他的内存不良使用情况](#其他的内存不良使用情况)
        - [内存膨胀](#内存膨胀)
        - [频繁的垃圾回收](#频繁的垃圾回收)
    - [References](#references)

<!-- /TOC -->


## 内存泄露的四种类型
The four types of common JavaScript leaks:
* Accidental global variables
* Forgotten timers or callbacks
* Out of DOM references
* Closures


## Accidental global variables
1. 如果不使用严格模式，函数内部不使用 `var`/`let`/`const` 声明的变量和 `this` 都会成为全局变量，全局变量的内存不会被回收。
2. If you must use a global variable to store data, make sure to null it or reassign it after you are done with it.
3. One common cause for increased memory consumption in connection with globals are **caches**. Caches must have an upper bound for its size. Caches that grow unbounded can result in high memory consumption because their contents cannot be collected.


## Forgotten intervals or callbacks
### Forgotten intervals
```js
const serverData = loadData();
setInterval(function() {
    var renderer = document.getElementById('renderer');
    if(renderer) {
        renderer.innerHTML = JSON.stringify(serverData);
    }
}, 5000);
```
1. 假设元素 `#renderer` 被永久移除了，那这个 interval 就变得没有意义，应当停止。
2. 但如果没有停止，`setInterval` 的回调就会一直执行，它就会一直占用内存。
3. 而且，回调内部引用了 `serverData`。这样即使 `serverData` 在其他地方已经没用了，仍然得不到回收，因为回调函数一直在无意义的引用它。

### Forgotten callbacks
```js
let element = document.getElementById('button');

function onClick(event) {
   element.innerHtml = 'text ' + Math.random();
}
element.addEventListener('click', onClick);

element.parentNode.removeChild(element);
```
1. 事件监听监听了 `element` 的点击事件，但如果之后 `element` 被移除了，这个引用了 `element` 的事件监听就没有用了。
2. 因此需要解除这个事件监听。不过现代浏览器可以自动识别事件监听的对象已经无法访问了，进而自动解除该事件监听。
3. 所以实际中 `removeChild` 之后不需要手动 `removeEventListener`，但仍然需要知道是浏览器帮我们解除了监听，进而防止了内存泄露。


## `removeChild` 或 `replaceChild` 节点之后没有清空对其引用
```js
let node = document.querySelector("#node");
node.parentNode.removeChild( node );
console.log( document.querySelector("#node") ); // null
console.log( node ); // <div id="node"></div>
console.log( Object.prototype.toString.call(node) ); // [object HTMLDivElement]
```
1. 一个 HTML 元素可以被 DOM 引用：`document.querySelector("#node")`
2. 之后可以间接的被 JS 变量引用：`node = document.querySelector("#node")`
3. `removeChild` 或 `replaceChild` 会通过 DOM 删除元素，但 JS 已经为其分配的内存和值并不能自动被删除。


## Closures
1. 考虑下面的代码
    ```js
    function foo(){  
        var temp_object = new Object()
        temp_object.x = 1
        temp_object.y = 2
        temp_object.array = new Array(10000000)
        return function(){
            console.log(temp_object.x);
        }
    }
    ```
2. 由于返回的匿名函数引用了 `foo` 函数中的 `temp_object.x`，这会造成 `temp_object` 无法被销毁，即便只是引用了 `temp_object.x`，也会造成整个 `temp_object` 对象依然保留在内存中，尤其是它还有一个非常占用内存的 `array` 属性。
3. 要解决这个问题，我就需要根据实际情况，来判断闭包中返回的函数到底需要引用什么数据，不需要引用的数据就绝不引用
    ```js
    function foo(){  
        var temp_object = new Object()
        temp_object.x = 1
        temp_object.y = 2
        temp_object.array = new Array(10000000)
        let closure = temp_object.x
        return function(){
            console.log(closure);
        }
    }
    ```
4. 使用 Chrome 的 Performance monintor 监控内存时，如果第一种情况，运行后堆内存占用变成 42 MB，点击 Momory 选项卡里面的 collect garbage 后内存占用没有变少，说明这部分内存发生了泄露；如果是第二种情况，运行时也会变成 42 MB，但点击 collect garbage 后，这部分的内存就会回收了。
5. 或者在使用完之后手动删除对象    
    ```js
    function foo(){  
        var temp_object = new Object()
        temp_object.x = 1
        temp_object.y = 2
        temp_object.array = new Array(10000000)
        return function(){
            console.log(temp_object.x);
            temp_object = null
        }
    }
    ```

### 所有的内部函数会共享闭包——返回函数不引用数据也可能导致内存泄露的情况
1. 先看下面的例子
    ```js
    function outer() {
        let largeData = new Array(10000000);	
        
        function inner() {
            return largeData;
        }

        return function(){};
    }
    let foo = outer();
    ```
2. 返回的函数没有引用 `outer` 的任何数据，但是只要返回的函数还被引用（这里被 `foo` 引用），那么 `largeData` 的内存就不能被回收。
3. The major point to remember is that in a javascript closure, all inner functions share the same context.
4. 扩展一下这个例子，让它快速耗光浏览器的内存  (｡•ˇ‸ˇ•｡)
    ```js
    let foo;

    function outer() {
        let largeData = new Array(10000000);	
        let lastFoo = foo;
        
        function inner() {
            return largeData || lastFoo;
        }

        return function(){};
    }

    setInterval(function() {
        foo = outer();
    }, 2000);
    ```
    1. 每两秒执行一次 `outer`，生成一个带有新建的 `largeData` 数组的闭包。
    2. 因为返回值被全局变量 `foo` 引用，所以闭包数据不能回收内存。
    3. 两秒钟后再次调用，`foo` 又被 `lastFoo` 引用，而 `lastFoo` 因为被 `inner` 引用，所以又存在于新的闭包里不能被回收内存。
    4. 所以就形成了这样嵌套的引用，每次 `outer` 返回的函数都被引用，它的闭包都不能被回收，所以每两秒内存就增加 40 MB 左右。
    5. 如果没人引用 `outer` 返回的函数，那就没问题了
        ```js
        setInterval(function() {
            foo = outer()();
        }, 2000);
        ```


## 其他的内存不良使用情况
### 内存膨胀
1. **内存膨胀**（Memory bloat）和内存泄漏有一些差异，内存膨胀主要表现在程序员对内存管理的不科学，比如只需要 50M 内存就可以搞定的，有些程序员却花费了 500M 内存。
2. 额外使用过多的内存有可能是没有充分地利用好缓存，也有可能加载了一些不必要的资源。通常表现为内存在某一段时间内快速增长，然后达到一个平稳的峰值继续运行。比如一次性加载了大量的资源，内存会快速达到一个峰值。
3. 内存膨胀和内存泄漏的关系可以参看下图
    <img src="./images/16.jpg" width="600" style="display: block; margin: 5px 0 10px 0;" />
4. 要避免内存膨胀，我们需要合理规划项目，充分利用缓存等技术来减轻项目中不必要的内存占用。

### 频繁的垃圾回收
1. 除了内存泄漏和内存膨胀，还有另外一类内存问题，那就是频繁使用大的临时变量，导致了新生代空间很快被装满，从而频繁触发垃圾回收。
2. 频繁的垃圾回收操作会让你感觉到页面卡顿。比如下面这段代码
    ```js

    function strToArray(str) {
        let i = 0
        const len = str.length
        let arr = new Uint16Array(str.length)
        for (; i < len; ++i) {
            arr[i] = str.charCodeAt(i)
        }
        return arr;
    }

    function foo() {
        let i = 0
        let str = 'test V8 GC'
        while (i++ < 1e5) {
            strToArray(str);
        }
    }

    foo()
    ```
3. 这段代码就会频繁创建临时变量，这种方式很快就会造成新生代内存内装满，从而频繁触发垃圾回收。
4. 为了解决频繁的垃圾回收的问题，你可以考虑将这些临时变量设置为全局变量。

## References
* [图解 Google V8](https://time.geekbang.org/column/intro/296)
* [Beware of the closure memory leak in Javascript](https://heichwald.github.io/2016/01/10/memory-leak-closure-javascript.html)
* [4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)
* [Manual memory management](https://en.wikipedia.org/wiki/Manual_memory_management)
* [An interesting kind of JavaScript memory leak](https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156)