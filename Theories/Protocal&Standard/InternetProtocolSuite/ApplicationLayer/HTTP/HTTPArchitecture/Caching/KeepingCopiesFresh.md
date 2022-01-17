# Keeping Copies Fresh


<!-- TOC -->

- [Keeping Copies Fresh](#keeping-copies-fresh)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [文档过期](#文档过期)
    - [服务器再验证](#服务器再验证)
        - [Weak and Strong Validators](#weak-and-strong-validators)
        - [When to Use Entity Tags and Last-Modified Dates](#when-to-use-entity-tags-and-last-modified-dates)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## 文档过期
1. HTTP 可以通过 `Cache-Control` 和 `Expires` 响应首部为每个文档设定一个过期时间
    <img src="./images/13.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
2. 在文档过期之前，客户端都可以直接使用缓存的副本，而不用向服务器确认。除非是客户端明确要求不适用缓存副本。
3. 如果请求的文档已经过期，缓存就需要向原始服务器进行确认。如果原文档没有修改，则继续向客户端提供缓存的副本，否则就从原始服务器下载新的文档，并缓存。
4. 使用响应首部 `Cache-Control: max-age` 设置过期秒数。旧版本 HTTP/1.0 只能使用 `Expires` 设置过期日期和时间。


## 服务器再验证
1. 缓存副本过期后需要向服务器确认原文件是否修改：
    * 如果原文件发生了变化，则重新获取文件并替换之前的副本；
    * 如果没变化，缓存只需要获取新的首部（其中会包含新的过期时间），然后更新副本的首部。
2. 缓存向服务器在验证时，发送的请求会包含一些条件首部，服务器会验证这些条件首部，只有条件成立时，才会返回新的资源，否则就会让缓存继续使用已有的资源副本。
3. 与缓存相关的两个条件首部是 `If-None-Match` 和 `If-Modified-Since`。后者是 HTTP/1.0 及以前的旧首部。
4. 服务器首次返回资源的时候会通过 `ETag` 首部发送当前资源的实体标签（ETag）；缓存需要再验证时就通过 `If-None-Match` 发回这个 ETag，如果和服务器中的资源一样就说明资源没有修改，否则就是修改了
    <img src="./images/15.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. 如果使用修改时间来再验证，服务器首次返回资源时会通过 `Last-Modified` 告知服务器当前资源的最后修改日期和时间；缓存需要再验证时就通过 `If-Modified-Since` 发回这个之前的修改日期和时间，如果服务器看到资源没有在这个时间后修改就告知缓存可以继续使用副本，否则就返回新的资源副本
    <img src="./images/14.png" width="600" style="display: block; margin: 5px 0 10px 0;" />

### Weak and Strong Validators
1. Caches use entity tags to determine whether the cached version is up-to-date with respect to the server (much like they use last-modified dates). In this way, entity tags and last-modified dates both are cache validators.
2. Servers may sometimes want to allow cosmetic or insignificant changes to documents without invalidating all cached copies. HTTP/1.1 supports “weak validators”, which allow the server to claim “good enough” equivalence even if the contents have changed slightly.
3. Strong validators change any time the content changes. Weak validators allow some content change but generally change when the significant meaning of the content changes. 
4. Some operations cannot be performed using weak validators (such as conditional partial-range fetches), so servers identify validators that are weak with a “W/” prefix:
    ```
    ETag: W/"v2.6"
    If-None-Match: W/"v2.6"
    ```
5. A strog entity tag must change whenever the associated entity value changes in any way. A weak entity tag should change whenever the associated entity changes in a semantically significant way.
6. Note that an origin server must avoid reusing a specific strong entity tag value for two different entities, or reusing a specific weak entity tag value for two semantically different entities. Cache entries might persist for arbitrarily long periods, regardless of expiration times, so it might be inappropriate to expect that a cache will never again attempt to validate an entry using a validator that it obtained at some point in the past.


### When to Use Entity Tags and Last-Modified Dates
1. HTTP/1.1 clients must use an entity tag validator if a server sends back an entity tag. If the server sends back only a `Last-Modified` value, the client can use `If-Modified-Since` validation. If both an entity tag and a last-modified date are available, the client should use both revalidation schemes, allowing both HTTP/1.0 and HTTP/1.1 caches to respond appropriately.
2. HTTP/1.1 origin servers should send an entity tag validator unless it is not feasible to generate one, and it may be a weak entity tag instead of a strong entity tag, if there are benefits to weak validators. Also, it’s preferred to also send a last-modified value.
3. If an HTTP/1.1 cache or server receives a request with both `If-Modified-Since` and entity tag conditional headers, it must not return a `304 Not Modified` response unless doing so is consistent with all of the conditional header fields in the request. 只有两个都满足继续使用缓存的条件才能返回 304，否则还是老老实实使用新的吧。


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)