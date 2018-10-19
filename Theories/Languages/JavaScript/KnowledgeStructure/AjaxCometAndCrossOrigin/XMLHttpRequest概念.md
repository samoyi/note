# XMLHttpRequest


## `XMLHttpRequest` Object
1. 浏览器在`XMLHttpRequest`类上定义了它们的 HTTP API。
2. 这个类的每个实例都表示一个独立的请求/响应对，并且这个对象的属性和方法允许指定请求细节
和提取响应数据。
3. 使用这个 HTTP API 必须做的第一件事就是实例化`XMLHttpRequest`对象。你也能重用已存在
的`XMLHttpRequest`，但注意这将会终止之前通过该对象挂起的任何请求。
4. XMLHttpRequest 用于同 HTTP 和 HTTPS 协议一起工作。理论上，它能够同像 FTP 这样的其
他协议一起工作，但比如像请求方法和响应状态码等部分 API 是 HTTP 特有的。


## Use `open()` to specify the method and the URL
* 除了`GET`和`POST`之外，XMLHttpRequest 规范也允许把`DELETE`、`HEAD`、`OPTIONS`和
`PUT`作为`open()`的第1个参数。（`HTTPCONNECT`、`TRACE`和`TRACK`因为安全风险已被明确
禁止）。
* `open()`的第2个参数是 URL，它是请求的主题。这是相对于文档的 URL，这个文档包含调用
`open()`的脚本。如果指定绝对 URL、协议、主机和端口通常必须匹配所在文档的对应内容。


## Use `setRequestHeader()` to set the request headers
* `POST`请求需要`Content-Type`头指定请求主体的 MIME 类型
    ```js
    // 模拟表单 POST 时的设置：
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ```
* 如果对相同的头调用`setRequestHeader()`多次，新值不会取代之前指定的值，相反，HTTP 请
求将包含这个头的多个副本或这个头将指定多个值。
* 你不能自己指定`Content-Length`、`Date`、`Referer`或`User-Agent`头，
`XMLHttpRequest`将自动添加这些头而防止伪造它们。
* 类似地，XMLHttpRequest对象自动处理 cookie、连接时间、字符集和编码判断，所以你无法向
`setRequestHeader()`传递这些头
    ```
    Accept-Charset     Content-Transfer-Encoding    TE
    Accept-Encoding    Date                         Trailer
    Connection         Expect                       Transfer-Encoding
    Content-Length     Host                         Upgrade
    Cookie             Keep-Alive                   User-Agent
    Cookie2            Referer                      Via
    ```
* 你能为请求指定`Authorization`头，但通常不需要这么做。如果请求一个受密码保护的 URL，
把用户名和密码作为第4个和第5个参数传递给`open()`，则`XMLHttpRequest`将设置合适的头。


## Use `send()` to specify the optional request body and send it off to the server
`GET`请求绝对没有主体，所以应该传递`null`或省略这个参数。`POST`请求通常拥有主体，同时
它应该匹配使用`setRequestHeader()`指定的`Content-Type`头。

### 发送字符时的编码问题
1. 服务端接收到字符串数据时，会找到其中的转义序列，进行 decode。例如`1+2`会被 decode
为`1 2`。
2. 当你发送的字符本身就包含转义序列字符的话，你肯定希望服务端不要把它当做转义序列来看待。
例如你就是想发送`1+2`这个数学表达式，你不希望服务端在接收到`1+2`将该变成`1 2`。
3. 使用表单发送数据时，不会有这个问题，因为发送的字符串会被自动 encode，例如`1+2`会被
encode 为`1%2b2`，服务端 decode 之后恢复成`1+2`。
4. 使用 AJAX 发送时，不管是`POST`方法的 body 还是`GET`方法的 query，都不会被自动
encode，所以`1+2`这个数学表达式发送到服务端时还是`1+2`。服务器再对其进行 decode，就变
成了`1 2`。
5. 因此通过 AJAX 发送数据时，如果不能确保发送的字符不包括转义序列字符，那就应该使用
`encodeURIComponent`对其 encode。
6. 例如，`xhr.send('str=我+你转义后是%e6%88%91%2b%e4%bd%a0')`，服务端最终解析获得的
是`我 你转义后是我+你`；而
`xhr.send('str=' + encodeURIComponent('我+你转义后是%e6%88%91%2b%e4%bd%a0'))`，服
务端最终解析获得的就是`我+你转义后是%e6%88%91%2b%e4%bd%a0`


## Aborting Requests and Timeouts
### `XMLHttpRequest.abort()`
1. 可以通过调用`XMLHttpRequest`对象的`abort()`方法来取消正在进行的 HTTP 请求。
`abort()`方法在所有的 XMLHttpRequest 版本和 XHR2 中可用，调用`abort()`方法在这个对象
上触发`abort`事件。
2. The primary reason to call `abort()` is to cancel or time-out requests that
have taken too long to complete or when the responses become irrelevant. Suppose
 you’re using XMLHttpRequest to request auto-complete suggestions for a text
