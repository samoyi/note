# Request headers


<!-- TOC -->

- [Request headers](#request-headers)
    - [Accept headers](#accept-headers)
        - [`Accept`](#accept)
        - [`Accept-Charset`](#accept-charset)
        - [`Accept-Encoding`](#accept-encoding)
        - [`Accept-Language`](#accept-language)
    - [条件请求首部](#条件请求首部)
        - [`Expect`](#expect)
        - [`Range`](#range)
        - [`If-Range`](#if-range)
        - [`If-Match`](#if-match)
            - [语法](#语法)
        - [`If-None-Match`](#if-none-match)
        - [`If-Modified-Since`](#if-modified-since)
        - [`If-Unmodified-Since`](#if-unmodified-since)
    - [安全请求首部](#安全请求首部)
        - [`Authorization`](#authorization)
        - [`Cookie `](#cookie-)
    - [Proxy request headers](#proxy-request-headers)
        - [`Max-Forwards`](#max-forwards)
        - [`Proxy-Authorization`](#proxy-authorization)
        - [`Proxy-Connection`](#proxy-connection)
    - [其他请求首部](#其他请求首部)
        - [`From`](#from)
        - [`Host`](#host)
        - [`Origin`](#origin)
        - [`Range`](#range-1)
        - [`Referer`](#referer)
        - [`User-Agent`](#user-agent)
    - [References](#references)

<!-- /TOC -->


## Accept headers
1. Accept headers give the client a way to tell servers their preferences and capabilities: what they want, what they can use, and, most importantly, what they don’t want.
2. Servers can then use this extra information to make more intelligent decisions about what to send. 
3. Accept headers benefit both sides of the connection. Clients get what they want, and servers don’t waste their time and bandwidth sending something the client can’t use.

### `Accept`
```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```
1. `Accept` 首部字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级。
2. 可使用 `type/subtype` 这种形式，一次指定多种媒体类型。
3. 若想要给显示的媒体类型增加优先级，则使用 `q=` 来额外表示权重值，用分号（`;`）进行分隔。
4. 权重值 `q` 的范围是 0~1（可精确到小数点后 3 位），且 1 为最大值。不指定权重 `q` 值时，默认权重为 `q=1.0`。
5. 当服务器提供多种内容时，将会首先返回权重值最高的媒体类型。
6. 该首部指定客户端可以接收哪些类型的数据，而 `Content-Type` 指定的是客户端或服务端当次发送数据的类型。

### `Accept-Charset`
```
Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
```
1. 用来通知服务器用户代理支持的字符集及字符集的相对优先顺序。
2. 可一次性指定多种字符集。与首部字段 `Accept` 相同的是可用权重 `q` 值来表示相对优先级。

### `Accept-Encoding`
```
Accept-Encoding: gzip, deflate
```
1. 用来告知服务器用户代理支持的内容编码及内容编码的优先级顺序。
2. 可一次性指定多种内容编码。也可使用星号（`*`）作为通配符，指定任意的编码格式。
3. 采用权重 `q` 值来表示相对优先级，这点与首部字段 `Accept` 相同。

### `Accept-Language`
```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3
```
1. 用来告知服务器用户代理能够处理的自然语言集（指中文或英文等），以及自然语言集的相对优先级。
2. 可一次指定多种自然语言集。
3. 和 `Accept` 首部字段一样，按权重值 `q` 来表示相对优先级。


## 条件请求首部
1. 有时客户端需要给请求加上一些前提条件。例如客户端有了一个文件的缓存，用户需要这个文件时，客户端要先询问服务器这个文件的缓存是否有效，有效的话就不用重复请求该文件了。
2. 使用条件请求首部，客户端会让服务器先检查前提条件，条件成立时才正常的响应请求。
3. 其中有两对和缓存相关的条件首部：
    * 一对是带 `Match` 的，会比较本地资源缓存副本的 ETag 和服务器资源的 ETag 是否相同；
    * 另一对是带 `Since` 的，会询问服务器本地资源缓存副本对应的服务器端资源在某个时间之后是否有过修改。
4. 还有 `Range` 和 `If-Range` 是对资源的范围请求以及带前提条件的范围请求。

### `Expect`
1. Allows a client to list server behaviors that it requires for a request.
2. The only expectation defined in the specification is `Expect: 100-continue`, to which the server shall respond with:
    * `100` if the information contained in the header is sufficient to cause an immediate success,
    * `417` (Expectation Failed) if it cannot meet the expectation; or any other 4xx status otherwise.
3. For example, the server may reject a request if its `Content-Length` is too large.
4. No common browsers send the `Expect` header, but some other clients such as cURL do so by default.

### `Range`
1. 这个首部指定服务器返回所请求资源的某些部分而非整个资源。
2. 例如下面的设置请求服务器返回资源的三部分，第三部分是从 19000 到结尾。范围的单位是字节
    ```
    Range: bytes=200-1000, 2000-6576, 19000- 
    ```
3. 以及下面这个是请求开头的 500 字节和最后的 500 字节
    ```
    Range: bytes=0-499, -500 
    ```
4. 如果指定的范围有问题，比如说不存在或者多个范围有重叠，服务器可以会拒绝，可以响应状态 `416 Range Not Satisfiable`。
    
### `If-Range`
1. `If-Range` HTTP 请求头字段用来使得 `Range` 头字段在一定条件下起作用。
2. 当字段值中的条件得到满足时，`Range` 头字段才会起作用，同时服务器回复 `206` 部分内容状态码，以及 `Range` 头字段请求的相应部分；如果字段值中的条件没有得到满足，服务器将会返回 `200 OK` 状态码，并返回完整的请求资源。
3. 字段值中既可以用 `If-Unmodified-Since` 时间值用作验证，也可以用 `If-Match` 的 ETag 值作为验证，但不能将两者同时使用。
4. 下面的设置要求服务器如果请求的资源在这个时间之后没有修改过，则可以使用返回 `Range` 指定的部分资源
    ```js
    If-Range: Wed, 21 Oct 2015 07:28:00 GMT
    ```
5. `If-Range` 头字段通常用于断点续传的下载过程中，用来自从上次中断后，确保下载的资源没有发生改变。

### `If-Match`
1. 在请求方法为 `GET` 和 `HEAD` 的情况下，服务器仅在请求资源 的 `ETag` 和此首部列出的 `ETag` 值匹配时才会返回资源。而对于 `PUT` 或其他非安全方法来说，只有在满足条件的情况下才可以将资源上传。
2. `ETag` 之间的比较使用的是强比较算法，即只有在每一个字节都相同的情况下，才可以认为两个文件是相同的。在 `ETag` 前面添加 `W/` 前缀表示可以采用相对宽松的算法。
3. 以下是两个常见的应用场景：
    * 对于 `GET`  和 `HEAD` 方法，搭配 `Range` 首部使用，可以用来保证新请求的范围与之前请求的范围是对同一份资源的请求。如果  `ETag` 无法匹配，那么需要返回 `416` (Range Not Satisfiable，范围请求无法满足) 响应。
    * 对于其他方法来说，尤其是 `PUT`, `If-Match` 首部可以用来避免更新丢失问题。它可以用来检测用户想要上传的不会覆盖获取原始资源之后做出的更新。如果请求的条件不满足，那么需要返回  `412` (Precondition Failed，先决条件失败) 响应。

#### 语法
```
If-Match: <etag_value>
If-Match: <etag_value>, <etag_value>, …
```

* `<etag_value>`: 唯一地表示一份资源的实体标签。标签是由 ASCII 字符组成的字符串，用双引号括起来（如 "675af34563dc-tr34"）。前面可以加上 `W/` 前缀表示应该采用弱比较算法。
* `*`：星号是一个特殊值，可以指代任意资源。

```
If-Match: "bfc13a64729c4290ef5b2c2730249c88ca92d82d"

If-Match: W/"67ab43", "54ed21", "7892dd"

If-Match: *
```

### `If-None-Match`
1. 对于 `GET` 和 `HEAD` 请求方法来说，当且仅当服务器上没有任何资源的 `ETag` 属性值与这个首部中列出的相匹配的时候，服务器端会才返回所请求的资源，响应码为 `200`。
2. 对于其他方法来说，当且仅当最终确认没有已存在的资源的 `ETag` 属性值与这个首部中所列出的相匹配的时候，才会对请求进行相应的处理。
3. 对于 `GET` 和 `HEAD` 方法来说，当验证失败的时候，也就是请求的资源没有发生变化，即 `ETag` 没有改时的，服务器端必须返回响应 `304 Not Modified`，告知用户可以继续使用缓存的资源副本。
4. 对于能够引发服务器状态改变的方法，则返回 `412` （Precondition Failed，前置条件失败）。
5. 需要注意的是，服务器端在生成状态码为 `304` 的响应的时候，必须同时生成以下会存在于对应的 `200` 响应中的首部：`Cache-Control`、`Content-Location`、`Date`、`ETag`、`Expires` 和 `Vary`。
6. `ETag` 属性之间的比较采用的是弱比较算法，即两个文件除了每个比特都相同外，内容一致也可以认为是相同的。例如，如果两个页面仅仅在页脚的生成时间有所不同，就可以认为二者是相同的。
7. 当与 `If-Modified-Since` 一同使用的时候，`If-None-Match` 优先级更高（假如服务器支持的话）。
8. 以下是两个常见的应用场景：
    * 采用 `GET` 或 `HEAD` 方法，来更新拥有特定的 `ETag` 属性值的缓存。
    * 采用其他方法，尤其是 `PUT`，将 `If-None-Match` 的值设置为 `*`，用来生成事先并不知道是否存在的文件，可以确保先前并没有进行过类似的上传操作，防止之前操作数据的丢失。这个问题属于更新丢失问题的一种。

### `If-Modified-Since`
1. `If-Modified-Since` 指定一个时间，只有请求的资源在这个时间之后修改过，服务器才会返回该资源，状态码为 200。
2. 如果在指定的时间后否则的话会返回状态 304，并且没有响应实体。同时会有 `Last-Modified` 首部指出上次修改的时间。
3. 与 `If-Unmodified-Since` 不同，`If-Modified-Since` 只能用来响应 `GET` 或 `HEAD` 方法。
4. 优先级没有 `If-None-Match` 高，同时使用时以后者为准。

### `If-Unmodified-Since`
1. 只有在指定的时间之后没修改过才会响应请求。
2. 如果请求的资源在指定时间之后被修改了，则会返回 `412 Precondition Failed`。
3. 有两种典型使用场景：
    * 在使用比如 `POST` 这样的非安全方法是，可以实现并行控制。例如共同编辑一个在线文档时，在提交修改时需要保证从之前读取该文档以来文档没有被其他人修改过。
    * 在类似断点续传的场景中，继续获取文档的一部分时间，结合 `If-Range` 来确定文档没有发生过变化。


## 安全请求首部
1. HTTP natively supports a simple challenge/response authentication scheme for requests. 
2. It attempts to make transactions slightly more secure by requiring clients to authenticate themselves before getting access to certain resources. 

### `Authorization`
```
Authorization: Basic dWVub3NlbjpwYXNzd29yZA==
```
<img src="./images/Authorization.png" width="600" style="display: block; margin: 5px 0 10px 0;" />

1. 用来告知服务器，用户代理的认证信息（证书值）。
2. 通常，想要通过服务器认证的用户代理会在接收到返回的 `401` 状态码响应后，把首部字段 `Authorization` 加入请求中。
3. 共用缓存在接收到含有 `Authorization` 首部字段的请求时的操作处理会略有差异。

### `Cookie `
Used by clients to pass a token to the server—not a true security header, but it does have security implications.


## Proxy request headers
As proxies become increasingly common on the Internet, a few headers have been defined to help them function better. 

### `Max-Forwards`
The maximum number of times a request should be forwarded to another proxy or gateway on its way to the origin server—used with the `TRACE` method.

### `Proxy-Authorization` 
Same as Authorization, but used when authenticating with a proxy, usually after the server has responded with a `407 Proxy Authentication Required` status and the `Proxy-Authenticate` header.

### `Proxy-Connection`
Same as `Connection`, but used when establishing connections with a proxy


## 其他请求首部
### `From`
1. Provides the email address of the client’s user.
2. 通常，其使用目的就是为了显示搜索引擎等用户代理的负责人的电子邮件联系方式。使用代理时，应尽可能包含 `From` 首部字段（但可能会因代理不同，将电子邮件地址记录在 `User-Agent` 首部字段内）。


### `Host`
1. Gives the hostname and port of the server to which the request is being sent.
2. 请求被发送至服务器时，请求中的主机名会用 IP 地址直接替换解决。但如果这时，相同的 IP 地址下部署运行着多个域名，那么服务器就会无法理解究竟是哪个域名对应的请求。因此，就需要使用首部字段 `Host` 来明确指出请求的主机名。
3. 若服务器未设定主机名，那直接发送一个空值即可。


### `Origin`
1. The `Origin` request header indicates where a fetch originates from. 
2. It doesn't include any path information, but only the server name. 
3. It is sent with CORS requests, as well as with `POST` requests. It is similar to the `Referer` header, but, unlike this header, it doesn't disclose the whole path.
4. 如果不为空的话，会包含 scheme、hostname 和可选的 port
    ```
    Origin: null
    Origin: <scheme> "://" <hostname> [ ":" <port> ]
    ```

### `Range`
```
Range: bytes=5001-10000
```
1. 对于只需获取部分资源的范围请求，包含首部字段 `Range` 即可告知服务器资源的指定范围。上面的示例表示请求获取从第 5001 字节至第 10000 字节的资源。
2. 接收到附带 `Range` 首部字段请求的服务器，会在处理请求之后返回状态码为 `206 Partial Content` 的响应。无法处理该范围请求时，则会返回状态码 200 OK 的响应及全部资源。

### `Referer`
1. The `Referer` header field allows the user agent to specify a URI reference for the resource from which the target URI was obtained (i.e., the "referrer", though the field name is misspelled).
2. The `Referer` header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.
3. The `Referer` header has the potential to reveal information about the browsing history of the user, which is a privacy concern.
4. A `Referer` header is not sent by browsers if:
    * the referring resource is a local "file" or "data" URI,
    * an unsecured HTTP request is used and the referring page was received with a secure protocol (HTTPS).
5. 可以通过相应的设置，让浏览器不发送或只在特定情况下发送 `Referer`，以此来保护隐私。参考 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\Headers\Referer\Basic.md`
6. 下面的例子，直接访问 `http://localhost:3000` 的时候，因为不是从其他页面跳转的，所以 `req.headers.referer` 是 `undefined`。再点击链接访问的时候，`req.headers.referer` 就成了 `http://localhost:3000`。如果不屏蔽 `/favicon.ico`，其实访问 `/favicon.ico` 时也是会带上值为 `http://localhost:3000` 的 `referer` 的
    ```js
    require('http').createServer((req, res)=>{
        if (req.url !== '/favicon.ico'){
            console.log(req.headers.referer);
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
        }
        res.end(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title></title>
        </head>
        <body>
            <a href="http://localhost:3000/666" target="_blank">aaa</a>
        </body>
        </html>`);
    }).listen(3000);
    ```

### `User-Agent`
1. 将创建请求的用户代理名称等信息传达给服务器。
2. 由网络爬虫发起请求时，有可能会在字段内添加爬虫作者的电子邮件地址。此外，如果请求经过代理，那么中间也很可能被添加上代理服务器的名称。


## References
* [HTTP: The Definitive Guide](https://book.douban.com/subject/1440226/)
* [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/)
