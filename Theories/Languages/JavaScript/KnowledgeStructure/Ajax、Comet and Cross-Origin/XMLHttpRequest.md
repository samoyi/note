# XMLHttpRequest


## About HTTP
###  HTTP request
An HTTP request consists of four parts:
* the HTTP request method or “verb”
* the URL being requested
* an optional set of request headers, which may include authentication
  information
* an optional request body

### HTTP response
The HTTP response sent by a server has three parts:
* a numeric and textual status code that indicates the success or failure of the
  request
* a set of response headers
* the response body


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

### `abort()`
You can cancel an asynchronous request before a response is received by calling
the `abort()`


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
1. XMLHttpRequest handles cookies automatically: it filters cookie headers out of
the set returned by `getAllResponseHeaders()` and returns `null` if you pass
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


## Encoding the Request Body
### Form-encoded requests
#### MIME type
```js
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
```

#### Encoding an object for a form-encoded request
```js
/**
* Encode the properties of an object as if they were name/value pairs from
* an HTML form, using application/x-www-form-urlencoded format
*/
function encodeFormData(data) {
    if (!data) return ""; // Always return a string
    var pairs = []; // To hold name=value pairs
    for(var name in data) { // For each name
        if (!data.hasOwnProperty(name)) continue; // Skip inherited
        if (typeof data[name] === "function") continue; // Skip methods
        var value = data[name].toString(); // Value as string
        name = encodeURIComponent(name.replace(" ", "+")); // Encode name
        value = encodeURIComponent(value.replace(" ", "+")); // Encode value
        pairs.push(name + "=" + value); // Remember name=value pair
    }
    return pairs.join('&'); // Return joined pairs separated with &
}
```

#### 表单序列化，用于 AJAX 请求
使用表单来收集数据，但不使用表单提交
```js
function serialize(form){
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;

    for (i=0, len=form.elements.length; i < len; i++){
        field = form.elements[i];

        switch(field.type){
            case "select-one":
            case "select-multiple":

            if (field.name.length){
                for (j=0, optLen = field.options.length; j < optLen; j++){
                    option = field.options[j];
                    if (option.selected){
                        optValue = "";
                        if (option.hasAttribute){
                            optValue = (option.hasAttribute("value") ?
                            option.value : option.text);
                        } else {
                            optValue = (option.attributes["value"].specified ?
                            option.value : option.text);
                        }
                        parts.push(encodeURIComponent(field.name) + "=" +
                        encodeURIComponent(optValue));
                    }
                }
            }
            break;

            case undefined:        //字段集
            case "file":           //文件输入
            case "submit":         //提交按钮
            case "reset":          //重置按钮
            case "button":         //自定义按钮
            break;

            case "radio":          //单选按钮
            case "checkbox":       //复选框
            if (!field.checked){
                break;
            }
            /* 执行默认操作 */

            default:
            //不包含没有名字的表单字段
            if (field.name.length){
                parts.push(encodeURIComponent(field.name) + "=" +
                encodeURIComponent(field.value));
            }
        }
    }
    return parts.join("&");
}
```

### JSON-encoded requests
#### MIME type
```js
xhr.setRequestHeader('Content-Type', 'application/json');
```

#### Encoding an object for a JSON-encoded request
```js
JSON.stringify()
```

### Uploading a file
通过 AJAX 上传的话其实只需要一个`input`就行了

```html
<input type="file" id="file" name="file" />
```
```js
document.querySelector('#file').addEventListener("change", function() {
    let file = this.files[0];
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(file);
}, false);
```

#### 跨域触发 preflight request
即使不设置 `Content-Type`，浏览器也会自动设置。例如发送 JPG 时会自动设置
`Content-Type: image/jpeg`。因此在跨域请求时，会触发 preflight request。


### timeout
* The XMLHttpRequest.timeout property is an unsigned long representing the number of milliseconds a request can take before automatically being terminated.
* The default value is 0, which means there is no timeout.
* Timeout shouldn't be used for synchronous XMLHttpRequests requests used in a document environment or it will throw an InvalidAccessError exception.
* When a timeout happens, a timeout event is fired.
* In Internet Explorer, the timeout property may be set only after calling the open() method and before calling the send() method.