input field. If the user types a new character into the field before the
server’s suggestions can arrive, then the pending request is no longer
interesting and can be aborted.
2. 对于耗时过长或者已经不需要的请求，可以调用`abort()`进行取消。例如使用
XMLHttpRequest 为文本输入域请求自动完成推荐，如果用户在服务器的建议达到之前输入了新字符
，这时等待请求不再有用，应该中止。

### `XMLHttpRequest.timeout`
* The `XMLHttpRequest.timeout` property is an unsigned long representing the
number of milliseconds a request can take before automatically being terminated.
* The default value is `0`, which means there is no timeout.
* Timeout shouldn't be used for synchronous XMLHttpRequests requests used in a
document environment or it will throw an `InvalidAccessError` exception.
* When a timeout happens, a `timeout` event is fired.
* In Internet Explorer, the timeout property may be set only after calling the
`open()` method and before calling the `send()` method.


## Retrieving the Response
### Listen the response
#### `readyState`
Value | Meaning
-- | --
0 | `open()` has not been called yet
1 | `open()` has been called
2 | `send()` has been called, and headers and status are available.
3 | Receiving. Some response data has been retrieved
4 | Complete. All of the response data has been retrieved and is available

#### `readystatechange` event
1. 理论上，每次`readyState`属性改变都会触发`readystatechange`事件。实际中，当
`readyState`改变为`0`或`1`时可能没有触发这个事件。
2. 当`readyState`值改变为`4`或服务器的响应完成时，所有的浏览器都触发`readystatechange`
事件。

### HTTP status
`status` and `statusText`

### Response headers
`getResponseHeader()` and `getAllResponseHeaders()`
1. 使用`getResponseHeader()`和`getAllResponseHeaders()`能查询响应头。
XMLHttpRequest 会自动处理 cookie：它会从`getAllResponseHeaders()`头返回集合中过滤掉
cookie 头，而如果给`getResponseHeader()`传递`'Set-Cookie'`和`'Set-Cookie2'`则返回
`null`。
2. 在跨域的情况下，默认只能读取 “Simple response header”，即以下六个：
    * `Cache-Control`
    * `Content-Language`
    * `Content-Type`
    * `Expires`
    * `Last-Modified`
    * `Pragma`
3. 如果想读取相应的其他首部，需要服务器设置`Access-Control-Expose-Headers`。参考：
`Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\CORSAccessControl.md`


## Response body
### Handle text response
The response body is available in textual form from the `responseText` property
or in Document form from the `responseXML` property.

### Handle binary response
#### `response`
* Returns the response's body. It can be of the type `ArrayBuffer`, `Blob`,
`Document`, JavaScript object, or a DOMString, depending of the value of
`XMLHttpRequest.responseType` property.
* Value of `response` is `null` if the request is not complete or was not
successful.
* However, if the value of `responseType` was set to `text` or the empty string,
`response` can contain the partial text response while the request is still in
the `loading` state.
* If your cross-origin request requires these kinds of credentials to succeed,
you must set the `withCredentials` property of the `XMLHttpRequest` to `true`
before you `send()` the request.

