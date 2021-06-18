# Overview

The world’s web browsers, servers, and related web applications all talk to each other through HTTP, the Hypertext Transfer Protocol. HTTP is the common language of the modern global Internet.


<!-- TOC -->

- [Overview](#overview)
    - [设计思想](#%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3)
    - [抽象本质](#%E6%8A%BD%E8%B1%A1%E6%9C%AC%E8%B4%A8)
    - [HTTP: The Internet’s Multimedia Courier](#http-the-internets-multimedia-courier)
    - [Web Clients and Servers](#web-clients-and-servers)
    - [Resources](#resources)
        - [资源的概念](#%E8%B5%84%E6%BA%90%E7%9A%84%E6%A6%82%E5%BF%B5)
        - [Media Types](#media-types)
        - [URIs](#uris)
            - [URLs](#urls)
            - [URNs](#urns)
    - [Transactions（事务）](#transactions%E4%BA%8B%E5%8A%A1)
        - [Messages（报文）](#messages%E6%8A%A5%E6%96%87)
        - [Methods](#methods)
        - [Status Codes](#status-codes)
        - [Web Pages Can Consist of Multiple Objects](#web-pages-can-consist-of-multiple-objects)
    - [Messages（报文）](#messages%E6%8A%A5%E6%96%87)
        - [报文结构](#%E6%8A%A5%E6%96%87%E7%BB%93%E6%9E%84)
        - [Simple Message Example](#simple-message-example)
    - [Connections](#connections)
        - [TCP/IP](#tcpip)
        - [Connections, IP Addresses, and Port Numbers](#connections-ip-addresses-and-port-numbers)
        - [A Real Example Using Telnet](#a-real-example-using-telnet)
            - [关于 Telnet](#%E5%85%B3%E4%BA%8E-telnet)
            - [An HTTP transaction using telnet](#an-http-transaction-using-telnet)
    - [Architectural Components of the Web](#architectural-components-of-the-web)
        - [Proxies](#proxies)
        - [Caches](#caches)
        - [Gateways](#gateways)
        - [Tunnels](#tunnels)
        - [Agents](#agents)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质



## HTTP: The Internet’s Multimedia Courier
1. Billions of JPEG images, HTML pages, text files, MPEG movies, WAV audio files, Java applets, and more cruise through the Internet each and every day. 
2. HTTP moves the bulk of this information quickly, conveniently, and reliably from web servers all around the world to web browsers on people’s desktops.
3. Because HTTP uses reliable data-transmission protocols, it guarantees that your data will not be damaged or scrambled in transit, even when it comes from the other side of the globe. 
4. This is good for you as a user, because you can access information without worrying about its integrity. Reliable transmission is also good for you as an Internet application developer, because you don’t have to worry about HTTP communications being destroyed, duplicated, or distorted in transit. You can focus on programming the distinguishing details of your application, without worrying about the flaws and foibles of the Internet.


## Web Clients and Servers
1. Web content lives on web servers. Web servers speak the HTTP protocol, so they are often called HTTP servers. 
2. These HTTP servers store the Internet’s data and provide the data when it is requested by HTTP clients. 
3. The clients send HTTP requests to servers, and servers return the requested data in HTTP responses. 
4. Together, HTTP clients and HTTP servers make up the basic components of the World Wide Web.
5. You probably use HTTP clients every day. The most common client is a web browser. 
6. Web browsers request HTTP objects from servers and display the objects on your screen.
7. When you browse to a page, such as “http://www.oreilly.com/index.html”, your browser sends an HTTP request to the server www.oreilly.com. 
8. The server tries to find the desired object (in this case, “/index.html”) and, if successful, sends the object to the client in an HTTP response, along with the type of the object, the length of the object, and other information.


## Resources
### 资源的概念
1. Web servers host web resources. A web resource is the source of web content. 
2. The simplest kind of web resource is a static file on the web server’s filesystem. These files can contain anything: they might be text files, HTML files, Microsoft Word files, Adobe Acrobat files, JPEG image files, AVI movie files, or any other format you can think of.
3. However, resources don’t have to be static files. Resources can also be software programs that generate content on demand. 
4. These dynamic content resources can generate content based on your identity, on what information you’ve requested, or on the time of day. They can show you a live image from a camera, or let you trade stocks, search real estate databases, or buy gifts from online stores.
    <img src="./images/01.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. In summary, a resource is any kind of content source. A file containing your company’s sales forecast spreadsheet is a resource. A web gateway to scan your local public library’s shelves is a resource. An Internet search engine is a resource.

### Media Types
1. Because the Internet hosts many thousands of different data types, HTTP carefully tags each object being transported through the Web with a data format label called a MIME type. 
2. MIME (Multipurpose Internet Mail Extensions) was originally designed to solve problems encountered in moving messages between different electronic mail systems. 
3. MIME worked so well for email that HTTP adopted it to describe and label its own multimedia content.
4. Web servers attach a MIME type to all HTTP object data. When a web browser gets an object back from a server, it looks at the associated MIME type to see if it knows how to handle the object. 
5. Most browsers can handle hundreds of popular object types: displaying image files, parsing and formatting HTML files,
playing audio files through the computer’s speakers, or launching external plug-in software to handle special formats.
6. A MIME type is a textual label, represented as a primary object type and a specific subtype, separated by a slash. For example:
    * An HTML-formatted text document would be labeled with type `text/html`.
    * A plain ASCII text document would be labeled with type `text/plain`.
    * A JPEG version of an image would be `image/jpeg`.
    * A GIF-format image would be `image/gif`.
    * An Apple QuickTime movie would be `video/quicktime`.
    * A Microsoft PowerPoint presentation would be `application/vnd.ms-powerpoint`.
7. There are hundreds of popular MIME types, and many more experimental or limited-use types.

### URIs
1. Each web server resource has a name, so clients can point out what resources they are interested in. 
2. The server resource name is called a **uniform resource identifier**, or URI. 
3. URIs are like the postal addresses of the Internet, uniquely identifying and locating information resources around the world.
4. Here’s a URI for an image resource on Joe’s Hardware store’s web server:
    ```
    http://www.joes-hardware.com/specials/saw-blade.gif
    ```
5. Figure below shows how the URI specifies the HTTP protocol to access the saw-blade GIF resource on Joe’s store’s server. Given the URI, HTTP can retrieve the object.
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
6. URIs come in two flavors, called URLs and URNs. Let’s take a peek at each of these types of resource identifiers now.

#### URLs
1. The **uniform resource locator** (URL) is the most common form of resource identifier.
2. URLs describe the specific location of a resource on a particular server. They tell you exactly how to fetch a resource from a precise, fixed location. 
3. Most URLs follow a standardized format of three main parts:
    * The first part of the URL is called the **scheme**, and it describes the protocol used to access the resource.
    * The second part gives the server Internet address (e.g., www.joes-hardware.com).
    * The rest names a resource on the web server (e.g., /specials/saw-blade.gif ).
4. Today, almost every URI is a URL.

#### URNs
1. The second flavor of URI is the **uniform resource name**, or URN. 
2. A URN serves as a unique name for a particular piece of content, independent of where the resource currently resides. 
3. These location-independent URNs allow resources to move from place to place. 
4. URNs also allow resources to be accessed by multiple network access protocols while maintaining the same name.
4. For example, the following URN might be used to name the Internet standards document “RFC 2141” regardless of where it resides (it may even be copied in several places):
    ```
    urn:ietf:rfc:2141
    ```
5. URNs are still experimental and not yet widely adopted. To work effectively, URNs need a supporting infrastructure to resolve resource locations; the lack of such an infrastructure has also slowed their adoption. But URNs do hold some exciting promise for the future. 


## Transactions（事务）
### Messages（报文）
1. Let’s look in more detail how clients use HTTP to transact with web servers and their resources. 
2. An HTTP transaction consists of a request command (sent from client to server), and a response result (sent from the server back to the client). 
3. This communication happens with formatted blocks of data called **HTTP messages**, as illustrated below
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px 0;" />

### Methods
1. HTTP supports several different request commands, called **HTTP methods**. 
2. Every HTTP request message has a method. The method tells the server what action to perform (fetch a web page, run a gateway program, delete a file, etc.). 

### Status Codes
1. Every HTTP response message comes back with a status code. 
2. The status code is a three-digit numeric code that tells the client if the request succeeded, or if other actions are required. 
3. HTTP also sends an explanatory textual “reason phrase” with each numeric status code. 
4. The textual phrase is included only for descriptive purposes; the numeric code is used for all processing. The following status codes and reason phrases are treated identically by HTTP software:
    ```
    200 OK
    200 Document attached
    200 Success
    200 All’s cool, dude
    ```

### Web Pages Can Consist of Multiple Objects
1. An application often issues multiple HTTP transactions to accomplish a task. 
2. For example, a web browser issues a cascade of HTTP transactions to fetch and display a graphics-rich web page. The browser performs one transaction to fetch the HTML “skeleton” that describes the page layout, then issues additional HTTP transactions for each embedded image, graphics pane, Java applet, etc. These embedded resources might even reside on different servers.
    <img src="./images/04.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
3. Thus, a “web page” often is a collection of resources, not a single resource.


## Messages（报文）
### 报文结构
1. Now let’s take a quick look at the structure of HTTP request and response messages.
2. HTTP messages are simple, line-oriented sequences of characters. Because they are plain text, not binary, they are easy for humans to read and write.
3. HTTP messages sent from web clients to web servers are called **request messages**. Messages from servers to clients are called **response messages**. There are no other kinds of HTTP messages. 
4. The formats of HTTP request and response messages are very similar
    <img src="./images/05.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. HTTP messages consist of three parts:
    * **Start line**: The first line of the message is the start line, indicating what to do for a request or what happened for a response.
    * **Header fields**: Zero or more header fields follow the start line. Each header field consists of a name and a value, separated by a colon (`:`) for easy parsing. The headers end with a blank line. Adding a header field is as easy as adding another line.
    * **Body**: After the blank line is an optional message body containing any kind of data. Request bodies carry data to the web server; response bodies carry data back to the client. Unlike the start lines and headers, which are textual and structured, the body can contain arbitrary binary data (e.g., images, videos, audio tracks, software applications). Of course, the body can also contain text.

### Simple Message Example
1. Figure below shows the HTTP messages that might be sent as part of a simple transaction. The browser requests the resource `http://www.joes-hardware.com/tools.html`
    <img src="./images/06.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
2. The browser sends an HTTP request message. The request has a GET method in the start line, and the local resource is `/tools.html`. The request indicates it is speaking Version 1.0 of the HTTP protocol. The request message has no body,
because no request data is needed to GET a simple document from a server.
3. The server sends back an HTTP response message. The response contains the HTTP version number (HTTP/1.0), a success status code (200), a descriptive reason phrase (OK), and a block of response header fields, all followed by the response body containing the requested document. The response body length is noted in the `Content-Length` header, and the document’s MIME type is noted in the `Content-Type` header.


## Connections
Now that we’ve sketched what HTTP’s messages look like, let’s talk for a moment about how messages move from place to place, across Transmission Control Protocol(TCP) connections.

### TCP/IP
1. HTTP is an application layer protocol. HTTP doesn’t worry about the nitty-gritty details of network communication; instead, it leaves the details of networking to TCP/IP, the popular reliable Internet transport protocol.
2. TCP provides:
    * Error-free data transportation
    * In-order delivery (data will always arrive in the order in which it was sent)
    * Unsegmented data stream (can dribble out data in any size at any time)
3. The Internet itself is based on TCP/IP, a popular layered set of packet-switched network protocols spoken by computers and network devices around the world. 
4. TCP/IP hides the peculiarities and foibles of individual networks and hardware, letting computers and networks of any type talk together reliably.
5. Once a TCP connection is established, messages exchanged between the client and server computers will never be lost, damaged, or received out of order.
6. In networking terms, the HTTP protocol is layered over TCP. HTTP uses TCP to transport its message data. Likewise, TCP is layered over IP.

### Connections, IP Addresses, and Port Numbers
1. Before an HTTP client can send a message to a server, it needs to establish a TCP/IP connection between the client and server using Internet protocol (IP) addresses and port numbers.
2. Setting up a TCP connection is sort of like calling someone at a corporate office. First, you dial the company’s phone number. This gets you to the right organization. Then, you dial the specific extension of the person you’re trying to reach.
3. In TCP, you need the IP address of the server computer and the TCP port number associated with the specific software program running on the server.
4. This is all well and good, but how do you get the IP address and port number of the HTTP server in the first place? Why, the URL, of course! We mentioned before that URLs are the addresses for resources, so naturally enough they can provide us with the IP address for the machine that has the resource. 
5. Let’s take a look at a few URLs:
    * `http://207.200.83.29:80/index.html`
    * `http://www.netscape.com:80/index.html`
    * `http://www.netscape.com/index.html`
6. The first URL has the machine’s IP address, “207.200.83.29”, and port number, “80”. 
7. The second URL doesn’t have a numeric IP address; it has a textual domain name, or `hostname` (“www.netscape.com”). The hostname is just a human-friendly alias for an IP address. Hostnames can easily be converted into IP addresses through a facility called the Domain Name Service (DNS), so we’re all set here, too. 
8. The final URL has no port number. When the port number is missing from an HTTP URL, you can assume the default value of port 80.
9. With the IP address and port number, a client can easily communicate via TCP/IP. Figure below shows how a browser uses HTTP to display a simple HTML resource that resides on a distant server.
    <img src="./images/07.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
10. Here are the steps:
    1. (a) The browser extracts the server’s hostname from the URL.
    2. (b) The browser converts the server’s hostname into the server’s IP address.
    3. (c) The browser extracts the port number (if any) from the URL.
    4. (d) The browser establishes a TCP connection with the web server.
    5. (e) The browser sends an HTTP request message to the server.
    6. (f) The server sends an HTTP response back to the browser.
    7. (g) The connection is closed, and the browser displays the document

### A Real Example Using Telnet
#### 关于 Telnet
1. Because HTTP uses TCP/IP, and is text-based, as opposed to using some obscure binary format, it is simple to talk directly to a web server.
2. The Telnet utility connects your keyboard to a destination TCP port and connects the TCP port output back to your display screen. 
3. Telnet is commonly used for remote terminal sessions, but it can generally connect to any TCP server, including
HTTP servers.
4. You can use the Telnet utility to talk directly to web servers. Telnet lets you open a TCP connection to a port on a machine and type characters directly into the port.
5. The web server treats you as a web client, and any data sent back on the TCP connection is displayed onscreen.

#### An HTTP transaction using telnet
1. Let’s use Telnet to interact with a real web server. We will use Telnet to fetch the document pointed to by the URL `http://www.joes-hardware.com:80/tools.html`.
2. Let’s review what should happen:
    1. First, we need to look up the IP address of `www.joes-hardware.com` and open a TCP connection to port 80 on that machine. Telnet does this legwork for us.
    2. Once the TCP connection is open, we need to type in the HTTP request.
    3. When the request is complete (indicated by a blank line), the server should send back the content in an HTTP response and close the connection.
3. Our example HTTP request for `http://www.joes-hardware.com:80/tools.html` is shown below. What we typed is shown in boldface，不过这种情况下不知道怎么加粗，就还是用 markdown 的 `**` 语法括起来了
    ```
    **% telnet www.joes-hardware.com 80**
    Trying 161.58.228.45...
    Connected to joes-hardware.com.
    Escape character is '^]'.
    **GET /tools.html HTTP/1.1**
    **Host: www.joes-hardware.com**

    HTTP/1.1 200 OK
    Date: Sun, 01 Oct 2000 23:25:17 GMT
    Server: Apache/1.3.11 BSafe-SSL/1.38 (Unix) FrontPage/4.0.4.3
    Last-Modified: Tue, 04 Jul 2000 09:46:21 GMT
    ETag: "373979-193-3961b26d"
    Accept-Ranges: bytes
    Content-Length: 403
    Connection: close
    Content-Type: text/html

    <HTML>
    <HEAD><TITLE>Joe's Tools</TITLE></HEAD>
    <BODY>
    <H1>Tools Page</H1>
    <H2>Hammers</H2>
    <P>Joe's Hardware Online has the largest selection of hammers on the earth.</P>
    <H2><A NAME=drills></A>Drills</H2>
    <P>Joe's Hardware has a complete line of cordless and corded drills, as well as the latest
    in plutonium-powered atomic drills, for those big around the house jobs.</P> ...
    </BODY>
    </HTML>
    Connection closed by foreign host.
    ```
4. Telnet looks up the hostname and opens a connection to the `www.joes-hardware.com` web server, which is listening on port 80. The three lines after the command are output from Telnet, telling us it has established a connection.
5. We then type in our basic request command, `GET /tools.html HTTP/1.1`, and send a Host header providing the original hostname, followed by a blank line, asking the server to GET us the resource `/tools.html` from the server `www.joes-hardware.com`. After that, the server responds with a response line, several response headers, a blank
line, and finally the body of the HTML document.
6. Beware that Telnet mimics HTTP clients well but doesn’t work well as a server. And automated Telnet scripting is no fun at all. For a more flexible tool, you might want to check out nc (netcat). The nc tool lets you easily manipulate and script UDP- and TCP-based traffic, including HTTP. 


## Architectural Components of the Web
1. In this overview chapter, we’ve focused on how two web applications (web browsers and web servers) send messages back and forth to implement basic transactions.
2. There are many other web applications that you interact with on the Internet. In this section, we’ll outline several other important applications, including:
    * Proxies：HTTP intermediaries that sit between clients and servers
    * Caches: HTTP storehouses that keep copies of popular web pages close to clients
    * Gateways: Special web servers that connect to other applications
    * Tunnels: Special proxies that blindly forward HTTP communications
    * Agents: Semi-intelligent web clients that make automated HTTP requests

### Proxies
1. Let’s start by looking at HTTP proxy servers, important building blocks for web security, application integration, and performance optimization.
2. A proxy sits between a client and a server, receiving all of the client’s HTTP requests and relaying the requests to the server (perhaps after modifying the requests). 
3. These applications act as a proxy for the user, accessing the server on the user’s behalf.
4. Proxies are often used for security, acting as trusted intermediaries through which all web traffic flows. Proxies can also filter requests and responses; for example, to detect application viruses in corporate downloads or to filter adult content away from elementary-school students. 

### Caches
1. A web cache or caching proxy is a special type of HTTP proxy server that keeps copies of popular documents that pass through the proxy. 
2. The next client requesting the same document can be served from the cache’s personal copy.
3. A client may be able to download a document much more quickly from a nearby cache than from a distant web server. 
4. HTTP defines many facilities to make caching more effective and to regulate the freshness and privacy of cached content.

### Gateways
1. Gateways are special servers that act as intermediaries for other servers. They are often used to convert HTTP traffic to another protocol.
2. A gateway always receives requests as if it was the origin server for the resource. The client may not be aware it
is communicating with a gateway.
3. For example, an HTTP/FTP gateway receives requests for FTP URIs via HTTP requests but fetches the documents using the FTP protocol . The resulting document is packed into an HTTP message and sent to the client. 

### Tunnels
1. Tunnels are HTTP applications that, after setup, blindly relay raw data between two connections. 
2. HTTP tunnels are often used to transport non-HTTP data over one or more HTTP connections, without looking at the data.
3. One popular use of HTTP tunnels is to carry encrypted Secure Sockets Layer (SSL) traffic through an HTTP connection, allowing SSL traffic through corporate firewalls that permit only web traffic. 
3. As sketched in figure below, an HTTP/SSL tunnel receives an HTTP request to establish an outgoing connection to a destination address and port, then proceeds to tunnel the encrypted SSL traffic over the HTTP channel so that it can be blindly relayed to the destination server
    <img src="./images/08.png" width="600" style="display: block; margin: 5px 0 10px 0;" />

### Agents
1. User agents (or just agents) are client programs that make HTTP requests on the user’s behalf. 
2. Any application that issues web requests is an HTTP agent. So far, we’ve talked about only one kind of HTTP agent: web browsers. But there are many other kinds of user agents.
3. For example, there are machine-automated user agents that autonomously wander the Web, issuing HTTP transactions and fetching content, without human supervision. 
4. These automated agents often have colorful names, such as “spiders” or “web robots”. Spiders wander the Web to build useful archives of web content, such as a search engine’s database or a product catalog for a comparison-shopping robot. 


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)