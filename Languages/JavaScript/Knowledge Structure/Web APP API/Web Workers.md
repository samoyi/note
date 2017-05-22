# Web Workers


***
## Summary
1. Web workers live in a self-contained execution environment
2. With no access to the `Window` or `Document` object and can communicate with the main thread only through asynchronous message passing.
3. Creating a new worker is not a heavyweight operation like opening a new browser window, but workers are not flyweight threads either, and it does not make sense to create new workers to perform trivial operations.
4. Complex web applications may find it useful to create tens of workers, but it is unlikely that an application with hundreds or thousands of workers would be practical.
5. As with any threading API, there are two pieces to the Web Workers specification.
6.  The first is the Worker object: this is what a worker looks like from the outside, to the thread that creates it.
7.  The second is the WorkerGlobalScope: this is the global object for a new
worker, and it is what a worker thread looks like, on the inside, to itself.


***
## Worker
1. To create a new worker, just use the `Worker()` constructor, passing a URL that specifies the JavaScript code that the worker is to run  
  ```
  var worker = new Worker("stufftodo.js");
  ```
2. If you specify a relative URL, it is resolved relative to the URL of the document that contains the script that called the `Worker()` constructor. If you specify an absolute URL, it must have the same origin as that containing
document.
3. This line of code causes the browser to download `stufftodo.js` but the worker doesn’t actually start until it receives a message.
4. Once you have a Worker object, you can send data to it with `postMessage()`. The value you pass to `postMessage()` will be structured cloned
  ```
  worker.postMessage({
      type: "command",
      message: "start! "
  });
  ```
5. Note that the `postMessage()` method of a Worker does not have the origin argument that the `postMessage()` method of a Window does. Also, the `postMessage()` method of a Worker correctly clones the message in current browsers, unlike `Window.postMessage()`, which is still restricted to string messages in some important browsers.
6. You can receive messages from a worker by listening for message events on the Worker object
    ```
    self.onmessage = function(ev){
        var data = ev.data;
    };
    ```
7. If a worker throws an exception and does not catch or handle it itself, that exception propagates as an event that you can listen for. In an error handler,
  ```
  self.onerror = function(e) {
    // Log the error message, including worker filename and line number
    console.log("Error at " + e.filename + ":" + e.lineno + ": " + e.message);
  }
  ```
8. It’s a good idea to always provide an onerror event handler for Web Workers, even if it does nothing else but log an error. Otherwise, workers will silently fail when an error occurs.
9. worker中可也以通过自己的`postMessage()`方法将数据异步传回页面，同时也会触发主页面的`message`事件    
    ```
    self.postMessage(data);
    ```
10. Calling `terminate()` method in main script or calling `close()` method in worker script, will terminate a Worker thread. Doing so means that the worker is stopped immediately and does not finish any remaining processing (error and message events are not fired).
11. There is no API on the Worker object to test whether a worker has closed itself, and there is no onclose event handler property, either. If you call `postMessage()` on a worker that has closed, your message will be discarded silently and no error will be raised. In general, if a worker is going to `close()` itself, it may be a good idea to first post some kind of “closing” message.


***
## Worker Scope
* Worker is executed in a new, pristine JavaScript execution environment, completely isolated from the script that created the worker.
* Inside of a Web Worker, there is no access to the DOM and, indeed, no way to affect the appearance of a page in any way
* The global object inside of a Web Worker is the worker object itself. That means accessing either `this` or `self` in the global scope will result in accessing the working object.
* A WorkerGlobalScope is something more than the core JavaScript global object, but less than a full-blown client-side Window object. There is a minimal environment inside of the worker to allow it to process client-side data:
  * A minimal `navigator` object containing `onLine`, `appName`, `appVersion`, `userAgent`, and `platform` properties.
  * A read-only `location` object.
  * `setTimeout()`, `setInterval()`, `clearTimeout()`, and `clearInterval()`
  * The usual event target methods `addEventListener()` and `removeEventListener()`.
  * The `XMLHttpRequest` constructor


## Including Other Scripts
  ```
  importScripts(“file1.js”, “file2.js”);
  ```
* This method accepts one or more URLs from which to load JavaScript.
*  Relative URLs are resolved relative to the URL that was passed to the `Worker()` constructor.
* All of the loading is done synchronously
* Even though `file2.js` may finish downloading before `file1.js`, they will be executed in the order in which they are specified. This is the beauty of threads: you can use a blocking function call in a worker without blocking the event loop in the main thread, and without blocking the computations being concurrently performed in other workers.
* The scripts are executed in the worker global scope, so if they make use of page-specific JavaScript, then they may not work in a worker.


## 例子
##### 主页面脚本
```
let worker = new Worker("Worker.js"),
	nLoopTime = 22222;

worker.onmessage = function(event)
{
    let nResult = event.data;

    alert( " 循环结束。循环次数是 " + nResult );
}

worker.onerror = function(event)
{
    console.log("ERROR: " + event.filename + " (" + event.lineno + "): " +
                event.message);

      测试错误处理的兼容性，测试return false是否会阻止报错，并记入笔记
};

worker.postMessage( nLoopTime );

document.write("循环运算异步进行，所以不会阻塞这行文字的输出。");
```
##### Worker.js
```
self.onmessage = function(event)
{
    // 接收到数据
    var nLoopTimes = event.data;

    // 引入外部文件
    self.importScripts("loopHandler.js");

    // 下来处理数据
    let nReturnLoopTimes = loopConsoleIndex( nLoopTimes );

    // 将处理后的数据发会页面
    self.postMessage( nReturnLoopTimes );

    // 结束
    self.close(); // 也可以在页面中调用 worker.terminate();
};
```
##### loopHandler.js
```
function loopConsoleIndex( times )
{
    for(var i=0; i< times; i++)
    {
        console.log( i );
    }
    return i;
}
```