#### `responseType`
* The `XMLHttpRequest.responseType` property is an enumerated value that returns
the type of the response.
* It also lets the author change the response type to one `arraybuffer`, `blob`,
`document`, `json`, or `text`.
* If an empty string is set as the value of `responseType`, it is assumed as
type `text`.
* Setting the value of responseType to `document` is ignored if done in a Worker
environment.
* When setting `responseType` to a particular value, the author should make sure
that the server is actually sending a response compatible to that format. If
the server returns data that is not compatible to the responseType that was set,
the value of response will be `null`.
* [兼容性不好](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#Browser_compatibility)

```js
let xhr = new XMLHttpRequest();
xhr.open("GET", "test.mp4");
xhr.responseType = "blob";
xhr.onprogress = function(ev) {
    console.log(ev.loaded + "/" + ev.total); // show progress, if needed
};
xhr.onload = function() {
    console.log(xhr.response); // 获得 MP4 文件的 Blob 对象
}
xhr.send(null);
```

### `overrideMimeType()`
1. 服务器响应的正常解码是假设服务器为这个响应发送了`Content-Type`头和正确的 MIME 类型。
2. 假如，如果服务器发送 XML 文档但没有设置适当的 MIME 类型，那么 XMLHttpRequest 对象
将不会解析它且设置`responseXML`属性。或者，如果服务器在`Content-Type`头中包含了错误的
`charset`参数，那么 XMLHttpRequest 将使用错误的编码来解析响应，并且`responseText`中
的字符可能是错的。
3. XHR2 定义了`overrideMimetype()`方法来解决这个问题。如果相对于服务器你更了解资源的
MIME 类型，那么在调用`send()`之前把类型传递给`over-rideMimeType()`，这将使
XMLHttpRequest 忽略`Content-Type`头而使用指定的类型。
4. 假设你将下载 XML 文件，而你计划把它当成纯文本对待。可以使用`setOverrideMimeType()`
让 XMLHttpRe-quest 知道它不需要把文件解析成 XML 文档。
```js
// Don't process the response as an XML document
request.overrideMimeType("text/plain; charset=utf-8")
```


## Response progress
### Response progress events
1. XHR2 defines a more useful set of events, the `XMLHttpRequest` object
triggers different types of events at different phases of the request so that it
 is no longer necessary to check the `readyState` property
1. 在之前的示例中，使用`readystatechange`事件探测 HTTP 请求的完成。XHR2 规范草案定义
了更有用的事件集，在这个新的事件模型中，XMLHttpRequest 对象在请求的不同阶段触发不同类
型的事件，所以它不再需要检查`readyState`属性。
    1. `loadstart`: Fires when the first byte of the response has been received.
    2. `progress`: Fires repeatedly as a response is being received. If a
        request completes very quickly, it may never fire a `progress` event. 测
        试响应为空时，不会触发`progress`，但仍然会触发下面的`load`和`loadend`
    3. `error`: Fires when there was an error attempting the request.
    4. `abort`: Fires when the connection was terminated by calling `abort()`.
    5. `timeout`: 如果设置了`XMLHttpRequest.timeout`，在响应时间超过了该属性值的时
        候，就会触发该事件。如果在请求阶段就已经超时了，那也算是响应超时。即不管什么原
        因，只要在指定的时间内没有完成响应，就会触发该事件。
    6. `load`: Fires when the response has been fully received.
    7. `loadend`: Fires when the communication is complete and after firing
        error, abort, or load.
2. Each request begins with the `loadstart` event being fired; followed by one
or more `progress` events; then one of `error`, `abort`, or `load`; finally
ending with `loadend`.
3. IE 到10才开始支持

### 事件顺序
1. When the `send()` method is called, a single `loadstart` event is fired.
2. While the server’s response is being downloaded, the `XMLHttpRequest` object
fires `progress` events, typically every 50 milliseconds or so, and you can use
 these events to give the user feedback about the progress of the request.
3. If a request completes very quickly, it may never fire a `progress` event.
4. When a request is complete, a `load` event is fired.
5. A complete request is not necessarily a successful request, and your handler
for the load event should check the `status` of the `XMLHttpRequest` object to
ensure that you received a HTTP “200 OK” response rather than a “404 Not Found”
response.
下面的例子是前端发送一个约 12MB 的文件，后端原样返回：
```js
document.querySelector('#file').addEventListener("change", function() {
    let file = this.files[0];
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('loadstart', function(){
        console.log('loadstart');
    });
    xhr.addEventListener('progress', function(){
        console.log('progress');
    });
    xhr.addEventListener('load', function(){
        console.log('load');
    });
    xhr.addEventListener('loadend', function(){
        console.log('loadend');
    });

    xhr.open('POST', 'http://localhost:3000');
    xhr.send(file);
}, false);
```

浏览器 console 输出为：
```
loadstart
④ progress
load
loadend
```
`progress`的次数并不稳定，试了几次，最少3次，最多有11次

### 获取下载进度
1. The event object associated with these progress events has three useful
properties in addition to the normal Event object properties like `type` and
`timestamp`.
2. The `loaded` property is the number of bytes that have been transferred so
far. The `total` property is the total length (in bytes) of the data to be
transferred, from the “Content-Length” header, or `0` if the content length is
not known. Finally, the `lengthComputable` property is `true` if the content
length is known and is `false` otherwise.

```js
let num = 0;
document.querySelector('#file').addEventListener("change", function() {
    let file = this.files[0];
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('progress', function(ev){
        if (ev.lengthComputable){
            num = ev.loaded / ev.total * 100;
            console.log(Math.round(num) + '%');
        }
    });
    xhr.addEventListener('load', function(ev){
        // 响应的数据太小以至于没有触发 progress 事件，这里直接显示 100%
        if (!num){
            console.log('100%');
        }
    });

    xhr.open('POST', 'http://localhost:3000');
    xhr.send(file);
}, false);
```


## Upload progress
* `XMLHttpRequest.upload`对象也拥有上面响应的7个事件。
* 这里的`timeout`事件时在请求等待超时时触发。如果在规定时间内请求完成了，即使响应过慢而
导致超时，只会触发`XMLHttpRequest.ontimeout`，而不会触发
`XMLHttpRequest.upload.ontimeout`。但如果`XMLHttpRequest.upload.ontimeout`被触发
了，因为规定时间内也没有响应，所以也会触发`XMLHttpRequest.ontimeout`。



## CORS Security Details
* If you pass a username and password to the XMLHttpRequest `open()` method,
they will never be sent with a cross-origin request (that would enable
distributed password-cracking attempts).不懂，什么是 username and password ？

### `withCredentials`
1. Cross-origin requests do not normally include any other user credentials
either: cookies and HTTP authentication tokens are not normally sent as part of
the request and any cookies received as part of a cross-origin response are
discarded.
2. If your cross-origin request requires these kinds of credentials to succeed,
you must set the `withCredentials` property of the XMLHttpRequest to `true`
before you `send()` the request.
3. 显然，更重要的是也要经过服务端的同意才行：
    * `Access-Control-Allow-Credentials`首部要设为`true`
    * `Access-Control-Allow-Origin`不能设置为通配符
