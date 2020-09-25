# Internationalization


<!-- TOC -->

- [Internationalization](#internationalization)
    - [Preface](#preface)
    - [章节顺序](#章节顺序)
    - [References](#references)

<!-- /TOC -->


## Preface
1. Often, a single URL may need to correspond to different resources. Take the case of a web site that wants to offer its content in multiple languages. If a site such as Joe’s Hardware has both French- and English-speaking users, it might want to offer its web site in both languages. 
2. However, if this is the case, when one of Joe’s customers requests “http://www.joes-hardware.com”, which version should the server send? French or English? Ideally, the server will send the English version to an English speaker and the French version to a French speaker—a user could go to Joe’s Hardware’s home page and get content in the language he speaks. 
3. Fortunately, HTTP provides content-negotiation methods that allow clients and servers to make just such determinations. Using these methods, a single URL can correspond to different resources (e.g., a French and English version of the same web page). These different versions are called **variants**. 
4. Servers also can make other types of decisions about what content is best to send to a client for a particular URL. In some cases, servers even can automatically generate customized pages—for instance, a server can convert an HTML page into a WML page for your handheld device. These kinds of dynamic content transformations are called **transcodings**. They are done in response to content negotiation between HTTP clients and servers. 


## 章节顺序
1. Content-Negotiation Techniques
2. Client-Driven Negotiation
3. Server-Driven Negotiation
4. Transparent Negotiation
5. Transcoding


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)