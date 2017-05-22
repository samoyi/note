# Alternate Cross-Domain Techniques

***
## 图像ping
1. 一个网页可以从任何网页中加载图像，不用担心跨域不跨域。
2. 图像 Ping 是与服务器进行简单、单向的跨域通信的一种方式。 请求的数据是通过查询字符串形式发送的，而响应可以是任意内容，但通常是像素图或 204 响应。
3. 通过图像Ping，浏览器得不到任何具体的数据，但通过侦听 load 和 error 事件，它能知道响应是什么时候接收到的。图像Ping最常用于跟踪用户点击页面或动态广告曝光次数。
    ```
    var img = new Image();
    function imgPing()
    {
        alert("Done!");
    }
    function imgPingFail()
    {
        alert("Fail!");
    }
    img.addEventListener('load', imgPing, false);
    img.addEventListener('error', imgPingFail, false);
    img.src = "test.php?name=li";
    ```
4. 图像Ping有两个主要的缺点：
  * 只能发送GET请求
  * 无法访问服务器的响应文本


***
## JSONP
### 原理
1. 因为`<script>`的`src`属性也可以跨域访问，所以可以在响应中返回所需要的文本，而这些文本返回后就相当于当前页面中的JS代码。
2. 通过请求地址的参数，可以让服务器方判断如何响应。

### 缺点
1. JSONP是从其他域中加载代码执行。如果其他域不安全，很可能会在响应中夹带一些恶意代码，而此时除了完全放弃JSONP调用之外，没有办法追究。因此在使用不是你自己运维的Web服务时，一定得保证它安全可靠。
2. 要确定JSONP请求是否失败并不容易。虽然HTML5给`<script>`元素新增了一个`onerror`事件处理程序，但目前还没有得到任何浏览器支持。为此，开发人员不得不使用计时器检测指定时间内是否接收到了响应。但就算这样也不能尽如人意，毕竟不是每个用户上网的速度和带宽都一样。


***
## Cross-Origin Messaging
1. cross-origin communication between different `window` object in cross-origin or same-origin
2. You can communicate with another `window`, which in `iframe` or in a new browse window(or tab) opened by `window.open`.

### otherWindow.postMessage
  `otherWindow.postMessage(message, targetOrigin, [transfer])`  
* #### otherWindow
A reference to another window; such a reference may be obtained, for example, using the `contentWindow` property of an `iframe` element, the object returned by `window.open`, or by named or numeric index on `Window.frames`, if you're trying to start the communication from iframe to parent window then `parent` is also a valid reference

* #### message
Data to be sent to the other window. The data is serialized using the structured clone algorithm. This means you can pass a broad variety of data objects safely to the destination window without having to serialize them yourself.(Prior to Gecko 6.0, the message parameter must be a string. )

* #### targetOrigin
  1. A string that specifies the expected origin of the destination window. 2. Include the protocol, hostname, and (optionally) the port portions of a URL (you can pass a complete URL, but anything other than the protocol, host, and port will be ignored). If you want to specify the same origin as the current window, you can simply use `/`.
  3. 看起来似乎是，该方法会将数据发送到`otherWindow`这个`window`，但任何origin的一个文档都可以包含`otherWindow`这个`window`。如果将这个参数设定为`*`，则任何origin的任何文档都可以通过包含`otherWindow`这个`window`来读取发送的数据。不懂。不确定是不是这个意思，如果是的话不知道怎么在任何origin的一个文档里包含`otherWindow`这个`window`（通过`iframe`包含的并不是`window`对象，而是那一整个文档）
  4. Always provide a specific targetOrigin, not `*`, if you know where the other window's document should be located. Failing to provide a specific target discloses the data you send to any interested malicious site.

### window.onmessage
If the origins match, the call to `postMessage()` will result in a message event being fired at the target Window object. A script in that window can define an event handler function to be notified of message events. This handler is passed an event object with the following properties:
* #### `data`
This is a copy of the message that was passed as the first argument to `postMessage()`
* #### `source`
The Window object from which the message was sent. You can use it to reply message by `postMessage()`
* #### `origin`
  1. The origin of the window that sent the message at the time postMessage was called.
  2. This string is the concatenation of the protocol and "://", the host name if one exists, and ":" followed by a port number if a port is present and differs from the default port for the given protocol.
  3. Note that this origin is not guaranteed to be the current or future origin of that window, which might have been navigated to a different location since `postMessage` was called.
  4. The value of the origin property of the dispatched event is not affected by the current value of document.domain in the calling window.
  5. For IDN host names only, the value of the `origin` property is not consistently Unicode or punycode; for greatest compatibility check for both the IDN and punycode values when using this property if you expect messages from IDN sites. This value will eventually be consistently IDN, but for now you should handle both IDN and punycode forms.
  6. The value of the `origin` when the sending window contains a `javascript:` or `data:` URL is the origin of the script that loaded the URL.
* #### Security
  1. Any window may access `postMessage` method on any other window, at any time, regardless of the location of the document in the window, to send it a message.
  2. Consequently, any event listener used to receive messages must first check the identity of the sender of the message, using the `origin` and possibly `source` properties.
  3. Failure to check the `origin` and possibly `source` properties enables cross-site scripting attacks.

### Security concerns
1. If you do not expect to receive messages from other sites, do not add any event listeners for message events. This is a completely foolproof way to avoid security problems.
2. If you do expect to receive messages from other sites, always verify the sender's identity using the origin and possibly source properties.
3. Having verified identity, however, you still should always verify the syntax of the received message. Otherwise, a security hole in the site you trusted to send only trusted messages could then open a cross-site scripting hole in your site.
4. Always specify an exact target origin, not `*`, when you use postMessage to send data to other windows. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent using postMessage.
