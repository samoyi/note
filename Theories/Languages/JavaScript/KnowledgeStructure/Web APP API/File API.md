## files集合

1. 在通过文件输入字段选择了一或多个文件时，files 集合中将包含一组 File 对象，每个 File
对象对应着一个文件。
2. 监听上传按钮的`change`事件并读取`input`按钮的`files`

#### File对象只读属性
* `name`：本地文件系统中的文件名。
* `size`：文件的字节大小。
* `type`：字符串，文件的 MIME 类型。
* `lastModifiedDate`：字符串，文件上一次被修改的时间


## FileReader 类型
FileReader 类型实现的是一种异步文件读取机制。  
可以把 FileReader 想象成 XMLHttpRequest，区别只是它读取的是文件系统，而不是远程服务器。

#### FileReader的方法
* `readAsText(file,encoding)`：以纯文本形式读取文件，将读取到的文本保存在`result`属
性中。第二个参数用于指定编码类型，是可选的。
* `readAsDataURL(file)`：读取文件并将文件以数据 URI 的形式保存在`result`属性中。
* `readAsBinaryString(file)`：读取文件并将一个字符串保存在`result`属性中，字符串中的
每个字符表示一字节。
* `readAsArrayBuffer(file)`：读取文件并将一个包含文件内容的`ArrayBuffer`保存在
`result`属性中。

#### FileReader的事件
* `progress` 每过 50ms 左右，就会触发一次`progress`事件
    * 通过事件对象可以获得与 XH R的`progress`事件相同的信息（属性）：
        * `lengthComputable`
        * `loaded`
        * `total`
    * 每次`progress`事件中都可以通过 FileReader的`result`属性读取到已经获得的文件内容
* `error`：相关的信息将保存到 FileReader 的`error`属性中。这个属性中将保存一个对象，该
对象只有一个属性 code，即错误码。这个错误码是`1`表示未找到文件，是`2`表示安全性错误，是
`3`表示读取中断，是`4`表示文件不可读，是`5`表示编码错误。
* `load`



```html
<body>
<input type="file" multiple id="uploadFileBtn">
<div id="output"></div>
<div id="progress"></div>
</body>
<script>
"use strict";
document.getElementById("uploadFileBtn").addEventListener("change", function()
{
    var info = "",
        output = document.getElementById("output"),
        progress = document.getElementById("progress"),
        files = this.files,
        type = "default",
        reader = new FileReader();

    if (/image/.test(files[0].type))
    {
        reader.readAsDataURL(files[0]);
        type = "image";
    }
    else {
        reader.readAsText(files[0]);
        type = "text";
    }

    reader.onerror = function()
    {
        output.innerHTML = "Could not read file, error code is " +
                            reader.error.code;
    };

    reader.onprogress = function(event)
    {
        if (event.lengthComputable)
        {
            progress.innerHTML = event.loaded + "/" + event.total ;
        }
    };

    reader.onload = function(){

        var html = "";

        switch(type){
            case "image":
                html = "<img src=\"" + reader.result + "\">";
                break;
            case "text":
                html = reader.result;
                break;
        }
        output.innerHTML = html;
    };
});
</script>
```


## ==读取部分内容 不懂，这之后的没看==
