# Overview of Redirection Protocols


<!-- TOC -->

- [Overview of Redirection Protocols](#overview-of-redirection-protocols)
    - [Summary](#summary)
    - [General redirection methods](#general-redirection-methods)
    - [Proxy and cache redirection techniques](#proxy-and-cache-redirection-techniques)
    - [References](#references)

<!-- /TOC -->


## Summary
1. The goal of redirection is to send HTTP messages to available web servers as quickly as possible. The direction that an HTTP message takes on its way through the Internet is affected by the HTTP applications and routing devices it passes from, through, and toward.
2. For example: 
    * The browser application that creates the client’s message could be configured to send it to a proxy server. 
    * DNS resolvers choose the IP address that is used for addressing the message. This IP address can be different for different clients in different geographical locations. 
    * As the message passes through networks, it is divided into addressed packets; switches and routers examine the TCP/IP addressing on the packets and make decisions about routing the packets on that basis. 
    * Web servers can bounce requests back to different web servers with HTTP redirects.
3. Browser configuration, DNS, TCP/IP routing, and HTTP all provide mechanisms for redirecting messages. Notice that some methods, such as browser configuration, make sense only for redirecting traffic to proxies, while others, such as DNS redirection, can be used to send traffic to any server.


## General redirection methods
<table>
    <thead>
        <tr>
            <th>Mechanism</th>
            <th>How it works</th>
            <th>Basis for rerouting</th>
            <th>Limitations</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>HTTP redirection</td>
            <td>Initial HTTP request goes to a first web server that chooses a “best” web server to serve the content. The first web
server sends the client an HTTP redirect to the chosen server. The client resends the request to the chosen server.</td>
            <td>Many options, from round-robin load balancing, to minimizing latency, to choosing the shortest path.</td>
            <td>Can be slow—every transaction involves the extra redirect step. Also, the first server must be able to handle the request load.</td>
        </tr>
        <tr>
            <td>DNS redirection</td>
            <td>DNS server decides which IP address, among several, to return for the hostname in the URL.</td>
            <td>Many options, from round-robin load balancing, to minimizing latency, to choosing the shortest path.</td>
            <td>Need to configure DNS server.</td>
        </tr>
        <tr>
            <td>Anycast addressing</td>
            <td>Several servers use the same IP address. Each server masquerades as a backbone router. The other routers send packets
addressed to the shared IP to the nearest server (believing they are sending packets to the nearest router).</td>
            <td>Routers use built-in shortest-path routing capabilities.</td>
            <td>Need to own/configure routers. Risks address conflicts. Established TCP connections can break if routing changes and packets associated with a connection get sent to different servers.</td>
        </tr>
        <tr>
            <td>IP MAC forwarding</td>
            <td>A network element such as a switch or router reads a packet’s destination address; if the packet should be redirected, the switch gives the packet the destination MAC address of a server or
proxy.</td>
            <td>Save bandwidth and improve QOS. Load balance.</td>
            <td>Server or proxy must be one hop away.</td>
        </tr>
        <tr>
            <td>IP address forwarding</td>
            <td>Layer-4 switch evaluates a packet’s destination port and changes the IP address of a redirect packet to that of a proxy or mirrored server.</td>
            <td>Save bandwidth and improve QOS. Load balance.</td>
            <td>IP address of the client can be lost to the server/proxy.</td>
        </tr>
    </tbody>
</table>


## Proxy and cache redirection techniques


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)