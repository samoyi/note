# 5XX Server Error


## `500 Internal Server Error`
The server has encountered a situation it doesn't know how to handle.


## `501 Not Implemented`
1. The request method is not supported by the server and cannot be handled.
2. The only methods that servers are required to support (and therefore that
must not return this code) are `GET` and `HEAD`.


## `502 Bad Gateway`
This error response means that the server, while working as a gateway to get a
response needed to handle the request, got an invalid response.


## `503 Service Unavailable`
1. The server is not ready to handle the request.
2. Common causes are a server that is down for maintenance or that is overloaded.
3. Note that together with this response, a user-friendly page explaining the
problem should be sent.
4. This responses should be used for temporary conditions and the `Retry-After`
HTTP header should, if possible, contain the estimated time before the recovery
of the service.
5. The webmaster must also take care about the caching-related headers that are
sent along with this response, as these temporary condition responses should
usually not be cached.


## `504 Gateway Timeout`
This error response is given when the server is acting as a gateway and cannot
get a response in time.


## `505 HTTP Version Not Supported`
The HTTP version used in the request is not supported by the server.


## `511 Network Authentication Required`
The `511` status code indicates that the client needs to authenticate to gain
network access.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
