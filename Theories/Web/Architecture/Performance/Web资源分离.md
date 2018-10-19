# Web 资源分离
（《构建高性能Web站点（修订版）》中称为“Web组件”）  
这里所说的 Web 资源是指 Web 服务器提供的所有基于 URL 访问的资源，比如动态内容、图片、
jS 脚本和 CSS 文件等。


## 资源特征的维度
* 文件大小
* 文件数量
* 内容更新频率
* 预计并发用户数
* 是否需要脚本解释器
* 是否涉及大量 CPU 计算
* 是否访问数据库
* 访问数据库的主要操作是读还是写
* 是否包含远程调用（RPC）


## 分类优化
为了给不同类型的 Web 资源采取用针对性的措施，我们将这些 Web 资源分别进行独立部署，它们
可能位于不同的物理服务器，或者同一个物理服务器上的不同逻辑单元。

### 可能的优化方法
对资源进行分类后，可以按照类型进行针对性的优化，会考虑是否使用以下的一些优化策略：
* 是否使用 epoll 模型
* 是否使用 sendfile() 系统调用
* 是否使用异步 I/O
* 是否支持 HTTP 持久连接
* 是否需要 opcode 缓存
* 是否使用动态内容缓存，以及有效期为多久
* 是否使用 Web 服务器缓存，以及有效期为多久
* 是否使用浏览器缓存，以及有效期为多久
* 是否使用反向代理缓存，以及有效期为多久
* 是否使用负载均衡策略


## 设置不同的域名
* 为了方便管理，我们将不同的域名指向不同的 Web 资源服务器或逻辑单元
* 同时，设置不同域名还可以提高浏览器请求并发数

### 浏览器并发数限制
1. Even though parallel connections may be faster, however, they are not always
faster. When the client’s network bandwidth is scarce, most of the time might be
spent just transferring data. In this situation, a single HTTP transaction to a
fast server could easily consume all of the available modem bandwidth. If
multiple objects are loaded in parallel, each object will just compete for this
limited bandwidth, so each object will load proportionally slower, yielding
little or no performance advantage.
2. Also, a large number of open connections can consume a lot of memory and
cause performance problems of their own. Complex web pages may have tens or
hundreds of embedded objects. Clients might be able to open hundreds of
connections, but few web servers will want to do that, because they often are
processing requests for many other users at the same time. A hundred
simultaneous users, each opening 100 connections, will put the burden of 10,000
connections on the server. This can cause significant server slowdown. The same
situation is true for high-load proxies.
3. In practice, browsers limit the total number of parallel connections to a
small number. Servers are free to close excessive connections from a particular
client.


## 不同类型资源的优化策略
参考 《构建高性能Web站点（修订版）》9.5 章节——发挥各自的潜力


## References
* [《构建高性能Web站点（修订版）》](https://book.douban.com/subject/10812787/)
* [《HTTP》](https://book.douban.com/subject/1440226/)
