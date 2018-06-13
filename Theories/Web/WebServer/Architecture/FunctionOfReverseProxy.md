# Function of reverse proxy

Reverse Proxy 可以只代理一台服务器，也可以代理多台服务器。


## Increased security
No information about your backend servers is visible outside your internal
network, so malicious clients cannot access them directly to exploit any
vulnerabilities. Many reverse proxy servers include features that help protect
backend servers from [distributed denial-of-service](https://www.nginx.com/resources/glossary/what-is-distributed-denial-of-service/)
(DDoS) attacks, for example by rejecting traffic from particular client IP
addresses (blacklisting), or limiting the number of connections accepted from
each client.


## Load Balancer
### 分流给多个服务器
Load balancers are most commonly deployed when a site needs multiple servers
because the volume of requests is too much for a single server to handle
efficiently. Deploying multiple servers also eliminates a single point of
failure, making the website more reliable. Most commonly, the servers all host
the same content, and the load balancer’s job is to distribute the workload in a
 way that makes the best use of each server’s capacity, prevents overload on any
 server, and results in the fastest possible response to the client.

### Reduce the number of error responses
A load balancer can also enhance the user experience by reducing the number of
error responses the client sees. It does this by detecting when servers go down,
 and diverting requests away from them to the other servers in the group. In the
 simplest implementation, the load balancer detects server health by
intercepting error responses to regular requests. Application health checks are
a more flexible and sophisticated method in which the load balancer sends
separate health-check requests and requires a specified type of response to
consider the server healthy.

### Session persistence
Another useful function provided by some load balancers is session persistence,
which means sending all requests from a particular client to the same server.
Even though HTTP is stateless in theory, many applications must store state
information just to provide their core functionality – think of the shopping
basket on an e-commerce site. Such applications underperform or can even fail in
 a load-balanced environment, if the load balancer distributes requests in a
user session to different servers instead of directing them all to the server
that responded to the initial request.


## Increased scalability and flexibility
Because clients see only the reverse proxy’s IP address, you are free to change
the configuration of your backend infrastructure. This is particularly useful in
 a load-balanced environment, where you can scale the number of servers up and
down to match fluctuations in traffic volume.


## Web acceleration
Reducing the time it takes to generate a response and return it to the client.
Techniques for web acceleration include the following:

### Compression
Compressing server responses before returning them to the client (for instance,
with gzip) reduces the amount of bandwidth they require, which speeds their
transit over the network.

### SSL termination
Encrypting the traffic between clients and servers protects it as it crosses a
public network like the Internet. But decryption and encryption can be
computationally expensive. By decrypting incoming requests and encrypting server
 responses, the reverse proxy frees up resources on backend servers which they
can then devote to their main purpose, serving content.

### Caching
Before returning the backend server’s response to the client, the reverse proxy
stores a copy of it locally. When the client (or any client) makes the same
request, the reverse proxy can provide the response itself from the cache
instead of forwarding the request to the backend server. This both decreases
response time to the client and reduces the load on the backend server.


## References
* [WHAT IS A REVERSE PROXY VS. LOAD BALANCER?](https://www.nginx.com/resources/glossary/reverse-proxy-vs-load-balancer/)
