# Web Sockets

1. The goal of Web Sockets is to provide full-duplex, bidirectional
communication with the server over a single, long-lasting connection.
2. When a Web Socket is created in JavaScript, an HTTP request is sent to the
server to initiate a connection. When the server responds, the connection uses
HTTP upgrade to switch from HTTP to the Web Socket protocol.
3. Since Web Sockets uses a custom protocol, the URL scheme is slightly
different. Instead of using the `http://` or `https://` schemes, there are
`ws://` for an unsecured connection and `wss://` for a secured connection. When
specifying a Web Socket URL, you must include the scheme since other schemes may
 be supported in the future.  
4. 使用自定义协议而非HTTP协议的好处是，能够在客户端和服务器之间发送非常少量的数据，而不必担心HTTP那样字节级的开销。由于传递的数据包很小，因此Web Sockets非常适合移动应用。

==不懂怎么建立支持的服务器==
<mark>Marked text</mark>
