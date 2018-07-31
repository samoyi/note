# XMLHttpRequest


## `XMLHttpRequest` Object
1. Browsers define their HTTP API on an `XMLHttpRequest` class.
2. Each instance of this class represents a single request/response pair, and
the properties and methods of the object allow you to specify request details
and extract response data.
3. You can also reuse an existing XMLHttpRequest object, but note that doing so
  will abort any request pending through that object.
4. XMLHttpRequest is designed to work with the HTTP and HTTPS protocols. In
theory, it could be made to work with other protocols, such as FTP, but parts of
 the API, such as the request method and the response status code, are
HTTP-specific.


## Use `open()` to specify the method and the URL
* In addition to `GET` and `POST`, the XMLHttpRequest specification also allows
`DELETE`, `HEAD`, `OPTIONS`, and `PUT` as the first argument to `open()`. (The
`HTTP CONNECT`, `TRACE`, and `TRACK` methods are explicitly forbidden as
security risks.)
* The second argument to `open()` is the URL that is the subject of the request.
 This is relative to the URL of the document that contains the script that is
calling `open()` . If you specify an absolute URL, the protocol, host, and port
must generally match those of the containing document.


## Use `setRequestHeader()` to set the request headers
* `POST` requests  need a `Content-Type` header to specify the MIME type of the
request body
    ```js
    // 模拟表单 POST 时的设置：
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ```
* If you call `setRequestHeader()` multiple times for the same header, the new
value does not replace the previously specified value: instead, the HTTP request
 will include multiple copies of the header or the header will specify multiple
values.
* You cannot specify the `Content-Length`, `Date`, `Referer`, or `User-Agent`
headers yourself: `XMLHttpRequest` will add those automatically for you and will
 not allow you to spoof them.
* Similarly, `XMLHttpRequest` object automatically handles cookies, and
connection lifetime, charset, and encoding negotiations, so you’re not allowed
to pass any of these headers to `setRequestHeader()`:
    ```
    Accept-Charset     Content-Transfer-Encoding    TE
    Accept-Encoding    Date                         Trailer
    Connection         Expect                       Transfer-Encoding
    Content-Length     Host                         Upgrade
    Cookie             Keep-Alive                   User-Agent
    Cookie2            Referer                      Via
    ```
* You can specify an “Authorization” header with your request, but you do not
normally need to do so. If you are requesting a password-protected URL, pass the
 username and password as the fourth and fifth arguments to `open()`, and
XMLHttpRequest will set appropriate headers for you.    


## Use `send()` to specify the optional request body and send it off to the server
GET requests never have a body, so you should pass  null or omit the argument.
POST requests do generally have a body, and it should match the “Content-Type”
header you specified with `setRequestHeader()`.

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
如果`xhr.send('str=我+你转义后是%e6%88%91%2b%e4%bd%a0')`，服务端最终解析获得的是
`我 你转义后是我+你`；如果
`xhr.send('str=' + encodeURIComponent('我+你转义后是%e6%88%91%2b%e4%bd%a0'))`，服
务端最终解析获得的就是`我+你转义后是%e6%88%91%2b%e4%bd%a0`


## Aborting Requests and Timeouts
### `XMLHttpRequest.abort()`
1. You can cancel an HTTP request in process by calling the `abort()` method of
the XMLHttpRequest object. The `abort()` method is available in all versions of
XMLHttpRequest, and in XHR2, calling `abort()` triggers an abort event on the
object.
2. The primary reason to call `abort()` is to cancel or time-out requests that
have taken too long to complete or when the responses become irrelevant. Suppose
 you’re using XMLHttpRequest to request auto-complete suggestions for a text
input field. If the user types a new character into the field before the
server’s suggestions can arrive, then the pending request is no longer
interesting and can be aborted.

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
1. In theory, the readystatechange event is triggered every time the `readyState`
property changes. In practice, the event may not be fired when  readyState
changes to `0` or `1`.
2. All browsers do fire the `readystatechange` event when `readyState` has
changed to the value `4` and the server’s response is complete.

### HTTP status
`status` and `statusText`

### Response headers
`getResponseHeader()` and `getAllResponseHeaders()`
1. XMLHttpRequest handles cookies automatically: it filters cookie headers out
of the set returned by `getAllResponseHeaders()` and returns `null` if you pass
“Set-Cookie”  or “Set-Cookie2” to `getResponseHeader()`
2. 在跨域的情况下，默认只能读取“Simple response header”，即以下六个：
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
1. If a server sends an XML document without setting the appropriate MIME type,
for example, the XMLHttpRequest object will not parse it and set the responseXML
property. Or if a server includes an incorrect “charset” parameter in the
`content-type` header, the XMLHttpRequest will decode the response using the
wrong encoding and the characters in  responseText may be wrong.
2. XHR2 defines an `overrideMimeType()` method to address this problem and a
number of browsers have already implemented it. If you know the MIME type of a
resource better than the server does, pass the type of `overrideMimeType()`
before you call `send()` — this will make XMLHttpRequest ignore the
`content-type` header and use the type you specify instead.
3. Suppose you’re downloading an XML file that you’re planning to treat as plain
text. You can use `setOverrideMimeType()` to let the XMLHttpRequest know that
it does not need to parse the file into an XML document:
```js
// Don't process the response as an XML document
request.overrideMimeType("text/plain; charset=utf-8")
```


## Response progress
### Response progress events
1. XHR2 defines a more useful set of events, the `XMLHttpRequest` object
triggers different types of events at different phases of the request so that it
 is no longer necessary to check the `readyState` property
    1. `loadstart`: Fires when the first byte of the response has been
        received.
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
3. IE到10才开始支持

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
* `XMLHttpRequest.upload` 对象也拥有上面响应的7个事件。
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
