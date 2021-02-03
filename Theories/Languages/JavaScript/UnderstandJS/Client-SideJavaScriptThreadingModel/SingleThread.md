# Single Thread



## JavaScript 程序执行流程
1. JavaScript program execution occurs in two phases: 加载现有脚本并执行，事件驱动异步执行。
2. In the first phase, the document content is loaded and the code from `<script>` elements is run.
3. Once the document is loaded and all scripts have run, JavaScript execution enters its second phase. This phase is asynchronous and event-driven. 
4. During this event-driven phase, the web browser invokes event handler functions in response to events that occur asynchronously.
5. Both core JavaScript and client-side JavaScript have a single-threaded execution model. Scripts and event handlers are (or must appear to be) executed one at a time without concurrency. This keeps JavaScript programming simple.


## JavaScript is single-thread
1. The core JavaScript language does not contain any threading mechanism, and client-side JavaScript has traditionally not defined any either.
2. HTML5 defines “Web Workers” which serve as a kind of a background thread, but client-side JavaScript still behaves as if it is strictly single-threaded.
3. Even when concurrent execution is possible, client-side JavaScript cannot ever detect the fact that it is occurring.


## Advantages
1. 单线程的执行机制使得脚本编写很简单，不需要考虑两个事件处理同时执行的情况。
2. 在操纵文档的时候也不需要担心有其他线程同时也在操作而引起的冲突，不用担心 locks，deadlock 以及 race condition。


## Disadvantages
1. 单线程的执行机制意味着浏览器在执行脚本的同时不能响应用户输入。
2. 这给脚本编写带来的一个麻烦是，不能编写长时间运行的脚本，否则就会长时间无法响应用户输入，让用户以为浏览器崩溃了。
3. 如果脚本执行运算密集的任务，那可能就会长时间的阻塞文档加载，用户就会一直看到未完成加载的页面。


## Performs computationally intensive task
* 使用 `Web worker`。
* 页面加载完成后再进行复杂运算。
* 通知用户当前正在进行复杂也算，页面并没有被挂起。
* 如果可以的话尽量把复杂任务拆分为多个小的子任务，使用诸如 `setTimeout()` 或 `setInterval()` 的方法来分段执行，并向用户展示计算进度。



* [JavaScript: The Definitive Guide, 6th Edition](https://book.douban.com/subject/5303032/)