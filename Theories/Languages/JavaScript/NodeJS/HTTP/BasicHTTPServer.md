# Basic HTTP Server

## Create an HTTP server
1. To create an HTTP server, call the `http.createServer()` function.
```js
const http = require('http');
const server = http.createServer(function(req, res){
    res.write('Hello World');
    res.end();
});
server.listen(3000);
```


## Starts the HTTP server listening for connections.
```js
server.listen()
```
It accepts a combination of arguments, but for now the focus will be on
listening for connections on a specified port.
```js
server.listen(3000);
```


## 获取请求
### Reading request headers
注意不是`request.getHeader(name)`，这是`http.ClientRequest`的方法

#### message.headers
```js
request.headers
```
* The request/response headers object.
* Key-value pairs of header names and values. Header names are lower-cased.
* Duplicates in raw headers are handled in the following ways, depending on the
header name. 不懂，文档上说重复设定的`content-type`会被丢弃，但我使用 AJAX 设定了两个
`content-type`，结果还是以逗号连接了两个值，甚至两个值完全一样时也会直接链接。

#### message.rawHeaders
```js
request.rawHeaders
```
* The raw request/response headers list exactly as they were received.
* Note that the keys and values are in the same list. It is not a list of tuples
. So, the even-numbered offsets are key values, and the odd-numbered offsets are
 the associated values.
* Header names are not lowercased, and duplicates are not merged.

### Reading request body
* request body 通常都比较大，不可能一次发送全部，所以要多次接收
* 为了避免 request body 过大，需要在接收到的数据超出上限是停止接收
* 在完整的接收到 POST 数据后，还要解析为对象形式。不懂，如果 POST 是二进制文件呢？

示例参考[这里](https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js)
```js
const querystring = require('querystring');

function processPost(req, res, cb) {
    let queryData = "";
    if (typeof cb !== 'function') return null;

    if (req.method === 'POST') {
        req.on('data', (data)=>{
            queryData += data;
            if (queryData.length > 1e6) { // 1MB
                queryData = "";
                // Payload Too Large
                res.writeHead(413, {'Content-Type': 'text/plain'}).end();
                req.connection.destroy(); // 不懂细节
            }
        });

        req.on('end', ()=>{
            req.post = querystring.parse(queryData);
            cb(req.post);
        });

    }
    else {
        res.writeHead(405, {'Content-Type': 'text/plain'}); // Method Not Allowed
        res.end();
    }
}
```

## 设置响应
1. Node will not automatically write any response back to the client.
2. After the request callback is triggered, it’s your responsibility to end the
response using the `res.end()` method.
3. This allows you to run any asynchronous logic you want during the lifetime of
 the request before ending the response.
4. If you fail to end the response, the request will hang until the client times
 out or it will just remain open.

### Setting response headers
```js
request.setHeader(name, value)
// name <string>
// value <any>
```
* If this header already exists in the to-be-sent headers, its value will be
replaced.
* Use an array of strings here to send multiple headers with the same name.
* Non-string values will be stored without modification. Therefore,
`request.getHeader()` may return non-string values. However, the non-string
values will be converted to strings for network transmission.
* You can add and remove headers in any order, but only up to the first
`response.write()` or `response.end()` call. After the first part of the
response body is written, Node will flush the HTTP headers that have been set.

```js
let body = 'Hello World';
res.setHeader('Content-Length', body.length);
res.setHeader('Content-Type', 'text/plain');
res.end(body);
```

### Remove a header
```js
response.removeHeader(name)
```
Removes a header that's queued for implicit sending.

### Setting the status code
```js
response.statusCode = 404;
```
* When using implicit headers (not calling `response.writeHead()` explicitly),
this property controls the status code that will be sent to the client when the
headers get flushed.
* 如果不设置，默认是`200`

```js
let body = 'Hello World';
res.setHeader('Content-Length', body.length);
res.setHeader('Content-Type', 'text/plain');
res.statusCode = 302;
res.end(body);
```

### 整体设定所有的头部信息
```js
response.writeHead(statusCode[, statusMessage][, headers])

response.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain'
});
```
* This method must only be called once on a message and it must be called before
`response.end()` is called. If `response.write()` or `response.end()` are called
 before calling this, the implicit/mutable headers will be calculated and call
this function.
* When headers have been set with `response.setHeader()`, they will be merged
with any headers passed to `response.writeHead()`, with the headers passed to
`response.writeHead()` given precedence.
* If this method is called and `response.setHeader()` has not been called, it
will directly write the supplied header values onto the network channel without
caching internally, and the `response.getHeader()` on the header will not yield
the expected result. If progressive population of headers is desired with
potential future retrieval and modification, use `response.setHeader()` instead.


### 编写响应体
```js
response.write(chunk[, encoding][, callback])
```
* This sends a chunk of the response body. This method may be called multiple
times to provide successive parts of the body.
* Note that in the http module, the response body is omitted when the request is
 a `HEAD` request. Similarly, the `204` and `304` responses must not include a
message body.
* `chunk` can be a string or a buffer. If chunk is a string, the second
parameter specifies how to encode it into a byte stream. By default the encoding
 is 'utf8'.
* `callback` will be called when this chunk of data is flushed.
* This is the raw HTTP body and has nothing to do with higher-level multi-part
body encodings that may be used. 不懂
* If this method is called and `response.writeHead()` has not been called, it
will switch to implicit header mode and flush the implicit headers. 不懂
* The first time `response.write()` is called, it will send the buffered header
information and the first chunk of the body to the client. The second time
`response.write()` is called, Node.js assumes data will be streamed, and sends
the new data separately. That is, the response is buffered up to the first chunk
 of the body. 不懂
* Returns `true` if the entire data was flushed successfully to the kernel
buffer. Returns `false` if all or part of the data was queued in user memory.
'drain' will be emitted when the buffer is free again.


### 完成响应
```js
response.end([data][, encoding][, callback])
```
* This method signals to the server that all of the response headers and body
have been sent; that server should consider this message complete. The method,
`response.end()`, MUST be called on each response.
* If `data` is specified, it is equivalent to calling
`response.write(data, encoding)` followed by `response.end(callback)`.
    ```js
    res.end('Hello World');
    // 相当于：
    // res.write('Hello World');
    // res.end();
    ```
* If `callback` is specified, it will be called when the response stream is
finished.


## 一次完整的请求响应流程
1. An HTTP client, like a web browser, initiates an HTTP request.
2. Node accepts the connection, and incoming request data is given to the HTTP
server.
3. The HTTP server parses up to the end of the HTTP headers and then hands
control over to the request callback.
4. The request callback performs application logic, in this case responding
immediately with the text “Hello World.”
5. The request is sent back through the HTTP server, which formats a proper HTTP
 response for the client.


## References
* [《Node.js in Action》](https://book.douban.com/subject/6805117/)
