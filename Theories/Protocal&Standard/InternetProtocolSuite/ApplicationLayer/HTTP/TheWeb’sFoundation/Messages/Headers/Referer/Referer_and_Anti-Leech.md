# HTTP Referer 与 反盗链


## referer反盗链
### 反盗链规则
    * 允许直接访问特定的资源
    * 允许指定白名单的域通过链接访问特定的资源
    * 禁止白名单以外的域通过链接访问特定的资源

### referer 反盗链原理
* 如果访问该资源的 request header 没有 referer，说明是浏览器直接访问，则允许访问
* 如果访问该资源的 request header 有referer，说明是通过链接访问
    * 如果 referer 的域名在自己期望的白名单中，则允许访问
    * 如果 referer 的域名不在自己期望的白名单中，则拒绝访问

**即，如果 referer 存在且 referer 的域名不在白名单中，则不允许访问指定的资源**

### 以 Apache 通过 .htaccess 设置图片反盗链为例，假设：
自己存放图片的域为 domainA，只允许 domainA 和 domainB 通过链接访问自己特定的图片，
其他域不能链接domainA中特定的图片。.htaccess中进行如下反盗链设置

```
# 打开Rewrite功能，虽然服务器设置里可能已经全局打开了
RewriteEngine on  

# referer 非空
RewriteCond %{HTTP_REFERER} !^$   

# referer 不在如下两个域内
# `NC` 表示 not case-sensitive
RewriteCond %{HTTP_REFERER} !^http://(www\.)?domainA.com/.*$ [NC]
RewriteCond %{HTTP_REFERER} !^http://(www\.)?domainB.com/.*$ [NC]

# 如果referer属于反盗链域名且访问的是如下类型的文件
# `R` 表示 redirect。这个例子里，将重定向的URI设为一个提示拒绝链接的图片
# 重定向默认返回的状态码为302，如果想设为其他值，可以像这样给R加上赋值代码: R=301
# `L` 表示 last，它的作用是，在这里已经设定了URI的情况下，如果在它后面还有其他规则，
# 那些规则可能会导致改变URI导致其不可用*
RewriteRule .*\.(webp|jpg|jpeg|png)$ http://www.domainA.com/deny.jpg [NC,R,L]
```

\* *不是很确定 L 的意思，[原文](http://httpd.apache.org/docs/current/rewrite/flags.html#flag_r)*

除了重定向，也可以直接返回 `403 Forbidden`，把上面 RewriteRule 的规则换成下面的就行
```
# 和上面RewriteRule规则的结构一样，短横线重定向的URI。但因为这里是直接禁止，所以不存
# 在重定向URI，短横线表示
# When using [F], an [L] is implied
RewriteRule .*\.(webp|jpg|jpeg|png)$ - [F]
```
关于短横线表示URI is not modified （[原文](http://httpd.apache.org/docs/current/rewrite/flags.html#flag_f)），在重定向至
具体的URI而不是直接403的情况下，如果重定向的URI设置为请求的URI，即重定向到它本身，则
会造成循环。而如果重定向的URI设置为短横线，则至少在Chrome中，会成功的返回该URI对应的
资源。



## referer反盗链破解
### 最简单的方法，不设置referer
因为上面防盗链起效的规则是必须要有referer才行，所以如果我设置请求不发送referer就可以  
在HTML中，可以直接设置如下meta标签即可
```html
<meta name="referrer" content="no-referrer">
```
在上面的防盗链设置中，为了可以让浏览器直接打开图片可以访问，不会限制referer为空的情
况，所以这里通过这样的设置就可以成功链接。

### 不设置referer也不能链接的情况
不链接设置了反盗链的域，直接把资源下载到自己的服务器  
例如，现在无法从前端页面链接这个URI `http://www.domainA.com/image/private.jpg`，
则直接使用后端下载，然后返回给自己想要链接的前端页面
```html
    <!-- 前端链接的写法举例 -->
    <a href="http://DomainC.php?getImage=http://www.domainA.com/image/private.jpg"></a>
```
```php
<?php
    // DomainC.php
    header('Content-Type: image/jpeg');
    echo file_get_contents( $_GET['getImage'] );
?>
```
这里实际上链接的是自己服务器里的资源


## References
* [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
* [RewriteRule Flags](http://httpd.apache.org/docs/current/rewrite/flags.html)
* [Deny visitors by referrer](http://www.htaccess-guide.com/deny-visitors-by-referrer/)
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
