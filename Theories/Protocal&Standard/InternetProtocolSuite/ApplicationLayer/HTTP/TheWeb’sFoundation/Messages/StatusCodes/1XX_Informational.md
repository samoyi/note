# 1XX Informational


<!-- TOC -->

- [XX Informational](#xx-informational)
    - [100 Continue](#100-continue)
    - [101 Switching Protocol](#101-switching-protocol)
    - [100 Continue 深入讨论](#100-continue-%E6%B7%B1%E5%85%A5%E8%AE%A8%E8%AE%BA)
        - [Clients and 100 Continue](#clients-and-100-continue)
        - [Servers and 100 Continue](#servers-and-100-continue)
        - [Proxies and 100 Continue](#proxies-and-100-continue)
    - [References](#references)

<!-- /TOC -->


## `100 Continue`
1. Indicates that an initial part of the request was received and the client should continue or ignore it if it is already finished.
2. To have a server check the request's headers, a client must send `Expect: 100-continue` as a header in its initial request and receive a `100 Continue` status code in response before sending the body.
3. The `100 Continue` status code, in particular, is a bit confusing. It’s intended to optimize the case where an HTTP client application has an entity body to send to a server but wants to check that the server will accept the entity before it sends it. 


## `101 Switching Protocol`
1. Indicates that the server is changing protocols, as specified by the client, to one listed in the `Upgrade` header.
2. 当客户端请求切换协议为 `websocket` 时，客户端发送的请求会带上 `Upgrade` 头。
3. 服务器在收到该请求时，如果同意切换协议，则会回复 `101` 状态码。同时也会带上一个 `Upgrade` 头，指明将要切换的协议。
4. 可以看一下这个在线的 [websocket例子](https://websocket.org/echo.html)。可以看到，在点击 connect 按钮时，浏览器发送了一个请求，`Upgrade` 头为 `websocket`；响应中的状态状态码为 `101 Web Socket Protocol Handshake`，`Upgrade` 响应头的值也 `websocket`。


## `100 Continue` 深入讨论
We discuss it here in a bit more detail (how it interacts with clients, servers, and proxies) because it tends to confuse HTTP programmers.

### Clients and `100 Continue`
1. If a client is sending an entity to a server and is willing to wait for a `100 Continue` response before it sends the entity, the client needs to send an `Expect` request header with the value `100-continue`. 
2. If the client is not sending an entity, it shouldn’t send a `100-continue` `Expect` header, because this will only confuse the server into thinking that the client might be sending an entity.
3. `100-continue`, in many ways, is an optimization. A client application should really use `100-continue` only to avoid sending a server a large entity that the server will not be able to handle or use.
4. Because of the initial confusion around the `100 Continue` status (and given some of the older implementations out there), clients that send an `Expect` header for `100-continue` should not wait forever for the server to send a `100 Continue` response. After some timeout, the client should just send the entity.
5. In practice, client implementors also should be prepared to deal with unexpected `100 Continue` responses (annoying, but true). Some errant HTTP applications send this code inappropriately.

### Servers and `100 Continue`
1. If a server receives a request with the `Expect` header and `100-continue` value, it should respond with either the `100 Continue` response or an error code. 
2. Servers should never send a `100 Continue` status code to clients that do not send the `100-continue` expectation. However, as we noted above, some errant servers do this.
3. If for some reason the server receives some (or all) of the entity before it has had a chance to send a `100 Continue` response, it does not need to send this status code, because the client already has decided to continue. 
4. When the server is done reading the request, however, it still needs to send a final status code for the request (it can just skip the `100 Continue` status).
5. Finally, if a server receives a request with a `100-continue` expectation and it decides to end the request before it has read the entity body (e.g., because an error has occurred), it should not just send a response and close the connection, as this can prevent the client from receiving the response.

### Proxies and `100 Continue`
1. A proxy that receives from a client a request that contains the `100-continue` expectation needs to do a few things.
2. If the proxy either knows that the next-hop server is HTTP/1.1-compliant or does not know what version the next-hop server is compliant with, it should forward the request with the `Expect` header in it. 
3. If it knows that the next-hop server is compliant with a version of HTTP earlier than 1.1, it should respond with the `417 Expectation Failed` error.
4. If a proxy decides to include an `Expect` header and `100-continue` value in its request on behalf of a client that is compliant with HTTP/1.0 or earlier, it should not forward the `100 Continue` response (if it receives one from the server) to the client, because the client won’t know what to make of it.
5. It can pay for proxies to maintain some state about next-hop servers and the versions of HTTP they support (at least for servers that have received recent requests), so they can better handle requests received with a `100-continue` expectation.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
