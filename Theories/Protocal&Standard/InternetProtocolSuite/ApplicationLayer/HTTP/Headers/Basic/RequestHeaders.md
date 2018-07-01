# Request headers
As the name implies, request headers are specific to request messages. They
provide extra information to servers, such as what type of data the client is
willing to receive. For example, the following Accept header tells the server
that the client will accept any media type that matches its request:
```
Accept: */*
```


## Accept
```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```
1. `Accept`首部字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级。
2. 可使用`type/subtype`这种形式，一次指定多种媒体类型。
3. 若想要给显示的媒体类型增加优先级，则使用`q=`来额外表示权重值，用分号（`;`）进行分隔。
4. 权重值`q`的范围是 0~1（可精确到小数点后 3 位），且 1 为最大值。不指定权重`q`值时，
默认权重为 q=1.0。
5. 当服务器提供多种内容时，将会首先返回权重值最高的媒体类型。


## Accept-Charset
```
Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
```
1. 用来通知服务器用户代理支持的字符集及字符集的相对优先顺序。
2. 可一次性指定多种字符集。与首部字段`Accept`相同的是可用权重 q 值来表示相对优先级。


## Accept-Encoding
```
Accept-Encoding: gzip, deflate
```
1. 用来告知服务器用户代理支持的内容编码及内容编码的优先级顺序。
2. 可一次性指定多种内容编码。也可使用星号（`*`）作为通配符，指定任意的编码格式。
3. 采用权重`q`值来表示相对优先级，这点与首部字段`Accept`相同。


## Accept-Language
```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3
```
1. 用来告知服务器用户代理能够处理的自然语言集（指中文或英文等），以及自然语言集的相对优
先级.
2. 可一次指定多种自然语言集。
3. 和 Accept 首部字段一样，按权重值 q 来表示相对优先级。


## Authorization
```
Authorization: Basic dWVub3NlbjpwYXNzd29yZA==
```
![Authorization](./images/RequestHeaders/Authorization.png)
1. 用来告知服务器，用户代理的认证信息（证书值）。
2. 通常，想要通过服务器认证的用户代理会在接收到返回的`401`状态码响应后，把首部字段
`Authorization`加入请求中。
3. 共用缓存在接收到含有`Authorization`首部字段的请求时的操作处理会略有差异。


## From
* Provides the email address of the client’s user.
* 通常，其使用目的就是为了显示搜索引擎等用户代理的负责人的电子邮件联系方式。使用代理时，
应尽可能包含`From`首部字段（但可能会因代理不同，将电子邮件地址记录在`User-Agent`首部字
段内）。


## Host
1. Gives the hostname and port of the server to which the request is being sent.
* 请求被发送至服务器时，请求中的主机名会用 IP 地址直接替换解决。但如果这时，相同的 IP
地址下部署运行着多个域名，那么服务器就会无法理解究竟是哪个域名对应的请求。因此，就需要使
用首部字段 Host 来明确指出请求的主机名。若服务器未设定主机名，那直接发送一个空值即可。


## Range
```
Range: bytes=5001-10000
```
* 对于只需获取部分资源的范围请求，包含首部字段`Range`即可告知服务器资源的指定范围。上面
的示例表示请求获取从第 5001 字节至第 10000 字节的资源。
* 接收到附带`Range`首部字段请求的服务器，会在处理请求之后返回状态码为`206 Partial
Content`的响应。无法处理该范围请求时，则会返回状态码 200 OK 的响应及全部资源。


## Referer
* The `Referer` request header contains the address of the previous web page
from which a link to the currently requested page was followed.
* The `Referer` header allows servers to identify where people are visiting them
 from and may use that data for analytics, logging, or optimized caching, for
example.
* The `Referer` header has the potential to reveal information about the
browsing history of the user, which is a privacy concern.
* A `Referer` header is not sent by browsers if:
    * the referring resource is a local "file" or "data" URI,
    * an unsecured HTTP request is used and the referring page was received with
     a secure protocol (HTTPS).


## User-Agent
* 将创建请求的浏览器和用户代理名称等信息传达给服务器。
* 由网络爬虫发起请求时，有可能会在字段内添加爬虫作者的电子邮件地址。此外，如果请求经过代
理，那么中间也很可能被添加上代理服务器的名称。


## References
* [HTTP: The Definitive Guide](https://book.douban.com/subject/1440226/)
