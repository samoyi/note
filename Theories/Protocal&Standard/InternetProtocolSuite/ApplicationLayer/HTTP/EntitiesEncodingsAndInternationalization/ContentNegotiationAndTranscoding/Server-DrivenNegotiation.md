# Server-Driven Negotiation


<!-- TOC -->

- [Server-Driven Negotiation](#server-driven-negotiation)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [Content-Negotiation Headers](#content-negotiation-headers)
    - [Content-Negotiation Header Quality Values](#content-negotiation-header-quality-values)
    - [Varying on Other Headers](#varying-on-other-headers)
    - [Content Negotiation on Apache](#content-negotiation-on-apache)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
1. Client-driven negotiation has several drawbacks, as discussed in the previous section. Most of these drawbacks center around the increased communication between the client and server to decide on the best page in response to a request. 
2. One way to reduce this extra communication is to let the server decide which page to send back—but to do this, the client must send enough information about its preferences to allow the server to make an informed decision. 
3. The server gets this information from the client’s request headers. There are two mechanisms that HTTP servers use to evaluate the proper response to send to a client:
    * Examining the set of content-negotiation headers. The server looks at the client’s Accept headers and tries to match them with corresponding response headers. 
    * Varying on other (non–content-negotiation) headers. For example, the server could send responses based on the client’s `User-Agent` header.
4. These two mechanisms are explained in more detail in the following sections.


## Content-Negotiation Headers
1. Clients may send their preference information using the set of HTTP headers listed in Table below
    Header | Description
    --|--
    `Accept` | Used to tell the server what media types are okay to send
    `Accept-Language` | Used to tell the server what languages are okay to send
    `Accept-Charset` | Used to tell the server what charsets are okay to send
    `Accept-Encoding` | Used to tell the server what encodings are okay to send
2. Notice how similar these headers are to the entity headers. However, there is a clear distinction between the purposes of the two types of headers. Entity headers are like shipping labels—they specify attributes of the message body that are necessary during the transfer of messages from the server to the client. Content-negotiation headers, on the other hand, are used by clients and servers to exchange preference information and to help choose between different versions of a document, so that the one most closely matching the client’s preferences is served. Servers match clients’ Accept headers with the corresponding entity headers, listed below
    Accept header | Entity header
    --|--
    Accept | Content-Type
    Accept-Language | Content-Language
    Accept-Charset | Content-Type
    Accept-Encoding | Content-Encoding
3. Note that because HTTP is a stateless protocol (meaning that servers do not keep track of client preferences across requests), clients must send their preference information with every request. 
4. If both clients sent `Accept-Language` header information specifying the language in which they were interested, the server could decide which copy of `www.joes-hardware.com` to send back to each client. Letting the server automatically pick which document to send back reduces the latency associated with the back-and-forth communication required by the client-driven model.


## Content-Negotiation Header Quality Values
1. However, say that one of the clients prefers Spanish. Which version of the page should the server send back? English or French? The server has just two choices: either guess, or fall back on the client-driven model and ask the client to choose. 
2. However, if the Spaniard happens to understand some English, he might choose the English page—it wouldn’t be ideal, but it would do. In this case, the Spaniard needs the ability to pass on more information about his preferences, conveying that he does have minimal knowledge of English and that, in a pinch, English will suffice. 
3. Fortunately, HTTP does provide a mechanism for letting clients like our Spaniard give richer descriptions of their preferences, using quality values (“q values” for short).
4. The HTTP protocol defines quality values to allow clients to list multiple choices for each category of preference and associate an order of preference with each choice. For example, clients can send an Accept-Language header of the form: 
    ```
    Accept-Language: en;q=0.5, fr;q=0.0, nl;q=1.0, tr;q=0.0
    ```
5. Where the `q` values can range from 0.0 to 1.0 (with 0.0 being the lowest preference and 1.0 being the highest). The header above, then, says that the client prefers to receive a Dutch (nl) version of the document, but an English (en) version will do. Under no circumstances does the client want a French (fr) or Turkish (tr) version, though. 
6. Note that the order in which the preferences are listed is not important; only the `q` values associated with them are.
7. Occasionally, the server may not have any documents that match any of the client’s preferences. In this case, the server may change or transcode the document to match the client’s preferences. This mechanism is discussed later in this chapter.   


## Varying on Other Headers
1. Servers also can attempt to match up responses with other client request headers, such as `User-Agent`. Servers may know that old versions of a browser do not support JavaScript, for example, and may therefore send back a version of the page that does not contain JavaScript. 
2. In this case, there is no q-value mechanism to look for approximate “best” matches. The server either looks for an exact match or simply serves whatever it has (depending on the implementation of the server). 
3. Because caches must attempt to serve correct “best” versions of cached documents, the HTTP protocol defines a `Vary` header that the server sends in responses; the `Vary` header tells caches (and clients, and any downstream proxies) which headers the server is using to determine the best version of the response to send. The `Vary` header is discussed in more detail later in this chapter.


## Content Negotiation on Apache


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)