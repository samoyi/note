# Web Sockets

1. Web Sockets的目标是在一个单独的持久连接上提供全双工、双向通信。  

2. 在JavaScript中创建了Web Socket之后，会有一个HTTP请求发送到浏览器以发起连接。在取得服务器响应后，建立的连接会使用HTTP升级从HTTP协议交换为Web Socket协议。也就是说，使用标准的HTTP服务器无法实现Web Sockets，只有支持这种协议的专门服务器才能正常工作。  

3. 由于Web Sockets使用了自定义的协议，所以URL模式也略有不同。未加密的连接不再是http://，而是ws://；加密的连接也不是https://，而是wss://。在使用Web Socket URL时，必须带着这个模式，因为将来还有可能支持其他模式。  
4. 使用自定义协议而非HTTP协议的好处是，能够在客户端和服务器之间发送非常少量的数据，而不必担心HTTP那样字节级的开销。由于传递的数据包很小，因此Web Sockets非常适合移动应用。

==不懂怎么建立支持的服务器==
<mark>Marked text</mark>
