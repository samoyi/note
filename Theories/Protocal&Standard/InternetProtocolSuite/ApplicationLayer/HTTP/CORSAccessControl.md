# CORS Access Control


## "Simple requests"
A request that doesn’t trigger a CORS preflight request is one that meets all
the following conditions:
* The only allowed methods are:
    * `GET`
    * `HEAD`
    * `POST`
* The only headers which are allowed to be manually set are those which the
Fetch spec defines as being a [CORS-safelisted request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
    * `Accept`
    * `Accept-Language`
    * `Content-Language`
    * `Content-Type`. The only allowed values for the Content-Type header are:
        * `application/x-www-form-urlencoded`
        * `multipart/form-data`
        * `text/plain`
    * `Last-Event-ID`
    * `DPR`
    * `Save-Data`
    * `Viewport-Width`
    * `Width`
* No event listeners are registered on any `XMLHttpRequestUpload` object used in
 the request; these are accessed using the `XMLHttpRequest.upload` property.
* No `ReadableStream` object is used in the request.


## "Preflighted requests"
1. Unlike “simple requests”, "preflighted" requests first send an HTTP request
by the `OPTIONS` method to the resource on the other domain, in order to
determine whether the actual request is safe to send. Cross-site requests are
preflighted like this since they may have implications to user data.
2. 如果一个跨域请求不是简单请求，则客户端首先会使用发送一个`OPTION`请求，询问服务器是
否支持该跨域请求的设置。
3. Along with the OPTIONS request, two other request headers are sent:
    * `Access-Control-Request-Method`: notifies the server which HTTP method
    will be used when the actual request is made.
    * ` Access-Control-Request-Headers`: notifies the server which HTTP headers
    will be used when the actual request is made.
4. 服务器通过设置response首部的`Access-Control-Allow-Methods`和/或
`Access-Control-Allow-Headers`来设置允许的跨域方法和首部字段。
5. 如果实际请求的方法`GET`、`HEAD`或`POST`，即使因为其他原因出发了Preflight，服务器端
所设置的`Access-Control-Allow-Methods`也不会对着三个安全的方法进行限制。也就是说
`Access-Control-Allow-Methods`设置的是：不安全的方法中，哪些是被允许的。






https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

https://secure.php.net/manual/en/wrappers.php.php

https://stackoverflow.com/questions/7067966/how-to-allow-cors

https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type





## References
* [MDN 中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
* [MDN 英文](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [CORS-safelisted request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
