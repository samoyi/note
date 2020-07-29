# Cross-Site_Request_Forgery 跨站点请求伪造


<!-- TOC -->

- [Cross-Site_Request_Forgery 跨站点请求伪造](#cross-site_request_forgery-跨站点请求伪造)
    - [原理](#原理)
    - [示例](#示例)
        - [伪造转账请求](#伪造转账请求)
        - [Gmail 的 CSRF 漏洞](#gmail-的-csrf-漏洞)
    - [同域或跨域](#同域或跨域)
    - [防御攻击的手段](#防御攻击的手段)
        - [验证码](#验证码)
        - [验证来源](#验证来源)
        - [Anti CSRF Token](#anti-csrf-token)
            - [设置两个 token 的方法](#设置两个-token-的方法)
            - [设置一个 token 的方法](#设置一个-token-的方法)
        - [`SameSite` cookies](#samesite-cookies)
    - [预防攻击的发生](#预防攻击的发生)
    - [References](#references)

<!-- /TOC -->


## 原理
1. 向服务器提交请求需要 cookie 中验证身份。
2. cookie 的原理是只要往生成该 cookie 的域名发请求就会自动带上 cookie，而不关心这个请求是由谁、在哪儿发起的。
3. 所以攻击者可以在某个地方构造一个用户不期望的请求，诱骗用户进来。
4. 用户进来后该请求自动发送，或者触发用户点击后发送，或者自动加载一个图片，而该图片链接就是一个 get 请求，或者诱使用户点击某个链接而该链接就是一个 get 请求，等等。
5. 请求发送时会自动带上了用户 cookie 中的身份信息。请求成功提交。


## 示例
### 伪造转账请求
1. 由于很多的用户请求是需要通过 cookie 验证身份的，例如发帖、转账等，因此想要伪造这些请求，必须要让请求成功的发送 cookie。
2. 攻击者想要伪造受害者转账给攻击者的请求，该请求是要发送给银行网站 `http://www.bank.com/transfer` 的，银行网站接到该请求的时候会验证 cookie 中的身份信息。
3. 攻击者制作一个网页 `http://www.evil.com`，该网页会自动发送一个转账请求到 `http://www.bank.com/transfer`
4. 诱导受害者进入 `http://www.evil.com`，转账请求就会被发出，同时也会带上受害者的银行 cookie。

### Gmail 的 CSRF 漏洞
1. 一个 Gmail 用户在邮箱里点击了一个攻击者的链接，进入到攻击者网页。
2. 攻击者网页向 Gmail 发送了一个转发邮件的请求，请求 Gmail 把该用户的邮件转发一份到攻击者的服务器。
3. 因为攻击者网页发起的请求也会自动携带 Gmail 的 cookie，所以 Gmail 就同意了这个转发邮件的请求。
4. 之后该用户的邮件都会转发一份到攻击者的服务器。


## 同域或跨域
1. CSRF 一般发生在跨域网站上，因为比较方便随意构造。
2. 但也可以利用同域网站的漏洞发起攻击。
3. 比如同域网站有个发布文章的功能，可以插入第三方图片、链接甚至直接执行脚本。
4. 那攻击者就可以发布一篇文章，当有其他用户进入这篇文章时，就会发送请求。


## 防御攻击的手段
### 验证码
保证只有用户明确交互才会发送请求

### 验证来源
1. 请求可能会带上 `Origin` 和 `Referer` 的 header，这两个 header 都含有请求发起的域。
2. 但是这两个 header 都有可能不被发送，甚至被伪造。

### Anti CSRF Token
#### 设置两个 token 的方法
1. 大意就是设置 cookie 时生成一个随机 token，同时保存在用户表单隐藏域和 cookie 里。
2. 生成 token 的信息里可以加上时间戳，后续服务器可以验证是否过期。
3. 用户提交表单时，服务器会检查这两个 token 是否一致。
4. 如果有人 CSRF，除非他看到了用户的前端代码，否则不会知道这个 token，因而即使发送了请求，服务器也可以发现请求中没有 token 或者和 cookie 中的 token 不同。
5. 当然也不一定要放到表单里自动提交，也可以随便放到 cookie 以外的其他地方。在发送请求时，JS 取到这个 token 然后同时发送。
6. 服务端除了需要对比两个 token 相同以外，还需要验证这个 token 是否正确。

#### 设置一个 token 的方法
1. 还看到有只设置一个的方法，不往 cookie 里面设置了。
2. 这时跨域请求就不会发送 token 了，只会在设置 token 的页面请求时发送 token。
3. 不过服务器仍然需要验证。


### `SameSite` cookies
1. 为 `Set-Cookie` 响应头新增 `Samesite` 属性，它用来标明不允许跨站请求提交该 cookie。
2. 截止 2018.6 仍是实验性质。[参考](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)


## 预防攻击的发生
1. 前面所说的，都是被攻击的网站如何做好防护。而非预防攻击的发生，CSRF 的攻击可以来自：
    * 攻击者自己的网站。
    * 有文件上传漏洞的网站。
    * 第三方论坛等用户内容。
    * 被攻击网站自己的评论功能等。
2. 对于来自黑客自己的网站，我们无法预防。但对其他情况，可以考虑从以下方面预防
    * 严格管理所有的上传接口，防止任何预期之外的上传内容（例如 HTML）。
    * 添加 Header `X-Content-Type-Options: nosniff` 防止黑客上传 HTML 内容的资源（例如图片）被解析为网页。
    * 对于用户上传的图片，进行转存或者校验。不要直接使用用户填写的图片链接。
    * 当前用户打开其他用户填写的链接时，需告知风险（这也是很多论坛不允许直接在内容中发布外域链接的原因之一，不仅仅是为了用户留存，也有安全考虑）。


## References
* [白帽子讲Web安全](https://book.douban.com/subject/10546925/)
* <a href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)">WASP</a>
* [What is CSRF?](https://www.educba.com/what-is-csrf/)
* [【基本功】 前端安全系列之二：如何防止CSRF攻击？](https://zhuanlan.zhihu.com/p/46592479)
* [Google’s Gmail security failure leaves my business sabotaged](https://www.davidairey.com/google-gmail-security-hijack/)
