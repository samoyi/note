# Other Considerations


<!-- TOC -->

- [Other Considerations](#other-considerations)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [Headers and Out-of-Spec Data](#headers-and-out-of-spec-data)
    - [Dates](#dates)
    - [Domain Names](#domain-names)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary


## Headers and Out-of-Spec Data
1. HTTP headers must consist of characters from the US-ASCII character set. However, not all clients and servers implement this correctly, so you may on occasion receive illegal characters with code values larger than 127. 
2. Many HTTP applications use operating-system and library routines for processing characters (for example, the Unix ctype character classification library). Not all of these libraries support character codes outside of the ASCII range (0–127). 
3. In some circumstances (generally, with older implementations), these libraries may return improper results or crash the application when given non-ASCII characters. Carefully read the documentation for your character classification libraries before using them to process HTTP messages, in case the messages contain illegal data.


## Dates 
1. The HTTP specification clearly defines the legal GMT date formats, but be aware that not all web servers and clients follow the rules. For example, we have seen web servers send invalid HTTP `Date` headers with months expressed in local languages. 
2. HTTP applications should attempt to be tolerant of out-of-spec dates, and not crash on receipt, but they may not always be able to interpret all dates sent. If the date is not parseable, servers should treat it conservatively.


## Domain Names
DNS doesn’t currently support international characters in domain names. There are standards efforts under way to support multilingual domain names, but they have not yet been widely deployed.


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)