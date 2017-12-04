# Binary Large Object



## Basic
* A Blob is an opaque reference to, or handle for, a chunk of data. The name
comes from SQL databases, where it means “Binary Large Object.”
* In JavaScript, Blobs often represent binary data, and they can be large, but
neither is required: a Blob could also represent the contents of a small text
file.
* Blobs are opaque: all you can do with them directly is determine their size in
 bytes, ask for their MIME type, and chop them up into smaller Blobs
* The web browser can store Blobs in memory or on disk, and Blobs can represent
really enormous chunks of data (such as video files) that are too large to fit
in main memory without first being broken into smaller pieces with `slice()`.
* Because Blobs can be so large and may require disk access, the APIs that work
with them are asynchronous (with synchronous versions available for use by
    worker threads).
* Blobs are supported by the structured clone algorithm which means that you can
 obtain one from another window or thread via the message event.
* Blobs can be retrieved from client-side databases
* Blobs can be downloaded from the web via scripted HTTP, using cutting-edge
features of the XHR2 specification.
* You can create your own blobs, using a `BlobBuilder` object to build them out
of strings, ArrayBuffer objects, and other Blobs.
* The client-side JavaScript File object is a subtype of Blob: a File is just a
Blob of data with a name and a modification date. You can obtain File objects
from `<input type="file">` elements and from the drag-and-drop API. File objects
 can also be obtained using the Filesystem API.  

![Blobs-and-the-APIs-that-use-them.png](Blobs-and-the-APIs-that-use-them.png)



***
## Files as Blobs
1. The `<input type="file">` element was originally intended to enable file
uploads in HTML forms. Browsers have always been careful to implement this
element so that it only allows the upload of files explicitly selected by the
user.
2. Scripts cannot set the value property of this element to a filename, so they
cannot go uploading arbitrary files from the user’s computer.
3. More recently, browser vendors have extended this element to allow
client-side access to user-selected files.
4. Note that allowing a client-side script to read the contents of selected
files is no more or less secure than allowing those files to be uploaded to the
server.
5. The `files` property of an `<input type="file">` element will be a FileList
object.
6. This is an array-like object whose elements are zero or more user-selected
File objects.
7. A File object is a Blob that also has `name` and `lastModifiedDate`
properties
8. In addition to selecting files with an `<input>` element, a user can also
give a script access to local files by dropping them into the browser.
9. When an application receives a drop event, the `dataTransfer.files` property
of the event object will be the FileList associated with the drop, if there was
one.



***
## Downloading Blobs
使用时要测试兼容性
```js
let xhr = new XMLHttpRequest();
xhr.open("GET", "test.mp4");
xhr.responseType = "blob" // 必须设定这个属性的值为"blob"
xhr.onprogress = function(ev) {
    console.log(ev.loaded + "/" + ev.total); // show progress, if needed
};
xhr.onload = function() {
    console.log(xhr.response); // 获得MP4文件的Blob对象
}
xhr.send(null);
```



***
## Building Blobs
Blobs often represent chunks of data from an external source such as a local
file, a URL, or a database. But sometimes a web application wants to create its
own Blobs to be uploaded to the Web or stored in a file or database or passed to
 another thread.  

<mark>不懂</mark>
```js
// Create a new BlobBuilder
var bb = new BlobBuilder();
// Append a string to the blob, and mark the end of the string with a NUL char
bb.append("This blob contains this text and 10 big-endian 32-bit signed ints.");
bb.append("\0"); // NUL-terminate the string to mark its end
// Store some data into an ArrayBuffer
var ab = new ArrayBuffer(4*10);
var dv = new DataView(ab);
for(var i = 0; i < 10; i++) dv.setInt32(i*4,i);
// Append the ArrayBuffer to the Blob
bb.append(ab);
// Now get the blob from the builder, specifying a made-up MIME type
var blob = bb.getBlob("x-optional/mime-type-here");
```
We saw at the beginning of this section that Blobs have a `slice()` method that
breaks them into pieces. You can join Blobs together by passing Blobs to the
`append()` method of a BlobBuilder.



***
## Blob URLs
### Create a Blob URL
1. Pass a blob to `URL.createObjectURL()` and it returns a URL (as an ordinary
string). The URL will begin with `blob://`, and that URL scheme will be followed
 by a short string of text that identifies the Blob with some kind of opaque
 unique identifier.
2. Note that this is very different than a `data:// URL`, which encodes its own
contents. A Blob URL is simply a reference to a Blob that is stored by the
browser in memory or on the disk.
3. `blob://` URLs are also quite different from `file://` URLs, which refer
directly to a file in the local filesystem, exposing the path of the file,
allowing directory browsing, and otherwise raising security issues.
```
<input type="file" />
<img src="" />
</body>
<script>
'use strict';


document.querySelector('input').addEventListener('change', function(ev){

    document.querySelector('img').src = URL.createObjectURL(ev.target.files[0]);
});
```
