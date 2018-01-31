# XMLHttpRequest

***
## About HTTP
###  HTTP request
An HTTP request consists of four parts:
* the HTTP request method or “verb”
* the URL being requested
* an optional set of request headers, which may include authentication information
* an optional request body

### HTTP response
The HTTP response sent by a server has three parts:
* a numeric and textual status code that indicates the success or failure of the request
* a set of response headers
* the response body


***
# `XMLHttpRequest` Object
* You can also reuse an existing XMLHttpRequest object, but note that doing so will abort any request pending through that object.
* In theory, it could be made to work with other protocols, such as FTP, but parts of the API, such as the request method and the response status code, are HTTP-specific.


***
## Methods and Properties
### `open()`
* In addition to `GET` and `POST`, the XMLHttpRequest specification also allows `DELETE`, `HEAD`, `OPTIONS`, and `PUT` as the first argument to open(). (The `HTTP CONNECT`, `TRACE`, and `TRACK` methods are explicitly forbidden as security risks.)

### timeout
* The XMLHttpRequest.timeout property is an unsigned long representing the number of milliseconds a request can take before automatically being terminated.
* The default value is 0, which means there is no timeout.
* Timeout shouldn't be used for synchronous XMLHttpRequests requests used in a document environment or it will throw an InvalidAccessError exception.
* When a timeout happens, a timeout event is fired.
* In Internet Explorer, the timeout property may be set only after calling the open() method and before calling the send() method.

### `setRequestHeader()`
* `POST` requests  need a `Content-Type` header to specify the MIME type of the request body
    ```js
    // 模拟表单POST时的设置：
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ```
* If you call `setRequestHeader()` multiple times for the same header, the new value does not replace the previously specified value: instead, the HTTP request will include multiple copies of the header or the header will specify multiple values.
* You cannot specify the `Content-Length`, `Date`, `Referer`, or `User-Agent` headers yourself: `XMLHttpRequest` will add those automatically for you and will not allow you to spoof them.
* `XMLHttpRequest` object automatically handles cookies, and connection lifetime, charset, and encoding negotiations, so you’re not allowed to pass any of these headers to `setRequestHeader()`
* Order Matters:  
    The parts of an HTTP request have a specific order: the request method and URL must come first, then the request headers, and finally the request body. XMLHttpRequest implementations generally do not initiate any networking until the `send()` method is called. But the XMLHttpRequest API is designed as if each method was writing to a network stream. This means that the XMLHttpRequest method must be called in an order that matches the structure of an HTTP request. `setRequestHeader()`, for example, must be called after you call `open()` and before you call `send()` or it will throw an exception.

### `readyState`
Value | Meaning
-- | --
0 | `open()` has not been called yet
1 | `open()` has been called
2 | `send()` has been called, and headers and status are available.
3 | Receiving. Some response data has been retrieved
4 | Complete. All of the response data has been retrieved and is available

### `status` and `statusText`

### `abort()`
You can cancel an asynchronous request before a response is received by calling the `abort()`

### `getAllResponseHeaders()`
* Returns all the response headers (except those whose field name is `Set-Cookie` or `Set-Cookie2`) , separated by CRLF, as a string, or null if no response has been received.
* If a network error happened, an empty string is returned.

### `getResponseHeader()`
* Returns the string containing the text of the specified header.
* 必要的时候，可以根据某项首部信息来决定如果作出反应。例如在判断`Content-Type`是`text/html`的时候才做后续的步骤，或者判断其使用的是什么字符集。
* If there are multiple response headers with the same name, then their values are returned as a single concatenated string, where each value is separated from the previous one by a pair of comma and space.
* The `getResponseHeader()` method returns the value as a UTF byte sequence. * The search for the header name is case-insensitive.
* 如果试图获取`Set-Cookie` 或 `Set-Cookie2` 的值，或返回`null`。

### `overrideMimeType()`
*  If you know the MIME type of a resource better than the server does, pass the type of `overrideMimeType()` before you call `send()`— this will make XMLHttpRequest ignore the content-type header and use the type you specify instead.
*  虽然服务器的response仍然给出了它的`Content-Type`，但`XMLHttpRequest`会按照`overrideMimeType()`设定的类型来进行解析。  
例如在请求一个`XML`文件时，如果设定了`overrideMimeType("text/plain")`，则`responseXML`的属性值不是`document`对象，而是`null`

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


***
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
