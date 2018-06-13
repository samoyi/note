# When you open a web page

## 1. 自动补全 URL
浏览器根据历史记录自动匹配补全 URL


## 2. 域名解析
1. 先看看浏览器有没有缓存
2. 如果没有再看看本机系统有没有缓存
3. 如果没有再看看本地服务器有没有缓存
4. 如果还没有，才发送请求给 ISP 的本地域名服务器

IP地址的请求过程参考 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\DNS\Basic.md`


## 3. 浏览器建立与服务器的 TCP 链接
1. Browsers use internet protocols to build such connections. There are a number
 of different internet protocols which can be used but TCP is the most common
protocol used for any type of HTTP request.
2. Three-way handshake. 具体参考 `Theories\Protocal&Standard\InternetProtocolSuite\TransportLayer\DNS\ConnectionManagement.md`


## 4. 发送 HTTP 请求


## 5. 可能的重定向
具体参考 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\status_code\30X_redirection.md`


## 6. 可能的反向代理
具体参考 `Theories\Web\WebServer\Architecture\FunctionOfReverseProxy.md`


## 7. Web 服务器处理请求


## 8. 服务器返回 HTTP 响应　


## 9. 页面渲染


## References
* [What happens when you type an URL in the browser and press enter?](https://medium.com/@maneesha.wijesinghe1/what-happens-when-you-type-an-url-in-the-browser-and-press-enter-bb0aa2449c1a)
* [【原】老生常谈-从输入url到页面展示到底发生了什么](http://www.cnblogs.com/xianyulaodi/p/6547807.html)
