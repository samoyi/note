# Cookies


<!-- TOC -->

- [Cookies](#cookies)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [Cookie 主要用于以下三个方面：](#cookie-主要用于以下三个方面)
    - [cookie 的生命周期](#cookie-的生命周期)
        - [会话 cookie（Session cookies）](#会话-cookiesession-cookies)
        - [持久 cookie（Permanent cookies）](#持久-cookiepermanent-cookies)
    - [对 cookie 的访问限制](#对-cookie-的访问限制)
        - [`Secure` cookies](#secure-cookies)
        - [`HttpOnly` cookies](#httponly-cookies)
        - [SameSite (experimental)](#samesite-experimental)
    - [cookie 的作用域](#cookie-的作用域)
        - [`Domain`](#domain)
        - [`Path`](#path)
    - [Security](#security)
        - [Session hijacking and XSS](#session-hijacking-and-xss)
        - [Cross-site request forgery (CSRF)](#cross-site-request-forgery-csrf)
    - [Tracking and privacy](#tracking-and-privacy)
        - [Third-party cookies](#third-party-cookies)
        - [Do-Not-Track](#do-not-track)
        - [EU cookie directive](#eu-cookie-directive)
        - [Zombie cookies and Evercookies](#zombie-cookies-and-evercookies)
    - [How Cookies Work](#how-cookies-work)
    - [Cookies and Caching](#cookies-and-caching)
        - [Mark documents uncacheable if they are](#mark-documents-uncacheable-if-they-are)
        - [Be cautious about caching `Set-Cookie` headers](#be-cautious-about-caching-set-cookie-headers)
        - [Be cautious about requests with `Cookie` headers](#be-cautious-about-requests-with-cookie-headers)
    - [Creating cookies](#creating-cookies)
        - [`document.cookie`](#documentcookie)
    - [Misc](#misc)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. An HTTP cookie is a small piece of data that a server sends to the user's web browser. The browser may store it and send it back with later requests to the same server. 
2. Cookies were once used for general client-side storage. While this was legitimate when they were the only way to store data on the client, it is now recommended to use modern storage APIs. Cookies are sent with every request, so they can worsen performance.


## Cookie 主要用于以下三个方面：
* **Session management**: Logins, shopping carts, game scores, or anything else the server should remember.
* **Personalization**: User preferences, themes, and other settings.
* **Tracking**: Recording and analyzing user behavior.


## cookie 的生命周期
### 会话 cookie（Session cookies）
1. 没有设置 `Expires` 或 `Max-Age` 的 cookie 是一个会话 cookie，当客户端关闭时就会被删除。
2. 注意和 `sessionStorage` 的不同。会话 cookie 的范围是整个浏览器进程，而 `sessionStorage` 是具体的一个窗口。
3. 但浏览器可能也会使用 **session restoring**，从而在浏览器关闭后仍然保存会话 cookie。

### 持久 cookie（Permanent cookies）
1. 持久 cookie 会保存在硬盘中，在浏览器关闭后仍然存在。
2. 持久缓存的删除时间是根据设置 cookie 时指定的 `Expires` 或 `Max-Age` 字段来决定的。
    ```js
    // Node
    res.setHeader('Set-Cookie', 'CookieName=CookieValue;Max-Age=3600');

    // Browser
    document.cookie = 'CookieName=CookieValue;max-age=3600';
    ```
3. `Expires` 设置的时间是客户端的时间而非服务器时间。
4. `Max-Age` 的优先级高于 `Expires`。
5. 如果设置为小数，则向下取整。


## 对 cookie 的访问限制
### `Secure` cookies
1. 设置 cookie 时如果设置了 `Secure` 字段，则该 cookie 只会在使用 HTTPS 协议时向服务器发送，这样可以有效避免中间人攻击
    ```js
    res.setHeader('Set-Cookie', 'SecureCookieName=SecureCookieValue;Secure');
    ```
2. 即使是 `Secure` cookie，也不应该用来保存敏感信息，因为 cookie 本身就是不安全的。
3. Starting with Chrome 52 and Firefox 52, insecure sites (`http:`) can't set cookies with the `Secure` directive. 

### `HttpOnly` cookies
1. 为了防止跨站脚本攻击（例如注入恶意脚本读取用户的 cookie），设置 cookie 时可以使用 `HttpOnly` 字段使得该 cookie 只能浏览器的请求发送给服务器，而不能被脚本读取，比如不能通过 JavaScript 的 `document.cookie` 读取。
2. 比如对于维持会话的 cookie 就没必要让 JavaScript 读取，因此应该这样设置
    ```js
    document.cookie = 'NormalCookieName1=NormalCookieValue1';
    document.cookie = 'HttpOnlyCookieName=HttpOnlyCookieValue;HttpOnly';
    document.cookie = 'NormalCookieName2=NormalCookieValue2;max-age=3600';
    console.log(document.cookie);
    // NormalCookieName1=NormalCookieValue1; NormalCookieName2=NormalCookieValue2
    ```

### SameSite (experimental)
1. 设置 cookie 使用这个字段可以让该 cookie 不能从跨站请求发送。
2. CSRF 攻击就是通过伪造的第三方网站发起请求并提交 cookie，因此可以使用这个字段进行防止
    ```js
    Set-Cookie: mykey=myvalue; SameSite=Strict
    ```
3. `SameSite` cookies are still experimental and not yet supported by all browsers.


## cookie 的作用域
`Domain` 和 `Path` 这两个字段指定了 cookie 的发送范围。

### `Domain`
1. 设置 cookie 时，这个字段可以指定哪些主机（域）可以接收该 cookie。
2. 默认情况下，只有当前域会接收到 cookie，而且不包含子域。
3. 但是如果指定了某个域，则它的子域也可以接收该 cookie
    ```
    Set-cookie: user="mary17"; domain="airtravelbargains.com"
    ```
4. 如果客户端访问 `www.airtravelbargains.com`、`specials.airtravelbargains.com` 或者任何以 `.airtravelbargains.com` 结尾的域，上面设置的 cookie 都会随着请求发送。

### `Path`
1. 使用这个字段可以指定主机中哪些路径可以接收 cookie。
2. 如果设置了该字段，则设置的路径的子路径也可以接收该 cookie。
3. 比如一个主机可能别两个用户共享，它们分别使用不同的路径。那么通过这个字段就可以让它们使用各自的 cookie。
4. 例如主机 `www.airtravelbargains.com` 把它的 `/autos/` 目录分享给其他用户，那么下面设置的 cookie 就只用在请求 `/autos/` 下的资源是才会被发送
    ```
    Set-cookie: pref=compact; domain="airtravelbargains.com"; path=/autos/
    ```
5. 在请求的路径不符合 `Path` 的设定时，仍然可以正常的保存响应的 cookie。之后请求路径修改为符合的情况时，可以正常发送之前收到的 cookie。
6. 另外，在网页不符合 `Path` 指定的路径时，前端使用 `document.cookie` 也无法读取使用该 `Path` 指定的 cookie。也就是说，不管是浏览器自动发送，还是前端主动获取，只要路径不对，虽然仍会保存，但都没有权限使用该 cookie。


## Security
Confidential or sensitive information should never be stored or transmitted in HTTP Cookies, as the entire mechanism is inherently insecure.

### Session hijacking and XSS
1. Cookies are often used in web application to identify a user and their authenticated session, so stealing a cookie can lead to hijacking the authenticated user's session. 
2. Common ways to steal cookies include Social Engineering or exploiting an XSS vulnerability in the application.
3. The `HttpOnly` cookie attribute can help to mitigate this attack by preventing access to cookie value through JavaScript.

### Cross-site request forgery (CSRF)
上面说到的 `SameSite` 属性以及《白帽子讲Web安全》中写到的防御 CSRF 的三个手段：
* **验证码**：保证只有用户明确交互才会发送请求。
* **Referer Check**：通过检查请求的 `Referer` 首部来确定请求页面 “来路正当”。
* **Anti CSRF Token**：大意就是设置 cookie 时生成一个随机 token，同时保存在用户表单隐藏域和 cookie 里。用户提交表单时，服务器会检查这两个 token 是否一致。如果有人 CSRF ，除非他看到了用户的前端代码，否则不会知道这个 token，因而即使发送了请求，服务器也可以发现请求中没有 token 或者和 cookie 中的 token 不同。


## Tracking and privacy
### Third-party cookies
1. Cookies have a domain associated to them. If this domain is the same as the domain of the page you are on, the cookies is said to be a **first-party cookie**. If the domain is different, it is said to be a **third-party cookie**.
2. While first-party cookies are sent only to the server setting them, a web page may contain images or other components stored on servers in other domains (like ad banners). 
3. Cookies that are sent through these third-party components are called third-party cookies and are mainly used for advertising and tracking across the web.
4. Many web sites contract with third-party vendors to manage advertisements. These advertisements are made to look like they are integral parts of the web site and do push persistent cookies. 
5. When the user goes to a different web site serviced by the same advertisement company, the persistent cookie set earlier is sent back again by the browser (because the domains match). 
6. A marketing company could use this technique, combined with the `Referer` header, to potentially build an exhaustive data set of user profiles and browsing habits. 
7. Most browsers allow third-party cookies by default, but there are add-ons available to block them.
8. If you are not disclosing third-party cookies, consumer trust might get harmed if cookie use is discovered. A clear disclosure (such as in a privacy policy) tends to eliminate any negative effects of a cookie discovery. Some countries also have legislation about cookies.

### Do-Not-Track
There are no legal or technological requirements for its use, but the `DNT` header can be used to signal that a web application should disable either its tracking or cross-site user tracking of an individual user. See the [`DNT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT) header for more information.  
因为没有法律或技术的要求，所以即使用户选择使用该 header，也并不能保证服务器一定不追踪

### EU cookie directive
1. Requirements for cookies across the EU are defined in [Directive 2009/136/EC](http://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0136) of the European Parliament and came into effect on 25 May 2011.
2. A directive is not a law by itself, but a requirement for EU member states to put laws in place that meet the requirements of the directive. The actual laws can differ from country to country.
3. In short the EU directive means that before somebody can store or retrieve any information from a computer, mobile phone or other device, the user must give informed consent to do so. Many websites have added banners (AKA "cookie
banners") since then to inform the user about the use of cookies.
4. For more, see this [Wikipedia section](https://en.wikipedia.org/wiki/HTTP_cookie#EU_cookie_directive)
and consult state laws for the latest and most accurate information. 确实在近几个月内（2018.5）看到一些外国网站打开后会在顶部出现 cookies 使用的 banner。

### Zombie cookies and Evercookies
A more radical approach to cookies are zombie cookies or "Evercookies" which are recreated after their deletion and are intentionally hard to delete forever. They are using the Web storage API, Flash Local Shared Objects and other
techniques to recreate themselves whenever the cookie's absence is detected.
* [Evercookie by Samy Kamkar](https://github.com/samyk/evercookie)
* [Zombie cookies on Wikipedia](https://en.wikipedia.org/wiki/Zombie_cookie)


## How Cookies Work
1. The cookie contains an arbitrary list of `name=value` information, and it is attached to the user using the `Set-Cookie` HTTP response headers.
2. Cookies can contain any information, but they often contain just a unique identification number, generated by the server for tracking purposes. 
3. When the user returns to the same site in the future, the browser will select those cookies
slapped onto the user by that server and pass them back in a `Cookie` request header.


## Cookies and Caching
1. You have to be careful when caching documents that are involved with cookie transactions. You don’t want to assign one user some past user’s cookie or, worse, show one user the contents of someone else’s personalized document.
2. The rules for cookies and caching are not well established. Here are some guiding principles for dealing with caches:

### Mark documents uncacheable if they are
1. The document owner knows best if a document is uncacheable. Explicitly mark documents uncacheable if they are — specifically, use `Cache-Control: no-cache=“Set-Cookie”` if the document is cacheable except for the `Set-Cookie`
header. 
2. The other, more general practice of using `Cache-Control: public` for documents that are cacheable promotes bandwidth savings in the Web.

### Be cautious about caching `Set-Cookie` headers
1. If a response has a `Set-Cookie` header, you can cache the body (unless told otherwise), but you should be extra cautious about caching the `Set-Cookie` header. If you send the same `Set-Cookie` header to multiple users, you may be defeating user targeting.
2. Some caches delete the `Set-Cookie` header before storing a response in the cache, but that also can cause problems, because clients served from the cache will no longer get cookies slapped on them that they normally would without the cache.
3. This situation can be improved by forcing the cache to revalidate every request with the origin server and merging any returned `Set-Cookie` headers with the client response. 
4. The origin server can dictate such revalidations by adding this header to the cached copy:
    ```
    Cache-Control: must-revalidate, max-age=0
    ```
5. More conservative caches may refuse to cache any response that has a `Set-Cookie` header, even though the content may actually be cacheable. Some caches allow modes when Set-Cookied images are cached, but not text.

### Be cautious about requests with `Cookie` headers
1. When a request arrives with a `Cookie` header, it provides a hint that the resulting content might be personalized. 
2. Personalized content must be flagged uncacheable, but some servers may erroneously not mark this content as uncacheable.
3. Conservative caches may choose not to cache any document that comes in response to a request with a `Cookie` header. 
4. And again, some caches allow modes when Cookied images are cached, but not text. 
5. The more accepted policy is to cache images with `Cookie` headers, with the expiration time set to zero, thus forcing a revalidate every time.


## Creating cookies
1. After receiving an HTTP request, a server can send one or more `Set-Cookie` headers with the response
    ```js
    // Node
    res.setHeader('Set-Cookie', 'CookieName=CookieValue');
    res.setHeader('Set-Cookie', ['CookieName=CookieValue', 'hehe=hoho']); // 设置多个 cookie

    // Browser
    document.cookie = 'CookieName=CookieValue';
    ```
2. The cookie is usually stored by the browser, and then the cookie is sent with requests made to the same server inside a `Cookie` HTTP header.
3. 不管是在服务器还是在浏览器中设置，空格都会被自动忽略
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

### `document.cookie`
1. 可以设置 cookies 和读取非 `HttpOnly` cookies。XSS 盗取 cookies 就是使用这个方法。
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
2. 和 `res.setHeader` 多次使用会覆盖的情况不同，第二次的 `document.cookie` 并不会覆盖第一次的。因为不会覆盖，所以也无法通过赋值 `undefined` 进行删除。但是可以修改已经存在的值：
    ```js
    document.cookie = 'Name1=Value1';
    document.cookie = 'Name2=Value2';
    console.log(document.cookie); // Name1=Value1; Name2=Value2
    document.cookie = 'Name2=Value3';
    console.log(document.cookie); // Name1=Value1; Name2=Value3
    document.cookie = undefined;
    console.log(document.cookie); // Name1=Value1; Name2=Value3; undefined
    ```
3. 如果要删除的话，就要通过让 cookie 过期的方法
    ```js
    document.cookie = 'Name1=Value1;max-age=0';
    ```
    名为 `Name1` 的 cookie 会立刻过期并被删除。


## Misc
* 可以使用 `navigator.cookieEnabled` 来检测浏览器是否禁用了 cookie。如果为 `true` 则说明启用 cookie，如果为 `false` 则表示禁用。


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)