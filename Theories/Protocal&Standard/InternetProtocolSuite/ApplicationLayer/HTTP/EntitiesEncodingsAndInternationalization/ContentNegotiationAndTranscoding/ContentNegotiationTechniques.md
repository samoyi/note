# Content-Negotiation Techniques


<!-- TOC -->

- [Content-Negotiation Techniques](#content-negotiation-techniques)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. There are three distinct methods for deciding which page at a server is the right one for a client: present the choice to the client, decide automatically at the server, or ask an intermediary to select. 
2. These three techniques are called client-driven negotiation, server-driven negotiation, and transparent negotiation, respectively
    Technique | How it works | Advantages | Drawbacks
    --|--|--|--
    Client-driven | Client makes a request, server sends list of choices to client, client chooses. | Easiest to implement at server side. Client can make best choice. | Adds latency: at least two requests are needed to get the correct content.
    Server-driven | Server examines client’s request headers and decides what version to serve. | Quicker than client-driven negotiation. HTTP provides a q-value mechanism to allow servers to make approximate matches and a `Vary` header for servers to tell downstream devices how to evaluate requests. | If the decision is not obvious (headers don’t match up), the server must guess.
    Transparent | An intermediate device (usually a proxy cache) does the request negotiation on the client’s behalf. |  Offloads the negotiation from the web server. Quicker than client-driven negotiation. | No formal specifications for how to do transparent negotiation.
3. In this chapter, we will look at the mechanics of each technique as well as their advantages and disadvantages.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)