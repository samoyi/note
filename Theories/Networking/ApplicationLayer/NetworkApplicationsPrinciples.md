# Principles of Network Applications


<!-- TOC -->

- [Principles of Network Applications](#principles-of-network-applications)
    - [网络应用程序架构](#网络应用程序架构)
        - [Client-server architecture](#client-server-architecture)
        - [P2P architecture](#p2p-architecture)
            - [self-scalability](#self-scalability)
    - [Processes Communicating](#processes-communicating)
        - [进程与网络之间的接口](#进程与网络之间的接口)
        - [进程寻址（Addressing Processes）](#进程寻址addressing-processes)
    - [References](#references)

<!-- /TOC -->


## 网络应用程序架构
选择应用程序架构时，程序员可能会利用现代网络应用的两大主流架构模式之一：客户端-服务器（client-server）架构或者 P2P（peer-to-peer）架构。

### Client-server architecture
1. In a client-server architecture, there is an always-on host, called the *server*, which services requests from many other hosts, called *clients*.
2. Note that with the client-server architecture, clients do not directly communicate with each other; for example, in the Web application, two browsers do not directly communicate. 
3. Another characteristic of the client-server architecture is that the server has a fixed, well-known address, called an IP address. 
4. Because the server has a fixed, well-known address, and because the server is always on, a client can always contact the server by sending a packet to the server’s IP address.
5. Often in a client-server application, a single-server host is incapable of keeping up with all the requests from clients. For this reason, a **data center**, housing a large number of hosts, is often used to create a powerful virtual server. 
6. The most popular Internet services employ one or more data centers. A data center can have hundreds of thousands of servers, which must be powered and maintained. 
7. Additionally, the service providers must pay recurring interconnection and bandwidth costs for sending data from their data centers.

### P2P architecture
1. In a P2P architecture, there is minimal (or no) reliance on dedicated servers in data centers. Instead the application exploits direct communication between pairs of intermittently connected hosts, called **peers**. 
2. The peers are not owned by the service provider, but are instead desktops and laptops controlled
by users, with most of the peers residing in homes, universities, and offices.
3. Because the peers communicate without passing through a dedicated server, the architecture is called peer-to-peer. 
4. We mention that some applications have hybrid architectures, combining both client-server and P2P elements. For example, for many instant messaging applications, servers are used to track the IP addresses of users, but user-touser messages are sent directly between user hosts (without passing through intermediate servers).

#### self-scalability
1. One of the most compelling features of P2P architectures is their **self-scalability**. 
2. For example, in a P2P file-sharing application, although each peer generates workload by requesting files, each peer also adds service capacity to the system by distributing files to other peers. 
3. P2P architectures are also cost effective, since they normally don’t require significant server infrastructure and server bandwidth (in contrast with clients-server designs with data centers). 
4. However, P2P applications face challenges of security, performance, and reliability due to their highly decentralized structure.


## Processes Communicating
1. Before building your network application, you also need a basic understanding of how the programs, running in multiple end systems, communicate with each other. 
2. In the jargon of operating systems, it is not actually programs but processes that communicate. A process can be thought of as a program that is running within an end system. 
3. Processes on two different end systems communicate with each other by exchanging **messages** across the computer network. 
4. A sending process creates and sends messages into the network; a receiving process receives these messages and possibly responds by sending messages back. 

### 进程与网络之间的接口
1. 应用层的应用程序进程发送报文和接收报文都需要通过协议栈下层的网络，进程和下层网络的接口，是被称为 **socket** 的软件。
2. 当一个进程要发送报文时，它把报文传递给 socket，就不需要管了，因为接下来是传输层和更底层的事情，与应用层的程序无关；等报文到达目的端系统时，该端系统的传输层也是通过 socket 把报文传递给它上层的应用层里需要接收该报文的进程
    <img src="./images/01.png" width="600" style="display: block; margin: 5px 0 10px;" />
3. socket 也被称为应用程序和网络之间的 **应用程序编程接口**（Application Programming Interface, API），因为网络应用程序就是通过 socket 来编程使用网络功能的。

### 进程寻址（Addressing Processes）
1. 为了把一个主机中某个进程的包发送到另一个主机的某个进程，发送端进程即需要知道目的端主机的地址，也需要知道是该主机的哪个进程（严格来说，是哪个 socket）。
2. 主机地址是通过 IP 地址来表示，而 **端口号**（port number）是用来标识某个主机上的某个进程的 socket 的。也就是说发送端需要知道目的地的 IP 和端口号。


## References
* [Computer Networking](https://book.douban.com/subject/10573157/)