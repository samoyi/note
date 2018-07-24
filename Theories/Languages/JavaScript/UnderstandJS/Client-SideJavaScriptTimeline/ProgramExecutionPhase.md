# Program execution phase

First phase, document content is loaded and the scripts code is run. Once the
document is loaded and all scripts have run, JavaScript execution enters its
second phase. This phase is asynchronous and event-driven.


## single-threaded execution model
1. Both core JavaScript and client-side JavaScript have a single-threaded
execution model. Scripts and event handlers are (or must appear to be) executed
one at a time without concurrency. This keeps JavaScript programming simple
2. HTML5 defines “WebWorker” which serve as a kind of a background thread, but
clientside JavaScript still behaves as if it is strictly single-threaded. Even
when concurrent execution is possible, client-side JavaScript cannot ever detect
 the fact that it is occurring.
3. JavaScript scripts and event handlers must not run for too long. If a script
performs a computationally intensive task, it will introduce a delay into
document loading, and the user will not see the document content until the
script completes. If an event handler performs a computationally intensive task,
 the browser may become nonresponsive, possibly causing the user to think that
it has crashed.
4. 除了主JavaScript执行进程外，还有一个需要在进程下一次空闲时执行的代码队列。随着页面在
其生命周期中的推移，代码会按照执行顺序添加入队列。例如，当某个按钮被按下时，它的事件处理
程序代码就会被添加到队列中，并在下一个可能的时间里执行。当接收到某个Ajax响应时，回调函数
的代码会被添加到队列。在JavaScript中没有任何代码是立刻执行的，但一旦进程空闲则尽快执行。

### 定时器的运行规则
1. JavaScript是运行于单线程的环境中的，而定时器仅仅只是计划代码在未来的某个时间执行。执
行时机是不能保证的，因为在页面的生命周期中，不同时间可能有其他代码在控制JavaScript进程。
在页面下载完后的代码运行、事件处理程序、Ajax回调函数都必须使用同样的线程来执行。实际上，
浏览器负责进行排序，指派某段代码在某个时间点运行的优先级。  
2. 定时器对队列的工作方式是，当特定时间过去后将代码插入。注意，给队列添加代码并不意味着
对它立刻执行，而只能表示它会尽快执行。设定一个150ms后执行的定时器不代表到了150ms代码就
立刻执行，它表示代码会在150ms后被加入到队列中。如果在这个时间点上，队列中没有其他东西，
那么这段代码就会被执行，表面上看上去好像代码就在精确指定的时间点上执行了。其他情况下，代
码可能明显地等待更长时间才执行。


## 三种原生JS文件加载和执行方式
### 默认
同步加载，同步执行。在下载脚本并执行完成之前都不会解析之后的 HTML 代码，即脚本的加载和
执行都会阻塞解析文档。

### `defer`
* 异步加载，延迟执行。延迟至文档解析完成之后再执行。
* 保证先后顺序，`b.js`会在`a.js`执行之后再执行，`b.js`可以依赖`a.js`
    ```html
    <script defer src="a.js"></script>
    <script defer src="b.js"></script>
    ```

### `async`
* 异步加载，同步执行
* 不保证先后顺序，`b.js`不一定会在`a.js`执行之后再执行，`b.js`不能依赖`a.js`
    ```html
    <script async src="a.js"></script>
    <script async src="b.js"></script>
    ```
* If a `<script>` tag has both attributes, a browser that supports both will
honor the `async` attribute and ignore the `defer` attribute.

![scriptTimeline](image/scriptTimeline.jpg)  



## `document.readyState`
Describes the loading state of the document.

### 三个阶段的值
1. `loading`: The document is still loading.
2. `interactive`: The document has finished loading and the document has been
parsed but sub-resources such as images, stylesheets and frames are still
loading.
3. `complete`: The document and all sub-resources have finished loading. The
state indicates that the `load` event is about to fire.

### 与`DOMContentLoaded`事件和`load`事件的关系
```js
document.addEventListener('readystatechange', function(){
    if (document.readyState === 'interactive'){
        console.log('interactive: ' + (new Date()).getTime());
    }
    if (document.readyState === 'complete'){
        console.log('complete: ' + (new Date()).getTime());
    }
});
document.addEventListener('DOMContentLoaded', function(){
    console.log('DOMContentLoaded: ' + (new Date()).getTime());
});
window.addEventListener('load', function(){
    console.log('load: ' + (new Date()).getTime());
});
```

`DOMContentLoaded`的时间会和`interactive`相同或晚几毫秒；`load`的时间会和`complete`
相同或晚几毫秒。说明在`document.readyState`变为`interactive`之后，接着就会触发
`DOMContentLoaded`事件；在变为`complete`之后，接着就会触发`load`事件。



## 文档加载时间线  
**This is an idealized timeline and all browsers do not support all of its
details.**
1. The web browser creates a `Document` object and begins parsing the web page,
adding Element objects and Text nodes to the document as it parses HTML elements
 and their textual content. The `document.readyState` property has the value
