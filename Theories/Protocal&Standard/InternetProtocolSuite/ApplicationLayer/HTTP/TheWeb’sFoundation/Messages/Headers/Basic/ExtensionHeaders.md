# Extension headers

1. Extension headers are nonstandard headers that have been created by application developers but not yet added to the sanctioned HTTP specification. 
2. HTTP programs need to tolerate and forward extension headers, even if they don’t know what the headers mean.


<!-- TOC -->

- [Extension headers](#extension-headers)
    - [X-Frame-Options](#x-frame-options)
    - [X-XSS-Protection](#x-xss-protection)
    - [DNT](#dnt)
    - [协议中对 X- 前缀的废除](#协议中对-x--前缀的废除)
    - [References](#references)

<!-- /TOC -->


## X-Frame-Options
```
X-Frame-Options: DENY
```
1. 首部字段 `X-Frame-Options` 属于响应首部，用于控制网站内容在其他 Web 网站的 `Frame` 标签内的显示问题。其主要目的是为了防止点击劫持（clickjacking）攻击。
2. 首部字段 `X-Frame-Options` 有以下三个可指定的字段值。
    * `DENY`：The page cannot be displayed in a frame, regardless of the site attempting to do so.
    * `SAMEORIGIN`：仅同源域名下的页面（Top-level-browsing-context）匹配时许可。（比如，当指定 http://hackr.jp/sample.html 页面为 `SAMEORIGIN` 时，那么 `hackr.jp` 上所有页面的 `frame` 都被允许可加载该页面，而 `example.com` 等其他域名的页面就不行了）
    * `ALLOW-FROM origin`：只有指定的 origin 才能把当前页面加载为 frame
3. 能在所有的 Web 服务器端预先设定好 `X-Frame-Options` 字段值是最理想的状态。

```html
坏的网站<br />
坏的网站 <br />
如果 http://localhost:3000/ 不使用 X-Frame-Options 禁止，我就可以把它加载为 frame<br />
<iframe src="http://localhost:3000/"></iframe>
<!-- 报错：Refused to display 'http://localhost:3000/' in a frame because it set 'X-Frame-Options' to 'deny'. -->
```
```js
require('http').createServer((req, res)=>{
    if (req.url !== '/favicon.ico'){
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Content-Type', 'text/html')
        res.end(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title></title>
        </head>
        <body>
            好的网站
        </body>
        </html>`);
    }
}).listen(3000);
```

## X-XSS-Protection
```
X-XSS-Protection: 1
```
1. 属于响应首部，它是针对跨站脚本攻击（XSS）的一种对策，用于控制浏览器 XSS 防护机制的开关。
2. 首部字段 `X-XSS-Protection` 可指定的字段值如下：
    * `0`：将 XSS 过滤设置成无效状态
    * `1`：将 XSS 过滤设置成有效状态。If a cross-site scripting attack is detected, the browser will sanitize the page (remove the unsafe parts).
3. Although these protections are largely unnecessary in modern browsers when sites implement a strong [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) that disables the use of inline JavaScript ('unsafe-inline'), they can still provide protections for users of older web browsers that don't yet support CSP.


## DNT
```
DNT: 1
```
1. 属于请求首部，其中 `DNT` 是 Do Not Track 的简称，意为拒绝个人信息被收集，是表示拒绝被精准广告追踪的一种方法。
2* `DNT` 可指定的字段值如下。
    * `0` ：同意被追踪
    * `1` ：拒绝被追踪
3. 由于首部字段 `DNT` 的功能具备有效性，所以 Web 服务器需要对 `DNT` 做对应的支持。
4. 因为没有法律或技术的要求，所以即使用户选择使用该 header，也并不能保证服务器一定不追踪


## 协议中对 X- 前缀的废除
1. 在 HTTP 等多种协议中，通过给非标准参数加上前缀 `X-`，来区别于标准参数，并使那些非标准的参数作为扩展变成可能。
2. 但是这种简单粗暴的做法有百害而无一益，因此在“RFC 6648 - Deprecating the "X-" Prefix and Similar Constructs in Application Protocols” 中提议停止该做法。然而，对已经在使用中的 X- 前缀来说，不应该要求其变更。


## References
* [HTTP: The Definitive Guide](https://book.douban.com/subject/1440226/)
