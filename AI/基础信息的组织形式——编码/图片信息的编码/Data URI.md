# Data URI

## Summary
1. The data URI scheme is a uniform resource identifier (URI) scheme that provides a way to include data in-line in web pages as if they were external resources.
2. 虽然也可以用来编码文本信息，但意义不大。

## Syntax

```
data:[<media type>][;base64],<data>
```
## Advantages
http://stackoverflow.com/questions/6819314/why-use-data-uri-scheme
http://blog.teamtreehouse.com/using-data-uris-speed-website
https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement
http://blog.csdn.net/danteliujie/article/details/52299391
http://justcoding.iteye.com/blog/2090964
http://dev.mobify.com/blog/data-uris-are-slow-on-mobile/

## Problems
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs#Common_problems)
* Base64编码的数据体积通常是原数据的体积4/3
* Data URI 形式的图片不会被浏览器缓存
* 对CPU、内存的消耗
* Malware and phishing
	The data URI can be utilized by criminals to construct attack pages that attempt to obtain usernames and passwords from unsuspecting web users. It can also be used to get around site cross-scripting restrictions, embedding the attack payload fully inside the address bar, and hosted via URL shortening services rather than needing a full website that is owned by the criminal.

## References
[Wikipedia](https://en.wikipedia.org/wiki/Data_URI_scheme)
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)