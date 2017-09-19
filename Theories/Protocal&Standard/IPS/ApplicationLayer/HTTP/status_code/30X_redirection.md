# 30X 重定向状态码的分析


## 301 Moved Permanently
1. Indicates that the target resource has been assigned a new **permanent** URI
    and any future references to this resource ought to use one of the enclosed
    URIs.
2. The server **should** generate a Location header field in the response
    containing a preferred URI reference for the new permanent URI.
3. The server's response payload usually contains a short hypertext note with a
    hyperlink to the new URI(s).
4. The user agent **may** use the Location field value for automatic redirection.
5. Clients with link-editing capabilities ought to automatically re-link
    references to the effective request URI to one or more of the new references
    sent by the server, where possible.
6. For historical reasons, a user agent **may** change the request method from
    POST to GET for the subsequent request. If this behavior is undesired, the
    307(Temporary Redirect) status code can be used instead.
7. A 301 response is cacheable by default; i.e., unless otherwise indicated by
    the method definition or explicit cache controls

## 302 Found
1. The 302 (Found) status code indicates that the target resource resides
    **temporarily** under a different URI.
2. The server's response payload usually contains a short hypertext note with a
   hyperlink to the different URI(s).
3. The server **should** generate a Location header field in the response
   containing a URI reference for the different URI.
4. The user agent **may** use the Location field value for automatic redirection.
5. Since the redirectionmight be altered on occasion, the client ought to
    **continue** to use the effective request URI for future requests.
6. For historical reasons, a user agent **may** change the request method from
    POST to GET for the subsequent request.  If this behavior is undesired, the
    307 (Temporary Redirect) status code can be used instead.

## 303 See Other
303的意思并不是说“我更新了资源，你重新请求新的”，而是“你不应该对我这个URI进行POST，
你还是来GET请求另一个URI吧”。比如用户想POST上传图片，但其实他并没有登录，所以服务器
返回303并附上登录页面URI，告诉用户代理你先GET这个登录页面进行登录再说。
<mark>没看懂rfc7231的说明</mar>

## 307 Temporary Redirect
和302唯一的区别是它禁止用户代理在访问重定向URI时改变请求方法

## 308 Permanent Redirect
和301唯一的区别是它禁止用户代理在访问重定向URI时改变请求方法


## 区别
* ### 重定向是否永久生效
301和308 指示永久重定向，用户代理应该做出相应的更新，完全弃用旧的URI。其他的重定向则表示
临时的，客户代理下次请求时还应该使用重定向之前的URI。

* ### 重请求重定向后的URI能否改变请求方法
    1. 看起来规范虽然认为客户代理请求重定向的URI时不应该改变请求方法，但确实有用户代理在
        接收到301、302的重定向时会自动改变请求方法。例如，开始时使用POST请求，发生重定向
        后用户代理会改用GET请求重定向的URI。
    2. 303指示用户代理应该使用GET方法请求重定向的URI。
    2. 307、308重定向则严格指示不能改变请求方法.

* ### 重定向的请求是否可缓存
301和308可缓存


## References
* [rfc7231](https://tools.ietf.org/html/rfc7231)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
