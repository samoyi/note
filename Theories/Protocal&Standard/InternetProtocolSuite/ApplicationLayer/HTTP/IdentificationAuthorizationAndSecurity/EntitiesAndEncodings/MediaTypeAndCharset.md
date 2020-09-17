# Media Type and Charset


<!-- TOC -->

- [Media Type and Charset](#media-type-and-charset)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
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
4. MIME types consist of a primary media type (e.g., text, image, audio), followed by a slash, followed by a subtype that further specifies the media type. Table below lists a few common MIME types for the ContentType header. 
5. It is important to note that the `Content-Type` header specifies the media type of the original entity body. If the entity has gone through content encoding, for example, the `Content-Type` header will still specify the entity body type before the encoding.


## Character Encodings for Text Media
The `Content-Type` header also supports optional parameters to further specify the content type. The `charset`”parameter is the primary example, specifying the mechanism to convert bits from the entity into characters in a text file:
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


## Multipart Range Responses
HTTP responses to range requests also can be multipart. Such responses come with a `Content-Type: multipart/byteranges` header and a multipart body with the different ranges. 


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)