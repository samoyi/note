# Data URI

## Summary
1. The data URI scheme is a uniform resource identifier (URI) scheme that provides a way to include data in-line in web pages as if they were external resources.
2. 虽然也可以用来编码文本及其他类型信息，但意义不大。编码图片才具有使用的价值。

## Syntax

```
data:[<media type>][;base64],<data>
```
## Advantages
* ### 不发送请求，因此节省了请求本身的带宽。  
	例如一个600bytes的图片使用Data URI编码后大小变成了800bytes。但如果HTTP请求该图片时请求本身消耗的带宽超过200bytes的话，则至少在节省带宽这方面，这里使用Data URI更合适。
* ### For transferring many small files (less than a few kilobytes each), this can be faster.  
	TCP transfers tend to start slowly. If each file requires a new TCP connection, the transfer speed is limited by the round-trip time rather than the available bandwidth. Using HTTP keep-alive improves the situation, but may not entirely alleviate the bottleneck.
* ### 配置较差的HTTPS有时比使用Data URI要慢。  
	On badly configured servers, HTTPS requests have significant overhead over common HTTP requests, so embedding data in data URIs may improve speed in this case.
* ### 不受最大请求并发数的限制
* ### It is possible to manage a multimedia page as a single file

## Disadvantages:
* ### Data URIs are not separately cached from their containing documents  
	当你重新加载页面时，图片和背景图片会优先使用缓存的的图片文件。但因为Data URIs图片没办法独立成图片文件进行缓存，所以它们也会被重新加载
* ### Data is included as a simple stream, and many processing environments may not support using containers to provide greater complexity
	==不懂==  Data is included as a simple stream, and many processing environments (such as web browsers) may not support using containers (such as multipart/alternative or message/rfc822) to provide greater complexity such as metadata, data compression, or content negotiation.
* ### Base64-encoded data URIs are 1/3 larger in size than their binary equivalent.
* ### Data URIs make it more difficult for security software to filter content.
* ### 因为需要进行解码处理，所以在性能相对弱的移动端，处理过程会占用相对较多的资源，从而导致实际速度明显变慢(2013年的测试结果)
	[On Mobile, Data URIs are 6x Slower than Source Linking (New Research)](http://dev.mobify.com/blog/data-uris-are-slow-on-mobile/)
* ### 安全问题  
	The data URI can be utilized by criminals to construct attack pages that attempt to obtain usernames and passwords from unsuspecting web users. It can also be used to get around site cross-scripting restrictions, embedding the attack payload fully inside the address bar, and hosted via URL shortening services rather than needing a full website that is owned by the criminal.

## 编码
### JavaScript
#### `FileReader.readAsDataURL()` 方法
该方法适用于所有类型的文件，而不限于图片
```
<!--通过表单获取图片文件-->
<input type="file" id="chooseImage" />
```
```
/*
 * 接受获取到的文件后，使用FileReader类型实例的readAsDataURL方法读取DataURI，
 * 在读取完成的回调函数中，实例的result属性就是图片的readAsDataURL
 */
document.querySelector("#chooseImage").addEventListener("change", function(ev)
{
	let fileReader = new FileReader();
	fileReader.addEventListener("load", function(ev) // 读取完成的回调
	{
		console.log( ev.target.result ); // DataURI
	});
	fileReader.readAsDataURL( ev.target.files[0] ); // 读取
});
```
#### `HTMLCanvasElement.toDataURL()` 方法  
 1. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
 2. 使用这个方法对图片进行编码后的返回值并不是图片真实的base64数据组成的Data URI，而是有更多的数据。下面以一个36.6KB的图片为例，其真正的Data URI字符串长度是50083：

 	* 使用该方法且quality参数为默认的0.92，编码后的返回值字符串长度为87647；如果再对其解码为图片，图片大小就变为了64.1KB。  

	* 如果quality设为最大值1，返回值字符串长度为243307。再解码为图片后大小成了178KB。  

	所以要涉及传输和保存的情况，可以考虑降低品质。
 3. 看起来第一个输出图片类型参数只能是 image/png image/png image/webp 之一，如果设置为其他类型，最终都会输出位png类型的图片
 4. 只有对于jpeg和webp格式的图片，quality参数才是有效的。不过你可以把其他格式的设定为image/jpeg或image/webp类型来进行quality修改，最后会转化为指定的格式。例如把png图片转化为不透明的jpg或者转化为同样透明的webp，同时也进行压缩。
 5. 解决跨域问题:[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
	1. 默认情况下，对于跨域请求的图片，canvas不能对其进行获取图片内部数据的。
	2. 首先需要对图片元素进行如下属性设置：`img.crossOrigin = "Anonymous";`
	3. 其次要在服务器设置对被请求的图片进行`CORS`设置。  
		目前知道的一个方法是在图片所在目录或者其包含目录设置如下`.htaccess`文件：`Header set Access-Control-Allow-Origin "*"`

### PHP
1. PHP的`base64_encode`函数编码后只是base64部分，还需要自己加上前面的内容
2. 以图片为例，但文件类型并不限于图片  

```
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

## 解码
### PHP
PHP的`base64_decode`函数只能解码DataURI的base64部分，所以需要自己提取其中的Base64部分
```
$sDataURI = 'data: image/jpeg;base64,/9j/4QAYR省略省略省略';
$sBase64 = explode(';base64,', $sDataURI)[1];
file_put_contents('image.jpg', base64_decode($sBase64) );
```

http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
http://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
http://stackoverflow.com/questions/17328438/convert-data-uri-to-file

## References
* [Wikipedia](https://en.wikipedia.org/wiki/Data_URI_scheme)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
* [Why use data URI scheme?](http://stackoverflow.com/questions/6819314/why-use-data-uri-scheme)
* [Using Data URIs to Speed Up Your Website](http://blog.teamtreehouse.com/using-data-uris-speed-website)
* [On Mobile, Data URIs are 6x Slower than Source Linking](http://dev.mobify.com/blog/data-uris-are-slow-on-mobile/)
