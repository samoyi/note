# Media Type and Charset


<!-- TOC -->

- [Media Type and Charset](#media-type-and-charset)
    - [设计思想](#%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3)
    - [抽象本质](#%E6%8A%BD%E8%B1%A1%E6%9C%AC%E8%B4%A8)
    - [Summary](#summary)
    - [Character Encodings for Text Media](#character-encodings-for-text-media)
    - [Multipart Media Types](#multipart-media-types)
    - [Multipart Form Submissions](#multipart-form-submissions)
    - [Multipart Range Responses](#multipart-range-responses)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. The `Content-Type` header field describes the MIME type of the entity body.( In the case of the HEAD request, Content-Type shows the type that would have been sent if it was a GET request.) 
2. The MIME type is a standardized name that describes the underlying type of media carried as cargo (HTML file, Microsoft Word document, MPEG video, etc.). Client applications use the MIME type to properly decipher and process the content.
3.  The `Content-Type` values are standardized MIME types, registered with the Internet Assigned Numbers Authority (IANA). 
4. MIME types consist of a primary media type (e.g., text, image, audio), followed by a slash, followed by a subtype that further specifies the media type.
5. It is important to note that the `Content-Type` header specifies the media type of the original entity body. If the entity has gone through content encoding, for example, the `Content-Type` header will still specify the entity body type before the encoding.


## Character Encodings for Text Media
The `Content-Type` header also supports optional parameters to further specify the content type. The `charset` parameter is the primary example, specifying the mechanism to convert bits from the entity into characters in a text file:
```
Content-Type: text/html; charset=iso-8859-4
```


## Multipart Media Types
1. MIME `multipart` email messages contain multiple messages stuck together and sent as a single, complex message. Each component is self-contained, with its own set of headers describing its content; the different components are concatenated together and delimited by a string.
2. HTTP also supports multipart bodies; however, they typically are sent in only one of two situations: in fill-in form submissions and in range responses carrying pieces of a document.


## Multipart Form Submissions
1. When an HTTP fill-in form is submitted, variable-length text fields and uploaded objects are sent as separate parts of a multipart body, allowing forms to be filled out with values of different types and lengths. 
2. HTTP sends such requests with a `Content-Type: multipart/form-data` header or a `Content-Type: multipart/mixed` header and a multipart body, like this:
    ```
    Content-Type: multipart/form-data; boundary=[abcdefghijklmnopqrstuvwxyz]
    ```
    where the boundary specifies the delimiter string between the different parts of the body.
3. The following example illustrates `multipart/form-data` encoding. Suppose we have this form:
    ```html
    <form action="http://server.com/cgi/handle"
            enctype="multipart/form-data"
            method="post">
        What is your name? <input type="text" name="submit-name"><br>
        What files are you sending? <input type="file" name="files"><br>
        <input type="submit" value="Send"> 
        <input type="reset">
    </form>
    ```
4. If the user enters "Sally" in the text-input field and selects the text file "essayfile.txt", the user agent might send back the following data:
    ```
    Content-Type: multipart/form-data; boundary=AaB03x
    --AaB03x
    Content-Disposition: form-data; name="submit-name"
    Sally
    --AaB03x
    Content-Disposition: form-data; name="files"; filename="essayfile.txt"
    Content-Type: text/plain
    ...contents of essayfile.txt...
    --AaB03x--
    ```
5. If the user selected a second (image) file, "imagefile.gif", the user agent might construct the parts as follows:
    ```
    Content-Type: multipart/form-data; boundary=AaB03x
    --AaB03x
    Content-Disposition: form-data; name="submit-name"
    Sally
    --AaB03x
    Content-Disposition: form-data; name="files"
    Content-Type: multipart/mixed; boundary=BbC04y
    --BbC04y
    Content-Disposition: file; filename="essayfile.txt"
    Content-Type: text/plain
    ...contents of essayfile.txt...
    --BbC04y
    Content-Disposition: file; filename="imagefile.gif"
    Content-Type: image/gif
    Content-Transfer-Encoding: binary
    ...contents of imagefile.gif...
    --BbC04y--
    --AaB03x--
    ```


## Multipart Range Responses
1. HTTP responses to range requests also can be multipart. Such responses come with a `Content-Type: multipart/byteranges` header and a multipart body with the different ranges. 
2. Here is an example of a multipart response to a request for different ranges of a document:
    ```
    HTTP/1.0 206 Partial content
    Server: Microsoft-IIS/5.0
    Date: Sun, 10 Dec 2000 19:11:20 GMT
    Content-Location: http://www.joes-hardware.com/gettysburg.txt
    Content-Type: multipart/x-byteranges; boundary=--[abcdefghijklmnopqrstuvwxyz]--
    Last-Modified: Sat, 09 Dec 2000 00:38:47 GMT

    --[abcdefghijklmnopqrstuvwxyz]--
    Content-Type: text/plain
    Content-Range: bytes 0-174/1441
    Fourscore and seven years ago our fathers brough forth on this continent
    a new nation, conceived in liberty and dedicated to the proposition that
    all men are created equal.
    --[abcdefghijklmnopqrstuvwxyz]--
    Content-Type: text/plain
    Content-Range: bytes 552-761/1441

    But in a larger sense, we can not dedicate, we can not consecrate,
    we can not hallow this ground. The brave men, living and dead who
    struggled here have consecrated it far above our poor power to add
    or detract.
    --[abcdefghijklmnopqrstuvwxyz]--
    Content-Type: text/plain
    Content-Range: bytes 1344-1441/1441

    and that government of the people, by the people, for the people shall
    not perish from the earth.

    --[abcdefghijklmnopqrstuvwxyz]--
    ```


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)