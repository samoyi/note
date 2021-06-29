# Cookies


<!-- TOC -->

- [Cookies](#cookies)
    - [设计思想](#%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3)
    - [抽象本质](#%E6%8A%BD%E8%B1%A1%E6%9C%AC%E8%B4%A8)
    - [Summary](#summary)
    - [Cookie 主要用于以下三个方面：](#cookie-%E4%B8%BB%E8%A6%81%E7%94%A8%E4%BA%8E%E4%BB%A5%E4%B8%8B%E4%B8%89%E4%B8%AA%E6%96%B9%E9%9D%A2)
    - [Lifetime of a cookie](#lifetime-of-a-cookie)
        - [Session cookies](#session-cookies)
        - [Permanent cookies](#permanent-cookies)
    - [Restrict access to cookies](#restrict-access-to-cookies)
        - [Secure cookies](#secure-cookies)
        - [HttpOnly cookies](#httponly-cookies)
        - [SameSite experimental by 2018.6](#samesite-experimental-by-20186)
    - [Scope of cookies](#scope-of-cookies)
        - [Domain](#domain)
        - [Path](#path)
    - [Security](#security)
        - [Session hijacking and XSS](#session-hijacking-and-xss)
        - [Cross-site request forgery CSRF](#cross-site-request-forgery-csrf)
    - [Tracking and privacy](#tracking-and-privacy)
        - [Third-party cookies](#third-party-cookies)
        - [Do-Not-Track](#do-not-track)
        - [EU cookie directive](#eu-cookie-directive)
        - [Zombie cookies and Evercookies](#zombie-cookies-and-evercookies)
    - [How Cookies Work](#how-cookies-work)
    - [Cookies and Session Tracking](#cookies-and-session-tracking)
    - [Cookies and Caching](#cookies-and-caching)
        - [Mark documents uncacheable if they are](#mark-documents-uncacheable-if-they-are)
        - [Be cautious about caching Set-Cookie headers](#be-cautious-about-caching-set-cookie-headers)
        - [Be cautious about requests with Cookie headers](#be-cautious-about-requests-with-cookie-headers)
    - [Creating cookies](#creating-cookies)
        - [document.cookie](#documentcookie)
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


## Lifetime of a cookie
### Session cookies
1. A cookie without `Expires` or `Max-Age` directive is a session cookie: it is deleted when the client shuts down.
2. Note that this is a subtly different lifetime than `sessionStorage`: cookies are not scoped to a single window, and their default lifetime is the same as the entire browser process, not the lifetime of any one window.
3. However, web browsers may use **session restoring**, which makes most session cookies permanent, as if the browser was never closed.

### Permanent cookies
1. Persistent cookies can live longer; they are stored on disk and survive browser exits and computer restarts.
2. Instead of expiring when the client closes, permanent cookies expire at a specific date (`Expires`) or after a specific length of time (`Max-Age`).
3. If a response includes both an `Expires` header and a `max-age` directive, the `max-age` directive overrides the `Expires` header, even if the `Expires` header is more restrictive
    ```js
    // Node
    res.setHeader('Set-Cookie', 'CookieName=CookieValue;Max-Age=3600');

    // Browser
    document.cookie = 'CookieName=CookieValue;max-age=3600';
    ```
4. When an expiry date is set, the time and date set is relative to the client the cookie is being set on, not the server. 出于这个原因也不应该使用 `Expires`。
5. 如果设置为小数，则向下取整。


## Restrict access to cookies
### `Secure` cookies
1. A secure cookie is only sent to the server with a encrypted request over the HTTPS protocol, never with unsecured HTTP (except on localhost), and therefore can't easily be accessed by a man-in-the-middle attacker
    ```js
    res.setHeader('Set-Cookie', 'SecureCookieName=SecureCookieValue;Secure');
    ```
2. Starting with Chrome 52 and Firefox 52, insecure sites (`http:`) can't set cookies with the `Secure` directive. 
3. Even with `Secure`, sensitive information should **never** be stored in cookies, as they are inherently insecure and this flag can't offer real protection.

### `HttpOnly` cookies
1. To prevent cross-site scripting (XSS) attacks, `HttpOnly` cookies are inaccessible to JavaScript's `document.cookie` API; they are only sent to the server. 
2. For example, cookies that persist server-side sessions don't need to be available to JavaScript, and the `HttpOnly` flag should be set.
    ```js
    document.cookie = 'NormalCookieName1=NormalCookieValue1';
    document.cookie = 'HttpOnlyCookieName=HttpOnlyCookieValue;HttpOnly';
    document.cookie = 'NormalCookieName2=NormalCookieValue2;max-age=3600';
    console.log(document.cookie);
    // NormalCookieName1=NormalCookieValue1; NormalCookieName2=NormalCookieValue2
    ```

### SameSite (experimental by 2018.6)
1. `SameSite` cookies let servers require that a cookie shouldn't be sent with cross-site requests, which somewhat protects against cross-site request forgery attacks (CSRF)
    ```js
    Set-Cookie: mykey=myvalue; SameSite=Strict
    ```
2. `SameSite` cookies are still experimental and not yet supported by all browsers.


## Scope of cookies
The `Domain` and `Path` directives define the scope of the cookie: what URLs the cookies should be sent to.

### `Domain`
1. A server generating a cookie can control which sites get to see that cookie by adding a `Domain` attribute to the `Set-Cookie` response header. 
2. If unspecified, it defaults to the host of the current document location, **excluding subdomains**.
3. For example, the following HTTP response header tells the browser to send the cookie `user=“mary17”` to any site in the domain `.airtravelbargains.com`:
    ```
    Set-cookie: user="mary17"; domain="airtravelbargains.com"
    ```
4. If the user visits `www.airtravelbargains.com`, `specials.airtravelbargains.com`, or any site ending in `.airtravelbargains.com`, the following `Cookie` header will be issued:
    ```
    Cookie: user="mary17"
    ```

### `Path`
1. The cookie specification even lets you associate cookies with portions of web sites. This is done using the `Path` attribute, which indicates the URL path prefix where each cookie is valid, and subdirectories will match as well.
2. For example, one web server might be shared between two organizations, each having separate cookies. The site `www.airtravelbargains.com` might devote part of its web site to auto rentals—say, `http://www.airtravelbargains.com/autos/`—using a separate cookie to keep track of a user’s preferred car size. 
3. A special auto-rental cookie might be generated like this:
    ```
    Set-cookie: pref=compact; domain="airtravelbargains.com"; path=/autos/
    ```
4. If the user goes to `http://www.airtravelbargains.com/specials.html`, she will get only this cookie:
    ```
    Cookie: user="mary17"
    ```
5. But if she goes to `http://www.airtravelbargains.com/autos/cheapo/index.html`, she will get both of these cookies:
    ```
    Cookie: user="mary17"
    Cookie: pref=compact
    ```
6. 在请求的路径不符合 `Path` 的设定时，仍然可以正常的保存响应的 cookie。之后请求路径修改为符合的情况时，可以正常发送之前收到的 cookie。
7. 另外，在网页不符合 `Path` 指定的路径时，前端使用 `document.cookie` 也无法读取使用该 `Path` 指定的 cookie。也就是说，不管是浏览器自动发送，还是前端主动获取，只要路径不对，虽然仍会保存，但都没有权限使用该 cookie。


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
1. Cookies are like “Hello, My Name Is” stickers stuck onto users by servers. When a user visits a web site, the web site can read all the stickers attached to the user by that server.
2. The first time the user visits a web site, the web server doesn’t know anything about the user. The web server expects that this same user will return again, so it wants to “slap” a unique cookie onto the user so it can identify this user in the future. 
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
3. The cookie contains an arbitrary list of `name=value` information, and it is attached to the user using the `Set-Cookie` HTTP response (extension) headers.
4. Cookies can contain any information, but they often contain just a unique identification number, generated by the server for tracking purposes. 
5. For example, in figure above (b), the server slaps onto the user a cookie that says `id="34294"`. The server can use this number to look up database information that the server accumulates for its visitors (purchase history, address information, etc.).
6. However, cookies are not restricted to just ID numbers. Many web servers choose to keep information directly in the cookies. For example: `Cookie: name="Brian Totty"; phone="555-1212"`. The browser remembers the cookie contents sent back from the server in `Set-Cookie` headers, storing the set of cookies in a browser cookie database. 
7. When the user returns to the same site in the future (igure above (c)), the browser will select those cookies
slapped onto the user by that server and pass them back in a `Cookie` request header.


## Cookies and Session Tracking
1. Cookies can be used to track users as they make multiple transactions to a web site. 
2. E-commerce web sites use session cookies to keep track of users’ shopping carts as they browse. Let’s take the example of the popular shopping site `Amazon.com`.
3. When you type `http://www.amazon.com` into your browser, you start a chain of transactions where the web server attaches identification information through a series of redirects, URL rewrites, and cookie setting.
4. Figure below shows a transaction sequence captured from an `Amazon.com` visit:
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
    
    1. (a)—Browser requests `Amazon.com` root page for the first time.
    2. (b)—Server redirects the client to a URL for the e-commerce software.
    3. (c)—Client makes a request to the redirected URL.
    4. (d)—Server slaps two session cookies on the response and redirects the user to another URL, so the client will request again with these cookies attached. This new URL is a fat URL, meaning that some state is embedded into the URL. If the client has cookies disabled, some basic identification can still be done as long as the user follows the `Amazon.com`-generated fat URL links and doesn’t leave the site.
    5. (e)—Client requests the new URL, but now passes the two attached cookies.
    6. (f)—Server redirects to the `home.html` page and attaches two more cookies.
    7. (g)—Client fetches the `home.html` page and passes all four cookies.
    8. (h)—Server serves back the content.


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