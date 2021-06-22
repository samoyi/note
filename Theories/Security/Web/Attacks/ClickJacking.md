# ClickJacking


<!-- TOC -->

- [ClickJacking](#clickjacking)
    - [原理](#%E5%8E%9F%E7%90%86)
    - [防御](#%E9%98%B2%E5%BE%A1)
        - [frame busting](#frame-busting)
        - [X-Frame-Options header](#x-frame-options-header)

<!-- /TOC -->


## 原理
1. 页面上有一个可见的点击区域，但是在该区域上面覆盖了另一个不可见的点击区域，用户被诱导点击不可见的点击区域，实现了攻击者的目的。
2. 可见的页面是攻击者自己开发的一个诱导用户点击的页面，上面比如有个诱导性的播放按钮；而不可见的区域一般是以 frame 的形式加载的一个合法网站的网页，但有个位置相同的按钮点击后会触发某个用户不期望的操作，比如注销按钮。


## 防御
### frame busting
使用 JS 判断当前网页是否被作为 frame 加载。具体方法见《白帽子讲Web安全》

### `X-Frame-Options` header
1. [白帽子讲Web安全](https://book.douban.com/subject/10546925/) 上说的应该不对，上面说这个 header 是禁止当前页面加载其他 frame，但实际上应该是禁止当前页面被其他页面加载为 frame。
2. 首部字段 `X-Frame-Options` 有以下三个可指定的字段值：
    * `DENY`：该页面不能作为 frame 显示。
    * `SAMEORIGIN`：仅同源域名下的页面（Top-level-browsing-context）匹配时许可。（比如，当指定 http://hackr.jp/sample.html 页面为 `SAMEORIGIN` 时，那么 `hackr.jp` 上所有页面的 `frame` 都被允许可加载该页面，而 `example.com` 等其他域名的页面就不行了）。
    * `ALLOW-FROM origin`：只有指定的 origin 才能把当前页面加载为 frame。
3. 能在所有的 Web 服务器端预先设定好 `X-Frame-Options` 字段值是最理想的状态

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
