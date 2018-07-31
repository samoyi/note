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


### 跨域发送 Blob 类型时触发 preflight request
即使不设置 `Content-Type`，浏览器也会自动设置。例如发送 JPG 时会自动设置
`Content-Type: image/jpeg`。因此在跨域请求时，会触发 preflight request。
