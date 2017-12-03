# Base64

## Basic
* [为什么要使用base64编码，有哪些情景需求？](https://www.zhihu.com/question/36306744)
* [Base64编码原理与应用](http://blog.xiayf.cn/2016/01/24/base64-encoding/)



## 编码
### JavaScript
#### `FileReader.readAsDataURL()` 获取二进制文件的DataURL
```html
<!--通过表单获取图片文件-->
<input type="file" id="chooseImage" />
```
```js
/*
 * 接受获取到的文件后，使用FileReader类型实例的readAsDataURL方法读取DataURI，
 * 在读取完成的回调函数中，实例的result属性就是图片的readAsDataURL
 */
document.querySelector("#chooseImage").addEventListener("change", function(ev)
{
	let fileReader = new FileReader();
	fileReader.addEventListener("load", function(ev){ // 读取完成的回调
		console.log( ev.target.result ); // DataURI
	});
	fileReader.readAsDataURL( ev.target.files[0] ); // 读取
});
```

#### `WindowOrWorkerGlobalScope.btoa()` 将单字节字符串进行Base64编码
* This method creates a base-64 encoded ASCII string from a String object in
which each character in the string is treated as a byte of binary data.
* Since this function treats each character as a byte of binary data, regardless
 of the number of bytes which actually make up the character, an
`InvalidCharacterError` exception is thrown if any character's code point is
outside the range `0x00` to `0xFF`.
* You can use this method to encode data which may otherwise cause communication
 problems, transmit it, then use the `atob()` method to decode the data again.
For example, you can encode control characters such as ASCII values 0 through 31



#### `HTMLCanvasElement.toDataURL()` 方法  
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
2. 使用这个方法对图片进行编码后的返回值并不是图片真实的base64数据组成的Data URI，
 而是有更多的数据。下面以一个36.6KB的图片为例，其真正的Data URI字符串长度是50083：
3. 使用该方法且`quality`参数为默认的0.92，编码后的返回值字符串长度为87647；如果再对其解码为图片，图片大小就变为了64.1KB。  
4. 所以要涉及传输和保存的情况，可以考虑降低品质。
5. 看起来第一个输出图片类型参数只能是`image/png`、`image/png`或`image/webp`之一，如果设置为其他类型，最终都会输出位png类型的图片
6. 只有对于jpeg和webp格式的图片，`quality`参数才是有效的。不过你可以把其他格式的设定为`image/jpeg`或`image/webp`类型来进行`quality`修改，最后会转化为指定的格式。例如把png图片转化为不透明的jpg或者转化为同样透明的webp，同时也进行压缩。
##### 解决跨域问题
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
	1. 默认情况下，对于跨域请求的图片，canvas不能对其进行获取图片内部数据的。
	2. 首先需要对图片元素进行如下属性设置：`img.crossOrigin = "Anonymous";`
	3. 其次要在服务器设置对被请求的图片进行`CORS`设置。  
		目前知道的一个方法是在图片所在目录或者其包含目录设置如下`.htaccess`文件：`Header set Access-Control-Allow-Origin "*"`

### PHP
1. PHP的`base64_encode`函数编码后只是base64部分，还需要自己加上前面的内容
2. 以图片为例，但文件类型并不限于图片  

```php
<?php
$sFilePath = "image/test.jpg";
getDataURI($sFilePath); // 返回DataURI

function getDataURI($sFilePath)
{
	$sBase64 = base64_encode( file_get_contents($sFilePath) );

	if( function_exists('mime_content_type') )  // PHP6中断了对该函数的支持
	{
		$sMIMEType = mime_content_type($sFilePath);
	}
	else
	{
		function getMIMEType($sFilePath)
		{
			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			$sMIMEType = finfo_file($finfo, $sFilePath);
			finfo_close($finfo);
			return $sMIMEType;
		}
		$sMIMEType = getMIMEType($sFilePath);
	}

	$sDataURI = 'data: ' . $sMIMEType . ';base64,' . $sBase64;
	return $sDataURI;
}
```

## 二进制文件解码
### JS
#### `WindowOrWorkerGlobalScope.atob()`方法
* Decodes a string of data which has been encoded using base-64 encoding.
* Throws a `DOMException` if the length of passed-in string is not a multiple of
 4

#### dataURI to Blob
```js
function dataURItoBlob(dataURI) {

	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
```
Blob 可以转为FormData或者img
##### to FormData
```js
let blob = dataURItoBlob(dataURI),
	fd = new FormData();
fd.append("image", blob);
```
##### to img
`URL.createObjectURL()`
* Creates a DOMString containing a URL representing the object given in the parameter.
* The URL lifetime is tied to the document in the window on which it was created.
* The new object URL represents the specified File object or Blob object.
* `URL.revokeObjectURL()`: releases an existing object URL which was previously created by calling URL.createObjectURL().

```js
let blob = dataURItoBlob(dataURI),
	img = document.createElement("img");

img.addEventListener("load", function(e)
{
	window.URL.revokeObjectURL(img.src); // 清除释放
});

img.src = window.URL.createObjectURL(blob);
document.body.appendChild(img);
```


### PHP
PHP的`base64_decode`函数只能解码DataURI的base64部分，所以需要自己提取其中的Base64部分
```php
<?php
$sDataURI = 'data: image/jpeg;base64,/9j/4QAYR省略省略省略';
$sBase64 = explode(';base64,', $sDataURI)[1];
file_put_contents('image.jpg', base64_decode($sBase64) );
```
