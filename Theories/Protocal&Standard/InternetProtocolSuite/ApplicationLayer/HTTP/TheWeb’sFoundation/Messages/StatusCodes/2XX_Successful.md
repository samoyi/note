# 2XX Successful


<!-- TOC -->

- [2XX Successful](#2xx-successful)
    - [`200 OK`](#200-ok)
    - [`201 Created`](#201-created)
    - [`202 Accepted`](#202-accepted)
    - [`203 Non-Authoritative Information`](#203-non-authoritative-information)
    - [`204 No Content`](#204-no-content)
    - [`205 Reset Content`](#205-reset-content)
    - [`206 Partial Content`](#206-partial-content)
    - [References](#references)

<!-- /TOC -->


## `200 OK`
The request has succeeded.


## `201 Created`
1. For requests that create server objects (e.g., `PUT`). 相对于 `200` 是一个单纯的成功来说，`201`有更明确的成功意义，即成功处理了请求，并为此创建了新的资源。
2. The entity body of the response should contain the various URLs for referencing the created resource, with the `Location` header containing the most specific reference. 
3. The server must have created the object prior to sending this status code.
4. 例如你发送了一个发送新微博的请求，那么服务器如果成功的创建了一条微博数据，就可以返回 `201`。



## `202 Accepted`
1. The request was accepted, but the server has not yet performed any action with it.
2. There are no guarantees that the server will complete the request; this just means that the request looked valid when accepted.
3. The server should include an entity body with a description indicating the status of the request and possibly an estimate for when it will be completed (or a pointer to where this information can be obtained).
4. It is intended for cases where another process or server handles the request, or for batch processing.
5. 至于其他进程或者其他服务器之后会怎么处理，这个响应并不会包含任何相关信息。之后这个请求被处理之后，服务器也不会再发送一个回调响应来通知客户端。

## `203 Non-Authoritative Information`
1. The information contained in the entity headers came not from the origin server but from a copy of the resource. 
2. This could happen if an intermediary had a copy of a resource but could not or did not validate the meta-information (headers) it sent about the resource.
3. This response code is not required to be used; it is an option for applications that have a response that would be a 200 status if the entity headers had come from the origin server.


## `204 No Content`
1. 请求也是成功了，但因为这个请求不需要服务器返回响应体，所以通过该状态码通知客户端。
2. 虽然该响应没有响应体，但仍可能包含有用的响应头，比如设置或更新缓存。
3. 使用惯例是，在 `PUT` 请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回 `204 No Content`；如果新创建了资源，那么返回 `201 Created`；如果页面需要更新以反映更新后的资源，那么需要返回 `200`。


## `205 Reset Content`
1. 服务器成功处理了请求，且没有返回任何内容。
2. 但是与 `204` 响应不同，返回此状态码的响应要求请求者重置文档视图。
3. 该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。
4. 与 `204` 响应一样，该响应也被禁止包含任何响应体，且以响应头后的第一个空行结束。


## `206 Partial Content`
1. 服务器已经成功处理了部分 `GET` 请求。
2. 类似于 FlashGet 或者迅雷这类的 `HTTP` 下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。
3. 该请求必须包含 `Range` 头信息来指示客户端希望得到的内容范围，并且可能包含 `If-Range` 来作为请求条件。
4. A 206 response must include a `Content-Range`, `Date`, and either `ETag` or `Content-Location` header.


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
