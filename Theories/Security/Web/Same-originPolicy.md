# Same-origin policy


<!-- TOC -->

- [Same-origin policy](#same-origin-policy)
    - [Same-origin policy 限制范围](#same-origin-policy-%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4)
        - [AJAX 同源限制是为了防止 CSRF](#ajax-%E5%90%8C%E6%BA%90%E9%99%90%E5%88%B6%E6%98%AF%E4%B8%BA%E4%BA%86%E9%98%B2%E6%AD%A2-csrf)
    - [相关定义](#%E7%9B%B8%E5%85%B3%E5%AE%9A%E4%B9%89)
        - [同源（same origin）的定义](#%E5%90%8C%E6%BA%90same-origin%E7%9A%84%E5%AE%9A%E4%B9%89)
        - [源（origin）的定义](#%E6%BA%90origin%E7%9A%84%E5%AE%9A%E4%B9%89)
    - [继承源](#%E7%BB%A7%E6%89%BF%E6%BA%90)
    - [绕过同源策略](#%E7%BB%95%E8%BF%87%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5)
        - [使用 document.domain](#%E4%BD%BF%E7%94%A8-documentdomain)
            - [危害](#%E5%8D%B1%E5%AE%B3)
        - [使用 CORS、WebSocket 或 JSONP](#%E4%BD%BF%E7%94%A8-corswebsocket-%E6%88%96-jsonp)
            - [HTML 中第三方资源的跨域使用](#html-%E4%B8%AD%E7%AC%AC%E4%B8%89%E6%96%B9%E8%B5%84%E6%BA%90%E7%9A%84%E8%B7%A8%E5%9F%9F%E4%BD%BF%E7%94%A8)
        - [使用代理服务器](#%E4%BD%BF%E7%94%A8%E4%BB%A3%E7%90%86%E6%9C%8D%E5%8A%A1%E5%99%A8)
        - [window.postMessage](#windowpostmessage)
    - [References](#references)

<!-- /TOC -->


## Same-origin policy 限制范围
* DOM 无法获得
* HTML 中第三方资源的跨域使用。例如对 `<audio>`、`<img>`、`<link>`、`<script>` 和 `<video>` 中引用资源的使用，比如 canvas 无法绘制跨域图片。
* Cookie 无法读取
* 无法读取本地存储：包括 `localStorage`、`sessionStorage` 和 `IndexedDB`
* AJAX 请求不能发送  

### AJAX 同源限制是为了防止 CSRF
如果 AJAX 没有同源限制，后果如下：
1. 我想让张三把银行账户的钱转给李四
2. 但只有银行验证了张三的身份后才会进行转账，即请求的 cookie 必须包含张三的身份信息
3. 我制作一个网页，网址为 `www.my.com`。内部会自动发起到银行网页 `www.bank.com/transfer` 的 `get` 或 `post` AJAX 请求，请求携带参数：转账金额和收款人李四
4. 诱导张三进入我的网页，由于没有同源限制，该 AJAX 请求可以发送成功。
5. 因为请求会自动发送请求域所（即 `www.bank.com`）设置的 cookie，所以张三浏览器里保存的银行的身份信息也同时发送。
6. 银行核对了身份信息，并不能区分这是张三在银行网站的转账请求还是在其他域的跨域请求，所以会执行转账。


## 相关定义
### 同源（same origin）的定义
相同的协议（protocol）、相同的端口（port）和相同的主机（host，包括域名和 IP）

### 源（origin）的定义
1. 脚本本身的来源和同源策略并不相关，相关的是脚本所嵌入的文档的来源。
2. 例如，假设一个来自主机 A 的脚本被包含到（使用 `<script>` 标记的 `src` 属性）宿主 B 的一个 Web 页面中。这个脚本的源是主机 B，因此可以完整地访问包含它的文档的内容。
3. 如果脚本打开一个新窗口并载入来自主机 B 的另一个文档，脚本对这个文档的内容也具有完全的访问权限。
4. 但是，如果脚本打开第三个窗口并载入一个来自主机 C 的文档（或者是来自主机 A），同源策略就会发挥作用，阻止脚本访问这个文档。
5. 假如脚本的源是脚本本身来源的话，那比如你引用了 `https://unpkg.com/axios/dist/axios.min.js`，那你就只能对 `https://unpkg.com` 发请求了。


## 继承源
1. 来自 `about:blank` 或 `javascript:` URL 的脚本内容会继承加载该 URL 的文档的源，因为这些 URL 自身没有给出关于源的信息。
2. 例如 `about:blank` 通常作为副脚本写入内容的空白弹出窗口的 URL（比如通过 `Window.open()`），如果弹出的窗口包含代码，则代码会继承和弹出该窗口的脚本相同的源。
3. `data:` URL 会获得一个新的、空的、安全的环境。


## 绕过同源策略
### 使用 `document.domain`
1. 该方法适用于一级域名相同但二级域名不同的两个域，或者域名相同但端口不同的两个域。
2. 可实现跨域访问 DOM、Cookie 和本地存储
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

#### HTML 中第三方资源的跨域使用
以 canvas 绘制跨域图片为例，Canvas 要渲染一个跨域图片，该图片除了必须设置合适的 `Access-Control-Allow-Origin` 以外，该图片资源所在的 `<img>` 节点，也要设置属性 `crossorigin=anonymous`。

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