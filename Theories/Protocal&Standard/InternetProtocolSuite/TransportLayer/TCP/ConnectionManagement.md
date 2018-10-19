# Connection Management
In this subsection we take a closer look at how a TCP connection is established
and torn down.


## Three-way handshake
1. Suppose a process running in one host(client) wants to initiate a connection
with another process in another host(server).
2. The client application process first informs the client TCP that it wants to
establish a connection to a process in the server.
3. The TCP in the client then proceeds to establish a TCP connection with the
TCP in the server in the following manner:

### Step 1
1. The client-side TCP first sends a special TCP segment to the server-side TCP.
This special segment contains no application-layer data. But one of the flag
bits in the segment's header, the SYN bit, is set to `1`. For this reason, this
specail segment is referred to as a SYN segment.
2. In addition, the client randomly chooses an initail sequence number
(`client_isn`) and puts this number in the sequence number field of the initial
TCP SYN segment.
3. This segment is encapsulated within an IP datagram and sent to the server.
4. There has been considerable interest in properly randomizing the choice of
the `client_isn` in order to avoid security attacks.

### Step 2
1. Once the IP datagran containing the TCP SYN segment arrives at the server
host (assuming it does arrive!), the server extracts the TCP SYN segment from
the datagram, allocates the TCP buffers and variables to the connection, and
sends a connection-granted segment to the client TCP.
2. This connection-granted segment also contains no application-layer data.
However, it does contain three important pieces of information in the segment
header.
3. First, the SYN bit is set to `1`. Second, the acknowledgment field of the TCP
segment header is set to `client_isn + 1`. Finally, the server chooses its own
initial sequence number (`server_isn`) and puts this value in the sequence
number field of the TCP segment header.
4. This connection-granted segment is saying, in effect, "I received your SYN
packet to start a connection with your initial sequence number, `client_isn`. I
agree to establish this connection. My own initial sequence number is
`server_isn`."
5. The connection-granted segment is referred to as a SYNACK segment.

### Step 3
1. Upon receiving the SYNACK segment, the client also allocates buffers and
variables to the connection.
2. The client host then sends the server yet another segment; this last segment
acknowledges the server's connection-granted segment. The client does so by
putting the value `server_isn + 1` in the acknowledgment field of the TCP
segment header.
3. The SYN bit is set to `zero`, since the connection is established.
4. This third stage of the three-way handshake may carry client-to-server data
in the segment payload.

### Step 3 的必要性
考虑不进行 step 3 的情况：
1. 在不出错的情况下，只需要前两步，就可以确认链接，接下来就可以发送实际的数据。
2. 但如果在 step 2 中，客户端没有收到服务器的回复，而服务器却不知道，它就会一直等待客户
端发送数据，从而浪费了资源。（《计算机网络（第7版）》并没有说这种错误，但感觉这种情况也
会存在吧）
3. 另一种错误情况：客户端第一次发送请求时，出现了很长的延迟。客户端认为该请求发送失败，
重新发送了一次，这次成功建立了链接，传递了数据之后释放了链接。直到这时，第一次延迟的请求
终于姗姗来迟，服务器却认为这是一次新的请求，于是又建立了链接，然后等待数据传输。


## References
* [计算机网络：自顶向下方法（第5版 影印版）](https://book.douban.com/subject/26910203/)
* [计算机网络（第7版）](https://book.douban.com/subject/26960678/)
