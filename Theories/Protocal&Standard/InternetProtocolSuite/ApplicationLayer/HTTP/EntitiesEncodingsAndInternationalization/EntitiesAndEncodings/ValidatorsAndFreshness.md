# Validators and Freshness


<!-- TOC -->

- [Validators and Freshness](#validators-and-freshness)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Time-Varying Instances](#time-varying-instances)
    - [Summary](#summary)
    - [Freshness](#freshness)
    - [Conditionals and Validators](#conditionals-and-validators)
        - [Conditionals](#conditionals)
        - [Validators](#validators)
        - [`W/`](#w)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Time-Varying Instances
1. Web objects are not static. The same URL can, over time, point to different versions of an object. 
2. The client requests the same resource (URL) multiple times, but it gets different instances of the resource as it changes over time. 
3. The HTTP protocol specifies operations for a class of requests and responses, called **instance manipulations**, that operate on instances of an object. 
4. The two main instance-manipulation methods are range requests and delta encoding. Both of these methods require clients to be able to identify the exact copy of the resource that they have (if any) and request new instances conditionally.


## Summary
1. The client does not initially have a copy of the resource, so it sends a request to the server asking for it. 
2. The server responds with Version 1 of the resource. The client can now cache this copy, but for how long?
3. Once the document has “expired” at the client (i.e., once the client can no longer consider its copy a valid copy), it must request a fresh copy from the server. 
4. If the document has not changed at the server, however, the client does not need to receive it again—it can just continue to use its cached copy.
5. This special request, called a **conditional request**, requires that the client tell the server which version it currently has, using a **validator**, and ask for a copy to be sent only if its current copy is no longer valid. Let’s look at the three key concepts—freshness, validators, and conditionals—in more detail.


## Freshness
1. Freshness Servers are expected to give clients information about how long clients can cache their content and consider it fresh. 
2. Servers can provide this information using one of two headers: `Expires` and `Cache-Control`. 
3. The `Expires` header specifies the exact date and time when the document “expires”—when it can no longer be considered fresh. 
4. The syntax for the `Expires` header is: 
    ```
    Expires: Sun Mar 18 23:59:59 GMT 2001
    ```
5. For a client and server to use the `Expires` header correctly, their clocks must be synchronized. This is not always easy, because neither may run a clock synchronization protocol such as the Network Time Protocol (NTP). 
6. A mechanism that defines expiration using relative time is more useful. The `Cache-Control` header can be used to specify the maximum age for a document in seconds—the total amount of time since the document left the server. Age is not dependent on clock synchronization and therefore is likely to yield more accurate results.
7. The `Cache-Control` header actually is very powerful. It can be used by both servers and clients to describe freshness using more directives than just specifying an age or expiration time. Table below lists some of the directives that can accompany the `Cache-Control` header.

    Directive | Message type | Description
    --|--|--
    `no-cache` | Request | Do not return a cached copy of the document without first revalidating it with the server.
    `no-store` | Request | Do not return a cached copy of the document. Do not store the response from the server.
    `max-age` | Request | The document in the cache must not be older than the specified age.
    `max-stale` | Request | The document may be stale based on the server-specified expiration information, but it must not have been expired for longer than the value in this directive.
    `min-fresh` | Request | The document’s age must not be more than its age plus the specified amount. In other words, the response must be fresh for at least the specified amount of time.
    `no-transform` | Request | The document must not be transformed before being sent.
    `only-if-cached` | Request | Send the document only if it is in the cache, without contacting the origin server.
    `public` | Response | Response may be cached by any cache.
    `private` | Response | Response may be cached such that it can be accessed only by a single client.
    `no-cache` | Response | If the directive is accompanied by a list of header fields, the content may be cached and served to clients, but the listed header fields must first be removed. If no header fields are specified, the cached copy must not be served without revalidation with the server.
    `no-store` | Response | Response must not be cached.
    `no-transform` | Response | Response must not be modified in any way before being served.
    `must-revalidate` | Response | Response must be revalidated with the server before being served.
    `proxy-revalidate` | Response | Shared caches must revalidate the response with the origin server before serving. This directive can be ignored by private caches.
    `max-age` | Response | Specifies the maximum length of time the document can be cached and still considered fresh.
    `s-max-age` | Response | Specifies the maximum age of the document as it applies to shared caches (overriding the max-age directive, if one is present). This directive can be ignored by private caches


## Conditionals and Validators
1. When a cache’s copy is requested, and it is no longer fresh, the cache needs to make sure it has a fresh copy. 
2. The cache can fetch the current copy from the origin server, but in many cases, the document on the server is still the same as the stale copy in the cache.
3. If a cache always fetches a server’s document, even if it’s the same as the expired cache copy, the cache wastes network bandwidth, places unnecessary load on the cache and server, and slows everything down.
4. To fix this, HTTP provides a way for clients to request a copy only if the resource has changed, using special requests called **conditional requests**. 
5. In summary, when clients access the same resource more than once, they first need to determine whether their current copy still is fresh. If it is not, they must get the latest version from the server. To avoid receiving an identical copy in the event that the resource has not changed, clients can send conditional requests to the server, specifying validators that uniquely identify their current copies. Servers will then send a copy of the resource only if it is different from the client’s copy.

### Conditionals
1. Conditional requests are normal HTTP request messages, but they are performed only if a particular condition is true.
25. For example, a cache might send the following conditional `GET` message to a server, asking it to send the file `/announce.html` only if the file has been modified since June 29, 2002 (the date the cached document was last changed by the author):
    ```
    GET /announce.html HTTP/1.0
    If-Modified-Since: Sat, 29 Jun 2002, 14:30:00 GMT
    ```
3. Conditional requests are implemented by conditional headers that start with `If-`. In the example above, the conditional header is `If-Modified-Since`. A conditional header allows a method to execute only if the condition is true. If the condition is not true, the server sends an HTTP error code back. 
4. Each conditional works on a particular validator. A validator is a particular attribute of the document instance that is tested. Conceptually, you can think of the validator like the serial number, version number, or last change date of a document.
5. The `If-Modified-Since` conditional header tests the last-modified date of a document instance, so we say that the last-modified date is the validator. The `If-None-Match` conditional header tests the `ETag` value of a document, which is a special keyword or version-identifying tag associated with the entity. 

### Validators
1. `Last-Modified` and `ETag` are the two primary validators used by HTTP. Table below lists four of the HTTP headers used for conditional requests. Next to each conditional header is the type of validator used with the header
    Request type | Validator | Description
    --|--|--
    `If-Modified-Since` | Last-Modified | Send a copy of the resource if the version that was last modified at the time in your previous Last-Modified response header is no longer the latest one.
    `If-Unmodified-Since` | Last-Modified | Send a copy of the resource only if it is the same as the version that was last modified at the time in your previous Last-Modified response header.
    `If-Match` | ETag | Send a copy of the resource if its entity tag is the same as that of the one in your previous ETag response header.
    `If-None-Match` | ETag | Send a copy of the resource if its entity tag is different from that of the one in your previous ETag response header.
2. HTTP groups validators into two classes: weak validators and strong validators. Weak validators may not always uniquely identify an instance of a resource; strong validators must. 
3. An example of a weak validator is the size of the object in bytes. The resource content might change even thought the size remains the same, so a hypothetical byte-count validator only weakly indicates a change. A cryptographic checksum of the contents of the resource (such as MD5), however, is a strong validator; it changes when the document changes.
4. The last-modified time is considered a weak validator because, although it specifies the time at which the resource was last modified, it specifies that time to an accuracy of at most one second. Because a resource can change multiple times in a second, and because servers can serve thousands of requests per second, the last-modified date might not always reflect changes.
5. The ETag header is considered a strong validator, because the server can place a distinct value in the ETag header every time a value changes. Version numbers and digest checksums are good candidates for the ETag header, but they can contain any arbitrary text. ETag headers are flexible; they take arbitrary text values (“tags”), and can be used to devise a variety of client and server validation strategies.

### `W/`
1. Clients and servers may sometimes want to adopt a looser version of entity-tag validation. For example, a server may want to make cosmetic changes to a large, popular cached document without triggering a mass transfer when caches revalidate. In this case, the server might advertise a “weak” entity tag by prefixing the tag with “W/”. A weak entity tag should change only when the associated entity changes in a semantically significant way. A strong entity tag must change whenever the associated entity value changes in any way. 
2. The following example shows how a client might revalidate with a server using a weak entity tag. The server would return a body only if the content changed in a meaningful way from Version 4.0 of the document:
    ```
    GET /announce.html HTTP/1.1
    If-None-Match: W/"v4.0"
    ```
    

## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)