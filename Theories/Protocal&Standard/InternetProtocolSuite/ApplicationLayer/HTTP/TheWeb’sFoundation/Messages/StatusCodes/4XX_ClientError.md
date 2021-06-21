# 4XX Client Error


<!-- TOC -->

- [XX Client Error](#xx-client-error)
    - [400 Bad Request](#400-bad-request)
    - [401 Unauthorized](#401-unauthorized)
        - [402 Payment Required](#402-payment-required)
    - [403 Forbidden](#403-forbidden)
    - [404 Not Found](#404-not-found)
    - [405 Method Not Allowed](#405-method-not-allowed)
    - [406 Not Acceptable](#406-not-acceptable)
    - [407 Proxy Authentication Required](#407-proxy-authentication-required)
    - [408 Request Timeout](#408-request-timeout)
    - [409 Conflict](#409-conflict)
    - [410 Gone](#410-gone)
    - [411 Length Required](#411-length-required)
    - [412 Precondition Failed](#412-precondition-failed)
    - [413 Payload Too Large](#413-payload-too-large)
    - [414 URI Too Long](#414-uri-too-long)
    - [415 Unsupported Media Type](#415-unsupported-media-type)
    - [416 Requested Range Not Satisfiable](#416-requested-range-not-satisfiable)
    - [417 Expectation Failed](#417-expectation-failed)
    - [418 I'm a teapot](#418-im-a-teapot)
    - [426 Upgrade Required](#426-upgrade-required)
    - [428 Precondition Required](#428-precondition-required)
    - [429 Too Many Requests](#429-too-many-requests)
    - [431 Request Header Fields Too Large](#431-request-header-fields-too-large)
    - [451 Unavailable For Legal Reasons](#451-unavailable-for-legal-reasons)
    - [References](#references)

<!-- /TOC -->


## `400 Bad Request`
Indicates that the server cannot or will not process the request due to something that is perceived to be a client error.


## `401 Unauthorized`
1. Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
2. This status is sent with a `WWW-Authenticate` header that contains information on how to authorize correctly.


### `402 Payment Required`
Currently this status code is not used, but it has been set aside for future use.


## `403 Forbidden`
1. 服务器已经理解请求，但是拒绝执行它。
2. 与 `401` 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。
3. 如果这不是一个 `HEAD` 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。
4. 当然服务器也可以返回一个 `404` 响应，假如它不希望让客户端获得任何信息。


## `404 Not Found`
1. The server can not find requested resource.
2. In the browser, this means the URL is not recognized.
3. In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
4. Servers may also send this response instead of `403` to hide the existence of a resource from an unauthorized client.
5. Often, an entity is included for the client application to display to the user.


## `405 Method Not Allowed`
1. Used when a request is made with a method that is not supported for the requested URL. For example, an API may forbid `DELETE`-ing a resource.
2. 该响应必须返回一个 `Allow` 头信息用以表示出当前资源能够接受的请求方法的列表。
3. 鉴于 `PUT`、`DELETE` 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回 `405` 错误。
4. The two mandatory methods, `GET` and `HEAD`, must never be disabled and should not return this error code.


## `406 Not Acceptable`
1. Clients can specify parameters about what types of entities they are willing to accept. 
2. This code is used when the server has no resource matching the URL that is acceptable for the client. 
3. Often, servers include headers that allow the client to figure out why the request could not be satisfied. 


## `407 Proxy Authentication Required`
1. Like the `401` status code, but used for proxy servers that require authentication for a resource.
2. 代理服务器必须返回一个 `Proxy-Authenticate` 用以进行身份询问。客户端可以返回一个 `Proxy-Authorization` 信息头用以验证。


## `408 Request Timeout`
1. If a client takes too long to complete its request, a server can send back this status code and close down the connection. 
2. The length of this timeout varies from server to server but generally is long enough to accommodate any legitimate request.
3. A server should send the "close" `Connection` header field in the response, since `408` implies that the server has decided to close the connection rather than continue waiting.
4. Also note that some servers merely shut down the connection without sending this message.

## `409 Conflict`
1. Used to indicate some conflict that the request may be causing on a resource.
2. Servers might send this code when they fear that a request could cause a conflict. 
3. 这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。
4. The response should contain a body describing the conflict.


## `410 Gone`
1. Similar to `404`, except that the server once held the resource. 
2. 被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。
3. 如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。
4. 如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用 `404` 状态码。
5. 除非额外说明，否则这个响应是可缓存的。


## `411 Length Required`
Server rejected the request because the `Content-Length` header field is not defined and the server requires it.


## `412 Precondition Failed`
1. Indicates that one or more conditions given in the request header fields evaluated to false when tested on the server.  
2. This response code allows the client to place preconditions on the current resource state (its current  representations and metadata) and, thus, prevent the request method from being applied if the target resource is in an unexpected state. 不懂
3. This happens with conditional requests on methods other than `GET` or `HEAD` when the condition defined by the `If-Unmodified-Since` or `If-None-Match` headers is not fulfilled. 
4. In that case, the request, usually an upload or a modification of a resource, cannot be made and this error response is sent back.


## `413 Payload Too Large`
1. 服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。
2. 此种情况下，服务器可以关闭连接以免客户端继续发送此请求。
3. 如果这个状况是临时的，服务器应当返回一个 `Retry-After` 的响应头，以告知客户端可以在多少时间以后重新尝试。


## `414 URI Too Long`
1. 请求的 URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。
2. 这比较少见，通常的情况包括：本应使用 `POST` 方法的表单提交变成了 `GET` 方法，导致查询字符串（Query String）过长。


## `415 Unsupported Media Type`
Used when a client sends an entity of a content type that the server does not understand or support.


## `416 Requested Range Not Satisfiable`
如果请求中包含了 `Range` 请求头，并且 `Range` 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 `If-Range` 请求头，那么服务器就应当返回 `416` 状态码。


## `417 Expectation Failed`
This response code means the expectation indicated by the `Expect` request header field can't be met by the server.


## `418 I'm a teapot`
[Hyper Text Coffee Pot Control Protocol](https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol)


## `426 Upgrade Required`
1. The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
2. The server sends an `Upgrade` header in a `426` response to indicate the required protocol(s).


## `428 Precondition Required`
1. Indicates that the server requires the request to be conditional.
2. Typically, this means that a required precondition header, such as `If-Match`, is missing.


## `429 Too Many Requests`
The user has sent too many requests in a given amount of time ("rate limiting").


## `431 Request Header Fields Too Large`
1. The server is unwilling to process the request because its header fields are too large.
2. The request MAY be resubmitted after reducing the size of the request header fields.


## `451 Unavailable For Legal Reasons`
The user requests an illegal resource, such as a web page censored by a government.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
