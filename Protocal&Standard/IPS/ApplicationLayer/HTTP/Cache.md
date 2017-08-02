# Cache

不设置缓存，浏览器也会自动缓存

## 使用 ETags 来确认是否使用缓存
1. 浏览器第一次发起一个请求时，服务器可以在响应中设置一个注明缓存有效期的header，并同时设
置随机字符串（比如一个hash值）作为`Etag` header 的值。
2. 此后，被请求的数据如果在服务器端发生了改变，则在服务器上所记录的响应Etag会发生改变，与
此前回应给浏览器的将不再是同样的值。
3. 浏览器准备再一次发起该请求时，会先检查缓存，查看上一次请求的回应。如果发现上次回应时设
置的缓存过期时间没到，则直接使用缓存的数据。
4. 如果已经超了缓存的有效期，则必须要联系服务器。浏览器会把上次回应的Etag值作为
`If-None-Match` header 的值发送给服务器，服务器检查和当前的Etag是否一致，如果一致就表明
所请求的数据一致没有变，则会返回304告知，浏览器可以继续使用缓存的数据。


## Chrome 的 memory cache 和 disk cache
### 速度
以一张几十KB的图片为例：
* 从 memory cache 中下载图片，下载时间是 μs 级别的。
* 从 disk cache 中下载图片，下载时间是 ms 级别的。

### Chrome 在不同场景下的 cache 使用
在有缓存的情况下：
* F5 或 ctrl+F5 刷新当前页面，都可能是 memory cache 也可能是 disk cache，目前没有发现规律。
* 重新打开一个标签页加载，使用 disk cache。




## References
* [Google Developers - HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
* [Wikipedia](https://en.wikipedia.org/)
