# MIME

## 用途
* MIME media types (MIME types, for short) are standardized names that describe
the contents of a message entity body (e.g., text/html, image/jpeg).
* Because the Internet hosts many thousands of different data types, HTTP
carefully tags each object being transported through the Web with a data format
label called a MIME type. MIME (Multipurpose Internet Mail Extensions) was
originally designed to solve problems encountered in moving messages between
different electronic mail systems. MIME worked so well for email that HTTP
adopted it to describe and label its own multimedia content.
* Web servers attach a MIME type to all HTTP object data. When a web browser
gets an object back from a server, it looks at the associated MIME type to see
if it knows how to handle the object. Most browsers can handle hundreds of
popular object types: displaying image files, parsing and formatting HTML files,
playing audio files through the computer’s speakers, or launching external
plug-in software to handle special formats.
* 上面说的是服务器设置 MIME 是浏览器看的，从浏览器发送数据的时候也要设置 MIME，应该是给
服务器应用程序（例如 Apache）看的。我前端 POST 一个表单文本数据，但不设置
`Content-Type`，所以`Content-Type`就是默认的`text/plain`。如果我使用原生 Node.js 接
收，因为我知道发送过来的数据是表单文本，所以我会选择`querystring`模块解析。如果我知道发
过来的图片，我还会用其他方法解析。但比如说使用 PHP，使用`$_POST`就会出错，因为
Apache 看到`Content-Type`是`text/plain`，所以不会按照表单文本的方式来处理数据。


## MIME Type Structure
* Each MIME media type consists of a primary type, a subtype, and a list of
optional parameters. The type and subtype are separated by a slash, and the
optional parameters begin with a semicolon, if they are present.
* In HTTP, MIME media types are widely used in `Content-Type` and `Accept`
headers. Here are a few examples:
    * `Content-Type: video/quicktime`
    * `Content-Type: text/html; charset="iso-8859-6"`
    * `Content-Type: multipart/mixed; boundary=gc0p4Jq0M2Yt08j34c0p`
    * `Accept: image/gif`

### Discrete Types
MIME types can directly describe the object type, or they can describe
collections or packages of other object types. If a MIME type describes an
object type directly, it is a discrete type. These include text files, videos,
and application-specific file formats.

### Composite Types
If a MIME type describes a collection or encapsulation of other content, the
MIME type is called a composite type. A composite type describes the format of
the enclosing package. When the enclosing package is opened, each enclosed
object will have its own type.

### Multipart Types
Multipart media types are composite types. A multipart object consists of
multiple component types.


## Syntax
### Primary type
The primary type can be a predefined type, an IETF-defined extension token, or
an experimental token (beginning with `x-`). Common primary MIME types:

Type | Description
-- | --
`application` | Application-specific content format (discrete type)
`audio` | Audio format (discrete type)
`chemical` | Chemical data set (discrete IETF extension type)
`image` | Image format (discrete type)
`message` | Message format (composite type)
`model` | 3-D model format (discrete IETF extension type)
`multipart` | Collection of multiple objects (composite type)
`text` | Text format (discrete type)
`video` | Video movie format (discrete type)

### Subtypes
Subtypes can be primary types (as in `text/text`), IANA-registered subtypes, or
experimental extension tokens (beginning with `x-`).


## 很全的 MIME 类型
[《HTTP: The Definitive Guide》](https://book.douban.com/subject/1440226/)
APPENDIX D 的 MIME Type Tables 章节


## References
* [《HTTP: The Definitive Guide》](https://book.douban.com/subject/1440226/)
