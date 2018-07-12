# 4XX Client Error

## `400 Bad Request`
This response means that server could not understand the request due to invalid
syntax.


## `401 Unauthorized`
1. 该状态码表示发送的请求需要有通过 HTTP 认证（BASIC 认证、DIGEST 认证）的认证信息。
另外若之前已进行过 1 次请求，则表示用 户认证失败。
2. 返回含有 `401` 的响应必须包含一个适用于被请求资源的 `WWW-Authenticate` 首部用以质
询（challenge）用户信息。当浏览器初次接收到 `401` 响应，会弹出认证用的对话窗口。


## `403 Forbidden`
1. 服务器已经理解请求，但是拒绝执行它。
2. 与 `401` 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。
3. 如果这不是一个 `HEAD` 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在
实体内描述拒绝的原因。当然服务器也可以返回一个 `404` 响应，假如它不希望让客户端获得任何
信息。


## `404 Not Found`
1. The server can not find requested resource.
2. In the browser, this means the URL is not recognized.
3. In an API, this can also mean that the endpoint is valid but the resource
itself does not exist.
4. Servers may also send this response instead of 403 to hide the existence of a
 resource from an unauthorized client.


## `405 Method Not Allowed`
1. The request method is known by the server but has been disabled and cannot be
 used. For example, an API may forbid DELETE-ing a resource.
2. 该响应必须返回一个 `Allow` 头信息用以表示出当前资源能够接受的请求方法的列表。 　　
3. 鉴于 `PUT`、`DELETE` 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不
支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回 `405` 错误。
4. The two mandatory methods, `GET` and `HEAD`, must never be disabled and
should not return this error code.


## `406 Not Acceptable`
不懂
This response is sent when the web server, after performing server-driven
content negotiation, doesn't find any content following the criteria given by
the user agent.


## `407 Proxy Authentication Required`
1. This is similar to `401` but authentication is needed to be done by a proxy.
2. 代理服务器必须返回一个 `Proxy-Authenticate` 用以进行身份询问。客户端可以返回一个
`Proxy-Authorization` 信息头用以验证。


## `408 Request Timeout`
1. This response is sent on an idle connection by some servers, even without an
y previous request by the client.
2. It means that the server would like to shut down this unused connection.
3. This response is used much more since some browsers, like Chrome, Firefox 27+
, or IE9, use HTTP pre-connection mechanisms to speed up surfing.
4. Also note that some servers merely shut down the connection without sending
this message.


## `409 Conflict`
1. This response is sent when a request conflicts with the current state of the
server.
2. 这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的
请求。
3. 该响应应当包含足够的信息以便用户发现冲突的源头。


## `410 Gone`
1. 被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为
是永久性的。
2. 如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。
3. 如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用 `404` 状态码。
4. 除非额外说明，否则这个响应是可缓存的。


## `411 Length Required`
Server rejected the request because the `Content-Length` header field is not
defined and the server requires it.


## `412 Precondition Failed`
1. 服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。
2. 这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此
避免该请求方法被应用到其希望的内容以外的资源上。


## `413 Payload Too Large`
1. 服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范
围。
2. 此种情况下，服务器可以关闭连接以免客户端继续发送此请求。
3. 如果这个状况是临时的，服务器应当返回一个 `Retry-After` 的响应头，以告知客户端可以在
多少时间以后重新尝试。


## `414 URI Too Long`
1. 请求的URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。
2. 这比较少见，通常的情况包括：本应使用 `POST` 方法的表单提交变成了 `GET` 方法，导致查
询字符串（Query String）过长。


## `415 Unsupported Media Type`
The media format of the requested data is not supported by the server, so the
server is rejecting the request.


## `416 Requested Range Not Satisfiable`
如果请求中包含了 `Range` 请求头，并且 `Range` 中指定的任何数据范围都与当前资源的可用范
围不重合，同时请求中又没有定义 `If-Range` 请求头，那么服务器就应当返回 `416` 状态码。


## `417 Expectation Failed`
This response code means the expectation indicated by the `Expect` request
header field can't be met by the server.


## `418 I'm a teapot`
[Hyper Text Coffee Pot Control Protocol](https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol)


## `426 Upgrade Required`
1. The server refuses to perform the request using the current protocol but
might be willing to do so after the client upgrades to a different protocol.
2. The server sends an `Upgrade` header in a `426` response to indicate the
required protocol(s).


## `428 Precondition Required`
1. The origin server requires the request to be conditional.
2. Intended to prevent the 'lost update' problem, where a client `GET`s a
resource's state, modifies it, and `PUT`s it back to the server, when meanwhile
a third party has modified the state on the server, leading to a conflict.


## `429 Too Many Requests`
The user has sent too many requests in a given amount of time ("rate limiting").


## `431 Request Header Fields Too Large`
1. The server is unwilling to process the request because its header fields are
too large.
2. The request MAY be resubmitted after reducing the size of the request header
fields.


## `451 Unavailable For Legal Reasons`
The user requests an illegal resource, such as a web page censored by a
government.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
