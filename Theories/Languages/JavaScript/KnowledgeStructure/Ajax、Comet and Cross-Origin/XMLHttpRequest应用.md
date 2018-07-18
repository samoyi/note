# XMLHttpRequest


## Form-encoded requests
### MIME type
```js
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
```

### Encoding an object for a form-encoded request
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

### 表单序列化，用于 AJAX 请求
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


## JSON-encoded requests
### MIME type
```js
xhr.setRequestHeader('Content-Type', 'application/json');
```

### Encoding an object for a JSON-encoded request
```js
JSON.stringify()
```


## multipart/form-data requests
1. When HTML forms include file upload elements and other elements as well, the
browser cannot use ordinary form encoding and must POST the form using a special
 `Content-Type` known as `multipart/form-data`. 使用表单上传文件时，`enctype`属性
也是如此设置。
2. This encoding involves the use of long “boundary” strings to separate the
body of the request into multiple parts.
3. For textual data, it is possible to create `multipart/form-data` request
bodies by hand, but it is tricky.
4. XHR2 defines a new `FormData` API that makes multipart request bodies simple.
 With FormData, the `send()` method will define an appropriate boundary string
and set the `Content-Type` header for the request.

```js
let fd = new FormData(),
    xhr = new XMLHttpRequest();

// 选择了一张名为 640.jpg 的图片
document.querySelector("#file").addEventListener("change", function(){
	fd.append("file", this.files[0]);
	fd.append("text", "2233");
	xhr.open("POST", "test.php",  true);
	xhr.send(fd);
});
```

运行上述代码后，查看请求信息
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


## POST Blob
1. XHR2允许向`send()`方法传入包括`file`类型在内的任何 Blob 对象
2. The type property of the Blob will be used to set the `Content-Type` header
for the upload, if you do not set that header explicitly yourself.
3. If you need to upload binary data that you have generated, you can convert
the data to a Blob and use it as a request body.
4. IE 到 10 才开始支持

```html
<input type="file" id="file" name="file" />
```
```js
document.querySelector('#file').addEventListener("change", function() {
    let file = this.files[0];
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000');
    xhr.send(file);
}, false);
```


## 跨域发送 file 类型时触发 preflight request
即使不设置 `Content-Type`，浏览器也会自动设置。例如发送 JPG 时会自动设置
`Content-Type: image/jpeg`。因此在跨域请求时，会触发 preflight request。




================================================================================




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
