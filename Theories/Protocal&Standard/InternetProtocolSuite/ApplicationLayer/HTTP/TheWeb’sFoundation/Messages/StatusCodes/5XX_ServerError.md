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
1. Indicates that the server does not support the functionality required to fulfill the request.  
2. This is the appropriate response when the server does not recognize the request method and is not capable of supporting it for any resource.
3. If the server does recognize the method, but intentionally does not support it, the appropriate response is `405 Method Not Allowed`.


## `502 Bad Gateway`
Indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.


## `503 Service Unavailable`
1. Used to indicate that the server currently cannot service the request but will be able to in the future. 
2. If the server knows when the resource will become available, it can include a `Retry-After` header in the response.
3. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.


## `504 Gateway Timeout`
This error response is given when the server is acting as a gateway and cannot get a response in time.


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
