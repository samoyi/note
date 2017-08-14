# HTTP Referer 与 反盗链


```
# 打开Rewrite功能，虽然服务器设置里可能已经全局打开了
RewriteEngine on  
# referer不能为空
RewriteCond %{HTTP_REFERER} !^$   
# 重写的不能在防盗链范围内
RewriteCond %{HTTP_REFERER} !^http://(www\.)?domainB.com/.*$ [NC]
RewriteRule .*\.(gif|jpg|jpeg|bmp|png)$ deny.jpg [R,NC,L]
```



## References
* [《图解HTTP》](http://www.ituring.com.cn/book/1229)
* [Wikipedia](https://en.wikipedia.org/)
