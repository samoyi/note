# HTTP Referer

***
## 访问一个URI时，普通情况下，referer 的三种情况
* 通过浏览器直接访问该 URI，没有 referer
* 通过链接访问资源 URI，referer 为链接所在页面的 URI
    * referer 的域名和该 URI 为同一个域
    * referer 的域名和该 URI 不是一个域


***
## Referrer-Policy
Note that `Referer` is actually a misspelling of the word "referrer". The
Referrer-Policy header does not share this misspelling
* ### no-referrer
The Referer header will be omitted entirely. No referrer information is sent along with requests.
* ### no-referrer-when-downgrade (default)
This is the user agent's default behavior if no policy is specified. The origin is sent as referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but isn't sent to a less secure destination (HTTPS->HTTP).
* ### origin
    * Only send the origin of the document as the referrer in all cases.
    * The document `https://example.com/page.html` will send the referrer `https://example.com/`.
* ### origin-when-cross-origin
Send a full URL when performing a same-origin request, but only send the origin of the document for other cases.
* ### same-origin
A referrer will be sent for same-site origins, but cross-origin requests will contain no referrer information.
* ### strict-origin
Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
* ### strict-origin-when-cross-origin
Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
* ### unsafe-url
    * Send a full URL (stripped from parameters) when performing a same-origin or cross-origin request.
    * This policy will leak origins and paths from TLS-protected resources to insecure origins. Carefully consider the impact of this setting.



***
## Set Referrer Policy
* meta 标签
```
// 例如
<meta name="referrer" content="no-referrer">
```
* A `referrerpolicy` attribute on an `<a>`, `<area>`, `<img>`, `<iframe>`, or
`<link>` element.
* The noreferrer link relation on an `a`, `area`, or `link` element  (`rel="noreferrer"`).
* When using Fetch: set `Request.referrerPolicy`   
`Request.referrerPolicy` 不是只读属性吗，为什么[MDN写可以设置](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy)



***
## References
* [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
