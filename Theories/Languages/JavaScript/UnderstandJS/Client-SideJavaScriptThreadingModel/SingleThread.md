# Single Thread


## JavaScript is single-thread
1. The core JavaScript language does not contain any threading mechanism, and
clientside JavaScript has traditionally not defined any either.
2. HTML5 defines “Web Workers” which serve as a kind of a background thread, but
clientside JavaScript still behaves as if it is strictly single-threaded.
3. Even when concurrent execution is possible, client-side JavaScript cannot
ever detect the fact that it is occurring.


## advantage
1. 单线程的执行机制使得脚本编写很简单，不需要考虑两个事件处理同时执行的情况。
2. 在操纵文档的时候也不需要担心有其他线程同时也在操作而引起的冲突，不用担心 locks，
deadlock 以及 race condition。


## disadvantage
1. 单线程的执行机制意味着浏览器在执行脚本的同时不能响应用户输入。
2. 这给脚本编写带来的一个麻烦是，不能编写长时间运行的脚本，否则就会长时间无法响应用户输
入，让用户以为浏览器崩溃了。
3. 如果脚本执行运算密集的任务，那可能就会长时间的阻塞文档加载，用户就会一直看到未完成加
载的页面。


## Performs computationally intensive task
* 使用`Web worker`
* 页面加载完成后再进行复杂运算
* 通知用户当前正在进行复杂也算，页面并没有被挂起。
* 如果可以的话尽量把复杂任务拆分为多个小的子任务，使用诸如`setTimeout()`或
`setInterval()`的方法来分段执行，并向用户展示计算进度。
