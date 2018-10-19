# Same-origin policy


## same-origin policy 限制范围
* DOM 无法获得
* Cookie 无法读取
* 无法读取本地存储：包括 localStorage、sessionStorage 和 IndexDB
* AJAX 请求不能发送  

### AJAX 同源限制是为了防止 CSRF
如果 AJAX 没有同源限制，后果如下：
1. 我想让张三把银行账户的钱转给李四
2. 但只有银行验证了张三的身份后才会进行转账，即请求的 cookie 必须包含张三的身份信息
3. 我制作一个网页，网址为 `www.my.com`。内部会自动发起到银行网页
`www.bank.com/transfer`的 `get` 或 `post` AJAX 请求，请求携带参数：转账金额和收款人
李四
4. 诱导张三进入我的网页，由于没有同源限制，该 AJAX 请求可以发送成功。
5. 因为请求会自动发送请求域所设置的 cookie，所以张三浏览器里保存的银行的身份信息也同时
发送
6. 银行核对了身份信息，并不能区分这是张三在银行网站的转账请求还是在其他域的跨域请求，所
以会执行转账。


## 相关定义
### 同源（same origin）的定义
相同的协议（protocol）、相同的端口（port）和相同的主机（host）

### 源（origin）的定义
1. 脚本本身的来源和同源策略并不相关，相关的是脚本所嵌入的文档的来源。
2. 例如，假设一个来自主机 A 的脚本被包含到（使用`<script>`标记的`src`属性）宿主 B 的一
个Web页面中。这个脚本的源是主机 B，因此可以完整地访问包含它的文档的内容。
3. 如果脚本打开一个新窗口并载入来自主机 B 的另一个文档，脚本对这个文档的内容也具有完全的
访问权限。
4. 但是，如果脚本打开第三个窗口并载入一个来自主机 C 的文档（或者是来自主机 A），同源策
略就会发挥作用，阻止脚本访问这个文档。


## 继承源
1. 来自`about:blank`或`javascript:`URL 的脚本内容会继承加载该 URL 的文档的源，因为这些
URL 自身没有给出关于源的信息。
2. 例如`about:blank`通常作为副脚本写入内容的空白弹出窗口的 URL（比如通过
`Window.open()`），如果弹出的窗口包含代码，则代码会继承和弹出该窗口的脚本相同的源。
3. `data:` URL 会获得一个新的、空的、安全的环境。


## 绕过同源策略
### 使用`document.domain`
1. 可实现跨域访问 DOM、Cookie 和本地存储
2. frame 或子域可以通过设置与父级相同的`document.domain`来实现跨域访问 DOM。
3. 父级和子级必须都设置该属性且属性值相等。即使父级设置的该属性值就是当前的域名，也不能
省略设置。
4. 对该属性任何赋值操作，都会导致端口号被设置为`null`，即使是
`document.domain = document.domain`。所以才必须给父子的该属性都赋值，以保证两者的端口
号都是`null`。

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

### 使用 CORS、WebSocket 或 JSONP
1. 可实现跨域 AJAX
2. CORS `header`设置方法见`Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\CORSAccessControl.md`
3. WebSocket 配置方法参考这个[Demo](https://github.com/samoyi/Nichijou/tree/master/communication/websocket)

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
1. 可实现跨域访问 DOM、Cookie 和本地存储
2. 用法见`Theories\Languages\JavaScript\KnowledgeStructure\AjaxCometAndCrossOrigin\Cross-OriginMessaging.md`



## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)  
* [阮一峰](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
* [Javascript - The Definitive Guide 6th](http://shop.oreilly.com/product/9780596805531.do)
* [Bypass Same Origin Policy](http://qnimate.com/same-origin-policy-in-nutshell/)
