# Binary Large Object
* In JavaScript, Blobs often represent binary data, and they can be large, but neither is required: a Blob could also represent the contents of a small text file.
* Blobs are opaque: all you can do with them directly is determine their size in bytes, ask for their MIME type, and chop them up into smaller Blobs
* The web browser can store Blobs in memory or on disk, and Blobs can represent really enormous chunks of data (such as video files) that are too large to fit in main memory without first being broken into smaller pieces with `slice()`.
* Because Blobs can be so large and may require disk access, the APIs that work with them are asynchronous (with synchronous versions available for use by worker threads).
* Blobs are supported by the structured clone algorithm which means that you can obtain one from another window or thread via the message event.
* Blobs can be retrieved from client-side databases
* Blobs can be downloaded from the web via scripted HTTP, using cutting-edge
features of the XHR2 specification.
* You can create your own blobs, using a `BlobBuilder` object to build them out of strings, ArrayBuffer objects, and other Blobs.
* The client-side JavaScript File object is a subtype of Blob: a File is just a Blob of data with a name and a modification date. You can obtain File objects from `<input type="file">` elements and from the drag-and-drop API. File objects can also be obtained using the Filesystem API.

***
## Files as Blobs
1. The `<input type="file">` element was originally intended to enable file uploads in HTML forms. Browsers have always been careful to implement this element so that it only allows the upload of files explicitly selected by the user.
2. Scripts cannot set the value property of this element to a filename, so they cannot go uploading arbitrary files from the user’s computer.
3. More recently, browser vendors have extended this element to allow client-side access to user-selected files.
4. Note that allowing a client-side script to read the contents of selected files is no more or less secure than allowing those files to be uploaded to the server.
5. The `files` property of an `<input type="file">` element will be a FileList object.
6. This is an array-like object whose elements are zero or more user-selected File objects.
7. A File object is a Blob that also has `name` and `lastModifiedDate` properties
8. In addition to selecting files with an <input> element, a user can also give a script access to local files by dropping them into the browser.
9. When an application receives a drop event, the dataTransfer.files property of the event object will be the FileList associated with the drop, if there was one.

***
## Downloading Blobs
