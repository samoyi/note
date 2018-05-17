# Same-origin policy


## same-origin policy 限制范围
### Cookie无法读取
    * A page can set a cookie for its own domain or any parent domain.
    * The browser will make a cookie available to the given domain including any
     sub-domains.

### LocalStorage和IndexDB无法读取

### DOM无法获得

### AJAX请求不能发送  
防止CSRF


## Definition
### Definition of same origin
Two pages have the same origin if the **protocol**, **port**
(if one is specified), and **host** are the same for both pages.

### Definition of origin
* A script can read only the properties of windows and documents that have the
same origin as the document that **contains the script**, the origin of the
script itself is not relevant to the same-origin policy.
* Suppose, for example, that a script hosted by host A is included (using the
`src` property of a `<script>` element) in a web page served by host B. The
origin of that script is host B and the script has full access to the content of
 the document that contains it. If the script opens a new window and loads a
second document from host B, the script also has full access to the content of
that second document. But if the script opens a third window and loads a
document from host C (or even one from host A) into it, the same-origin policy
comes into effect and prevents the script from accessing this document.


## Inherited origins
Content from `about:blank` and `javascript:` URLs inherits the origin from the
document that loaded the URL, since the URL itself does not give any information
 about the origin. `data:` URLs get a new, empty, security context.


## IE Exceptions
Internet Explorer has two major exceptions when it comes to same origin policy
### 1. Trust Zones
If both domains are in highly trusted zone e.g, corporate domains, then the same
 origin limitations are not applied
### 2. Port
IE doesn't include port into Same Origin components, therefore
`http://company.com:81/index.html` and `http://company.com/index.html` are
considered from same origin and no restrictions are applied.


## Bypassing
### 跨域访问DOM
#### `document.domain`
1. A frame or child page can bypass this restriction by setting `document.domain`
variable to the same domain name as the parent’s domain name.
2. When using `document.domain` to allow a subdomain to access its parent
securely, you need to set `document.domain` to the same value in both the parent
 domain and the subdomain. This is necessary even if doing so is simply setting
the parent domain back to its original value. Failure to do this may result in
permission errors.
3. The port number is kept separately by the browser. Any call to the setter,
including `document.domain = document.domain` causes the port number to be
overwritten with `null`. Therefore one cannot make `company.com:8080` talk to
`company.com` by only setting `document.domain = "company.com"` in the first. It
 has to be set in both so that port numbers are both `null`.

#### Proxy server
`http://www.qnimate.com/parent.html`:
```html
<iframe src="http://www.qnimate.com/child.php" id="myIFrame"></iframe>
<script>
window.document.getElementById("myIFrame").contentWindow.document.body.style
    .backgroundColor = "red"; // this access is allowed by default
</script>
```
`http://www.qnimate.com/child.php`:
```php
<?php
    echo file_get_contents('http://www.blog.qnimate.com/child.html');
?>
```

#### `window.postMessage()`

### 跨域AJAX
#### CORS
#### JSONP
#### Proxy server

### 跨域读取LocalStorage和IndexDB
#### `window.postMessage()`

### 跨域读取Cookie
#### `window.postMessage()`


## 总结一下各个跨域方法的适用范围
* `document.domain`： Cookie、DOM
* Proxy server：DOM、AJAX
* `window.postMessage()`：DOM、跨域读取LocalStorage和IndexDB
* JSONP：AJAX
* CORS：AJAX


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)  
* [阮一峰](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
* [Javascript - The Definitive Guide 6th](http://shop.oreilly.com/product/9780596805531.do)
* [Bypass Same Origin Policy](http://qnimate.com/same-origin-policy-in-nutshell/)
