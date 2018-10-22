# Comet

* Ajax 是一种从页面向服务器请求数据的通讯模式，而 Comet 则是一种服务器向页面推送数据的通
讯模式。
* [代码实例](https://github.com/samoyi/Nichijou/tree/master/communication/Comet)


## Long Polling
短轮询是客户端不断发送请求让后台返回数据是否变化；长轮询是客户端发送一次请求，然后让后台
持续监听文件数据变化，如果变化了则返回请求。 实际上，短轮询就是客户端在轮询，长轮询就是
后台在轮询


## HTTP streaming
1. 服务端写入一些数据到输出缓存，然后 flush 缓存，输出给客户端。
2. 这时服务端脚本并未结束，客户端发起的请求也没有结束响应。
3. 但因为已经发送了一部分数据，所以 AJAX 的`readyState`会变成`3`，通过监听
`readystatechange`事件，就可以获取这一部分数据。
4. 服务端可以在不结束脚本的情况下一直执行上述过程，客户端也可以监听`readystatechange`
事件来持续获取数据
5. 直到服务端脚本结束，一次请求完成。

因为 flush 缓存的过程并不会清空缓存，所以每次发送的数据都会包括前面已经发送过的。前端在
接收到响应之后需要对响应字符串进行处理，删掉之前已经接受的内容。


## Server-Sent Events
1. SSE（Server-Sent Events，服务器发送事件）是围绕只读 Comet 交互推出的 API。只是用来
接收消息的。
2. SSE API 用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。服务器
响应的 MIME 类型必须是`text/event-stream`，而且是浏览器中的 JavaScript API 能解析格
式输出。
3. 默认情况下，EventSource对象会保持与服务器的活动连接。如果连接断开，还会重新连接。
4. 如果服务端没有通过`sleep()`等方法来维持脚本运行从而导致请求结束，SSE 也会在一定的时
间间隔后重新发起连接，但这个时间间隔似乎不能自定义。最终的效果就相当于短轮训。

### 客户端用法
1. 可以传递一个 URL 给`EventSource()`构造函数，然后在返回的实例上监听消息事件。
    ```js
    let bFirstConnection = true;

    const connect = new EventSource("http://localhost:8080");
    connect.onopen = function(){ // 建立连接或重新连接时触发该事件
        console.log(bFirstConnection ? '建立连接' : '重新连接');
    };
    connect.onmessage = function(ev) { // 监听新消息到达
        console.log(ev.data);
    };
    connect.onerror = function(){ // 连接出错时触发该事件
        console.log('连接错误');
        // 目前看到的触发情况是，服务端修改了脚本会触发该事件。
        // 之后 EventSource 会重新发起请求来连接服务端，因此会再次触发 open 事件。
        bFirstConnection = false;
    };
    setTimeout(function(){
        // SSE 的通讯只能通过这个方法来停止。即使服务端停止了脚本的运行，SSE 也会从客
        // 户端重新发起连接。
        connect.close();
        console.log('关闭连接');
    }, 20000);
    ```
2. 与`message`事件关联的事件对象有一个`data`属性，这个属性保存服务器作为该事件的负载发
送的任何字符串。
3. 如同其他类型的事件一样，该对象还有一个`type`属性，默认值是`message`，事件源指定为一
个其他值。
4. `onmessage`事件处理程序接收从一个给定的服务器事件源发出的所有事件，如果有必要，也可
以根据`type`属性派发一个事件。

### 服务端用法
```js
const http = require('http');
http.createServer((req, res)=>{
    res.setHeader('Content-Type', 'text/event-stream'); // 响应必须是该类型
    setInterval(function(){
        // 必须要以 data: 标注响应的内容，可以没有空格
        // 且响应内容必须要以一个空行结尾
        res.write(`data: ${Math.random()}\n\n`);
    }, 2000);
}).listen(8080);
```

#### 响应格式
1. 一次响应必须要以一个空行结尾`\n\n`，否则不会作为一次单独的响应
2. 一次响应可以多个`data:`来标注多个数据，但必须要有换行（`\n`）分割，否则会被认为成一
个数据

```js
setInterval(function(){
    res.write('data: foo');
    res.write('\n\n');
    res.write('data: bar');
    res.write('\n\n');
    res.write('data: baz');
    res.write('\n');
    res.write('data: qux');
    res.write('\n\n');
    res.write('data: baz');
    res.write('data: qux');
    res.write('\n\n');
}, 5000);
```

3. 上面的写法中，因为有四个空行`\n\n`，所有每五秒钟会发送四次响应。
4. 第一次响应的数据是`'foo'`，第二次响应的数据是`'bar'`。
5. 第三次响应通过换行（`\n`）标注了两个数据，响应的数据是
    ```
    baz
    qux
    ```
4. 第四次响应本来也想像第三次响应一样返回两个数据，但因为没有换行，所以实际效果相当于
`data: bazdata: qux`，于是响应的数据就是`bazdata: qux`


### Custom event
1. 默认情况下，前端通过`message`事件来接收数据。但也可是使用自定义的事件来发送和接收数据
  ```js
  // 服务端
  res.write(`event: customEvent\n`);
  res.write(`data: ${Math.random()}\n\n`);
  ```
  ```js
  // 客户端 现在必须用 addEventListener 来注册事件了
  evtSource.addEventListener('customEvent', function(ev){
      console.log(ev.data); // customEvent data
  }, false);
  ```
2. 注意服务端自定义事件的写法，并不是独立的，而是下载一次响应中的。也就是说，只有这个响
应是通过`customEvent`事件来接收的。如果服务端这样写
    ```js
    res.write(`event: customEvent\n`);
    res.write(`data: ${Math.random()}\n\n`);
    res.write(`data: 555\n\n`);
    ```
    现在随机数要用`customEvent`来接受，而`555`依然还要用默认的`messaga`来接受。所以客
    户端需要监听两个事件
    ```js
    connect.addEventListener('message', function(ev){
        console.log(ev.data);
    }, false);
    connect.addEventListener('customEvent', function(ev){
        console.log(ev.data);
    }, false);
    ```

### 事件 ID
1. 通过`id:`前缀可以给特定的事件指定一个关联的 ID，这个 ID 行位于`data:`行前面或后面皆
可：
    ```js
    res.write(`data: ${Math.random()}\n`);
    res.write(`id: 123\n\n`);
    ```
2. 同时客户端的事件对象上也可以使用`lastEventId`接收到该 ID
    ```js
    connect.addEventListener('message', function(ev){
        console.log(ev.data); // 随机数
        console.log(ev.lastEventId); // 123
    }, false);
    ```
3. 设置了 ID 后，`EventSource`对象会跟踪上一次触发的事件。如果连接中断，会向服务器发送
一个包含名为`last-event-id`的特殊 HTTP 头部的请求，以便服务器知道下一次该触发哪个事件。
在多次连接的事件流中，这种机制可以确保浏览器以正确的顺序收到连接的数据段。现在不懂具体的
应用，但是在连接中断时（比如修改服务端脚本），服务端确实可以收到该头信息。通过以下代码验
证
    ```js
    http.createServer((req, res)=>{
        console.log(req.headers['last-event-id']); // 连接中断后收到 123
        res.setHeader('Content-Type', 'text/event-stream');
        setInterval(function(){
            res.write(`data: ${Math.random()}\n`);
            res.write(`id: 123\n\n`);
        }, 2000);
    }).listen(8080);
    ```
