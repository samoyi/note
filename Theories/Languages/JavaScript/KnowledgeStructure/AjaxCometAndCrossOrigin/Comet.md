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
2. 这时服务端脚本并未结束，客户端发起的请求也没有结束相应。
3. 但因为已经发送了一部分数据，所以 AJAX 的`readyState`会变成`3`，通过监听
`readystatechange`事件，就可以获取这一部分数据。
4. 服务端可以在不结束脚本的情况下一直执行上述过程，客户端也可以监听`readystatechange`
事件来持续获取数据
5. 直到服务端脚本结束，一次请求完成。

因为 flush 缓存的过程并不会清空缓存，所以每次发送的数据都会包括前面已经发送过的。前端在
接收到响应之后需要对响应字符串进行处理，删掉之前已经接受的内容。


## Server-Sent Events
1. Server-Sent Events (SSE) is an API and pattern for read-only Comet
interactions.
2. The SSE API creates a one-way HTTP connection to the server through which the
 server can pass as much or as little information as necessary.
3. The server response must have a MIME type of `text/eventstream` and outputs
the information in a specific format that the browser API consumes and makes
available through JavaScript.
4. By default, the EventSource object will attempt to keep the connection alive
with the server. If the connection is closed, a reconnect is attempted.
5. 如果服务端没有通过`sleep()`等方法来维持脚本运行从而导致请求结束，SSE 也会在一定的时
间间隔后重新发起连接，但这个时间间隔似乎不能自定义。最终的效果就相当于短轮训。
6. IE 和 Edge都不支持(2017.5)

### Properties and Methods
#### `readyState`
* 0 — connecting
* 1 — open
* 2 — closed

#### url
A DOMString representing the URL of the source. Read only

#### withCredentials
The withCredentials read-only property of the EventSource interface returns a Boolean indicating whether the EventSource object was instantiated with CORS credentials set.

#### `close()`
* Closes the connection
* SSE的通讯只能通过这个方法来停止。即使服务端停止了脚本的运行，SSE也会从客户端重新发起连接。

### Event handlers
#### onopen
when the connection is established

#### onmessage
* when a new message event is received from the server
* Information sent back from the server is returned via `event.data` as a string.

#### onerror
when an error occurs。目前看到的触发情况是，服务端脚本没有维持从而结束后，会触发该事件。发生该事件后，`EventSource`会重新发起请求来连接服务端，因此会再次触发`open`事件。

#### Custom event
默认情况下，前端通过`message`事件来接收数据。但也可是使用自定义的事件来发送和接收数据
  ```
  // PHP 后端定义一个 customEvent 事件
  <?php
      echo 'event: customEvent';
      echo "\n";
      echo 'data: customEvent data' ;
      echo "\n\n";
  ?>
  ```
  ```js
  // JS 前端通过该事件接受数据
  evtSource.addEventListener("customEvent", function(ev){
      console.log( ev.data ); // customEvent data
  }, false);
  ```

### Event stream
* The server events are sent along a long-lasting HTTP response with a MIME type of `text/eventstream`.
* The event stream must be encoded using UTF-8.
* The format of the response is plain text and, in its simplest form, is made up of the prefix `data:` followed by text
* Messages in the event stream are ended by a pair of newline characters.
    ```php
    <?php
        echo 'data: foo';
        echo "\n\n";
        echo 'data: bar';
        echo "\n\n";
        echo 'data: baz';
        echo "\n";
        echo 'data: qux';
        echo "\n\n";
        echo 'data: baz';
        echo 'data: qux';
        echo "\n\n";
    ?>
    /* 因为有4个 \n\n，所以会发送四次数据，EventSource将接收到四条信息，分别为
        1. foo
        2. bar
        3. bar\nqux
        4. bazdata: qux
    */
    ```
* A colon as the first character of a line is in essence a comment, and is ignored.
    ```php
    <?php
        echo 'data: normal data' ;
        echo "\n\n";
        echo ':data: comment data'; // 并不会向客户端发送该数据
        echo "\n\n";
    ?>
    ```
* You can also associate an ID with a particular event by including an `id: line` before or after the `data: line(s)`
    ```php
    <?php
        echo 'data: normal data' ;
        echo "\n";
        echo 'id: 314';
        echo "\n\n";
    ?>
    ```
    By setting an ID, the  EventSource object keeps track of the last event fi red. If the connection is dropped, a special HTTP header called  Last-Event-ID is sent along with the request so that the server can determine which event is appropriate to fi re next. This is important for keeping sequential pieces of data in the correct order over multiple connections.
