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
the response.
    ```js
    // Node
    res.setHeader('Set-Cookie', 'CookieName=CookieValue');

    // Browser
    document.cookie = 'CookieName=CookieValue';
    ```
2. The cookie is usually stored by the browser, and then the cookie is sent with
 requests made to the same server inside a Cookie HTTP header.
3. An expiration date or duration can be specified, after which the cookie is no
 longer sent.
4. Additionally, restrictions to a specific domain and path can be set, limiting
 where the cookie is sent.
5. Now, with every new request to the server, the browser will send back all
previously stored cookies to the server using the `Cookie` header.
6. 不管是在服务器还是在浏览器中设置，空格都会被自动忽略
    ```js
    res.setHeader('Set-Cookie', 'CookieName=CookieValue;max-age=1800');
    res.setHeader('Set-Cookie', ' CookieName=CookieValue ;max-age=3600');
    res.setHeader('Set-Cookie', ' CookieName =CookieValue ;max-age=7200');
    res.setHeader('Set-Cookie', 'AnotherCookieName=AnotherCookieValue');
    res.setHeader('Content-Type', 'text/html');
    res.write('<script>console.log(document.cookie);</script>')
    // 打印 "CookieName=CookieValue; AnotherCookieName=AnotherCookieValue"
    res.end();
    ```

### Session cookies
1. A cookie without `Expires` or `Max-Age` directive is a session cookie: it is
deleted when the client shuts down.
2. Note that this is a subtly different lifetime than `sessionStorage`: cookies
are not scoped to a single window, and their default lifetime is the same as the
 entire browser process, not the lifetime of any one window.
3. However, web browsers may use **session restoring**, which makes most session
 cookies permanent, as if the browser was never closed.

### Permanent cookies
1. Instead of expiring when the client closes, permanent cookies expire at a
specific date (`Expires`) or after a specific length of time (`Max-Age`).
2. If a response includes both an `Expires` header and a `max-age` directive,
the `max-age` directive overrides the `Expires` header, even if the `Expires`
header is more restrictive.
3. When an expiry date is set, the time and date set is relative to the client
the cookie is being set on, not the server. 出于这个原因也不应该使用`Expires`
4. 如果设置为小数，则向下取整

```js
// Node
res.setHeader('Set-Cookie', 'CookieName=CookieValue;Max-Age=3600');

// Browser
document.cookie = 'CookieName=CookieValue;max-age=3600';
```

### `Secure` cookies
* A secure cookie is only sent to the server with a encrypted request over the
HTTPS protocol.
    ```js
    res.setHeader('Set-Cookie', 'SecureCookieName=SecureCookieValue;Secure');
    ```
* Starting with Chrome 52 and Firefox 52, insecure sites (`http:`) can't set
cookies with the `Secure` directive. 但是在服务器中设置的 secure cookie 会出现在响
应首部里。
* Even with `Secure`, sensitive information should *never* be stored in cookies,
 as they are inherently insecure and this flag can't offer real protection.

### `HttpOnly` cookies
To prevent cross-site scripting (XSS) attacks, `HttpOnly` cookies are
inaccessible to JavaScript's `document.cookie` API; they are only sent to the
server. For example, cookies that persist server-side sessions don't need to be
available to JavaScript, and the `HttpOnly` flag should be set.
```js
document.cookie = 'NormalCookieName1=NormalCookieValue1';
document.cookie = 'HttpOnlyCookieName=HttpOnlyCookieValue;HttpOnly';
document.cookie = 'NormalCookieName2=NormalCookieValue2;max-age=3600';
console.log(document.cookie);
// NormalCookieName1=NormalCookieValue1; NormalCookieName2=NormalCookieValue2
```

### Scope of cookies
The `Domain` and `Path` directives define the scope of the cookie: what URLs the
cookies should be sent to.

#### `Domain`
`Domain` specifies allowed hosts to receive the cookie. If unspecified, it
defaults to the host of the current document location, **excluding subdomains**.
If `Domain` is specified, then subdomains are always included.

#### `Path`
1. `Path` indicates a URL path that must exist in the requested URL in order to
send the `Cookie` header. The %x2F ("/") character is considered a directory
separator, and subdirectories will match as well.  
For example, if `Path=/docs` is set, these paths will match:
    * `/docs`
    * `/docs/Web/`
    * `/docs/Web/HTTP`
2. 在请求的路径不符合`Path`的设定时，仍然可以正常的保存响应的 cookie。之后请求路径修改
为符合的情况时，可以正常发送之前收到的 cookie。
3. 另外，在网页不符合`Path`指定的路径时，前端使用`document.cookie`也无法读取使用该
`Path`指定的 cookie。也就是说，不管是浏览器自动发送，还是前端主动获取，只要路径不对，都
没有权限使用该 cookie。

### SameSite (experimental by 2018.6)
`SameSite` cookies let servers require that a cookie shouldn't be sent with
cross-site requests, which somewhat protects against cross-site request forgery
attacks (CSRF). `SameSite` cookies are still experimental and not yet supported
by all browsers.

### `document.cookie`
* 可以设置 cookies 和读取 非`HttpOnly`cookies。XSS 盗取 cookies 就是使用这个方法。
    ```js
    document.cookie = 'CookieName1=CookieValue1';
    document.cookie = 'CookieName2 = CookieValue2 ;max-age=3600';

    let oCookies = {};
    document.cookie.split(';').forEach(cookie=>{
        let pair = cookie.trim().split('=');
        oCookies[pair[0]] = pair[1]
    });
    console.log(oCookies); // {CookieName1: "CookieValue1", CookieName2: "CookieValue2"}
    ```

* 和`res.setHeader`多次使用会覆盖的情况不同，第二次的`document.cookie`并不会覆盖第一
次的。因为不会覆盖，所以也无法通过赋值`undefined`进行删除。但是可以修改已经存在的值：
    ```js
    document.cookie = 'Name1=Value1';
    document.cookie = 'Name2=Value2';
    console.log(document.cookie); // Name1=Value1; Name2=Value2
    document.cookie = 'Name2=Value3';
    console.log(document.cookie); // Name1=Value1; Name2=Value3
    document.cookie = undefined;
    console.log(document.cookie); // Name1=Value1; Name2=Value3; undefined
    ```


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


## Misc
* 可以使用 `navigator.cookieEnabled` 来检测浏览器是否禁用了 cookie。如果为 `true` 则
说明启用 cookie，如果为 `false` 则表示禁用。


## References
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
