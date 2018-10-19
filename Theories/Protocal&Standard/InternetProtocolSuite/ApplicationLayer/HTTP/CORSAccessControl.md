# CORS Access Control

## TODO
* 除了`Access-Control-Allow-Origin`，其他限制的原因是什么？比如为什么响应的`Age`
header 看起来好像不会引发什么危险性，但仍然需要设置`Access-Control-Expose-Headers`之
后客户端才能读取。


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
1. 如果一个跨域请求不是简单请求，则客户端首先会使用发送一个`OPTION`请求，询问服务器是
否支持该跨域请求的设置。
2. 这个`OPTION`请求中有两个跨域相关的 header：
    * `Access-Control-Request-Method`:告知服务器稍后的实际请求将要使用的请求方法。
    * `Access-Control-Request-Headers`: 告知服务器稍后的实际请求将会设置的 header。
3. Chrome 中测试发现，如果`Access-Control-Request-Method`是非简单请求的方法，而
`Access-Control-Request-Headers`是简单请求的 header，则不会发送
`Access-Control-Request-Headers`；如果`Access-Control-Request-Headers`是非简单请求
的，而`Access-Control-Request-Method`是简单请求的，仍然会发送`Access-Control-Request-Method`。
    ```js
    // 请求
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function(){
        if (xhr.readyState === 4 ){
            if ((xhr.status>=200 && xhr.status<300) || xhr.status === 304){
                console.log(xhr.responseText);
            }
        }
    });

    xhr.open('INPUT', 'http://localhost:3000?name=33&age=22', true); // 非简单请求 method
    xhr.setRequestHeader("From", "https://github.com/samoyi"); // 非简单请求 header
    xhr.send();
    ```
    OPTIONS 请求相关 header
    ```
    OPTIONS /?name=33&age=22 HTTP/1.1
    Access-Control-Request-Method: INPUT
    Access-Control-Request-Headers: from
    ```
4. 如果响应只设置了`Access-Control-Allow-Origin`，则首先会报错：
`Method INPUT is not allowed by Access-Control-Allow-Methods in preflight response.`
5. 如果 method 改为比如`GET`，则报错是：
`Request header field From is not allowed by Access-Control-Allow-Headers in preflight response.`
6. 服务器通过设置 response 首部的`Access-Control-Allow-Methods`和
`Access-Control-Allow-Headers`来设置允许的跨域方法和首部字段。
    ```js
    // 响应
    require('http').createServer((req, res)=>{
        if (req.url !== '/favicon.ico'){
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

            res.setHeader('Access-Control-Allow-Methods', 'INPUT');
            // 如果允许多个方法，用逗号隔开
            // res.setHeader('Access-Control-Allow-Methods', 'DELETE, INPUT, TRACE');

            res.setHeader('Access-Control-Allow-Headers', 'From');

        }
        res.end('roger that');
    }).listen(3000);
    ```
7. 如果实际请求的方法是`GET`、`HEAD`或`POST`，即使因为其他原因触发了 preflight，服务
器端所设置的`Access-Control-Allow-Methods`也不会对这三个安全的方法进行限制。也就是说
`Access-Control-Allow-Methods`设置的是：不安全的方法中，哪些是被允许的。
8. `Access-Control-Max-Age` gives the value in seconds for how long the response
to the preflight request can be cached for without sending another preflight
request. Note that each browser has a maximum internal value that takes
precedence when the `Access-Control-Max-Age` is greater.


## Requests with credentials
1. 跨域请求默认并不会发送 credentials，但如果设置了使其可以发送，则还必须要经过服务器端
的许可才行。
2. 服务器必须要把 response 的`Access-Control-Allow-Credentials`首部设为`true`才能使
该携带 credentials 的跨域请求成功。
2. 如果发送 credentials，则响应首部`Access-Control-Allow-Origin`不能设置为通配符，必
须填具体的 origin。
3. 不过携带 credentials 的跨域请求并不会触发 preflight。

```js
// 请求
xhr.withCredentials = true;
xhr.send();
```
```js
if (req.url !== '/favicon.ico'){
    console.log(req.method); // 只有一个 GET
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Credentials', true);
}
```


## Simple response header
1. A simple response header (or a CORS-safelisted response header) is an HTTP
header which has been safelisted so that it will not be filtered when responses
are processed by CORS, since they're considered safe.
2. By default, only the 6 simple response headers are exposed:
    * `Cache-Control`
    * `Content-Language`
    * `Content-Type`
    * `Expires`
    * `Last-Modified`
    * `Pragma`
3. The `Access-Control-Expose-Headers` response header indicates which headers
can be exposed as part of the response by listing their names. If you want
clients to be able to access other headers, you have to list them using the
`Access-Control-Expose-Headers` header:
    ```
    'Access-Control-Expose-Headers': 'Age, Etag',
    ```
4. 我在 AJAX 中试图通过`xhr.getResponseHeader('Etag')`读取响应的 ETag 时，如果服务
器没有设置相应的`Access-Control-Expose-Headers`，Chrome报错：`Refused to get
unsafe header "Etag"`


## Chrome 中跨域 POST 请求 localhost 时的问题
### 问题情况
1. 我从`localhost:8080`发送`POST`请求到`localhost`,`Content-Type`为
`application/json`
2. 如果我只设置`Access-Control-Allow-Origin`，提示我没有设置`Access-Control-Allow-
Headers`，这很正常。
3. 但当我也设置了`Access-Control-Allow-Headers`之后，又告诉我没有设置`Access-
Control-Allow-Origin`。
4. 在Firefox则可以正常请求。

### 原因及解决方法
1. 没有看到很明确的问题描述，但找到了chromium的一个issue:
[Access-Control-Allow-Origin: * doesn't match localhost](https://bugs.chromium.org/p/chromium/issues/detail?id=67743)
2. 没有找到从代码上解决的方法，但上面的issue中提到Chrome[跨域插件](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)可以在开发时避免该问题的出现。
3. 因为不能从代码上解决，所以在应用上线时不要跨域请求localhost。（127.0.0.1也一样）


## References
* [MDN 中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
* [MDN 英文](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [CORS-safelisted request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
* [Simple response header](https://developer.mozilla.org/en-US/docs/Glossary/Simple_response_header)
* [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
