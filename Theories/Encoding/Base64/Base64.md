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

#### `HTMLCanvasElement.toDataURL()` 将图片转化为DataURL
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

### Nodejs
[Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)
```js
console.log( Buffer.from('I ♡ Unicode!', 'utf8').toString('base64') ); // SSDimaEgVW5pY29kZSE=
```


### PHP
`base64_encode()`



## 解码
### JS
#### `WindowOrWorkerGlobalScope.atob()`
* Decodes a string of data which has been encoded using base-64 encoding.
* Throws a `DOMException` if the length of passed-in string is not a multiple of
 4

#### dataURI to Blob
```js
function dataURI2Blob(dataURI) {

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
let blob = dataURI2Blob(dataURI),
	fd = new FormData();
fd.append("image", blob);
```
##### to img
```js
let blob = dataURI2Blob(dataURI),
	img = document.createElement("img");

img.addEventListener("load", function(e){
	URL.revokeObjectURL(img.src); // 清除映射
});

img.src = URL.createObjectURL(blob);
document.body.appendChild(img);
```

### Nodejs
[Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)
```js
let sDataURI = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXA'
              +'vmHAAACrElEQVR42u2Xz2sTQRSAX8VSb1K8iNqKooJH2Ux6Ksn+iPQqxZMIehJB'
              +'0do/IMhmQWsvHr2KSEGk0tSLIoWIYNUKij20F2/N7iaUZnYT0kYzzhMKs0HDJiT'
              +'dLcwHDwKZSd63781LBiQSSW9JZdkhzfKm1Rz9mjZp/W9YdEU3vXv4HsQZ40FtNG'
              +'36q5rls//Ej4tmbSS2T15Mvp3ExOPmEMQNbBtMMEyoljcFcQN7PqyAlqNfIG7gY'
              +'Q0tYNIaxA1MrJPY3wImbUqBKAXSFv0tBSIVMOkvKRDtGKWN/T6FdqRAxFNoWwpE'
              +'PIXqUqBT6ALU/UVgu8GW4GD3f6f9TRDYNJTDrk7YbtiqUumHwIYoUJuHERDAS0r'
              +'4CvgFECgbY+cFAR7KT+g1POmCKFDNw6WggHc3fBtVb4CAoyauBgXIG+g1Xh5mRA'
              +'Gah6cggBd11fK/h7lOprIs0H6uRl6KAo5O7kOv4QmPiwJ4Jqqv4FiwCtXjvD2+t'
              +'RmfK6kZ/ygI2HritK0rDVGgrClJ6DWMwYC/AGuCBMYcIC2V0CzvjmbRz3j3xUjn'
              +'6CfeYreUJ2wQkGD75INPX1mFfsEFrrcIYCvdhC4paWQakxajpJMr0C9YFg54i7A'
              +'sClRmh9/xnr0NHcInzZStk2aLwAcGMAD9pPIazvFKVDD5rdnhJeHLX5RTyRPQHp'
              +'z5o66emMc9wdlPtvA8wF7Aq2BUHh1525qEo5JtR1WeOXpickO9cJIpyuD6xJmhY'
              +'iZ5ytWSl3mlnuOaf+2zDaLDXmJrSgZ/MYVEugo+gSh+FkSBa4yd5Ul87DZ5XpFl'
              +'/AyIEjzYjkau8WqshU2cr13HPbgX4gJOD97n465GZlyVvC9mSKloKI2iTnbwNT+'
              +'gBX54H+IaXAtxJzE3ycSAFqSAFJACUkAikXD+AHj5/wx2o5osAAAAAElFTkSuQm'
              +'CC';

require('fs').writeFileSync('voiceIcon.png', Buffer.from(sDataURI, 'base64'), 'binary');
```


### PHP
`base64_decode`
