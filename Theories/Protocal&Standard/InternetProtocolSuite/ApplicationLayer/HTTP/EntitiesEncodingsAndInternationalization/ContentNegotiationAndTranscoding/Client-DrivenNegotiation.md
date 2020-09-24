# Client-Driven Negotiation


<!-- TOC -->

- [Client-Driven Negotiation](#client-driven-negotiation)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [实现](#实现)
    - [缺点](#缺点)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary


## 实现
1. The easiest thing for a server to do when it receives a client request is to send back a response listing the available pages and let the client decide which one it wants to see. 
2. This, of course, is the easiest to implement at the server and is likely to result in the best copy being selected (provided that the list has enough information to allow the client to pick the right copy). 
3. The disadvantage is that two requests are needed for each page—one to get the list and a second to get the selected copy. This is a slow and tedious process, and it’s likely to become annoying to the client. 
4. Mechanically, there are actually two ways for servers to present the choices to the client for selection: by sending back an HTML document with links to the different versions of the page and descriptions of each of the versions, or by sending back an HTTP/1.1 response with the `300 Multiple Choices` response code.
5. The client browser may receive this response and display a page with the links, as in the first method, or it may pop up a dialog window asking the user to make a selection. 


## 缺点
1. In any case, the decision is made manually at the client side by the browser user.
2. In addition to the increased latency and annoyance of multiple requests per page, this method has another drawback: it requires multiple URLs—one for the main page and one for each specific page. 
3. So, if the original request was for `www.joeshardware.com`, Joe’s server may respond with a page that has links to `www.joeshardware.com/english` and `www.joes-hardware.com/french`. 
4. Should clients now bookmark the original main page or the selected ones? Should they tell their friends about the great web site at `www.joes-hardware.com` or tell only their English-speaking friends about the web site at `www.joes-hardware.com/english`?


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)