### `post()`
* 不同于表单提交数据，XHR提交的参数名和参数值在必要的时候都需要通过`encodeURIComponent`进行编码。例如提交“1+2+3”，如果通过表单，后台接收到的仍然是“1+2+3”，但如果通过`XHR`且不编码，后台接收到的就变成了“1 2 3”。
* 至少在火狐中，如果手动模拟post发送时，触发事件不能是点击submit

###  `responseURL`
* Returns the serialized URL of the response or the empty string if the URL is null.
* If the URL is returned, URL fragment if present in the URL will be stripped away.
* The value of responseURL will be the final URL obtained after any redirects.
  ```js
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.abc.cn/index.html#123?name=22");
  xhr.onload = function() {
  	console.log(xhr.responseURL); // http://www.abc.cn/index.html
  }
  xhr.send(null);
  ```

### `responseType`
* The `XMLHttpRequest.responseType` property is an enumerated value that returns the type of the response.
* It also lets the author change the response type to one "arraybuffer", "blob", "document", "json", or "text".
* If an empty string is set as the value of responseType, it is assumed as type "text".
* Setting the value of responseType to "document" is ignored if done in a  Worker environment.
* When setting `responseType` to a particular value, the author should make sure that the server is actually sending a response compatible to that format. If the server returns data that is not compatible to the responseType that was set, the value of response will be `null`.
* Setting responseType for synchronous requests will throw an `InvalidAccessError` exception. 实际测试并未发现。
* [兼容性不好](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#Browser_compatibility)

Value | Response type
-- | --
"" | DOMString(dafault)
"arraybuffer" | ArrayBuffer
"blob" | Blob
"document" | Document
"json" | JavaScript object, parsed from a JSON string returned by the server
"text" | DOMString

<mark>不懂设置这个属性的意义。在请求一个二进制文件的时候，不管是否设置这个属性为"blob"，服务器都会回应相同的类型，但不设置却不能正确的接受响应</mard>

### `response`
* Returns the response's body. It can be of the type ArrayBuffer, Blob, Document, JavaScript object, or a DOMString, depending of the value of `XMLHttpRequest.responseType` property.
* Value of response is null if the request is not complete or was not successful.
* However, if the value of responseType was set to "text" or the empty string, `response` can contain the partial text response while the request is still in the `loading` state.
* If your cross-origin request requires these kinds of credentials to succeed, you must set the `withCredentials` property of the `XMLHttpRequest` to true before you `send()` the request.


## Order Matters:  
The parts of an HTTP request have a specific order: the request method and URL
must come first, then the request headers, and finally the request body.
XMLHttpRequest implementations generally do not initiate any networking until
the `send()` method is called. But the XMLHttpRequest API is designed as if each
 method was writing to a network stream. This means that the XMLHttpRequest
method must be called in an order that matches the structure of an HTTP request.
`setRequestHeader()`, for example, must be called after you call `open()` and
before you call `send()` or it will throw an exception.



## CORS
### Security Details
* If you pass a username and password to the XMLHttpRequest open() method, they will never be sent with a cross-origin request (that would enable distributed password-cracking attempts).
* Cross-origin requests do not normally include any other user credentials either: cookies and HTTP authentication tokens are not normally sent as part of the request and any cookies received as part of a cross-origin response are discarded.


***
## POST Blob
* IE到10才开始支持
* XHR2允许向`send()`方法传入包括file类型在内的任何Blob对象
* The type property of the Blob will be used to set the  Content-Type header for the upload, if you do not set that header explicitly yourself.
* If you need to upload binary data that you have generated, you can convert the data to a Blob and use it as a request body.


***
##  multipart/form-data requests
* When HTML forms include file upload elements and other elements as well, the browser cannot use ordinary form encoding and must POST the form using a special content-type known as “multipart/form-data”. 使用表单上传文件时，`enctype`属性也是如此设置。
* This encoding involves the use of long “boundary” strings to separate the body of the request into multiple parts.
* For textual data, it is possible to create “multipart/form-data” request bodies by hand, but it is tricky.
* XHR2 defines a new FormData API that makes multipart request bodies simple. With FormData, the `send()` method will define an appropriate boundary string and set the “Content-Type” header for the request.
  ```js
    let fd = new FormData(),
        xhr = new XMLHttpRequest();

    // 选择了一张名为 640.jpg 的图片
    document.querySelector("#file").addEventListener("change", function()
    {
    	fd.append("file", this.files[0]);
    	fd.append("text", "2233");
    	xhr.open("POST", "test.php",  true);
    	xhr.send(fd);
    });
  ```

  运行上述代码后，查看请求信息
  Content-Type:  
  ```
  Content-Type:multipart/form-data;  
  boundary=----WebKitFormBoundary7eGjoECbuoKAa5N8
  ```

  Request Payload
  ```
  ------WebKitFormBoundary7eGjoECbuoKAa5N8
  Content-Disposition: form-data; name="file"; filename="640.jpg"
  Content-Type: image/jpeg

  ------WebKitFormBoundary7eGjoECbuoKAa5N8
  Content-Disposition: form-data; name="text"

  2233
  ------WebKitFormBoundary7eGjoECbuoKAa5N8--
  ```


***
##  XHR2 FormData
### Summary
1. 截至2017.5，[浏览器支持](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility)不好
2. The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method.
3.  It uses the same format a form would use if the encoding type were set to "multipart/form-data".

### Create  FormData instance
* 创建空的`FormData`实例
    ```js
    var formData = new FormData();
    ```
* 使用已有表单来创建一个实例  
    ```html
    // HTML
    <form id="myForm" action="" method="post">
        <input type="text" name="name" value="33" />
        <input type="text" name="age" value="22" />
        <input type="text" name="age" value="233" />
        <input id="sub" type="button" value="提交" />
    </form>
    // JS
    var form = document.getElementById("myForm");
    var formData = new FormData(form);
    ```

### Get data
  ```js
  console.log( formData.get('name') ); // 33
  // 获取一键多值数据
  console.log( formData.getAll('age') ); // ["22", "233"]
  ```
### Append data
  ```js
  formData.append("sex", "female");
  console.log( formData.get('sex') ); // female
  ```
即使是相同的键名，也不会覆盖，而是重复添加
  ```js
  let formData = new FormData();

  formData.append("name", "li");
  formData.append("name", "ni");

  for (var key of formData.keys()) {
     console.log(key); // 输出两个 "name"
  }

  for (var value  of formData.values()) {
     console.log(value); // 输出 "li" 和 "ni"
  }
  ```
所以在多次提交数据时，每次都要初始化。

### Update data
  ```js
  formData.set("sex", "male");
  console.log( formData.get('sex') ); // male
  // 如果要修改的key不存在，将创建该key并赋值
  formData.set("height", "160");
  console.log( formData.get('height') ); // 160
  ```

### Check if a key exists
  ```js
  console.log( formData.has("height") ); // true
  console.log( formData.has("weight") ); // false
  ```

### Delete data
  ```js
  formData.delete("height");
  console.log( formData.has("height") ); // false
  ```

### Iterator
* Go through all key/value pairs
    ```js
    var i = formData.entries();
    for (var pair of i) {
       console.log(pair); // 分别为：["name", "33"]、["age", "22"]、["age", "233"]、["sex", "male"]
    }
    ```
* Go through all keys
    ```js
    for (var key of formData.keys()) {
       console.log(key); // 分别为：name、age、age、sex
    }
    ```
*  Go through all values
    ```js
    for (var value of formData.values()) {
       console.log(value);  // 分别为：33、22、233、male
    }
    ```

### Post data    
使用FormData的方便之处体现在不必明确地在XHR对象上设置请求头部。XHR对象能够识别传入的数据类型是FormData的实例，并配置适当的头部信息。
  ```js
  var xhr = new XMLHttpRequest();
  xhr.open("post", "test.php", true);
  xhr.send(formData);
  ```


## HTTP Progress Events (IE到10才开始支持)
The XHR2 draft specification defines a more useful set of events and these have already been implemented by Firefox, Chrome, and Safari. In this new event model, the `XMLHttpRequest` object triggers different types of events at different phases of the request so that it is no longer necessary to check the `readyState` property

1. **loadstart**: Fires when the first byte of the response has been received.
2. **progress**: Fires repeatedly as a response is being received.
3. **error**: Fires when there was an error attempting the request.
4. **abort**: Fires when the connection was terminated by calling `abort()`.
5. **load**: Fires when the response has been fully received.
6. **loadend**: Fires when the communication is complete and after firing error, abort, or load.

Each request begins with the loadstart event being fired; followed by one or more progress events; then one of error, abort, or load; finally ending with loadend.
