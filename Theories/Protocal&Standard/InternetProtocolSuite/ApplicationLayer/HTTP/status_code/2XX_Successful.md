# 2XX Successful

## `200 OK`
The request has succeeded.


## `201 Created`
1. 相对于`200`是一个单纯的成功来说，`201`有更明确的成功意义，及成功处理了请求，并为此创
建了新的资源。
2. 例如你发送了一个发送新微博的请求，那么服务器就可以返回`201`，表示接受请求并在服务器
上创建了一条新微博。


## `202 Accepted`
1. 已接收，但尚未处理。
2. 接受这个服务器的可能并不会自己立刻处理它，它可能会被这个请求转发给其他进程或其他服务
器。
3. 至于其他进程或者其他服务器之后会怎么处理，这个响应并不会包含任何相关信息。之后这个请
求被处理之后，服务器也不会再发送一个回调响应来通知客户端。

## `203 Non-Authoritative Information`
不懂
This response code means returned meta-information set is not exact set as
available from the origin server, but collected from a local or a third party
copy. Except this condition, 200 OK response should be preferred instead of this
 response.


## `204 No Content`
1. 请求也是成功了，但因为这个请求不需要服务器返回响应体，所以通过该状态码通知客户端。
2. 虽然该响应没有响应体，但仍可能包含有用的响应头，比如设置或更新缓存。
3. 使用惯例是，在`PUT`请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回
`204 No Content`。如果新创建了资源，那么返回`201 Created` 。如果页面需要更新以反映更
新后的资源，那么需要返回`200`。


## `205 Reset Content`
1. 服务器成功处理了请求，且没有返回任何内容。
2. 但是与`204`响应不同，返回此状态码的响应要求请求者重置文档视图。
3. 该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。
4. 与`204`响应一样，该响应也被禁止包含任何响应体，且以响应头后的第一个空行结束。
5. 不过对于浏览器来说，应该没什么用吧，浏览器不会主动清空网页表单之类的。


## `206 Partial Content`
1. 服务器已经成功处理了部分`GET`请求。
2. 类似于 FlashGet 或者迅雷这类的`HTTP`下载工具都是使用此类响应实现断点续传或者将一个
大文档分解为多个下载段同时下载。
3. 该请求必须包含`Range`头信息来指示客户端希望得到的内容范围，并且可能包含`If-Range`
来作为请求条件。


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
