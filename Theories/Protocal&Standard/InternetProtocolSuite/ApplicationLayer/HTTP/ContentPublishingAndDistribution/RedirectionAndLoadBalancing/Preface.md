# Redirection and Load Balancing


<!-- TOC -->

- [Redirection and Load Balancing](#redirection-and-load-balancing)
    - [Preface](#preface)
    - [Why Redirect?](#why-redirect)
    - [Where to Redirect](#where-to-redirect)
    - [章节顺序](#章节顺序)
    - [没看](#没看)
    - [References](#references)

<!-- /TOC -->


## Preface
1. HTTP does not walk the Web alone. The data in an HTTP message is governed by many protocols on its journey. HTTP cares only about the endpoints of the journey— the sender and the receiver—but in a world with mirrored servers, web proxies, and caches, the destination of an HTTP message is not necessarily straightforward.
2. This chapter is about redirection technologies—network tools, techniques, and protocols that determine the final destination of an HTTP message. Redirection technologies usually determine whether the message ends up at a proxy, a cache, or a particular web server in a server farm. Redirection technologies may send your messages to places a client didn’t explicitly request.


## Why Redirect?
1. Redirection is a fact of life in the modern Web because HTTP applications always want to do three things:
    * Perform HTTP transactions reliably
    * Minimize delay
    * Conserve network bandwidth
2. For these reasons, web content often is distributed in multiple locations. This is done for reliability, so that if one location fails, another is available; it is done to lower response times, because if clients can access a nearer resource, they receive their requested content faster; and it’s done to lower network congestion, by spreading out target servers. You can think of redirection as a set of techniques that help to find the “best” distributed content.
3. The subject of load balancing is included because redirection and load balancing coexist. Most redirection deployments include some form of load balancing; that is, they are capable of spreading incoming message load among a set of servers. Conversely, any form of load balancing involves redirection, because incoming messages must somehow be somehow among the servers sharing the load.


## Where to Redirect
1. Servers, proxies, caches, and gateways all appear to clients as servers, in the sense that a client sends them an HTTP request, and they process it. Many redirection techniques work for servers, proxies, caches, and gateways because of their common, server-like traits. Other redirection techniques are specially designed for a particular class of endpoint and are not generally applicable. We’ll see general techniques and specialized techniques in later sections of this chapter.
2. Web servers handle requests on a per-IP basis. Distributing requests to duplicate servers means that each request for a specific URL should be sent to an optimal web server (the one nearest to the client, or the least-loaded one, or some other optimization). Redirecting to a server is like sending all drivers in search of gasoline to the nearest gas station.
3. Proxies tend to handle requests on a per-protocol basis. Ideally, all HTTP traffic in the neighborhood of a proxy should go through the proxy. For instance, if a proxy cache is near various clients, all requests ideally will flow through the proxy cache, because the cache will store popular documents and serve them directly, avoiding longer and more expensive trips to the origin servers. Redirecting to a proxy is like siphoning off traffic on a main access road (no matter where it is headed) to a local shortcut.


## 章节顺序
1. Overview of Redirection Protocols
2. General Redirection Methods


##　没看
Proxy Redirection Methods 及之后的内容


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)