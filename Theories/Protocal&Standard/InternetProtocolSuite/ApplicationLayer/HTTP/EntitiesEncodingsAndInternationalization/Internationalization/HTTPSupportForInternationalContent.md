# HTTP Support for International Content


<!-- TOC -->

- [HTTP Support for International Content](#http-support-for-international-content)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. HTTP messages can carry content in any language, just as it can carry images, movies, or any other kind of media. To HTTP, the entity body is just a box of bits. 
2. To support international content, servers need to tell clients about the alphabet and languages of each document, so the client can properly unpack the document bits into characters and properly process and present the content to the user.
3. Servers tell clients about a document’s alphabet and language with the HTTP `Content-Type` charset parameter and `Content-Language` headers. These headers describe what’s in the entity body’s “box of bits”, how to convert the contents into the proper characters that can be displayed onscreen, and what spoken language the words represent. 
4. At the same time, the client needs to tell the server which languages the user understands and which alphabetic coding algorithms the browser has installed. The client sends `Accept-Charset` and `Accept-Language` headers to tell the server which character set encoding algorithms and languages the client understands, and which of them are preferred.
5. The following HTTP Accept headers might be sent by a French speaker who prefers his native language (but speaks some English in a pinch) and who uses a browser that supports the iso-8859-1 West European charset encoding and the UTF-8 Unicode charset encoding:
    ```
    Accept-Language: fr, en;q=0.8
    Accept-Charset: iso-8859-1, utf-8
    ```
    The parameter `q=0.8` is a quality factor, giving lower priority to English (0.8) than to French (1.0 by default).


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)