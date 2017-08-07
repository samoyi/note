# 通过 Chrome 的 Resource Timing 理解资源加载流程

To view the full timing information for a given entry of the Network Panel you have three options.
* Hover the timing graph under the timeline column. This will present a popup that shows the full timing data.
* Click on any entry and open the Timing tab of that entry.
* Use the Resource Timing API to retrieve the raw data from JavaScript.  
    可以在Console中或者直接在JS脚本中执行如下的代码，寻找包含指定URL片段的资源的Timing数据
    ```
    performance.getEntriesByType('resource').filter(item => item.name.includes("style.css"))
    ```
    上面的代码会返回所有URL包含"style.css"的资源的Timing数据


## 各参数的意义
### Queueing
A request being queued indicates that:
* The request was postponed by the rendering engine because it's considered lower priority than critical resources (such as scripts/styles). This often happens with images.
* The request was put on hold to wait for an unavailable TCP socket that's about to free up. <mark>不懂什么意思，和下面这一项有些像</mark>
* There are already six TCP connections open for this origin, which is the limit. Applies to HTTP/1.0 and HTTP/1.1 only.
* The browser is briefly allocating space in the disk cache

### Stalled/Blocking
* Time the request spent waiting before it could be sent.
* It can be waiting for any of the reasons described for Queueing.
* Additionally, this time is inclusive of any time spent in proxy negotiation.

### Proxy Negotiation
* Time spent negotiating with a proxy server connection.

### DNS Lookup
Time spent performing the DNS lookup. Every new domain on a page requires a full roundtrip to do the DNS lookup

### Initial Connection / Connecting
Time it took to establish a connection, including TCP handshakes/retries and negotiating a SSL.

### SSL
Time spent completing a SSL handshake.

### Request Sent / Sending
Time spent issuing the network request. Typically a fraction of a millisecond.

### Waiting (TTFB)
Time spent waiting for the initial response, also known as the Time To First Byte. This time captures the latency of a round trip to the server in addition to the time spent waiting for the server to deliver the response.

### Content Download / Downloading
Time spent receiving the response data.



## Diagnosing Network Issues
### Queued or Stalled series
1. The most common issue seen is a series of items that are queued or stalled.
2. This indicates that too many resources are being retrieved from a single domain.
3. On HTTP 1.0/1.1 connections, Chrome enforces a maximum of six TCP connections per host.
4. If you are requesting twelve items at once, the first six will begin and the last half will be queued. Once one of the original half is finished, the first item in the queue will begin its request process.
5. To fix this problem for traditional HTTP 1 traffic, you would need to implement domain sharding.
6. The fix for HTTP 1 connections does not apply to HTTP 2 connections. In fact, it hurts them.
7. If you have HTTP 2 deployed, don’t domain-shard your resources as it works against how HTTP 2 is engineered to operate.
8. In HTTP 2, there is a single TCP connection to the server that acts as a multiplexed connection. This gets rid of the six connection limit of HTTP 1 and multiple resources can be transferred over the single connection simultaneously.

### Slow Time to First Byte
A slow time to first byte (TTFB) is recognized by a high waiting time. It is recommended that you have this under 200ms. A high TTFB reveals one of two primary issues. Either:
* A slowly responding server application
    1. To address a high TTFB, first cut out as much network as possible. Ideally, host the application locally and see if there is still a big TTFB.
    2. If there is, then the application needs to be optimized for response speed. This could mean optimizing database queries, implementing a cache for certain portions of content, or modifying your web server configuration.
    3. There are many reasons a backend can be slow. You will need to do research into your software and figure out what is not meeting your performance budget.
* Bad network conditions between client and server
    1. If the TTFB is low locally then the networks between your client and the server are the problem. The network traversal could be hindered by any number of things. There are a lot of points between clients and servers and each one has its own connection limitations and could cause a problem.
    2. The simplest method to test reducing this is to put your application on another host and see if the TTFB improves.

### Hitting throughput capacity
If you see lots of time spent in the Content Download phases, then improving server response or concatenating won't help. The primary solution is to send fewer bytes.


## References
[Network Analysis Reference](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#timing-breakdown)
[Understanding Resource Timing](https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing)
