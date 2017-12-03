# Data URL


## Docs
* [RFC 2397](https://tools.ietf.org/html/rfc2397)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)



## Summary
虽然也可以用来编码文本及其他类型信息，但意义不大。编码图片才具有使用的价值。



## Advantages
* ### 不发送请求，因此节省了请求本身的带宽。  
	例如一个600bytes的图片使用Data URI编码后大小变成了800bytes。但如果HTTP请求该图片时请求本身消耗的带宽超过200bytes的话，则至少在节省带宽这方面，这里使用Data URI更合适。
* ### Transferring small file
	TCP transfers tend to start slowly. If each file requires a new TCP
	connection, the transfer speed is limited by the round-trip time rather than
	 the available bandwidth. Using HTTP keep-alive improves the situation, but
	may not entirely alleviate the bottleneck.
* ### 配置较差的HTTPS有时比使用Data URI要慢。  
	On badly configured servers, HTTPS requests have significant overhead over
	common HTTP requests, so embedding data in data URIs may improve speed in
	this case.
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
	The data URI can be utilized by criminals to construct attack pages that
	attempt to obtain usernames and passwords from unsuspecting web users. It
	can also be used to get around site cross-scripting restrictions, embedding
	the attack payload fully inside the address bar, and hosted via URL
	shortening services rather than needing a full website that is owned by the
	criminal.



## 编解码
Base64


## References
* [Wikipedia](https://en.wikipedia.org/wiki/Data_URI_scheme)
* [Data_URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_.232_.E2.80.93_rewriting_atob()_and_btoa()_using_TypedArrays_and_UTF-8">Base64 encoding and decoding</a>
* [Why use data URI scheme?](http://stackoverflow.com/questions/6819314/why-use-data-uri-scheme)
* [Using Data URIs to Speed Up Your Website](http://blog.teamtreehouse.com/using-data-uris-speed-website)
* [On Mobile, Data URIs are 6x Slower than Source Linking](http://dev.mobify.com/blog/data-uris-are-slow-on-mobile/)
* [Convert Data URI to File then append to FormData](http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata)
* [理解DOMString、Document、FormData、Blob、File、ArrayBuffer数据类型](http://www.zhangxinxu.com/wordpress/2013/10/understand-domstring-document-formdata-blob-file-arraybuffer/)
