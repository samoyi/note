# CORS Access Control


<!-- TOC -->

- [CORS Access Control](#cors-access-control)
    - [Summary](#summary)
    - [What requests use CORS?](#what-requests-use-cors)
    - [Functional overview](#functional-overview)
    - [涉及的 Headers](#涉及的-headers)
        - [Request](#request)
        - [Response](#response)
    - [Access-Control-Allow-Origin](#access-control-allow-origin)
    - ["Simple requests"](#simple-requests)
    - ["Preflighted requests"](#preflighted-requests)
        - [预检请求相关 header](#预检请求相关-header)
    - [Simple response header](#simple-response-header)
    - [Requests with credentials](#requests-with-credentials)
    - [Chrome 中跨域 POST 请求 localhost 时的问题](#chrome-中跨域-post-请求-localhost-时的问题)
        - [问题情况](#问题情况)
        - [原因及解决方法](#原因及解决方法)
    - [References](#references)

<!-- /TOC -->


## Summary
1. Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin. 
2. A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, or port) from its own.
3. For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts. （并不一定是浏览器限制了发起跨站请求，也可能是跨站请求可以正常发起，但是返回结果被浏览器拦截了。）For example, `XMLHttpRequest` and the Fetch API follow the same-origin policy. This means that a web application using those APIs can only request resources from the same origin the application was loaded from unless the response from other origins includes the right CORS headers.
4. The CORS mechanism supports secure cross-origin requests and data transfers between browsers and servers. Modern browsers use CORS in APIs such as XMLHttpRequest or Fetch to mitigate the risks of cross-origin HTTP requests.


## What requests use CORS?
This cross-origin sharing standard can enable cross-site HTTP requests for:
* Invocations of the `XMLHttpRequest` or Fetch APIs.
* Web Fonts (for cross-domain font usage in `@font-face` within CSS), so that servers can deploy TrueType fonts that can only be cross-site loaded and used by web sites that are permitted to do so.
* WebGL textures.
* Images/video frames drawn to a canvas using `drawImage()`.
* CSS Shapes from images.


## Functional overview
1. The Cross-Origin Resource Sharing standard works by adding new HTTP headers that let servers describe which origins are permitted to read that information from a web browser. 
2. Additionally, for HTTP request methods that can cause side-effects on server data (in particular, HTTP methods other than `GET`, or `POST` with certain MIME types), the specification mandates that browsers "preflight" the request, soliciting supported methods from the server with the HTTP `OPTIONS` request method, and then, upon "approval" from the server, sending the actual request. 
3. Servers can also inform clients whether "credentials" (such as Cookies and HTTP Authentication) should be sent with requests.
4. 也就是说，服务器要先控制哪些源可以访问，然后再控制这些源可以进行怎样的访问。
5. CORS failures result in errors, but for security reasons, specifics about the error are not available to JavaScript. All the code knows is that an error occurred. The only way to determine what specifically went wrong is to look at the browser's console for details.


## 涉及的 Headers
### Request
* `Origin`
* `Access-Control-Request-Method`
* `Access-Control-Request-Headers`

### Response
* `Access-Control-Allow-Origin`
* `Access-Control-Expose-Headers`
* `Access-Control-Max-Age`
* `Access-Control-Allow-Credentials`
* `Access-Control-Allow-Methods`
* `Access-Control-Allow-Headers`


## Access-Control-Allow-Origin
1. A returned resource may have one Access-Control-Allow-Origin header, with the following syntax:
    ``
    Access-Control-Allow-Origin: <origin> | *
    ```
2. `Access-Control-Allow-Origin` specifies either a single origin, which tells browsers to allow that origin to access the resource; or else — for requests without credentials — the "`*`" wildcard, to tell browsers to allow any origin to access the resource.
3. For example, to allow code from the origin `https://mozilla.org` to access the resource, you can specify:
    ```
    Access-Control-Allow-Origin: https://mozilla.org
    Vary: Origin
    ```
4. If the server specifies a single origin (that may dynamically change based on the requesting origin as part of a white-list) rather than the "`*`" wildcard, then the server should also include `Origin` in the `Vary` response header — to indicate to clients that server responses will differ based on the value of the `Origin` request header.
5. The `Origin` header indicates the origin of the cross-site access request or preflight request. Note that in any access control request, the `Origin` header is always sent.


## "Simple requests"
1. Some requests don’t trigger a CORS preflight. Those are called “simple requests” in this article, though the Fetch spec (which defines CORS) doesn’t use that term. 
2. A “simple request” is one that **meets all the following conditions**:
    * The only allowed methods are:
        * `GET`
        * `HEAD`
        * `POST`
    * The only headers which are allowed to be manually set are those which the Fetch spec defines as being a [CORS-safelisted request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
        * `Accept`
        * `Accept-Language`
        * `Content-Language`
        * `Content-Type`. The only allowed values for the `Content-Type` header are:
            * `application/x-www-form-urlencoded`
            * `multipart/form-data`
            * `text/plain`
        * `Last-Event-ID`
        * `DPR`
        * `Save-Data`
        * `Viewport-Width`
        * `Width`
    * No event listeners are registered on any `XMLHttpRequestUpload` object used in the request; these are accessed using the `XMLHttpRequest.upload` property.
    * No `ReadableStream` object is used in the request.


## "Preflighted requests"
1. Unlike “simple requests”, "preflighted" requests first send an HTTP request by the `OPTIONS` method to the resource on the other domain, to determine if the actual request is safe to send. 
2. Cross-site requests are preflighted like this since they may have implications to user data.
3. The following is an example of a request that will be preflighted:
    ```
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://bar.other/resources/post-here/');
    xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.onreadystatechange = handler;
    xhr.send('<person><name>Arun</name></person>'); 
    ```
4. The example above creates an XML body to send with the `POST` request. Also, a non-standard HTTP `X-PINGOTHER` request header is set. Such headers are not part of HTTP/1.1, but are generally useful to web applications. 
5. Since the request uses a `Content-Type` of `application/xml`, and since a custom header is set, this request is preflighted
    <img src="./images/01.png" width="600" style="display: block; margin: 5px 0 10px 0;" />

### 预检请求相关 header
1. 这个 `OPTION` 请求中有两个跨域相关的 header：
    * `Access-Control-Request-Method: POST`: 告知服务器稍后的实际请求将要使用的请求方法。
    * `Access-Control-Request-Headers: X-PINGOTHER, Content-Type`: 告知服务器稍后的实际请求将会设置的 header。
2. 服务器据此决定，该实际请求是否被允许。如果允许，对 `OPTION` 的响应会带上以下的响应 header
    * `Access-Control-Allow-Origin: http://foo.example`：允许发起跨域请求的源
    * `Access-Control-Allow-Methods: POST, GET, OPTIONS`：服务器允许客户端使用 `POST`, `GET` 和 `OPTIONS` 方法发起跨域请求。
    * `Access-Control-Allow-Headers: X-PINGOTHER, Content-Type`：服务器允许跨域请求中携带的 header
    * `Access-Control-Max-Age: 86400`：该响应的有效时间为 86400 秒，也就是 24 小时。在有效时间内，浏览器无须为同一请求再次发起预检请求。请注意，浏览器自身维护了一个最大有效时间，如果该首部字段的值超过了最大有效时间，将不会生效。
3. Chrome 中测试发现，如果 `Access-Control-Request-Method` 是非简单请求的方法，而 `Access-Control-Request-Headers` 是简单请求的 header，则不会发送 `Access-Control-Request-Headers`；如果 `Access-Control-Request-Headers` 是非简单请求的，而`Access-Control-Request-Method` 是简单请求的，仍然会发送 `Access-Control-Request-Method`。
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
4. 如果响应只设置了 `Access-Control-Allow-Origin`，则首先会报错：`Method INPUT is not allowed by Access-Control-Allow-Methods in preflight response.`
5. 如果 method 改为比如 `GET`，则报错是：`Request header field From is not allowed by Access-Control-Allow-Headers in preflight response.`
6. 如果实际请求的方法是 `GET`、`HEAD` 或 `POST`，即使因为其他原因触发了 preflight，服务器端所设置的 `Access-Control-Allow-Methods` 也不会对这三个安全的方法进行限制。也就是说 `Access-Control-Allow-Methods` 设置的是：不安全的方法中，哪些是被允许的。


## Simple response header
1. A simple response header (or a CORS-safelisted response header) is an HTTP header which has been safelisted so that it will not be filtered when responses are processed by CORS, since they're considered safe.
2. By default, only the 6 simple response headers are exposed:
    * `Cache-Control`
    * `Content-Language`
    * `Content-Type`
    * `Expires`
    * `Last-Modified`
    * `Pragma`
3. The `Access-Control-Expose-Headers` response header indicates which headers can be exposed as part of the response by listing their names. If you want clients to be able to access other headers, you have to list them using the
`Access-Control-Expose-Headers` header:
    ```
    'Access-Control-Expose-Headers': 'Age, Etag',
    ```
4. 我在 AJAX 中试图通过 `xhr.getResponseHeader('Etag')` 读取响应的 ETag 时，如果服务器没有设置相应的 `Access-Control-Expose-Headers`，Chrome 报错：`Refused to get unsafe header "Etag"`


## Requests with credentials
1. By default, in cross-site `XMLHttpRequest` or Fetch invocations, browsers will not send credentials (HTTP cookies and HTTP Authentication). 
2. A specific flag has to be set on the `XMLHttpRequest` object or the `Request` constructor when it is invoked
    ```js
    // 请求
    xhr.withCredentials = true;
    xhr.send();
    ```
3. 虽然客户端可以发送凭证，但还需要服务端允许才能成功。服务端必须要把 response 的 `Access-Control-Allow-Credentials` 首部设为 `true` 才能使该携带 credentials 的跨域请求成功
    ```js
    // 响应
    if (req.url !== '/favicon.ico'){
        console.log(req.method); // 只有一个 GET
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    ```
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px 0; background: white;" />
4. 如果服务端没有这样设置，则浏览器会报错
    ```
    Request header field withcredentials is not allowed by Access-Control-Allow-Headers in preflight response.
    ```
5. 另外，如果要发送 credentials，则响应首部 `Access-Control-Allow-Origin` 不能设置为通配符，必须填具体的 origin。否则会报错
    ```
    The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. 
    ```
6. 不过携带 credentials 的跨域请求并不会触发 preflight。


## Chrome 中跨域 POST 请求 localhost 时的问题
### 问题情况
1. 我从 `localhost:8080` 发送 `POST` 请求到 `localhost`, `Content-Type` 为 `application/json`
2. 如果我只设置 `Access-Control-Allow-Origin`，提示我没有设置 `Access-Control-Allow-Headers`，这很正常。
3. 但当我也设置了 `Access-Control-Allow-Headers` 之后，又告诉我没有设置 `Access-Control-Allow-Origin`。
4. 在 Firefox 则可以正常请求。

### 原因及解决方法
1. 没有看到很明确的问题描述，但找到了 chromium 的一个 issue:
[Access-Control-Allow-Origin: * doesn't match localhost](https://bugs.chromium.org/p/chromium/issues/detail?id=67743)
2. 没有找到从代码上解决的方法，但上面的 issue 中提到 Chrome [跨域插件](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) 可以在开发时避免该问题的出现。
3. 因为不能从代码上解决，所以在应用上线时不要跨域请求 localhost。（127.0.0.1也一样）


## References
* [MDN 中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
* [MDN 英文](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [CORS-safelisted request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
* [Simple response header](https://developer.mozilla.org/en-US/docs/Glossary/Simple_response_header)
* [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
