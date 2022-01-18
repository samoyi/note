# Controlling Cachability


<!-- TOC -->

- [Controlling Cachability](#controlling-cachability)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [`No-Cache` 和 `No-Store`](#no-cache-和-no-store)
    - [`Max-Age`](#max-age)
    - [`Expires` Response Headers](#expires-response-headers)
    - [`Must-Revalidate`](#must-revalidate)
    - [Heuristic Expiration](#heuristic-expiration)
    - [客户端新鲜度控制](#客户端新鲜度控制)
        - [Cache-Control request directives](#cache-control-request-directives)
            - [`max-stale` 和 `max-stale=<s>`](#max-stale-和-max-stales)
            - [`min-fresh = <s>`](#min-fresh--s)
            - [`max-age = <s>`](#max-age--s)
            - [`no-cache` 和 `Pragma: no-cache`](#no-cache-和-pragma-no-cache)
            - [`no-store`](#no-store)
            - [`only-if-cached`](#only-if-cached)
            - [`no-transform`](#no-transform)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## `No-Cache` 和 `No-Store`
1. `Cache-Control: no-store` 响应首部禁止缓存服务器保存资源的副本。缓存服务器应该向客户端转发响应，然后删除资源。也就是完全不适用缓存。
2. `Cache-Control: no-cache` 会保存资源副本，但是每次在响应客户端请求时，都要和原始服务器再确认。显然这个名字起的有点问题。


## `Max-Age`
1. 响应首部 `Cache-Control: max-age=<s>` 表示服务器说明该资源在 `s` 秒之内是可以直接使用缓存而无需再确认的的。
2. There is also an `s-maxage` header (note the absence of a hyphen in “maxage”) that acts like max-age but applies only to shared (public) caches:
    ```
    Cache-Control: max-age=3600
    Cache-Control: s-maxage=3600
    ```
3. 如果把秒数设为 0，就变成了 `no-cache` 的效果。
    ```


## `Expires` Response Headers
1. The deprecated `Expires` header specifies an actual expiration date instead of a time in seconds. The HTTP designers later decided that, because many servers have unsynchronized or incorrect clocks, it would be better to represent expiration in elapsed seconds, rather than absolute time. 
2. An analogous freshness lifetime can be calculated by computing the number of seconds difference between the expires value and the date value:
    ```
    Expires: Fri, 05 Jul 2002, 05:00:00 GMT
    ```
3. Some servers also send back an `Expires: 0` response header to try to make documents always expire, but this syntax is illegal and can cause problems with some software. You should try to support this construct as input, but shouldn’t generate it.


## `Must-Revalidate`
1. Caches may be configured to serve stale (expired) objects, in order to improve performance. If an origin server wishes caches to strictly adhere to expiration information, it can attach a Cache-Control: `Cache-Control: must-revalidate`.
2. The `Cache-Control: must-revalidate` response header tells caches they cannot serve a stale copy of this object without first revalidating with the origin server. 
3. Caches are still free to serve fresh copies. 也就是说，这个设置并不是说所有的缓存对象都要验证一下，而只是验证过了保质期的缓存对象。保质期内也要验证的是 `no-cache`。
4. If the origin server is unavailable when a cache attempts a must-revalidate freshness check, the cache must return a `504 Gateway Timeout` error.


## Heuristic Expiration
1. If the response doesn’t contain either a `Cache-Control: max-age` header or an `Expires` header, the cache may compute a heuristic maximum age. 
1. Any algorithm may be used, but if the resulting maximum age is greater than 24 hours, a `Heuristic Expiration Warning` (Warning 13) header should be added to the response headers. As far as we know, few browsers make this warning information available to users.
3. One popular heuristic expiration algorithm, the LM-Factor algorithm, can be used if the document contains a last-modified date. The LM-Factor algorithm uses the last-modified date as an estimate of how volatile a document is. Here’s the logic:
    * If a cached document was last changed in the distant past, it may be a stable document and less likely to change suddenly, so it is safer to keep it in the cache longer.
    * If the cached document was modified just recently, it probably changes frequently, so we should cache it only a short while before revalidating with the server.
4. TODO，之后的详细内容。


## 客户端新鲜度控制
1. Web browsers have a Refresh or Reload button to forcibly refresh content, which might be stale in the browser or proxy caches. 
2. The Refresh button issues a `GET` request with additional `Cache-Control` request headers that force a revalidation or unconditional fetch from the server. The precise Refresh behavior depends on the particular browser, document, and intervening cache configurations. 
3. 例如在 Chrome 中，普通刷新如果会使用缓存的情况，强制刷新的话，就会带上 `Cache-Control: no-cache` 来确保获得的是最新的资源。
4. Clients use `Cache-Control` request headers to tighten or loosen expiration constraints. Clients can use `Cache-Control` headers to make the expiration more strict, for applications that need the very freshest documents (such as the manual Refresh button). On the other hand, clients might also want to relax the freshness requirements as a compromise to improve performance, reliability, or expenses.

### Cache-Control request directives
#### `max-stale` 和 `max-stale=<s>`
1. The cache is free to serve a stale document. 
2. If the `<s>` parameter is specified, the document must not be stale by more than this amount of time. This relaxes the caching rules.

#### `min-fresh = <s>` 
The document must still be fresh for at least `<s>` seconds in the future. 
2. This makes the caching rules more strict.

#### `max-age = <s>`
1. The cache cannot return a document that has been cached for longer than `<s>` seconds. 
2. This directive makes the caching rules more strict, unless the `max-stale` directive also is set, in which case the age can exceed its expiration time.

#### `no-cache` 和 `Pragma: no-cache`
1. This client won’t accept a cached resource unless it has been revalidated. 

#### `no-store`
1. The cache should delete every trace of the document from storage as soon as possible, because it might contain sensitive information.
2. The `no-store` request directive indicates that a cache must not store any part of either this request or any response to it. 不仅是不应缓存对该请求的响应，该请求本身的信息也不应存储。
3. This directive applies to both private and shared caches.  "must not store" in this context means that the cache must not intentionally store the information in non-volatile storage, and must make a best-effort attempt to remove the information from volatile storage as promptly as possible after forwarding it.
4. This directive is not a reliable or sufficient mechanism for ensuring privacy. In particular, malicious or compromised caches might not recognize or obey this directive, and communications networks might be vulnerable to eavesdropping.
5. Note that if a request containing this directive is satisfied from a cache, the `no-store` request directive does not apply to the already stored response.

#### `only-if-cached`
1. The `only-if-cached` request directive indicates that the client only wishes to obtain a stored response.
2. If it receives this directive, a cache should either respond using a stored response that is consistent with the other constraints of the request, or respond with a `504` (Gateway Timeout) status code.  
3. If a group of caches is being operated as a unified system with good internal connectivity, a member cache may forward such a request within that group of caches.
4. 看起来是用于一个系统中的多个成员使用同样的共享缓存，这样的好处似乎不仅仅是不用重复请求，更重要的是保证每个成员都可以加载到同一个版本的资源。

#### `no-transform`
1. The `no-transform` request directive indicates that an intermediary (whether or not it implements a cache) MUST NOT transform the payload.
2. The `Content-Encoding`, `Content-Range`, `Content-Type` headers must not be modified by a proxy. 
3. A non-transparent proxy might, for example, convert between image formats in order to save cache space or to reduce the amount of traffic on a slow link. The `no-transform` directive disallows this.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)