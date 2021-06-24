# Controlling Cachability


<!-- TOC -->

- [Controlling Cachability](#controlling-cachability)
    - [设计思想](#%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3)
    - [抽象本质](#%E6%8A%BD%E8%B1%A1%E6%9C%AC%E8%B4%A8)
    - [Summary](#summary)
    - [No-Cache and No-Store Response Headers](#no-cache-and-no-store-response-headers)
    - [Max-Age Response Headers](#max-age-response-headers)
    - [Expires Response Headers](#expires-response-headers)
    - [Must-Revalidate Response Headers](#must-revalidate-response-headers)
    - [Heuristic Expiration](#heuristic-expiration)
    - [Client Freshness Constraints](#client-freshness-constraints)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. HTTP defines several ways for a server to specify how long a document can be cached before it expires. 
2. In decreasing order of priority, the server can:
    * Attach a `Cache-Control: no-store` header to the response.
    * Attach a `Cache-Control: no-cache` header to the response.
    * Attach a `Cache-Control: must-revalidate` header to the response.
    * Attach a `Cache-Control: max-age` header to the response.
    * Attach an `Expires` date header to the response.
    * Attach no expiration information, letting the cache determine its own heuristic expiration date.


## `No-Cache` and `No-Store` Response Headers
1. HTTP/1.1 offers several ways to limit the caching of objects, or the serving of cached objects, to maintain freshness. 
2. The `no-store` and `no-cache` headers prevent caches from serving unverified cached objects:
    ```
    Cache-Control: no-store
    Cache-Control: no-cache
    Pragma: no-cache
    ```
3. A response that is marked `no-store` forbids a cache from making a copy of the response. A cache would typically forward a no-store response to the client, and then delete the object, as would a non-caching proxy server.
4. A response that is marked `no-cache` can actually be stored in the local cache storage. It just cannot be served from the cache to the client without first revalidating the freshness with the origin server. A better name for this header might be "do-not-serve-from-cache-without-revalidation".


## `Max-Age` Response Headers
1. The `Cache-Control: max-age` header indicates the number of seconds since it came from the server for which a document can be considered fresh. 
2. There is also an `s-maxage` header (note the absence of a hyphen in “maxage”) that acts like max-age but applies only to shared (public) caches:
    ```
    Cache-Control: max-age=3600
    Cache-Control: s-maxage=3600
    ```
3. Servers can request that caches either not cache a document or refresh on every access by setting the maximum aging to zero:
    ```
    Cache-Control: max-age=0
    Cache-Control: s-maxage=0
    ```


## `Expires` Response Headers
1. The deprecated `Expires` header specifies an actual expiration date instead of a time in seconds. The HTTP designers later decided that, because many servers have unsynchronized or incorrect clocks, it would be better to represent expiration in elapsed seconds, rather than absolute time. 
2. An analogous freshness lifetime can be calculated by computing the number of seconds difference between the expires value and the date value:
    ```
    Expires: Fri, 05 Jul 2002, 05:00:00 GMT
    ```
3. Some servers also send back an `Expires: 0` response header to try to make documents always expire, but this syntax is illegal and can cause problems with some software. You should try to support this construct as input, but shouldn’t generate it.


## `Must-Revalidate` Response Headers
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


## Client Freshness Constraints
1. Web browsers have a Refresh or Reload button to forcibly refresh content, which might be stale in the browser or proxy caches. 
2. The Refresh button issues a GET request with additional `Cache-Control` request headers that force a revalidation or
unconditional fetch from the server. The precise Refresh behavior depends on the particular browser, document, and intervening cache configurations.
3. Clients use `Cache-Control` request headers to tighten or loosen expiration constraints. Clients can use `Cache-Control` headers to make the expiration more strict, for applications that need the very freshest documents (such as the manual Refresh button). On the other hand, clients might also want to relax the freshness requirements as a compromise to improve performance, reliability, or expenses.
4. Cache-Control request directives
    Directive | Purpose
    --|--
    `Cache-Control: max-stale` `Cache-Control: max-stale=<s>` | The cache is free to serve a stale document. If the `<s>` parameter is specified, the document must not be stale by more than this amount of time. This relaxes the caching rules.
    `Cache-Control: min-fresh = <s>` | The document must still be fresh for at least `<s>` seconds in the future. This makes the caching rules more strict.
    `Cache-Control: max-age = <s>` | The cache cannot return a document that has been cached for longer than `<s>` seconds. This directive makes the caching rules more strict, unless the `max-stale` directive also is set, in which case the age can exceed its expiration time.
    `Cache-Control: no-cache` `Pragma: no-cache` | This client won’t accept a cached resource unless it has been revalidated.
    `Cache-Control: no-store` | The cache should delete every trace of the document from storage as soon as possible, because it might contain sensitive information.
    `Cache-Control: only-if-cached` | The client wants a copy only if it is in the cache.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)