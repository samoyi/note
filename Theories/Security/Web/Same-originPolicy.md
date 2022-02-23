# Same-origin policy


<!-- TOC -->

- [Same-origin policy](#same-origin-policy)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
    - [同源（same origin）的定义](#同源same-origin的定义)
        - [第三方脚本的情况](#第三方脚本的情况)
    - [Same-origin policy 限制范围](#same-origin-policy-限制范围)
        - [服务器对请求的限制](#服务器对请求的限制)
        - [客户端对读写的限制](#客户端对读写的限制)
    - [AJAX 同源限制是为了防止 CSRF](#ajax-同源限制是为了防止-csrf)
    - [继承源](#继承源)
    - [绕过同源策略](#绕过同源策略)
        - [使用 `document.domain`](#使用-documentdomain)
            - [危害](#危害)
        - [使用 CORS、WebSocket 或 JSONP](#使用-corswebsocket-或-jsonp)
        - [HTML 中第三方资源的跨域使用](#html-中第三方资源的跨域使用)
        - [使用代理服务器](#使用代理服务器)
        - [`window.postMessage()`](#windowpostmessage)
    - [References](#references)

<!-- /TOC -->


## 设计目的
1. 同一个站点的页面之间可以正常交流，但不同站点要限制随意的读取和修改行为，只允许有条件的读取和修改。
2. 外站对本站服务器的请求要进行限制，不管是想获得资源还是提交修改，都要服务器对外站的认可才行。
3. 外站对本站客户端的的读写操作也要限制，防止客户端的信息泄露或者被篡改。

### 关键细节
* 为什么 scheme、host 和 port 三者组合到一起决定了源？


## 实现原理
* 服务器对请求的限制，通过服务器设置相关的跨域响应首部。
* 客户端对读写的限制，通过浏览器对外站脚本对本站客户端进行读写限制。


## 抽象本质


## 设计思想


## 同源（same origin）的定义
1. 一个的 URL 中的 scheme（HTTP、HTTPS 之类）、host（包括域名和 IP） 和 port 三者组合到一起定义了这个 URL 的源。
2. 如果两个 URL 的这三部分都相同，这两个 URL 才是同源的。
3. TODO。scheme 要相同除了防止 HTTP 访问本该安全的 HTTPS 之外，还有什么原因？port 要相同大概是因为虽然同一个 host，但会有很多进程，必须要确定就是自己期望的那个进程。
4. 默认情况下，一个源的文档是不能访问另一个源的文档的。例如 `http://example.com/doc.html` 无法成功访问到 `https://example.com/target.html` 的文档内容。因为两者的 scheme 和 port 都不一样：前者是 http 和 80，后者是 https 和 443。
5. 同源政策并不是限制发起请求，而是限制服务端对请求的响应。因此服务端可以修改某些配置来允许一定情况下对跨源请求进行响应。如果限制发起请求那就没有给服务器灵活处理的机会了。

### 第三方脚本的情况
1. 注意，文档中 JS 脚本的来源和同源策略并不相关，相关的是脚本所嵌入的文档的来源。
2. 例如，假设一个来自主机 A 的脚本被包含到主机 B 的一个 web 页面中。那么这个脚本的源是主机 B，因此可以完整地访问包含它的文档的内容。否则如果引用一个远程 jQuery 脚本就无法操作当前页面的 DOM 了。
3. 但是，如果第三方脚本确实有恶意代码，那就可以发起 XSS 攻击。所以 [第三方脚本的风险](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html) 是存在的。
4. 如果脚本打开一个新窗口并载入来自主机 B 的另一个文档，脚本对这个文档的内容也具有完全的访问权限。
5. 但是，如果脚本打开第三个窗口并载入一个来自主机 C 的文档（或者是来自主机 A），同源策略就会发挥作用，阻止脚本访问这个文档。


## Same-origin policy 限制范围
### 服务器对请求的限制
* AJAX 请求不能正常响应。  
* HTML 中第三方资源的跨域使用。例如对 `<audio>`、`<img>`、`<link>`、`<script>` 和 `<video>` 中引用资源的获得。

### 客户端对读写的限制
* DOM 无法获得。例如通过 iframe 访问其他源的 DOM。
* Cookie 无法读取。
* 无法读取本地存储：包括 `localStorage`、`sessionStorage` 和 `IndexedDB`。
* canvas 对于加载的跨域图片有使用限制。


## AJAX 同源限制是为了防止 CSRF
如果 AJAX 没有同源限制，后果如下：
1. 我想让张三把银行账户的钱转给李四。
2. 但只有银行验证了张三的身份后才会进行转账，即请求的 cookie 必须包含张三的身份信息。
3. 我制作一个网页，网址为 `www.my.com`。内部会自动发起到银行网页 `www.bank.com/transfer` 的 AJAX 请求，请求携带参数：转账金额和收款人李四。
4. 诱导张三进入我的网页，由于没有同源限制，该 AJAX 请求可以发送成功。
5. 因为请求会自动发送请求域所（即 `www.bank.com`）设置的 cookie，所以张三浏览器里保存的银行的身份信息也同时发送。
6. 银行核对了身份信息，并不能区分这是张三在银行网站的转账请求还是在其他域的跨域请求，所以会执行转账。


## 继承源
1. 来自 `about:blank` 或 `javascript:` URL 的脚本内容会继承加载该 URL 的文档的源，因为这些 URL 自身没有给出关于源的信息。
2. 例如 `about:blank` 通常作为副脚本写入内容的空白弹出窗口的 URL（比如通过 `Window.open()`），如果弹出的窗口包含代码，则代码会继承和弹出该窗口的脚本相同的源。
3. `data:` URL 会获得一个新的、空的、安全的环境。


## 绕过同源策略
### 使用 `document.domain`
1. 该方法适用于一级域名相同但二级域名不同的两个域，或者域名相同但端口不同的两个域。
2. 可实现跨域访问 DOM、Cookie 和本地存储。
3. frame 或子域可以通过设置与父级相同的 `document.domain` 来实现跨域访问 DOM。
4. 父级和子级必须都设置该属性且属性值相等。即使父级设置的该属性值就是当前的域名，也不能省略设置。
5. 对该属性任何赋值操作，都会导致端口号被设置为 `null`，即使是 `document.domain = document.domain`。所以才必须给父子的该属性都赋值，以保证两者的端口号都是 `null`。
    ```html
    <!-- http://localhost/test/index.html -->
    <body>
        <iframe id="myIframe" src="http://localhost:8080/"></iframe>
    </body>
    <script>
    "use strict";

    document.domain = 'localhost';

    window.onload = function(){
        let frameWin = document.getElementById("myIframe").contentWindow;
        let frameDoc = frameWin.document;

        console.log(frameDoc.querySelector('#child').textContent)
        console.log(frameDoc.cookie);
        console.log(frameWin.localStorage);
        console.log(frameWin.sessionStorage);
    };
    </script>
    ```
    ```js
    // 8080 端口域服务器
    const http = require('http');
    const fs = require('fs');

    http.createServer((req, res)=>{
        if (req.url !== '/favicon.ico'){
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            fs.createReadStream('./test.html').pipe(res);
        }
        else {
            res.end('');
        }
    }).listen(8080);
    ```
    ```html
    <!-- 8080 端口域被访问的静态文件 -->
    <body>
        <h1 id="child">子级页面</h1>
    </body>
    <script>
    "use strict";
    document.domain = 'localhost';

    document.cookie = 'key=2233';
    localStorage.name = '33';
    sessionStorage.age = 22;
    </script>
    ```

#### 危害
1. Avoid using the `document.domain` setter. It undermines the security protections provided by the same-origin policy. 
2. This is especially acute when using shared hosting; for example, if an untrusted third party is able to host an HTTP server at the same IP address but on a different port, then the same-origin protection that normally protects two different sites on the same host will fail, as the ports are ignored when comparing origins after the `document.domain` setter has been used.
3. Because of these security pitfalls, this feature is in the process of being removed from the web platform. (This is a long process that takes many years.)
4. Instead, use `postMessage()` or `MessageChannel` objects to communicate across origins in a safe manner.

### 使用 CORS、WebSocket 或 JSONP
1. 可实现跨域 AJAX 和 HTML 中第三方资源的跨域使用
2. CORS `header` 设置方法见 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\CORSAccessControl.md`。
3. WebSocket 配置方法参考这个[Demo](https://github.com/samoyi/Nichijou/tree/master/communication/websocket)

### HTML 中第三方资源的跨域使用
`crossorigin`。

### 使用代理服务器
1. 可实现跨域访问 DOM 和跨域 AJAX
2. 使用代理服务器直接读取跨域的文档
    ```html
    <iframe src="http://www.proxy.com/child.php" id="myIFrame"></iframe>
    ```
    ```php
    // http://www.proxy.com/child.php
    echo file_get_contents('http://www.another-domain/child.html');
    ```
3. 跨域 AJAX
    ```js
    // 请求页

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function(){
        if (this.readyState === 4){
            if ((this.status >=200 && this.status < 300) || this.status === 304){
                console.log(this.responseText);
            }
        }
    });
    xhr.open('GET', 'http://localhost/test/test.php?query=age');
    xhr.send();
    ```
    ```php
    // 代理服务器转发请求

    function HTTP_GET($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }
    $url = 'http://localhost:8080?query=' . $_GET['query'];
    echo HTTP_GET($url);
    ```
    ```js
    // 没有设置 Access-Control-Allow-Origin 的跨域站点

    const http = require('http');
    const url = require('url');
    http.createServer((req, res)=>{
        if (req.url !== '/favicon.ico'){
            let query = url.parse(req.url, true).query.query;
            res.end(query === 'age' ? '22' : '');
        }
        else {
            res.end('');
        }
    }).listen(8080);
    ```

### `window.postMessage()`
1. 该方法适用于浏览器标签页之间通信，以及页面和 `<iframe>` 之间通信。
2. 可实现跨域访问 DOM、Cookie 和本地存储
3. 用法见 `Theories\Languages\JavaScript\KnowledgeStructure\AjaxCometAndCrossOrigin\Cross-OriginMessaging.md`


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)  
* [阮一峰](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
* [Javascript - The Definitive Guide 6th](http://shop.oreilly.com/product/9780596805531.do)
* [Bypass Same Origin Policy](http://qnimate.com/same-origin-policy-in-nutshell/)
* [Origin 的标准文档](https://html.spec.whatwg.org/multipage/origin.html)
* [W3C 文档](https://www.w3.org/Security/wiki/Same_Origin_Policy)
* [Third Party JavaScript Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html)