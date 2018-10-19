# 1XX Informational


## `100 Continue`
This interim response indicates that everything so far is OK and that the client
should continue with the request or ignore it if it is already finished.


## `101 Switching Protocol`
1. 当客户端请求切换协议时，例如切换为 websocket，客户端发送的请求会带上`Upgrade`头。
2. 服务器在收到该请求时，如果同意切换协议，则会回复`101`状态码。同时也会带上一个
`Upgrade`头，指明将要切换的协议。
3. 可以看一下这个在线的[websocket例子](https://websocket.org/echo.html)。可以看到，
在点击 connect 按钮时，浏览器发送了一个请求，`Upgrade`头为`websocket`；响应中的状态状
态码为`101 Web Socket Protocol Handshake`，`Upgrade`响应头的值也为`websocket`。


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
