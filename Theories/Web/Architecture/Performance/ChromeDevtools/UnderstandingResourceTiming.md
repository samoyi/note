# Understanding Resource Timing

* All network requests are considered resources. As they are retrieved over the
network, resources have distinct lifecycles expressed in terms of resource
timing.
* The Network Panel uses the same [Resource Timing API](https://www.w3.org/TR/resource-timing/)
that is available to application developers.


## Resource Timing API
The Resource Timing API provides a rich level of detail about each individual
asset's time to be received. The primary phases of the request lifecycle are:

1. Redirect
    * Immediately begins `startTime`.
    * If a redirect is happening, `redirectStart` begins as well.
    * If a redirect is occurring at the end of this phase then `redirectEnd`
    will be taken.
2. App Cache
If it’s application cache fulfilling the request, a `fetchStart` time will be
taken.
3. DNS
    * `domainLookupStart` time is taken at the beginning of the DNS request.
    * `domainLookupEnd` time is taken at the end of the DNS request.
4. TCP
    * `connectStart` is taken when initially connecting to the server.
    * If TLS or SSL are in use then `secureConnectionStart` will start when the
    handshake begins for securing the connection.
    * `connectEnd` is taken when the connection to the server is complete.
5. Request
`requestStart` is taken once the request for a resource has been sent to the
server.
6. Response
    * `responseStart` is the time when the server initially responds to the request.
    * `responseEnd` is the time when the request ends and the data is retrieved.


## Viewing in DevTools
### Queuing
A request being queued indicates that:
* The request was postponed by the rendering engine because it's considered
lower priority than critical resources (such as scripts/styles). This often
happens with images.
* The request was put on hold to wait for an unavailable TCP socket that's about
 to free up.
* The request was put on hold because the browser only allows six TCP
connections per origin on HTTP 1.
* Time spent making disk cache entries (typically very quick.)

### Stalled/Blocking
* Time the request spent waiting before it could be sent. It can be waiting for
any of the reasons described for Queueing.
* Additionally, this time is inclusive of any time spent in proxy negotiation.
* 在测试时，服务器延迟回复的时间，按理说是属于 Waiting (TTFB)，但经常显示成 Stalled

### Proxy Negotiation
Time spent negotiating with a proxy server connection.

### DNS Lookup
Time spent performing the DNS lookup. Every new domain on a page requires a full
 roundtrip to do the DNS lookup.

### Initial Connection / Connecting
Time it took to establish a connection, including TCP handshakes/retries and
negotiating a SSL.

### SSL
Time spent completing a SSL handshake.

### Request Sent / Sending
Time spent issuing the network request. Typically a fraction of a millisecond.

### ServiceWorker Preparation
The browser is starting up the service worker.

### Request to ServiceWorker
The request is being sent to the service worker.

### Waiting (TTFB)
Time spent waiting for the initial response, also known as the Time To First
Byte. This time captures the latency of a round trip to the server in addition
to the time spent waiting for the server to deliver the response.

### Content Download / Downloading
Time spent receiving the response data.

### Receiving Push
The browser is receiving data for this response via HTTP/2 Server Push.

### Reading Push
The browser is reading the local data previously received.








## References
* [Understanding Resource Timing](https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing)
* [Network Analysis Reference](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference)
