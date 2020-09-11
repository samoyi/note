# The Personal Touch


<!-- TOC -->

- [The Personal Touch](#the-personal-touch)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [HTTP 是匿名和无状态的](#http-是匿名和无状态的)
    - [个性化接触用户的需求](#个性化接触用户的需求)
        - [Personal greetings](#personal-greetings)
        - [Targeted recommendations](#targeted-recommendations)
        - [Administrative information on file](#administrative-information-on-file)
        - [Session tracking](#session-tracking)
    - [Mechanisms to identify users](#mechanisms-to-identify-users)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary

## HTTP 是匿名和无状态的
1. HTTP began its life as an anonymous, stateless, request/response protocol. 
2. A request came from a client, was processed by the server, and a response was sent back to the client. Little information was available to the web server to determine what user sent the request or to keep track of a sequence of requests from the visiting user.


## 个性化接触用户的需求
1. Modern web sites want to provide a personal touch. They want to know more about users on the other ends of the connections and be able to keep track of those users as they browse. 
2. Popular online shopping sites like Amazon.com personalize their sites for you in several ways:

### Personal greetings
Welcome messages and page contents are generated specially for the user, to make the shopping experience feel more personal.

### Targeted recommendations
By learning about the interests of the customer, stores can suggest products that they believe the customer will appreciate. Stores can also run birthday specials near customers’ birthdays and other significant days.

### Administrative information on file
Online shoppers hate having to fill in cumbersome address and credit card forms over and over again. Some sites store these administrative details in a database. Once they identify you, they can use the administrative information on file, making the shopping experience much more convenient.

### Session tracking
HTTP transactions are stateless. Each request/response happens in isolation. Many web sites want to build up incremental state as you interact with the site (for example, filling an online shopping cart). To do this, web sites need a way to distinguish HTTP transactions from different users.


## Mechanisms to identify users
1. This chapter summarizes a few of the techniques used to identify users in HTTP. HTTP itself was not born with a rich set of identification features. 
2. The early web-site designers (practical folks that they were) built their own technologies to identify users. Each technique has its strengths and weaknesses. In this chapter, we’ll discuss the following mechanisms to identify users:
    * HTTP headers that carry information about user identity
    * Client IP address tracking, to identify users by their IP addresses
    * User login, using authentication to identify users
    * Fat URLs, a technique for embedding identity in URLs
    * Cookies, a powerful but efficient technique for maintaining persistent identity


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)