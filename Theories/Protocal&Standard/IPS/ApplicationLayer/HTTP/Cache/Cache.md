# Cache

***
## **Etag**:  Validating cached responses with ETags
1. 浏览器第一次发起一个请求时，服务器可以在响应中设置一个注明缓存有效期的header，并
同时设置随机字符串（比如一个hash值）作为`Etag` header 的值。
2. 此后，被请求的数据如果在服务器端发生了改变，则在服务器上所记录的相应Etag会发生改
变，与此前回应给浏览器的将不再是同样的值。
3. 浏览器准备再一次发起该请求时，会先检查缓存，查看上一次请求的回应。如果发现上次回
应时设置的缓存过期时间没到，则直接使用缓存的数据。
4. 如果已经超了缓存的有效期，则必须要联系服务器。浏览器会把上次回应的Etag值作为
`If-None-Match` header 的值发送给服务器，服务器检查和当前的Etag是否一致，如果一致就
表明所请求的数据一致没有变，则会返回304告知，浏览器可以继续使用缓存的数据。

<mark>服务器会自动设置Etag？我用PHPStudy随便加载一张图片都会有</mark>


***
## **Cache-Control**: Define its caching policy
### `no-cache`
1. `no-cache` indicates that the returned response can't be used to satisfy a
subsequent request to the same URL without first checking with the server if the
response has changed.  
2. As a result, if a proper validation token (ETag) is present,
`no-cache` incurs a roundtrip to validate the cached response, but can eliminate
the download if the resource has not changed.

### `no-store`
1. By contrast, `no-store` is much simpler. It simply disallows the browser and
all intermediate caches from storing any version of the returned response.  
2. For example, one containing private personal or banking data. Every time the
user requests this asset, a request is sent to the server and a full response is
downloaded.

### `public`
1. If the response is marked as `public`, then it can be cached, even if it has
HTTP authentication associated with it, and even when the response status code
isn't normally cacheable.
2. Most of the time, `public` isn't necessary, because explicit caching
information (like "max-age") indicates that the response is cacheable anyway.

### `private`
1. By contrast, the browser can cache `private` responses. However, these
responses are typically intended for a single user, so an intermediate cache is
not allowed to cache them.
2. For example, a user's browser can cache an HTML page with private user
information, but a CDN can't cache the page.

### `max-age`
This directive specifies the maximum time in seconds that the fetched response
is allowed to be reused from the time of the request.

***
## Defining optimal Cache-Control policy
![http-cache-decision-tree](http-cache-decision-tree.png)


***
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


***
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
appropriate max-age for each one.
* **Determine the best cache hierarchy for your site:** the combination of
resource URLs with content fingerprints and short or no-cache lifetimes for HTML
documents allows you to control how quickly the client picks up updates.
* **Minimize churn:** some resources are updated more frequently than others. If
there is a particular part of a resource (for example, a JavaScript function or
a set of CSS styles) that is often updated, consider delivering that code as a
separate file. Doing so allows the remainder of the content (for example,
library code that doesn't change very often), to be fetched from cache and
minimizes the amount of downloaded content whenever an update is fetched.


***
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
