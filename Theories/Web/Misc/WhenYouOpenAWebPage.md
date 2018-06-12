# When you open a web page

## 1. 自动补全 URL
浏览器根据历史记录自动匹配补全 URL


## 2. 域名解析
1. 先看看浏览器有没有缓存
2. 如果没有再看看本机系统有没有缓存
3. 如果没有再看看本地服务器有没有缓存
4. 如果还没有，才发送请求给 ISP 的本地域名服务器

IP地址的请求过程参考 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\DNS\Basic.md`


## 3. Browser initiates a TCP connection with the server.
1. Browsers use internet protocols to build such connections. There are a number
 of different internet protocols which can be used but TCP is the most common
protocol used for any type of HTTP request.
2. Three-way handshake. 浏览器会以一个随机端口（1024<端口<65535）向服务器的WEB程序
（常用的有httpd,nginx等）80 端口发起 TCP 的连接请求。这个连接请求到达服务器端后，进入
到网卡，然后是进入到内核的 TCP/IP 协议栈（用于识别该连接请求，解封包，一层一层的剥开），
还有可能要经过 Netfilter 防火墙（属于内核的模块）的过滤，最终到达 WEB 程序，最终建立了
TCP/IP的连接。  
Three-way handshake 具体参考 `Theories\Protocal&Standard\InternetProtocolSuite\TransportLayer\DNS\ConnectionManagement.md`



## 4. The browser sends an HTTP request to the web server


## 5. 可能的重定向
具体参考 `Theories\Protocal&Standard\InternetProtocolSuite\ApplicationLayer\HTTP\status_code\30X_redirection.md`


## 6. 服务器处理请求


拿到域名对应的IP地址之后，浏览器会以一个随机端口（1024<端口<65535）向服务器的WEB程序（常用的有httpd,nginx等）80端口发起TCP的连接请求。这个连接请求到达服务器端后（这中间通过各种路由设备，局域网内除外），进入到网卡，然后是进入到内核的TCP/IP协议栈（用于识别该连接请求，解封包，一层一层的剥开），还有可能要经过Netfilter防火墙（属于内核的模块）的过滤，最终到达WEB程序，最终建立了TCP/IP的连接。


## References
* [What happens when you type an URL in the browser and press enter?](https://medium.com/@maneesha.wijesinghe1/what-happens-when-you-type-an-url-in-the-browser-and-press-enter-bb0aa2449c1a)
* [【原】老生常谈-从输入url到页面展示到底发生了什么](http://www.cnblogs.com/xianyulaodi/p/6547807.html)
