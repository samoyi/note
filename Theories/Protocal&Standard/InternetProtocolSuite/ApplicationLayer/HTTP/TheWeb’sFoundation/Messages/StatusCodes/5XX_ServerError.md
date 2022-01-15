# 5XX Server Error


<!-- TOC -->

- [5XX Server Error](#5xx-server-error)
    - [`500 Internal Server Error`](#500-internal-server-error)
    - [`501 Not Implemented`](#501-not-implemented)
    - [`502 Bad Gateway`](#502-bad-gateway)
    - [`503 Service Unavailable`](#503-service-unavailable)
    - [`504 Gateway Timeout`](#504-gateway-timeout)
    - [`505 HTTP Version Not Supported`](#505-http-version-not-supported)
    - [`511 Network Authentication Required`](#511-network-authentication-required)
    - [References](#references)

<!-- /TOC -->


## `500 Internal Server Error`
The server has encountered a situation it doesn't know how to handle.


## `501 Not Implemented`
1. 客户端发起的请求超出服务器的能力范围。比如不能识别或者没有能力支持请求的方法。
2. 如果有能力支持请求的方法但认为该请求不应该使用该方法，那就应该返回状态 `405 Method Not Allowed`。


## `502 Bad Gateway`
通信链路上的网关或代理服务器从上游服务器收到了一个不可用的响应，会返回这个状态。


## `503 Service Unavailable`
1. 服务器暂时不能满足请求。
2. 如果服务器知道之后什么时候可以恢复，应该在响应里包括响应首部 `Retry-After` 告知客户端之后重试。


## `504 Gateway Timeout`
网关或代理服务器一直没有从上游等到响应，会返回这个状态。


## `505 HTTP Version Not Supported`
1. Indicates that the server does not support, or refuses to support, the major version of HTTP that was used in the request message.  
2. The server SHOULD generate a representation for the `505` response that describes why that version is not supported and what other protocols are supported by that server.
3. 看起来和 `426 Upgrade Required` 比较类似，不过 426 只是说了要升级协议，但没有明确说是 HTTP 协议。


## `511 Network Authentication Required`
The `511` status code indicates that the client needs to authenticate to gain network access.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
