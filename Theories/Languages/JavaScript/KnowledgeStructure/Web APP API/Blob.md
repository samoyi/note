# Binary Large Object
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)


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
1. Blobs often represent chunks of data from an external source such as a local
file, a URL, or a database. But sometimes a web application wants to create its
own Blobs to be uploaded to the Web or stored in a file or database or passed to
 another thread.  
2. `BlobBuilder` is obsolete, use `Blob` constructor.
Use DataURL t build a blob and generate the corresponding Blob URL
```js
let sDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXA'
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

console.log(URL.createObjectURL(dataURI2Blob(sDataURI)));

function dataURI2Blob(dataURI) {

    let byteString = atob(dataURI.split(',')[1]),
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
```



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
```html
<input type="file" />
<img src="" id="thumbnail" />
```
```js
document.querySelector('input').addEventListener('change', function(ev){
    document.querySelector('img').src = URL.createObjectURL(ev.target.files[0]);
});
```
4. Blob URLs have the same origin as the script that creates them. This makes
them much more versatile than `file:// URLs`, which have a distinct origin and
are therefore difficult to use within a web application.
5. A Blob URL is only valid in documents of the same origin. If, for example,
you passed a Blob URL via `postMessage()` to a window with a different origin,
the URL would be meaningless to that window.
6. Blob URLs are not permanent. A Blob URL is no longer valid once the user has
closed or navigated away from the document whose script created the URL. It is
not possible, for example, to save a Blob URL to local storage and then reuse it
 when the user begins a new session with a web application.

#### Revoke a Blob url
1. It is also possible to manually revoke the validity of a Blob URL by calling `URL.revokeObjectURL()`.
2. In the above example, once thumbnail image has been displayed, the Blob is no
 longer needed and it should be allowed to be garbage collected.
3. If the web browser is maintaining a mapping from the Blob URL we’ve created
to the Blob, that Blob cannot be garbage collected even if we’re not using it.
The JavaScript interpreter cannot track the usage of strings, and if the URL is
still valid, it has to assume that it might still be used. This means that it
cannot garbage collect the Blob until the URL has beenrevoked.
4. This example uses local files that don’t require any cleanup, but you can
imagine a more serious memory management issue if the Blob in question were one
that had been built in memory with a BlobBuilder or one that had been downloaded
 with XMLHttpRequest and stored in a temporary file.



***
## Reading Blobs
1. The `FileReader` object allows us read access to the characters or bytes
contained in a Blob, and you can think of it as the opposite of a `BlobBuilder`.
(A better name would be BlobReader, since it works with any Blob, not just
Files.)  
2. Since Blobs can be very large objects stored in the filesystem, the API for
reading them is asynchronous, much like the XMLHttpRequest API. A synchronous
version of the API, FileReaderSync, is available in worker threads, although
workers can also use the asynchronous version.
3. To use a FileReader, first create an instance with the `FileReader()`
constructor. Next, define event handlers. Typically you’ll define handlers for
load and error events and possibly also for progress events. You can do this
with `onload`, `onerror` , and `onprogress` or with the standard
`addEventListener()` method. FileReader objects also trigger `loadstart`,
`loadend`, and `abort` events, which are like the XMLHttpRequest events with the
 same names.
4. Once you’ve created a FileReader and registered suitable event handlers, you
must pass the Blob you want to read to one of four methods: `readAsText()`,
`readAsArrayBuffer()`, `readAsDataURL()`, and `readAsBinaryString()`.
5. As the FileReader reads the Blob you’ve specified, it updates its `readyState`
 property. The value starts off at `0`, indicating that nothing has been read.
It changes to `1` when some data is available, and changes to `2` when the read
has completed. The `result` property holds a partial or complete result as a
string or ArrayBuffer. You do not normally poll the `state` and `result`
properties, but instead use them from your `onprogress` or `onload` event
handler.
6. In worker threads, you can use `FileReaderSync` instead of `FileReader`. The
synchronous API defines the same `readAsText()` and `readAsArrayBuffer()`
methods that take the same arguments as the asynchronous methods. The difference
 is that the synchronous methods block until the operation is complete and
return the resulting string or ArrayBuffer directly, with no need for event
handlers.

### readAsText()
Read local text files that the user selects
```html
Select the file to display:
<input type="file" onchange="readfile(this.files[0])"></input>
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

### readAsArrayBuffer()
Read the first four bytes of a file as a big-endian integer.
```html
<input type="file" onchange="typefile(this.files[0])"></input>
```
```js
// Examine the first 4 bytes of the specified blob. If this "magic number"
// identifies the type of the file, asynchronously set a property on the Blob.
function typefile(file) {
    var slice = file.slice(0,4); // Only read the start of the file
    var reader = new FileReader(); // Create an asynchronous FileReader
    reader.readAsArrayBuffer(slice); // Read the slice of the file
    reader.onload = function(e) {
        var buffer = reader.result; // The result ArrayBuffer
        var view = new DataView(buffer); // Get access to the result bytes
        var magic = view.getUint32(0, false); // Read 4 bytes, big-endian
        switch(magic) { // Determine file type from them
            case 0x89504E47: file.verified_type = "image/png"; break;
            case 0x47494638: file.verified_type = "image/gif"; break;
            case 0x25504446: file.verified_type = "application/pdf"; break;
            case 0x504b0304: file.verified_type = "application/zip"; break;
            default:         file.verified_type = "other";
        }
        console.log(file.name, file.verified_type);
    };
}
```
