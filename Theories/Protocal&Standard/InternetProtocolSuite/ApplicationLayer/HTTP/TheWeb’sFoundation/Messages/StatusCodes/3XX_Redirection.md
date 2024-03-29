# 3XX Redirection


<!-- TOC -->

- [3XX Redirection](#3xx-redirection)
    - [`300 Multiple Choices`](#300-multiple-choices)
    - [`301 Moved Permanently`](#301-moved-permanently)
    - [`302 Found`](#302-found)
    - [`303 See Other`](#303-see-other)
    - [`304 Not Modified`](#304-not-modified)
    - [`305 Use Proxy`](#305-use-proxy)
    - [`307 Temporary Redirect`](#307-temporary-redirect)
    - [`308 Permanent Redirect`](#308-permanent-redirect)
    - [区别维度](#区别维度)
        - [重定向是否永久生效](#重定向是否永久生效)
        - [重请求重定向后的 URI 能否改变请求方法](#重请求重定向后的-uri-能否改变请求方法)
        - [重定向的请求是否可缓存](#重定向的请求是否可缓存)
    - [References](#references)

<!-- /TOC -->


## `300 Multiple Choices` 
1. Returned when a client has requested a URL that actually refers to multiple resources, such as a server hosting an English and French version of an HTML document. 
2. This code is returned along with a list of options; the user can then select which one he wants. 
3. The server can include the preferred URL in the `Location` header.


## `301 Moved Permanently`
1. 永久重定向。
2. 告诉客户端请求的资源已经重定向，分配了一个新的固定 URI，之后想要引用这个资源都应该使用新的 URI。
3. 同时在响应中还应该设置 `Location` 头，值为新的 URI。
    <img src="../images/09.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
4. 客户端应该根据新的 URI 重定向。
5. 因为是永久重定向，所以 `301` 的响应可以被缓存。
6. 如果客户端有保存链接的功能，例如收藏夹之类的，也应该更新保存的链接。
7. 尽管规范要求客户端在重定向时不应该修改请求方法，但因为历史原因，某些浏览器可能会做出修改。如果明确的不允许客户端修改请求方法，就应该响应 `308` 状态码。


## `302 Found`
1. 临时重定向。
2. 响应中应该设置 `Location` 头，值为临时的新 URI。
3. 客户端应该根据新的 URI 重定向。但因为是临时的，所以下次请求的时候仍然应该用之前的 URI 而不是 `Location` 头指定的 URI。
4. 和 `301` 一样，客户端也有可能重定向时改变方法。如果明确不允许改变，就应该返回 `307`。


## `303 See Other`
1. 该状态码表示由于请求对应的资源存在着另一个 URI，应使用 `GET` 或 `HEAD` 方法定向获取请求的资源。
2. `303` 状态码和 `302` 状态码有着相同的功能，但 `303` 状态码明确表示客户端应当采用 `GET` 或 `HEAD` 方法获取资源。
3. 因为按照规范，`301` 和 `302` 在重定向时都是不应该更改请求方法的。所以假如用户在未登录时想 `POST`、`PUT` 或 `DELETE` 一个东西，按照逻辑应该重定向到登录界面。而请求登录界面显然应该使用 `GET` 方法，所以按照规范，是不应该返回 `302` 的。（虽然实际情况下，浏览器看到 `302` 仍然会改为 `GET` 重定向，从而可以正确的请求登录页面。但这是不规范的。）
4. 所以规范提出来 `303` 用于这类场景，会明确要求改用 `GET` 或 `HEAD` 方法请求 `Location` 中的 URI。
5. 看起来从 301 到 303 已经可以处理重定向了，但因为实际中约定俗成的会不遵守不准更改方法的规范，所以又出现了 308 和 307。


## `304 Not Modified`
1. 告诉客户端请求的资源没有修改，不用再发送请求，可以继续使用本地缓存。
2. Responses with this status code should not contain an entity body.
    <img src="../images/10.png" width="600" style="display: block; margin: 5px 0 10px 0;" />


## `305 Use Proxy` 
1. Used to indicate that the resource must be accessed through a proxy; the location of the proxy is given in the `Location` header. 
2. It’s important that clients interpret this response relative to a specific resource and do not assume that this proxy should be used for all requests or even all requests to the server holding the requested resource. 
3. This could lead to broken behavior if the proxy mistakenly interfered with a request, and it poses a security hole.


## `307 Temporary Redirect`
1. 和 `302` 唯一的区别是它禁止用户代理在访问重定向 URI 时改变请求方法
2. 看到规范上是这么写的：This status code is similar to 302 (Found), except that it does not allow changing the request method from POST to GET.


## `308 Permanent Redirect`
和 `301` 唯一的区别是它禁止用户代理在访问重定向 URI 时改变请求方法


## 区别维度
### 重定向是否永久生效
`301` 和 `308` 指示永久重定向，用户代理应该做出相应的更新，完全弃用旧的 URI。其他的重定向则表示临时的，客户代理下次请求时还应该使用重定向之前的 URI。

### 重请求重定向后的 URI 能否改变请求方法
1. 看起来规范虽然认为客户代理请求重定向的 URI 时不应该改变请求方法，但确实有用户代理在接收到 `301`、`302` 的重定向时会自动改变请求方法。例如，开始时使用 `POST` 请求，发生重定向后用户代理会改用 `GET` 请求重定向的 URI。
2. `303` 指示用户代理应该使用 `GET` 或 `HEAD` 方法请求重定向的 URI。
3. `307`、`308` 重定向则严格指示不能改变请求方法.

### 重定向的请求是否可缓存
`301` 和 `308` 可缓存


## References
* [rfc7231](https://tools.ietf.org/html/rfc7231)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
