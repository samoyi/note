# HTTP Referer 与 反盗链

## 访问一个URI时，普通情况下，referer 的三种情况
* 通过浏览器直接访问该 URI，没有 referer
* 通过链接访问资源 URI，referer 为链接所在页面的 URI
    * referer 的域名和该 URI 为同一个域
    * referer 的域名和该 URI 不是一个域



## referer反盗链 与 referer反盗链破解
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
# [NC] 表示 not case-sensitive
RewriteCond %{HTTP_REFERER} !^http://(www\.)?domainA.com/.*$ [NC]
RewriteCond %{HTTP_REFERER} !^http://(www\.)?domainB.com/.*$ [NC]

# 如果referer属于反盗链域名且访问的是如下类型的文件
RewriteRule .*\.(webp|jpg|jpeg|png)$ http://www.domainA.com/deny.jpg [R,NC,L]
```

302 Found

## References
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [Wikipedia](https://en.wikipedia.org/)
