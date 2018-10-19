# Cache
以[文官方档](https://tools.ietf.org/html/rfc7234)为准

## 强缓存和协商缓存
* 通过`Cache-Control`和`Expires`设定的缓存为强缓存，如果命中缓存，不需要发送请求即可
使用缓存；
* 通过`Etag`和`Last-modified`设定的缓存为协商缓存，如果命中缓存，仍然需要向服务器发送
一个请求进行确认（协商），确认缓存可用的话就继续使用缓存。  

![HTTP Cache](./images/HTTP-Cache.jpg)


## 强缓存
### Cache-Control
Define its caching policy  
[文官方档](https://tools.ietf.org/html/rfc7234#section-5.2)

#### Request
##### `max-age`
* The `max-age` request directive indicates that the client is unwilling to
accept a response whose age is greater than the specified number of seconds.  
Unless the `max-stale` request directive is also present, the client is not
willing to accept a stale response.
* This directive uses the token form of the argument syntax: e.g., `max-age=5`
not `max-age="5"`.  A sender SHOULD NOT generate the quoted-string form.
* 应用`HTTP/1.1`版本的缓存服务器遇到同时存在`Expires`首部字段的情况时，会优先处理
`max-age`指令，而忽略掉`Expires`首部字段。而`HTTP/1.0`版本的缓存服务器的情况却相反，
`max-age` 指令会被忽略掉。

##### `max-stale`
* The `max-stale` request directive indicates that the client is willing to
accept a response that has exceeded its freshness lifetime. If `max-stale` is
assigned a value, then the client is willing to accept a response that has
exceeded its freshness lifetime by no more than the specified number of seconds.  
* If no value is assigned to `max-stale`, then the client is willing to accept a
stale response of any age.
* `max-age`是指定多久之前的响应就算过期作废了，`max-stale`是表示作废多久的响应还能接受
。不懂，这个是配合`Expires`使用的？否则为什么不直接把`max-age`设置的长一些？

##### `no-cache`
* The `no-cache` request directive indicates that a cache **must not** use a
stored response to satisfy the request without successful validation on the
origin server.
* As a result, if a proper validation token(ETag) is present, `no-cache` incurs
a roundtrip to validate the cached response, but can eliminate the download if
the resource has not changed.

##### `no-store`
1. The `no-store` request directive indicates that a cache **must not** store
any part of either this request or any response to it. 不仅是不应缓存对该请求的响
应，该请求本身的信息也不应存储。
2. This directive applies to both private and shared caches.  "**must not**
store" in this context means that the cache **must not** intentionally store the
information in non-volatile storage, and **must** make a best-effort attempt to
remove the information from volatile storage as promptly as possible after
forwarding it.
3. This directive is **not** a reliable or sufficient mechanism for ensuring
privacy. In particular, malicious or compromised caches might not recognize or
obey this directive, and communications networks might be vulnerable to
eavesdropping.
4. Note that if a request containing this directive is satisfied from a cache,
the `no-store` request directive does not apply to the already stored response.

##### `no-transform`
1. The `no-transform` request directive indicates that an intermediary (whether
or not it implements a cache) MUST NOT transform the payload.
2. The `Content-Encoding`, `Content-Range`, `Content-Type` headers must not be
modified by a proxy. A non-transparent proxy might, for example, convert between
image formats in order to save cache space or to reduce the amount of traffic
on a slow link. The `no-transform` directive disallows this.

##### `only-if-cached`
1. The `only-if-cached` request directive indicates that the client only wishes
to obtain a stored response.
2. If it receives this directive, a cache **should** either respond using a
stored response that is consistent with the other constraints of the request, or
respond with a `504` (Gateway Timeout) status code.  
3. If a group of caches is being operated as a unified system with good internal
connectivity, a member cache **may** forward such a request within that group
of caches.
4. 看起来是用于一个系统中的多个成员使用同样的共享缓存，这样的好处似乎不仅仅是不用重复请
求，更重要的是保证每个成员都可以加载到同一个版本的资源。

#### Response
##### `must-revalidate`
1. The `must-revalidate` response directive indicates that once it has become
stale, a cache **must not** use the response to satisfy subsequent requests
without successful validation on the origin server.
2. The `must-revalidate` directive is necessary to support reliable operation
for certain protocol features. In all circumstances a cache **must** obey the
`must-revalidate` directive; in particular, if a cache cannot reach the origin
server for any reason, it **must** generate a `504` (Gateway Timeout) response.
3. The `must-revalidate` directive ought to be used by servers if and only if
failure to validate a request on the representation could result in incorrect
operation, such as a silently unexecuted financial transaction.

##### `no-cache`
1. The `no-cache` response directive indicates that the response **must not** be
used to satisfy a subsequent request without successful validation on the origin server. This allows an origin server to prevent a cache from using it to satisfy
a request without contacting it, even by caches that have been configured to
send stale responses.
2. [后续说明](https://tools.ietf.org/html/rfc7234#section-5.2.2.2)没看懂

##### `no-store`
同 request 中的 `no-store`

##### `no-transform`
同 request 中的 `no-transform`

##### `public`
The `public` response directive indicates that any cache **may** store the
response, even if the response would normally be non-cacheable or cacheable only
within a private cache.

##### `private`
1. The `private` response directive indicates that the response message is
intended for a single user and MUST NOT be stored by a shared cache. A private
cache **may** store the response and reuse it for later requests, even if the
response would normally be non-cacheable.
2. `public`指明可向任一方提供缓存，而`private`指明只可向特定用户提供缓存。
3. [后续说明](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)没看懂

##### `proxy-revalidate`
The `proxy-revalidate` response directive has the same meaning as the
`must-revalidate` response directive, except that it does not apply to private
caches.

##### `max-age`
1. The `max-age` response directive indicates that the response is to be
considered stale after its age is greater than the specified number of seconds.
2. This directive uses the token form of the argument syntax: e.g., `max-age=5`
not `max-age="5"`.  A sender **should not** generate the quoted-string form.

##### `s-maxage`
1. The `s-maxage` response directive indicates that, in shared caches, the
maximum age specified by this directive overrides the maximum age specified by
either the `max-age` directive or the `Expires` header field.  
2. 不懂。The `s-maxage` directive also implies the semantics of the
`proxy-revalidate` response directive.
3. 作用于共享缓存（例如代理），而且对 private 缓存无效。
4. This directive uses the token form of the argument syntax: e.g.,
`s-maxage=10` not `s-maxage="10"`.  A sender **should not** generate the
quoted-string form.

### `Expires`
能用`Cache-Control`就不要用`Expires`，过时的标准。


## 协商缓存
缓存的资源到期了，并不意味着资源内容发生了改变，如果和服务器上的资源没有差异，实际上没有
必要再次请求。客户端和服务器端通过某种验证机制验证（协商）当前请求资源是否可以使用缓存。

### `Etag`
Validating cached responses with ETags
1. 浏览器第一次发起一个请求时，服务器可以在响应中设置一个注明缓存有效期的 header，并同
时设置随机字符串（比如一个 hash 值）作为`Etag` header 的值。
2. 此后，被请求的数据如果在服务器端发生了改变，则在服务器上所记录的相应`Etag`会发生改
变，与此前回应给浏览器的将不再是同样的值。
3. 浏览器准备再一次发起该请求时，会先检查缓存，查看上一次请求的回应。如果发现上次回
应时设置的缓存过期时间没到，则直接使用缓存的数据。
4. 如果已经超了缓存的有效期，则必须要联系服务器进行协商验证。浏览器会把上次回应的`Etag`
值作为`If-None-Match` header 的值发送给服务器，服务器检查和当前的`Etag`是否一致，如果
一致就表明所请求的数据一致没有变，则会返回`304`告知，浏览器可以继续使用缓存的数据。

### `Last-modified`
#### 工作原理
1. 浏览器第一次请求一个资源时，响应中设置`Last-modified`注明资源最后修改事件
2. 浏览器再次请求时，请求头部带上`If-Modified-Since`注明之前收到的`Last-modified`的
值。
3. 服务器端收到带`If-Modified-Since`的请求后会去和资源的最后修改时间对比。若修改过就返
回最新资源，若没有修改过则返回 `304`。  

如果响应头中有`Last-modified`而没有`Expire`或`Cache-Control`时，浏览器会有自己
的算法来推算出一个时间缓存该文件多久，不同浏览器得出的时间不一样，所以`Last-modified`
要配合`Expires`/`Cache-Control`使用。

#### 和`Etag`的区别（优先使用`Etag`的原因）
* 某些服务器不能精确得到资源的最后修改时间。
* `Last-modified`只能精确到秒，资源一秒内的多次变化无法识别。
* 对于一些虽然重新生成但是内容不变的资源，使用`Last-modified`就会弃用缓存。
* 服务器会优先验证 ETag。


## Defining optimal Cache-Control policy
![http-cache-decision-tree](./images/http-cache-decision-tree.png)


## Invalidating and updating cached responses
1. All HTTP requests that the browser makes are first routed to the browser
cache to check whether there is a valid cached response that can be used to
fulfill the request.
2. If there's a match, the response is read from the cache, which eliminates
both the network latency and the data costs that the transfer incurs.
3. If you want to update or invalidate a cached response, you change the URL of
the resource and force the user to download the new response whenever its
content changes.
4. Typically, you do this by embedding a fingerprint of the file, or a version
number, in its filename.


## Caching checklist
Some tips and techniques to keep in mind as you work on caching strategy:
* **Use consistent URLs:** if you serve the same content on different URLs, then
that content will be fetched and stored multiple times. Tip: **note that URLs are
case sensitive**.
* **Ensure that the server provides a validation token (ETag):** validation
tokens eliminate the need to transfer the same bytes when a resource has not
changed on the server.
* **Identify which resources can be cached by intermediaries:** those with
responses that are identical for all users are great candidates to be cached by
a CDN and other intermediaries.
* **Determine the optimal cache lifetime for each resource:** different
resources may have different freshness requirements. Audit and determine the
appropriate `max-age` for each one.
* **Determine the best cache hierarchy for your site:** the combination of
resource URLs with content fingerprints and short or no-cache lifetimes for HTML
documents allows you to control how quickly the client picks up updates.
* **Minimize churn:** some resources are updated more frequently than others. If
there is a particular part of a resource (for example, a JavaScript function or
a set of CSS styles) that is often updated, consider delivering that code as a
separate file. Doing so allows the remainder of the content (for example,
library code that doesn't change very often), to be fetched from cache and
minimizes the amount of downloaded content whenever an update is fetched.


## Chrome 相关
### Chrome 的 memory cache 和 disk cache
以一张几十KB的图片为例：
* 从 memory cache 中下载图片，下载时间是 μs 级别的。
* 从 disk cache 中下载图片，下载时间是 ms 级别的。

### Chrome 在不同场景下的 cache 使用
在有缓存的情况下：
* F5 或 ctrl+F5 刷新当前页面，都可能是 memory cache 也可能是 disk cache，目前没有发
现规律。
* 重新打开一个标签页加载，使用 disk cache。Chrome每个标签页使用独立的内存。

### Chrome 会自动直接使用缓存？
不设置 Cache-Control 的情况下，刷新页面，Chrome 会使用 memory cache 或 disk cache，
而根本不会发送请求。同样的页面在FF中测试，还是会先发送 If-None-Match 确认。


***
## References
* [Google Developers - HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
* [HTTP 缓存机制一二三](https://zhuanlan.zhihu.com/p/29750583)
