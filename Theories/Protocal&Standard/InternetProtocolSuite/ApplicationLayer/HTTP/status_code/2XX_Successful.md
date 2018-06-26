# 2XX Successful

## `200 OK`
The request has succeeded.


## `201 Created`
The request has succeeded and a new resource has been created as a result of it.
This is typically the response sent after a `POST` request, or after some `PUT`
requests.


## `202 Accepted`
The request has been received but not yet acted upon. It is non-committal,
meaning that there is no way in HTTP to later send an asynchronous response
indicating the outcome of processing the request. It is intended for cases where
 another process or server handles the request, or for batch processing.


## `203 Non-Authoritative Information`
不懂
This response code means returned meta-information set is not exact set as
available from the origin server, but collected from a local or a third party
copy. Except this condition, 200 OK response should be preferred instead of this
 response.


## `204 No Content`
1. There is no content to send for this request, but the headers may be useful.
The user-agent may update its cached headers for this resource with the new ones.
2. 比如，当从浏览器发出请求处理后，返回 `204` 响应，那么浏览器显示的页面不发生更新。
3. 一般在只需要从客户端往服务器发送信息，而对客户端不需要发送新信息内容的情况下使用。


## `205 Reset Content`
1. 服务器成功处理了请求，且没有返回任何内容。
2. 但是与 `204` 响应不同，返回此状态码的响应要求请求者重置文档视图。
3. 该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。
4. 与 `204` 响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一个空行结束。


## `206 Partial Content`
1. 服务器已经成功处理了部分 GET 请求。
2. 类似于 FlashGet 或者迅雷这类的 HTTP 下载工具都是使用此类响应实现断点续传或者将一个
大文档分解为多个下载段同时下载。
3. 该请求必须包含 `Range` 头信息来指示客户端希望得到的内容范围，并且可能包含 `If-Range`
来作为请求条件。


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
* [MDN中文](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
