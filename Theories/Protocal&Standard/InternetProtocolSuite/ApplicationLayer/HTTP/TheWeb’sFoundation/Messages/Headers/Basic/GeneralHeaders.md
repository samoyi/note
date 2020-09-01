# General headers

1. These are generic headers used by both clients and servers. 
2. They serve general purposes that are useful for clients, servers, and other applications to supply to one another. 
3. For example, the `Date` header is a general-purpose header that allows both sides to indicate the time and date at which the message was constructed:
    ```
    Date: Tue, 3 Oct 1974 02:16:00 GMT
    ```

<!-- TOC -->

- [General headers](#general-headers)
    - [Cache-Control](#cache-control)
    - [Connection](#connection)
        - [控制代理不再转发的首部字段](#控制代理不再转发的首部字段)
        - [管理持久连接](#管理持久连接)
    - [Date](#date)
    - [Trailer](#trailer)
    - [Transfer-Encoding](#transfer-encoding)
    - [Upgrade](#upgrade)
    - [Via](#via)
    - [References](#references)

<!-- /TOC -->


## Cache-Control
详见 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\Cache\`


## Connection
1. Allows clients and servers to specify options about the request/response connection.
2. `Connection` 首部字段具备如下两个作用
    * 控制代理不再转发的首部字段
    * 管理持久连接

### 控制代理不再转发的首部字段
 在客户端发送请求和服务器返回响应内，使用 `Connection` 首部字段，可控制代理不再转发的首部字段（即 Hop-by-hop 首部）：
    ```
    Connection: 不再转发的首部字段名
    ```
    <img src="./images/Connection1.png" width="600" style="display: block; margin: 5px 0 10px 0;" />


### 管理持久连接
1. HTTP/1.1 版本的默认连接都是持久连接。为此，客户端会在持久连接上连续发送请求。当服务器端想明确断开连接时，则指定 `Connection` 首部字段的值为 `Close`：
    ```
    Connection: close
    ```
2. HTTP/1.1 之前的 HTTP 版本的默认连接都是非持久连接。为此，如果想在旧版本的 HTTP 协议上维持持续连接，则需要指定 `Connection` 首部字段的值为 `Keep-Alive`：
    ```
    Connection: Keep-Alive
    ```
<img src="./images/Connection2.png" width="600" style="display: block; margin: 5px 0 10px 0;" />



## Date
首部字段 `Date` 表明创建 HTTP 报文的日期和时间。
```
Date: Tue, 03 Jul 2012 04:40:59 GMT
```


## Trailer
1. When a message includes a message body encoded with the [chunked transfer coding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) and the sender desires to send metadata in the form of trailer fields at the end of the message, the sender SHOULD generate a `Trailer` header field before the message body to indicate which fields will be present in the trailers.  
2. This allows the recipient to prepare for receipt of that metadata before it starts processing the body, which is useful if the message is being streamed and the recipient wishes to confirm an integrity check on the fly.
3. HTTP/2 doesn't support HTTP 1.1's chunked transfer encoding mechanism, as it provides its own, more efficient, mechanisms for data streaming.


## Transfer-Encoding
1. Tells the receiver what encoding was performed on the message in order for it to be transported safely
2. `Transfer-Encoding` is a hop-by-hop header, that is applied to a message between two nodes, not to a resource itself. Each segment of a multi-node connection can use different `Transfer-Encoding` values.


## Upgrade
1. The `Upgrade` general-header allows the client to specify what additional communication protocols it supports and would like to use if the server finds it appropriate to switch protocols.
2. The server MUST use the `Upgrade` header field within a `101` (Switching Protocols) response to indicate which protocol(s) are being switched.
    <img src="./images/Upgrade1.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
3. The `Upgrade` header field is intended to provide a simple mechanism for transition from HTTP/1.1 to some other, incompatible protocol. 
4. It does so by allowing the client to advertise its desire to use another protocol, such as a later version of HTTP with a higher major version number, even though the current request has been made using HTTP/1.1.
5. This eases the difficult transition between incompatible protocols by allowing the client to initiate a request in the more commonly supported protocol while indicating to the server that it would like to use a "better" protocol if available (where "better" is determined by the server, possibly according to the nature of the method and/or resource being requested).
6. The `Upgrade` header field only applies to switching application-layer protocols upon the existing transport-layer connection. 
7. `Upgrade` cannot be used to insist on a protocol change; its acceptance and use by the server is optional. 
8. The capabilities and nature of the application-layer communication after the protocol change is entirely dependent upon the new protocol chosen, although the first action after changing the protocol MUST be a response to the initial HTTP request containing the Upgrade header field.
9. The `Upgrade` header field only applies to the immediate connection. Therefore, the upgrade keyword MUST be supplied within a `Connection` header field whenever `Upgrade` is present in an HTTP/1.1 message.


## Via
1. 使用首部字段 `Via` 是为了追踪客户端与服务器之间的请求和响应报文的传输路径。
2. 报文经过代理或网关时，会先在首部字段 `Via` 中附加该服务器的信息，然后再进行转发。这个做法和 traceroute 及电子邮件的 Received 首部的工作机制很类似。
3. 首部字段 `Via` 不仅用于追踪报文的转发，还可避免请求回环的发生。所以必须在经过代理时附加该首部字段内容。
    <img src="./images/Via1.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
4. 上图用例中，在经过代理服务器 A 时，`Via` 首部附加了 `1.0 gw.hackr.jp (Squid/3.1)` 这样的字符串值。行头的 `1.0` 是指接收请求的服务器上应用的 HTTP 协议版本。接下来经过代理服务器 B 时亦是如此，在`Via`首部附加服务器信息，也可增加 1 个新的 `Via` 首部写入服务器信息。
5. `Via` 首部是为了追踪传输路径，所以经常会和 `TRACE` 方法一起使用。比如，代理服务器接收到由 `TRACE` 方法发送过来的请求（其中 ` Max-Forwards: 0`）时，代理服务器就不能再转发该请求了。这种情况下，代理服务器会将自身的信息附加到 `Via` 首部后，返回该请求的响应。


## References
* [RFC 2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
* [HTTP: The Definitive Guide](https://book.douban.com/subject/1440226/)
