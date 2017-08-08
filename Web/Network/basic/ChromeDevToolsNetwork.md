# 通过 Chrome DevTools 的 Network 面板来理解资源加载


基本都在这篇文章里： [Network Analysis Reference](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference)。  
下面整理的是这篇文章里没有的



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
If you see lots of time spent in the Content Download phases, maybe：
* The connection between the client and server is slow.
* A lot of content is being downloaded.


## 其他
* Use the Resource Timing API to retrieve the raw data from JavaScript.  
    可以在Console中或者直接在JS脚本中执行如下的代码，寻找包含指定URL片段的资源的Timing数据
    ```
    performance.getEntriesByType('resource').filter(item => item.name.includes("style.css"))
    ```
    上面的代码会返回所有URL包含"style.css"的资源的Timing数据



## References
[Network Analysis Reference](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#timing-breakdown)
[Understanding Resource Timing](https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing)
