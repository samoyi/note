# The Flow of Messages


<!-- TOC -->

- [The Flow of Messages](#the-flow-of-messages)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [TCP 的可靠数据管道](#tcp-的可靠数据管道)
    - [TCP 流分段的，通过 IP packets 传输](#tcp-流分段的通过-ip-packets-传输)
    - [保证 TCP 正确连接](#保证-tcp-正确连接)
    - [Programming with TCP Sockets](#programming-with-tcp-sockets)
        - [API](#api)
        - [一次使用流程举例](#一次使用流程举例)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. 假设通过浏览器请求下面的 URL
    ```
    http://www.joes-hardware.com:80/power-tools.html
    ```
2. 浏览器会按照下图的步骤执行
    <img src="./images/01.png" width="800" style="display: block; margin: 5px 0 10px 0;" />
    1. 提取域名；
    2. 把域名解析为 IP 地址；
    3. 提取端口号；
    4. 与目标主机的指定端口建立 TCP 连接；
    5. 通过这个连接发送一个 GET 请求；
    6. 服务器返回请求给客户端；
    7. 客户端关闭连接。


## TCP 的可靠数据管道
1. HTTP 连接时 TCP 连接再加上一些连接使用规则。TCP 连接时互联网的可靠连接。
2. TCP 为 HTTP 提供了可靠的比特管道，字节从管道的一段被装入，从另一端取出，并且能保证数据正确和顺序正确
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px 0;" />


## TCP 流分段的，通过 IP packets 传输
1. TCP 的数据通过称为 **IP packets** （或者叫做 **IP datagrams**，IP 数据报）的小数据块来发送的。
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
2. HTTP 想要发送报文时，会按顺序把报文流传入之前建立的 TCP 连接。
3. TCP 收到报文流之后会把它分成小的报文段（segment）；
4. 报文段会被被封装进 IP 数据报通过互联网传输。
    <img src="./images/04.png" width="800" style="display: block; margin: 5px 0 10px 0;" />
5. 所有这些都是 TCP/IP 软件处理的，HTTP 程序员什么也看不到。
6. 每一个 TCP 报文段都通过 IP 数据报从一个 IP 地址发送到另一个 IP 地址。每一个 IP 数据报包括：
    * 一个 IP 数据报首部（通常为 20 字节）
    * 一个 TCP 报文段首部（通常为 20 字节）
    * 一个 TCP 数据块（0 个或多个字节）
    * A TCP segment header (usually 20 bytes) 
    * A chunk of TCP data (0 or more bytes) 
7. IP 首部包含了源和目的 IP 地址、长度和其他标志。TCP 首部包括了 TCP 端口号、TCP 控制标志，以及用于数据顺序和完整性检查的数字值。


## 保证 TCP 正确连接
1. 任何时刻计算机上都有若干个打开的 TCP 连接，TCP 通过端口号保证这些连接正确。
2. IP 地址让你连接到正确的计算机，端口号让你连接到该计算机中正确的程序。
3. 下面是个值定义了一个唯一的 TCP 连接
    ```
    <source-IP-address, source-port, destination-IP-address, destination-port>
    ```


## Programming with TCP Sockets
### API
1. Operating systems provide different facilities for manipulating their TCP connections. Let’s take a quick look at one TCP programming interface, to make things concrete. 
2. Table below shows some of the primary interfaces provided by the sockets API. This sockets API hides all the details of TCP and IP from the HTTP programmer. 

    Sockets API call | Description
    --|--
    `s = socket(<parameters>)` | Creates a new, unnamed, unattached socket.
    `bind(s, <local IP:port>)` | Assigns a local port number and interface to the socket.
    `connect(s, <remote IP:port>)` | Establishes a TCP connection to a local socket and a remote host and port.
    `listen(s,...)` | Marks a local socket as legal to accept connections.
    `s2 = accept(s)` | Waits for someone to establish a connection to a local port.
    `n = read(s,buffer,n)` | Tries to read n bytes from the socket into the buffer.
    `n = write(s,buffer,n)` | Tries to write n bytes from the buffer into the socket.
    `close(s)` | Completely closes the TCP connection.
    `shutdown(s,<side>)` | Closes just the input or the output of the TCP connection.
    `getsockopt(s, . . . )` | Reads the value of an internal socket configuration option.
    `setsockopt(s, . . . )` | Changes the value of an internal socket configuration option.

3. The sockets API was first developed for the Unix operating system, but variants are now available for almost every operating system and language.
4. The sockets API lets you create TCP endpoint data structures, connect these endpoints to remote server TCP endpoints, and read and write data streams. 
5. The TCP API hides all the details of the underlying network protocol handshaking and the segmentation and reassembly of the TCP data stream to and from IP packets.

### 一次使用流程举例
1. The pseudocode in figure below sketches how we might use the sockets API to highlight the steps the client and server could perform to implement this HTTP transaction.
    <img src="./images/05.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
2. We begin with the web server waiting for a connection (S4). 
3. The client determines the IP address and port number from the URL and proceeds to establish a TCP connection to the server (C3). 
4. Establishing a connection can take a while, depending on how far away the server is, the load on the server, and the congestion of the Internet.
5. Once the connection is set up, the client sends the HTTP request (C5) and the server reads it (S6). 
6. Once the server gets the entire request message, it processes the request, performs the requested action (S7), and
writes the data back to the client. 
7. The client reads it (C6) and processes the response data (C7).
        
        
## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)