`loading` at this stage.
2. When the HTML parser encounters `<script>` elements that have neither the
`async` nor `defer` attributes, it adds those elements to the document and then
executes the inline or external script. These scripts are executed synchronously
, and the parser pauses while the script downloads (if necessary) and runs.
3. 异步下载带有`async`或者`defer`属性的 scripts，并在下载完成后立刻同步执行带有
`async`属性的脚本文件
4. When the document is completely parsed, the `document.readyState` property
changes to `interactive`.
5. Any scripts that had the `defer` attribute set are executed
6. The browser fires a `DOMContentLoaded` event on the `Document` object. This
marks the transition from synchronous script execution phase to the asynchronous
 event-driven phase of program execution. Note, however, that there may still be
async scripts that have not yet executed at this point.
7. The document is completely parsed at this point, but the browser may still be
 waiting for additional content, such as images, to load. When all such content
finishes loading, and when all async scripts have loaded and executed, the
`document.readyState` property changes to `complete` and the web browser fires a
 `load` event on the `Window` object.
8. From this point on, event handlers are invoked asynchronously in response to
user input events, network events, timer expirations, and so on.

*This timeline does not specify when the document becomes visible to the user or
 when the web browser must start responding to user input events. Those are
implementation details. For very long documents or very slow network connections
, it is theoretically possible that a web browser will render part of a document
 and allow the user to start interacting with it before all the scripts have
executed. In that case, user input events might be fired before the event-driven
 phase of program execution has formally started.*


## `<script>`放到最后也会阻塞渲染的情况
### inline script 在任何位置都会阻塞渲染
```html
<body>
    <div>1</div>
    <div>2</div>
    <script>
    for (let i=0; i<99999999; i++){
        Math.random();
    }
    console.log('done')
    </script>
</body>
```
1. 在 Chrome（67.0.3396.99） 和 FF 实际效果都是页面先空白，等几秒钟后，"1、"2"和
"done"同时出现。
2. 查看 Chrome Performance 的 timeline 会发现，在执行脚本之前之后都各有意思 paint 的
过程。但查看帧画面，在第一次 paint 之后页面上仍然是空的，只有第二次 paint 之后页面才有
内容。
3. 使用 Chrome Audit 也是一样的情况，“Frist meaningful paint”用了超过15秒，而如果删
掉循环，只要不到一秒就有“Frist meaningful paint”。


### Chrome 中，外部脚本的执行对渲染的阻塞
只有在脚本加载的足够快的情况下才会出现，在实际情况下可能并不容易出现。  
测试版本是：
```
版本 67.0.3396.99（正式版本） （32 位）
```
即使把`<script>`放到最后也会阻塞渲染的情况：
1. 解析 HTML，遇到`<script>`则阻塞解析，同步加载脚本。这是正常的。
2. 如果脚本加载完成时，页面已经完成了渲染，则不存在阻塞。
3. 但是如果脚本很快就加载完了，而此时页面还没有进行渲染，则 Chrome 不会先进行渲染，而会
先执行脚本。**这里的逻辑应该是如果此时先渲染绘制了的话，脚本如果会导致重渲染，则会让页
面出现可见的重新布局。**
4. 必须要等到脚本执行完才会进行统一的渲染。如果脚本之内有耗时操作的话，会导致延迟渲染。
5. 而在 FF 中，则会正常的先渲染绘制完成后再执行脚本。
6. 因此，如果在 Chrome 中使用`defer`，如果异步下载完成时页面没有渲染，同样也会先执行脚
本再渲染页面，也会导致页面内容延迟出现。
7. 这就要求，即使`<script>`放在底部，其内部也不能有耗时的同步操作。例如
    ```js
    for (let i=0; i<99999999; i++){
        Math.random();
    }
    ```
8. 甚至即使把耗时操作放在异步回调时，如果该回调很快执行也不行：
    ```js
    setTimeout(()=>{
        for (let i=0; i<99999999; i++){
            Math.random();
        }
    }, 30)
    ```
30毫秒之后，页面如果仍然没有渲染，则仍然会先执行回调中的操作，从而阻塞加载。除非你设定更
长的异步操作，让耗时操作在渲染完成后执行
    ```js
    setTimeout(()=>{
        for (let i=0; i<99999999; i++){
            Math.random();
        }
    }, 300)
    ```
这样，在异步回调执行前页面已经渲染绘制完成。
9. 使用`DOMContentLoaded`事件和`load`事件
因为`DOMContentLoaded`事件发生时只是文档被解析了而没有被渲染，所以该事件的回调仍然会阻
塞。`load`事件的出现会更晚一些，但如果页面没什么外部资源或者都加载的很快，那么有可能
`load`的时候页面仍然没有渲染，所以仍然不能保证。
10. 最后，我的测试都是加载本地脚本，所以才会出现加载很快的情况。在实际情况下，位于`body`
底部的`<script>`可能并不会有限加载，而且因为加载基本上都是远程，也不会很快，所以可能不
容易出现上述的阻塞。



## References
* [Script-injected "async scripts" considered harmful](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/)  
