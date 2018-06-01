# Cookie

## Purpose
* **Session management** --
Logins, shopping carts, game scores, or anything else the server should remember
* **Personalization** --
User preferences, themes, and other settings
* **Tracking** --
Recording and analyzing user behavior

Cookies were once used for general client-side storage. While this was
legitimate when they were the only way to store data on the client, it is
recommended nowadays to prefer modern storage APIs. Cookies are sent with every
request, so they can worsen performance (especially for mobile data connections).


## Creating cookies
1. When receiving an HTTP request, a server can send a `Set-Cookie` header with
the response. 以 Nodejs 为例：
2. The cookie is usually stored by the browser, and then the cookie is sent with
 requests made to the same server inside a Cookie HTTP header.
3. An expiration date or duration can be specified, after which the cookie is no
 longer sent.
4. Additionally, restrictions to a specific domain and path can be set, limiting
 where the cookie is sent.
5. Now, with every new request to the server, the browser will send back all
previously stored cookies to the server using the `Cookie` header.

### Session cookies
1. A cookie without `Expires` or `Max-Age` directive is a session cookie: it is
deleted when the client shuts down
2. However, web browsers may use **session restoring**, which makes most session
 cookies permanent, as if the browser was never closed.

### Permanent cookies
1. Instead of expiring when the client closes, permanent cookies expire at a
specific date (`Expires`) or after a specific length of time (`Max-Age`).
2. When an expiry date is set, the time and date set is relative to the client
the cookie is being set on, not the server.

### `Secure` and `HttpOnly` cookies
* A secure cookie is only sent to the server with a encrypted request over the
HTTPS protocol. Even with `Secure`, sensitive information should *never* be
stored in cookies, as they are inherently insecure and this flag can't offer
real protection. Starting with Chrome 52 and Firefox 52, insecure sites (`http:`)
can't set cookies with the `Secure` directive.
* To prevent cross-site scripting (XSS) attacks, `HttpOnly` cookies are
inaccessible to JavaScript's `document.cookie` API; they are only sent to the
server. For example, cookies that persist server-side sessions don't need to be
available to JavaScript, and the `HttpOnly` flag should be set.

### Scope of cookies
1. The Domain and Path directives define the scope of the cookie: what URLs the
cookies should be sent to.
2. `Domain` specifies allowed hosts to receive the cookie. If unspecified, it
defaults to the host of the current document location, **excluding subdomains**.
If `Domain` is specified, then subdomains are always included.
3. `Path` indicates a URL path that must exist in the requested URL in order to
send the `Cookie` header. The %x2F ("/") character is considered a directory
separator, and subdirectories will match as well.  
For example, if `Path=/docs` is set, these paths will match:
    * `/docs`
    * `/docs/Web/`
    * `/docs/Web/HTTP`

### SameSite (experimental by 2018.6)
`SameSite` cookies let servers require that a cookie shouldn't be sent with
cross-site requests, which somewhat protects against cross-site request forgery
attacks (CSRF). `SameSite` cookies are still experimental and not yet supported
by all browsers.

### `document.cookie`
可以设置 cookies 和读取 非 `HttpOnly` cookies。XSS 盗取 cookies 就是使用这个方法。



## Security
Confidential or sensitive information should never be stored or transmitted in
HTTP Cookies, as the entire mechanism is inherently insecure.

### Session hijacking and XSS
1. Cookies are often used in web application to identify a user and their
authenticated session, so stealing a cookie can lead to hijacking the
authenticated user's session. Common ways to steal cookies include Social
Engineering or exploiting an XSS vulnerability in the application.
2. The `HttpOnly` cookie attribute can help to mitigate this attack by
preventing access to cookie value through JavaScript.

### Cross-site request forgery (CSRF)
《白帽子讲Web安全》中写到的防御 CSRF 的三个手段：
* 验证码：保证只有用户明确交互才会发送请求
* Referer Check：通过检查请求的 `Referer` 首部来确定请求页面“来路正当”
* Anti CSRF Token：大意就是设置 cookie 时生成一个随机 token，同时保存在用户表单隐藏域
    和 cookie 里。用户提交表单时，服务器会检查这两个 token 是否一致。如果有人 CSRF ，
    除非他看到了用户的前端代码，否则不会知道这个 token，因而即使发送了请求，服务器也可
    以发现请求中没有 token 或者和 cookie 中的 token 不同。


## Tracking and privacy
### Third-party cookies
1. Cookies have a domain associated to them. If this domain is the same as the
domain of the page you are on, the cookies is said to be a first-party cookie.
If the domain is different, it is said to be a third-party cookie.
2. While first-party cookies are sent only to the server setting them, a web
page may contain images or other components stored on servers in other domains
(like ad banners). Cookies that are sent through these third-party components
are called third-party cookies and are mainly used for advertising and tracking
across the web.
3. Most browsers allow third-party cookies by default, but there are add-ons
available to block them.
4. If you are not disclosing third-party cookies, consumer trust might get
harmed if cookie use is discovered. A clear disclosure (such as in a privacy
policy) tends to eliminate any negative effects of a cookie discovery. Some
countries also have legislation about cookies.

### Do-Not-Track
There are no legal or technological requirements for its use, but the `DNT`
header can be used to signal that a web application should disable either its
tracking or cross-site user tracking of an individual user. See the [`DNT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT)
header for more information.  
因为没有法律或技术的要求，所以即使用户选择使用该 header，也并不能保证服务器一定不追踪

### EU cookie directive
1. Requirements for cookies across the EU are defined in [Directive 2009/136/EC](http://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0136)
of the European Parliament and came into effect on 25 May 2011.
2. A directive is not a law by itself, but a requirement for EU member states to
 put laws in place that meet the requirements of the directive. The actual laws
can differ from country to country.
3. In short the EU directive means that before somebody can store or retrieve
any information from a computer, mobile phone or other device, the user must
give informed consent to do so. Many websites have added banners (AKA "cookie
banners") since then to inform the user about the use of cookies.
4. For more, see this [Wikipedia section](https://en.wikipedia.org/wiki/HTTP_cookie#EU_cookie_directive)
and consult state laws for the latest and most accurate information.  
确实在近几个月内（2018.5）看到一些外国网站打开后会在顶部出现 cookies 使用的 banner。

### Zombie cookies and Evercookies
A more radical approach to cookies are zombie cookies or "Evercookies" which are
 recreated after their deletion and are intentionally hard to delete forever.
They are using the Web storage API, Flash Local Shared Objects and other
techniques to recreate themselves whenever the cookie's absence is detected.
* [Evercookie by Samy Kamkar](https://github.com/samyk/evercookie)
* [Zombie cookies on Wikipedia](https://en.wikipedia.org/wiki/Zombie_cookie)


## References
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
