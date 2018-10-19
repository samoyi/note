# Memory Leaks

The four types of common JavaScript leaks:
* Accidental global variables
* Forgotten timers or callbacks
* Out of DOM references
* Closures


## Accidental global variables
1. 如果不使用严格模式，函数内部不使用 `var`/`let`/`const` 声明的变量和 `this` 都会成
为全局变量。
2. If you must use a global variable to store data, make sure to null it or
reassign it after you are done with it.
3. One common cause for increased memory consumption in connection with globals
are **caches**. Caches must have an upper bound for its size. Caches that grow
unbounded can result in high memory consumption because their contents cannot be
collected.


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
1. 假设元素`#renderer`被永久移除了，那这个 interval 就变得没有意义，应当停止。
2. 但如果没有停止，`setInterval`的回调就会一直执行，它就会一直占用内存。
3. 而且，回调内部引用了`serverData`。这样即使`serverData`在其他地方已经没用了，仍然得
不到回收，因为回调函数一直在无意义的引用它。

### Forgotten callbacks
```js
let element = document.getElementById('button');

function onClick(event) {
   element.innerHtml = 'text ' + Math.random();
}
element.addEventListener('click', onClick);

element.parentNode.removeChild(element);
```
1. 事件监听监听了`element`的点击事件，但如果之后`element`被移除了，这个引用了`element`
的事件监听就没有用了。
2. 因此需要解除这个事件监听。不过现代浏览器可以自动识别事件监听的对象已经无法访问了，进
而自动解除该事件监听。
3. 所以实际中`removeChild`之后不需要手动`removeEventListener`，但仍然需要知道是浏览器
帮我们解除了监听，进而防止了内存泄露。


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
3. `removeChild`或`replaceChild`会通过 DOM 删除元素，但 JS 已经为其分配的内存和值并
不能自动被删除。


## Closures
重点参考[这篇](https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156)
和[这篇](https://heichwald.github.io/2016/01/10/memory-leak-closure-javascript.html)

```js
var theThing = null;
function replaceThing() {
    var originalThing = theThing;

    function unused() {
        if (originalThing)
        console.log("hi");
    };

    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod() {
            console.log(someMessage);
        },
    };

    // originalThing = null; // 加上这一行可以防止内存溢出
};

setInterval(replaceThing, 1000);
```
1. 理论上`someMethod`要引用其父级作用域中的两个变量：`originalThing`和`unused`。
2. 理论上`unused`也要引用`replaceThing`的子级变量`theThing`和`unused`。
3. 但因为`someMethod`和`unused`是同一个父级，所以引用的是同一个父级作用域对象。肯定要
引用同一个父级作用域对象，否则一个子函数改了父函数中的某个变量`var`，另一个子函数访问的
仍然是旧的`var`。
    ```js
    function parent(){
        let age =  22;

        function child1(){
            age = 33;
        }

        function child2(){
            console.log(age);
        }

        return [child1, child2];
    }

    let [child1, child2] = parent();
    child1();
    child2(); // 33  如果引用的不是同一个父级作用域对象，那这里就是 22 了
    ```
4. 也就是说，只有一个父级作用域对象，它包括3个变量：`originalThing`、`theThing`和
`unused`。
5. `someMethod`和`unused`都访问这同一个作用域对象。
6. 虽然`someMethod`根本不需要`originalThing`，但它还是要带着这个完整版的父级作用域对
象。
6. 现在，`someMethod`和`longStr`保存在了全局变量`theThing`里，所以这两个变量在
`replaceThing`执行完成后不会被删除。
7. 在下一次调用`replaceThing`时，超长字符串成了`originalThing`的属性。
8. 之后，`someMethod`也要被迫的带着它不需要的父级作用域变量`originalThing`，进入下一
轮循环。
9. `unused`虽然没有被调用，但是它反复的在它和 `someMethod` 的共同父级作用域对象里引入
`originalThing`，而正是`originalThing`保存着一个超长字符串。
10. 如果没有`unused`或者`unused`里面不引用 `originalThing`，那么虽然`originalThing`
仍然是在`someMethod`的父级作用域里，但因为没有没人引用它，所以也会被垃圾回收机制回收。
11. 如果不修改`unused`，可以按照上面代码中注释中的那样，手动解除变量`originalThing`对
超长字符串的引用。这样虽然变量`originalThing`仍然在父级作用域中，但已经和超长字符串没
关系了。


## References
* [4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)
* [上面文章的译文](http://web.jobbole.com/88463/)
* [Manual memory management](https://en.wikipedia.org/wiki/Manual_memory_management)
* [An interesting kind of JavaScript memory leak](https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156)
* [Beware of the closure memory leak in Javascript](https://heichwald.github.io/2016/01/10/memory-leak-closure-javascript.html)
