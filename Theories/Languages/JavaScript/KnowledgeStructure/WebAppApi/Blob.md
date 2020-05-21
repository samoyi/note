# Binary Large Object


<!-- TOC -->

- [Binary Large Object](#binary-large-object)
    - [Basic](#basic)
        - [概念](#概念)
        - [Blob 很可能是大尺寸对象](#blob-很可能是大尺寸对象)
        - [Blob 的关系网](#blob-的关系网)
    - [Files as Blobs](#files-as-blobs)
        - [作为 `File` 对象的 blob 对象](#作为-file-对象的-blob-对象)
            - [通过 `<input type="file">` 获得](#通过-input-typefile-获得)
            - [通过拖拽事件获得](#通过拖拽事件获得)
        - [`<input type="file">` 的安全性](#input-typefile-的安全性)
    - [下载 blob](#下载-blob)
    - [使用 blob —— Blob URLs](#使用-blob--blob-urls)
        - [Create a Blob URL](#create-a-blob-url)
        - [Blob URL 是对资源的引用](#blob-url-是对资源的引用)
        - [同源](#同源)
        - [有效期为 session](#有效期为-session)
        - [Revoke a Blob URL —— 内存回收](#revoke-a-blob-url--内存回收)
        - [`blob://` 类似于 `http://` scheme](#blob-类似于-http-scheme)
    - [Building Blobs](#building-blobs)
    - [Reading Blobs](#reading-blobs)
        - [调用构造函数并注册读取后的回调函数](#调用构造函数并注册读取后的回调函数)
        - [请求读取 blob](#请求读取-blob)
        - [进度事件](#进度事件)
        - [`readAsText()`](#readastext)
        - [`readAsArrayBuffer()`](#readasarraybuffer)
    - [References](#references)

<!-- /TOC -->


## Basic
### 概念
1. A Blob is an opaque reference to, or handle for, a chunk of data. 
2. The name comes from SQL databases, where it means “Binary Large Object.” 
3. In JavaScript, Blobs often represent binary data, and they can be large, but neither is required: a Blob could also
represent the contents of a small text file. 
4. Blobs are opaque: all you can do with them directly is determine their size in bytes, ask for their MIME type, and chop them up into smaller Blobs:
    ```js
    var blob = ... // We'll see how to obtain a Blob later
    blob.size // Size of the Blob in bytes
    blob.type // MIME type of the Blob, or "" if unknown
    var subblob = blob.slice(0,1024, "text/plain"); // First 1K of the Blob as text
    var last = blob.slice(blob.size-1024, 1024); // Last 1K of the Blob, untyped
    ```

### Blob 很可能是大尺寸对象
1. The web browser can store Blobs in memory or on disk, and Blobs can represent really enormous chunks of data (such as video files) that are too large to fit in main memory without first being broken into smaller pieces with `slice()`.
2. Because Blobs can be so large and may require disk access, the APIs that work with them are asynchronous (with
synchronous versions available for use by worker threads).

### Blob 的关系网
1. Blobs are not terribly interesting by themselves, but they serve as a critical data interchange mechanism for various JavaScript APIs that work with binary data. 
2. 下图展示了如何从 Web、本地文件系统、本地数据库或者其他的窗口和 Worker 中对 Blob 进行读写，以及如何以文本、类型化数组或者URL的形式读取 Blob 内容。
    <img src="./images/01.png" style="display: block; margin: 5px 0 10px;" />
3. 下图是 Blob 和其他相关对象的关系
    <img src="./images/02.jpg" style="display: block; width: 800px; margin: 5px 0 10px;" />


## Files as Blobs
The `File` interface is based on `Blob`, inheriting blob functionality and expanding it to support files on the user's system.

### 作为 `File` 对象的 blob 对象
#### 通过 `<input type="file">` 获得
1. In browsers that support local file access, the files property of an `<input type="file">` element will be a FileList object. 
2. This is an array-like object whose elements are zero or more user-selected File objects.

#### 通过拖拽事件获得
3. In addition to selecting files with an `<input>` element, a user can also give a script access to local files by dropping them into the browser. 
2. When an application receives a drop event, the `dataTransfer.files` property of the event object will be the FileList associated with the drop, if there was one.

### `<input type="file">` 的安全性
1. The `<input type="file">` element was originally intended to enable file uploads in HTML forms. Browsers have always been careful to implement this element so that it only allows the upload of files explicitly selected by the user.
2. Scripts cannot set the `value` property of this element to a filename, so they cannot go uploading arbitrary files
from the user’s computer. 
3. More recently, browser vendors have extended this element to allow client-side access to user-selected files. 
4. Note that allowing a client-side script to read the contents of selected files is no more or less secure than allowing those files to be uploaded to the server.



## 下载 blob
1. 使用时要测试兼容性
2. GET the contents of the url as a Blob and pass it to the specified callback.
3. If the Blob you’re downloading is quite large and you want to start processing it while
it is downloading, you can use an `onprogress` event handler
```js
let xhr = new XMLHttpRequest();
xhr.open("GET", "test.mp4");
xhr.responseType = "blob" // 必须设定这个属性的值为 "blob"
xhr.onprogress = function(ev) {
    console.log(ev.loaded + "/" + ev.total); // show progress, if needed
};
xhr.onload = function() {
    console.log(xhr.response); // 获得 MP4 文件的 Blob 对象
}
xhr.send(null);
```


## 使用 blob —— Blob URLs
### Create a Blob URL
1. One of the simplest things you can do with a Blob is create a URL that refers to the Blob. 
2. You can then use this URL anywhere you’d use a regular URL: in the DOM, in a stylesheet, or even as the target of an XMLHttpRequest.
3. Pass a blob to `window.URL.createObjectURL()` and it returns a URL (as an ordinary string). 
    ```html
    <input type="file" />
    <img src="" id="thumbnail" />
    ```
    ```js
    document.querySelector('input').addEventListener('change', function(ev){
        document.querySelector('img').src = URL.createObjectURL(ev.target.files[0]);
    });
    ```
4. 使用时测试兼容性，犀牛书第六版说：Chrome and Webkit prefix that new global, calling it `webkitURL` — `webkitURL.createObjectURL`。

### Blob URL 是对资源的引用
1. The URL will begin with `blob://`, and that URL scheme will be followed by a short string of text that identifies the Blob with some kind of opaque unique identifier. 
2. Note that this is very different than a `data://` URL, which encodes its own contents. A Blob URL is simply a reference to a Blob that is stored by the browser in memory or on the disk.
3. `blob://` URLs are also quite different from `file://` URLs, which refer directly to a file in the local filesystem, exposing the path of the file, allowing directory browsing, and otherwise raising security issues.

### 同源
1. Blob URLs have the same origin as the script that creates them. 
2. This makes them much more versatile than `file://` URLs, which have a distinct origin and are therefore difficult to use within a web application. 
3. A Blob URL is only valid in documents of the same origin. If, for example, you passed a Blob URL via `postMessage()` to a window with a different origin, the URL would be meaningless to that window.

### 有效期为 session
1. Blob URLs are not permanent. A Blob URL is no longer valid once the user has closed or navigated away from the document whose script created the URL. 
2. It is not possible, for example, to save a Blob URL to local storage and then reuse it when the user begins a new session with a web application.

### Revoke a Blob URL —— 内存回收
1. It is also possible to manually “revoke” the validity of a Blob URL by calling `URL.revokeObjectURL()`. 
2. This is a memory management issue. Once the thumbnail image has been displayed, the Blob is no longer needed and it should be allowed to be garbage collected. 
3. But if the web browser is maintaining a mapping from the Blob URL we’ve created to the Blob, that Blob cannot be garbage collected even if we’re not using it. 
4. The JavaScript interpreter cannot track the usage of strings, and if the URL is still valid, it has to assume that it might still be used. 
5. This means that it cannot garbage collect the Blob until the URL has been revoked. 

### `blob://` 类似于 `http://` scheme
1. The `blob://` URL scheme is explicitly designed to work like a simplified `http://` URL, and browsers are required to act like mini HTTP servers when `blob://` URLs are requested. 
2. If a Blob URL that is no longer valid is requested, the browser must send a *404 Not Found* status code. 
3. If a Blob URL from a different origin is requested, the browser must respond with *403 Not Allowed*. 
4. Blob URLs only work with GET requests, and when one is successfully requested, the browser sends an HTTP *200 OK* status code and also sends a *Content-Type* header that uses the type property of the Blob.
5. Because Blob URLs work like simple HTTP URLs, you can “download” their content with XMLHttpRequest. (However, you can read the content of a Blob more directly using a `FileReader` object.)


## Building Blobs
1. Blobs often represent chunks of data from an external source such as a local file, a URL, or a database. 
2. But sometimes a web application wants to create its own Blobs to be uploaded to the Web or stored in a file or database or passed to another thread. 
3. 要从自己的数据来创建Blob，可以使用 `Blob` 构造函数。下面的例子使用 DataURL 构建一个 blob 然后生成对应的 blob URL
    ```js
    const sDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXA'
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

        
    function dataURI2Blob(dataURI) {
        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    function geneImg () {
        let blobURL = URL.createObjectURL(dataURI2Blob(sDataURI));
        let img = document.createElement('img');
        img.src = blobURL;
        document.body.appendChild(img)
    }

    geneImg();
    ```
4. 还有一些实例方法和属性，参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)。


## Reading Blobs
1. The `FileReader` object allows us read access to the characters or bytes contained in a Blob. 
2. Since Blobs can be very large objects stored in the filesystem, the API for reading them is asynchronous, much like the `XMLHttpRequest` API. 
3. A synchronous version of the API, `FileReaderSync`, is available in worker threads, although workers can also use the asynchronous version.

### 调用构造函数并注册读取后的回调函数
1. To use a FileReader, first create an instance with the `FileReader()` constructor. 
2. Next, define event handlers. Typically you’ll define handlers for load and error events and possibly also for progress events. 
3. You can do this with `onload`, `onerror`, and `onprogress` or with the standard `addEventListener()` method. 
4. FileReader objects also trigger `loadstart`, `loadend`, and `abort` events, which are like the `XMLHttpRequest` events with the same names.

### 请求读取 blob
1. Once you’ve created a FileReader and registered suitable event handlers, you must pass the Blob you want to read to one of four methods: `readAsText()`, `readAsArrayBuffer()`, `readAsDataURL()`, and `readAsBinaryString()`.
2. You can, of course, call one of these methods first and then register event handlers — the single-threaded nature of
JavaScript, means that event handlers will never be called until your function has returned and the browser is back in its event loop. 异步的读取回调至少要在下一个事件循环，所以肯定会在注册回调之后。比如这样写
    ```js
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
        // reader.result
        // ... 
    };
    ```
3. The first two methods are the most important and are the ones covered here. Each of these read methods takes a Blob as its first argument. 
4. `readAsText()` takes an optional second argument that specifies the name of a text encoding. If you omit the encoding, it will automatically work with ASCII and UTF-8 text (and also UTF-16 text with a byte-order mark or BOM).

### 进度事件
1. As the FileReader reads the Blob you’ve specified, it updates its `readyState` property. 
2. The value starts off at `0`, indicating that nothing has been read.
3. It changes to `1` when some data is available, and changes to `2` when the read has completed. 
4. The `result` property holds a partial or complete result as a string or ArrayBuffer. 
4. You do not normally poll the `state` and `result` properties, but instead use them from your `onprogress` or `onload` event handler.

### `readAsText()`
Read local text files that the user selects
```html
Select the file to display:
<input type="file" onchange="readfile(this.files[0])" />
<pre id="output"></pre>
```
```js
// Read the specified text file and display it in the <pre> element below
function readfile(f) {
    var reader = new FileReader(); // Create a FileReader object
    reader.readAsText(f); // Read the file
    reader.onload = function() { // Define an event handler
        var text = reader.result; // This is the file contents
        var out = document.getElementById("output"); // Find output element
        out.innerHTML = ""; // Clear it
        out.appendChild(document.createTextNode(text)); // Display file contents
    }
    reader.onerror = function(e) { // If anything goes wrong
        console.log("Error", e); // Just log it
    };
}
```

### `readAsArrayBuffer()`
Read the first four bytes of a file as a big-endian integer.
```html
<input type="file" onchange="typefile(this.files[0])" />
```
```js
// Examine the first 4 bytes of the specified blob. 
// If this "magic number" identifies the type of the file, asynchronously set a property on the Blob.
function typefile(file) {
    let slice = file.slice(0, 4); // Only read the start of the file
    let reader = new FileReader(); // Create an asynchronous FileReader
    reader.readAsArrayBuffer(slice); // Read the slice of the file
    reader.onload = function(e) {
        let buffer = reader.result; // The result ArrayBuffer
        let view = new DataView(buffer); // Get access to the result bytes
        let magic = view.getUint32(0, false); // Read 4 bytes, big-endian
        switch(magic) { // Determine file type from them
            case 0x89504E47: 
                file.verified_type = "image/png"; 
                break;
            case 0x47494638: 
                file.verified_type = "image/gif"; 
                break;
            case 0x25504446: 
                file.verified_type = "application/pdf"; 
                break;
            case 0x504b0304: 
                file.verified_type = "application/zip"; 
                break;
            default:         
                file.verified_type = "other";
        }
        console.log(file.name, file.verified_type);
    };
}
```


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
* [聊聊JS的二进制家族：Blob、ArrayBuffer和Buffer](https://zhuanlan.zhihu.com/p/97768916)