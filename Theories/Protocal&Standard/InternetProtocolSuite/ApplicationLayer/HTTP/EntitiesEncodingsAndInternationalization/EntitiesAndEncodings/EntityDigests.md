# Entity Digests


<!-- TOC -->

- [Entity Digests](#entity-digests)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [摘要的必要性和局限性](#摘要的必要性和局限性)
    - [MD5](#md5)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## 摘要的必要性和局限性
1. Although HTTP typically is implemented over a reliable transport protocol such as TCP/IP, parts of messages may get modified in transit for a variety of reasons, such as noncompliant transcoding proxies or buggy intermediary proxies. 2. To detect unintended (or undesired) modification of entity body data, the sender can generate a checksum of the data when the initial entity is generated, and the receiver can sanity check the checksum to catch any unintended entity modification.
3. This method, of course, is not immune to a malicious attack that replaces both the message body and digest header. It is intended only to detect unintentional modification. Other facilities, such as digest authentication, are needed to provide safeguards against malicious tampering.


## MD5
1. The `Content-MD5` header is used by servers to send the result of running the MD5 algorithm on the entity body. 
2. Only the server where the response originates may compute and send the `Content-MD5` header. Intermediate proxies and caches may not modify or add the header—that would violate the whole purpose of verifying end-to-end integrity. 
3. The `Content-MD5` header contains the MD5 of the content after all content encodings have been applied to the entity body and before any transfer encodings have been applied to it. 
4. Clients seeking to verify the integrity of the message must first decode the transfer encodings, then compute the MD5 of the resulting unencoded entity body. As an example, if a document is compressed using the gzip algorithm, then sent with chunked encoding, the MD5 algorithm is run on the full gripped body.
5. 也就是说 MD5 的计算是在内容编码和传输编码之间：
    * 发送时，先进行内容编码，对内容编码后的结果计算 MD5，然后进行传输编码；
    * 接收时，先进行传输编码的解码，获得了经过内容编码的内容，再其进行 MD5 计算，然后才能进行内容编码解码来读取实际内容。
6. In addition to checking message integrity, the MD5 can be used as a key into a hash table to quickly locate documents and reduce duplicate storage of content. Despite these possible uses, the Content-MD5 header is not sent often.
7. Extensions to HTTP have proposed other digest algorithms in IETF drafts. These extensions have proposed a new header, `Want-Digest`, that allows clients to specify the type of digest they expect with the response. Quality values can be used to suggest multiple digest algorithms and indicate preference.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)