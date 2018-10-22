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
1. 当 HTML 表单同时包含文件上传元素和其他元素时，浏览器不能使用普通的表单编码而必须使用
称为`multipart/form-data`的特殊`Content-Type`来用`POST`方法提交表单。使用表单上传文
件时，`enctype`属性也是如此设置。
2. 这种编码包括使用长`boundary`字符串把请求主体分离成多个部分。
3. 对于文本数据，可以动创建`multipart/form-data`请求主体，但很复杂。XHR2 定义了新的
`FormData` API，它容易实现多部分请求主体。
4. 首先，使用`FormData()`构造函数创建`FormData`对象，然后按需多次调用这个对象的
`append()`方法把个体“部分”（可以是字符串、File 或 Blob 对象）添加到请求中。最后，把
`FormData`对象传递给`send()`方法。`send()`方法将对请求定义合适的`boundary`字符串和设
置`Content-Type`头。

```js
let fd = new FormData();
let xhr = new XMLHttpRequest();

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
1. XHR2 允许向`send()`方法传入包括`file`类型在内的任何 Blob 对象
2. 如果没有显式设置`Content-Type`头，这个 Blob 对象的`type`属性用于设置待上传的
`Content-Type`头。
3. 如果需要上传已经产生的二进制数据，可以把数据转化为 Blob 并将其作为请求主体。

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
