# Entities and Encodings


<!-- TOC -->

- [Entities and Encodings](#entities-and-encodings)
    - [Preface](#preface)
    - [章节顺序](#章节顺序)
    - [References](#references)

<!-- /TOC -->


## Preface
1. HTTP ships billions of media objects of all kinds every day. Images, text, movies, software programs... you name it, HTTP ships it. 
2. HTTP also makes sure that its messages can be properly transported, identified, extracted, and processed. In particular, HTTP ensures that its cargo: 
    * Can be identified correctly (using `Content-Type` media formats and `Content-Language` headers) so browsers and other clients can process the content properly 
    * Can be unpacked properly (using `Content-Length` and `Content-Encoding` headers) 
    * Is fresh (using entity validators and cache-expiration controls) 
    * Meets the user’s needs (based on content-negotiation `Accept` headers) 
    * Moves quickly and efficiently through the network (using range requests, delta encoding, and other data compression) 
    * Arrives complete and untampered with (using transfer encoding headers and `Content-MD5` checksums)
3. To make all this happen, HTTP uses well-labeled entities to carry content. This chapter discusses entities, their associated entity headers, and how they work to transport web cargo. 
4. We’ll show how HTTP provides the essentials of content size, type, and encodings. We’ll also explain some of the more complicated and powerful features of HTTP entities, including range requests, delta encoding, digests, and chunked encodings.


## 章节顺序
1. Content-Length
2. Entity Digests
3. Media Type and Charset
4. Content Encoding
5. Transfer Encoding and Chunked Encoding
6. Validators and Freshness


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)